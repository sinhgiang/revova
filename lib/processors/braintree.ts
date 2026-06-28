import braintree from 'braintree'
import type { ProcessorAdapter, ProcessorConnection, NormalizedEvent } from './types'

// Braintree (PayPal) adapter. Unlike Paddle/Stripe, Braintree:
//  - needs 4 credentials (merchant id, public key, private key, environment)
//  - signs webhooks with bt_signature/bt_payload, verified by the SDK
//  - has NO hosted card-update page, so the merchant supplies their own URL
//
// NOTE: Braintree is the most complex integration. Verify against a Braintree
// SANDBOX account before relying on it in production.

function gateway(conn: ProcessorConnection): braintree.BraintreeGateway {
  const env = conn.webhookSecret === 'production'
    ? braintree.Environment.Production
    : braintree.Environment.Sandbox
  return new braintree.BraintreeGateway({
    environment: env,
    merchantId: conn.site ?? '',     // merchant id stored in `site`
    publicKey: conn.apiKey ?? '',    // public key stored in `apiKey`
    privateKey: conn.apiSecret ?? '',// private key stored in `apiSecret`
  })
}

function toCents(price: any): number | undefined {
  if (price == null) return undefined
  const n = parseFloat(String(price))
  return Number.isFinite(n) ? Math.round(n * 100) : undefined
}

export const braintreeAdapter: ProcessorAdapter = {
  id: 'braintree',

  async verifyAndParse(rawBody, _headers, conn: ProcessorConnection): Promise<NormalizedEvent | null> {
    // Webhook body is form-encoded: bt_signature=...&bt_payload=...
    const form = new URLSearchParams(rawBody)
    const btSignature = form.get('bt_signature')
    const btPayload = form.get('bt_payload')
    if (!btSignature || !btPayload) return null

    const gw = gateway(conn)

    // The SDK verifies the signature AND parses the payload; throws if invalid.
    let notification: any
    try {
      notification = await gw.webhookNotification.parse(btSignature, btPayload)
    } catch {
      return null
    }

    const kindStr: string = notification?.kind ?? ''
    let kind: NormalizedEvent['kind'] = 'ignored'
    if (kindStr === 'subscription_charged_unsuccessfully') kind = 'payment_failed'
    else if (kindStr === 'subscription_charged_successfully') kind = 'payment_succeeded'
    else if (kindStr === 'subscription_canceled') kind = 'subscription_cancelled'
    if (kind === 'ignored') return { kind: 'ignored' }

    const sub = notification?.subscription ?? {}
    const subscriptionId: string | null = sub?.id ?? null
    const txns: any[] = Array.isArray(sub?.transactions) ? sub.transactions : []
    const lastTxn = txns[txns.length - 1] ?? null

    // Customer email/name: prefer the transaction's embedded customer, else fetch
    let customerEmail: string | null = lastTxn?.customer?.email ?? null
    let customerName: string | null = null
    let customerId: string | null = lastTxn?.customer?.id ?? null
    if (lastTxn?.customer) {
      const f = lastTxn.customer.firstName ?? ''
      const l = lastTxn.customer.lastName ?? ''
      customerName = `${f} ${l}`.trim() || null
    }
    // Fall back to a direct customer lookup if the webhook didn't include email
    if (!customerEmail && customerId) {
      try {
        const customer = await gw.customer.find(customerId)
        customerEmail = customer?.email ?? null
        const nm = `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`.trim()
        if (nm) customerName = nm
      } catch { /* ignore */ }
    }

    const amount = toCents(lastTxn?.amount ?? sub?.price)
    const currency: string | undefined = lastTxn?.currencyIsoCode ?? undefined
    const declineCode: string | null =
      lastTxn?.processorResponseCode ?? lastTxn?.status ?? null

    // Build the card-update link from the merchant's configured billing URL.
    // Append the subscription id so their page can pre-load the right record.
    let updateCardUrl: string | null = null
    if (conn.cardUpdateUrl) {
      updateCardUrl = conn.cardUpdateUrl.includes('{id}')
        ? conn.cardUpdateUrl.replace('{id}', encodeURIComponent(subscriptionId ?? ''))
        : conn.cardUpdateUrl
    }

    return {
      kind,
      customerEmail,
      customerName,
      customerId,
      subscriptionId,
      invoiceId: lastTxn?.id ?? subscriptionId,
      amount,
      currency,
      declineCode,
      updateCardUrl,
    }
  },
}
