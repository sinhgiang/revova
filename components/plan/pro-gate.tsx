import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'

// Wraps a Pro-only feature. For non-Pro merchants the feature is shown (so they
// know it exists) but blurred + non-interactive, with an "Upgrade to Pro" overlay
// that drives them to billing.
export function ProGate({ isPro, feature, children }: { isPro: boolean; feature: string; children: React.ReactNode }) {
  if (isPro) return <>{children}</>

  return (
    <div className="relative">
      {/* The real feature, dimmed and disabled */}
      <div className="pointer-events-none select-none blur-[2px] opacity-50" aria-hidden>
        {children}
      </div>
      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-[1px]">
        <div className="text-center bg-white border border-indigo-100 rounded-xl shadow-md px-6 py-5 max-w-xs">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="font-semibold text-gray-900 text-sm mb-1">{feature} is a Pro feature</p>
          <p className="text-xs text-gray-500 mb-3">Upgrade to Pro to unlock it and recover even more revenue.</p>
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  )
}
