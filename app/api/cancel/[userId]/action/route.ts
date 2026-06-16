/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const { action, subscriptionId } = await request.json()

  if (!action || !subscriptionId) {
    return NextResponse.json({ error: 'Missing action or subscriptionId' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  const { data: account } = await db
    .from('stripe_accounts')
    .select('access_token, cancel_flow_enabled, cancel_flow_discount_code, cancel_flow_pause_months')
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
      return NextResponse.json({ ok: true, result: 'paused' })
    }

    if (action === 'discount') {
      const code = account.cancel_flow_discount_code
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
      return NextResponse.json({ ok: true, result: 'discounted' })
    }

    if (action === 'cancel') {
      await stripe.subscriptions.cancel(subscriptionId)
      return NextResponse.json({ ok: true, result: 'cancelled' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
