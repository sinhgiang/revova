/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRecoveryEmail } from '@/lib/ai/email-generator'
import { sendRecoveryEmail } from '@/lib/email/resend'
import { sendSlackNotification } from '@/lib/slack'
import { DeclineCode } from '@/types'

// Decline codes where auto-retrying the charge is worth attempting
const RETRYABLE_CODES = new Set([
  'insufficient_funds',
  'processing_error',
  'generic_decline',
  'card_velocity_exceeded',
])

// Default days to wait after the PREVIOUS email
const DEFAULT_DAYS_AFTER_PREV: Record<number, number> = {
  2: 2,
  3: 4,
  4: 7,
  5: 7,
}

function getDaysAfterPrev(account: any, emailNum: number): number {
  if (account?.email_timing_days) {
    try {
      const timing: number[] = JSON.parse(account.email_timing_days)
      // timing[0] = days before email 2, timing[1] = before email 3, etc.
      const idx = emailNum - 2
      if (idx >= 0 && idx < timing.length && timing[idx] > 0) return timing[idx]
    } catch { /* fall through */ }
  }
  return DEFAULT_DAYS_AFTER_PREV[emailNum] ?? 7
}

export async function GET(request: NextRequest) {
  // Vercel automatically sends this header using CRON_SECRET env var
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any
  const now = new Date()

  // Fetch all active failed payments that still need follow-up (emails_sent 1–4)
  const { data: payments, error } = await db
    .from('failed_payments')
    .select('*')
    .not('status', 'in', '("recovered","cancelled","max_emails_reached")')
    .gte('emails_sent', 1)
    .lte('emails_sent', 4)
    .not('customer_email', 'is', null)

  if (error) {
    console.error('[Cron] DB query error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const payment of payments ?? []) {
    const nextEmailNum: number = payment.emails_sent + 1
    if (nextEmailNum < 2 || nextEmailNum > 5) { skipped++; continue }

    // Fetch account first — needed for timing, SMTP, blacklist, retry, Slack
    const { data: account } = await db
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', payment.user_id)
      .single()

    if (!account?.access_token) { skipped++; continue }

    // Custom or default timing
    const daysToWait = getDaysAfterPrev(account, nextEmailNum)

    // Check if enough time has passed since the last email
    const lastEmailAt = new Date(payment.last_email_at ?? payment.created_at)
    const hoursElapsed = (now.getTime() - lastEmailAt.getTime()) / (1000 * 60 * 60)

    if (hoursElapsed < daysToWait * 24) {
      skipped++
      continue
    }

    // Check blacklist
    const { data: blacklisted } = await db
      .from('email_blacklist')
      .select('id')
      .eq('user_id', payment.user_id)
      .eq('email', payment.customer_email.toLowerCase())
      .maybeSingle()

    if (blacklisted) { skipped++; continue }

    // Email 5 is Pro plan only — check subscription
    if (nextEmailNum === 5) {
      const { data: sub } = await db
        .from('subscriptions')
        .select('plan_id, status')
        .eq('user_id', payment.user_id)
        .single()

      if (!sub || sub.plan_id !== 'pro' || sub.status !== 'active') {
        await db
          .from('failed_payments')
          .update({ status: 'max_emails_reached' })
          .eq('id', payment.id)
        skipped++
        continue
      }
    }

    // Smart retry: attempt to charge again for retryable decline codes
    if (RETRYABLE_CODES.has(payment.decline_code)) {
      try {
        const stripe = new Stripe(account.access_token)
        await stripe.invoices.pay(payment.stripe_invoice_id)
        // Charge succeeded — mark recovered and notify Slack
        await db
          .from('failed_payments')
          .update({ status: 'recovered', recovered_at: now.toISOString() })
          .eq('id', payment.id)

        if (account.slack_webhook_url) {
          try {
            await sendSlackNotification(account.slack_webhook_url, {
              type: 'retry_success',
              customerEmail: payment.customer_email,
              customerName: payment.customer_name,
              amount: payment.amount,
              currency: payment.currency,
              businessName: account.business_name,
            })
          } catch { /* non-critical */ }
        }

        sent++ // count as a recovery action
        console.log(`[Cron] ✓ Auto-retry succeeded → ${payment.customer_email}`)
        continue // no email needed
      } catch {
        // Retry failed — fall through to send the follow-up email
      }
    }

    // Retrieve the hosted invoice URL from Stripe so customer can update card
    let updateCardUrl = '#'
    try {
      const stripe = new Stripe(account.access_token)
      const invoice = await stripe.invoices.retrieve(payment.stripe_invoice_id)
      updateCardUrl = invoice.hosted_invoice_url ?? '#'
    } catch (e) {
      console.error(`[Cron] Could not fetch invoice ${payment.stripe_invoice_id}:`, e)
    }

    // Generate AI email (Claude → Gemini → template fallback)
    try {
      const emailContent = await generateRecoveryEmail({
        customerName: payment.customer_name ?? 'there',
        customerEmail: payment.customer_email,
        businessName: account.business_name ?? 'Our Service',
        productName: 'your subscription',
        amount: payment.amount,
        currency: payment.currency,
        declineCode: payment.decline_code as DeclineCode,
        emailSequence: nextEmailNum,
        updateCardUrl,
        customNote: account.email_custom_note ?? undefined,
      })

      const smtp = account.smtp_host ? {
        host: account.smtp_host,
        port: account.smtp_port ?? 587,
        user: account.smtp_user,
        password: account.smtp_password,
        fromEmail: account.smtp_from_email,
        fromName: account.smtp_from_name ?? account.business_name ?? 'Revova',
      } : null

      await sendRecoveryEmail({
        to: payment.customer_email,
        subject: emailContent.subject,
        body: emailContent.body,
        previewText: emailContent.previewText,
        updateCardUrl,
        businessName: account.business_name ?? 'Our Service',
        smtp,
        tracking: {
          userId: payment.user_id,
          recipientEmail: payment.customer_email,
          sequence: nextEmailNum,
        },
      })

      // Update payment record
      await db
        .from('failed_payments')
        .update({
          emails_sent: nextEmailNum,
          last_email_at: now.toISOString(),
          status: 'email_sent',
        })
        .eq('id', payment.id)

      // Log the email
      await db.from('email_logs').insert({
        failed_payment_id: payment.id,
        user_id: payment.user_id,
        email_type: `sequence_${nextEmailNum}`,
        recipient_email: payment.customer_email,
        subject: emailContent.subject,
      })

      sent++
      console.log(`[Cron] ✓ Email #${nextEmailNum} → ${payment.customer_email}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`${payment.customer_email}: ${msg}`)
      console.error(`[Cron] ✗ Email #${nextEmailNum} → ${payment.customer_email}:`, msg)
    }
  }

  console.log(`[Cron] Done. sent=${sent} skipped=${skipped} errors=${errors.length}`)
  return NextResponse.json({
    ok: true,
    sent,
    skipped,
    errors,
    total: (payments ?? []).length,
  })
}
