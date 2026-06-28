/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { enabled, discountCode, pauseMonths, giftEnabled, abEnabled, discountCodeB } = await request.json()

  const { error } = await (supabase as any)
    .from('stripe_accounts')
    .update({
      cancel_flow_enabled: !!enabled,
      cancel_flow_discount_code: discountCode ?? null,
      cancel_flow_pause_months: pauseMonths ?? 1,
      cancel_flow_gift_enabled: !!giftEnabled,
      cancel_flow_ab_enabled: !!abEnabled,
      cancel_flow_discount_code_b: discountCodeB ?? null,
    })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
