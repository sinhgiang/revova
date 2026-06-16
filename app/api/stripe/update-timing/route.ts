/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { timingDays } = await request.json()
  // timingDays: number[] — days to wait after previous email for emails 2,3,4,5
  // e.g. [2, 4, 7, 7]
  if (!Array.isArray(timingDays) || timingDays.length !== 4) {
    return NextResponse.json({ error: 'Must provide 4 timing values' }, { status: 400 })
  }

  const { error } = await (supabase as any)
    .from('stripe_accounts')
    .update({ email_timing_days: JSON.stringify(timingDays) })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
