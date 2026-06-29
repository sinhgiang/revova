'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, Mail, BarChart2, Settings, Zap, Receipt, BookOpen, ShieldCheck, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/admin'
import { resolvePlan, type PlanStatus } from '@/lib/plan'
import { SidebarAccountMenu } from './sidebar-account-menu'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/payments', label: 'Failed Payments', icon: CreditCard },
  { href: '/sequences', label: 'Email Sequences', icon: Mail },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/billing', label: 'Billing', icon: Receipt },
  { href: '/guide', label: 'Guide', icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)
  const [plan, setPlan] = useState<PlanStatus | null>(null)

  // Show the founder-only Admin link if the signed-in email is the admin, and
  // resolve which plan THIS account is on (shown as a badge under the logo).
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      if (user.email?.toLowerCase() === ADMIN_EMAIL) setIsAdmin(true)
      const { data: account } = await supabase.from('stripe_accounts').select('connected_at').eq('user_id', user.id).maybeSingle()
      const { data: sub } = await supabase.from('subscriptions').select('plan_id, status').eq('user_id', user.id).maybeSingle()
      setPlan(resolvePlan(account, sub))
    })()
  }, [supabase])

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Revova</span>
        </Link>
        {plan && <PlanBadge plan={plan} />}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div className="my-2 border-t border-gray-100" />
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                pathname === '/admin'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          </>
        )}
      </nav>

      <SidebarAccountMenu />
    </aside>
  )
}

// Plan badge shown under the logo so the merchant always knows their current plan.
function PlanBadge({ plan }: { plan: PlanStatus }) {
  const styles: Record<string, { label: string; cls: string; icon?: boolean }> = {
    pro: { label: 'Pro', cls: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white', icon: true },
    starter: { label: 'Starter plan', cls: 'bg-blue-100 text-blue-700' },
    trial: { label: `Free trial · ${plan.trialDaysLeft}d left`, cls: 'bg-amber-100 text-amber-700' },
    expired: { label: 'Trial ended', cls: 'bg-red-100 text-red-700' },
  }
  const s = styles[plan.tier] ?? styles.trial
  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold', s.cls)}>
        {s.icon && <Crown className="w-3 h-3" />}
        {s.label}
      </span>
      {!plan.isPro && (
        <Link href="/billing" className="text-xs font-semibold text-indigo-600 hover:underline">
          Upgrade →
        </Link>
      )}
    </div>
  )
}
