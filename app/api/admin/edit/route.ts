/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin'
import { recordAudit } from '@/lib/audit'

const TOGGLE_FIELDS = ['predunning_enabled', 'notify_on_recovery', 'winback_enabled', 'sms_enabled', 'cancel_flow_enabled', 'weekly_summary_enabled']

export async function POST(request: NextRequest) {
  // Founder only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { merchantUserId, action, value } = await request.json().catch(() => ({}))
  if (!merchantUserId || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = await createAdminClient()
  const db = admin as any

  const { data: acc } = await db.from('stripe_accounts').select('business_name').eq('user_id', merchantUserId).maybeSingle()
  const merchantName = acc?.business_name ?? null
  let label = ''

  try {
    if (action === 'set_plan') {
      if (value === 'none') {
        await db.from('subscriptions').delete().eq('user_id', merchantUserId)
        label = 'Removed paid plan (back to trial/free)'
      } else if (value === 'pro' || value === 'starter') {
        await db.from('subscriptions').upsert({
          user_id: merchantUserId, plan_id: value, status: 'active', updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        label = `Comped to ${value === 'pro' ? 'Pro' : 'Starter'} (free)`
      } else return NextResponse.json({ error: 'Bad plan' }, { status: 400 })
    } else if (action === 'reset_trial') {
      await db.from('stripe_accounts').update({ connected_at: new Date().toISOString() }).eq('user_id', merchantUserId)
      label = 'Reset trial to a fresh 14 days'
    } else if (action === 'set_business_name') {
      const name = String(value ?? '').trim().slice(0, 80)
      await db.from('stripe_accounts').update({ business_name: name || null }).eq('user_id', merchantUserId)
      label = `Changed business name to "${name}"`
    } else if (action === 'toggle') {
      const field = value?.field
      if (!TOGGLE_FIELDS.includes(field)) return NextResponse.json({ error: 'Bad field' }, { status: 400 })
      await db.from('stripe_accounts').update({ [field]: !!value.on }).eq('user_id', merchantUserId)
      label = `${value.on ? 'Enabled' : 'Disabled'} ${field.replace(/_/g, ' ')}`
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    await recordAudit(db, {
      adminEmail: user.email!, merchantUserId, merchantName, action: label, details: { action, value },
    })
    return NextResponse.json({ ok: true, label })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 })
  }
}
