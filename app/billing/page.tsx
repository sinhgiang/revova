import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, Zap, Shield, TrendingUp, Star, Lock } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { AdminBar } from '@/components/admin/admin-bar'
import { getPlanFor } from '@/lib/plan'

export const dynamic = 'force-dynamic'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'Perfect for indie hackers just starting out',
    limit: 'Up to 50 recoveries/month',
    features: [
      'Up to 50 failed payment recoveries/mo',
      'AI-personalized 4-email sequence (Day 1,3,7,14)',
      'Daily smart payment auto-retry',
      'Pre-dunning expiry alerts',
      'Works with 5 payment processors',
      'Auto spam/bounce suppression',
      'Slack & Telegram alerts + in-app banner',
      'Real-time recovery dashboard',
      'GDPR export & delete tools',
    ],
    polar_env: 'NEXT_PUBLIC_POLAR_STARTER_URL',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    description: 'For SaaS companies growing fast',
    limit: 'Unlimited recoveries',
    features: [
      'Everything in Starter, plus:',
      'Unlimited failed payment recoveries',
      'AI-personalized 5-email sequence (Day 1,3,7,14,21)',
      'SMS recovery + hard/soft decline routing',
      'Recovery emails in 8 languages',
      'Winback campaigns (Day 3, 14, 30)',
      'In-app cancel flow + A/B testing',
      '1-month-free + LTV retention offers',
      'Churn risk scoring',
      'Open/click analytics + revenue forecast',
      'Weekly digest + priority support',
    ],
    polar_env: 'NEXT_PUBLIC_POLAR_PRO_URL',
    popular: true,
  },
]

function buildPolarUrl(baseUrl: string, customerEmail: string): string {
  if (!baseUrl || baseUrl === '#') return '#'
  try {
    const url = new URL(baseUrl)
    if (customerEmail) url.searchParams.set('customer_email', customerEmail)
    return url.toString()
  } catch {
    return baseUrl
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

  // Build Polar URLs with customer email so webhook can identify the user
  const starterUrl = buildPolarUrl(
    process.env.NEXT_PUBLIC_POLAR_STARTER_URL ?? '#',
    user.email ?? ''
  )
  const proUrl = buildPolarUrl(
    process.env.NEXT_PUBLIC_POLAR_PRO_URL ?? '#',
    user.email ?? ''
  )
  const planUrls: Record<string, string> = { starter: starterUrl, pro: proUrl }

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

      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl p-8 ${
              plan.popular
                ? 'border-2 border-indigo-500 shadow-lg'
                : 'border border-gray-200 shadow-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl mb-3">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{plan.name}</p>
              <div className="mt-1">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <p className="text-xs font-medium text-indigo-600 mt-2">{plan.limit}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                feature.endsWith('plus:') ? (
                  <li key={feature} className="text-sm font-bold text-gray-900 pt-1">{feature}</li>
                ) : (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-indigo-500' : 'text-emerald-500'}`} />
                    {feature}
                  </li>
                )
              ))}
            </ul>

            {isActive && subscription?.plan_id === plan.id ? (
              <div className="text-center py-3 bg-emerald-50 rounded-xl text-emerald-700 font-medium text-sm">
                ✓ Current Plan
              </div>
            ) : (
              <a
                href={planUrls[plan.id]}
                className={`block w-full text-center font-semibold py-3 px-6 rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isActive ? 'Switch to this plan' : 'Start Free Trial'}
              </a>
            )}
          </div>
        ))}
      </div>

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
        Recover just 1 payment and Revova pays for itself. Average customer recovers 8–12 payments/month.
      </p>
    </div>
      </main>
    </div>
  )
}
