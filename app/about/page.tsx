import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Revova — Who We Are',
  description:
    'Revova is an AI-powered payment recovery tool that helps subscription businesses win back revenue lost to failed and declined payments. Learn who we are and why we built it.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">About Revova</h1>
        <p className="text-gray-500 mb-10">AI-powered payment recovery for subscription businesses.</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What we do</h2>
            <p>
              Revova helps subscription businesses recover revenue they lose to failed and declined
              payments — a problem known as involuntary churn. When a customer&apos;s card expires,
              has insufficient funds, or is declined by their bank, the subscription silently fails
              and the business loses money without ever knowing. Revova connects to your payment
              processor, detects these failures automatically, and wins the revenue back with
              AI-personalized recovery emails, smart retries, and pre-dunning alerts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why we built it</h2>
            <p>
              The average subscription business loses 5–10% of its revenue to failed payments, and
              most of that money is recoverable — it&apos;s just never followed up on. The tools that
              solve this were built for large enterprises and priced accordingly ($150–200+/month).
              We built Revova to give indie hackers, solo founders, and small SaaS teams the same
              recovery power at a price that makes sense for them, with a setup that takes minutes
              instead of an engineering project.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What makes us different</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>We recover past revenue, not just new failures.</strong> Our Lost Revenue
                Finder scans your payment history to surface money you&apos;ve already lost, then
                launches win-back campaigns for it.
              </li>
              <li>
                <strong>AI-personalized emails.</strong> Every recovery email is written for the
                specific failure reason — not a generic &quot;your payment failed&quot; template.
              </li>
              <li>
                <strong>Flat, honest pricing.</strong> We charge a simple monthly fee and never take
                a commission on the revenue we recover for you.
              </li>
              <li>
                <strong>Works with 5 payment processors</strong> — Stripe, Paddle, Braintree,
                Chargebee, and Recurly — on isolated, secure pipelines.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How we handle your data</h2>
            <p>
              Revova uses read-only access to your payment data, encrypts everything in transit and
              at rest, and isolates each account&apos;s data. We never sell your data or your
              customers&apos; data. You can export or delete your data at any time. Read more on our{' '}
              <Link href="/security" className="text-indigo-600 hover:underline">Security</Link> page,
              our{' '}
              <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>,
              and our{' '}
              <Link href="/dpa" className="text-indigo-600 hover:underline">Data Processing Agreement</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Get in touch</h2>
            <p>
              Revova is an independently operated software product. The fastest way to reach a real
              person is email —{' '}
              <a href="mailto:support@revova.io" className="text-indigo-600 hover:underline">support@revova.io</a>.
              For anything else, see our{' '}
              <Link href="/contact" className="text-indigo-600 hover:underline">Contact</Link> page.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        </div>
      </footer>
    </div>
  )
}
