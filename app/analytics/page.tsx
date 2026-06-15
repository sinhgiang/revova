/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { formatCurrency } from '@/lib/utils'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payments } = await (supabase as any)
    .from('failed_payments')
    .select('*')
    .eq('user_id', user.id)

  const allPayments = payments ?? []
  const recovered = allPayments.filter(p => p.status === 'recovered')
  const failed = allPayments.filter(p => p.status === 'failed')
  const pending = allPayments.filter(p => p.status === 'pending' || p.status === 'email_sent')
  const totalRecovered = recovered.reduce((sum, p) => sum + p.amount, 0)
  const totalAtRisk = pending.reduce((sum, p) => sum + p.amount, 0)
  const recoveryRate = allPayments.length > 0 ? Math.round((recovered.length / allPayments.length) * 100) : 0
  const currency = allPayments[0]?.currency ?? 'usd'

  const declineCodes = allPayments.reduce((acc, p) => {
    const code = p.decline_code ?? 'unknown'
    acc[code] = (acc[code] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Deep insights into your payment recovery performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Revenue Recovered', value: formatCurrency(totalRecovered, currency), color: 'emerald' },
              { label: 'Recovery Rate', value: `${recoveryRate}%`, color: 'indigo' },
              { label: 'Revenue at Risk', value: formatCurrency(totalAtRisk, currency), color: 'amber' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className={`text-3xl font-bold mt-1 text-${color}-600`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Status Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Recovered', count: recovered.length, color: 'bg-emerald-500' },
                  { label: 'In Progress', count: pending.length, color: 'bg-blue-500' },
                  { label: 'Failed', count: failed.length, color: 'bg-red-500' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm text-gray-600 flex-1">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Top Decline Reasons</h3>
              {Object.keys(declineCodes).length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(declineCodes)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([code, count]) => (
                      <div key={code} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{code.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-semibold text-gray-900">{count as number}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
