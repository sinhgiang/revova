'use client'

import { useState } from 'react'
import { Eye, LogIn, Loader2 } from 'lucide-react'

async function setImpersonation(body: object) {
  await fetch('/api/admin/impersonate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// Persistent banner shown across the app while the admin is viewing as a merchant.
export function ImpersonationBanner({ name }: { name: string }) {
  const [busy, setBusy] = useState(false)
  async function exit() {
    setBusy(true)
    await setImpersonation({ clear: true })
    window.location.href = '/admin'
  }
  return (
    <div className="bg-amber-500 text-white text-sm font-medium px-4 py-2 flex items-center justify-center gap-3 sticky top-0 z-50">
      <Eye className="w-4 h-4" />
      <span>🛡️ ADMIN SUPPORT MODE — viewing <strong>{name}</strong>&apos;s account</span>
      <button onClick={exit} disabled={busy} className="ml-2 underline font-semibold hover:opacity-80">
        {busy ? 'Exiting…' : 'Exit'}
      </button>
    </div>
  )
}

// Button on the merchant detail page to enter that merchant's dashboard.
export function EnterDashboardButton({ userId }: { userId: string }) {
  const [busy, setBusy] = useState(false)
  async function enter() {
    setBusy(true)
    await setImpersonation({ userId })
    window.location.href = '/dashboard'
  }
  return (
    <button
      onClick={enter}
      disabled={busy}
      className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
      View their dashboard
    </button>
  )
}
