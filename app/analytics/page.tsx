/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { formatCurrency } from '@/lib/utils'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: payments } = await (supabase as any)
    .from('failed_payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const all = payments ?? []
  const recovered = all.filter((p: any) => p.status === 'recovered')
  const inProgress = all.filter((p: any) => p.status === 'pending' || p.status === 'email_sent')
  const lost = all.filter((p: any) => ['failed', 'max_emails_reached', 'cancelled'].includes(p.status))
  const totalRecovered = recovered.reduce((s: number, p: any) => s + p.amount, 0)
  const totalAtRisk = inProgress.reduce((s: number, p: any) => s + p.amount, 0)
  const totalLost = lost.reduce((s: number, p: any) => s + p.amount, 0)
  const recoveryRate = all.length > 0 ? Math.round((recovered.length / all.length) * 100) : 0
  const currency = all[0]?.currency ?? 'usd'

  // Decline code breakdown
  const codeMap = all.reduce((acc: Record<string, number>, p: any) => {
    const c = p.decline_code ?? 'unknown'
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, {})
  const sortedCodes = Object.entries(codeMap).sort(([, a], [, b]) => (b as number) - (a as number))
  const maxCode = (sortedCodes[0]?.[1] as number) ?? 1

  // Email sequence funnel
  const funnel = [0, 1, 2, 3, 4, 5].map(n => all.filter((p: any) => p.emails_sent === n).length)

  // Weekly recovery trend (last 8 weeks)
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date()
    start.setDate(start.getDate() - (7 - i) * 7)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + 7)
    const weekRec = recovered.filter((p: any) => {
      const d = new Date(p.recovered_at ?? p.created_at)
      return d >= start && d < end
    })
    return {
      label: start.toLocaleString('default', { month: 'short', day: 'numeric' }),
      amount: weekRec.reduce((s: number, p: any) => s + p.amount, 0),
      count: weekRec.length,
    }
  })
  const maxWeek = Math.max(...weeks.map(w => w.amount), 1)

  // Email performance: open rate + click rate per sequence number
  const { data: emailLogs } = await (supabase as any)
    .from('email_logs')
    .select('email_type, opened_at, clicked_at')
    .eq('user_id', user.id)
    .like('email_type', 'sequence_%')

  const emailStats = [1, 2, 3, 4, 5].map(seq => {
    const logs = (emailLogs ?? []).filter((l: any) => l.email_type === `sequence_${seq}`)
    const sent = logs.length
    const opened = logs.filter((l: any) => l.opened_at).length
    const clicked = logs.filter((l: any) => l.clicked_at).length
    return { seq, sent, openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0, clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0 }
  }).filter(s => s.sent > 0)

  // Revenue forecast: based on historical recovery rate
  const projectedRecovery = recoveryRate > 0 && inProgress.length > 0
    ? Math.round(totalAtRisk * recoveryRate / 100)
    : 0

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Payment recovery performance</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Revenue Recovered', value: formatCurrency(totalRecovered, currency), sub: `${recovered.length} payments`, color: 'text-emerald-600' },
              { label: 'Recovery Rate', value: `${recoveryRate}%`, sub: `${all.length} total failed`, color: 'text-indigo-600' },
              { label: 'At Risk', value: formatCurrency(totalAtRisk, currency), sub: `${inProgress.length} in progress`, color: 'text-amber-600' },
              { label: 'Unrecovered', value: formatCurrency(totalLost, currency), sub: `${lost.length} payments`, color: 'text-red-500' },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Recovery progress bar */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Recovery Progress</h3>
              <span className="text-sm text-gray-400">{recovered.length} of {all.length} payments recovered</span>
            </div>
            <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
              {all.length > 0 && <>
                <div className="bg-emerald-500" style={{ width: `${(recovered.length / all.length) * 100}%` }} />
                <div className="bg-blue-400" style={{ width: `${(inProgress.length / all.length) * 100}%` }} />
                <div className="bg-red-300" style={{ width: `${(lost.length / all.length) * 100}%` }} />
              </>}
            </div>
            <div className="flex gap-6 mt-3">
              {[
                { label: 'Recovered', color: 'bg-emerald-500', n: recovered.length },
                { label: 'In Progress', color: 'bg-blue-400', n: inProgress.length },
                { label: 'Lost', color: 'bg-red-300', n: lost.length },
              ].map(({ label, color, n }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                  {label} ({n})
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Decline reasons */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Top Decline Reasons</h3>
              {sortedCodes.length === 0 ? (
                <p className="text-sm text-gray-400">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {sortedCodes.slice(0, 6).map(([code, count]) => (
                    <div key={code}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 capitalize">{code.replace(/_/g, ' ')}</span>
                        <span className="font-semibold text-gray-900">{count as number}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${((count as number) / maxCode) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email funnel */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Email Sequence Funnel</h3>
              {all.length === 0 ? (
                <p className="text-sm text-gray-400">No data yet</p>
              ) : (
                <div className="space-y-2.5">
                  {[
                    { label: 'Email send failed', n: funnel[0] },
                    { label: 'Email 1 sent', n: funnel[1] },
                    { label: 'Email 2 sent', n: funnel[2] },
                    { label: 'Email 3 sent', n: funnel[3] },
                    { label: 'Email 4 sent', n: funnel[4] },
                    { label: 'Email 5 sent (Pro)', n: funnel[5] },
                  ].map(({ label, n }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-28 flex-shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        {all.length > 0 && <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${(n / all.length) * 100}%` }} />}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-5 text-right">{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revenue forecast */}
          {projectedRecovery > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-indigo-900">Revenue Forecast</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Based on your {recoveryRate}% rate</span>
              </div>
              <p className="text-sm text-indigo-600 mb-4">Projected outcome for your {inProgress.length} in-progress payments</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Currently at risk</p>
                  <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalAtRisk, currency)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{inProgress.length} payments in progress</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Projected to recover</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(projectedRecovery, currency)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">if your rate holds at {recoveryRate}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Email performance table */}
          {emailStats.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-0.5">Email Performance</h3>
              <p className="text-xs text-gray-400 mb-4">Open rate and click rate per email step — higher click rate = more customers updating their card</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 pb-3">Email</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-3">Sent</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-3">Open Rate</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-3">Click Rate</th>
                    <th className="text-right text-xs font-medium text-gray-400 pb-3">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {emailStats.map(({ seq, sent, openRate, clickRate }) => (
                    <tr key={seq}>
                      <td className="py-3 font-medium text-gray-700">Email #{seq}</td>
                      <td className="py-3 text-right text-gray-500">{sent}</td>
                      <td className="py-3 text-right">
                        <span className={`font-semibold ${openRate >= 40 ? 'text-emerald-600' : openRate >= 20 ? 'text-amber-600' : 'text-gray-400'}`}>
                          {openRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-semibold ${clickRate >= 20 ? 'text-emerald-600' : clickRate >= 10 ? 'text-amber-600' : 'text-gray-400'}`}>
                          {clickRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          clickRate >= 20 ? 'bg-emerald-50 text-emerald-700' :
                          clickRate >= 10 ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {clickRate >= 20 ? 'Strong' : clickRate >= 10 ? 'Average' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-3">Industry avg: ~35% open rate · ~15% click rate. Open/click tracking embedded in all emails automatically.</p>
            </div>
          )}

          {/* Weekly trend chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-0.5">Weekly Recovery Trend</h3>
            <p className="text-xs text-gray-400 mb-5">Revenue recovered per week (last 8 weeks)</p>
            {weeks.every(w => w.amount === 0) ? (
              <div className="text-center py-10 text-sm text-gray-400">
                No recoveries yet — data will appear here as payments are recovered.
              </div>
            ) : (
              <div className="flex items-end gap-2 h-36">
                {weeks.map(w => (
                  <div key={w.label} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full flex flex-col justify-end" style={{ height: '110px' }}>
                      <div
                        className="w-full bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors cursor-default group relative"
                        style={{ height: `${Math.max((w.amount / maxWeek) * 110, w.amount > 0 ? 4 : 0)}px` }}
                      >
                        {w.amount > 0 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                            {formatCurrency(w.amount, currency)}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{w.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
