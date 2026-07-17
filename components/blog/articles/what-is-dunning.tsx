import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, UL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, CodeCard, EmailExample, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Where does the word “dunning” come from?',
    a: 'It predates software by centuries. The most commonly repeated account traces “dun” to 17th-century England, where a notoriously persistent debt collector named Joe Dun (some spellings give Dunn) chased overdue payments so relentlessly that “to dun” entered everyday English as a verb meaning to demand payment insistently. A competing theory ties it to the older Middle English “dunnen,” related to “din” — a loud, insistent noise — which fits the meaning just as well: dunning someone means making noise until they pay. Either way, by the time Stripe and Braintree started calling their failed-payment email flows “dunning,” the word had already meant exactly this for a very long time.',
  },
  {
    q: 'Is dunning the same thing as debt collection?',
    a: 'No, and the distinction matters legally as well as practically. Debt collection is pursuing a debtor for money already owed and typically falls under regulations like the FTC’s Fair Debt Collection Practices Act. Subscription dunning is almost always something softer: a customer who wants your product but whose card failed for a reason outside their control — expired_card, insufficient_funds, a bank flagging do_not_honor. You are not chasing a delinquent debtor; you are helping an active customer fix a broken card before they lose access. That difference should show up in your tone — dunning emails read like a helpful nudge, not a collections notice.',
  },
  {
    q: 'How many emails should a dunning sequence have?',
    a: 'Most effective sequences run four to five emails spread across roughly two to three weeks — long enough to catch a customer who is traveling or simply slow to notice, short enough that you are not still emailing someone a month after the fact. Revova’s Starter plan runs a 4-email sequence on Days 1, 3, 7, and 14; Pro extends that to 5 emails through Day 21 and adds hard/soft decline smart routing so the sequence itself changes shape depending on why the charge failed.',
  },
  {
    q: 'Does dunning work for annual plans, or only monthly subscriptions?',
    a: 'Yes, but the stakes are different. A monthly subscriber gives you twelve chances a year for something to go wrong and twelve chances to recover it; an annual subscriber gives you exactly one failed charge, worth far more money, with no second billing cycle a month later to quietly catch it. We generally recommend a slightly longer, slightly more detailed dunning sequence for annual renewals — the dollar amount justifies a firmer, clearer nudge — and a pre-dunning warning well before the renewal date matters even more, since there is no near-term retry to fall back on if it lapses.',
  },
  {
    q: 'Does Revova write the dunning emails, or do I have to?',
    a: 'Revova’s AI writes them for you, personalized to the specific decline reason, your product name, and the customer’s billing history — you are not filling in a generic template. Pro plan customers can also have that AI-written sequence delivered in 8 languages automatically, based on each customer’s locale, without writing a single translated version yourself.',
  },
  {
    q: 'Are dunning emails likely to annoy customers or get flagged as spam?',
    a: 'Badly-run ones do — a single robotic “your payment failed” blast sent at 3am the customer’s time reads as spam and often gets treated that way. A well-run sequence sent at a human hour (Revova sends around 8:30am in the customer’s local timezone), worded around the actual decline reason, with a one-click card-update link and a working unsubscribe, reads as a helpful reminder from a product you already use. Bounced or spam-flagged addresses should be automatically suppressed so the rest of your sending reputation stays healthy — Revova does this by default.',
  },
  {
    q: 'What open and click rates should I expect from a dunning sequence?',
    a: 'Industry benchmarks commonly put dunning email open rates around 30–40% and click rates around 10–15% — meaningfully higher than typical marketing email, because the recipient has a direct, self-interested reason to open it: their subscription is at risk. Those benchmarks assume reasonable send timing and copy; a generic, badly-timed sequence usually underperforms both numbers.',
  },
  {
    q: 'If I already have Stripe Smart Retries turned on, do I still need dunning emails?',
    a: 'Yes. Smart Retries alone typically recovers roughly 30–40% of failed charges by re-attempting the charge on days it is statistically more likely to clear — a payday-window retry rather than a blind daily one. That is real, free recovery, but it is silent: it never tells the customer anything is wrong. Layering a dunning sequence on top, so the customer can proactively fix an expired card or a maxed-out limit, is what pushes combined recovery into the commonly cited 40–60% range instead of stopping at the retry-only floor.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Dunning is the process of contacting a customer whose recurring payment has failed and asking
        them to fix it — updating an expired card, clearing an insufficient-funds decline, or
        re-authenticating a charge — before their subscription lapses. In subscription billing it
        specifically means an automated sequence of emails, and increasingly SMS, triggered the moment
        a charge fails, spaced out over one to three weeks, and worded around the actual reason the
        payment did not go through. It sits downstream of your payment processor’s automatic retries
        and upstream of a full cancellation: retries quietly try the card again; dunning asks a human to
        step in when quiet retries are not enough. Get dunning right and you catch a meaningful share of
        the <Strong>40–60% of failed charges</Strong> that are commonly recoverable industry-wide; get
        it wrong — one generic “payment failed” email sent at 3am — and you leave most of that on the
        table. This guide covers where the word actually comes from, how dunning fits alongside retries,
        pre-dunning, and win-back campaigns, what a well-built sequence looks like day by day, the
        mistakes that quietly kill recovery rates, and how Revova automates the whole stack.
      </Lead>
      <P>
        We build payment-recovery software for a living, which means we read a lot of dunning
        sequences — our own, our competitors’, and the ones founders send us asking “is this normal?”
        The honest answer is that most of the difference between a sequence that recovers a third of
        failed charges and one that recovers well over half has nothing to do with fancy technology. It
        comes down to timing, tone, and whether the email actually knows why the charge failed. That is
        what the rest of this guide is about.
      </P>

      <KeyTakeaways
        items={[
          <>Dunning = the customer-facing email (and SMS) sequence sent after a payment fails, distinct from silent processor <Strong>retries</Strong>, proactive <Strong>pre-dunning</Strong>, and post-cancellation <Strong>win-back</Strong>.</>,
          <>The word is centuries old — commonly traced to a persistent 17th-century debt collector, not a SaaS invention.</>,
          <>A good sequence runs <Strong>4–5 emails over 1–3 weeks</Strong>, changes tone by decline reason, and is timed to land in the morning, not the middle of the night.</>,
          <>Dunning emails commonly see <Strong>30–40% open rates</Strong> and <Strong>10–15% click rates</Strong> — high for email generally, because the customer has real skin in the game.</>,
          <>Retries alone recover roughly 30–40% of failed charges; retries plus a well-run dunning sequence commonly push combined recovery to <Strong>40–60%</Strong>.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '30–40%', label: 'typical open rate on a well-timed dunning email' },
          { value: '10–15%', label: 'typical click rate through to updating a card' },
          { value: '40–60%', label: 'of failed charges recoverable via retries + dunning combined' },
        ]}
      />

      <H2 id="origin">Where the word “dunning” actually comes from</H2>
      <P>
        “Dunning” is not a term Stripe, Braintree, or Chargebee invented for subscription billing —
        it is a genuinely old English word for demanding payment, and the software industry just
        borrowed it. The most commonly repeated account traces it to 17th-century London, where a
        bailiff or debt collector named Joe Dun (spelled Dunn in some tellings) was so relentless in
        chasing overdue accounts that “to dun” someone entered the language as shorthand for demanding
        payment insistently, repeatedly, and without much patience. A second, competing etymology
        skips the bailiff entirely and ties “dun” to the older Middle English “dunnen,” related to
        “din” — as in a loud, insistent noise. Under that reading, dunning someone literally means
        making noise until they pay, which honestly describes both a debt collector on your doorstep
        and a persistent email sequence in your inbox equally well.
      </P>
      <P>
        Either origin gets you to the same modern meaning: dunning is the deliberate, repeated act of
        asking someone to pay something they owe. What changed in the last few decades is not the word
        but the medium. A 19th-century business dunned customers with a stamped letter; a mail-order
        catalog in the 1980s dunned with a printed notice; a subscription SaaS business in 2026 dunns
        with an AI-personalized email sequence, timed to the customer’s local morning and worded
        around a specific <Strong>Stripe</Strong> or <Strong>Paddle</Strong> decline code. The mechanism
        changed. The core idea — ask, don’t just wait — did not.
      </P>
      <Callout title="One nuance worth being precise about">
        Subscription dunning is a much softer cousin of formal debt collection. A debt collector is
        pursuing money already legally owed, often under strict rules like the FTC’s Fair Debt
        Collection Practices Act. A dunning email is usually reaching an active, willing customer whose
        card simply failed — <code>expired_card</code>, <code>insufficient_funds</code>, a bank
        flagging <code>do_not_honor</code> — for reasons that have nothing to do with them wanting to
        stop paying. Tone that forgets this distinction (threatening language, legalese, urgency for
        urgency’s sake) tends to hurt recovery rates rather than help them.
      </Callout>

      <H2 id="taxonomy">Dunning vs retries vs pre-dunning vs win-back: the full recovery stack</H2>
      <P>
        Dunning is one stage in a four-stage recovery stack, and conflating the stages is the single
        most common confusion we see from founders new to this space. Each stage has a different
        trigger, a different actor, and a different goal, and a mature recovery setup runs all four
        rather than treating any one of them as the whole solution.
      </P>
      <CompareTable
        rows={[
          ['Stage', 'When it fires', 'Who acts', 'Goal'],
          ['Pre-dunning', 'Before a failure — days ahead of a known card expiry, or before an annual renewal', 'An automated warning email/SMS to the customer', 'Prevent the failure from ever happening'],
          ['Smart retries', 'Immediately after a charge fails, silently, in the background', 'Your processor (e.g., Stripe Smart Retries, Braintree)', 'Re-attempt the charge when it is statistically more likely to clear'],
          ['Dunning', 'After retries have run and the charge is still unpaid', 'An email/SMS sequence asking the customer to act', 'Get the customer to update or fix their payment method'],
          ['Win-back', 'After the subscription has already lapsed or been cancelled', 'A re-engagement email sequence, often with an incentive', 'Bring an already-churned customer back'],
        ]}
      />
      <P>
        <Strong>Pre-dunning</Strong> is the only stage that happens before anything has gone wrong.
        Most processors expose an upcoming card-expiry date; a pre-dunning email sent a week or two out
        (“your card ending in 4242 expires this month — update it here”) prevents a chunk of failures
        from ever reaching the dunning stage at all, which is strictly cheaper than recovering them
        afterward. <Strong>Smart retries</Strong> — Stripe’s built-in feature is the best-known example
        — happen entirely behind the scenes: no customer email, just the processor re-attempting the
        charge on a day it is more likely to succeed, commonly called a payday retry window, instead of
        blindly retrying every 24 hours regardless of the customer’s pay cycle. <Strong>Dunning</Strong>{' '}
        is where the customer first hears from you: a sequence that assumes retries alone were not
        enough and asks them, directly, to fix the problem. <Strong>Win-back</Strong> is the stage
        everyone forgets — once a subscription has actually lapsed, most tools stop trying entirely,
        even though a good number of those customers still want the product and simply missed every
        earlier signal. Revova’s Pro plan runs win-back campaigns on Day 3, 14, and 30 after
        cancellation specifically to catch that group.
      </P>
      <P>
        It is worth naming the failure mode each stage guards against, because businesses that skip one
        stage tend to leak revenue in a very specific, predictable place. Skip pre-dunning and you
        absorb every preventable expired-card failure as an actual decline instead of a non-event. Skip
        retries (rare, since most processors run this by default) and you lose the free 30–40% recovery
        that requires zero customer-facing effort at all. Skip dunning and you are left with whatever
        retries alone caught, quietly capping your recovery well below the 40–60% combined range. Skip
        win-back and every customer who ever slipped through the first three stages is gone for good,
        even though a meaningful share of them lapsed by accident rather than by choice — which is the
        exact phenomenon we cover in{' '}
        <A href="/blog/what-is-involuntary-churn">what is involuntary churn</A>.
      </P>

      <InlineCTA>
        Revova runs all four stages — pre-dunning, smart retries, AI dunning, and win-back — on top of
        Stripe, Paddle, Braintree, Chargebee, or Recurly, starting at $29/month with a 14-day free trial.
      </InlineCTA>

      <H2 id="anatomy">Anatomy of a good dunning sequence, day by day</H2>
      <P>
        A well-built dunning sequence is not five identical “your payment failed” emails sent a few
        days apart — it is a sequence that changes tone, urgency, and channel as time passes, because a
        customer who ignored Day 1 needs a different message on Day 14 than a repeat of the same
        reminder. Here is the shape a mature sequence typically takes, based on the cadence Revova runs
        for Starter (Days 1, 3, 7, 14) and Pro (Days 1, 3, 7, 14, 21):
      </P>
      <Callout title="Day 1 — the friendly heads-up">
        Sent within hours of the failed charge, around 8:30am in the customer’s local timezone rather
        than the middle of the night. Tone is light, almost apologetic: “your card didn’t go through —
        happens all the time, here’s a one-click link to fix it.” No mention of losing access yet. This
        email alone, sent at the right hour, often recovers the easiest cases: a temporarily maxed-out
        card, a bank hiccup, a typo in a manually re-entered number.
      </Callout>
      <Callout title="Day 3 — the specific nudge">
        By now the easy recoveries are done; this email gets more specific about why the charge failed.
        A soft decline like <code>insufficient_funds</code> gets a gentle “try again after payday”
        framing. A hard decline like <code>expired_card</code> gets a direct “we need an updated card
        number” ask. Generic copy that ignores the decline reason starts losing effectiveness around
        this point in the sequence.
      </Callout>
      <Callout title="Day 7 — the access reminder">
        This is typically where the grace period starts to matter. The email states plainly what
        happens if nothing changes — paused access, a downgrade, or an approaching cancellation date —
        without threatening language. For higher-value accounts, this is also where an SMS follow-up
        earns its place: a short text alongside the email meaningfully lifts response rates for
        customers who have started ignoring their inbox.
      </Callout>
      <Callout title="Day 14 — the last full reminder">
        Firmer, shorter, and specific about the date access ends. This is the last email in Revova’s
        4-email Starter sequence, and for many businesses it is also the point of diminishing returns —
        most of the recoverable customers have already acted by now.
      </Callout>
      <Callout title="Day 21 — the final notice (Pro)">
        A short, respectful final message before the subscription is treated as lapsed. Pro customers
        get this fifth email specifically because a longer runway meaningfully helps annual-plan
        renewals and higher-touch B2B accounts, where a single decision-maker being on vacation for two
        weeks is common and worth waiting out.
      </Callout>
      <P>
        The cadence above assumes monthly billing, where a single missed cycle is recoverable and the
        next renewal is only weeks away either way. Annual plans change the math: there is no second
        billing cycle a month later to quietly catch a customer who slipped through, and the dollar
        amount on the line is typically many times larger than a single monthly charge. For annual
        renewals, we generally recommend stretching the same cadence a little further — sometimes past
        Day 21 — and leaning harder on <Strong>pre-dunning</Strong> in the weeks before the renewal date,
        since preventing the failure outright matters more when there is no near-term retry to fall back
        on. A B2B subscription business with a single decision-maker who happens to be traveling when the
        annual charge hits is a common, entirely non-adversarial reason this group needs a longer runway
        than a monthly consumer subscriber does.
      </P>
      <P>
        Two real emails make the shift in tone concrete. Here is what Day 1 and Day 14 typically look
        like for the same failed charge, assuming no card update has happened in between:
      </P>
      <EmailExample
        tag="Day 1"
        subject="Quick heads up about your last payment"
        why="Friendly, low-pressure framing recovers the easiest cases — a temporary bank hiccup or a maxed-out card — without making the customer feel at risk this early."
      >
        <p>Hi [First Name],</p>
        <p>
          Your card ending in [last 4] didn’t go through for your [Product] subscription. This happens
          all the time — usually just a temporary hiccup with the bank.
        </p>
        <p>No rush, but whenever you get a chance, you can update it here: [Update payment method].</p>
        <p>Thanks for being a customer — see you soon.</p>
      </EmailExample>
      <EmailExample
        tag="Day 14"
        subject="Your [Product] access ends in 3 days"
        why="Clear, dated, and specific about the consequence — but still not threatening. It states the fact and gives one action, which is what converts a delayed customer this late in the sequence."
      >
        <p>Hi [First Name],</p>
        <p>
          We still haven’t been able to process your payment for [Product], and your account will be
          paused on [date] if it isn’t resolved.
        </p>
        <p>
          It looks like your card may have expired — updating it takes about 30 seconds:
          [Update payment method].
        </p>
        <p>If you’ve already fixed this, ignore this email — thanks for your patience.</p>
      </EmailExample>
      <P>
        For a much larger library of ready-to-use subject lines and full email bodies across every stage
        of this cadence, see our dedicated{' '}
        <A href="/blog/dunning-email-examples-templates">dunning email examples and templates</A> guide.
      </P>

      <H2 id="personalize">Personalizing dunning by decline reason</H2>
      <P>
        The single biggest lever inside the sequence itself — bigger than subject-line tweaks or send
        time — is writing a different email for a different decline reason instead of one generic
        “payment failed” template for every case. Processors like Stripe and Braintree already hand you
        the decline code on every failed charge; using it is mostly a matter of routing, not new
        technology.
      </P>
      <CodeCard
        code="insufficient_funds"
        type="soft"
        meaning="The card is otherwise fine, but there wasn’t enough available balance at the moment of the charge — often clears on its own within days."
        action="A soft, low-pressure nudge, ideally timed a few days after a likely payday, rather than an urgent “fix this now” tone."
      />
      <CodeCard
        code="expired_card"
        type="hard"
        meaning="The card on file is past its expiry date and will never succeed on retry, no matter how many times or when it is attempted."
        action="Skip the soft language entirely — ask directly for a new card number, since no amount of retrying will fix this one."
      />
      <CodeCard
        code="do_not_honor"
        type="hard"
        meaning="A generic, catch-all decline from the issuing bank that gives no specific reason — often fraud-suspicion related, sometimes just an issuer-side block."
        action="Suggest the customer contact their bank directly in addition to trying a different card, since the block may sit entirely outside your control."
      />
      <CodeCard
        code="authentication_required"
        type="auth"
        meaning="The issuer is requiring Strong Customer Authentication (SCA) under PSD2 — usually a 3D Secure / 3DS2 challenge — before the charge can complete."
        action="Route the customer to a re-authentication link rather than a plain retry; blindly retrying an SCA-blocked charge will just fail again."
      />
      <P>
        Notice how differently each of those four demands to be handled: two are worth a gentle,
        patient tone because the underlying problem often resolves itself; two need a direct,
        unambiguous ask because no amount of waiting fixes them. A single generic template averages
        across all four cases and, in doing so, gets all of them slightly wrong. For the full reference
        of decline codes beyond these four, see our{' '}
        <A href="/blog/stripe-decline-codes-explained">guide to Stripe decline codes explained</A>.
      </P>

      <InlineCTA>
        Revova’s Pro plan ($79/month) routes each failed charge by decline reason automatically —
        soft declines get a patient nudge, hard declines get a direct ask, SCA-related declines get a
        re-authentication link — with an AI sequence through Day 21, no manual routing required.
      </InlineCTA>

      <H2 id="mistakes">Common dunning mistakes that quietly kill recovery rates</H2>
      <P>
        Most underperforming dunning sequences are not broken in any obvious way — they send, they
        deliver, the copy reads fine at a glance. The problems are usually quieter than that, and they
        show up as a lower click rate rather than an error anyone notices:
      </P>
      <UL>
        <LI>
          <Strong>One template for every decline reason.</Strong> Treating <code>insufficient_funds</code>{' '}
          and <code>expired_card</code> identically wastes the single biggest personalization lever
          available, as covered above.
        </LI>
        <LI>
          <Strong>Sending at 3am the customer’s time.</Strong> A dunning email sent at the business’s
          local midnight, ignoring the customer’s timezone entirely, gets buried under a full inbox of
          overnight email by the time they wake up. Sending around 8:30am local consistently outperforms
          an arbitrary fixed send time.
        </LI>
        <LI>
          <Strong>No mention of what is actually at stake.</Strong> A vague “there was an issue with
          your payment” with no date, no consequence, and no specific action reads as low-priority and
          gets skipped — even though the account is genuinely at risk of being paused.
        </LI>
        <LI>
          <Strong>Stopping the sequence after one or two emails.</Strong> A single reminder catches the
          easy cases; the harder-to-reach customers — someone traveling, someone who missed the first
          email in a busy week — need the full cadence through Day 14 or Day 21 to convert.
        </LI>
        <LI>
          <Strong>Ignoring SMS entirely.</Strong> For higher-value accounts especially, a short SMS
          alongside the email sequence reaches customers who have stopped opening emails but still read
          text messages.
        </LI>
        <LI>
          <Strong>Never sweeping historical failures.</Strong> Most businesses have a year or more of old
          failed invoices that were never chased at all, sitting in the processor dashboard as dead
          weight — a one-time historical scan is the fastest way to find out how much that is actually
          worth. See{' '}
          <A href="/blog/how-much-revenue-lost-to-failed-payments">
            how much revenue you are losing to failed payments
          </A>{' '}
          for how to size that number.
        </LI>
        <LI>
          <Strong>Treating dunning like a collections notice.</Strong> Threatening or legalistic language
          aimed at an active, willing customer whose card simply expired reads as hostile and tends to
          suppress clicks rather than drive them — remember, most of these customers want to keep paying.
        </LI>
        <LI>
          <Strong>Blindly retrying an SCA-blocked charge instead of routing it correctly.</Strong> A
          charge declined with <code>authentication_required</code> under PSD2 will keep failing no
          matter how many times it is retried, because the issuer is waiting on a 3D Secure challenge,
          not another attempt at the same charge — the email needs to send the customer to a
          re-authentication link, not a generic “try again” message.
        </LI>
      </UL>
      <Callout title="The pattern behind almost every fix on this list">
        Every mistake above shares the same root cause: treating dunning as one uniform email blast
        instead of a decision tree that branches on decline reason, time zone, account value, and how
        far into the sequence you already are. That branching is exactly what a dedicated recovery tool
        automates — and exactly what a copy-pasted, one-size-fits-all template can never do well.
      </Callout>
      <P>
        A quick way to check where your own setup stands is to ask a handful of direct questions before
        you touch any code or copy:
      </P>
      <UL>
        <LI>Does your first email go out within hours of the failed charge, or does it queue up for a nightly batch send that might land at 3am local time?</LI>
        <LI>Does the copy actually reference the decline reason, or does it say some version of “there was a problem with your payment” regardless of why?</LI>
        <LI>Does the sequence run at least four emails over roughly two weeks, or does it give up after one or two attempts?</LI>
        <LI>Is there a pre-dunning warning for cards approaching their expiry date, or does every expiring card become a failed charge first?</LI>
        <LI>Has anyone gone back and swept old, never-chased failed invoices, or does the sequence only apply to new failures going forward?</LI>
      </UL>
      <P>
        A “no” to two or more of those is a reliable sign that the gap between what you are recovering
        today and the commonly cited 40–60% combined range is mostly a sequencing problem, not a
        product or pricing problem — and it is usually the fastest, cheapest fix available on your entire
        revenue-operations checklist.
      </P>

      <H2 id="how-revova-automates">How Revova automates dunning end to end</H2>
      <P>
        Revova runs the entire recovery stack described above — pre-dunning, smart retries, AI-written
        dunning, and win-back — on top of whichever processor you already use, so none of the sequencing
        or personalization work above has to be built or maintained by hand. Connect{' '}
        <Strong>Stripe</Strong>, <Strong>Paddle</Strong>, <Strong>Braintree</Strong>,{' '}
        <Strong>Chargebee</Strong>, or <Strong>Recurly</Strong> read-only — Revova never touches card
        data — and the sequence starts automatically the moment a charge fails.
      </P>
      <P>
        <Strong>Starter</Strong> ($29/month) runs a 4-email AI sequence on Days 1, 3, 7, and 14, and its
        free <Strong>Lost Revenue Finder</Strong> scans your last 90 days of payment history so you can
        see, before you pay for anything, exactly how much you have already lost to failed charges that
        were never recovered. <Strong>Pro</Strong> ($79/month) extends the sequence through Day 21,
        adds automatic hard/soft/authentication decline routing so each email matches the actual decline
        reason, writes the sequence in 8 languages based on customer locale, adds SMS recovery for
        higher-value accounts, an in-app cancel-flow with retention offers, win-back campaigns on Day 3,
        14, and 30 after cancellation, a full 12-month historical scan instead of 90 days, a weekly
        digest, and priority support. Both plans include a 14-day free trial with no credit card required
        and a 30-day money-back guarantee — the full breakdown is on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>
      <InlineCTA>
        Rather than guess how much a better dunning sequence would recover, run the free Lost Revenue
        Finder — it connects read-only and scans your real payment history for the actual number.
      </InlineCTA>
      <P>
        None of this replaces having Smart Retries turned on — it sits on top of them. Revova reads the
        decline code the moment your processor’s retry attempts are exhausted, decides which of the
        sequences above fits (soft nudge, hard ask, SCA re-authentication, or straight to a shorter
        annual-plan cadence), and starts sending — timed to the customer’s local morning, in their
        language, with a one-click card-update link. If you would rather see the full setup on Stripe
        specifically, including how to wire up webhooks like <code>invoice.payment_failed</code> and{' '}
        <code>charge.failed</code>, walk through{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">
          how to recover failed Stripe payments
        </A>{' '}
        step by step.
      </P>
      <P>
        Setup is deliberately small: paste a read-only key from your processor, pick which decline
        reasons should route to which tone, and the rest — timing, personalization, language, historical
        sweep — runs on its own from there. Nothing about connecting a processor requires a developer or
        a webhook you have to wire up by hand, and nothing about it exposes card numbers, CVCs, or stored
        payment methods to Revova at any point; those stay entirely inside your processor.
      </P>

      <Divider />

      <P>
        For Stripe’s own documentation on how Smart Retries schedules re-attempts, see{' '}
        <A href="https://stripe.com/docs/billing/revenue-recovery/smart-retries">
          Stripe’s Smart Retries documentation
        </A>
        , and for the legal boundary between dunning and formal debt collection, see the{' '}
        <A href="https://www.ftc.gov/legal-library/browse/rules/fair-debt-collection-practices-act-text">
          FTC’s Fair Debt Collection Practices Act
        </A>
        .
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Stop sending one generic dunning email"
        body="Revova runs a full AI dunning sequence — personalized by decline reason, timed to each customer's local morning — on top of Stripe, Paddle, Braintree, Chargebee, or Recurly. Start with a free scan of what you've already lost, then let the sequence recover the rest. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
