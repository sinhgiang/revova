import { createHmac } from 'crypto'

function getSecret() {
  return process.env.UNSUBSCRIBE_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'revova-unsub-secret'
}

export function generateUnsubscribeToken(userId: string, email: string): string {
  return createHmac('sha256', getSecret())
    .update(`${userId}:${email.toLowerCase()}`)
    .digest('hex')
    .slice(0, 32)
}

export function verifyUnsubscribeToken(userId: string, email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(userId, email)
  return expected === token
}

export function buildUnsubscribeUrl(userId: string, email: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'
  const token = generateUnsubscribeToken(userId, email)
  return `${appUrl}/api/unsubscribe?u=${encodeURIComponent(userId)}&e=${encodeURIComponent(email)}&t=${token}`
}
