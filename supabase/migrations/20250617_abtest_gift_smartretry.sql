-- ============================================================
-- Feature pack 2: A/B testing, gift offer (1-month-free),
-- smart retry timing. Migration date 2025-06-17 (second batch).
-- ============================================================

-- 1. New per-merchant toggles on stripe_accounts
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS smart_retry_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cancel_flow_gift_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cancel_flow_ab_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cancel_flow_discount_code_b TEXT;

-- 2. A/B variant captured at cancel time (which discount variant was shown)
ALTER TABLE cancel_events
  ADD COLUMN IF NOT EXISTS variant TEXT;

-- 3. A/B variant captured per email (which subject style was used)
ALTER TABLE email_logs
  ADD COLUMN IF NOT EXISTS variant TEXT;
