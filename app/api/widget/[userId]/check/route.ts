/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'no-store',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return NextResponse.json({ hasFailed: false }, { headers: CORS })
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  const { data: payment } = await db
    .from('failed_payments')
    .select('amount, currency, stripe_invoice_id')
    .eq('user_id', userId)
    .eq('customer_email', email)
    .not('status', 'in', '("recovered","cancelled","max_emails_reached")')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!payment) {
    return NextResponse.json({ hasFailed: false }, { headers: CORS })
  }

  const { data: account } = await db
    .from('stripe_accounts')
    .select('access_token, business_name')
    .eq('user_id', userId)
    .single()

  let updateCardUrl = '#'
  if (account?.access_token) {
    try {
      const stripe = new Stripe(account.access_token)
      const invoice = await stripe.invoices.retrieve(payment.stripe_invoice_id)
      updateCardUrl = invoice.hosted_invoice_url ?? '#'
    } catch {
      // invoice lookup failed, use fallback
    }
  }

  return NextResponse.json(
    {
      hasFailed: true,
      amount: payment.amount,
      currency: payment.currency,
      updateCardUrl,
      businessName: account?.business_name ?? null,
    },
    { headers: CORS }
  )
}
