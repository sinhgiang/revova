import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRecoveryEmail(params: {
  to: string
  subject: string
  body: string
  previewText: string
  updateCardUrl: string
  businessName: string
}) {
  const htmlBody = params.body
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6">${line}</p>`)
    .join('')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">${params.businessName}</h1>
    </div>
    <div style="padding:40px">
      ${htmlBody}
      <div style="margin-top:32px;text-align:center">
        <a href="${params.updateCardUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">
          Update Payment Method
        </a>
      </div>
    </div>
    <div style="padding:24px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">Powered by Revova · <a href="https://revova.io" style="color:#6366f1">revova.io</a></p>
    </div>
  </div>
</body>
</html>`

  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: params.to,
    subject: params.subject,
    html,
  })

  console.log('[Resend] Response:', JSON.stringify(result))

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? JSON.stringify(result.error)}`)
  }

  return result
}
