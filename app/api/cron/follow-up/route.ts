/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRecoveryEmail, getDeclineSeverity } from '@/lib/ai/email-generator'
import { sendRecoveryEmail } from '@/lib/email/resend'
import { sendSlackNotification } from '@/lib/slack'
import { sendTelegramNotification } from '@/lib/telegram'
import { sendMerchantRecoveryNotification } from '@/lib/email/notifications'
import { sendSMS, buildRecoverySms } from '@/lib/sms/twilio'
import { resolvePlan, monthlyRecoveryCount, STARTER_MONTHLY_RECOVERY_LIMIT } from '@/lib/plan'
import { isAuthorizedCron } from '@/lib/cron-auth'
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

// Hard decline: max 3 emails, faster cadence
const HARD_DAYS_AFTER_PREV: Record<number, number> = {
  2: 1,
  3: 3,
}

// How long to keep attempting recovery (charge retries) after the first failure.
// Mirrors the "retry for up to a full month" behavior of leading dunning tools.
const DEFAULT_RECOVERY_WINDOW_DAYS = 30

// SMS is an escalation channel: fire once after the customer has ignored this
// many emails. SMS open rates (~98%) far exceed email, so this is a high-value nudge.
const SMS_AFTER_EMAILS = 3

// Smart retry timing: when a merchant opts in, concentrate charge retries on the
// days a customer's bank balance is most likely to have refilled — the start of
// the month and mid-month paydays — instead of retrying blindly every day.
function isPaydayWindow(now: Date): boolean {
  const d = now.getDate()
  return (d >= 1 && d <= 5) || (d >= 15 && d <= 20) || d >= 28
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
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any
  const now = new Date()
  const DAY_MS = 1000 * 60 * 60 * 24

  // Fire all the side-effects that follow a successful recovery (Slack, webhook,
  // merchant email). Shared by the daily auto-retry path.
  async function handleRecoverySuccess(payment: any, account: any) {
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

    if (account.telegram_bot_token && account.telegram_chat_id) {
      try {
        await sendTelegramNotification(account.telegram_bot_token, account.telegram_chat_id, {
          type: 'retry_success',
          customerEmail: payment.customer_email,
          customerName: payment.customer_name,
          amount: payment.amount,
          currency: payment.currency,
          businessName: account.business_name,
        })
      } catch { /* non-critical */ }
    }

    if (account.outbound_webhook_url) {
      try {
        await fetch(account.outbound_webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Revova-Event': 'payment.recovered' },
          body: JSON.stringify({
            event: 'payment.recovered',
            data: {
              customerEmail: payment.customer_email,
              customerName: payment.customer_name,
              amount: payment.amount,
              currency: payment.currency,
              businessName: account.business_name,
              recoveredAt: now.toISOString(),
            },
          }),
          signal: AbortSignal.timeout(8000),
        })
      } catch { /* non-critical */ }
    }

    if (account.notify_on_recovery !== false && account.email) {
      try {
        await sendMerchantRecoveryNotification({
          merchantEmail: account.email,
          businessName: account.business_name ?? 'Your Business',
          customerEmail: payment.customer_email,
          customerName: payment.customer_name ?? null,
          amount: payment.amount,
          currency: payment.currency,
        })
      } catch { /* non-critical */ }
    }
  }

  // Fetch all unresolved failed payments. We include max_emails_reached so the
  // daily charge-retry keeps running through the full recovery window even after
  // the email sequence has finished.
  const { data: payments, error } = await db
    .from('failed_payments')
    .select('*')
    .not('status', 'in', '("recovered","cancelled")')
    .gte('emails_sent', 1)
    .not('customer_email', 'is', null)

  if (error) {
    console.error('[Cron] DB query error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  let sent = 0
  let recovered = 0
  let skipped = 0
  const errors: string[] = []

  for (const payment of payments ?? []) {
    // Fetch account first — needed for timing, SMTP, blacklist, retry, Slack, SMS
    const { data: account } = await db
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', payment.user_id)
      .single()

    if (!account) { skipped++; continue }
    // Stripe payments need the Stripe token (for retry + invoice URL). Non-Stripe
    // processors (Paddle etc.) run the full email sequence WITHOUT a Stripe token.
    if ((payment.processor ?? 'stripe') === 'stripe' && !account.access_token) { skipped++; continue }

    // Resolve the merchant's plan (gates Pro automations + the Starter monthly cap)
    const { data: subRow } = await db.from('subscriptions').select('plan_id, status').eq('user_id', payment.user_id).maybeSingle()
    const plan = resolvePlan(account, subRow)
    // Starter/trial: stop recovering once they hit the monthly cap (Pro = unlimited)
    if (!plan.isPro && plan.recoveryLimit != null) {
      const used = await monthlyRecoveryCount(db, payment.user_id)
      if (used > plan.recoveryLimit) { skipped++; continue }
    }

    // Recovery window: stop all attempts once the payment is older than the window.
    const windowDays = account.recovery_window_days ?? DEFAULT_RECOVERY_WINDOW_DAYS
    const ageDays = (now.getTime() - new Date(payment.created_at).getTime()) / DAY_MS
    if (ageDays > windowDays) {
      if (payment.status !== 'max_emails_reached') {
        await db.from('failed_payments').update({ status: 'max_emails_reached' }).eq('id', payment.id)
      }
      skipped++
      continue
    }

    // ── SMART / DAILY RETRY ──
    // Attempt to re-charge retryable declines within the window, independent of
    // email timing. When smart_retry_enabled, only fire on high-probability days
    // (payday windows) to avoid burning attempts when banks are likely to decline.
    // Only Stripe payments are retried by us — other processors (e.g. Paddle, a
    // Merchant of Record) run their own dunning, and we don't hold their charge API.
    const isStripe = (payment.processor ?? 'stripe') === 'stripe'
    const smartRetry = !!account.smart_retry_enabled
    const retryToday = !smartRetry || isPaydayWindow(now)
    if (isStripe && retryToday && RETRYABLE_CODES.has(payment.decline_code)) {
      try {
        const stripe = new Stripe(account.access_token)
        await stripe.invoices.pay(payment.stripe_invoice_id)
        await handleRecoverySuccess(payment, account)
        recovered++
        console.log(`[Cron] ✓ Auto-retry succeeded → ${payment.customer_email}`)
        continue // recovered — no email needed
      } catch {
        // Retry failed — fall through to the email sequence
      }
    }

    // Payments that have exhausted their email sequence are retry-only from here.
    if (payment.status === 'max_emails_reached') { skipped++; continue }

    const nextEmailNum: number = payment.emails_sent + 1
    if (nextEmailNum < 2 || nextEmailNum > 5) { skipped++; continue }

    // Hard vs. soft decline routing is a Pro feature — non-Pro use the standard
    // (soft) cadence for every decline type.
    const severity = plan.isPro ? getDeclineSeverity(payment.decline_code) : 'soft'
    if (severity === 'hard' && nextEmailNum > 3) {
      await db.from('failed_payments').update({ status: 'max_emails_reached' }).eq('id', payment.id)
      skipped++
      continue
    }

    // Custom or default timing (hard declines use faster schedule, skip custom timing)
    const daysToWait = severity === 'hard'
      ? (HARD_DAYS_AFTER_PREV[nextEmailNum] ?? 3)
      : getDaysAfterPrev(account, nextEmailNum)

    // Check if enough time has passed since the last email
    const lastEmailAt = new Date(payment.last_email_at ?? payment.created_at)
    const hoursElapsed = (now.getTime() - lastEmailAt.getTime()) / (1000 * 60 * 60)
    if (hoursElapsed < daysToWait * 24) { skipped++; continue }

    // Check blacklist
    const { data: blacklisted } = await db
      .from('email_blacklist')
      .select('id')
      .eq('user_id', payment.user_id)
      .eq('email', payment.customer_email.toLowerCase())
      .maybeSingle()
    if (blacklisted) { skipped++; continue }

    // Email 5 (the 5-email sequence) is Pro plan only — uses the plan resolved above
    if (nextEmailNum === 5 && !plan.isPro) {
      await db.from('failed_payments').update({ status: 'max_emails_reached' }).eq('id', payment.id)
      skipped++
      continue
    }

    // The card-update URL. Non-Stripe processors stored it up front; Stripe we
    // fetch live from the hosted invoice.
    let updateCardUrl = payment.update_card_url ?? '#'
    let alreadyPaid = false
    if (isStripe) {
      try {
        const stripe = new Stripe(account.access_token)
        const invoice = await stripe.invoices.retrieve(payment.stripe_invoice_id)
        // Detect a customer who already paid — either by updating their card on
        // the hosted invoice page or paying it directly. Also catches self-service
        // recoveries that don't come through our failure webhook.
        alreadyPaid = invoice.status === 'paid'
        updateCardUrl = invoice.hosted_invoice_url ?? '#'
      } catch (e) {
        console.error(`[Cron] Could not fetch invoice ${payment.stripe_invoice_id}:`, e)
      }
    }

    // Never send a dunning email to someone who has already paid — stop the
    // whole sequence the moment we detect the payment succeeded.
    if (alreadyPaid) {
      await handleRecoverySuccess(payment, account)
      recovered++
      console.log(`[Cron] ✓ Already paid (self-service) → ${payment.customer_email}, sequence stopped`)
      continue
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
        language: account.email_language ?? 'en',
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

      // SMS escalation: after the customer has ignored SMS_AFTER_EMAILS emails,
      // fire a single SMS nudge (if the merchant enabled Twilio and we have a phone).
      if (
        plan.isPro &&
        account.sms_enabled &&
        account.twilio_account_sid &&
        account.twilio_auth_token &&
        account.twilio_from_number &&
        payment.customer_phone &&
        !payment.sms_sent &&
        nextEmailNum >= SMS_AFTER_EMAILS + 1
      ) {
        try {
          const smsBody = buildRecoverySms({
            businessName: account.business_name ?? 'Our Service',
            amount: payment.amount,
            currency: payment.currency,
            updateUrl: updateCardUrl,
          })
          const smsResult = await sendSMS(
            {
              accountSid: account.twilio_account_sid,
              authToken: account.twilio_auth_token,
              fromNumber: account.twilio_from_number,
            },
            payment.customer_phone,
            smsBody
          )
          if (smsResult.ok) {
            await db.from('failed_payments').update({ sms_sent: true }).eq('id', payment.id)
            await db.from('email_logs').insert({
              failed_payment_id: payment.id,
              user_id: payment.user_id,
              email_type: `sms_${nextEmailNum}`,
              recipient_email: payment.customer_phone,
              subject: 'SMS nudge',
            })
            console.log(`[Cron] ✓ SMS nudge → ${payment.customer_phone}`)
          } else {
            console.warn(`[Cron] SMS failed → ${payment.customer_phone}: ${smsResult.error}`)
          }
        } catch (smsErr) {
          console.warn('[Cron] SMS error:', smsErr instanceof Error ? smsErr.message : smsErr)
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`${payment.customer_email}: ${msg}`)
      console.error(`[Cron] ✗ Email #${nextEmailNum} → ${payment.customer_email}:`, msg)
    }
  }

  console.log(`[Cron] Done. sent=${sent} recovered=${recovered} skipped=${skipped} errors=${errors.length}`)
  return NextResponse.json({
    ok: true,
    sent,
    recovered,
    skipped,
    errors,
    total: (payments ?? []).length,
  })
}
