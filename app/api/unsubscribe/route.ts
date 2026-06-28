/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('u')
  const email = searchParams.get('e')
  const token = searchParams.get('t')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

  if (!userId || !email || !token) {
    return NextResponse.redirect(`${appUrl}/unsubscribe?error=invalid`)
  }

  const valid = verifyUnsubscribeToken(userId, email, token)
  if (!valid) {
    return NextResponse.redirect(`${appUrl}/unsubscribe?error=invalid`)
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  // Add to blacklist — upsert to avoid errors on duplicate unsubscribes
  await db.from('email_blacklist').upsert({
    user_id: userId,
    email: email.toLowerCase(),
    reason: 'unsubscribed',
  }, { onConflict: 'user_id,email' })

  return NextResponse.redirect(`${appUrl}/unsubscribe?success=1&e=${encodeURIComponent(email)}`)
}
