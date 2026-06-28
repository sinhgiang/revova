/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { AdminBar } from '@/components/admin/admin-bar'
import { HistoricalRecoveryClient } from '@/components/dashboard/historical-recovery-client'

export const dynamic = 'force-dynamic'

export default async function RecoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const db = supabase as any

  let existing: any[] = []
  try {
    const { data } = await db.from('historical_recovery').select('status, emails_sent').eq('user_id', user.id)
    existing = data ?? []
  } catch { existing = [] }

  const enrolled = existing.length
  const emailsSent = existing.reduce((s, h) => s + (h.emails_sent ?? 0), 0)
  const done = existing.filter(h => h.status === 'done').length

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AdminBar />
        <div className="p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Recover past failed payments</h1>
            <p className="text-gray-500 mt-1">Win back customers whose payments failed before you joined Revova — with a friendly, throttled re-engagement campaign.</p>
          </div>
          <HistoricalRecoveryClient enrolled={enrolled} emailsSent={emailsSent} done={done} />
        </div>
      </main>
    </div>
  )
}
