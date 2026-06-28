/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { StatsCard } from '@/components/dashboard/stats-card'
import { DollarSign, TrendingUp, Mail, AlertCircle, CheckCircle, Circle, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { churnRisk } from '@/lib/health-score'
import { getPlanFor } from '@/lib/plan'
import { TrialBanner } from '@/components/plan/trial-banner'
import { StripeScan } from '@/components/dashboard/stripe-scan'
import { getAppContext } from '@/lib/impersonate'
import { ImpersonationBanner } from '@/components/admin/impersonate-controls'
import { AdminBar } from '@/components/admin/admin-bar'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard — Revova' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const ctx = await getAppContext(supabase)
  if (!ctx) redirect('/login')
  const db = ctx.db
  const userId = ctx.userId

  const { data: stripeAccount } = await db
    .from('stripe_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!stripeAccount) redirect('/onboarding')

  // Plan gate: trial users keep access; expired (unpaid past trial) → paywall.
  // Skip the paywall when the admin is impersonating (so they can support anyone).
  const plan = await getPlanFor(db, userId)
  if (!ctx.impersonating && !plan.hasAccess) redirect('/billing?expired=1')

  const { data: payments } = await db
    .from('failed_payments')
    .select('*')
    .eq('user_id', userId)

  const allPayments = payments ?? []
  const recovered = allPayments.filter(p => p.status === 'recovered')
  const pending = allPayments.filter(p => p.status === 'pending' || p.status === 'email_sent')
  const totalRecovered = recovered.reduce((sum, p) => sum + p.amount, 0)
  const recoveryRate = allPayments.length > 0 ? Math.round((recovered.length / allPayments.length) * 100) : 0
  const emailsSent = allPayments.reduce((sum, p) => sum + (p.emails_sent ?? 0), 0)
  const currency = allPayments[0]?.currency ?? 'usd'

  // At-risk: pending payments that have received 3+ emails without resolving
  const atRisk = allPayments.filter(p =>
    (p.emails_sent ?? 0) >= 3 &&
    !['recovered', 'cancelled', 'max_emails_reached'].includes(p.status)
  )

  // Customers In Danger: cards expiring this/next month (populated by pre-dunning cron).
  // Only show cards that haven't already expired in a past month.
  const now = new Date()
  const curY = now.getFullYear()
  const curM = now.getMonth() + 1
  const { data: expiringCardsRaw } = await db
    .from('expiring_cards')
    .select('*')
    .eq('user_id', userId)
    .order('exp_year', { ascending: true })
    .order('exp_month', { ascending: true })
  const expiringCards = (expiringCardsRaw ?? []).filter(
    (c: any) => c.exp_year > curY || (c.exp_year === curY && c.exp_month >= curM)
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {ctx.impersonating ? <ImpersonationBanner name={stripeAccount.business_name ?? 'merchant'} /> : <AdminBar />}
        <div className="p-8">
          {plan.isTrial && <TrialBanner daysLeft={plan.trialDaysLeft} />}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              {stripeAccount.business_name ? `Protecting ${stripeAccount.business_name}` : 'Your revenue recovery overview'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Recovered"
              value={formatCurrency(totalRecovered, currency)}
              subtitle="Revenue saved"
              icon={<DollarSign className="w-6 h-6" />}
            />
            <StatsCard
              title="Recovery Rate"
              value={`${recoveryRate}%`}
              subtitle="of failed payments"
              icon={<TrendingUp className="w-6 h-6" />}
            />
            <StatsCard
              title="Emails Sent"
              value={emailsSent.toString()}
              subtitle="Recovery emails"
              icon={<Mail className="w-6 h-6" />}
            />
            <StatsCard
              title="Pending Recovery"
              value={pending.length.toString()}
              subtitle="Awaiting response"
              icon={<AlertCircle className="w-6 h-6" />}
            />
          </div>

          {!ctx.impersonating && <StripeScan />}

          {atRisk.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <h2 className="font-semibold text-amber-900">At-Risk Customers ({atRisk.length})</h2>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                These customers have received 3+ recovery emails without paying. Consider reaching out manually.
              </p>
              <div className="space-y-2">
                {atRisk
                  .map(p => ({ p, risk: churnRisk(p) }))
                  .sort((a, b) => b.risk.score - a.risk.score)
                  .slice(0, 5)
                  .map(({ p, risk }) => (
                  <div key={p.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-amber-100">
                    <span className="font-medium text-gray-900">{p.customer_email}</span>
                    <span className="flex items-center gap-2 text-gray-500">
                      {formatCurrency(p.amount, p.currency)} · {p.emails_sent} emails
                      {/* Churn risk score is a Pro feature */}
                      {plan.isPro && (
                        <span className={`text-xs font-semibold ${risk.color}`} title={`Churn risk: ${risk.score}/100`}>
                          {risk.label} risk
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {atRisk.length > 5 && (
                  <Link href="/payments" className="block text-center text-xs text-amber-700 hover:underline pt-1">
                    +{atRisk.length - 5} more — view all →
                  </Link>
                )}
                {!plan.isPro && (
                  <Link href="/billing" className="block text-center text-xs font-medium text-indigo-600 hover:underline pt-1">
                    🔒 Unlock AI churn-risk scoring with Pro →
                  </Link>
                )}
              </div>
            </div>
          )}

          {expiringCards.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <h2 className="font-semibold text-orange-900">Customers In Danger ({expiringCards.length})</h2>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                These cards expire soon. Revova emails them proactively before the payment fails — no action needed.
              </p>
              <div className="space-y-2">
                {expiringCards.slice(0, 5).map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-orange-100">
                    <span className="font-medium text-gray-900">{c.customer_email}</span>
                    <span className="text-gray-500">
                      {c.last4 ? `•••• ${c.last4} · ` : ''}expires {String(c.exp_month).padStart(2, '0')}/{c.exp_year}
                      {c.notified_at ? ' · notified' : ''}
                    </span>
                  </div>
                ))}
                {expiringCards.length > 5 && (
                  <p className="text-center text-xs text-orange-700 pt-1">+{expiringCards.length - 5} more</p>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Failed Payments</h2>
              <a href="/payments" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</a>
            </div>
            {allPayments.length === 0 ? (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Revova is live and watching</p>
                  <p className="text-gray-500 text-sm mt-1">No failed payments yet. Complete setup below to ensure everything is ready.</p>
                </div>
                <div className="max-w-sm mx-auto space-y-3">
                  {[
                    { done: true, label: 'Connect your Stripe account', href: null },
                    { done: !!stripeAccount.webhook_secret, label: 'Configure Stripe webhook', href: '/settings' },
                    { done: !!stripeAccount.business_name, label: 'Set your business name', href: '/settings' },
                    { done: !!stripeAccount.slack_webhook_url, label: 'Add Slack notifications (optional)', href: '/settings' },
                  ].map(({ done, label, href }) => (
                    <div key={label} className="flex items-center gap-3">
                      {done
                        ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                      {href && !done
                        ? <Link href={href} className="text-sm text-indigo-600 hover:underline">{label}</Link>
                        : <span className={`text-sm ${done ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-medium text-gray-500 pb-3">Customer</th>
                      <th className="text-left font-medium text-gray-500 pb-3">Amount</th>
                      <th className="text-left font-medium text-gray-500 pb-3">Reason</th>
                      <th className="text-left font-medium text-gray-500 pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allPayments.slice(0, 5).map(p => (
                      <tr key={p.id}>
                        <td className="py-3 text-gray-900">{p.customer_email}</td>
                        <td className="py-3 text-gray-900">{formatCurrency(p.amount, p.currency)}</td>
                        <td className="py-3 text-gray-500 capitalize">{p.decline_code?.replace(/_/g, ' ') ?? 'Unknown'}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                            ${p.status === 'recovered' ? 'bg-emerald-50 text-emerald-700' :
                              p.status === 'email_sent' ? 'bg-blue-50 text-blue-700' :
                              p.status === 'failed' ? 'bg-red-50 text-red-700' :
                              p.status === 'max_emails_reached' || p.status === 'cancelled' ? 'bg-gray-50 text-gray-600' :
                              'bg-yellow-50 text-yellow-700'}`}>
                            {p.status === 'max_emails_reached' ? 'Max Emails' : p.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
