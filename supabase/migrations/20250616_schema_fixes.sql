-- ============================================================
-- Schema fixes identified in audit 2025-06-16
-- ============================================================

-- 1. Add missing stripe_accounts columns used in application code
--    (webhook handler, follow-up cron, winback cron, cancel flow)
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS webhook_secret TEXT,
  ADD COLUMN IF NOT EXISTS slack_webhook_url TEXT,
  ADD COLUMN IF NOT EXISTS outbound_webhook_url TEXT,
  ADD COLUMN IF NOT EXISTS email_custom_note TEXT,
  ADD COLUMN IF NOT EXISTS email_timing_days TEXT,          -- JSON array of integers
  ADD COLUMN IF NOT EXISTS smtp_host TEXT,
  ADD COLUMN IF NOT EXISTS smtp_port INTEGER,
  ADD COLUMN IF NOT EXISTS smtp_user TEXT,
  ADD COLUMN IF NOT EXISTS smtp_password TEXT,
  ADD COLUMN IF NOT EXISTS smtp_from_email TEXT,
  ADD COLUMN IF NOT EXISTS smtp_from_name TEXT,
  ADD COLUMN IF NOT EXISTS cancel_flow_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cancel_flow_discount_code TEXT,
  ADD COLUMN IF NOT EXISTS cancel_flow_pause_months INTEGER DEFAULT 1;

-- 2. Create email_blacklist table (used by unsubscribe route + all crons)
CREATE TABLE IF NOT EXISTS email_blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, email)
);

ALTER TABLE email_blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own blacklist"
  ON email_blacklist FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS email_blacklist_lookup_idx ON email_blacklist (user_id, email);

-- 3. Make email_logs.failed_payment_id nullable so winback cron can insert rows
--    without a failed_payment reference (winback emails aren't tied to a payment)
ALTER TABLE email_logs
  ALTER COLUMN failed_payment_id DROP NOT NULL;

-- 4. Extend failed_payments status CHECK constraint to include all values used in code
--    ('max_emails_reached' written by follow-up cron, 'cancelled' used by analytics + code)
ALTER TABLE failed_payments
  DROP CONSTRAINT IF EXISTS failed_payments_status_check;

ALTER TABLE failed_payments
  ADD CONSTRAINT failed_payments_status_check
  CHECK (status IN ('pending', 'email_sent', 'recovered', 'failed', 'max_emails_reached', 'cancelled'));

-- 5. Add RLS + FK to cancel_events (currently has no FK or RLS)
ALTER TABLE cancel_events
  ADD COLUMN IF NOT EXISTS merchant_user_id_fk UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill FK column from existing rows (if merchant_user_id is already a valid auth.users UUID)
UPDATE cancel_events SET merchant_user_id_fk = merchant_user_id WHERE merchant_user_id_fk IS NULL;

ALTER TABLE cancel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants manage their own cancel events"
  ON cancel_events FOR ALL
  USING (auth.uid() = merchant_user_id)
  WITH CHECK (auth.uid() = merchant_user_id);
