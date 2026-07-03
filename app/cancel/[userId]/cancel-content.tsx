'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

type Step = 'loading' | 'survey' | 'offers' | 'success' | 'cancelled' | 'error'

interface AccountInfo {
  businessName: string
  cancelFlowEnabled: boolean
  discountCode: string | null
  pauseMonths: number
  giftEnabled: boolean
  variant: 'A' | 'B'
  ltvCents: number
  segment: 'high' | 'standard'
  acquisitionChannel: string | null
}

const REASONS = [
  { id: 'too_expensive', emoji: '💸', label: 'Too expensive', sub: 'The price doesn\'t fit my budget right now' },
  { id: 'not_using', emoji: '😴', label: 'Not using it enough', sub: 'I\'m not getting enough value from it' },
  { id: 'missing_features', emoji: '🔧', label: 'Missing features', sub: 'It doesn\'t do everything I need' },
  { id: 'technical', emoji: '⚠️', label: 'Technical issues', sub: 'I\'ve experienced problems with the service' },
  { id: 'switching', emoji: '↗️', label: 'Switching to another tool', sub: 'I\'ve found a better alternative' },
]

// Which offer to show most prominently based on reason
const REASON_OFFER_PRIORITY: Record<string, 'discount' | 'pause'> = {
  too_expensive: 'discount',
  not_using: 'pause',
  missing_features: 'discount',
  technical: 'discount',
  switching: 'discount',
}

