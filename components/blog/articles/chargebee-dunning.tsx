import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is Chargebee dunning management, exactly?',
    a: 'Dunning management is the part of Chargebee that automatically re-attempts a subscription invoice after its first payment attempt fails, on a schedule you configure in Chargebee\'s settings, while sending a matching sequence of reminder emails to the customer. Chargebee runs this per site (not per invoice) — you set the number of retry attempts, the gap in days between them, and the email templates once, and every failed invoice going forward follows that same configured schedule until it either recovers or the schedule runs out.',
  },
  {
    q: 'Does Chargebee dunning use Smart Retries like Stripe does?',
    a: 'Not in the same sense. Stripe Smart Retries uses a machine-learning model trained across its whole network of transactions to pick the statistically best time to retry a specific decline. Chargebee\'s dunning schedule is rule-based and configured by you — a fixed set of days (for example, day 1, day 3, day 5, day 7) that applies uniformly to every failed invoice on that plan or site, regardless of the specific decline reason. If your underlying gateway is Stripe, some of that gateway-level retry intelligence can still apply to the individual charge attempt itself, but Chargebee\'s own dunning schedule around it is the configurable, rule-based layer described in this guide.',
  },
  {
    q: 'What happens after Chargebee\'s dunning schedule runs out?',
    a: 'That depends on the "dunning exhausted" action you configured for the plan — commonly, the subscription is marked as unpaid, paused, or cancelled, and no further automatic retries happen after that point. The invoice itself typically remains in a past-due or unpaid state in Chargebee\'s records. Nothing is automatically deleted, but nothing keeps trying either, unless a person manually intervenes, the customer proactively updates their card, or a separate recovery process re-approaches that specific invoice.',
  },
  {
    q: 'Can I customize the dunning email templates in Chargebee?',
    a: 'Yes — Chargebee lets you edit the subject line and body of each dunning email in the sequence, and you can typically use merge fields for the customer\'s name, plan, and amount due. What Chargebee\'s standard dunning configuration does not do natively is automatically branch the email copy by the specific decline reason returned by your gateway — an expired card, insufficient funds, and a bank decline all commonly receive the same templated email at each step unless you build separate logic for that yourself, which is one of the more overlooked gaps covered later in this guide.',
  },
  {
    q: 'Does Chargebee retry failed payments on weekends or only business days?',
    a: 'Chargebee\'s retry schedule runs on whatever day intervals you configured, not a business-day-aware calendar by default — a retry scheduled for day 5 fires on day 5 regardless of whether that lands on a weekend. This matters because a card issued by a smaller bank may process retries more slowly around weekends and holidays, which is a scheduling nuance worth accounting for manually when you pick your retry intervals rather than assuming every day behaves identically.',
  },
  {
    q: 'How many retry attempts should I configure in Chargebee?',
    a: 'There is no universal right number, and we are wary of any guide that states one as if it were fact — the right count depends on your billing cycle length, average transaction value, and how sensitive your audience is to repeated emails. What is true structurally, independent of the exact count: too few attempts spread too close together mostly just catch the same instantly-failing hard declines (an expired or stolen card) and waste the remaining attempts on invoices that were never going to recover; too many attempts spread too far apart can let a recoverable soft decline (insufficient funds) sit un-retried for so long that the customer has already churned emotionally, or worse, cancelled elsewhere, before Chargebee tries again.',
  },
  {
    q: 'Does Chargebee tell me the specific decline reason for a failed invoice?',
    a: 'Chargebee surfaces a payment failure and generally forwards whatever decline detail the connected gateway returns, which you can see on the invoice or transaction record inside Chargebee\'s dashboard. The nuance is that Chargebee\'s own dunning schedule and default email templates don\'t automatically branch based on that decline reason the way a decline-aware recovery layer does — the data is there to see manually, it just is not automatically routed by Chargebee\'s standard dunning configuration into different retry timing or different email copy without your own custom setup.',
  },
  {
    q: 'Can I run Chargebee dunning and a third-party recovery tool at the same time?',
    a: 'Yes, and for many teams this is exactly the right setup — Chargebee stays the system of record for subscriptions and invoicing, while a recovery layer on top adds the parts Chargebee\'s dunning configuration does not do natively: decline-reason-aware email branching, AI-personalized copy, and a historical scan across invoices that already exhausted the dunning schedule and went unpaid. Revova connects to Chargebee read-only for exactly this reason — it does not replace Chargebee\'s billing engine, it adds a recovery layer around what Chargebee already tracks.',
  },
  {
    q: 'How is this different from your general dunning email deliverability guide?',
    a: 'They cover two different layers, and it is worth being precise about which one applies to a given problem. Our separate dunning email deliverability guide covers whether any dunning email — from Chargebee, Stripe, or anywhere else — actually reaches an inbox, which comes down to SPF, DKIM, DMARC, and sender reputation, independent of which billing platform sent it. This guide is one layer earlier: how Chargebee\'s own dunning schedule and configuration decide what to send and when in the first place. A Chargebee dunning sequence configured perfectly can still under-recover if the emails it generates never clear deliverability checks — the two problems compound, and diagnosing a low recovery rate means checking both.',
  },
  {
    q: 'Will changing my Chargebee dunning settings affect existing subscriptions?',
    a: 'Generally, dunning configuration changes in Chargebee apply going forward to invoices entering the dunning process after the change, not retroactively to a schedule that has already started running for an invoice currently mid-sequence — the exact behavior can depend on your specific Chargebee plan and configuration, so it is worth confirming directly in Chargebee\'s own settings documentation or with their support before assuming a change applies everywhere at once.',
  },
]

