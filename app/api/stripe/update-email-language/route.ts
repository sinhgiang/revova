/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { language } = await request.json()
  const valid = ['en', 'fr', 'es', 'de', 'pt', 'nl', 'it', 'ja']
  if (!valid.includes(language)) return NextResponse.json({ error: 'Invalid language' }, { status: 400 })

  const { error } = await (supabase as any)
    .from('stripe_accounts')
    .update({ email_language: language })
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
