'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, AlertTriangle, CheckCircle, History } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function HistoricalRecoveryClient({ enrolled, emailsSent, done }: { enrolled: number; emailsSent: number; done: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [throttle, setThrottle] = useState(40)
  const [discount, setDiscount] = useState('')
  const [starting, setStarting] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    fetch('/api/historical/preview', { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        if (d.ok) { setData(d); setThrottle(d.throttle ?? 40); setDiscount(d.discount ?? '') }
        else setError(d.error || 'Could not scan')
      })
      .catch(() => setError('Could not scan your Stripe account'))
      .finally(() => setLoading(false))
  }, [])

  async function start() {
    setStarting(true); setError('')
    try {
      const res = await fetch('/api/historical/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ throttle, discount }),
      })
      const d = await res.json()
      if (res.ok) { setStarted(true); router.refresh() }
      else setError(d.error || 'Failed to start')
    } catch { setError('Failed to start') }
    finally { setStarting(false) }
  }

  // Existing campaign status
  const statusCard = enrolled > 0 && (
    <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-emerald-600" /><h3 className="font-semibold text-gray-900">Campaign running</h3></div>
      <div className="flex gap-6 text-sm">
        <span><strong>{enrolled}</strong> customers enrolled</span>
        <span><strong>{emailsSent}</strong> emails sent</span>
        <span><strong>{done}</strong> completed</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">Emails go out gradually (up to {throttle}/day) — Day 0, 7, and 21 per customer. Track results in Analytics.</p>
    </div>
  )

  if (loading) {
    return <div className="flex items-center gap-3 text-gray-600"><Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> Scanning your Stripe for past failed payments…</div>
  }

  return (
    <div>
      {statusCard}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
      {started && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg p-3 mb-4">✅ Campaign started! Emails will go out gradually over the coming days.</div>}

      {data && data.count > 0 ? (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-1"><History className="w-5 h-5 text-indigo-600" /><p className="font-bold text-gray-900">Found {data.count} past failed payments</p></div>
            <p className="text-sm text-gray-600">Totaling <strong className="text-red-600">{formatCurrency(data.total, data.currency)}</strong> — a winback campaign could recover a meaningful chunk of it.</p>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Campaign settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Emails per day (throttle)</label>
                <input type="number" min={5} max={200} value={throttle} onChange={e => setThrottle(parseInt(e.target.value) || 40)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <p className="text-xs text-gray-400 mt-1">Lower = safer for deliverability. 40 is a good default.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Comeback discount code (optional)</label>
                <input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="WELCOME20"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <p className="text-xs text-gray-400 mt-1">Shown in the &ldquo;come back&rdquo; email to win them over.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mt-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">These are <strong>re-engagement</strong> emails (friendly, not &ldquo;pay your overdue bill&rdquo;). They go out gradually, 3 emails per customer over ~3 weeks, each with one-click unsubscribe — to protect your sender reputation.</p>
            </div>

            <button onClick={start} disabled={starting}
              className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {enrolled > 0 ? 'Enroll any new ones & continue' : `Start recovering ${data.count} customers`}
            </button>
          </div>

          {/* Preview table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Preview ({data.list.length} shown)</h3></div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0"><tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-5 py-2.5 font-medium">Customer</th><th className="px-5 py-2.5 font-medium text-right">Amount</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {data.list.map((c: any, i: number) => (
                    <tr key={i}><td className="px-5 py-2.5"><p className="text-gray-700">{c.name || c.email}</p><p className="text-xs text-gray-400">{c.email}</p></td>
                    <td className="px-5 py-2.5 text-right text-gray-700">{formatCurrency(c.amount, c.currency)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        !error && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-sm text-gray-700">🎉 No recoverable past failed payments found in your scan window. Nothing to do here!</div>
      )}
    </div>
  )
}
