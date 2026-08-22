import Link from 'next/link'
import { Zap } from 'lucide-react'

// Shared header for content/legal pages (About, Pricing, Blog, Terms, Privacy,
// Refund, Contact, Security, DPA, ...): logo + Sign in + Sign up CTA, no nav
// menu. Deliberately excluded from the two Google Ads landing pages
// (/lp/churnkey-alternative, /lp/recover-failed-payments), which keep their
// own minimal, conversion-focused header — and from the homepage itself,
// which keeps its fuller nav with in-page menu links.
export function SiteHeader() {
  return (
    <header className="border-b border-gray-100 py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Revova</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium">Sign in</Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start free — no card needed
          </Link>
        </div>
      </div>
    </header>
  )
}
