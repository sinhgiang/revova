'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface Props {
  currentNote: string | null
}

export function EmailToneSettings({ currentNote }: Props) {
  const [note, setNote] = useState(currentNote ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/stripe/update-email-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customNote: note.trim() || null }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">AI Email Tone</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Add custom instructions that the AI will follow when writing recovery emails — tone, offers, brand voice, etc.
      </p>

      <div className="space-y-3">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder='e.g. "Always mention our 24/7 support. Use a friendly, casual tone. Offer a 10% discount on the final email."'
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-300"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{note.length}/400 characters</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      {note.trim() && (
        <p className="mt-3 text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
          AI instructions active — all future recovery emails will follow these guidelines.
        </p>
      )}
    </div>
  )
}
