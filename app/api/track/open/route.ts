/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// 1×1 transparent GIF
const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('u')
  const email = searchParams.get('e')
  const seq = searchParams.get('s')

  if (userId && email && seq) {
    try {
      const supabase = await createAdminClient()
      await (supabase as any)
        .from('email_logs')
        .update({ opened_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('recipient_email', email)
        .eq('email_type', `sequence_${seq}`)
        .is('opened_at', null)
    } catch { /* non-critical */ }
  }

  return new NextResponse(GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
