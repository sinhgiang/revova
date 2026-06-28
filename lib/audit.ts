/* eslint-disable @typescript-eslint/no-explicit-any */
// Records an admin action against a merchant account. Pass a service-role client.
export async function recordAudit(db: any, entry: {
  adminEmail: string
  merchantUserId: string
  merchantName?: string | null
  action: string
  details?: any
}) {
  try {
    await db.from('admin_audit_log').insert({
      admin_email: entry.adminEmail,
      merchant_user_id: entry.merchantUserId,
      merchant_name: entry.merchantName ?? null,
      action: entry.action,
      details: entry.details ?? null,
    })
  } catch (e) {
    console.error('[Audit] Failed to record:', e)
  }
}
