'use client'

import { useState } from 'react'
import { Webhook } from 'lucide-react'

interface Props {
  currentUrl: string | null
}

export function OutboundWebhookSettings({ currentUrl }: Props) {
  const [url, setUrl] = useState(currentUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState<{ ok: boolean; msg: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/stripe/update-outbound-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: url.trim() || null }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestMsg(null)
    try {
      const res = await fetch('/api/outbound-webhook/test', { method: 'POST' })
      const data = await res.json()
      setTestMsg(res.ok ? { ok: true, msg: 'Webhook delivered successfully!' } : { ok: false, msg: data.error })
    } catch {
      setTestMsg({ ok: false, msg: 'Failed to deliver webhook' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Webhook className="w-4 h-4 text-violet-500" />
        <h2 className="font-semibold text-gray-900">Outbound Webhook</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Revova will POST to this URL every time a payment is recovered — useful for triggering your own automations.
      </p>

      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://yourapp.com/webhooks/payment-recovered"
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
      />

      <div className="mt-2 bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 font-mono">POST {`{ "event": "payment.recovered", "data": { "customerEmail", "amount", "currency", ... } }`}</p>
      </div>

      {testMsg && (
        <p className={`mt-3 text-xs px-3 py-2 rounded-lg ${testMsg.ok ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          {testMsg.msg}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 justify-end">
        {(currentUrl || url) && (
          <button onClick={handleTest} disabled={testing}
            className="text-sm text-indigo-600 border border-indigo-200 px-4 py-1.5 rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors">
            {testing ? 'Sending…' : 'Send test'}
          </button>
        )}
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
