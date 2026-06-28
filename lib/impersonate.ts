/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin'

export const IMPERSONATE_COOKIE = 'revova_imp'

export interface AppContext {
  userId: string          // whose data to show (impersonated id, or own id)
  db: any                 // client to read with (service-role when impersonating, so RLS is bypassed)
  impersonating: boolean
  realEmail: string | null
}

// Resolve which account's data the current request should see. Impersonation is
// ONLY honored when the *real* signed-in user is the admin — if a normal user
// somehow set the cookie, it is ignored (they get their own data). Returns null
// if not signed in.
export async function getAppContext(supabase: any): Promise<AppContext | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL
  if (isAdmin) {
    const target = (await cookies()).get(IMPERSONATE_COOKIE)?.value
    if (target && target !== user.id) {
      const adminDb = await createAdminClient()
      return { userId: target, db: adminDb, impersonating: true, realEmail: user.email ?? null }
    }
  }
  return { userId: user.id, db: supabase, impersonating: false, realEmail: user.email ?? null }
}
