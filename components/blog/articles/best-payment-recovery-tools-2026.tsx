import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, FAQ,
} from '@/components/blog/prose'

// Inline, responsive SVG diagrams — crisp at any size and only a few hundred
// bytes each (lighter than any raster). Diagrams stay SVG; only hero art is AVIF.
function RecoveryPipeline() {
  const nodes = [
    { label: 'Failed charge', fill: '#fff1f2', stroke: '#fda4af', text: '#9f1239' },
    { label: 'Smart retry', fill: '#eef2ff', stroke: '#a5b4fc', text: '#3730a3' },
    { label: 'AI recovery email', fill: '#eef2ff', stroke: '#a5b4fc', text: '#3730a3' },
    { label: 'Recovered', fill: '#ecfdf5', stroke: '#6ee7b7', text: '#065f46' },
  ]
  const bw = 158, h = 60, gap = 30, y = 34
  return (
    <figure className="my-8">
      <svg viewBox="0 0 752 116" className="w-full h-auto" role="img" aria-label="How Revova recovers a failed payment: failed charge, smart retry, AI recovery email, recovered">
        {nodes.map((n, i) => {
          const x = i * (bw + gap)
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw} height={h} rx="12" fill={n.fill} stroke={n.stroke} strokeWidth="1.5" />
              <text x={x + bw / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="600" fill={n.text} fontFamily="Segoe UI, Arial, sans-serif">{n.label}</text>
              {i < nodes.length - 1 && (
                <g stroke="#cbd5e1" strokeWidth="2" fill="none">
                  <line x1={x + bw} y1={y + h / 2} x2={x + bw + gap} y2={y + h / 2} />
                  <path d={`M${x + bw + gap - 7} ${y + h / 2 - 5} l6 5 l-6 5`} />
                </g>
              )}
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">How a single failed charge is recovered — automatically.</figcaption>
    </figure>
  )
}

function DunningCadence() {
  const steps = [
    { day: 'Day 1', email: 'Email 1' },
    { day: 'Day 3', email: 'Email 2' },
    { day: 'Day 7', email: 'Email 3' },
    { day: 'Day 14', email: 'Email 4' },
    { day: 'Day 21', email: 'Email 5' },
  ]
  const x0 = 60, x1 = 692, y = 62
  return (
    <figure className="my-8">
      <svg viewBox="0 0 752 110" className="w-full h-auto" role="img" aria-label="A typical dunning email cadence: emails on day 1, 3, 7, 14 and 21">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#e5e7eb" strokeWidth="3" />
        {steps.map((s, i) => {
          const x = x0 + (i * (x1 - x0)) / (steps.length - 1)
          return (
            <g key={i} fontFamily="Segoe UI, Arial, sans-serif">
              <text x={x} y={y - 22} textAnchor="middle" fontSize="12" fontWeight="600" fill="#4f46e5">{s.email}</text>
              <circle cx={x} cy={y} r="8" fill="#4f46e5" stroke="#fff" strokeWidth="2" />
              <text x={x} y={y + 28} textAnchor="middle" fontSize="13" fontWeight="600" fill="#374151">{s.day}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">A typical recovery email cadence (Pro plan, 5 emails). Each is AI-written for the decline reason.</figcaption>
    </figure>
  )
}

// FAQ lives in one array so the visible Q&A (rendered below) and the FAQPage
// JSON-LD (emitted in app/blog/[slug]/page.tsx) are always word-for-word identical.
export const faqs: Faq[] = [
  {
    q: 'What is the best payment recovery tool in 2026?',
    a: 'There is no single winner — it depends on your stage and stack. Churnkey is the most polished premium suite for well-funded, scaling SaaS. Revova is the best value for indie hackers and small-to-mid teams, and the only tool that also recovers payments you have already lost. Paddle Retain suits teams who prefer paying a percentage only on recovered revenue. Churn Buster and Stunning are solid Stripe-focused specialists.',
  },
  {
    q: 'What is involuntary churn?',
    a: 'Involuntary churn is when a subscriber leaves not because they chose to, but because a payment failed — an expired card, insufficient funds, or a bank decline — and was never recovered. It typically accounts for 5–10% of revenue and is highly recoverable because the customer still wants your product.',
  },
  {
    q: 'How much revenue can a recovery tool actually win back?',
    a: 'It varies by your failure mix, but the range is meaningful. Stripe’s built-in retries alone recover roughly 30–40% of failed charges, and well-timed, personalized dunning on top of that pushes total recoverable revenue into the 40–60% range in many cases. The honest way to find your number is to scan your own history rather than trust an average.',
  },
  {
    q: 'Do payment recovery tools work with processors other than Stripe?',
    a: 'Most do not — Churnkey, Churn Buster, Stunning and Baremetrics Recover are Stripe-centric. If you use Paddle, Braintree, Chargebee or Recurly, your options narrow. Revova was built to work across all five processors on isolated pipelines, which makes it the natural choice for non-Stripe businesses.',
  },
  {
    q: 'Is flat pricing or percentage-of-recovered pricing better?',
    a: 'Percentage pricing feels safe early because you only pay when revenue is recovered — but as you grow, that cut becomes a permanent tax on your own revenue. Flat pricing has a small fixed cost but keeps 100% of the upside as you scale. For most growing businesses, flat wins over time.',
  },
  {
    q: 'Are payment recovery tools hard to set up?',
    a: 'It varies. Some enterprise tools involve webhooks and a little engineering; others are a paste-your-processor-key-and-go setup that takes a few minutes. If you are a non-technical founder, prioritize tools that do not require a developer — Revova, for example, connects with a single key and no code.',
  },
]

// Article body for /blog/best-payment-recovery-dunning-tools-2026
export default function Article() {
  return (
    <>
      <Lead>
        The best payment recovery (dunning) tools in 2026 are <Strong>Churnkey</Strong>,{' '}
        <Strong>Churn Buster</Strong>, <Strong>Stunning</Strong>,{' '}
        <Strong>Baremetrics Recover</Strong>, <Strong>Paddle Retain</Strong>, and{' '}
        <Strong>Revova</Strong> — and the right one depends on your payment processor, your MRR, and
        whether you want to recover only new failures or the revenue you have <em>already</em> lost.
      </Lead>
      <P>
        If you run a subscription business, somewhere between 5% and 10% of your revenue is quietly
        leaking out through failed payments — expired cards, insufficient funds, and bank declines you
        never followed up on. It is called <Strong>involuntary churn</Strong>, and it is the cheapest
        revenue you will ever win back, because these customers already wanted to pay you. This guide
        compares the six best tools that automate that recovery — honestly, including our own — so you
        can pick the one that fits.
      </P>

      <KeyTakeaways
        items={[
          <><Strong>Churnkey</Strong> is the most polished premium suite — best for well-funded, scaling SaaS with a budget.</>,
          <><Strong>Revova</Strong> is the best value and the only tool here that also recovers <em>past</em> failed payments — plus it works across five processors, not just Stripe.</>,
          <><Strong>Paddle Retain</Strong> charges a percentage of recovered revenue — appealing early, expensive at scale.</>,
          <>Most tools are Stripe-only, so <Strong>check your processor first</Strong> — it narrows the field fastest.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription revenue lost to failed payments' },
          { value: '30–40%', label: 'recovered by Stripe’s built-in retries alone' },
          { value: '40–60%', label: 'typically recoverable with good dunning' },
        ]}
      />

      <H2 id="what-is-dunning">First, what a payment recovery tool actually does</H2>
      <P>
        A payment recovery tool automates everything that should happen when a subscription charge
        fails: it retries the card at smart intervals, nudges the customer to update their payment
        method, and — if they still do not act — gives you a graceful way to pause or cancel without
        losing them forever. Doing this by hand is miserable and easy to forget.
      </P>
      <P>The best tools combine several layers:</P>
      <UL>
        <LI><Strong>Smart retries</Strong> — re-attempting the charge on the days a card is most likely to succeed (like payday windows), not just once. This builds on your processor&apos;s own logic, such as <A href="https://stripe.com/docs/billing/revenue-recovery/smart-retries">Stripe Smart Retries</A>.</LI>
        <LI><Strong>Dunning emails</Strong> — a timed sequence asking the customer to update their card, ideally personalized to the exact decline reason (<code>insufficient_funds</code> needs a different message and timing than <code>expired_card</code>).</LI>
        <LI><Strong>Pre-dunning</Strong> — warning customers <em>before</em> a card expires, so the failure never happens.</LI>
        <LI><Strong>Cancellation / retention flows</Strong> — intercepting voluntary cancellations with a pause or discount offer.</LI>
        <LI><Strong>Analytics</Strong> — showing recovery rate and revenue saved so you know it is working.</LI>
      </UL>

      <RecoveryPipeline />

      <H2 id="how-to-choose">How to choose: five questions that matter</H2>
      <P>
        Before comparing brands, get clear on your own situation. These five questions decide which
        tool is right far more than any feature list:
      </P>
      <OL>
        <LI><Strong>Which payment processor do you use?</Strong> Many recovery tools are Stripe-only. If you use Paddle, Braintree, Chargebee, or Recurly, your options narrow quickly.</LI>
        <LI><Strong>What&apos;s your MRR?</Strong> A $199/month tool is trivial at $50k MRR and absurd at $2k MRR. Match the price to the revenue you&apos;re protecting.</LI>
        <LI><Strong>Flat fee or a cut of recovered revenue?</Strong> Percentage pricing feels risk-free but gets expensive as you grow. Flat pricing keeps the upside yours.</LI>
        <LI><Strong>Do you have past losses to recover?</Strong> Most tools only catch <em>new</em> failures going forward. If you&apos;ve been running for a while, there may be thousands in old, never-followed-up failures.</LI>
        <LI><Strong>How much setup can you stomach?</Strong> Some tools need engineering and webhooks; others are a paste-your-key-and-go affair.</LI>
      </OL>

      <Divider />

      <H2 id="churnkey">1. Churnkey — best for scaling SaaS with a budget</H2>
      <P>
        Churnkey is the premium, full-suite option. It goes well beyond dunning into cancellation
        flows, precise segmentation, reactivation campaigns, and detailed retention analytics. The
        product is genuinely well built, and the team publishes some of the best retention content in
        the industry.
      </P>
      <P>
        <Strong>Best for:</Strong> venture-backed or profitable SaaS doing meaningful MRR, where a
        percentage point of retention is worth a lot. <Strong>Pricing:</Strong> premium — public plans
        have historically started around $199+/month with custom enterprise tiers. Always check their
        current pricing page.
      </P>
      <ProsCons
        pros={[
          'Deep, polished feature set across the whole retention lifecycle.',
          'Strong cancellation-flow builder with A/B testing.',
          'Excellent analytics and segmentation.',
        ]}
        cons={[
          'Expensive for small teams — the entry price rules out most indie hackers.',
          'More product than a solo founder needs; there is a learning curve.',
          'Recovers failures going forward, not your back-catalogue of past losses.',
        ]}
      />

      <H2 id="churnbuster">2. Churn Buster — a long-standing Stripe dunning specialist</H2>
      <P>
        Churn Buster has been in the dunning space for years and has a solid reputation for
        deliverability and clean, effective recovery emails. It focuses on doing failed-payment
        recovery well rather than trying to be an all-in-one retention suite.
      </P>
      <P>
        <Strong>Best for:</Strong> established Stripe-based businesses that want a proven,
        recovery-focused tool. <Strong>Pricing:</Strong> typically starts around $149/month and scales
        with the payment volume you process. Verify current tiers before committing.
      </P>
      <ProsCons
        pros={[
          'Battle-tested recovery emails with a focus on inbox deliverability.',
          'Good support and years of domain expertise.',
          'Clean, focused product — not bloated.',
        ]}
        cons={[
          'Primarily Stripe-centric.',
          'Pricing scales with volume, which can climb as you grow.',
          'No backward scan of historical failures you have already lost.',
        ]}
      />

      <H2 id="stunning">3. Stunning — simple, Stripe-focused dunning</H2>
      <P>
        Stunning is one of the original Stripe dunning tools. It handles failed-payment emails,
        credit-card expiration notifications, and basic recovery workflows with a straightforward,
        no-frills approach.
      </P>
      <P>
        <Strong>Best for:</Strong> Stripe businesses that want reliable, uncomplicated dunning without
        a big feature surface to manage. <Strong>Pricing:</Strong> tiered, commonly starting around
        $100/month and rising with higher-volume plans. Check the latest pricing directly.
      </P>
      <ProsCons
        pros={[
          'Simple and reliable; easy to understand.',
          'Solid pre-dunning (expiring-card) notifications.',
          'Long track record with Stripe.',
        ]}
        cons={[
          'Stripe only.',
          'Limited AI personalization and lighter analytics.',
          'No historical-loss recovery.',
        ]}
      />

      <H2 id="baremetrics">4. Baremetrics Recover — best if you already use Baremetrics</H2>
      <P>
        Recover is the dunning add-on to Baremetrics, the well-known subscription analytics platform.
        If you already live inside Baremetrics for your metrics, bolting on Recover to chase failed
        payments keeps everything in one dashboard.
      </P>
      <P>
        <Strong>Best for:</Strong> teams already paying for Baremetrics analytics who want recovery in
        the same place. <Strong>Pricing:</Strong> Recover is an add-on on top of a Baremetrics
        subscription (analytics starting around $129/month), so it is pricey if you only want dunning.
      </P>
      <ProsCons
        pros={[
          'Recovery and analytics in a single, familiar tool.',
          'Good reporting on what recovery is doing to your metrics.',
        ]}
        cons={[
          'Only makes financial sense if you already pay for Baremetrics.',
          'Stripe-oriented.',
          'Overkill and overpriced if all you need is dunning.',
        ]}
      />

      <H2 id="retain">5. Paddle Retain (formerly ProfitWell Retain) — pay only on results</H2>
      <P>
        Retain, now part of Paddle, is the best-known performance-priced recovery product. Instead of
        a flat monthly fee, it takes a percentage of the revenue it recovers for you. That is
        appealing because it feels risk-free: if it recovers nothing, you pay nothing.
      </P>
      <P>
        <Strong>Best for:</Strong> teams who prefer aligning cost with results and do not mind giving
        up a slice of recovered revenue. <Strong>Pricing:</Strong> performance-based — you pay a
        percentage of what it successfully recovers. Confirm the exact cut and terms with Paddle.
      </P>
      <ProsCons
        pros={[
          'No upfront monthly fee — cost only appears when revenue does.',
          'Backed by Paddle’s scale and data.',
          'Genuinely low risk to try.',
        ]}
        cons={[
          'Percentage pricing gets expensive as recovered volume grows — a permanent tax on your revenue.',
          'Less control and transparency than a flat-fee tool you run yourself.',
          'Best fit is tied to the Paddle / ProfitWell ecosystem.',
        ]}
      />

      <H2 id="revova">6. Revova — best value, and the only one that recovers your past losses</H2>
      <P>
        Revova (that&apos;s us — and we&apos;ll keep this fair) was built for the founders the premium
        tools price out: indie hackers, solo founders, and small-to-mid SaaS teams. It delivers the
        core of what the expensive suites do — AI-personalized dunning emails, smart daily retries,
        pre-dunning, and an in-app cancel flow — at a flat <A href="/pricing">$29–$79/month</A> with no
        commission on recovered revenue.
      </P>
      <P>
        Two things make it different. First, it works with <Strong>five processors</Strong> — Stripe,
        Paddle, Braintree, Chargebee, and Recurly — not just Stripe. Second, and most unusual, its{' '}
        <Strong>Lost Revenue Finder</Strong> scans your entire payment history the moment you connect
        and shows exactly how much you&apos;ve <em>already</em> lost to failures nobody followed up on
        — then launches AI win-back campaigns for those old failures. Every other tool on this list
        only catches failures from the day you install it forward.
      </P>
      <P>
        <Strong>Best for:</Strong> founders under (roughly) $50k MRR who want most of Churnkey&apos;s
        outcome without Churnkey&apos;s bill, who aren&apos;t on Stripe, or who&apos;ve been operating
        for a while and suspect there&apos;s recoverable money in their back-catalogue.{' '}
        <Strong>Pricing:</Strong> flat — Starter $29/month, Pro $79/month, a 14-day free trial with no
        credit card, and a 30-day money-back guarantee.
      </P>
      <ProsCons
        pros={[
          'Dramatically cheaper than the premium suites for a similar core outcome.',
          'The only tool here that recovers past failed payments, not just new ones.',
          'Works across five payment processors, not just Stripe.',
          'AI writes a unique email per decline reason; setup takes ~3 minutes, no code.',
          'Flat fee — no commission on the revenue it recovers.',
        ]}
        cons={[
          'Newer than the incumbents — no decade-long brand behind us yet.',
          'Focused on recovery and retention; not a full analytics platform like Baremetrics.',
          'Enterprise teams needing heavy custom workflows may still prefer a premium suite.',
        ]}
      />

      <Callout title="An honest note on our own bias">
        Yes, Revova is our product, so read this section with healthy skepticism. Here&apos;s the
        thing though: you don&apos;t have to trust our word on the money. Connect your processor and
        the free Lost Revenue Finder shows you a real number from your <em>own</em> account before you
        pay anything. That&apos;s the whole pitch — see it first, then decide.
      </Callout>

      <InlineCTA>
        Curious what Revova would cost you? It&apos;s a flat $29 or $79 a month — no commission on what
        it recovers — with a 14-day free trial and no card required.
      </InlineCTA>

      <Divider />

      <H2 id="comparison">Side-by-side comparison</H2>
      <P>
        Prices below are approximate 2026 entry points and change often — always confirm on each
        vendor&apos;s current pricing page. &quot;Historical recovery&quot; means the tool can scan and
        win back payments that failed <em>before</em> you installed it.
      </P>
      <CompareTable
        rows={[
          ['Tool', 'Starting price', 'Processors', 'Historical recovery', 'Best for'],
          ['Revova', '$29/mo flat', 'Stripe, Paddle, Braintree, Chargebee, Recurly', 'Yes — Lost Revenue Finder', 'Indie & small–mid SaaS, non-Stripe, best value'],
          ['Churnkey', '~$199+/mo', 'Stripe-centric', 'No', 'Scaling SaaS with budget'],
          ['Churn Buster', '~$149+/mo', 'Stripe-centric', 'No', 'Established Stripe businesses'],
          ['Stunning', '~$100+/mo', 'Stripe', 'No', 'Simple Stripe dunning'],
          ['Baremetrics Recover', 'Add-on to Baremetrics (~$129+/mo)', 'Stripe-oriented', 'No', 'Existing Baremetrics users'],
          ['Paddle Retain', '% of recovered revenue', 'Paddle / ProfitWell ecosystem', 'No', 'Pay-on-results preference'],
        ]}
      />

      <H2 id="pick-by-situation">Which one should you pick? By situation</H2>
      <H3>You&apos;re an indie hacker or solo founder (under ~$10k MRR)</H3>
      <P>
        The premium suites are overkill and their price tags will eat your recovered revenue. Start
        with <A href="/signup">Revova</A> ($29/month) or, if you strongly prefer pay-on-results,{' '}
        <A href="#retain">Paddle Retain</A>. Run the free Lost Revenue scan first so you know what
        you&apos;re actually recovering.
      </P>
      <H3>You&apos;re a scaling SaaS ($50k+ MRR) that lives on Stripe</H3>
      <P>
        A fraction of a point of retention is real money at your size, so a premium tool pays for
        itself. Look hard at <A href="#churnkey">Churnkey</A> for the full suite, or{' '}
        <A href="#churnbuster">Churn Buster</A> if you want a focused, proven dunning specialist.
      </P>
      <H3>You&apos;re not on Stripe</H3>
      <P>
        This narrows the field fast — most tools here are Stripe-first. Revova is the option built for
        Paddle, Braintree, Chargebee, and Recurly on isolated pipelines, so it&apos;s the natural
        starting point.
      </P>
      <H3>You&apos;ve been running for a year or more</H3>
      <P>
        You almost certainly have failed payments from months ago that were never chased. Only a tool
        with historical recovery can go get that money — which today means Revova&apos;s Lost Revenue
        Finder. Even if you ultimately choose another tool for ongoing dunning, it&apos;s worth running
        the free scan to see the number.
      </P>

      <InlineCTA>
        Been running for a while? See how much you&apos;ve <em>already</em> lost to failed payments — the
        free Lost Revenue scan reads your own history, going back up to 12 months.
      </InlineCTA>

      <H2 id="tips">Five tips to recover more, whichever tool you choose</H2>
      <OL>
        <LI><Strong>Personalize by decline reason.</Strong> <code>insufficient_funds</code> and <code>expired_card</code> need different messages and timing. Generic &quot;your payment failed&quot; emails underperform badly.</LI>
        <LI><Strong>Retry on the right days.</Strong> Cards are far more likely to succeed around payday windows. Blind daily retries burn processor goodwill; smart retries win.</LI>
        <LI><Strong>Send at a human hour.</Strong> A recovery email that lands at 8:30am in the customer&apos;s own timezone gets opened; one that lands at 3am doesn&apos;t.</LI>
        <LI><Strong>Protect your sender reputation.</Strong> Always include one-click unsubscribe and suppress bounced or complaint addresses, or your recovery emails will start landing in spam.</LI>
        <LI><Strong>Recover the past, not just the future.</Strong> The single biggest missed opportunity in dunning is old failures nobody ever followed up on. Scan backward before you do anything else.</LI>
      </OL>

      <DunningCadence />

      <Callout title="A note on SCA and 3D Secure">
        If you sell to customers in Europe, some declines are caused by{' '}
        <A href="https://stripe.com/guides/strong-customer-authentication">Strong Customer Authentication (SCA)</A>{' '}
        under PSD2, not by a lack of funds. Those need a re-authentication prompt, not just a retry —
        make sure your recovery flow handles them correctly.
      </Callout>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="See what you've already lost — free"
        body="Connect your payment processor and Revova's Lost Revenue Finder shows exactly how much revenue slipped away to failed payments, from the last 30 days up to 12 months. No credit card, no code. Then decide."
      />

      <p className="text-sm text-gray-400 mt-10">
        Pricing and features for third-party tools are approximate and current as of 2026; they change
        frequently, so always confirm on each vendor&apos;s official website before purchasing.
      </p>
    </>
  )
}
