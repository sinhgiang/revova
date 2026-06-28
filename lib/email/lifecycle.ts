import { Resend } from 'resend'
import { ADMIN_EMAIL } from '@/lib/admin'

const resend = new Resend(process.env.RESEND_API_KEY)
const APP = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'

async function send(to: string, subject: string, html: string) {
  try {
    const from = process.env.RESEND_FROM_EMAIL
    if (!from) throw new Error('RESEND_FROM_EMAIL not configured')
    await resend.emails.send({ from: `Revova <${from}>`, to, subject, html })
  } catch (e) {
    console.error('[Lifecycle email] Failed:', e)
  }
}

function shell(headerColor: string, badge: string, title: string, body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <div style="background:${headerColor};padding:28px 32px">
      <p style="margin:0;color:#fff;font-size:13px;font-weight:500;opacity:0.8">Revova</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:24px;font-weight:700">${badge} ${title}</h1>
    </div>
    <div style="padding:32px;color:#374151;font-size:15px;line-height:1.6">${body}</div>
    <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">Revova · AI Payment Recovery · <a href="${APP}" style="color:#6366f1">revova.io</a></p>
    </div>
  </div>
</body></html>`
}

const button = (href: string, label: string) =>
  `<div style="margin-top:24px;text-align:center"><a href="${href}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px">${label}</a></div>`

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

// ── 1. Welcome the merchant when their 14-day trial begins ──
export async function sendWelcomeEmail(merchantEmail: string, businessName: string | null) {
  const name = businessName ?? 'there'
  const body = `
    <p style="margin:0 0 16px">Welcome to Revova, ${name}! 🎉 Your <strong>14-day free trial</strong> is now active.</p>
    <p style="margin:0 0 16px">Revova is now watching for failed payments. When a customer's card fails, we'll automatically send AI-written recovery emails to win that revenue back — on autopilot.</p>
    <div style="background:#eef2ff;border:1px solid #e0e7ff;border-radius:10px;padding:16px 20px;margin:0 0 8px">
      <p style="margin:0 0 8px;font-weight:600;color:#3730a3">Get the most out of your trial:</p>
      <p style="margin:0;color:#4338ca;font-size:14px">✓ Connect your payment processor &nbsp; ✓ Customize your recovery emails &nbsp; ✓ Turn on Slack/Telegram alerts</p>
    </div>
    ${button(`${APP}/dashboard`, 'Open your dashboard →')}
    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">Questions? Just reply to this email — a real human reads them.</p>`
  await send(merchantEmail, 'Welcome to Revova — your 14-day trial is live 🎉', shell('linear-gradient(135deg,#6366f1,#8b5cf6)', '👋', 'Welcome to Revova', body))
}

// ── 2. Alert the founder when a new merchant starts a trial ──
export async function sendNewSignupAdminAlert(merchantEmail: string, businessName: string | null) {
  const body = `
    <p style="margin:0 0 16px">A new merchant just started a <strong>14-day free trial</strong>. 🚀</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6">Business</td><td style="padding:8px 0;color:#111827;font-weight:500;text-align:right;border-bottom:1px solid #f3f4f6">${businessName ?? '—'}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0;color:#111827;font-weight:500;text-align:right">${merchantEmail}</td></tr>
    </table>
    <p style="margin:20px 0 0;font-size:14px;color:#6b7280">Consider sending them a personal welcome — early customers love it.</p>`
  await send(ADMIN_EMAIL, `🚀 New trial: ${businessName ?? merchantEmail}`, shell('linear-gradient(135deg,#0ea5e9,#6366f1)', '🚀', 'New trial started', body))
}

// ── 3. Thank the merchant when they upgrade to a paid plan ──
export async function sendPurchaseThankYou(merchantEmail: string, planName: string, periodEndISO: string | null) {
  const start = fmtDate(new Date().toISOString())
  const end = fmtDate(periodEndISO)
  const body = `
    <p style="margin:0 0 16px">Thank you for upgrading to <strong>Revova ${planName}</strong>! 🙏 Your subscription is now active.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin:0 0 16px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#6b7280">Plan</td><td style="padding:6px 0;color:#065f46;font-weight:700;text-align:right">${planName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Billing period starts</td><td style="padding:6px 0;color:#111827;font-weight:500;text-align:right">${start}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Renews / ends</td><td style="padding:6px 0;color:#111827;font-weight:500;text-align:right">${end}</td></tr>
      </table>
    </div>
    <p style="margin:0 0 8px">All your ${planName} features are unlocked and ready to recover more revenue.</p>
    ${button(`${APP}/dashboard`, 'Go to dashboard →')}
    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">A tax invoice from our payment provider (Polar) will arrive separately. Manage billing anytime in your dashboard.</p>`
  await send(merchantEmail, `Thank you! You're on Revova ${planName} 🎉`, shell('linear-gradient(135deg,#059669,#10b981)', '🎉', `Welcome to ${planName}`, body))
}

// ── 4. Alert the founder when a merchant upgrades (a sale!) ──
export async function sendPurchaseAdminAlert(merchantEmail: string, planName: string, businessName: string | null) {
  const body = `
    <p style="margin:0 0 16px"><strong>Cha-ching! 💸</strong> A merchant just upgraded to a paid plan.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6">Plan</td><td style="padding:8px 0;color:#065f46;font-weight:700;text-align:right;border-bottom:1px solid #f3f4f6">${planName}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;border-bottom:1px solid #f3f4f6">Business</td><td style="padding:8px 0;color:#111827;font-weight:500;text-align:right;border-bottom:1px solid #f3f4f6">${businessName ?? '—'}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0;color:#111827;font-weight:500;text-align:right">${merchantEmail}</td></tr>
    </table>`
  await send(ADMIN_EMAIL, `💸 New sale: ${planName} — ${businessName ?? merchantEmail}`, shell('linear-gradient(135deg,#059669,#10b981)', '💸', 'New paying customer!', body))
}
