/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  void request
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: payments } = await (supabase as any)
    .from('failed_payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const rows = payments ?? []

  const headers = [
    'Date', 'Customer Email', 'Customer Name', 'Amount', 'Currency',
    'Decline Reason', 'Emails Sent', 'Status', 'Recovered At',
  ]

  const escape = (v: any) => {
    const s = String(v ?? '')
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  const csv = [
    headers.join(','),
    ...rows.map((p: any) => [
      escape(p.created_at ? new Date(p.created_at).toLocaleDateString() : ''),
      escape(p.customer_email),
      escape(p.customer_name),
      escape(p.amount != null ? (p.amount / 100).toFixed(2) : ''),
      escape(p.currency?.toUpperCase()),
      escape(p.decline_code?.replace(/_/g, ' ')),
      escape(p.emails_sent),
      escape(p.status),
      escape(p.recovered_at ? new Date(p.recovered_at).toLocaleDateString() : ''),
    ].join(',')),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="revova-payments.csv"',
    },
  })
}
