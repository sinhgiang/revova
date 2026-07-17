import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, UL, OL, LI, A, Strong, Callout, CompareTable, CTA,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, CodeCard, PriorityMatrix, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is the simplest way to tell a soft decline from a hard decline?',
    a: 'Ask one question: if I charge the exact same card again in a few days, is there a real chance it works? If yes — the account might just be low on funds right now, or the bank had a temporary hiccup — it is a soft decline and worth retrying. If the answer is no because the card itself is expired, closed, lost, stolen, or blocked, it is a hard decline, and no amount of retrying changes that. The card, not the timing, is the problem.',
  },
  {
    q: 'Is "soft decline" and "hard decline" official Stripe or card-network terminology?',
    a: 'No. Stripe and the card networks publish specific decline reasons and decline codes (insufficient_funds, expired_card, do_not_honor, and so on), but "soft" and "hard" are an industry-common shorthand that payment recovery and dunning tools use to group those codes by whether retrying makes sense. You will see the same soft/hard framing used by most subscription billing platforms, but treat it as a practical mental model layered on top of the processor’s own codes, not a category Stripe itself assigns on the charge.',
  },
  {
    q: 'Should I ever retry a hard decline, even once?',
    a: 'Generally no. A hard decline like expired_card, lost_card, stolen_card, or restricted_card describes a permanent state of that specific card — it did not expire a little, or get reported stolen only sometimes. Retrying wastes a processing attempt, delays the moment the customer actually fixes the problem, and on some processors repeated retries against a flagged card can quietly hurt your account’s standing with the networks. The one narrow exception is a generically-worded code like do_not_honor, which behaves more like an ambiguous middle case than a clean hard decline — see the section on that below.',
  },
  {
    q: 'How many times should a soft decline be retried before switching to an email?',
    a: 'There is no single universal number, which is exactly why most teams lean on an automated system — like Stripe Smart Retries or a dedicated recovery tool — rather than picking a fixed count by hand. A common pattern is a handful of attempts spread across one to three weeks, timed around when the customer is statistically more likely to have funds available (often near typical paydays), with a dunning email running in parallel rather than only after retries are exhausted.',
  },
  {
    q: 'What should the recovery email say differently for a soft decline versus a hard decline?',
    a: 'A soft-decline email can afford to be light and reassuring, since the system is often already quietly retrying in the background — something like "your last payment didn’t go through, we’ll try again automatically, but you’re welcome to update your card now if you’d like." A hard-decline email needs to be direct and specific about the actual problem — "your card ending in 4242 has expired" — with one clear action and no vague promise that the same card will eventually work, because it will not.',
  },
  {
    q: 'Does Stripe Smart Retries already know the difference between soft and hard declines?',
    a: 'Yes, functionally. Smart Retries uses a machine learning model trained across Stripe’s network to decide which charges are worth re-attempting and when, which in practice means it is far less likely to keep retrying a charge with a clearly permanent decline reason than one with a temporary one. But Smart Retries only handles the retry side — it never emails the customer, so even when it correctly identifies a hard decline as not worth retrying further, something else still has to tell the customer to fix their card.',
  },
  {
    q: 'What is a decline code that behaves like both soft and hard depending on the situation?',
    a: 'do_not_honor is the classic example. It is a catch-all decline a bank issues without specifying a reason, so it sometimes clears on its own within a day or two (behaving like a soft decline) and sometimes represents a persistent, effectively permanent block the bank will never lift for that transaction pattern (behaving like a hard decline). The practical answer is to treat it as soft for one or two retries, then treat continued failures as hard and move straight to asking for a new card.',
  },
  {
    q: 'Do soft and hard declines matter for processors other than Stripe?',
    a: 'Yes — the underlying concept applies to Paddle, Braintree, Chargebee, Recurly, and effectively any card processor, because it reflects how banks and card networks respond to charges everywhere, not a Stripe-specific mechanic. Each processor has its own vocabulary and its own retry logic, so the exact code names differ, but the same soft-versus-hard split, and the same "retry versus ask for a new card" decision, holds regardless of which processor is running the charge.',
  },
  {
    q: 'What happens if I treat every decline the same way, without splitting soft from hard?',
    a: 'You lose recovered revenue on both ends. Retry every decline blindly and you burn attempts on cards that will never work, delaying the moment a customer with a genuinely dead card finds out and fixes it — sometimes long enough that they simply churn instead. Email every decline immediately and you nag customers over glitches that would have quietly resolved on their own, which reads as sloppy and can push otherwise-happy subscribers to cancel out of irritation rather than a real payment problem.',
  },
  {
    q: 'How does Revova decide whether to retry or email a customer?',
    a: 'On the Pro plan, Revova reads the decline code returned by your processor and automatically routes it — soft declines get folded into the retry-aware side of the AI email sequence with lighter, reassuring copy, while hard declines trigger a direct, specific message asking for a new card right away, without waiting on a retry that was never going to succeed. Starter runs the same core 4-email sequence without that automatic soft/hard routing.',
  },
]

