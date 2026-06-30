'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export type MerchantRow = {
  userId: string
  name: string
  email: string
  tier: string
  daysActive: number
  total: number
  recovered: number
  revenue: number
  currency: string
  rate: number
  lost30: number
  lost90: number
  lost365: number
  lostCount: number
}

const PAGE_SIZES = [10, 20, 30, 50, 0] // 0 = All
type SortKey = 'name' | 'daysActive' | 'total' | 'recovered' | 'rate' | 'revenue' | 'lost365'

function tierBadge(t: string) {
  const map: Record<string, string> = {
    pro: 'bg-purple-100 text-purple-700',
    starter: 'bg-indigo-100 text-indigo-700',
    trial: 'bg-amber-100 text-amber-700',
    expired: 'bg-gray-100 text-gray-500',
  }
  return map[t] ?? 'bg-gray-100 text-gray-500'
}

export function MerchantsTable({ merchants }: { merchants: MerchantRow[] }) {
  const [q, setQ] = useState('')
  const [limit, setLimit] = useState(20)
  const [sort, setSort] = useState<SortKey>('revenue')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const rows = merchants.filter(m => !term || m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term))
    rows.sort((a, b) => {
      let av: number | string = a[sort], bv: number | string = b[sort]
      if (sort === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase() }
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
    return rows
  }, [merchants, q, sort, dir])

  const shown = limit === 0 ? filtered : filtered.slice(0, limit)

  function header(key: SortKey, label: string, align = 'text-right') {
    const active = sort === key
    return (
      <th className={`px-4 py-3 font-medium ${align}`}>
        <button
          onClick={() => { if (active) setDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSort(key); setDir('desc') } }}
          className={`inline-flex items-center gap-1 hover:text-gray-700 ${active ? 'text-gray-900' : ''}`}
        >
          {label}{active && <span className="text-[9px]">{dir === 'asc' ? '▲' : '▼'}</span>}
        </button>
      </th>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3 justify-between">
        <h3 className="font-semibold text-gray-900">All merchants ({filtered.length})</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or email"
              className="text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 w-56 outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400">Show</span>
            {PAGE_SIZES.map(n => (
              <button
                key={n} onClick={() => setLimit(n)}
                className={`px-2 py-1 rounded-md font-semibold ${limit === n ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {n === 0 ? 'All' : n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wide">
              {header('name', 'Business', 'text-left')}
              <th className="px-4 py-3 font-medium">Plan</th>
              {header('daysActive', 'Days')}
              {header('total', 'Failed')}
              {header('recovered', 'Recovered')}
              {header('rate', 'Rate')}
              {header('revenue', 'Revenue saved')}
              {header('lost365', 'Lost (12mo)')}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {shown.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400">No merchants match.</td></tr>
            ) : shown.map(m => (
              <tr key={m.userId} className="hover:bg-indigo-50/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/merchant/${m.userId}`} className="font-medium text-indigo-600 hover:underline">{m.name}</Link>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${tierBadge(m.tier)}`}>{m.tier}</span></td>
                <td className="px-4 py-3 text-right text-gray-600">{m.daysActive}d</td>
                <td className="px-4 py-3 text-right text-gray-600">{m.total}</td>
                <td className="px-4 py-3 text-right text-gray-600">{m.recovered}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{m.rate}%</td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-600">{formatCurrency(m.revenue, m.currency)}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">{m.lost365 > 0 ? formatCurrency(m.lost365) : <span className="text-gray-300">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {limit !== 0 && filtered.length > limit && (
        <div className="px-5 py-3 border-t border-gray-50 text-center">
          <button onClick={() => setLimit(0)} className="text-xs font-semibold text-indigo-600 hover:underline">Show all {filtered.length} merchants →</button>
        </div>
      )}
    </div>
  )
}
