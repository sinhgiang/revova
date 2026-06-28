'use client'

import { useState } from 'react'
import { ShieldCheck, Copy } from 'lucide-react'

interface Props {
  userId: string
  appUrl: string
  currentEnabled: boolean
  currentDiscountCode: string | null
  currentPauseMonths: number
  currentGiftEnabled: boolean
  currentAbEnabled: boolean
  currentDiscountCodeB: string | null
}

export function CancelFlowSettings({
  userId,
  appUrl,
  currentEnabled,
  currentDiscountCode,
  currentPauseMonths,
  currentGiftEnabled,
  currentAbEnabled,
  currentDiscountCodeB,
}: Props) {
  const [enabled, setEnabled] = useState(currentEnabled)
  const [discountCode, setDiscountCode] = useState(currentDiscountCode ?? '')
  const [pauseMonths, setPauseMonths] = useState(currentPauseMonths || 1)
  const [giftEnabled, setGiftEnabled] = useState(currentGiftEnabled)
  const [abEnabled, setAbEnabled] = useState(currentAbEnabled)
  const [discountCodeB, setDiscountCodeB] = useState(currentDiscountCodeB ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const cancelUrl = `${appUrl}/cancel/${userId}?sub=STRIPE_SUBSCRIPTION_ID&return=YOUR_RETURN_URL`

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/stripe/update-cancel-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          discountCode: discountCode.trim() || null,
          pauseMonths,
          giftEnabled,
          abEnabled,
          discountCodeB: discountCodeB.trim() || null,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(cancelUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <h2 className="font-semibold text-gray-900">Cancel Flow</h2>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Pro</span>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        When customers click Cancel, redirect them to a Revova-hosted retention page that offers them a pause or discount before they leave.
      </p>

      {/* Enable toggle */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-gray-900">Enable cancel flow</p>
          <p className="text-xs text-gray-400">Show retention offers before customers cancel</p>
        </div>
        <button
          onClick={() => setEnabled(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className={`space-y-4 ${!enabled ? 'opacity-40 pointer-events-none' : ''}`}>
        {/* Pause option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pause offer (months)</label>
          <select
            value={pauseMonths}
            onChange={e => setPauseMonths(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value={1}>Pause for 1 month</option>
            <option value={2}>Pause for 2 months</option>
            <option value={3}>Pause for 3 months</option>
            <option value={0}>Don&apos;t offer pause</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">Customer's subscription will resume automatically after this period</p>
        </div>

        {/* Discount option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount code (optional)</label>
          <input
            type="text"
            value={discountCode}
            onChange={e => setDiscountCode(e.target.value)}
            placeholder="e.g. SAVE50 or coupon ID from Stripe"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
          />
          <p className="text-xs text-gray-400 mt-1">Enter a Stripe promotion code or coupon ID. Leave blank to not offer a discount.</p>
        </div>

        {/* Gift offer: 1 month free */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-sm font-medium text-gray-900">Offer 1 month free 🎉</p>
            <p className="text-xs text-gray-400">Strongest save offer — applies a 100%-off coupon for one month</p>
          </div>
          <button
            onClick={() => setGiftEnabled(v => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${giftEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${giftEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* A/B test */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">A/B test the discount offer</p>
              <p className="text-xs text-gray-400">Split customers 50/50 between two discount codes to see which retains more</p>
            </div>
            <button
              onClick={() => setAbEnabled(v => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${abEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${abEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {abEnabled && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Variant B discount code</label>
              <input
                type="text"
                value={discountCodeB}
                onChange={e => setDiscountCodeB(e.target.value)}
                placeholder="e.g. SAVE30 (compared against the code above)"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
              />
              <p className="text-xs text-gray-400 mt-1">Half of cancelling customers see this code instead. Compare results in Analytics → Cancel A/B.</p>
            </div>
          )}
        </div>

        {/* Integration URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your cancel redirect URL</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-600 truncate">
              {cancelUrl}
            </code>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <p className="text-xs text-emerald-600 mt-1">Copied!</p>}
          <p className="text-xs text-gray-400 mt-1.5">
            Replace <code className="bg-gray-100 px-1 rounded">STRIPE_SUBSCRIPTION_ID</code> with the customer&apos;s subscription ID and <code className="bg-gray-100 px-1 rounded">YOUR_RETURN_URL</code> with where to send them after.
          </p>
        </div>

        {/* In-app modal embed — opens the flow without a full-page redirect */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-900 mb-1">Or embed it in-app (no redirect) ✨</p>
          <p className="text-xs text-gray-400 mb-2">
            Add this script, then call <code className="bg-gray-100 px-1 rounded">Revova.openCancelFlow()</code> from your &ldquo;Cancel&rdquo; button to open the flow in a modal — like Churnkey.
          </p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap break-all">{`<script src="${appUrl}/api/widget/${userId}/cancel-embed" async></script>

<!-- On your Cancel button: -->
<button onclick="Revova.openCancelFlow({
  subscriptionId: 'sub_123',
  returnUrl: window.location.href
})">Cancel subscription</button>`}</pre>
          <p className="text-xs text-gray-400 mt-1.5">
            The modal handles pause / discount / 1-month-free / cancel and reports the result back to your page.
          </p>
        </div>
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
