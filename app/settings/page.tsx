/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { formatDate } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import { WebhookSettings } from '@/components/settings/webhook-settings'
import { BusinessNameSettings } from '@/components/settings/business-name-settings'
import { SlackSettings } from '@/components/settings/slack-settings'
import { WidgetSettings } from '@/components/settings/widget-settings'
import { EmailToneSettings } from '@/components/settings/email-tone-settings'
import { EmailTimingSettings } from '@/components/settings/email-timing-settings'
import { CancelFlowSettings } from '@/components/settings/cancel-flow-settings'
import { SmtpSettings } from '@/components/settings/smtp-settings'
import { OutboundWebhookSettings } from '@/components/settings/outbound-webhook-settings'
import { EmailBlacklistSettings } from '@/components/settings/email-blacklist-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { EmailLanguageSettings } from '@/components/settings/email-language-settings'
import { WinbackSettings } from '@/components/settings/winback-settings'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: stripeAccount } = await (supabase as any)
    .from('stripe_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'
  const webhookUrl = `${appUrl}/api/webhook/${user.id}`

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your Revova configuration</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Member since</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(user.created_at)}</span>
                </div>
                <BusinessNameSettings currentName={stripeAccount?.business_name ?? null} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Stripe Connection</h2>
              {stripeAccount ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {stripeAccount.business_name ?? 'Connected'}
                    </p>
                    <p className="text-sm text-gray-500">{stripeAccount.email ?? user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Connected {formatDate(stripeAccount.connected_at)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No Stripe account connected. <a href="/onboarding" className="text-indigo-600 hover:underline">Connect now →</a></p>
              )}
            </div>

            {/* Webhook URL + secret — client component for copy + update */}
            <WebhookSettings
              webhookUrl={webhookUrl}
              hasSecret={!!stripeAccount?.webhook_secret}
            />

            <SlackSettings currentWebhookUrl={stripeAccount?.slack_webhook_url ?? null} />

            <EmailToneSettings currentNote={stripeAccount?.email_custom_note ?? null} />

            <WidgetSettings userId={user.id} appUrl={appUrl} />

            <CancelFlowSettings
              userId={user.id}
              appUrl={appUrl}
              currentEnabled={stripeAccount?.cancel_flow_enabled ?? false}
              currentDiscountCode={stripeAccount?.cancel_flow_discount_code ?? null}
              currentPauseMonths={stripeAccount?.cancel_flow_pause_months ?? 1}
            />

            <EmailTimingSettings
              currentTiming={(() => {
                try { return stripeAccount?.email_timing_days ? JSON.parse(stripeAccount.email_timing_days) : null }
                catch { return null }
              })()}
            />

            <SmtpSettings hasSmtp={!!stripeAccount?.smtp_host} />

            <OutboundWebhookSettings currentUrl={stripeAccount?.outbound_webhook_url ?? null} />

            <EmailBlacklistSettings />

            <NotificationSettings enabled={stripeAccount?.notify_on_recovery !== false} />

            <EmailLanguageSettings currentLanguage={stripeAccount?.email_language ?? null} />

            <WinbackSettings
              enabled={stripeAccount?.winback_enabled ?? false}
              discountCode={stripeAccount?.winback_discount_code ?? null}
            />

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-2">Recovery Email Sequence</h2>
              <p className="text-sm text-gray-500 mb-4">
                Revova automatically sends AI-personalized recovery emails. Starter: 4 emails, Pro: 5 emails.
              </p>
              <div className="space-y-2">
                {[
                  { day: 'Immediately', label: 'Email 1 — AI-crafted reminder sent right after failure', pro: false },
                  { day: 'Day 3',       label: 'Email 2 — Gentle follow-up with payment update link',   pro: false },
                  { day: 'Day 7',       label: 'Email 3 — Value reminder to re-engage the customer',     pro: false },
                  { day: 'Day 14',      label: 'Email 4 — Urgency notice about account access',          pro: false },
                  { day: 'Day 21',      label: 'Email 5 — Final notice before cancellation',             pro: true  },
                ].map(({ day, label, pro }) => (
                  <div key={day} className="flex items-center gap-3 text-sm">
                    <span className="w-24 font-medium text-indigo-600 flex-shrink-0">{day}</span>
                    <span className="text-gray-600 flex-1">{label}</span>
                    {pro && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex-shrink-0">Pro</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
