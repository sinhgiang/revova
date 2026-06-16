/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRecoveryEmail } from '@/lib/ai/email-generator'

const SAMPLE_URL = 'https://invoice.stripe.com/i/sample_update_link'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const sequence = parseInt(searchParams.get('sequence') ?? '1', 10)

  const { data: account } = await (supabase as any)
    .from('stripe_accounts')
    .select('business_name, email_custom_note')
    .eq('user_id', user.id)
    .single()

  const businessName = account?.business_name ?? 'Your Company'
  const customNote = account?.email_custom_note ?? undefined

  try {
    const email = await generateRecoveryEmail({
      customerName: 'Alex',
      customerEmail: 'alex@example.com',
      businessName,
      productName: 'Pro Subscription',
      amount: 4900,
      currency: 'usd',
      declineCode: 'insufficient_funds',
      emailSequence: sequence,
      updateCardUrl: SAMPLE_URL,
      customNote,
    })
    return NextResponse.json(email)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
