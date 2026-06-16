'use client'
import { useState } from 'react'
import { Check, Zap } from 'lucide-react'

interface Props {
  plan: 'starter' | 'pro'
  periodEnd: string | null
}

const STARTER_FEATURES = [
  'Up to 50 failed payments/month',
  '4-email recovery sequence',
  'AI-personalized emails',
  'Stripe webhook integration',
  'Email tracking (opens & clicks)',
  'Basic analytics',
]

const PRO_FEATURES = [
  'Unlimited failed payments',
  '5-email recovery sequence',
  'AI-personalized emails',
  'Stripe webhook integration',
  'Email tracking (opens & clicks)',
  'Advanced analytics',
  'Custom SMTP (your email domain)',
  'Custom email timing',
  'Outbound webhooks',
  'Cancel flow page',
  'Email blacklist',
  'Priority support',
]

export function BillingClient({ plan, periodEnd }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/create-checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleManage() {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const isPro = plan === 'pro'

  return (
    <div className="space-y-6">
      {/* Current plan banner */}
      <div className={`rounded-xl p-5 border ${isPro ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current plan</p>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-xl font-bold text-gray-900">{isPro ? 'Pro' : 'Starter'}</h2>
              {isPro && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  <Zap className="w-3 h-3" />Active
                </span>
              )}
            </div>
            {isPro && periodEnd && (
              <p className="text-xs text-gray-500 mt-1">
                Renews {new Date(periodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          {isPro && (
            <button
              onClick={handleManage}
              disabled={loading}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 underline disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Manage billing →'}
            </button>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Starter */}
        <div className={`bg-white rounded-xl border p-6 shadow-sm ${!isPro ? 'border-gray-300' : 'border-gray-100'}`}>
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-lg">Starter</h3>
            {!isPro && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Current</span>}
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900">$0</span>
            <span className="text-gray-500 text-sm">/mo</span>
          </div>
          <ul className="space-y-2 mb-6">
            {STARTER_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          {!isPro ? (
            <div className="text-sm text-center text-gray-400 py-2">Your current plan</div>
          ) : null}
        </div>

        {/* Pro */}
        <div className={`bg-white rounded-xl border p-6 shadow-sm relative overflow-hidden ${isPro ? 'border-indigo-300' : 'border-indigo-200'}`}>
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-lg">Pro</h3>
            {isPro && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Current</span>}
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900">$79</span>
            <span className="text-gray-500 text-sm">/mo</span>
          </div>
          <ul className="space-y-2 mb-6">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          {!isPro && (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirecting…' : 'Upgrade to Pro →'}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Secure billing powered by Stripe. Cancel anytime. Questions?{' '}
        <a href="mailto:support@revova.io" className="text-indigo-500 hover:underline">support@revova.io</a>
      </p>
    </div>
  )
}
