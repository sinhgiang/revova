/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateWinbackEmail } from '@/lib/ai/email-generator'
import { sendWinbackEmail } from '@/lib/email/resend'
import { resolvePlan } from '@/lib/plan'

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

    // Winback uses no Stripe API — works for any processor. Only require the
    // account to exist and have winback enabled.
    if (!account) { skipped++; continue }
    if (!account.winback_enabled) { skipped++; continue }
    // Winback is a Pro feature — verify the merchant is on an active Pro plan
    const { data: subRow } = await db.from('subscriptions').select('plan_id, status').eq('user_id', contact.user_id).maybeSingle()
    if (!resolvePlan(account, subRow).isPro) { skipped++; continue }

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

      await sendWinbackEmail({
        to: contact.customer_email,
        subject: emailContent.subject,
        body: emailContent.body,
        previewText: emailContent.previewText,
        reactivateUrl: `${appUrl}/signup`,
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
        // failed_payment_id intentionally omitted — winback emails are not tied to a failed payment
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

  // ── Historical recovery drip — throttled, Day 0 / 7 / 21, winback-style ──
  const HIST_WAIT = [0, 7, 14] // days to wait after the previous email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'
  let histSent = 0
  const { data: histAll } = await db.from('historical_recovery').select('*').in('status', ['queued', 'active'])
  const byUser = new Map<string, any[]>()
  for (const h of histAll ?? []) {
    if (!byUser.has(h.user_id)) byUser.set(h.user_id, [])
    byUser.get(h.user_id)!.push(h)
  }
  for (const [uid, items] of byUser) {
    const { data: acc } = await db.from('stripe_accounts').select('*').eq('user_id', uid).single()
    if (!acc) continue
    const throttle = acc.historical_throttle ?? 40
    const smtp = acc.smtp_host ? {
      host: acc.smtp_host, port: acc.smtp_port ?? 587, user: acc.smtp_user, password: acc.smtp_password,
      fromEmail: acc.smtp_from_email, fromName: acc.smtp_from_name ?? acc.business_name ?? 'Revova',
    } : null
    let sentForUser = 0
    for (const h of items) {
      if (sentForUser >= throttle) break
      const idx = h.emails_sent ?? 0
      if (idx >= 3) continue
      if (idx > 0) {
        const last = new Date(h.last_email_at ?? h.enrolled_at).getTime()
        if ((now.getTime() - last) / 86_400_000 < HIST_WAIT[idx]) continue
      }
      // Respect suppression (could have bounced/complained since enrolling)
      const { data: bl } = await db.from('email_blacklist').select('id').eq('user_id', uid).eq('email', (h.customer_email ?? '').toLowerCase()).maybeSingle()
      if (bl) { await db.from('historical_recovery').update({ status: 'unsubscribed' }).eq('id', h.id); continue }
      try {
        const seq = idx + 1
        const content = await generateWinbackEmail({
          customerName: h.customer_name ?? 'there',
          businessName: acc.business_name ?? 'Our Team',
          productName: 'your subscription',
          emailSequence: seq,
          discountCode: acc.historical_discount ?? null,
          language: acc.email_language ?? 'en',
          customNote: acc.email_custom_note ?? undefined,
        })
        await sendWinbackEmail({
          to: h.customer_email, subject: content.subject, body: content.body, previewText: content.previewText,
          reactivateUrl: acc.card_update_url || appUrl,
          businessName: acc.business_name ?? 'Our Team', smtp,
          tracking: { userId: uid, recipientEmail: h.customer_email, sequence: seq },
        })
        await db.from('historical_recovery').update({ emails_sent: seq, last_email_at: now.toISOString(), status: seq >= 3 ? 'done' : 'active' }).eq('id', h.id)
        histSent++; sentForUser++
        try { await db.from('email_logs').insert({ user_id: uid, email_type: `histrec_${seq}`, recipient_email: h.customer_email, subject: content.subject }) } catch { /* log is best-effort */ }
      } catch (e) { console.error('[Histrec]', e instanceof Error ? e.message : e) }
    }
  }

  console.log(`[Winback Cron] Done. winback=${sent} historical=${histSent} skipped=${skipped}`)
  return NextResponse.json({ ok: true, sent, histSent, skipped, total: (contacts ?? []).length })
}
