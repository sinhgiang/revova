import Link from 'next/link'
import { Zap, TrendingUp, Mail, Shield, ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Revova</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Sign in</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <TrendingUp className="w-4 h-4" />
            Average 52% recovery rate with AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Stop losing revenue to<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              failed payments
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Revova uses AI to automatically recover failed Stripe payments with personalized emails. Connect once, recover forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg shadow-indigo-200">
              Start recovering revenue
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-400">Free 14-day trial · No credit card</p>
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="px-6 py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: '52%', label: 'Average recovery rate' },
            { value: '$0', label: 'Lost if we fail to recover' },
            { value: '3 min', label: 'Setup time' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold text-gray-900">{value}</p>
              <p className="text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Everything you need to stop the bleeding
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'AI-Personalized Emails',
                desc: 'Claude AI reads the exact decline reason and writes a unique recovery email — not a template. Expired card gets different copy than insufficient funds.',
              },
              {
                icon: Mail,
                title: 'Smart Send Timing',
                desc: 'Emails are scheduled to land at 8:30am in your customer\'s timezone — not 3am. Higher open rates mean more recovered revenue.',
              },
              {
                icon: Shield,
                title: '100% Safe & Compliant',
                desc: 'Revova never touches money or stores card numbers. We just send smart emails with your Stripe billing portal link.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, flat pricing</h2>
          <p className="text-gray-500 mb-12">No percentage fees. No surprises. Cancel anytime.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Starter */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-left">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Starter</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">$29<span className="text-lg font-normal text-gray-400">/mo</span></p>
              <p className="text-gray-500 text-sm mb-6">Perfect for indie hackers just starting out</p>
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
              <Link href="/signup" className="block w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors text-center">
                Start free trial
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-indigo-500 p-8 shadow-lg text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Pro</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">$79<span className="text-lg font-normal text-gray-400">/mo</span></p>
              <p className="text-gray-500 text-sm mb-6">For SaaS companies growing fast</p>
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
              <Link href="/signup" className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-center">
                Start free trial
              </Link>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Recover just 1 payment and Revova pays for itself. Average customer recovers 8–12 payments/month.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">© 2026 Revova · AI-powered payment recovery</p>
      </footer>
    </div>
  )
}
