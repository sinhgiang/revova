-- ============================================================
-- Email deliverability tracking (bounce/complaint) + GDPR support.
-- ============================================================

-- Track delivery outcomes per email so we can show bounce/spam rates and
-- auto-suppress bad addresses (protects sender reputation).
ALTER TABLE email_logs
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS complained_at TIMESTAMPTZ;

-- email_blacklist already exists; ensure a "reason" exists (it does). Hard
-- bounces and spam complaints get auto-added there by the Resend webhook.
