'use client'

import { useState } from 'react'
import { Copy, CheckCircle, Plug, ExternalLink } from 'lucide-react'

interface Props {
  userId: string
  appUrl: string
  connectedProcessors: string[]
}

// Each field maps to a generic payment_connections column. Different processors
// need different credentials — the recovery CORE is identical, only the
// connection form differs.
type Field = {
  key: string
  label: string
  type?: 'text' | 'password' | 'select'
  placeholder?: string
  help?: string
  optional?: boolean
  options?: { value: string; label: string }[]
}

type Proc = {
  id: string
  name: string
  status: 'live' | 'beta' | 'soon'
  blurb: string
  docsUrl: string
  fields: Field[]
}

const PROCESSORS: Proc[] = [
  {
    id: 'paddle', name: 'Paddle', status: 'live',
    blurb: 'Merchant of Record — great for global indie SaaS',
    docsUrl: 'https://developer.paddle.com/webhooks/overview',
    fields: [
      { key: 'businessName', label: 'Business name', placeholder: 'e.g. Acme Inc.', help: 'Shown in every recovery email' },
      { key: 'api_key', label: 'API key', type: 'password', placeholder: 'pdl_live_...', help: 'Paddle → Developer Tools → Authentication' },
      { key: 'webhook_secret', label: 'Webhook signing secret', type: 'password', placeholder: 'pdl_ntfset_...', help: 'Paddle → Notifications → your destination → Secret key' },
    ],
  },
  {
    id: 'braintree', name: 'Braintree', status: 'live',
    blurb: 'PayPal — for larger businesses. More credentials, same recovery engine.',
    docsUrl: 'https://developer.paypal.com/braintree/docs/guides/webhooks/overview',
    fields: [
      { key: 'businessName', label: 'Business name', placeholder: 'e.g. Acme Inc.', help: 'Shown in every recovery email' },
      { key: 'site', label: 'Merchant ID', placeholder: 'Your Braintree merchant ID', help: 'Braintree → Settings → API Keys' },
      { key: 'api_key', label: 'Public key', type: 'password', placeholder: 'Public key' },
      { key: 'api_secret', label: 'Private key', type: 'password', placeholder: 'Private key' },
      { key: 'webhook_secret', label: 'Environment', type: 'select', options: [{ value: 'sandbox', label: 'Sandbox (testing)' }, { value: 'production', label: 'Production (live)' }] },
      { key: 'card_update_url', label: 'Your card-update URL', placeholder: 'https://yourapp.com/billing?sub={id}', help: 'Where customers update their card. Use {id} to insert the subscription id. Braintree has no hosted page, so this is your own billing portal.' },
    ],
  },
  {
    id: 'chargebee', name: 'Chargebee', status: 'live',
    blurb: 'Subscription management platform',
    docsUrl: 'https://www.chargebee.com/docs/2.0/webhook_settings.html',
    fields: [
      { key: 'businessName', label: 'Business name', placeholder: 'e.g. Acme Inc.', help: 'Shown in every recovery email' },
      { key: 'site', label: 'Chargebee site', placeholder: 'acme', help: 'The subdomain in acme.chargebee.com' },
      { key: 'api_key', label: 'API key', type: 'password', placeholder: 'live_...', help: 'Chargebee → Settings → API Keys (used to build the card-update page)' },
      { key: 'webhook_secret', label: 'Webhook Basic Auth (user:pass)', type: 'password', placeholder: 'username:password', help: 'Set Basic Auth on your Chargebee webhook, then enter it here as user:pass' },
      { key: 'card_update_url', label: 'Fallback portal URL', placeholder: 'https://acme.chargebee.com/portal', help: 'Optional — used only if the hosted page can\'t be generated', optional: true },
    ],
  },
  {
    id: 'recurly', name: 'Recurly', status: 'live',
    blurb: 'Subscription billing',
    docsUrl: 'https://recurly.com/developers/guides/webhooks.html',
    fields: [
      { key: 'businessName', label: 'Business name', placeholder: 'e.g. Acme Inc.', help: 'Shown in every recovery email' },
      { key: 'site', label: 'Recurly subdomain', placeholder: 'acme', help: 'The subdomain in acme.recurly.com' },
      { key: 'webhook_secret', label: 'Webhook Basic Auth (user:pass)', type: 'password', placeholder: 'username:password', help: 'Set HTTP Basic Auth on your Recurly webhook endpoint, then enter it here' },
      { key: 'card_update_url', label: 'Your card-update URL', placeholder: 'https://acme.recurly.com/account/{account}', help: 'Where customers update their card. Use {account} or {id} as a placeholder.' },
    ],
  },
]

