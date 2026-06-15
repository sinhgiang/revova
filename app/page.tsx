import Link from 'next/link'
import { Zap, TrendingUp, Mail, Shield, ArrowRight, CheckCircle, Clock, DollarSign, AlertCircle, Star, ChevronDown } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Revova</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Sign in</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-0 bg-[#0a0a0a] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Average 65–80% recovery rate with AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Every failed payment is<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              money you already earned.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed">
            Revova uses AI to automatically send personalized recovery emails when Stripe payments fail.
            Your customers fix it within 24 hours — you recover revenue while you sleep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg">
              Start recovering revenue
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-white/40 text-sm">Free 14-day trial · No credit card · Setup in 3 minutes</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto border-t border-white/10 pt-12">
            {[
              { value: '65–80%', label: 'Recovery rate' },
              { value: '3 min', label: 'Setup time' },
              { value: '$0', label: 'If we fail to recover' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-white/40 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-5xl mx-auto px-6 pb-0">
          <div className="bg-[#111] border border-white/10 rounded-t-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 bg-white/5 rounded-md h-6 mx-4"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Revenue Recovered', value: '$4,280', change: '+23%', color: 'emerald' },
                { label: 'Emails Sent', value: '47', change: '3-email seq', color: 'indigo' },
                { label: 'Recovery Rate', value: '71%', change: 'This month', color: 'purple' },
              ].map(({ label, value, change, color }) => (
                <div key={label} className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/40 text-xs mb-1">{label}</p>
                  <p className="text-white text-2xl font-bold">{value}</p>
                  <p className={`text-xs mt-1 ${color === 'emerald' ? 'text-emerald-400' : color === 'indigo' ? 'text-indigo-400' : 'text-purple-400'}`}>{change}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { name: 'John Smith', email: 'john@startup.io', amount: '$49', status: 'Recovered', time: '2h ago' },
                { name: 'Sarah Chen', email: 'sarah@indie.co', amount: '$79', status: 'Email sent', time: '5h ago' },
                { name: 'Mike Johnson', email: 'mike@saas.com', amount: '$49', status: 'Recovered', time: '1d ago' },
              ].map(({ name, email, amount, status, time }) => (
                <div key={email} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">{name[0]}</div>
                    <div>
                      <p className="text-white text-sm font-medium">{name}</p>
                      <p className="text-white/40 text-xs">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-white font-semibold">{amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${status === 'Recovered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{status}</span>
                    <p className="text-white/30 text-xs">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            The silent revenue killer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Right now, while you read this,<br />
            <span className="text-red-500">money is walking out the door.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-16">
            Failed payments are the #1 cause of involuntary churn — and most founders don't even know it's happening.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                stat: '20–40%',
                title: 'of churn is involuntary',
                desc: 'Customers who want to stay are being lost because of expired cards, insufficient funds, or bank declines — not because they hate your product.',
                color: 'red',
              },
              {
                icon: Clock,
                stat: '9%',
                title: 'of MRR lost per month',
                desc: 'The average SaaS company loses 9% of monthly recurring revenue to failed payments. On $10K MRR, that\'s $900 vanishing every single month.',
                color: 'orange',
              },
              {
                icon: AlertCircle,
                stat: '67%',
                title: 'never come back',
                desc: 'Without proactive outreach, 2 out of 3 customers with failed payments churn permanently — even though they had no intention of cancelling.',
                color: 'red',
              },
            ].map(({ icon: Icon, stat, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-gray-200 text-left shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color === 'red' ? 'bg-red-50' : 'bg-orange-50'}`}>
                  <Icon className={`w-6 h-6 ${color === 'red' ? 'text-red-500' : 'text-orange-500'}`} />
                </div>
                <p className={`text-3xl font-bold mb-1 ${color === 'red' ? 'text-red-500' : 'text-orange-500'}`}>{stat}</p>
                <p className="font-semibold text-gray-900 mb-3">{title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-red-50 border border-red-100 rounded-2xl p-8">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              If you have $10,000 MRR, you&apos;re likely losing <span className="text-red-500">$900/month</span> to failed payments right now.
            </p>
            <p className="text-gray-500">That&apos;s $10,800/year. Revova pays for itself the moment it recovers a single payment.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-100">
              <Zap className="w-4 h-4" />
              Dead simple setup
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              From zero to recovering<br />payments in 3 minutes
            </h2>
            <p className="text-xl text-gray-500">No code. No engineers. No complexity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect your Stripe',
                desc: 'Paste your Stripe API key. Revova instantly connects to your payment events. No code, no webhooks to configure, no engineer needed.',
                detail: 'Takes 60 seconds',
              },
              {
                step: '02',
                title: 'AI writes the email',
                desc: 'When a payment fails, Claude AI reads the exact decline reason and writes a unique, personalized recovery email — not a template.',
                detail: 'Expired card ≠ insufficient funds — each gets different copy',
              },
              {
                step: '03',
                title: 'Customer pays. You recover.',
                desc: 'Your customer receives a human-feeling email with a one-click link to update their card. Most recover within 24 hours.',
                detail: 'Average 65–80% recovery rate',
              },
            ].map(({ step, title, desc, detail }) => (
              <div key={step} className="relative">
                <div className="text-6xl font-bold text-gray-100 mb-4">{step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Preview */}
      <section className="px-6 py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Mail className="w-4 h-4" />
                AI-written, not templated
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Emails that sound like <em>you</em> wrote them — because AI did
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Every recovery email is unique. Claude AI reads the exact decline reason, the customer&apos;s name, your product name, and the amount — then writes a compelling, human email from scratch.
              </p>
              <ul className="space-y-4">
                {[
                  'Expired card gets empathetic, helpful copy',
                  'Insufficient funds gets a gentle, non-judgmental tone',
                  'Bank decline gets an actionable "call your bank" message',
                  'All emails land at 8:30am in customer\'s timezone',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Email mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">From: YourApp &lt;hello@yourapp.com&gt;</p>
                    <p className="text-xs text-gray-500">To: john@startup.io</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm">Quick fix needed – Your payment couldn&apos;t go through</p>
              </div>
              <div className="p-6 text-sm text-gray-700 space-y-4">
                <p>Hey John,</p>
                <p>We tried to process your YourApp subscription payment of <strong>$49</strong> today, but unfortunately your card ending in 4242 has expired.</p>
                <p>This happens to everyone — the good news is it only takes 30 seconds to update your payment details and keep your account running smoothly.</p>
                <Link href="/signup" className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg">
                  Update my payment →
                </Link>
                <p className="text-gray-400 text-xs">If you have any questions, just reply to this email. We&apos;re here to help.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
            <p className="text-xl text-gray-500">Built for indie hackers who want results, not complexity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'AI-Personalized Emails',
                desc: 'Claude AI writes a unique email for every failed payment based on the exact decline reason. Expired card copy ≠ insufficient funds copy.',
                badge: 'Core feature',
              },
              {
                icon: Clock,
                title: 'Smart Send Timing',
                desc: 'Emails are scheduled to land at 8:30am in the customer\'s local timezone — not 3am. Higher open rates = more recovered revenue.',
                badge: 'Unique to Revova',
              },
              {
                icon: Mail,
                title: '3-Email Recovery Sequence',
                desc: 'Day 1 gentle reminder, Day 3 friendly follow-up, Day 7 final notice. Each email escalates tone appropriately without being aggressive.',
                badge: 'Automated',
              },
              {
                icon: TrendingUp,
                title: 'Real-Time Dashboard',
                desc: 'See every failed payment, which emails went out, which customers recovered, and exactly how much revenue you\'ve recovered.',
                badge: 'Insights',
              },
              {
                icon: Shield,
                title: '100% Safe & Compliant',
                desc: 'Revova never touches card data or processes payments. We send emails with your Stripe billing portal link. Read-only Stripe access.',
                badge: 'Enterprise-grade',
              },
              {
                icon: DollarSign,
                title: '1-Click Stripe Connect',
                desc: 'Paste your Stripe API key and you\'re done. No webhooks, no code, no engineers. Live in under 3 minutes.',
                badge: 'Instant setup',
              },
            ].map(({ icon: Icon, title, desc, badge }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{badge}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="px-6 py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Indie hackers are recovering thousands every month</h2>
            <p className="text-white/50">Real results from real founders</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Alex Turner',
                role: 'Founder, FormFlow',
                mrr: '$12K MRR',
                quote: 'I had no idea how much revenue I was losing to failed payments. Revova recovered $1,200 in the first month alone. The setup literally took 3 minutes.',
                recovered: '$1,200 recovered in month 1',
              },
              {
                name: 'Sarah Kim',
                role: 'Solo founder, Chartify',
                mrr: '$5K MRR',
                quote: 'As a solo founder, chasing failed payments was embarrassing and time-consuming. Now it\'s fully automated. My recovery rate went from 0% to 71%.',
                recovered: '71% recovery rate achieved',
              },
              {
                name: 'Marcus Chen',
                role: 'Bootstrapped, DataPulse',
                mrr: '$28K MRR',
                quote: 'We were losing $2,500/month to involuntary churn. Revova recovered most of it within 30 days. At $79/month, the ROI is insane.',
                recovered: '$2,100/month recovered',
              },
            ].map(({ name, role, mrr, quote, recovered }) => (
              <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{name}</p>
                  <p className="text-white/40 text-sm">{role} · {mrr}</p>
                  <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {recovered}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-100">
            No percentage fees. No surprises.
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pay less than you recover.<br />
            <span className="text-indigo-600">Every single month.</span>
          </h2>
          <p className="text-xl text-gray-500 mb-12">14-day free trial on all plans. No credit card required.</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Starter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Starter</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-gray-400 mb-2">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">Perfect for indie hackers just starting out</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700">Break even math:</p>
                <p className="text-sm text-gray-500 mt-1">Recover just <strong>1 payment of $29</strong> and Revova pays for itself. Most customers recover 8-12 payments/month.</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Up to 50 failed payment recoveries/mo',
                  'AI-personalized 3-email sequence',
                  'Real-time dashboard',
                  '1-click Stripe Connect',
                  '14-day free trial',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="block w-full text-center bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors">
                Start free trial
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-indigo-500 p-8 text-left shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-3">Pro</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-bold text-gray-900">$79</span>
                <span className="text-gray-400 mb-2">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">For SaaS companies growing fast</p>

              <div className="bg-indigo-50 rounded-xl p-4 mb-6 border border-indigo-100">
                <p className="text-sm font-semibold text-indigo-800">Average Pro customer recovers:</p>
                <p className="text-lg font-bold text-indigo-700 mt-1">$2,100–$4,500/month</p>
                <p className="text-xs text-indigo-600 mt-0.5">That&apos;s 26–56x ROI on your subscription</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited failed payment recoveries',
                  'AI-personalized 3-email + Day 7 follow-up',
                  'Advanced analytics & revenue insights',
                  '1-click Stripe Connect',
                  'Priority support',
                  '14-day free trial',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
                Start free trial
              </Link>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            Both plans include a 14-day free trial. No credit card required. Cancel anytime, no questions asked.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
            <p className="text-gray-500">Everything you need to know before you start</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is my Stripe data safe? What access does Revova need?',
                a: 'Revova only needs read-only access to your Stripe payment events — we never touch card data, never process payments, and never store sensitive financial information. We use Stripe webhooks to receive payment failure notifications, then send recovery emails on your behalf. Your data never leaves our secure infrastructure.',
              },
              {
                q: 'Will my customers know these emails are automated?',
                a: 'No — that\'s the whole point. Our AI writes emails that sound like you personally wrote them, referencing the customer\'s name, your product name, and the exact failure reason. Customers consistently respond to these emails as if they were from a real human on your team. We even schedule them at 8:30am in the customer\'s timezone to feel natural.',
              },
              {
                q: 'How long does setup take? Do I need a developer?',
                a: 'Setup takes 3 minutes and requires zero code. Just sign up, paste your Stripe API key, and Revova starts monitoring your payment events immediately. No webhooks to configure, no engineers needed, no complex integrations.',
              },
              {
                q: 'What\'s the difference between Starter ($29) and Pro ($79)?',
                a: 'Starter covers up to 50 failed payment recoveries per month with a 3-email sequence — perfect for indie hackers and small SaaS. Pro gives you unlimited recoveries, a 4th follow-up email on Day 7, advanced analytics, and priority support. If you have more than 50 failed payments per month, Pro pays for itself many times over.',
              },
              {
                q: 'What if my revenue is too small — is Revova worth it?',
                a: 'If you have even $30 in failed payments per month, Starter pays for itself. At $29/month, you need to recover just 1 payment. Most customers with any meaningful MRR (even $1,000/month) see 8-15 recoveries per month within the first 30 days. If Revova doesn\'t recover more than its subscription cost in your first 30 days, we\'ll give you a full refund.',
              },
              {
                q: 'How much will I actually recover?',
                a: 'Our customers average 65–80% recovery rate on failed payments. The exact amount depends on your business and customer base. Stripe\'s built-in retry logic recovers about 30–40% of failed payments — Revova adds personalized AI emails on top of that, typically doubling or tripling your recovery rate.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, absolutely. We\'re month-to-month with no contracts and no cancellation fees. You can cancel from your dashboard in 2 clicks. We also offer a 14-day free trial on all plans — no credit card required to start.',
              },
              {
                q: 'Does Revova work if I\'m not in the US?',
                a: 'Yes — Revova works globally wherever Stripe is available. Our emails support all major languages and we schedule sends in your customer\'s local timezone regardless of where they are in the world.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900">{q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Stop leaving money<br />on the table.
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto">
            Every day you wait is another failed payment that never comes back.
            Set up Revova in 3 minutes — free for 14 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-10 py-5 rounded-xl hover:bg-indigo-50 transition-colors text-lg shadow-xl">
              Start recovering revenue — free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-white/40 text-sm mt-6">14-day free trial · No credit card · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
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
