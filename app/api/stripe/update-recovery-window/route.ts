/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { windowDays, smartRetry } = await request.json()
  // Clamp to a sane range
  const days = Math.max(7, Math.min(90, Number(windowDays) || 30))

  const { error } = await (supabase as any)
    .from('stripe_accounts')
    .update({ recovery_window_days: days, smart_retry_enabled: !!smartRetry })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
