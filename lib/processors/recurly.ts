import crypto from 'crypto'
import type { ProcessorAdapter, ProcessorConnection, NormalizedEvent } from './types'

// Recurly adapter.
//  - Webhooks are XML push notifications whose ROOT element is the event name,
//    e.g. <failed_payment_notification>, <successful_payment_notification>,
//    <canceled_subscription_notification>.
//  - Security: Recurly supports HTTP Basic Auth on the endpoint. We verify it
//    against the stored "user:pass" (webhook_secret); if none, we trust the URL.
//  - Card update: Recurly's hosted account page needs a login token that isn't
//    in the webhook, so the merchant supplies their own portal URL (supports
//    {account} and {id} placeholders).

function checkBasicAuth(headers: Headers, webhookSecret: string | null): boolean {
  if (!webhookSecret) return true
  const auth = headers.get('authorization') ?? ''
  const expected = 'Basic ' + Buffer.from(webhookSecret).toString('base64')
  try {
    return crypto.timingSafeEqual(Buffer.from(auth), Buffer.from(expected))
  } catch {
    return false
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
}

// First inner text of a tag (attributes on the open tag are allowed)
function tag(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
  return m ? decodeEntities(m[1]) : null
}

// Inner XML of a container element
function block(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
  return m ? m[1] : null
}

export const recurlyAdapter: ProcessorAdapter = {
  id: 'recurly',

  async verifyAndParse(rawBody, headers, conn: ProcessorConnection): Promise<NormalizedEvent | null> {
    if (!checkBasicAuth(headers, conn.webhookSecret)) return null
    if (!rawBody || !rawBody.includes('<')) return null

    // The root element name is the notification type
    const rootMatch = rawBody.match(/<\s*([a-z_]+_notification)\s*>/i)
    const root = rootMatch ? rootMatch[1].toLowerCase() : ''

    let kind: NormalizedEvent['kind'] = 'ignored'
    if (root === 'failed_payment_notification') kind = 'payment_failed'
    else if (root === 'successful_payment_notification') kind = 'payment_succeeded'
    else if (root === 'canceled_subscription_notification') kind = 'subscription_cancelled'
    if (kind === 'ignored') return { kind: 'ignored' }

    const accountXml = block(rawBody, 'account') ?? ''
    const txnXml = block(rawBody, 'transaction') ?? ''
    const subXml = block(rawBody, 'subscription') ?? ''

    const customerEmail = tag(accountXml, 'email')
    const name = `${tag(accountXml, 'first_name') ?? ''} ${tag(accountXml, 'last_name') ?? ''}`.trim()
    const customerName = name || null
    const accountCode = tag(accountXml, 'account_code')

    // amount_in_cents is already in minor units
    const cents = tag(txnXml, 'amount_in_cents')
    const amount = cents != null ? parseInt(cents, 10) : undefined
    const currency = tag(txnXml, 'currency') ?? undefined
    const declineCode = tag(txnXml, 'status') ?? null

    // Best id for matching a later recovery: invoice id, else subscription uuid
    const invoiceId =
      tag(txnXml, 'invoice_id') ?? tag(subXml, 'uuid') ?? tag(txnXml, 'id') ?? accountCode
    const subscriptionId = tag(subXml, 'uuid')

    // Card-update URL from the merchant's portal template
    let updateCardUrl: string | null = conn.cardUpdateUrl ?? null
    if (updateCardUrl) {
      updateCardUrl = updateCardUrl
        .replace('{account}', encodeURIComponent(accountCode ?? ''))
        .replace('{id}', encodeURIComponent(subscriptionId ?? invoiceId ?? ''))
    }

    return {
      kind,
      customerEmail,
      customerName,
      customerId: accountCode,
      subscriptionId,
      invoiceId,
      amount,
      currency,
      declineCode,
      updateCardUrl,
    }
  },
}
