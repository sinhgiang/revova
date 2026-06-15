'use client'

import { useState } from 'react'
import { CheckCircle, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  currentName: string | null
}

export function BusinessNameSettings({ currentName }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentName ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!value.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/update-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50">
      <span className="text-sm text-gray-500">Business name in emails</span>
      {editing ? (
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            className="h-7 text-sm w-40"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 text-xs px-2">
            {saving ? '...' : 'Save'}
          </Button>
          <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {saved && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
          <span className="text-sm font-medium text-gray-900">{value || <span className="text-gray-400 italic">Not set</span>}</span>
          <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-indigo-600 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
