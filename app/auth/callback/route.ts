import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles the link in Supabase's email-confirmation message, and the
// redirect back from social OAuth (Google/GitHub/Microsoft). Exchanges the
// one-time code for a real session (setting auth cookies) and sends the new
// merchant straight into onboarding.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const dest = new URL(`${origin}${next}`)
      // Tag the redirect for the GA4 sign_up conversion — but only for a
      // brand-new account via OAuth. Email/password sign_up already fires
      // client-side at form submission (app/(auth)/signup/page.tsx), so we
      // deliberately exclude the 'email' provider here to avoid double-
      // counting the same signup. created_at ~= last_sign_in_at is how
      // Supabase marks "this session is the account's first ever sign-in";
      // a returning OAuth user has a last_sign_in_at far newer than created_at.
      const { data: { user } } = await supabase.auth.getUser()
      const provider = user?.app_metadata?.provider
      if (user && provider && provider !== 'email') {
        const createdAt = new Date(user.created_at).getTime()
        const lastSignInAt = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : createdAt
        const isNewSignup = Math.abs(lastSignInAt - createdAt) < 30_000
        if (isNewSignup) dest.searchParams.set('su', provider)
      }
      return NextResponse.redirect(dest)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm_failed`)
}
