import { Suspense } from 'react'
import { CancelContent } from './cancel-content'
import { Loader2 } from 'lucide-react'

export default function CancelFlowPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  )
}
