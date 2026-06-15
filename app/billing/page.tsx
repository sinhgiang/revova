import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, Zap, Shield, TrendingUp } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for indie hackers and solo founders',
    features: [
      'Up to 500 failed payments/month',
      '3-email recovery sequence',
      'AI-personalized emails',
      'Real-time dashboard',
      'Stripe integration',
    ],
    lemonsqueezy_url: process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ?? '#',
    popular: true,
  },
]

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subscription } = await (supabase as any)
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const isActive = subscription?.status === 'active'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
        <p className="text-gray-500 mt-1">
          {isActive
            ? 'You are on the Starter plan — keep recovering revenue!'
            : 'Start your 14-day free trial. No credit card required.'}
        </p>
      </div>

      {isActive && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-emerald-800">Active subscription</p>
            <p className="text-sm text-emerald-600">
              Next billing: {subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : 'N/A'}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1 max-w-md mx-auto">
        {PLANS.map((plan) => (
          <div key={plan.name} className="relative bg-white rounded-2xl border-2 border-indigo-500 shadow-lg p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-3">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isActive ? (
              <div className="text-center py-3 bg-emerald-50 rounded-xl text-emerald-700 font-medium text-sm">
                ✓ Current Plan
              </div>
            ) : (
              <a
                href={plan.lemonsqueezy_url}
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
              >
                Start Free Trial
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 rounded-xl p-4">
          <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Secure payments</p>
          <p className="text-xs text-gray-500 mt-0.5">via Lemon Squeezy</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <CheckCircle className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Cancel anytime</p>
          <p className="text-xs text-gray-500 mt-0.5">No lock-in</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">14-day free trial</p>
          <p className="text-xs text-gray-500 mt-0.5">No credit card</p>
        </div>
      </div>
    </div>
  )
}