const softCodes = [
  { code: 'insufficient_funds', type: 'soft' as const, meaning: 'The account does not currently have enough available balance to cover the charge — the card itself is perfectly valid.', action: 'Let the retry logic re-attempt over the coming days, ideally timed near a typical payday window.' },
  { code: 'try_again_later', type: 'soft' as const, meaning: 'The issuing bank asked for the transaction to be retried later, without giving a more specific reason.', action: 'Retry after a delay. Avoid firing several attempts back-to-back in a short window.' },
  { code: 'processing_error', type: 'soft' as const, meaning: 'A temporary error occurred somewhere in the processing chain — the network, the processor, or the issuer — unrelated to the card itself.', action: 'Retry shortly. If it recurs across many unrelated customers at once, check for a broader processor incident before assuming it is card-specific.' },
  { code: 'issuer_not_available', type: 'soft' as const, meaning: 'The card network could not reach the customer’s bank to authorize the charge at that moment.', action: 'Retry a bit later once the issuer is reachable again — this is a connectivity problem, not a card problem.' },
]

const hardCodes = [
  { code: 'expired_card', type: 'hard' as const, meaning: 'The card on file has passed its printed expiration date.', action: 'Never retry the same card — email the customer to add a current one.' },
  { code: 'lost_card', type: 'hard' as const, meaning: 'The cardholder reported this card lost. Some processors mask this behind a more generic decline to avoid signaling to a potential fraudster why it failed.', action: 'Do not retry under any circumstances — request a new payment method immediately.' },
  { code: 'stolen_card', type: 'hard' as const, meaning: 'The cardholder reported this card stolen — functionally identical in outcome to lost_card.', action: 'Do not retry — request a new card and treat it with the same urgency as an expired one.' },
  { code: 'restricted_card', type: 'hard' as const, meaning: 'The issuer has placed a restriction on the card that blocks this type of transaction outright, independent of available balance.', action: 'Do not retry — the restriction will not lift itself; ask for a different card.' },
  { code: 'card_not_supported', type: 'hard' as const, meaning: 'The card, or the specific transaction type, is not supported by the issuer for this kind of charge.', action: 'Do not retry the same card — ask the customer for a different one.' },
]

