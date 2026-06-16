'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'

export function UnsubscribeContent() {
  const params = useSearchParams()
  const success = params.get('success') === '1'
  const email = params.get('e')
  const error = params.get('error')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {success ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;ve been unsubscribed</h1>
            {email && (
              <p className="text-gray-500 mb-6">
                <strong>{email}</strong> will no longer receive payment recovery emails.
              </p>
            )}
            <p className="text-sm text-gray-400 mb-8">
              This change takes effect immediately. If you unsubscribed by mistake, please contact your service provider directly.
            </p>
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:underline"
            >
              ← Back to Revova
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid unsubscribe link</h1>
            <p className="text-gray-500 mb-8">
              This link is invalid or has expired. Please use the unsubscribe link from your most recent email, or reply directly to that email to request removal.
            </p>
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:underline"
            >
              ← Back to Revova
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
