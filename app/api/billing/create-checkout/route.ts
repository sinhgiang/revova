/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const priceId = process.env.STRIPE_PRO_PRICE_ID
  const stripeKey = process.env.STRIPE_BILLING_SECRET_KEY
  if (!priceId || !stripeKey) {
    return NextResponse.json({ error: 'Billing not configured' }, { status: 500 })
  }

  const { data: sub } = await (supabase as any)
    .from('subscriptions')
    .select('stripe_customer_id, plan_id, status')
    .eq('user_id', user.id)
    .single()

  if (sub?.plan_id === 'pro' && sub?.status === 'active') {
    return NextResponse.json({ error: 'Already on Pro plan' }, { status: 400 })
  }

  const stripe = new Stripe(stripeKey)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    customer_email: sub?.stripe_customer_id ? undefined : user.email!,
    customer: sub?.stripe_customer_id ?? undefined,
    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/billing`,
    metadata: { user_id: user.id },
    subscription_data: {
      metadata: { user_id: user.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
