import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, BarChart, CompareTable, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is the best Churnkey alternative?',
    a: 'For most teams leaving Churnkey to save money, Revova is the best value — it delivers the core recovery stack (AI dunning emails, smart retries, pre-dunning, cancel flow) at a flat $29–$79/month, works with five processors, and uniquely recovers past failed payments. Churn Buster and Stunning are solid Stripe-focused alternatives, and Paddle Retain is worth a look if you prefer paying a percentage only on recovered revenue.',
  },
  {
    q: 'How much does Churnkey cost?',
    a: 'Churnkey is a premium tool; its public plans have historically started around $199+/month, with custom enterprise pricing above that. That price is easy to justify at higher MRR, but it is what leads many smaller teams to look for a cheaper alternative that still recovers failed payments.',
  },
  {
    q: 'Why do people look for Churnkey alternatives?',
    a: 'The most common reasons are price (it is expensive for small and mid-size teams), complexity (more product than a solo founder needs), being Stripe-centric (no good fit for Paddle, Braintree, Chargebee or Recurly), and the lack of historical recovery — Churnkey recovers new failures going forward but does not scan your back-catalogue for money already lost.',
  },
  {
    q: 'Is there a free alternative to Churnkey?',
    a: 'Sort of. Stripe’s built-in Smart Retries and basic dunning emails are free and recover roughly 30–40% of failed charges — a good starting point. But they do not personalize emails per decline reason, handle pre-dunning, or recover past failures, which is why most teams add a low-cost dedicated tool on top.',
  },
  {
    q: 'How hard is it to switch from Churnkey?',
    a: 'Not hard — it is a no-code change. You connect your payment processor to the new tool with a single key, recreate (or accept default) recovery settings, confirm it is running, then turn Churnkey off. Most teams complete the switch in an afternoon with no engineering.',
  },
  {
    q: 'Will I recover less revenue with a cheaper tool?',
    a: 'Not necessarily. The core drivers of recovery — smart retries plus personalized, well-timed dunning emails — are available in far cheaper tools. The main thing to check is that your alternative covers your processor, handles SCA, and ideally can recover past failures, which some premium tools do not.',
  },
]

