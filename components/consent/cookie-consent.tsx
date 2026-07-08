'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Consent-gated loading for Google (Consent Mode v2) and Meta (Facebook Pixel).
//
// Google: Consent Mode v2 — the tag may load with all four signals defaulted to
// "denied" (cookieless), then flip to "granted" on opt-in.
// Meta: stricter — for EEA/UK traffic the Pixel must NOT load, set cookies, or
// fire any event before opt-in, so we only inject fbevents.js AFTER consent.
//
// Both are gated behind env IDs, so with no IDs there is zero tracking and no
// banner. Choice is remembered in localStorage.
//
// Next step for best performance/compliance: add server-side Conversions API
// (CAPI) for Meta and enhanced conversions for Google — both need secrets.

const STORAGE_KEY = 'revova_cookie_consent'
const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID
const HAS_TRACKING = Boolean(GTAG_ID || FB_PIXEL_ID)

type Choice = 'granted' | 'denied'
type W = typeof window & {
  dataLayer?: unknown[]
  gtag?: (...a: unknown[]) => void
  fbq?: ((...a: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: (...a: unknown[]) => void; push?: unknown }
  _fbq?: unknown
  __revovaGtag?: boolean
  __revovaFbLoaded?: boolean
}

function bootstrapGoogle() {
  if (!GTAG_ID) return
  const w = window as W
  if (w.__revovaGtag) return
  w.__revovaGtag = true
  w.dataLayer = w.dataLayer || []
  const gtag = (...args: unknown[]) => { w.dataLayer!.push(args) }
  w.gtag = gtag
  gtag('consent', 'default', {
    ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500,
  })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`
  document.head.appendChild(s)
  gtag('js', new Date())
  gtag('config', GTAG_ID)
}

function grantGoogle() {
  const w = window as W
  w.gtag?.('consent', 'update', {
    ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted',
  })
}

// Loads the Meta Pixel only when called (i.e. after consent) — EEA-compliant.
function loadMetaPixel() {
  if (!FB_PIXEL_ID) return
  const w = window as W
  if (w.__revovaFbLoaded) { w.fbq?.('consent', 'grant'); return }
  w.__revovaFbLoaded = true
  /* eslint-disable */
  // Standard Meta Pixel base code.
  ;(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }
    if (!f._fbq) f._fbq = n
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []
    t = b.createElement(e); t.async = !0; t.src = v
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */
  w.fbq?.('consent', 'grant')
  w.fbq?.('init', FB_PIXEL_ID)
  w.fbq?.('track', 'PageView')
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!HAS_TRACKING) return

    let stored: string | null = null
    try { stored = localStorage.getItem(STORAGE_KEY) } catch {}

    // Google may bootstrap immediately (Consent Mode, denied by default).
    bootstrapGoogle()
    if (stored === 'granted') {
      grantGoogle()
      loadMetaPixel() // Meta only loads once consent exists.
    }

    if (stored !== 'granted' && stored !== 'denied') setVisible(true)
  }, [])

  function choose(choice: Choice) {
    try { localStorage.setItem(STORAGE_KEY, choice) } catch {}
    if (choice === 'granted') {
      grantGoogle()
      loadMetaPixel()
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-gray-600">
          We use essential cookies to run Revova, and — only with your consent — analytics and
          advertising cookies (including Google and Meta) to measure and improve our ads. See our{' '}
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
