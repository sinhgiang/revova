-- Optional holdout flag on failed_payments.
--
-- Leaving a small, random control group on the processor's own retries lets the
-- Analytics page measure Revova's INCREMENTAL recovery lift (treatment vs
-- control) instead of only the gross amount recovered — because some failed
-- charges would recover on their own via Smart Retries anyway.
--
-- Off by default: rows are only marked holdout when REVOVA_HOLDOUT_PCT is set
-- (e.g. 10 = hold back ~10%). Safe to run once; idempotent.
ALTER TABLE public.failed_payments
  ADD COLUMN IF NOT EXISTS holdout boolean NOT NULL DEFAULT false;
