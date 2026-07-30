import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, UL, OL, LI, A, Strong, Callout, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, CompareTable, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is the best Butter Payments alternative?',
    a: "Revova is the strongest alternative if you want a flat, predictable monthly price and a customer-facing recovery layer — dunning emails, SMS, hard/soft decline routing, an in-app cancel flow, and win-back campaigns — instead of a bill that grows with recovered revenue and a tool scoped narrowly to retry timing. Churn Buster is worth a look if you want a proven Stripe/Recurly dunning specialist, and Churnkey if you want a broader retention suite with budget to spare. If your card mix is genuinely dominated by a few large issuing banks with unusual decline patterns and you have engineering time to spend on a custom integration, Butter Payments' issuer-level retry optimization remains a reasonable, honest choice worth evaluating on its own merits.",
  },
  {
    q: 'How much does Butter Payments actually cost?',
    a: "Butter Payments prices as a percentage of the revenue it recovers rather than a flat monthly fee, so there is no single number to quote. The company describes running a complimentary payment health analysis for prospective customers, then setting an individually negotiated revenue-share percentage based on the recovery lift it projects for that account. The practical effect is the same as any pay-on-results model: no recovery, no bill; a lot of recovery, a proportionally larger bill. Ask for the exact percentage and how it is calculated before committing, since it is set per account rather than published.",
  },
  {
    q: 'Why do people look for a Butter Payments alternative?',
    a: "Three reasons come up most often. First, the percentage-of-recovered pricing has no ceiling — it keeps climbing as your recovery volume and subscriber base grow, which can flip an early cost advantage into a larger bill than a flat fee once you scale. Second, Butter's stated scope is the technical retry conversation with the card network and issuing bank — optimizing when and how a failed charge gets resubmitted — rather than the customer-facing side of recovery: dunning emails, SMS, an in-app cancel flow, or win-back campaigns for subscribers who never come back. Third, its integration footprint centers on Stripe, Recharge, and custom in-house payment systems, which is narrower than a processor-agnostic tool built to connect read-only across five processors including Braintree, Chargebee, and Recurly.",
  },
  {
    q: 'Is Butter Payments a good product?',
    a: 'Yes, for the right team. Its core claim — custom machine learning models scoring hundreds of data points per failed payment to pick the best retry timing and method — is a genuinely deeper technical approach than a fixed retry schedule, and it is aimed at a real problem: card networks and issuing banks behave differently enough, bank to bank, that a one-size retry schedule leaves authorization-rate improvement on the table. The tradeoff is scope and integration lift. Butter optimizes the retry itself; it does not appear to ship the customer-facing dunning layer, and plugging it into a processor or subscription stack outside its core integrations reportedly takes more engineering time than a plug-and-play Stripe app.',
  },
  {
    q: 'Does Butter Payments send dunning emails or SMS to customers?',
    a: "That does not appear to be its focus. Butter's public materials describe a machine-learning system built to optimize the technical retry — resubmitting a failed charge at the timing and through the channel most likely to get an issuing bank to approve it — alongside authorization-rate, chargeback, and lifetime-value metrics. That is a genuinely different job from the customer-facing recovery layer: the dunning emails, SMS reminders, hard/soft decline routing, and in-app cancel flow that get a customer to actually update their card when the automated retry alone does not succeed. Teams running Butter for retry optimization often still need a separate tool, or a broader one, for that customer-facing half.",
  },
  {
    q: 'Does Butter Payments work with Braintree, Chargebee, or Recurly?',
    a: "Butter's public integration list centers on Stripe and Recharge, plus custom builds for merchants running in-house or less common payment stacks. That is a meaningfully narrower published footprint than a processor-agnostic recovery tool built specifically to connect read-only across Stripe, Paddle, Braintree, Chargebee, and Recurly. If your subscriptions run primarily through Braintree, Chargebee, or Recurly rather than Stripe, confirm directly with Butter what a custom integration actually involves — in scope, timeline, and ongoing maintenance — before assuming it slots in the way it does for a Stripe-native merchant.",
  },
  {
    q: 'Does the percentage-of-recovered pricing ever cost more than a flat fee?',
    a: "It can, and this is the single most important thing to model before committing either way. At low recovery volume, a percentage of a small number is a small number, which is exactly why pay-on-results pricing feels attractive early on. But the percentage does not cap — as your subscriber base and recovery volume grow, the bill grows in lockstep, and at some point it can cross above what a flat $29–$79/month would have cost for a comparable recovery outcome. Project the bill at your recovery volume six to twelve months out, not just today's numbers, before assuming the pricing model that looks cheapest now stays cheapest.",
  },
  {
    q: 'How hard is it to switch from Butter Payments to Revova?',
    a: "It is a no-code change most teams finish in an afternoon, and it does not have to mean ripping Butter out entirely if its retry-timing optimization is genuinely working for you. Connect Stripe, Paddle, Braintree, Chargebee, or Recurly to Revova with a single read-only API key, run the free Lost Revenue Finder to see what historical recovery and a customer-facing dunning layer are worth on top of whatever retry optimization is already in place, set up or accept the default dunning cadence, confirm the new sequence is firing correctly, then coordinate timing so customers are not getting two uncoordinated recovery touches for the same failed charge.",
  },
  {
    q: 'Is Butter Payments only for large or enterprise subscription businesses?',
    a: "Its public case studies and sales motion — a complimentary payment health analysis followed by an individually negotiated revenue-share rate — point toward mid-market and enterprise consumer subscription brands rather than a self-serve small-business signup. That is not a criticism, just a fit signal: if you are a small or early-stage subscription business without a dedicated point of contact for a vendor negotiation, a self-serve, flat-fee tool is likely to be a faster and more predictable starting point than a percentage-based enterprise sales process.",
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        The best Butter Payments alternatives in 2026 are <Strong>Revova</Strong>, <Strong>Churn Buster</Strong>,
        {' '}and <Strong>Churnkey</Strong> — each priced as a flat monthly fee, and each shipping a full
        customer-facing recovery layer, rather than a percentage-of-recovered bill scoped mainly to retry
        timing. Butter Payments is a genuinely sophisticated product on its own terms: custom machine learning
        models that score hundreds of data points per failed payment to optimize when and how a charge gets
        resubmitted to the card network, priced so you only pay a cut of what it actually recovers. The two
        most common reasons people look elsewhere are that the bill has no ceiling — it keeps climbing as
        recovery volume grows — and that its stated scope is the technical retry conversation rather than the
        customer-facing dunning emails, SMS, and in-app cancel flow that get a subscriber to actually fix a
        card on file.
      </Lead>
      <P>
        This guide lays out that tradeoff honestly: what Butter&apos;s ML-driven retry approach gets right, where
        pay-on-results pricing can quietly cost more than a flat fee once you scale, and what a standalone
        alternative like Revova offers instead — including for teams on processors Butter does not natively
        cover.
      </P>
      <P>
        One thing worth saying up front: Revova is not trying to out-do Butter at issuer-level retry science.
        Revova connects read-only to your processor and focuses on the customer-facing side of recovery —
        dunning sequences, decline routing, an in-app cancel flow, and win-back campaigns — plus historical
        recovery of payments that already failed. For some teams the honest answer is running both, not
        picking one.
      </P>

      <KeyTakeaways
        items={[
          <>Butter Payments charges a <Strong>percentage of recovered revenue</Strong>, individually negotiated per account — the bill has no ceiling and grows as recovery volume does.</>,
          <>Butter&apos;s stated scope is <Strong>retry-timing optimization</Strong> — the technical conversation with the card network — not customer-facing dunning emails, SMS, or an in-app cancel flow.</>,
          <>Its published integrations center on <Strong>Stripe and Recharge</Strong>, plus custom builds — a narrower footprint than a processor-agnostic tool covering five processors.</>,
          <>A flat-fee alternative like Revova can be <Strong>cheaper at scale</Strong> and covers the customer-facing recovery layer Butter does not appear to ship.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '% of revenue', label: "Butter's pricing model — the bill grows with recovery success, with no published cap" },
          { value: '$29/mo', label: 'Revova Starter — flat, regardless of how much is recovered' },
          { value: '5 processors', label: 'Revova connects read-only to Stripe, Paddle, Braintree, Chargebee, and Recurly' },
        ]}
      />

      <H2 id="what-butter-is">What Butter Payments actually is</H2>
      <P>
        Butter Payments is a payment-recovery company built around a specific, technical idea: that most failed
        subscription charges are not a customer problem to be messaged around, but an authorization problem to
        be re-engineered. Its pitch is custom machine learning models that analyze hundreds of data points about
        each individual failed payment — issuer, decline code, time of day, prior retry history, and more — to
        determine the optimal timing and method for resubmitting that specific charge, rather than applying the
        same fixed retry schedule to every failure. Where a lot of dunning tools batch failures into a shared
        cadence, Butter&apos;s stated approach processes each one individually.
      </P>
      <P>
        That is a meaningfully different problem than the one most standalone dunning tools solve. Butter is
        optimizing the technical conversation between a merchant and an issuing bank — when to ask again, and
        how, to get an approval instead of another decline — with stated goals of higher transaction
        authorization rates, fewer chargebacks, and higher lifetime value. It is not, on its public materials,
        primarily a customer-messaging product.
      </P>
      <P>
        The pricing mirrors that positioning. Rather than a flat monthly subscription, Butter runs a
        complimentary payment health analysis for prospective customers and then sets a revenue-share
        percentage — the cut it takes of whatever it actually recovers — individually per account, based on the
        recovery lift it projects. For an early-stage team unsure how much a retry-optimization layer is really
        worth to them, that is a genuinely low-risk way to try one: recover nothing, pay nothing.
      </P>
      <P>
        The customer profile Butter&apos;s public case studies and marketing point toward is consumer subscription
        businesses — health and fitness, media, and direct-to-consumer e-commerce brands running recurring
        billing at meaningful volume. That tracks with the pricing motion: a negotiated payment health analysis
        followed by an individually set revenue-share rate reads as an enterprise or mid-market sales process,
        not a self-serve signup. If you are a smaller subscription business hoping to plug in a percentage-based
        tool with just a card and a login, it is worth confirming upfront how much sales process actually stands
        between you and running it.
      </P>
      <InBodyImage
        file="/blog/butter-payments-alternatives-img-1"
        alt="Chart comparing a percentage-of-recovered-revenue bill that climbs month over month as recovery volume grows, against a flat monthly fee that stays constant regardless of how much revenue is recovered"
        caption="A percentage-of-recovered bill scales with your success — for better or worse, it never plateaus the way a flat fee does."
      />
      <Callout title="This is not a case against Butter Payments">
        Issuer-level, per-payment retry optimization is a legitimate technical edge, and pay-on-results pricing
        is an honest, low-risk model for a team unsure what a recovery layer is worth. The comparison here is
        specifically about whether that pricing model, and that retry-only scope, still make sense once your
        recovery volume grows or once you need the customer-facing side of recovery that Butter does not appear
        to cover.
      </Callout>

      <H2 id="how-the-retry-engine-works">How the ML retry engine works, and its honest limits</H2>
      <P>
        The technical claim behind Butter is worth taking seriously on its own terms. Instead of retrying a
        failed charge on a fixed schedule — say, day 1, day 3, day 7, for every customer regardless of who
        declined it or why — Butter&apos;s public materials describe custom machine learning models built per
        customer, scoring hundreds of data points about each individual failed payment: the issuing bank, the
        decline code, the time of day, the card network, and the merchant&apos;s own prior retry history with that
        specific account. The model then picks the timing and method most likely to convert that specific
        retry into an approval, rather than treating every failure the same way.
      </P>
      <P>
        That matters because issuing banks genuinely do not all behave the same way. Some approve retries more
        readily at certain times of day or after certain intervals; others are more sensitive to how many times
        a merchant has already asked. A merchant with a card mix concentrated in banks with unusual retry
        behavior is leaving real authorization-rate improvement on the table with a fixed schedule, and Butter&apos;s
        stated approach is built specifically to close that gap. Its metrics reportedly track transaction
        authorization rate, chargeback rate, and lifetime value — a broader lens than &quot;did the retry succeed.&quot;
      </P>
      <P>
        The honest limit is that this is a vendor-controlled black box. The merchant does not see, and likely
        cannot directly tune, the model deciding when and how a given customer gets retried — you are trusting
        Butter&apos;s system, not configuring your own. That is a reasonable tradeoff if the lift is real and
        measurable for your account, but it is a different relationship than a dunning tool where you set and
        can see the exact cadence, subject lines, and channels yourself. Revova&apos;s dunning cadence, for
        comparison, is configurable and visible to the merchant rather than opaque — a real difference in how
        much control each model hands back to you.
      </P>

      <H2 id="where-this-fits">Where this fits relative to a dunning layer</H2>
      <P>
        It is easy to read a comparison like this as &quot;pick one,&quot; but the more accurate framing is that Butter
        and a tool like Revova are solving adjacent, not identical, problems. Butter&apos;s stated scope is
        maximizing the odds that an automated retry succeeds without the customer ever knowing a charge failed.
        A dunning layer&apos;s job starts where that ends: the retries that still do not succeed, the hard declines
        that cannot be retried at all, and the customers who need to actually take an action — update a card,
        confirm they still want the subscription — before revenue comes back.
      </P>
      <P>
        For an enterprise team already running Butter for its retry science, the practical question is not
        &quot;should we rip this out&quot; but &quot;what is still falling through, and does anything catch it.&quot; If the answer
        is nothing, hard declines and permanently expired cards are quietly turning into churn with no
        customer-facing recovery attempt at all — a gap a flat-fee dunning layer closes without touching
        whatever retry optimization Butter is already doing well.
      </P>

      <H2 id="why-alternatives">Why people look for a Butter Payments alternative</H2>
      <UL>
        <LI>
          <Strong>No ceiling on the bill.</Strong> Because Butter charges a percentage of recovered revenue,
          the bill scales directly with your own success. A model that looks inexpensive at low volume can end
          up costing meaningfully more than a flat fee once your subscriber base — and the amount of revenue
          Butter is recovering — grows.
        </LI>
        <LI>
          <Strong>Scope.</Strong> Butter&apos;s public positioning is retry-timing optimization, not the
          customer-facing recovery layer — dunning emails, SMS, hard/soft decline routing, or an in-app cancel
          flow — that gets a subscriber to actually fix a declined card when the automated retry alone does not
          succeed.
        </LI>
        <LI>
          <Strong>Integration footprint.</Strong> Butter&apos;s published integrations center on Stripe and Recharge,
          with custom builds for other stacks. Teams billing primarily through Braintree, Chargebee, or Recurly
          are working with a narrower, more custom path than a tool built to cover all three natively.
        </LI>
      </UL>
      <P>
        That last point matters more in practice than it might read on paper. A &quot;custom integration&quot; is not a
        line item — it is engineering time: scoping the connection, building and testing it, and maintaining it
        as your payment stack changes. Reviews of Butter consistently note that its integration can be more
        involved than a plug-and-play Stripe app, which is a fair tradeoff for the depth of its retry modeling,
        but a real cost for a team without spare engineering capacity to give it.
      </P>
      <InBodyImage
        file="/blog/butter-payments-alternatives-img-2"
        alt="Comparison of scope: Butter Payments shown as ML-optimized retry timing per payment with no customer-facing emails, SMS, or cancel flow out of the box, versus Revova shown covering both retry logic and the full customer-facing recovery layer"
        caption="Butter optimizes the technical retry. Revova adds the customer-facing layer — dunning, decline routing, cancel flow, and win-back — on top of or instead of it."
      />

      <H2 id="what-it-doesnt-cover">What Butter Payments doesn&apos;t appear to cover</H2>
      <P>
        Most subscription businesses lose revenue to failed payments in two different ways, and they call for
        two different fixes. Some failures are genuinely a card-network problem — a temporary issuer-side
        decline that a smarter retry, timed and routed correctly, can turn into an approval without the customer
        ever noticing. Butter&apos;s ML retry modeling is squarely built for that half of the problem, and its
        stated results — issuer-pattern-aware retries outperforming a fixed schedule — are a real, credible
        edge for that specific job.
      </P>
      <P>
        There is a further wrinkle worth naming: a soft decline — insufficient funds, a temporary bank-side hold
        — genuinely can benefit from smarter retry timing, since trying again later or through a different
        channel can catch the customer&apos;s balance replenishing or the hold lifting. A hard decline — a stolen
        or closed card, a fraud block — cannot be fixed by retrying at all, no matter how well-timed the retry
        is. Any retry-optimization tool&apos;s ceiling is bounded by how much of a merchant&apos;s failure mix is
        genuinely soft versus hard; routing hard declines to a customer-facing flow instead of retrying them
        indefinitely is itself part of doing this well.
      </P>
      <P>
        Other failures need the customer to actually do something: update an expired card, re-authorize a
        payment after a hard decline, or decide whether to keep the subscription at all. That is the job a
        dunning email sequence, SMS reminder, hard/soft decline routing, and an in-app cancel flow are built
        for — and it is not what Butter&apos;s public materials describe it as doing. A team running Butter alone,
        with no separate customer-facing layer, is likely still leaving hard declines, permanently expired
        cards, and abandoned-but-recoverable subscribers on the table, since no retry timing — however well
        optimized — fixes a card number that no longer exists.
      </P>
      <P>
        It is also worth being precise about a related but distinct mechanism: card-network Account Updater
        services, which refresh an expired or reissued card number directly on file through Visa and
        Mastercard&apos;s own update programs, before a charge is even attempted. That is a different fix for a
        different slice of the problem than either retry-timing optimization or dunning messaging — it prevents
        some failures from happening at all, rather than recovering or messaging around ones that already did.
        Nothing in Butter&apos;s public materials describes offering this; it is worth asking directly whether card
        refresh is included, layered in via the processor, or absent entirely.
      </P>

      <H2 id="processor-coverage">Processor and integration coverage</H2>
      <P>
        If Stripe or Recharge is genuinely your entire payment stack and you have no plans to add another
        processor, Butter&apos;s native integration is a real strength worth weighing — the retry modeling plugs in
        without a custom build. But plenty of subscription businesses bill through more than one processor, run
        Braintree, Chargebee, or Recurly instead, or expect to migrate processors as they grow, and a tool whose
        published depth sits mainly with one or two platforms does not travel with you the way a
        processor-agnostic one does.
      </P>
      <InBodyImage
        file="/blog/butter-payments-alternatives-img-3"
        alt="Processor and integration coverage comparison: Butter Payments shown covering Stripe, Recharge, and custom builds, versus Revova connecting read-only to five processors — Stripe, Paddle, Braintree, Chargebee, and Recurly"
        caption="Revova connects read-only across five processors out of the box; Butter's published depth centers on Stripe and Recharge, with custom builds elsewhere."
      />
      <P>
        Custom builds are not a disqualifier — some enterprise teams genuinely need issuer-level retry
        optimization badly enough to justify the engineering lift of a bespoke integration. But it is worth
        pricing that lift honestly against the timeline of a read-only API key, which is how long a
        processor-agnostic alternative typically takes to connect.
      </P>
      <P>
        It is also worth separating what Recharge actually is from what a processor is: Recharge is a
        subscription-management layer that sits on top of a payment processor, most commonly Stripe, rather
        than a processor in its own right. So in practical terms, Butter&apos;s published integration depth still
        traces back to Stripe as the underlying rail in the majority of cases, with Recharge as the
        subscription layer on top of it — worth confirming directly if your stack uses a different combination.
      </P>

      <InlineCTA>
        Already billing through Stripe, Paddle, Braintree, Chargebee, or Recurly? Revova connects read-only in
        minutes, with a flat price no matter how much revenue it recovers. $29/mo Starter or $79/mo Pro, 14-day
        free trial, no credit card required.
      </InlineCTA>

      <H2 id="pricing-in-practice">Running the pricing math in practice</H2>
      <P>
        Because Butter&apos;s revenue-share percentage is set per account rather than published, the only honest way
        to compare it against a flat fee is to model your own numbers. Here is an illustrative example, not a
        quote: a subscription business recovering an incremental $50,000 a month in previously-failed revenue
        through Butter&apos;s retry optimization, at a negotiated rate in the high single digits, lands somewhere
        around $4,000–$5,000 a month. Compare that to Revova Pro at a flat $79 a month, and the gap is stark —
        but the comparison only holds if a flat-fee tool could realistically recover a comparable amount, which
        depends entirely on how much of that $50,000 is issuer-retry-shaped versus customer-action-shaped.
      </P>
      <P>
        That is the real question to answer before switching or adding a tool, not the headline percentage.
        Revenue recovered purely by smarter retry timing is Butter&apos;s strength and not something a dunning-email
        sequence replicates on its own. Revenue recovered by getting a customer to update an expired card or
        confirm they want to keep paying is the reverse — a dunning layer&apos;s strength, not something retry
        timing alone fixes. Segment your own failed-payment volume by which bucket it falls into before
        assuming either tool&apos;s pricing model is the right one for the whole picture.
      </P>

      <H2 id="comparison">Butter Payments alternatives compared</H2>
      <P>
        Laid out side by side, the split is less &quot;which is better&quot; and more &quot;which problem are you actually
        trying to solve&quot; — issuer-level retry science priced on results, versus a flat-fee tool covering the
        full customer-facing recovery loop plus the processors Butter does not natively reach.
      </P>
      <CompareTable
        rows={[
          ['Alternative', 'Pricing', 'Pricing model', 'Processors', 'Customer-facing dunning', 'Best for'],
          ['Revova', '$29–$79/mo flat', 'Flat fee', 'Stripe, Paddle, Braintree, Chargebee, Recurly', 'Yes — email, SMS, cancel flow', 'Predictable pricing, broad processor coverage, full recovery layer'],
          ['Butter Payments', '% of recovered revenue', 'Pay-on-results', 'Stripe, Recharge, custom builds', 'Not published', 'Issuer-level ML retry optimization for complex card mixes'],
          ['Churn Buster', 'Scales with recovery volume', 'Volume-tiered', 'Stripe, Recurly', 'Yes', 'Proven Stripe/Recurly dunning specialist'],
          ['Churnkey', '~$199+/mo', 'Flat fee', 'Stripe-centric', 'Yes', 'Full retention suite, budget flexible'],
        ]}
      />
      <P>
        For a broader look at this category from a different angle, our <A href="/blog/paddle-retain-alternatives">Paddle
        Retain alternatives guide</A> covers another pay-on-results competitor and the same flat-fee-versus-percentage
        tradeoff in more depth.
      </P>

      <H2 id="which-fits">Which fits your situation</H2>
      <ProsCons
        pros={[
          'Card mix genuinely skewed toward issuing banks with unusual decline/retry behavior and engineering time to spend on a custom integration → Butter Payments’ issuer-level ML retry optimization is a reasonable, technically credible choice',
          'Early-stage, low recovery volume, want to try a recovery layer at minimal upfront cost → pay-on-results pricing from either Butter or a similar competitor is a low-risk starting point',
          'Want a predictable, flat monthly bill plus dunning emails, SMS, and an in-app cancel flow in one tool → Revova',
          'Growing subscriber base and want the recovery bill to stay flat as recovery volume scales → Revova',
          'Running Braintree, Chargebee, or Recurly alongside or instead of Stripe → Revova, built for all three natively without a custom integration',
        ]}
        cons={[
          'Percentage-of-recovered pricing means the bill keeps climbing as your subscriber base grows — model it at your projected volume, not just today’s',
          'None of the flat-fee alternatives offer a pay-nothing-if-nothing-recovered guarantee the way a pure revenue-share model inherently does',
          'Switching away from Butter if issuer-level retry optimization is genuinely working for your card mix means losing a specialized technical edge, not just a vendor',
        ]}
      />
      <P>
        If your reason for comparing pricing models is really about sizing the opportunity first, it is worth
        reading our <A href="/blog/how-much-revenue-lost-to-failed-payments">guide on how much revenue is
        typically lost to failed payments</A> before running the percentage-of-recovered math against a flat
        fee side by side.
      </P>
      <P>
        In practice, most teams land in one of three buckets. Larger subscription businesses with a genuinely
        complex, bank-heavy card mix and the engineering bandwidth for a custom integration get real value out
        of Butter&apos;s retry science, and the pay-on-results pricing is a fair trade for that depth. Smaller or
        mid-size teams without spare engineering time, or whose failures are more often customer-action-shaped
        than issuer-shaped, tend to get more out of a flat-fee tool that covers the full customer-facing
        recovery loop for a predictable price. And a fair number of teams — especially larger ones already
        running Butter — end up better served running both, not choosing one over the other.
      </P>

      <H2 id="how-to-switch">How to switch from Butter Payments</H2>
      <OL>
        <LI><Strong>Project the bill at your future volume, not just today&apos;s.</Strong> Take your current recovery volume, apply Butter&apos;s negotiated percentage, then redo the math at your subscriber count six and twelve months out to see whether a flat fee would actually be cheaper by then.</LI>
        <LI><Strong>Decide whether you are replacing Butter or layering underneath it.</Strong> If its retry-timing optimization is genuinely improving authorization rates for your card mix, the cheaper move may be adding a customer-facing dunning layer alongside it rather than replacing it outright.</LI>
        <LI><Strong>Connect your processor to the alternative read-only.</Strong> For Revova, that&apos;s a single API key for Stripe, Paddle, Braintree, Chargebee, or Recurly, with no custom integration or webhook setup required.</LI>
        <LI><Strong>Run a historical scan before changing anything else.</Strong> See what is actually recoverable in your existing payment history — a check Butter&apos;s public materials do not describe offering, so it is often the first tangible new number you will see.</LI>
      </OL>
      <Callout title="Coordinate timing if you run both">
        If you keep Butter for retry optimization and add Revova for the customer-facing layer, make sure the
        two are not both trying to message the same customer about the same failed charge in an uncoordinated
        way — confirm which tool owns the retry and which owns the dunning email or SMS before turning both on
        for the same account. In practice this usually means Butter continues owning the technical retry
        against the processor, while the dunning tool owns everything customer-facing — so a subscriber never
        gets a duplicate nudge about the same declined charge from two different senders in the same week.
      </Callout>

      <InlineCTA>
        See what a flat-fee recovery layer would actually recover on your own account — Revova&apos;s free Lost
        Revenue Finder connects read-only and scans your payment history before you commit to anything. No
        credit card required.
      </InlineCTA>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <Divider />

      <CTA
        heading="See what a flat-fee recovery layer would actually recover"
        body="Revova connects read-only to Stripe, Paddle, Braintree, Chargebee, or Recurly — a flat price no matter how much revenue it recovers. $29/mo Starter or $79/mo Pro, 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