// Annual cost comparison — two vertical bars showing the yearly gap. width/height set.
function AnnualCost() {
  const items = [
    { label: 'Churnkey', yr: 2388, color: '#94a3b8', per: '$199/mo' },
    { label: 'Revova', yr: 348, color: '#4f46e5', per: '$29/mo' },
  ]
  const max = 2388, baseY = 250, top = 46, x = [240, 470], bw = 120
  const hFor = (v: number) => Math.max(6, (v / max) * (baseY - top))
  return (
    <figure className="my-8">
      <svg viewBox="0 0 760 300" width="760" height="300" className="w-full h-auto" role="img"
        aria-label="Annual cost: Churnkey about $2,388 per year versus Revova about $348 per year">
        <line x1="60" y1={baseY} x2="700" y2={baseY} stroke="#e5e7eb" strokeWidth="1.5" />
        {items.map((it, i) => {
          const h = hFor(it.yr)
          return (
            <g key={i} fontFamily="Segoe UI, Arial, sans-serif">
              <rect x={x[i]} y={baseY - h} width={bw} height={h} rx="8" fill={it.color} />
              <text x={x[i] + bw / 2} y={baseY - h - 12} textAnchor="middle" fontSize="20" fontWeight="800" fill="#111827">${it.yr.toLocaleString()}</text>
              <text x={x[i] + bw / 2} y={baseY + 24} textAnchor="middle" fontSize="15" fontWeight="700" fill="#374151">{it.label}</text>
              <text x={x[i] + bw / 2} y={baseY + 44} textAnchor="middle" fontSize="12.5" fill="#9ca3af">{it.per}</text>
            </g>
          )
        })}
        <g transform="translate(620,120)" fontFamily="Segoe UI, Arial, sans-serif">
          <rect x="-16" y="-30" width="150" height="76" rx="14" fill="#ecfdf5" stroke="#6ee7b7" />
          <text x="59" y="-2" textAnchor="middle" fontSize="15" fontWeight="700" fill="#065f46">You save</text>
          <text x="59" y="26" textAnchor="middle" fontSize="22" fontWeight="800" fill="#059669">$2,040/yr</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">Approximate annual cost at entry pricing (Churnkey ~$199/mo vs Revova Starter $29/mo).</figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        The best Churnkey alternatives in 2026 are <Strong>Revova</Strong>, <Strong>Churn Buster</Strong>,
        <Strong> Stunning</Strong>, <Strong>Baremetrics Recover</Strong>, and <Strong>Paddle Retain</Strong>
        {' '}— most of them a fraction of Churnkey&apos;s ~$199+/month price. Here&apos;s how they compare,
        and which one fits if you&apos;re leaving Churnkey for cost, simplicity, or a non-Stripe processor.
      </Lead>
      <P>
        Churnkey is a genuinely good product — a polished, full retention suite. But it is priced for
        scaling, well-funded SaaS, and that puts it out of reach for a lot of indie hackers and
        small-to-mid teams who just want their failed payments recovered. The good news: the core of
        what Churnkey does — smart retries and personalized dunning emails — is available in tools that
        cost a fraction as much. This guide ranks the alternatives and shows you how to switch.
      </P>

      <KeyTakeaways
        items={[
          <><Strong>Revova</Strong> is the best-value alternative: the core recovery stack at $29–$79/mo flat, five processors, and it recovers <em>past</em> failures too.</>,
          <>Churnkey starts around <Strong>$199+/month</Strong> — the main reason smaller teams look elsewhere.</>,
          <>Switching is a <Strong>no-code change</Strong> you can finish in an afternoon.</>,
          <>Check three things in any alternative: your <Strong>processor</Strong>, <Strong>SCA handling</Strong>, and whether it recovers <Strong>historical</Strong> failures.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '$199+/mo', label: 'Churnkey starting price' },
          { value: 'from $29', label: 'best alternatives start here' },
          { value: 'up to 85%', label: 'cheaper for the core outcome' },
        ]}
      />

      <H2 id="why-alternatives">Why teams look for a Churnkey alternative</H2>
      <P>
        To be fair to Churnkey: if you are a scaling SaaS doing serious MRR, it may be exactly right,
        and price is a non-issue. Most people searching for an alternative are leaving for one of four
        reasons:
      </P>
      <UL>
        <LI><Strong>Price.</Strong> ~$199+/month is a lot when you are under $50k MRR — it can eat much of the revenue you recover.</LI>
        <LI><Strong>Complexity.</Strong> It is a full suite; a solo founder often needs far less product and a faster setup.</LI>
        <LI><Strong>Processor lock-in.</Strong> It is Stripe-centric — not ideal if you bill on Paddle, Braintree, Chargebee, or Recurly.</LI>
        <LI><Strong>No historical recovery.</Strong> Like most tools, it recovers new failures going forward but cannot scan your history for money already lost.</LI>
      </UL>

      <H2 id="cost">Churnkey alternatives by monthly cost</H2>
      <P>
        Price is usually the trigger for switching, so start here. These are approximate entry prices —
        Paddle Retain is excluded because it charges a percentage of recovered revenue rather than a
        flat fee.
      </P>
      <BarChart
        bars={[
          { label: 'Churnkey', pct: 100, value: '~$199' },
          { label: 'Churn Buster', pct: 75, value: '~$149' },
          { label: 'Baremetrics Recover', pct: 65, value: '~$129' },
          { label: 'Stunning', pct: 50, value: '~$100' },
          { label: 'Revova', pct: 15, value: '$29' },
        ]}
        caption="Approximate monthly entry prices. Always confirm current pricing on each vendor’s site."
      />

      <H2 id="alternatives">The 6 best Churnkey alternatives</H2>
      <P>
        Ranked by how well they fit a typical team leaving Churnkey. For deeper reviews of each, see our
        full{' '}
        <A href="/blog/best-payment-recovery-dunning-tools-2026">roundup of the best payment recovery tools</A>.
      </P>

      <H3>1. Revova — best overall value</H3>
      <P>
        Revova delivers the core of what Churnkey does — AI-personalized dunning emails, smart daily
        retries, pre-dunning, and an in-app cancel flow — at a flat <A href="/pricing">$29–$79/month</A>,
        with no commission on recovered revenue. It works with five processors (Stripe, Paddle,
        Braintree, Chargebee, Recurly), and its Lost Revenue Finder recovers the failures you have{' '}
        <em>already</em> lost — something Churnkey does not do. <Strong>Best for:</Strong> teams leaving
        Churnkey for cost, simplicity, a non-Stripe processor, or to recover past revenue.
      </P>

      <H3>2. Churn Buster — proven Stripe dunning specialist</H3>
      <P>
        A long-standing, focused recovery tool with a strong deliverability reputation. Pricing
        (typically from ~$149/month) is below Churnkey but still mid-market. <Strong>Best for:</Strong>{' '}
        established Stripe businesses that want a proven specialist and don&apos;t need the full suite.
      </P>

      <H3>3. Stunning — simple, affordable Stripe dunning</H3>
      <P>
        One of the original Stripe dunning tools; straightforward failed-payment emails and
        expiring-card notifications, commonly from ~$100/month. <Strong>Best for:</Strong> Stripe
        businesses that want reliable, uncomplicated dunning.
      </P>

      <H3>4. Baremetrics Recover — if you already use Baremetrics</H3>
      <P>
        A dunning add-on to the Baremetrics analytics platform. It only makes financial sense if you
        already pay for Baremetrics, since the real cost is the analytics subscription plus the add-on.
        <Strong> Best for:</Strong> existing Baremetrics customers.
      </P>

      <H3>5. Paddle Retain — pay only on results</H3>
      <P>
        Formerly ProfitWell Retain, it charges a percentage of the revenue it recovers instead of a flat
        fee. Appealing if you prefer aligning cost with results, though the cut grows with your recovered
        volume. <Strong>Best for:</Strong> teams who prefer pay-on-results and live in the Paddle
        ecosystem.
      </P>

      <H3>6. Stripe&apos;s built-in Smart Retries — the free starting point</H3>
      <P>
        Not a full alternative, but worth naming: Stripe&apos;s own Smart Retries and basic dunning
        emails are free and recover ~30–40% of failed charges. <Strong>Best for:</Strong> teams just
        starting out who want to capture the easy wins before adding a dedicated tool. See our guide on{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">recovering failed Stripe payments</A>.
      </P>

      <InlineCTA>
        Leaving Churnkey to save money? Revova gives you the core recovery stack at $29–$79/mo flat — and
        recovers your past failures too. Start free, no card, see your numbers first.
      </InlineCTA>

      <H2 id="comparison">Churnkey alternatives compared</H2>
      <CompareTable
        rows={[
          ['Alternative', 'Starting price', 'Processors', 'Historical recovery', 'Best for'],
          ['Revova', '$29/mo flat', 'Stripe, Paddle, Braintree, Chargebee, Recurly', 'Yes', 'Best value; non-Stripe; past revenue'],
          ['Churn Buster', '~$149/mo', 'Stripe-centric', 'No', 'Established Stripe teams'],
          ['Stunning', '~$100/mo', 'Stripe', 'No', 'Simple Stripe dunning'],
          ['Baremetrics Recover', 'Add-on (~$129/mo+)', 'Stripe-oriented', 'No', 'Existing Baremetrics users'],
          ['Paddle Retain', '% of recovered', 'Paddle / ProfitWell', 'No', 'Pay-on-results'],
          ['Stripe Smart Retries', 'Free', 'Stripe', 'No', 'Getting started'],
        ]}
      />

      <H2 id="savings">How much you save switching from Churnkey</H2>
      <P>
        The gap is stark once you annualize it. At entry pricing, moving from Churnkey to Revova Starter
        saves over <Strong>$2,000 a year</Strong> — money that goes straight back into your business
        while you keep the same core recovery:
      </P>
      <AnnualCost />

      <H2 id="which">Which alternative should you pick?</H2>
      <UL>
        <LI><Strong>Leaving mainly for price</Strong> → Revova ($29–79 flat) or Stunning.</LI>
        <LI><Strong>You prefer pay-on-results</Strong> → Paddle Retain.</LI>
        <LI><Strong>You&apos;re not on Stripe</Strong> → Revova (built for five processors).</LI>
        <LI><Strong>You want to recover past failures</Strong> → Revova&apos;s Lost Revenue Finder.</LI>
        <LI><Strong>You already pay for Baremetrics</Strong> → Baremetrics Recover.</LI>
        <LI><Strong>You just want the free basics first</Strong> → Stripe Smart Retries, then add a tool.</LI>
      </UL>

      <H2 id="how-to-switch">How to switch from Churnkey (no code)</H2>
      <OL>
        <LI><Strong>Note your current setup.</Strong> Jot down your Churnkey email sequence timing and any cancel-flow offers so you can recreate them.</LI>
        <LI><Strong>Pick your alternative</Strong> from the list above based on your reason for leaving.</LI>
        <LI><Strong>Connect your processor.</Strong> Paste your payment key into the new tool — no webhooks or engineering for a tool like Revova.</LI>
        <LI><Strong>Recreate your sequence</Strong> (or accept sensible defaults) and, if available, run a historical scan to catch past failures.</LI>
        <LI><Strong>Confirm it&apos;s live, then turn Churnkey off</Strong> and cancel to stop the bill.</LI>
      </OL>
      <Callout title="Avoid double-emailing during the switch">
        Run the new tool and Churnkey in parallel for only a short overlap, and turn off Churnkey&apos;s
        emails as soon as the new sequence is confirmed working — so a customer with a failed payment
        never gets recovery emails from both at once.
      </Callout>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="The same recovery, for a fraction of Churnkey"
        body="Revova recovers failed payments with AI dunning emails, smart retries and pre-dunning — flat $29–$79/month, five processors, and it finds the revenue you've already lost. Start free and see your number before you switch."
      />
    </>
  )
}
