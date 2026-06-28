/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GDPR "right to access / data portability": returns everything we hold for the
// signed-in merchant as a downloadable JSON file. Secrets (API keys, tokens) are
// redacted — the export is the merchant's business data, not their credentials.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = supabase as any
  const grab = async (table: string, col = 'user_id') => {
    const { data } = await db.from(table).select('*').eq(col, user.id)
    return data ?? []
  }

  const account = (await grab('stripe_accounts'))[0] ?? null
  if (account) {
    // Redact credentials from the account record
    for (const k of ['access_token', 'webhook_secret', 'smtp_password', 'twilio_auth_token', 'telegram_bot_token']) {
      if (account[k]) account[k] = '[redacted]'
    }
  }

  const payload = {
    exported_at: new Date().toISOString(),
    account_email: user.email,
    account,
    failed_payments: await grab('failed_payments'),
    email_logs: await grab('email_logs'),
    cancel_events: await grab('cancel_events', 'merchant_user_id'),
    winback_contacts: await grab('winback_contacts'),
    expiring_cards: await grab('expiring_cards'),
    email_blacklist: await grab('email_blacklist'),
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="revova-data-export-${user.id.slice(0, 8)}.json"`,
    },
  })
}
