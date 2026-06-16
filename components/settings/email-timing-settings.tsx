'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'

interface Props {
  currentTiming: number[] | null
}

const DEFAULT_TIMING = [2, 4, 7, 7]
const LABELS = ['Email 1 → Email 2', 'Email 2 → Email 3', 'Email 3 → Email 4', 'Email 4 → Email 5']

export function EmailTimingSettings({ currentTiming }: Props) {
  const [timing, setTiming] = useState<number[]>(currentTiming ?? DEFAULT_TIMING)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateDay(index: number, value: string) {
    const n = Math.max(1, Math.min(30, parseInt(value) || 1))
    setTiming(prev => prev.map((d, i) => (i === index ? n : d)))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/stripe/update-timing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timingDays: timing }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Compute cumulative days for display
  const cumulative = timing.reduce<number[]>((acc, d, i) => {
    acc.push((acc[i - 1] ?? 0) + d)
    return acc
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-amber-500" />
        <h2 className="font-semibold text-gray-900">Custom Email Timing</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Set how many days to wait between each recovery email. Email 1 always sends immediately on payment failure.
      </p>

      <div className="space-y-3">
        {LABELS.map((label, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-sm text-gray-500 flex-1">{label}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={timing[i]}
                onChange={e => updateDay(i, e.target.value)}
                className="w-16 text-sm text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-400">days</span>
              <span className="text-xs text-gray-300 w-16">= Day {cumulative[i]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setTiming(DEFAULT_TIMING)}
          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Reset to default (2, 4, 7, 7)
        </button>
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
