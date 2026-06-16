'use client'

import { useState } from 'react'
import { Mail, Eye, EyeOff } from 'lucide-react'

interface Props {
  hasSmtp: boolean
}

export function SmtpSettings({ hasSmtp }: Props) {
  const [enabled, setEnabled] = useState(hasSmtp)
  const [host, setHost] = useState('')
  const [port, setPort] = useState('587')
  const [smtpUser, setSmtpUser] = useState('')
  const [password, setPassword] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [fromName, setFromName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testMsg, setTestMsg] = useState<{ ok: boolean; msg: string } | null>(null)

  async function handleSave() {
    if (!enabled) {
      // Clear SMTP config
      setSaving(true)
      await fetch('/api/stripe/update-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clear: true }),
      })
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      return
    }
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/stripe/update-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port, smtpUser, password, fromEmail, fromName }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestMsg(null)
    try {
      const res = await fetch('/api/smtp/test', { method: 'POST' })
      const data = await res.json()
      setTestMsg(res.ok ? { ok: true, msg: 'Test email sent! Check your inbox.' } : { ok: false, msg: data.error })
    } catch {
      setTestMsg({ ok: false, msg: 'Connection failed' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Mail className="w-4 h-4 text-blue-500" />
        <h2 className="font-semibold text-gray-900">Custom SMTP</h2>
        <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Pro</span>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Send recovery emails from your own domain instead of noreply@revova.io.
      </p>

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-medium text-gray-900">Use custom SMTP</p>
          <p className="text-xs text-gray-400">Overrides the default Revova email sender</p>
        </div>
        <button
          onClick={() => setEnabled(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">SMTP Host</label>
              <input value={host} onChange={e => setHost(e.target.value)} placeholder="smtp.gmail.com"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Port</label>
              <input value={port} onChange={e => setPort(e.target.value)} placeholder="587"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
            <input value={smtpUser} onChange={e => setSmtpUser(e.target.value)} placeholder="you@yourdomain.com"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password / App password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={() => setShowPass(v => !v)} className="absolute right-2.5 top-2 text-gray-400">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">From Email</label>
              <input value={fromEmail} onChange={e => setFromEmail(e.target.value)} placeholder="billing@yourdomain.com"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">From Name</label>
              <input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Your Company"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300" />
            </div>
          </div>
        </div>
      )}

      {testMsg && (
        <p className={`mt-3 text-xs px-3 py-2 rounded-lg ${testMsg.ok ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          {testMsg.msg}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3 justify-end">
        {enabled && hasSmtp && (
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
