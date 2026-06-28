-- Records every change an admin makes to a merchant's account (for accountability
-- and dispute history). Only the service-role (admin tools) ever touches this.
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  merchant_user_id TEXT NOT NULL,
  merchant_name TEXT,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_merchant ON admin_audit_log (merchant_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_log (created_at DESC);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
-- No policies: regular users get zero access; service-role bypasses RLS.