export function ProcessorConnectionSettings({ userId, appUrl, connectedProcessors }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const webhookUrl = active ? `${appUrl}/api/pwebhook/${active}/${userId}` : ''

  function set(key: string, v: string) {
    setValues(prev => ({ ...prev, [key]: v }))
  }

  function openProc(p: Proc) {
    if (p.status === 'soon') return
    if (active === p.id) { setActive(null); return }
    setActive(p.id)
    setError('')
    // Pre-fill sensible defaults (e.g. environment)
    const defaults: Record<string, string> = {}
    p.fields.forEach(f => { if (f.type === 'select' && f.options?.[0]) defaults[f.key] = f.options[0].value })
    setValues(defaults)
  }

  async function handleConnect(p: Proc) {
    setError('')
    // Required = every field except business name and fields marked optional
    const missing = p.fields.filter(f => f.key !== 'businessName' && !f.optional && !((values[f.key] ?? '').trim()))
    if (missing.length) {
      setError(`Please fill in: ${missing.map(m => m.label).join(', ')}`)
      return
    }
    setSaving(true)
    try {
      const payload: Record<string, string> = { processor: p.id }
      p.fields.forEach(f => {
        const v = (values[f.key] ?? '').trim()
        if (v) payload[f.key === 'businessName' ? 'businessName' : f.key] = v
      })
      const res = await fetch('/api/processors/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to connect')
      setSaved(true)
      setValues({})
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to connect')
    } finally {
      setSaving(false)
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Plug className="w-4 h-4 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">Other Payment Processors</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Already on Stripe? You&apos;re all set. Using a different processor? Connect it here — each runs on its own isolated pipeline, so nothing affects your Stripe setup.
      </p>

      <div className="space-y-3">
        {PROCESSORS.map(p => {
          const connected = connectedProcessors.includes(p.id)
          const isOpen = active === p.id
          return (
            <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => openProc(p)}
                disabled={p.status === 'soon'}
                className={`w-full flex items-center justify-between px-4 py-3 text-left ${p.status !== 'soon' ? 'hover:bg-gray-50' : 'opacity-60 cursor-not-allowed'}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{p.name}</span>
                    {connected && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Connected</span>}
                    {p.status === 'beta' && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Beta · test first</span>}
                    {p.status === 'soon' && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Coming soon</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{p.blurb}</p>
                </div>
                {p.status !== 'soon' && <span className="text-gray-400 text-sm">{isOpen ? '−' : '+'}</span>}
              </button>

              {isOpen && p.status !== 'soon' && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-50">
                  {/* Webhook URL */}
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Add this webhook URL in {p.name}</p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <code className="text-xs text-gray-700 flex-1 break-all font-mono">{webhookUrl}</code>
                      <button onClick={copyUrl} className="text-gray-400 hover:text-indigo-600 flex-shrink-0">
                        {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic credential fields */}
                  {p.fields.map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {f.label}{f.key === 'businessName' && <span className="text-gray-400 font-normal"> (optional)</span>}
                      </label>
                      {f.type === 'select' ? (
                        <select
                          value={values[f.key] ?? ''}
                          onChange={e => set(f.key, e.target.value)}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type === 'password' ? 'password' : 'text'}
                          value={values[f.key] ?? ''}
                          onChange={e => set(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className={`w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300 ${f.type === 'password' ? 'font-mono' : ''}`}
                        />
                      )}
                      {f.help && <p className="text-xs text-gray-400 mt-1">{f.help}</p>}
                    </div>
                  ))}

                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <div className="flex items-center justify-between">
                    {p.docsUrl && (
                      <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1">
                        {p.name} webhook docs <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => handleConnect(p)}
                      disabled={saving}
                      className="ml-auto px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Connecting…' : saved ? '✓ Connected' : 'Connect'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
