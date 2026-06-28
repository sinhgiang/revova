/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { resolvePlan, TRIAL_DAYS } from '@/lib/plan'
import { ADMIN_EMAIL } from '@/lib/admin'
import { EnterDashboardButton } from '@/components/admin/impersonate-controls'
import { MerchantActions } from '@/components/admin/merchant-actions'
import { CheckCircle, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MerchantDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  // Founder only
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) redirect('/dashboard')

  const admin = await createAdminClient()
  const db = admin as any

  const { data: account } = await db.from('stripe_accounts').select('*').eq('user_id', userId).maybeSingle()
  if (!account) notFound()
  const { data: sub } = await db.from('subscriptions').select('*').eq('user_id', userId).maybeSingle()
  const { data: payments } = await db.from('failed_payments').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  const { data: conns } = await db.from('payment_connections').select('processor').eq('user_id', userId)
  const { count: emailsSent } = await db.from('email_logs').select('id', { count: 'exact', head: true }).eq('user_id', userId)
  const { count: suppressed } = await db.from('email_blacklist').select('id', { count: 'exact', head: true }).eq('user_id', userId)
  const { data: auditLog } = await db.from('admin_audit_log').select('*').eq('merchant_user_id', userId).order('created_at', { ascending: false }).limit(30)
  const { data: authU } = await admin.auth.admin.getUserById(userId)

  const featureFlags: Record<string, boolean> = {
    predunning_enabled: account.predunning_enabled !== false,
    notify_on_recovery: account.notify_on_recovery !== false,
    weekly_summary_enabled: account.weekly_summary_enabled !== false,
    winback_enabled: !!account.winback_enabled,
    cancel_flow_enabled: !!account.cancel_flow_enabled,
    sms_enabled: !!account.sms_enabled,
  }

  const plan = resolvePlan(account, sub)
  const pays: any[] = payments ?? []
  const recovered = pays.filter(p => p.status === 'recovered')
  const inProgress = pays.filter(p => ['email_sent', 'pending', 'retrying'].includes(p.status))
  const lost = pays.filter(p => p.status === 'max_emails_reached')
  const revenue = recovered.reduce((s, p) => s + (p.amount ?? 0), 0)
  const atRisk = inProgress.reduce((s, p) => s + (p.amount ?? 0), 0)
  const rate = pays.length > 0 ? Math.round((recovered.length / pays.length) * 100) : 0
  const currency = pays[0]?.currency ?? 'usd'
  const joined = account.connected_at ? new Date(account.connected_at) : null
  const trialEnds = joined ? new Date(joined.getTime() + TRIAL_DAYS * 86_400_000) : null

  const features: [string, boolean][] = [
    ['Slack alerts', !!account.slack_webhook_url],
    ['Telegram alerts', !!account.telegram_bot_token && !!account.telegram_chat_id],
    ['Pre-dunning', account.predunning_enabled !== false],
    ['Custom email timing', !!account.email_timing_days],
    ['Custom brand voice', !!account.email_custom_note],
    ['Custom SMTP', !!account.smtp_host],
    ['Multi-language', !!account.email_language && account.email_language !== 'en'],
    ['SMS recovery', !!account.sms_enabled],
    ['Winback', !!account.winback_enabled],
    ['Cancel flow', !!account.cancel_flow_enabled],
    ['Outbound webhook', !!account.outbound_webhook_url],
    ['Webhook verified', !!account.webhook_secret],
  ]

  const statusBadge = (s: string) => {
    if (s === 'recovered') return 'bg-emerald-100 text-emerald-700'
    if (s === 'max_emails_reached') return 'bg-red-100 text-red-600'
    return 'bg-amber-100 text-amber-700'
  }

  const stat = (label: string, value: string, color = 'text-gray-900') => (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-8 py-5 flex items-center justify-between">
          <div>
            <a href="/admin" className="text-sm text-gray-500 hover:text-gray-900">← All merchants</a>
            <h1 className="text-xl font-bold text-gray-900 mt-1">{account.business_name || authU?.user?.email || 'Merchant'}</h1>
            <p className="text-sm text-gray-500">{authU?.user?.email ?? account.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${plan.isPro ? 'bg-purple-100 text-purple-700' : plan.tier === 'starter' ? 'bg-indigo-100 text-indigo-700' : plan.tier === 'trial' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
              {plan.tier}
            </span>
            <EnterDashboardButton userId={userId} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
        {/* Account / plan info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-gray-400 text-xs uppercase">Joined</p><p className="font-medium text-gray-900 mt-1">{joined ? formatDate(joined.toISOString()) : '—'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase">Days active</p><p className="font-medium text-gray-900 mt-1">{joined ? Math.floor((Date.now() - joined.getTime()) / 86_400_000) : 0} days</p></div>
          <div>
            <p className="text-gray-400 text-xs uppercase">{plan.tier === 'trial' ? 'Trial ends' : plan.isPro || plan.tier === 'starter' ? 'Renews' : 'Trial ended'}</p>
            <p className="font-medium text-gray-900 mt-1">{plan.tier === 'trial' ? `${trialEnds ? formatDate(trialEnds.toISOString()) : '—'} (${plan.trialDaysLeft}d left)` : sub?.current_period_end ? formatDate(sub.current_period_end) : trialEnds ? formatDate(trialEnds.toISOString()) : '—'}</p>
          </div>
          <div><p className="text-gray-400 text-xs uppercase">Processors</p><p className="font-medium text-gray-900 mt-1 capitalize">Stripe{(conns ?? []).length ? ', ' + (conns ?? []).map((c: any) => c.processor).join(', ') : ''}</p></div>
        </div>

        {/* Admin edit actions (audited) */}
        <MerchantActions userId={userId} currentTier={plan.tier} currentName={account.business_name ?? ''} features={featureFlags} />

        {/* Recovery stats */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Recovery performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {stat('Failed', String(pays.length))}
            {stat('Recovered', String(recovered.length), 'text-emerald-600')}
            {stat('Recovery rate', `${rate}%`, 'text-indigo-600')}
            {stat('Revenue saved', formatCurrency(revenue, currency), 'text-emerald-600')}
            {stat('At risk', formatCurrency(atRisk, currency), 'text-amber-600')}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-center text-sm">
            <div className="bg-gray-50 rounded-lg py-2"><span className="font-bold text-gray-900">{inProgress.length}</span> <span className="text-gray-400">in progress</span></div>
            <div className="bg-gray-50 rounded-lg py-2"><span className="font-bold text-gray-900">{lost.length}</span> <span className="text-gray-400">lost</span></div>
            <div className="bg-gray-50 rounded-lg py-2"><span className="font-bold text-gray-900">{emailsSent ?? 0}</span> <span className="text-gray-400">emails sent</span> · <span className="font-bold text-gray-900">{suppressed ?? 0}</span> <span className="text-gray-400">suppressed</span></div>
          </div>
        </div>

        {/* Feature configuration */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">What they&apos;ve set up</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {features.map(([label, on]) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                {on ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                <span className={on ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent failed payments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Recent failed payments</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left text-xs text-gray-400 uppercase">
                <th className="px-6 py-2.5 font-medium">Customer</th>
                <th className="px-6 py-2.5 font-medium">Amount</th>
                <th className="px-6 py-2.5 font-medium">Decline</th>
                <th className="px-6 py-2.5 font-medium">Emails</th>
                <th className="px-6 py-2.5 font-medium">Status</th>
                <th className="px-6 py-2.5 font-medium">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {pays.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-6 text-center text-gray-400">No failed payments yet.</td></tr>
                ) : pays.slice(0, 25).map((p, i) => (
                  <tr key={i}>
                    <td className="px-6 py-2.5 text-gray-700">{p.customer_name || p.customer_email || '—'}</td>
                    <td className="px-6 py-2.5 text-gray-700">{formatCurrency(p.amount ?? 0, p.currency ?? 'usd')}</td>
                    <td className="px-6 py-2.5 text-gray-500 capitalize">{(p.decline_code ?? '—').replace(/_/g, ' ')}</td>
                    <td className="px-6 py-2.5 text-gray-700">{p.emails_sent ?? 0}</td>
                    <td className="px-6 py-2.5"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(p.status)}`}>{(p.status ?? '').replace(/_/g, ' ')}</span></td>
                    <td className="px-6 py-2.5 text-gray-400">{p.created_at ? formatDate(p.created_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit history for this merchant */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Admin change history</h3></div>
          {(auditLog ?? []).length === 0 ? (
            <p className="px-6 py-6 text-sm text-gray-400">No admin changes recorded for this merchant yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {(auditLog ?? []).map((a: any) => (
                <li key={a.id} className="px-6 py-3 flex items-center justify-between text-sm">
                  <span className="text-gray-700">{a.action}</span>
                  <span className="text-xs text-gray-400">{a.admin_email} · {formatDate(a.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-gray-400">Founder support view · all edits above are logged in the change history.</p>
      </div>
    </div>
  )
}
