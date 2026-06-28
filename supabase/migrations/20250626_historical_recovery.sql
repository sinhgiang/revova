-- Historical recovery: re-engage customers whose payments failed in the past
-- (winback-style drip, throttled to protect deliverability).
CREATE TABLE IF NOT EXISTS historical_recovery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  failed_at TIMESTAMPTZ,
  emails_sent INT DEFAULT 0,
  last_email_at TIMESTAMPTZ,
  status TEXT DEFAULT 'queued',   -- queued | active | done | unsubscribed
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, customer_email)
);

CREATE INDEX IF NOT EXISTS idx_histrec_user_status ON historical_recovery (user_id, status);

ALTER TABLE historical_recovery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own historical recovery"
  ON historical_recovery FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Per-merchant campaign settings
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS historical_throttle INT DEFAULT 40,
  ADD COLUMN IF NOT EXISTS historical_discount TEXT;
