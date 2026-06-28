import type { ProcessorAdapter, ProcessorId } from './types'
import { paddleAdapter } from './paddle'
import { braintreeAdapter } from './braintree'
import { chargebeeAdapter } from './chargebee'
import { recurlyAdapter } from './recurly'

// Registry of implemented processor adapters. Adding a new processor is a
// one-line change here plus its adapter file — nothing else in the app changes.
const ADAPTERS: Partial<Record<ProcessorId, ProcessorAdapter>> = {
  paddle: paddleAdapter,
  braintree: braintreeAdapter,
  chargebee: chargebeeAdapter,
  recurly: recurlyAdapter,
}

export function getAdapter(processor: string): ProcessorAdapter | null {
  return ADAPTERS[processor as ProcessorId] ?? null
}

// Processors a merchant can connect today (besides Stripe, which has its own flow).
export const SUPPORTED_PROCESSORS: { id: ProcessorId; name: string; status: 'live' | 'beta' | 'soon' }[] = [
  { id: 'paddle', name: 'Paddle', status: 'live' },
  { id: 'braintree', name: 'Braintree', status: 'live' },
  { id: 'chargebee', name: 'Chargebee', status: 'live' },
  { id: 'recurly', name: 'Recurly', status: 'live' },
]

export type { ProcessorAdapter } from './types'
