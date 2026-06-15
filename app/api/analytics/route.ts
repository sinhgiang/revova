/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payments } = await (supabase as any)
    .from('failed_payments')
    .select('*')
    .eq('user_id', user.id)

  if (!payments) return NextResponse.json({ totalRecovered: 0, recoveryRate: 0, pendingPayments: 0, emailsSent: 0 })

  const recovered = payments.filter(p => p.status === 'recovered')
  const pending = payments.filter(p => p.status === 'pending' || p.status === 'email_sent')
  const totalEmailsSent = payments.reduce((sum, p) => sum + (p.emails_sent ?? 0), 0)
  const totalRecovered = recovered.reduce((sum, p) => sum + p.amount, 0)
  const recoveryRate = payments.length > 0 ? Math.round((recovered.length / payments.length) * 100) : 0

  return NextResponse.json({
    totalRecovered,
    recoveryRate,
    pendingPayments: pending.length,
    emailsSent: totalEmailsSent,
    totalFailed: payments.length,
    currency: payments[0]?.currency ?? 'usd',
  })
}
