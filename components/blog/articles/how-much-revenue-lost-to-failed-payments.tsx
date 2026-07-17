import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, UL, OL, LI, BarChart, DonutChart, ProsCons, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is a normal failed-payment rate for subscription billing?',
    a: 'Industry estimates commonly put failed or declined subscription charges somewhere in the 5–10% range per billing cycle, depending on your processor, your customers’ card mix, and how much of your volume sits in Europe or the UK under Strong Customer Authentication (SCA). US-heavy, credit-card-dominant businesses often sit toward the lower end; businesses with a lot of debit cards, prepaid cards, or SCA-exposed volume often sit toward the higher end.',
  },
  {
    q: 'How much of that failed revenue can actually be recovered?',
    a: 'Stripe Smart Retries alone typically recover roughly 30–40% of failed charges without any extra work. Add a well-timed dunning email sequence on top and the combined recovery rate — retries plus dunning together — commonly reaches 40–60% industry-wide. The remaining 40–60% is what most businesses without a dedicated recovery process leave on the table every single month.',
  },
  {
    q: 'Does this apply to annual plans, or only monthly billing?',
    a: 'It applies to both, but the shape is different. Monthly billing gives you twelve chances a year for a card to fail on any one customer, so the loss is spread thin and easy to miss. Annual billing gives you only one chance per customer per year, but each failure is worth far more in dollar terms, and a missed annual renewal often looks identical to a voluntary non-renewal in your reporting unless you are tracking decline reasons separately. If you run a mix of both cadences, calculate each one separately rather than blending them into one MRR-wide estimate — a single failed annual charge can be worth more than a dozen failed monthly ones combined.',
  },
  {
    q: 'How is "revenue lost to failed payments" different from my churn rate?',
    a: 'Churn rate blends two very different problems together. Voluntary churn is a customer choosing to leave; involuntary churn is a subscription lapsing because a charge failed and nobody fixed it. Involuntary churn commonly makes up 20–40% of total SaaS churn, and it is the recoverable half — see our explainer on what involuntary churn actually is for the full breakdown.',
  },
  {
    q: 'Is the 5–10% failure rate the same across Stripe, Paddle, Braintree, Chargebee, and Recurly?',
    a: 'No. Stripe and Braintree are payment facilitators, so the raw decline rate mostly reflects your card mix and geography. Paddle, as a Merchant of Record, absorbs some SCA and 3D Secure friction into its own hosted checkout, which can shift the number slightly. Chargebee and Recurly sit on top of an underlying gateway (often Stripe, Braintree, or Adyen) and inherit whatever decline behavior that gateway produces, so the failure rate is really a property of the gateway, not the billing layer.',
  },
  {
    q: 'Does Revova work with my payment processor to find this number?',
    a: 'Yes. Revova connects read-only to Stripe, Paddle, Braintree, Chargebee, and Recurly and never touches card data. Whichever processor (or combination of processors) you run, the free Lost Revenue Finder scans your actual payment history and shows a real dollar figure instead of an industry-benchmark estimate.',
  },
  {
    q: 'How is the Lost Revenue Finder different from just reading my processor’s failed-payment report?',
    a: 'A processor dashboard shows you failed charges as isolated events — a list of declines with codes like insufficient_funds or expired_card, usually without telling you which ones were ever actually recovered afterward. The Lost Revenue Finder aggregates that history into one number: total dollars lost to failures that were never recovered, over the last 90 days on Starter or a full 12 months on Pro, so you see the cumulative size of the problem rather than one decline at a time, and you see it in dollars rather than a raw event count.',
  },
  {
    q: 'I already use Stripe’s Smart Retries — do I still need to calculate this?',
    a: 'Yes, because Smart Retries only solves the first 30–40% of the problem. It has no personalized dunning email, no SMS follow-up, no in-app cancel-flow save, and no way to go back and recover charges that failed months ago. Running the calculation (or the free scan) tells you exactly how much is still sitting on the table after Smart Retries has already done its part.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        Most subscription businesses lose somewhere between <Strong>2% and 6% of monthly recurring
        revenue</Strong> to failed payments that never get recovered — and if you have no dedicated
        retry or dunning process running at all, that number can run closer to the full 5–10% failure
        rate industry estimates commonly cite. At $50,000 in MRR, that is typically $1,000 to $3,000 a
        month quietly leaking out, or roughly $12,000 to $36,000 a year, before you have spent a single
        dollar acquiring a new customer. The gap between those two ends of the range comes down to four
        things: which payment processor you are on, how much of your revenue is exposed to Strong
        Customer Authentication (SCA) friction in Europe and the UK, whether you bill monthly or
        annually, and how mature your dunning setup already is. This guide walks through the 2026
        benchmark ranges for failed-payment revenue loss, the specific levers that push your own number
        up or down, a five-step back-of-envelope method you can run in about five minutes with your own
        MRR and processor dashboard, and a full worked example at $50,000 MRR. Then we will show you the
        difference between estimating this number and actually knowing it.
      </Lead>
      <P>
        We build payment-recovery software for a living, so we see this pattern across hundreds of
        billing setups: founders track MRR growth, new signups, and churn rate obsessively, and almost
        never track failed-charge dollars as their own line item. That is the blind spot this article
        exists to close — with honest ranges, not invented precision, and a clear path to your exact
        number at the end.
      </P>

      <KeyTakeaways
        items={[
          <>Industry estimates commonly put subscription failed-payment rates at <Strong>5–10% of charges per billing cycle</Strong>; after Stripe Smart Retries and dunning, most businesses still net out losing <Strong>2–6% of MRR every month</Strong>.</>,
          <>Four levers move your own number: <Strong>processor and retry sophistication</Strong>, <Strong>SCA/PSD2 exposure</Strong>, <Strong>monthly vs. annual billing cadence</Strong>, and <Strong>dunning maturity</Strong>.</>,
          <>A simple formula — <Strong>MRR × failure rate × (1 − recovery rate)</Strong> — gets you a reasonable estimate in about five minutes using numbers you already have.</>,
          <>An estimate is a starting point, not an answer — the free <Strong>Lost Revenue Finder</Strong> replaces the guesswork with your exact number, scanned from your real payment history.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription charges commonly fail per cycle, industry estimates' },
          { value: '40–60%', label: 'of failed revenue is typically recoverable via retries + dunning combined' },
          { value: '2–6%', label: 'of MRR still commonly lost monthly, even with baseline processor retries' },
        ]}
      />

      <H2 id="why-it-matters">Why this number is bigger than almost every founder assumes</H2>
      <P>
        Failed-payment revenue loss is invisible in a way that a marketing expense or a support ticket
        is not. It never shows up as a bill you have to pay; it shows up as revenue that was supposed to
        arrive and quietly did not, buried inside your processor’s failed-charges log next to
        hundreds of other events. Nobody opens that log every day the way they check MRR or new
        signups, so the number compounds for months before anyone notices it.
      </P>
      <P>
        It also compounds structurally, not just financially. A failed charge is not a one-time event
        the way a chargeback is — it recurs every billing cycle for every affected customer until
        someone (or something) fixes it. Most processors give you a short <Strong>grace period</Strong>{' '}
        — a window after a failed charge where access continues while retries run in the background —
        and a <Strong>pre-dunning</Strong> warning sent a few days before a card is due to expire can
        prevent a chunk of failures from ever happening at all. Without either one configured
        deliberately, the default grace period is often shorter than the time it actually takes a busy
        customer to notice an email, find a new card, and update it. If nobody fixes it inside that
        window, a temporarily-behind-on-payment customer typically becomes a permanently churned one.
        This is what we mean by <Strong>involuntary churn</Strong>: subscriptions lost to a failed
        charge rather than a customer decision, and it commonly makes up <Strong>20–40% of total SaaS
        churn</Strong>. We cover the mechanics in full in{' '}
        <A href="/blog/what-is-involuntary-churn">what is involuntary churn</A>, but the short version
        matters here: a meaningful chunk of your churn dashboard is really a billing-infrastructure
        problem wearing a churn costume.
      </P>
      <P>
        It is also, importantly, not a reflection of your product or your customer support. Card
        networks like <Strong>Visa</Strong>, <Strong>Mastercard</Strong>, and <Strong>American
        Express</Strong> route declines from the issuing bank for reasons entirely outside your
        control — <code>insufficient_funds</code> because the customer’s account was low that
        week, <code>expired_card</code> because nobody updated a card on file, <code>do_not_honor</code>{' '}
        as a catch-all fraud-suspicion decline. None of those mean the customer wants to leave. See our{' '}
        <A href="/blog/stripe-decline-codes-explained">guide to Stripe decline codes</A> for what each
        one actually means and how to respond. The businesses that treat this as a deliberate recovery
        problem, rather than an unfortunate cost of doing business, are the ones that keep the 2–6%
        loss range instead of drifting toward the 5–10% end of it.
      </P>
      <P>
        Most founders discover the real size of this number by accident — reconciling books before a
        fundraise, or explaining an unexpected MRR dip to a board that assumes it must be a product or
        sales problem. By then it has usually been compounding quietly for a year or more. And the
        reason a whole category of dedicated tools exists — Revova, but also <Strong>Churnkey</Strong>,{' '}
        <Strong>Churn Buster</Strong>, <Strong>Baremetrics Recover</Strong>, <Strong>Stunning</Strong>,{' '}
        <Strong>Gravy</Strong>, and <Strong>Paddle Retain</Strong> for Paddle-billed businesses — is
        that this is a large, well-documented problem across the entire subscription industry, not a
        rare edge case tied to one processor or one business model. Naming that plainly upfront matters
        more than pretending it is unusual.
      </P>

      <H2 id="benchmarks">The benchmark ranges: what &quot;normal&quot; loss looks like in 2026</H2>
      <P>
        Start with the failure rate itself. Across Stripe, Paddle, Braintree, and the billing platforms
        (Chargebee, Recurly) that sit on top of gateways like Stripe, Braintree, or Adyen, industry
        estimates commonly put the share of subscription charges that fail or get declined somewhere
        between <Strong>5% and 10% per billing cycle</Strong>. Where you land inside that range depends
        heavily on your card mix and geography — more on that in the next section — but almost no
        subscription business sits at a true 0%.
      </P>
      <P>
        Not all of that failed revenue stays lost, though. <Strong>Stripe Smart Retries</Strong> alone,
        which re-attempts a declined charge on days a soft decline like <code>insufficient_funds</code>{' '}
        is statistically more likely to clear (a payday retry window, rather than a blind daily retry),
        typically recovers roughly <Strong>30–40% of failed charges</Strong> with zero extra setup.
        Layer a personalized dunning email sequence on top — one written per decline reason rather than
        a single generic &quot;your payment failed&quot; template — and the combined recovery rate,
        retries plus dunning together, commonly reaches <Strong>40–60% industry-wide</Strong>. Dunning
        emails themselves typically see open rates around 30–40% and click rates around 10–15%, which is
        exactly why the last mile of recovery depends on getting the timing, subject line, and personal
        tone right rather than just sending more emails.
      </P>
      <P>
        That last mile is also where most of the remaining 40–60% quietly disappears. A generic
        &quot;update your payment method&quot; email sent at 3am the customer&apos;s time, with no
        mention of what they will lose or by when, gets buried under everything else in an inbox. An
        email sent around 8:30am local time, worded around the specific decline reason (a soft nudge for{' '}
        <code>insufficient_funds</code>, a firmer &quot;your card is about to expire&quot; for one
        already flagged) and followed by an SMS for higher-value accounts, converts noticeably more of
        that open rate into an actual updated card. This is the layer processor-native retries do not
        attempt, because Stripe, Braintree, and Paddle are built to move money, not to write copy your
        customer will actually read.
      </P>
      <P>
        Put a representative number on it. At $50,000 MRR and a 7% failure rate — squarely in the
        middle of the industry range — that is $3,500 in failed charges every month. If retries and
        dunning together recover half of it (the midpoint of the 40–60% combined range), $1,750 comes
        back automatically and $1,750 is still lost every single month unless something more deliberate
        happens to it:
      </P>
      <DonutChart
        segments={[
          { value: 35, color: '#4f46e5', label: 'Recovered by retries', note: 'Stripe Smart Retries, payday-window timing' },
          { value: 15, color: '#10b981', label: 'Recovered by dunning', note: 'personalized email sequence on top of retries' },
          { value: 50, color: '#fb7185', label: 'Still lost', note: 'no further recovery attempt made' },
        ]}
        centerLabel="$3,500"
        centerSub="failed charges / mo at $50k MRR"
        caption="Illustrative split of a representative monthly failed-charge pool at a 7% failure rate and a 50% combined recovery rate (the midpoint of the commonly cited 40–60% range). Your real split depends on processor, geography, and dunning maturity."
      />
      <P>
        The failure rate itself is not one flat number across every stack, either. Stripe and{' '}
        <Strong>Braintree</Strong> are payment facilitators, so the raw decline rate mostly tracks your
        card mix and geography, and every failed attempt fires a webhook — <code>charge.failed</code>,{' '}
        <code>invoice.payment_failed</code> — that a recovery tool can act on the moment it happens.
        Paddle, as a Merchant of Record, folds 3D Secure into its own hosted checkout, which shifts some
        of the SCA friction earlier into the funnel rather than into a recurring decline later.{' '}
        <Strong>Chargebee</Strong> and <Strong>Recurly</Strong> are subscription-billing layers, not
        gateways — they sit on top of Stripe, Braintree, or <Strong>Adyen</Strong> and inherit whatever
        decline behavior that underlying gateway produces, so their configurable retry schedules are
        only ever as good as the signal arriving from beneath them.
      </P>

      <InlineCTA>
        Rather than assume where you fall in the 5–10% range, run the free Lost Revenue Finder — it
        connects read-only and scans your real payment history for the exact number.
      </InlineCTA>

      <H2 id="drivers">What pushes your number up — and what pulls it down</H2>
      <P>
        The 5–10% failure rate and 2–6% net-loss range are industry starting points, not a fixed law.
        Five factors explain most of the spread we see between a business sitting comfortably at the low
        end and one bleeding at the high end:
      </P>
      <CompareTable
        rows={[
          ['Factor', 'Pushes your loss up', 'Pulls your loss down'],
          ['Processor & retry logic', 'Bare gateway with a single retry attempt or none at all', 'Stripe Smart Retries / Stripe Radar-informed, payday-window timing'],
          ['Geography / SCA exposure', 'High share of EU or UK cards requiring 3D Secure re-authentication under PSD2', 'Mostly US or non-SCA card volume, fewer authentication challenges'],
          ['Billing cadence', 'Monthly billing — up to 12 decline opportunities per customer per year', 'Annual billing — one opportunity per year, though each failure is worth more'],
          ['Dunning maturity', 'No dedicated recovery emails, no SMS backup, no in-app cancel-flow save', 'AI-personalized sequence per decline reason (e.g., Day 1/3/7/14/21) plus SMS'],
          ['Historical follow-up', 'Old failed invoices from months ago never revisited or chased', 'Regular historical sweep and a win-back sequence for already-lapsed customers'],
          ['Card / issuer mix', 'High share of debit and prepaid cards, more prone to insufficient_funds', 'High share of premium or rewards credit cards with higher approval rates'],
        ]}
      />
      <P>
        Two of these deserve a closer look because founders underestimate them most often.{' '}
        <Strong>SCA exposure</Strong> is a regulatory fact, not a processor quirk — under{' '}
        <Strong>PSD2</Strong>, European card issuers can require a 3D Secure challenge on a recurring
        charge, and if the customer does not complete it (or the retry does not re-trigger it
        correctly), the charge fails for a reason that has nothing to do with the card having funds.
        <Strong> Historical follow-up</Strong> is the other blind spot: most businesses have a year or
        more of failed invoices sitting untouched in their processor because nobody built a process to
        go back and chase them, which is exactly the gap a one-time historical scan is built to close.
      </P>
      <P>
        Put two real-world profiles side by side and the spread makes intuitive sense. A US-based B2B
        SaaS billing monthly through Stripe, with mostly premium business cards and no dunning sequence
        beyond Smart Retries, often sits near the low end of the range — call it 2–3% of MRR lost every
        month. A global B2C subscription app billing through Stripe or Paddle, with heavy EU/UK card
        volume subject to SCA, a mix of debit cards, and no historical follow-up process at all, often
        sits at the high end — 6% or more, before you even count old failed invoices sitting untouched
        from prior quarters. Neither business is doing anything wrong; they simply inherited a different
        starting point, which is exactly why the calculation below asks you to plug in your own
        assumptions rather than accept one flat industry number.
      </P>
      <P>
        Before you run the numbers, it is worth a quick, honest self-audit against these same five
        factors:
      </P>
      <UL>
        <LI>Do you actually know your decline rate, or are you guessing at the industry range because nobody has pulled the report?</LI>
        <LI>Is your recovery today retries alone, or retries plus a dunning sequence written per decline reason?</LI>
        <LI>Do you have pre-dunning in place for cards approaching their expiry date, or does every expired card become a failed charge first?</LI>
        <LI>Has anyone ever swept your payment history for old, never-chased failed invoices, or only new ones going forward?</LI>
        <LI>Is your recovery tooling tied to one processor, or built to follow you if you add or switch processors later?</LI>
      </UL>
      <P>
        A &quot;no&quot; to more than one or two of those is usually a sign you are closer to the 6–10%
        end of the range than the 2–3% end, regardless of how good your product or support team is.
      </P>

      <InlineCTA>
        Whichever processor mix drives your number, Revova connects read-only to Stripe, Paddle,
        Braintree, Chargebee, and Recurly and runs the same AI recovery sequence — retries, dunning,
        historical sweep — on top of whichever you use.
      </InlineCTA>

      <H2 id="calculate">How to calculate your own estimate in about five minutes</H2>
      <P>
        You do not need new tooling to get a reasonable estimate today — just your MRR, a failure-rate
        assumption from the benchmark range above, and an honest read on your own dunning maturity. The
        formula:
      </P>
      <Callout title="The back-of-envelope formula">
        <p style={{ margin: 0 }}>
          <Strong>Monthly loss ≈ MRR × failure rate × (1 − recovery rate)</Strong>
        </p>
      </Callout>
      <OL>
        <LI><Strong>Get your MRR.</Strong> Use your current monthly recurring revenue from your billing dashboard or subscription platform.</LI>
        <LI><Strong>Pick a failure-rate assumption.</Strong> Use 5% if you are mostly US-based with premium cards and low SCA exposure; use 10% if you have significant EU/UK volume, a lot of debit or prepaid cards, or you genuinely do not know your real number yet. If you want a real figure instead of an assumption, most processor dashboards expose it directly — Stripe under Billing → Failed payments, Chargebee and Recurly under their respective dunning or collections reports.</LI>
        <LI><Strong>Pick a recovery-rate assumption.</Strong> Use 30–40% if you rely on processor retries alone with no dunning emails; use 40–60% if you already run a dedicated dunning sequence on top of retries.</LI>
        <LI><Strong>Run the formula.</Strong> Multiply MRR × failure rate × (1 − recovery rate) to get your estimated monthly net loss.</LI>
        <LI><Strong>Annualize it, and remember it recurs.</Strong> Multiply by 12 for a rough annual exposure figure — but treat it as a floor, not a ceiling, since unresolved failures often convert into permanent involuntary churn rather than staying a one-time miss.</LI>
      </OL>
      <P>
        Treat the output as a floor, not a precise forecast. The formula assumes failures and recoveries
        repeat at a steady monthly rate, which is a reasonable approximation for planning purposes but
        ignores two things that make the real number worse over time: unresolved failures that convert
        into permanent involuntary churn (removing that customer’s entire remaining lifetime value, not
        just one month’s charge), and old failed invoices that never get revisited and simply pile up.
        If you already track <Strong>CAC</Strong> payback or <Strong>net revenue retention (NRR)</Strong>{' '}
        closely, this number deserves the same scrutiny as any other line item feeding those metrics —
        it is usually large enough to move both, and it is one of the few that improves without any
        change to acquisition spend or product roadmap.
      </P>
      <P>
        Run that formula across a few MRR tiers using a representative 4% net-loss rate (the midpoint of
        the commonly cited 2–6% range, assuming baseline processor retries but no dedicated dunning
        sequence) and the dollar exposure scales in a straight line with revenue — which is exactly why
        this is worth calculating early rather than waiting until it is a six-figure problem:
      </P>
      <BarChart
        bars={[
          { label: '$5k MRR', pct: 2, value: '~$2,400/yr' },
          { label: '$20k MRR', pct: 8, value: '~$9,600/yr' },
          { label: '$50k MRR', pct: 20, value: '~$24,000/yr' },
          { label: '$100k MRR', pct: 40, value: '~$48,000/yr' },
          { label: '$250k MRR', pct: 100, value: '~$120,000/yr' },
        ]}
        caption="Illustrative annual revenue at risk by MRR tier, assuming a 4% net monthly loss rate (5–10% failure rate industry estimate, netted against baseline recovery). Your real number depends on processor, geography, billing cadence, and dunning maturity — see the drivers above."
      />

      <H2 id="worked-example">A worked example: $50,000 MRR, step by step</H2>
      <P>
        Numbers are easier to trust when you can see every step, so here is the full calculation for a
        subscription business at $50,000 MRR that already relies on Stripe Smart Retries but has never
        added a dedicated dunning sequence on top:
      </P>
      <Callout title="Step by step at $50,000 MRR">
        <p style={{ margin: 0 }}><Strong>1. MRR:</Strong> $50,000</p>
        <p style={{ margin: '8px 0 0' }}><Strong>2. Failure rate:</Strong> 7% (mid-range industry estimate) → $3,500 in failed charges this month</p>
        <p style={{ margin: '8px 0 0' }}><Strong>3. Recovery rate:</Strong> ~35%, from Stripe Smart Retries alone, no dunning sequence running → $1,225 recovered automatically</p>
        <p style={{ margin: '8px 0 0' }}><Strong>4. Still lost this month:</Strong> $3,500 − $1,225 = $2,275</p>
        <p style={{ margin: '8px 0 0' }}><Strong>5. Annualized exposure:</Strong> $2,275 × 12 ≈ $27,300/year, assuming the failure and retry-only pattern holds steady</p>
      </Callout>
      <P>
        Now run the same business forward six months after adding a personalized dunning sequence,
        moving the combined recovery rate from ~35% (retries only) to the commonly cited 50% midpoint
        of the 40–60% combined range. The math shifts meaningfully: $3,500 in failed charges recovers
        $1,750 instead of $1,225, cutting the still-lost figure from $2,275 to $1,750 a month — a
        roughly <Strong>23% reduction</Strong> in ongoing loss, worth about $6,300 a year at this MRR,
        without touching acquisition, pricing, or the product at all. That gap is exactly what a
        dedicated recovery sequence is built to close; see our step-by-step guide on{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>{' '}
        for the full setup.
      </P>
      <P>
        Scale changes the picture, but not the method. Run the identical five steps for a much smaller,
        already-recovery-savvy business — $8,000 MRR, a lower 6% failure rate thanks to mostly US
        premium cards, and a mature AI dunning sequence already layered on top of Smart Retries pushing
        the recovery rate to roughly 55%:
      </P>
      <Callout title="The same math at $8,000 MRR with mature dunning already running">
        <p style={{ margin: 0 }}><Strong>1. MRR:</Strong> $8,000</p>
        <p style={{ margin: '8px 0 0' }}><Strong>2. Failure rate:</Strong> 6% (mostly US, premium cards) → $480 in failed charges this month</p>
        <p style={{ margin: '8px 0 0' }}><Strong>3. Recovery rate:</Strong> ~55%, from Smart Retries plus an active AI dunning sequence → $264 recovered</p>
        <p style={{ margin: '8px 0 0' }}><Strong>4. Still lost this month:</Strong> $480 − $264 = $216</p>
        <p style={{ margin: '8px 0 0' }}><Strong>5. Annualized exposure:</Strong> $216 × 12 ≈ $2,592/year</p>
      </Callout>
      <P>
        Smaller MRR, more mature recovery process, same formula — and a net loss rate of roughly 2.7% of
        MRR versus the first example’s 4.55%, purely because the recovery-rate assumption is doing real
        work. That gap, applied consistently over a year, is the entire argument for tightening dunning
        maturity rather than settling for whichever end of the range you happened to start at.
      </P>

      <InlineCTA>
        Revova’s Starter plan runs a 4-email AI sequence (Day 1/3/7/14) and scans your last 90 days
        of payment history free; Pro runs 5 emails through Day 21 plus SMS, hard/soft decline routing,
        and a 12-month historical scan.
      </InlineCTA>

      <H2 id="finder">Why an estimate isn&apos;t enough — and how the Lost Revenue Finder gives you the exact number</H2>
      <P>
        Every calculation above rests on an assumption — a 5–10% failure rate, a 40–60% recovery rate —
        because those are honest industry ranges, not your specific business. Your actual failure rate
        might be 4% or 12%; your actual recovery rate depends on exactly how your retries are configured
        and whether any dunning emails are going out at all. An estimate tells you the shape of the
        problem. It cannot tell you the number.
      </P>
      <P>
        That is the entire reason we built the free <Strong>Lost Revenue Finder</Strong>. Instead of
        applying a benchmark percentage to your MRR, it connects read-only to Stripe, Paddle, Braintree,
        Chargebee, or Recurly — never touching card data — and scans your actual payment history for
        failed charges that were never recovered. Starter scans the last 90 days; Pro scans a full 12
        months, which matters because most businesses have far more unrecovered historical failures
        sitting untouched than they expect. The output is not a percentage range; it is a real dollar
        figure pulled from charges that genuinely happened on your account.
      </P>
      <P>
        From there, the fix is the same either way: <Strong>Starter</Strong> ($29/month) runs a 4-email
        AI sequence on Days 1, 3, 7, and 14 and scans your last 90 days for free. <Strong>Pro</Strong>{' '}
        ($79/month) adds a 5-email sequence through Day 21, hard/soft decline smart routing, SMS
        recovery, an in-app cancel flow with retention offers, win-back campaigns for already-cancelled
        customers, 8 languages, and the full 12-month historical scan. Both plans include a 14-day free
        trial with no credit card required and a 30-day money-back guarantee — compare the full detail
        on the <A href="/pricing">Revova pricing page</A>. If you want to see how a dedicated recovery
        stack compares against building this yourself or against other tools, our{' '}
        <A href="/blog/best-payment-recovery-dunning-tools-2026">roundup of the best payment recovery
        tools</A> lays out the full market, and if churn is the number you report upward, our guide on{' '}
        <A href="/blog/how-to-reduce-saas-churn">how to reduce SaaS churn</A> shows exactly where this
        fits into the bigger picture.
      </P>
      <P>
        It is worth being precise about what connecting a processor actually means, since that is a
        fair thing to be cautious about. Revova reads payment events only — charges, invoices, and
        subscription status — and never touches card numbers, CVCs, or stored payment methods. Data is
        encrypted in transit and at rest, and everything is exportable or deletable from your account on
        request. The manual formula above and the free scan answer the same question at two different
        levels of confidence:
      </P>
      <ProsCons
        pros={[
          'Free and takes about five minutes with numbers you already have',
          'Useful for a fast board update, budget check, or deciding whether this deserves attention this quarter',
          'No processor connection or signup required',
        ]}
        cons={[
          'Only as accurate as your failure-rate and recovery-rate assumptions',
          'Cannot show you which specific decline codes or customers are driving the number',
          'Cannot separate revenue your existing retries already recovered from what is genuinely still lost',
        ]}
      />
      <P>
        The manual estimate is the right first step to decide whether this is worth your attention. The
        Lost Revenue Finder is the right second step once the answer is yes.
      </P>

      <Divider />

      <P>
        For Stripe’s own documentation on how Smart Retries schedule re-attempts, see{' '}
        <A href="https://stripe.com/docs/billing/revenue-recovery/smart-retries">Stripe’s Smart
        Retries documentation</A>, and for the regulatory background behind SCA and 3D Secure in Europe,
        see the <A href="https://ec.europa.eu/info/business-economy-euro/banking-and-finance/consumer-finance-and-payments/payment-services/payment-services-directive-psd2_en">
        European Commission’s overview of PSD2</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Stop estimating. See your real number."
        body="Connect Stripe, Paddle, Braintree, Chargebee, or Recurly and Revova's free Lost Revenue Finder scans your actual payment history to show exactly how much you've already lost to failed payments — then recovers it automatically. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
