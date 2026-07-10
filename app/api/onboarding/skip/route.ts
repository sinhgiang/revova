/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Lets a merchant enter the app without connecting a processor yet. We create a
// placeholder account row so (a) the dashboard renders and stops redirecting
// back to onboarding, and (b) the 14-day trial clock starts. The in-app Setup
// Checklist then nudges them to connect a processor from Settings. Idempotent:
// if a row already exists (e.g. they connected Stripe or another processor),
// this does nothing.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = supabase as any
  const { data: existing } = await db
    .from('stripe_accounts').select('user_id').eq('user_id', user.id).maybeSingle()

  if (!existing) {
    const { error } = await db.from('stripe_accounts').insert({
      user_id: user.id,
      stripe_account_id: `acct_pending_${user.id.replace(/-/g, '').slice(0, 16)}`,
      access_token: '', // NOT NULL column; empty = no Stripe key yet. Every Stripe call guards on `if (!access_token)`, so this is safely skipped.
      business_name: null,
      email: user.email ?? null,
      connected_at: new Date().toISOString(),
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
