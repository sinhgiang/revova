/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdapter } from '@/lib/processors'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // The connect form sends snake_case keys that map 1:1 to the DB columns.
  const { processor, api_key, api_secret, webhook_secret, site, card_update_url, businessName } = await request.json()

  if (!getAdapter(processor)) {
    return NextResponse.json({ error: `Processor '${processor}' is not available yet` }, { status: 400 })
  }

  const db = supabase as any

  // Ensure a settings row exists so the recovery core has business name, email
  // config, etc. (shared across all processors).
  const { data: existingAccount } = await db
    .from('stripe_accounts')
    .select('user_id, business_name')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!existingAccount) {
    await db.from('stripe_accounts').insert({
      user_id: user.id,
      stripe_account_id: `acct_${processor}_${user.id.replace(/-/g, '').slice(0, 16)}`,
      business_name: businessName?.trim() || null,
      email: user.email ?? null,
      connected_at: new Date().toISOString(),
    })
  } else if (businessName?.trim() && !existingAccount.business_name) {
    // Fill in the business name if it wasn't set yet (used in every email)
    await db.from('stripe_accounts').update({ business_name: businessName.trim() }).eq('user_id', user.id)
  }

  // Upsert the processor connection (only overwrite secrets that were provided)
  const update: Record<string, any> = {
    user_id: user.id,
    processor,
    updated_at: new Date().toISOString(),
  }
  if (api_key) update.api_key = api_key
  if (api_secret) update.api_secret = api_secret
  if (webhook_secret) update.webhook_secret = webhook_secret
  if (site) update.site = site
  if (card_update_url) update.card_update_url = card_update_url

  const { error } = await db
    .from('payment_connections')
    .upsert(update, { onConflict: 'user_id,processor' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
