'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface Props {
  currentWindowDays: number
  // Kept for backward compat with the caller — smart (payday-windowed) timing
  // is now always on, it's no longer a per-merchant choice. See the retry
  // block in app/api/cron/follow-up/route.ts for why: once total attempts are
  // capped (card-network limits), there's no upside to ever firing off a
  // payday window, so the toggle was removed rather than left as a no-op.
  currentSmartRetry?: boolean
}

export function RecoveryWindowSettings({ currentWindowDays }: Props) {
  const [windowDays, setWindowDays] = useState(currentWindowDays || 30)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/stripe/update-recovery-window', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ windowDays, smartRetry: true }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <RefreshCw className="w-4 h-4 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">Recovery Window</h2>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        How long Revova keeps automatically retrying the charge after a payment fails, for recoverable declines (like insufficient funds) — not just when an email goes out.
      </p>
      <p className="text-sm text-gray-500 mb-5">
        Retries are capped at <strong>8 attempts</strong> and concentrated on payday windows (start &amp; middle of month, when banks are most likely to approve) — never daily. This keeps every card safely under Stripe's and Visa's own retry limits, so recoverable cards don't get flagged as fraud from being charged too often.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Keep retrying for</label>
        <select
          value={windowDays}
          onChange={e => setWindowDays(Number(e.target.value))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
        >
          <option value={14}>14 days</option>
          <option value={21}>21 days</option>
          <option value={30}>30 days (recommended)</option>
          <option value={45}>45 days</option>
          <option value={60}>60 days</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">Longer windows give more payday windows a chance to land, but the 8-attempt cap still applies.</p>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
