import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Is Recurly or Chargebee cheaper?',
    a: "Neither publishes flat public pricing for most plans, so an honest comparison has to be qualitative rather than a dollar figure. Both quote custom pricing once you're past an entry tier, usually scaled to transaction volume or MRR. What tends to differ is what you pay for on top of the base plan: Chargebee's deeper configurability (usage-based billing, entitlements, revenue recognition) is more likely to require a higher tier, while Recurly's leaner core model keeps more capability in its standard plans. Get quotes from both against your actual volume and feature list before deciding on price alone.",
  },
  {
    q: 'Does Recurly or Chargebee handle failed payments better?',
    a: "Both ship a configurable dunning system — a retry schedule plus template emails you set up in account settings — so the baseline mechanics are similar. Recurly's genuine differentiator is Account Updater, which automatically refreshes expired or reissued card numbers through the Visa and Mastercard networks with no customer action required. Chargebee doesn't ship an equivalent built-in card-refresh feature. Neither platform natively branches its retry timing by decline reason (insufficient funds vs expired card vs bank decline) the way a dedicated recovery tool does.",
  },
  {
    q: 'Are Recurly and Chargebee Merchants of Record like Paddle?',
    a: 'No. Both Recurly and Chargebee are subscription-billing platforms that sit on top of an underlying payment gateway — Stripe, Braintree, Adyen, and others — not Merchants of Record. You remain the seller on every transaction, which means you (not Recurly or Chargebee) are responsible for VAT, GST, and sales-tax registration and remittance, typically handled through your gateway’s tax tool or a separate compliance service. If you want a platform that takes on that tax liability directly, that’s a Paddle-style Merchant of Record, a different category entirely.',
  },
  {
    q: 'Which one is better for a complex B2B SaaS with usage-based pricing?',
    a: "Chargebee generally fits better here. Its Product Catalog, entitlements, and usage-based billing primitives are built for exactly this — metered pricing, seat counts, tiered plans, and add-ons that need to be composed together — plus revenue recognition reporting that finance teams often need for GAAP/ASC 606 compliance. Recurly can handle usage-based add-ons too, but its core model stays leaner, which is an advantage for simpler subscription products and a real ceiling for highly configurable B2B pricing.",
  },
  {
    q: 'Which one is better for consumer subscriptions or media with a lot of cards on file?',
    a: "Recurly tends to fit better for high-volume consumer subscription businesses — media, streaming, subscription commerce — where a meaningful share of involuntary churn comes from expired or reissued cards rather than true declines. Account Updater directly targets that failure mode automatically, without an email or SMS ever going out, which matters at scale when you have tens of thousands of stored cards.",
  },
  {
    q: 'Can I switch from Chargebee to Recurly (or back) without losing subscription history?',
    a: "It's a real migration project, not a settings change. Both platforms store your subscription, invoice, and customer objects in their own data model, so moving between them means exporting and remapping that data, re-establishing your dunning and email configuration from scratch, and in many cases having customers' payment methods re-tokenized depending on your gateway setup. Budget a real project timeline, test the webhook and invoice mapping thoroughly in a sandbox, and expect a small amount of involuntary churn risk during the cutover window — the same risk any billing-platform migration carries.",
  },
  {
    q: 'Does Revova work with both Recurly and Chargebee?',
    a: 'Yes. Revova connects read-only to Recurly, Chargebee, Stripe, Paddle, and Braintree — it never touches card data. Whichever billing platform you land on from this comparison, or if you run both across different products, Revova’s Lost Revenue Finder, AI dunning sequence, and recovery reporting work the same way on top of either one.',
  },
  {
    q: 'Does either platform handle revenue recognition (ASC 606) for me?',
    a: "Chargebee ships a built-in revenue recognition module that generates deferred-revenue schedules and recognition entries directly from your subscription and invoice data — a real reason larger B2B SaaS finance teams lean toward it, especially ahead of an audit or fundraise. Recurly does not ship an equivalent built-in module; teams running Recurly that need ASC 606 compliance typically export data to a dedicated revenue recognition tool or handle it inside their accounting system. For a smaller business without a dedicated finance function this rarely matters day to day, but it's worth flagging to whoever owns your books before you commit to either platform.",
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Chargebee is the better pick for complex B2B SaaS billing — usage-based pricing, entitlements,
        seat tiers, and revenue recognition. Recurly is the better pick for subscription commerce and
        media businesses that want a leaner billing model plus a genuine edge on card-expiry churn
        through its built-in Account Updater. Both sit on top of a payment gateway rather than replacing
        one, and both ship a configurable dunning system as their answer to failed payments.
      </Lead>
      <P>
        Recurly and Chargebee get lumped together constantly because both market themselves around
        &quot;subscription billing,&quot; both quote custom pricing instead of a public price sheet past
        the entry tier, and both plug into an underlying processor rather than acting as a Merchant of
        Record the way Paddle does. That surface similarity hides a real structural difference: Chargebee
        is built for configurability depth — product catalogs, entitlements, usage metering, revenue
        recognition — while Recurly keeps a leaner core model and puts its differentiation into Account
        Updater, a card-refresh feature Chargebee doesn&apos;t ship natively. This comparison focuses on
        what actually decides which one fits your business — billing depth, dunning and recovery
        specifics, integrations, and pricing model — plus an honest verdict by use case.
      </P>
      <P>
        We build failed-payment recovery software that connects read-only to both, so this comparison
        isn&apos;t a proxy for &quot;which billing platform should I use for recovery&quot; — a dedicated
        recovery layer works the same way on top of either. Instead, this is the comparison we&apos;d want
        if we were choosing a billing orchestration layer for a new subscription product today: what each
        platform is actually built to model, where the real limits sit, and which one matches a given
        business&apos;s pricing complexity rather than which one has the flashier feature list.
      </P>

      <KeyTakeaways
        items={[
          <>Chargebee goes deeper on <Strong>billing configurability</Strong> — Product Catalog, entitlements, usage-based billing, and revenue recognition reporting — while Recurly keeps a leaner Plans-and-Subscriptions core.</>,
          <>Recurly&apos;s <Strong>Account Updater</Strong> automatically refreshes expired or reissued cards through the Visa/Mastercard networks with no customer action; Chargebee has no built-in equivalent.</>,
          <>Both platforms ship a <Strong>configurable dunning system</Strong> — retry schedule plus template emails — but neither natively branches retry timing by decline reason the way a dedicated recovery tool does.</>,
          <>Neither is a <Strong>Merchant of Record</Strong>: you remain the seller on every transaction and own VAT/sales-tax compliance yourself, typically through your underlying gateway.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '2', label: 'billing platforms compared — neither a Merchant of Record' },
          { value: '1', label: "built-in card-refresh feature (Recurly's Account Updater)" },
          { value: '20–40%', label: 'of typical SaaS churn that is involuntary (failed payments), on either platform' },
        ]}
      />

      <H2 id="what-they-are">What Recurly and Chargebee actually are</H2>
      <P>
        Neither Recurly nor Chargebee processes card payments directly. Both are subscription-billing
        platforms — sometimes called billing orchestration layers — that sit on top of an underlying
        payment gateway (commonly Stripe, Braintree, or Adyen) and add the parts a gateway doesn&apos;t
        handle on its own: recurring invoice generation, plan and pricing management, proration logic,
        dunning configuration, and revenue reporting. You still need a connected gateway account underneath
        either one; Recurly and Chargebee orchestrate the billing logic, not the underlying money movement.
      </P>
      <P>
        The day-to-day mechanics look similar on both: you define plans and pricing in the platform&apos;s
        dashboard rather than hard-coding prices into your app, subscriptions move through a lifecycle
        (trialing, active, past-due, canceled) that both platforms track and expose via webhook, and
        upgrades or downgrades trigger proration logic that recalculates what the customer owes for the
        remainder of the billing period. Invoices, credit notes, and payment history live inside each
        platform&apos;s own dashboard, which is also where your support and finance teams end up looking
        first when a customer asks about a charge — not in the underlying gateway&apos;s dashboard, which
        only sees the raw transaction.
      </P>
      <P>
        That distinction matters because it means neither platform takes on Merchant-of-Record tax
        liability the way Paddle does. You remain the seller of record on every transaction running through
        either Recurly or Chargebee, which means VAT, GST, and US sales-tax registration and remittance
        stay your responsibility (or your gateway&apos;s tax add-on&apos;s responsibility), not something
        either billing platform absorbs for you. If you&apos;re trying to decide whether to become the
        merchant of record at all, that&apos;s a different comparison — see our{' '}
        <A href="/blog/paddle-vs-stripe-subscriptions">Paddle vs Stripe breakdown</A> for that structural
        choice.
      </P>
      <P>
        Both companies have also been through the same broader shift the subscription-billing category
        has gone through over the past several years: expanding from pure recurring-invoice tooling into
        a wider revenue-operations platform, adding reporting, quoting, and finance-facing modules on top
        of the original billing core. That expansion is exactly why the comparison has gotten harder to
        make on feature checklists alone — both now claim overlapping capability in places, and the real
        difference shows up in how deep and how opinionated each implementation of a given feature is,
        not whether the feature exists at all.
      </P>
      <P>
        Where they diverge is depth of configurability. Chargebee was built with an explicit focus on
        complex, usage-heavy B2B SaaS pricing — metered billing, seat-based tiers, add-ons, and
        entitlements that gate feature access based on plan — plus revenue recognition reporting that
        finance teams lean on for GAAP/ASC 606 compliance. Recurly&apos;s core model stays leaner: plans,
        subscriptions, and invoicing without as many configurable layers stacked on top, which is
        simpler to operate for straightforward subscription products but a real ceiling if your pricing
        model gets complicated.
      </P>
      <InBodyImage
        file="/blog/recurly-vs-chargebee-img-1"
        alt="Two stacked towers of billing layers side by side: Recurly's leaner two-layer stack of Subscriptions and Plans plus Invoicing, versus Chargebee's four-layer stack of Product Catalog, Entitlements, Usage-Based Billing, and Revenue Recognition"
        caption="Chargebee's billing model stacks more configurable layers on top of the gateway; Recurly keeps a leaner core aimed at straightforward subscription products."
      />

      <H2 id="billing-depth">Billing depth and configurability</H2>
      <P>
        If your pricing model is genuinely complex — usage-metered add-ons, per-seat tiers that change
        with headcount, feature entitlements that need to sync with your product&apos;s access control,
        or multiple products sold under one account — Chargebee&apos;s Product Catalog and entitlements
        system is built specifically to model that without custom code on your side. Its usage-based
        billing primitives handle metered consumption (API calls, storage, seats) natively, and its
        revenue recognition module produces the deferred-revenue schedules finance teams need without a
        separate RevRec tool bolted on.
      </P>
      <P>
        Recurly supports usage-based add-ons and tiered plans too, but the model is intentionally
        narrower. For a subscription business selling a small number of plan tiers — a media subscription,
        a SaaS product with two or three pricing tiers, a box subscription — that narrower model means
        less configuration surface to maintain, fewer places for billing logic to drift out of sync with
        your product, and a shorter path to getting billing live in the first place. The trade-off shows
        up the moment your pricing gets genuinely complicated: teams that outgrow Recurly&apos;s model
        tend to describe hitting a ceiling around exactly the entitlements and usage-metering depth that
        Chargebee was built around from the start.
      </P>
      <P>
        A concrete example makes the split easier to picture. A developer-tools API selling per-call
        metered pricing, with three seat tiers and a feature-gated enterprise add-on, is squarely
        Chargebee&apos;s territory — the entitlements engine gates which features a given plan can access,
        the usage-billing engine meters and rates the API calls, and the two compose without you writing
        reconciliation logic yourself. A subscription box, a single-tier media subscription, or a SaaS
        product with two or three flat pricing tiers doesn&apos;t need any of that machinery, and running
        it on Chargebee anyway usually means configuring (and paying for) capability you never touch.
        That&apos;s exactly the case where Recurly&apos;s narrower model is the better fit, not a
        compromise.
      </P>
      <Callout title="Neither replaces your gateway">
        Both platforms still depend entirely on the payment gateway underneath them for the actual card
        processing, 3D Secure/SCA handling, and network-level decline codes. Choosing Recurly or
        Chargebee doesn&apos;t change which processor you&apos;re on — it changes how your billing logic
        is organized on top of it.
      </Callout>

      <H2 id="revenue-recognition">Revenue recognition and financial reporting</H2>
      <P>
        For any subscription business selling annual or multi-year contracts, revenue recognition —
        spreading a lump-sum payment across the period it&apos;s actually earned, under ASC 606/IFRS 15 —
        is a real accounting requirement, not an optional nicety, the moment you have outside investors,
        an audit, or GAAP-compliant financial statements to produce. Chargebee builds a revenue recognition
        module directly into the platform: it generates deferred-revenue schedules and recognition
        journal entries from the same subscription and invoice data it already manages, which is one
        reason larger B2B SaaS finance teams gravitate toward it.
      </P>
      <P>
        Recurly does not ship an equivalent built-in revenue recognition module. Businesses running
        Recurly that need ASC 606 compliance typically export subscription and invoice data to a
        dedicated revenue recognition tool or handle it inside their accounting system directly. For a
        smaller subscription business without a dedicated finance function, that&apos;s rarely a blocker.
        For a venture-backed SaaS company preparing for an audit or a fundraise, it&apos;s a real
        consideration worth flagging to your finance team before committing to either platform.
      </P>

      <H2 id="dunning-recovery">Dunning and recovery: a shared model, one real differentiator</H2>
      <P>
        Both Recurly and Chargebee ship what we&apos;d call a settings-page dunning system: you configure
        a retry schedule (a handful of attempt days, typically spread across the first one to three weeks
        after a failed invoice) and a set of template reminder emails that fire alongside each attempt.
        Neither branches that schedule by decline reason out of the box — a card declined for insufficient
        funds and a card declined because it&apos;s expired get retried on the same generic timeline on
        both platforms by default.
      </P>
      <P>
        Recurly&apos;s genuine edge is <Strong>Account Updater</Strong>: a feature that runs in the
        background, checking cards on file against the Visa and Mastercard card-updater networks, and
        automatically replacing expired or reissued card numbers with the new one — no customer email,
        no SMS, no action required on their end. For subscription businesses with a lot of consumer cards
        on file, expired-card churn is a real and recurring slice of involuntary churn, and Account Updater
        closes a meaningful piece of it automatically, before dunning ever needs to run at all. Chargebee
        does not ship an equivalent built-in card-refresh mechanism; expired or reissued cards on Chargebee
        rely on the dunning sequence reaching the customer, or on whatever card-updater capability your
        underlying gateway itself offers.
      </P>
      <P>
        It&apos;s worth being precise about what Account Updater does and doesn&apos;t fix, since it&apos;s
        easy to overstate. It only helps when the card number itself changed — expired, reissued after a
        breach, or upgraded to a new product — because the network still recognizes the account and can
        hand over the replacement. It does nothing for a true decline: insufficient funds, an issuer that
        blocked the specific merchant, or a card reported lost or stolen. Those still need the dunning
        sequence, and ideally decline-reason-aware retry timing, to have any chance of recovering. Treat
        Account Updater as a genuine reduction in one category of failure, not a substitute for the rest
        of a recovery stack.
      </P>
      <InBodyImage
        file="/blog/recurly-vs-chargebee-img-2"
        alt="Two comparison cards: Recurly's configurable Dunning Cycle plus an Account Updater feature that auto-refreshes expired cards via card networks, versus Chargebee's configurable dunning schedule with no built-in card-refresh feature"
        caption="Both platforms configure a similar retry-and-email dunning schedule. Recurly's Account Updater is the concrete built-in difference — it fixes expired-card failures before an email ever needs to go out."
      />
      <P>
        Neither gap — the lack of decline-reason branching, or the lack of a native card-refresh feature
        on Chargebee&apos;s side — is a dealbreaker on its own, but both are exactly where a dedicated
        recovery layer earns its keep regardless of which billing platform you run. For more on how
        Recurly&apos;s dunning specifically works end to end, including Account Updater&apos;s honest
        limits, see our <A href="/blog/recurly-dunning">deep dive on Recurly Dunning & Payment
        Recovery</A>. For the equivalent breakdown on Chargebee, see our{' '}
        <A href="/blog/chargebee-dunning">Chargebee dunning guide</A>.
      </P>

      <InlineCTA>
        Whichever billing platform you run, Revova connects read-only to Recurly, Chargebee, Stripe,
        Paddle, and Braintree and layers decline-aware AI dunning, SMS recovery, and win-back campaigns
        on top. See your real lost-revenue number free, then decide.
      </InlineCTA>

      <H2 id="integrations">Integrations and ecosystem</H2>
      <P>
        Chargebee&apos;s broader focus on complex B2B billing comes with a correspondingly wider set of
        finance and CRM integrations out of the box — Salesforce, NetSuite, and similar systems that
        larger B2B SaaS finance teams already run, plus a marketplace of connectors built around its
        entitlements and usage-billing model. Recurly&apos;s integration set leans more toward the tools
        a subscription-commerce or media business is likely to already use, and its API surface reflects
        the leaner core model — simpler to integrate against for straightforward subscription logic,
        narrower if you need deep finance-system sync out of the box.
      </P>
      <P>
        Both expose webhooks for subscription and invoice lifecycle events (created, renewed, past-due,
        canceled), which is what a processor-agnostic recovery tool like Revova reads to run its own
        dunning sequence on top of either platform&apos;s native one. Neither webhook set is dramatically
        richer than the other for recovery purposes specifically — the meaningful difference for recovery
        is Account Updater, not the webhook depth.
      </P>
      <P>
        Gateway support is another point worth checking against your specific stack before committing to
        either platform. Both Recurly and Chargebee support Stripe, Braintree, and a range of other
        gateways as the underlying processor, but the exact list of supported gateways, payment methods,
        and regional payment types (SEPA Direct Debit, ACH, local wallets) varies between the two and
        changes over time as each platform adds coverage. Confirm your specific gateway and the regional
        payment methods you need are supported before assuming parity — don&apos;t take &quot;subscription
        billing platform&quot; as a guarantee that every gateway integration is equally mature on both.
      </P>
      <P>
        API and developer-experience quality is harder to compare on paper, but the practical shape lines
        up with the rest of this comparison: Chargebee&apos;s API surface is larger because there&apos;s
        more configurable model underneath it to expose — product catalog objects, entitlement checks,
        usage-event ingestion endpoints — which means more to learn but more to build against once you
        need it. Recurly&apos;s API surface stays closer to core subscription-billing concepts, which
        tends to mean a shorter ramp-up for a developer wiring up a straightforward integration and less
        surface area to keep in sync as your product evolves.
      </P>

      <H2 id="pricing-model">Pricing model: both quote-based, priced differently in practice</H2>
      <P>
        Neither Recurly nor Chargebee publishes a full public price list past an entry-level tier — both
        move to custom, volume-scaled quotes as you grow, which makes a precise dollar comparison
        impossible to state honestly without your specific numbers. What we can say directionally: because
        Chargebee&apos;s value proposition centers on configurability depth (entitlements, usage billing,
        RevRec), reaching for those features often means moving to a higher tier or add-on pricing.
        Recurly&apos;s leaner core keeps more capability inside its standard tiers, since there&apos;s
        less deep configurability to gate behind a higher plan in the first place. Get an actual quote from
        both against your real transaction volume, plan count, and feature list before deciding on price —
        published &quot;starting at&quot; figures rarely reflect what either platform charges at real scale.
      </P>
      <P>
        Implementation timeline is another practical difference worth weighing alongside price. Recurly&apos;s
        leaner data model generally means a faster path from signup to a working billing integration —
        fewer concepts to map, fewer configuration screens to get through before your first subscription
        goes live. Chargebee&apos;s onboarding takes longer in proportion to how much of its configuration
        surface you actually need — a simple flat-tier setup can move quickly, but wiring up entitlements,
        usage meters, and revenue recognition rules properly is a real implementation project, often with
        Chargebee&apos;s own implementation team involved for larger accounts. Neither is wrong; budget the
        timeline that matches how much of the platform you&apos;re actually going to use.
      </P>
      <P>
        Whatever you pay for billing, the fastest way to see your own failed-payment number today is our
        free <A href="/signup">Lost Revenue Finder</A> — connect Recurly or Chargebee read-only (via
        your gateway) and it scans your payment history to show exactly how many dollars you&apos;ve
        already lost to failed charges.
      </P>

      <H2 id="where-this-fits">Where Stripe, Braintree, and Paddle fit into this comparison</H2>
      <P>
        It&apos;s worth being explicit about where Recurly and Chargebee sit relative to the other names
        that come up in the same conversation. <Strong>Stripe</Strong> and <Strong>Braintree</Strong> are
        payment gateways/facilitators — they move the money and expose the raw card-network events, but
        neither ships the plan management, invoicing, and entitlements layer that Recurly and Chargebee
        specialize in. In practice, Recurly and Chargebee are commonly deployed on top of Stripe or
        Braintree, not instead of them; you still need one of those (or a similar gateway) underneath
        either billing platform.
      </P>
      <P>
        <Strong>Paddle</Strong> sits in a genuinely different category: it&apos;s a Merchant of Record,
        meaning it takes on the legal seller role and the VAT/sales-tax liability that both Recurly and
        Chargebee leave with you. If your deciding question is really &quot;should I offload tax
        compliance to a third party,&quot; that&apos;s the Paddle-vs-Stripe decision covered in our{' '}
        <A href="/blog/paddle-vs-stripe-subscriptions">Paddle vs Stripe comparison</A>, not this one. This
        comparison assumes you&apos;ve already decided to remain the merchant of record and are choosing
        the billing orchestration layer on top of your gateway — that&apos;s the Recurly-vs-Chargebee
        decision.
      </P>

      <H2 id="fit">Best fit by use case</H2>
      <InBodyImage
        file="/blog/recurly-vs-chargebee-img-3"
        alt="Two cards side by side: 'Choose Recurly if' for subscription commerce or media with a lot of consumer cards on file, versus 'Choose Chargebee if' for complex B2B SaaS billing with usage tiers, seats, and entitlements"
        caption="The honest split: Recurly for leaner subscription commerce with heavy card-on-file volume; Chargebee for B2B SaaS billing complexity."
      />
      <H3>Pick Chargebee if you run complex B2B SaaS billing</H3>
      <P>
        If your pricing model includes usage-metered tiers, seat counts that scale with headcount,
        feature entitlements tied to plan level, or you need built-in revenue recognition reporting for
        finance, Chargebee&apos;s deeper configuration model is built for exactly that without custom
        code. It&apos;s also the stronger pick if you already run (or plan to run) integrations into
        Salesforce, NetSuite, or similar finance/CRM systems out of the box, or if you expect an audit or
        fundraise that will put your revenue recognition process under real scrutiny.
      </P>
      <H3>Pick Recurly if you run consumer subscriptions, commerce, or media at volume</H3>
      <P>
        If your pricing model is a handful of straightforward plan tiers and a meaningful share of your
        involuntary churn traces back to expired or reissued cards rather than true declines, Recurly&apos;s
        leaner model plus Account Updater directly targets that failure mode automatically, at whatever
        scale you store cards on file. It&apos;s also the faster path to a live billing integration if you
        don&apos;t need entitlements or usage metering at all — less configuration surface means less to
        build and less to maintain going forward.
      </P>
      <H3>Already running one and evaluating the other</H3>
      <P>
        A full platform migration is a real project — remapping subscription and invoice data, rebuilding
        dunning configuration, and testing webhook integrations in a sandbox before cutover — so the bar
        to switch should be a genuine gap (a pricing-model ceiling on Recurly, or a card-expiry churn
        problem Chargebee isn&apos;t solving) rather than a marginal feature difference. In either case, a
        processor-agnostic recovery layer sitting on top means you don&apos;t have to rebuild your
        recovery stack if you do eventually migrate.
      </P>
      <P>
        A softer middle option some teams miss: if the only gap is card-expiry churn on Chargebee, or
        decline-reason branching on either platform, a dedicated recovery layer closes that gap without
        touching your billing platform at all. Migrating billing systems is disruptive and risky; adding
        a read-only recovery tool on top is not. Reach for the migration only when the gap is genuinely
        structural — entitlements, usage billing, or revenue recognition you can&apos;t get any other
        way — not when it&apos;s really a recovery problem wearing a billing-platform costume.
      </P>

      <H2 id="compare">Recurly vs Chargebee at a glance</H2>
      <P>
        Pulling every dimension above into one table makes the trade-off easier to scan in one pass —
        model, billing depth, dunning, and who each is really built for:
      </P>
      <CompareTable
        rows={[
          ['Dimension', 'Recurly', 'Chargebee'],
          ['Model', 'Subscription billing platform on top of a gateway', 'Subscription billing platform on top of a gateway'],
          ['Merchant of Record', 'No — you remain the seller of record', 'No — you remain the seller of record'],
          ['Billing depth', 'Leaner: plans, subscriptions, invoicing', 'Deeper: Product Catalog, entitlements, usage billing, RevRec'],
          ['Dunning', 'Configurable retry schedule + template emails', 'Configurable retry schedule + template emails'],
          ['Card-refresh feature', 'Account Updater — automatic, built in', 'No native equivalent'],
          ['Decline-reason branching', 'Not native by default', 'Not native by default'],
          ['Pricing', 'Custom quote, leaner tiers gate less', 'Custom quote, deeper features often gated higher'],
          ['Best for', 'Subscription commerce/media, heavy cards-on-file', 'Complex B2B SaaS — usage, seats, entitlements'],
        ]}
      />

      <ProsCons
        pros={[
          "Recurly's Account Updater fixes expired-card churn automatically, with no customer action",
          'Leaner core model is faster to configure for straightforward subscription pricing',
          "Chargebee's entitlements and usage billing fit complex B2B pricing without custom code",
          "Chargebee's revenue recognition module helps finance teams with GAAP/ASC 606 reporting",
        ]}
        cons={[
          'Neither is a Merchant of Record — you still own VAT/sales-tax compliance yourself',
          'Neither branches dunning retry timing by decline reason out of the box',
          "Recurly's leaner model becomes a ceiling for genuinely complex B2B pricing",
          'Chargebee has no built-in equivalent to Account Updater for expired-card recovery',
        ]}
      />
      <P>
        Whichever platform fits, see full pricing for our own recovery layer on the{' '}
        <A href="/pricing">Revova pricing page</A> — Starter at $29/month runs a 4-email AI dunning
        sequence on Days 1, 3, 7, and 14; Pro at $79/month adds a 5-email sequence through Day 21,
        hard/soft decline smart routing, SMS recovery, an in-app cancel flow, and win-back campaigns.
        Both include a 14-day free trial, no credit card required, and a 30-day money-back guarantee.
      </P>

      <InlineCTA>
        Running Recurly, Chargebee, or both across different products? Revova connects read-only to
        either — plus Stripe, Paddle, and Braintree — and runs the same AI recovery sequence on top.
        $29 Starter / $79 Pro, 14-day free trial, no card.
      </InlineCTA>

      <Divider />

      <P>
        For more on how each platform&apos;s native dunning works end to end, see our guides on{' '}
        <A href="/blog/recurly-dunning">Recurly Dunning & Payment Recovery</A> and{' '}
        <A href="/blog/chargebee-dunning">Chargebee Dunning Management</A>. And because involuntary
        churn is commonly 20–40% of total SaaS churn regardless of which billing platform you run, see
        our explainer on <A href="/blog/what-is-involuntary-churn">what involuntary churn actually
        is</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Whichever billing platform you run, don't leave recovery to chance"
        body="Connect Recurly, Chargebee, Stripe, Paddle, or Braintree and Revova's free Lost Revenue Finder shows exactly how much you've already lost to failed payments — then recovers it automatically. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
