import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — Revova',
  description:
    'Revova billing terms in plain English: 14-day free trial, monthly subscription that renews automatically, cancel anytime, and a 30-day money-back guarantee.',
  alternates: { canonical: '/refund' },
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: July 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. How billing works</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Free trial:</strong> Revova starts with a 14-day free trial. No credit card is required to begin.</li>
              <li><strong>Plans:</strong> Starter is $29/month and Pro is $79/month, billed in US dollars.</li>
              <li><strong>Recurring subscription:</strong> When you subscribe, your plan renews automatically each month on the same date until you cancel. Your payment method is charged at the start of each billing period.</li>
              <li><strong>No commission:</strong> We charge a flat monthly fee only. We never take a percentage of the revenue we recover for you.</li>
              <li><strong>No long-term contract:</strong> Revova is month-to-month. You can cancel at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 30-day money-back guarantee</h2>
            <p>
              If you&apos;re not satisfied with a paid Revova plan, email us within{' '}
              <strong>30 days</strong> of your first payment and we&apos;ll refund that payment in
              full — no questions asked. This guarantee applies to your first paid month on the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How to cancel</h2>
            <p>You can cancel your subscription at any time in two ways:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>From your account&apos;s <Link href="/billing" className="text-indigo-600 hover:underline">Billing</Link> page inside the app, or</li>
              <li>By emailing <a href="mailto:support@revova.io" className="text-indigo-600 hover:underline">support@revova.io</a> and we&apos;ll cancel it for you.</li>
            </ul>
            <p className="mt-3">
              When you cancel, your plan stays active until the end of the current billing period,
              and you won&apos;t be charged again. We don&apos;t charge any cancellation fee.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Refunds after the guarantee period</h2>
            <p>
              Outside the 30-day guarantee window, monthly payments are generally non-refundable
              because the service was available to you during that period. However, we handle every
              request fairly — if you were charged in error, experienced a service outage, or forgot
              to cancel and hadn&apos;t used the service, email us and we&apos;ll make it right.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How refunds are processed</h2>
            <p>
              Payments and refunds are handled by our authorized reseller and merchant of record,
              who appears on your card statement and issues your invoices. Approved refunds are
              returned to your original payment method, typically within 5–10 business days depending
              on your bank.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Questions</h2>
            <p>
              For any billing, cancellation, or refund question, email{' '}
              <a href="mailto:support@revova.io" className="text-indigo-600 hover:underline">support@revova.io</a>{' '}
              — we reply within 1 business day. See also our{' '}
              <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        </div>
      </footer>
    </div>
  )
}
