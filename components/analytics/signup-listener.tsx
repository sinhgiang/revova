'use client'

import { useEffect } from 'react'
import { trackSignUp, type SignupMethod } from '@/lib/analytics/track-signup'

// Picks up the `su=<provider>` marker that app/auth/callback/route.ts adds
// to the post-OAuth redirect for brand-new accounts, fires the GA4 sign_up
// event, then strips the param so a later reload/share of the URL can't
// re-fire it. Reads window.location directly (not useSearchParams) so this
// never needs a Suspense boundary and never opts pages out of static
// prerendering.
export function SignupEventListener() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const method = params.get('su')
    if (!method) return
    trackSignUp(method as SignupMethod)
    params.delete('su')
    const qs = params.toString()
    const url = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash
    window.history.replaceState({}, '', url)
  }, [])

  return null
}
