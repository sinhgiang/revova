/* eslint-disable @typescript-eslint/no-explicit-any */
import type Stripe from 'stripe'

export interface FailedCustomer {
  email: string
  name: string | null
  amount: number
  currency: string
  created: number
}

// Scans the merchant's failed charges since `cutoff` (unix seconds), deduped by
// customer (most recent failure kept), excluding blacklisted emails.
export async function scanHistoricalFailures(stripe: Stripe, cutoff: number, blocked: Set<string>): Promise<FailedCustomer[]> {
  const byEmail = new Map<string, FailedCustomer>()
  let starting_after: string | undefined
  for (let page = 0; page < 8; page++) {
    const charges: any = await stripe.charges.list({ created: { gte: cutoff }, limit: 100, starting_after, expand: ['data.customer'] })
    for (const c of charges.data) {
      if (c.status !== 'failed') continue
      const cust = c.customer && typeof c.customer !== 'string' ? c.customer : null
      const email = (c.billing_details?.email ?? c.receipt_email ?? cust?.email ?? '').toLowerCase()
      if (!email || blocked.has(email)) continue
      const existing = byEmail.get(email)
      if (!existing || c.created > existing.created) {
        byEmail.set(email, {
          email,
          name: c.billing_details?.name ?? cust?.name ?? null,
          amount: c.amount ?? 0,
          currency: c.currency ?? 'usd',
          created: c.created,
        })
      }
    }
    if (!charges.has_more || charges.data.length === 0) break
    starting_after = charges.data[charges.data.length - 1].id
  }
  return Array.from(byEmail.values()).sort((a, b) => b.amount - a.amount)
}
