import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, DonutChart, AreaChart, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is involuntary churn?',
    a: 'Involuntary churn is when a customer’s subscription ends because a payment failed — an expired card, insufficient funds, or a bank decline — rather than because they chose to cancel. The customer never decided to leave; a payment simply broke. It typically accounts for 20–40% of all churn and 5–10% of revenue, and unlike voluntary churn, most of it is recoverable.',
  },
  {
    q: 'What is the difference between voluntary and involuntary churn?',
    a: 'Voluntary churn is when a customer actively decides to cancel — they no longer want the product, found an alternative, or cannot justify the cost. Involuntary churn happens without any decision: a card fails and the subscription lapses. Voluntary churn is fixed with product and pricing; involuntary churn is fixed with payment recovery (retries, dunning emails, pre-dunning).',
  },
  {
    q: 'How much of churn is involuntary?',
    a: 'For most subscription businesses, involuntary churn makes up roughly 20–40% of total churn, and can be higher for businesses with many older cards on file or international customers. Because it is so recoverable, reducing it is usually the fastest retention win available.',
  },
  {
    q: 'What causes involuntary churn?',
    a: 'The main causes are expired cards, insufficient funds, generic bank declines (do_not_honor), cards reported lost or stolen, and — for European customers — charges that require Strong Customer Authentication (SCA / 3D Secure) under PSD2. Each cause needs a slightly different recovery approach.',
  },
  {
    q: 'How do you calculate involuntary churn?',
    a: 'Involuntary churn rate = (customers lost to failed payments in a period ÷ total customers at the start of the period) × 100. You can also measure it by revenue: the MRR lost to failed payments divided by starting MRR. Track it separately from voluntary churn so you can see how much is recoverable.',
  },
  {
    q: 'How do you reduce involuntary churn?',
    a: 'Layer several tactics: smart card retries timed for when a card is likely to work, personalized dunning emails per decline reason, pre-dunning that warns customers before a card expires, correct SCA handling, and a backward scan to recover past failures. Together these can recover 40–60% of failed charges, most of it automatically.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Involuntary churn is when a customer&apos;s subscription ends because a{' '}
        <Strong>payment failed</Strong> — an expired card, insufficient funds, or a bank decline — not
        because they chose to cancel. It typically makes up <Strong>20–40% of all churn</Strong> and
        5–10% of revenue, and unlike voluntary churn, most of it is recoverable.
      </Lead>
      <P>
        Every subscription business watches its churn rate. But churn is really two very different
        problems wearing one label. Some customers <em>decide</em> to leave — that is voluntary churn,
        and you fix it with product and pricing. Others never decide anything at all: a card quietly
        fails and their subscription lapses. That second group is <Strong>involuntary churn</Strong>,
        and it is both the most overlooked and the most fixable revenue leak in your business. Here is
        what it is, why it costs more than founders expect, and how to stop it.
      </P>

      <KeyTakeaways
        items={[
          <>Involuntary churn = subscriptions lost to <Strong>failed payments</Strong>, not customer decisions.</>,
          <>It is typically <Strong>20–40% of total churn</Strong> and 5–10% of revenue — usually the biggest recoverable retention lever.</>,
          <>Unlike voluntary churn, you don&apos;t fix it with product — you fix it with <Strong>payment recovery</Strong> (retries, dunning, pre-dunning).</>,
          <>Because it compounds month over month, small failure rates add up to serious lost revenue.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '20–40%', label: 'of total churn is involuntary' },
          { value: '5–10%', label: 'of revenue lost to failed payments' },
          { value: '40–60%', label: 'of failed charges are recoverable' },
        ]}
      />

      <H2 id="definition">What is involuntary churn, exactly?</H2>
      <P>
        Involuntary churn (sometimes called &quot;passive&quot; or &quot;delinquent&quot; churn) is the
        loss of a paying customer caused by a <Strong>failed recurring payment</Strong> rather than a
        deliberate cancellation. The customer still wants your product. They did not click
        &quot;cancel.&quot; A renewal charge simply did not go through — the card on file expired, the
        account was short on funds, or the bank declined the transaction — and without intervention,
        the subscription eventually lapses.
      </P>
      <P>
        That distinction matters enormously, because it changes the fix. You cannot win back
        involuntary churn with a better onboarding flow or a lower price. You win it back by{' '}
        <Strong>recovering the payment</Strong>.
      </P>

      <H2 id="vs-voluntary">Involuntary vs voluntary churn</H2>
      <P>
        Voluntary churn is a <em>decision</em>; involuntary churn is a <em>failure</em>. For most
        subscription businesses, involuntary churn quietly accounts for a large slice of the total —
        commonly 20–40%, and higher for businesses with older cards on file or lots of international
        customers.
      </P>
      <DonutChart
        segments={[
          { label: 'Involuntary (failed payments)', value: 30, color: '#4f46e5', note: 'Recoverable with payment recovery' },
          { label: 'Voluntary (chose to cancel)', value: 70, color: '#cbd5e1', note: 'Addressed with product and pricing' },
        ]}
        centerLabel="~30%"
        centerSub="involuntary"
        caption="Involuntary churn is typically 20–40% of total churn — an illustrative split is shown."
      />
      <P>
        Here is the key asymmetry: voluntary churn is hard to reverse because the customer weighed their
        options and chose to go. Involuntary churn is <Strong>easy</Strong> to reverse because the
        customer never wanted to leave — you just have to fix the payment. That makes it, dollar for
        dollar, the cheapest retention you can buy.
      </P>

      <H2 id="cost">Why involuntary churn quietly costs so much</H2>
      <P>
        A 5–8% monthly failure rate sounds small until you watch it compound. Every customer lost this
        month is revenue you also lose next month, and the month after. Consider a business at{' '}
        <Strong>$10,000 MRR</Strong> losing about 6% of charges to failed payments — roughly $600 a
        month. Left unrecovered, that is not a one-time $600; it stacks:
      </P>
      <AreaChart
        points={[600, 1200, 1800, 2400, 3000, 3600, 4200, 4800, 5400, 6000, 6600, 7200]}
        xLabels={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
        endLabel="$7,200"
        caption="Cumulative revenue lost over 12 months at $10k MRR losing ~6% to failed payments (illustrative)."
      />
      <P>
        Over a year that is <Strong>$7,200</Strong> gone — more than half a month of revenue — from
        customers who wanted to keep paying. And because these are existing, product-loving customers,
        recovering them is far cheaper than acquiring new ones to replace them.
      </P>

      <H2 id="causes">What causes involuntary churn</H2>
      <P>
        Involuntary churn comes down to why a card gets declined. The usual suspects:
      </P>
      <UL>
        <LI><Strong>Expired cards</Strong> — the single most preventable cause; the card simply aged out.</LI>
        <LI><Strong>Insufficient funds</Strong> — a temporary problem that often clears within days.</LI>
        <LI><Strong>Generic bank declines</Strong> (<code>do_not_honor</code>) — the bank blocks the charge for opaque reasons.</LI>
        <LI><Strong>Lost, stolen, or reissued cards</Strong> — a hard decline that needs a brand-new card.</LI>
        <LI><Strong>SCA / 3D Secure</Strong> — for European customers, charges that need re-authentication under PSD2.</LI>
      </UL>
      <P>
        For a deeper breakdown of decline codes and how to handle each one on Stripe, see our guide on{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>.
      </P>

      <H2 id="measure">How to measure involuntary churn</H2>
      <Callout title="The formula">
        <p style={{ margin: 0 }}>
          <Strong>Involuntary churn rate</Strong> = (customers lost to failed payments in a period ÷
          customers at the start of the period) × 100.
        </p>
        <p style={{ margin: '8px 0 0' }}>
          Or by revenue: MRR lost to failed payments ÷ starting MRR × 100. Track it{' '}
          <em>separately</em> from voluntary churn — blending them hides how much of your churn is
          actually recoverable.
        </p>
      </Callout>
      <P>
        If you have never split the two, you will almost certainly find that a surprising share of what
        you thought was &quot;customers leaving&quot; was really &quot;payments failing&quot; — a much
        happier problem to have, because it is fixable.
      </P>

      <Divider />

      <H2 id="reduce">How to reduce (and stop) involuntary churn</H2>
      <P>
        You reduce involuntary churn by recovering failed payments before the subscription lapses. The
        proven stack, in order of impact:
      </P>
      <OL>
        <LI><Strong>Smart retries.</Strong> Re-attempt the charge on the days a card is most likely to succeed — around payday windows — instead of once and giving up.</LI>
        <LI><Strong>Personalized dunning emails.</Strong> A short sequence written for the specific decline reason, sent at a human hour, with a one-click card-update link.</LI>
        <LI><Strong>Pre-dunning.</Strong> Warn customers <em>before</em> a card expires so the failure never happens.</LI>
        <LI><Strong>Correct SCA handling.</Strong> Send European customers to a re-authentication page instead of blindly retrying.</LI>
        <LI><Strong>Recover the past.</Strong> Scan your payment history for old failures nobody chased — usually the biggest one-time win.</LI>
      </OL>
      <P>
        Done together, these recover 40–60% of failed charges. You can set the basics up yourself inside
        your payment processor, or use a dedicated tool that automates the whole stack — including the
        historical recovery no processor does on its own.
      </P>

      <InlineCTA>
        See your own involuntary churn in dollars: Revova&apos;s free Lost Revenue Finder scans your
        payment history and shows exactly how much you&apos;ve lost to failed payments — before you pay
        anything.
      </InlineCTA>

      <P>
        If you want to compare the tools that do this, read our roundup of the{' '}
        <A href="/blog/best-payment-recovery-dunning-tools-2026">best payment recovery tools in 2026</A>,
        or start recovering today with <A href="/pricing">Revova</A> — flat $29–$79/month, no commission
        on recovered revenue.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Turn involuntary churn back into revenue"
        body="Most of your churn may not be customers leaving — it may be payments failing. Connect your processor and Revova recovers them automatically, starting with a free scan of what you've already lost."
      />
    </>
  )
}
