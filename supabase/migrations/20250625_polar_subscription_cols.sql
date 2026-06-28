-- The Polar billing webhook (app/api/polar/webhook) upserts these columns when a
-- customer subscribes. Without them the subscription record fails to save, so
-- Pro features never unlock after payment.
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS polar_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
