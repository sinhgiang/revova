/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: account } = await (supabase as any)
    .from('stripe_accounts')
    .select('outbound_webhook_url, business_name')
    .eq('user_id', user.id)
    .single()

  if (!account?.outbound_webhook_url) {
    return NextResponse.json({ error: 'No webhook URL configured' }, { status: 400 })
  }

  const payload = {
    event: 'payment.recovered',
    test: true,
    data: {
      customerEmail: 'alex@example.com',
      customerName: 'Alex Test',
      amount: 4900,
      currency: 'usd',
      businessName: account.business_name,
      recoveredAt: new Date().toISOString(),
    },
  }

  try {
    const res = await fetch(account.outbound_webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Revova-Event': 'payment.recovered' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`Webhook returned ${res.status}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
