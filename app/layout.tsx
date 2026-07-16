import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/json-ld'
import { CookieConsent } from '@/components/consent/cookie-consent'
import { SignupEventListener } from '@/components/analytics/signup-listener'
import { SITE, organizationSchema, websiteSchema, softwareApplicationSchema } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Revova — Stop Losing Revenue to Failed Payments',
    template: '%s | Revova',
  },
  description: 'AI-powered payment recovery for subscription businesses. Automatically recover failed payments with personalized AI emails. Recover 40–60% of failed charges on autopilot.',
  applicationName: 'Revova',
  keywords: [
    'payment recovery',
    'failed payment recovery',
    'dunning software',
    'dunning management',
    'reduce involuntary churn',
    'SaaS churn reduction',
    'Stripe payment recovery',
    'recover failed subscription payments',
    'AI dunning emails',
    'Churnkey alternative',
    'ChurnBuster alternative',
  ],
  authors: [{ name: 'Revova', url: SITE.url }],
  creator: 'Revova',
  publisher: 'Revova',
  category: 'technology',
  metadataBase: new URL(SITE.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Revova',
    title: 'Revova — Stop Losing Revenue to Failed Payments',
    description: 'AI-powered payment recovery for subscription businesses. Recover 40–60% of failed charges on autopilot.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revova — Stop Losing Revenue to Failed Payments',
    description: 'AI-powered payment recovery for subscription businesses.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  // Site ownership verification.
  // - Google Search Console: fixed token below → <meta name="google-site-verification">.
  // - Meta (Facebook) domain verification: set NEXT_PUBLIC_FB_DOMAIN_VERIFICATION.
  verification: {
    google: 'sg9J4HHY1AJN8NDnaeZOXdkBvLEytr9mM-mAt6g-PYo',
    ...(process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION
      ? { other: { 'facebook-domain-verification': process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION } }
      : {}),
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#060612' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full`}>
        <JsonLd data={[organizationSchema(), websiteSchema(), softwareApplicationSchema()]} />
        {children}
        <CookieConsent />
        <SignupEventListener />
      </body>
    </html>
  )
}
