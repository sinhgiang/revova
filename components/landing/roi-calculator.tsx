'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function RoiCalculator() {
  const [mrr, setMrr] = useState(10000)

  const failedAmt = Math.round(mrr * 0.15)
  const recovered = Math.round(failedAmt * 0.72)
  const net = recovered - 29
  const roi = Math.round(recovered / 29)
  const annual = net * 12

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const marks = [1000, 5000, 10000, 25000, 50000, 100000]

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-10 shadow-xl max-w-2xl mx-auto">
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Your Monthly Recurring Revenue (MRR)
        </label>
        <input
          type="range"
          min={1000}
          max={100000}
          step={1000}
          value={mrr}
          onChange={e => setMrr(Number(e.target.value))}
          className="w-full accent-indigo-600 h-2 cursor-pointer"
        />
        <div className="flex justify-between mt-1.5">
          {marks.map(m => (
            <span key={m} className={`text-xs ${mrr === m ? 'text-indigo-600 font-bold' : 'text-gray-300'}`}>
              {m >= 1000 ? `$${m / 1000}K` : `$${m}`}
            </span>
          ))}
        </div>
        <div className="text-center mt-3">
          <span className="text-3xl font-black text-gray-900">{fmt(mrr)}</span>
          <span className="text-gray-400 ml-2 text-sm">MRR</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1.5 leading-tight">You&apos;re losing/mo</p>
          <p className="text-2xl font-black text-red-600">{fmt(failedAmt)}</p>
          <p className="text-xs text-gray-400 mt-1">~15% of MRR fails</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1.5 leading-tight">Revova recovers</p>
          <p className="text-2xl font-black text-emerald-600">{fmt(recovered)}</p>
          <p className="text-xs text-gray-400 mt-1">72% avg rate</p>
        </div>
        <div className="bg-indigo-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-1.5 leading-tight">Your net profit</p>
          <p className="text-2xl font-black text-indigo-600">{fmt(net)}</p>
          <p className="text-xs text-gray-400 mt-1">after $29/mo</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white flex items-center justify-between gap-4">
        <div>
          <p className="text-white/70 text-xs mb-0.5">Your Revova ROI</p>
          <p className="text-3xl font-black">{roi}× per month</p>
          <p className="text-white/60 text-xs mt-0.5">{fmt(annual)}/year net gain</p>
        </div>
        <Link
          href="/signup"
          className="flex-shrink-0 bg-white text-indigo-600 font-bold px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
        >
          Start free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
