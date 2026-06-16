/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const supabase = await createAdminClient()

  const { data: account } = await (supabase as any)
    .from('stripe_accounts')
    .select('business_name, cancel_flow_enabled, cancel_flow_discount_code, cancel_flow_pause_months')
    .eq('user_id', userId)
    .single()

  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    businessName: account.business_name ?? 'Our Service',
    cancelFlowEnabled: account.cancel_flow_enabled ?? false,
    discountCode: account.cancel_flow_discount_code ?? null,
    pauseMonths: account.cancel_flow_pause_months ?? 1,
  })
}
