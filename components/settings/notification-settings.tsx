'use client'
import { useState } from 'react'
import { Bell } from 'lucide-react'

interface Props {
  enabled: boolean
}

export function NotificationSettings({ enabled }: Props) {
  const [checked, setChecked] = useState(enabled)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function toggle() {
    const next = !checked
    setChecked(next)
    setSaving(true)
    try {
      await fetch('/api/stripe/update-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifyOnRecovery: next }),
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
        <Bell className="w-4 h-4 text-gray-500" />
        <h2 className="font-semibold text-gray-900">Merchant Notifications</h2>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Email me when a payment is recovered</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Receive an email at your account address each time Revova recovers a failed payment.
          </p>
        </div>
        <button
          onClick={toggle}
          disabled={saving}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            checked ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {saved && <p className="text-xs text-emerald-600 mt-2">Saved!</p>}
    </div>
  )
}
