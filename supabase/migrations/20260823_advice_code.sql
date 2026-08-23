-- Stripe's outcome.advice_code ('do_not_try_again' | 'try_again_later' |
-- 'confirm_card_data') is a purpose-built "should this be retried" signal,
-- distinct from decline_code (which only explains WHY the issuer declined
-- it). Capturing it lets the auto-retry cron defer to Stripe's own retry
-- guidance instead of inferring retry eligibility from decline_code alone —
-- see RETRYABLE_CODES in app/api/cron/follow-up/route.ts.
--
-- Nullable: older rows (webhooks received before this migration) and charges
-- Stripe didn't attach network advice to simply have no value here.
ALTER TABLE public.failed_payments
  ADD COLUMN IF NOT EXISTS advice_code TEXT;