export function CancelContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const userId = params.userId as string
  const subscriptionId = searchParams.get('sub') ?? ''
  // Optional signed token — when the merchant generates one server-side it is
  // forwarded to the action endpoint, which enforces it.
  const actionToken = searchParams.get('token') ?? ''
  const returnUrl = searchParams.get('return') ?? '/'
  // When rendered inside the embeddable modal iframe, notify the parent page on
  // completion instead of relying on full-page navigation.
  const isEmbed = searchParams.get('embed') === '1'

  function notifyParent(type: 'close' | 'done', result?: string) {
    if (isEmbed && typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ source: 'revova-cancel', type, result }, '*')
    }
  }

  const [step, setStep] = useState<Step>('loading')
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Pass the subscription ID so the server can compute this customer's lifetime
    // value and segment the retention offer accordingly.
    const query = subscriptionId ? `?sub=${encodeURIComponent(subscriptionId)}` : ''
    fetch(`/api/cancel/${userId}/info${query}`)
      .then(r => r.json())
      .then(data => {
        if (!data.cancelFlowEnabled) {
          window.location.href = returnUrl
          return
        }
        setAccount(data)
        setStep('survey')
      })
      .catch(() => setStep('error'))
  }, [userId, returnUrl, subscriptionId])

  async function handleAction(action: 'pause' | 'discount' | 'gift' | 'cancel') {
    setActionLoading(action)
    try {
      const res = await fetch(`/api/cancel/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          subscriptionId,
          ...(actionToken ? { token: actionToken } : {}),
          reason: selectedReason,
          ltvCents: account?.ltvCents ?? 0,
          segment: account?.segment ?? 'standard',
          variant: account?.variant ?? 'A',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setStep(action === 'cancel' ? 'cancelled' : 'success')
      notifyParent('done', action === 'cancel' ? 'cancelled' : 'retained')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong')
      setStep('error')
    } finally {
      setActionLoading(null)
    }
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-bold text-gray-900 text-lg mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-4">{errorMsg || 'Please try again or contact support.'}</p>
          <a href="/" className="text-sm text-indigo-600 underline">Go back</a>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="font-bold text-gray-900 text-xl mb-2">You&apos;re all set!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your offer has been applied. We&apos;re glad you&apos;re staying — thanks for being a customer.
          </p>
          <a
            href={isEmbed ? undefined : returnUrl}
            onClick={isEmbed ? (e) => { e.preventDefault(); notifyParent('close') } : undefined}
            className="block w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm cursor-pointer"
          >
            Back to {account?.businessName ?? 'app'}
          </a>
        </div>
      </div>
    )
  }

  if (step === 'cancelled') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">👋</div>
          <h2 className="font-bold text-gray-900 text-xl mb-2">Subscription cancelled</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your subscription has been cancelled. You&apos;re welcome back anytime.
          </p>
          <a
            href={isEmbed ? undefined : returnUrl}
            onClick={isEmbed ? (e) => { e.preventDefault(); notifyParent('close') } : undefined}
            className="block w-full bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm cursor-pointer"
          >
            Back to {account?.businessName ?? 'app'}
          </a>
        </div>
      </div>
    )
  }

  // ── SURVEY STEP ──
  if (step === 'survey') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-7">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🤔</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Before you go…</h1>
            <p className="text-gray-500 text-sm">What&apos;s the main reason you&apos;re cancelling?</p>
          </div>

          <div className="space-y-2.5 mb-7">
            {REASONS.map(({ id, emoji, label, sub }) => (
              <button
                key={id}
                onClick={() => setSelectedReason(id)}
                className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                  selectedReason === id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                  {selectedReason === id && (
                    <CheckCircle className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('offers')}
            disabled={!selectedReason}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-3"
          >
            Continue →
          </button>

          <button
            onClick={() => handleAction('cancel')}
            disabled={actionLoading !== null}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1.5"
          >
            Skip and cancel immediately
          </button>
        </div>
      </div>
    )
  }

  // ── OFFERS STEP ──
  const hasPause = account && account.pauseMonths > 0
  const hasDiscount = account && !!account.discountCode
  const priority = selectedReason ? REASON_OFFER_PRIORITY[selectedReason] : 'discount'

  // Order offers based on what's most relevant to their reason
  const showPauseFirst = priority === 'pause' && hasPause && hasDiscount

  const pauseButton = hasPause && (
    <button
      key="pause"
      onClick={() => handleAction('pause')}
      disabled={actionLoading !== null}
      className="w-full text-left border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 rounded-2xl p-5 transition-all group disabled:opacity-50"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors text-xl">⏸️</div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            Pause for {account?.pauseMonths} month{(account?.pauseMonths ?? 1) > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Take a break — your subscription resumes automatically after {account?.pauseMonths} month{(account?.pauseMonths ?? 1) > 1 ? 's' : ''}.
          </p>
          {actionLoading === 'pause' && (
            <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Applying…</p>
          )}
        </div>
      </div>
    </button>
  )

  const discountButton = hasDiscount && (
    <button
      key="discount"
      onClick={() => handleAction('discount')}
      disabled={actionLoading !== null}
      className="w-full text-left border-2 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 rounded-2xl p-5 transition-all group disabled:opacity-50"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors text-xl">🎁</div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Get a special discount</p>
          <p className="text-xs text-gray-500 mt-0.5">
            We&apos;ll apply a special offer to your account so you can stay and save.
          </p>
          {actionLoading === 'discount' && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Applying…</p>
          )}
        </div>
      </div>
    </button>
  )

  const hasGift = account && account.giftEnabled

  const giftButton = hasGift && (
    <button
      key="gift"
      onClick={() => handleAction('gift')}
      disabled={actionLoading !== null}
      className="w-full text-left border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 rounded-2xl p-5 transition-all group disabled:opacity-50"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors text-xl">🎉</div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Get 1 month free</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Stay with us and your next month is completely on the house — no charge.
          </p>
          {actionLoading === 'gift' && (
            <p className="text-xs text-purple-600 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Applying…</p>
          )}
        </div>
      </div>
    </button>
  )

  // High-value customers and "too expensive" reasons see the free month first.
  const leadWithGift = hasGift && (account?.segment === 'high' || selectedReason === 'too_expensive')
  const baseOffers = showPauseFirst ? [pauseButton, discountButton] : [discountButton, pauseButton]
  const orderedOffers = leadWithGift ? [giftButton, ...baseOffers] : [...baseOffers, giftButton]

  const isHighValue = account?.segment === 'high'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {isHighValue && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
            <span className="text-lg flex-shrink-0">⭐</span>
            <p className="text-xs text-amber-800">
              You&apos;ve been one of our most valued customers. We&apos;d really hate to see you go — here&apos;s our best offer to keep you.
            </p>
          </div>
        )}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">💙</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">We hear you.</h1>
          <p className="text-gray-500 text-sm">
            {selectedReason === 'too_expensive' && 'Here\'s a special offer to make it more affordable:'}
            {selectedReason === 'not_using' && 'No worries — take a break and come back when you\'re ready:'}
            {selectedReason === 'missing_features' && 'Let us help — here\'s what we can offer in the meantime:'}
            {selectedReason === 'technical' && 'We\'re sorry for the trouble — let us make it right:'}
            {selectedReason === 'switching' && 'Before you go, here\'s what we can offer:'}
            {!selectedReason && 'Here\'s what we can offer:'}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {orderedOffers}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setStep('survey')}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            ← Back
          </button>
          <div className="flex-1" />
          <button
            onClick={() => handleAction('cancel')}
            disabled={actionLoading !== null}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            {actionLoading === 'cancel' ? (
              <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Cancelling…</span>
            ) : (
              'No thanks, cancel my subscription →'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
