/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { sendRecoveryEmail } from '@/lib/email/resend'
import { generatePredunningEmail } from '@/lib/ai/email-generator'

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

  const { data: accounts } = await db
    .from('stripe_accounts')
    .select('*')
    .not('access_token', 'is', null)

  let sent = 0
  let skipped = 0
  let tracked = 0
  const errors: string[] = []
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

  for (const account of accounts ?? []) {
    // Pre-dunning is opt-in per merchant
    if (account.predunning_enabled === false) { skipped++; continue }

    try {
      const stripe = new Stripe(account.access_token)

      // for-await auto-paginates through ALL active subscriptions, not just the first 100
      for await (const sub of stripe.subscriptions.list({
        status: 'active',
        limit: 100,
        expand: ['data.default_payment_method', 'data.customer'],
      })) {
        const pm = sub.default_payment_method as Stripe.PaymentMethod | null
        const card = pm?.card
        if (!card) { skipped++; continue }

        const { exp_month, exp_year, last4 } = card
        const expiringThisMonth = exp_month === currentMonth && exp_year === currentYear
        const expiringNextMonth = exp_month === nextMonth && exp_year === nextYear
        if (!expiringThisMonth && !expiringNextMonth) { skipped++; continue }

        const customer = sub.customer as Stripe.Customer
        const email = customer.email
        if (!email) { skipped++; continue }

        // Track this expiring card for the "Customers In Danger" dashboard panel.
        // Upsert so re-runs don't create duplicates.
        try {
          await db.from('expiring_cards').upsert({
            user_id: account.user_id,
            customer_email: email,
            customer_name: customer.name ?? null,
            stripe_customer_id: customer.id,
            last4: last4 ?? null,
            exp_month,
            exp_year,
            updated_at: now.toISOString(),
          }, { onConflict: 'user_id,stripe_customer_id' })
          tracked++
        } catch { /* non-critical */ }

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
        const businessName = account.business_name ?? 'Our Service'
        const portalUrl = `${appUrl}/api/widget/${account.user_id}/billing?customer=${customer.id}`

        // AI-generated proactive email (Claude → Gemini → static fallback)
        const emailContent = await generatePredunningEmail({
          customerName: customer.name ?? 'there',
          businessName,
          productName: 'your subscription',
          expMonthName,
          expYear: exp_year,
          updateCardUrl: portalUrl,
          language: account.email_language ?? 'en',
          customNote: account.email_custom_note ?? undefined,
        })

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
          subject: emailContent.subject,
          body: emailContent.body,
          previewText: emailContent.previewText,
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
            subject: emailContent.subject,
          })
        } catch { /* non-critical if failed_payment_id is required */ }

        // Mark the tracked card as notified
        try {
          await db.from('expiring_cards')
            .update({ notified_at: now.toISOString() })
            .eq('user_id', account.user_id)
            .eq('stripe_customer_id', customer.id)
        } catch { /* non-critical */ }

        sent++
        console.log(`[Pre-dunning] ✓ Sent to ${email} (expires ${expMonthName} ${exp_year})`)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`user ${account.user_id}: ${msg}`)
      console.error(`[Pre-dunning] Error for ${account.user_id}:`, e)
    }
  }

  console.log(`[Pre-dunning] Done. sent=${sent} tracked=${tracked} skipped=${skipped} errors=${errors.length}`)
  return NextResponse.json({ ok: true, sent, tracked, skipped, errors })
}
