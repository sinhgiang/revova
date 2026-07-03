import { createHmac, timingSafeEqual } from 'crypto'

// Shared HMAC signing for tamper-proof links (cancel-flow action tokens, billing
// portal deep-links, etc). Falls back through the same secrets the unsubscribe
// tokens already use so no new env var is required to start working.
function getSecret(): string {
  return (
    process.env.SIGNING_SECRET ??
    process.env.UNSUBSCRIBE_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    'revova-signing-secret'
  )
}

// Deterministic short token binding an ordered list of parts. `purpose` keeps
// tokens from one context (e.g. 'portal') from being replayed in another
// (e.g. 'cancel'), even if the remaining parts collide.
export function signToken(purpose: string, ...parts: string[]): string {
  return createHmac('sha256', getSecret())
    .update([purpose, ...parts].join(':'))
    .digest('hex')
    .slice(0, 32)
}

// Constant-time comparison so a wrong token can't be recovered via timing.
export function verifyToken(token: string | null | undefined, purpose: string, ...parts: string[]): boolean {
  if (!token) return false
  const expected = signToken(purpose, ...parts)
  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

// Convenience builders/verifiers for the two current use-cases.
export const cancelActionToken = (userId: string, subscriptionId: string) =>
  signToken('cancel', userId, subscriptionId)
export const verifyCancelActionToken = (token: string | null | undefined, userId: string, subscriptionId: string) =>
  verifyToken(token, 'cancel', userId, subscriptionId)

export const portalToken = (userId: string, customerId: string) =>
  signToken('portal', userId, customerId)
export const verifyPortalToken = (token: string | null | undefined, userId: string, customerId: string) =>
  verifyToken(token, 'portal', userId, customerId)
