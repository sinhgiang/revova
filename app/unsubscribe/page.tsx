import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import { UnsubscribeContent } from './unsubscribe-content'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Unsubscribe — Revova' }

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/></div>}>
      <UnsubscribeContent />
    </Suspense>
  )
}
