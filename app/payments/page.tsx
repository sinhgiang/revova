/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { StatusBadge } from '@/components/payments/status-badge'
import { formatCurrency, formatDate, getDeclineMessage } from '@/lib/utils'
import { FailedPaymentStatus } from '@/types'

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payments } = await (supabase as any)
    .from('failed_payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allPayments = payments ?? []

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Failed Payments</h1>
            <p className="text-gray-500 mt-1">{allPayments.length} total · Revova is recovering these automatically</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {allPayments.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-medium text-gray-900">No failed payments yet</p>
                <p className="text-gray-500 text-sm mt-1">When Stripe detects a failed payment, it will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Customer</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Amount</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Decline Reason</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Emails Sent</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Status</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allPayments.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{p.customer_name ?? 'Unknown'}</p>
                          <p className="text-gray-500 text-xs">{p.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatCurrency(p.amount, p.currency)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {getDeclineMessage(p.decline_code)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.emails_sent}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status as FailedPaymentStatus} />
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
