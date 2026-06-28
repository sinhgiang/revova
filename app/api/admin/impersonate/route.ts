import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin'
import { IMPERSONATE_COOKIE } from '@/lib/impersonate'

// Start or stop impersonating a merchant. Only the admin can do this.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, clear } = await request.json().catch(() => ({}))
  const res = NextResponse.json({ ok: true })

  if (clear || !userId) {
    res.cookies.set(IMPERSONATE_COOKIE, '', { maxAge: 0, path: '/' })
  } else {
    res.cookies.set(IMPERSONATE_COOKIE, String(userId), {
      httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 4, // 4h
    })
  }
  return res
}
