import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, PriorityMatrix, AreaChart, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'How do you reduce SaaS churn?',
    a: 'Tackle churn in two halves. Reduce involuntary churn (failed payments) with payment recovery — smart retries, personalized dunning emails, and pre-dunning — which is the fastest, highest-impact win. Then reduce voluntary churn (customers choosing to leave) with better onboarding and activation, ongoing value, a cancel flow with retention offers, and annual plans. Start with the involuntary side because it recovers customers who never wanted to leave.',
  },
  {
    q: 'What is a good churn rate for SaaS?',
    a: 'It varies by segment, but a common benchmark is 5–7% monthly logo churn for early-stage SMB-focused SaaS, trending toward 3% or lower as you mature; mid-market and enterprise SaaS often run well below that. More important than the absolute number is your net revenue retention (NRR) — above 100% means expansion outpaces churn.',
  },
  {
    q: 'What is the difference between voluntary and involuntary churn?',
    a: 'Voluntary churn is when a customer actively decides to cancel. Involuntary churn is when a payment fails and the subscription lapses without any decision. They need different fixes — voluntary churn is addressed with product, onboarding and pricing; involuntary churn is addressed with payment recovery.',
  },
  {
    q: 'How do you calculate churn rate?',
    a: 'Customer (logo) churn rate = customers lost in a period ÷ customers at the start × 100. Revenue churn = MRR lost ÷ starting MRR × 100. Net revenue retention factors in expansion: (starting MRR + expansion − churn − contraction) ÷ starting MRR × 100. Track revenue churn and NRR, not just logo churn.',
  },
  {
    q: 'What is the fastest way to reduce churn?',
    a: 'Recovering failed payments. Involuntary churn is typically 20–40% of total churn, it requires no product changes, and the customers involved never wanted to leave — so a payment-recovery setup (retries, dunning emails, pre-dunning) is the highest-impact, lowest-effort lever available. It is the classic quick win.',
  },
  {
    q: 'Do cancel-flow retention offers reduce churn?',
    a: 'Yes, when they are relevant. Intercepting a cancellation with a short survey and a targeted offer — a pause for "not using it," a discount for "too expensive" — saves a meaningful share of customers who would otherwise leave. The key is matching the offer to the stated reason rather than showing everyone the same discount.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        To reduce SaaS churn, tackle it in two halves: <Strong>involuntary churn</Strong> (revenue lost
        to failed payments) with payment recovery, and <Strong>voluntary churn</Strong> (customers who
        choose to leave) with better onboarding, ongoing value, and retention offers. The fastest,
        highest-impact win is almost always the involuntary side — because those customers never wanted
        to leave in the first place.
      </Lead>
      <P>
        Churn is the number that quietly decides whether a subscription business compounds or leaks.
        Cut it by a couple of points and growth accelerates on its own; ignore it and you spend every
        marketing dollar just to stand still. But &quot;reduce churn&quot; is too vague to act on. This
        guide breaks churn into its two real causes, shows you what to fix first (with the least
        effort), and links to step-by-step playbooks for each lever.
      </P>

      <KeyTakeaways
        items={[
          <>Split churn into <Strong>involuntary</Strong> (failed payments) and <Strong>voluntary</Strong> (chose to leave) — they need completely different fixes.</>,
          <>The <Strong>quick win</Strong> is recovering failed payments: high impact, low effort, and no product changes.</>,
          <>Track <Strong>revenue churn and NRR</Strong>, not just logo churn — a few big accounts leaving matters more than many small ones.</>,
          <>Reduce voluntary churn with onboarding, ongoing value, and a <Strong>cancel flow</Strong> that offers the right save for the stated reason.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–7%', label: 'typical monthly churn for early SMB SaaS' },
          { value: '20–40%', label: 'of churn is involuntary (recoverable)' },
          { value: '>100%', label: 'net revenue retention is the goal' },
        ]}
      />

      <H2 id="what-is-churn">What is SaaS churn (and its two causes)?</H2>
      <P>
        Churn is the rate at which customers or revenue leave your business over a period. Every churn
        problem is really one of two very different problems:
      </P>
      <UL>
        <LI><Strong>Voluntary churn</Strong> — a customer decides to cancel: they stopped getting value, found an alternative, or cannot justify the cost. You fix this with product, onboarding, and pricing.</LI>
        <LI><Strong>Involuntary churn</Strong> — a payment fails and the subscription lapses with no decision at all. You fix this with payment recovery. It is usually 20–40% of total churn. We cover it in depth in <A href="/blog/what-is-involuntary-churn">what is involuntary churn</A>.</LI>
      </UL>
      <P>
        Blending the two hides where your churn actually comes from — and hides the fact that a big
        chunk of it is recoverable without touching your product.
      </P>

      <H2 id="measure">How to measure churn (the formulas that matter)</H2>
      <Callout title="The core churn metrics">
        <p style={{ margin: 0 }}><Strong>Customer (logo) churn</Strong> = customers lost ÷ customers at start × 100.</p>
        <p style={{ margin: '8px 0 0' }}><Strong>Revenue churn</Strong> = MRR lost ÷ starting MRR × 100.</p>
        <p style={{ margin: '8px 0 0' }}><Strong>Net revenue retention (NRR)</Strong> = (starting MRR + expansion − churn − contraction) ÷ starting MRR × 100.</p>
      </Callout>
      <P>
        Track <Strong>revenue churn</Strong> and <Strong>NRR</Strong> above all — losing one $500/month
        account hurts more than losing ten $20 ones, and logo churn treats them the same. And always
        split involuntary from voluntary, so you can see how much of your churn is a payment problem
        versus a product problem.
      </P>

      <H2 id="prioritize">Where to start: prioritize by impact vs effort</H2>
      <P>
        You cannot fix everything at once, so sequence the work by how much impact it delivers for how
        much effort. Plot the common churn levers and a clear pattern appears — recovering failed
        payments and pre-dunning sit in the top-left <em>quick wins</em> corner:
      </P>
      <PriorityMatrix
        items={[
          { label: 'Recover failed payments', effort: 14, impact: 84 },
          { label: 'Pre-dunning', effort: 26, impact: 72 },
          { label: 'Cancel-flow offers', effort: 46, impact: 62 },
          { label: 'Better onboarding', effort: 60, impact: 82 },
          { label: 'Pricing / annual plans', effort: 84, impact: 72, left: true },
          { label: 'New features', effort: 88, impact: 46, left: true },
        ]}
        caption="Illustrative impact vs effort of common churn-reduction levers. Start top-left."
      />
      <P>
        The lesson: <Strong>do the involuntary-churn quick wins first</Strong>. They pay for the rest of
        your churn work — often within weeks — and require no roadmap changes.
      </P>

      <Divider />

      <H2 id="involuntary">How to reduce involuntary churn (the quick win)</H2>
      <P>
        This is recovering failed payments before the subscription lapses. It is the single fastest
        lever because the customers never wanted to leave. The stack:
      </P>
      <OL>
        <LI><Strong>Smart retries</Strong> — re-attempt failed charges on the days a card is likely to have funds (payday windows), not just once.</LI>
        <LI><Strong>Personalized dunning emails</Strong> — a short sequence written per decline reason. See our <A href="/blog/dunning-email-examples-templates">12 dunning email templates</A>.</LI>
        <LI><Strong>Pre-dunning</Strong> — warn customers before a card expires so the failure never happens.</LI>
        <LI><Strong>Correct handling by decline code</Strong> — retry soft declines, ask for a new card on hard ones, re-authenticate for SCA. See our <A href="/blog/stripe-decline-codes-explained">guide to Stripe decline codes</A>.</LI>
        <LI><Strong>Recover past failures</Strong> — scan your history for old failed charges nobody chased; usually the biggest one-time win.</LI>
      </OL>
      <P>
        For the full setup, follow our step-by-step guide on{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>.
        Together these recover 40–60% of failed charges — a direct, fast cut to your churn number.
      </P>

      <InlineCTA>
        Recovering failed payments is the fastest way to cut churn. Revova automates the whole stack —
        retries, AI dunning emails, pre-dunning — and finds the revenue you&apos;ve already lost. Start
        free, no card.
      </InlineCTA>

      <H2 id="voluntary">How to reduce voluntary churn</H2>
      <P>
        Voluntary churn is harder because it is a decision — but it is very reducible with a handful of
        durable levers.
      </P>
      <H3>1. Nail onboarding and time-to-value</H3>
      <P>
        Most voluntary churn is decided in the first two weeks. If a customer does not reach their first
        real outcome — the &quot;aha&quot; moment — quickly, they drift. Map the shortest path to value
        and remove every step that is not essential to get there.
      </P>
      <H3>2. Keep delivering (and showing) value</H3>
      <P>
        Customers cancel when they stop perceiving value, which is not the same as stopping using the
        product. Reinforce wins: usage summaries, results emails, and periodic &quot;here&apos;s what you
        got this month&quot; nudges keep the value visible.
      </P>
      <H3>3. Add a cancel flow with the right offer</H3>
      <P>
        When a customer clicks cancel, intercept with a short survey and a <em>relevant</em> save offer:
        a pause for &quot;not using it right now,&quot; a discount for &quot;too expensive,&quot; a
        pointer to a feature for &quot;missing X.&quot; Matching the offer to the reason saves far more
        than showing everyone the same discount.
      </P>
      <H3>4. Encourage annual plans</H3>
      <P>
        An annual plan removes eleven monthly opportunities to churn and improves cash flow. A modest
        annual discount often pays for itself many times over in retained revenue.
      </P>
      <H3>5. Win back the ones who leave</H3>
      <P>
        Cancellation is not always permanent. A light re-engagement sequence weeks later — especially
        for customers who left over a fixable issue — recovers a slice of them. (For those who left via
        a failed payment, that is involuntary win-back, which your recovery tool handles.)
      </P>

      <H2 id="playbook">A 30-day churn-reduction playbook</H2>
      <OL>
        <LI><Strong>Week 1 — Measure.</Strong> Split your churn into voluntary vs involuntary and start tracking revenue churn and NRR.</LI>
        <LI><Strong>Week 1 — Quick win.</Strong> Turn on payment recovery (retries + dunning emails + pre-dunning) and run a historical scan for past failures.</LI>
        <LI><Strong>Week 2 — Cancel flow.</Strong> Add a cancellation survey with reason-matched save offers.</LI>
        <LI><Strong>Week 3 — Onboarding.</Strong> Find where new customers stall before first value and remove one step.</LI>
        <LI><Strong>Week 4 — Expansion &amp; annual.</Strong> Introduce or promote an annual plan and one expansion path, and review the numbers against Week 1.</LI>
      </OL>

      <H2 id="track">Track your progress</H2>
      <P>
        Reducing churn is iterative — apply a lever, watch the number, keep the ones that move it. Done
        in the right order, monthly churn falls steadily as each lever compounds:
      </P>
      <AreaChart
        points={[8, 7.3, 6.7, 6.0, 5.4, 4.9, 4.5, 4.2]}
        xLabels={['1', '2', '3', '4', '5', '6', '7', '8']}
        endLabel="4.2%"
        caption="Illustrative monthly churn falling as the quick wins and voluntary-churn levers stack up."
      />

      <H2 id="tools">Tools that help</H2>
      <P>
        For the involuntary side, a payment-recovery tool automates retries, dunning, pre-dunning and
        historical recovery. Compare the options in our{' '}
        <A href="/blog/best-payment-recovery-dunning-tools-2026">roundup of the best payment recovery tools</A>,
        or if you are pricing against a premium suite, see our{' '}
        <A href="/blog/churnkey-alternatives">Churnkey alternatives</A>. <A href="/pricing">Revova</A>{' '}
        covers the full recovery stack at $29–$79/month flat and recovers past failures too.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Start with the quick win — recover failed payments"
        body="The fastest cut to your churn number is recovering revenue you're already losing to failed payments. Connect your processor and Revova shows you exactly how much that is — free, no card — then recovers it automatically."
      />
    </>
  )
}
