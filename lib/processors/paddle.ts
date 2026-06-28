import crypto from 'crypto'
import type { ProcessorAdapter, ProcessorConnection, NormalizedEvent } from './types'

// Paddle Billing (v2) adapter.
// Docs: webhooks are signed with `Paddle-Signature: ts=...;h1=...` where h1 is
// HMAC-SHA256 of `${ts}:${rawBody}` using the notification-setting secret.

function apiBase(apiKey: string | null): string {
  // Sandbox keys look like pdl_sdbx_...; live keys pdl_live_...
  return apiKey && apiKey.includes('sdbx') ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'
}

function verifySignature(rawBody: string, sigHeader: string | null, secret: string | null): boolean {
  if (!sigHeader || !secret) return false
  // Parse "ts=1700000000;h1=abcdef..."
  const parts = Object.fromEntries(
    sigHeader.split(';').map(kv => {
      const [k, v] = kv.split('=')
      return [k?.trim(), v?.trim()]
    })
  ) as Record<string, string>
  const ts = parts['ts']
  const h1 = parts['h1']
  if (!ts || !h1) return false
  const signed = `${ts}:${rawBody}`
  const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex')
  // Constant-time compare
  try {
    return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expected))
  } catch {
    return false
  }
}

async function paddleGet(apiKey: string, path: string): Promise<any | null> {
  try {
    const res = await fetch(`${apiBase(apiKey)}${path}`, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data ?? null
  } catch {
    return null
  }
}

export const paddleAdapter: ProcessorAdapter = {
  id: 'paddle',

  async verifyAndParse(rawBody, headers, conn: ProcessorConnection): Promise<NormalizedEvent | null> {
    if (!verifySignature(rawBody, headers.get('paddle-signature'), conn.webhookSecret)) {
      return null
    }

    let evt: any
    try { evt = JSON.parse(rawBody) } catch { return null }
    const type: string = evt?.event_type ?? ''
    const data = evt?.data ?? {}

    // Map Paddle event types to our normalized kinds
    let kind: NormalizedEvent['kind'] = 'ignored'
    if (type === 'transaction.payment_failed') kind = 'payment_failed'
    else if (type === 'transaction.completed') kind = 'payment_succeeded'
    else if (type === 'subscription.canceled') kind = 'subscription_cancelled'
    if (kind === 'ignored') return { kind: 'ignored' }

    const apiKey = conn.apiKey ?? ''
    const customerId: string | null = data.customer_id ?? null
    const subscriptionId: string | null = data.subscription_id ?? null

    // Fetch the customer's email/name (not included in the webhook payload)
    let customerEmail: string | null = null
    let customerName: string | null = null
    if (customerId && apiKey) {
      const customer = await paddleGet(apiKey, `/customers/${customerId}`)
      customerEmail = customer?.email ?? null
      customerName = customer?.name ?? null
    }

    // Amount: Paddle returns the grand total as a string in the smallest unit
    const grand = data?.details?.totals?.grand_total ?? data?.details?.totals?.total ?? null
    const amount = grand != null ? parseInt(String(grand), 10) : undefined
    const currency: string | undefined = data?.currency_code ?? undefined

    // Decline reason from the last payment attempt, if present
    let declineCode: string | null = null
    if (Array.isArray(data?.payments) && data.payments.length > 0) {
      const last = data.payments[data.payments.length - 1]
      declineCode = last?.error_code ?? last?.status ?? null
    }

    // Card-update URL from the subscription's management URLs
    let updateCardUrl: string | null = null
    if (subscriptionId && apiKey && kind === 'payment_failed') {
      const sub = await paddleGet(apiKey, `/subscriptions/${subscriptionId}`)
      updateCardUrl = sub?.management_urls?.update_payment_method ?? null
    }

    return {
      kind,
      customerEmail,
      customerName,
      customerId,
      subscriptionId,
      invoiceId: data?.id ?? null,
      amount,
      currency,
      declineCode,
      updateCardUrl,
    }
  },
}
