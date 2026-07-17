import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, CodeCard, EmailExample, PriorityMatrix, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Do I need to write code to set up a dunning sequence?',
    a: 'Not necessarily. Stripe, Chargebee, and Recurly all expose enough dashboard-level configuration to get a basic, single-template sequence running with zero code. What does need engineering is anything beyond the basics: branching copy by decline reason, sending at the customer’s local hour instead of a fixed time, suppressing bounced addresses automatically, and recovering failures that happened before you set anything up. A tool like Revova gets you all of that — decline-reason routing, timezone-aware sends, suppression, and a historical scan — by pasting a read-only processor key, no webhook endpoint or code required.',
  },
  {
    q: 'Which ESP should I use if I’m building this myself?',
    a: 'You want a transactional email provider, not a marketing-newsletter tool — Postmark, SendGrid, Customer.io, Braze, and Mailgun are the common choices, because they’re built for triggered, API-fired sends rather than scheduled campaigns and they report deliverability metrics (bounces, spam complaints) per message. Customer.io and Braze both support delivering at the recipient’s local time natively, which saves you from building your own timezone-bucketing job. Whichever you pick, get SPF, DKIM, and DMARC configured on the sending domain before your first real send — an unauthenticated domain routinely lands dunning emails in spam, which defeats the entire sequence regardless of how good the copy is.',
  },
  {
    q: 'How long does setup actually take?',
    a: 'Realistically, a DIY build — wiring the webhook, writing decline-reason branches, setting up timezone-aware sends, and testing — runs one to two weeks of combined engineering and copywriting time for a first version, then ongoing maintenance as processors change their event payloads. Connecting Revova to Stripe, Paddle, Braintree, Chargebee, or Recurly takes under 10 minutes: paste a read-only API key, and the AI-written sequence, decline-reason routing, and timezone logic are already built.',
  },
  {
    q: 'Can I test the sequence before real customers see it?',
    a: 'Yes, and you should treat this as non-negotiable. Stripe’s test mode ships specific card numbers that simulate exact decline reasons — 4000000000009995 always declines with insufficient_funds, 4000000000000341 attaches successfully but fails on the next charge attempt — so you can trigger every branch of your sequence on demand instead of waiting for a real customer’s card to fail. Send yourself a full run of every branch, check that merge fields (name, product, card’s last four digits, renewal date) resolve correctly, and click every link, including unsubscribe, before flipping it on for real customers.',
  },
  {
    q: 'What metrics should I watch once the sequence is live?',
    a: 'Six numbers matter, roughly in this order: delivery rate (are emails actually arriving), open rate (industry benchmarks commonly run 30–40% for dunning specifically), click-through rate to the card-update link (commonly 10–15%), recovery rate (what share of failed charges get fixed), unsubscribe and spam-complaint rate (a rising trend here usually means tone or frequency is off, not that dunning itself is a bad idea), and dollars actually recovered. Watch these weekly at first, not daily — a few days of noise in a small dataset will send you chasing signals that aren’t there.',
  },
  {
    q: 'Does Revova replace my existing ESP or CRM?',
    a: 'No, and it isn’t trying to. Revova is a dedicated recovery layer that reads decline events from your payment processor and sends the dunning, pre-dunning, and win-back sequences itself — it doesn’t touch your marketing newsletter, your transactional receipts, or your CRM. Most customers run Revova alongside whatever they already use for general email, the same way they’d run a dedicated analytics tool alongside a general-purpose dashboard.',
  },
  {
    q: 'What happens if my webhook endpoint goes down for a few hours — do I lose those failed charges?',
    a: 'On Stripe specifically, no — failed webhook deliveries are retried on an exponential backoff for up to three days, and the Dashboard’s Events log lets you manually resend anything that was missed, so a short outage on your end rarely means a permanently lost event. It’s still worth building in a daily reconciliation job that polls recent charges directly as a backstop, because relying entirely on webhook delivery with no fallback is the single most common way DIY sequences silently miss failures. This is exactly the kind of reliability work a dedicated tool like Revova takes off your plate.',
  },
  {
    q: 'Do I need a different setup for Stripe vs Paddle, Braintree, Chargebee, or Recurly?',
    a: 'The concept is identical across all five — listen for a failed-payment event, branch by decline reason, send on a cadence, time it to the customer’s local hour — but the trigger event name and the decline-code vocabulary differ per processor, so a webhook integration built for Stripe’s invoice.payment_failed won’t work unmodified against Chargebee’s payment_failed event or Recurly’s failed_invoice_notification. If you run more than one processor, or expect to add one later, a tool that already normalizes all five (Revova does) avoids rebuilding this integration from scratch each time.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Setting up a dunning email sequence that actually recovers revenue takes five real decisions,
        not a mountain of engineering: pick the event that triggers it, decide a cadence of four to
        five emails spread across one to three weeks, branch the copy by decline reason instead of
        writing one generic template, time each send to the customer&apos;s local morning instead of a
        3am batch job, and test the whole thing against a sandboxed failed charge before a real
        customer ever sees it. Get those five right and you are most of the way toward the commonly
        cited <Strong>40–60% of failed charges</Strong> that retries plus dunning recover
        industry-wide. Skip any one of them and you usually end up with a sequence that sends fine,
        looks fine, and quietly underperforms by half. This guide walks through the actual build: what
        you need connected before you start, how to wire the trigger on Stripe, Paddle, Braintree,
        Chargebee, or Recurly, how to decide cadence and branch by decline code, how to get timing
        right, how to test before launch, and — since most founders eventually ask — an honest look at
        what building this yourself costs in time versus letting a dedicated tool run it for you.
      </Lead>
      <P>
        We spend our days building the tool that runs this exact sequence for other people&apos;s
        Stripe and Paddle accounts, which means we have watched a lot of founders build their first
        dunning setup by hand before switching to something automated — and just as many decide the
        DIY version was good enough and stay there. Neither path is wrong. What we have not seen work
        is skipping straight from &quot;read an article about dunning&quot; to &quot;flip a
        switch&quot; without making the handful of concrete decisions below first. This is the setup
        guide we wish had existed before we built our own.
      </P>

      <KeyTakeaways
        items={[
          <>A working sequence needs five decisions, not a rebuild of your billing stack: <Strong>trigger event, cadence, decline-reason branching, send timing, and a test pass</Strong>.</>,
          <>Building it yourself on Stripe or Paddle plus an ESP is realistic but usually costs <Strong>one to two weeks</Strong> of engineering and copywriting time for a first version.</>,
          <>Branch copy by decline reason before you touch subject lines — a single generic template caps recovery well below what reason-specific copy gets.</>,
          <>Send around <Strong>8:30am in the customer&apos;s local time zone</Strong>, not a fixed hour in yours.</>,
          <>Test with a real sandboxed failed charge — Stripe&apos;s test-mode decline cards make this trivial — before any live customer sees the sequence.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '40–60%', label: 'of failed charges recoverable via retries + dunning combined' },
          { value: '1–3 weeks', label: 'typical cadence length for a well-built sequence' },
          { value: '<10 min', label: 'to connect a processor with a dedicated recovery tool' },
        ]}
      />

      <H2 id="prereqs">What you need in place before you build anything</H2>
      <P>
        Before writing a single email, four things need to be connected: read access to your
        processor&apos;s failed-charge events, a way to send templated transactional email on demand, a
        clear view of the decline code on each failure, and an authenticated sending domain so those
        emails land in the inbox instead of spam. Skipping any one of these turns the rest of the setup
        into wasted effort.
      </P>
      <UL>
        <LI>
          <Strong>Processor access.</Strong> An API key or webhook secret from Stripe, Paddle,
          Braintree, Chargebee, or Recurly with permission to read payment and invoice events — you do
          not need write access to charge cards, only to see when one failed and why.
        </LI>
        <LI>
          <Strong>A transactional email sender.</Strong> Postmark, SendGrid, Customer.io, Braze, or
          Mailgun — something built for triggered, API-fired sends with per-message deliverability
          reporting, not a newsletter tool built for scheduled campaigns.
        </LI>
        <LI>
          <Strong>Decline-code visibility.</Strong> Each processor labels the reason differently — Stripe
          returns a <code>decline_code</code> field, Braintree exposes a{' '}
          <code>processorResponseText</code>, Chargebee and Recurly attach their own failure-reason
          strings — but every one of them tells you enough to distinguish a soft decline from a hard
          one, which is the routing logic the rest of this guide depends on.
        </LI>
        <LI>
          <Strong>An authenticated sending domain.</Strong> SPF, DKIM, and DMARC configured on whichever
          domain you send dunning email from. This is unglamorous and easy to skip, and it is also the
          single fastest way to have a technically perfect sequence land entirely in spam.
        </LI>
        <LI>
          <Strong>Some notion of customer time zone.</Strong> Billing country, IP geolocation at
          signup, or browser locale are all reasonable proxies — you do not need perfect precision, just
          enough to bucket customers by roughly which morning they wake up in.
        </LI>
      </UL>
      <P>
        With those five in place, the actual build is seven concrete steps, in this order:
      </P>
      <OL>
        <LI>Connect your processor and choose the event that triggers the sequence.</LI>
        <LI>Decide your cadence — how many emails, on which days.</LI>
        <LI>Branch the sequence by decline reason before writing any copy.</LI>
        <LI>Write the actual email copy for each branch.</LI>
        <LI>Set send timing and time-zone logic.</LI>
        <LI>Wire suppression, unsubscribe, and bounce handling.</LI>
        <LI>Test end-to-end with a sandboxed failure before going live.</LI>
      </OL>
      <P>
        The rest of this guide walks through each of those in the depth that actually matters —
        starting with the one most DIY builds get subtly wrong.
      </P>

      <H2 id="trigger">Pick the trigger: the event that actually starts the sequence</H2>
      <P>
        The sequence should start the moment a charge first fails, not after your processor&apos;s
        automatic retries are exhausted — waiting for retries to finish can take a week or more on its
        own, by which point a Day 1 email is not a Day 1 email anymore. The nuance almost every DIY build
        gets wrong the first time is that most processors fire the same failure event again on every
        retry attempt, which means a naive listener restarts — or duplicates — the whole sequence each
        time the card is retried and fails again.
      </P>
      <UL>
        <LI>
          <Strong>Stripe</Strong> fires <code>invoice.payment_failed</code> for recurring subscription
          charges and <code>charge.failed</code> for one-off charges — on the first attempt and again on
          every subsequent Smart Retry attempt that also fails.
        </LI>
        <LI>
          <Strong>Braintree</Strong> sends a subscription webhook (commonly surfaced as{' '}
          <code>subscription_charged_unsuccessfully</code>) each time a scheduled subscription charge
          fails to process.
        </LI>
        <LI>
          <Strong>Chargebee</Strong> emits a <code>payment_failed</code> event on the invoice, with the
          failure reason attached to the transaction record.
        </LI>
        <LI>
          <Strong>Recurly</Strong> raises a <code>failed_invoice_notification</code> (sometimes labeled a
          failed-payment notification depending on API version) when a renewal charge cannot be
          collected.
        </LI>
      </UL>
      <Callout title="Deduplicate on the invoice or charge ID, not the event">
        The fix is simple once you know to look for it: key your sequence state off the invoice or
        charge ID, not the webhook event itself. The first failure for a given invoice starts the
        sequence and sends the Day 1 email; every subsequent failed-retry event for that same invoice ID
        gets checked against state you already have and is treated as &quot;still failing,&quot; not as a
        brand-new trigger. Get this wrong and customers receive a duplicate Day 1 email every time a
        retry fails — a fast way to make an otherwise well-designed sequence feel spammy.
      </Callout>
      <P>
        For the full mechanics of wiring this specifically on Stripe — including where Smart Retries fit
        relative to your own trigger — see{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>.
        If you are unclear on what dunning is actually for versus retries and win-back in the first
        place, <A href="/blog/what-is-dunning">what is dunning</A> covers that foundation.
      </P>

      <InlineCTA>
        Revova reads the failed-charge event from Stripe, Paddle, Braintree, Chargebee, or Recurly
        directly and handles deduplication itself — no webhook endpoint, signature verification, or
        idempotency logic for you to build or maintain.
      </InlineCTA>

      <H2 id="cadence">Decide your cadence: how many emails, spaced how far apart</H2>
      <P>
        Four to five emails spread across one to three weeks is the effective default for monthly
        subscriptions — fewer than that undersends and leaves recoverable customers uncontacted; many
        more than that chases people who have already made up their mind and mostly just adds
        unsubscribes. If you are deciding your own cadence rather than inheriting one, three questions
        settle it quickly.
      </P>
      <UL>
        <LI>
          <Strong>Monthly or annual?</Strong> A monthly subscriber gets another billing cycle a few weeks
          later even if this one is missed, so four emails over roughly two weeks (Revova&apos;s Starter
          plan runs Day 1, 3, 7, 14) is usually enough. An annual renewal is worth far more per failure
          and has no near-term retry to fall back on, so it is worth stretching the cadence further and
          leaning harder on a pre-dunning warning before the renewal date even fires.
        </LI>
        <LI>
          <Strong>What is the account worth?</Strong> Higher-value or B2B accounts justify a longer
          runway and an extra channel — Revova&apos;s Pro plan adds a fifth email on Day 21 plus SMS
          specifically because a single decision-maker being on vacation for two weeks is common and
          worth waiting out.
        </LI>
        <LI>
          <Strong>How aggressive is your grace period?</Strong> If access pauses immediately on
          first failure, your cadence needs to front-load urgency into the first two emails. If you can
          afford a week or two of continued access while the sequence runs, you can let the early emails
          stay softer and save the direct, dated language for later in the sequence.
        </LI>
      </UL>
      <P>
        Whatever cadence you land on, write it down and keep it fixed once live — a sequence that
        changes shape every few weeks makes it much harder to trust the open-rate and click-rate trends
        you are watching, which matters once you get to the monitoring section below.
      </P>

      <H2 id="branch">Branch by decline reason before you write a single subject line</H2>
      <P>
        Routing by decline code is the single highest-leverage decision in the entire build — higher
        than subject-line wording, higher than exact send time. A charge that failed because of{' '}
        <code>insufficient_funds</code> often clears on its own within days and deserves a patient,
        low-pressure nudge; a charge that failed because the card is <code>expired_card</code> will
        never clear no matter how many times it is retried and needs a direct, unambiguous ask for a new
        number. Averaging those two into one generic &quot;your payment failed&quot; template gets both
        of them slightly wrong.
      </P>
      <CodeCard
        code="lost_card"
        type="hard"
        meaning="The cardholder has reported this card lost. It will never succeed on retry and the customer likely already knows the card is gone."
        action="Skip any framing that implies the card might still work — go straight to asking for a different card number, without alarming language about fraud."
      />
      <CodeCard
        code="stolen_card"
        type="hard"
        meaning="The issuer has flagged the card as stolen. Like lost_card, no amount of retrying changes the outcome."
        action="Same direct ask for a replacement card — this is a routine, common decline reason, not a signal to treat the customer as suspicious."
      />
      <CodeCard
        code="incorrect_cvc"
        type="hard"
        meaning="The security code submitted did not match what the issuer has on file — often a typo rather than a real problem with the card itself."
        action="Ask the customer to re-enter their card details rather than assuming the card is bad; a simple 'double-check the 3-digit code' framing recovers this quickly."
      />
      <CodeCard
        code="processing_error"
        type="soft"
        meaning="A generic, temporary failure on the processor or issuer's side unrelated to the card or the cardholder's funds."
        action="Worth a soft retry-friendly message — 'this looked like a temporary glitch, here's a link just in case' — rather than treating it as urgent."
      />
      <P>
        A fifth reason worth naming separately is <code>currency_not_supported</code> — rare, but common
        enough for businesses selling across borders that it is worth a dedicated branch rather than
        silently failing into a generic template; the fix is usually routing the customer to a
        different card or a supported currency, not retrying at all. For the complete reference beyond
        these five, see{' '}
        <A href="/blog/stripe-decline-codes-explained">Stripe decline codes explained</A>.
      </P>
      <P>
        Not every decline reason is worth building a bespoke branch for on day one, especially if you
        are doing this by hand. A quick way to prioritize is to plot each reason by how often it shows up
        against how much work a dedicated branch takes to build well:
      </P>
      <PriorityMatrix
        items={[
          { label: 'insufficient_funds', effort: 25, impact: 92 },
          { label: 'expired_card', effort: 20, impact: 85, left: true },
          { label: 'do_not_honor', effort: 55, impact: 55 },
          { label: 'authentication_required (SCA)', effort: 75, impact: 48 },
          { label: 'lost_card / stolen_card', effort: 30, impact: 28, left: true },
          { label: 'currency_not_supported', effort: 78, impact: 15 },
        ]}
        caption="Where to spend your first hours of copywriting effort — build the quick-win branches (insufficient_funds, expired_card) before the rarer, higher-effort ones."
      />
      <P>
        <code>insufficient_funds</code> and <code>expired_card</code> alone typically account for the
        majority of failures on most subscription businesses, so a manual build that only gets those two
        branches right before launch is already capturing most of the available lift — the remaining
        reasons can be layered in afterward without holding up your launch date.
      </P>

      <InlineCTA>
        Revova&apos;s Pro plan ($79/month) routes every failed charge by decline reason automatically —
        soft declines get a patient nudge, hard declines get a direct ask, SCA-related declines get a
        re-authentication link — with no branching logic for you to write or maintain.
      </InlineCTA>

      <H2 id="copy">Write copy for each branch</H2>
      <P>
        Once the branches are decided, the copy itself should read like a short, specific note from a
        real person — not a templated notice. Here is what the same sequence typically looks like for a
        soft decline versus a hard decline, assuming both are sent as the first email in their branch:
      </P>
      <EmailExample
        tag="Soft decline branch — insufficient_funds"
        subject="Your card should clear on its own — but here's a backup just in case"
        why="Soft declines often resolve themselves within days, so leading with reassurance rather than urgency avoids making an easy case feel like an emergency, while still giving a one-click fallback for anyone who wants to act now."
      >
        <p>Hi [First Name],</p>
        <p>
          Your last payment for [Product] didn&apos;t go through — this is usually just a timing thing
          with your bank and often clears on its own within a few days.
        </p>
        <p>
          No action needed right now, but if you&apos;d rather not wait, you can update your card here:
          [Update payment method].
        </p>
        <p>Thanks for being a customer.</p>
      </EmailExample>
      <EmailExample
        tag="Hard decline branch — expired_card"
        subject="We need an updated card for your [Product] subscription"
        why="Hard declines never clear on retry, so the copy skips the soft framing entirely and asks directly for the one thing that actually fixes it — a new card number — while staying friendly rather than alarming."
      >
        <p>Hi [First Name],</p>
        <p>
          The card on file for your [Product] subscription has expired, so we weren&apos;t able to
          process your last payment.
        </p>
        <p>Updating it takes about 30 seconds and keeps everything running without interruption: [Update payment method].</p>
        <p>Let us know if you run into any trouble — happy to help.</p>
      </EmailExample>
      <P>
        For a much larger library of ready-to-use subject lines and full bodies across every stage of a
        sequence — not just the first email in each branch — see our dedicated{' '}
        <A href="/blog/dunning-email-examples-templates">dunning email examples and templates</A> guide.
      </P>

      <H2 id="timing">Get the timing right: send hour and time-zone logic</H2>
      <P>
        Send around 8:30am in the customer&apos;s local time zone, not a single fixed hour tied to your
        own office or your server&apos;s default clock — an email that lands at 3am local gets buried
        under a full overnight inbox by the time anyone reads it, no matter how good the copy is.
        Building this yourself means solving two smaller problems: getting a time zone for each customer,
        and actually sending at the right local moment rather than in one batch.
      </P>
      <P>
        For the time zone itself, perfect precision is not required — billing country, IP geolocation
        captured at signup, or browser locale at checkout are all reasonable proxies, and most businesses
        only need country-level granularity to get meaningfully closer to a local morning than a single
        global send time does. For the actual scheduling, some ESPs (Customer.io and Braze both support
        this natively) can queue a send for &quot;8:30am recipient-local&quot; directly; without that
        feature, the common workaround is a nightly job that buckets customers by time zone offset and
        queues each bucket&apos;s send for the right hour in turn.
      </P>
      <Callout title="Don't forget annual-plan renewals need a different clock, not just a different cadence">
        A monthly failure and an annual renewal failure should not necessarily fire at the same hour
        logic if your business serves customers heavily concentrated in one region for annual plans and
        globally for monthly ones — worth checking your own customer distribution before assuming one
        timing rule fits every plan type.
      </Callout>

      <H2 id="test">Test the sequence before a real customer ever sees it</H2>
      <P>
        Testing a dunning sequence is easier than it sounds because Stripe&apos;s test mode ships card
        numbers built specifically to simulate exact decline reasons on demand — you do not need to wait
        for a real card to fail. <code>4000000000009995</code> always declines with{' '}
        <code>insufficient_funds</code>; <code>4000000000000341</code> attaches successfully at first but
        fails the next time it is charged, which is useful for testing renewal-failure flows
        specifically. Run every branch of your sequence against these before launch, not just the happy
        path.
      </P>
      <UL>
        <LI>Confirm the trigger fires exactly once per invoice, not once per retry attempt (see the deduplication note above).</LI>
        <LI>Check every merge field resolves correctly — customer name, product name, last four digits of the card, and any renewal or access-pause date.</LI>
        <LI>Click every link in every branch, including the unsubscribe link and the card-update link, and confirm both actually work.</LI>
        <LI>Verify the send lands at the expected local hour for at least two different time zones, not just your own.</LI>
        <LI>Confirm the sequence stops immediately once a test payment succeeds — a customer who fixes their card should never receive the next email in the sequence.</LI>
      </UL>
      <P>
        That last check is the one DIY builds most often skip, and it is also the one most likely to
        make an otherwise well-built sequence feel broken to a real customer who already paid.
      </P>

      <Divider />

      <H2 id="diy-vs-tool">DIY vs Revova: what setup actually costs you</H2>
      <P>
        Everything above is buildable by hand on top of Stripe, Paddle, Braintree, Chargebee, or Recurly
        plus an ESP like Postmark or Customer.io — plenty of teams do exactly that, and for a simple,
        single-branch sequence it is a reasonable weekend project. The honest comparison is less about
        whether it is possible and more about what it costs in time, versus what a dedicated tool
        replaces outright.
      </P>
      <CompareTable
        rows={[
          ['Setup step', 'DIY (processor + ESP)', 'Revova'],
          ['Webhook wiring & dedup', 'Build and host an endpoint, verify signatures, key state off invoice ID yourself', 'Not required — Revova reads processor events directly'],
          ['Decline-reason routing', 'Write and maintain your own branching logic in code', 'Built-in hard/soft/SCA routing (Pro)'],
          ['Email copy', 'Write and update templates per branch yourself', 'AI-written per decline reason, in 8 languages on Pro'],
          ['Timezone-aware send time', 'Requires a timezone lookup plus a scheduler or ESP feature', 'Built in — sends ~8:30am customer-local by default'],
          ['Deliverability (SPF/DKIM/DMARC, suppression)', 'Your responsibility to configure and monitor on your ESP', 'Handled; bounced or spam-flagged addresses are auto-suppressed'],
          ['Historical failures', 'Not covered unless you build a separate backfill job', 'Lost Revenue Finder scans 90 days (Starter) or 12 months (Pro)'],
          ['Typical time to first live send', '1–2 weeks of engineering + copywriting', 'Under 10 minutes — paste a read-only key'],
          ['Ongoing cost', 'ESP subscription plus your own maintenance time', 'Flat $29–$79/month, no commission on recovered revenue'],
        ]}
      />
      <P>
        Some businesses are well served by the DIY column, especially if they already have engineering
        time budgeted and only need one or two decline-reason branches. Tools with a percentage-of-recovery
        pricing model, or well-funded scale-ups evaluating something like Churnkey, are also reasonable
        fits depending on volume and team size. What a dedicated flat-fee tool like Revova mainly buys
        back is the maintenance burden — timezone logic, deliverability monitoring, and keeping up with
        each processor&apos;s event payloads as they change — plus the one thing DIY genuinely cannot
        do at all: recovering failures that already happened before you built anything. Full plan details,
        including the 14-day free trial and 30-day money-back guarantee, are on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>

      <InlineCTA>
        Skip the webhook wiring entirely — connect Stripe, Paddle, Braintree, Chargebee, or Recurly with
        a read-only key and get a working sequence live in minutes. Starter is $29/month, Pro is
        $79/month, both with a 14-day free trial and no credit card required.
      </InlineCTA>

      <H2 id="monitor">What to watch once the sequence is live</H2>
      <P>
        Six numbers matter once your sequence is actually sending, and they matter roughly in this order:
        delivery rate first, because nothing else means anything if the email never arrives.
      </P>
      <UL>
        <LI><Strong>Delivery rate.</Strong> Bounces and blocks show up here first — a sudden drop usually points to a deliverability problem (SPF/DKIM/DMARC misconfiguration, or a domain that just got flagged), not a copy problem.</LI>
        <LI><Strong>Open rate.</Strong> Industry benchmarks commonly put dunning open rates around 30–40% — noticeably higher than typical marketing email, because the recipient has a direct, self-interested reason to open it.</LI>
        <LI><Strong>Click-through rate.</Strong> Commonly 10–15% through to the card-update link. A big gap between a healthy open rate and a weak click rate usually means the copy or the CTA needs work, not the timing.</LI>
        <LI><Strong>Recovery rate.</Strong> What share of failed charges actually get fixed within the sequence window — the number that ultimately matters most, and the one worth reporting on weekly rather than daily.</LI>
        <LI><Strong>Unsubscribe and spam-complaint rate.</Strong> A rising trend here is a signal about tone or frequency, not proof that dunning itself is the wrong approach.</LI>
        <LI><Strong>Dollars actually recovered.</Strong> The number that ties everything above back to revenue — worth sizing against your total exposure using the calculator in{' '}
          <A href="/blog/how-much-revenue-lost-to-failed-payments">how much revenue you&apos;re losing to failed payments</A>.
        </LI>
      </UL>
      <InlineCTA>
        Before you optimize the sequence further, see what you&apos;ve already lost. Revova&apos;s free
        Lost Revenue Finder connects read-only and scans your real payment history — no card required,
        no commitment.
      </InlineCTA>
      <P>
        Check these weekly at first rather than daily — a few days of noise in a small dataset will send
        you chasing signals that aren&apos;t there, especially on a business with fewer than a few dozen
        failures a month. Revova&apos;s Pro plan ships a weekly digest specifically so this monitoring
        does not become its own chore.
      </P>

      <H2 id="mistakes">Setup mistakes that quietly cap recovery</H2>
      <P>
        Most underperforming sequences are not broken in any way that shows up as an error — they send,
        they deliver, and the copy reads fine at a glance. The problems that actually cap recovery tend
        to be structural, in the setup itself, rather than in any individual email:
      </P>
      <UL>
        <LI><Strong>No deduplication on the trigger.</Strong> Restarting the sequence on every retry-attempt webhook instead of keying state off the invoice ID, which sends duplicate Day 1 emails and reads as spam.</LI>
        <LI><Strong>Skipping domain authentication.</Strong> Launching without SPF, DKIM, and DMARC configured, which routes a technically perfect sequence straight into spam folders before anyone reads it.</LI>
        <LI><Strong>Hardcoding one send hour.</Strong> Treating &quot;8:30am&quot; as a single global time rather than per-customer local time, which quietly halves the advantage of good timing for half your customer base.</LI>
        <LI><Strong>Never testing the &quot;already paid&quot; case.</Strong> Failing to confirm the sequence stops the moment a customer&apos;s card succeeds, so a customer who already fixed the problem keeps getting emails about it.</LI>
        <LI><Strong>One template for every decline reason.</Strong> Averaging <code>insufficient_funds</code> and <code>expired_card</code> into the same generic copy, which gets both branches slightly wrong.</LI>
        <LI><Strong>No suppression list.</Strong> Continuing to send to addresses that bounced or filed spam complaints, which damages sender reputation for every email you send afterward, not just the dunning sequence.</LI>
        <LI><Strong>Ignoring the backlog.</Strong> Building a sequence that only applies to failures going forward and never sweeping the failed invoices that piled up before setup — usually the single largest one-time recovery available.</LI>
      </UL>
      <P>
        A useful gut check before calling the build &quot;done&quot;: could you explain, in one sentence
        each, why your Day 1 email differs from your Day 14 email, and why your <code>insufficient_funds</code>{' '}
        branch differs from your <code>expired_card</code> branch? If either answer is &quot;it
        doesn&apos;t, really,&quot; that gap is usually the fastest, cheapest fix available on the whole
        list above.
      </P>

      <Divider />

      <P>
        For Stripe&apos;s own reference on webhook delivery, retries, and signature verification, see{' '}
        <A href="https://stripe.com/docs/webhooks">Stripe&apos;s webhooks documentation</A>, and for the
        technical standard behind sender-domain authentication, see the{' '}
        <A href="https://dmarc.org/overview/">DMARC.org overview</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Build the sequence in minutes, not weeks"
        body="Revova connects to Stripe, Paddle, Braintree, Chargebee, or Recurly with a read-only key and handles the trigger, the decline-reason routing, the timezone-aware timing, and the deliverability work for you. Start with a free scan of what you've already lost, then let the sequence recover the rest. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
