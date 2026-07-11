/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { formatCurrency } from '@/lib/utils'
import { getPlanFor } from '@/lib/plan'
import { getDeclineClass } from '@/lib/ai/email-generator'
import { ProGate } from '@/components/plan/pro-gate'
import { getAppContext } from '@/lib/impersonate'
import { ImpersonationBanner } from '@/components/admin/impersonate-controls'
import { AdminBar } from '@/components/admin/admin-bar'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const ctx = await getAppContext(supabase)
  if (!ctx) redirect('/login')
  const db = ctx.db
  const userId = ctx.userId
  const plan = await getPlanFor(db, userId)
  if (!ctx.impersonating && !plan.hasAccess) redirect('/billing?expired=1')

  let bannerName = 'merchant'
  if (ctx.impersonating) {
    const { data: acc } = await db.from('stripe_accounts').select('business_name').eq('user_id', userId).maybeSingle()
    bannerName = acc?.business_name ?? 'merchant'
  }

  const { data: payments } = await db
    .from('failed_payments')
    .select('*')
    .eq('user_id', userId)
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

  // Group failures by CLASS so merchants see the split that actually matters:
  // soft (retry), hard (needs a new card), and auth (3-D Secure / SCA — needs
  // verification, not a new card). The auth slice is where EU/UK recoverable
  // money hides — surfacing it answers "are you separating these?".
  const classMeta = {
    soft: { label: 'Soft — retry', color: 'bg-emerald-500', hint: 'Insufficient funds & temporary declines — usually recover on a retry.' },
    auth: { label: 'Needs verification (3-D Secure)', color: 'bg-amber-500', hint: 'Bank authentication (SCA) not completed — recovered by verifying, not a new card.' },
    hard: { label: 'Hard — needs new card', color: 'bg-rose-500', hint: 'Lost/stolen/blocked cards — the customer must add a different card.' },
  } as const
  const classCounts = all.reduce((acc: Record<string, number>, p: any) => {
    const cl = getDeclineClass(p.decline_code ?? null)
    acc[cl] = (acc[cl] ?? 0) + 1
    return acc
  }, {})

  // Incremental lift (honest measurement): if a holdout group exists (a small
  // sample left on the processor's own retries as a control), the value Revova
  // adds is the recovery-rate LIFT over that control — not the gross total, since
  // some charges would have recovered anyway. Reading p.holdout is safe even if
  // the column doesn't exist yet (it's simply undefined → no holdout, no card).
  const holdoutRows = all.filter((p: any) => p.holdout === true)
  const treatmentRows = all.filter((p: any) => p.holdout !== true)
  const rate = (rows: any[]) => (rows.length ? rows.filter((p) => p.status === 'recovered').length / rows.length : 0)
  const hasHoldout = holdoutRows.length >= 10 && treatmentRows.length >= 10
  const treatmentRate = rate(treatmentRows)
  const holdoutRate = rate(holdoutRows)
  const liftPct = hasHoldout ? Math.max(0, Math.round((treatmentRate - holdoutRate) * 100)) : null
  const incrementalRecovered = hasHoldout
    ? Math.round(totalRecovered * (treatmentRate > 0 ? Math.max(0, (treatmentRate - holdoutRate) / treatmentRate) : 0))
    : null

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

  // Pull EVERY email/SMS we've logged so we can break performance down by channel
  const { data: emailLogs } = await db
    .from('email_logs')
    .select('email_type, opened_at, clicked_at, delivered_at, bounced_at, complained_at')
    .eq('user_id', userId)

  const allLogs = emailLogs ?? []

  // Deliverability: bounce + spam-complaint rates (protect sender reputation)
  const emailLogsOnly = allLogs.filter((l: any) => !(l.email_type ?? '').startsWith('sms_'))
  const totalEmails = emailLogsOnly.length
  const bounced = emailLogsOnly.filter((l: any) => l.bounced_at).length
  const complained = emailLogsOnly.filter((l: any) => l.complained_at).length
  const bounceRate = totalEmails > 0 ? Math.round((bounced / totalEmails) * 1000) / 10 : 0
  const complaintRate = totalEmails > 0 ? Math.round((complained / totalEmails) * 1000) / 10 : 0
  const statsFor = (match: (t: string) => boolean) => {
    const logs = allLogs.filter((l: any) => match(l.email_type ?? ''))
    const sent = logs.length
    const opened = logs.filter((l: any) => l.opened_at).length
    const clicked = logs.filter((l: any) => l.clicked_at).length
    return {
      sent,
      opened,
      clicked,
      openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
      clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
    }
  }

  // Per-step stats for the 5-email recovery sequence
  const emailStats = [1, 2, 3, 4, 5].map(seq => {
    const s = statsFor(t => t === `sequence_${seq}`)
    return { seq, ...s }
  }).filter(s => s.sent > 0)

  // Channel-level breakdown across every email/SMS flow, in plain language.
  // Always show all channels (even at 0) so merchants can see the full system.
  const channels = [
    { key: 'recovery', name: 'Payment recovery', emoji: '💳', desc: 'The core 5-email sequence sent when a payment fails.', tracked: true, ...statsFor(t => t.startsWith('sequence_')) },
    { key: 'winback', name: 'Winback', emoji: '🔄', desc: 'Re-engagement emails sent after a customer cancels (Day 3, 14, 30).', tracked: true, ...statsFor(t => t.startsWith('winback_')) },
    { key: 'predunning', name: 'Pre-dunning', emoji: '📅', desc: 'Heads-up emails sent before a card expires — stops the failure before it happens.', tracked: true, ...statsFor(t => t === 'predunning') },
    { key: 'trial', name: 'Trial reminders', emoji: '⏳', desc: 'Nudges sent before a free trial ends (Day 7, 3, 1).', tracked: true, ...statsFor(t => t.startsWith('trial')) },
    { key: 'manual', name: 'Manual sends', emoji: '✋', desc: 'One-off recovery emails you sent by hand from the Payments page.', tracked: true, ...statsFor(t => t.startsWith('manual_')) },
    { key: 'sms', name: 'SMS nudges', emoji: '💬', desc: 'Text messages sent when a customer ignores your emails (~98% open rate).', tracked: false, ...statsFor(t => t.startsWith('sms_')) },
  ]

  const totalTouches = channels.reduce((sum, c) => sum + c.sent, 0)

  // Revenue forecast: based on historical recovery rate
  const projectedRecovery = recoveryRate > 0 && inProgress.length > 0
    ? Math.round(totalAtRisk * recoveryRate / 100)
    : 0

  // Cancel-flow A/B test: compare save rate of variant A vs B
  const { data: cancelEvents } = await db
    .from('cancel_events')
    .select('action_taken, variant')
    .eq('merchant_user_id', userId)

  const RETAINED = ['paused', 'discounted', 'gifted']
  const abStats = ['A', 'B'].map(v => {
    const rows = (cancelEvents ?? []).filter((e: any) => e.variant === v)
    const shown = rows.length
    const retained = rows.filter((e: any) => RETAINED.includes(e.action_taken)).length
    return { variant: v, shown, retained, saveRate: shown > 0 ? Math.round((retained / shown) * 100) : 0 }
  }).filter(s => s.shown > 0)
  const abWinner = abStats.length === 2 && abStats[0].saveRate !== abStats[1].saveRate
    ? (abStats[0].saveRate > abStats[1].saveRate ? 'A' : 'B')
    : null

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {ctx.impersonating ? <ImpersonationBanner name={bannerName} /> : <AdminBar />}
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

          {/* Honest measurement: incremental lift vs a holdout control (Item 2) */}
          {hasHoldout ? (
            <div className="bg-white rounded-xl border border-indigo-100 p-6 shadow-sm mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">Incremental lift vs holdout</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">the revenue Revova actually adds</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">A small holdout group is left on your processor&apos;s own retries as a control. This is the recovery Revova adds <em>on top</em> — not the gross total, since some charges would have recovered anyway.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-400 mb-1">With Revova</p><p className="text-2xl font-bold text-emerald-600">{Math.round(treatmentRate * 100)}%</p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-400 mb-1">Holdout (control)</p><p className="text-2xl font-bold text-gray-500">{Math.round(holdoutRate * 100)}%</p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-400 mb-1">Incremental recovered</p><p className="text-2xl font-bold text-indigo-600">{formatCurrency(incrementalRecovered ?? 0, currency)}</p><p className="text-xs text-gray-400 mt-0.5">+{liftPct}% lift</p></div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-6 -mt-2">
              &ldquo;Revenue Recovered&rdquo; is the gross amount recovered while Revova was active. Some charges may also
              recover through your processor&apos;s own retries, so treat it as gross recovery, not pure added lift.
            </p>
          )}

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
              {all.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-50 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">By type</p>
                  {(['soft', 'auth', 'hard'] as const).filter((k) => (classCounts[k] ?? 0) > 0).map((k) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${classMeta[k].color}`} />
                      <span className="text-sm text-gray-700 flex-1">{classMeta[k].label}</span>
                      <span className="text-sm font-semibold text-gray-900">{classCounts[k]}</span>
                    </div>
                  ))}
                </div>
              )}
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

          {/* Revenue forecast — Pro */}
          {(projectedRecovery > 0 || !plan.isPro) && (
            <ProGate isPro={plan.isPro} feature="Revenue recovery forecast">
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
            </ProGate>
          )}

          {/* Deliverability health — bounce + spam rates */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900">Deliverability Health</h3>
              <span className="text-xs text-gray-400">{totalEmails} emails sent</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Bounced &amp; spam-complaint addresses are auto-suppressed so you never email them again. Keep these low to stay out of spam folders.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 border ${bounceRate > 5 ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                <p className="text-xs text-gray-400 mb-1">Bounce rate</p>
                <p className={`text-2xl font-bold ${bounceRate > 5 ? 'text-red-600' : 'text-emerald-600'}`}>{bounceRate}%</p>
                <p className="text-xs text-gray-400 mt-0.5">{bounced} bounced · keep under 5%</p>
              </div>
              <div className={`rounded-xl p-4 border ${complaintRate > 0.3 ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                <p className="text-xs text-gray-400 mb-1">Spam complaint rate</p>
                <p className={`text-2xl font-bold ${complaintRate > 0.3 ? 'text-red-600' : 'text-emerald-600'}`}>{complaintRate}%</p>
                <p className="text-xs text-gray-400 mt-0.5">{complained} complaints · keep under 0.3%</p>
              </div>
            </div>
          </div>

          {/* All email/SMS channels — open & click analytics is a Pro feature */}
          <ProGate isPro={plan.isPro} feature="Email open & click analytics">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">All Message Channels</h3>
                <span className="text-xs text-gray-400">{totalTouches} total messages sent</span>
              </div>
              <p className="text-xs text-gray-400 mb-5">Every way Revova reaches your customers. Each channel does a different job. Numbers fill in automatically as emails go out — here&apos;s how each one is performing.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {channels.map(c => (
                  <div key={c.key} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">{c.emoji}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-400 leading-snug mt-0.5">{c.desc}</p>
                      </div>
                    </div>
                    <div className={`grid ${c.tracked ? 'grid-cols-3' : 'grid-cols-1'} gap-2 text-center`}>
                      <div className="bg-gray-50 rounded-lg py-2">
                        <p className="text-lg font-bold text-gray-900 leading-none">{c.sent}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">Sent</p>
                      </div>
                      {c.tracked && (
                        <>
                          <div className="bg-gray-50 rounded-lg py-2">
                            <p className={`text-lg font-bold leading-none ${c.openRate >= 40 ? 'text-emerald-600' : c.openRate >= 20 ? 'text-amber-600' : 'text-gray-500'}`}>{c.openRate}%</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">Opened</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg py-2">
                            <p className={`text-lg font-bold leading-none ${c.clickRate >= 20 ? 'text-emerald-600' : c.clickRate >= 10 ? 'text-amber-600' : 'text-gray-500'}`}>{c.clickRate}%</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">Clicked</p>
                          </div>
                        </>
                      )}
                    </div>
                    {!c.tracked && (
                      <p className="text-[11px] text-gray-400 mt-2 text-center">SMS delivery isn&apos;t open-tracked — but texts average ~98% open rates.</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                <strong>Opened</strong> = customer viewed the email. <strong>Clicked</strong> = customer tapped the button to update their card (this is what drives recovery). A healthy click rate is ~15%+.
              </p>
          </div>
          </ProGate>

          {/* Email performance table — open/click per step (Pro only) */}
          {plan.isPro && emailStats.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-0.5">Recovery Sequence — Step by Step</h3>
              <p className="text-xs text-gray-400 mb-4">Open rate and click rate for each of the 5 recovery emails — higher click rate = more customers updating their card</p>
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

          {/* Cancel-flow A/B test (Pro) */}
          {plan.isPro && abStats.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-gray-900 mb-0.5">Cancel Offer A/B Test</h3>
              <p className="text-xs text-gray-400 mb-4">Which discount variant keeps more customers from cancelling. Save rate = % who took an offer instead of leaving.</p>
              <div className="grid grid-cols-2 gap-4">
                {abStats.map(({ variant, shown, retained, saveRate }) => (
                  <div key={variant} className={`rounded-xl p-4 border ${abWinner === variant ? 'border-emerald-300 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">Variant {variant}</p>
                      {abWinner === variant && <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium">Winning</span>}
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{saveRate}%</p>
                    <p className="text-xs text-gray-400 mt-0.5">{retained} saved of {shown} shown</p>
                  </div>
                ))}
              </div>
              {abStats.length < 2 && (
                <p className="text-xs text-amber-600 mt-3">Only variant {abStats[0].variant} has data so far — results appear once both variants have been shown.</p>
              )}
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
