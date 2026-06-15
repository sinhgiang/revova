import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/server'
import { generateRecoveryEmail } from '@/lib/ai/email-generator'
import { sendRecoveryEmail } from '@/lib/email/resend'
import { DeclineCode } from '@/types'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  const accountId = request.headers.get('stripe-account')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chargeObj = (invoice as any).charge as Stripe.Charge | null
    const declineCode = (chargeObj?.failure_code ?? 'generic_decline') as DeclineCode

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: accountData } = await db
      .from('stripe_accounts')
      .select('user_id, business_name')
      .eq('stripe_account_id', accountId ?? '')
      .single()

    if (!accountData) return NextResponse.json({ received: true })

    const { data: payment, error } = await db
      .from('failed_payments')
      .upsert({
        user_id: accountData.user_id,
        stripe_account_id: accountId ?? '',
        stripe_invoice_id: invoice.id,
        customer_email: invoice.customer_email ?? '',
        customer_name: (invoice.customer_name as string) ?? null,
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

    if (error || !payment) return NextResponse.json({ received: true })

    try {
      const emailContent = await generateRecoveryEmail({
        customerName: payment.customer_name ?? 'there',
        customerEmail: payment.customer_email,
        businessName: accountData.business_name ?? 'Our Service',
        productName: invoice.lines.data[0]?.description ?? 'your subscription',
        amount: payment.amount,
        currency: payment.currency,
        declineCode,
        emailSequence: 1,
        updateCardUrl: invoice.hosted_invoice_url ?? '#',
      })

      await sendRecoveryEmail({
        to: payment.customer_email,
        subject: emailContent.subject,
        body: emailContent.body,
        previewText: emailContent.previewText,
        updateCardUrl: invoice.hosted_invoice_url ?? '#',
        businessName: accountData.business_name ?? 'Our Service',
      })

      await db
        .from('failed_payments')
        .update({ status: 'email_sent', emails_sent: 1, last_email_at: new Date().toISOString() })
        .eq('id', payment.id)

      await db.from('email_logs').insert({
        failed_payment_id: payment.id,
        user_id: accountData.user_id,
        email_type: 'sequence_1',
        recipient_email: payment.customer_email,
        subject: emailContent.subject,
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('failed_payments')
      .update({ status: 'recovered', recovered_at: new Date().toISOString() })
      .eq('stripe_invoice_id', invoice.id)
  }

  return NextResponse.json({ received: true })
}
