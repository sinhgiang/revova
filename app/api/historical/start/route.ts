/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getPlanFor } from '@/lib/plan'
import { scanHistoricalFailures } from '@/lib/stripe-historical'

const LOOKBACK_DAYS: Record<string, number> = { trial: 30, starter: 90, pro: 365 }

// Enrolls the historical failed customers into the throttled winback drip.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const db = supabase as any

    const { throttle, discount } = await request.json().catch(() => ({}))
    const throttleN = Math.min(200, Math.max(5, parseInt(throttle) || 40))

    const { data: account } = await db.from('stripe_accounts').select('access_token').eq('user_id', user.id).single()
    if (!account?.access_token) return NextResponse.json({ error: 'No Stripe connected' }, { status: 400 })

    const plan = await getPlanFor(db, user.id)
    const lookbackDays = LOOKBACK_DAYS[plan.tier] ?? 30
    const stripe = new Stripe(account.access_token)
    const cutoff = Math.floor((Date.now() - lookbackDays * 86_400_000) / 1000)

    const { data: bl } = await db.from('email_blacklist').select('email').eq('user_id', user.id)
    const blocked = new Set((bl ?? []).map((b: any) => (b.email ?? '').toLowerCase()))

    const list = await scanHistoricalFailures(stripe, cutoff, blocked)
    if (list.length === 0) return NextResponse.json({ ok: true, enrolled: 0 })

    // Save campaign settings
    await db.from('stripe_accounts').update({
      historical_throttle: throttleN,
      historical_discount: (discount ?? '').trim() || null,
    }).eq('user_id', user.id)

    // Enroll (skip anyone already enrolled — unique on user_id+email)
    const rows = list.map(c => ({
      user_id: user.id,
      customer_email: c.email,
      customer_name: c.name,
      amount: c.amount,
      currency: c.currency,
      failed_at: new Date(c.created * 1000).toISOString(),
      status: 'queued',
      emails_sent: 0,
    }))
    await db.from('historical_recovery').upsert(rows, { onConflict: 'user_id,customer_email', ignoreDuplicates: true })

    return NextResponse.json({ ok: true, enrolled: list.length })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to start' }, { status: 500 })
  }
}
