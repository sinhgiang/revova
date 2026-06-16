'use client'
import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

interface Props {
  enabled: boolean
  discountCode: string | null
}

export function WinbackSettings({ enabled, discountCode }: Props) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [code, setCode] = useState(discountCode ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(newEnabled: boolean, newCode: string) {
    setSaving(true)
    try {
      await fetch('/api/stripe/update-winback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled, discountCode: newCode }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <RotateCcw className="w-4 h-4 text-gray-500" />
        <h2 className="font-semibold text-gray-900">Winback Campaigns</h2>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Pro Feature</span>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Automatically email customers who cancelled their subscription to win them back. Revova sends 3 AI-personalized emails on Day 3, Day 14, and Day 30 after cancellation.
      </p>

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-gray-900">Enable winback emails</p>
          <p className="text-xs text-gray-400 mt-0.5">Send re-engagement emails to customers who cancelled</p>
        </div>
        <button
          onClick={() => { setIsEnabled(!isEnabled); save(!isEnabled, code) }}
          disabled={saving}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {isEnabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Comeback discount code <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="e.g. COMEBACK20"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => save(isEnabled, code)}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            If set, the Day 30 email will include this Stripe discount code to incentivize reactivation.
          </p>
        </div>
      )}

      {saved && <p className="text-xs text-emerald-600 mt-3">Saved!</p>}

      {isEnabled && (
        <div className="mt-5 bg-purple-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-purple-800 mb-2">Winback sequence</p>
          <div className="space-y-1.5">
            {[
              { day: 'Day 3', text: '"We miss you" — warm, no hard sell' },
              { day: 'Day 14', text: '"Here\'s what you\'re missing" — value reminder' },
              { day: 'Day 30', text: '"Come back with a special offer" — last chance' },
            ].map(({ day, text }) => (
              <div key={day} className="flex items-center gap-2 text-xs text-purple-700">
                <span className="font-semibold w-12">{day}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
