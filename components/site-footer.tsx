import Link from 'next/link'
import { Zap } from 'lucide-react'
import { SocialLinks } from '@/components/social-links'

// Shared footer, identical to the homepage's: logo, tagline, and the full
// link set (About, Blog, Contact, Pricing, Refunds, Privacy, Terms, Security,
// DPA, Sign in, Sign up) plus social links. Deliberately excluded from the
// two Google Ads landing pages (/lp/churnkey-alternative,
// /lp/recover-failed-payments), which keep their own minimal, legal-only
// footer — Google Ads requires those specific links to stay reachable there,
// and the extra exit paths here would hurt conversion on that traffic.
export function SiteFooter() {
  return (
    <footer className="px-6 py-8 border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900">Revova</span>
        </div>
        <p className="text-sm text-gray-400">© 2026 Revova · AI-powered payment recovery for indie hackers</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/about" className="text-sm text-gray-400 hover:text-gray-600">About</Link>
          <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-600">Blog</Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-gray-600">Contact</Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-gray-600">Pricing</Link>
          <Link href="/refund" className="text-sm text-gray-400 hover:text-gray-600">Refunds</Link>
          <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">Privacy</Link>
          <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600">Terms</Link>
          <Link href="/security" className="text-sm text-gray-400 hover:text-gray-600">Security</Link>
          <Link href="/dpa" className="text-sm text-gray-400 hover:text-gray-600">DPA</Link>
          <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600">Sign in</Link>
          <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-600">Sign up</Link>
          <SocialLinks className="text-gray-400" />
        </div>
      </div>
    </footer>
  )
}
