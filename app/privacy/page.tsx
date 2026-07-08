import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Revova',
  description: 'How Revova collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: June 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>When you use Revova, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Account data:</strong> your email address and business name when you sign up.</li>
              <li><strong>Stripe integration data:</strong> a Stripe access token (OAuth), your customers&apos; names and email addresses, and failed payment amounts — to power our recovery service.</li>
              <li><strong>Email logs:</strong> which recovery emails were sent, opened, and clicked, to measure effectiveness.</li>
              <li><strong>Usage data:</strong> page views and feature usage collected via server logs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To send AI-generated payment recovery emails to your customers on your behalf.</li>
              <li>To display analytics (recovery rate, revenue recovered) on your dashboard.</li>
              <li>To operate, maintain, and improve the Revova service.</li>
              <li>To send you transactional emails (recovery notifications, billing receipts).</li>
            </ul>
            <p className="mt-3">We never sell your data or your customers&apos; data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage & Security</h2>
            <p>
              Your data is stored in Supabase (hosted on AWS) with row-level security. All data is
              encrypted at rest and in transit (TLS 1.2+). Stripe credentials are stored using
              Stripe OAuth and we never store raw secret keys.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p>Revova integrates with:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Stripe</strong> — to access your payment data (see <a href="https://stripe.com/privacy" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a>).</li>
              <li><strong>Resend</strong> — to deliver emails (your customers&apos; email addresses are shared with Resend for delivery).</li>
              <li><strong>Anthropic / Google</strong> — AI providers used to generate email content. We pass only non-identifiable context (failure reason, general industry) — no customer PII.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. Failed payment records
              and email logs are retained for 12 months. You may request deletion at any time by
              contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal data by emailing{' '}
              <a href="mailto:support@revova.io" className="text-indigo-600 hover:underline">support@revova.io</a>.
              For EU/EEA users, you have rights under GDPR including access, portability, and erasure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              Revova uses only essential cookies for authentication (Supabase session cookie).
              We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this policy and will notify you by email or in-app notification if we make
              material changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
            <p>
              Questions? Email us at{' '}
              <a href="mailto:support@revova.io" className="text-indigo-600 hover:underline">support@revova.io</a>.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <div className="space-x-4">
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <Link href="/" className="hover:text-gray-600">Home</Link>
        </div>
      </footer>
    </div>
  )
}
