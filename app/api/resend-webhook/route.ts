/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'

// Receives delivery events from Resend (the platform email provider): delivered,
// bounced, complained (spam). Hard bounces and complaints are auto-added to the
// blacklist so we never email a bad address again — this protects sender
// reputation, which directly affects how many emails land in the inbox.
//
// Configure once: Resend dashboard → Webhooks → add https://revova.io/api/resend-webhook
// and set RESEND_WEBHOOK_SECRET (the signing secret) on Vercel for verification.

function verifySvix(rawBody: string, headers: Headers, secret: string): boolean {
  const id = headers.get('svix-id')
  const timestamp = headers.get('svix-timestamp')
  const sigHeader = headers.get('svix-signature')
  if (!id || !timestamp || !sigHeader) return false
  try {
    const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
    const signedContent = `${id}.${timestamp}.${rawBody}`
    const expected = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64')
    // The header is space-separated "v1,<sig> v1,<sig2>"; any match is valid
    return sigHeader.split(' ').some(part => {
      const sig = part.split(',')[1]
      if (!sig) return false
      try { return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) } catch { return false }
    })
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // Verify the Svix signature when a secret is configured
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (secret && !verifySvix(rawBody, request.headers, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let evt: any
  try { evt = JSON.parse(rawBody) } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const type: string = evt?.type ?? ''
  const recipient: string | undefined = Array.isArray(evt?.data?.to) ? evt.data.to[0] : evt?.data?.to
  if (!recipient) return NextResponse.json({ received: true })

  const supabase = await createAdminClient()
  const db = supabase as any
  const now = new Date().toISOString()

  // Find the most recent email we logged to this recipient (last 21 days)
  const cutoff = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  const { data: log } = await db
    .from('email_logs')
    .select('id, user_id')
    .eq('recipient_email', recipient)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (type === 'email.delivered' && log) {
    await db.from('email_logs').update({ delivered_at: now }).eq('id', log.id)
  }

  if (type === 'email.bounced' || type === 'email.complained') {
    const field = type === 'email.bounced' ? 'bounced_at' : 'complained_at'
    if (log) await db.from('email_logs').update({ [field]: now }).eq('id', log.id)

    // Auto-suppress: never email this address again for this merchant
    if (log?.user_id) {
      try {
        await db.from('email_blacklist').upsert({
          user_id: log.user_id,
          email: recipient.toLowerCase(),
          reason: type === 'email.bounced' ? 'hard_bounce' : 'spam_complaint',
        }, { onConflict: 'user_id,email' })
        console.log(`[Resend] Suppressed ${recipient} (${type})`)
      } catch (e) {
        console.error('[Resend] suppress error:', e)
      }
    }
  }

  return NextResponse.json({ received: true })
}
