import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripeConnectUrl } from '@/lib/stripe/client'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const state = Buffer.from(user.id).toString('base64')
  const url = getStripeConnectUrl(state)
  return NextResponse.redirect(url)
}
