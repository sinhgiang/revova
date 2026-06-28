'use client'

import { useState } from 'react'
import { Shield, Download, Trash2, Copy, CheckCircle } from 'lucide-react'

interface Props {
  appUrl: string
}

export function DataPrivacySettings({ appUrl }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const resendWebhookUrl = `${appUrl}/api/resend-webhook`

  async function handleDelete() {
    if (confirmText !== 'DELETE') { setError('Type DELETE to confirm.'); return }
    setDeleting(true)
    setError('')
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'DELETE' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      window.location.href = '/'
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  function copyWebhook() {
    navigator.clipboard.writeText(resendWebhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-4 h-4 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">Data &amp; Privacy</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Manage your data the way GDPR requires — export everything we hold, or permanently delete your account.
      </p>

      {/* Bounce/spam tracking setup */}
      <div className="mb-5 pb-5 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 mb-1">Bounce &amp; spam tracking</p>
        <p className="text-xs text-gray-400 mb-2">
          Add this URL in your Resend dashboard (Webhooks) to auto-suppress bounced and spam-flagged addresses — protects your inbox placement.
        </p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <code className="text-xs text-gray-700 flex-1 break-all font-mono">{resendWebhookUrl}</code>
          <button onClick={copyWebhook} className="text-gray-400 hover:text-indigo-600 flex-shrink-0">
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Export */}
      <a
        href="/api/account/export"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors mb-5"
      >
        <Download className="w-4 h-4" /> Export all my data (JSON)
      </a>

      {/* Danger zone */}
      <div className="border border-red-100 bg-red-50 rounded-xl p-4">
        <p className="text-sm font-medium text-red-800 mb-1">Delete account</p>
        <p className="text-xs text-red-600 mb-3">
          Permanently deletes your account and all data (payments, emails, contacts). This cannot be undone.
        </p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-red-200 text-red-700 hover:bg-red-100 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete my account
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-red-700">Type <strong>DELETE</strong> to confirm:</p>
            <div className="flex gap-2">
              <input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="flex-1 text-sm border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Confirm'}
              </button>
              <button onClick={() => { setShowDelete(false); setConfirmText(''); setError('') }} className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100">
                Cancel
              </button>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
