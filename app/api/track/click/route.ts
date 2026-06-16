/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('u')
  const email = searchParams.get('e')
  const seq = searchParams.get('s')
  const target = searchParams.get('target')

  const redirectUrl = target ?? '/'

  if (userId && email && seq) {
    try {
      const supabase = await createAdminClient()
      await (supabase as any)
        .from('email_logs')
        .update({ clicked_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('recipient_email', email)
        .eq('email_type', `sequence_${seq}`)
        .is('clicked_at', null)
    } catch { /* non-critical */ }
  }

  return NextResponse.redirect(redirectUrl)
}
