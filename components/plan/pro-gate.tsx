'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, Sparkles, X, Check, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

// Wraps a Pro-only feature. For non-Pro merchants the feature is shown (so they
// know it exists) but blurred + non-interactive. Clicking "Unlock with Pro"
// opens an upgrade modal that adapts to the customer:
//   • Already paying (card on file) → one-click instant upgrade: the prorated
//     difference is charged on their saved card and Pro unlocks immediately,
//     after a clear confirmation.
//   • On trial (no card) → sent to the secure checkout to enter a card.
const PRO_HIGHLIGHTS = [
  'Unlimited failed-payment recoveries',
  '12-month Lost Revenue Finder + win-back campaigns',
  'SMS recovery, 8 languages & cancel-flow retention',
  'Churn scoring, revenue forecast & weekly digest',
]

type Mode = 'loading' | 'instant' | 'checkout'

export function ProGate({ isPro, feature, children }: { isPro: boolean; feature: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('loading')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // Figure out which upgrade path applies when the modal opens.
  useEffect(() => {
    if (!open) return
    setMode('loading'); setError(''); setDone(false)
    fetch('/api/billing/upgrade-context')
      .then((r) => r.json())
      .then((d) => setMode(d.mode === 'instant' ? 'instant' : 'checkout'))
      .catch(() => setMode('checkout'))
  }, [open])

  if (isPro) return <>{children}</>

  async function toCheckout() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/billing/checkout-url?plan=pro')
      const data = await res.json()
      if (res.ok && data.url) { window.location.href = data.url; return }
      setError(data.error || 'Could not open checkout. Try the billing page.')
    } catch { setError('Could not open checkout. Try the billing page.') }
    setBusy(false)
  }

  async function instantUpgrade() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/billing/upgrade', { method: 'POST' })
      const data = await res.json()
      if (data.upgraded) {
        setDone(true)
        setTimeout(() => window.location.reload(), 1400) // re-render with Pro unlocked
        return
      }
      if (data.needsCheckout) { await toCheckout(); return }
      setError(data.message || 'The upgrade could not be completed.')
    } catch { setError('The upgrade could not be completed. Please try again.') }
    setBusy(false)
  }

  const primaryAction = mode === 'instant' ? instantUpgrade : toCheckout

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none select-none blur-[2px] opacity-50" aria-hidden>{children}</div>
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"
          onClick={() => !busy && !done && setOpen(false)}>
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-6 text-white">
              {!busy && !done && (
                <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 text-white/70 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                <Sparkles className="w-4 h-4" /> Revova Pro
              </div>
              <h3 className="text-xl font-bold leading-snug">Unlock {feature} — and everything in Pro</h3>
            </div>

            <div className="px-6 py-5">
              {done ? (
                <div className="py-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-gray-900 text-lg">You&apos;re on Pro! 🎉</p>
                  <p className="text-sm text-gray-500 mt-1">Unlocking everything…</p>
                </div>
              ) : (
                <>
                  <ul className="space-y-2 mb-5">
                    {PRO_HIGHLIGHTS.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-gray-900">$79</span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Cancel anytime · 30-day money-back guarantee</p>
                  </div>

                  {/* Mode-specific notice */}
                  {mode === 'loading' && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4"><Loader2 className="w-4 h-4 animate-spin" /> Checking your account…</div>
                  )}
                  {mode === 'instant' && (
                    <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3.5 py-3 mb-4 text-[13px] leading-5 text-amber-900">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span>You have a card on file. Upgrading <strong>charges the prorated difference for the rest of this month now</strong> — and you unlock all of Pro <strong>instantly</strong>.</span>
                    </div>
                  )}
                  {mode === 'checkout' && (
                    <p className="text-[13px] leading-5 text-gray-500 mb-4">You&apos;ll confirm payment on our secure checkout — Pro unlocks the moment you do.</p>
                  )}

                  {error && <p className="flex items-start gap-1.5 text-sm text-rose-600 mb-3"><AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}</p>}

                  <button onClick={primaryAction} disabled={busy || mode === 'loading'}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60">
                    {busy ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {mode === 'instant' ? 'Upgrading…' : 'Opening checkout…'}</>
                    ) : mode === 'instant' ? (
                      <>Upgrade &amp; unlock now <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Upgrade to Pro <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>

                  <Link href="/pricing" className="mt-2 block w-full text-center rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    See full plan details
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
