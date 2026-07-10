/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// One-click, in-app upgrade to Pro for a customer who already pays (card on
// file with Polar). Calls Polar's PATCH /v1/subscriptions/{id} to switch the
// product to Pro with immediate proration — the prorated difference is charged
// on the saved card, and the plan changes only if that payment succeeds.
//
// Requires POLAR_ACCESS_TOKEN and POLAR_PRO_PRODUCT_ID. If not configured, or if
// the customer has no saved subscription (trial), we return needsCheckout so the
// modal falls back to the hosted checkout.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = process.env.POLAR_ACCESS_TOKEN
  const proProductId = process.env.POLAR_PRO_PRODUCT_ID
  if (!token || !proProductId) {
    return NextResponse.json({ needsCheckout: true })
  }

  const { data: sub } = await (supabase as any)
    .from('subscriptions')
    .select('polar_subscription_id, plan_id, status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (sub?.plan_id === 'pro' && sub?.status === 'active') {
    return NextResponse.json({ alreadyPro: true })
  }
  if (!sub?.polar_subscription_id || sub?.status !== 'active') {
    // No active paid subscription → no saved card to charge.
    return NextResponse.json({ needsCheckout: true })
  }

  // Ask Polar to switch this subscription to the Pro product, charging the
  // prorated difference immediately on the saved card.
  let polarRes: Response
  try {
    polarRes = await fetch(`https://api.polar.sh/v1/subscriptions/${sub.polar_subscription_id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: proProductId, proration_behavior: 'invoice' }),
      signal: AbortSignal.timeout(20000),
    })
  } catch {
    return NextResponse.json({ error: 'network', message: 'We could not reach the payment provider. Please try again.' }, { status: 502 })
  }

  if (!polarRes.ok) {
    // Payment failed / requires authentication / other Polar error. The
    // subscription stays unchanged on Polar's side.
    let detail = ''
    try {
      const body = await polarRes.json()
      detail = body?.detail || body?.error || (Array.isArray(body?.errors) ? body.errors[0]?.message : '') || ''
    } catch {}
    return NextResponse.json({
      error: 'payment_failed',
      message: detail || 'The upgrade payment did not go through. Please check your card or use checkout.',
    }, { status: 402 })
  }

  // Success — reflect Pro immediately (the subscription.updated webhook also fires).
  await (supabase as any)
    .from('subscriptions')
    .update({ plan_id: 'pro', status: 'active', updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return NextResponse.json({ upgraded: true })
}
