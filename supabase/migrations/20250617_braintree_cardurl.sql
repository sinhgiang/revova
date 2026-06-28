-- Braintree (and any processor without a hosted card-update page) lets the
-- merchant supply their own billing/portal URL where customers fix their card.
ALTER TABLE payment_connections
  ADD COLUMN IF NOT EXISTS card_update_url TEXT;
