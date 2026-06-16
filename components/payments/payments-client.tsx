'use client'

import { useState, Fragment } from 'react'
import { StatusBadge } from '@/components/payments/status-badge'
import { formatCurrency, formatDate, getDeclineMessage } from '@/lib/utils'
import { FailedPaymentStatus } from '@/types'
import { Send, FileText, Trash2, Mail, MailOpen, MousePointerClick } from 'lucide-react'

interface Payment {
  id: string
  customer_name: string | null
  customer_email: string
  amount: number
  currency: string
  decline_code: string | null
  emails_sent: number
  status: string
  created_at: string
  note: string | null
  last_email_at: string | null
}

interface Props {
  payments: Payment[]
}

export function PaymentsClient({ payments: initial }: Props) {
  const [payments, setPayments] = useState(initial)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sending, setSending] = useState<string | null>(null)
  const [sendMsg, setSendMsg] = useState<Record<string, { ok: boolean; msg: string }>>({})
  const [editNote, setEditNote] = useState<string | null>(null)
  const [noteVal, setNoteVal] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [dismissing, setDismissing] = useState(false)

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === payments.length) setSelected(new Set())
    else setSelected(new Set(payments.map(p => p.id)))
  }

  async function handleSend(payment: Payment) {
    setSending(payment.id)
    setSendMsg(prev => ({ ...prev, [payment.id]: { ok: false, msg: '' } }))
    try {
      const res = await fetch(`/api/payments/${payment.id}/send-email`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setSendMsg(prev => ({ ...prev, [payment.id]: { ok: true, msg: 'Email sent!' } }))
        setPayments(prev => prev.map(p => p.id === payment.id
          ? { ...p, emails_sent: p.emails_sent + 1, last_email_at: new Date().toISOString(), status: 'email_sent' }
          : p
        ))
      } else {
        setSendMsg(prev => ({ ...prev, [payment.id]: { ok: false, msg: data.error } }))
      }
    } catch {
      setSendMsg(prev => ({ ...prev, [payment.id]: { ok: false, msg: 'Failed' } }))
    } finally {
      setSending(null)
      setTimeout(() => setSendMsg(prev => { const n = { ...prev }; delete n[payment.id]; return n }), 4000)
    }
  }

  function openNote(payment: Payment) {
    setEditNote(payment.id)
    setNoteVal(payment.note ?? '')
  }

  async function saveNote(id: string) {
    setSavingNote(true)
    try {
      await fetch(`/api/payments/${id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteVal.trim() || null }),
      })
      setPayments(prev => prev.map(p => p.id === id ? { ...p, note: noteVal.trim() || null } : p))
      setEditNote(null)
    } finally {
      setSavingNote(false)
    }
  }

  async function handleBulkDismiss() {
    if (selected.size === 0) return
    setDismissing(true)
    try {
      await fetch('/api/payments/bulk-dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      setPayments(prev => prev.map(p => selected.has(p.id) ? { ...p, status: 'cancelled' } : p))
      setSelected(new Set())
    } finally {
      setDismissing(false)
    }
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-medium text-gray-900">No failed payments yet</p>
        <p className="text-gray-500 text-sm mt-1">When Stripe detects a failed payment, it will appear here.</p>
      </div>
    )
  }

  return (
    <>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-6 py-3 bg-indigo-50 border-b border-indigo-100">
          <span className="text-sm font-medium text-indigo-700">{selected.size} selected</span>
          <button
            onClick={handleBulkDismiss}
            disabled={dismissing}
            className="flex items-center gap-1.5 text-sm text-red-600 border border-red-200 bg-white px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {dismissing ? 'Dismissing…' : 'Dismiss selected'}
          </button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-gray-600 ml-auto">
            Clear selection
          </button>
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            <th className="px-4 py-3 w-10">
              <input type="checkbox" checked={selected.size === payments.length} onChange={toggleAll}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Customer</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Amount</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Decline</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Emails</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Date</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {payments.map(p => (
            <Fragment key={p.id}>
              <tr className={`hover:bg-gray-50 transition-colors ${selected.has(p.id) ? 'bg-indigo-50/50' : ''}`}>
                <td className="px-4 py-4">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{p.customer_name ?? 'Unknown'}</p>
                    <p className="text-gray-500 text-xs">{p.customer_email}</p>
                    {p.note && (
                      <p className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                        📝 {p.note}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {formatCurrency(p.amount, p.currency)}
                </td>
                <td className="px-4 py-4 text-gray-600 text-xs">
                  {getDeclineMessage(p.decline_code)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">{p.emails_sent}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={p.status as FailedPaymentStatus} />
                </td>
                <td className="px-4 py-4 text-gray-500 text-xs">{formatDate(p.created_at)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    {/* Manual send */}
                    {p.status !== 'recovered' && p.status !== 'cancelled' && (
                      <button
                        onClick={() => handleSend(p)}
                        disabled={sending === p.id}
                        title="Send recovery email now"
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Note */}
                    <button
                      onClick={() => openNote(p)}
                      title="Add note"
                      className={`p-1.5 rounded-lg transition-colors ${p.note ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {sendMsg[p.id] && (
                    <p className={`text-xs mt-1 ${sendMsg[p.id].ok ? 'text-emerald-600' : 'text-red-500'}`}>
                      {sendMsg[p.id].msg}
                    </p>
                  )}
                </td>
              </tr>
              {/* Note editor inline */}
              {editNote === p.id && (
                <tr>
                  <td colSpan={8} className="px-4 pb-3 bg-amber-50/50">
                    <div className="flex gap-2 items-center">
                      <input
                        autoFocus
                        type="text"
                        value={noteVal}
                        onChange={e => setNoteVal(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveNote(p.id); if (e.key === 'Escape') setEditNote(null) }}
                        placeholder="Add a note about this payment…"
                        className="flex-1 text-sm border border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                      />
                      <button onClick={() => saveNote(p.id)} disabled={savingNote}
                        className="text-xs px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50">
                        {savingNote ? 'Saving…' : 'Save'}
                      </button>
                      <button onClick={() => setEditNote(null)} className="text-xs text-gray-400 hover:text-gray-600">
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {/* Tracking legend */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Mail className="w-3.5 h-3.5" /> Sent
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MailOpen className="w-3.5 h-3.5" /> Opened
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MousePointerClick className="w-3.5 h-3.5" /> Clicked link
        </div>
      </div>
    </>
  )
}
