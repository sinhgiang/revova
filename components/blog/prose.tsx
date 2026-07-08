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
