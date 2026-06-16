/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRecoveryEmail } from '@/lib/ai/email-generator'
import { sendRecoveryEmail } from '@/lib/email/resend'
import { sendSlackNotification } from '@/lib/slack'
import { DeclineCode } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const body = await request.text()

  const supabase = await createAdminClient()
  const db = supabase as any

  const { data: accountData } = await db
    .from('stripe_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!accountData) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  let event: Stripe.Event

  if (accountData.webhook_secret) {
    // Verify signature with user's webhook secret
    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
    const stripeClient = new Stripe(accountData.access_token)
    try {
      event = stripeClient.webhooks.constructEvent(body, signature, accountData.webhook_secret)
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } else {
    // No secret stored yet — trust the UUID in the URL (128-bit entropy)
    try {
      event = JSON.parse(body) as Stripe.Event
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const chargeObj = (invoice as any).charge as Stripe.Charge | null
    const declineCode = (chargeObj?.failure_code ?? 'generic_decline') as DeclineCode

    // Fetch customer email/name from Stripe if not in invoice (common with test events)
    let customerEmail = invoice.customer_email ?? ''
    let customerName: string | null = (invoice.customer_name as string) ?? null
    if ((!customerEmail || !customerName) && invoice.customer) {
      try {
        const stripeClient = new Stripe(accountData.access_token)
        const customer = await stripeClient.customers.retrieve(invoice.customer as string)
        if (customer && !customer.deleted) {
          if (!customerEmail) customerEmail = (customer as Stripe.Customer).email ?? ''
          if (!customerName) customerName = (customer as Stripe.Customer).name ?? null
        }
      } catch (e) {
        console.error('Could not fetch customer:', e)
      }
    }

    const { data: payment, error } = await db
      .from('failed_payments')
      .upsert({
        user_id: userId,
        stripe_account_id: accountData.stripe_account_id,
        stripe_invoice_id: invoice.id,
        customer_email: customerEmail,
        customer_name: customerName,
        amount: invoice.amount_due,
        currency: invoice.currency,
        decline_code: declineCode,
        status: 'pending',
        stripe_customer_id: invoice.customer as string,
        country: null,
        emails_sent: 0,
      })
      .select()
      .single()

    if (error || !payment) {
      console.error('DB upsert error:', error)
      return NextResponse.json({ received: true })
    }

    // In dev, Stripe CLI fixtures have no customer email — use fallback to test pipeline
    if (!payment.customer_email && process.env.NODE_ENV === 'development') {
      await db.from('failed_payments').update({ customer_email: process.env.TEST_EMAIL_FALLBACK ?? 'test@revova.io' }).eq('id', payment.id)
      payment.customer_email = process.env.TEST_EMAIL_FALLBACK ?? 'test@revova.io'
    }

    console.log('[Webhook] Customer email:', payment.customer_email, '| Name:', payment.customer_name)

    if (!payment.customer_email) {
      console.error('[Webhook] No customer email — skipping email send')
      return NextResponse.json({ received: true })
    }

    // Check blacklist
    const { data: isBlacklisted } = await db
      .from('email_blacklist')
      .select('id')
      .eq('user_id', userId)
      .eq('email', payment.customer_email.toLowerCase())
      .maybeSingle()

    if (isBlacklisted) {
      console.log('[Webhook] Email blacklisted — skipping:', payment.customer_email)
      return NextResponse.json({ received: true })
    }

    try {
      const emailContent = await generateRecoveryEmail({
        customerName: payment.customer_name ?? 'there',
        customerEmail: payment.customer_email,
        businessName: accountData.business_name ?? 'Our Service',
        productName: invoice.lines?.data[0]?.description ?? 'your subscription',
        amount: payment.amount,
        currency: payment.currency,
        declineCode,
        emailSequence: 1,
        updateCardUrl: invoice.hosted_invoice_url ?? '#',
        customNote: accountData.email_custom_note ?? undefined,
      })

      const smtp = accountData.smtp_host ? {
        host: accountData.smtp_host,
        port: accountData.smtp_port ?? 587,
        user: accountData.smtp_user,
        password: accountData.smtp_password,
        fromEmail: accountData.smtp_from_email,
        fromName: accountData.smtp_from_name ?? accountData.business_name ?? 'Revova',
      } : null

      await sendRecoveryEmail({
        to: payment.customer_email,
        subject: emailContent.subject,
        body: emailContent.body,
        previewText: emailContent.previewText,
        updateCardUrl: invoice.hosted_invoice_url ?? '#',
        businessName: accountData.business_name ?? 'Our Service',
        smtp,
        tracking: {
          userId,
          recipientEmail: payment.customer_email,
          sequence: 1,
        },
      })

      await db
        .from('failed_payments')
        .update({ status: 'email_sent', emails_sent: 1, last_email_at: new Date().toISOString() })
        .eq('id', payment.id)

      await db.from('email_logs').insert({
        failed_payment_id: payment.id,
        user_id: userId,
        email_type: 'sequence_1',
        recipient_email: payment.customer_email,
        subject: emailContent.subject,
      })
    } catch (emailError: unknown) {
      const msg = emailError instanceof Error ? emailError.message : String(emailError)
      console.error('[Webhook] Email pipeline error:', msg)
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice

    const { data: recovered } = await db
      .from('failed_payments')
      .update({ status: 'recovered', recovered_at: new Date().toISOString() })
      .eq('stripe_invoice_id', invoice.id)
      .eq('user_id', userId)
      .select('customer_email, customer_name, amount, currency')
      .maybeSingle()

    if (recovered) {
      // Slack notification
      if (accountData.slack_webhook_url) {
        try {
          await sendSlackNotification(accountData.slack_webhook_url, {
            type: 'recovered',
            customerEmail: recovered.customer_email,
            customerName: recovered.customer_name,
            amount: recovered.amount,
            currency: recovered.currency,
            businessName: accountData.business_name,
          })
        } catch (e) {
          console.error('[Webhook] Slack notification failed:', e)
        }
      }
      // Outbound webhook
      if (accountData.outbound_webhook_url) {
        try {
          await fetch(accountData.outbound_webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Revova-Event': 'payment.recovered' },
            body: JSON.stringify({
              event: 'payment.recovered',
              data: {
                customerEmail: recovered.customer_email,
                customerName: recovered.customer_name,
                amount: recovered.amount,
                currency: recovered.currency,
                businessName: accountData.business_name,
                recoveredAt: new Date().toISOString(),
              },
            }),
            signal: AbortSignal.timeout(8000),
          })
        } catch (e) {
          console.error('[Webhook] Outbound webhook failed:', e)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
