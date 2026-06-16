/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { PaymentsClient } from '@/components/payments/payments-client'

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Failed Payments</h1>
              <p className="text-gray-500 mt-1">{allPayments.length} total · Revova is recovering these automatically</p>
            </div>
            {allPayments.length > 0 && (
              <a
                href="/api/payments/export"
                download="revova-payments.csv"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                ↓ Export CSV
              </a>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <PaymentsClient payments={allPayments} />
          </div>
        </div>
      </main>
    </div>
  )
}
