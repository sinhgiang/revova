/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const { action, subscriptionId, reason, ltvCents, segment, variant } = await request.json()

  if (!action || !subscriptionId) {
    return NextResponse.json({ error: 'Missing action or subscriptionId' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  const { data: account } = await db
    .from('stripe_accounts')
    .select('access_token, cancel_flow_enabled, cancel_flow_discount_code, cancel_flow_discount_code_b, cancel_flow_pause_months, cancel_flow_gift_enabled')
    .eq('user_id', userId)
    .single()

  if (!account?.access_token) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 })
  }

  if (!account.cancel_flow_enabled) {
    return NextResponse.json({ error: 'Cancel flow not enabled' }, { status: 403 })
  }

  const stripe = new Stripe(account.access_token)

  try {
    if (action === 'pause') {
      const months = account.cancel_flow_pause_months ?? 1
      const resumesAt = Math.floor(Date.now() / 1000) + months * 30 * 24 * 3600
      await stripe.subscriptions.update(subscriptionId, {
        pause_collection: { behavior: 'void', resumes_at: resumesAt },
      })
      try {
        await db.from('cancel_events').insert({ merchant_user_id: userId, subscription_id: subscriptionId, reason: reason ?? null, action_taken: 'paused', ltv_cents: ltvCents ?? null, segment: segment ?? null, variant: variant ?? null })
      } catch { /* non-critical */ }
      return NextResponse.json({ ok: true, result: 'paused' })
    }

    if (action === 'discount') {
      // Use the variant's code so the applied discount matches what was shown
      const code = variant === 'B' && account.cancel_flow_discount_code_b
        ? account.cancel_flow_discount_code_b
        : account.cancel_flow_discount_code
      if (!code) return NextResponse.json({ error: 'No discount code configured' }, { status: 400 })
      // Apply coupon by promotion code or coupon ID
      try {
        const promos = await stripe.promotionCodes.list({ code, limit: 1 })
        if (promos.data.length > 0) {
          await stripe.subscriptions.update(subscriptionId, {
            discounts: [{ promotion_code: promos.data[0].id }],
          })
        } else {
          // Try as raw coupon ID
          await stripe.subscriptions.update(subscriptionId, {
            discounts: [{ coupon: code }],
          })
        }
      } catch {
        await stripe.subscriptions.update(subscriptionId, {
          discounts: [{ coupon: code }],
        })
      }
      try {
        await db.from('cancel_events').insert({ merchant_user_id: userId, subscription_id: subscriptionId, reason: reason ?? null, action_taken: 'discounted', ltv_cents: ltvCents ?? null, segment: segment ?? null, variant: variant ?? null })
      } catch { /* non-critical */ }
      return NextResponse.json({ ok: true, result: 'discounted' })
    }

    if (action === 'gift') {
      // "1 month free" — apply a one-time 100%-off coupon to the subscription.
      if (!account.cancel_flow_gift_enabled) {
        return NextResponse.json({ error: 'Gift offer not enabled' }, { status: 400 })
      }
      try {
        const coupon = await stripe.coupons.create({ percent_off: 100, duration: 'once', name: 'Loyalty — 1 month free' })
        await stripe.subscriptions.update(subscriptionId, { discounts: [{ coupon: coupon.id }] })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        return NextResponse.json({ error: msg }, { status: 500 })
      }
      try {
        await db.from('cancel_events').insert({ merchant_user_id: userId, subscription_id: subscriptionId, reason: reason ?? null, action_taken: 'gifted', ltv_cents: ltvCents ?? null, segment: segment ?? null, variant: variant ?? null })
      } catch { /* non-critical */ }
      return NextResponse.json({ ok: true, result: 'gifted' })
    }

    if (action === 'cancel') {
      await stripe.subscriptions.cancel(subscriptionId)
      // Log cancel event with reason for merchant analytics
      try {
        await db.from('cancel_events').insert({
          merchant_user_id: userId,
          subscription_id: subscriptionId,
          reason: reason ?? null,
          action_taken: 'cancelled',
          ltv_cents: ltvCents ?? null,
          segment: segment ?? null,
          variant: variant ?? null,
        })
      } catch { /* non-critical */ }
      return NextResponse.json({ ok: true, result: 'cancelled' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
