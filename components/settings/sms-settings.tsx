'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'

interface Props {
  currentEnabled: boolean
  hasCredentials: boolean
  currentFromNumber: string | null
}

export function SmsSettings({ currentEnabled, hasCredentials, currentFromNumber }: Props) {
  const [enabled, setEnabled] = useState(currentEnabled)
  const [accountSid, setAccountSid] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [fromNumber, setFromNumber] = useState(currentFromNumber ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Test SMS state
  const [testPhone, setTestPhone] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  async function handleTest() {
    setTestResult(null)
    if (!testPhone.trim()) {
      setTestResult({ ok: false, msg: 'Enter a phone number to send the test to.' })
      return
    }
    setTesting(true)
    try {
      const res = await fetch('/api/stripe/test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testPhone: testPhone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Test failed')
      setTestResult({ ok: true, msg: 'Test SMS sent! Check your phone.' })
    } catch (e) {
      setTestResult({ ok: false, msg: e instanceof Error ? e.message : 'Test failed' })
    } finally {
      setTesting(false)
    }
  }

  async function handleSave() {
    setError('')
    if (enabled && !hasCredentials && (!accountSid.trim() || !authToken.trim() || !fromNumber.trim())) {
      setError('Enter your Twilio Account SID, Auth Token, and From number to enable SMS.')
      return
    }
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/stripe/update-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          // Only send credentials if the user typed new ones — keep existing otherwise
          accountSid: accountSid.trim() || null,
          authToken: authToken.trim() || null,
          fromNumber: fromNumber.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSaved(true)
      setAccountSid('')
      setAuthToken('')
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare className="w-4 h-4 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">SMS Recovery</h2>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Pro</span>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        When a customer ignores your recovery emails, Revova sends a text message with a card-update link. SMS gets ~98% open rates — far higher than email. Sent from your own Twilio number.
      </p>

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-gray-900">Enable SMS nudges</p>
          <p className="text-xs text-gray-400">Sent after 3 unopened recovery emails</p>
        </div>
        <button
          onClick={() => setEnabled(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className={`space-y-4 ${!enabled ? 'opacity-40 pointer-events-none' : ''}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Twilio Account SID {hasCredentials && <span className="text-emerald-600 font-normal">· saved</span>}
          </label>
          <input
            type="text"
            value={accountSid}
            onChange={e => setAccountSid(e.target.value)}
            placeholder={hasCredentials ? '•••••••• (leave blank to keep)' : 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Twilio Auth Token</label>
          <input
            type="password"
            value={authToken}
            onChange={e => setAuthToken(e.target.value)}
            placeholder={hasCredentials ? '•••••••• (leave blank to keep)' : 'Your Twilio auth token'}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">From number</label>
          <input
            type="text"
            value={fromNumber}
            onChange={e => setFromNumber(e.target.value)}
            placeholder="+14155552671"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
          />
          <p className="text-xs text-gray-400 mt-1">Your Twilio phone number in E.164 format (with country code).</p>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mt-3">{error}</p>}

      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Test SMS — confirms the saved Twilio credentials actually work */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-900 mb-1">Send a test SMS</p>
        <p className="text-xs text-gray-400 mb-3">
          Save your credentials above first. On a Twilio trial account you can only text a verified number.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={testPhone}
            onChange={e => setTestPhone(e.target.value)}
            placeholder="+14155552671"
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
          />
          <button
            onClick={handleTest}
            disabled={testing}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {testing ? 'Sending…' : 'Send test'}
          </button>
        </div>
        {testResult && (
          <p className={`text-xs mt-2 ${testResult.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {testResult.ok ? '✓ ' : ''}{testResult.msg}
          </p>
        )}
      </div>
    </div>
  )
}
