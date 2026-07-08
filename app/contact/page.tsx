import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Revova — Support & Sales',
  description:
    'Get in touch with the Revova team. Email us for support, billing, privacy, or partnership questions — we reply to every message.',
  alternates: { canonical: '/contact' },
}

const channels = [
  {
    label: 'Email us',
    email: 'support@revova.io',
    desc: 'Setup help, product questions, billing, cancellations, privacy and data requests, partnerships, press — everything reaches us here, and a real human replies.',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact us</h1>
        <p className="text-gray-500 mb-10">
          We&apos;re a small team and we read every message. Expect a reply within 1 business day.
        </p>

        <div className="space-y-4">
          {channels.map((c) => (
            <div key={c.email} className="rounded-xl border border-gray-200 p-5">
              <div className="text-sm font-semibold text-gray-900">{c.label}</div>
              <a
                href={`mailto:${c.email}`}
                className="text-lg font-medium text-indigo-600 hover:underline"
              >
                {c.email}
              </a>
              <p className="text-gray-600 text-sm mt-1 leading-6">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-7 mt-12">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Before you email</h2>
            <p>
              Many questions are answered faster in our resources:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <Link href="/guide" className="text-indigo-600 hover:underline">Setup &amp; feature guide</Link>{' '}
                — step-by-step help for every feature.
              </li>
              <li>
                <Link href="/pricing" className="text-indigo-600 hover:underline">Pricing &amp; plans</Link>{' '}
                — what&apos;s included, billing, and the free trial.
              </li>
              <li>
                <Link href="/refund" className="text-indigo-600 hover:underline">Refunds &amp; cancellation</Link>{' '}
                — how to cancel and our money-back guarantee.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About Revova</h2>
            <p>
              Revova is an independently operated software product providing AI-powered payment
              recovery for subscription businesses. Billing is handled by our reseller (merchant of
              record), who appears on your statement and issues tax-compliant invoices. Learn more
              about us on the{' '}
              <Link href="/about" className="text-indigo-600 hover:underline">About</Link> page.
            </p>
          </section>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        </div>
      </footer>
    </div>
  )
}
