/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSMS } from '@/lib/sms/twilio'

// Sends a one-off test SMS using the merchant's SAVED Twilio credentials so they
// can confirm their setup works before relying on it for live recovery.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { testPhone } = await request.json()
  if (!testPhone) return NextResponse.json({ error: 'Enter a phone number to test' }, { status: 400 })

  const { data: account } = await (supabase as any)
    .from('stripe_accounts')
    .select('twilio_account_sid, twilio_auth_token, twilio_from_number, business_name')
    .eq('user_id', user.id)
    .single()

  if (!account?.twilio_account_sid || !account?.twilio_auth_token || !account?.twilio_from_number) {
    return NextResponse.json(
      { error: 'Save your Twilio Account SID, Auth Token, and From number first, then test.' },
      { status: 400 }
    )
  }

  const business = account.business_name ?? 'Revova'
  const result = await sendSMS(
    {
      accountSid: account.twilio_account_sid,
      authToken: account.twilio_auth_token,
      fromNumber: account.twilio_from_number,
    },
    testPhone,
    `${business}: this is a test message from Revova. Your SMS recovery is set up correctly. ✅`
  )

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'SMS failed to send' }, { status: 400 })
  }
  return NextResponse.json({ ok: true, sid: result.sid })
}
