import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyPortalToken } from '@/lib/signing'

// Redirect customers to Stripe Billing Portal to update their card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const customerId = request.nextUrl.searchParams.get('customer')
  const token = request.nextUrl.searchParams.get('t')

  const fallback = NextResponse.redirect(new URL('https://stripe.com'))

  if (!customerId) return fallback

  // The (userId, customerId) pair is signed when the link is generated, so the
  // customer param can't be swapped to open another customer's billing portal.
  if (!verifyPortalToken(token, userId, customerId)) return fallback

  const supabase = await createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: account } = await (supabase as any)
    .from('stripe_accounts')
    .select('access_token')
    .eq('user_id', userId)
    .single()

  if (!account?.access_token) return fallback

  try {
    const stripe = new Stripe(account.access_token)
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io',
    })
    return NextResponse.redirect(session.url)
  } catch {
    return fallback
  }
}
