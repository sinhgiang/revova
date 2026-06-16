'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

type Step = 'loading' | 'offers' | 'success' | 'cancelled' | 'error'

interface AccountInfo {
  businessName: string
  cancelFlowEnabled: boolean
  discountCode: string | null
  pauseMonths: number
}

export function CancelContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const userId = params.userId as string
  const subscriptionId = searchParams.get('sub') ?? ''
  const returnUrl = searchParams.get('return') ?? '/'

  const [step, setStep] = useState<Step>('loading')
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch(`/api/cancel/${userId}/info`)
      .then(r => r.json())
      .then(data => {
        if (!data.cancelFlowEnabled) {
          window.location.href = returnUrl
          return
        }
        setAccount(data)
        setStep('offers')
      })
      .catch(() => setStep('error'))
  }, [userId, returnUrl])

  async function handleAction(action: 'pause' | 'discount' | 'cancel') {
    setActionLoading(action)
    try {
      const res = await fetch(`/api/cancel/${userId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, subscriptionId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setStep(action === 'cancel' ? 'cancelled' : 'success')
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
            href={returnUrl}
            className="block w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
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
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            👋
          </div>
          <h2 className="font-bold text-gray-900 text-xl mb-2">Subscription cancelled</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your subscription has been cancelled. You&apos;re welcome back anytime.
          </p>
          <a
            href={returnUrl}
            className="block w-full bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm"
          >
            Back to {account?.businessName ?? 'app'}
          </a>
        </div>
      </div>
    )
  }

  const hasPause = account && account.pauseMonths > 0
  const hasDiscount = account && !!account.discountCode

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            💙
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Before you go…</h1>
          <p className="text-gray-500 text-sm">
            We&apos;d love to keep you around. Here&apos;s what we can offer:
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {hasPause && (
            <button
              onClick={() => handleAction('pause')}
              disabled={actionLoading !== null}
              className="w-full text-left border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-2xl p-5 transition-all group disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors text-xl">
                  ⏸️
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Pause for {account?.pauseMonths} month{(account?.pauseMonths ?? 1) > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Take a break — your subscription resumes automatically after {account?.pauseMonths} month{(account?.pauseMonths ?? 1) > 1 ? 's' : ''}.
                  </p>
                  {actionLoading === 'pause' && (
                    <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Applying…
                    </p>
                  )}
                </div>
              </div>
            </button>
          )}

          {hasDiscount && (
            <button
              onClick={() => handleAction('discount')}
              disabled={actionLoading !== null}
              className="w-full text-left border-2 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 rounded-2xl p-5 transition-all group disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors text-xl">
                  🎁
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Get a special discount</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    We&apos;ll apply a special offer to your account so you can stay and save.
                  </p>
                  {actionLoading === 'discount' && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Applying…
                    </p>
                  )}
                </div>
              </div>
            </button>
          )}
        </div>

        <button
          onClick={() => handleAction('cancel')}
          disabled={actionLoading !== null}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2 disabled:opacity-50"
        >
          {actionLoading === 'cancel' ? (
            <span className="flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cancelling…
            </span>
          ) : (
            'No thanks, cancel my subscription →'
          )}
        </button>
      </div>
    </div>
  )
}
