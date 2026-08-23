-- failed_payments.retry_attempts only stores a running COUNT — it can't answer
-- "does attempt 3 recover more often than attempt 1?" or "is the payday
-- effect specific to insufficient_funds, or does every decline code show it
-- equally?" (the stratification / placebo-test check raised via
-- github.com/IvanSFlowGit/advice-code-check). This table logs one row per
-- retry attempt so that can actually be measured over time instead of
-- asserted.
--
-- Note: since payday-windowed timing became the default (see
-- 20260821_retry_attempt_cap.sql / isPaydayWindow in
-- app/api/cron/follow-up/route.ts), every attempt now happens inside a payday
-- window — there is no "non-payday" attempt left to compare against. day_of_month
-- lets the admin report at least compare *where within* the window (early
-- month vs mid-month vs end-of-month) recovery rate differs by decline_code,
-- which is what remains available as a within-window signal.
CREATE TABLE IF NOT EXISTS public.retry_attempt_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  failed_payment_id UUID REFERENCES public.failed_payments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  attempt_number INTEGER NOT NULL,
  decline_code TEXT,
  advice_code TEXT,
  day_of_month INTEGER NOT NULL,
  succeeded BOOLEAN NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS retry_attempt_log_payment_idx ON public.retry_attempt_log(failed_payment_id);
CREATE INDEX IF NOT EXISTS retry_attempt_log_decline_idx ON public.retry_attempt_log(decline_code, attempt_number);
