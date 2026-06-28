/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAdapter } from '@/lib/processors'
import type { ProcessorConnection, ProcessorId } from '@/lib/processors/types'
import {
  enrollFailedPayment,
  handleProcessorRecovered,
  handleProcessorCancelled,
} from '@/lib/recovery/enroll'

// Unified inbound webhook for every NON-Stripe processor. Stripe keeps its own
// route (app/api/webhook/[userId]) untouched. Each processor is verified and
// parsed by its own adapter, then handed to the shared recovery core.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ processor: string; userId: string }> }
) {
  const { processor, userId } = await params
  const rawBody = await request.text()

  const adapter = getAdapter(processor)
  if (!adapter) {
    return NextResponse.json({ error: `Processor '${processor}' not supported yet` }, { status: 501 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any

  // Processor credentials live in their own isolated table
  const { data: connRow } = await db
    .from('payment_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('processor', processor)
    .maybeSingle()

  if (!connRow) {
    return NextResponse.json({ error: 'No connection for this processor' }, { status: 404 })
  }

  const conn: ProcessorConnection = {
    processor: processor as ProcessorId,
    apiKey: connRow.api_key ?? null,
    apiSecret: connRow.api_secret ?? null,
    webhookSecret: connRow.webhook_secret ?? null,
    site: connRow.site ?? null,
    cardUpdateUrl: connRow.card_update_url ?? null,
  }

  // Verify signature + normalize the event (adapter handles all processor quirks)
  let ev
  try {
    ev = await adapter.verifyAndParse(rawBody, request.headers, conn)
  } catch (e) {
    console.error(`[${processor}] adapter error:`, e)
    return NextResponse.json({ error: 'Adapter error' }, { status: 400 })
  }
  if (!ev) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  if (ev.kind === 'ignored') {
    return NextResponse.json({ received: true })
  }

  // Merchant settings (business name, email config, blacklist, etc.) live in the
  // shared account table, keyed by user — same for every processor.
  const { data: account } = await db
    .from('stripe_accounts')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!account) {
    return NextResponse.json({ error: 'Account not configured' }, { status: 404 })
  }

  try {
    if (ev.kind === 'payment_failed') {
      await enrollFailedPayment(db, userId, processor as ProcessorId, account, ev)
    } else if (ev.kind === 'payment_succeeded') {
      await handleProcessorRecovered(db, userId, account, ev)
    } else if (ev.kind === 'subscription_cancelled') {
      await handleProcessorCancelled(db, userId, processor as ProcessorId, account, ev)
    }
  } catch (e) {
    console.error(`[${processor}] handler error:`, e)
    // Still return 200 so the processor doesn't hammer retries on a transient error
  }

  return NextResponse.json({ received: true })
}
