-- Cancel events: track why customers cancel and what offer (if any) saved them
-- This gives merchants insight into churn reasons over time
CREATE TABLE IF NOT EXISTS cancel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_user_id UUID NOT NULL,
  subscription_id TEXT,
  reason TEXT, -- too_expensive | not_using | missing_features | technical | switching
  action_taken TEXT, -- paused | discounted | cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cancel_events_merchant_idx ON cancel_events (merchant_user_id, created_at DESC);
