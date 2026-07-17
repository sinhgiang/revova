import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, CodeCard, BarChart, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Does turning on Stripe Smart Retries cost anything extra?',
    a: 'No. Smart Retries is a configuration option inside Stripe Billing, not a separate paid add-on — if you already run subscriptions through Stripe Billing, enabling it costs nothing beyond your normal Stripe processing fees. That is also exactly why it is worth turning on regardless of whether you use a dedicated recovery tool on top of it: there is no trade-off to weigh, only a dashboard setting to flip.',
  },
  {
    q: 'How many times will Stripe actually retry a failed charge?',
    a: 'That is configurable, not fixed — in the Stripe Dashboard you set a maximum number of retry attempts and an overall retry window, and Smart Retries decides the specific days within that window using its machine learning model rather than retrying on a rigid daily interval. Stripe does not publish an exact universal number of attempts because the model is adaptive per card, decline code, and network conditions; what you control is the ceiling (how many attempts, how long the window runs), not the individual dates.',
  },
  {
    q: 'Can I turn off Smart Retries or write my own fixed retry schedule instead?',
    a: 'Yes. Stripe Billing lets you disable Smart Retries and fall back to a manually defined retry rule — for example, a fixed number of attempts at fixed day intervals — inside the same failed-payment settings. Most businesses are better off leaving Smart Retries on, since the ML-timed approach is generally a better default than a blind fixed interval, but the manual override exists for teams with a specific reason to control exact retry dates themselves.',
  },
  {
    q: 'Does Smart Retries work on one-time charges, or only subscriptions?',
    a: 'Smart Retries is built for Stripe Billing subscription invoices — recurring charges that fail on renewal. A one-off PaymentIntent outside of Billing does not go through the same automatic re-attempt logic; if a single charge fails, your integration has to decide whether and how to retry it yourself. This is one of the reasons Smart Retries is described specifically as a subscription revenue-recovery feature rather than a general-purpose payment retry tool.',
  },
  {
    q: 'What happens once the retry window ends and the charge still has not succeeded?',
    a: 'Stripe stops retrying and applies whatever behavior you configured for exhausted retries — commonly marking the invoice as uncollectible, leaving the subscription past due, or canceling it, depending on your settings. Smart Retries itself does not keep trying indefinitely, and it does not automatically notify the customer that this happened; whatever occurs next — a dunning email, a downgrade, a cancellation — is on you to have configured elsewhere, whether inside Stripe’s own basic email settings or a dedicated tool layered on top.',
  },
  {
    q: 'Does Smart Retries email or text my customers when a charge fails?',
    a: 'No — Smart Retries itself is silent. It is purely a re-attempt-timing feature; it does not send an email, an SMS, or an in-app notification of any kind. Stripe Billing does separately offer basic, non-branching failed-payment email templates you can enable, but those are a different, optional setting from Smart Retries, and they do not personalize by decline reason, timezone, or language the way a dedicated dunning sequence does.',
  },
  {
    q: 'Is Smart Retries available for Paddle, Braintree, Chargebee, or Recurly too?',
    a: 'No — Smart Retries specifically is a Stripe Billing feature and only applies to charges processed through Stripe. Paddle, Braintree, Chargebee, and Recurly each run their own separate retry logic with their own configuration and their own vocabulary for decline reasons, none of which is the same machine-learning-timed system Stripe ships. If you run more than one processor, each one needs its retry behavior configured — and monitored — on its own terms.',
  },
  {
    q: 'If Smart Retries is already recovering some failed charges, do I still need a dunning email sequence?',
    a: 'Yes, and this is really the point of this whole guide. Smart Retries alone typically recovers roughly 30–40% of failed charges by re-attempting on a statistically better day — real, free recovery, but entirely silent. It never tells the customer their card failed, never asks them to fix an expired card, and never runs a single day past the window you configured. Layering a decline-reason-branched dunning sequence on top — proactively reaching the customer instead of waiting on a silent retry — is commonly what pushes combined recovery into the 40–60% range industry-wide, instead of capping out at whatever the retry-only floor happens to be.',
  },
  {
    q: 'Does Smart Retries help with declines caused by Strong Customer Authentication (SCA) under PSD2?',
    a: 'Not by itself in any meaningful way. A charge declined with authentication_required is waiting on the customer to complete a 3D Secure / 3DS2 challenge, not on a better-timed retry attempt — retrying the same charge again, however well-timed, does not satisfy an authentication requirement the customer never completed. That specific failure mode needs the customer to be routed to a re-authentication link, which is a communication step Smart Retries does not perform on its own.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Stripe Smart Retries is a built-in Stripe Billing feature that automatically re-attempts a
        failed subscription charge on a day its machine learning model predicts is more likely to
        succeed, rather than retrying blindly on a fixed daily schedule. It is trained on patterns
        across Stripe&apos;s entire network — not just your account — and factors in things like the
        decline code, the card network, and when similar charges have historically cleared, then
        picks the retry dates for you inside whatever maximum-attempts and retry-window settings you
        configure in the Dashboard. Turned on, it typically recovers something in the commonly cited{' '}
        <Strong>30–40% of failed charges</Strong> range — a real, free lift with zero code required.
        What it does not do is just as important: it never emails or texts a customer, never branches
        its behavior by decline reason in a way you can see or control, never touches a processor
        other than Stripe, and never reaches back to recover a charge that failed before you turned it
        on. This guide covers exactly how Smart Retries works under the hood, how to enable and
        configure it in the Stripe Dashboard, what a typical retry window looks like conceptually,
        what it is genuinely good at, and — the part most Stripe documentation glosses over — the
        specific gaps a dedicated dunning layer exists to close.
      </Lead>
      <P>
        We build a recovery tool that runs on top of Stripe (and four other processors) for a living,
        which means a large part of our job is explaining to founders what Stripe already does for
        them for free versus what still needs a dedicated layer on top. Smart Retries comes up in
        almost every one of those conversations, usually because someone assumed it was doing more
        than it actually is. It is a genuinely good feature. It is also a narrower one than its name
        suggests, and knowing exactly where the line sits is the difference between correctly relying
        on it and quietly leaving revenue on the table because you assumed it was covering something
        it never touched.
      </P>

      <KeyTakeaways
        items={[
          <>Smart Retries is a <Strong>timing</Strong> feature only — it decides <em>when</em> to re-attempt a failed Stripe Billing subscription charge, using a machine learning model trained across Stripe&apos;s network.</>,
          <>It is genuinely effective on its own: industry estimates commonly put Smart-Retries-only recovery around <Strong>30–40% of failed charges</Strong>.</>,
          <>It is completely silent — no customer email, SMS, or in-app message ever comes from Smart Retries itself.</>,
          <>It only covers Stripe, only covers charges going forward from when it is enabled, and stops entirely once your configured retry window ends.</>,
          <>Retries plus a decline-reason-branched dunning sequence commonly push combined recovery into the <Strong>40–60%</Strong> range — Smart Retries is a foundation to build on, not a substitute for the rest of the stack.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '30–40%', label: 'of failed charges Stripe Smart Retries alone typically recovers' },
          { value: '40–60%', label: 'combined recovery commonly cited when retries run alongside dunning' },
          { value: '5–10%', label: 'of subscription charges that fail or get declined in a typical billing cycle' },
        ]}
      />

      <H2 id="what-it-is">What Stripe Smart Retries actually is</H2>
      <P>
        Stripe Smart Retries is a Stripe Billing setting that automatically re-attempts a subscription
        invoice payment that failed on its first try, choosing the retry date with a machine learning
        model instead of a fixed interval you set yourself. It sits entirely on Stripe&apos;s side of
        the transaction: no webhook, no code, and no third-party tool is required to get the base
        behavior running — you turn it on, and Stripe starts making the retry-timing decisions for
        every qualifying failed invoice from that point forward.
      </P>
      <P>
        It is worth being precise about what &quot;smart&quot; means here, because it is easy to
        overread the name. Smart Retries is not a dunning tool, a churn-prevention suite, or a customer
        communication system — Stripe is explicit that its job is re-attempting the <em>charge</em>,
        not contacting the <em>customer</em>. It replaces a much cruder default: retrying every failed
        subscription charge again the next day, or on some other fixed interval, regardless of whether
        that particular day has any statistical relationship to when the charge is likely to succeed.
        That crude version is what most homegrown retry logic looks like before a team either enables
        Smart Retries or builds their own version of the same idea by hand.
      </P>
      <Callout title="Where it sits in the recovery stack">
        Smart Retries is one stage in a larger recovery stack that also includes pre-dunning (warning a
        customer before a card expires), dunning (emailing them after a failure), and win-back
        (re-engaging someone who already churned). If you want the full picture of how those four
        stages fit together, <A href="/blog/what-is-dunning">what is dunning</A> covers the taxonomy in
        depth — this article stays narrowly focused on the retry stage itself.
      </Callout>

      <H2 id="how-it-works">How the machine learning retry-timing model actually works</H2>
      <P>
        Smart Retries decides <em>when</em> to re-attempt a failed charge by training on aggregate
        payment patterns across Stripe&apos;s network rather than relying only on your own account&apos;s
        history, which matters most for smaller businesses that simply do not have enough failed-charge
        volume of their own to learn much from. A subscription business processing a few dozen failed
        charges a month has nowhere near enough data to build a reliable timing model in-house; Stripe&apos;s
        model is trained across every business on the platform, which is exactly the kind of scale this
        problem needs.
      </P>
      <H3>The signals the model weighs</H3>
      <UL>
        <LI>
          <Strong>The decline code itself.</Strong> A charge declined with <code>insufficient_funds</code>{' '}
          behaves very differently over time than one declined <code>do_not_honor</code> or{' '}
          <code>card_declined</code> — the model treats these differently rather than retrying every
          decline reason on the same clock.
        </LI>
        <LI>
          <Strong>The card network and issuing bank.</Strong> Different card networks and issuers show
          different patterns in when a previously-declined card is likely to clear on a subsequent
          attempt, and the model factors that in rather than treating every card as identical.
        </LI>
        <LI>
          <Strong>Historical retry outcomes for similar transactions.</Strong> Stripe&apos;s aggregate view
          across its network gives the model a much larger sample of &quot;what happened the last time a
          transaction that looked like this one was retried a few days later&quot; than any single
          business could ever accumulate on its own.
        </LI>
      </UL>
      <P>
        The practical result is a retry date that is not evenly spaced and not identical from one failed
        charge to the next — two charges that failed for different reasons, on different card networks,
        can end up with meaningfully different retry timing even if they failed on the same calendar
        day. That is the entire value proposition: fewer wasted retry attempts on days statistically
        unlikely to succeed, and a better-placed attempt on the days that are.
      </P>
      <InlineCTA>
        Curious how much Smart Retries has already recovered versus quietly missed on your own Stripe
        account? Revova&apos;s free Lost Revenue Finder scans your real payment history — Starter goes back
        90 days, Pro goes back a full 12 months — and shows the actual number before you commit to
        anything.
      </InlineCTA>

      <H2 id="configure">How to enable and configure Smart Retries in the Stripe Dashboard</H2>
      <P>
        Smart Retries lives inside your Stripe Billing settings under the failed-payment / subscription
        automation configuration, and turning it on is a Dashboard toggle rather than an engineering
        project. The steps are the same shape for most Stripe accounts, though the exact menu labels
        have shifted slightly across Stripe Dashboard redesigns over the years:
      </P>
      <OL>
        <LI>
          In the Stripe Dashboard, open your <Strong>Billing</Strong> settings and find the section for
          managing failed subscription payments (sometimes labeled &quot;Manage failed payments,&quot;
          &quot;Automations,&quot; or &quot;Subscriptions and emails,&quot; depending on your Dashboard
          version).
        </LI>
        <LI>
          Enable <Strong>Smart Retries</Strong> in place of a fixed retry schedule — this is the toggle
          that switches from a manually defined interval to Stripe&apos;s ML-timed model.
        </LI>
        <LI>
          Set the maximum number of retry attempts and the overall retry window (how many days or weeks
          Stripe should keep trying before giving up) — these are the ceilings you control; the specific
          dates within them are what the model decides.
        </LI>
        <LI>
          Decide what happens once retries are exhausted: mark the invoice as uncollectible, leave the
          subscription past due, or cancel it outright. This setting matters more than it looks — it
          determines whether a customer silently loses access or silently keeps it with an unpaid
          balance sitting behind the scenes.
        </LI>
        <LI>
          Optionally enable Stripe&apos;s own basic failed-payment email templates in the same settings
          area if you want some customer-facing notice — understanding that these are generic,
          non-branching emails, not a decline-reason-personalized sequence.
        </LI>
      </OL>
      <Callout title="A setting worth double-checking before you assume it is on">
        Smart Retries is not necessarily on by default for every Stripe Billing account, and it can be
        silently reverted to a manual retry schedule if someone on your team edited failed-payment
        settings in the past. It is worth a five-minute check in the Dashboard even if you are fairly
        confident it is already enabled — a fixed, unoptimized retry schedule quietly running instead of
        Smart Retries is an easy thing to miss for months.
      </Callout>
      <P>
        None of this requires touching your codebase. Where engineering time does come in is deciding
        what should happen <em>after</em> Smart Retries and Stripe&apos;s own basic emails are done — that
        is the layer this article gets to later, and it is also where{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>{' '}
        walks through the full setup, webhooks included, in more depth than this Smart-Retries-specific
        guide needs to.
      </P>

      <H2 id="verify">How to confirm Smart Retries is actually working on your account</H2>
      <P>
        Two places tell you for certain whether Smart Retries is really running, rather than a fixed
        retry schedule quietly left over from before it was enabled: the invoice detail page for any
        individual failed charge, and Stripe&apos;s test-mode tooling if you want to watch the behavior
        happen on demand instead of waiting for a real customer&apos;s card to fail.
      </P>
      <P>
        On a real failed invoice, the Dashboard shows a &quot;next payment attempt&quot; date alongside
        the history of prior attempts — if that next-attempt date looks identical across every invoice
        regardless of decline reason or card, that is a sign a manual fixed-interval rule is running
        instead of the ML-timed one. In test mode, Stripe&apos;s <Strong>test clocks</Strong> let you
        simulate the passage of days or weeks against a subscription without actually waiting for them,
        which is the fastest way to watch a full Smart Retries cycle play out. Create a subscription
        against a card built to fail predictably — <code>4000000000009995</code> always declines with{' '}
        <code>insufficient_funds</code> — advance the test clock forward, and watch the retry attempts
        and their timing show up in the Dashboard&apos;s event log exactly as they would for a real
        customer, just compressed into minutes instead of weeks.
      </P>
      <Callout title="A quick sanity check worth running once">
        Pull up three or four recent failed invoices with different decline reasons and compare their
        next-attempt dates. If they all show the exact same interval regardless of why they failed, that
        is a strong signal Smart Retries either was never turned on or was reverted to a manual schedule
        at some point — worth confirming in the Dashboard settings directly rather than assuming.
      </Callout>

      <H2 id="schedule">What a typical retry window looks like, conceptually</H2>
      <P>
        Stripe does not publish the exact schedule its model produces for a given card, because the
        whole point of the model is that the timing adapts per transaction rather than following one
        universal formula. What you do control, and what is worth understanding conceptually, is the
        shape of the window the retries happen inside — a handful of attempts spread across roughly one
        to two weeks, weighted toward days more likely to matter (like a probable payday) rather than
        spaced at even 24-hour intervals.
      </P>
      <BarChart
        bars={[
          { label: 'Attempt 1', pct: 10, value: 'Day 1–2' },
          { label: 'Attempt 2', pct: 32, value: 'Day 4–5' },
          { label: 'Attempt 3', pct: 55, value: 'Day 7–9' },
          { label: 'Attempt 4', pct: 78, value: 'Day 11–12' },
          { label: 'Final attempt', pct: 100, value: '~Day 14' },
        ]}
        caption="Illustrative only — a conceptual example of how retry attempts might cluster within a two-week Smart Retries window. Stripe does not publish its actual model; real timing adapts per card, decline code, and network conditions rather than following fixed intervals like this example."
      />
      <P>
        The reason this matters practically is less about the exact dates and more about what it
        implies for anything you build on top of it. A dunning email sequence timed to fire the moment a
        charge first fails, and again a few days later, is running <em>in parallel</em> with whatever
        Smart Retries is doing in the background — not instead of it, and not necessarily on the same
        calendar days. Keying your own sequence off the original failure date (or the invoice ID)
        rather than trying to predict Stripe&apos;s exact retry dates is the more reliable approach, and
        it is what a dedicated dunning sequence should do regardless of whatever day Smart Retries
        happens to attempt again.
      </P>

      <H2 id="good-and-limits">What Smart Retries is genuinely good at — and where it stops</H2>
      <P>
        Smart Retries earns its keep on exactly the problem it was built for: picking a better day to
        re-attempt a charge than a blind fixed interval would. Where it runs out of scope is everything
        adjacent to that — communication, cross-processor coverage, and anything that happened before it
        was switched on.
      </P>
      <ProsCons
        pros={[
          'Meaningfully better retry timing than a blind fixed-interval schedule, trained on network-wide patterns no single business could reproduce alone',
          'Turns on with a Dashboard toggle — no code, no webhook, no engineering time required',
          'Included in Stripe Billing at no extra cost',
          'Runs continuously and automatically once configured, with no ongoing maintenance',
          'Genuinely reduces wasted attempts on days statistically unlikely to succeed',
        ]}
        cons={[
          'Completely silent — never emails, texts, or in-app-messages the customer at any point',
          'Does not branch its behavior by decline reason in any way you can see, customize, or route differently',
          'Stripe-only — does nothing for a Paddle, Braintree, Chargebee, or Recurly charge',
          'Does not retroactively touch charges that failed before it was enabled',
          'Stops entirely once your configured retry window ends, with no further attempt afterward',
        ]}
      />
      <P>
        None of the items in that second column are a knock on the feature — they are simply outside
        its job description. Stripe built Smart Retries to solve one specific, well-defined problem
        (retry timing) extremely well, not to be a full revenue-recovery suite. The gap only becomes a
        problem when a team assumes it is covering more ground than it actually is.
      </P>

      <H2 id="decline-blindspot">Why decline-reason blindness is the limitation that costs the most</H2>
      <P>
        Of everything Smart Retries does not do, the one with the biggest practical impact is that it
        treats every decline reason as just &quot;retry again, on a smarter day&quot; — it does not ask a
        soft-declined card differently than it handles a hard-declined one, and critically, it never
        surfaces that distinction to the customer at all. A soft decline and a hard decline need
        completely different handling, and only one of them benefits from retrying at all.
      </P>
      <CodeCard
        code="insufficient_funds"
        type="soft"
        meaning="The card itself is fine — there simply wasn't enough available balance at the moment of the charge, often clearing on its own within days."
        action="Smart Retries will schedule another attempt, often timed near a likely payday — genuinely useful here. But it never tells the customer their card failed or why, so if the balance still isn't there when it retries, the charge fails silently again with no human follow-up at all."
      />
      <CodeCard
        code="expired_card"
        type="hard"
        meaning="The card on file is past its expiry date and will never succeed on retry, no matter which day is chosen or how many attempts are made."
        action="No amount of smarter timing fixes an expired card. Smart Retries typically still uses up part of its attempt budget finding this out empirically rather than skipping straight to asking for a new number — it has no mechanism to ask the customer for one itself."
      />
      <CodeCard
        code="authentication_required"
        type="auth"
        meaning="The issuer is requiring Strong Customer Authentication (SCA) under PSD2 — usually a 3D Secure / 3DS2 challenge — before the charge can complete."
        action="Retrying the identical charge again does not satisfy an authentication step the customer never completed. This decline reason specifically needs the customer routed to a re-authentication link, which is a communication action outside what Smart Retries performs on its own."
      />
      <P>
        For the full reference of decline codes beyond these three — including how each one should be
        handled in a dunning sequence rather than just a retry — see{' '}
        <A href="/blog/stripe-decline-codes-explained">our guide to Stripe decline codes explained</A>.
        The pattern to notice across all three cards above is the same one: Smart Retries is doing the
        right thing on the retry side in every case, and doing nothing at all on the communication side
        in every case — which is exactly the gap a decline-reason-branched dunning sequence exists to
        close.
      </P>
      <InlineCTA>
        Revova&apos;s Pro plan ($79/month) reads the decline reason the moment Stripe&apos;s retry attempts
        are exhausted and routes it automatically — a soft decline gets a patient nudge, a hard decline
        gets a direct ask for a new card, an SCA-related decline gets a re-authentication link — with no
        manual routing logic for you to build.
      </InlineCTA>

      <H2 id="not-same-as-dunning">Why Smart Retries is not the same thing as a dunning sequence</H2>
      <P>
        Smart Retries and a dunning email sequence solve two genuinely different problems that happen
        to sit next to each other in the same failed-payment workflow, and conflating them is the single
        most common mistake we see from founders who assume enabling one Dashboard toggle means the
        whole recovery problem is handled. Smart Retries decides <em>when the processor tries again</em>.
        Dunning decides <em>what the customer is told and asked to do</em>. A business can have one
        running perfectly and the other not running at all.
      </P>
      <CompareTable
        rows={[
          ['Dimension', 'Stripe Smart Retries alone', 'Smart Retries + a dunning layer (e.g., Revova)'],
          ['What it optimizes', 'When Stripe re-attempts the charge', 'What the customer is told, and when'],
          ['Customer communication', 'None — fully silent', 'AI-written email (and SMS on Pro), branched by decline reason'],
          ['Decline-reason branching', 'Not exposed as a lever you control', 'Soft, hard, and SCA declines routed to different copy and tone'],
          ['Processor coverage', 'Stripe only', 'Stripe, Paddle, Braintree, Chargebee, Recurly'],
          ['Historical failures (pre-setup)', 'Not touched', 'Lost Revenue Finder scans 90 days (Starter) or 12 months (Pro)'],
          ['After cancellation', 'Nothing further happens', 'Win-back sequence on Day 3, 14, and 30 (Pro)'],
          ['Language / locale', 'Not applicable', '8 languages based on customer locale (Pro)'],
          ['Cost', 'Free, included in Stripe Billing', '$29–$79/month, 14-day free trial, no card required'],
        ]}
      />
      <P>
        The two columns above are not competing with each other — they run at the same time, on the
        same failed invoice, doing entirely different jobs. Turning off Smart Retries to rely only on a
        dunning sequence would be a mistake in the other direction: you would lose the free, silent
        recovery layer that catches a meaningful share of failures before a customer ever needs to be
        emailed at all. The two together, not either alone, is what commonly gets a business into the
        40–60% combined recovery range instead of stopping wherever a single stage caps out.
      </P>
      <P>
        If you want the deeper walkthrough of what a well-built dunning sequence looks like day by day —
        cadence, tone shifts, and the mistakes that quietly cap recovery — that ground is already covered
        in{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">our dunning email sequence setup guide</A>{' '}
        and in <A href="/blog/what-is-dunning">what is dunning</A>. This article stays narrowly on what
        Smart Retries itself does and does not do, which is the piece those two do not repeat in this
        much depth.
      </P>

      <H2 id="historical-failures">The gap Smart Retries can never close: failures that already happened</H2>
      <P>
        Smart Retries only applies to invoices that fail from the moment it is configured forward — it
        has no mechanism to reach back and re-attempt a charge that already failed and was written off
        months or years ago. For most subscription businesses that have been running for any length of
        time, that backlog is not trivial: old failed invoices sitting in the Stripe Dashboard, never
        chased by anything, representing customers who may still want the product but whose card simply
        failed once and nothing followed up.
      </P>
      <P>
        This is also the one gap that no amount of Smart Retries configuration, however well-tuned, can
        ever retroactively fix — it is a structural limitation of when the feature starts operating, not
        a setting you missed. Sizing that backlog is usually a five-minute exercise rather than a
        research project, and it is worth doing before assuming your recovery setup is &quot;done&quot;
        just because Smart Retries is on.
      </P>
      <InlineCTA>
        Revova&apos;s free Lost Revenue Finder connects read-only to Stripe (or Paddle, Braintree,
        Chargebee, Recurly) and scans your actual payment history — 90 days on Starter, a full 12 months
        on Pro — to show exactly how much old, never-chased failures are worth before you commit to
        anything.
      </InlineCTA>
      <P>
        For a broader look at how to size this number across your whole account — not just the
        historical backlog, but ongoing monthly leakage too — see{' '}
        <A href="/blog/how-much-revenue-lost-to-failed-payments">
          how much revenue you&apos;re losing to failed payments
        </A>.
      </P>

      <H2 id="run-together">How to run Smart Retries and a dunning sequence together, correctly</H2>
      <P>
        Getting this right is mostly a matter of not stepping on your own retries, not a hard
        engineering problem. Four practical rules keep the two layers working together instead of
        confusing each other or the customer:
      </P>
      <UL>
        <LI>
          <Strong>Leave Smart Retries on.</Strong> It is free, it requires nothing further from you once
          configured, and disabling it to avoid &quot;conflicting&quot; with a dunning sequence throws
          away real recovery for no benefit — the two do not conflict.
        </LI>
        <LI>
          <Strong>Key your dunning sequence off the original failure (or invoice ID), not off Stripe&apos;s
          retry dates.</Strong> Trying to time your Day 1 email around when you think Smart Retries will
          attempt again is unnecessary and fragile, since the exact dates are not published or guaranteed
          — start the sequence when the charge first fails and let it run on its own clock.
        </LI>
        <LI>
          <Strong>Stop the sequence the moment a retry succeeds.</Strong> If Smart Retries or a later
          manual retry clears the charge, the customer should not keep receiving emails about a payment
          that already went through — this is one of the most common complaints from customers whose
          card genuinely was fixed in the background.
        </LI>
        <LI>
          <Strong>Decide what happens when both run out.</Strong> Once the Smart Retries window ends and
          your dunning sequence has sent its last email, have an explicit next step configured — pause
          access, downgrade, cancel, or enroll in a win-back sequence — rather than leaving the account in
          an ambiguous past-due state indefinitely.
        </LI>
      </UL>
      <P>
        Revova handles the middle two of those automatically: it reads the decline code and invoice
        state directly from your processor, starts its own sequence independent of Stripe&apos;s retry
        timing, and stops the moment a payment actually clears — so the two systems never talk past each
        other or double up on a customer who already fixed the problem.
      </P>
      <P>
        <Strong>Starter</Strong> ($29/month) runs a 4-email AI sequence on Days 1, 3, 7, and 14 and its
        free Lost Revenue Finder scans your last 90 days. <Strong>Pro</Strong> ($79/month) extends the
        sequence through Day 21, adds hard/soft/SCA decline routing, writes the sequence in 8 languages,
        adds SMS recovery, an in-app cancel-flow with retention offers, win-back campaigns on Day 3, 14,
        and 30 after cancellation, a full 12-month historical scan, a weekly digest, and priority
        support. Both plans include a 14-day free trial with no credit card required and a 30-day
        money-back guarantee — the full breakdown is on the <A href="/pricing">Revova pricing page</A>.
      </P>
      <InlineCTA>
        Connect Stripe, Paddle, Braintree, Chargebee, or Recurly read-only — Revova never touches card
        data — and run a dunning sequence alongside whatever retry logic your processor already handles,
        starting at $29/month with a 14-day free trial.
      </InlineCTA>

      <Divider />

      <P>
        For Stripe&apos;s own documentation on how Smart Retries schedules re-attempts, see{' '}
        <A href="https://stripe.com/docs/billing/revenue-recovery/smart-retries">
          Stripe&apos;s Smart Retries documentation
        </A>
        , and for Stripe&apos;s reference on decline types and how hard versus soft declines behave, see{' '}
        <A href="https://stripe.com/docs/declines">Stripe&apos;s documentation on declines</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Smart Retries handles the timing. We handle the rest."
        body="Revova runs a decline-reason-branched AI dunning sequence, SMS recovery, and a historical Lost Revenue scan on top of whatever retry logic Stripe, Paddle, Braintree, Chargebee, or Recurly already handles — so nothing that happens after a silent retry gets left to chance. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
