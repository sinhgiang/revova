// Twilio SMS sender — uses the REST API directly via fetch (no SDK dependency).
// Each merchant supplies their OWN Twilio credentials, so SMS is sent from their number.

export interface TwilioConfig {
  accountSid: string
  authToken: string
  fromNumber: string
}

export interface SendSmsResult {
  ok: boolean
  sid?: string
  error?: string
}

// Normalize a phone number to E.164-ish form. Twilio requires a leading "+".
// We do a light cleanup; Twilio itself rejects truly invalid numbers.
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  // Already has a country code prefix
  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '')
    return digits.length >= 7 ? `+${digits}` : null
  }
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 7) return null
  // Heuristic: 10-digit numbers default to US (+1). Anything else, prefix "+" as-is.
  if (digits.length === 10) return `+1${digits}`
  return `+${digits}`
}

export async function sendSMS(
  config: TwilioConfig,
  to: string,
  body: string
): Promise<SendSmsResult> {
  const phone = normalizePhone(to)
  if (!phone) return { ok: false, error: 'Invalid phone number' }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`
  const auth = Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64')

  const form = new URLSearchParams()
  form.set('To', phone)
  form.set('From', config.fromNumber)
  form.set('Body', body)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
      signal: AbortSignal.timeout(10000),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, error: data?.message ?? `Twilio HTTP ${res.status}` }
    }
    return { ok: true, sid: data?.sid }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

// Build a short recovery SMS (Twilio segments at 160 chars — keep it tight).
export function buildRecoverySms(params: {
  businessName: string
  amount: number
  currency: string
  updateUrl: string
}): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: params.currency.toUpperCase(),
  }).format(params.amount / 100)
  // Keep it under ~160 chars so it stays a single segment when possible.
  return `${params.businessName}: your payment of ${formatted} didn't go through. Update your card to keep your access: ${params.updateUrl}`
}
