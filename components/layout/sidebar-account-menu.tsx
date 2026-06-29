'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ChevronUp, Lock, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { resolvePlan, type PlanStatus } from '@/lib/plan'

function fmtDate(s?: string | null) {
  if (!s) return '—'
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return '—' }
}

// Bottom-of-sidebar account menu: account info, business name, change password,
// and sign out — all in one popover. Replaces the plain "Sign Out" button.
export function SidebarAccountMenu() {
  const router = useRouter()
  const supabase = createClient()
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const [email, setEmail] = useState('')
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [hasPassword, setHasPassword] = useState(false)
  const [plan, setPlan] = useState<PlanStatus | null>(null)

  // Business name
  const [bizName, setBizName] = useState('')
  const [bizSaving, setBizSaving] = useState(false)
  const [bizDone, setBizDone] = useState(false)

  // Change password
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwDone, setPwDone] = useState(false)
  const [pwErr, setPwErr] = useState('')

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      setCreatedAt(user.created_at ?? null)
      setHasPassword(
        user.app_metadata?.provider === 'email' ||
        (user.identities ?? []).some((i: { provider: string }) => i.provider === 'email')
      )
      const { data: acc } = await supabase.from('stripe_accounts').select('business_name, connected_at').eq('user_id', user.id).maybeSingle()
      const { data: sub } = await supabase.from('subscriptions').select('plan_id, status').eq('user_id', user.id).maybeSingle()
      setBizName(acc?.business_name ?? '')
      setPlan(resolvePlan(acc, sub))
    })()
  }, [supabase])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  async function signOut() { await supabase.auth.signOut(); router.push('/login') }

  async function saveBiz() {
    if (!bizName.trim()) return
    setBizSaving(true)
    try {
      const res = await fetch('/api/stripe/update-business', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: bizName }),
      })
      if (res.ok) { setBizDone(true); setTimeout(() => setBizDone(false), 3000) }
    } finally { setBizSaving(false) }
  }

  async function savePassword() {
    setPwErr('')
    if (pw.length < 6) { setPwErr('At least 6 characters'); return }
    if (pw !== confirm) { setPwErr('Passwords do not match'); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    if (error) setPwErr(error.message)
    else { setPwDone(true); setPw(''); setConfirm(''); setTimeout(() => setPwDone(false), 3000) }
    setPwSaving(false)
  }

  const planLabel = plan
    ? plan.tier === 'pro' ? 'Pro plan'
    : plan.tier === 'starter' ? 'Starter plan'
    : plan.tier === 'trial' ? `Free trial · ${plan.trialDaysLeft}d left`
    : 'Trial ended'
    : ''
  const initial = (email[0] ?? '?').toUpperCase()
  const inputCls = 'w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-200'

  return (
    <div ref={ref} className="relative p-3 border-t border-gray-100">
      {open && (
        <div className="absolute bottom-full left-2 mb-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-[72vh] overflow-y-auto">
            {/* Account header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0">{initial}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{email}</p>
                  <p className="text-xs text-gray-500">{planLabel}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">Member since</span><span className="text-gray-700 font-medium">{fmtDate(createdAt)}</span></div>
                {plan?.isTrial && <div className="flex justify-between"><span className="text-gray-400">Trial ends in</span><span className="text-amber-600 font-medium">{plan.trialDaysLeft} days</span></div>}
              </div>
            </div>

            {/* Business name */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-2">Business name in emails</p>
              <div className="flex items-center gap-2">
                <input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Your business" className={inputCls}
                  onKeyDown={e => e.key === 'Enter' && saveBiz()} />
                <button onClick={saveBiz} disabled={bizSaving || !bizName.trim()} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 flex-shrink-0">
                  {bizSaving ? '…' : bizDone ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : 'Save'}
                </button>
              </div>
            </div>

            {/* Change password (email accounts only) */}
            {hasPassword && (
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-2"><Lock className="w-3.5 h-3.5" /> Change password</p>
                <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="New password (min. 6)" className={`${inputCls} mb-2`} />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password" className={`${inputCls} mb-2`} />
                {pwErr && <p className="text-xs text-red-600 mb-2">{pwErr}</p>}
                <button onClick={savePassword} disabled={pwSaving || !pw || !confirm} className="w-full text-sm font-semibold bg-indigo-600 text-white rounded-lg py-1.5 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : pwDone ? <><CheckCircle className="w-4 h-4" /> Updated</> : 'Update password'}
                </button>
              </div>
            )}

            {/* Sign out */}
            <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* The account button */}
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2.5 w-full rounded-lg px-2 py-2 hover:bg-gray-50 transition-colors">
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center flex-shrink-0">{initial}</div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-medium text-gray-900 truncate">{email || 'Account'}</p>
          <p className="text-xs text-gray-400 truncate">{planLabel || 'Manage account'}</p>
        </div>
        <ChevronUp className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  )
}
