import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(new URL('/onboarding?error=missing_params', request.url))
  }

  try {
    const userId = Buffer.from(state, 'base64').toString('utf-8')
    const response = await stripe.oauth.token({ grant_type: 'authorization_code', code })

    const supabase = await createClient()
    const account = await stripe.accounts.retrieve(response.stripe_user_id!)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('stripe_accounts').upsert({
      user_id: userId,
      stripe_account_id: response.stripe_user_id!,
      access_token: response.access_token!,
      business_name: account.business_profile?.name ?? null,
      email: account.email ?? null,
    })

    // Register webhook for this connected account
    await stripe.webhookEndpoints.create({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/webhook`,
      enabled_events: ['invoice.payment_failed', 'invoice.payment_succeeded'],
    }, { stripeAccount: response.stripe_user_id! })

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Stripe callback error:', error)
    return NextResponse.redirect(new URL('/onboarding?error=connection_failed', request.url))
  }
}
