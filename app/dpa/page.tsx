import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Data Processing Agreement — Revova' }

const SUBPROCESSORS = [
  ['Vercel', 'Application hosting', 'USA'],
  ['Supabase', 'Database & authentication', 'USA / EU'],
  ['Stripe / Paddle / Braintree / Chargebee / Recurly', 'Payment event processing', 'USA / EU'],
  ['Resend', 'Transactional email delivery', 'USA'],
  ['Twilio', 'SMS delivery (if enabled)', 'USA'],
  ['Groq / Google (Gemini) / Anthropic', 'AI email generation', 'USA'],
]

export default function DPAPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">← Back to Revova</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Data Processing Agreement</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: 24 June 2026</p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Roles</h2>
            <p>For data protection law (including the EU/UK GDPR), the customer (&ldquo;Merchant&rdquo;) is the <strong>data controller</strong> and Revova is the <strong>data processor</strong>. Revova processes personal data only on the Merchant&apos;s documented instructions, which include using Revova to recover failed payments.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Data we process</h2>
            <p>On the Merchant&apos;s behalf, Revova processes: end-customer email address, name, phone (if provided), the failed payment amount, currency, decline reason, subscription/invoice identifiers, and email engagement (opens, clicks, bounces). Revova never receives or stores full card numbers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Purpose &amp; duration</h2>
            <p>Data is processed solely to deliver the payment-recovery service and is retained for as long as the Merchant&apos;s account is active. On account deletion (Settings → Data &amp; Privacy), all personal data is permanently erased.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Sub-processors</h2>
            <p>Revova uses the following sub-processors. The Merchant authorizes their use by accepting this DPA.</p>
            <table className="w-full text-sm border border-gray-100 rounded-lg overflow-hidden my-3">
              <thead><tr className="bg-gray-50 text-left">
                <th className="px-3 py-2 font-medium text-gray-700">Sub-processor</th>
                <th className="px-3 py-2 font-medium text-gray-700">Purpose</th>
                <th className="px-3 py-2 font-medium text-gray-700">Region</th>
              </tr></thead>
              <tbody>
                {SUBPROCESSORS.map(([n, p, r]) => (
                  <tr key={n} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-gray-700">{n}</td>
                    <td className="px-3 py-2 text-gray-500">{p}</td>
                    <td className="px-3 py-2 text-gray-500">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Security measures</h2>
            <p>Revova applies encryption in transit and at rest, row-level data isolation, signed-webhook verification, least-privilege access, and credential redaction. See our <Link href="/security" className="text-indigo-600 hover:underline">Security page</Link>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Data subject rights</h2>
            <p>Revova assists the Merchant in responding to data-subject requests. Merchants can export or delete all data themselves at any time, and can suppress any end-customer address via the email blacklist.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. International transfers</h2>
            <p>Where personal data is transferred outside the EEA/UK, transfers rely on Standard Contractual Clauses or an equivalent lawful mechanism provided by the relevant sub-processor.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Breach notification</h2>
            <p>Revova will notify the Merchant without undue delay after becoming aware of a personal data breach affecting the Merchant&apos;s data.</p>
          </section>
        </div>

        <div className="mt-10 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-800">
            This DPA is a good-faith template. For a binding agreement tailored to your jurisdiction and an enterprise contract, have it reviewed by your legal counsel. To sign a countersigned copy, email <a href="mailto:legal@revova.io" className="underline">legal@revova.io</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
