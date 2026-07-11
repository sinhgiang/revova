/* eslint-disable @typescript-eslint/no-explicit-any */
// Processor-agnostic recovery core. Both new processor webhooks call into this.
// It deliberately does NOT touch the Stripe webhook route — Stripe keeps its own
// inline logic so it can never be affected by changes here.

import { generateRecoveryEmail } from '@/lib/ai/email-generator'
import { sendRecoveryEmail } from '@/lib/email/resend'
import { sendSlackNotification } from '@/lib/slack'
import { sendTelegramNotification } from '@/lib/telegram'
import { sendMerchantRecoveryNotification } from '@/lib/email/notifications'
import { resolvePlan, monthlyRecoveryCount } from '@/lib/plan'
import { DeclineCode } from '@/types'
import type { NormalizedEvent, ProcessorId } from '@/lib/processors/types'

function smtpFrom(account: any) {
  return account.smtp_host ? {
    host: account.smtp_host,
    port: account.smtp_port ?? 587,
    user: account.smtp_user,
    password: account.smtp_password,
    fromEmail: account.smtp_from_email,
    fromName: account.smtp_from_name ?? account.business_name ?? 'Revova',
  } : null
}

// A failed payment came in from a non-Stripe processor: record it and send email #1.
export async function enrollFailedPayment(
  db: any,
  userId: string,
  processor: ProcessorId,
  account: any,
  ev: NormalizedEvent
) {
  if (!ev.customerEmail) {
    console.warn(`[${processor}] No customer email — skipping`)
    return
  }

  // Optional holdout control (opt-in via REVOVA_HOLDOUT_PCT) — see the Stripe
  // webhook + 20260711_holdout.sql. Off by default; the column is only written
  // when enabled, so this changes nothing until you add the column + set the env.
  const holdoutPct = Number(process.env.REVOVA_HOLDOUT_PCT ?? 0)
  const isHoldout = holdoutPct > 0 && Math.floor(Math.random() * 100) < holdoutPct

  // De-dupe on (user_id, invoice id) without depending on a DB unique constraint:
  // if we've already recorded this failure, don't send email #1 again.
  const { data: existing } = await db
    .from('failed_payments')
    .select('id, emails_sent')
    .eq('user_id', userId)
    .eq('stripe_invoice_id', ev.invoiceId)
    .maybeSingle()

  if (existing) {
    console.log(`[${processor}] Failure already recorded for invoice ${ev.invoiceId} — skipping duplicate`)
    return
  }

  const { data: payment, error } = await db
    .from('failed_payments')
    .insert({
      user_id: userId,
      processor,
      stripe_account_id: account.stripe_account_id ?? null,
      stripe_invoice_id: ev.invoiceId,           // reused as the processor's invoice/txn id
      stripe_customer_id: ev.customerId ?? null,
      customer_email: ev.customerEmail,
      customer_name: ev.customerName ?? null,
      customer_phone: ev.customerPhone ?? null,
      amount: ev.amount ?? 0,
      currency: ev.currency ?? 'usd',
      decline_code: ev.declineCode ?? 'generic_decline',
      status: 'pending',
      emails_sent: 0,
      update_card_url: ev.updateCardUrl ?? null,
      ...(holdoutPct > 0 ? { holdout: isHoldout } : {}),
    })
    .select()
    .single()

  if (error || !payment) {
    console.error(`[${processor}] DB insert error:`, error)
    return
  }

  // Blacklist check
  const { data: blacklisted } = await db
    .from('email_blacklist')
    .select('id')
    .eq('user_id', userId)
    .eq('email', ev.customerEmail.toLowerCase())
    .maybeSingle()
  if (blacklisted) {
    console.log(`[${processor}] Blacklisted — skipping ${ev.customerEmail}`)
    return
  }

  // Starter/trial monthly recovery cap (Pro = unlimited). Payment is already
  // recorded above; we only skip the email when the cap is exceeded.
  const { data: planSub } = await db.from('subscriptions').select('plan_id, status').eq('user_id', userId).maybeSingle()
  const planStatus = resolvePlan(account, planSub)
  if (!planStatus.isPro && planStatus.recoveryLimit != null) {
    const used = await monthlyRecoveryCount(db, userId)
    if (used > planStatus.recoveryLimit) {
      console.log(`[${processor}] Monthly recovery cap reached — recorded, not emailing`)
      return
    }
  }

  // Holdout control: recorded, but intentionally not emailed — its natural
  // recovery is the baseline Analytics measures incremental lift against.
  if (isHoldout) {
    console.log(`[${processor}] Holdout control — recorded, not emailing`)
    return
  }

  const updateUrl = ev.updateCardUrl ?? '#'

  try {
    const emailContent = await generateRecoveryEmail({
      customerName: ev.customerName ?? 'there',
      customerEmail: ev.customerEmail,
      businessName: account.business_name ?? 'Our Service',
      productName: 'your subscription',
      amount: payment.amount,
      currency: payment.currency,
      declineCode: (ev.declineCode ?? 'generic_decline') as DeclineCode,
      emailSequence: 1,
      updateCardUrl: updateUrl,
      language: account.email_language ?? 'en',
      customNote: account.email_custom_note ?? undefined,
    })

    await sendRecoveryEmail({
      to: ev.customerEmail,
      subject: emailContent.subject,
      body: emailContent.body,
      previewText: emailContent.previewText,
      updateCardUrl: updateUrl,
      businessName: account.business_name ?? 'Our Service',
      smtp: smtpFrom(account),
      tracking: { userId, recipientEmail: ev.customerEmail, sequence: 1 },
    })

    await db.from('failed_payments')
      .update({ status: 'email_sent', emails_sent: 1, last_email_at: new Date().toISOString() })
      .eq('id', payment.id)

    await db.from('email_logs').insert({
      failed_payment_id: payment.id,
      user_id: userId,
      email_type: 'sequence_1',
      recipient_email: ev.customerEmail,
      subject: emailContent.subject,
    })
    console.log(`[${processor}] ✓ Email #1 → ${ev.customerEmail}`)
  } catch (e) {
    console.error(`[${processor}] Email pipeline error:`, e instanceof Error ? e.message : e)
  }
}

