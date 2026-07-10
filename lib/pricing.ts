// Single source of truth for plan prices across the app (in-app /billing) and
// the public /pricing page, so the two never drift. Longer terms are cheaper
// per month: 6-month = 10% off, annual = 12% off.

export type Period = 'monthly' | '6month' | 'annual'

export interface TermPrice {
  perMonth: number
  billed: number
  save?: number // percent, shown as a badge
}

export const PERIOD_META: { id: Period; label: string; sub: string; save?: string }[] = [
  { id: 'monthly', label: 'Monthly', sub: 'Billed every month' },
  { id: '6month', label: '6 months', sub: 'Billed every 6 months', save: 'Save 10%' },
  { id: 'annual', label: 'Annual', sub: 'Billed once a year', save: 'Save 12%' },
]

export const PRICING: Record<'starter' | 'pro', Record<Period, TermPrice>> = {
  starter: {
    monthly: { perMonth: 29, billed: 29 },
    '6month': { perMonth: 26, billed: 156, save: 10 },
    annual: { perMonth: 25.5, billed: 306, save: 12 },
  },
  pro: {
    monthly: { perMonth: 79, billed: 79 },
    '6month': { perMonth: 71, billed: 426, save: 10 },
    annual: { perMonth: 69.5, billed: 834, save: 12 },
  },
}

// Whole numbers show plainly ($26); non-round ones show 2 decimals ($25.50).
export function fmtPrice(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

export function billedLabel(period: Period, billed: number): string {
  if (period === 'monthly') return `$${billed} billed monthly`
  if (period === '6month') return `$${billed} billed every 6 months`
  return `$${billed} billed yearly`
}
