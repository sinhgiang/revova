/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { StatsCard } from '@/components/dashboard/stats-card'
import { DollarSign, TrendingUp, Mail, AlertCircle, CheckCircle, Circle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard — Revova' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data: stripeAccount } = await db
    .from('stripe_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!stripeAccount) redirect('/onboarding')

  const { data: payments } = await db
    .from('failed_payments')
    .select('*')
    .eq('user_id', user.id)

  const allPayments = payments ?? []
  const recovered = allPayments.filter(p => p.status === 'recovered')
  const pending = allPayments.filter(p => p.status === 'pending' || p.status === 'email_sent')
  const totalRecovered = recovered.reduce((sum, p) => sum + p.amount, 0)
  const recoveryRate = allPayments.length > 0 ? Math.round((recovered.length / allPayments.length) * 100) : 0
  const emailsSent = allPayments.reduce((sum, p) => sum + (p.emails_sent ?? 0), 0)
  const currency = allPayments[0]?.currency ?? 'usd'

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
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
