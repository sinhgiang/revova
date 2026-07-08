import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Faq } from '@/lib/seo'

// Shared typographic primitives for blog articles. Keeping them here means every
// post reads as one consistent, well-set publication instead of ad-hoc markup.

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-xl leading-8 text-gray-600 mb-8">{children}</p>
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[17px] leading-8 text-gray-700 mb-5">{children}</p>
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-2xl md:text-3xl font-bold text-gray-900 mt-14 mb-4 scroll-mt-24 tracking-tight">
      {children}
    </h2>
  )
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-xl font-semibold text-gray-900 mt-10 mb-3">{children}</h3>
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mb-6 space-y-2.5 text-[17px] leading-7 text-gray-700 list-disc pl-6 marker:text-indigo-400">{children}</ul>
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="mb-6 space-y-2.5 text-[17px] leading-7 text-gray-700 list-decimal pl-6 marker:text-gray-400 marker:font-semibold">{children}</ol>
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="pl-1.5">{children}</li>
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith('http')
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline">
        {children}
      </a>
    )
  }
  return <Link href={href} className="text-indigo-600 font-medium hover:underline">{children}</Link>
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-gray-900">{children}</strong>
}

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
      {title && <p className="font-semibold text-indigo-900 mb-1.5">{title}</p>}
      <div className="text-[16px] leading-7 text-indigo-900/80">{children}</div>
    </div>
  )
}

export function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-2xl border border-gray-200">{children}</div>
      {caption && <figcaption className="mt-3 text-center text-sm text-gray-400">{caption}</figcaption>}
    </figure>
  )
}

