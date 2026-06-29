'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, ChevronUp, Lock, CheckCircle, Loader2, Building2, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { resolvePlan, type PlanStatus } from '@/lib/plan'

function fmtDate(s?: string | null) {
  if (!s) return '—'
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } catch { return '—' }
}

// Bottom-of-sidebar account menu, styled after polished SaaS dashboards
// (Vercel / Linear / GitHub): avatar header + clean menu rows that expand
// inline for editing. Holds account info, business name, password, sign out.
export function SidebarAccountMenu() {
  const router = useRouter()
  const supabase = createClient()
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<'biz' | 'pw' | null>(null)

  const [email, setEmail] = useState('')
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [hasPassword, setHasPassword] = useState(false)
  const [plan, setPlan] = useState<PlanStatus | null>(null)

  const [bizName, setBizName] = useState('')
  const [bizSaving, setBizSaving] = useState(false)
  const [bizDone, setBizDone] = useState(false)

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

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setExpanded(null) } }
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
      if (res.ok) { setBizDone(true); setTimeout(() => { setBizDone(false); setExpanded(null) }, 1200) }
    } finally { setBizSaving(false) }
  }

  async function savePassword() {
    setPwErr('')
    if (pw.length < 6) { setPwErr('At least 6 characters'); return }
    if (pw !== confirm) { setPwErr('Passwords do not match'); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    if (error) setPwErr(error.message)
    else { setPwDone(true); setPw(''); setConfirm(''); setTimeout(() => { setPwDone(false); setExpanded(null) }, 1500) }
    setPwSaving(false)
  }

  const planLabel = plan
    ? plan.tier === 'pro' ? 'Pro' : plan.tier === 'starter' ? 'Starter' : plan.tier === 'trial' ? 'Free trial' : 'Trial ended'
    : ''
  const planCls = plan?.tier === 'pro'
    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
    : plan?.tier === 'starter' ? 'bg-blue-100 text-blue-700'
    : plan?.tier === 'trial' ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700'
  const displayName = bizName || email.split('@')[0] || 'Account'
  const initial = (displayName[0] ?? '?').toUpperCase()
  const inputCls = 'w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-200'

  return (
    <div ref={ref} className="relative p-2.5 border-t border-gray-100">
      {open && (
        <div className="absolute bottom-full left-2 right-2 mb-2 bg-white border border-gray-200/80 rounded-xl shadow-2xl shadow-gray-300/40 z-50 overflow-hidden">
          <div className="max-h-[74vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 p-3.5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{initial}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            </div>

            {/* Plan + meta */}
            <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${planCls}`}>{planLabel}</span>
              <span className="text-[11px] text-gray-400">
                {plan?.isTrial ? `${plan.trialDaysLeft} days left` : `Joined ${fmtDate(createdAt)}`}
              </span>
            </div>

            {/* Menu rows */}
            <div className="py-1">
              {/* Business name */}
              <button
                onClick={() => setExpanded(expanded === 'biz' ? null : 'biz')}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="flex-1 text-left">Business name</span>
                <span className="text-xs text-gray-400 truncate max-w-[90px]">{bizName || 'Not set'}</span>
                <ChevronRight className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${expanded === 'biz' ? 'rotate-90' : ''}`} />
              </button>
              {expanded === 'biz' && (
                <div className="px-3.5 pb-3 pt-1 flex items-center gap-2">
                  <input value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Your business" className={inputCls} autoFocus onKeyDown={e => e.key === 'Enter' && saveBiz()} />
                  <button onClick={saveBiz} disabled={bizSaving || !bizName.trim()} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 flex-shrink-0">
                    {bizSaving ? '…' : bizDone ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : 'Save'}
                  </button>
                </div>
              )}

              {/* Change password */}
              {hasPassword && (
                <>
                  <button
                    onClick={() => setExpanded(expanded === 'pw' ? null : 'pw')}
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-left">Change password</span>
                    <ChevronRight className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${expanded === 'pw' ? 'rotate-90' : ''}`} />
                  </button>
                  {expanded === 'pw' && (
                    <div className="px-3.5 pb-3 pt-1">
                      <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="New password (min. 6)" className={`${inputCls} mb-2`} autoFocus />
                      <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password" className={`${inputCls} mb-2`} onKeyDown={e => e.key === 'Enter' && savePassword()} />
                      {pwErr && <p className="text-xs text-red-600 mb-2">{pwErr}</p>}
                      <button onClick={savePassword} disabled={pwSaving || !pw || !confirm} className="w-full text-sm font-semibold bg-indigo-600 text-white rounded-lg py-1.5 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
                        {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : pwDone ? <><CheckCircle className="w-4 h-4" /> Updated</> : 'Update password'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sign out */}
            <div className="border-t border-gray-100 py-1">
              <button onClick={signOut} className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The account button */}
      <button onClick={() => setOpen(o => !o)} className={`flex items-center gap-2.5 w-full rounded-lg px-2 py-2 transition-colors ${open ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{initial}</div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
          <p className="text-xs text-gray-400 truncate">{email}</p>
        </div>
        <ChevronUp className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  )
}
