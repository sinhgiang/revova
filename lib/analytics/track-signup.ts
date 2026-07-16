// Fires the GA4 `sign_up` conversion event — the signal Google Ads imports
// as a Key Event so Smart Bidding can optimize toward real signups instead
// of raw clicks. See components/consent/cookie-consent.tsx for how consent
// gates whether the hit is actually sent (Consent Mode v2): we push to
// dataLayer directly (not window.gtag) so this works even if gtag.js hasn't
// finished loading yet — that's the same queueing behavior the standard
// gtag snippet relies on.

export type SignupMethod = 'email' | 'google' | 'github' | 'azure' | 'oauth'

const DEDUPE_KEY = 'revova_signup_event_sent'

type W = typeof window & { dataLayer?: unknown[] }

// Fires at most once per browser so a page reload, a resubmitted form, or a
// second visit to the post-signup redirect never double-counts a conversion.
export function trackSignUp(method: SignupMethod) {
  if (typeof window === 'undefined') return
  try {
    if (localStorage.getItem(DEDUPE_KEY)) return
    localStorage.setItem(DEDUPE_KEY, '1')
  } catch {
    // If storage is unavailable we still fire once for this page load.
  }
  const w = window as W
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push(['event', 'sign_up', { method }])
}