// Comparison table. Rows is a 2D array; first row is the header.
export function CompareTable({ rows }: { rows: string[][] }) {
  const [head, ...body] = rows
  return (
    <Figure>
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide border-b border-gray-200 ${
                  i === 0 ? 'text-gray-500 bg-gray-50' : 'text-gray-700 bg-gray-50'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri} className={ri % 2 ? 'bg-gray-50/40' : 'bg-white'}>
              {r.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 border-b border-gray-100 align-top ${
                    ci === 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  )
}

export function CTA({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="my-12 rounded-3xl bg-[#060612] text-white p-8 md:p-10 text-center">
      <h3 className="text-2xl font-bold mb-3 tracking-tight">{heading}</h3>
      <p className="text-white/60 max-w-xl mx-auto mb-7 leading-relaxed">{body}</p>
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors"
      >
        Start my 14-day free trial →
      </Link>
      <p className="text-white/35 text-xs mt-4">No credit card · Free Lost Revenue scan · 30-day money-back guarantee</p>
    </div>
  )
}

export function Divider() {
  return <hr className="my-12 border-gray-100" />
}

// Skimmer-bait + featured-snippet box near the top of an article.
export function KeyTakeaways({ items }: { items: ReactNode[] }) {
  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">Key takeaways</p>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-[16px] leading-7 text-gray-700">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Hard-number cards — great in the first third of a data/comparison article.
export function StatCards({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-gray-200 p-5 text-center">
          <div className="text-3xl font-extrabold tracking-tight text-gray-900 tabular-nums">{s.value}</div>
          <div className="mt-1.5 text-sm leading-snug text-gray-500">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// Two-column pros/cons visual.
export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="my-7 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-800">
          <span className="text-emerald-500">✓</span> Pros
        </p>
        <ul className="space-y-2 text-[15px] leading-6 text-emerald-900/80">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2"><span className="text-emerald-500">+</span><span>{p}</span></li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-800">
          <span className="text-rose-500">✕</span> Cons
        </p>
        <ul className="space-y-2 text-[15px] leading-6 text-rose-900/80">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2"><span className="text-rose-400">–</span><span>{c}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Compact, price-first inline call-to-action for mid-article.
export function InlineCTA({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[15px] leading-6 text-indigo-900/90">{children}</div>
      <div className="flex flex-shrink-0 items-center gap-4">
        <span className="text-sm font-semibold text-indigo-900/70">$29–79/mo · free trial</span>
        <Link
          href="/signup"
          className="whitespace-nowrap rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
        >
          Start free →
        </Link>
      </div>
    </div>
  )
}

// Responsive horizontal bar chart (SVG). Always ships width/height so it never
// collapses to zero height. pct is 0–100; value is the label shown at the bar end.
export function BarChart({ bars, caption }: { bars: { label: string; pct: number; value: string }[]; caption?: string }) {
  const rowH = 46, padY = 10, x0 = 210, x1 = 690, vb = 760
  const h = bars.length * rowH + padY * 2
  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${vb} ${h}`} width={vb} height={h} className="w-full h-auto" role="img"
        aria-label={`Bar chart: ${bars.map((b) => `${b.label} ${b.value}`).join(', ')}`}>
        {bars.map((b, i) => {
          const y = padY + i * rowH + rowH / 2
          const w = Math.max(4, (Math.min(100, b.pct) / 100) * (x1 - x0))
          return (
            <g key={i} fontFamily="Segoe UI, Arial, sans-serif">
              <text x={x0 - 14} y={y + 5} textAnchor="end" fontSize="14" fontWeight="600" fill="#374151">{b.label}</text>
              <rect x={x0} y={y - 12} width={x1 - x0} height="24" rx="7" fill="#eef2ff" />
              <rect x={x0} y={y - 12} width={w} height="24" rx="7" fill="#4f46e5" />
              <text x={x0 + w + 10} y={y + 5} fontSize="13" fontWeight="700" fill="#4f46e5">{b.value}</text>
            </g>
          )
        })}
      </svg>
      {caption && <figcaption className="mt-3 text-center text-sm text-gray-400">{caption}</figcaption>}
    </figure>
  )
}

// Donut chart with legend (SVG). Segments should sum to ~100. width/height set.
export function DonutChart({
  segments, centerLabel, centerSub, caption,
}: {
  segments: { label: string; value: number; color: string; note?: string }[]
  centerLabel: string
  centerSub?: string
  caption?: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const cx = 150, cy = 130, r = 92, sw = 42, C = 2 * Math.PI * r
  let acc = 0
  return (
    <figure className="my-8">
      <svg viewBox="0 0 760 262" width={760} height={262} className="w-full h-auto" role="img"
        aria-label={`Donut chart: ${segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(', ')}`}>
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eef2ff" strokeWidth={sw} />
          {segments.map((s, i) => {
            const frac = s.value / total
            const len = frac * C
            const off = acc * C
            acc += frac
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={sw}
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />
            )
          })}
        </g>
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="30" fontWeight="800" fill="#111827" fontFamily="Segoe UI, Arial, sans-serif">{centerLabel}</text>
        {centerSub && <text x={cx} y={cy + 22} textAnchor="middle" fontSize="12.5" fill="#6b7280" fontFamily="Segoe UI, Arial, sans-serif">{centerSub}</text>}
        <g transform="translate(330,64)" fontFamily="Segoe UI, Arial, sans-serif">
          {segments.map((s, i) => (
            <g key={i} transform={`translate(0 ${i * 52})`}>
              <rect width="16" height="16" rx="4" y="2" fill={s.color} />
              <text x="26" y="15" fontSize="15" fontWeight="700" fill="#374151">{s.label} · {Math.round((s.value / total) * 100)}%</text>
              {s.note && <text x="26" y="35" fontSize="13" fill="#6b7280">{s.note}</text>}
            </g>
          ))}
        </g>
      </svg>
      {caption && <figcaption className="mt-3 text-center text-sm text-gray-400">{caption}</figcaption>}
    </figure>
  )
}

// Filled area/line chart (SVG). Auto-scales; emphasizes the final point. width/height set.
export function AreaChart({
  points, xLabels, caption, endLabel,
}: {
  points: number[]
  xLabels?: string[]
  caption?: string
  endLabel?: string
}) {
  const w = 760, h = 250, padL = 20, padR = 90, padT = 22, padB = 38
  const max = Math.max(...points, 1)
  const n = points.length
  const X = (i: number) => padL + (i * (w - padL - padR)) / (n - 1)
  const Y = (v: number) => padT + (1 - v / max) * (h - padT - padB)
  const line = points.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${X(n - 1).toFixed(1)} ${h - padB} L${X(0).toFixed(1)} ${h - padB} Z`
  const lastX = X(n - 1), lastY = Y(points[n - 1])
  return (
    <figure className="my-8">
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="w-full h-auto" role="img"
        aria-label={`Area chart rising to ${endLabel ?? points[n - 1]}`}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4f46e5" stopOpacity="0.28" />
            <stop offset="1" stopColor="#4f46e5" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#e5e7eb" strokeWidth="1.5" />
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastX} cy={lastY} r="6" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
        {endLabel && (
          <text x={lastX + 12} y={lastY + 4} fontSize="15" fontWeight="800" fill="#4f46e5" fontFamily="Segoe UI, Arial, sans-serif">{endLabel}</text>
        )}
        {xLabels && xLabels.map((l, i) => (
          <text key={i} x={X(i)} y={h - padB + 22} textAnchor="middle" fontSize="12" fill="#9ca3af" fontFamily="Segoe UI, Arial, sans-serif">{l}</text>
        ))}
      </svg>
      {caption && <figcaption className="mt-3 text-center text-sm text-gray-400">{caption}</figcaption>}
    </figure>
  )
}

// On-page FAQ that is fed from the same data array used for FAQPage JSON-LD,
// so the visible Q&A and the structured data can never drift apart.
export function FAQ({ items }: { items: Faq[] }) {
  return (
    <div className="mt-6 divide-y divide-gray-100 border-t border-gray-100">
      {items.map((f, i) => (
        <div key={i} className="py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.q}</h3>
          <p className="text-[16px] leading-7 text-gray-600">{f.a}</p>
        </div>
      ))}
    </div>
  )
}