// The point where Chargebee's own configurable dunning schedule hands off (or
// doesn't) to whatever happens next — a subscription pausing/cancelling with
// nothing further automatically re-attempting it.
function DunningHandoffFlow() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 820 360" width="820" height="360" className="w-full h-auto" role="img"
        aria-label="An invoice payment fails in Chargebee, entering the configured dunning schedule of retries and reminder emails. If a retry succeeds, the invoice is marked paid. If every configured retry fails, the dunning-exhausted action fires — commonly pausing or cancelling the subscription — and nothing automatically retries that invoice again after that point">
        <defs>
          <marker id="dhA" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#cbd5e1" />
          </marker>
        </defs>
        <g fontFamily="Segoe UI, Arial, sans-serif">
          <rect x="15" y="140" width="160" height="60" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="95" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">Invoice payment</text>
          <text x="95" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">fails</text>

          <path d="M175 170 L203 170" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#dhA)" fill="none" />

          <rect x="207" y="140" width="210" height="60" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
          <text x="312" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">Configured dunning</text>
          <text x="312" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">schedule runs</text>

          <path d="M417 170 L445 170" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#dhA)" fill="none" />

          <rect x="449" y="140" width="175" height="60" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
          <text x="536" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e">Retries + reminder</text>
          <text x="536" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e">emails, on schedule</text>

          <path d="M500 200 C 470 230, 440 240, 400 250" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#dhA)" fill="none" />
          <path d="M570 200 C 610 230, 650 240, 690 250" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#dhA)" fill="none" />

          <rect x="290" y="254" width="200" height="54" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
          <text x="390" y="278" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">A retry succeeds</text>
          <text x="390" y="295" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">— invoice paid</text>

          <rect x="600" y="254" width="205" height="54" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
          <text x="702" y="278" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9f1239">Every retry fails —</text>
          <text x="702" y="295" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">schedule exhausted</text>

          <path d="M702 308 L702 322" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#dhA)" fill="none" />
          <rect x="585" y="326" width="235" height="30" rx="10" fill="#fff1f2" stroke="#fda4af" strokeWidth="1" />
          <text x="702" y="346" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">Subscription paused/cancelled — nothing retries it further</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">
        Chargebee&apos;s dunning schedule is a bounded, configurable loop — once every configured attempt has run, whatever action you set for &ldquo;dunning exhausted&rdquo; fires, and nothing keeps trying that specific invoice automatically after that.
      </figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        Chargebee dunning management is the built-in system that automatically re-attempts a
        subscription invoice after its first payment fails, on a schedule of retry days and reminder
        emails that you configure once in Chargebee&apos;s settings. It is a real, working recovery
        mechanism — not a placeholder feature — and for a lot of subscription businesses it recovers a
        meaningful share of failed payments without any extra tooling. But &ldquo;it works&rdquo; and
        &ldquo;it recovers everything it could&rdquo; are two different claims, and the gap between them
        is where a surprising amount of quietly lost revenue tends to sit: a fixed schedule that treats
        every decline the same way, a generic email template that doesn&apos;t change based on <em>why</em>{' '}
        the card failed, and a hard stop once the configured attempts run out, after which the invoice
        just sits unpaid with nothing automatically trying again.
      </Lead>
      <P>
        This guide walks through how Chargebee&apos;s dunning configuration actually works under the
        hood, the specific settings worth checking today, the handful of gaps that are easy to miss
        because Chargebee never surfaces them as a warning, and an honest look at what a recovery layer
        added on top of Chargebee can and cannot do that Chargebee&apos;s native dunning does not already
        cover. Revova connects to Chargebee directly (read-only) alongside Stripe, Paddle, Braintree, and
        Recurly, so the limitations described here are ones we have had to design around ourselves, not
        secondhand speculation about a platform we don&apos;t actually integrate with.
      </P>

      <KeyTakeaways
        items={[
          <>Chargebee dunning is <Strong>rule-based and configurable</Strong> — a fixed schedule of retry days and reminder emails you set once, applied uniformly to every failed invoice, not a per-decline machine-learning model like Stripe Smart Retries.</>,
          <>The default configuration commonly sends the <Strong>same email copy regardless of decline reason</Strong> — an expired card and a temporarily insufficient-funds decline get identical wording, even though the right customer action is completely different for each.</>,
          <>Once the configured retry schedule is exhausted, the subscription typically gets <Strong>paused or cancelled</Strong> per your &ldquo;dunning exhausted&rdquo; setting, and nothing automatically retries that specific invoice again afterward.</>,
          <>Invoices that already exhausted the schedule sit in a past-due state indefinitely — they are <Strong>not automatically revisited</Strong> by anything running today, even if the customer&apos;s card situation has since changed.</>,
          <>A recovery layer added on top of Chargebee (like Revova) can add decline-aware email branching and a historical scan across already-exhausted invoices, without replacing Chargebee as the system of record for billing.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription invoices fail or get declined in a typical billing cycle across the industry' },
          { value: '1 template', label: 'is what most default Chargebee dunning configurations send for every decline reason, unless branching is built manually' },
          { value: '0 retries', label: 'happen automatically once the configured dunning schedule is exhausted for a given invoice' },
        ]}
      />

      <H2 id="how-it-works">How Chargebee&apos;s dunning management actually works</H2>
      <P>
        Chargebee&apos;s dunning management lives in the billing settings of your Chargebee site, and it
        applies at the site or plan level rather than being something you configure per individual
        customer. When a subscription invoice&apos;s payment attempt fails — whether the failure comes
        back from Stripe, Braintree, or whichever gateway you have connected underneath Chargebee — the
        invoice enters what Chargebee calls the dunning process. From there, Chargebee runs through the
        schedule you configured: a set number of retry attempts, spaced a set number of days apart, each
        one paired with a reminder email sent to the customer around the same time.
      </P>
      <P>
        This is meaningfully different from how Stripe&apos;s own Smart Retries feature works at the
        charge level, and conflating the two is a common source of confusion. Stripe Smart Retries uses a
        model trained across Stripe&apos;s network of transactions to estimate the statistically best
        moment to re-attempt a specific declined charge. Chargebee&apos;s dunning schedule, by contrast, is
        a configuration you set — the same day intervals apply to every failed invoice on that plan,
        regardless of the specific reason the card was declined. If Stripe happens to be the gateway
        underneath your Chargebee account, some of that charge-level retry intelligence can still be in
        play for the individual attempt itself, but the schedule wrapped around it — how many attempts,
        how far apart, what emails go out — is the configurable layer Chargebee itself controls.
      </P>
      <Callout title="Same word, two different mechanisms">
        &ldquo;Dunning&rdquo; and &ldquo;retry&rdquo; get used loosely across the payments industry, and
        Chargebee, Stripe, and a dedicated recovery tool can all mean something structurally different by
        the same word. Chargebee&apos;s dunning is a configured schedule you own; Stripe Smart Retries is
        a network-trained timing model at the charge level; a recovery layer on top typically adds
        decline-reason branching and copy on top of whichever of the two is actually firing the retry.
      </Callout>
      <DunningHandoffFlow />

      <H2 id="default-schedule">What the default retry schedule actually looks like</H2>
      <P>
        A typical Chargebee dunning configuration spreads a handful of retry attempts across roughly the
        first one to two weeks after an invoice first fails, then stops. Exactly how many attempts and how
        many days apart is something you set in Chargebee&apos;s dunning settings for each site or plan —
        there is no single universal default that applies to every account, so the specific numbers below
        are illustrative of the shape of a schedule, not a claim about what your account is currently
        configured to do. What matters structurally, regardless of the exact numbers you&apos;ve set: the
        schedule is finite, it runs on calendar days rather than being aware of weekends or the
        customer&apos;s likely payday, and it stops completely once the last configured attempt has run.
      </P>
      <InBodyImage
        file="/blog/chargebee-dunning-img-1"
        alt="A ten-day calendar strip showing Chargebee's configurable dunning schedule: retry attempts on a handful of scheduled days, with the final attempt on day 7 ending the schedule and the subscription marked unpaid if it still fails"
        caption="Chargebee's dunning schedule is a bounded loop you configure — a fixed number of attempts on fixed days, then a hard stop. Nothing outside that window retries automatically."
      />
      <P>
        The practical risk in this shape is the same one that shows up in almost every rule-based
        (non-adaptive) retry system: a schedule tuned for the average case can be badly mistimed for any
        specific invoice. A customer whose card was declined for insufficient funds right before a payday
        might recover instantly on a retry scheduled two days later — or might still be short on day 2 and
        recover cleanly on day 9, well past where a tight four-attempt schedule already gave up. Widening
        the schedule to cover more of that variance is possible, but it trades off against how many days a
        subscription sits in an unpaid, dunning state before either recovering or being cancelled — which
        has its own cost in a customer&apos;s perception of your billing reliability.
      </P>

      <H2 id="the-gaps">The gaps a default Chargebee dunning configuration doesn&apos;t cover</H2>
      <P>
        None of what follows is a bug in Chargebee — it is simply outside what a configurable, rule-based
        dunning schedule is designed to do by default. These are the three gaps we see most often when
        looking at a merchant&apos;s existing Chargebee setup, roughly in order of how much recoverable
        revenue each one tends to represent.
      </P>
      <CompareTable
        rows={[
          ['Gap', 'What Chargebee does by default', 'What it costs'],
          ['Decline-reason branching', 'Sends the same templated email at each scheduled step, regardless of why the card failed', 'A customer with an expired card gets a passive "we\'ll try again" message instead of the one action that would actually fix it'],
          ['Historical exhausted invoices', 'Stops retrying entirely once the configured schedule ends; the invoice stays unpaid', 'Invoices that failed months ago and never recovered sit untouched indefinitely unless someone manually revisits them'],
          ['Send-time personalization', 'Sends reminder emails on the scheduled calendar day, not tuned to a specific customer\'s likely payday or timezone', 'A well-timed reminder converts meaningfully better than the same copy sent at a mistimed moment — timing is left on the table'],
        ]}
      />

      <H3>Gap 1: no automatic branching by decline reason</H3>
      <P>
        Chargebee generally forwards the specific decline detail your connected gateway returns, and you
        can see it manually on the invoice or transaction record. What the standard dunning configuration
        does not do out of the box is route that decline reason into different email copy or different
        retry timing automatically. An expired card, a temporarily insufficient-funds decline, and a bank
        flagging the charge as suspicious (a <code>do_not_honor</code>-style response) are three
        completely different situations that call for three different messages and, arguably, three
        different retry cadences — yet a default Chargebee configuration commonly sends the same wording
        for all three unless you build that branching logic yourself.
      </P>
      <InBodyImage
        file="/blog/chargebee-dunning-img-2"
        alt="Side by side comparison: one generic 'your payment failed' email template sent for every decline reason, versus three decline-reason-branched templates for insufficient funds, expired card, and bank decline, each with different, more actionable copy"
        caption="The same failed invoice, told three different (and more useful) ways depending on why it actually failed — versus one generic template that fits none of them perfectly."
      />
      <P>
        Our separate guide on{' '}
        <A href="/blog/soft-decline-vs-hard-decline">soft decline vs. hard decline</A> covers the
        underlying distinction in more depth: a soft decline (insufficient funds, a temporary processor
        issue) is usually recoverable with time and a well-timed retry, while a hard decline (an expired
        or stolen card, a closed account) will keep failing no matter how many times you retry the same
        card number — it needs the customer to actually update their payment method. A dunning schedule
        that retries a hard decline five times on the same card is not just ineffective, it wastes
        attempts and annoys the customer with repeated failure notices for something a retry was never
        going to fix.
      </P>

      <H3>Gap 2: invoices that already exhausted the schedule stay untouched</H3>
      <P>
        This is the gap we see cost the most, quietly, over time. Once Chargebee&apos;s configured dunning
        schedule runs out for a given invoice and the &ldquo;dunning exhausted&rdquo; action fires
        (commonly pausing or cancelling the subscription), nothing in Chargebee automatically comes back
        to that specific invoice later. It sits in a past-due or unpaid state, permanently, unless a person
        manually revisits it, the customer proactively reaches out to update their card, or a separate
        process specifically re-approaches that historical backlog.
      </P>
      <InlineCTA>
        Revova&apos;s Lost Revenue Finder connects read-only to your Chargebee account and scans your
        entire invoice history — including invoices that already exhausted your dunning schedule months
        ago — to show exactly how much is sitting there unrecovered. No credit card required to run it.
      </InlineCTA>
      <P>
        The reason this backlog builds up invisibly is structural, not a failure of attention: a dunning
        schedule is designed to handle a failure once, at the time it happens, and then hand off to
        whatever &ldquo;exhausted&rdquo; action you configured. It was never designed to periodically
        re-scan old, already-exhausted invoices on its own — that would be a fundamentally different kind
        of system, closer to what our{' '}
        <A href="/blog/historical-payment-recovery-guide">historical payment recovery guide</A> describes
        in more general terms across any processor, Chargebee included.
      </P>

      <H3>Gap 3: send timing is calendar-based, not customer-aware</H3>
      <P>
        A reminder scheduled for &ldquo;day 5&rdquo; fires on day 5 for every affected customer, regardless
        of that customer&apos;s typical payday, timezone, or how likely their specific bank is to have
        cleared a temporary hold by then. This is a smaller effect than the first two gaps, but it compounds
        with them — a decline-reason-aware email sent at a mistimed moment still recovers less than the
        same email sent when the customer is actually in a position to act on it.
      </P>

      <InBodyImage
        file="/blog/chargebee-dunning-img-3"
        alt="Diagram showing invoices that already exhausted Chargebee's dunning schedule sitting in an untouched past-due pile on one side, versus a historical scan reading invoice history directly and surfacing them for recovery on the other"
        caption="Invoices that already ran out the built-in schedule don't disappear — they sit in a past-due pile that nothing revisits automatically, unless something reads the historical record directly."
      />

      <H2 id="how-to-configure">How to configure Chargebee dunning for better recovery today</H2>
      <P>
        None of the following requires leaving Chargebee or adding a new tool — these are adjustments
        available directly in Chargebee&apos;s own dunning settings, worth checking regardless of whether
        you eventually add a recovery layer on top.
      </P>
      <OL>
        <LI>
          <Strong>Open your current dunning schedule and write down what it actually is.</Strong> Most
          teams configured this once, at setup, and haven&apos;t revisited it since — confirm the number of
          attempts, the day intervals between them, and the &ldquo;dunning exhausted&rdquo; action
          currently set for each plan.
        </LI>
        <LI>
          <Strong>Separate your hard-decline handling from your soft-decline handling.</Strong> For
          declines that clearly need a new payment method (expired card, closed account), the highest-
          leverage change is making the first email explicit about that — &ldquo;update your card&rdquo;
          rather than a passive &ldquo;we&apos;ll try again&rdquo; — since retrying the same card
          repeatedly on a hard decline wastes every remaining attempt in the schedule.
        </LI>
        <LI>
          <Strong>Widen (or shorten) the schedule based on your actual billing cycle, not a default.</Strong>{' '}
          A monthly plan and an annual plan carry very different stakes for how long an invoice should stay
          in dunning before the exhausted action fires — our{' '}
          <A href="/blog/reduce-annual-plan-renewal-failures">annual plan renewal guide</A> covers why
          annual renewals in particular benefit from a longer runway than a default monthly-tuned schedule
          gives them.
        </LI>
        <LI>
          <Strong>Rewrite the default email copy to be specific and actionable.</Strong> Generic
          &ldquo;your payment failed&rdquo; wording performs worse than copy that states plainly what
          happened and what the one next action is — see our{' '}
          <A href="/blog/dunning-email-examples-templates">dunning email examples and templates</A> for
          copy patterns organized by exactly this kind of decline-reason branching.
        </LI>
        <LI>
          <Strong>Confirm your dunning emails are actually reaching the inbox.</Strong> A perfectly
          configured schedule sending well-branched copy still recovers nothing if the emails are landing in
          spam — check SPF, DKIM, and DMARC per our{' '}
          <A href="/blog/dunning-email-deliverability-guide">dunning email deliverability guide</A>, since
          this is a separate layer entirely from anything in Chargebee&apos;s own settings.
        </LI>
        <LI>
          <Strong>Decide, deliberately, what happens to invoices once the schedule is exhausted.</Strong>{' '}
          Whether that&apos;s a manual monthly review of past-due invoices, or a connected tool that
          re-scans them automatically, an explicit decision beats the default of nothing happening at all.
        </LI>
      </OL>

      <InlineCTA>
        Revova&apos;s AI writes decline-reason-branched recovery emails automatically and pairs them with a
        historical scan of your Chargebee invoice history. Starter is $29/month, Pro is $79/month, both
        with a 14-day free trial and no credit card required.
      </InlineCTA>

      <H2 id="honest-limits">What a recovery layer can honestly add on top of Chargebee — and what it can&apos;t</H2>
      <P>
        Being precise about the boundary here matters more than a feature list. Chargebee remains the
        system of record for your subscriptions, invoices, and billing logic — that does not change when
        you add a recovery layer on top, and no tool that connects read-only to Chargebee should claim
        otherwise. What a recovery layer like Revova adds is specifically the three gaps covered above:
        decline-reason-aware email copy generated automatically instead of one generic template, a
        historical scan across invoices that already exhausted Chargebee&apos;s own schedule, and send-time
        tuning around when a specific customer is more likely to act.
      </P>
      <ProsCons
        pros={[
          'Chargebee\'s native dunning is already configured and working — no need to rip anything out or migrate billing logic.',
          'Adjusting the schedule, email copy, and exhausted-action settings directly in Chargebee costs nothing and can meaningfully improve recovery on its own.',
          'A recovery layer connects read-only, so Chargebee stays the single source of truth for subscription state.',
        ]}
        cons={[
          'Decline-reason branching and a historical scan require either custom engineering work inside Chargebee\'s webhook/API layer, or a separate connected tool — neither is free.',
          'A recovery layer cannot fix a deliverability problem in your sending domain by itself — that still requires the SPF/DKIM/DMARC work covered in our deliverability guide.',
          'Some of what a recovery layer adds (AI-personalized copy, automatic historical scans) is genuinely new functionality, not something you can toggle on inside Chargebee\'s existing settings.',
        ]}
      />
      <P>
        Full plan details, including exactly what&apos;s included on Starter versus Pro, are on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>

      <InlineCTA>
        See what your Chargebee invoice history already shows: run Revova&apos;s free Lost Revenue Finder —
        read-only, connects in minutes, no card required.
      </InlineCTA>

      <H2 id="audit">How to audit your current Chargebee dunning setup, starting today</H2>
      <UL>
        <LI>
          <Strong>Pull up your dunning settings for every active plan</Strong> in Chargebee and confirm the
          retry count, day intervals, and exhausted action match what you&apos;d actually choose today,
          rather than whatever was configured at initial setup.
        </LI>
        <LI>
          <Strong>Read your current dunning emails as if you were the customer</Strong> who just had a card
          expire, and separately as a customer who was just temporarily short on funds — if the email reads
          identically for both, that is the decline-reason gap described above, live in your account right
          now.
        </LI>
        <LI>
          <Strong>Filter your invoices for a past-due or unpaid status</Strong> older than your configured
          dunning window, and count how many there are — that count, multiplied by average invoice value,
          is a rough floor on what the historical-exhausted-invoice gap has already cost.
        </LI>
        <LI>
          <Strong>Check your sending domain&apos;s SPF, DKIM, and DMARC records</Strong> independently of
          anything in Chargebee&apos;s settings — a schedule and copy problem and a deliverability problem
          look identical from the outside (low recovery rate) but need completely different fixes.
        </LI>
        <LI>
          <Strong>Run a historical scan against your actual Chargebee invoice data</Strong> if you want a
          precise number rather than a rough estimate — this reads invoice state directly and does not
          depend on Chargebee&apos;s own dunning schedule having been configured correctly at the time.
        </LI>
      </UL>

      <Divider />

      <P>
        For Chargebee&apos;s own documentation on configuring dunning management, retry schedules, and
        exhausted-action settings, see{' '}
        <A href="https://www.chargebee.com/docs/2.0/dunning.html">Chargebee&apos;s dunning management documentation</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Your Chargebee dunning schedule is only as good as what it can't see"
        body="Revova connects read-only to Chargebee, adds decline-reason-aware recovery emails on top of your existing schedule, and scans your full invoice history for anything that already exhausted dunning and went unrecovered. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
