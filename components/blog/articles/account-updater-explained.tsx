import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is Account Updater, in plain terms?',
    a: "Account Updater is a card-network service — Visa Account Updater (VAU) and Mastercard Automatic Billing Updater (ABU) are the two big ones — that lets merchants and their processors keep stored card data current without ever contacting the customer. When a bank reissues a card with a new number, or a card's expiration date rolls over, the network's updater database can hand the merchant the refreshed data automatically, silently, in the background.",
  },
  {
    q: 'Is Account Updater the same thing as a dunning system?',
    a: 'No, and this is the single most common confusion. Account Updater is a network-level data-refresh mechanism aimed at one narrow problem: stale card data on an otherwise valid card. A dunning system is a customer-facing recovery layer — retries, emails, SMS, decline-reason routing — aimed at the much broader set of failures that have nothing to do with stale data, like insufficient funds, a bank risk decline, or a fraud hold. They solve different problems and neither substitutes for the other.',
  },
  {
    q: 'Does Account Updater fix a decline caused by insufficient funds?',
    a: "No. Account Updater has nothing to refresh in that case — the card number and expiration date on file are already correct. The charge failed because there wasn't enough money in the account at that moment, which is a funds problem, not a data problem. That failure still needs a retry schedule and, if it doesn't clear, a dunning email asking the customer to take action.",
  },
  {
    q: 'How fast does Account Updater actually refresh a card?',
    a: "It is not instant. Visa's VAU typically returns updated information within a couple of business days of a merchant or processor submitting a request, and Mastercard's ABU works on a similar batch or scheduled-lookup basis rather than a live, real-time check at the moment of a charge. It also depends entirely on whether the customer's issuing bank has chosen to participate in the network's program — participation is common among major issuers but not universal.",
  },
  {
    q: 'Does every payment processor support Account Updater the same way?',
    a: "No — support varies more than most subscription businesses assume. Stripe and Recurly both run it natively and automatically. Braintree offers it as an opt-in feature with an initial bulk refresh followed by ongoing rolling updates. Chargebee doesn't have its own version at all — it inherits Stripe's or Braintree's account updater if one of those sits underneath as the gateway, and does nothing automatically on other gateways. Paddle, as a Merchant of Record, handles any network-level card refresh inside its own processing stack rather than exposing it as a merchant-configurable feature.",
  },
  {
    q: 'If Account Updater is silent and automatic, why do I still need dunning emails?',
    a: "Because Account Updater only ever addresses one failure mode — a card that is otherwise valid but has stale data on file. It does nothing for the much larger set of reasons a charge actually fails: no funds available, a bank declining the transaction as suspicious, a card blocked for fraud, or an account the customer closed outright. All of those still require a retry schedule and, when retries don't clear it, a message asking the customer to act — which is exactly what a dunning sequence is for.",
  },
  {
    q: 'Can Account Updater ever make a decline worse or cause a duplicate charge?',
    a: "It shouldn't, when implemented correctly — it's a read/update operation on stored card data, not a charge attempt. The practical risk is operational rather than financial: a business that assumes Account Updater is running when it isn't (an opt-in feature never enabled, or a gateway that doesn't natively support it) can end up with a false sense of security about how many failures are stale-data failures versus true declines, which skews how they staff and design their dunning sequence.",
  },
  {
    q: "How do I find out how much of my own churn is Account-Updater-fixable versus a true decline?",
    a: 'The only reliable way is to look at your own decline-reason breakdown rather than assume an industry average applies to your business. A tool that reads decline codes across your actual payment history — expired_card and similar data-staleness reasons versus insufficient_funds, do_not_honor, and fraud-related declines — will show you the real split, which is usually a more useful number than any published benchmark.',
  },
  {
    q: 'Does Revova run its own Account Updater?',
    a: "No, and we wouldn't claim to — Account Updater is a network-and-processor-level service that lives upstream of any recovery tool, including Revova. What Revova does is read the decline reason on every failed charge across Stripe, Paddle, Braintree, Chargebee, and Recurly and route it correctly: a stale-data failure your processor's own Account Updater should already be catching gets flagged so you can verify it's actually enabled, while a true decline gets a proper decline-aware retry and dunning sequence. The two layers are complementary, not competing.",
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Account Updater is a card-network service — Visa Account Updater (VAU) and Mastercard
        Automatic Billing Updater (ABU) are the two that matter most — that automatically refreshes
        stored card data when a bank reissues a card or its expiration date changes, with zero
        customer action and zero email ever sent. It is a real, useful mechanism, and it is
        routinely confused with dunning, which is a completely different layer: a customer-facing
        recovery system built for the much larger set of failures that have nothing to do with
        stale card data at all. This guide explains exactly what Account Updater is, how the
        network-level lookup actually works end to end, which of the major processors support it
        and how, what it can never fix no matter how well it is configured, and how the two layers
        — network-level refresh and customer-facing dunning — fit together in a subscription
        business&apos;s actual recovery stack.
      </Lead>
      <P>
        We build recovery software that reads decline reasons across five processors for a living,
        and one pattern shows up constantly: a subscription business hears that Account Updater
        exists, assumes it now has &quot;card refresh&quot; solved, and stops thinking about the far
        larger share of failures it was never built to touch. That gap is not a flaw in Account
        Updater — the service does exactly what it claims to do, and does it well. The gap is a
        mental model problem, and it is worth closing before it quietly costs a business real
        recovered revenue.
      </P>

      <KeyTakeaways
        items={[
          <>Account Updater is a <Strong>network-level data-refresh service</Strong> — Visa VAU and Mastercard ABU are the two major programs — not a recovery or dunning system.</>,
          <>It fixes exactly one problem: <Strong>stale card data</Strong> on an otherwise valid card (an expired or reissued number). It does nothing for insufficient funds, fraud holds, or bank risk declines.</>,
          <>The lookup runs on a <Strong>schedule, not in real time</Strong> — typically a couple of business days per request — and only for issuing banks that participate in the network&apos;s program.</>,
          <>Processor support is <Strong>not uniform</Strong>: Stripe and Recurly run it natively, Braintree is opt-in, Chargebee inherits it from the underlying gateway, and Paddle handles it inside its own Merchant-of-Record stack.</>,
          <>Account Updater and a <Strong>dunning sequence are complementary layers</Strong>, not substitutes — the healthiest recovery setup runs both, each covering the failure category the other cannot touch.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '~40%', label: 'of cardholders replace a card in a given year due to expiration, loss, or fraud (industry estimate)' },
          { value: '2', label: 'major network updater programs: Visa Account Updater (VAU) and Mastercard Automatic Billing Updater (ABU)' },
          { value: '20–40%', label: 'of total SaaS churn commonly attributed to involuntary churn — unpaid, failed charges (industry estimate)' },
        ]}
      />

      <H2 id="what-account-updater-is">What Account Updater actually is</H2>
      <P>
        Account Updater is not a single product — it is a category of card-network service that lets
        an enrolled merchant or processor request refreshed card data for cards already stored on
        file, without contacting the cardholder directly. The two programs that matter for the vast
        majority of subscription businesses are <Strong>Visa Account Updater (VAU)</Strong> and{' '}
        <Strong>Mastercard Automatic Billing Updater (ABU)</Strong>. Both exist to solve the same
        underlying problem from two different networks: a card on file with a merchant can go stale
        — a new expiration date, a new card number after a reissue, sometimes a replacement after
        loss or a fraud-related reissue — while the underlying cardholder relationship with the
        merchant is completely unaffected and the customer has no idea anything changed on their
        end.
      </P>
      <P>
        The mechanism is deliberately invisible to the customer. When it works, a subscription
        renewal that would otherwise have failed against an expired card simply succeeds, because
        the merchant&apos;s payment processor already has the refreshed number and expiration date
        by the time the charge fires. No email goes out asking the customer to update anything,
        because nothing needs to be asked — the network already did the work upstream of the
        charge attempt.
      </P>
      <InBodyImage
        file="/blog/account-updater-explained-img-1"
        alt="Flow diagram showing a merchant or processor submitting on-file card numbers to a card network's VAU/ABU database, which checks against the issuing bank's records and returns refreshed card data silently"
        caption="The lookup runs merchant/processor to network to issuing bank and back — a scheduled request-response cycle, not a live check at the moment of the charge."
      />
      <Callout title="This is not a fraud tool or a funds check">
        Account Updater has one job: reconcile stale card data against what the issuing bank
        currently has on file. It makes no judgment about whether a charge should be approved, does
        not check available balance, and has no visibility into whether a transaction looks
        fraudulent. Those are separate systems entirely — a decline engine, a fraud model, a
        dunning sequence — and none of them is what Account Updater is doing.
      </Callout>
      <P>
        It is also worth being precise about scope: Account Updater programs generally cover Visa,
        Mastercard, and — depending on the specific processor implementation — Discover-branded
        cards. Other card networks and payment methods sit outside these two specific programs
        entirely, which is one more reason no subscription business should treat Account Updater as
        a universal fix for every stored-card failure across every card brand it accepts.
      </P>
      <P>
        Visa Account Updater and Mastercard Automatic Billing Updater are not identical in how a
        merchant interacts with them, even though the end result looks the same. VAU is generally
        described as a request-and-response model: an enrolled merchant or processor submits its
        on-file account numbers ahead of a billing cycle, and the network responds with whatever
        updates apply. ABU supports both a similar pull-style inquiry and a push-style option, where
        a merchant can receive automatic update notifications for any accounts it keeps on file,
        rather than having to ask each time. Neither model changes what the service actually does —
        refresh stale data on a valid card — but the distinction matters if you are ever debugging
        why updates seem to arrive on a different cadence between Visa- and Mastercard-issued cards
        in your own customer base.
      </P>
      <P>
        Participation also is not universal, and this is easy to overlook. An issuing bank has to
        actively participate in the network&apos;s updater program for its cards to ever come back
        with refreshed data — most large, well-known banks do, but coverage thins out for smaller
        regional banks, some credit unions, and issuers in certain markets outside the US and
        Europe. In practice this means a subscription business with a geographically concentrated,
        major-bank-heavy customer base will see Account Updater catch a meaningfully higher share of
        its expired-card failures than one with a long tail of smaller or international issuers —
        worth keeping in mind before assuming a single, universal recovery rate applies to your own
        numbers.
      </P>

      <H2 id="how-it-works">How the network-level lookup actually works, step by step</H2>
      <P>
        The mechanics are the same shape across VAU and ABU, even though the specific request
        formats and turnaround details differ slightly between the two networks. Understanding the
        flow matters because it explains both why the service is genuinely useful and why it is
        fundamentally limited to one narrow category of problem.
      </P>
      <OL>
        <LI>
          <Strong>Enrollment.</Strong> A merchant, almost always through its payment processor or
          gateway rather than directly, enrolls its stored, on-file card numbers into the network&apos;s
          updater program.
        </LI>
        <LI>
          <Strong>Submission.</Strong> The processor periodically submits the merchant&apos;s on-file
          account numbers to the card network&apos;s updater database — either as a scheduled batch
          request or, for some implementations, an inquiry ahead of an upcoming billing date.
        </LI>
        <LI>
          <Strong>Network lookup.</Strong> The network checks each submitted account number against
          its own records, which are populated by issuing banks that participate in the program.
        </LI>
        <LI>
          <Strong>Issuer confirmation.</Strong> If the issuing bank has reissued the card — a new
          expiration date, a new number, or both — and has reported that change into the network&apos;s
          updater database, the network returns the refreshed data. If nothing changed, or the
          issuer does not participate in the program, no update comes back.
        </LI>
        <LI>
          <Strong>Silent update.</Strong> The processor updates the merchant&apos;s stored card record
          automatically. No email, no SMS, no customer-facing prompt of any kind — the next renewal
          simply charges the refreshed card instead of the stale one.
        </LI>
      </OL>
      <ProsCons
        pros={[
          'Genuinely silent and automatic — recovers a real category of failed renewals with zero customer friction and zero email sent',
          'Runs upstream of the charge attempt, so a successfully refreshed card converts on the very first try instead of needing a retry at all',
          'Reduces the volume of "please update your card" emails a healthy, engaged customer has to deal with for a problem they didn’t even know existed',
          'Supported natively by several major processors, including Stripe and Recurly, with no separate integration required once enabled',
        ]}
        cons={[
          'Only fixes stale card data — every other failure reason (funds, fraud, risk decline, closed account) is completely untouched',
          'Runs on a schedule, typically a couple of business days per request, not instantly at the moment of a charge',
          'Depends on the issuing bank choosing to participate in the network’s program — coverage is common but not universal',
          'Support and configuration differ meaningfully by processor — native, opt-in, gateway-dependent, or unpublished, depending which one you use',
        ]}
      />

      <InlineCTA>
        Curious how much of your own failed-payment volume is stale-card versus a true decline?
        Revova&apos;s free Lost Revenue Finder scans your real payment history — Starter goes back 90
        days, Pro a full 12 months — and breaks it down by actual decline reason before you commit
        to anything.
      </InlineCTA>

      <H2 id="sizing-the-impact">Sizing the impact: an illustrative example, not a benchmark</H2>
      <P>
        It helps to put a rough shape of numbers around this, with the honest caveat up front that
        the real figures vary widely by customer base, geography, and issuer mix — treat the
        following as illustrative reasoning, not a published statistic to plug into your own model
        directly. Roughly 40% of cardholders replace a card in a given year for some combination of
        expiration, loss, or fraud-related reissue, according to commonly cited industry estimates.
        Not every one of those replacements lines up with a subscription renewal date, and not every
        issuing bank participates in the updater programs, but even a conservative slice of that 40%
        translates into a real, recurring category of renewal attempts that would otherwise fail
        against stale card data.
      </P>
      <P>
        For a subscription business processing, say, 10,000 renewals a month, even a modest few
        percent of those hitting a stale-card failure represents hundreds of renewals a month that
        Account Updater — properly enabled — can resolve before a single retry or email is ever
        needed. That is real, meaningful recovery, and it is exactly why the service is worth taking
        seriously rather than dismissing as a minor technical detail. The mistake is extrapolating
        from that real number to the false conclusion that the remaining, much larger share of
        failures — funds problems, risk declines, fraud holds — will somehow also resolve
        themselves. They will not, and they need the separate dunning layer this guide keeps coming
        back to.
      </P>

      <H2 id="what-it-doesnt-fix">What Account Updater never touches, no matter how well it&apos;s configured</H2>
      <P>
        The boundary matters more than the mechanism itself, because the boundary is where most of
        the confusion — and most of the missed recovery revenue — actually lives. Account Updater
        addresses exactly one category: a card that is otherwise valid, but whose stored number or
        expiration date has gone stale. Every other reason a charge fails sits entirely outside what
        this service can do, because there is nothing for a data-refresh lookup to correct.
      </P>
      <P>
        An <code>insufficient_funds</code> decline is the clearest example: the card number and
        expiration date on file are already completely correct. The charge failed because the
        account didn&apos;t have enough money in it at that moment — a timing and funds problem, not
        a data problem, and refreshing data that was never wrong does nothing to fix it. A{' '}
        <code>do_not_honor</code> decline, a fraud hold, or a bank&apos;s own risk-based block are
        the same story from a different angle: the issuing bank is actively refusing the specific
        transaction, for reasons that have nothing to do with whether the stored card number is
        current. And an account the customer has closed outright — canceled the card, closed the
        bank account — has no &quot;refreshed&quot; version to return at all.
      </P>
      <InBodyImage
        file="/blog/account-updater-explained-img-2"
        alt="Two lists side by side: what Account Updater fixes (expired card, reissued card, changed card number) versus what it never touches (insufficient funds, do_not_honor, fraud hold, closed account)"
        caption="Stale data and a genuine decline are different problems. One is a network lookup; the other still needs a decline-aware retry and a customer-facing dunning sequence."
      />
      <P>
        This is exactly why a business cannot treat Account Updater as a substitute for a working
        dunning sequence, however well it is enabled and configured. For the fuller picture of how a
        decline-aware retry-and-email system should actually branch by reason — rather than treating
        every failure the same way — see{' '}
        <A href="/blog/soft-decline-vs-hard-decline">our guide to soft decline versus hard decline</A>{' '}
        and <A href="/blog/what-is-dunning">what is dunning</A>.
      </P>

      <H2 id="platform-support">Account updater support across the five processors</H2>
      <P>
        Coverage is not uniform, and assuming otherwise is one of the more common mistakes we see
        subscription businesses make when they run more than one billing platform, or evaluate
        switching between them. Here is what is publicly documented across the five processors
        Revova connects to, read-only.
      </P>
      <InBodyImage
        file="/blog/account-updater-explained-img-3"
        alt="A five-row list showing account updater support across processors: Stripe native, Recurly native, Braintree opt-in, Chargebee gateway-dependent, Paddle handled inside its own Merchant-of-Record stack"
        caption="Native, opt-in, gateway-dependent, or unpublished — four meaningfully different support levels across five processors."
      />
      <CompareTable
        rows={[
          ['Processor', 'Account updater support', 'How it works'],
          ['Stripe', 'Native, automatic', 'Enrolled by default on saved cards; uses Visa VAU and Mastercard ABU under the hood, refreshing silently in the background'],
          ['Recurly', 'Native, automatic', 'Built-in Account Updater checks stored cards against the Visa/Mastercard networks with no configuration beyond enabling it'],
          ['Braintree', 'Opt-in feature', 'Initial bulk refresh of vaulted cards once enabled, then rolling updates based on recent processing activity; a separate Next Day Card Refresh option ties into specific decline codes'],
          ['Chargebee', 'Gateway-dependent', 'No native updater of its own — inherits Stripe’s or Braintree’s account updater if one of those sits underneath as the gateway; no automatic refresh on other gateways'],
          ['Paddle', 'Handled internally', 'As a Merchant of Record, any network-level card refresh happens inside Paddle’s own processing stack rather than as a merchant-facing, configurable feature'],
        ]}
      />
      <P>
        The practical takeaway is simple: do not assume Account Updater is running just because your
        processor is capable of supporting it. Braintree in particular requires an explicit opt-in,
        and Chargebee&apos;s coverage depends entirely on which gateway sits underneath it — worth
        confirming directly in your own account settings rather than assuming. For a closer look at
        how Recurly&apos;s specific implementation works alongside its Dunning Cycle, see{' '}
        <A href="/blog/recurly-dunning">our Recurly dunning and Account Updater guide</A>.
      </P>

      <H2 id="business-type">Where Account Updater matters more, and where it matters less</H2>
      <P>
        Not every subscription business gets the same practical value out of Account Updater, and
        it is worth being honest about why. A high-volume, consumer-facing subscription business —
        media streaming, subscription commerce, consumer fitness or wellness apps — tends to store
        an enormous number of cards, renew frequently, and see a steady, statistically predictable
        drip of expired and reissued cards across a large customer base every single month. For a
        business like that, even a modest percentage-point improvement in stale-card recovery
        compounds into real, ongoing revenue at scale, which is exactly why platforms like Recurly
        — built with high-volume consumer subscription billing in mind — treat Account Updater as a
        genuine, marketed differentiator rather than a footnote feature.
      </P>
      <P>
        A smaller B2B subscription business, by contrast, usually has far fewer stored cards, lower
        renewal volume, and often a card-on-file relationship that gets refreshed manually anyway
        because a real account manager or customer success contact is already talking to that
        customer. The absolute dollar value Account Updater recovers is correspondingly smaller,
        even if the percentage improvement in decline rate looks similar on paper. That does not
        mean it is not worth enabling — it almost always is, since it costs nothing extra to turn on
        where it is natively supported — but it does mean the case for prioritizing it over, say, a
        properly decline-aware dunning sequence is weaker than it is for a high-volume consumer
        subscription business.
      </P>

      <H2 id="account-updater-vs-dunning">Account Updater versus dunning: why you need both, not either</H2>
      <P>
        The clearest way to think about the relationship is as two layers stacked on top of each
        other, each covering a share of the same overall problem — failed payments — that the other
        cannot reach. Account Updater sits upstream, silently keeping stored card data current
        before a charge is even attempted, so that a share of what would otherwise be failed
        renewals simply succeed on the first try. Dunning sits downstream of an actual failure,
        picking up everything Account Updater was never built to touch: funds problems, risk
        declines, fraud holds, and any other reason a charge genuinely fails despite the card data
        being completely accurate.
      </P>
      <P>
        Neither layer makes the other unnecessary. A subscription business running only Account
        Updater, with no decline-aware retry-and-email sequence behind it, will still lose a
        meaningful share of renewals to funds and risk declines that no amount of stale-data
        refreshing could have prevented. A business running only a dunning sequence, with Account
        Updater never enabled or unsupported by its gateway, will keep sending &quot;please update your
        card&quot; emails to customers whose cards were never actually the problem — the same
        confusing, poorly-targeted messaging pattern we cover in detail in{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">our dunning email sequence setup guide</A>.
        The two layers are genuinely complementary, and a business optimizing recovery seriously
        should confirm both are actually running rather than assuming one implies the other.
      </P>
      <Callout title="A related but distinct comparison: ML-driven retry timing">
        Account Updater is not the only mechanism sometimes confused with a full recovery layer.
        Some vendors — Butter Payments among them — optimize the timing of a retry itself using
        machine learning on issuer-specific decline patterns, which is a different (and also
        narrower) problem than a customer-facing dunning sequence solves. See{' '}
        <A href="/blog/butter-payments-alternatives">our look at Butter Payments and its alternatives</A>{' '}
        for how that comparison plays out in practice.
      </Callout>
      <P>
        It is worth stating the layering explicitly, because it is easy to lose track of once three
        or four mechanisms are all sitting between a renewal date and a successfully collected
        payment: Account Updater refreshes stale data before a charge is attempted; a smarter
        retry-timing engine, where one is in use, decides when to re-attempt a charge that already
        failed; and a dunning sequence decides what to actually tell the customer, and when, if
        retries alone do not resolve it. Each layer answers a different question — <em>is the data
        current</em>, <em>when should we try again</em>, and <em>what does the customer need to
        hear and do</em> — and conflating any two of them into one mental category is where recovery
        strategy tends to go wrong.
      </P>

      <H2 id="do-you-need-it">How to tell whether Account Updater is doing its job on your account</H2>
      <P>
        Rather than assuming Account Updater is enabled, working, and covering the full share of
        stale-data failures it theoretically could, a subscription business is better served
        checking a handful of concrete things directly.
      </P>
      <UL>
        <LI>
          <Strong>Confirm it is actually enabled.</Strong> On platforms where it is opt-in — Braintree
          being the clearest example — check the account&apos;s payment settings directly rather than
          assuming a capable processor means an active feature.
        </LI>
        <LI>
          <Strong>Check your gateway chain if you run Chargebee.</Strong> Because Chargebee&apos;s
          coverage depends on the underlying gateway, confirm whether Stripe or Braintree actually
          sits underneath your Chargebee account, and that the relevant webhook configuration is set
          up correctly to receive refreshed data back.
        </LI>
        <LI>
          <Strong>Break your own decline reasons down by category.</Strong> Rather than relying on an
          industry estimate for what share of failures are stale-data versus true declines, look at
          your own recent failed-charge history split by decline reason — the real number is usually
          more useful than any published benchmark, and often surprising in either direction.
        </LI>
        <LI>
          <Strong>Watch for a decline-code signal that Account Updater should have caught.</Strong> A
          cluster of <code>expired_card</code> declines on an account where Account Updater is
          supposedly enabled and running is worth investigating — it may indicate a gap in
          enrollment, a gateway misconfiguration, or simply issuing banks that don&apos;t participate in
          the program for a meaningful share of your customer base.
        </LI>
        <LI>
          <Strong>Make sure your dunning sequence still covers the rest.</Strong> Whatever share of
          failures Account Updater does catch, confirm your retry schedule and email sequence are
          still branching correctly for insufficient funds, risk declines, and every other reason a
          charge can fail — see{' '}
          <A href="/blog/stripe-decline-codes-explained">our guide to Stripe decline codes</A> for the
          fuller breakdown of what those categories actually look like.
        </LI>
      </UL>
      <P>
        None of this requires a large engineering project. Confirming a setting is enabled,
        checking a gateway chain, and running a decline-reason breakdown against your own recent
        payment history are each a matter of minutes, not weeks — the bigger risk is simply never
        checking at all, and quietly assuming a capability is active when it either was never turned
        on or was never supported by the specific gateway underneath a given billing platform.
      </P>
      <P>
        <Strong>Starter</Strong> ($29/month) runs a 4-email AI sequence on Days 1, 3, 7, and 14, and
        its free Lost Revenue Finder scans your last 90 days of payment history so you can see your
        own decline-reason breakdown before committing to anything. <Strong>Pro</Strong> ($79/month)
        adds automatic hard/soft decline routing, SMS recovery, an in-app cancel flow with retention
        offers, win-back campaigns, a full 12-month historical scan, and priority support. Both plans
        include a 14-day free trial with no credit card required and a 30-day money-back guarantee —
        full details on the <A href="/pricing">Revova pricing page</A>.
      </P>
      <InlineCTA>
        Already billing through Stripe, Paddle, Braintree, Chargebee, or Recurly? Revova connects
        read-only in minutes and shows you exactly which failures are stale-data-shaped versus true
        declines — 14-day free trial, no credit card required.
      </InlineCTA>
      <P>
        For a broader look at sizing the total cost of failed payments across every category, not
        just the stale-data share Account Updater addresses, see{' '}
        <A href="/blog/how-much-revenue-lost-to-failed-payments">
          how much revenue you are losing to failed payments
        </A>.
      </P>

      <Divider />

      <P>
        For Stripe&apos;s own documentation on how its card account updater works, see{' '}
        <A href="https://stripe.com/resources/more/what-is-a-card-account-updater-what-businesses-need-to-know">
          Stripe&apos;s guide to card account updaters
        </A>
        , and for Braintree&apos;s documentation on its Account Updater feature, see{' '}
        <A href="https://developer.paypal.com/braintree/articles/guides/account-updater">
          Braintree&apos;s Account Updater guide
        </A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Stop confusing a network-level card refresh with a full recovery layer"
        body="Revova reads the decline reason on every failed charge across Stripe, Paddle, Braintree, Chargebee, and Recurly and routes it correctly — whether that means confirming Account Updater already caught it or running a proper decline-aware dunning sequence. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
