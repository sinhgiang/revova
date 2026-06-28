-- ============================================================
-- Multi payment-processor support. Isolated from the Stripe flow:
-- the existing stripe_accounts table keeps holding merchant SETTINGS
-- (business name, email config, cancel flow). Processor CREDENTIALS
-- live in their own table so each processor is fully independent.
-- ============================================================

CREATE TABLE IF NOT EXISTS payment_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  processor TEXT NOT NULL,            -- 'paddle' | 'chargebee' | 'recurly' | 'braintree'
  api_key TEXT,                       -- main API key / token
  api_secret TEXT,                    -- secondary secret where needed (e.g. Braintree private key)
  webhook_secret TEXT,               -- signing secret for verifying inbound webhooks
  site TEXT,                          -- processor-specific: Chargebee site, Recurly subdomain, Braintree merchant id
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, processor)
);

ALTER TABLE payment_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own payment connections" ON payment_connections;
CREATE POLICY "Users manage own payment connections"
  ON payment_connections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tag each failed payment with the processor it came from, plus a stored
-- card-update URL (non-Stripe processors give us the URL up front so the
-- follow-up cron never has to call Stripe for them).
ALTER TABLE failed_payments
  ADD COLUMN IF NOT EXISTS processor TEXT DEFAULT 'stripe',
  ADD COLUMN IF NOT EXISTS update_card_url TEXT;

ALTER TABLE winback_contacts
  ADD COLUMN IF NOT EXISTS processor TEXT DEFAULT 'stripe';
