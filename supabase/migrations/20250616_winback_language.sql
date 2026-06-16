-- Add language and winback columns to stripe_accounts
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS email_language VARCHAR(5) DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS winback_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS winback_discount_code TEXT,
  ADD COLUMN IF NOT EXISTS weekly_summary_enabled BOOLEAN DEFAULT true;

-- Winback contacts table: customers who cancelled, enrolled in re-engagement sequence
CREATE TABLE IF NOT EXISTS winback_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  cancelled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active', -- active | max_emails | reactivated | unsubscribed
  emails_sent INT NOT NULL DEFAULT 0,
  last_email_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, customer_email)
);

-- RLS: merchants can only see their own winback contacts
ALTER TABLE winback_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own winback contacts"
  ON winback_contacts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for the daily cron query
CREATE INDEX IF NOT EXISTS winback_contacts_status_idx ON winback_contacts (status, emails_sent);
CREATE INDEX IF NOT EXISTS winback_contacts_user_id_idx ON winback_contacts (user_id);
