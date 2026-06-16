import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { buildUnsubscribeUrl } from '@/lib/email/unsubscribe'

export const resend = new Resend(process.env.RESEND_API_KEY)

export interface SmtpConfig {
  host: string
  port: number
  user: string
  password: string
  fromEmail: string
  fromName: string
}

export interface TrackingParams {
  userId: string
  recipientEmail: string
  sequence: number
}

export async function sendRecoveryEmail(params: {
  to: string
  subject: string
  body: string
  previewText: string
  updateCardUrl: string
  businessName: string
  smtp?: SmtpConfig | null
  tracking?: TrackingParams | null
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

  // Build click-tracked URL
  let ctaUrl = params.updateCardUrl
  if (params.tracking) {
    const { userId, recipientEmail, sequence } = params.tracking
    ctaUrl = `${appUrl}/api/track/click?u=${encodeURIComponent(userId)}&e=${encodeURIComponent(recipientEmail)}&s=${sequence}&target=${encodeURIComponent(params.updateCardUrl)}`
  }

  const htmlBody = params.body
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6">${line}</p>`)
    .join('')

  // Tracking pixel (1x1 transparent GIF)
  const trackingPixel = params.tracking
    ? `<img src="${appUrl}/api/track/open?u=${encodeURIComponent(params.tracking.userId)}&e=${encodeURIComponent(params.tracking.recipientEmail)}&s=${params.tracking.sequence}" width="1" height="1" style="display:none" alt="" />`
    : ''

  const unsubscribeUrl = params.tracking
    ? buildUnsubscribeUrl(params.tracking.userId, params.tracking.recipientEmail)
    : null

  const plainText = params.body + `\n\nUpdate your payment details here:\n${params.updateCardUrl}\n\n---\nThis is a billing notification from ${params.businessName}. If you have questions, reply to this email.${unsubscribeUrl ? `\n\nTo stop receiving these emails: ${unsubscribeUrl}` : ''}`

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
        <a href="${ctaUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">
          Update Payment Details
        </a>
      </div>
    </div>
    <div style="padding:24px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px">
        This is a billing notification for your ${params.businessName} subscription.
      </p>
      ${unsubscribeUrl
        ? `<p style="margin:0;color:#9ca3af;font-size:12px">Don't want these emails? <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline">Unsubscribe</a></p>`
        : `<p style="margin:0;color:#9ca3af;font-size:12px">If you have questions, reply to this email.</p>`}
    </div>
  </div>
  ${trackingPixel}
</body>
</html>`

  // Use custom SMTP if configured
  if (params.smtp) {
    const { host, port, user, password, fromEmail, fromName } = params.smtp
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
    })
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: params.to,
      subject: params.subject,
      html,
      text: plainText,
    })
    console.log('[SMTP] Sent via custom SMTP to', params.to)
    return
  }

  // Default: use Resend
  const fromName = `${params.businessName} Billing`
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!fromEmail) throw new Error('RESEND_FROM_EMAIL env var is not configured')
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

// Separate winback email sender — uses re-engagement CTA + footer, not payment-recovery copy
export async function sendWinbackEmail(params: {
  to: string
  subject: string
  body: string
  previewText: string
  reactivateUrl: string
  businessName: string
  smtp?: SmtpConfig | null
  tracking?: TrackingParams | null
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

  let ctaUrl = params.reactivateUrl
  if (params.tracking) {
    const { userId, recipientEmail, sequence } = params.tracking
    ctaUrl = `${appUrl}/api/track/click?u=${encodeURIComponent(userId)}&e=${encodeURIComponent(recipientEmail)}&s=${sequence}&target=${encodeURIComponent(params.reactivateUrl)}`
  }

  const htmlBody = params.body
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6">${line}</p>`)
    .join('')

  const trackingPixel = params.tracking
    ? `<img src="${appUrl}/api/track/open?u=${encodeURIComponent(params.tracking.userId)}&e=${encodeURIComponent(params.tracking.recipientEmail)}&s=${params.tracking.sequence}" width="1" height="1" style="display:none" alt="" />`
    : ''

  const unsubscribeUrl = params.tracking
    ? buildUnsubscribeUrl(params.tracking.userId, params.tracking.recipientEmail)
    : null

  const plainText = params.body + `\n\nReactivate your subscription:\n${params.reactivateUrl}\n\n---\nYou're receiving this because you recently cancelled your ${params.businessName} subscription.${unsubscribeUrl ? `\n\nTo stop receiving these emails: ${unsubscribeUrl}` : ''}`

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
        <a href="${ctaUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">
          Come Back to ${params.businessName}
        </a>
      </div>
    </div>
    <div style="padding:24px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px">
        You're receiving this because you recently cancelled your ${params.businessName} subscription.
      </p>
      ${unsubscribeUrl
        ? `<p style="margin:0;color:#9ca3af;font-size:12px">Don't want these emails? <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline">Unsubscribe</a></p>`
        : `<p style="margin:0;color:#9ca3af;font-size:12px">If you have questions, reply to this email.</p>`}
    </div>
  </div>
  ${trackingPixel}
</body>
</html>`

  if (params.smtp) {
    const { host, port, user, password, fromEmail, fromName } = params.smtp
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
    })
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: params.to,
      subject: params.subject,
      html,
      text: plainText,
    })
    console.log('[SMTP] Winback sent via custom SMTP to', params.to)
    return
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!fromEmail) throw new Error('RESEND_FROM_EMAIL env var is not configured')
  const from = `${params.businessName} <${fromEmail}>`

  const result = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html,
    text: plainText,
  })

  console.log('[Resend] Winback response:', JSON.stringify(result))

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? JSON.stringify(result.error)}`)
  }

  return result
}
