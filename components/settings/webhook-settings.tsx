'use client'

import { useState } from 'react'
import { Copy, CheckCircle, ExternalLink, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  webhookUrl: string
  hasSecret: boolean
}

export function WebhookSettings({ webhookUrl, hasSecret }: Props) {
  const [copied, setCopied] = useState(false)
  const [webhookSecret, setWebhookSecret] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function copyUrl() {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave() {
    if (!webhookSecret.startsWith('whsec_')) {
      setError('Webhook secret must start with whsec_')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/webhook-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookSecret }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSaved(true)
      setWebhookSecret('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Webhook Configuration</h2>
        {(hasSecret || saved) && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Webhook active
          </span>
        )}
      </div>

      {/* Webhook URL */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1.5">Your Webhook URL</p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
          <code className="text-xs text-gray-700 flex-1 break-all font-mono">{webhookUrl}</code>
          <button onClick={copyUrl} className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0">
            {copied
              ? <CheckCircle className="w-4 h-4 text-emerald-500" />
              : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <a
          href="https://dashboard.stripe.com/webhooks/create"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline mt-2"
        >
          Add this URL in Stripe → Developers → Webhooks
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Webhook secret */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">{hasSecret || saved ? 'Update Signing Secret' : 'Paste Signing Secret'}</p>
        <p className="text-xs text-gray-400 mb-2">
          {hasSecret || saved
            ? 'Your webhook is verified. Paste a new secret below to update it.'
            : 'After adding the endpoint in Stripe, copy the Signing secret and paste here.'}
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="whsec_..."
            value={webhookSecret}
            onChange={e => setWebhookSecret(e.target.value)}
            className="font-mono text-sm flex-1"
          />
          <Button onClick={handleSave} disabled={saving || !webhookSecret} size="sm">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        {saved && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Saved! Webhook is now verified.</p>}
      </div>

      {!hasSecret && !saved && (
        <div className="flex items-start gap-2 bg-indigo-50 rounded-lg p-3">
          <Shield className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-indigo-700">
            Subscribe to <strong>invoice.payment_failed</strong> and <strong>invoice.payment_succeeded</strong> events in Stripe.
          </p>
        </div>
      )}
    </div>
  )
}
