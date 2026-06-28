import crypto from 'crypto'
import type { ProcessorAdapter, ProcessorConnection, NormalizedEvent } from './types'

// Chargebee adapter.
//  - Webhooks are JSON: { event_type, content: { invoice, customer, subscription, transaction } }
//  - Security: Chargebee signs nothing; instead you set HTTP Basic Auth on the
//    webhook. We verify that against the stored "user:pass" (webhook_secret).
//    If none is configured we fall back to trusting the per-merchant URL (the
//    userId in the path is a 128-bit secret) — same model as the Stripe route.
//  - Card update: we generate a Chargebee "manage payment sources" hosted page
//    via the API, falling back to the merchant's own portal URL.

function checkBasicAuth(headers: Headers, webhookSecret: string | null): boolean {
  if (!webhookSecret) return true // no Basic Auth configured → trust the URL
  const auth = headers.get('authorization') ?? ''
  const expected = 'Basic ' + Buffer.from(webhookSecret).toString('base64')
  try {
    return crypto.timingSafeEqual(Buffer.from(auth), Buffer.from(expected))
  } catch {
    return false
  }
}

async function manageSourcesUrl(site: string, apiKey: string, customerId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://${site}.chargebee.com/api/v2/hosted_pages/manage_payment_sources`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${apiKey}:`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ 'customer[id]': customerId }).toString(),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.hosted_page?.url ?? null
  } catch {
    return null
  }
}

export const chargebeeAdapter: ProcessorAdapter = {
  id: 'chargebee',

  async verifyAndParse(rawBody, headers, conn: ProcessorConnection): Promise<NormalizedEvent | null> {
    if (!checkBasicAuth(headers, conn.webhookSecret)) return null

    let evt: any
    try { evt = JSON.parse(rawBody) } catch { return null }

    const type: string = evt?.event_type ?? ''
    let kind: NormalizedEvent['kind'] = 'ignored'
    if (type === 'payment_failed') kind = 'payment_failed'
    else if (type === 'payment_succeeded') kind = 'payment_succeeded'
    else if (type === 'subscription_cancelled' || type === 'subscription_canceled') kind = 'subscription_cancelled'
    if (kind === 'ignored') return { kind: 'ignored' }

    const c = evt?.content ?? {}
    const customer = c.customer ?? {}
    const invoice = c.invoice ?? {}
    const subscription = c.subscription ?? {}
    const transaction = c.transaction ?? {}

    const customerEmail: string | null = customer.email ?? null
    const name = `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
    const customerName = name || null
    const customerId: string | null = customer.id ?? null
    const subscriptionId: string | null = subscription.id ?? null
    const invoiceId: string | null = invoice.id ?? transaction.id ?? null

    // Chargebee amounts are integer minor units (cents)
    const amount =
      (typeof transaction.amount === 'number' ? transaction.amount : undefined) ??
      (typeof invoice.amount_due === 'number' ? invoice.amount_due : undefined) ??
      (typeof invoice.total === 'number' ? invoice.total : undefined)
    const currency: string | undefined =
      invoice.currency_code ?? subscription.currency_code ?? customer.preferred_currency_code ?? undefined
    const declineCode: string | null = transaction.error_code ?? transaction.error_text ?? null

    // Card-update URL: generate a hosted page if we have API access, else the
    // merchant's portal URL (supporting {id}/{account} placeholders like Recurly).
    let updateCardUrl: string | null = conn.cardUpdateUrl
      ? conn.cardUpdateUrl
          .replace('{id}', encodeURIComponent(subscriptionId ?? invoiceId ?? ''))
          .replace('{account}', encodeURIComponent(customerId ?? ''))
      : null
    if (kind === 'payment_failed' && conn.site && conn.apiKey && customerId) {
      const hosted = await manageSourcesUrl(conn.site, conn.apiKey, customerId)
      if (hosted) updateCardUrl = hosted
    }

    return {
      kind,
      customerEmail,
      customerName,
      customerId,
      subscriptionId,
      invoiceId,
      amount,
      currency,
      declineCode,
      updateCardUrl,
    }
  },
}
