/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendRecoveryEmail } from '@/lib/email/resend'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: account } = await (supabase as any)
    .from('stripe_accounts')
    .select('smtp_host, smtp_port, smtp_user, smtp_password, smtp_from_email, smtp_from_name, business_name')
    .eq('user_id', user.id)
    .single()

  if (!account?.smtp_host) return NextResponse.json({ error: 'No SMTP configured' }, { status: 400 })

  try {
    await sendRecoveryEmail({
      to: user.email!,
      subject: `Test email from ${account.business_name ?? 'Revova'}`,
      body: `Hi there,\n\nThis is a test email to confirm your custom SMTP is working correctly.\n\nIf you received this, your SMTP settings are configured properly!`,
      previewText: 'Your custom SMTP is working correctly.',
      updateCardUrl: '#',
      businessName: account.business_name ?? 'Revova',
      smtp: {
        host: account.smtp_host,
        port: account.smtp_port ?? 587,
        user: account.smtp_user,
        password: account.smtp_password,
        fromEmail: account.smtp_from_email,
        fromName: account.smtp_from_name ?? account.business_name ?? 'Revova',
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
