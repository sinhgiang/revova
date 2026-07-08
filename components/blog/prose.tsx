import Link from 'next/link'
import type { ReactNode } from 'react'

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
