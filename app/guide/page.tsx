import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { SettingsTabs, SettingsTab } from '@/components/settings/settings-tabs'
import { AdminBar } from '@/components/admin/admin-bar'
import {
  Rocket, LayoutDashboard, Plug, Mail, CreditCard, BarChart2, Bell,
  Heart, Clock, Server, Webhook, Receipt, Shield, HelpCircle,
} from 'lucide-react'

/* ── tiny presentational helpers for readable docs ── */
function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-7 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  )
}
function H({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-2">{children}</h3>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed mb-3">{children}</p>
}
function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="list-decimal space-y-1.5 text-sm text-gray-600 mb-3 ml-5 leading-relaxed">
      {items.map((it, i) => <li key={i} className="pl-1">{it}</li>)}
    </ol>
  )
}
function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 text-sm text-gray-600 mb-3 ml-5 leading-relaxed">
      {items.map((it, i) => <li key={i} className="pl-1">{it}</li>)}
    </ul>
  )
}
function Tip({ children }: { children: React.ReactNode }) {
  return <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 text-sm text-indigo-800 mb-3">💡 {children}</div>
}
function Pro() {
  return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 align-middle">PRO</span>
}

export default async function GuidePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ic = 'w-4 h-4'

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AdminBar />
        <div className="p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Guide</h1>
            <p className="text-gray-500 mt-1">Step-by-step help for every Revova feature</p>
          </div>

          <SettingsTabs>
            {/* ───────── Getting Started ───────── */}
            <SettingsTab id="start" label="Getting Started" icon={<Rocket className={ic} />}>
              <Article title="Welcome to Revova 👋">
                <P>Revova automatically recovers failed subscription payments. When a customer&apos;s card fails (expired, insufficient funds, bank decline), Revova sends AI-written emails to win that revenue back — on autopilot.</P>
                <H>Get live in 3 steps</H>
                <Steps items={[
                  <>Connect your payment processor (Stripe, Paddle, Braintree, Chargebee or Recurly) — see the <strong>Connecting Stripe</strong> tab.</>,
                  <>Add the webhook so Revova hears about failed payments — also in the Connections guide.</>,
                  <>That&apos;s it. Revova now watches 24/7 and emails customers the moment a payment fails.</>,
                ]} />
                <Tip>You don&apos;t need to configure anything else to start — every feature has a sensible default. Customize later from <strong>Settings</strong>.</Tip>
                <H>Your free trial</H>
                <P>You have 14 days free, no credit card. During the trial you can use all Starter features. Upgrade anytime from the <strong>Billing</strong> page to unlock Pro features and unlimited recoveries.</P>
              </Article>
            </SettingsTab>

            {/* ───────── Dashboard ───────── */}
            <SettingsTab id="dashboard" label="Dashboard" icon={<LayoutDashboard className={ic} />}>
              <Article title="Understanding your Dashboard">
                <P>The dashboard is your at-a-glance view of recovery performance.</P>
                <H>The top stat cards</H>
                <Bullets items={[
                  <><strong>Recovered</strong> — money Revova has won back for you.</>,
                  <><strong>In Progress</strong> — failed payments currently being emailed.</>,
                  <><strong>Recovery rate</strong> — % of failed payments you got back.</>,
                  <><strong>Pending</strong> — awaiting customer action.</>,
                ]} />
                <H>At-Risk Customers</H>
                <P>Customers who received 3+ emails without paying. These are worth a personal reach-out. The <strong>churn-risk score</strong> <Pro /> ranks who&apos;s most likely to leave.</P>
                <H>Trial banner</H>
                <P>While on trial, a banner shows days remaining. It turns amber in the final 3 days — upgrade before it ends to avoid interruption.</P>
              </Article>
            </SettingsTab>

            {/* ───────── Connecting Stripe ───────── */}
            <SettingsTab id="stripe" label="Connecting Stripe" icon={<Plug className={ic} />}>
              <Article title="Connect Stripe (3 minutes)">
                <H>Step 1 — Paste your Stripe key</H>
                <Steps items={[
                  <>Go to <strong>Onboarding</strong> (or Settings → Connections).</>,
                  <>Open your <a className="text-indigo-600 hover:underline" href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">Stripe API keys</a> → copy your <strong>Secret key</strong> (starts with <code className="bg-gray-100 px-1 rounded">sk_live_</code> or <code className="bg-gray-100 px-1 rounded">sk_test_</code>).</>,
                  <>Paste it into Revova and click <strong>Connect</strong>.</>,
                ]} />
                <Tip>Revova only reads failed-payment events. It never moves money or stores card numbers.</Tip>
                <H>Step 2 — Add the webhook</H>
                <P>The webhook lets Stripe tell Revova the instant a payment fails.</P>
                <Steps items={[
                  <>In Settings → Connections, copy <strong>Your Webhook URL</strong>.</>,
                  <>Open Stripe → Developers → <strong>Webhooks</strong> (or &ldquo;Event destinations&rdquo;) → create a new one.</>,
                  <>Select these 2 events: <code className="bg-gray-100 px-1 rounded">invoice.payment_failed</code> and <code className="bg-gray-100 px-1 rounded">invoice.payment_succeeded</code>.</>,
                  <>For destination type, choose <strong>&ldquo;Webhook endpoint&rdquo;</strong>, then paste your webhook URL.</>,
                  <>Create it, then copy the <strong>Signing secret</strong> (<code className="bg-gray-100 px-1 rounded">whsec_…</code>) back into Revova and Save.</>,
                ]} />
                <Tip>Stripe&apos;s webhook screen changes from time to time. The key steps never change: pick <strong>&ldquo;Webhook endpoint&rdquo;</strong>, paste your URL, add those 2 events.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Other processors ───────── */}
            <SettingsTab id="processors" label="Other Processors" icon={<CreditCard className={ic} />}>
              <Article title="Paddle, Braintree, Chargebee & Recurly">
                <P>Revova works with 5 processors. Connect them in Settings → Connections → <strong>Other Payment Processors</strong>.</P>
                <H>General steps (same idea for all)</H>
                <Steps items={[
                  <>Pick your processor and enter its API credentials (key/secret).</>,
                  <>Copy the webhook URL Revova gives you into that processor&apos;s webhook settings.</>,
                  <>Choose the &quot;payment failed&quot; event so Revova gets notified.</>,
                ]} />
                <Bullets items={[
                  <><strong>Paddle</strong> — paste your API key + webhook secret.</>,
                  <><strong>Braintree</strong> — merchant ID, public &amp; private keys.</>,
                  <><strong>Chargebee</strong> — site name + API key (Basic-Auth webhook).</>,
                  <><strong>Recurly</strong> — API key (XML webhook, Basic-Auth).</>,
                ]} />
                <Tip>Each processor runs on its own isolated pipeline — they never interfere with each other or with Stripe.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Recovery Emails ───────── */}
            <SettingsTab id="emails" label="Recovery Emails" icon={<Mail className={ic} />}>
              <Article title="How recovery emails work">
                <P>When a payment fails, Revova&apos;s AI reads the exact decline reason and writes a unique, human-sounding email — not a template. It then follows up on a smart schedule until the customer pays or the sequence ends.</P>
                <H>The sequence</H>
                <Bullets items={[
                  <><strong>Email 1</strong> — immediately on failure.</>,
                  <><strong>Emails 2–4</strong> — Day 3, 7, 14 (you can change the timing).</>,
                  <><strong>Email 5</strong> <Pro /> — Day 21, final notice.</>,
                ]} />
                <H>What you can customize (Settings → Recovery Emails)</H>
                <Bullets items={[
                  <><strong>Custom timing</strong> — days between each email.</>,
                  <><strong>Brand voice</strong> — a note telling the AI your tone.</>,
                  <><strong>8 languages</strong> <Pro /> — email customers in their language.</>,
                  <><strong>Custom SMTP</strong> <Pro /> — send from your own domain.</>,
                ]} />
                <Tip>Email 1 always sends instantly — that&apos;s when recovery rates are highest.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Failed Payments ───────── */}
            <SettingsTab id="payments" label="Failed Payments" icon={<CreditCard className={ic} />}>
              <Article title="The Failed Payments page">
                <P>A live list of every failed payment Revova has detected, with its status.</P>
                <Bullets items={[
                  <><strong>Email sent / In progress</strong> — recovery sequence is running.</>,
                  <><strong>Recovered</strong> — the customer paid. 🎉</>,
                  <><strong>Max emails reached</strong> — sequence finished without payment.</>,
                ]} />
                <H>Actions</H>
                <Bullets items={[
                  <><strong>Send email now</strong> — manually trigger a recovery email (12-hour cooldown).</>,
                  <><strong>Export CSV</strong> — download the list for your records.</>,
                ]} />
              </Article>
            </SettingsTab>

            {/* ───────── Analytics ───────── */}
            <SettingsTab id="analytics" label="Analytics" icon={<BarChart2 className={ic} />}>
              <Article title="Reading your Analytics">
                <Bullets items={[
                  <><strong>Recovery rate &amp; revenue</strong> — your core numbers.</>,
                  <><strong>Top decline reasons</strong> — why payments fail (expired card, funds, etc.).</>,
                  <><strong>Email funnel</strong> — how far customers get in the sequence.</>,
                  <><strong>Deliverability health</strong> — bounce &amp; spam rates (keep them low).</>,
                  <><strong>Open &amp; click analytics</strong> <Pro /> — per-email engagement.</>,
                  <><strong>Revenue forecast</strong> <Pro /> — projected recovery from in-progress payments.</>,
                ]} />
                <Tip>A healthy click rate is ~15%+. Clicks (not opens) drive recovery — they mean the customer tapped &quot;update card&quot;.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Notifications ───────── */}
            <SettingsTab id="notifications" label="Notifications" icon={<Bell className={ic} />}>
              <Article title="Get notified when you recover money">
                <H>Slack</H>
                <Steps items={[
                  <>In Slack, create an <strong>Incoming Webhook</strong> (Slack → Apps → Incoming Webhooks).</>,
                  <>Copy the webhook URL → paste into Settings → Notifications → Slack → Save.</>,
                  <>Click <strong>Test</strong> to confirm.</>,
                ]} />
                <H>Telegram</H>
                <Steps items={[
                  <>Open <strong>@BotFather</strong> in Telegram → send <code className="bg-gray-100 px-1 rounded">/newbot</code> → copy the token.</>,
                  <>Open your new bot and send it any message (e.g. &quot;hi&quot;).</>,
                  <>Paste the token into Settings → Notifications → Telegram → Connect. Revova finds your chat automatically.</>,
                ]} />
                <H>Email</H>
                <P>&quot;Merchant Notifications&quot; emails you each time a payment is recovered. Toggle it on/off anytime.</P>
                <Tip>These alerts go to <strong>you</strong> (the business owner), not your customers.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Retention (Pro) ───────── */}
            <SettingsTab id="retention" label="Retention" icon={<Heart className={ic} />} badge="Pro">
              <Article title="Keep customers from cancelling (Pro)">
                <H>In-app Cancel Flow + A/B testing</H>
                <P>When a customer tries to cancel, show a save offer (discount, pause, or free month) right inside your app. A/B test two offers to see which keeps more customers.</P>
                <Steps items={[
                  <>Enable Cancel Flow in Settings → Retention.</>,
                  <>Set your offer (discount code, pause length, or 1-month-free gift).</>,
                  <>Add the cancel widget to your app (snippet in Settings → Integrations).</>,
                ]} />
                <H>Winback campaigns</H>
                <P>For customers who do cancel, Revova auto-sends re-engagement emails on Day 3, 14, and 30 — optionally with a comeback discount.</P>
                <H>SMS recovery</H>
                <P>Send a text-message nudge (from your own Twilio number) when a customer ignores your emails. Texts get ~98% open rates.</P>
              </Article>
            </SettingsTab>

            {/* ───────── Pre-Dunning ───────── */}
            <SettingsTab id="predunning" label="Pre-Dunning" icon={<Clock className={ic} />}>
              <Article title="Prevent failures before they happen">
                <P>Pre-dunning watches your active subscriptions and warns customers <strong>before</strong> their card expires — stopping the failed payment from ever happening.</P>
                <Steps items={[
                  <>Turn it on in Settings → Recovery Emails → Pre-Dunning.</>,
                  <>Revova flags cards expiring this month or next and emails those customers a friendly &quot;update your card&quot; reminder.</>,
                ]} />
                <Tip>The cheapest payment to recover is the one that never fails. Leave pre-dunning on.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Custom SMTP ───────── */}
            <SettingsTab id="smtp" label="Sending & SMTP" icon={<Server className={ic} />}>
              <Article title="Send from your own domain (Pro)">
                <P>By default, emails come from Revova&apos;s shared sender. With <strong>Custom SMTP</strong> <Pro /> you send from your own domain (e.g. billing@yourcompany.com) for better branding and deliverability.</P>
                <Steps items={[
                  <>Get SMTP credentials from your email provider (Resend, Postmark, SendGrid, Gmail Workspace, etc.).</>,
                  <>Enter host, port, username, password and from-address in Settings → Recovery Emails → Custom SMTP.</>,
                  <>Toggle &quot;Use custom SMTP&quot; on and Save.</>,
                ]} />
                <Tip>Make sure your domain has SPF and DKIM set up with your provider — it keeps emails out of spam.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Integrations ───────── */}
            <SettingsTab id="integrations" label="Integrations" icon={<Webhook className={ic} />}>
              <Article title="Widgets & outbound webhooks">
                <H>In-app payment banner</H>
                <P>A small banner that appears in your app for customers with a failed payment, linking them straight to update their card. Copy the snippet from Settings → Integrations → Widget.</P>
                <H>Outbound webhooks</H>
                <P>Revova can POST to a URL of yours every time a payment is recovered — perfect for triggering your own automations (Zapier, Make, your backend).</P>
                <Steps items={[
                  <>Enter your endpoint URL in Settings → Integrations → Outbound Webhook.</>,
                  <>We send a JSON payload with the recovered payment details + header <code className="bg-gray-100 px-1 rounded">X-Revova-Event: payment.recovered</code>.</>,
                ]} />
              </Article>
            </SettingsTab>

            {/* ───────── Billing ───────── */}
            <SettingsTab id="billing" label="Billing & Plans" icon={<Receipt className={ic} />}>
              <Article title="Plans, trial & upgrading">
                <H>Starter ($29/mo)</H>
                <P>Up to 50 recoveries/month, 4-email sequence, all 5 processors, pre-dunning, spam suppression, Slack &amp; Telegram, dashboard, GDPR tools.</P>
                <H>Pro ($79/mo)</H>
                <P>Everything in Starter plus: unlimited recoveries, 5-email sequence, SMS, 8 languages, winback, cancel flow + A/B testing, churn scoring, open/click analytics, revenue forecast, weekly digest, custom SMTP.</P>
                <H>How to upgrade</H>
                <Steps items={[
                  <>Go to <strong>Billing</strong> → choose a plan → checkout (secure, via Polar).</>,
                  <>After paying you return straight to your dashboard — Pro features unlock instantly.</>,
                ]} />
                <Tip>Trial ends after 14 days. If you don&apos;t pick a plan, your account pauses (data is kept safe) until you upgrade.</Tip>
              </Article>
            </SettingsTab>

            {/* ───────── Account & Security ───────── */}
            <SettingsTab id="account" label="Account & Security" icon={<Shield className={ic} />}>
              <Article title="Account, password & your data">
                <H>Change password</H>
                <P>In Settings → Account. (Only shown if you signed up with email — Google/GitHub/Microsoft users manage their password with that provider.)</P>
                <H>Sign-in options</H>
                <P>You can sign in with email, Google, GitHub or Microsoft. They all lead to the same account if they share your email.</P>
                <H>Your data (GDPR)</H>
                <Bullets items={[
                  <><strong>Export</strong> — download all your data as JSON (Settings → Data &amp; Privacy).</>,
                  <><strong>Delete</strong> — permanently erase your account and data.</>,
                  <>We encrypt data in transit and at rest, and never store customer card numbers.</>,
                ]} />
              </Article>
            </SettingsTab>

            {/* ───────── FAQ ───────── */}
            <SettingsTab id="faq" label="FAQ & Troubleshooting" icon={<HelpCircle className={ic} />}>
              <Article title="Common questions">
                <H>Revova isn&apos;t detecting failed payments</H>
                <Bullets items={[
                  <>Check the webhook is added in your processor and the signing secret is saved in Revova.</>,
                  <>Make sure the <code className="bg-gray-100 px-1 rounded">payment_failed</code> event is selected.</>,
                ]} />
                <H>Emails are landing in spam</H>
                <Bullets items={[
                  <>Set up <strong>Custom SMTP</strong> <Pro /> with your own domain + SPF/DKIM.</>,
                  <>Keep your bounce &amp; spam rates low (see Analytics → Deliverability).</>,
                ]} />
                <H>I hit my monthly recovery limit</H>
                <P>Starter is capped at 50 recoveries/month. Upgrade to Pro for unlimited.</P>
                <H>Still stuck?</H>
                <P>Email <a className="text-indigo-600 hover:underline" href="mailto:support@revova.io">support@revova.io</a> — a real human replies.</P>
              </Article>
            </SettingsTab>
          </SettingsTabs>
        </div>
      </main>
    </div>
  )
}
