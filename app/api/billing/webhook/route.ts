/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_BILLING_SECRET_KEY
  const webhookSecret = process.env.STRIPE_BILLING_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  const stripe = new Stripe(stripeKey)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id ?? session.metadata?.user_id
    if (!userId) return NextResponse.json({ received: true })

    const subscription = session.subscription
      ? await stripe.subscriptions.retrieve(session.subscription as string)
      : null

    await db.from('subscriptions').upsert({
      user_id: userId,
      plan_id: 'pro',
      status: 'active',
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription?.id ?? null,
      current_period_end: subscription?.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    })

    console.log(`[Billing] Pro activated for user ${userId}`)
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata?.user_id
    if (!userId) return NextResponse.json({ received: true })

    const isActive = sub.status === 'active' || sub.status === 'trialing'
    await db.from('subscriptions').upsert({
      user_id: userId,
      plan_id: isActive ? 'pro' : 'starter',
      status: sub.status,
      stripe_customer_id: sub.customer as string,
      stripe_subscription_id: sub.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata?.user_id
    if (!userId) return NextResponse.json({ received: true })

    await db.from('subscriptions').upsert({
      user_id: userId,
      plan_id: 'starter',
      status: 'cancelled',
      stripe_customer_id: sub.customer as string,
      stripe_subscription_id: sub.id,
    })
  }

  return NextResponse.json({ received: true })
}
