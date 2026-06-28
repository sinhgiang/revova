'use client'

import { useState } from 'react'
import { CheckCircle, Send, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  connected: boolean
}

export function TelegramSettings({ connected: initialConnected }: Props) {
  const [botToken, setBotToken] = useState('')
  const [connected, setConnected] = useState(initialConnected)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleConnect() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: botToken.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to connect')
      setConnected(true)
      setBotToken('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to connect')
    } finally {
      setBusy(false)
    }
  }

  async function handleDisconnect() {
    setBusy(true)
    setError('')
    try {
      await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: null }),
      })
      setConnected(false)
    } catch {
      setError('Failed to disconnect')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center">
          <Send className="w-4 h-4 text-sky-500" />
        </div>
        <h3 className="font-semibold text-gray-900">Telegram Notifications</h3>
        {connected && (
          <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Connected
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">Get an instant Telegram message the moment a failed payment is recovered.</p>

      {connected ? (
        <Button variant="outline" onClick={handleDisconnect} disabled={busy}>
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect Telegram'}
        </Button>
      ) : (
        <>
          <ol className="text-sm text-gray-600 space-y-1.5 mb-4 list-decimal list-inside">
            <li>In Telegram, open <strong>@BotFather</strong> → send <code className="bg-gray-100 px-1 rounded">/newbot</code> → copy the token it gives you.</li>
            <li>Open your new bot and send it any message (e.g. <strong>hi</strong>).</li>
            <li>Paste the token below and click Connect.</li>
          </ol>
          <Input
            value={botToken}
            onChange={e => setBotToken(e.target.value)}
            placeholder="123456789:ABCdef..."
            className="mb-3 font-mono text-sm"
          />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <Button onClick={handleConnect} disabled={busy || !botToken.trim()}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Telegram'}
          </Button>
        </>
      )}
    </div>
  )
}
