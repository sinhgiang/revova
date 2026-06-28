/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

// LTV threshold (in cents) above which a customer is treated as "high value".
// High-value customers get a stronger retention treatment in the cancel flow.
const HIGH_VALUE_THRESHOLD_CENTS = 50000 // $500 lifetime

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const { searchParams } = new URL(request.url)
  const subscriptionId = searchParams.get('sub')
  const supabase = await createAdminClient()
  const db = supabase as any

  const { data: account } = await db
    .from('stripe_accounts')
    .select('business_name, cancel_flow_enabled, cancel_flow_discount_code, cancel_flow_discount_code_b, cancel_flow_pause_months, cancel_flow_gift_enabled, cancel_flow_ab_enabled, access_token')
    .eq('user_id', userId)
    .single()

  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // A/B test: deterministically assign this subscription to variant A or B so the
  // same customer always sees the same offer. Hash the subscription id.
  function hashToVariant(seed: string): 'A' | 'B' {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
    return h % 2 === 0 ? 'A' : 'B'
  }
  const abEnabled = !!account.cancel_flow_ab_enabled && !!account.cancel_flow_discount_code_b
  const variant: 'A' | 'B' = abEnabled && subscriptionId ? hashToVariant(subscriptionId) : 'A'
  const resolvedDiscountCode = variant === 'B'
    ? account.cancel_flow_discount_code_b
    : account.cancel_flow_discount_code

  // Compute customer lifetime value (sum of paid invoices) to segment the offer.
  let ltvCents = 0
  let segment: 'high' | 'standard' = 'standard'
  let acquisitionChannel: string | null = null

  if (subscriptionId && account.access_token) {
    try {
      const stripe = new Stripe(account.access_token)
      const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['customer'] })
      const customer = sub.customer as Stripe.Customer
      if (customer && !(customer as any).deleted) {
        // Acquisition channel from customer metadata, if the merchant tracks it
        acquisitionChannel =
          (customer.metadata?.acquisition_channel as string) ??
          (customer.metadata?.utm_source as string) ??
          (customer.metadata?.source as string) ??
          null

        // Sum all paid invoices for this customer = lifetime value
        const invoices = await stripe.invoices.list({ customer: customer.id, limit: 100, status: 'paid' })
        ltvCents = invoices.data.reduce((sum, inv) => sum + (inv.amount_paid ?? 0), 0)
        if (ltvCents >= HIGH_VALUE_THRESHOLD_CENTS) segment = 'high'
      }
    } catch (e) {
      console.error('[Cancel info] LTV calc failed:', e instanceof Error ? e.message : e)
    }
  }

  return NextResponse.json({
    businessName: account.business_name ?? 'Our Service',
    cancelFlowEnabled: account.cancel_flow_enabled ?? false,
    discountCode: resolvedDiscountCode ?? null,
    pauseMonths: account.cancel_flow_pause_months ?? 1,
    giftEnabled: !!account.cancel_flow_gift_enabled,
    variant,
    ltvCents,
    segment,
    acquisitionChannel,
  })
}
