/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateWinbackEmail } from '@/lib/ai/email-generator'
import { sendRecoveryEmail } from '@/lib/email/resend'

// Days after cancellation to send each winback email
const WINBACK_DAYS = [3, 14, 30]

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any
  const now = new Date()

  const { data: contacts, error } = await db
    .from('winback_contacts')
    .select('*')
    .eq('status', 'active')
    .lte('emails_sent', 2) // max 3 emails (0-indexed: 0,1,2)

  if (error) {
    console.error('[Winback Cron] DB error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  let sent = 0
  let skipped = 0

  for (const contact of contacts ?? []) {
    const nextEmailIdx = contact.emails_sent // 0, 1, or 2
    const daysToWait = WINBACK_DAYS[nextEmailIdx]

    const cancelledAt = new Date(contact.cancelled_at)
    const daysSinceCancellation = (now.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceCancellation < daysToWait) {
      skipped++
      continue
    }

    // Fetch merchant account config
    const { data: account } = await db
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', contact.user_id)
      .single()

    if (!account?.access_token) { skipped++; continue }
    if (!account.winback_enabled) { skipped++; continue }

    // Check email blacklist
    const { data: blacklisted } = await db
      .from('email_blacklist')
      .select('id')
      .eq('user_id', contact.user_id)
      .eq('email', contact.customer_email.toLowerCase())
      .maybeSingle()

    if (blacklisted) { skipped++; continue }

    try {
      const emailSequence = nextEmailIdx + 1 // 1, 2, 3

      const emailContent = await generateWinbackEmail({
        customerName: contact.customer_name ?? 'there',
        businessName: account.business_name ?? 'Our Team',
        productName: 'your subscription',
        emailSequence,
        discountCode: account.winback_discount_code ?? null,
        language: account.email_language ?? 'en',
        customNote: account.email_custom_note ?? undefined,
      })

      const smtp = account.smtp_host ? {
        host: account.smtp_host,
        port: account.smtp_port ?? 587,
        user: account.smtp_user,
        password: account.smtp_password,
        fromEmail: account.smtp_from_email,
        fromName: account.smtp_from_name ?? account.business_name ?? 'Revova',
      } : null

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

      await sendRecoveryEmail({
        to: contact.customer_email,
        subject: emailContent.subject,
        body: emailContent.body,
        previewText: emailContent.previewText,
        updateCardUrl: `${appUrl}/signup`,
        businessName: account.business_name ?? 'Our Team',
        smtp,
        tracking: {
          userId: contact.user_id,
          recipientEmail: contact.customer_email,
          sequence: emailSequence,
        },
      })

      const newEmailsSent = emailSequence
      const newStatus = newEmailsSent >= 3 ? 'max_emails' : 'active'

      await db.from('winback_contacts').update({
        emails_sent: newEmailsSent,
        last_email_at: now.toISOString(),
        status: newStatus,
      }).eq('id', contact.id)

      await db.from('email_logs').insert({
        failed_payment_id: null,
        user_id: contact.user_id,
        email_type: `winback_${emailSequence}`,
        recipient_email: contact.customer_email,
        subject: emailContent.subject,
      })

      sent++
      console.log(`[Winback] ✓ Email #${emailSequence} → ${contact.customer_email}`)
    } catch (e) {
      console.error(`[Winback] ✗ ${contact.customer_email}:`, e instanceof Error ? e.message : e)
    }
  }

  console.log(`[Winback Cron] Done. sent=${sent} skipped=${skipped}`)
  return NextResponse.json({ ok: true, sent, skipped, total: (contacts ?? []).length })
}
