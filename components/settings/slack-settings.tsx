'use client'

import { useState } from 'react'
import { CheckCircle, ExternalLink, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  currentWebhookUrl: string | null
}

export function SlackSettings({ currentWebhookUrl }: Props) {
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [error, setError] = useState('')

  const isConnected = saved || !!currentWebhookUrl

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/slack/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    setTesting(true)
    setError('')
    try {
      const res = await fetch('/api/slack/test', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setTestSent(true)
      setTimeout(() => setTestSent(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send test')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4A154B] flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Slack Notifications</h2>
            <p className="text-xs text-gray-500">Get notified when a payment is recovered</p>
          </div>
        </div>
        {isConnected && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Connected
          </span>
        )}
      </div>

      <div>
        <a
          href="https://api.slack.com/messaging/webhooks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mb-2"
        >
          How to get a Slack Incoming Webhook URL →
          <ExternalLink className="w-3 h-3" />
        </a>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://hooks.slack.com/services/..."
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            className="text-sm flex-1"
          />
          <Button onClick={handleSave} disabled={saving || !webhookUrl} size="sm">
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
          </Button>
          {isConnected && (
            <Button onClick={handleTest} disabled={testing} size="sm" variant="outline">
              {testing ? '...' : testSent ? '✓ Sent!' : 'Test'}
            </Button>
          )}
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  )
}
