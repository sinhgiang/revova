'use client'
import Link from 'next/link'
import { Zap, TrendingUp, Mail, Shield, ArrowRight, CheckCircle, Clock, DollarSign, AlertCircle, ChevronDown, Lock, X, Globe, RotateCcw, BarChart3, MessageSquare, CreditCard, RefreshCw, Sparkles, History, Search, Filter } from 'lucide-react'
import { RoiCalculator } from '@/components/landing/roi-calculator'
import { PricingPlans } from '@/components/landing/pricing-plans'
import { DemoVideo } from '@/components/landing/demo-video'
import { JsonLd } from '@/components/json-ld'
import { homeFaqs, faqPageSchema, breadcrumbSchema } from '@/lib/seo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <JsonLd data={[faqPageSchema(homeFaqs), breadcrumbSchema([{ name: 'Home', path: '' }])]} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Revova</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#demo" className="hover:text-gray-900 transition-colors">Demo</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium">Sign in</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Start free — no card needed
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-20 bg-[#060612] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white/70 text-sm px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-3.5 h-3.5 text-indigo-400"/>
            <span>Recover failed payments on autopilot — no code, no engineers</span>
          </div>

          {/* Headline — loss aversion */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            The revenue you already earned<br/>
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              is quietly slipping away.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/55 max-w-2xl mx-auto mb-3 leading-relaxed">
            Expired cards, bank declines, and missed verifications silently drain subscription revenue every month.
            Revova shows you exactly how much you&apos;re losing — then recovers it automatically with AI-personalized
            emails in 8 languages.
          </p>
          <p className="text-base text-white/35 mb-10">No code. Setup in 3 minutes. Works while you sleep.</p>

          {/* Primary CTA — first-person + risk reversal */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-10 py-5 rounded-2xl hover:bg-gray-100 transition-colors text-lg shadow-2xl shadow-white/10"
            >
              Start my 14-day free trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4 text-white/35 text-sm">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3"/>No credit card required</span>
              <span>·</span>
              <span>Cancel anytime</span>
              <span>·</span>
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/8 bg-white/3">
          <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-4 gap-6 text-center">
            {[
              { value: '40–60%', label: 'of failed payments are recoverable' },
              { value: '5', label: 'payment processors supported' },
              { value: '3 min', label: 'Setup time' },
              { value: '30-day', label: 'Money-back guarantee' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
                <p className="text-white/40 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-4xl mx-auto px-6 pb-0">
          <div className="bg-[#0e0e1a] border border-white/10 rounded-t-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-3 bg-white/4 border-b border-white/8">
              <div className="w-3 h-3 rounded-full bg-red-500/70"/>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"/>
              <div className="w-3 h-3 rounded-full bg-green-500/70"/>
              <div className="flex-1 bg-white/5 rounded h-5 mx-4"/>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40 bg-white/5 px-2 py-0.5 rounded flex-shrink-0">Example</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Revenue Recovered', value: '$4,280', sub: 'recovered this month', c: 'emerald' },
                  { label: 'Emails Sent', value: '47', sub: 'across 5-email sequence', c: 'indigo' },
                  { label: 'Recovery Rate', value: '71%', sub: 'example figure', c: 'purple' },
                ].map(({ label, value, sub, c }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/40 text-xs mb-1">{label}</p>
                    <p className="text-white text-2xl font-bold">{value}</p>
                    <p className={`text-xs mt-1 ${c==='emerald'?'text-emerald-400':c==='indigo'?'text-indigo-400':'text-purple-400'}`}>{sub}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'John Smith', amount: '$49', status: 'Recovered', time: '2h ago', day: 'Day 3 email' },
                  { name: 'Sarah Chen', amount: '$79', status: 'Email sent', time: '5h ago', day: 'Day 1 email' },
                  { name: 'Mike Johnson', amount: '$49', status: 'Recovered', time: '1d ago', day: 'Day 7 email' },
                ].map(({ name, amount, status, time, day }) => (
                  <div key={name} className="flex items-center justify-between bg-white/4 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">{name[0]}</div>
                      <div>
                        <p className="text-white text-sm font-medium">{name}</p>
                        <p className="text-white/30 text-xs">{day}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-semibold text-sm">{amount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status==='Recovered'?'bg-emerald-500/20 text-emerald-400':'bg-indigo-500/20 text-indigo-400'}`}>{status}</span>
                      <p className="text-white/25 text-xs w-12 text-right">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSOR STRIP — works with all ── */}
      <section className="px-6 py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-400 text-sm font-medium mb-8">Works with every major payment processor — not just Stripe</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-6">
            {[
              { name: 'Stripe', src: '/logos/stripe.png' },
              { name: 'Paddle', src: '/logos/paddle.webp' },
              { name: 'Braintree', src: '/logos/braintree.png' },
              { name: 'Chargebee', src: '/logos/chargebee.png' },
              { name: 'Recurly', src: '/logos/recurly.png' },
            ].map(({ name, src }) => (
              <div key={name} className="flex h-12 w-36 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={name}
                  className="max-h-7 max-w-[120px] w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO VIDEO — see it in action ── */}
      <section id="demo" className="px-6 py-24 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-4">See it in action</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Watch Revova win back a failed payment<br/>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">start to finish.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            In about 4 minutes you&apos;ll see the whole flow: connect your payment processor in one step,
            then watch Revova detect a failed payment, send AI-written recovery emails, and win the revenue
            back — all on autopilot. No code, no engineers, nothing to babysit.
          </p>

          <DemoVideo videoId="YnSJ8RanICI" title="Revova — product demo" />

          <div className="mt-10 flex flex-col items-center gap-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors text-lg shadow-lg shadow-indigo-200"
            >
              Start my 14-day free trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-400">No credit card · Setup in 3 minutes</p>
          </div>
        </div>
      </section>

      {/* ── PAIN — Loss Aversion ── */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-red-500 uppercase tracking-widest mb-4">The silent revenue killer</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            You&apos;re losing money every day<br/>
            <span className="text-red-500">and you probably don&apos;t know it.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
            Failed payments cause 20–40% of all subscription churn. Most founders discover this too late.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { stat: '15%', desc: 'of all Stripe recurring payments fail every month', icon: AlertCircle, color: 'red' },
              { stat: '67%', desc: 'of churned customers never come back without proactive outreach', icon: Clock, color: 'orange' },
              { stat: '$900', desc: 'lost per month at $10K MRR — just from failed payments', icon: DollarSign, color: 'red' },
            ].map(({ stat, desc, icon: Icon, color }) => (
              <div key={stat} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color==='red'?'bg-red-50':'bg-orange-50'}`}>
                  <Icon className={`w-5 h-5 ${color==='red'?'text-red-500':'text-orange-500'}`}/>
                </div>
                <p className={`text-4xl font-black mb-2 ${color==='red'?'text-red-500':'text-orange-500'}`}>{stat}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Calculator CTA */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              At $10K MRR → you&apos;re losing <span className="text-red-500">≈$1,350/month</span> to failed payments.
            </p>
            <p className="text-gray-500 mb-5">That&apos;s $16,200/year. Revova Starter costs $29/month. The math is obvious.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-red-500 text-white font-bold px-7 py-3 rounded-xl hover:bg-red-600 transition-colors">
              Stop the bleeding — start my free trial
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Calculate your ROI</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How much will <em>you</em> recover?
          </h2>
          <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto">
            Move the slider to see exactly how much Revova puts back in your pocket every month.
          </p>
          <RoiCalculator />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Dead simple</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              From zero to recovering revenue<br/>in under 3 minutes
            </h2>
            <p className="text-xl text-gray-500">Without code. Without engineers. Without complexity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                title: 'Connect your processor — 60 seconds',
                desc: 'Paste your payment processor key (Stripe, Paddle, Braintree, Chargebee, or Recurly). That\'s it. Revova instantly monitors your payment events. No code, no engineers.',
                badge: 'No code required',
              },
              {
                step: '02',
                title: 'AI writes the email',
                desc: 'When a payment fails, Revova\'s AI reads the exact decline reason and writes a unique recovery email from scratch — not a template. Every email is different.',
                badge: '5 emails per sequence',
              },
              {
                step: '03',
                title: 'Revenue comes back',
                desc: 'Your customer gets a human-feeling email at 8:30am in their timezone with a one-click update link. Many recover within 24 hours.',
                badge: 'Automatic recovery',
              },
            ].map(({ step, title, desc, badge }) => (
              <div key={step}>
                <div className="text-7xl font-black text-gray-100 mb-4 leading-none">{step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
                  ✓ {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOST REVENUE FINDER — signature feature ── */}
      <section className="px-6 py-24 bg-[#060612] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Only on Revova
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-[1.1]">
              Find the money you&apos;ve<br/>
              <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">already lost</span> — in 30 seconds
            </h2>
            <p className="text-lg text-white/55 mb-7 leading-relaxed">
              Every other recovery tool only catches <em>new</em> failures. Revova looks <strong className="text-white/80">backwards</strong> too. The moment you connect, it scans your entire payment history and shows every failed charge you never recovered — then launches an AI win-back campaign to bring those customers back.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Instant historical scan — last 30 days, 3 months, all the way to 12 months',
                'See the exact dollars that slipped through — real data, not estimates',
                'One-click win-back campaign for old failures (Day 0 → 7 → 21)',
                'No competitor does this — they only watch payments going forward',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-white/75 text-sm">
                  <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-gray-100 transition-colors">
              Scan my lost revenue — free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-white/35 text-xs mt-4">Available on Stripe today · Paddle, Braintree, Chargebee &amp; Recurly rolling out soon. Live recovery already works on all five.</p>
          </div>

          {/* Scan mockup — mirrors the in-app Lost Revenue Finder */}
          <div className="bg-[#0e0e1a] border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Lost Revenue Finder</p>
                <p className="text-white/40 text-xs">You lost <span className="text-rose-400 font-semibold">$11,800</span> in the last 12 months</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Last 30 days', amt: '$1,240', n: '14 failed', locked: false },
                { label: 'Last 3 months', amt: '$4,120', n: '52 failed', locked: false },
                { label: 'Last 12 months', amt: '$11,800', n: '148 failed', locked: true },
              ].map(({ label, amt, n, locked }) => (
                <div key={label} className={`rounded-lg p-3 border ${locked ? 'border-purple-400/30 bg-purple-500/5' : 'border-white/10 bg-white/5'}`}>
                  <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1.5 flex items-center justify-between">
                    {label} {locked && <Lock className="w-3 h-3 text-purple-400" />}
                  </p>
                  <p className={`text-lg font-bold ${locked ? 'blur-[5px] text-white' : 'text-rose-400'}`}>{amt}</p>
                  <p className={`text-[11px] mt-0.5 ${locked ? 'blur-[4px] text-white/50' : 'text-white/45'}`}>{n} payments</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
              <span className="text-sm text-white/70 flex items-center gap-2"><Search className="w-4 h-4 text-indigo-400" /> Scan complete</span>
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Recover these customers →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMAIL PREVIEW ── */}
      <section className="px-6 py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-4">AI-written, not templated</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-5">
              Emails so good your customers<br/>think <em>you</em> wrote them
            </h2>
            <p className="text-gray-500 text-lg mb-7 leading-relaxed">
              Revova&apos;s AI reads the exact failure reason — expired card, insufficient funds, bank decline — and writes a completely different email for each. Zero templates.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Expired card → empathetic, "it happens to everyone" tone',
                'Insufficient funds → gentle, non-judgmental wording',
                'Lost/stolen card → fast 3-email cadence, new card guidance',
                'Sent at 8:30am in the customer\'s local timezone',
                '5-email sequence over 21 days — not just one attempt',
                'Write in 8 languages: English, French, Spanish, German + more',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5"/>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Email mockup */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-indigo-600"/>
                </div>
                <div>
                  <p className="text-xs text-gray-400">From: YourApp &lt;hello@yourapp.com&gt;</p>
                  <p className="text-xs text-gray-400">To: john@startup.io</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800 text-sm">Quick fix needed – Your payment couldn&apos;t go through</p>
              <p className="text-xs text-gray-400 mt-0.5 italic">Preview: We tried to charge your card today but hit a snag…</p>
            </div>
            <div className="p-6 text-sm text-gray-700 space-y-4">
              <p>Hey John,</p>
              <p>We tried to process your YourApp subscription of <strong>$49</strong> today, but your card ending in 4242 has expired.</p>
              <p>No worries — this happens all the time. It only takes 30 seconds to update your payment details and you&apos;ll be all set.</p>
              <Link href="/signup" className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl">
                Update my payment in 30 seconds →
              </Link>
              <p className="text-gray-400 text-xs text-center">Questions? Just reply — I&apos;m happy to help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES — Benefits-led ── */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need. Nothing you don&apos;t.</h2>
            <p className="text-xl text-gray-500">Built for indie hackers who want results, not dashboards.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Search, title: 'Lost Revenue Finder', desc: 'Scans your entire payment history the moment you connect and shows exactly how much you lost to past failures — 30 days, 3 months, up to 12 months. No competitor looks backwards.', badge: 'Signature' },
              { icon: Sparkles, title: 'Historical win-back campaigns', desc: 'Turn those past failures into recovered revenue — Revova emails the customers who failed before you joined, on a Day 0 / 7 / 21 cadence.', badge: 'Win-back' },
              { icon: History, title: 'Past · Now · Upcoming timeline', desc: 'Your dashboard splits into clear zones — money already lost, failures Revova is recovering right now, and cards about to expire. Always know what\'s what.', badge: 'Live dashboard' },
              { icon: Filter, title: 'Filter every metric by date', desc: 'See recoveries for today, the last 7/30/90 days, the last year, or any custom range with a built-in calendar. Know what you recovered in any window.', badge: 'Date filter' },
              { icon: Zap, title: 'AI writes every email from scratch', desc: 'Unique copy for every failure reason. Expired card ≠ insufficient funds ≠ stolen card. No templates, ever.', badge: 'Core feature' },
              { icon: Clock, title: 'Lands at 8:30am in their timezone', desc: 'Emails feel natural because they arrive at a natural time — not 3am. Higher open rate = more revenue back.', badge: 'Smart timing' },
              { icon: Mail, title: '5-email sequence over 21 days', desc: 'Day 1, 3, 7, 14, 21. Hard bank declines get a faster 3-email track. Most competitors send the same email to everyone.', badge: 'Pro: 5 emails' },
              { icon: Globe, title: 'Emails in 8 languages', desc: 'Serve global customers in their native language. English, French, Spanish, German, Portuguese, Dutch, Italian, Japanese.', badge: 'Multi-language' },
              { icon: RotateCcw, title: 'Winback campaigns for cancellations', desc: 'When a customer cancels, Revova automatically sends AI-personalized re-engagement emails on Day 3, 14, and 30.', badge: 'Pro feature' },
              { icon: MessageSquare, title: 'SMS recovery when email is ignored', desc: 'If a customer ignores your emails, Revova texts them a card-update link from your own number. SMS gets ~98% open rates.', badge: 'SMS · Pro' },
              { icon: CreditCard, title: 'Pre-dunning before cards expire', desc: 'Revova spots cards expiring this month or next and emails customers proactively — stopping the failed payment before it ever happens.', badge: 'Proactive' },
              { icon: RefreshCw, title: 'Daily smart-retry for up to 30 days', desc: 'For recoverable declines like insufficient funds, Revova re-attempts the charge every single day — not just on email days — across your whole recovery window.', badge: 'Adaptive retry' },
              { icon: BarChart3, title: 'Weekly recovery digest', desc: 'Every Monday, get a clean summary: failures, recoveries, revenue saved, and your week-over-week rate.', badge: 'Auto-reports' },
              { icon: TrendingUp, title: 'At-risk customer alerts', desc: 'Dashboard flags customers who\'ve received 3+ emails without resolving — so you know when to reach out personally.', badge: 'Live dashboard' },
              { icon: BarChart3, title: 'Email open & click analytics', desc: 'See open rate and click rate for every email in your sequence. Know exactly which email drives the most payments back.', badge: 'Email analytics' },
              { icon: DollarSign, title: 'Revenue forecast', desc: 'Analytics page projects how much you\'ll recover from in-progress payments, based on your historical recovery rate.', badge: 'Forecasting' },
              { icon: Shield, title: 'Cancellation survey + smart deflection', desc: 'When a customer tries to cancel, Revova asks why — then offers the most relevant retention offer (discount, pause, or a free month) based on their answer.', badge: 'Cancel flow' },
              { icon: CreditCard, title: 'Works with 5 payment processors', desc: 'Stripe, Paddle, Braintree, Chargebee, and Recurly — each on its own isolated pipeline. You\'re not locked to Stripe like most recovery tools.', badge: 'Multi-processor' },
              { icon: Mail, title: 'Stays out of the spam folder', desc: 'Bounced and spam-flagged addresses are auto-suppressed to protect your sender reputation — so your emails keep landing in the inbox where they recover revenue.', badge: 'Deliverability' },
              { icon: BarChart3, title: 'A/B test your cancel offers', desc: 'Split cancelling customers between two retention offers and see which one keeps more of them. Optimize what actually saves revenue.', badge: 'A/B testing' },
              { icon: TrendingUp, title: 'Churn risk score', desc: 'Every at-risk customer gets a risk score (Low → Critical), so you know exactly who to reach out to personally — before they\'re gone.', badge: 'Predictive' },
              { icon: Shield, title: 'Enterprise-ready security & GDPR', desc: 'Read-only payment access, encryption in transit and at rest, per-account data isolation, plus one-click data export and deletion. DPA available on request.', badge: 'Security & GDPR' },
              { icon: DollarSign, title: '3-minute setup, no engineers', desc: 'Paste your payment processor key. Done. No code, no Zapier, no engineers. Any non-technical founder can do it.', badge: 'No-code' },
            ].map(({ icon: Icon, title, desc, badge }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-indigo-600"/>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{badge}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HONEST PROOF: see it before you pay ── */}
      <section className="px-6 py-24 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white/60 text-xs px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-indigo-400"/> See the money first
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">You see exactly what you&apos;re losing — before you pay a cent</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Revova is newly launched, so we won&apos;t show you other people&apos;s testimonials. We&apos;ll show you your own number instead: connect your processor and the Lost Revenue Finder scans your history for free. Then you decide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { step: '1', title: 'Connect in 3 minutes', body: 'Paste your payment processor key — read-only access, no code, no engineers. Works with Stripe, Paddle, Braintree, Chargebee and Recurly.' },
              { step: '2', title: 'See what you already lost', body: 'The scan surfaces failed charges from the last 30 days up to 12 months — a real number pulled from your own account, not an estimate.' },
              { step: '3', title: 'Recover it on autopilot', body: 'Turn on AI recovery emails and daily smart-retries. Not happy within 30 days? We refund you in full — no questions asked.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-white/6 border border-white/10 rounded-2xl p-7">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-sm font-bold mb-4">{step}</div>
                <p className="font-semibold text-white mb-2">{title}</p>
                <p className="text-white/55 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Illustrative example — clearly labelled, not a customer claim */}
          <div className="mt-8 bg-white/4 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto text-center">
            <p className="text-white/40 text-[11px] uppercase tracking-widest mb-3">Illustrative example</p>
            <p className="text-white/70 text-sm leading-relaxed">
              A SaaS at <span className="text-white font-semibold">$10K MRR</span> typically loses ~6% to failed payments —
              about <span className="text-rose-400 font-semibold">$600/month</span>. Recovering even half of that is
              <span className="text-emerald-400 font-semibold"> ~$300/month back</span>, on a plan that costs $29–79.
            </p>
            <p className="text-white/30 text-xs mt-3">Your actual numbers depend on your failure rate and recovery results.</p>
          </div>
        </div>
      </section>

      {/* ── COMPETITOR COMPARISON ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Why Revova?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Same results. 85% cheaper.
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Competitors charge enterprise prices for the same features. Revova is built for indie hackers and small SaaS teams.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Feature</th>
                  <th className="px-6 py-4 font-bold text-indigo-600 bg-indigo-50 border-x border-indigo-100">
                    <div className="flex flex-col items-center gap-1">
                      <span>Revova</span>
                      <span className="text-2xl font-black">from $29<span className="text-sm font-normal text-gray-500">/mo</span></span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500 text-center">
                    <div>Churnkey</div>
                    <div className="text-gray-400 font-normal">$199/mo</div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500 text-center">
                    <div>Stunning</div>
                    <div className="text-gray-400 font-normal">$120/mo</div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-500 text-center">
                    <div>ChurnBuster</div>
                    <div className="text-gray-400 font-normal">$149/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Lost Revenue Finder (scan past failures)', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Historical win-back campaigns', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Past / Now / Upcoming timeline view', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'AI-personalized emails', revova: true, churnkey: true, stunning: false, churnbuster: true },
                  { feature: 'Works with 5 payment processors', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Auto spam/bounce suppression', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'GDPR data export & deletion', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Smart payment retry', revova: true, churnkey: true, stunning: true, churnbuster: true },
                  { feature: 'Daily retry for 30 days', revova: true, churnkey: false, stunning: false, churnbuster: true },
                  { feature: 'SMS recovery (text message)', revova: true, churnkey: false, stunning: true, churnbuster: true },
                  { feature: 'LTV-based retention offers', revova: true, churnkey: true, stunning: false, churnbuster: true },
                  { feature: 'In-app cancel flow (modal)', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'A/B test cancel offers', revova: true, churnkey: true, stunning: false, churnbuster: true },
                  { feature: '1-month-free save offer', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Smart payday retry timing', revova: true, churnkey: true, stunning: false, churnbuster: true },
                  { feature: 'Churn risk score', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Hard vs. soft decline routing', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Multi-language emails (8 langs)', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Winback campaigns (post-cancel)', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Weekly digest email reports', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Email open & click analytics', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Revenue recovery forecast', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Cancellation survey (reason tracking)', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Pre-dunning (expiry alerts)', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'In-app payment banner', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Slack & Telegram alerts', revova: true, churnkey: false, stunning: true, churnbuster: false },
                  { feature: 'Send from your own domain (SMTP)', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: 'Outbound webhooks (connect your tools)', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Custom retry cadence & timing', revova: true, churnkey: true, stunning: false, churnbuster: false },
                  { feature: 'Custom AI brand voice', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: '5-email sequence', revova: true, churnkey: true, stunning: false, churnbuster: true },
                  { feature: '3-minute setup (no code)', revova: true, churnkey: false, stunning: false, churnbuster: false },
                  { feature: '30-day money-back', revova: true, churnkey: false, stunning: true, churnbuster: false },
                ].map(({ feature, revova, churnkey, stunning, churnbuster }, i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 font-medium text-gray-700">{feature}</td>
                    <td className="px-6 py-3.5 text-center bg-indigo-50/40 border-x border-indigo-100">
                      {revova ? <CheckCircle className="w-5 h-5 text-indigo-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {churnkey ? <CheckCircle className="w-5 h-5 text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-gray-200 mx-auto" />}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {stunning ? <CheckCircle className="w-5 h-5 text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-gray-200 mx-auto" />}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {churnbuster ? <CheckCircle className="w-5 h-5 text-gray-400 mx-auto" /> : <X className="w-5 h-5 text-gray-200 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Revova has more features than competitors at 85% lower cost. <Link href="/pricing" className="text-indigo-600 hover:underline">See full pricing →</Link>
          </p>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Recover one payment,<br/>and it pays for itself.
          </h2>
          <p className="text-xl text-gray-500 mb-12">14-day free trial · No credit card · 30-day money-back guarantee</p>

          <PricingPlans />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-6 py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Questions? We have answers.</h2>
            <p className="text-gray-500">Everything you need to know before you start.</p>
          </div>
          <div className="space-y-3">
            {homeFaqs.map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 text-sm md:text-base">{q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"/>
                </summary>
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24 bg-[#060612] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Start today</p>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Every day you wait is<br/>
            <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
              money you don&apos;t get back.
            </span>
          </h2>
          <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
            Start recovering failed payments automatically today. Setup takes 3 minutes, no credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-12 py-5 rounded-2xl hover:bg-gray-100 transition-colors text-xl shadow-2xl shadow-white/10"
          >
            Start my 14-day free trial
            <ArrowRight className="w-6 h-6"/>
          </Link>
          <div className="flex items-center justify-center gap-5 text-white/30 text-sm mt-5">
            <span>No credit card</span>
            <span>·</span>
            <span>Cancel anytime</span>
            <span>·</span>
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white"/>
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
          </div>
        </div>
      </footer>

    </div>
  )
}
