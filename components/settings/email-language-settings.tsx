'use client'
import { useState } from 'react'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'de', label: 'Deutsch (German)' },
  { code: 'pt', label: 'Português (Portuguese)' },
  { code: 'nl', label: 'Nederlands (Dutch)' },
  { code: 'it', label: 'Italiano (Italian)' },
  { code: 'ja', label: '日本語 (Japanese)' },
]

interface Props {
  currentLanguage: string | null
}

export function EmailLanguageSettings({ currentLanguage }: Props) {
  const [lang, setLang] = useState(currentLanguage ?? 'en')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(newLang: string) {
    setLang(newLang)
    setSaving(true)
    try {
      await fetch('/api/stripe/update-email-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLang }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-gray-500" />
        <h2 className="font-semibold text-gray-900">Recovery Email Language</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        AI will write all recovery emails in the selected language. Use this if your customers speak a language other than English.
      </p>
      <select
        value={lang}
        onChange={e => save(e.target.value)}
        disabled={saving}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      {saved && <p className="text-xs text-emerald-600 mt-2">Language updated!</p>}
      {lang !== 'en' && (
        <p className="text-xs text-indigo-600 mt-2">
          ✓ All future recovery emails will be written in {LANGUAGES.find(l => l.code === lang)?.label?.split(' ')[0]}.
        </p>
      )}
    </div>
  )
}
