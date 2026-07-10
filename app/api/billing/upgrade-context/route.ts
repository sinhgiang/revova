/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Tells the upgrade modal whether we can do an instant, one-click upgrade
// (the customer already has a paid Polar subscription → card on file) or must
// send them to checkout (trial / no card). Falls back to 'checkout' whenever
// the Polar API isn't configured, so the feature degrades gracefully.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const configured = Boolean(process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_PRO_PRODUCT_ID)

  const { data: sub } = await (supabase as any)
    .from('subscriptions')
    .select('polar_subscription_id, plan_id, status')
    .eq('user_id', user.id)
    .maybeSingle()

  const hasSavedCard = Boolean(sub?.polar_subscription_id) && sub?.status === 'active'
  const alreadyPro = sub?.plan_id === 'pro' && sub?.status === 'active'

  const mode = configured && hasSavedCard && !alreadyPro ? 'instant' : 'checkout'

  return NextResponse.json({ mode, alreadyPro })
}
