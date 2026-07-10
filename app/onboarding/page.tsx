'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Shield, Clock, TrendingUp, Eye, EyeOff, Copy, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { ProcessorConnectionSettings } from '@/components/settings/processor-connection-settings'

export default function OnboardingPage() {
  const router = useRouter()

  // Step 1 state
  const [apiKey, setApiKey] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [step1Loading, setStep1Loading] = useState(false)
  const [step1Error, setStep1Error] = useState('')

  // Step 2 state
  const [step, setStep] = useState<1 | 2>(1)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [copied, setCopied] = useState(false)
  const [step2Loading, setStep2Loading] = useState(false)
  const [step2Error, setStep2Error] = useState('')

  // Alternative connection paths for merchants who don't use Stripe
  const [showOther, setShowOther] = useState(false)
  const [userId, setUserId] = useState('')
  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  async function handleConnect() {
    if (!apiKey.startsWith('sk_')) {
      setStep1Error('Please enter a valid Stripe Secret Key (starts with sk_test_ or sk_live_)')
      return
    }
    setStep1Loading(true)
    setStep1Error('')
    try {
      const res = await fetch('/api/stripe/connect-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, businessName: businessName.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to connect')
      const appUrl = window.location.origin
      setWebhookUrl(`${appUrl}/api/webhook/${data.userId}`)
      setStep(2)
    } catch (e: unknown) {
      setStep1Error(e instanceof Error ? e.message : 'Failed to connect')
    } finally {
      setStep1Loading(false)
    }
  }

  async function handleSaveSecret() {
    if (!webhookSecret.startsWith('whsec_')) {
      setStep2Error('Webhook secret must start with whsec_')
      return
    }
    setStep2Loading(true)
    setStep2Error('')
    try {
      const res = await fetch('/api/stripe/webhook-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookSecret }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      router.push('/dashboard')
    } catch (e: unknown) {
      setStep2Error(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setStep2Loading(false)
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Enter the app without (or after) connecting. Ensures a placeholder account
  // row exists so the dashboard doesn't bounce back here, then navigates.
  async function goToDashboard() {
    try { await fetch('/api/onboarding/skip', { method: 'POST' }) } catch {}
    router.push('/dashboard')
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-gray-900">Revova</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Step 1 complete
              </div>
              <div className="w-8 h-px bg-gray-300" />
              <div className="text-sm font-semibold text-indigo-600">Step 2: Setup webhook</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Connect Stripe to send you events</h1>
            <p className="text-gray-500 mt-2">Add your webhook URL in Stripe so Revova can detect failed payments.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            {/* Step A */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold mr-2">A</span>
                Copy your webhook URL
              </p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                <code className="text-xs text-gray-700 flex-1 break-all font-mono">{webhookUrl}</code>
                <button
                  onClick={copyUrl}
                  className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step B */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold mr-2">B</span>
                Add it in your Stripe Dashboard
              </p>
              <a
                href="https://dashboard.stripe.com/webhooks/create"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium mb-2"
              >
                Open Stripe webhook setup
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <ol className="mt-1 text-sm text-gray-500 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>When asked to <strong>select events</strong>, search and add these 2: <code className="bg-gray-100 px-1 rounded text-xs">invoice.payment_failed</code> and <code className="bg-gray-100 px-1 rounded text-xs">invoice.payment_succeeded</code></li>
                <li>For <strong>destination type</strong>, choose <strong>&ldquo;Webhook endpoint&rdquo;</strong></li>
                <li>In <strong>Endpoint URL</strong>, paste the URL from step A above (name can be anything)</li>
                <li>Click <strong>Create destination</strong> (or <strong>Add endpoint</strong>)</li>
              </ol>
              <p className="text-xs text-gray-400 mt-2">💡 Stripe&apos;s screen may look a little different, but the key is always: pick <strong>&ldquo;Webhook endpoint&rdquo;</strong>, paste your URL, and add those 2 events.</p>
            </div>

            {/* Step C */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold mr-2">C</span>
                Paste your Signing Secret
              </p>
              <p className="text-xs text-gray-500 mb-2">On the destination you just created, find <strong>Signing secret</strong> → click the <strong>eye icon 👁</strong> (or &ldquo;Reveal&rdquo;) to show it → copy the full value (starts with <code className="bg-gray-100 px-1 rounded">whsec_</code>) and paste below.</p>
              <Input
                type="password"
                placeholder="whsec_..."
                value={webhookSecret}
                onChange={e => setWebhookSecret(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            {step2Error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{step2Error}</p>
            )}

            <Button
              onClick={handleSaveSecret}
              disabled={step2Loading || !webhookSecret}
              size="lg"
              className="w-full"
            >
              {step2Loading ? 'Saving...' : 'Save & Go to Dashboard'}
            </Button>

            <button
              onClick={goToDashboard}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now (setup later in Settings)
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Alternate path: merchant is not on Stripe — connect another processor here.
  if (showOther) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-gray-900">Revova</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Connect your payment platform</h1>
            <p className="text-gray-500 mt-3 text-lg">Not on Stripe? No problem — pick your platform and connect it below.</p>
          </div>

          <ProcessorConnectionSettings userId={userId} appUrl={appUrl} connectedProcessors={[]} />

          <div className="mt-6 flex flex-col items-center gap-3">
            <Button onClick={goToDashboard} size="lg" className="w-full">
              Continue to Dashboard →
            </Button>
            <button
              onClick={() => setShowOther(false)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Use Stripe instead
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">Revova</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-sm font-semibold text-indigo-600">Step 1: Connect Stripe</div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="text-sm text-gray-400">Step 2: Setup webhook</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Connect your Stripe account</h1>
          <p className="text-gray-500 mt-3 text-lg">Paste your Stripe Secret Key — Revova starts protecting your revenue immediately.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="space-y-4 mb-8">
            {[
              { icon: Shield, title: 'Read-only access', desc: 'We only listen for failed payment events. We never move money.' },
              { icon: Clock, title: 'Live in 3 minutes', desc: 'Paste once, Revova monitors 24/7 automatically.' },
              { icon: TrendingUp, title: 'AI-personalized recovery', desc: 'Every email is written for the customer and the exact reason their card failed.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Business Name <span className="text-gray-400 font-normal">(appears in recovery emails)</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. Acme Inc."
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Stripe Secret Key
              </label>
              <div className="relative">
                <Input
                  type={showKey ? 'text' : 'password'}
                  placeholder="sk_test_... or sk_live_..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                >
                  Open your Stripe API keys →
                </a>{' '}
                (Dashboard → Developers → API keys)
              </p>
            </div>

            {step1Error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{step1Error}</p>
            )}

            <Button
              onClick={handleConnect}
              disabled={step1Loading || !apiKey}
              size="lg"
              className="w-full"
            >
              {step1Loading ? 'Connecting...' : 'Connect Stripe & Continue →'}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Your key is encrypted and stored securely · Revova never stores card numbers
          </p>

          {/* Alternative paths — priority: connect a non-Stripe platform, then skip */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-center">
            <button
              onClick={() => setShowOther(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/60 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              I don&apos;t use Stripe — connect another platform
            </button>
            <p className="text-xs text-gray-400">Paddle · Braintree · Chargebee · Recurly</p>
            <button
              onClick={goToDashboard}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now — I&apos;ll set this up later in Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
