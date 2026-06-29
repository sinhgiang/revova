'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Custom English calendar so the picker is ALWAYS English regardless of the
// visitor's browser locale (the native <input type="date"> popup follows the
// browser language — wrong for a US-facing product).

const WD = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function parse(s: string) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }

export function DateRangePicker({
  from, to, onChange,
}: { from: string; to: string; onChange: (from: string, to: string) => void }) {
  const init = from ? parse(from) : new Date()
  const [view, setView] = useState({ y: init.getFullYear(), m: init.getMonth() })

  // toLocaleString with an explicit 'en-US' locale is English on every browser.
  const monthLabel = new Date(view.y, view.m, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const firstWeekday = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const todayStr = ymd(new Date())

  function clickDay(day: number) {
    const sel = ymd(new Date(view.y, view.m, day))
    // No start yet, or a full range already chosen → begin a fresh range.
    if (!from || (from && to)) { onChange(sel, ''); return }
    // We have a start but no end → set the end (swap if the click is earlier).
    if (sel < from) onChange(sel, from)
    else onChange(from, sel)
  }

  function dayState(day: number): 'start' | 'end' | 'mid' | 'none' {
    const s = ymd(new Date(view.y, view.m, day))
    if (from && s === from) return 'start'
    if (to && s === to) return 'end'
    if (from && to && s > from && s < to) return 'mid'
    return 'none'
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function prevMonth() { setView(v => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })) }
  function nextMonth() { setView(v => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })) }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-72">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600" aria-label="Previous month">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-gray-800">{monthLabel}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600" aria-label="Next month">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WD.map(w => <div key={w} className="text-[10px] font-semibold text-gray-400 py-1">{w}</div>)}
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />
          const st = dayState(d)
          const s = ymd(new Date(view.y, view.m, d))
          const cls =
            st === 'start' || st === 'end' ? 'bg-indigo-600 text-white font-semibold'
            : st === 'mid' ? 'bg-indigo-100 text-indigo-700'
            : s === todayStr ? 'text-indigo-600 font-semibold hover:bg-indigo-50'
            : 'text-gray-700 hover:bg-indigo-50'
          return (
            <button key={i} onClick={() => clickDay(d)} className={`text-xs py-1.5 rounded ${cls}`}>
              {d}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <button onClick={() => onChange('', '')} className="text-xs font-medium text-gray-500 hover:text-gray-800">Clear</button>
        <button
          onClick={() => { const t = ymd(new Date()); setView({ y: new Date().getFullYear(), m: new Date().getMonth() }); onChange(t, t) }}
          className="text-xs font-semibold text-indigo-600 hover:underline"
        >
          Today
        </button>
      </div>
    </div>
  )
}
