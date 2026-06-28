/* eslint-disable @typescript-eslint/no-explicit-any */
// Single source of truth for a merchant's plan + access level.
// Used by pages (gating UI + paywall) and crons (gating Pro automations).

export const TRIAL_DAYS = 14
export const STARTER_MONTHLY_RECOVERY_LIMIT = 50

export type Tier = 'trial' | 'starter' | 'pro' | 'expired'

export interface PlanStatus {
  tier: Tier
  isPro: boolean          // can use Pro-only features
  hasAccess: boolean      // false → trial ended, show paywall
  isTrial: boolean
  trialDaysLeft: number   // 0 when not on trial
  recoveryLimit: number | null  // emails/month cap; null = unlimited (Pro)
}

export function resolvePlan(account: any, subscription: any): PlanStatus {
  const subActive = !!subscription && (subscription.status === 'active' || subscription.status === 'trialing')
  const plan = subscription?.plan_id

  if (subActive && plan === 'pro') {
    return { tier: 'pro', isPro: true, hasAccess: true, isTrial: false, trialDaysLeft: 0, recoveryLimit: null }
  }
  if (subActive && plan === 'starter') {
    return { tier: 'starter', isPro: false, hasAccess: true, isTrial: false, trialDaysLeft: 0, recoveryLimit: STARTER_MONTHLY_RECOVERY_LIMIT }
  }

  // No active subscription → free trial (Starter-level) for 14 days, then locked.
  const start = account?.connected_at ? new Date(account.connected_at).getTime() : Date.now()
  const daysUsed = (Date.now() - start) / 86_400_000
  const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - daysUsed))

  if (daysUsed <= TRIAL_DAYS) {
    return { tier: 'trial', isPro: false, hasAccess: true, isTrial: true, trialDaysLeft: daysLeft, recoveryLimit: STARTER_MONTHLY_RECOVERY_LIMIT }
  }
  return { tier: 'expired', isPro: false, hasAccess: false, isTrial: false, trialDaysLeft: 0, recoveryLimit: 0 }
}

// Fetch the account + subscription for a user and resolve the plan. Pass a
// Supabase client (admin in crons, user client in pages).
export async function getPlanFor(db: any, userId: string): Promise<PlanStatus> {
  const { data: account } = await db.from('stripe_accounts').select('connected_at').eq('user_id', userId).maybeSingle()
  const { data: sub } = await db.from('subscriptions').select('plan_id, status').eq('user_id', userId).maybeSingle()
  return resolvePlan(account, sub)
}

// How many failed payments we've handled (= recoveries) this calendar month —
// used to enforce the Starter monthly cap.
export async function monthlyRecoveryCount(db: any, userId: string): Promise<number> {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { count } = await db
    .from('failed_payments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', monthStart)
  return count ?? 0
}
