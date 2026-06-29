/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getPlanFor } from '@/lib/plan'

// Historical scans of a high-volume merchant can take a while — give the
// function room to page through every failed charge rather than time out.
export const maxDuration = 300
export const dynamic = 'force-dynamic'

// How far back each plan can ACT on historical failures (enroll + email).
// The dashboard always *shows* up to 12 months, but the periods beyond a plan's
// reach are blurred — seeing the full loss is the upsell hook; acting on the
// older periods is the paid feature.
const ACTIONABLE_DAYS: Record<string, number> = { trial: 30, starter: 90, pro: 365, expired: 30 }

const DAY = 86_400_000

type Periods = { d30: { count: number; amount: number }; m3: { count: number; amount: number }; y1: { count: number; amount: number } }

// Drop a single failed charge into the cumulative period buckets (y1 ⊇ m3 ⊇ d30).
function bucket(periods: Periods, createdSec: number, amount: number, cut30: number, cut90: number) {
  periods.y1.count++; periods.y1.amount += amount
  if (createdSec >= cut90) { periods.m3.count++; periods.m3.amount += amount }
  if (createdSec >= cut30) { periods.d30.count++; periods.d30.amount += amount }
}

// Scans the merchant's EXISTING Stripe data for recoverable money — so a new
// user sees value immediately. Read-only. We always scan up to 12 months and
// return a per-period breakdown (30d / 3mo / 12mo, cumulative).
export async function POST(request: NextRequest) {
  void request
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: account } = await (supabase as any)
      .from('stripe_accounts').select('access_token').eq('user_id', user.id).single()
    if (!account?.access_token) return NextResponse.json({ error: 'No Stripe connected' }, { status: 400 })

    const plan = await getPlanFor(supabase as any, user.id)
    const actionableDays = ACTIONABLE_DAYS[plan.tier] ?? 30
    const stripe = new Stripe(account.access_token)

    // 1) Currently-failing subscriptions = recoverable right now.
    //    for-await auto-paginates through EVERY page with no cap — a merchant may
    //    have >100 past-due subs (autoPagingToArray refuses limits over 10k).
    let failedCount = 0, recoverable = 0, currency = 'usd'
    for (const status of ['past_due', 'unpaid'] as const) {
      for await (const sub of stripe.subscriptions.list({ status, limit: 100 })) {
        failedCount++
        currency = sub.currency ?? currency
        recoverable += (sub.items?.data ?? []).reduce((s, it) => s + (it.price?.unit_amount ?? 0) * (it.quantity ?? 1), 0)
      }
    }

    // 2) Active subscriptions with a card expiring this month or next (all pages).
    //    We also collect the ones expiring this/next month so we can refresh the
    //    "Coming up" panel live on dashboard load — no waiting for the daily cron.
    let expiringCount = 0, activeCount = 0
    const now = new Date()
    const curIdx = now.getFullYear() * 12 + (now.getMonth() + 1)
    const toTrack: any[] = []
    for await (const sub of stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.default_payment_method', 'data.customer'] })) {
      activeCount++
      const pm = sub.default_payment_method as Stripe.PaymentMethod | null
      const card = pm && typeof pm !== 'string' ? pm.card : null
      if (!card?.exp_year || !card?.exp_month) continue
      const cardIdx = card.exp_year * 12 + card.exp_month
      if (cardIdx <= curIdx + 1) expiringCount++
      // Exactly this month or next → track for the "Coming up" panel.
      if (cardIdx === curIdx || cardIdx === curIdx + 1) {
        const cu = sub.customer as Stripe.Customer | string | null
        const cust = cu && typeof cu !== 'string' ? cu : null
        if (cust?.email) {
          toTrack.push({
            user_id: user.id,
            customer_email: cust.email,
            customer_name: cust.name ?? null,
            stripe_customer_id: cust.id,
            last4: card.last4 ?? null,
            exp_month: card.exp_month,
            exp_year: card.exp_year,
            updated_at: now.toISOString(),
          })
        }
      }
    }
    // Best-effort live refresh of the expiring-cards table (admin client bypasses RLS).
    if (toTrack.length) {
      try {
        const admin = await createAdminClient()
        await (admin as any).from('expiring_cards').upsert(toTrack, { onConflict: 'user_id,stripe_customer_id' })
      } catch { /* non-critical — the daily cron also keeps this table fresh */ }
    }

    // 3) Historical failed charges, bucketed into cumulative periods (the
    //    "you lost $X" hook). Always scan the full 12 months; the UI blurs the
    //    periods a plan can't act on yet.
    const nowSec = Math.floor(Date.now() / 1000)
    const cut30 = nowSec - Math.floor((30 * DAY) / 1000)
    const cut90 = nowSec - Math.floor((90 * DAY) / 1000)
    const cut365 = nowSec - Math.floor((365 * DAY) / 1000)
    const periods: Periods = {
      d30: { count: 0, amount: 0 },
      m3: { count: 0, amount: 0 },
      y1: { count: 0, amount: 0 },
    }

    // Prefer the Search API: it returns ONLY failed charges, so we page through a
    // few hundred records instead of every charge the merchant ever made. We
    // follow next_page to the very end — no artificial cap — so a high-volume
    // account is counted in full, however long it takes.
    let scannedVia = 'search'
    try {
      let page: string | undefined
      do {
        const res: any = await stripe.charges.search({
          query: `status:"failed" AND created>${cut365}`,
          limit: 100,
          ...(page ? { page } : {}),
        })
        for (const c of res.data) {
          currency = c.currency ?? currency
          bucket(periods, c.created, c.amount ?? 0, cut30, cut90)
        }
        page = res.has_more ? res.next_page : undefined
      } while (page)
    } catch {
      // Fallback for accounts where Search isn't available: list every charge in
      // the window (all pages, no cap) and filter to failed ones.
      scannedVia = 'list'
      periods.d30 = { count: 0, amount: 0 }; periods.m3 = { count: 0, amount: 0 }; periods.y1 = { count: 0, amount: 0 }
      let starting_after: string | undefined
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const charges: any = await stripe.charges.list({ created: { gte: cut365 }, limit: 100, starting_after })
        for (const c of charges.data) {
          if (c.status !== 'failed') continue
          currency = c.currency ?? currency
          bucket(periods, c.created, c.amount ?? 0, cut30, cut90)
        }
        if (!charges.has_more || charges.data.length === 0) break
        starting_after = charges.data[charges.data.length - 1].id
      }
    }

    return NextResponse.json({
      scannedVia,
      ok: true,
      failedCount, recoverable, currency, expiringCount, activeCount,
      periods,
      // Back-compat fields (some callers read these): total over 12 months.
      lostCount: periods.y1.count, lostAmount: periods.y1.amount,
      actionableDays, tier: plan.tier, isPro: plan.isPro,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Scan failed' }, { status: 500 })
  }
}
