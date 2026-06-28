// Shared contract every payment-processor adapter implements. The recovery core
// only ever sees this normalized shape — it never knows or cares which processor
// produced the event. Add a new processor by writing one adapter; nothing else
// in the codebase changes.

export type ProcessorId = 'stripe' | 'paddle' | 'chargebee' | 'recurly' | 'braintree'

export interface ProcessorConnection {
  processor: ProcessorId
  apiKey: string | null
  apiSecret: string | null
  webhookSecret: string | null
  site: string | null
  cardUpdateUrl: string | null
}

export type NormalizedKind =
  | 'payment_failed'
  | 'payment_succeeded'
  | 'subscription_cancelled'
  | 'ignored'

export interface NormalizedEvent {
  kind: NormalizedKind
  // Identity
  customerEmail?: string | null
  customerName?: string | null
  customerPhone?: string | null
  customerId?: string | null
  subscriptionId?: string | null
  invoiceId?: string | null
  // Money (amount in the currency's smallest unit, e.g. cents)
  amount?: number
  currency?: string
  declineCode?: string | null
  // Where the customer goes to fix their card. Non-Stripe processors hand us
  // this up front so we can store it and reuse it across the whole sequence.
  updateCardUrl?: string | null
}

export interface ProcessorAdapter {
  id: ProcessorId
  // Verify the webhook signature and turn the raw body into a normalized event.
  // Return { kind: 'ignored' } for events we don't act on, or null if the
  // signature is invalid / the body can't be trusted.
  verifyAndParse(
    rawBody: string,
    headers: Headers,
    conn: ProcessorConnection
  ): Promise<NormalizedEvent | null>
}
