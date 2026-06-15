import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { webhookSecret } = await request.json()

    if (!webhookSecret || !webhookSecret.startsWith('whsec_')) {
      return NextResponse.json(
        { error: 'Invalid webhook secret (must start with whsec_)' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('stripe_accounts')
      .update({ webhook_secret: webhookSecret })
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to save: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
