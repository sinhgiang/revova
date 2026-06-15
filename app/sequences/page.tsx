/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Mail, Clock, CheckCircle, Zap, AlertTriangle } from 'lucide-react'

const sequence = [
  {
    step: 1,
    label: 'Immediately',
    delay: 'Sent right away',
    subject: "Your payment didn't go through — here's how to fix it",
    description: 'AI-crafted email sent the moment a payment fails. Warm, empathetic tone with a direct link to update payment.',
    color: 'indigo',
    planLabel: null,
  },
  {
    step: 2,
    label: 'Day 3',
    delay: '3 days after failure',
    subject: "Still having trouble? We're here to help",
    description: 'Gentle follow-up for customers who haven\'t updated their payment. Reminds them of the value they\'re missing.',
    color: 'amber',
    planLabel: null,
  },
  {
    step: 3,
    label: 'Day 7',
    delay: '7 days after failure',
    subject: 'A quick update about your account',
    description: 'Highlights what the customer is missing out on and invites them to get back on track.',
    color: 'orange',
    planLabel: null,
  },
  {
    step: 4,
    label: 'Day 14',
    delay: '14 days after failure',
    subject: 'Your subscription — important update needed',
    description: 'Two-week mark notice. Creates urgency around losing access to their subscription.',
    color: 'rose',
    planLabel: null,
  },
  {
    step: 5,
    label: 'Day 21',
    delay: '21 days after failure',
    subject: 'Final notice — your account will be cancelled',
    description: 'Last recovery attempt before cancellation. Pro plan exclusive — maximizes your recovery window.',
    color: 'purple',
    planLabel: 'Pro only',
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', badge: 'bg-indigo-100 text-indigo-700' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700'  },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-100',   badge: 'bg-rose-100 text-rose-700'   },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', badge: 'bg-purple-100 text-purple-700' },
}

export default async function SequencesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: stripeAccount } = await (supabase as any)
    .from('stripe_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!stripeAccount) redirect('/onboarding')

  const { data: payments } = await (supabase as any)
    .from('failed_payments')
    .select('emails_sent, status')
    .eq('user_id', user.id)

  const { data: subscription } = await (supabase as any)
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const isPro = subscription?.plan === 'pro'
  const allPayments = payments ?? []
  const totalEmailsSent = allPayments.reduce((sum: number, p: any) => sum + (p.emails_sent ?? 0), 0)
  const totalRecovered = allPayments.filter((p: any) => p.status === 'recovered').length
  const totalFailed = allPayments.length

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Email Sequences</h1>
            <p className="text-gray-500 mt-1">Automated recovery sequence — up to {isPro ? 5 : 4} AI-personalized emails</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalEmailsSent}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Payments Recovered</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{totalRecovered}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Recovery Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalFailed > 0 ? Math.round((totalRecovered / totalFailed) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Active badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Sequence Active
            </span>
            <span className="text-gray-400 text-sm">All emails are enabled and running automatically</span>
          </div>

          {/* Sequence steps */}
          <div className="space-y-4">
            {sequence.map((step, i) => {
              const c = colorMap[step.color]
              const isProOnly = step.planLabel === 'Pro only'
              const isLocked = isProOnly && !isPro
              return (
                <div key={step.step} className="relative">
                  {i < sequence.length - 1 && (
                    <div className="absolute left-8 top-full w-px h-4 bg-gray-200 z-10" />
                  )}
                  <div className={`bg-white rounded-xl border shadow-sm p-6 flex gap-5 ${isLocked ? 'border-gray-100 opacity-60' : 'border-gray-100'}`}>
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                      {step.step === 1 ? <Zap className={`w-5 h-5 ${c.text}`} /> :
                       step.step === 5 ? <AlertTriangle className={`w-5 h-5 ${c.text}`} /> :
                       i === sequence.length - 2 ? <Mail className={`w-5 h-5 ${c.text}`} /> :
                                         <Clock className={`w-5 h-5 ${c.text}`} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                          Email {step.step} · {step.label}
                        </span>
                        <span className="text-xs text-gray-400">{step.delay}</span>
                        {step.planLabel && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            {step.planLabel}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 mt-2">
                        Example: &ldquo;{step.subject}&rdquo;
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0 flex items-center">
                      {isLocked ? (
                        <a href="/billing" className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full hover:bg-purple-100 transition-colors">
                          Upgrade to Pro
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* How it works */}
          <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="font-semibold text-indigo-900 mb-2">How it works</h3>
            <ul className="text-sm text-indigo-700 space-y-1.5">
              <li>• Stripe sends a webhook when a customer&#39;s payment fails</li>
              <li>• Revova instantly generates a personalized recovery email using AI</li>
              <li>• Emails are sent via your domain for maximum deliverability</li>
              <li>• If the customer updates their card, the sequence stops automatically</li>
              <li>• Subjects and body are AI-written per customer — never generic</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
