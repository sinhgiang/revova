/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { StatsCard } from '@/components/dashboard/stats-card'
import { DollarSign, TrendingUp, Mail, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

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
            <h2 className="font-semibold text-gray-900 mb-4">Recent Failed Payments</h2>
            {allPayments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-medium text-gray-900">All clear!</p>
                <p className="text-gray-500 text-sm mt-1">No failed payments detected yet. Revova is watching.</p>
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
                              'bg-yellow-50 text-yellow-700'}`}>
                            {p.status.replace('_', ' ')}
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
