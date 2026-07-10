import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, Zap, Shield, TrendingUp, Lock } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { AdminBar } from '@/components/admin/admin-bar'
import { getPlanFor } from '@/lib/plan'
import { PricingTabs, type PlanUrls, type Period } from './pricing-tabs'

export const dynamic = 'force-dynamic'

function buildPolarUrl(baseUrl: string | undefined, customerEmail: string, fallback: string): string {
  const base = baseUrl && baseUrl.trim() ? baseUrl : fallback
  if (!base || base === '#') return '#'
  try {
    const url = new URL(base)
    if (customerEmail) url.searchParams.set('customer_email', customerEmail)
    return url.toString()
  } catch {
    return base
  }
}

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const expired = (await searchParams)?.expired === '1'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let subscription: any = null
  try {
    const { data } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    subscription = data
  } catch {
    // subscriptions table may not exist yet — treat as no subscription
  }

  const plan = await getPlanFor(supabase as any, user.id)
  const isActive = subscription?.status === 'active'
  const email = user.email ?? ''

  // Each (plan × billing term) is its own Polar product/checkout link. A term is
  // only offered once its Polar product exists (env var set) — otherwise its
  // tab is hidden so we never display one price but charge another.
  const env = {
    starterM: process.env.NEXT_PUBLIC_POLAR_STARTER_URL,
    starter6: process.env.NEXT_PUBLIC_POLAR_STARTER_6MO_URL,
    starterA: process.env.NEXT_PUBLIC_POLAR_STARTER_ANNUAL_URL,
    proM: process.env.NEXT_PUBLIC_POLAR_PRO_URL,
    pro6: process.env.NEXT_PUBLIC_POLAR_PRO_6MO_URL,
    proA: process.env.NEXT_PUBLIC_POLAR_PRO_ANNUAL_URL,
  }
  const b = (envUrl: string | undefined) => (envUrl && envUrl.trim() ? buildPolarUrl(envUrl, email, '#') : '')

  const planUrls: PlanUrls = {
    starter: { monthly: b(env.starterM), '6month': b(env.starter6), annual: b(env.starterA) } as Record<Period, string>,
    pro: { monthly: b(env.proM), '6month': b(env.pro6), annual: b(env.proA) } as Record<Period, string>,
  }

  // A term is available if at least one plan has a real checkout link for it.
  const availablePeriods: Period[] = [
    ...(planUrls.starter.monthly || planUrls.pro.monthly ? (['monthly'] as Period[]) : []),
    ...(planUrls.starter['6month'] || planUrls.pro['6month'] ? (['6month'] as Period[]) : []),
    ...(planUrls.starter.annual || planUrls.pro.annual ? (['annual'] as Period[]) : []),
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
    <AdminBar />
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">
          {isActive
            ? 'You are subscribed — keep recovering revenue!'
            : 'Start your 14-day free trial. No credit card required.'}
        </p>
      </div>

      {/* Trial ended → access paused until they pick a plan */}
      {expired && !isActive && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">Your free trial has ended</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Choose a plan below to reactivate your account and keep recovering failed payments. Your settings and data are safe.
            </p>
          </div>
        </div>
      )}

      {/* Still on trial → show days remaining */}
      {plan.isTrial && !expired && (
        <div className="mb-6 flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <Zap className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <p className="text-sm text-indigo-800">
            You&apos;re on the free trial — <strong>{plan.trialDaysLeft} day{plan.trialDaysLeft === 1 ? '' : 's'} left</strong>. Upgrade anytime to lock in uninterrupted recovery.
          </p>
        </div>
      )}

      {isActive && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-emerald-800">Active subscription</p>
            <p className="text-sm text-emerald-600">
              Next billing: {subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : 'N/A'}
            </p>
          </div>
        </div>
      )}

      <PricingTabs urls={planUrls} availablePeriods={availablePeriods} currentPlanId={subscription?.plan_id ?? null} isActive={isActive} />

      <div className="mt-10 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 rounded-xl p-4">
          <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Secure payments</p>
          <p className="text-xs text-gray-500 mt-0.5">via Polar.sh</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <CheckCircle className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Cancel anytime</p>
          <p className="text-xs text-gray-500 mt-0.5">No lock-in</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">14-day free trial</p>
          <p className="text-xs text-gray-500 mt-0.5">No credit card</p>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Longer terms cost less per month — pick monthly to stay flexible, or 6-month / annual to save.
      </p>
    </div>
      </main>
    </div>
  )
}
