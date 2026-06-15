import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSlackNotification } from '@/lib/slack'

export async function POST(request: NextRequest) {
  void request
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: account } = await (supabase as any)
      .from('stripe_accounts')
      .select('slack_webhook_url, business_name')
      .eq('user_id', user.id)
      .single()

    if (!account?.slack_webhook_url) {
      return NextResponse.json({ error: 'No Slack webhook configured' }, { status: 400 })
    }

    await sendSlackNotification(account.slack_webhook_url, {
      type: 'test',
      businessName: account.business_name,
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}
