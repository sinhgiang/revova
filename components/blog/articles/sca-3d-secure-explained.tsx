import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, CodeCard, EmailExample, PriorityMatrix, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What exactly does Strong Customer Authentication (SCA) require?',
    a: 'SCA is a requirement under the EU’s PSD2 regulation that an electronic payment be verified using at least two independent factors, drawn from three categories: something the customer knows (a PIN or password), something they have (a phone or hardware token), and something they are (a fingerprint or face scan). A payment authenticated with only a card number and CVC — no second factor — does not meet the bar. SCA applies to payment service providers operating in the European Economic Area (EEA); it is not a global rule, though a handful of non-EEA regimes have adopted broadly similar two-factor requirements of their own.',
  },
  {
    q: 'Is 3D Secure the same thing as SCA?',
    a: 'No — they are related but distinct. SCA is the regulatory requirement (the “what”); 3D Secure, and specifically its newer version 3DS2, is the technical protocol card networks and issuers use to actually carry out that authentication at the moment of a charge (the “how”). 3D Secure existed before PSD2 as an optional, often clunky fraud tool (the original Verified by Visa / Mastercard SecureCode flow); PSD2 is what made a compliant version of it — 3DS2 — effectively mandatory across most EEA card transactions.',
  },
  {
    q: 'Why do subscription renewals fail because of SCA when the customer already authenticated once at signup?',
    a: 'Most recurring charges qualify for a merchant-initiated transaction (MIT) exemption once the very first, customer-present charge completed SCA — that initial authenticated transaction is what lets subsequent, unattended renewals skip a repeat challenge. The exemption is not unconditional, though: a changed amount, a new card on file, an issuer’s own risk scoring, or simply an issuer that interprets the rules conservatively can all trigger a fresh authentication requirement on a charge where no customer is present to complete it — which is the exact failure mode this article is about.',
  },
  {
    q: 'What does the authentication_required decline code mean, and can I just retry the charge?',
    a: 'It means the issuer is refusing to complete the charge until the customer completes a 3D Secure / 3DS2 challenge — the card and account are otherwise fine. Retrying the identical charge again, even on a smarter day the way Stripe Smart Retries would for a normal soft decline, does not satisfy an authentication step nobody completed; it will simply fail the same way again. The only fix is routing the customer to a fresh authentication link tied to that specific charge.',
  },
  {
    q: 'Are there exemptions that let a recurring charge skip SCA every single time?',
    a: 'There are several categories of exemption — the recurring/MIT exemption already mentioned, a low-value exemption for sufficiently small transactions (paired with a cumulative cap so a run of tiny charges cannot be used to dodge authentication indefinitely), a transaction-risk-analysis exemption that issuers and acquirers with a strong enough fraud track record can apply to larger transactions, and trusted-beneficiary whitelisting, where a cardholder explicitly tells their own bank to trust a specific merchant going forward. None of these is a guarantee, though — exemptions are ultimately applied at the issuer’s discretion based on their own risk assessment, so the same recurring charge that sailed through last month can still occasionally get challenged again.',
  },
  {
    q: 'Does SCA / 3D Secure affect US or other non-EEA customers?',
    a: 'Generally, no. PSD2 and its SCA requirement govern payment service providers operating in the European Economic Area, so a US-issued card charged by a US or European merchant is typically outside its scope. The practical exception is a European customer paying a merchant anywhere in the world with an EEA-issued card — the issuing bank’s home regulation is usually what matters, not the merchant’s location. The UK runs its own broadly similar strong-authentication regime post-Brexit, enforced separately from EU PSD2 but built on the same underlying idea.',
  },
  {
    q: 'What is the difference between a frictionless flow and a challenge flow in 3DS2?',
    a: 'In a frictionless flow, the issuer’s Access Control Server evaluates the transaction using richer background data — device fingerprint, past purchase history, whether the transaction qualifies for an exemption — and approves it silently, with no customer interaction at all. In a challenge flow, the issuer decides the risk is high enough (or no exemption applies) that the customer must actively prove one of the two factors themselves, typically via a one-time code, a push notification in their banking app, or a biometric prompt. 3DS2’s richer data exchange is specifically what lets far more transactions qualify for the frictionless path than the older 3DS1 protocol ever could.',
  },
  {
    q: 'How should a dunning sequence handle an SCA-related decline differently from a normal card decline?',
    a: 'It needs its own branch entirely, not a variant of the generic “your card failed, please update it” template. A customer whose card is fine but whose renewal hit authentication_required does not need to enter a new card number — they need a direct, secure link that takes them straight into a fresh 3D Secure challenge for that specific charge. Sending them the same copy you’d send for an expired_card decline creates confusion (they update nothing, because there is nothing wrong with the card) and typically suppresses recovery on exactly the decline reason that should be among the easiest to fix.',
  },
  {
    q: 'Does Revova detect authentication_required and route it automatically?',
    a: 'Yes — on the Pro plan, Revova’s hard/soft decline smart routing reads the decline reason the moment a charge fails and treats an SCA-related decline as its own category, distinct from a hard decline (bad card) or a soft decline (temporary funds issue), sending the customer straight to a re-authentication step instead of a generic card-update request. Starter’s sequence still recovers many of these cases with its standard cadence, but Pro’s decline-aware routing is built specifically to handle this branch correctly.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Strong Customer Authentication (SCA) is the European Union’s PSD2 rule requiring that an
        electronic payment be verified with two independent factors — something the customer knows, has,
        and is — rather than a card number and CVC alone, and 3D Secure (specifically its current version,
        3DS2) is the technical protocol banks and card networks actually use to run that verification at
        checkout. For a one-time purchase, this mostly shows up as a brief redirect to a bank app or a
        one-time code. For a subscription business, it is a much bigger problem: a renewal charge fires
        automatically, with nobody sitting at a keyboard to complete a challenge, and if the issuer decides
        this particular attempt needs fresh authentication, the charge simply fails with a decline code most
        subscription platforms are not built to handle — <code>authentication_required</code>. This is not
        a card problem, a funds problem, or a fraud problem; it is an authentication problem, and treating it
        like an ordinary decline is exactly why so many otherwise-healthy European subscriptions quietly
        lapse. This guide covers what PSD2 and SCA actually require, how 3D Secure implements that
        requirement technically, why recurring billing breaks the model in a way one-time checkout does not,
        what exemptions exist and how far they really reach, and what a subscription business should
        actually build — in its decline handling and its dunning sequence — to stop losing these customers.
      </Lead>
      <P>
        We build recovery software that reads decline codes across five processors for a living, and{' '}
        <code>authentication_required</code> is one of the most consistently mishandled codes we see, because
        it looks, from a distance, like just another failed charge. It is not. Everything about how you
        retry it, email about it, and route the customer is different from a normal hard or soft decline, and
        most off-the-shelf dunning setups were never built with a fourth category in mind — they assume
        every failure is either “bad card” or “no funds.” For a subscription business with any
        meaningful share of European customers, that blind spot has a real, if hard-to-quantify, cost.
      </P>

      <KeyTakeaways
        items={[
          <>SCA is a <Strong>PSD2 regulatory requirement</Strong> (two independent authentication factors); 3D Secure / 3DS2 is the <Strong>technical protocol</Strong> that implements it at the moment of a charge.</>,
          <>Recurring billing breaks the normal SCA model because a renewal fires with <Strong>no customer present</Strong> to complete a challenge — a fundamentally different situation from a one-time checkout.</>,
          <>Several exemptions exist — the recurring/merchant-initiated-transaction (MIT) exemption, a low-value exemption, transaction-risk-analysis, and trusted-beneficiary whitelisting — but none of them is a guarantee on every renewal.</>,
          <>A charge declined <code>authentication_required</code> cannot be fixed by retrying it, however well-timed — it needs the customer routed to a fresh 3D Secure challenge for that specific charge.</>,
          <>This decline reason needs its <Strong>own branch</Strong> in your dunning sequence, separate from a generic “your card failed” email, or recovery on an otherwise-easy-to-fix case quietly collapses.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription charges commonly fail or get declined in a typical billing cycle (industry estimate)' },
          { value: '2 of 3', label: 'independent authentication factors SCA requires: something you know, have, and are' },
          { value: '20–40%', label: 'of total SaaS churn commonly attributed to involuntary churn — unpaid, failed charges (industry estimate)' },
        ]}
      />

      <H2 id="what-is-sca">What Strong Customer Authentication (SCA) actually requires under PSD2</H2>
      <P>
        SCA requires that an electronic payment be authenticated using at least two independent factors
        drawn from three distinct categories, rather than relying on a single piece of card data. The three
        categories are: <Strong>knowledge</Strong> (something only the customer knows, like a PIN or banking
        password), <Strong>possession</Strong> (something only the customer has, like their phone receiving a
        push notification or a hardware token), and <Strong>inherence</Strong> (something the customer
        physically is, like a fingerprint or face scan on their device). A card number plus a CVC — the
        classic “card-not-present” checkout — is one factor at best (arguably not even a real
        “factor” in the SCA sense at all); it does not, on its own, satisfy the requirement.
      </P>
      <P>
        This requirement comes from the EU’s revised Payment Services Directive, commonly called{' '}
        <Strong>PSD2</Strong>, with the specific technical detail of what counts as compliant authentication
        set out in regulatory technical standards written by the European Banking Authority (EBA). PSD2
        governs payment service providers — banks, card issuers, acquirers — operating within the
        European Economic Area (EEA), which is the reason SCA is fundamentally a European rule rather than a
        global card-network standard. It rolled out across the EEA in stages over several years, with
        national regulators granting phased extensions to different sectors as issuers, acquirers, and
        merchants worked through the technical rollout, rather than flipping on for every transaction on a
        single fixed date.
      </P>
      <Callout title="Why this exists in the first place">
        SCA was written to reduce card-not-present fraud — the category of fraud that grew fastest as
        e-commerce and subscription billing scaled, precisely because a stolen card number and a guessed CVC
        were often enough to complete a purchase with nothing else required. Requiring a second, independent
        factor closes that gap for the vast majority of stolen-card fraud attempts, at the cost of adding a
        step to checkout that a purely card-based flow never had.
      </Callout>
      <P>
        It is worth being precise that SCA is a requirement on <em>payments</em>, not narrowly on{' '}
        <em>cards</em> — it applies to bank transfers, some wallet payments, and other electronic payment
        instruments within its scope too. For a subscription business, though, card payments are almost
        always where this shows up, because recurring billing is overwhelmingly card-based across Stripe,
        Paddle, Braintree, Chargebee, and Recurly alike.
      </P>

      <H2 id="what-is-3ds">What 3D Secure (3DS2) is, and how it implements SCA at checkout</H2>
      <P>
        3D Secure is the technical protocol card networks and issuers actually use to carry out
        authentication at the moment of a charge — it is the mechanism, where SCA is the requirement.
        The current version, <Strong>3DS2</Strong>, is what most EEA-issuing banks now run to satisfy PSD2;
        an earlier version, 3DS1 (the flow most people picture as an ugly pop-up window asking for a static
        password under names like Verified by Visa or Mastercard SecureCode), predates PSD2 and was
        optional, clunky, and widely disliked by merchants and customers alike. 3DS2 was built specifically
        to be less disruptive, exchanging far more background data between merchant, issuer, and card
        network so that a much larger share of transactions can be approved without ever bothering the
        customer at all.
      </P>
      <H3>The 3DS2 flow, step by step</H3>
      <OL>
        <LI>
          The customer submits card details at checkout, or a subscription renewal charge is initiated
          automatically on its billing date.
        </LI>
        <LI>
          The merchant’s payment processor sends an authentication request through the card network to
          the card’s issuing bank, carrying whatever transaction and device data 3DS2 supports (amount,
          merchant identity, device fingerprint, and — critically for recurring billing — whether this
          transaction claims a recurring or low-value exemption).
        </LI>
        <LI>
          The issuer’s <Strong>Access Control Server (ACS)</Strong> evaluates that data against its own
          risk model and decides between two paths: a frictionless approval or a challenge.
        </LI>
        <LI>
          <Strong>Frictionless path:</Strong> the issuer approves the authentication silently in the
          background, using the risk data already exchanged — the customer sees nothing, and the charge
          proceeds straight to authorization.
        </LI>
        <LI>
          <Strong>Challenge path:</Strong> the issuer decides the transaction needs active proof from the
          customer — a one-time code, a push notification approved inside the banking app, or a biometric
          prompt — which is the flow most people actually picture when they hear “3D Secure.”
        </LI>
        <LI>
          The issuer returns an authentication result to the merchant’s processor, and — if
          successful — the underlying charge proceeds to normal authorization and settlement.
        </LI>
        <LI>
          If the customer fails the challenge, never completes it, or (the case this article is about) is
          not present at all because the charge was an unattended subscription renewal, the charge is
          declined instead of completing — typically surfaced to the merchant as{' '}
          <code>authentication_required</code>.
        </LI>
      </OL>
      <ProsCons
        pros={[
          '3DS2’s richer data exchange lets far more transactions qualify for the frictionless path than 3DS1 ever could, meaningfully cutting how often real customers see a challenge at all',
          'Mobile-native challenge screens (push notification, biometric) replace 3DS1’s clunky static-password pop-up, reducing false declines from customers who simply gave up mid-checkout',
          'A successfully authenticated payment typically shifts fraud liability toward the issuer, which is a meaningful protection for merchants that was much weaker under card-only checkout',
          'The recurring/MIT exemption means most subscription renewals never trigger a challenge in the first place, once the initial charge was properly authenticated',
        ]}
        cons={[
          'A subscription renewal that does trigger authentication_required has no customer present to complete the challenge — the exact failure mode this article covers',
          'Exemptions are applied at issuer discretion based on their own risk models, so the same recurring charge is not permanently guaranteed to stay frictionless',
          'Integrating 3DS2 correctly across a full processor and acquirer chain is a real technical lift, and older or misconfigured integrations sometimes fall back to a worse, less exemption-aware flow',
          'A generic, non-decline-aware dunning email sent after an authentication-required failure asks the customer to do the wrong thing (update a card that is not broken) instead of the right one (re-authenticate)',
        ]}
      />

      <InlineCTA>
        Curious whether authentication_required declines are quietly leaking European revenue on your own
        account? Revova’s free Lost Revenue Finder scans your real payment history — Starter goes back 90
        days, Pro a full 12 months — and shows the actual number by decline reason before you commit to
        anything.
      </InlineCTA>

      <H2 id="why-recurring-different">Why recurring billing breaks the SCA model in a way one-time checkout does not</H2>
      <P>
        A one-time checkout and a subscription renewal look identical to most billing systems — both are
        “a charge against a saved card” — but they are fundamentally different from an
        authentication standpoint, and that difference is the entire reason this problem exists. At checkout,
        a customer is present, on a device, able to tap a push notification or enter a one-time code the
        instant the issuer asks for one. On a subscription renewal, the charge fires on a schedule, in the
        background, with nobody watching a screen — which is precisely the scenario 3DS2’s challenge flow
        was never designed to interrupt gracefully.
      </P>
      <P>
        PSD2 anticipated this problem directly, which is why the merchant-initiated transaction (MIT)
        exemption exists at all: if the very first charge on a card — the one placed with the customer
        actively present at signup — completed SCA successfully, subsequent unattended renewals of the
        same fixed (or materially unchanged) amount can typically skip authentication going forward. This is
        the mechanism that keeps the overwhelming majority of subscription renewals working invisibly, month
        after month, without a repeat challenge. The exemption is not absolute, though, and several
        realistic situations can knock a renewal back into requiring a fresh challenge it has no way to
        complete on its own:
      </P>
      <UL>
        <LI>
          <Strong>A changed amount.</Strong> A mid-cycle upgrade, a prorated charge, or a price increase can
          be treated by an issuer as different enough from the originally authenticated transaction to fall
          outside the MIT exemption.
        </LI>
        <LI>
          <Strong>A new card on file.</Strong> If the customer updated their card — even to a reissued
          card with the same number after a bank’s security event — the chain of “this specific card
          already completed SCA once” can break, depending on how the issuer and processor track it.
        </LI>
        <LI>
          <Strong>Issuer-side risk scoring.</Strong> Some issuers periodically re-challenge even a
          long-running recurring relationship if their own fraud model flags something unusual — a new
          device fingerprint associated with the account, an unusual time of month, or simply a conservative
          bank that re-authenticates more often than its exemption eligibility strictly requires.
        </LI>
        <LI>
          <Strong>Conservative or inconsistent implementation.</Strong> Not every issuer across every EEA
          country implements the recurring exemption identically — some apply it liberally, some narrowly,
          and the practical result is that a subscription business with customers across many European banks
          sees a genuinely mixed pattern rather than one uniform rule.
        </LI>
      </UL>
      <P>
        The net effect is that a subscription business processing European renewals should expect{' '}
        <code>authentication_required</code> to show up as a recurring category of decline — not a rare
        edge case, and not something that will go away by simply retrying the charge again on a different
        day the way a <code>insufficient_funds</code> decline might. For the full picture of how this decline
        code sits alongside other Stripe decline reasons, see{' '}
        <A href="/blog/stripe-decline-codes-explained">our guide to Stripe decline codes explained</A>.
      </P>

      <H2 id="exemptions">SCA exemptions, and where each one actually applies</H2>
      <P>
        PSD2’s regulatory technical standards carve out several categories where SCA can be waived, and
        understanding the shape of each one — rather than the exact thresholds, which are set at the
        regulatory level and applied at issuer discretion — is what actually helps you reason about why a
        given renewal did or did not require a fresh challenge.
      </P>
      <CompareTable
        rows={[
          ['Scenario', 'SCA typically required?', 'Why'],
          ['First charge on a new card at checkout', 'Yes', 'Customer is present; no prior authenticated relationship exists yet between this card and this merchant'],
          ['Recurring renewal, same amount, same schedule', 'Usually exempt', 'The merchant-initiated transaction (MIT) exemption applies once the initial customer-present charge completed SCA'],
          ['Renewal with a changed amount (upgrade, proration, price rise)', 'Often required again', 'A materially different transaction can fall outside the original MIT exemption, depending on issuer interpretation'],
          ['Small, low-value one-off charge', 'May be exempt', 'A low-value exemption exists for sufficiently small transactions, paired with a cumulative cap so a run of tiny charges cannot be split to dodge authentication indefinitely'],
          ['Larger transaction from a low-fraud issuer/acquirer pair', 'May be exempt', 'A transaction-risk-analysis (TRA) exemption lets issuers and acquirers with a strong enough fraud track record waive a challenge even on bigger amounts'],
          ['Card added to a trusted-beneficiary / merchant whitelist', 'May be exempt going forward', 'The cardholder explicitly tells their own bank to trust a specific merchant for future charges'],
          ['Non-EEA issued card, or non-EEA issuing bank', 'Generally not applicable', 'PSD2 governs payment service providers in the EEA; a US- or Asia-issued card typically sits outside its scope regardless of merchant location'],
        ]}
      />
      <P>
        None of these exemptions is a switch a subscription business can simply flip on and forget. Each one
        is ultimately applied — or overridden — by the customer’s own issuing bank, based on that
        bank’s own risk assessment at the moment of the charge. What a merchant and processor can control
        is largely limited to <em>signaling</em> the right exemption category correctly (marking a renewal as
        a recurring MIT, for instance) and then handling gracefully the cases where the issuer challenges it
        anyway. Trying to design a billing system around “this will never require authentication” is
        the wrong mental model — the right one is “this will occasionally require authentication, and my
        dunning sequence needs to handle that gracefully when it does.”
      </P>

      <H2 id="decline-code">What happens when a renewal gets declined authentication_required</H2>
      <P>
        When an issuer decides a renewal charge needs fresh authentication and no customer is present to
        provide it, the charge fails and the processor surfaces a decline reason that specifically means
        “authentication needed, not a bad card and not insufficient funds.” On Stripe, this shows up as{' '}
        <code>authentication_required</code>; other processors use their own equivalent language, but the
        underlying situation is the same across Paddle, Braintree, Chargebee, and Recurly alike — the
        charge is technically valid, the card is fine, and the only thing standing between the customer and
        a successful payment is completing a 3D Secure challenge that literally could not happen at the
        moment the renewal fired.
      </P>
      <CodeCard
        code="authentication_required"
        type="auth"
        meaning="The issuer is requiring Strong Customer Authentication (SCA) under PSD2 — typically a 3D Secure / 3DS2 challenge — before this specific charge can complete. The card itself is not declined for being invalid, expired, or out of funds."
        action="Do not simply retry the identical charge — it will fail the same way again, since retrying does not satisfy an authentication step the customer never completed. Route the customer to a fresh, charge-specific 3D Secure re-authentication link instead."
      />
      <P>
        This is the single most important operational fact about this decline code: a normal retry —
        even a well-timed one like Stripe Smart Retries would schedule for a soft decline such as{' '}
        <code>insufficient_funds</code> — does nothing here. Smart Retries genuinely helps recover a
        meaningful share of ordinary failed charges by picking a statistically better day to try again; it
        has no mechanism to make a customer complete an authentication step they were never asked to complete
        in the first place. For the deeper mechanics of what Smart Retries does and does not cover, see{' '}
        <A href="/blog/stripe-smart-retries-explained">our guide to Stripe Smart Retries</A>.
      </P>
      <Callout title="What most billing systems get wrong here">
        Many subscription billing setups treat every decline the same way: schedule a retry, then fall back
        to a generic “your payment failed” email if retries run out. That workflow is a reasonable
        default for a hard or soft decline. Applied to <code>authentication_required</code>, it wastes the
        retry budget on attempts that were never going to succeed, and then sends the customer a message that
        asks them to do the wrong thing — update a card that was never the problem — instead of
        completing the one action that would actually fix it.
      </Callout>
      <P>
        In practice, the correct handling looks like this: on the very first{' '}
        <code>authentication_required</code> decline, skip straight to generating a secure, charge-specific
        link that walks the customer through a fresh 3D Secure challenge for that exact renewal —
        typically by creating a new payment attempt against the same subscription and having the customer
        complete authentication for it directly, rather than looping through the same automatic retry logic
        built for hard and soft declines.
      </P>

      <H2 id="eu-decline-context">Why SCA meaningfully changes the decline mix for European subscription bases</H2>
      <P>
        For a subscription business with customers spread across the EEA, this decline reason is not a
        rounding error — it is a structural part of the decline mix that simply does not exist for a
        purely US or non-EEA customer base. A business selling only to US customers will never see{' '}
        <code>authentication_required</code> at any meaningful volume, because PSD2 does not reach US-issued
        cards; the same product, sold with a meaningful share of EEA customers, will see it show up
        consistently, month after month, as one of the recurring reasons renewals fail alongside the usual{' '}
        <code>insufficient_funds</code>, <code>expired_card</code>, and <code>do_not_honor</code> categories.
      </P>
      <P>
        We are deliberately not putting a precise percentage on how much higher EU decline rates run because
        of SCA — the honest answer is that it varies widely by issuer mix, transaction size, how well a
        given processor signals the recurring exemption, and how conservatively individual European banks
        apply their own risk scoring. What is safe to say, and useful operationally, is the qualitative
        shape of it: a subscription business billing across many different European banks should expect a
        meaningfully higher share of its EU renewal declines to be authentication-related than its US
        renewal declines, and that share is essentially unrelated to how healthy the underlying card or
        customer relationship actually is.
      </P>
      <InlineCTA>
        Revova’s Pro plan ($79/month) reads decline reasons across Stripe, Paddle, Braintree, Chargebee,
        and Recurly and routes <code>authentication_required</code> to its own re-authentication branch —
        separate from hard and soft decline handling — in 8 languages, with a 14-day free trial and no
        credit card required.
      </InlineCTA>

      <H2 id="dunning-branch">Why this decline needs its own dunning branch, not a generic "your card failed" email</H2>
      <P>
        The single biggest mistake we see subscription businesses make with this decline reason is folding
        it into the same email template used for every other failure. An SCA-related decline is not a card
        problem, and telling the customer to “update your payment method” when their card is
        perfectly valid creates real confusion — they log in, see a valid card already on file, have
        nothing to update, and give up. Worse, if they do re-enter the same card number out of confusion, the
        renewal often just fails the exact same way again, since re-entering identical card details does
        nothing to satisfy the authentication step the issuer is actually waiting on.
      </P>
      <EmailExample
        tag="Generic template — the wrong approach"
        subject="Your payment failed"
        why="This copy assumes every failure is a bad-card problem. A customer whose renewal hit authentication_required has nothing to update, gets confused, and often does nothing at all — or re-enters the same working card, which does not fix anything."
      >
        <p>Hi [First Name],</p>
        <p>
          We were unable to process your payment for [Product]. Please update your card details to avoid
          any interruption to your service.
        </p>
        <p>[Update payment method]</p>
      </EmailExample>
      <EmailExample
        tag="SCA-aware branch — the correct approach"
        subject="One quick step to confirm your last payment"
        why="This copy correctly frames the issue as a bank security step rather than a card problem, sets the expectation of using their banking app or a text code, and links straight into a fresh, charge-specific authentication flow rather than a generic account page."
      >
        <p>Hi [First Name],</p>
        <p>
          Your bank asked us to confirm your last payment for [Product] with an extra security step —
          this is standard under European payment rules and only takes a few seconds.
        </p>
        <p>
          Tap below and follow the prompt in your banking app (or enter the code your bank texts you):
          [Confirm this payment].
        </p>
        <p>Your card is fine — no need to enter a new one.</p>
      </EmailExample>
      <P>
        Notice the second version explicitly reassures the customer their card is fine, sets the correct
        expectation (a bank app prompt or a texted code, not a card form), and links into a charge-specific
        re-authentication step rather than a generic “update your billing” page. That combination —
        correct framing plus the correct link — is what actually recovers this decline reason; a
        technically accurate email that still points to the wrong page converts barely better than a fully
        generic one. For the fuller mechanics of building a decline-aware sequence like this across every
        category, not just this one, see{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">our dunning email sequence setup guide</A> and{' '}
        <A href="/blog/what-is-dunning">what is dunning</A>.
      </P>

      <H2 id="practical-guidance">Practical guidance: what a subscription business should actually build</H2>
      <P>
        Handling <code>authentication_required</code> well is less about a single big engineering project
        and more about a handful of specific, prioritized changes to how declines get routed and
        communicated. Some of these are quick wins; a couple are genuinely bigger undertakings.
      </P>
      <PriorityMatrix
        items={[
          { label: 'Route authentication_required to its own dunning branch', effort: 18, impact: 88 },
          { label: 'Signal the recurring/MIT exemption correctly on renewal charges', effort: 30, impact: 82 },
          { label: 'Build a charge-specific re-authentication link, not a generic account page', effort: 42, impact: 90 },
          { label: 'Whitelist high-value repeat customers as trusted beneficiaries', effort: 55, impact: 40, left: true },
          { label: 'Rebuild full checkout to pass richer 3DS2 risk data upstream', effort: 78, impact: 62 },
          { label: 'Keep treating every decline with one generic template', effort: 5, impact: 8, left: true },
        ]}
        caption="Illustrative prioritization only — relative effort and impact for a subscription business handling SCA-related declines; not measured data."
      />
      <UL>
        <LI>
          <Strong>Separate the decline categories.</Strong> At minimum, split declines into hard (bad card,
          needs a new number), soft (temporary, worth a smarter retry), and authentication (needs a fresh 3DS
          challenge, not a retry) — three genuinely different problems that a single retry-then-email
          workflow cannot serve well simultaneously.
        </LI>
        <LI>
          <Strong>Do not burn retry attempts on authentication declines.</Strong> A processor-level retry,
          however well-timed, cannot satisfy an authentication requirement — skip straight to the
          re-authentication path instead of waiting out a retry window that was never going to help.
        </LI>
        <LI>
          <Strong>Write the email to match the actual problem.</Strong> Reassure the customer their card is
          fine, explain the extra step in plain language, and link directly into the specific charge’s
          authentication flow rather than a generic billing-settings page.
        </LI>
        <LI>
          <Strong>Confirm your processor is signaling the recurring exemption correctly.</Strong> A
          misconfigured integration that fails to mark legitimate renewals as merchant-initiated transactions
          will trigger far more unnecessary challenges than the underlying regulation actually requires.
        </LI>
        <LI>
          <Strong>Watch the category over time, not just once.</Strong> Because exemption eligibility sits
          partly with each customer’s own issuing bank, the share of renewals hitting{' '}
          <code>authentication_required</code> can shift as your European customer base grows or as banks
          adjust their own risk models — worth checking periodically rather than assuming it is a
          solved, static problem.
        </LI>
      </UL>
      <P>
        <Strong>Starter</Strong> ($29/month) runs a 4-email AI sequence on Days 1, 3, 7, and 14, and its free
        Lost Revenue Finder scans your last 90 days of payment history so you can see how many failures fall
        into this category before committing to anything. <Strong>Pro</Strong> ($79/month) adds automatic
        hard/soft/authentication decline routing — so an SCA-related decline gets its own re-authentication
        branch by default, not a generic card-update email — writes the sequence in 8 languages, adds SMS
        recovery, an in-app cancel-flow with retention offers, win-back campaigns on Day 3, 14, and 30, a full
        12-month historical scan, a weekly digest, and priority support. Both plans include a 14-day free
        trial with no credit card required and a 30-day money-back guarantee — full details on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>
      <InlineCTA>
        Run the free Lost Revenue Finder to see how many of your own past failures were authentication-
        related versus a bad card or empty account — it connects read-only to Stripe, Paddle, Braintree,
        Chargebee, or Recurly and shows the real breakdown from your own payment history.
      </InlineCTA>
      <P>
        For a broader look at sizing failed-payment losses across every decline category, not just
        SCA-related ones, see{' '}
        <A href="/blog/how-much-revenue-lost-to-failed-payments">
          how much revenue you are losing to failed payments
        </A>.
      </P>

      <Divider />

      <P>
        For Stripe’s own documentation on Strong Customer Authentication and how it applies across Stripe
        products, see{' '}
        <A href="https://stripe.com/docs/strong-customer-authentication">
          Stripe’s Strong Customer Authentication documentation
        </A>
        , and for Stripe’s reference on how 3D Secure works technically, see{' '}
        <A href="https://stripe.com/docs/payments/3d-secure">Stripe’s documentation on 3D Secure</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Stop losing European renewals to a decline your dunning sequence doesn't understand"
        body="Revova reads the decline reason on every failed charge across Stripe, Paddle, Braintree, Chargebee, and Recurly and routes authentication_required to its own re-authentication branch — not a generic card-update email. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
