-- ============================================================
-- Feature pack: SMS recovery, Pre-Dunning, LTV cancel segmentation,
-- adaptive recovery window. Migration date 2025-06-17.
-- ============================================================

-- 1. SMS recovery (Twilio) + pre-dunning + recovery window on stripe_accounts
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS twilio_account_sid TEXT,
  ADD COLUMN IF NOT EXISTS twilio_auth_token TEXT,
  ADD COLUMN IF NOT EXISTS twilio_from_number TEXT,
  ADD COLUMN IF NOT EXISTS predunning_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS recovery_window_days INTEGER DEFAULT 30;

-- 2. Customer phone + SMS-sent flag on failed_payments
ALTER TABLE failed_payments
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS sms_sent BOOLEAN DEFAULT false;

-- 3. LTV + segment captured at cancel time
ALTER TABLE cancel_events
  ADD COLUMN IF NOT EXISTS ltv_cents INTEGER,
  ADD COLUMN IF NOT EXISTS segment TEXT;

-- 4. Expiring cards tracked by the pre-dunning cron, surfaced in the
--    "Customers In Danger" dashboard panel.
CREATE TABLE IF NOT EXISTS expiring_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  stripe_customer_id TEXT NOT NULL,
  last4 TEXT,
  exp_month INTEGER NOT NULL,
  exp_year INTEGER NOT NULL,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, stripe_customer_id)
);

ALTER TABLE expiring_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own expiring cards" ON expiring_cards;
CREATE POLICY "Users manage their own expiring cards"
  ON expiring_cards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS expiring_cards_user_idx ON expiring_cards (user_id, exp_year, exp_month);
