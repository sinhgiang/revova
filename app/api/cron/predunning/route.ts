/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { sendRecoveryEmail } from '@/lib/email/resend'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear

  // Select ALL columns so we have SMTP, outbound webhook, etc.
  const { data: accounts } = await db
    .from('stripe_accounts')
    .select('*')
    .not('access_token', 'is', null)

  let sent = 0
  let skipped = 0
  const errors: string[] = []
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

  for (const account of accounts ?? []) {
    try {
      const stripe = new Stripe(account.access_token)

      const subs = await stripe.subscriptions.list({
        status: 'active',
        limit: 100,
        expand: ['data.default_payment_method', 'data.customer'],
      })

      for (const sub of subs.data) {
        const pm = sub.default_payment_method as Stripe.PaymentMethod | null
        const card = pm?.card
        if (!card) { skipped++; continue }

        const { exp_month, exp_year } = card
        const expiringThisMonth = exp_month === currentMonth && exp_year === currentYear
        const expiringNextMonth = exp_month === nextMonth && exp_year === nextYear
        if (!expiringThisMonth && !expiringNextMonth) { skipped++; continue }

        const customer = sub.customer as Stripe.Customer
        const email = customer.email
        if (!email) { skipped++; continue }

        // Blacklist check
        const { data: blacklisted } = await db
          .from('email_blacklist')
          .select('id')
          .eq('user_id', account.user_id)
          .eq('email', email.toLowerCase())
          .maybeSingle()
        if (blacklisted) { skipped++; continue }

        // Dedup: already sent pre-dunning this month?
        const monthStart = new Date(currentYear, currentMonth - 1, 1).toISOString()
        const { data: already } = await db
          .from('email_logs')
          .select('id')
          .eq('user_id', account.user_id)
          .eq('recipient_email', email)
          .eq('email_type', 'predunning')
          .gte('created_at', monthStart)
          .limit(1)
          .maybeSingle()
        if (already) { skipped++; continue }

        const expMonthName = new Date(exp_year, exp_month - 1).toLocaleString('default', { month: 'long' })
        const firstName = customer.name ? customer.name.split(' ')[0] : null
        const businessName = account.business_name ?? 'Our Service'
        const portalUrl = `${appUrl}/api/widget/${account.user_id}/billing?customer=${customer.id}`

        const subject = `Your card expires in ${expMonthName} — update to avoid interruption`
        const body = `Hi${firstName ? ` ${firstName}` : ''},

Quick heads-up: the card on your ${businessName} account expires in ${expMonthName} ${exp_year}.

To make sure your subscription continues without any disruption, please update your payment method before it expires.

It only takes a moment — click the button below to update your card now.

Thanks for being a customer!`

        // Build SMTP config if merchant has custom SMTP
        const smtp = account.smtp_host ? {
          host: account.smtp_host,
          port: account.smtp_port ?? 587,
          user: account.smtp_user,
          password: account.smtp_password,
          fromEmail: account.smtp_from_email,
          fromName: account.smtp_from_name ?? businessName,
        } : null

        await sendRecoveryEmail({
          to: email,
          subject,
          body,
          previewText: `Your card expires in ${expMonthName} — update now to stay connected`,
          updateCardUrl: portalUrl,
          businessName,
          smtp,
          tracking: {
            userId: account.user_id,
            recipientEmail: email,
            sequence: 0, // 0 = predunning (not a recovery sequence step)
          },
        })

        try {
          await db.from('email_logs').insert({
            user_id: account.user_id,
            email_type: 'predunning',
            recipient_email: email,
            subject,
          })
        } catch { /* non-critical if failed_payment_id is required */ }

        sent++
        console.log(`[Pre-dunning] ✓ Sent to ${email} (expires ${expMonthName} ${exp_year})`)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`user ${account.user_id}: ${msg}`)
      console.error(`[Pre-dunning] Error for ${account.user_id}:`, e)
    }
  }

  console.log(`[Pre-dunning] Done. sent=${sent} skipped=${skipped} errors=${errors.length}`)
  return NextResponse.json({ ok: true, sent, skipped, errors })
}
