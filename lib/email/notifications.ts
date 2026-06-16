import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMerchantRecoveryNotification(params: {
  merchantEmail: string
  businessName: string
  customerEmail: string
  customerName: string | null
  amount: number
  currency: string
}) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: params.currency.toUpperCase(),
  }).format(params.amount / 100)

  const customerDisplay = params.customerName
    ? `${params.customerName} (${params.customerEmail})`
    : params.customerEmail

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:500px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#059669,#10b981);padding:28px 32px">
      <p style="margin:0;color:#ffffff;font-size:13px;font-weight:500;opacity:0.8">Revova · Payment Recovery</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700">💰 Payment Recovered</h1>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6">
        Great news! Revova successfully recovered a payment for <strong>${params.businessName}</strong>.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;font-weight:600">Amount recovered</p>
        <p style="margin:0;font-size:32px;font-weight:800;color:#065f46">${formatted}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr>
          <td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6">Customer</td>
          <td style="padding:8px 0;color:#111827;font-weight:500;text-align:right;border-bottom:1px solid #f3f4f6">${customerDisplay}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280">Recovered by</td>
          <td style="padding:8px 0;color:#111827;font-weight:500;text-align:right">Revova AI</td>
        </tr>
      </table>
      <div style="margin-top:28px;text-align:center">
        <a href="${appUrl}/dashboard" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px">
          View Dashboard →
        </a>
      </div>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">
        You're receiving this because you have merchant notifications enabled in <a href="${appUrl}/settings" style="color:#6366f1">Revova Settings</a>.
      </p>
    </div>
  </div>
</body>
</html>`

  try {
    await resend.emails.send({
      from: `Revova <${process.env.RESEND_FROM_EMAIL!}>`,
      to: params.merchantEmail,
      subject: `💰 ${formatted} recovered from ${params.customerName ?? params.customerEmail}`,
      html,
    })
  } catch (e) {
    console.error('[Merchant notification] Failed:', e)
  }
}
