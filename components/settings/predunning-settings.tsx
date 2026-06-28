'use client'

import { useState } from 'react'
import { CalendarClock } from 'lucide-react'

interface Props {
  currentEnabled: boolean
}

export function PredunningSettings({ currentEnabled }: Props) {
  const [enabled, setEnabled] = useState(currentEnabled)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/stripe/update-predunning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
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
        <CalendarClock className="w-4 h-4 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">Pre-Dunning (Card Expiry)</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Revova watches your active subscriptions and emails customers <strong>before</strong> their card expires — preventing the failed payment from ever happening. Cards expiring this month or next are flagged in your dashboard.
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Enable pre-dunning emails</p>
          <p className="text-xs text-gray-400">Proactive reminders for soon-to-expire cards</p>
        </div>
        <button
          onClick={() => setEnabled(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
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
