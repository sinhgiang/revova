import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, EmailExample, DonutChart,
  PriorityMatrix, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What counts as a "historical" failed payment versus a normal one my dunning sequence should already catch?',
    a: 'A normal failed payment is one still inside your processor’s active retry window and, ideally, inside a live dunning sequence — Stripe Smart Retries or the equivalent on Paddle, Braintree, Chargebee, or Recurly is still attempting it, or an email is still going out. A historical failed payment is one where that window closed months or years ago with no recovery attempt following it: the invoice sits marked uncollectible, the subscription shows canceled or past_due, and nothing has touched it since. The line is really about whether an active process still owns the charge — if nothing does, it is backlog, not a normal in-flight failure.',
  },
  {
    q: 'Why doesn’t Stripe just keep retrying a failed charge forever until it succeeds?',
    a: 'Because an unbounded retry loop would be worse for everyone involved than a bounded one. Stripe Smart Retries operates inside a maximum-attempts and retry-window ceiling that you configure — commonly a handful of attempts spread across one to two weeks — precisely so a card that is never going to clear (an expired_card decline, for instance) doesn’t sit generating failed-charge noise, processor-side risk flags, and customer confusion indefinitely. Once that window closes, Stripe applies whatever exhausted-retry behavior you configured: marking the invoice uncollectible, leaving the subscription past due, or canceling it outright. None of those outcomes trigger a further attempt on their own.',
  },
  {
    q: 'How far back can I realistically look for old failed charges?',
    a: 'That depends on what is doing the looking. Revova’s free Lost Revenue Finder scans the last 90 days of processor history on the Starter plan and a full 12 months on Pro, which covers the overwhelming majority of backlog that is still worth re-approaching. Going back further than 12 months is technically possible by exporting raw processor data yourself, but the recoverable value drops sharply the older a lapsed subscription gets, and the compliance case for re-contacting someone gets weaker the longer it has been since they last had any relationship with your product.',
  },
  {
    q: 'Is it legal or advisable to email customers whose subscription failed and lapsed a long time ago?',
    a: 'It depends heavily on how long ago, what they originally consented to, and your jurisdiction’s email and marketing rules. A charge that failed 45 days ago on an account that is still nominally active is a straightforward, low-risk recovery email. A subscription that lapsed two years ago, where the customer has had zero interaction with your product since, is a different judgment call — you should honor any prior unsubscribe, keep the message transactional in tone ("we noticed your subscription lapsed" rather than a marketing pitch), and skip anyone who opted out at any point. When in doubt on genuinely old accounts, a lighter touch or no touch at all is the safer default.',
  },
  {
    q: 'Does a historical recovery scan touch or store my customers’ card numbers?',
    a: 'No. Revova connects to Stripe, Paddle, Braintree, Chargebee, or Recurly read-only, the same way for a historical scan as for live recovery — it reads invoice status, decline reasons, subscription state, and customer contact details, never raw card numbers, CVCs, or stored payment methods. Those stay entirely inside your processor’s own vault at all times.',
  },
  {
    q: 'How is a one-time historical recovery scan different from what my dunning sequence already does going forward?',
    a: 'A live dunning sequence is triggered in real time by an event like invoice.payment_failed and reacts within hours, while the customer’s relationship with your product is still fresh. A historical or backlog scan is a one-time (or periodic) sweep backward through already-closed invoices that a live sequence never saw, because it either didn’t exist yet or the charge failed before it was configured. They are complementary rather than competing: the live sequence keeps new failures from ever becoming backlog, and the historical scan cleans up whatever backlog already accumulated before that sequence existed.',
  },
  {
    q: 'What is the fastest way to find out how much old failed revenue I actually have, without connecting anything?',
    a: 'Most processor dashboards let you filter invoices or charges by status directly. In Stripe, filtering the Invoices view to uncollectible or open with a past due date, or the Payments view to failed, gives a rough manual total in a few minutes. That manual total is usually an undercount, though, because it misses subscriptions that were canceled outright rather than left in a failed state, and it does not separate genuinely recoverable segments from truly dead ones. The free Lost Revenue Finder does both automatically and gives a cleaner number without a manual export.',
  },
  {
    q: 'Should I run a historical recovery campaign myself, or does Revova send the emails for me?',
    a: 'Revova’s AI writes and sends the recovery sequence for you, using the same decline-reason-aware logic it applies to live failures, adjusted for how long ago the charge lapsed. You are not manually segmenting a spreadsheet and writing individual emails — you connect a processor, the Lost Revenue Finder surfaces the backlog, and the recovery sequence runs against whichever segments you choose to re-approach.',
  },
  {
    q: 'What happens to the segment of old failed charges that really is unrecoverable?',
    a: 'It should be written off cleanly rather than emailed indefinitely. Part of running a responsible historical recovery pass is accepting that a real portion of any backlog — cards that expired years ago with no update, subscriptions tied to a business that no longer exists, customers who explicitly unsubscribed — is genuinely dead revenue that a well-run campaign should identify and stop contacting, not keep retrying forever the way an unmonitored fixed retry loop would.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Historical payment recovery is the practice of going back through your processor&apos;s
        past invoice and charge history — often months or years deep — to find subscription
        payments that failed, were never successfully retried, and were quietly written off as
        lost, then running a deliberate recovery pass against the ones still worth re-approaching.
        It is a different problem from the forward-looking retry and dunning setup most guides
        cover: Stripe Smart Retries, Braintree&apos;s retry logic, and every other processor&apos;s
        automatic re-attempt system all stop trying after a bounded window, and once that window
        closes the charge is marked uncollectible or the subscription is canceled — permanently,
        with nothing chasing it afterward. For a subscription business that has been running for
        any length of time without a dedicated recovery pass, that backlog of dead-on-paper charges
        is very often the single largest pool of recoverable revenue sitting on the books, and most
        founders have never actually looked at its size. This guide covers why processors stop
        retrying in the first place, how to audit your own processor history to size the backlog,
        how a one-time historical scan differs from a live recovery flow, how to segment old
        failures so you chase the recoverable ones without spamming the dead ones, and how
        Revova&apos;s free Lost Revenue Finder is purpose-built to do the scanning for you.
      </Lead>
      <P>
        We built Revova specifically because the founders we talked to before writing a single line
        of code kept describing the same blind spot: they had a reasonably solid live dunning setup,
        Stripe Smart Retries turned on, maybe even a decent email sequence — and zero idea what was
        sitting further back in their processor&apos;s history. Not a rough guess. Zero idea. The
        Lost Revenue Finder exists because that number is almost always bigger, and easier to find,
        than people expect, and because seeing your own real figure is a far more honest sales pitch
        than any stat we could put on this page.
      </P>

      <KeyTakeaways
        items={[
          <>Processors do not retry failed charges forever — <Strong>Stripe Smart Retries</Strong> and equivalents on Paddle, Braintree, Chargebee, and Recurly all stop inside a bounded window and mark the invoice uncollectible or cancel the subscription.</>,
          <>Once that window closes, nothing automated chases the charge again — it becomes <Strong>backlog</Strong>, sitting in your processor dashboard as dead-on-paper revenue.</>,
          <>Involuntary churn commonly makes up <Strong>20–40% of total SaaS churn</Strong>, and a meaningful share of that backlog was never actually a lost customer — just a card that failed once with no follow-up.</>,
          <>A one-time <Strong>historical recovery scan</Strong> is a fundamentally different exercise from a live, real-time dunning flow — it needs its own audit, its own segmentation, and its own, gentler outreach rules.</>,
          <>Revova&apos;s free <Strong>Lost Revenue Finder</Strong> scans the last 90 days (Starter) or 12 months (Pro) of real processor history and surfaces this backlog automatically, at no cost, with no engineering work.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '20–40%', label: 'of total SaaS churn commonly attributed to involuntary churn industry-wide' },
          { value: '5–10%', label: 'of subscription charges that fail or get declined in a typical billing cycle' },
          { value: '40–60%', label: 'of failed charges commonly recoverable industry-wide via retries + dunning combined' },
        ]}
      />

      <H2 id="why-processors-stop">Why Stripe, Paddle, and every other processor eventually stop retrying</H2>
      <P>
        Every major processor bounds its automatic retry logic to a fixed window, not an indefinite
        loop, because retrying a charge that is never going to clear forever is worse for everyone
        than accepting a hard stop and moving on. Stripe Smart Retries is the clearest example: it
        re-attempts a failed subscription invoice on a day its machine learning model predicts is
        statistically more likely to succeed, inside a maximum-attempts and retry-window ceiling
        that you configure in the Stripe Dashboard — commonly a handful of attempts spread across
        roughly one to two weeks. Once that ceiling is reached, Smart Retries stops, full stop, and
        applies whatever exhausted-retry behavior you configured: marking the invoice{' '}
        <Strong>uncollectible</Strong>, leaving the subscription <Strong>past due</Strong>, or{' '}
        <Strong>canceling it</Strong> outright.
      </P>
      <P>
        Paddle, Braintree, Chargebee, and Recurly each run their own version of the same bounded
        logic with their own configuration and vocabulary, but the shape is identical across all
        five: a window, a ceiling, then a terminal state with nothing chasing it afterward. None of
        them reach back and try again next quarter because a customer&apos;s bank issue might have
        resolved itself by then — that decision, correctly, is left entirely to you. For the deeper
        mechanics of how Stripe&apos;s model actually decides retry timing within its window, see{' '}
        <A href="/blog/stripe-smart-retries-explained">our full guide to Stripe Smart Retries</A>.
      </P>
      <Callout title="The structural gap no amount of retry tuning can close">
        This is not a setting you missed or a configuration you can fix by extending the retry
        window further — it is a structural limitation of when retries operate at all. Smart
        Retries, and every processor&apos;s equivalent, only applies to invoices that fail from the
        moment it is configured forward. A charge that failed and was written off two years ago was
        never inside that window to begin with, no matter how it is configured today.
      </Callout>
      <P>
        Once a charge crosses into that terminal, uncollectible-or-canceled state, most billing
        stacks treat it as closed. The invoice stops appearing in active dashboards. The subscription
        drops out of MRR reporting. Unless a dunning email sequence was already running and had its
        own separate logic for what happens when retries exhaust — which many businesses never built
        — nothing further ever contacts the customer about it again. That silence is exactly where a
        backlog starts accumulating, one closed invoice at a time, for as long as the business has
        been operating.
      </P>

      <H2 id="where-it-hides">Where old failed charges actually hide in your processor</H2>
      <P>
        Historical failed revenue does not sit in one obvious place — it is scattered across several
        different states and views that most founders never think to check together, which is
        exactly why it goes unnoticed for so long. Knowing the specific places it hides is most of
        the audit.
      </P>
      <UL>
        <LI>
          <Strong>Invoices marked uncollectible.</Strong> In Stripe, this is a distinct invoice
          status separate from open or paid — it means retries exhausted and the invoice was
          written off, but the underlying subscription may still show as active or past_due
          depending on your settings.
        </LI>
        <LI>
          <Strong>Subscriptions stuck in past_due or unpaid.</Strong> These are not necessarily
          canceled — they can sit in a limbo state for a surprisingly long time if your dashboard
          settings never forced a hard cancellation, silently generating no revenue while still
          technically counting as a customer record.
        </LI>
        <LI>
          <Strong>Canceled subscriptions with a failed-payment cancellation reason.</Strong> Easy to
          conflate with voluntary cancellations (a customer who deliberately churned) unless you
          filter specifically by cancellation reason — a huge share of what looks like voluntary
          churn in a quick glance is actually involuntary churn wearing a canceled-subscription
          label.
        </LI>
        <LI>
          <Strong>Raw charge.failed events with no matching invoice follow-up.</Strong> Especially
          common on older integrations that predate a proper Stripe Billing setup, where a
          one-off PaymentIntent failed and nothing in the codebase was listening for the failure at
          all.
        </LI>
        <LI>
          <Strong>Exported CSV reports nobody re-opened.</Strong> Many teams pulled a failed-invoice
          export at some point for a one-time reason (an investor update, a churn audit) and the
          file has sat in a shared drive ever since, technically &quot;found&quot; but never acted
          on.
        </LI>
      </UL>
      <P>
        For a broader framework on sizing total leaked revenue across both the historical backlog
        and ongoing monthly leakage, see{' '}
        <A href="/blog/how-much-revenue-lost-to-failed-payments">
          how much revenue you&apos;re losing to failed payments
        </A>. This guide stays narrowly focused on the backlog piece specifically — the failures
        that already happened and were never followed up on.
      </P>

      <InlineCTA>
        Rather than manually filtering five different dashboard views, run Revova&apos;s free Lost
        Revenue Finder — it connects read-only to Stripe, Paddle, Braintree, Chargebee, or Recurly
        and surfaces every one of these hiding places automatically, going back 90 days on Starter
        ($29/month) or a full 12 months on Pro ($79/month).
      </InlineCTA>

      <H2 id="why-it-accumulates">Why the backlog is usually bigger than founders expect</H2>
      <P>
        The backlog compounds for a structural reason, not because any one failure is dramatic on
        its own: failed and declined subscription charges commonly run <Strong>5–10% per billing
        cycle</Strong> industry-wide, and involuntary churn — customers who wanted to keep paying
        but whose card simply failed — commonly makes up <Strong>20–40% of total SaaS churn</Strong>.
        Multiply either range across every billing cycle a business has run since launch, subtract
        whatever a live retry-and-dunning setup was actually catching during that time (often
        nothing, if it was only switched on recently), and the remainder is the backlog.
      </P>
      <DonutChart
        segments={[
          { label: 'Caught by processor retries', value: 35, color: '#4f46e5', note: 'Recovered silently, no follow-up needed' },
          { label: 'Caught by an active dunning sequence', value: 20, color: '#10b981', note: 'Recovered via email/SMS, if one was running' },
          { label: 'Uncollected backlog', value: 45, color: '#f43f5e', note: 'Never retried further, never re-approached' },
        ]}
        centerLabel="Illustrative"
        centerSub="example split, not Revova data"
        caption="Illustrative example only — a hypothetical split of how failed subscription charges commonly end up across a business that only recently set up a live recovery flow. Real proportions vary by processor mix, retry configuration, and how long a business has operated without a dedicated recovery pass."
      />
      <P>
        The businesses where this number is largest are almost never the newest ones — they are the
        businesses that have been running for two, three, five years, added Stripe Smart Retries at
        some point along the way, maybe bolted on a basic email template later, and never once went
        back to clean up everything that failed before those safeguards existed. Every acquisition,
        pivot, or pricing change along the way tends to leave its own small trail of orphaned failed
        invoices behind it too.
      </P>
      <Callout title="A quick mental model worth sanity-checking against your own numbers">
        If your business has processed subscription billing for N years, and failed/declined
        charges commonly run 5–10% of a billing cycle, ask yourself honestly: has anything actively
        chased every one of those failures for the entire time you&apos;ve been operating, or only
        since whenever you last touched your dunning setup? The gap between those two answers is
        roughly the size of your backlog.
      </Callout>

      <H3>A worked example, entirely hypothetical, to make the arithmetic concrete</H3>
      <P>
        None of the figures below are Revova data or a real customer&apos;s numbers — this is a
        deliberately simplified, illustrative walk-through so the mechanism is clear, not a
        benchmark to plug your own business into. Picture a subscription business at{' '}
        <Strong>$40,000 MRR</Strong>, three years into operating, that only enabled Stripe Smart
        Retries and a basic dunning email about a year ago. Using the industry-cited{' '}
        <Strong>5–10%</Strong> failed-charge range and the <Strong>20–40%</Strong> involuntary-churn
        range purely as illustrative inputs, roughly a tenth of monthly billing volume across the
        two years before any recovery layer existed would have failed at least once, and a real
        share of those subscriptions would have lapsed for exactly that reason rather than a
        deliberate cancellation. None of it was retried past Stripe&apos;s own bounded window, and
        none of it was ever emailed, because nothing was listening yet.
      </P>
      <P>
        The point of the exercise is not the specific dollar figure it produces — it is that the
        backlog scales with <em>time already operated without a recovery layer</em>, multiplied by
        billing volume, not with anything unusual about the business. A three-year-old business at
        $40,000 MRR and a three-year-old business at $8,000 MRR both accumulate backlog on the same
        underlying mechanism; only the absolute dollar amount differs. This is exactly why the free
        Lost Revenue Finder is built to compute the real number against your actual processor data
        rather than asking you to estimate it from an industry range — an estimate this loose is
        only ever useful as a reason to go check, never as a figure to act on directly.
      </P>

      <H2 id="live-vs-historical">Live recovery flow versus a one-time historical scan: what actually differs</H2>
      <P>
        A live recovery flow and a historical recovery scan solve two related but genuinely
        different problems, and treating them as the same exercise is the most common reason a
        backlog goes unaddressed even at businesses with a perfectly good dunning sequence already
        running. A live flow reacts to a <code>invoice.payment_failed</code> or{' '}
        <code>charge.failed</code> webhook the moment it fires and starts a time-boxed sequence
        while the relationship with the customer is still fresh. A historical scan looks backward
        through invoices that already closed, often long before any webhook-driven sequence
        existed, and has to make a fresh judgment call about whether re-approaching each one still
        makes sense.
      </P>
      <CompareTable
        rows={[
          ['Dimension', 'Live recovery flow', 'Historical / backlog recovery scan'],
          ['Trigger', 'Real-time webhook (e.g., invoice.payment_failed)', 'A deliberate, one-time (or periodic) sweep of closed invoices'],
          ['Data source', 'The current failing invoice/subscription', 'Months or years of already-closed invoice and charge history'],
          ['Customer relationship', 'Still active, still expecting your product', 'May be cold, lapsed, or long since moved on'],
          ['Card data risk', 'Card likely still valid or close to it', 'Card very likely expired or replaced by now'],
          ['Tone required', 'Friendly, low-pressure, assumes recent context', 'Careful, respectful, must acknowledge time has passed'],
          ['Compliance concerns', 'Standard transactional email rules', 'Must honor prior unsubscribes; avoid stale-consent issues'],
          ['Goal', 'Prevent a fresh failure from becoming churn', 'Recover value from churn that already happened'],
        ]}
      />
      <P>
        The practical implication is that you cannot simply point your existing Day 1/3/7/14 email
        sequence at a two-year-old canceled subscription and expect it to read correctly — the copy
        assumes a card that just failed, not one that has almost certainly since expired, been
        replaced, or been closed by the bank. A historical campaign needs its own shorter, softer,
        more explicitly time-aware set of messages, which is exactly what the segmentation in the
        next section is for.
      </P>

      <InlineCTA>
        Revova runs both sides automatically: a live decline-reason-branched sequence for new
        failures, and a separate Lost Revenue Finder scan — 90 days on Starter, 12 months on Pro —
        purpose-built for exactly this backlog problem. 14-day free trial, no credit card required.
      </InlineCTA>

      <H2 id="audit-steps">How to audit your own processor history for a backlog, step by step</H2>
      <P>
        Sizing your own backlog manually is a real, doable exercise even before connecting anything
        — it just takes checking the right views in the right order rather than one obvious report.
      </P>
      <OL>
        <LI>
          <Strong>Pull every invoice marked uncollectible.</Strong> In the Stripe Dashboard, filter
          the Invoices view by status; Paddle, Braintree, Chargebee, and Recurly each expose an
          equivalent failed/unpaid invoice filter under slightly different naming.
        </LI>
        <LI>
          <Strong>Pull every subscription in past_due or unpaid state</Strong>, separately from
          the invoice-level view above — these can persist for a long time without ever
          auto-canceling, depending on your dashboard settings.
        </LI>
        <LI>
          <Strong>Filter canceled subscriptions by cancellation reason</Strong> specifically for a
          failed-payment or non-payment reason, not a blanket &quot;canceled&quot; count — this is
          the step most manual audits skip, and it is the one that separates involuntary churn from
          a customer who genuinely chose to leave.
        </LI>
        <LI>
          <Strong>Cross-reference against charge.failed events with no invoice follow-up</Strong>,
          particularly if any part of your billing predates a proper Stripe Billing / subscriptions
          setup — a raw PaymentIntent failure can slip through invoice-level reporting entirely.
        </LI>
        <LI>
          <Strong>Total the dollar value by how old each failure is</Strong> — under 90 days, 90
          days to 12 months, and beyond 12 months — since recoverability and the appropriate
          outreach tone both change meaningfully across those three bands.
        </LI>
      </OL>
      <P>
        Doing all five steps by hand across five different dashboard views is exactly the manual
        work the free Lost Revenue Finder replaces — it runs the same checks programmatically
        against your real, connected processor data and returns the total in minutes rather than an
        afternoon of exporting CSVs.
      </P>
      <P>
        If you run more than one processor — Stripe for self-serve signups and Chargebee or Recurly
        for larger invoiced accounts, say — repeat all five steps separately for each one rather than
        assuming one dashboard&apos;s numbers represent the whole business. Backlogs behave
        differently by processor: a Braintree integration wired up years before a later migration to
        Stripe Billing, for instance, commonly has its own separate pocket of old failures that a
        Stripe-only audit would never surface at all, simply because nobody thought to check a
        system the business no longer actively uses for new signups.
      </P>

      <H2 id="segmenting">Segmenting the backlog: who is worth re-approaching, and who is truly dead</H2>
      <P>
        Not every old failed charge deserves the same outreach, and treating the entire backlog as
        one undifferentiated list to email is how a well-intentioned recovery campaign turns into
        spam aimed at people who have not thought about your product in years. The right approach
        segments by two variables at once: how long ago the failure happened, and why it failed.
      </P>
      <PriorityMatrix
        items={[
          { label: 'Failed <90 days, soft decline', effort: 15, impact: 90 },
          { label: 'Failed <90 days, hard decline', effort: 35, impact: 75 },
          { label: '90 days–12 months, soft decline', effort: 30, impact: 55, left: true },
          { label: '90 days–12 months, hard decline', effort: 50, impact: 40 },
          { label: '12+ months, any decline', effort: 65, impact: 15, left: true },
          { label: 'Prior unsubscribe on file', effort: 10, impact: 5, left: true },
        ]}
        caption="A recovery-effort-versus-likely-value view of a typical backlog. Recent, soft-decline failures are the clear quick wins; anything past 12 months, or with a prior unsubscribe on file, belongs in the deselect zone rather than an outreach list."
      />
      <P>
        Decline reason matters more, not less, as a failure ages. A fresh <code>insufficient_funds</code>{' '}
        decline is genuinely ambiguous — the balance might clear within days regardless of anyone&apos;s
        outreach. A twelve-month-old <code>insufficient_funds</code> decline tells you almost nothing
        useful anymore, because a card that has sat untouched that long has very likely also expired
        in the meantime, made the original decline reason moot. <code>do_not_honor</code> ages even
        worse: it was already a vague, catch-all signal from the issuing bank the day it happened, and
        a year later there is no way to know whether it reflected a temporary fraud flag or a closed
        account. Age effectively erases the diagnostic value that decline codes carry in a live
        dunning flow — which is exactly why a historical campaign leans harder on <em>how long ago</em>{' '}
        as the primary segmentation axis and treats decline reason mainly as a secondary signal for
        recent failures rather than a reliable one for old ones.
      </P>
      <H3>The segments worth re-approaching</H3>
      <UL>
        <LI>
          <Strong>Failed in the last 90 days, soft decline</Strong> (e.g., <code>insufficient_funds</code>) —
          the highest-value, lowest-risk group. The card may simply need a moment to clear, and the
          customer relationship is recent enough that a friendly reminder reads as expected rather
          than out of nowhere.
        </LI>
        <LI>
          <Strong>Failed in the last 90 days, hard decline</Strong> (e.g., <code>expired_card</code>) —
          still strong value, but the email has to ask directly for a new card rather than assume
          the old one will resolve itself.
        </LI>
        <LI>
          <Strong>90 days to 12 months, soft decline, subscription otherwise still shows as
          engaged</Strong> — worth a single, gentler attempt, explicitly acknowledging that time has
          passed, rather than the tone of a fresh Day-1 email.
        </LI>
      </UL>
      <H3>The segments usually best left alone</H3>
      <UL>
        <LI>
          <Strong>Anyone with a prior unsubscribe or opt-out on file</Strong>, regardless of how
          recoverable the dollar amount looks — respecting that signal matters more than the
          recovery upside, both ethically and for your sender reputation.
        </LI>
        <LI>
          <Strong>Failures older than roughly 12 months</Strong> with no other engagement signal in
          between — the card is very likely long since replaced or closed, and the compliance case
          for re-contacting someone this cold gets progressively weaker the older the record is.
        </LI>
        <LI>
          <Strong>Accounts tied to a business or email domain that no longer appears active</Strong> —
          a bounced domain or a defunct company is not a recoverable customer no matter how the
          charge is segmented.
        </LI>
      </UL>
      <Callout title="Respect compliance and unsubscribe signals over the dollar amount">
        A backlog segment that looks financially attractive on paper is not worth chasing if doing
        so means ignoring a prior unsubscribe, emailing a stale list aggressively, or sending
        marketing-toned messages to someone whose relationship with your product ended a long time
        ago. A responsible historical campaign writes off the truly dead segments cleanly rather
        than emailing everyone indefinitely on the theory that some small percentage might respond.
      </Callout>

      <H2 id="campaign-steps">Running a historical recovery campaign without spamming lapsed customers</H2>
      <P>
        Once the backlog is segmented, the outreach itself should look noticeably different from a
        live Day 1/3/7/14 dunning sequence — shorter, more clearly time-aware, and willing to stop
        after one or two attempts rather than running a full multi-week cadence against someone who
        has been gone for months.
      </P>
      <EmailExample
        tag="Historical recovery — 60–90 days lapsed"
        subject="We noticed your [Product] subscription didn’t renew"
        why="Explicitly acknowledges the time gap instead of pretending this is a fresh failure, and gives a single low-pressure action rather than a multi-step ask."
      >
        <p>Hi [First Name],</p>
        <p>
          Looking back through our records, we noticed your [Product] subscription didn&apos;t
          renew a little while ago — it looks like the card on file didn&apos;t go through.
        </p>
        <p>
          If you&apos;d still like access, updating your payment method takes about a minute:
          [Update payment method]. If not, no action needed — we just wanted to check before
          closing things out on our end.
        </p>
        <p>Either way, thanks for having been a customer.</p>
      </EmailExample>
      <P>
        A subscription that lapsed closer to the 12-month mark needs an even lighter touch — shorter,
        with no urgency at all, and an easy, guilt-free way to say no:
      </P>
      <EmailExample
        tag="Historical recovery — ~12 months lapsed"
        subject="Still want [Product]? Your account is ready when you are"
        why="No pressure, no mention of a missed payment at all — at this distance, framing it as a simple invitation back converts better than reminding someone of a year-old billing failure they likely don’t remember."
      >
        <p>Hi [First Name],</p>
        <p>
          It&apos;s been a while since your [Product] subscription was active. If you&apos;d like to
          pick it back up, you can restart in under a minute here: [Restart subscription].
        </p>
        <p>
          If [Product] isn&apos;t a fit anymore, no worries at all — you won&apos;t hear from us
          again about this.
        </p>
      </EmailExample>
      <P>
        Notice the tone shift across all three distances: the 90-day email still references the
        specific failed payment directly, the 90-day-to-12-month email softens that into a general
        &quot;didn&apos;t renew,&quot; and the 12-month email drops the billing framing entirely in
        favor of a plain invitation. That gradual softening is deliberate — it mirrors how much
        context a customer can reasonably be expected to still remember, and a message that assumes
        more recent context than actually exists tends to read as odd or slightly alarming rather
        than helpful.
      </P>
      <P>
        Four practical rules keep a backlog campaign honest and low-risk rather than turning it
        into an aggressive re-marketing blast:
      </P>
      <UL>
        <LI>
          <Strong>Cap it at one or two messages, not a full multi-week sequence.</Strong> A lapsed
          customer who does not respond to a single respectful check-in is unlikely to respond to a
          five-email cadence either, and repeating the ask only increases the odds of an
          unsubscribe or a spam complaint.
        </LI>
        <LI>
          <Strong>Never re-attempt a charge against an old card without checking it first.</Strong>{' '}
          A card that failed with <code>expired_card</code> six months ago is not going to succeed
          on a blind retry today — ask the customer to re-enter payment details rather than
          silently re-charging a card you have reason to believe is dead.
        </LI>
        <LI>
          <Strong>Honor every unsubscribe and opt-out, permanently, across every segment.</Strong>{' '}
          This should never be a per-campaign decision — a suppression list built once should apply
          to every future historical sweep automatically.
        </LI>
        <LI>
          <Strong>Stop and write off the segments that do not respond.</Strong> A campaign that
          keeps circling back to the same unresponsive 12-month-old contacts every quarter is not
          persistence, it is the exact pattern that gets domains flagged and erodes trust in every
          other email you send.
        </LI>
        <LI>
          <Strong>Reserve SMS for the freshest, highest-confidence segment only.</Strong> A text
          message about a subscription that lapsed three days ago reads as a helpful nudge; the
          same text about something that lapsed fourteen months ago reads as intrusive, since a
          phone number carries a much higher expectation of an active, recent relationship than an
          email address does.
        </LI>
      </UL>
      <P>
        Taken together, these rules describe a campaign that shrinks its own list every round rather
        than growing it — each pass either recovers a customer, confirms they are genuinely gone, or
        adds them to a permanent suppression list. A historical campaign that is still the same size
        a year later, still emailing the same unresponsive contacts, is a sign the write-off step is
        not actually happening.
      </P>

      <InlineCTA>
        Revova&apos;s Pro plan ($79/month) runs win-back campaigns on Day 3, 14, and 30 after
        cancellation and reads decline reason and lapse time automatically to pick the right tone —
        no manual segmentation spreadsheet required. 14-day free trial, no credit card, 30-day
        money-back guarantee.
      </InlineCTA>

      <H2 id="diy-vs-tool">Auditing the backlog yourself versus running a purpose-built scan</H2>
      <P>
        Both paths can get you to the same number, but they trade off very differently on time,
        completeness, and how confident you can be in what the manual export actually missed.
      </P>
      <ProsCons
        pros={[
          'A manual dashboard filter costs nothing and needs no new tool connected',
          'You already have direct access to the raw data inside your own processor',
          'Useful as a first sanity check before deciding whether a deeper scan is worth doing',
        ]}
        cons={[
          'Requires checking five separate views (uncollectible invoices, past_due subscriptions, cancellation reasons, orphaned charge.failed events, old exports) to avoid an undercount',
          'Easy to conflate involuntary churn with voluntary churn if you only glance at a blanket "canceled" count',
          'No automatic segmentation by age or decline reason — that has to be built by hand in a spreadsheet',
          'Does not distinguish which segments are still worth an email versus genuinely dead',
          'Time-consuming to repeat across multiple processors if you run more than one',
        ]}
      />
      <P>
        The free Lost Revenue Finder exists specifically to remove the manual side of that list. It
        connects read-only to Stripe, Paddle, Braintree, Chargebee, or Recurly, runs the same checks
        an audit would run by hand, and returns a real number — not an estimate, not an industry
        benchmark, your actual figure — without exporting a single CSV yourself.
      </P>
      <P>
        The manual route is not wrong, and it is worth doing at least once even if you end up
        connecting a tool afterward — seeing the raw uncollectible-invoice count with your own eyes
        in the Stripe Dashboard is a useful gut check, and it makes the automated total easier to
        trust once you compare the two. Where the manual route falls short is completeness and
        repeatability: a founder who spends an afternoon filtering dashboards once rarely does it
        again a quarter later, which means the backlog quietly resumes accumulating the moment the
        one-time audit ends. A scan that takes minutes to re-run is one you actually will re-run.
      </P>

      <H2 id="how-revova-does-it">How Revova&apos;s Lost Revenue Finder is built for exactly this backlog problem</H2>
      <P>
        The Lost Revenue Finder is Revova&apos;s free scan built specifically to answer the question
        this entire guide is about: how much already-failed, already-lapsed revenue is sitting
        unrecovered in your processor history right now. It is intentionally separate from the live
        dunning sequence, because — as covered above — the two solve genuinely different problems
        and need different logic.
      </P>
      <UL>
        <LI>
          <Strong>Read-only connection, never touches card data.</Strong> Connecting Stripe, Paddle,
          Braintree, Chargebee, or Recurly grants Revova access to invoice status, decline reasons,
          and subscription state only — card numbers, CVCs, and stored payment methods never leave
          your processor.
        </LI>
        <LI>
          <Strong>Starter ($29/month) scans the last 90 days</Strong> of processor history — enough
          to catch the highest-value, most recoverable segment of most businesses&apos; backlog
          without any manual filtering.
        </LI>
        <LI>
          <Strong>Pro ($79/month) scans a full 12 months</Strong>, catching the deeper backlog that
          a 90-day window misses entirely, and pairs it with win-back campaigns on Day 3, 14, and 30
          after cancellation to actually act on what the scan surfaces.
        </LI>
        <LI>
          <Strong>No engineering work required.</Strong> There is no webhook to wire up, no export
          to script, and no spreadsheet to segment by hand — connecting a processor and reviewing
          the result is the entire setup.
        </LI>
        <LI>
          <Strong>The result funnels honestly into a recovery decision, not a hard sell.</Strong>{' '}
          The scan shows the real number whether or not you ever upgrade past it — it is
          first-party proof you generate yourself, not a claim we ask you to take on faith.
        </LI>
      </UL>
      <P>
        Both plans include a 14-day free trial with no credit card required and a 30-day
        money-back guarantee, and both run the same underlying decline-reason logic Revova uses for
        live recovery — see{' '}
        <A href="/blog/stripe-decline-codes-explained">our guide to Stripe decline codes explained</A>{' '}
        for the full reference — applied specifically to the backlog case instead of a fresh
        failure. If you have not yet set up a live sequence to stop new failures from becoming
        backlog in the first place, that ground is covered step by step in{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">our dunning email sequence setup guide</A>{' '}
        and <A href="/blog/how-to-recover-failed-stripe-payments">
          how to recover failed Stripe payments
        </A>. For the broader taxonomy of retries, dunning, pre-dunning, and win-back this guide
        assumes, see <A href="/blog/what-is-dunning">what is dunning</A>.
      </P>

      <InlineCTA>
        See your own backlog number before deciding anything — connect a processor and run the
        free Lost Revenue Finder, then start a 14-day free trial (no credit card) on Starter
        ($29/month) or Pro ($79/month) if the recoverable segment is worth acting on.
      </InlineCTA>

      <H2 id="prevent-recurrence">Preventing the backlog from rebuilding after you clean it up</H2>
      <P>
        A one-time historical recovery pass is worth doing on its own, but without a live retry and
        dunning setup running afterward, the backlog simply starts rebuilding from the day the scan
        finished. Treat the historical scan as a cleanup step, not a substitute for the ongoing
        layer that keeps new failures from ever reaching backlog status in the first place.
      </P>
      <UL>
        <LI>
          Confirm Smart Retries — or the equivalent on your processor — is actually enabled and not
          quietly reverted to a fixed schedule; this is worth checking directly rather than
          assuming.
        </LI>
        <LI>
          Run a live, decline-reason-branched dunning sequence on every new failure going forward,
          not just the historical ones you just cleaned up.
        </LI>
        <LI>
          Set a recurring cadence — quarterly is reasonable for most businesses — to re-run the Lost
          Revenue Finder rather than treating the backlog audit as a single, never-repeated event.
        </LI>
        <LI>
          Add pre-dunning for known card-expiry dates, which prevents a chunk of future backlog from
          ever becoming a failed charge at all.
        </LI>
        <LI>
          Treat a canceled subscription with a failed-payment cancellation reason as a fresh
          win-back candidate immediately, rather than letting it sit for another year before anyone
          looks at it again.
        </LI>
      </UL>
      <P>
        Pro&apos;s weekly digest is built for exactly this ongoing visibility — a running summary of
        what failed, what recovered, and what is quietly aging toward becoming next quarter&apos;s
        backlog, instead of finding out a year later that the same silent accumulation happened all
        over again. The businesses that keep the smallest backlog over time are rarely the ones that
        ran the single best historical recovery pass — they are the ones that made checking for it a
        routine, quarterly habit rather than a one-off project triggered by curiosity or an investor
        question about churn.
      </P>

      <Divider />

      <P>
        For Stripe&apos;s own documentation on how Smart Retries schedules re-attempts and what
        happens once its retry window closes, see{' '}
        <A href="https://stripe.com/docs/billing/revenue-recovery/smart-retries">
          Stripe&apos;s Smart Retries documentation
        </A>
        , for Stripe&apos;s reference on invoice statuses including uncollectible and how the
        invoice lifecycle behaves after retries exhaust, see{' '}
        <A href="https://stripe.com/docs/billing/invoices/workflow-transitions">
          Stripe&apos;s invoice lifecycle documentation
        </A>
        , and for Stripe&apos;s reference on decline types and how hard versus soft declines behave
        on retry, see <A href="https://stripe.com/docs/declines">Stripe&apos;s documentation on
        declines</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Your old failed charges are still sitting there. See what they're worth."
        body="Revova's free Lost Revenue Finder connects read-only to Stripe, Paddle, Braintree, Chargebee, or Recurly and scans your real processor history — 90 days on Starter, 12 months on Pro — to surface the backlog most businesses have never once looked at. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
