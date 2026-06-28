// Heuristic churn-risk score for a failed payment. Higher = more likely to be
// lost. Combines how many emails were ignored, how hard the decline was, and how
// long the payment has been failing. Used to prioritize manual outreach.

const HARD_DECLINE_CODES = new Set([
  'lost_card', 'stolen_card', 'pickup_card', 'restricted_card',
  'security_violation', 'transaction_not_allowed', 'do_not_honor',
  'fraudulent', 'card_declined',
])

export interface RiskInput {
  emails_sent?: number | null
  decline_code?: string | null
  created_at?: string | null
  status?: string | null
}

export interface RiskResult {
  score: number // 0–100
  label: 'Low' | 'Medium' | 'High' | 'Critical'
  color: string // tailwind text color class
}

export function churnRisk(p: RiskInput): RiskResult {
  let score = 0

  // Each ignored email raises risk
  const emails = p.emails_sent ?? 0
  score += Math.min(emails, 5) * 14 // up to 70

  // Hard bank declines rarely self-resolve
  if (HARD_DECLINE_CODES.has(p.decline_code ?? '')) score += 20

  // The longer it sits unpaid, the worse
  if (p.created_at) {
    const ageDays = (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (ageDays > 14) score += 20
    else if (ageDays > 7) score += 12
    else if (ageDays > 3) score += 5
  }

  // Already flagged out of the sequence
  if (p.status === 'max_emails_reached') score += 10

  score = Math.max(0, Math.min(100, Math.round(score)))

  let label: RiskResult['label']
  let color: string
  if (score >= 80) { label = 'Critical'; color = 'text-red-600' }
  else if (score >= 55) { label = 'High'; color = 'text-orange-600' }
  else if (score >= 30) { label = 'Medium'; color = 'text-amber-600' }
  else { label = 'Low'; color = 'text-emerald-600' }

  return { score, label, color }
}
