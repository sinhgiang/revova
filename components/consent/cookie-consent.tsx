'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Google Consent Mode v2 + cookie banner.
//
// Compliance model (per Google's EEA/UK requirements, in force since Mar 2024):
// - Consent defaults to "denied" for all four v2 signals BEFORE any Google tag
//   loads, so no ad/analytics cookies are set until the visitor opts in.
// - The Google tag (gtag.js) only loads at all when NEXT_PUBLIC_GTAG_ID is set,
//   so with no ID there is zero tracking and the banner stays hidden.
// - Accepting flips all four signals to "granted"; rejecting keeps them denied.
// The choice is remembered in localStorage.
//
// Note: for full EEA remarketing, Google prefers a certified CMP (Cookiebot,
// Iubenda, CookieYes, …). This implements Consent Mode v2 correctly and can be
// swapped for a certified CMP later without other changes.

const STORAGE_KEY = 'revova_cookie_consent'
const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID

type Choice = 'granted' | 'denied'

function pushConsent(state: Choice) {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }
  if (typeof w.gtag !== 'function') return
  w.gtag('consent', 'update', {
    ad_storage: state,
    analytics_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  })
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!GTAG_ID) return // no tracking configured → nothing to consent to

    const w = window as unknown as {
      dataLayer?: unknown[]
      gtag?: (...a: unknown[]) => void
      __revovaGtag?: boolean
    }

    // Bootstrap gtag with everything denied by default, before loading the tag.
    if (!w.__revovaGtag) {
      w.__revovaGtag = true
      w.dataLayer = w.dataLayer || []
      const gtag = (...args: unknown[]) => {
        w.dataLayer!.push(args)
      }
      w.gtag = gtag
      gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
      })

      let stored: string | null = null
      try {
        stored = localStorage.getItem(STORAGE_KEY)
      } catch {}
      if (stored === 'granted') pushConsent('granted')

      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`
      document.head.appendChild(s)
      gtag('js', new Date())
      gtag('config', GTAG_ID)
    }

    // Show the banner only if the visitor hasn't chosen yet.
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {}
    if (stored !== 'granted' && stored !== 'denied') setVisible(true)
  }, [])

  function choose(choice: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {}
    pushConsent(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-gray-600">
          We use essential cookies to run Revova, and — only with your consent — analytics and
          advertising cookies (including Google) to measure and improve our ads. See our{' '}
          <Link href="/privacy" className="font-medium text-indigo-600 hover:underline">Privacy Policy</Link>.
        </p>
        <div className="flex flex-shrink-0 items-center gap-3">
          <button
            onClick={() => choose('denied')}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Reject
          </button>
          <button
            onClick={() => choose('granted')}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
