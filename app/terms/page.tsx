import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Revova',
  description: 'The terms and conditions governing your use of Revova.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: June 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using Revova (&ldquo;Service&rdquo;), you agree to these Terms of Service.
              If you do not agree, do not use the Service. &ldquo;You&rdquo; refers to the business or individual
              using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. The Service</h2>
            <p>
              Revova provides AI-powered payment recovery automation for subscription businesses. The Service
              connects to your Stripe account via OAuth and sends automated emails to your customers to
              recover failed payments on your behalf.
            </p>
            <p className="mt-3">
              You are responsible for ensuring that sending recovery emails to your customers complies with
              applicable laws (e.g., CAN-SPAM, GDPR). Revova is a tool; you are the sender.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Account Registration</h2>
            <p>
              You must provide accurate information when creating an account. You are responsible for
              maintaining the security of your account credentials and for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Acceptable Use</h2>
            <p>You may not use the Service to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Send spam or unsolicited emails unrelated to payment recovery.</li>
              <li>Harass, threaten, or deceive your customers.</li>
              <li>Violate any applicable laws or regulations.</li>
              <li>Reverse engineer or attempt to extract our source code or AI models.</li>
              <li>Resell or sublicense access to the Service without our written consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Subscription & Payment</h2>
            <p>
              The Starter plan is free. The Pro plan is $79/month, billed monthly via Stripe. Subscriptions
              auto-renew until cancelled. You may cancel at any time from your billing dashboard; you will
              retain Pro access through the end of the current billing period. No refunds for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data</h2>
            <p>
              You retain ownership of your data and your customers&apos; data. By using the Service, you grant
              us a limited license to process that data solely to provide the Service. See our{' '}
              <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee any
              specific recovery rate or revenue outcome. AI-generated emails may not be perfect; you
              should review them using the preview feature.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Revova&apos;s liability for any claim arising from the
              Service is limited to the amount you paid us in the 3 months preceding the claim.
              We are not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
            <p>
              You may delete your account at any time. We reserve the right to suspend or terminate accounts
              that violate these Terms, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes</h2>
            <p>
              We may update these Terms. We&apos;ll notify you via email or in-app notice for material changes.
              Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
            <p>
              Questions? Email{' '}
              <a href="mailto:support@revova.io" className="text-indigo-600 hover:underline">support@revova.io</a>.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <div className="space-x-4">
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/" className="hover:text-gray-600">Home</Link>
        </div>
      </footer>
    </div>
  )
}
