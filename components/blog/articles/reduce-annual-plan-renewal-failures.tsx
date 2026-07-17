import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, EmailExample, AreaChart, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Why do annual plan renewals fail more often than I expect, when the card worked fine at signup?',
    a: 'The card almost certainly did work fine at signup — the problem is the twelve months in between. Cards expire on a fixed cycle regardless of billing frequency, get reissued after a bank flags fraud, get replaced when a customer switches banks, and get closed when a company card is deprovisioned after an employee leaves. None of that is unusual; it is just normal card lifecycle churn. A monthly plan charges the same card roughly twelve times before that decay has much chance to matter. An annual plan charges it once, a full year later, at exactly the point where the odds of the card still being valid have dropped the most. Nothing went wrong at signup — time simply passed.',
  },
  {
    q: 'Is there a published statistic showing annual renewals fail at a higher rate than monthly ones?',
    a: 'Not that we are aware of, and we deliberately do not cite one. What is well documented is that failed or declined subscription charges commonly run 5–10% per billing cycle industry-wide, and that card details naturally decay over time due to expiry, reissue, and replacement. Reasoning from those two facts, a charge attempted after a 12-month gap is logically more exposed to card-validity decay than one attempted after a 1-month gap — but we have not seen a credible, sourced number comparing annual-specific and monthly-specific failure rates, so we are not going to invent one just to make this article sound more precise than it is.',
  },
  {
    q: 'What is pre-dunning, and how is it different from a normal dunning email?',
    a: 'Dunning is what happens after a charge has already failed — an email or SMS asking the customer to fix a payment method or retry. Pre-dunning happens before the charge is even attempted: a proactive notice, typically sent using Stripe’s invoice.upcoming event or the equivalent on Paddle, Braintree, Chargebee, or Recurly, telling the customer their subscription is about to renew, for how much, and inviting them to update their card first if anything has changed. For a monthly plan, pre-dunning is a nice-to-have. For an annual plan, where the customer has had a full year to forget the renewal is even coming, it is close to essential — it is the only intervention that happens before the surprise, rather than in response to it.',
  },
  {
    q: 'How many days before an annual renewal should the pre-dunning email go out?',
    a: 'A common pattern is a three-touch sequence — roughly 14 days, 7 days, and 3 days before the renewal date — with the cadence tightening as the charge date approaches. The 14-day email is purely informational (here is what is renewing, here is the amount). The 7-day email adds a direct card-update link if nothing has changed since the first email. The 3-day email is the last practical chance to update a card before the charge fires, so it should be the most direct of the three. Fewer than three touches risks the customer missing all of them in a busy inbox; more than three risks reading as pressure rather than a courtesy notice.',
  },
  {
    q: 'Should I offer a monthly fallback to a customer whose annual renewal failed?',
    a: 'It is worth considering, but it is not a universal yes. Offering to switch a failed annual renewal to monthly billing removes the large-dollar-amount friction that may have caused the decline in the first place, and it keeps a customer who might otherwise churn entirely. The trade-off is that monthly billing is worth less to you per successful conversion — you lose the annual prepayment discount economics and take on twelve separate future failure points instead of one. A reasonable middle ground is to offer it as a secondary option in the recovery email, after first asking directly for an updated card, rather than leading with it.',
  },
  {
    q: 'Does Stripe (or Paddle, Braintree, Chargebee, Recurly) send its own pre-renewal reminder for annual plans?',
    a: 'Not by default, and not in a customer-facing way you can rely on. Stripe Billing generates an invoice.upcoming event ahead of a renewal, which is meant for your systems to react to — it is not itself a customer email. Stripe does offer basic, non-branching failed-payment email templates for after a charge fails, but nothing built in proactively tells a customer three weeks in advance that a large annual charge is coming and invites them to check their card first. That gap is exactly what a pre-dunning sequence is built to close, and it is the same story across Paddle, Braintree, Chargebee, and Recurly — each surfaces the underlying event, but none of them ship a polished pre-renewal reminder email out of the box.',
  },
  {
    q: 'How should the tone of an annual renewal failure email differ from a monthly one?',
    a: 'It should acknowledge, explicitly, that time has passed. A monthly dunning email can assume the customer used the product recently and remembers signing up for it — that assumption is usually safe. An annual renewal failure email cannot assume either of those things safely. The better pattern opens by naming what happened plainly ("your annual [Product] plan was due to renew and the charge didn’t go through"), states the amount clearly, and gives an easy, low-pressure way to update the card — without the slightly urgent, "did-you-just-buy-something" tone that works fine for a $19 monthly charge but can read as alarming or presumptuous against a $300+ annual one.',
  },
  {
    q: 'Can annual-plan pre-dunning and renewal-failure handling be automated across five different processors?',
    a: 'Yes, in principle, though each processor exposes the underlying signals — upcoming renewal dates, card expiry metadata, decline reasons — slightly differently, which is exactly the integration work a dedicated recovery layer takes on. Revova connects read-only to Stripe, Paddle, Braintree, Chargebee, and Recurly, watches for both an approaching annual renewal and a card nearing its stored expiry date, and fires the same pre-dunning and post-failure sequences regardless of which processor a given customer happens to be billed through.',
  },
  {
    q: 'Does a failed annual renewal count as involuntary churn even if the customer never explicitly canceled?',
    a: 'Yes, in almost every practical sense. Involuntary churn — commonly cited as making up 20–40% of total SaaS churn industry-wide — describes exactly this: a customer who did not choose to leave, but whose subscription lapsed because a payment failed and nothing recovered it. An annual customer whose renewal silently fails and is never followed up on looks, from the outside, exactly like a customer who churned voluntarily — the ARR just disappears from the renewal date forward with no explicit cancellation event to explain it, which is part of why it is so easy for this specific failure mode to go unnoticed on a churn dashboard.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Reducing failed renewals on annual SaaS plans starts with treating them as a structurally
        different problem from monthly billing failures, not a bigger version of the same one. An
        annual charge hits the card on file once a year — often eleven or twelve months after the
        customer last consciously thought about the transaction — at exactly the moment a card is
        statistically least likely to still be valid and the customer is least likely to recognize
        the charge as expected. The fix is not a better retry schedule; Stripe Smart Retries and its
        equivalents on Paddle, Braintree, Chargebee, and Recurly already handle timing reasonably
        well regardless of billing frequency. The fix is catching the problem <em>before</em> the
        charge is even attempted, through pre-dunning built specifically around the annual renewal
        date and proactive card-expiry detection, followed by a softer, more explanatory recovery
        tone if the charge fails anyway. This guide covers why annual renewals fail differently and
        more expensively than monthly ones, the specific mechanics of card-expiry timing over a
        12-month gap, the psychological gap a once-a-year customer has to overcome, how to build a
        pre-dunning sequence for annual renewals specifically, how to handle the failure itself with
        the right tone if pre-dunning did not prevent it, and how Revova is built around exactly this
        case.
      </Lead>
      <P>
        Most of the dunning advice online, including some of our own other guides, is written with a
        monthly-billing mental model baked in: a charge fails, Smart Retries tries again within a
        couple of weeks, an email sequence runs on Day 1/3/7/14, and the whole cycle resolves one way
        or another within about a month. Annual plans do not fit that model cleanly, and the
        businesses we talk to that bill annually — often at a meaningful ARR discount to encourage
        the commitment in the first place — are frequently the ones most surprised by how much a
        single failed renewal costs them, and how little warning they had that it was coming.
      </P>

      <KeyTakeaways
        items={[
          <>Annual renewals fail for a <Strong>structural</Strong> reason, not a worse one: a card valid at signup has had 12 months to expire, get reissued, or get replaced, versus roughly 1 month for a monthly charge.</>,
          <>The dollar amount per failure is far larger — a full year of revenue at risk in one declined charge, instead of one month&apos;s worth.</>,
          <>Customers have the least present-moment context exactly when the charge fires, since they last thought about the purchase up to a year earlier.</>,
          <>Pre-dunning — a proactive &quot;your plan renews in 14/7/3 days&quot; notice sent before the charge is attempted — matters far more for annual plans than monthly ones, precisely because the surprise factor is so much higher.</>,
          <>If a renewal does fail, the recovery email needs a softer, more explanatory tone than a monthly dunning email — acknowledging the time gap rather than assuming recent context.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription charges that fail or get declined in a typical billing cycle, industry-wide' },
          { value: '20–40%', label: 'of total SaaS churn commonly attributed to involuntary churn' },
          { value: '30–40%', label: 'of failed charges Stripe Smart Retries alone typically recovers' },
        ]}
      />

      <H2 id="why-different">Why annual renewals fail differently — and more expensively — than monthly ones</H2>
      <P>
        Annual renewals do not necessarily fail more often in some universally documented sense — we
        are not aware of a credible, sourced statistic comparing annual-specific and monthly-specific
        decline rates, and we are not going to invent one. What is true, structurally and logically,
        is that three separate factors stack against an annual charge in a way they do not against a
        monthly one, and all three point in the same direction.
      </P>
      <UL>
        <LI>
          <Strong>Card validity decays over time.</Strong> A card that was valid at signup has had a
          full 12 months to expire, get reissued after a fraud flag, get replaced when the customer
          switches banks, or get closed when a company card is deprovisioned. A monthly plan re-tests
          that same card roughly twelve times over the same period, catching decay early and often. An
          annual plan tests it exactly once, at the point where the odds of it still being valid have
          fallen the most.
        </LI>
        <LI>
          <Strong>The dollar amount per attempt is much larger.</Strong> A $19 monthly charge and a
          $190 annual charge might represent the same customer at the same effective price, but the
          annual charge is ten times more likely to bump into a balance limit, a single-transaction
          cap, or a bank&apos;s velocity check than twelve separate $19 charges spread across a year
          ever would.
        </LI>
        <LI>
          <Strong>The customer has the least present-moment awareness at exactly the wrong moment.</Strong>{' '}
          Someone charged monthly has an ongoing, recent relationship with the line item on their
          statement. Someone charged annually is being asked to recognize a charge they last
          consciously agreed to as much as a year earlier — right as the charge is attempted, not
          before.
        </LI>
      </UL>
      <Callout title="A large charge on an unfamiliar statement line looks like fraud, not a renewal">
        A customer who does not immediately recognize a large, once-a-year charge is statistically
        more likely to dispute it, call their bank to ask about it, or simply let it decline than a
        customer looking at a small, familiar monthly line item they have seen eleven times before.
        That reaction compounds the original card-validity problem with a second, purely
        psychological one — covered in detail further down.
      </Callout>
      <P>
        None of this means annual billing is a bad idea — it usually is not, given the ARR
        predictability and lower month-to-month churn exposure it buys a subscription business. It
        means the renewal-failure problem on an annual plan needs its own specific handling rather
        than inheriting whatever retry-and-dunning setup already exists for monthly customers. For the
        general taxonomy of retries, dunning, pre-dunning, and win-back this guide builds on, see{' '}
        <A href="/blog/what-is-dunning">what is dunning</A>.
      </P>

      <H2 id="card-expiry-timing">The specific role of card-expiry timing over a 12-month gap</H2>
      <P>
        Card networks issue physical and virtual cards with a fixed expiration date, typically two to
        five years out, and banks routinely reissue cards early for reasons that have nothing to do
        with the cardholder&apos;s behavior — a data breach at an unrelated merchant, a bank&apos;s own
        risk policy, a card-network-wide reissue program, or simply a routine renewal cycle landing
        inside the billing period. None of that is unusual or alarming; it is just the normal
        lifecycle of a payment card. The only variable that matters for a subscription business is how
        much time elapses between when the card was last successfully charged and when it is charged
        again — because every month that passes is another month in which the card could have expired,
        been reissued, or been replaced without the subscription business finding out.
      </P>
      <AreaChart
        points={[2, 4, 7, 11, 16, 22, 29, 36, 43, 50, 57, 64]}
        xLabels={['Mo 1', 'Mo 2', 'Mo 3', 'Mo 4', 'Mo 5', 'Mo 6', 'Mo 7', 'Mo 8', 'Mo 9', 'Mo 10', 'Mo 11', 'Mo 12']}
        endLabel="Illustrative only"
        caption="Illustrative example only, not a benchmark — a hypothetical curve showing how the share of cards that have naturally expired, been reissued, or been replaced tends to rise the longer the gap since a card was last successfully charged. A monthly plan re-tests the card near the low end of this curve every cycle; an annual plan tests it once, near the high end."
      />
      <P>
        The shape of that curve, not the specific numbers on it, is the point: a monthly subscription
        charges the card again after roughly one month, which is early on any reasonable version of
        this curve, so card decay rarely has much chance to accumulate before it is caught. An annual
        subscription charges the card again a full year later, which is late on the same curve — by
        design, the annual model gives card decay the maximum possible time to happen before the
        business finds out about it. This is also exactly why <A href="/blog/stripe-smart-retries-explained">Stripe Smart Retries</A>{' '}
        alone is not a complete answer for annual plans specifically: Smart Retries is excellent at
        picking a better <em>day</em> to re-attempt a charge, but no amount of smarter timing fixes a
        card that has genuinely expired — an <code>expired_card</code> decline will fail on retry day
        one just as reliably as retry day fourteen.
      </P>
      <H3>Where the expiry signal already lives, and how to use it before the charge fires</H3>
      <P>
        The useful part of this problem is that the expiry date is not hidden — it is stored,
        unencrypted, right alongside every saved card on Stripe, Paddle, Braintree, Chargebee, and
        Recurly, specifically so a business can check it proactively rather than only discovering it
        failed after the fact. A <code>customer.subscription.updated</code> webhook or an equivalent
        scheduled check against stored payment-method expiry dates lets a business flag, weeks in
        advance, exactly which upcoming annual renewals are riding on a card that is going to expire
        before the charge date — turning a reactive, post-failure scramble into a proactive, solvable
        problem.
      </P>
      <InlineCTA>
        Curious how many of your own annual customers are riding on a card that is about to expire
        before their next renewal? Revova&apos;s free Lost Revenue Finder scans your real processor
        history read-only — 90 days on Starter ($29/month), 12 months on Pro ($79/month) — and
        surfaces exactly this before it becomes a failed charge.
      </InlineCTA>

      <H2 id="psychology-of-surprise">The psychological gap: a customer who forgot they are on an annual plan reacts differently</H2>
      <P>
        A customer on a monthly plan sees the same line item on their statement roughly twelve times a
        year — by the third or fourth cycle, it has become background noise, unremarkable and
        expected. A customer on an annual plan sees that line item exactly once a year, which means it
        never really becomes background noise at all. When the renewal date arrives, or when it fails
        and a recovery email lands in their inbox, a real share of annual customers are, in effect,
        encountering the charge fresh again — with a year&apos;s worth of forgotten context standing
        between them and immediately recognizing what it is for.
      </P>
      <P>
        This matters beyond simple forgetfulness. A customer confronted with an unfamiliar large
        charge attempt, or an email about one, has a few possible reactions, and not all of them lead
        back to a successful renewal even when their card is perfectly fine:
      </P>
      <UL>
        <LI>
          <Strong>They assume it is suspicious or fraudulent</Strong> and either ignore it, contact
          their bank to flag it, or actively decline to update anything — the opposite of the outcome
          you want, triggered by legitimate confusion rather than any real problem with the card.
        </LI>
        <LI>
          <Strong>They genuinely do not remember agreeing to annual billing</Strong> and interpret the
          renewal, or the failure email, as evidence the company is trying to charge them for
          something they no longer use — even if they are, in fact, still an active user of the
          product day to day.
        </LI>
        <LI>
          <Strong>They respond to a poorly worded recovery email defensively</Strong> because the copy
          reads like it assumes recent, fresh context ("did you mean to buy this?") that does not match
          how long it has actually been since they last thought about the purchase.
        </LI>
      </UL>
      <Callout title="Same failed charge, very different customer state of mind">
        A monthly customer whose card declines this cycle was, in all likelihood, actively using the
        product yesterday and will recognize the charge attempt immediately. An annual customer whose
        renewal fails may not have thought about the product, the price, or the fact that they are on
        annual billing at all, in eleven months. Identical decline code, completely different customer
        psychology — and a recovery email that does not account for that gap will underperform no
        matter how well-timed the retry logic behind it is.
      </Callout>
      <P>
        This is the piece that a purely technical fix — better retry timing, a faster webhook, a
        cleaner decline-code lookup — cannot solve on its own. It is a communication problem, and it
        needs to be solved with communication: specifically, reaching the customer <em>before</em> the
        surprise happens rather than only reacting once it already has.
      </P>

      <H2 id="pre-dunning-annual">Pre-dunning for annual renewals: warning the customer before the charge, not after</H2>
      <P>
        Pre-dunning means contacting the customer before a charge is attempted, not after it fails —
        a proactive &quot;your plan renews in N days, here is the amount, here is how to update your
        card if anything has changed&quot; notice, typically triggered off an <code>invoice.upcoming</code>{' '}
        event in Stripe Billing or the equivalent scheduled-renewal signal on Paddle, Braintree,
        Chargebee, or Recurly. For a monthly plan, pre-dunning is a nice touch that catches some
        expired cards early. For an annual plan, it is close to essential, because it is the only
        intervention in the entire recovery stack that happens <em>before</em> the surprise factor and
        the card-decay problem have a chance to collide.
      </P>
      <P>
        A well-built annual pre-dunning sequence uses three touches, tightening as the renewal date
        approaches, rather than one single reminder that is easy to miss in a busy inbox:
      </P>
      <OL>
        <LI>
          <Strong>14 days out — informational.</Strong> States plainly that the annual plan is
          renewing soon, on what date, and for how much. No urgency, just a clear heads-up that also
          serves as a gentle reminder the customer is, in fact, on annual billing.
        </LI>
        <LI>
          <Strong>7 days out — actionable.</Strong> Repeats the amount and date, and adds a direct
          link to update the card on file if anything has changed since the customer last looked at
          it — most customers who are going to act proactively will act somewhere around this touch.
        </LI>
        <LI>
          <Strong>3 days out — last chance.</Strong> The final practical opportunity to update
          payment details before the charge fires, so this touch should be the most direct of the
          three, without tipping into false urgency the actual situation does not warrant.
        </LI>
      </OL>
      <EmailExample
        tag="Annual pre-dunning — 7 days before renewal"
        subject="Your [Product] annual plan renews in 7 days — here’s what to expect"
        why="States the amount and date plainly, gives one clear action, and never implies anything has already gone wrong — this email goes out before any charge is attempted."
      >
        <p>Hi [First Name],</p>
        <p>
          Just a heads-up: your [Product] annual plan is set to renew on [Date] for [Amount], charged
          to the card ending in [Last 4].
        </p>
        <p>
          If that card is still current, there&apos;s nothing you need to do. If it&apos;s expired,
          been replaced, or you&apos;d simply like to update it, you can do that here in about a
          minute: [Update payment method].
        </p>
        <p>Thanks for being with us this past year.</p>
      </EmailExample>
      <P>
        Notice what that email deliberately does not do: it does not apologize, does not imply a
        problem exists yet, and does not pressure the customer into an immediate decision. Its entire
        job is to put the renewal back into the customer&apos;s present-moment awareness before the
        card-expiry problem and the surprise-factor problem get a chance to combine into an actual
        failed charge.
      </P>
      <InlineCTA>
        Revova&apos;s AI-written sequences can be configured to fire ahead of an annual renewal, not
        just after a failure — starting at $29/month on Starter with a 14-day free trial, no credit
        card required.
      </InlineCTA>

      <H2 id="annual-vs-monthly">Annual versus monthly renewal failures, side by side</H2>
      <P>
        Laid out next to each other, the differences between an annual and a monthly renewal failure
        are not really about the mechanics of the decline itself — the same decline codes,
        <code>insufficient_funds</code>, <code>expired_card</code>, <code>do_not_honor</code>, and{' '}
        <code>card_declined</code>, show up on both. What differs is everything around the decline:
        the stakes, the customer&apos;s context, and what the right response looks like.
      </P>
      <CompareTable
        rows={[
          ['Dimension', 'Monthly renewal failure', 'Annual renewal failure'],
          ['Revenue at risk per failure', 'One month of revenue', 'A full year of revenue in one declined charge'],
          ['Time since card last charged', 'About 1 month', 'About 11–12 months'],
          ['Odds the card has naturally expired or been replaced', 'Comparatively low — recently re-tested', 'Comparatively high — untested for a full year'],
          ['Customer’s present-moment awareness', 'High — sees the line item monthly', 'Low — last saw it up to a year ago'],
          ['Risk of the charge attempt reading as suspicious', 'Low — a familiar, small, expected amount', 'Higher — an unfamiliar, larger, once-a-year amount'],
          ['Ideal recovery-email tone', 'Direct, assumes recent context', 'Softer, explicitly acknowledges time has passed'],
          ['Value of pre-dunning', 'Helpful', 'Close to essential'],
          ['Reasonable fallback if recovery fails', 'Retry, pause access, or cancel', 'Consider a monthly-billing fallback offer alongside the standard options'],
        ]}
      />
      <P>
        The pattern across nearly every row is the same: annual renewal failures are not a bigger
        version of monthly ones, they are a different shape of the same underlying problem, with
        higher stakes and less customer context at exactly the moment it matters most. A recovery
        setup built only around the monthly mental model — a fast retry, a slightly urgent Day-1
        email, a short window before giving up — will structurally underperform on annual accounts
        even if every individual component is well built.
      </P>

      <H2 id="handling-the-failure">If pre-dunning didn&apos;t catch it: handling the failure itself</H2>
      <P>
        Even a well-built pre-dunning sequence will not catch every case — some customers ignore all
        three reminder emails, some update the wrong card, some have a card that was fine two weeks
        ago and failed for an unrelated reason (a balance issue, a bank-side block) right at the
        renewal moment. When an annual renewal does fail despite pre-dunning, the recovery email
        needs a noticeably different register than a standard monthly dunning message.
      </P>
      <UL>
        <LI>
          <Strong>Name what happened plainly and acknowledge the time gap.</Strong> &quot;Your annual
          [Product] plan was due to renew and the charge didn&apos;t go through&quot; reads as
          informative. A monthly-style &quot;did you mean to buy this?&quot; tone reads as slightly
          alarmed against a charge the customer may not have consciously anticipated at all.
        </LI>
        <LI>
          <Strong>State the amount clearly, every time.</Strong> Do not make the customer click
          through to discover what they are being asked to pay again — at this dollar size,
          transparency reduces the odds of the message being mistaken for a phishing attempt.
        </LI>
        <LI>
          <Strong>Offer a direct card-update link as the primary action.</Strong> This should still be
          the first ask, ahead of any fallback option — most failures genuinely are a simple expired
          or replaced card, not a sign the customer no longer wants the product.
        </LI>
        <LI>
          <Strong>Consider surfacing a monthly-billing or prorated fallback as a secondary option</Strong>,
          particularly past the first one or two recovery attempts, for the segment of customers whose
          hesitation may be genuinely about the size of the annual charge rather than a card problem at
          all.
        </LI>
        <LI>
          <Strong>Extend the recovery window slightly longer than a monthly sequence would.</Strong>{' '}
          Because the customer has less present-moment context, a slightly longer, more patient
          sequence — closer to Revova&apos;s Day 1/3/7/14/21 pattern than a compressed monthly-style
          cadence — gives more chances for the message to land at a moment the customer actually
          notices it.
        </LI>
      </UL>
      <Callout title="A prorated or partial-charge option is worth considering for larger annual accounts">
        For higher-priced annual plans, some businesses offer a customer whose full annual charge
        declined the option to pay a prorated first installment and move to monthly or quarterly
        billing going forward, rather than an all-or-nothing retry of the original full amount. This is
        a business-model decision each team has to make for itself — it is not something Revova
        prescribes — but it is worth having a deliberate answer ready before a large annual failure
        actually happens, rather than deciding ad hoc, customer by customer, under time pressure.
      </Callout>

      <H2 id="monthly-fallback">Should you offer a monthly-billing fallback? The trade-offs</H2>
      <P>
        Offering to switch a customer whose annual renewal failed onto monthly billing instead is a
        genuinely useful recovery lever, and also a genuine trade-off — it is not a free win in either
        direction, and the right call depends on the customer segment and how much the annual discount
        matters to your unit economics.
      </P>
      <ProsCons
        pros={[
          'Removes the large-single-transaction friction that may have caused the decline in the first place — a smaller monthly charge is less likely to hit a balance limit or a bank velocity check',
          'Keeps a customer who might otherwise churn entirely rather than losing them outright over one failed charge',
          'Lower psychological barrier for a customer who forgot they were on annual billing and is hesitant to commit to another full year immediately',
          'Buys time to re-earn the annual commitment later, once the relationship and trust are freshly re-established',
        ]}
        cons={[
          'Gives up the annual prepayment cash-flow advantage and typically the per-unit discount economics that made annual billing attractive to offer in the first place',
          'Trades one annual failure point for twelve future monthly failure points on the same account, going forward',
          'Can train customers that a failed annual renewal is a negotiation opportunity rather than something to simply fix by updating a card',
          'Adds a billing-frequency exception to track and manage on an account that was otherwise a clean annual customer',
        ]}
      />
      <P>
        A reasonable middle ground is to lead every recovery email with the direct ask — update the
        card, retry the same annual amount — and hold the monthly-fallback offer in reserve for later
        touches in the sequence, or for customer-support conversations, rather than presenting it as
        the first and easiest option. That way the fallback exists for the segment of customers who
        genuinely need it, without becoming the default path for someone who simply needed a
        two-minute card update.
      </P>
      <InlineCTA>
        See what a monthly-fallback offer would actually be worth against your own annual-plan
        failure volume — start a 14-day free trial on Revova Pro ($79/month), no credit card required,
        and let the Lost Revenue Finder show the real numbers first.
      </InlineCTA>

      <H2 id="how-revova-helps">How Revova is built around this exact case</H2>
      <P>
        Revova was not built assuming every subscription bills monthly, which is a mistake we see
        baked into a lot of generic dunning advice and even some competing tools. Three specific
        pieces of the product map directly onto the annual-renewal problem described in this guide.
      </P>
      <UL>
        <LI>
          <Strong>Pre-dunning ahead of the renewal date, not just after a failure.</Strong> Revova
          watches for approaching annual (and monthly) renewals via the same underlying signals as{' '}
          <code>invoice.upcoming</code>, and can reach the customer before the charge is attempted —
          exactly the intervention this guide argues matters most for annual plans specifically.
        </LI>
        <LI>
          <Strong>Proactive card-expiry detection.</Strong> Rather than waiting for a charge to fail
          before discovering a card has expired, Revova checks stored expiry metadata against upcoming
          renewal dates across Stripe, Paddle, Braintree, Chargebee, and Recurly, surfacing exactly
          which annual customers are riding on a card that will not survive to their next charge date.
        </LI>
        <LI>
          <Strong>An AI email sequence that adapts tone, not just timing.</Strong> On Pro ($79/month),
          hard-decline and soft-decline charges are routed to different copy automatically — a
          distinction that matters even more on an annual renewal, where an <code>expired_card</code>{' '}
          hard decline needs a direct, clear ask for new details, while a temporary{' '}
          <code>insufficient_funds</code> soft decline against a large annual amount can afford a more
          patient, less urgent nudge.
        </LI>
      </UL>
      <P>
        Pro also writes the sequence in <Strong>8 languages</Strong> based on the customer&apos;s
        locale — worth calling out specifically here, because an annual customer confused about an
        unfamiliar, once-a-year charge is even less likely to act on an email they have to
        mentally translate first. Removing that friction matters more, not less, on the exact
        higher-stakes, lower-context renewals this guide is about. <Strong>Starter</Strong>{' '}
        ($29/month) runs a 4-email AI sequence on Days 1, 3, 7, and 14 and its free Lost Revenue
        Finder scans your last 90 days of processor history; <Strong>Pro</Strong> extends the
        post-failure sequence through Day 21, adds the hard/soft decline routing and SMS recovery
        described above, an in-app cancel-flow with retention offers, win-back campaigns on Day 3,
        14, and 30 after cancellation, a full 12-month historical scan, a weekly digest, and priority
        support. Both plans include a 14-day free trial with no credit card required and a 30-day
        money-back guarantee.
      </P>
      <P>
        None of this replaces Stripe Smart Retries or the retry logic built into Paddle, Braintree,
        Chargebee, and Recurly — that layer keeps doing what it is good at, picking a better day to
        re-attempt a charge, for annual and monthly renewals alike. Revova sits alongside it,
        covering the two things pure retry timing cannot: reaching the customer before the surprise,
        and, if a failure happens anyway, explaining it in a tone that accounts for how long it has
        actually been. For the fuller breakdown of what Smart Retries does and does not cover, see{' '}
        <A href="/blog/stripe-smart-retries-explained">our guide to Stripe Smart Retries explained</A>,
        and for the mechanics of setting up a complete dunning sequence from scratch, see{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">our dunning email sequence setup guide</A>.
        If your business has been running annual billing for a while without a dedicated recovery
        layer, it is also worth checking{' '}
        <A href="/blog/historical-payment-recovery-guide">our historical payment recovery guide</A>{' '}
        for how much backlog may already be sitting unrecovered, and{' '}
        <A href="/blog/how-much-revenue-lost-to-failed-payments">
          how much revenue you&apos;re losing to failed payments
        </A>{' '}
        for the broader picture across both annual and monthly accounts.
      </P>
      <InlineCTA>
        Connect Stripe, Paddle, Braintree, Chargebee, or Recurly read-only — Revova never touches
        card data — and see which of your annual customers are riding on a card that won&apos;t
        survive to their next renewal. Starter is $29/month, Pro is $79/month, both with a 14-day
        free trial and no credit card required.
      </InlineCTA>

      <Divider />

      <P>
        For Stripe&apos;s own documentation on how subscription billing cycles and renewal dates are
        calculated, see{' '}
        <A href="https://stripe.com/docs/billing/subscriptions/billing-cycle">
          Stripe&apos;s billing cycle documentation
        </A>
        , for the reference on the upcoming-invoice preview that pre-dunning sequences are commonly
        built around, see{' '}
        <A href="https://stripe.com/docs/api/invoices/upcoming">
          Stripe&apos;s upcoming invoice API documentation
        </A>
        , and for how Stripe recommends saving and re-verifying a card for future off-session
        charges — directly relevant to catching an expired card before an annual renewal fires — see{' '}
        <A href="https://stripe.com/docs/payments/save-and-reuse">
          Stripe&apos;s documentation on saving and reusing payment methods
        </A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Your annual renewals deserve their own recovery strategy, not a monthly one stretched thin."
        body="Revova runs pre-dunning ahead of a renewal, checks stored card-expiry dates proactively, and routes hard versus soft declines to different AI-written copy in 8 languages — across Stripe, Paddle, Braintree, Chargebee, and Recurly. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
