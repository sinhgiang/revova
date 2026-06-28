/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { resolvePlan } from '@/lib/plan'
import { ADMIN_EMAIL } from '@/lib/admin'
import Link from 'next/link'
import { Users, DollarSign, TrendingUp, CreditCard, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STARTER_PRICE = 29
const PRO_PRICE = 79

export default async function AdminPage() {
  // ── Access: founder only ──
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) redirect('/dashboard')

  const admin = await createAdminClient()
  const db = admin as any

  // ── Pull everything (service-role bypasses RLS) ──
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000, page: 1 })
  const { data: accounts } = await db.from('stripe_accounts').select('user_id, business_name, email, connected_at')
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

  const tierBadge = (t: string) => {
    const map: Record<string, string> = {
      pro: 'bg-purple-100 text-purple-700',
      starter: 'bg-indigo-100 text-indigo-700',
      trial: 'bg-amber-100 text-amber-700',
      expired: 'bg-gray-100 text-gray-500',
    }
    return map[t] ?? 'bg-gray-100 text-gray-500'
  }

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
        {/* Top metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {card(<Users className="w-4 h-4 text-white" />, 'Signups', String(totalSignups), `${onboarded} onboarded · +${newThisWeek} this week`, 'bg-indigo-500')}
          {card(<CreditCard className="w-4 h-4 text-white" />, 'Paying', String(paying), `${conversion}% conversion`, 'bg-emerald-500')}
          {card(<DollarSign className="w-4 h-4 text-white" />, 'MRR', `$${mrr.toLocaleString()}`, `$${arr.toLocaleString()} ARR · ${tierCount.pro} Pro · ${tierCount.starter} Starter`, 'bg-purple-500')}
          {card(<TrendingUp className="w-4 h-4 text-white" />, 'Recovered for customers', formatCurrency(totalRevenue, recovCurrency), `${totalRecovered} payments`, 'bg-amber-500')}
        </div>

        {/* Plan breakdown + system health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
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
              <div className="bg-gray-50 rounded-lg py-3">
                <p className="text-2xl font-bold text-gray-900">{(emailCount ?? 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-0.5">Emails sent</p>
              </div>
              <div className="bg-gray-50 rounded-lg py-3">
                <p className="text-2xl font-bold text-gray-900">{overallRate}%</p>
                <p className="text-xs text-gray-400 mt-0.5">Recovery rate</p>
              </div>
              <div className="bg-gray-50 rounded-lg py-3">
                <p className="text-2xl font-bold text-gray-900">{(suppressed ?? 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-0.5">Suppressed (bounce/spam)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Needs attention */}
        {attention.length > 0 && (
          <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden mb-6">
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
        )}

        {/* Merchant table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">All merchants ({merchants.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Business</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium text-right">Days</th>
                  <th className="px-5 py-3 font-medium text-right">Failed</th>
                  <th className="px-5 py-3 font-medium text-right">Recovered</th>
                  <th className="px-5 py-3 font-medium text-right">Rate</th>
                  <th className="px-5 py-3 font-medium text-right">Revenue saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {merchants.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">No merchants onboarded yet.</td></tr>
                ) : merchants.map((m, i) => (
                  <tr key={i} className="hover:bg-indigo-50/40">
                    <td className="px-5 py-3">
                      <Link href={`/admin/merchant/${m.userId}`} className="font-medium text-indigo-600 hover:underline">{m.name}</Link>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${tierBadge(m.tier)}`}>{m.tier}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600">{m.daysActive}d</td>
                    <td className="px-5 py-3 text-right text-gray-600">{m.total}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{m.recovered}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">{m.rate}%</td>
                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">{formatCurrency(m.revenue, m.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent admin changes (audit log) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6">
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

        <p className="text-xs text-gray-400 mt-4">Private admin view · only visible to {ADMIN_EMAIL}</p>
      </div>
    </div>
  )
}
