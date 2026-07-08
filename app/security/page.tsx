import Link from 'next/link'
import { Shield, Lock, Eye, Server, FileCheck, Globe } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Security & Trust — Revova' }

const ITEMS = [
  { icon: Lock, title: 'Encryption everywhere', body: 'All data is encrypted in transit (TLS 1.2+) and at rest. Sensitive credentials (Stripe keys, SMTP passwords, webhook secrets) are stored encrypted and never exposed in the UI or exports.' },
  { icon: Eye, title: 'Read-only payment access', body: 'Revova only listens for failed-payment events. We never move money, never charge cards on your behalf beyond the standard retry you configure, and never store full card numbers — those stay with your payment processor.' },
  { icon: Server, title: 'SOC 2-compliant infrastructure', body: 'Revova runs entirely on SOC 2 Type II certified providers — Vercel (hosting), Supabase (database), Stripe & Paddle (payments), Resend (email). A formal SOC 2 audit of Revova itself is on our roadmap.' },
  { icon: FileCheck, title: 'GDPR-ready', body: 'Export all your data as JSON anytime, or permanently delete your account and every record we hold, directly from Settings → Data & Privacy. See our Data Processing Agreement for details.' },
  { icon: Globe, title: 'Data isolation', body: 'Every merchant\'s data is isolated by row-level security in the database. One account can never read another\'s payments, customers, or settings.' },
  { icon: Shield, title: 'Least-privilege access', body: 'Background jobs use scoped service credentials. Webhook endpoints verify cryptographic signatures (Stripe, Paddle, Braintree) before accepting any event.' },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">← Back to Revova</Link>
        <div className="flex items-center gap-3 mt-6 mb-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Security &amp; Trust</h1>
        </div>
        <p className="text-gray-500 text-lg mb-10">
          Revova handles your revenue data, so security is foundational — not an afterthought. Here&apos;s exactly how we protect it.
        </p>

        <div className="space-y-6">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 p-5 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-sm text-gray-600">
            Need our <Link href="/dpa" className="text-indigo-600 hover:underline">Data Processing Agreement</Link>,
            {' '}<Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>, or have a security question?
            Email <a href="mailto:support@revova.io" className="text-indigo-600 hover:underline">support@revova.io</a>.
          </p>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Honest note: a SOC 2 report for Revova itself is not yet available — we&apos;re a young product. We build on SOC 2-certified infrastructure and are happy to complete a security questionnaire for enterprise evaluations.
        </p>
      </div>
    </div>
  )
}
