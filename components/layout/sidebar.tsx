'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, Mail, BarChart2, Settings, Zap, LogOut, Receipt, BookOpen, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/admin'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

  // Show the founder-only Admin link if the signed-in email is the admin
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email?.toLowerCase() === ADMIN_EMAIL) setIsAdmin(true)
    })
  }, [supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Revova</span>
        </Link>
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

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
