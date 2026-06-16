import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Upgrade Successful — Revova' }

export default function BillingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re on Pro!</h1>
        <p className="text-gray-500 mb-8">
          Welcome to Revova Pro. Your account has been upgraded. All Pro features are now active.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
          >
            Go to Dashboard →
          </Link>
          <Link
            href="/billing"
            className="block w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            Manage Billing
          </Link>
        </div>
      </div>
    </div>
  )
}
