-- Telegram notifications: each merchant connects their own Telegram bot so they
-- get instant alerts (like Slack) when a failed payment is recovered.
ALTER TABLE stripe_accounts
  ADD COLUMN IF NOT EXISTS telegram_bot_token TEXT,
  ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;
