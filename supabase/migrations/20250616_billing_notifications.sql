-- Add merchant notification toggle to stripe_accounts
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS notify_on_recovery BOOLEAN DEFAULT true;

-- Add Stripe billing columns to subscriptions (for Revova's own billing)
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Default all existing stripe_accounts to have notifications enabled
UPDATE stripe_accounts SET notify_on_recovery = true WHERE notify_on_recovery IS NULL;
