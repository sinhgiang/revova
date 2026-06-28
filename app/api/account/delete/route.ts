/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// GDPR "right to erasure": permanently delete the signed-in merchant's account
// and ALL of their data. Requires an explicit confirmation in the body.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { confirm } = await request.json().catch(() => ({}))
  if (confirm !== 'DELETE') {
    return NextResponse.json({ error: 'Confirmation required' }, { status: 400 })
  }

  const admin = await createAdminClient()
  const db = admin as any
  const uid = user.id

  // Delete all business data tied to this merchant
  const byUser = ['email_logs', 'failed_payments', 'winback_contacts', 'expiring_cards', 'email_blacklist', 'payment_connections', 'subscriptions', 'stripe_accounts']
  for (const t of byUser) {
    try { await db.from(t).delete().eq('user_id', uid) } catch (e) { console.error(`delete ${t}:`, e) }
  }
  try { await db.from('cancel_events').delete().eq('merchant_user_id', uid) } catch (e) { console.error('delete cancel_events:', e) }

  // Finally delete the auth user itself
  try {
    await admin.auth.admin.deleteUser(uid)
  } catch (e) {
    console.error('delete auth user:', e)
    return NextResponse.json({ error: 'Data deleted, but account removal failed. Contact support.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
