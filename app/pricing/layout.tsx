import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { softwareApplicationSchema, breadcrumbSchema } from '@/lib/seo'

// /pricing is a client component and can't export its own metadata, so this route
// layout supplies the pricing-specific title, description, canonical and JSON-LD.
export const metadata: Metadata = {
  title: 'Pricing — Recover $2,000/month, Pay $29',
  description:
    'Simple flat pricing for Revova AI payment recovery: Starter $29/mo, Pro $79/mo. 14-day free trial, no credit card, 30-day money-back guarantee. No commission on recovered revenue — up to 85% cheaper than Churnkey, Stunning and ChurnBuster.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Revova Pricing — Recover $2,000/month, Pay $29',
    description:
      'Starter $29/mo · Pro $79/mo. Flat pricing, no commission on recovered revenue, 30-day money-back guarantee.',
    url: '/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '' },
            { name: 'Pricing', path: 'pricing' },
          ]),
        ]}
      />
      {children}
    </>
  )
}
