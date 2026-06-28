'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/lib/admin'

// Thin full-width bar shown across the app whenever the signed-in user is the
// admin (and not impersonating — those pages show the amber banner instead).
export function AdminBar() {
  const [show, setShow] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email?.toLowerCase() === ADMIN_EMAIL) setShow(true)
    })
  }, [supabase])

  if (!show) return null

  return (
    <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 flex items-center justify-center gap-3 sticky top-0 z-40">
      <ShieldCheck className="w-4 h-4 text-emerald-400" />
      <span>You are signed in as <strong>Admin</strong></span>
      <Link href="/admin" className="underline font-semibold hover:opacity-80">Open Admin panel →</Link>
    </div>
  )
}
