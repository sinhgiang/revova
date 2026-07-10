'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Sparkles, X, Check, ArrowRight, Loader2 } from 'lucide-react'

// Wraps a Pro-only feature. For non-Pro merchants the feature is shown (so they
// know it exists) but blurred + non-interactive. Clicking "Unlock with Pro"
// opens an upgrade modal with two choices:
//   1. Upgrade to Pro — one click straight to the secure Polar checkout.
//   2. See plan details — go to the pricing page.
const PRO_HIGHLIGHTS = [
  'Unlimited failed-payment recoveries',
  '12-month Lost Revenue Finder + win-back campaigns',
  'SMS recovery, 8 languages & cancel-flow retention',
  'Churn scoring, revenue forecast & weekly digest',
]

export function ProGate({ isPro, feature, children }: { isPro: boolean; feature: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isPro) return <>{children}</>

  async function upgrade() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/billing/checkout-url?plan=pro')
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Could not start the upgrade. Please try the billing page.')
        setLoading(false)
      }
    } catch {
      setError('Could not start the upgrade. Please try the billing page.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="relative">
        {/* The real feature, dimmed and disabled */}
        <div className="pointer-events-none select-none blur-[2px] opacity-50" aria-hidden>
          {children}
        </div>
        {/* Overlay button that opens the upgrade modal */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-[1px]">
          <div className="text-center bg-white border border-indigo-100 rounded-xl shadow-md px-6 py-5 max-w-xs">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="font-semibold text-gray-900 text-sm mb-1">{feature} is a Pro feature</p>
            <p className="text-xs text-gray-500 mb-3">Unlock it and recover even more revenue.</p>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Unlock with Pro
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => !loading && setOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-6 text-white">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                aria-label="Close"
                className="absolute right-4 top-4 text-white/70 hover:text-white disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                <Sparkles className="w-4 h-4" /> Revova Pro
              </div>
              <h3 className="text-xl font-bold leading-snug">Unlock {feature} — and everything in Pro</h3>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4">
                Upgrade and get <strong className="text-gray-900">instant access</strong> to this and every Pro
                feature — you keep it the moment you upgrade.
              </p>
              <ul className="space-y-2 mb-5">
                {PRO_HIGHLIGHTS.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-gray-900">$79</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Instant access · cancel anytime · 30-day money-back guarantee
                </p>
              </div>

              {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}

              <button
                onClick={upgrade}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Taking you to secure checkout…</>
                ) : (
                  <>Upgrade to Pro <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <Link
                href="/pricing"
                className="mt-2 block w-full text-center rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                See full plan details
              </Link>

              <p className="mt-3 text-center text-[11px] leading-4 text-gray-400">
                You&apos;ll confirm payment on our secure checkout — no charge until you do.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
