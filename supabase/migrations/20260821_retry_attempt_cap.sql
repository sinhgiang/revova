-- Hard cap on automated charge-retry attempts, independent of
-- recovery_window_days or smart_retry_enabled. Card networks bound how many
-- times a merchant may reattempt a declined charge — Stripe's own guidance is
-- ~8 attempts; Visa's documented limit is 15 within a rolling 30 days (with a
-- fee starting on the 16th, and 0 permitted on hard-decline categories).
-- Without an explicit counter, the cron could retry once a day for the full
-- recovery window (up to 30+ days = ~30 attempts) regardless of what the
-- merchant picked, which risks exceeding those limits and getting the card —
-- or the merchant account — flagged by the issuer.
ALTER TABLE public.failed_payments
  ADD COLUMN IF NOT EXISTS retry_attempts INTEGER NOT NULL DEFAULT 0;
