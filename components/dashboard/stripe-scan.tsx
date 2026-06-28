'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Loader2, Search, RefreshCw, AlertCircle, CreditCard, Lock,
  Sparkles, ChevronDown, ChevronUp, TrendingDown, ShieldCheck,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

type Bucket = { count: number; amount: number }
type ScanData = {
  failedCount: number
  recoverable: number
  currency: string
  expiringCount: number
  activeCount: number
  periods: { d30: Bucket; m3: Bucket; y1: Bucket }
  actionableDays: number
  tier: string
  isPro: boolean
}

const CACHE_KEY = 'revova_scan_cache_v2'
const COLLAPSE_KEY = 'revova_scan_collapsed'
const CACHE_TTL = 10 * 60 * 1000 // 10 min — avoid re-hitting Stripe on every mount

// The three periods shown on the board. `needDays` = how far back a plan must be
// able to act before this period is unlocked (matches ACTIONABLE_DAYS on the API).
const PERIODS: { key: keyof ScanData['periods']; label: string; needDays: number }[] = [
  { key: 'd30', label: 'Last 30 days', needDays: 30 },
  { key: 'm3', label: 'Last 3 months', needDays: 90 },
  { key: 'y1', label: 'Last 12 months', needDays: 365 },
]

const EMPTY: ScanData['periods'] = { d30: { count: 0, amount: 0 }, m3: { count: 0, amount: 0 }, y1: { count: 0, amount: 0 } }

export function StripeScan() {
  const [data, setData] = useState<ScanData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  const scan = useCallback(async (force = false) => {
    // Serve from a short session cache unless the user forces a fresh scan.
    if (!force) {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY)
        if (raw) {
          const { d, ts } = JSON.parse(raw)
          if (Date.now() - ts < CACHE_TTL) { setData(d); return }
        }
      } catch { /* ignore bad cache */ }
    }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/stripe/scan', { method: 'POST' })
      const json = await res.json()
      if (res.ok) {
        setData(json)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ d: json, ts: Date.now() })) } catch { /* quota */ }
        // First-ever scan: collapse on the NEXT visit so returning users get a
        // tidy dashboard, while brand-new users see it fully open right now.
        try { if (localStorage.getItem(COLLAPSE_KEY) === null) localStorage.setItem(COLLAPSE_KEY, '1') } catch { /* ignore */ }
      } else setError(json.error || 'Scan failed')
    } catch { setError('Could not scan your Stripe account') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1') } catch { /* ignore */ }
    scan(false)
  }, [scan])

  function toggle() {
    setCollapsed(prev => {
      const next = !prev
      try { localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0') } catch { /* ignore */ }
      return next
    })
  }

  const periods = data?.periods ?? EMPTY
  const currency = data?.currency ?? 'usd'
  const actionableDays = data?.actionableDays ?? 30
  const yearLost = periods.y1.amount
  const hasNow = (data?.failedCount ?? 0) > 0 || (data?.expiringCount ?? 0) > 0
  const hasAnyLoss = periods.y1.count > 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm mb-8 overflow-hidden">
      {/* ── Header (always visible, click to collapse/expand) ── */}
      <button
        onClick={toggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <TrendingDown className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900 leading-tight">Lost Revenue Finder</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {loading
              ? 'Scanning your Stripe account…'
              : hasAnyLoss
                ? <>You lost <span className="font-semibold text-red-600">{formatCurrency(yearLost, currency)}</span> to failed payments in the last 12 months</>
                : 'Find revenue you lost to failed payments — and win it back'}
          </p>
        </div>
        {collapsed
          ? <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          : <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>

      {!collapsed && (
        <div className="px-5 pb-5 pt-1">
          {error && (
            <p className="text-sm text-red-600 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          {/* ── Period cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {PERIODS.map(p => {
              const b = periods[p.key]
              const unlocked = actionableDays >= p.needDays
              const recover = Math.round(b.amount * 0.5)
              return (
                <div
                  key={p.key}
                  className={`relative rounded-lg border p-4 ${unlocked ? 'border-gray-200 bg-gray-50/60' : 'border-purple-200 bg-purple-50/40'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{p.label}</p>
                    {!unlocked && <Lock className="w-3.5 h-3.5 text-purple-500" />}
                  </div>

                  {/* The number — blurred + overlaid with an upgrade CTA when locked */}
                  <div className="relative">
                    <div className={!unlocked ? 'blur-[6px] select-none pointer-events-none' : ''}>
                      <p className="text-2xl font-bold text-gray-900 leading-none">
                        {formatCurrency(b.amount, currency)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5">
                        {b.count} failed payment{b.count === 1 ? '' : 's'}
                      </p>
                      {unlocked && b.amount > 0 && (
                        <p className="text-xs font-medium text-emerald-700 mt-0.5">
                          ~{formatCurrency(recover, currency)} recoverable
                        </p>
                      )}
                    </div>

                    {!unlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <Link
                          href="/billing"
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-white/90 border border-purple-200 rounded-full px-3 py-1.5 shadow-sm hover:bg-white"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Upgrade to reveal
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Recoverable right now (live failures) ── */}
          {hasNow && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 mb-4">
              {(data?.failedCount ?? 0) > 0 && (
                <span className="text-sm text-gray-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <strong>{data!.failedCount}</strong> failing subs —{' '}
                  <strong className="text-emerald-700">{formatCurrency(data!.recoverable, currency)}</strong> recoverable now
                </span>
              )}
              {(data?.expiringCount ?? 0) > 0 && (
                <span className="text-sm text-gray-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <strong>{data!.expiringCount}</strong> cards expiring soon
                </span>
              )}
            </div>
          )}

          {/* ── Healthy note when a completed scan found nothing ── */}
          {data && !loading && !hasAnyLoss && !hasNow && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 mb-4">
              <ShieldCheck className="w-4 h-4" />
              All clear — no failed payments found. Revova watches 24/7 and recovers new failures automatically.
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => scan(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning…</>
                : data
                  ? <><RefreshCw className="w-4 h-4" /> Scan again</>
                  : <><Search className="w-4 h-4" /> Scan now</>}
            </button>

            {hasAnyLoss && (
              <Link
                href="/recover"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
              >
                <Sparkles className="w-4 h-4" /> Recover these customers →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
