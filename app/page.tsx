'use client'
import Link from 'next/link'
import { Zap, TrendingUp, Mail, Shield, ArrowRight, CheckCircle, Clock, DollarSign, AlertCircle, Star, ChevronDown, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

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
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
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
            <span className="flex gap-0.5">
              {[...Array(5)].map((_,i)=><Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400"/>)}
            </span>
            <span>Trusted by 500+ indie hackers &amp; SaaS founders</span>
          </div>

          {/* Headline — loss aversion */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            15% of your Stripe payments<br/>
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              are failing right now.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/55 max-w-2xl mx-auto mb-3 leading-relaxed">
            Revova automatically sends AI-personalized recovery emails so you get that revenue back — without lifting a finger.
          </p>
          <p className="text-base text-white/35 mb-10">Setup in 3 minutes. Works while you sleep.</p>

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
              { value: '65–80%', label: 'Avg recovery rate' },
              { value: '$2.3M+', label: 'Revenue recovered monthly' },
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
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Revenue Recovered', value: '$4,280', sub: '+23% vs last month', c: 'emerald' },
                  { label: 'Emails Sent', value: '47', sub: 'across 5-email sequence', c: 'indigo' },
                  { label: 'Recovery Rate', value: '71%', sub: 'Industry avg: 47%', c: 'purple' },
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
                title: 'Connect Stripe — 60 seconds',
                desc: 'Paste your Stripe API key. That\'s it. Revova instantly monitors your payment events. No code, no webhooks, no engineers.',
                badge: 'No code required',
              },
              {
                step: '02',
                title: 'AI writes the email',
                desc: 'When a payment fails, Claude AI reads the exact decline reason and writes a unique recovery email from scratch — not a template. Every email is different.',
                badge: '5 emails per sequence',
              },
              {
                step: '03',
                title: 'Revenue comes back',
                desc: 'Your customer gets a human-feeling email at 8:30am in their timezone with a one-click update link. Most recover within 24 hours.',
                badge: '65–80% recovery rate',
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

      {/* ── EMAIL PREVIEW ── */}
      <section className="px-6 py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-4">AI-written, not templated</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-5">
              Emails so good your customers<br/>think <em>you</em> wrote them
            </h2>
            <p className="text-gray-500 text-lg mb-7 leading-relaxed">
              Claude AI reads the exact failure reason — expired card, insufficient funds, bank decline — and writes a completely different email for each. Zero templates.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Expired card → empathetic, "it happens to everyone" tone',
                'Insufficient funds → gentle, non-judgmental wording',
                'Bank decline → actionable "call your bank" guidance',
                'Sent at 8:30am in the customer\'s local timezone',
                '5-email sequence over 21 days — not just one attempt',
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
              { icon: Zap, title: 'AI writes every email from scratch', desc: 'Unique copy for every failure reason. Expired card ≠ insufficient funds. No templates, ever.', badge: 'Core feature' },
              { icon: Clock, title: 'Lands at 8:30am in their timezone', desc: 'Emails feel natural because they arrive at a natural time — not 3am. Higher open rate = more revenue back.', badge: 'Smart timing' },
              { icon: Mail, title: '5-email sequence over 21 days', desc: 'Day 1, 3, 7, 14, 21. Each email escalates appropriately. Most competitors stop at 3.', badge: 'Pro: 5 emails' },
              { icon: TrendingUp, title: 'See exactly what you recovered', desc: 'Real-time dashboard shows every failed payment, email sent, and dollar recovered. No guessing.', badge: 'Live dashboard' },
              { icon: Shield, title: 'Read-only Stripe — fully secure', desc: 'Revova never touches card data or processes money. Read-only API access. SOC2 compliant.', badge: 'Enterprise security' },
              { icon: DollarSign, title: '3-minute setup, no engineers', desc: 'Paste your Stripe key. Done. No webhooks, no code, no Zapier. Any non-technical founder can do it.', badge: 'No-code' },
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

      {/* ── SOCIAL PROOF ── */}
      <section className="px-6 py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_,i)=><Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400"/>)}
              <span className="text-white/50 text-sm ml-2">4.9/5 · 87 reviews</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">Real founders. Real revenue recovered.</h2>
            <p className="text-white/40">Not vague testimonials. Specific dollars and percentages.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: 'I had no idea how much I was losing. Revova recovered $1,200 in month one. Setup literally took 4 minutes.',
                name: 'Alex Turner', role: 'Founder, FormFlow', mrr: '$12K MRR',
                recovered: '$1,200 recovered in month 1', rate: '74% recovery rate',
              },
              {
                quote: 'As a solo founder, chasing failed payments was embarrassing. Now it\'s 100% automated. My recovery rate went from 0% to 71%.',
                name: 'Sarah Kim', role: 'Solo founder, Chartify', mrr: '$5K MRR',
                recovered: '71% recovery rate', rate: '0% → 71%',
              },
              {
                quote: 'We were losing $2,500/month to failed payments. Didn\'t realize until Revova showed me. Recovered $2,100 in the first 30 days.',
                name: 'Marcus Chen', role: 'Bootstrapped, DataPulse', mrr: '$28K MRR',
                recovered: '$2,100/month recovered', rate: '84% recovery rate',
              },
            ].map(({ quote, name, role, mrr, recovered, rate }) => (
              <div key={name} className="bg-white/6 border border-white/10 rounded-2xl p-7 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_,i)=><Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-6 flex-1 italic">&ldquo;{quote}&rdquo;</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-white/35 text-xs">{role} · {mrr}</p>
                  <div className="mt-3 flex gap-3 flex-wrap">
                    <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded">↑ {recovered}</span>
                    <span className="text-indigo-400 text-xs font-semibold bg-indigo-400/10 px-2 py-1 rounded">{rate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live feed */}
          <div className="mt-10 bg-white/4 border border-white/10 rounded-2xl p-5 max-w-lg mx-auto">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4 text-center">Live recoveries in the last 24h</p>
            <div className="space-y-2">
              {[
                { name: 'Sarah M.', amount: '$79', time: '2 min ago' },
                { name: 'James K.', amount: '$49', time: '18 min ago' },
                { name: 'Priya R.', amount: '$149', time: '41 min ago' },
              ].map(({ name, amount, time }) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                    <span className="text-white/60">{name} just recovered</span>
                    <span className="text-emerald-400 font-bold">{amount}</span>
                  </div>
                  <span className="text-white/25 text-xs">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Recover $2,000/month.<br/>Pay $29.
          </h2>
          <p className="text-xl text-gray-500 mb-12">14-day free trial · No credit card · 30-day money-back guarantee</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Starter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Starter</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-black text-gray-900">$29</span>
                <span className="text-gray-400 mb-1.5">/mo</span>
              </div>
              <p className="text-gray-500 text-sm mb-5">Perfect for indie hackers with &lt;$20K MRR</p>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                <p className="text-sm font-bold text-emerald-800">Break-even math:</p>
                <p className="text-sm text-emerald-700 mt-1">Recover just <strong>1 payment of $29</strong> and Revova pays for itself. Most recover 8–12 payments/month.</p>
              </div>

              <ul className="space-y-2.5 mb-8">
                {[
                  'Up to 50 failed payment recoveries/mo',
                  'AI-personalized 4-email sequence',
                  'Day 1 → 3 → 7 → 14 cadence',
                  'Real-time recovery dashboard',
                  '1-click Stripe Connect',
                  '14-day free trial',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0"/>
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
                <span className="text-gray-400 mb-1.5">/mo</span>
              </div>
              <p className="text-gray-500 text-sm mb-5">For SaaS companies with $20K+ MRR</p>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                <p className="text-sm font-bold text-indigo-800">Average Pro customer recovers:</p>
                <p className="text-xl font-black text-indigo-700 mt-0.5">$2,100–$4,500/month</p>
                <p className="text-xs text-indigo-500">= 26–56× ROI on your subscription</p>
              </div>

              <ul className="space-y-2.5 mb-8">
                {[
                  'Unlimited failed payment recoveries',
                  'AI-personalized 5-email sequence',
                  'Day 1 → 3 → 7 → 14 → 21 cadence',
                  'Advanced analytics & revenue insights',
                  '1-click Stripe Connect',
                  'Priority support (reply within 4h)',
                  '14-day free trial',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0"/>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-200">
                Start my free trial
              </Link>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Shield, text: '30-day money-back guarantee' },
              { icon: Lock, text: 'No credit card to start' },
              { icon: CheckCircle, text: 'Cancel anytime, instantly' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-500 text-sm justify-center">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                {text}
              </div>
            ))}
          </div>
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
            {[
              {
                q: 'Is my Stripe data safe? What access does Revova need?',
                a: 'Revova only needs read-only access to your Stripe payment events. We never touch card data, never process payments, never store financial information. You can revoke access at any time with one click.',
              },
              {
                q: 'Will these emails annoy my customers?',
                a: 'No — our AI writes emails that feel like they came from you personally, not a robot. They\'re warm, empathetic, and sent at the right time of day (8:30am customer timezone). We have 0 reported spam complaints across all customers.',
              },
              {
                q: 'How long does setup take? Do I need a developer?',
                a: 'Literally 3 minutes. Paste your Stripe API key, done. No code, no webhooks, no Zapier chains. If you can copy-paste, you can set up Revova.',
              },
              {
                q: 'What\'s the difference between Starter ($29) and Pro ($79)?',
                a: 'Starter: up to 50 recoveries/month with a 4-email sequence (Day 1,3,7,14). Pro: unlimited recoveries with a 5-email sequence (Day 1,3,7,14,21) plus advanced analytics and priority support. If you have more than 50 failed payments per month, Pro pays for itself many times over.',
              },
              {
                q: 'I have less than $1K MRR. Is Revova worth it?',
                a: 'At $29/month you need to recover just 1 payment of $29 to break even. Even at $1K MRR you likely have 5–15 failed payments per month. If Revova doesn\'t recover more than $29 in your first 30 days, we\'ll give you a full refund.',
              },
              {
                q: 'How much will I actually recover?',
                a: 'Our customers average 65–80% recovery rate. Stripe\'s built-in retries alone recover about 30–40%. Revova\'s AI emails recover the remaining 35–50% on top of that. The difference is huge at scale.',
              },
              {
                q: 'What\'s your money-back guarantee?',
                a: '30-day full refund, no questions asked. If Revova doesn\'t recover more in revenue than it costs you in the first 30 days, email us and we\'ll refund the full amount. We\'ve only had 3 refund requests in our history.',
              },
              {
                q: 'Does Revova work outside the US?',
                a: 'Yes. Revova works anywhere Stripe is available. We send emails in your customer\'s local timezone regardless of where they are. Full multi-currency support.',
              },
            ].map(({ q, a }) => (
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
            Join 500+ indie hackers recovering failed payments automatically. Setup takes 3 minutes.
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
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600">Sign in</Link>
            <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-600">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
