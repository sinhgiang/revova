'use client'

import { useMemo, useState } from 'react'
import { DollarSign, TrendingUp, Mail, AlertCircle, Calendar } from 'lucide-react'
import { StatsCard } from './stats-card'
import { DateRangePicker } from './date-range-picker'
import { formatCurrency } from '@/lib/utils'

// One failed-payment row, slimmed to what the stats need.
type P = {
  created_at: string
  status: string
  amount: number
  emails_sent: number | null
  customer_email: string | null
}

const PRESETS: { key: string; label: string; days: number | null }[] = [
  { key: 'today', label: 'Today', days: 0 },
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
  { key: '3m', label: '3 months', days: 90 },
  { key: '12m', label: '12 months', days: 365 },
  { key: 'all', label: 'All time', days: null },
]

const DAY = 86_400_000

function pill(active: boolean) {
  return `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors inline-flex items-center gap-1 ${
    active ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
  }`
}

export function RecoveryStats({ payments, currency }: { payments: P[]; currency: string }) {
  const [preset, setPreset] = useState('30d')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const custom = preset === 'custom'

  // Resolve the active [start, end] window from either a preset or the calendar.
  const { start, end } = useMemo(() => {
    const now = Date.now()
    if (custom) {
      return {
        start: from ? new Date(from + 'T00:00:00').getTime() : 0,
        end: to ? new Date(to + 'T23:59:59').getTime() : now,
      }
    }
    const p = PRESETS.find(x => x.key === preset)
    if (!p || p.days === null) return { start: 0, end: now }
    if (p.days === 0) { const d = new Date(); d.setHours(0, 0, 0, 0); return { start: d.getTime(), end: now } }
    return { start: now - p.days * DAY, end: now }
  }, [preset, from, to, custom])

  const m = useMemo(() => {
    const f = payments.filter(p => {
      const t = new Date(p.created_at).getTime()
      return !isNaN(t) && t >= start && t <= end
    })
    const recovered = f.filter(p => p.status === 'recovered')
    const totalRecovered = recovered.reduce((s, p) => s + (p.amount || 0), 0)
    const lost = f.filter(p => p.status !== 'recovered')
    const lostAmount = lost.reduce((s, p) => s + (p.amount || 0), 0)
    const pending = f.filter(p => p.status === 'pending' || p.status === 'email_sent')
    const emailsSent = f.reduce((s, p) => s + (p.emails_sent || 0), 0)
    const customers = new Set(f.map(p => p.customer_email).filter(Boolean)).size
    const rate = f.length > 0 ? Math.round((recovered.length / f.length) * 100) : 0
    return { count: f.length, totalRecovered, lostAmount, pending: pending.length, emailsSent, customers, rate }
  }, [payments, start, end])

  function choosePreset(k: string) { setPreset(k); setFrom(''); setTo('') }

  // Human label for the active custom window (shown on the Custom pill).
  const customLabel = custom && (from || to)
    ? `${from || '…'} → ${to || 'now'}`
    : 'Custom range'

  return (
    <div className="mb-8">
      {/* ── Time filter bar ── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-sm text-gray-500 flex items-center gap-1.5">
          <Calendar className="w-4 h-4" /> Showing:
        </span>
        {PRESETS.map(p => (
          <button key={p.key} onClick={() => choosePreset(p.key)} className={pill(!custom && preset === p.key)}>
            {p.label}
          </button>
        ))}
        <button onClick={() => setPreset('custom')} className={pill(custom)} title="Pick a custom date range">
          <Calendar className="w-3.5 h-3.5" />
          {customLabel}
        </button>
      </div>

      {/* ── Custom range: our own English calendar (filters live as you click) ── */}
      {custom && (
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-3">
          <div className="text-xs text-indigo-700 sm:pt-2 sm:w-48">
            <p className="font-semibold mb-0.5">Pick a start day, then an end day.</p>
            <p className="text-indigo-600/80">
              {from ? `From ${from}` : 'No start yet'}{to ? ` → To ${to}` : from ? ' → pick end' : ''}
            </p>
            <p className="text-indigo-500/70 mt-1">It filters instantly — no Apply needed.</p>
          </div>
          <DateRangePicker from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t) }} />
        </div>
      )}

      {/* ── One-line summary for the selected window ── */}
      <p className="text-xs text-gray-500 mb-3">
        <strong className="text-gray-900">{m.count}</strong> failed payment{m.count === 1 ? '' : 's'} ·{' '}
        <strong className="text-gray-900">{m.customers}</strong> customer{m.customers === 1 ? '' : 's'} ·{' '}
        <strong className="text-red-600">{formatCurrency(m.lostAmount, currency)}</strong> at risk ·{' '}
        <strong className="text-emerald-700">{formatCurrency(m.totalRecovered, currency)}</strong> recovered
      </p>

      {/* ── KPI cards (recompute with the filter) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Recovered" value={formatCurrency(m.totalRecovered, currency)} subtitle="Revenue saved" icon={<DollarSign className="w-6 h-6" />} />
        <StatsCard title="Recovery Rate" value={`${m.rate}%`} subtitle="of failed payments" icon={<TrendingUp className="w-6 h-6" />} />
        <StatsCard title="Emails Sent" value={m.emailsSent.toString()} subtitle="Recovery emails" icon={<Mail className="w-6 h-6" />} />
        <StatsCard title="Pending Recovery" value={m.pending.toString()} subtitle="Awaiting response" icon={<AlertCircle className="w-6 h-6" />} />
      </div>
    </div>
  )
}
