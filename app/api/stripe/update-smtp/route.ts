/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { host, port, smtpUser, password, fromEmail, fromName, clear } = await request.json()

  if (clear) {
    await (supabase as any)
      .from('stripe_accounts')
      .update({
        smtp_host: null, smtp_port: null, smtp_user: null,
        smtp_password: null, smtp_from_email: null, smtp_from_name: null,
      })
      .eq('user_id', user.id)
    return NextResponse.json({ ok: true })
  }

  const { error } = await (supabase as any)
    .from('stripe_accounts')
    .update({
      smtp_host: host,
      smtp_port: Number(port) || 587,
      smtp_user: smtpUser,
      smtp_password: password,
      smtp_from_email: fromEmail,
      smtp_from_name: fromName,
    })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
