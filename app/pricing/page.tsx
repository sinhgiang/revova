'use client'
import Link from 'next/link'
import { Zap, CheckCircle, X, ArrowRight, Shield, Lock, ChevronDown, Star } from 'lucide-react'
import { RoiCalculator } from '@/components/landing/roi-calculator'

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
            Recover $2,000/month.<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pay $29.</span>
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
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

          {/* Starter */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Starter</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-gray-900">$29</span>
              <span className="text-gray-400 mb-2">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-5">Perfect for indie hackers with under $20K MRR</p>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-emerald-800">Break-even math:</p>
              <p className="text-sm text-emerald-700 mt-1">Recover just <strong>1 payment of $29</strong> and Revova pays for itself. Most users recover 8–15 payments per month.</p>
            </div>

            <ul className="space-y-2.5 mb-8">
              {[
                'Up to 50 failed payment recoveries/mo',
                'Lost Revenue Finder — scan + win back 90 days',
                'AI-personalized 4-email sequence',
                'Day 1 → 3 → 7 → 14 cadence',
                'Daily smart payment auto-retry',
                'Pre-dunning expiry alerts',
                'Works with 5 payment processors',
                'Auto spam/bounce suppression',
                'Slack & Telegram notifications',
                'In-app payment banner widget',
                'Past / Now / Upcoming dashboard + date filters',
                'GDPR export & delete tools',
                '14-day free trial',
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
              Start my free trial
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-2xl border-2 border-indigo-500 p-8 text-left shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                Most Popular
              </span>
            </div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Pro</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-gray-900">$79</span>
              <span className="text-gray-400 mb-2">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-5">For growing SaaS teams with $20K+ MRR</p>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-indigo-800">Average Pro customer recovers:</p>
              <p className="text-xl font-black text-indigo-700 mt-0.5">$2,100–$4,500/month</p>
              <p className="text-xs text-indigo-500 mt-0.5">= 26–56× ROI on your subscription</p>
            </div>

            <ul className="space-y-2.5 mb-8">
              {[
                'Everything in Starter, plus:',
                'Unlimited failed payment recoveries',
                'Lost Revenue Finder — full 12-month scan + win-back',
                'AI-personalized 5-email sequence',
                'Hard/soft decline smart routing',
                'SMS recovery from your own number',
                'Emails in 8 languages',
                'Winback campaigns (Day 3, 14, 30)',
                'In-app cancel flow + A/B testing',
                '1-month-free retention offer',
                'LTV-based retention offers',
                'Churn risk scoring',
                'Email open & click analytics',
                'Revenue recovery forecast',
                'Weekly digest performance report',
                'GDPR tools + DPA on request',
                'Priority support (reply within 4h)',
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200">
              Start my free trial
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-8">
          {[
            { icon: Shield, text: '30-day money-back guarantee' },
            { icon: Lock, text: 'No credit card to start' },
            { icon: CheckCircle, text: 'Cancel anytime, instantly' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-gray-300 flex-shrink-0" />
              {text}
            </div>
          ))}
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            <span className="text-gray-400 text-sm ml-2">4.9/5 · 87 reviews</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Customers love the ROI</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { quote: 'Was paying $199/mo for Churnkey. Switched to Revova. Same recovery rate, save $170/mo. No-brainer.', name: 'Tom R.', role: 'Founder, InboxFlow', stat: 'Saves $170/mo vs Churnkey' },
            { quote: 'Recovered $4,280 in month one. Revova costs $79. The math is embarrassingly obvious.', name: 'Sarah K.', role: 'Solo SaaS, $35K MRR', stat: '$4,280 recovered in month 1' },
            { quote: 'Setup took 4 minutes. It just works. No devs, no webhooks, nothing. I wish I found this sooner.', name: 'Mike C.', role: 'Bootstrapped founder', stat: '74% recovery rate' },
          ].map(({ quote, name, role, stat }) => (
            <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-600 text-sm italic mb-5">&ldquo;{quote}&rdquo;</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900 text-sm">{name}</p>
                <p className="text-gray-400 text-xs">{role}</p>
                <span className="inline-block mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">↑ {stat}</span>
              </div>
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
