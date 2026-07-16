import Link from 'next/link'
import type { Metadata } from 'next'
import { Zap, Shield, Lock, Clock, CheckCircle, ArrowRight, Search, CreditCard, Globe, RefreshCw } from 'lucide-react'
import { DemoVideo } from '@/components/landing/demo-video'

// Dedicated ad landing page — message-matched to "recover failed payments"
// intent, no site nav (no leaks), a single low-friction offer (the free scan),
// trust-heavy in place of social proof we don't have yet. noindex so it never
// competes with the homepage/pricing in organic search.
export const metadata: Metadata = {
  title: 'Recover Failed Payments — See What You’re Losing, Free | Revova',
  description:
    'Revova recovers the revenue you lose to failed subscription payments — automatically, no code. Run the free Lost Revenue scan and see exactly how much you’re losing.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/lp/recover-failed-payments' },
}

const CTA_HREF = '/signup'

function Cta({ children = 'See what you’re losing — free', className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <Link
      href={CTA_HREF}
      className={`inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-700 ${className}`}
    >
      {children}
      <ArrowRight className="h-5 w-5" />
    </Link>
  )
}

function TrustLine() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-400">
      <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4" /> No credit card</span>
      <span>·</span>
      <span className="flex items-center gap-1.5"><Lock className="h-4 w-4" /> Read-only access</span>
      <span>·</span>
      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Live in 3 minutes</span>
    </div>
  )
}

export default function RecoverFailedPaymentsLP() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Minimal header — logo + single CTA, no nav (no leaks) */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Revova</span>
          </div>
          <Link href={CTA_HREF} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            Start free
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-[#060612] px-6 pt-16 pb-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-sm text-white/70">
            <Zap className="h-3.5 w-3.5 text-indigo-400" /> Payment recovery for SaaS &amp; subscription businesses
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
            Recover the revenue you&apos;re losing<br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              to failed payments.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
            Expired cards, bank declines, and missed verifications quietly drain subscription revenue every month.
            Revova finds every failed charge and wins the money back automatically — and shows you exactly how much
            you&apos;re losing, free.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <Cta />
            <TrustLine />
            <p className="max-w-md text-sm text-white/40">
              Connecting is <span className="text-white/70">read-only</span> — Revova only reads failed payments. It never moves money or stores card numbers.
            </p>
          </div>

          {/* Illustrative product mockup */}
          <div className="mx-auto mt-14 max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e1a] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/8 bg-white/4 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-auto rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/40">Example</span>
            </div>
            <div className="p-6 text-left">
              <p className="text-sm text-white/40">Lost to failed payments — last 12 months</p>
              <p className="mt-1 text-4xl font-extrabold text-rose-400">$18,240</p>
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                <RefreshCw className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <p className="text-sm text-emerald-200">Revova is now recovering these automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">Live in 3 minutes, then hands-off</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: '1', icon: CreditCard, title: 'Connect once', body: 'Paste one key from Stripe, Paddle, Braintree, Chargebee or Recurly. No code, no engineers.' },
              { n: '2', icon: Search, title: 'See your number', body: 'The Lost Revenue Finder scans your history and shows exactly how much you’ve already lost — your real figure, not a guess.' },
              { n: '3', icon: RefreshCw, title: 'Recover on autopilot', body: 'Smart retries + AI-personalized recovery emails win the money back, 24/7, while you do nothing.' },
            ].map(({ n, icon: Icon, title, body }) => (
              <div key={n} className="rounded-2xl border border-gray-100 p-7 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{n}</span>
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center gap-3">
            <Cta />
            <TrustLine />
          </div>
        </div>
      </section>

      {/* ── DEMO VIDEO ── */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-600">See it in action</p>
          <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">Watch Revova recover a failed payment</h2>
          <DemoVideo videoId="YnSJ8RanICI" title="Revova — product demo" />
        </div>
      </section>

      {/* ── WHY REVOVA (honest differentiators) ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">Why founders switch to Revova</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { icon: Search, title: 'Recovers the past, not just the future', body: 'Most tools only work from install day. The Lost Revenue Finder goes back up to 12 months and wins back failures you already lost.' },
              { icon: Globe, title: 'AI emails that actually get read', body: 'Personalized to each customer, the exact decline reason, and written in 8 languages — not a generic “your payment failed” blast.' },
              { icon: Shield, title: 'Handles 3-D Secure the right way', body: 'Bank-verification (SCA) failures get a “confirm your payment” flow, not a “replace your card” email — so EU recovery actually works.' },
              { icon: CheckCircle, title: 'Flat price, no commission', body: '$29–$79/mo, flat. We never take a cut of the revenue we recover — the entire upside stays yours.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RISK REVERSAL ── */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Zero risk to see your number</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Connecting is read-only — Revova only listens for failed payments and never moves money or stores card numbers.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Lock, label: 'Read-only & encrypted' },
              { icon: CreditCard, label: 'No credit card to start' },
              { icon: Shield, label: '30-day money-back' },
              { icon: CheckCircle, label: 'Cancel anytime' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <Icon className="mx-auto mb-2 h-6 w-6 text-indigo-600" />
                <p className="text-sm font-medium text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Quick answers</h2>
          <div className="space-y-4">
            {[
              { q: 'Is it safe to connect my Stripe account?', a: 'Yes. Access is read-only — Revova only listens for failed-payment events. It never moves money and never stores card numbers, and your key is encrypted.' },
              { q: 'How much does it cost?', a: 'Starter is $29/mo and Pro is $79/mo, flat, with no commission on recovered revenue. There’s a 14-day free trial with no credit card and a 30-day money-back guarantee.' },
              { q: 'Do I need a developer?', a: 'No. Setup is paste-one-key and takes about three minutes. No code, no webhooks to hand-wire for the basics.' },
              { q: 'Which processors work?', a: 'Stripe, Paddle, Braintree, Chargebee and Recurly. Live recovery works across all five.' },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-gray-200 p-5">
                <summary className="cursor-pointer list-none font-semibold text-gray-900">{q}</summary>
                <p className="mt-3 text-[15px] leading-7 text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#060612] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black leading-tight md:text-5xl">
            Stop letting good revenue<br />
            <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">slip away.</span>
          </h2>
          <p className="mt-5 text-white/50">See exactly how much you&apos;re losing — the free scan reads your own history in minutes.</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Cta className="bg-white !text-gray-900 shadow-white/10 hover:bg-gray-100" />
            <TrustLine />
          </div>
        </div>
      </section>

      {/* Minimal footer — legal only (Google Ads requires these to be reachable) */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 text-sm text-gray-400 md:flex-row">
          <span>© 2026 Revova · AI-powered payment recovery</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/refund" className="hover:text-gray-600">Refund</Link>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
            <Link href="/security" className="hover:text-gray-600">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