// A previously-failed payment recovered: mark it and fire merchant notifications.
export async function handleProcessorRecovered(
  db: any,
  userId: string,
  account: any,
  ev: NormalizedEvent
) {
  if (!ev.invoiceId) return
  const { data: recovered } = await db
    .from('failed_payments')
    .update({ status: 'recovered', recovered_at: new Date().toISOString() })
    .eq('stripe_invoice_id', ev.invoiceId)
    .eq('user_id', userId)
    .select('customer_email, customer_name, amount, currency')
    .maybeSingle()
  if (!recovered) return

  if (account.slack_webhook_url) {
    try {
      await sendSlackNotification(account.slack_webhook_url, {
        type: 'recovered',
        customerEmail: recovered.customer_email,
        customerName: recovered.customer_name,
        amount: recovered.amount,
        currency: recovered.currency,
        businessName: account.business_name,
      })
    } catch { /* non-critical */ }
  }
  if (account.telegram_bot_token && account.telegram_chat_id) {
    try {
      await sendTelegramNotification(account.telegram_bot_token, account.telegram_chat_id, {
        type: 'recovered',
        customerEmail: recovered.customer_email,
        customerName: recovered.customer_name,
        amount: recovered.amount,
        currency: recovered.currency,
        businessName: account.business_name,
      })
    } catch { /* non-critical */ }
  }
  if (account.notify_on_recovery !== false && account.email) {
    try {
      await sendMerchantRecoveryNotification({
        merchantEmail: account.email,
        businessName: account.business_name ?? 'Your Business',
        customerEmail: recovered.customer_email,
        customerName: recovered.customer_name ?? null,
        amount: recovered.amount,
        currency: recovered.currency,
      })
    } catch { /* non-critical */ }
  }
}

// A subscription was cancelled: enroll into the winback campaign if enabled.
export async function handleProcessorCancelled(
  db: any,
  userId: string,
  processor: ProcessorId,
  account: any,
  ev: NormalizedEvent
) {
  if (!account.winback_enabled || !ev.customerEmail) return
  await db.from('winback_contacts').upsert({
    user_id: userId,
    processor,
    customer_email: ev.customerEmail,
    customer_name: ev.customerName ?? null,
    stripe_customer_id: ev.customerId ?? null,
    cancelled_at: new Date().toISOString(),
    status: 'active',
    emails_sent: 0,
  }, { onConflict: 'user_id,customer_email' })
}
