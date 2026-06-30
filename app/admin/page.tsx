/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { resolvePlan } from '@/lib/plan'
import { ADMIN_EMAIL } from '@/lib/admin'
import { scanLost, type LostBuckets } from '@/lib/stripe-lost-scan'
import { AdminTabs, AdminTab } from '@/components/admin/admin-tabs'
import { MerchantsTable } from '@/components/admin/merchants-table'
import Link from 'next/link'
import { Users, DollarSign, TrendingUp, CreditCard, Zap, Search, LayoutDashboard, AlertTriangle, History } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const STARTER_PRICE = 29
const PRO_PRICE = 79
const SCAN_CAP = 50 // cap live Stripe scans per admin load to bound latency

export default async function AdminPage() {
  // ── Access: founder only ──
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) redirect('/dashboard')

  const admin = await createAdminClient()
  const db = admin as any

  // ── Pull everything (service-role bypasses RLS) ──
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000, page: 1 })
  const { data: accounts } = await db.from('stripe_accounts').select('user_id, business_name, email, connected_at, access_token')
  const { data: subs } = await db.from('subscriptions').select('user_id, plan_id, status, current_period_end')
  const { data: payments } = await db.from('failed_payments').select('user_id, status, amount, currency, created_at')
  const { count: emailCount } = await db.from('email_logs').select('id', { count: 'exact', head: true })
  const { count: suppressed } = await db.from('email_blacklist').select('id', { count: 'exact', head: true })
  const { data: recentAudit } = await db.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(15)
  const { data: blacklist } = await db.from('email_blacklist').select('user_id')

  const accountList: any[] = accounts ?? []
  const subByUser = new Map((subs ?? []).map((s: any) => [s.user_id, s]))
  const authByUser = new Map((authUsers ?? []).map((u: any) => [u.id, u]))
  const suppByUser = new Map<string, number>()
  for (const b of blacklist ?? []) suppByUser.set(b.user_id, (suppByUser.get(b.user_id) ?? 0) + 1)

  // ── Per-merchant payment stats ──
  const pByUser = new Map<string, { total: number; recovered: number; revenue: number; currency: string }>()
  for (const p of payments ?? []) {
    const e = pByUser.get(p.user_id) ?? { total: 0, recovered: 0, revenue: 0, currency: p.currency ?? 'usd' }
    e.total++
    if (p.status === 'recovered') { e.recovered++; e.revenue += p.amount ?? 0 }
    pByUser.set(p.user_id, e)
  }

  // ── Build merchant rows ──
  const now = Date.now()
  const merchants = accountList.map(acc => {
    const sub = subByUser.get(acc.user_id)
    const plan = resolvePlan(acc, sub)
    const stats = pByUser.get(acc.user_id) ?? { total: 0, recovered: 0, revenue: 0, currency: 'usd' }
    const authU = authByUser.get(acc.user_id)
    const joined = acc.connected_at ? new Date(acc.connected_at).getTime() : now
    const daysActive = Math.max(0, Math.floor((now - joined) / 86_400_000))
    const rate = stats.total > 0 ? Math.round((stats.recovered / stats.total) * 100) : 0
    return {
      userId: acc.user_id,
      name: acc.business_name || authU?.email || acc.email || '—',
      email: authU?.email ?? acc.email ?? '—',
      tier: plan.tier,
      daysActive,
      trialDaysLeft: plan.trialDaysLeft,
      suppressed: suppByUser.get(acc.user_id) ?? 0,
      ...stats,
      rate,
    }
  }).sort((a, b) => b.revenue - a.revenue)

  // ── Lost Revenue Finder across all merchants (live Stripe scan) ──
  // Shows the founder the real past-failure opportunity Revova surfaces for
  // customers. Only Stripe-connected accounts can be scanned today.
  const accessByUser = new Map(accountList.map((a: any) => [a.user_id, a.access_token]))
  const scanTargets = merchants.filter(m => accessByUser.get(m.userId)).slice(0, SCAN_CAP)
  const lostResults = await Promise.all(
    scanTargets.map(async m => [m.userId, await scanLost(accessByUser.get(m.userId) as string)] as const)
  )
  const lostByUser = new Map<string, LostBuckets>(lostResults)
  merchants.forEach(m => { (m as any).lost = lostByUser.get(m.userId) ?? null })
  let lost30 = 0, lost90 = 0, lost365 = 0, c30 = 0, c90 = 0, c365 = 0
  for (const [, b] of lostByUser) {
    lost30 += b.d30.a; lost90 += b.m3.a; lost365 += b.y1.a
    c30 += b.d30.c; c90 += b.m3.c; c365 += b.y1.c
  }
  const recoverable365 = Math.round(lost365 * 0.5)

  // ── Totals ──
  const totalSignups = (authUsers ?? []).length
  const onboarded = accountList.length
  const tierCount = { trial: 0, starter: 0, pro: 0, expired: 0 } as Record<string, number>
  for (const m of merchants) tierCount[m.tier] = (tierCount[m.tier] ?? 0) + 1
  const paying = tierCount.starter + tierCount.pro
  const mrr = tierCount.starter * STARTER_PRICE + tierCount.pro * PRO_PRICE
  const conversion = totalSignups > 0 ? Math.round((paying / totalSignups) * 100) : 0
  const totalFailed = (payments ?? []).length
  const totalRecovered = (payments ?? []).filter((p: any) => p.status === 'recovered').length
  const totalRevenue = (payments ?? []).filter((p: any) => p.status === 'recovered').reduce((s: number, p: any) => s + (p.amount ?? 0), 0)
  const overallRate = totalFailed > 0 ? Math.round((totalRecovered / totalFailed) * 100) : 0
  const recovCurrency = (payments ?? [])[0]?.currency ?? 'usd'
  const arr = mrr * 12
  const weekAgo = now - 7 * 86_400_000
  const newThisWeek = (authUsers ?? []).filter((u: any) => u.created_at && new Date(u.created_at).getTime() >= weekAgo).length

  // ── Needs attention: merchants the founder should proactively help/keep ──
  const onboardedIds = new Set(accountList.map((a: any) => a.user_id))
  const attention: { name: string; email: string; userId?: string; reasons: string[] }[] = []
  for (const m of merchants) {
    const reasons: string[] = []
    if (m.tier === 'trial' && m.trialDaysLeft <= 3) reasons.push(`⏰ Trial ends in ${m.trialDaysLeft}d`)
    if (m.tier === 'expired') reasons.push('🔒 Trial expired, not paying')
    if (m.total >= 5 && m.rate < 30) reasons.push(`📉 Low recovery rate (${m.rate}%)`)
    if (m.suppressed > 0) reasons.push(`📧 ${m.suppressed} bounced/spam — deliverability issue`)
    if (reasons.length) attention.push({ name: m.name, email: m.email, userId: m.userId, reasons })
  }
  // Signed up but never connected a processor
  for (const u of authUsers ?? []) {
    if (!onboardedIds.has(u.id)) attention.push({ name: u.email ?? u.id.slice(0, 8), email: u.email ?? '—', reasons: ['🔌 Signed up but never connected'] })
  }

  // Rows for the filterable client-side merchants table.
  const merchantRows = merchants.map(m => {
    const l = (m as any).lost as LostBuckets | null
    return {
      userId: m.userId, name: m.name, email: m.email, tier: m.tier, daysActive: m.daysActive,
      total: m.total, recovered: m.recovered, revenue: m.revenue, currency: m.currency, rate: m.rate,
      lost30: l?.d30.a ?? 0, lost90: l?.m3.a ?? 0, lost365: l?.y1.a ?? 0, lostCount: l?.y1.c ?? 0,
    }
  })

  const card = (icon: React.ReactNode, label: string, value: string, sub: string, color: string) => (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Revova Admin</span>
          </div>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Back to app</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <AdminTabs>
          {/* ───────── Overview ───────── */}
          <AdminTab id="overview" label="Overview" icon={<LayoutDashboard className="w-4 h-4" />}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {card(<Users className="w-4 h-4 text-white" />, 'Signups', String(totalSignups), `${onboarded} onboarded · +${newThisWeek} this week`, 'bg-indigo-500')}
              {card(<CreditCard className="w-4 h-4 text-white" />, 'Paying', String(paying), `${conversion}% conversion`, 'bg-emerald-500')}
              {card(<DollarSign className="w-4 h-4 text-white" />, 'MRR', `$${mrr.toLocaleString()}`, `$${arr.toLocaleString()} ARR · ${tierCount.pro} Pro · ${tierCount.starter} Starter`, 'bg-purple-500')}
              {card(<TrendingUp className="w-4 h-4 text-white" />, 'Recovered for customers', formatCurrency(totalRevenue, recovCurrency), `${totalRecovered} payments`, 'bg-amber-500')}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Plan breakdown</h3>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {([['Trial', tierCount.trial, 'text-amber-600'], ['Starter', tierCount.starter, 'text-indigo-600'], ['Pro', tierCount.pro, 'text-purple-600'], ['Expired', tierCount.expired, 'text-gray-400']] as const).map(([l, n, c]) => (
                    <div key={l} className="bg-gray-50 rounded-lg py-3">
                      <p className={`text-2xl font-bold ${c}`}>{n}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">System health</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 rounded-lg py-3"><p className="text-2xl font-bold text-gray-900">{(emailCount ?? 0).toLocaleString()}</p><p className="text-xs text-gray-400 mt-0.5">Emails sent</p></div>
                  <div className="bg-gray-50 rounded-lg py-3"><p className="text-2xl font-bold text-gray-900">{overallRate}%</p><p className="text-xs text-gray-400 mt-0.5">Recovery rate</p></div>
                  <div className="bg-gray-50 rounded-lg py-3"><p className="text-2xl font-bold text-gray-900">{(suppressed ?? 0).toLocaleString()}</p><p className="text-xs text-gray-400 mt-0.5">Suppressed (bounce/spam)</p></div>
                </div>
              </div>
            </div>
          </AdminTab>

          {/* ───────── Merchants (filterable) ───────── */}
          <AdminTab id="merchants" label="Merchants" icon={<Users className="w-4 h-4" />} badge={merchants.length}>
            <MerchantsTable merchants={merchantRows} />
          </AdminTab>

          {/* ───────── Lost Revenue ───────── */}
          <AdminTab id="lost" label="Lost Revenue" icon={<Search className="w-4 h-4" />}>
            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Search className="w-4 h-4 text-white" /></div>
                <h3 className="font-semibold text-gray-900">Lost Revenue Finder — across all merchants</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Past failed payments Revova surfaced for your customers · live scan of {scanTargets.length} Stripe-connected account{scanTargets.length === 1 ? '' : 's'}.
              </p>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">All merchants combined</p>
              <div className="grid grid-cols-3 gap-3">
                {([['Last 30 days', lost30, c30], ['Last 3 months', lost90, c90], ['Last 12 months', lost365, c365]] as const).map(([label, amt, cnt]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5">{label}</p>
                    <p className={`text-xl font-bold ${amt > 0 ? 'text-red-600' : 'text-gray-400'}`}>{formatCurrency(amt)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cnt} failed payment{cnt === 1 ? '' : 's'}</p>
                  </div>
                ))}
              </div>
              {c365 > 0 && (
                <p className="text-sm text-emerald-700 mt-3 font-medium">
                  ~{formatCurrency(recoverable365)} recoverable (≈50%) — the value Revova can deliver across your customers.
                </p>
              )}
              {scanTargets.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">By merchant</p>
                  <div className="space-y-1.5">
                    {scanTargets.map(m => {
                      const l = (m as any).lost as LostBuckets | null
                      return (
                        <div key={m.userId} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2">
                          <Link href={`/admin/merchant/${m.userId}`} className="text-sm font-medium text-indigo-600 hover:underline truncate min-w-0">{m.name}</Link>
                          {l && l.y1.c > 0 ? (
                            <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                              30d <strong className="text-red-600">{formatCurrency(l.d30.a)}</strong> · 3mo <strong className="text-red-600">{formatCurrency(l.m3.a)}</strong> · 12mo <strong className="text-red-600">{formatCurrency(l.y1.a)}</strong> <span className="text-gray-400">· {l.y1.c} failed</span>
                            </span>
                          ) : (
                            <span className="text-xs text-emerald-600 flex-shrink-0">Clean — no past failures ✓</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </AdminTab>

          {/* ───────── Needs attention ───────── */}
          <AdminTab id="attention" label="Needs attention" icon={<AlertTriangle className="w-4 h-4" />} badge={attention.length}>
            {attention.length > 0 ? (
              <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-amber-100 bg-amber-50">
                  <h3 className="font-semibold text-amber-900">⚠️ Needs attention ({attention.length})</h3>
                  <p className="text-xs text-amber-700 mt-0.5">Merchants worth a proactive reach-out — convert, support, or fix.</p>
                </div>
                <ul className="divide-y divide-gray-50">
                  {attention.map((a, i) => (
                    <li key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        {a.userId ? <a href={`/admin/merchant/${a.userId}`} className="font-medium text-indigo-600 hover:underline">{a.name}</a> : <span className="font-medium text-gray-700">{a.name}</span>}
                        <p className="text-xs text-gray-400 truncate">{a.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {a.reasons.map((r, j) => (
                          <span key={j} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">{r}</span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">All clear — no merchants need attention right now. 🎉</div>
            )}
          </AdminTab>

          {/* ───────── Activity ───────── */}
          <AdminTab id="activity" label="Activity" icon={<History className="w-4 h-4" />}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Recent admin activity</h3></div>
              {(recentAudit ?? []).length === 0 ? (
                <p className="px-5 py-6 text-sm text-gray-400">No admin changes recorded yet.</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {(recentAudit ?? []).map((a: any) => (
                    <li key={a.id} className="px-5 py-3 flex items-center justify-between text-sm">
                      <span className="text-gray-700"><strong>{a.merchant_name ?? a.merchant_user_id?.slice(0, 8)}</strong> — {a.action}</span>
                      <span className="text-xs text-gray-400">{formatDate(a.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </AdminTab>
        </AdminTabs>

        <p className="text-xs text-gray-400 mt-6">Private admin view · only visible to {ADMIN_EMAIL}</p>
      </div>
    </div>
  )
}
