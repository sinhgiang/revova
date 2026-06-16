/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { generateRecoveryEmail } from '@/lib/ai/email-generator'
import { sendRecoveryEmail } from '@/lib/email/resend'
import { DeclineCode } from '@/types'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = supabase as any

  const { data: payment } = await db
    .from('failed_payments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  if (!payment.customer_email) return NextResponse.json({ error: 'No customer email' }, { status: 400 })

  // Prevent spamming — cooldown of 12 hours
  if (payment.last_email_at) {
    const hours = (Date.now() - new Date(payment.last_email_at).getTime()) / 3600000
    if (hours < 12) {
      return NextResponse.json({ error: `Please wait ${Math.ceil(12 - hours)} more hours before resending` }, { status: 429 })
    }
  }

  const { data: account } = await db
    .from('stripe_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!account?.access_token) return NextResponse.json({ error: 'No Stripe account' }, { status: 400 })

  // Check blacklist
  const { data: blacklisted } = await db
    .from('email_blacklist')
    .select('id')
    .eq('user_id', user.id)
    .eq('email', payment.customer_email.toLowerCase())
    .maybeSingle()

  if (blacklisted) return NextResponse.json({ error: 'Email is blacklisted' }, { status: 400 })

  let updateCardUrl = '#'
  try {
    const stripe = new Stripe(account.access_token)
    const invoice = await stripe.invoices.retrieve(payment.stripe_invoice_id)
    updateCardUrl = invoice.hosted_invoice_url ?? '#'
  } catch { /* keep '#' */ }

  const nextSeq = Math.min((payment.emails_sent ?? 0) + 1, 5)

  const emailContent = await generateRecoveryEmail({
    customerName: payment.customer_name ?? 'there',
    customerEmail: payment.customer_email,
    businessName: account.business_name ?? 'Our Service',
    productName: 'your subscription',
    amount: payment.amount,
    currency: payment.currency,
    declineCode: payment.decline_code as DeclineCode,
    emailSequence: nextSeq,
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
      userId: user.id,
      recipientEmail: payment.customer_email,
      sequence: nextSeq,
    },
  })

  await db.from('failed_payments')
    .update({ emails_sent: nextSeq, last_email_at: new Date().toISOString(), status: 'email_sent' })
    .eq('id', id)

  await db.from('email_logs').insert({
    failed_payment_id: payment.id,
    user_id: user.id,
    email_type: `manual_${nextSeq}`,
    recipient_email: payment.customer_email,
    subject: emailContent.subject,
  }).catch(() => {/* non-critical */})

  return NextResponse.json({ ok: true })
}
