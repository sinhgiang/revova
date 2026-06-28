/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { sendRecoveryEmail } from '@/lib/email/resend'

const DAYS_BEFORE = [7, 3, 1]

function getDaysDiff(unixTimestamp: number): number {
  const now = Date.now()
  const trialEnd = unixTimestamp * 1000
  return Math.round((trialEnd - now) / (1000 * 60 * 60 * 24))
}

function buildTrialEmail(params: {
  customerName: string
  businessName: string
  daysLeft: number
  updateCardUrl: string
}): { subject: string; previewText: string; body: string } {
  const { customerName, businessName, daysLeft, updateCardUrl } = params
  const name = customerName || 'there'

  if (daysLeft >= 6) {
    return {
      subject: `Your ${businessName} trial ends in ${daysLeft} days`,
      previewText: `Make the most of your remaining trial time.`,
      body: `Hi ${name},

Just a heads-up — your free trial of ${businessName} ends in ${daysLeft} days.

We hope you've had a chance to explore everything. If you have any questions or need help getting started, just reply to this email.

To keep your access going without interruption, add your payment details here:
${updateCardUrl}

Thanks for trying ${businessName}. We'd love to have you stay.

Best,
The ${businessName} Team`,
    }
  }

  if (daysLeft >= 2) {
    return {
      subject: `${daysLeft} days left in your ${businessName} trial`,
      previewText: `Your trial is ending soon — don't lose access.`,
      body: `Hi ${name},

Your free trial of ${businessName} ends in ${daysLeft} days.

To make sure you don't lose access to your account, add your payment details now:
${updateCardUrl}

If there's anything we can help with before your trial ends, just reply — we're happy to help.

Best,
The ${businessName} Team`,
    }
  }

  return {
    subject: `Last day of your ${businessName} trial`,
    previewText: `Your trial ends today — add payment to keep access.`,
    body: `Hi ${name},

Your ${businessName} trial ends today.

If you'd like to keep your account active, please add your payment details before midnight:
${updateCardUrl}

We hope you've enjoyed the trial. If you have any last-minute questions, just hit reply.

Best,
The ${businessName} Team`,
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  // Select ALL columns so SMTP config is available
  const { data: accounts } = await db.from('stripe_accounts').select('*')
  if (!accounts?.length) return NextResponse.json({ ok: true, sent: 0 })

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const account of accounts) {
    if (!account.access_token) continue

    let subscriptions
    try {
      const stripe = new Stripe(account.access_token)
      // autoPagingToArray fetches ALL trialing subs across pages, not just 100
      subscriptions = await stripe.subscriptions.list({
        status: 'trialing',
        limit: 100,
        expand: ['data.customer'],
      }).autoPagingToArray({ limit: 10000 })
    } catch (e) {
      errors.push(`${account.user_id}: ${String(e)}`)
      continue
    }

    for (const sub of subscriptions) {
      if (!sub.trial_end) continue
      const daysLeft = getDaysDiff(sub.trial_end)
      if (!DAYS_BEFORE.includes(daysLeft)) continue

      const emailType = `trial_${daysLeft}`
      const customer = sub.customer as Stripe.Customer
      const customerEmail = typeof customer === 'string' ? null : customer.email
      const customerName = typeof customer === 'string' ? null : customer.name

      if (!customerEmail) continue

      // Blacklist check
      const { data: blacklisted } = await db
        .from('email_blacklist')
        .select('id')
        .eq('user_id', account.user_id)
        .eq('email', customerEmail.toLowerCase())
        .maybeSingle()
      if (blacklisted) { skipped++; continue }

      // Dedup: don't send same email type to same address this week
      // Use created_at (not sent_at which doesn't exist)
      const weekAgo = new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
      const { data: existing } = await db
        .from('email_logs')
        .select('id')
        .eq('user_id', account.user_id)
        .eq('email_type', emailType)
        .eq('recipient_email', customerEmail)
        .gte('created_at', weekAgo)
        .maybeSingle()

      if (existing) { skipped++; continue }

      // Build portal URL for card update
      let updateCardUrl = '#'
      try {
        const stripe = new Stripe(account.access_token)
        const portal = await stripe.billingPortal.sessions.create({
          customer: typeof customer === 'string' ? customer : customer.id,
          return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'}`,
        })
        updateCardUrl = portal.url
      } catch { /* keep '#' */ }

      const email = buildTrialEmail({
        customerName: customerName ?? '',
        businessName: account.business_name ?? 'Our Service',
        daysLeft,
        updateCardUrl,
      })

      // Build SMTP config if merchant has custom SMTP
      const smtp = account.smtp_host ? {
        host: account.smtp_host,
        port: account.smtp_port ?? 587,
        user: account.smtp_user,
        password: account.smtp_password,
        fromEmail: account.smtp_from_email,
        fromName: account.smtp_from_name ?? account.business_name ?? 'Revova',
      } : null

      try {
        await sendRecoveryEmail({
          to: customerEmail,
          subject: email.subject,
          body: email.body,
          previewText: email.previewText,
          updateCardUrl,
          businessName: account.business_name ?? 'Our Service',
          smtp,
          tracking: {
            userId: account.user_id,
            recipientEmail: customerEmail,
            sequence: daysLeft === 7 ? 71 : daysLeft === 3 ? 73 : 72, // unique sequence codes for trial emails (7/3/1-day)
          },
        })

        try {
          await db.from('email_logs').insert({
            user_id: account.user_id,
            email_type: emailType,
            recipient_email: customerEmail,
            subject: email.subject,
          })
        } catch { /* non-critical */ }

        sent++
        console.log(`[Trial] ✓ ${emailType} → ${customerEmail}`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        errors.push(`${customerEmail}: ${msg}`)
      }
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, errors })
}
