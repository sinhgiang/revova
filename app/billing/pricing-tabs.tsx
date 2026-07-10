'use client'

import { useState } from 'react'
import { CheckCircle, Star, Zap } from 'lucide-react'
import { PERIOD_META, PRICING, fmtPrice, billedLabel, type Period } from '@/lib/pricing'

// Three billing terms. Each (plan × term) is its own Polar product/checkout link,
// resolved server-side and passed in via `urls`. Prices come from lib/pricing so
// the in-app and public pricing never drift.
export type { Period }

export interface PlanUrls {
  starter: Record<Period, string>
  pro: Record<Period, string>
}

interface Plan {
  id: 'starter' | 'pro'
  name: string
  description: string
  limit: string
  popular: boolean
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for indie hackers just starting out',
    limit: 'Up to 50 recoveries/month',
    popular: false,
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
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For SaaS companies growing fast',
    limit: 'Unlimited recoveries',
    popular: true,
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
  },
]

export function PricingTabs({
  urls,
  availablePeriods,
  currentPlanId,
  isActive,
}: {
  urls: PlanUrls
  availablePeriods: Period[]
  currentPlanId: string | null
  isActive: boolean
}) {
  // Only show terms that have a Polar product configured. Prefer 6-month as the
  // default (nudges a longer term), else the first available term.
  const visiblePeriods = PERIOD_META.filter((p) => availablePeriods.includes(p.id))
  const initial: Period = availablePeriods.includes('6month')
    ? '6month'
    : availablePeriods[0] ?? 'monthly'
  const [period, setPeriod] = useState<Period>(initial)

  return (
    <div>
      {/* Billing-term tabs (hidden when only one term is configured) */}
      {visiblePeriods.length > 1 && (
      <div className="flex justify-center mb-8">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-2xl bg-gray-100 p-1.5">
          {visiblePeriods.map((p) => {
            const active = period === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.label}
                {p.save && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      active ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/15 text-emerald-600'
                    }`}
                  >
                    {p.save}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      )}

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => {
          const pr = PRICING[plan.id][period]
          const url = urls[plan.id][period]
          const isCurrent = isActive && currentPlanId === plan.id
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular ? 'border-2 border-indigo-500 shadow-lg' : 'border border-gray-200 shadow-sm'
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

                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">${fmtPrice(pr.perMonth)}</span>
                  <span className="text-gray-500">/month</span>
                </div>

                {/* Billed-total + savings line */}
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">{billedLabel(period, pr.billed)}</span>
                  {pr.save ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      Save {pr.save}%
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                <p className="text-xs font-medium text-indigo-600 mt-2">{plan.limit}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) =>
                  feature.endsWith('plus:') ? (
                    <li key={feature} className="text-sm font-bold text-gray-900 pt-1">
                      {feature}
                    </li>
                  ) : (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle
                        className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-indigo-500' : 'text-emerald-500'}`}
                      />
                      {feature}
                    </li>
                  )
                )}
              </ul>

              {isCurrent ? (
                <div className="text-center py-3 bg-emerald-50 rounded-xl text-emerald-700 font-medium text-sm">
                  ✓ Current Plan
                </div>
              ) : url ? (
                <>
                  <a
                    href={url}
                    className={`block w-full text-center font-semibold py-3 px-6 rounded-xl transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isActive ? 'Switch to this plan' : `Get ${plan.name}`}
                  </a>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    {period === 'monthly'
                      ? 'Cancel anytime · 30-day money-back guarantee'
                      : `One payment of $${pr.billed} now · cancel anytime · 30-day money-back`}
                  </p>
                </>
              ) : (
                <div className="text-center py-3 bg-gray-50 rounded-xl text-gray-400 font-medium text-sm">
                  This term isn&apos;t available yet
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
