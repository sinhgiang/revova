'use client'

import { useState } from 'react'
import { Lock, CheckCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

// Only rendered for email/password accounts (OAuth users have no password).
export function ChangePasswordSettings() {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSave() {
    setError('')
    if (pw.length < 6) { setError('Password must be at least 6 characters'); return }
    if (pw !== confirm) { setError('Passwords do not match'); return }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setPw('')
      setConfirm('')
      setTimeout(() => setDone(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
          <Lock className="w-4 h-4 text-gray-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Change Password</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">Update the password you use to sign in with email.</p>

      <div className="space-y-3 max-w-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
          <Input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Min. 6 characters" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
          <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter new password" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving || !pw || !confirm}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
          </Button>
          {done && (
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <CheckCircle className="w-4 h-4" /> Password updated
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
