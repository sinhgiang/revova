/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { enabled, accountSid, authToken, fromNumber } = await request.json()

  // Only overwrite credentials that were actually provided — keeps existing
  // secrets intact when the user just toggles the switch.
  const update: Record<string, any> = { sms_enabled: !!enabled }
  if (accountSid) update.twilio_account_sid = accountSid
  if (authToken) update.twilio_auth_token = authToken
  if (fromNumber) update.twilio_from_number = fromNumber

  const { error } = await (supabase as any)
    .from('stripe_accounts')
    .update(update)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
