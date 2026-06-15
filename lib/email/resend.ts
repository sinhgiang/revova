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

  // Plain text version — improves deliverability significantly
  const plainText = params.body + `\n\nUpdate your payment details here:\n${params.updateCardUrl}\n\n---\nThis is a billing notification from ${params.businessName}. If you have questions, reply to this email.`

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${params.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="display:none;max-height:0;overflow:hidden;color:transparent">${params.previewText}</div>
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700">${params.businessName}</h1>
    </div>
    <div style="padding:40px">
      ${htmlBody}
      <div style="margin-top:32px;text-align:center">
        <a href="${params.updateCardUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">
          Update Payment Details
        </a>
      </div>
    </div>
    <div style="padding:24px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px">
        This is a billing notification for your ${params.businessName} subscription.
      </p>
      <p style="margin:0;color:#9ca3af;font-size:12px">
        If you no longer have an account, please reply to this email and we will remove you immediately.
      </p>
    </div>
  </div>
</body>
</html>`

  const fromName = `${params.businessName} Billing`
  const fromEmail = process.env.RESEND_FROM_EMAIL!
  const from = `${fromName} <${fromEmail}>`

  const result = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html,
    text: plainText,
  })

  console.log('[Resend] Response:', JSON.stringify(result))

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? JSON.stringify(result.error)}`)
  }

  return result
}
