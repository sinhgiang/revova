import Link from 'next/link'
import type { Metadata } from 'next'
import { Zap, Shield, Lock, Clock, CheckCircle, X, ArrowRight, CreditCard, Search, Globe } from 'lucide-react'
import { DemoVideo } from '@/components/landing/demo-video'

// Dedicated ad landing page — message-matched to "churnkey alternative" intent.
// No site nav, one offer (free scan), a head-to-head comparison, honest about
// where Churnkey is genuinely stronger (credibility). noindex.
export const metadata: Metadata = {
  title: 'The Affordable Churnkey Alternative — From $29/mo, No Commission | Revova',
  description:
    'Looking for a Churnkey alternative? Revova recovers failed subscription payments with the same core engine — from $29/mo, flat, no commission, no code. See what you’re losing, free.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/lp/churnkey-alternative' },
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

// Comparison rows: [feature, Revova, Churnkey]. true = yes, false = no, string = note.
const ROWS: [string, boolean | string, boolean | string][] = [
  ['Starting price', '$29/mo', '~$199/mo'],
  ['Commission on recovered revenue', 'None', 'Varies'],
  ['No-code setup (~3 min)', true, 'Partial'],
  ['Smart retries', true, true],
  ['AI-personalized recovery emails', true, true],
  ['Recovers PAST failures (Lost Revenue Finder)', true, 'Limited'],
  ['Recovery emails in 8 languages', true, 'Limited'],
  ['Handles 3-D Secure / SCA failures', true, true],
  ['Works with 5 processors', true, 'Several'],
]

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <CheckCircle className="mx-auto h-5 w-5 text-emerald-500" />
  if (v === false) return <X className="mx-auto h-5 w-5 text-gray-300" />
  return <span className="text-sm text-gray-600">{v}</span>
}

export default function ChurnkeyAlternativeLP() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Minimal header */}
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
            <Zap className="h-3.5 w-3.5 text-indigo-400" /> The affordable Churnkey alternative
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
            Same payment recovery.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              A fraction of the price.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
            Churnkey is a capable, enterprise-priced tool. If you&apos;re an indie hacker or small-to-mid SaaS,
            Revova gives you the same core recovery — smart retries + AI dunning — plus recovery of the failures you
            already lost, from <strong className="text-white">$29/mo, flat, with no commission</strong>.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <Cta />
            <TrustLine />
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">Revova vs Churnkey</h2>
          <p className="mt-3 text-center text-gray-500">Approximate pricing as of 2026 — always confirm on each vendor&apos;s site.</p>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-4 text-left font-semibold text-gray-500">Feature</th>
                  <th className="border-x border-indigo-100 bg-indigo-50 px-4 py-4 text-center font-black text-indigo-700">Revova</th>
                  <th className="px-4 py-4 text-center font-semibold text-gray-600">Churnkey</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ROWS.map(([feature, r, c], i) => (
                  <tr key={feature} className={i % 2 ? 'bg-gray-50/40' : 'bg-white'}>
                    <td className="px-4 py-3.5 font-medium text-gray-800">{feature}</td>
                    <td className="border-x border-indigo-100 bg-indigo-50/30 px-4 py-3.5 text-center"><Cell v={r} /></td>
                    <td className="px-4 py-3.5 text-center"><Cell v={c} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-sm text-gray-400">
            Churnkey is genuinely strong for larger teams that need its full retention platform. For most small-to-mid
            SaaS, Revova covers the same core job at a fraction of the cost.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
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

      {/* ── WHY SWITCH ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">Why teams switch to Revova</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { icon: CreditCard, title: 'Up to ~85% cheaper', body: 'From $29/mo vs ~$199/mo — the same core recovery engine, without the enterprise price tag.' },
              { icon: Shield, title: 'No commission, ever', body: 'A flat monthly fee. We never take a percentage of what we recover, so the entire upside stays yours.' },
              { icon: Search, title: 'Recovers your past failures', body: 'The Lost Revenue Finder scans up to 12 months back and wins back failures most tools never even look at.' },
              { icon: Globe, title: 'No-code, live in 3 minutes', body: 'Paste one key and you’re running — Stripe, Paddle, Braintree, Chargebee or Recurly.' },
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
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Switching is risk-free</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Run the free scan alongside your current tool before you decide. Read-only — Revova never moves money or stores card numbers.
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
              { q: 'How is Revova different from Churnkey?', a: 'The core recovery engine is similar. Revova is aimed at indie hackers and small-to-mid SaaS: it starts at $29/mo (vs ~$199), needs no code, charges a flat fee with no commission, and its Lost Revenue Finder recovers failures you already lost — not just future ones.' },
              { q: 'Is it really cheaper?', a: 'Yes — Starter is $29/mo and Pro is $79/mo, flat, with no commission on recovered revenue. That’s roughly 85% cheaper than Churnkey’s starting price.' },
              { q: 'Can I switch easily?', a: 'You can run Revova’s free, read-only scan alongside your current tool before switching — no code to rip out, and a 30-day money-back guarantee if it’s not for you.' },
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
            Same recovery.<br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Keep the difference.</span>
          </h2>
          <p className="mt-5 text-white/50">See exactly how much you&apos;re losing — free, read-only, in minutes.</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Cta className="bg-white !text-gray-900 shadow-white/10 hover:bg-gray-100" />
            <TrustLine />
          </div>
        </div>
      </section>

      {/* Minimal footer — legal only */}
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
