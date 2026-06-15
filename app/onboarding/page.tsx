'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Shield, Clock, TrendingUp, Eye, EyeOff, Copy, CheckCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
                Add it in Stripe Dashboard
              </p>
              <a
                href="https://dashboard.stripe.com/webhooks/create"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline font-medium"
              >
                Open Stripe → Developers → Webhooks → Add endpoint
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p>• Paste the URL above as the endpoint URL</p>
                <p>• Select events: <code className="bg-gray-100 px-1 rounded text-xs">invoice.payment_failed</code> and <code className="bg-gray-100 px-1 rounded text-xs">invoice.payment_succeeded</code></p>
                <p>• Click <strong>Add endpoint</strong></p>
              </div>
            </div>

            {/* Step C */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold mr-2">C</span>
                Paste your Signing Secret
              </p>
              <p className="text-xs text-gray-500 mb-2">After creating the webhook, click &ldquo;Reveal&rdquo; under Signing secret and paste it here.</p>
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
              onClick={() => router.push('/dashboard')}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now (setup later in Settings)
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
              { icon: TrendingUp, title: 'Average 52% recovery rate', desc: 'AI-personalized emails outperform generic templates by 3x.' },
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
                Find it in Stripe Dashboard → Developers → API keys
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
        </div>
      </div>
    </div>
  )
}
