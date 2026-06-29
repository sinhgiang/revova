import { Activity, History, CalendarClock } from 'lucide-react'

// A labelled "time-zone" header so the merchant can tell at a glance which block
// is the past (already lost), the present (Revova recovering now), or the future
// (about to fail). Used to split the dashboard into a clear timeline.
const TONES = {
  past: { chip: 'BEFORE REVOVA', chipCls: 'text-amber-800 bg-amber-100', bar: 'bg-amber-400', Icon: History },
  live: { chip: 'LIVE NOW', chipCls: 'text-emerald-800 bg-emerald-100', bar: 'bg-emerald-500', Icon: Activity },
  soon: { chip: 'COMING UP', chipCls: 'text-orange-800 bg-orange-100', bar: 'bg-orange-400', Icon: CalendarClock },
} as const

export function TimelineSection({
  tone, title, subtitle, className = '',
}: { tone: keyof typeof TONES; title: string; subtitle: string; className?: string }) {
  const t = TONES[tone]
  const Icon = t.Icon
  return (
    <div className={`flex items-start gap-3 mb-4 ${className}`}>
      <div className={`w-1.5 self-stretch rounded-full ${t.bar}`} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${t.chipCls}`}>{t.chip}</span>
          <h2 className="font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
}
