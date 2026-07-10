/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'
import { sendPurchaseThankYou, sendPurchaseAdminAlert } from '@/lib/email/lifecycle'

// Polar uses Standard Webhooks spec — HMAC-SHA256 with base64 secret
function verifySignature(
  body: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  secret: string
): boolean {
  try {
    const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
    const signedContent = `${webhookId}.${webhookTimestamp}.${body}`
    const expected = crypto
      .createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64')

    // Signature header can contain multiple: "v1,sig1 v1,sig2"
    return webhookSignature.split(' ').some(part => {
      const sig = part.replace(/^v\d+,/, '')
      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    })
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()

  // Verify signature if secret is configured
  const secret = process.env.POLAR_WEBHOOK_SECRET
  if (secret) {
    const webhookId = request.headers.get('webhook-id') ?? ''
    const webhookTimestamp = request.headers.get('webhook-timestamp') ?? ''
    const webhookSignature = request.headers.get('webhook-signature') ?? ''

    if (!verifySignature(body, webhookId, webhookTimestamp, webhookSignature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let event: { type: string; data: any }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  // ── Subscription activated or updated ──
  if (
    event.type === 'subscription.created' ||
    event.type === 'subscription.updated' ||
    event.type === 'subscription.active'
  ) {
    const sub = event.data

    // Polar can nest email under customer or at top level
    const customerEmail: string =
      sub.customer?.email ?? sub.customer_email ?? sub.email ?? ''

    if (!customerEmail) {
      console.warn('[Polar] No customer email in event:', event.type)
      return NextResponse.json({ received: true })
    }

    // Find user in Supabase by email
    const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000, page: 1 })
    const user = users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase())

    if (!user) {
      console.warn('[Polar] No user found for email:', customerEmail)
      return NextResponse.json({ received: true })
    }

    // Determine the plan across ALL billing terms (monthly / 6-month / annual).
    // Primary signal is the PRODUCT NAME — name your Polar products with
    // "Starter" or "Pro" in them. Fallback normalizes the price to a per-month
    // figure so a 6-month or annual Starter isn't mistaken for Pro.
    const productName: string = (
      sub.product?.name ?? sub.product_name ?? sub.price?.product?.name ?? ''
    ).toLowerCase()
    let planId: 'starter' | 'pro'
    if (productName.includes('pro')) {
      planId = 'pro'
    } else if (productName.includes('starter')) {
      planId = 'starter'
    } else {
      const amount: number = sub.amount ?? sub.price?.amount ?? sub.price?.price_amount ?? 0
      const interval: string =
        sub.recurring_interval ?? sub.product?.recurring_interval ?? sub.price?.recurring_interval ?? 'month'
      const count: number = sub.recurring_interval_count ?? sub.price?.recurring_interval_count ?? 1
      const monthsPerCycle =
        interval === 'year' ? 12 * count : interval === 'week' ? count / 4 : interval === 'day' ? count / 30 : count
      const perMonth = monthsPerCycle > 0 ? amount / monthsPerCycle : amount
      planId = perMonth <= 3000 ? 'starter' : 'pro' // ≤ $30/mo → Starter
    }

    // Map Polar status to our status
    const statusMap: Record<string, string> = {
      active: 'active',
      trialing: 'active',
      past_due: 'past_due',
      canceled: 'cancelled',
      unpaid: 'past_due',
    }
    const status = statusMap[sub.status] ?? 'active'

    // Was this merchant already an active paying customer before this event?
    const { data: prior } = await db.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle()
    const wasActive = prior?.status === 'active'

    await db.from('subscriptions').upsert(
      {
        user_id: user.id,
        polar_subscription_id: sub.id,
        plan_id: planId,
        status,
        current_period_end: sub.current_period_end ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

    console.log(`[Polar] Subscription upserted — user=${user.id} plan=${planId} status=${status}`)

    // New purchase / first activation → thank the merchant + alert the founder
    if (status === 'active' && !wasActive) {
      const planName = planId === 'pro' ? 'Pro' : 'Starter'
      const businessName = sub.customer?.name ?? sub.customer?.email ?? null
      await sendPurchaseThankYou(customerEmail, planName, sub.current_period_end ?? null)
      await sendPurchaseAdminAlert(customerEmail, planName, businessName)
    }
  }

  // ── Subscription cancelled ──
  if (
    event.type === 'subscription.canceled' ||
    event.type === 'subscription.revoked'
  ) {
    const sub = event.data
    if (sub.id) {
      await db
        .from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('polar_subscription_id', sub.id)

      console.log(`[Polar] Subscription cancelled — polar_id=${sub.id}`)
    }
  }

  return NextResponse.json({ received: true })
}
