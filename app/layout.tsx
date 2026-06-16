import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Revova — Stop Losing Revenue to Failed Payments',
    template: '%s | Revova',
  },
  description: 'AI-powered payment recovery for subscription businesses. Automatically recover failed payments with personalized AI emails. Recover 40–60% of failed charges on autopilot.',
  keywords: ['payment recovery', 'failed payment', 'dunning', 'SaaS churn', 'Stripe recovery', 'AI email'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Revova',
    title: 'Revova — Stop Losing Revenue to Failed Payments',
    description: 'AI-powered payment recovery for subscription businesses. Recover 40–60% of failed charges on autopilot.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Revova — AI Payment Recovery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revova — Stop Losing Revenue to Failed Payments',
    description: 'AI-powered payment recovery for subscription businesses.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  )
}
