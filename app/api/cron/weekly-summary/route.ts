/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolvePlan } from '@/lib/plan'
import { isAuthorizedCron } from '@/lib/cron-auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()
  const db = supabase as any
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Get all merchant accounts with weekly summary enabled
  const { data: accounts } = await db
    .from('stripe_accounts')
    .select('*')
    .or('weekly_summary_enabled.eq.true,weekly_summary_enabled.is.null')

  let sent = 0

  for (const account of accounts ?? []) {
    const merchantEmail = account.email
    if (!merchantEmail) continue

    // Weekly digest is a Pro feature
    const { data: subRow } = await db.from('subscriptions').select('plan_id, status').eq('user_id', account.user_id).maybeSingle()
    if (!resolvePlan(account, subRow).isPro) continue

    // Query last 7 days stats for this merchant
    const { data: weekPayments } = await db
      .from('failed_payments')
      .select('*')
      .eq('user_id', account.user_id)
      .gte('created_at', weekAgo.toISOString())

    const { data: weekRecovered } = await db
      .from('failed_payments')
      .select('amount, currency')
      .eq('user_id', account.user_id)
      .eq('status', 'recovered')
      .gte('recovered_at', weekAgo.toISOString())

    const newFailures = (weekPayments ?? []).length
    const recoveredCount = (weekRecovered ?? []).length
    const currency = weekRecovered?.[0]?.currency ?? weekPayments?.[0]?.currency ?? 'usd'
    const totalRecoveredAmount = (weekRecovered ?? []).reduce((s: number, p: any) => s + p.amount, 0)

    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: currency.toUpperCase(),
    }).format(totalRecoveredAmount / 100)

    const rate = newFailures > 0 ? Math.round((recoveredCount / newFailures) * 100) : 0
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'
    const weekLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px 32px">
      <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Revova Weekly Summary</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700">${account.business_name ?? 'Your Business'} · Week of ${weekLabel}</h1>
    </div>
    <div style="padding:28px 32px">
      ${newFailures === 0 ? `
      <div style="text-align:center;padding:20px 0">
        <p style="font-size:36px;margin:0">🎉</p>
        <p style="color:#059669;font-weight:700;font-size:18px;margin:8px 0 4px">No failed payments this week!</p>
        <p style="color:#6b7280;font-size:14px;margin:0">Revova is watching. You're all clear.</p>
      </div>
      ` : `
      <div style="display:flex;gap:12px;margin-bottom:24px">
        <div style="flex:1;background:#f9fafb;border-radius:10px;padding:14px 16px;text-align:center">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af;font-weight:600">New Failures</p>
          <p style="margin:0;font-size:28px;font-weight:800;color:#dc2626">${newFailures}</p>
        </div>
        <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;text-align:center">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;font-weight:600">Recovered</p>
          <p style="margin:0;font-size:28px;font-weight:800;color:#059669">${recoveredCount}</p>
        </div>
        <div style="flex:1;background:#f9fafb;border-radius:10px;padding:14px 16px;text-align:center">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af;font-weight:600">Revenue</p>
          <p style="margin:0;font-size:20px;font-weight:800;color:#6366f1">${formatted}</p>
        </div>
      </div>
      <div style="background:#f5f3ff;border-radius:10px;padding:14px 16px;margin-bottom:24px;text-align:center">
        <p style="margin:0;color:#5b21b6;font-size:15px;font-weight:700">This week's recovery rate: <span style="font-size:22px">${rate}%</span></p>
        <p style="margin:4px 0 0;color:#7c3aed;font-size:12px">Industry average is 47%</p>
      </div>
      `}
      <div style="text-align:center">
        <a href="${appUrl}/dashboard" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:11px 24px;border-radius:8px;font-weight:600;font-size:14px">
          View Full Dashboard →
        </a>
      </div>
    </div>
    <div style="padding:14px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:11px">
        Revova weekly digest · <a href="${appUrl}/settings" style="color:#9ca3af">Manage notifications</a>
      </p>
    </div>
  </div>
</body>
</html>`

    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL
      if (!fromEmail) throw new Error('RESEND_FROM_EMAIL env var is not configured')
      await resend.emails.send({
        from: `Revova <${fromEmail}>`,
        to: merchantEmail,
        subject: newFailures === 0
          ? `✅ Clean week for ${account.business_name ?? 'your business'} — no failed payments`
          : `📊 Weekly recap: ${recoveredCount} recovered, ${formatted} saved`,
        html,
      })
      sent++
    } catch (e) {
      console.error(`[Weekly Summary] Failed for ${merchantEmail}:`, e)
    }
  }

  return NextResponse.json({ ok: true, sent })
}
