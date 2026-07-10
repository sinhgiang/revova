/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns the Polar checkout URL for the requested plan, with the signed-in
// user's email prefilled so the Polar webhook can match them on payment.
// Used by the in-app upgrade modal to send a user straight to checkout in one
// click. (Polar is our Merchant of Record — payment is confirmed on its secure
// hosted page; there is no silent off-session charge.)
function buildPolarUrl(baseUrl: string | undefined, email: string): string {
  if (!baseUrl || baseUrl === '#') return '#'
  try {
    const url = new URL(baseUrl)
    if (email) url.searchParams.set('customer_email', email)
    return url.toString()
  } catch {
    return baseUrl
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plan = request.nextUrl.searchParams.get('plan') === 'starter' ? 'starter' : 'pro'

  // Already on Pro? Nothing to upgrade.
  const { data: sub } = await (supabase as any)
    .from('subscriptions')
    .select('plan_id, status')
    .eq('user_id', user.id)
    .maybeSingle()
  if (plan === 'pro' && sub?.plan_id === 'pro' && sub?.status === 'active') {
    return NextResponse.json({ error: 'Already on Pro', alreadyPro: true }, { status: 400 })
  }

  const base = plan === 'starter'
    ? process.env.NEXT_PUBLIC_POLAR_STARTER_URL
    : process.env.NEXT_PUBLIC_POLAR_PRO_URL
  const url = buildPolarUrl(base, user.email ?? '')

  if (url === '#') return NextResponse.json({ error: 'Billing not configured' }, { status: 500 })
  return NextResponse.json({ url })
}
