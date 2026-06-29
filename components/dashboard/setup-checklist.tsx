'use client'

import Link from 'next/link'
import { CheckCircle, Circle, ArrowRight, Rocket } from 'lucide-react'

// Prominent "finish setup" checklist pinned to the top of the dashboard so the
// critical first steps (especially the Stripe webhook) are never buried in
// Settings — even if the user skipped onboarding. Auto-hides once the essential
// steps are done.
export function SetupChecklist({
  webhookDone, businessNameDone, notificationsDone,
}: { webhookDone: boolean; businessNameDone: boolean; notificationsDone: boolean }) {
  // Essential steps gate the recovery engine; notifications are optional.
  if (webhookDone && businessNameDone) return null

  function openAccountMenu() {
    try { window.dispatchEvent(new CustomEvent('revova:open-account')) } catch { /* no-op */ }
  }

  const steps: {
    label: string
    desc: string
    done: boolean
    critical?: boolean
    optional?: boolean
    href?: string
    onClick?: () => void
    cta: string
  }[] = [
    { label: 'Connect your Stripe account', desc: 'Done — Revova is linked to your Stripe.', done: true, cta: '' },
    { label: 'Configure your Stripe webhook', desc: 'The key step — without it Revova can\'t detect failed payments.', done: webhookDone, critical: true, href: '/settings', cta: 'Set up' },
    { label: 'Set your business name', desc: 'So recovery emails come from your brand, not "Our Service".', done: businessNameDone, onClick: openAccountMenu, cta: 'Set name' },
    { label: 'Turn on instant alerts', desc: 'Optional — get a Slack/Telegram ping the moment a payment is recovered.', done: notificationsDone, optional: true, href: '/settings', cta: 'Enable' },
  ]

  const essential = steps.filter(s => !s.optional)
  const doneCount = essential.filter(s => s.done).length
  const total = essential.length
  const pct = Math.round((doneCount / total) * 100)
  const webhookMissing = !webhookDone

  return (
    <div className={`rounded-xl border p-5 mb-8 shadow-sm ${webhookMissing ? 'border-amber-300 bg-amber-50/60' : 'border-indigo-200 bg-indigo-50/40'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${webhookMissing ? 'bg-amber-500' : 'bg-indigo-600'}`}>
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">Finish setting up Revova</p>
          <p className="text-xs text-gray-500">{doneCount} of {total} essential steps done{webhookMissing ? ' — recovery is not active yet' : ''}</p>
        </div>
        <span className="text-sm font-bold text-gray-700">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/70 overflow-hidden mb-4">
        <div className={`h-full rounded-full transition-all ${webhookMissing ? 'bg-amber-500' : 'bg-indigo-600'}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="space-y-1.5">
        {steps.map(s => (
          <div key={s.label} className="flex items-center gap-3 bg-white rounded-lg px-3.5 py-2.5 border border-gray-100">
            {s.done
              ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              : <Circle className={`w-5 h-5 flex-shrink-0 ${s.critical ? 'text-amber-400' : 'text-gray-300'}`} />}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${s.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {s.label}
                {s.optional && <span className="ml-2 text-[10px] font-semibold text-gray-400 uppercase">Optional</span>}
              </p>
              {!s.done && <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>}
            </div>
            {!s.done && s.cta && (
              s.href ? (
                <Link href={s.href} className={`inline-flex items-center gap-1 text-xs font-semibold flex-shrink-0 px-3 py-1.5 rounded-lg ${s.critical ? 'bg-amber-500 text-white hover:bg-amber-600' : 'text-indigo-600 hover:underline'}`}>
                  {s.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button onClick={s.onClick} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline flex-shrink-0">
                  {s.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
