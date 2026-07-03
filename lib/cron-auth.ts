import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'

// Authorize a Vercel Cron (or manual) request. Vercel sends the CRON_SECRET as a
// Bearer token. This FAILS CLOSED: if CRON_SECRET is not configured the request
// is rejected, so a missing env var can never turn every cron endpoint into a
// public "run this privileged job" URL. Comparison is constant-time.
export function isAuthorizedCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false // fail closed — no secret means nobody is authorized

  const header = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`
  const a = Buffer.from(header)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
