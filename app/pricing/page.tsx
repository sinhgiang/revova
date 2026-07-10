'use client'
import Link from 'next/link'
import { Zap, CheckCircle, X, ArrowRight, Shield, Lock, ChevronDown } from 'lucide-react'
import { RoiCalculator } from '@/components/landing/roi-calculator'
import { PricingPlans } from '@/components/landing/pricing-plans'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Revova</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <Link href="/#how-it-works" className="hover:text-gray-900 transition-colors">How it works</Link>
            <Link href="/pricing" className="text-indigo-600 font-semibold">Pricing</Link>
            <Link href="/#faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium">Sign in</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-4">Simple pricing</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-5 leading-tight">
            Recover one payment,<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">and it pays for itself.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-4">
            14-day free trial on all plans. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> 30-day money-back</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <PricingPlans />
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">ROI Calculator</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">See your exact numbers</h2>
          <p className="text-gray-500 mb-12">Move the slider to calculate your specific ROI based on your MRR.</p>
          <RoiCalculator />
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Revova vs competitors</h2>
            <p className="text-gray-500 text-lg">Same features. 85% lower price.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-5 font-semibold text-gray-700 w-1/3">Feature</th>
                  <th className="px-5 py-5 font-bold text-indigo-600 bg-indigo-50 border-x border-indigo-100 text-center">
                    <div className="font-black text-lg">Revova</div>
                    <div className="text-2xl font-black mt-1">$29<span className="text-sm font-normal text-gray-500">/mo</span></div>
                  </th>
                  <th className="px-5 py-5 text-center">
                    <div className="font-semibold text-gray-600">Churnkey</div>
                    <div className="text-gray-400 font-normal">$199/mo</div>
                  </th>
                  <th className="px-5 py-5 text-center">
                    <div className="font-semibold text-gray-600">Stunning</div>
                    <div className="text-gray-400 font-normal">$120/mo</div>
                  </th>
                  <th className="px-5 py-5 text-center">
                    <div className="font-semibold text-gray-600">ChurnBuster</div>
                    <div className="text-gray-400 font-normal">$149/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: 'Lost Revenue Finder (scan past failures)', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Historical win-back campaigns', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Past / Now / Upcoming timeline view', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'AI-personalized emails', revova: true, churnkey: true, stunning: false, churnbuster: true },
                  { feature: 'Works with 5 payment processors', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Smart payment auto-retry', revova: true, churnkey: true, stunning: true, churnbuster: true },
                  { feature: 'Daily retry for 30 days', revova: true, churnkey: false, stunning: false, churnbuster: true },
                  { feature: 'SMS recovery (text message)', revova: 'Pro', churnkey: false, stunning: true, churnbuster: true },
                  { feature: 'Pre-dunning (expiry alerts)', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Hard vs. soft decline routing', revova: 'Pro', churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Multi-language emails (8 langs)', revova: 'Pro', churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Winback campaigns (post-cancel)', revova: 'Pro', churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'In-app cancel flow + A/B testing', revova: 'Pro', churnkey: true, stunning: false, churnbuster: false },
                  { feature: '1-month-free save offer', revova: 'Pro', churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Churn risk score', revova: 'Pro', churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Email open & click analytics', revova: 'Pro', churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Revenue recovery forecast', revova: 'Pro', churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Weekly performance digest', revova: 'Pro', churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Send from your own domain (SMTP)', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Outbound webhooks (connect your tools)', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Custom retry cadence & timing', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Custom AI brand voice', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Auto spam/bounce suppression', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'GDPR export & delete + DPA', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: '3-minute setup, no code', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: '30-day money-back', revova: true, churnkey: false, stunning: true, churnbuster: false },
                ].map(({ feature, revova, churnkey, stunning, churnbuster }, i) => {
                  const Cell = ({ val }: { val: boolean | string }) => {
                    if (val === 'Pro') return <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Pro</span>
                    if (val === true) return <CheckCircle className="w-5 h-5 text-indigo-600 mx-auto" />
                    return <X className="w-5 h-5 text-gray-200 mx-auto" />
                  }
                  return (
                    <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                      <td className="px-6 py-3.5 font-medium text-gray-700">{feature}</td>
                      <td className="px-5 py-3.5 text-center bg-indigo-50/30 border-x border-indigo-100"><Cell val={revova} /></td>
                      <td className="px-5 py-3.5 text-center">{churnkey ? <CheckCircle className="w-5 h-5 text-gray-300 mx-auto" /> : <X className="w-5 h-5 text-gray-200 mx-auto" />}</td>
                      <td className="px-5 py-3.5 text-center">{stunning ? <CheckCircle className="w-5 h-5 text-gray-300 mx-auto" /> : <X className="w-5 h-5 text-gray-200 mx-auto" />}</td>
                      <td className="px-5 py-3.5 text-center">{churnbuster ? <CheckCircle className="w-5 h-5 text-gray-300 mx-auto" /> : <X className="w-5 h-5 text-gray-200 mx-auto" />}</td>
                    </tr>
                  )
                })}
                <tr className="bg-indigo-50/40 border-t-2 border-indigo-200">
                  <td className="px-6 py-4 font-bold text-gray-900">Monthly price</td>
                  <td className="px-5 py-4 text-center font-black text-indigo-600 text-xl bg-indigo-50 border-x border-indigo-200">$29</td>
                  <td className="px-5 py-4 text-center font-bold text-gray-400">$199</td>
                  <td className="px-5 py-4 text-center font-bold text-gray-400">$120</td>
                  <td className="px-5 py-4 text-center font-bold text-gray-400">$149</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-gray-400 mt-5">
            Lost Revenue Finder, historical win-back &amp; the timeline view run on Stripe today — Paddle, Braintree, Chargebee &amp; Recurly are rolling out. Live payment recovery already works on all five.
          </p>
        </div>
      </section>

      {/* Why the price makes sense */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Why the price makes sense</h2>
          <p className="text-gray-500 mt-3">Flat, honest pricing — and you see what you&apos;re losing before you pay.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { title: 'Up to 85% cheaper', body: 'Churnkey is $199/mo, ChurnBuster $149/mo, Stunning $120/mo. Revova starts at $29/mo with the same core recovery engine.' },
            { title: 'No commission, ever', body: 'We charge a flat monthly fee. We never take a percentage of the revenue we recover for you — so the upside is entirely yours.' },
            { title: 'Risk-free to try', body: 'Start with a 14-day free trial, no credit card. Not happy within 30 days of paying? Full refund, no questions asked.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="font-semibold text-gray-900">{title}</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Pricing FAQ</h2>
          <div className="space-y-3">
            {[
              {
                q: "What counts as a 'failed payment recovery'?",
                a: "Every time Revova detects a failed payment (from Stripe, Paddle, Braintree, Chargebee, or Recurly) and sends a recovery email sequence, that counts as 1 recovery attempt. Starter plan: up to 50 per month. Pro: unlimited.",
              },
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes — upgrade or downgrade instantly. If you upgrade mid-month you get prorated credit. If you downgrade, the lower price applies from next billing cycle.',
              },
              {
                q: "What happens after the 14-day free trial?",
                a: 'You choose a plan and enter your card. If you forget, your account pauses (no data is deleted) and you can resume anytime. We send 3 reminder emails before the trial ends.',
              },
              {
                q: 'Is there a commission on recovered revenue?',
                a: "No. Unlike some competitors who take 0.5–2% of recovered revenue, Revova charges a flat monthly fee. At $20K MRR that's the difference between $29/mo and $200+/mo.",
              },
              {
                q: "What's the 30-day money-back guarantee?",
                a: "If Revova doesn't recover more revenue than it costs in your first 30 days, email us and we refund the full amount. No questions, no forms, instant refund.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 text-sm">{q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-[#060612] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            Start recovering revenue<br />
            <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">today, for free.</span>
          </h2>
          <p className="text-white/50 mb-8">14-day free trial. No credit card. Setup in 3 minutes.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-10 py-4 rounded-2xl hover:bg-gray-100 transition-colors text-lg shadow-2xl"
          >
            Start my free trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Revova</span>
          </Link>
          <p className="text-sm text-gray-400">© 2026 Revova · AI-powered payment recovery</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">Home</Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600">Sign in</Link>
            <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-600">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
