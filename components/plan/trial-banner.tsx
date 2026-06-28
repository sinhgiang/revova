import Link from 'next/link'
import { Sparkles, Clock } from 'lucide-react'

// Shown at the top of the dashboard while a merchant is on the free trial.
// Turns urgent in the final 3 days.
export function TrialBanner({ daysLeft }: { daysLeft: number }) {
  const urgent = daysLeft <= 3

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl p-4 mb-6 border ${urgent ? 'bg-amber-50 border-amber-200' : 'bg-indigo-50 border-indigo-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-amber-100' : 'bg-indigo-100'}`}>
          <Clock className={`w-4 h-4 ${urgent ? 'text-amber-600' : 'text-indigo-600'}`} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${urgent ? 'text-amber-900' : 'text-indigo-900'}`}>
            {daysLeft > 0
              ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your free trial`
              : 'Your free trial ends today'}
          </p>
          <p className={`text-xs ${urgent ? 'text-amber-700' : 'text-indigo-600'}`}>
            Choose a plan to keep recovering revenue without interruption.
          </p>
        </div>
      </div>
      <Link
        href="/billing"
        className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors flex-shrink-0 ${urgent ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
        <Sparkles className="w-3.5 h-3.5" /> Upgrade now
      </Link>
    </div>
  )
}
