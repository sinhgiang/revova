/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe'

export type LostBuckets = {
  d30: { c: number; a: number }
  m3: { c: number; a: number }
  y1: { c: number; a: number }
}

// Scan a merchant's Stripe for failed charges, bucketed 30d / 3mo / 12mo
// (cumulative — same engine as the in-app Lost Revenue Finder). Read-only,
// best-effort: returns zeros for a clean account or a revoked key.
export async function scanLost(token: string): Promise<LostBuckets> {
  const p: LostBuckets = { d30: { c: 0, a: 0 }, m3: { c: 0, a: 0 }, y1: { c: 0, a: 0 } }
  const nowSec = Math.floor(Date.now() / 1000)
  const cut30 = nowSec - 30 * 86400, cut90 = nowSec - 90 * 86400, cut365 = nowSec - 365 * 86400
  const add = (createdSec: number, amt: number) => {
    p.y1.c++; p.y1.a += amt
    if (createdSec >= cut90) { p.m3.c++; p.m3.a += amt }
    if (createdSec >= cut30) { p.d30.c++; p.d30.a += amt }
  }
  const stripe = new Stripe(token)
  try {
    let page: string | undefined
    do {
      const res: any = await stripe.charges.search({ query: `status:"failed" AND created>${cut365}`, limit: 100, ...(page ? { page } : {}) })
      for (const c of res.data) add(c.created, c.amount ?? 0)
      page = res.has_more ? res.next_page : undefined
    } while (page)
  } catch {
    try { // fallback: list every charge and filter to failed
      let sa: string | undefined
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const ch: any = await stripe.charges.list({ created: { gte: cut365 }, limit: 100, starting_after: sa })
        for (const c of ch.data) if (c.status === 'failed') add(c.created, c.amount ?? 0)
        if (!ch.has_more || ch.data.length === 0) break
        sa = ch.data[ch.data.length - 1].id
      }
    } catch { /* invalid/revoked key — leave zeros */ }
  }
  return p
}
