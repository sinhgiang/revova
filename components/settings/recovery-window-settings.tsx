'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface Props {
  currentWindowDays: number
  currentSmartRetry: boolean
}

export function RecoveryWindowSettings({ currentWindowDays, currentSmartRetry }: Props) {
  const [windowDays, setWindowDays] = useState(currentWindowDays || 30)
  const [smartRetry, setSmartRetry] = useState(currentSmartRetry)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/stripe/update-recovery-window', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ windowDays, smartRetry }),
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
      <p className="text-sm text-gray-500 mb-5">
        How long Revova keeps automatically retrying the charge after a payment fails. Within this window we re-attempt the card <strong>every day</strong> for recoverable declines (like insufficient funds) — not just when an email goes out.
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
        <p className="text-xs text-gray-400 mt-1">Longer windows recover more revenue but keep retrying cards for longer.</p>
      </div>

      <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
        <div className="pr-4">
          <p className="text-sm font-medium text-gray-900">Smart retry timing</p>
          <p className="text-xs text-gray-400">Concentrate retries on payday windows (start &amp; middle of month) when banks are most likely to approve — instead of every day.</p>
        </div>
        <button
          onClick={() => setSmartRetry(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${smartRetry ? 'bg-emerald-500' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${smartRetry ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
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
