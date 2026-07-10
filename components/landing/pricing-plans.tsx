'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Shield, Lock } from 'lucide-react'
import { PERIOD_META, PRICING, fmtPrice, billedMathLabel, type Period } from '@/lib/pricing'

// Public pricing cards with a monthly / 6-month / annual selector, shared by the
// homepage pricing section and the /pricing page so they never drift. CTAs go to
// signup (purchase happens in-app after the free trial). Copy is honest — no
// fabricated recovery amounts or ROI multiples.

const STARTER_FEATURES = [
  'Up to 50 failed payment recoveries/mo',
  'Lost Revenue Finder — scan + win back 90 days',
  'AI-personalized 4-email sequence (Day 1→3→7→14)',
  'Daily smart payment auto-retry',
  'Pre-dunning expiry alerts',
  'Works with 5 payment processors',
  'Slack & Telegram alerts + in-app banner',
  'Past / Now / Upcoming dashboard',
  'GDPR export & delete tools',
]

const PRO_FEATURES = [
  'Everything in Starter, plus:',
  'Unlimited failed payment recoveries',
  'Lost Revenue Finder — full 12-month scan + win-back',
  'AI-personalized 5-email sequence (Day 1→3→7→14→21)',
  'SMS recovery + hard/soft decline routing',
  'Recovery emails in 8 languages',
  'Winback campaigns (Day 3, 14, 30)',
  'In-app cancel flow + A/B testing',
  '1-month-free + LTV retention offers',
  'Churn risk scoring',
  'Open/click analytics + revenue forecast',
  'Weekly digest + priority support',
]

export function PricingPlans() {
  const [period, setPeriod] = useState<Period>('6month')
  const starter = PRICING.starter[period]
  const pro = PRICING.pro[period]

  return (
    <div>
      {/* Billing-term tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-2xl bg-gray-100 p-1.5">
          {PERIOD_META.map((p) => {
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

      <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
        {/* Starter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Starter</p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-5xl font-black text-gray-900">${fmtPrice(starter.perMonth)}</span>
            <span className="text-gray-400 mb-2">/mo</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm text-gray-500">{billedMathLabel(period, starter.perMonth, starter.billed)}</span>
            {starter.save ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                Save {starter.save}%
              </span>
            ) : null}
          </div>
          <p className="text-gray-500 text-sm mb-5">Perfect for indie hackers just starting out</p>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-emerald-800">
              Recover just <strong>one failed payment</strong> and Revova pays for itself — and we never take a
              commission on what you keep.
            </p>
          </div>

          <ul className="space-y-2.5 mb-8">
            {STARTER_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="block w-full text-center bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Start my free trial
          </Link>
        </div>

        {/* Pro */}
        <div className="bg-white rounded-2xl border-2 border-indigo-500 p-8 shadow-xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              Most Popular
            </span>
          </div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Pro</p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-5xl font-black text-gray-900">${fmtPrice(pro.perMonth)}</span>
            <span className="text-gray-400 mb-2">/mo</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm text-gray-500">{billedMathLabel(period, pro.perMonth, pro.billed)}</span>
            {pro.save ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                Save {pro.save}%
              </span>
            ) : null}
          </div>
          <p className="text-gray-500 text-sm mb-5">For SaaS companies growing fast</p>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-indigo-800">
              Flat monthly price — <strong>no commission, ever</strong>. You keep 100% of every dollar Revova recovers
              for you.
            </p>
          </div>

          <ul className="space-y-2.5 mb-8">
            {PRO_FEATURES.map((f) =>
              f.endsWith('plus:') ? (
                <li key={f} className="text-sm font-bold text-gray-900">
                  {f}
                </li>
              ) : (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  {f}
                </li>
              )
            )}
          </ul>
          <Link
            href="/signup"
            className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200"
          >
            Start my free trial
          </Link>
        </div>
      </div>

      {/* Guarantees */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {[
          { icon: Shield, text: '30-day money-back guarantee' },
          { icon: Lock, text: 'No credit card to start' },
          { icon: CheckCircle, text: 'Cancel anytime, instantly' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-gray-500 text-sm whitespace-nowrap">
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
