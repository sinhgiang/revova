'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, X } from 'lucide-react'

interface BlacklistEntry {
  id: string
  email: string
  reason: string | null
  created_at: string
}

export function EmailBlacklistSettings() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [reason, setReason] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/blacklist').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setEntries(data)
    })
  }, [])

  async function handleAdd() {
    if (!newEmail.includes('@')) { setError('Enter a valid email'); return }
    setAdding(true)
    setError('')
    try {
      const res = await fetch('/api/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim(), reason: reason.trim() || null }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error); return }
      const updated = await fetch('/api/blacklist').then(r => r.json())
      if (Array.isArray(updated)) setEntries(updated)
      setNewEmail('')
      setReason('')
    } finally {
      setAdding(false)
    }
  }

  async function handleRemove(email: string) {
    await fetch(`/api/blacklist/${encodeURIComponent(email)}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.email !== email))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Shield className="w-4 h-4 text-red-500" />
        <h2 className="font-semibold text-gray-900">Email Blacklist</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        Emails on this list will never receive recovery emails — useful for internal accounts, VIP customers, or opt-outs.
      </p>

      {/* Add new */}
      <div className="flex gap-2 mb-3">
        <input
          type="email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          placeholder="customer@example.com"
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
        />
        <input
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="w-36 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-300"
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      {entries.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No blacklisted emails yet.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{entry.email}</p>
                {entry.reason && <p className="text-xs text-gray-400">{entry.reason}</p>}
              </div>
              <button
                onClick={() => handleRemove(entry.email)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
