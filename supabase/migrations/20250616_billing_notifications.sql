-- Add merchant notification toggle to stripe_accounts
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS notify_on_recovery BOOLEAN DEFAULT true;

UPDATE stripe_accounts
  SET notify_on_recovery = true
  WHERE notify_on_recovery IS NULL;

-- Create subscriptions table (for Revova's own Pro billing)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  plan_id TEXT NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own subscription"
  ON subscriptions FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
