// Central SEO / structured-data source of truth.
// Used by app/layout.tsx, app/page.tsx, app/pricing/layout.tsx, sitemap, robots, manifest.
// Keeping schema + visible FAQ content in one place prevents the two from drifting apart.

export const SITE = {
  name: 'Revova',
  // Strip any trailing slash so `${SITE.url}/path` never doubles up.
  url: (process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io').replace(/\/+$/, ''),
  tagline: 'AI-powered payment recovery for subscription businesses',
  description:
    'Revova is an AI payment-recovery tool for Stripe, Paddle, Braintree, Chargebee and Recurly that automatically wins back revenue lost to failed and declined charges — with AI-personalized dunning emails, smart retries, and a Lost Revenue Finder that scans your entire payment history.',
} as const

export type Faq = { q: string; a: string }

// The homepage FAQ — this array is the single source of truth. app/page.tsx renders it
// visibly and app/page.tsx also feeds it into faqPageSchema() so the FAQPage structured
// data always matches what a human sees (a Google requirement for FAQ rich results).
export const homeFaqs: Faq[] = [
  {
    q: `Can Revova show how much I've ALREADY lost to failed payments?`,
    a: `Yes — this is our signature Lost Revenue Finder, and no other recovery tool does it. The moment you connect your processor, Revova scans your entire payment history and shows exactly how much you lost to failures you never recovered: the last 30 days, 3 months, and up to 12 months. Then it can launch an AI win-back campaign to bring those customers back. Starter scans the last 90 days; Pro goes back a full 12 months. Every other tool only catches new failures going forward — Revova also recovers the ones you missed.`,
  },
  {
    q: `Is my data safe? What access does Revova need?`,
    a: `Revova only needs read-only access to your payment events (from Stripe, Paddle, Braintree, Chargebee, or Recurly). We never touch card data, never process payments beyond the retries you configure, and never store financial information. Data is encrypted in transit and at rest, and you can export or delete everything anytime.`,
  },
  {
    q: `Will these emails annoy my customers?`,
    a: `No — our AI writes emails that feel like they came from you personally, not a robot. They're warm, empathetic, and sent at the right time of day (8:30am customer timezone). Every email includes a one-click unsubscribe, and bounced or spam-flagged addresses are automatically suppressed to protect your sender reputation.`,
  },
  {
    q: `How long does setup take? Do I need a developer?`,
    a: `Literally 3 minutes. Paste your payment processor key, done. No code, no webhooks, no Zapier chains. If you can copy-paste, you can set up Revova.`,
  },
  {
    q: `Which payment processors do you support?`,
    a: `Stripe, Paddle, Braintree, Chargebee, and Recurly. Each runs on its own isolated pipeline, so you get the same full recovery experience no matter which one you use. Most recovery tools only work with Stripe — Revova doesn't lock you in.`,
  },
  {
    q: `Is Revova GDPR compliant and secure?`,
    a: `Yes. We use read-only payment access, encryption in transit and at rest, and per-account data isolation. You can export all your data or permanently delete your account in one click (Settings → Data & Privacy). A Data Processing Agreement (DPA) is available, and bounced/spam-flagged addresses are automatically suppressed to protect your sender reputation.`,
  },
  {
    q: `What's the difference between Starter ($29) and Pro ($79)?`,
    a: `Starter: up to 50 recoveries/month with a 4-email sequence (Day 1,3,7,14). Pro: unlimited recoveries with a 5-email sequence, hard/soft decline smart routing, emails in 8 languages, winback campaigns for cancelled customers, weekly digest reports, and priority support. If you have more than 50 failed payments per month or global customers, Pro pays for itself many times over.`,
  },
  {
    q: `I have less than $1K MRR. Is Revova worth it?`,
    a: `At $29/month you need to recover just 1 payment of $29 to break even. Even at $1K MRR you likely have 5–15 failed payments per month. If Revova doesn't recover more than $29 in your first 30 days, we'll give you a full refund.`,
  },
  {
    q: `How much will I actually recover?`,
    a: `It depends on your failure mix, but recovery rates are meaningful: Stripe's built-in retries alone typically recover about 30–40% of failed charges, and well-timed, personalized dunning emails on top of that can recover a large additional share — industry benchmarks commonly put total recoverable revenue in the 40–60% range. The Lost Revenue Finder shows you a real number from your own account before you commit to anything.`,
  },
  {
    q: `What's your money-back guarantee?`,
    a: `30-day full refund, no questions asked. If Revova doesn't recover more in revenue than it costs you in the first 30 days, email support@revova.io within 30 days of your first payment and we'll refund the full amount. See our Refund & Cancellation policy for details.`,
  },
  {
    q: `Does Revova work outside the US?`,
    a: `Yes. Revova works anywhere your payment processor (Stripe, Paddle, Braintree, Chargebee, Recurly) is available. We send emails in your customer's local timezone regardless of where they are, in 8 languages, with full multi-currency support.`,
  },
  {
    q: `Can I see which recovery email performs best?`,
    a: `Yes — the Analytics page shows open rate and click rate for each email in your sequence (Email #1 through #5). You can see exactly which email drives the most customers to update their card. Industry average is ~35% open rate and ~15% click rate.`,
  },
  {
    q: `Does Revova help reduce voluntary cancellations too?`,
    a: `Yes. When a customer clicks "Cancel" in your app, Revova can intercept with a cancellation survey — asking why they're leaving, then showing the most relevant retention offer. "Too expensive" → shows a discount. "Not using it" → offers a pause. This turns voluntary cancellations into data and saves customers at the same time.`,
  },
  {
    q: `Can Revova write recovery emails in languages other than English?`,
    a: `Yes — Pro plan supports 8 languages: English, French, Spanish, German, Portuguese, Dutch, Italian, and Japanese. Simply select your customers' language in Settings and every recovery email will be AI-written in that language.`,
  },
  {
    q: `What happens when a customer cancels? Can Revova win them back?`,
    a: `Yes. Pro plan includes Winback Campaigns. When a customer cancels their subscription, Revova automatically enrolls them in a 3-email AI re-engagement sequence — sent on Day 3, Day 14, and Day 30. You can optionally add a comeback discount code to the Day 30 email.`,
  },
]

// ---- Structured data (JSON-LD) builders ----

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon`,
    image: `${SITE.url}/opengraph-image`,
    description: SITE.description,
    slogan: 'Stop losing revenue to failed payments.',
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  }
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Payment Recovery & Dunning Software',
    operatingSystem: 'Web',
    url: SITE.url,
    description: SITE.description,
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter',
        price: '29',
        priceCurrency: 'USD',
        description: 'Up to 50 failed-payment recoveries per month, 4-email AI sequence, Lost Revenue Finder (90 days).',
        url: `${SITE.url}/pricing`,
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '79',
        priceCurrency: 'USD',
        description: 'Unlimited recoveries, 5-email AI sequence, 12-month Lost Revenue Finder, SMS, 8 languages, cancel flow & winback.',
        url: `${SITE.url}/pricing`,
      },
    ],
    featureList: [
      'AI-personalized recovery (dunning) emails',
      'Lost Revenue Finder — scans past failed payments',
      'Historical win-back campaigns',
      'Smart daily payment retries',
      'Pre-dunning before cards expire',
      'SMS recovery',
      'In-app cancel flow with retention offers',
      'Works with Stripe, Paddle, Braintree, Chargebee & Recurly',
      'Recovery emails in 8 languages',
      'GDPR data export & deletion',
    ],
  }
}

export function faqPageSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path ? `/${it.path}` : ''}`,
    })),
  }
}

// Article structured data for blog posts — helps Google rich results and lets
// AI answer engines (ChatGPT, Perplexity, Google AI Overviews) cite the post.
export function blogPostingSchema(post: {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  author?: string
}) {
  const url = `${SITE.url}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: post.author ?? SITE.name,
      image: `${SITE.url}/authors/sinh-yang.webp`,
      url: `${SITE.url}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon` },
    },
    image: `${SITE.url}/opengraph-image`,
  }
}
