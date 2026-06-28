'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'

interface Props {
  userId: string
  currentTier: string
  currentName: string
  features: Record<string, boolean>
}

const TOGGLES: [string, string][] = [
  ['predunning_enabled', 'Pre-dunning'],
  ['notify_on_recovery', 'Recovery email alerts'],
  ['weekly_summary_enabled', 'Weekly digest'],
  ['winback_enabled', 'Winback (Pro)'],
  ['cancel_flow_enabled', 'Cancel flow (Pro)'],
  ['sms_enabled', 'SMS recovery (Pro)'],
]

export function MerchantActions({ userId, currentTier, currentName, features }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [done, setDone] = useState('')
  const [name, setName] = useState(currentName)

  async function act(action: string, value: any, key: string) {
    setBusy(key)
    setDone('')
    try {
      const res = await fetch('/api/admin/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantUserId: userId, action, value }),
      })
      const data = await res.json()
      if (res.ok) { setDone(data.label || 'Done'); router.refresh() }
      else setDone(data.error || 'Failed')
    } catch { setDone('Failed') }
    finally { setBusy(null) }
  }

  const btn = (label: string, action: string, value: any, key: string, cls: string) => (
    <button onClick={() => act(action, value, key)} disabled={busy !== null}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${cls}`}>
      {busy === key ? <Loader2 className="w-4 h-4 animate-spin inline" /> : label}
    </button>
  )

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900">Admin actions</h3>
        {done && <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><Check className="w-3.5 h-3.5" />{done}</span>}
      </div>
      <p className="text-xs text-gray-500 mb-4">Every change here is recorded in the audit log.</p>

      {/* Plan */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Plan (current: {currentTier})</p>
        <div className="flex flex-wrap gap-2">
          {btn('Comp to Pro', 'set_plan', 'pro', 'pro', 'bg-purple-100 text-purple-700 hover:bg-purple-200')}
          {btn('Comp to Starter', 'set_plan', 'starter', 'starter', 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200')}
          {btn('Remove plan', 'set_plan', 'none', 'none', 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          {btn('Reset trial (14d)', 'reset_trial', null, 'trial', 'bg-amber-100 text-amber-700 hover:bg-amber-200')}
        </div>
      </div>

      {/* Business name */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Business name</p>
        <div className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          {btn('Save', 'set_business_name', name, 'name', 'bg-gray-900 text-white hover:bg-gray-800')}
        </div>
      </div>

      {/* Feature toggles */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Toggle features</p>
        <div className="grid grid-cols-2 gap-2">
          {TOGGLES.map(([field, label]) => {
            const on = !!features[field]
            return (
              <button key={field} onClick={() => act('toggle', { field, on: !on }, field)} disabled={busy !== null}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-50 ${on ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <span>{label}</span>
                <span className="text-xs font-semibold">{busy === field ? '…' : on ? 'ON' : 'OFF'}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
