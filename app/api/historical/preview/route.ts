/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getPlanFor } from '@/lib/plan'
import { scanHistoricalFailures } from '@/lib/stripe-historical'

const LOOKBACK_DAYS: Record<string, number> = { trial: 30, starter: 90, pro: 365 }

// Returns the list of customers whose payments failed in the past (deduped) so
// the merchant can preview before launching the winback campaign. Read-only.
export async function POST(request: NextRequest) {
  void request
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: account } = await (supabase as any)
      .from('stripe_accounts').select('access_token, historical_throttle, historical_discount').eq('user_id', user.id).single()
    if (!account?.access_token) return NextResponse.json({ error: 'No Stripe connected' }, { status: 400 })

    const plan = await getPlanFor(supabase as any, user.id)
    const lookbackDays = LOOKBACK_DAYS[plan.tier] ?? 30
    const stripe = new Stripe(account.access_token)
    const cutoff = Math.floor((Date.now() - lookbackDays * 86_400_000) / 1000)

    // Blacklisted emails to exclude
    const { data: bl } = await (supabase as any).from('email_blacklist').select('email').eq('user_id', user.id)
    const blocked = new Set((bl ?? []).map((b: any) => (b.email ?? '').toLowerCase()))

    const list = await scanHistoricalFailures(stripe, cutoff, blocked)
    const total = list.reduce((s, x) => s + x.amount, 0)

    return NextResponse.json({
      ok: true,
      count: list.length,
      total,
      currency: list[0]?.currency ?? 'usd',
      lookbackDays,
      list: list.slice(0, 100), // preview cap
      throttle: account.historical_throttle ?? 40,
      discount: account.historical_discount ?? '',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Preview failed' }, { status: 500 })
  }
}