export default function Article() {
  return (
    <>
      <Lead>
        Not every failed subscription charge is the same kind of failure. A <Strong>soft decline</Strong>{' '}
        is a temporary problem — the card is fine, but this particular attempt did not clear — while a{' '}
        <Strong>hard decline</Strong> is a permanent problem with the card itself. Treat them the same
        way and you either waste retry attempts on a card that will never work, or you hassle a customer
        about a glitch that would have quietly resolved on its own. Get the split right and recovery
        gets meaningfully easier on both sides.
      </Lead>
      <P>
        Every payment recovery decision — retry now, retry later, or stop retrying and ask the customer
        to act — ultimately comes down to correctly answering one question about a failed charge: is the
        problem the <em>timing</em>, or is the problem the <em>card</em>? A soft decline says the timing
        was wrong. A hard decline says the card itself needs to change. This is a different question from
        &quot;what does this specific decline code mean,&quot; which we cover exhaustively in our{' '}
        <A href="/blog/stripe-decline-codes-explained">Stripe decline codes glossary</A> — this guide is
        about the higher-level framework: how to classify any decline into one of the two buckets, and
        exactly what to do once you have.
      </P>
      <P>
        Get this classification wrong in either direction and it costs you. Keep retrying a hard decline
        and you delay the moment a customer with a genuinely dead card finds out, sometimes long enough
        that they simply drift into cancellation without ever seeing an actionable message. Email a
        customer immediately over a soft decline that would have cleared on the next automatic retry, and
        you come across as nagging over something that was never really a problem — the kind of friction
        that erodes trust with an otherwise happy subscriber.
      </P>

      <KeyTakeaways
        items={[
          <><Strong>Soft decline</Strong> = temporary, card is fine, the same charge will likely succeed on a later retry (insufficient_funds, processing_error, issuer_not_available).</>,
          <><Strong>Hard decline</Strong> = permanent, the card itself is the problem, retrying is pointless (expired_card, lost_card, stolen_card, restricted_card).</>,
          <>Soft declines call for smart, timed retries; hard declines call for an immediate, specific ask for a new card — never the other way around.</>,
          <>A few codes, most notably <code>do_not_honor</code>, sit in an ambiguous middle and need a hybrid rule: retry once or twice, then treat continued failure as hard.</>,
          <>Revova’s Pro plan reads the decline code automatically and routes soft versus hard declines to different email copy — no manual rule-building required.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '30–40%', label: 'of failed charges Stripe Smart Retries alone typically recovers, industry-wide' },
          { value: '40–60%', label: 'commonly recoverable once retries and dunning emails work together' },
          { value: '5–10%', label: 'of subscription charges commonly fail or get declined in a typical billing cycle' },
        ]}
      />

      <H2 id="what-is-soft">What is a soft decline?</H2>
      <P>
        A soft decline is a failed charge where the card itself is valid and in good standing, but
        <em> this specific attempt</em> did not go through for a reason that is likely to change on its
        own — often within days, sometimes within hours. Nothing about the card needs to be fixed; the
        problem is closer to bad timing than a bad card.
      </P>
      <P>The most common causes behind a soft decline include:</P>
      <UL>
        <LI><Strong>Insufficient funds.</Strong> The account is temporarily low, most often right before a paycheck or deposit lands — a charge retried a few days later, near a typical payday window, frequently succeeds with zero customer effort.</LI>
        <LI><Strong>A temporary processing or network error.</Strong> Something glitched between the processor and the issuing bank for a moment; the card was never actually the issue.</LI>
        <LI><Strong>The issuer was briefly unreachable.</Strong> The customer’s bank could not be contacted to authorize the charge at that exact moment — a connectivity problem, not a card problem.</LI>
        <LI><Strong>A temporary risk hold or velocity block.</Strong> Some banks briefly restrict a card after unusual activity or too many attempts in a short window, then lift the hold automatically once the pattern cools off.</LI>
      </UL>
      <P>
        The defining feature of every soft decline is that <Strong>retrying the exact same card, at a
        better moment, has a real chance of working</Strong> — which is exactly what Stripe Smart Retries
        and equivalent features on other processors are built to exploit. If you have not already, our
        guide to <A href="/blog/stripe-smart-retries-explained">how Stripe Smart Retries works</A> covers
        how that timing decision gets made without any code on your end.
      </P>

      <H2 id="what-is-hard">What is a hard decline?</H2>
      <P>
        A hard decline is a failed charge where the card itself is the problem, permanently, for this
        transaction and every future one until the customer replaces it. No amount of retrying, no
        matter how well-timed, changes anything, because the failure has nothing to do with available
        balance or momentary bank conditions.
      </P>
      <P>The most common causes behind a hard decline include:</P>
      <UL>
        <LI><Strong>An expired card.</Strong> The printed expiration date has passed — the single most common hard decline for subscription businesses, since it happens to every card eventually.</LI>
        <LI><Strong>A lost or stolen card.</Strong> The cardholder reported the card lost or stolen, so the issuer has permanently deactivated it.</LI>
        <LI><Strong>A closed or restricted account.</Strong> The bank account behind the card was closed, or the issuer placed a restriction that blocks this kind of charge outright, independent of balance.</LI>
        <LI><Strong>A fraud-pattern block.</Strong> Codes like <code>do_not_honor</code> can sometimes reflect a bank-side fraud flag against the card or merchant that will not lift for that specific transaction pattern, effectively making it terminal even without an explicit &quot;stolen&quot; label.</LI>
      </UL>
      <P>
        The defining feature of every hard decline is that <Strong>the customer must provide new payment
        details before the subscription can be charged successfully again</Strong> — retrying only burns
        an attempt and delays the moment they actually see the problem and fix it.
      </P>

      <InlineCTA>
        Revova’s Pro plan reads every decline code automatically and routes soft versus hard declines to
        different recovery copy — starting at $29/month on Starter, or $79/month for that smart routing
        on Pro, both with a 14-day free trial, no credit card required.
      </InlineCTA>

      <H2 id="why-it-matters">Why the distinction actually matters</H2>
      <P>
        It is tempting to treat every failed charge as one undifferentiated problem — &quot;a payment
        failed, send an email&quot; — but that flattens two situations that call for opposite responses.
        Involuntary churn, where a subscription lapses because a payment failed rather than because the
        customer chose to leave, commonly makes up <Strong>20–40% of total SaaS churn</Strong>. A large
        share of that is preventable, but only if the response matches the failure type. For the broader
        picture of how failed payments turn into churn if nothing intervenes, see our guide on{' '}
        <A href="/blog/what-is-dunning">what dunning is and how the whole recovery stack fits together</A>.
      </P>
      <P>Getting the classification wrong costs you in two distinct ways, depending on which direction you get it wrong:</P>
      <OL>
        <LI><Strong>Retrying a hard decline repeatedly.</Strong> Every attempt against an expired, lost, or stolen card is guaranteed to fail. Beyond wasting the attempt, it delays the one thing that actually fixes the problem — telling the customer, clearly, that their card needs to change — sometimes long enough that they quietly lapse before ever getting a useful message.</LI>
        <LI><Strong>Emailing immediately over a soft decline.</Strong> If a customer gets a slightly alarming &quot;your payment failed, please update your card&quot; email over an insufficient-funds blip that a retry would have cleared two days later on its own, you have manufactured friction and mild anxiety out of a non-event — and repeat it enough times and it reads as a badly built product.</LI>
      </OL>
      <P>
        Failed or declined subscription charges commonly run <Strong>5–10% per billing cycle</Strong>{' '}
        industry-wide — a meaningful share of monthly revenue moving through a process that either
        recovers cleanly or leaks slowly, largely depending on whether the soft/hard split is handled
        correctly at each step.
      </P>

      <H2 id="reference-table">Common decline codes, classified: soft vs hard</H2>
      <P>
        Here is a practical reference for the codes you will see most often on Stripe (the same
        underlying concepts apply, with different code names, on Paddle, Braintree, Chargebee, and
        Recurly). For the exhaustive glossary with every code Stripe documents, see our{' '}
        <A href="/blog/stripe-decline-codes-explained">full decline codes explainer</A> — this table is
        the condensed soft-vs-hard cheat sheet.
      </P>
      <CompareTable
        rows={[
          ['Code', 'Type', 'What it means', 'Retry?'],
          ['insufficient_funds', 'Soft', 'Account temporarily short on funds', 'Yes — near payday'],
          ['try_again_later', 'Soft', 'Bank asked to retry, no specific reason', 'Yes — after a delay'],
          ['processing_error', 'Soft', 'Temporary network/processor glitch', 'Yes — shortly after'],
          ['issuer_not_available', 'Soft', 'Bank unreachable at that moment', 'Yes — a bit later'],
          ['expired_card', 'Hard', 'Past its printed expiration date', 'No — new card'],
          ['lost_card', 'Hard', 'Reported lost by the cardholder', 'No — new card'],
          ['stolen_card', 'Hard', 'Reported stolen by the cardholder', 'No — new card'],
          ['restricted_card', 'Hard', 'Issuer-side restriction on this card', 'No — new card'],
          ['card_not_supported', 'Hard', 'Card/transaction type not supported', 'No — new card'],
          ['do_not_honor', 'Ambiguous', 'Generic bank refusal, no reason given', 'Once or twice, then escalate'],
        ]}
      />
      <P>
        Notice how thin the soft column is compared with the hard column above — that is a function of
        which codes are common enough to be worth naming individually, not a claim about the overall
        share of declines that are soft versus hard. Soft failures like insufficient funds are generally
        considered common in day-to-day billing, and hard failures like an expired card eventually happen
        to nearly every customer relationship that runs long enough — but we are not aware of a single
        authoritative published ratio splitting all declines into soft versus hard across the industry,
        so we deliberately won&apos;t invent one here. The mix varies significantly by industry, price
        point, and customer base.
      </P>

      <H2 id="soft-detail">Soft decline codes, in detail</H2>
      <P>
        The card is valid in every one of these — the charge simply hit a passing condition that a later,
        well-timed attempt is likely to clear:
      </P>
      {softCodes.map((c) => <CodeCard key={c.code} {...c} />)}

      <H2 id="hard-detail">Hard decline codes, in detail</H2>
      <P>
        None of these resolve with time. Retrying wastes an attempt and, on some processors, repeated
        attempts against a flagged or closed card can draw unwanted scrutiny toward your account with the
        card networks:
      </P>
      {hardCodes.map((c) => <CodeCard key={c.code} {...c} />)}

      <Callout title="The ambiguous middle: do_not_honor">
        <p style={{ margin: 0 }}>
          <code>do_not_honor</code> is a bank&apos;s generic, unexplained refusal — no specific reason
          given — and it does not sort cleanly into either bucket. Sometimes it clears on a retry a day
          or two later, behaving like a soft decline. Sometimes it reflects a standing block the bank
          will never lift for that transaction pattern, behaving like a hard decline. The practical rule:
          treat it as soft for <em>one, maybe two</em> retries. If it keeps failing after that, stop
          retrying and treat it exactly like a hard decline — ask the customer to try a different card
          or contact their bank directly.
        </p>
      </Callout>

      <H2 id="framework">The decision framework: retry, or ask for a new card?</H2>
      <P>
        Once a decline lands, resist the urge to decide case by case from a support inbox — the whole
        point of the soft/hard split is that it turns a judgment call into a lookup you can automate.
        Reduced to its simplest form, every decline routes through the same three questions:
      </P>
      <OL>
        <LI><Strong>Is the decline code soft?</Strong> Let an automated retry system re-attempt it on a well-timed schedule — no customer message needed yet.</LI>
        <LI><Strong>Is the decline code hard?</Strong> Skip retries entirely. Send a direct, specific email or SMS asking for a new card, today.</LI>
        <LI><Strong>Is the decline code ambiguous (do_not_honor, generic decline)?</Strong> Allow one or two retries as a safety net, then treat any continued failure as hard.</LI>
      </OL>
      <P>
        Building this correctly into a live billing system is less about the classification itself —
        which is a lookup — and more about prioritizing which parts of your current setup to fix first.
        For most teams that have never split soft from hard, the highest-leverage change is routing
        authentication and clearly-hard codes to an immediate, specific email, since that is where silent
        retries are actively costing lapsed customers who were never going to be recovered by waiting:
      </P>
      <PriorityMatrix
        items={[
          { label: 'Stop retrying expired_card / lost_card / stolen_card', effort: 15, impact: 85 },
          { label: 'Send an immediate, specific email on clear hard declines', effort: 22, impact: 88 },
          { label: 'Add a payday-timed retry window for insufficient_funds', effort: 35, impact: 78 },
          { label: 'Add a two-retry cap before escalating do_not_honor', effort: 40, impact: 65 },
          { label: 'Personalize hard-decline copy by exact reason (expired vs lost)', effort: 55, impact: 60 },
          { label: 'Keep sending one generic "payment failed" email for every code', effort: 8, impact: 10, left: true },
        ]}
        caption="Illustrative prioritization for teams building out soft/hard decline handling — relative effort and impact, not measured data."
      />

      <H2 id="two-strategies">Two response strategies, compared</H2>
      <P>
        In practice, most of the recovery-strategy debate collapses into a choice between two postures:
        recover quietly through retries first, or reach out to the customer right away. Neither is
        universally right — the correct posture depends entirely on which decline type you are looking at.
      </P>
      <ProsCons
        pros={[
          'No customer-facing friction at all if the retry succeeds — the subscription simply continues uninterrupted.',
          'Matches how insufficient_funds and other soft declines actually resolve: given a few days, the card often just works.',
          'Zero risk of nagging a customer over something that was never really broken.',
        ]}
        cons={[
          'Wasted entirely on hard declines — waiting for a retry that structurally cannot succeed just delays the fix.',
          'Needs a real timing strategy (like payday-aware Smart Retries) or it degrades into blind, low-value re-attempts.',
          'Silent by design, so if the retry window runs out with no recovery, the customer never got a heads-up unless something else told them.',
        ]}
      />
      <P>
        <Strong>Approach: retry silently first, escalate to email only if it keeps failing</Strong> — the
        right default for soft declines.
      </P>
      <ProsCons
        pros={[
          'Gets the actual fix in front of the customer immediately, instead of losing days to a retry that was never going to work.',
          'Lets the message be specific — "your card ending in 4242 has expired" — which converts far better than a vague, generic prompt.',
          'Signals competence: customers generally respond well to a business that clearly knows what went wrong with their payment.',
        ]}
        cons={[
          'Wasted, and mildly annoying, if fired on a soft decline that would have cleared on its own within a day or two.',
          'Requires reliably reading the decline code correctly — a misclassified soft decline treated as hard creates unnecessary friction.',
          'Needs a genuinely well-written, non-alarming template, or it can read as pushy for what is, from the customer’s side, a minor blip.',
        ]}
      />
      <P>
        <Strong>Approach: email immediately, no retry attempted first</Strong> — the right default for
        hard declines, and the wrong default for soft ones.
      </P>

      <InlineCTA>
        See exactly which of your active subscribers are on an expired or soon-to-expire card before it
        ever declines, with Revova’s free Lost Revenue Finder — starting at $29/month for the full
        recovery sequence, 14-day free trial, no credit card required.
      </InlineCTA>

      <H2 id="sequence">Building the split into your dunning sequence</H2>
      <P>
        Classification only pays off once it changes what the customer actually receives. A dunning
        sequence that sends the identical email regardless of decline type is treating soft and hard
        declines the same in the one place it matters most — the customer-facing message. Our{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">guide to setting up a dunning email sequence</A>{' '}
        walks through the day-by-day cadence in full; the soft/hard split changes two things within it:
      </P>
      <UL>
        <LI><Strong>Tone and urgency.</Strong> A soft-decline email can be light — reassuring the customer that a retry is already in motion, with an easy option to update their card if they would rather not wait. A hard-decline email needs to be direct from the first line, since there is no silent retry quietly working in the background to soften the ask.</LI>
        <LI><Strong>Specificity.</Strong> Hard-decline emails convert better when they name the exact reason — expired, lost, or restricted — rather than a generic &quot;there was a problem with your payment.&quot; Soft-decline emails can stay vaguer, since the precise cause (a momentary balance issue) is rarely something the customer needs spelled out.</LI>
      </UL>
      <P>
        The timing matters too. Layering a decline-reason-aware dunning sequence on top of automatic
        retries is commonly what pushes combined recovery into the <Strong>40–60% range</Strong>{' '}
        industry-wide, well above what retries alone typically achieve. Dunning emails themselves
        commonly see open rates around <Strong>30–40%</Strong> and click rates around{' '}
        <Strong>10–15%</Strong> — figures that generally hold up better when the message actually matches
        the failure the customer is experiencing, rather than reading as a generic template fired at
        every decline alike.
      </P>

      <InlineCTA>
        Get an AI dunning sequence that already branches copy by decline reason instead of building the
        soft/hard logic yourself — starting at $29/month, 14-day free trial, no credit card required.
      </InlineCTA>

      <H2 id="other-processors">Soft and hard declines beyond Stripe</H2>
      <P>
        The soft-versus-hard framework is not a Stripe-specific mechanic — it reflects how card networks
        and issuing banks respond to charges everywhere, so the same underlying split shows up on every
        major processor Revova supports: Paddle, Braintree, Chargebee, and Recurly, in addition to
        Stripe. What changes from one processor to the next is the exact vocabulary and the retry
        defaults, not the concept itself.
      </P>
      <UL>
        <LI><Strong>Paddle</Strong> exposes its own decline reasons through its checkout and subscription events, and runs its own configurable retry schedule for failed renewals rather than Stripe’s specific Smart Retries model.</LI>
        <LI><Strong>Braintree</Strong> surfaces processor response codes from the underlying gateway (often Visa/Mastercard-style codes depending on region and card network), which need their own soft/hard mapping rather than reusing Stripe’s exact code names.</LI>
        <LI><Strong>Chargebee</Strong> and <Strong>Recurly</Strong>, as subscription management layers sitting on top of a processor, typically pass through a decline reason from the underlying gateway along with their own dunning and retry configuration.</LI>
      </UL>
      <P>
        If your business runs more than one processor at once — common for companies selling in multiple
        regions or migrating between platforms — the practical implication is that a soft/hard mapping
        tuned for Stripe’s codes will not automatically transfer. Each processor’s decline vocabulary
        needs to be classified on its own terms, which is exactly the kind of cross-processor consistency
        problem a tool with native, read-only connections to all of them is built to absorb rather than
        leaving it to a hand-maintained rule per platform.
      </P>

      <H2 id="mistakes">Common mistakes teams make with soft and hard declines</H2>
      <UL>
        <LI><Strong>Retrying every decline on a fixed schedule, regardless of code.</Strong> A blind daily retry burns attempts on hard declines that will never clear and can undershoot the ideal payday timing on soft ones.</LI>
        <LI><Strong>Sending one generic &quot;payment failed&quot; email for every failure.</Strong> It underserves hard declines (too vague to convert well) and overserves soft ones (unnecessary alarm over something self-resolving).</LI>
        <LI><Strong>Treating do_not_honor as permanently hard from the first failure.</Strong> That forfeits the real chance it clears on a quick retry, since the code alone does not distinguish the two cases.</LI>
        <LI><Strong>Never revisiting the classification as processors update their own retry logic.</Strong> A code that behaved one way a year ago may be handled differently by your processor’s own automatic retry system today.</LI>
        <LI><Strong>Ignoring the difference across processors.</Strong> If you run more than one of Stripe, Paddle, Braintree, Chargebee, or Recurly, each has its own vocabulary and retry defaults — a rule tuned for Stripe’s codes will not automatically translate.</LI>
      </UL>

      <H2 id="revova">How Revova handles soft vs hard declines</H2>
      <P>
        Revova connects, read-only, to Stripe, Paddle, Braintree, Chargebee, and Recurly — it never
        touches raw card data — and reads the decline code on every failed charge as part of building its
        recovery sequence. On the <Strong>Pro plan ($79/month)</Strong>, that reading directly drives{' '}
        <Strong>smart soft/hard routing</Strong>: soft declines feed into the retry-aware side of the
        5-email AI sequence (Day 1/3/7/14/21) with lighter, reassuring copy, while hard declines trigger a
        direct, specific ask for a new card without waiting on a retry that structurally cannot succeed.
        Pro also adds SMS recovery, 8 languages, an in-app cancel-flow with retention offers, and Day
        3/14/30 win-back campaigns for subscriptions that lapse anyway.
      </P>
      <P>
        The <Strong>Starter plan ($29/month)</Strong> runs the same core 4-email AI sequence (Day 1/3/7/14)
        for up to 50 recoveries a month, without the automatic soft/hard routing — a solid default for
        smaller volumes, with room to grow into Pro as decline volume and the value of precise routing
        both increase. Both plans include the free <Strong>Lost Revenue Finder</Strong>, which scans your
        payment history (90 days on Starter, a full 12 months on Pro) to surface what has already been
        lost to failed charges before you ever send a recovery email. For the scale of what that history
        typically reveals, see our guide on{' '}
        <A href="/blog/how-much-revenue-lost-to-failed-payments">how much revenue is commonly lost to failed payments</A>.
      </P>
      <P>
        Both plans ship with a 14-day free trial, no credit card required, and a 30-day money-back
        guarantee. Stripe documents its own decline reasons in full in its{' '}
        <A href="https://docs.stripe.com/declines/codes">decline codes reference</A>, which is the
        authoritative source for the exact wording and network status behind each code; our{' '}
        <A href="/blog/stripe-decline-codes-explained">Stripe decline codes explained</A> guide translates
        that reference into plain language with recovery actions for each one.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Stop treating every decline the same way"
        body="Revova reads the decline code on every failed charge and routes soft versus hard declines to the right recovery action automatically on Pro — retry-aware copy for the temporary ones, an immediate new-card ask for the permanent ones. Start free and see what's already recoverable in your last 90 days."
      />
    </>
  )
}
