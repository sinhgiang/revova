import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is Recurly\'s Dunning Cycle, exactly?',
    a: "Recurly's Dunning Cycle is the built-in system that automatically re-attempts a subscription payment after it first fails, on a schedule you configure per plan and currency inside Recurly's own settings, while sending a matching sequence of reminder emails to the account holder. You set the number of retry attempts and the number of days between them once, and every account that enters a past_due state from that point forward follows the same configured cycle until it either recovers or the cycle runs out and the configured expiration action fires.",
  },
  {
    q: 'What does Recurly Account Updater actually do?',
    a: "Account Updater is a real, distinctive feature: it automatically refreshes stored card data — a new expiration date or a reissued card number — by checking against the Visa and Mastercard account updater networks, without requiring the customer to do anything. It genuinely helps with one specific cause of failed payments: a card that expired or was reissued but is otherwise still valid. It does nothing for a decline caused by insufficient funds, a bank flagging the charge as suspicious, or any other reason the card issuer actually rejects the charge rather than the card data simply being stale.",
  },
  {
    q: 'Does Recurly use machine-learning-based smart retries like Stripe does?',
    a: "No. Recurly's Dunning Cycle is rule-based and configured by you — a fixed set of retry days that applies uniformly to every past_due account on that plan and currency, regardless of the specific decline reason returned by the gateway. Stripe Smart Retries, by contrast, uses a model trained across Stripe's own transaction network to pick a statistically better retry time for a specific declined charge. If Stripe happens to be the gateway underneath your Recurly account, some of that charge-level timing intelligence can still apply to the individual attempt, but the cycle wrapped around it — how many attempts, how far apart, what emails go out — is the configurable layer Recurly itself controls.",
  },
  {
    q: 'What happens when Recurly\'s Dunning Cycle finishes without recovering the payment?',
    a: "That depends on the expiration action you configured for the plan — commonly the subscription is marked canceled or the account is left past_due, and nothing in Recurly automatically retries that specific account again after that point. The account's billing history still shows the failed attempts, but the built-in cycle itself does not revisit it, unless a person manually intervenes, the customer proactively updates their payment method, or a separate process specifically re-approaches that historical backlog.",
  },
  {
    q: 'Can I customize the Dunning Cycle email templates in Recurly?',
    a: "Yes — Recurly lets you edit the subject line and body of each email in the cycle, and you can use merge fields for the account holder's name, plan, and amount due. What the standard Dunning Cycle configuration does not do natively is automatically change that email copy based on the specific decline reason the gateway returned. An expired card, a temporarily insufficient-funds decline, and a bank-flagged charge commonly receive the same templated wording at each scheduled step unless you build separate branching logic yourself, which is one of the gaps covered later in this guide.",
  },
  {
    q: 'How many retry attempts should I configure in Recurly\'s Dunning Cycle?',
    a: "There is no single correct number, and the right count depends on your billing cycle length, average transaction value, and how tolerant your customers are of repeated reminder emails. What holds true regardless of the exact count: a cycle with too few attempts spaced too close together mostly just re-catches the same instantly-failing hard declines and burns through its remaining attempts on accounts that were never going to recover on a retry alone. A cycle spread too far apart risks a recoverable soft decline sitting un-retried long enough that the customer has already found an alternative or emotionally churned before Recurly tries again.",
  },
  {
    q: 'Does Recurly tell me the specific decline reason for a failed payment?',
    a: "Recurly generally surfaces whatever decline detail the connected gateway returns, visible on the transaction record inside Recurly's dashboard. The nuance is that Recurly's own Dunning Cycle and default email templates don't automatically route that decline reason into different retry timing or different email copy — the data is there to see manually, it just isn't automatically branched by Recurly's standard configuration without custom work on your end.",
  },
  {
    q: 'Can I run Recurly\'s Dunning Cycle and a third-party recovery tool at the same time?',
    a: "Yes, and for many teams that is exactly the right setup — Recurly stays the system of record for subscriptions and billing, while a recovery layer on top adds what the native Dunning Cycle doesn't do by default: decline-reason-aware email branching and a historical scan across accounts that already exhausted the cycle and went unrecovered. Revova connects to Recurly read-only for exactly this reason — it doesn't replace Recurly's billing engine, it adds a recovery layer around what Recurly already tracks.",
  },
  {
    q: 'Is Account Updater a substitute for a dunning or recovery strategy?',
    a: "No, and treating it as one is a common mistake. Account Updater solves a narrow, specific problem — stale card data on an otherwise valid card — silently and automatically, which is genuinely valuable. It does not touch the much larger set of failures caused by insufficient funds, temporary bank holds, or a card being flagged as suspicious, all of which still need a working Dunning Cycle, decline-aware messaging, and in many cases a recovery layer on top to close the remaining gap.",
  },
  {
    q: 'How is this different from your general historical payment recovery guide?',
    a: "They cover two different layers. Our separate historical payment recovery guide describes, in processor-agnostic terms, why any dunning system — Recurly's included — stops looking at an invoice once its own schedule ends, and how a historical scan closes that gap regardless of which platform is underneath. This guide is specific to Recurly: how its Dunning Cycle and Account Updater actually work, what they do and don't cover today, and the concrete settings worth checking in a Recurly account specifically.",
  },
]

// The point where Recurly's own configurable Dunning Cycle hands off (or
// doesn't) to whatever happens next — an account being marked canceled with
// nothing further automatically re-attempting it.
function DunningCycleHandoffFlow() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 820 360" width="820" height="360" className="w-full h-auto" role="img"
        aria-label="A subscription payment fails in Recurly, moving the account into past_due and starting the configured Dunning Cycle of retries and reminder emails. If a retry succeeds, the account returns to active. If every configured retry fails, the expiration action fires — commonly canceling the subscription — and nothing automatically retries that account again after that point">
        <defs>
          <marker id="rdA" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#cbd5e1" />
          </marker>
        </defs>
        <g fontFamily="Segoe UI, Arial, sans-serif">
          <rect x="15" y="140" width="160" height="60" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="95" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">Payment fails,</text>
          <text x="95" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">account past_due</text>

          <path d="M175 170 L203 170" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#rdA)" fill="none" />

          <rect x="207" y="140" width="210" height="60" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
          <text x="312" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">Configured Dunning</text>
          <text x="312" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">Cycle runs</text>

          <path d="M417 170 L445 170" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#rdA)" fill="none" />

          <rect x="449" y="140" width="175" height="60" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
          <text x="536" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e">Retries + reminder</text>
          <text x="536" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e">emails, on schedule</text>

          <path d="M500 200 C 470 230, 440 240, 400 250" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#rdA)" fill="none" />
          <path d="M570 200 C 610 230, 650 240, 690 250" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#rdA)" fill="none" />

          <rect x="290" y="254" width="200" height="54" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
          <text x="390" y="278" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">A retry succeeds —</text>
          <text x="390" y="295" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">account active again</text>

          <rect x="600" y="254" width="205" height="54" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
          <text x="702" y="278" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9f1239">Every retry fails —</text>
          <text x="702" y="295" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">cycle exhausted</text>

          <path d="M702 308 L702 322" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#rdA)" fill="none" />
          <rect x="585" y="326" width="235" height="30" rx="10" fill="#fff1f2" stroke="#fda4af" strokeWidth="1" />
          <text x="702" y="346" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">Subscription canceled — nothing retries it further</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">
        Recurly&apos;s Dunning Cycle is a bounded, configurable loop — once every configured attempt has run, whatever expiration action you set fires, and nothing keeps trying that specific account automatically after that.
      </figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        Recurly&apos;s Dunning Cycle is the built-in system that automatically re-attempts a
        subscription payment after it first fails, on a schedule of retry days and reminder emails
        you configure once per plan and currency in Recurly&apos;s own settings. Alongside it sits
        Account Updater, a genuinely distinctive feature that quietly refreshes stale card data
        through the Visa and Mastercard networks. Both are real, working mechanisms — not
        placeholders — and together they recover a meaningful share of failed payments without any
        extra tooling. But recovering <em>some</em> failed payments and recovering{' '}
        <em>everything recoverable</em> are two different claims, and the gap between them is where
        a surprising amount of quietly lost revenue tends to sit: a fixed cycle that treats every
        decline the same way, an email template that doesn&apos;t change based on <em>why</em> the
        card failed, a hard stop once the configured attempts run out, and a strength (Account
        Updater) that only ever solves one specific slice of the problem.
      </Lead>
      <P>
        This guide walks through how Recurly&apos;s Dunning Cycle and Account Updater actually work
        under the hood, the specific settings worth checking today, the handful of gaps that are
        easy to miss because Recurly never surfaces them as a warning, and an honest look at what a
        recovery layer added on top of Recurly can and cannot do that Recurly&apos;s native tools
        don&apos;t already cover. Revova connects to Recurly directly (read-only) alongside Stripe,
        Paddle, Braintree, and Chargebee, so the limitations described here are ones we have had to
        design around ourselves, not secondhand speculation about a platform we don&apos;t actually
        integrate with.
      </P>

      <KeyTakeaways
        items={[
          <>Recurly&apos;s Dunning Cycle is <Strong>rule-based and configurable per plan and currency</Strong> — a fixed schedule of retry days and reminder emails, not a per-decline machine-learning model like Stripe Smart Retries.</>,
          <>Account Updater is a <Strong>genuine differentiator</Strong> — it automatically refreshes expired or reissued card data via the Visa/Mastercard networks, with zero customer action required. It does not help with true declines like insufficient funds.</>,
          <>The default configuration commonly sends the <Strong>same email copy regardless of decline reason</Strong> — an expired card and a temporarily insufficient-funds decline get identical wording, even though the right customer action differs completely.</>,
          <>Once the configured Dunning Cycle is exhausted, the account typically is <Strong>canceled or left past_due</Strong> per your expiration setting, and nothing automatically retries that specific account again afterward.</>,
          <>A recovery layer added on top of Recurly (like Revova) can add decline-aware email branching and a historical scan across already-exhausted accounts, without replacing Recurly as the system of record for billing.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription payments fail or get declined in a typical billing cycle across the industry' },
          { value: '1 template', label: 'is what most default Recurly Dunning Cycle configurations send for every decline reason, unless branching is built manually' },
          { value: '0 retries', label: 'happen automatically once the configured Dunning Cycle is exhausted for a given account' },
        ]}
      />

      <H2 id="how-it-works">How Recurly&apos;s Dunning Cycle actually works</H2>
      <P>
        Recurly&apos;s Dunning Cycle lives in the billing settings of your Recurly site, and — like
        the equivalent setting in most subscription billing platforms — it applies at the plan and
        currency level rather than being something you configure per individual customer. When a
        subscription payment attempt fails, whether the failure comes back from Braintree, Stripe,
        or whichever gateway you have connected underneath Recurly, the account moves into a
        past_due state. From there, Recurly runs through the cycle you configured: a set number of
        retry attempts, spaced a set number of days apart, each one paired with a reminder email sent
        to the account holder around the same time.
      </P>
      <P>
        This is meaningfully different from how Stripe&apos;s own Smart Retries feature works at the
        charge level, and conflating the two is a common source of confusion. Stripe Smart Retries
        uses a model trained across Stripe&apos;s network of transactions to estimate the
        statistically best moment to re-attempt a specific declined charge. Recurly&apos;s Dunning
        Cycle, by contrast, is a configuration you set — the same day intervals apply to every
        past_due account on that plan and currency, regardless of the specific reason the card was
        declined. If Stripe happens to be the gateway underneath your Recurly account, some of that
        charge-level retry intelligence can still be in play for the individual attempt itself, but
        the cycle wrapped around it — how many attempts, how far apart, what emails go out — is the
        configurable layer Recurly itself controls.
      </P>
      <Callout title="Same word, two different mechanisms">
        &ldquo;Dunning&rdquo; and &ldquo;retry&rdquo; get used loosely across the payments industry,
        and Recurly, Stripe, and a dedicated recovery tool can all mean something structurally
        different by the same word. Recurly&apos;s Dunning Cycle is a configured schedule you own;
        Stripe Smart Retries is a network-trained timing model at the charge level; a recovery layer
        on top typically adds decline-reason branching and copy on top of whichever of the two is
        actually firing the retry.
      </Callout>
      <DunningCycleHandoffFlow />

      <H2 id="default-cycle-shape">What the default Dunning Cycle actually looks like</H2>
      <P>
        A typical Recurly Dunning Cycle spreads a handful of retry attempts across roughly the first
        one to two weeks after a payment first fails, then stops. Exactly how many attempts and how
        many days apart is something you set per plan and currency in Recurly&apos;s dunning
        settings — there is no single universal default that applies to every account, so the
        specific numbers below are illustrative of the shape of a cycle, not a claim about what your
        account is currently configured to do. What matters structurally, regardless of the exact
        numbers you&apos;ve set: the cycle is finite, it runs on calendar days rather than being
        aware of weekends or the customer&apos;s likely payday, and it stops completely once the last
        configured attempt has run.
      </P>
      <InBodyImage
        file="/blog/recurly-dunning-img-1"
        alt="A twelve-day calendar strip showing Recurly's configurable Dunning Cycle: retry attempts on a handful of scheduled days, with the final attempt on day 12 ending the cycle and the account marked expired/failed if it still fails"
        caption="Recurly's Dunning Cycle is a bounded loop you configure per plan and currency — a fixed number of attempts on fixed days, then a hard stop. Nothing outside that window retries automatically."
      />
      <P>
        The practical risk in this shape is the same one that shows up in almost every rule-based
        (non-adaptive) retry system: a cycle tuned for the average case can be badly mistimed for any
        specific account. A customer whose card was declined for insufficient funds right before a
        payday might recover instantly on a retry scheduled two days later — or might still be short
        on day 2 and recover cleanly on day 11, well past where a tight cycle already gave up.
        Widening the cycle to cover more of that variance is possible, but it trades off against how
        long a subscription sits in a past_due state before either recovering or being canceled,
        which has its own cost in a customer&apos;s perception of your billing reliability.
      </P>

      <H2 id="account-updater">Account Updater: a real strength, worth crediting honestly</H2>
      <P>
        Recurly&apos;s Account Updater is the one feature in this comparison that is genuinely
        distinctive rather than a variation on what every subscription billing platform already
        offers. Rather than waiting for a payment to fail because a card expired or was reissued,
        Account Updater periodically checks stored card data against the Visa and Mastercard account
        updater networks and refreshes it automatically — a new expiration date, a new card number
        after a reissue — with zero action required from the customer. When it works, the payment
        that would otherwise have failed on an expired card simply succeeds, silently, and nobody
        ever sees a decline at all.
      </P>
      <InBodyImage
        file="/blog/recurly-dunning-img-2"
        alt="Diagram showing a card on file with an expired date going through Recurly's Account Updater, which checks the Visa and Mastercard networks and returns a refreshed card with an updated expiration date automatically, with a caption noting it doesn't help with true declines like insufficient funds"
        caption="Account Updater fixes stale card data automatically and silently — a real strength. It has no effect on declines that aren't about the card data itself being out of date."
      />
      <P>
        The honest caveat, and the reason this section exists rather than just being folded into a
        features list, is that Account Updater solves exactly one category of payment failure: stale
        card data on a card that is otherwise still valid. It has no effect whatsoever on a decline
        caused by insufficient funds, a bank flagging the charge as suspicious, a closed account, or
        any other reason the issuer actually rejects the charge rather than the card number or
        expiration date simply being out of date. Coverage also depends on the issuing bank and card
        network actually participating in the update program, which is common for major U.S. and
        international issuers but not universal — Account Updater raises your recovery rate on one
        real, common failure mode, it does not eliminate failed payments as a category.
      </P>
      <Callout title="Not a substitute for the rest of your recovery stack">
        It is worth being precise here: Account Updater is a strength worth choosing Recurly for if
        expired-card churn is a meaningful share of your failures, and it is not something Stripe,
        Chargebee, or Braintree offer in quite the same automatic, network-level form. But it sits
        entirely upstream of the Dunning Cycle and decline-reason gaps covered in the rest of this
        guide — a subscription can have a perfectly fresh, valid card on file and still fail on
        insufficient funds, a temporary bank hold, or a fraud flag, none of which Account Updater
        touches at all.
      </Callout>

      <H2 id="the-gaps">The gaps a default Recurly configuration doesn&apos;t cover</H2>
      <P>
        None of what follows is a bug in Recurly — it is simply outside what a configurable,
        rule-based Dunning Cycle plus a card-data-refresh feature are designed to do by default.
        These are the three gaps we see most often when looking at a merchant&apos;s existing Recurly
        setup, roughly in order of how much recoverable revenue each one tends to represent.
      </P>
      <CompareTable
        rows={[
          ['Gap', 'What Recurly does by default', 'What it costs'],
          ['Decline-reason branching', 'Sends the same templated email at each scheduled step, regardless of why the payment failed', 'A customer with an insufficient-funds decline gets the same wording as one with a fraud-flagged charge, instead of the message that actually fits their situation'],
          ['Historical exhausted accounts', 'Stops retrying entirely once the configured Dunning Cycle ends; the account stays past_due or canceled', 'Accounts that failed months ago and never recovered sit untouched indefinitely unless someone manually revisits them'],
          ['Send-time personalization', 'Sends reminder emails on the scheduled calendar day, not tuned to a specific customer\'s likely payday or timezone', 'A well-timed reminder converts meaningfully better than the same copy sent at a mistimed moment — timing is left on the table'],
        ]}
      />

      <H3>Gap 1: no automatic branching by decline reason</H3>
      <P>
        Recurly generally surfaces the specific decline detail your connected gateway returns, and
        you can see it manually on the transaction record. What the standard Dunning Cycle
        configuration does not do out of the box is route that decline reason into different email
        copy or different retry timing automatically. An insufficient-funds decline, a bank flagging
        the charge as suspicious (a <code>do_not_honor</code>-style response), and — separately from
        what Account Updater already handles — a card that failed for a reason other than stale data
        are different situations that call for different messages and, arguably, different retry
        cadences, yet a default Recurly configuration commonly sends the same wording for all of them
        unless you build that branching logic yourself.
      </P>
      <InBodyImage
        file="/blog/recurly-dunning-img-3"
        alt="Side by side comparison: one generic 'your payment failed' email template sent for every decline reason, versus three decline-reason-branched templates for insufficient funds, expired card, and bank decline, each with different, more actionable copy"
        caption="The same failed payment, told three different (and more useful) ways depending on why it actually failed — versus one generic template that fits none of them perfectly."
      />
      <P>
        Our separate guide on{' '}
        <A href="/blog/soft-decline-vs-hard-decline">soft decline vs. hard decline</A> covers the
        underlying distinction in more depth: a soft decline (insufficient funds, a temporary
        processor issue) is usually recoverable with time and a well-timed retry, while a hard
        decline (a closed account, a card flagged as stolen) will keep failing no matter how many
        times you retry it — it needs the customer to actually update their payment method. A Dunning
        Cycle that retries a hard decline repeatedly on the same card is not just ineffective, it
        wastes attempts and annoys the customer with repeated failure notices for something a retry
        was never going to fix.
      </P>

      <H3>Gap 2: accounts that already exhausted the cycle stay untouched</H3>
      <P>
        This is the gap we see cost the most, quietly, over time. Once Recurly&apos;s configured
        Dunning Cycle runs out for a given account and the expiration action fires (commonly
        canceling the subscription), nothing in Recurly automatically comes back to that specific
        account later. It sits past_due or canceled, permanently, unless a person manually revisits
        it, the customer proactively reaches out to update their payment method, or a separate
        process specifically re-approaches that historical backlog.
      </P>
      <InlineCTA>
        Revova&apos;s Lost Revenue Finder connects read-only to your Recurly account and scans your
        entire billing history — including accounts that already exhausted your Dunning Cycle months
        ago — to show exactly how much is sitting there unrecovered. No credit card required to run it.
      </InlineCTA>
      <P>
        The reason this backlog builds up invisibly is structural, not a failure of attention: a
        Dunning Cycle is designed to handle a failure once, at the time it happens, and then hand off
        to whatever expiration action you configured. It was never designed to periodically re-scan
        old, already-exhausted accounts on its own — that would be a fundamentally different kind of
        system, closer to what our{' '}
        <A href="/blog/historical-payment-recovery-guide">historical payment recovery guide</A>{' '}
        describes in more general terms across any processor, Recurly included.
      </P>

      <H3>Gap 3: send timing is calendar-based, not customer-aware</H3>
      <P>
        A reminder scheduled for &ldquo;day 5&rdquo; fires on day 5 for every affected customer,
        regardless of that customer&apos;s typical payday, timezone, or how likely their specific
        bank is to have cleared a temporary hold by then. This is a smaller effect than the first two
        gaps, but it compounds with them — a decline-reason-aware email sent at a mistimed moment
        still recovers less than the same email sent when the customer is actually in a position to
        act on it.
      </P>

      <InBodyImage
        file="/blog/recurly-dunning-img-4"
        alt="Diagram showing accounts that already exhausted Recurly's Dunning Cycle sitting in an untouched past-due pile on one side, versus a historical scan reading account history directly and surfacing them for recovery on the other"
        caption="Accounts that already ran out the built-in cycle don't disappear — they sit in a past-due pile that nothing revisits automatically, unless something reads the historical record directly."
      />

      <H2 id="how-to-configure">How to configure Recurly for better recovery today</H2>
      <P>
        None of the following requires leaving Recurly or adding a new tool — these are adjustments
        available directly in Recurly&apos;s own settings, worth checking regardless of whether you
        eventually add a recovery layer on top.
      </P>
      <OL>
        <LI>
          <Strong>Open your current Dunning Cycle settings for every plan and currency and write
          down what they actually are.</Strong> Most teams configured this once, at setup, and
          haven&apos;t revisited it since — confirm the number of attempts, the day intervals between
          them, and the expiration action currently set.
        </LI>
        <LI>
          <Strong>Confirm Account Updater is actually turned on.</Strong> It is a genuine, free win
          for expired-card churn specifically, and it is easy to assume it is running when it
          isn&apos;t enabled or when your issuing banks aren&apos;t all participating in the update
          program.
        </LI>
        <LI>
          <Strong>Separate your hard-decline handling from your soft-decline handling.</Strong> For
          declines that clearly need a new payment method, the highest-leverage change is making the
          first email explicit about that — &ldquo;update your payment method&rdquo; rather than a
          passive &ldquo;we&apos;ll try again&rdquo; — since retrying the same card repeatedly on a
          hard decline wastes every remaining attempt in the cycle.
        </LI>
        <LI>
          <Strong>Widen (or shorten) the cycle based on your actual billing cycle, not a default.</Strong>{' '}
          A monthly plan and an annual plan carry very different stakes for how long an account
          should stay past_due before the expiration action fires — our{' '}
          <A href="/blog/reduce-annual-plan-renewal-failures">annual plan renewal guide</A> covers
          why annual renewals in particular benefit from a longer runway than a default
          monthly-tuned cycle gives them.
        </LI>
        <LI>
          <Strong>Rewrite the default email copy to be specific and actionable.</Strong> Generic
          &ldquo;your payment failed&rdquo; wording performs worse than copy that states plainly what
          happened and what the one next action is — see our{' '}
          <A href="/blog/dunning-email-examples-templates">dunning email examples and templates</A>{' '}
          for copy patterns organized by exactly this kind of decline-reason branching.
        </LI>
        <LI>
          <Strong>Confirm your Dunning Cycle emails are actually reaching the inbox.</Strong> A
          perfectly configured cycle sending well-branched copy still recovers nothing if the emails
          are landing in spam — check SPF, DKIM, and DMARC per our{' '}
          <A href="/blog/dunning-email-deliverability-guide">dunning email deliverability guide</A>,
          since this is a separate layer entirely from anything in Recurly&apos;s own settings.
        </LI>
      </OL>

      <InlineCTA>
        Revova&apos;s AI writes decline-reason-branched recovery emails automatically and pairs them
        with a historical scan of your Recurly billing history. Starter is $29/month, Pro is
        $79/month, both with a 14-day free trial and no credit card required.
      </InlineCTA>

      <H2 id="honest-limits">What a recovery layer can honestly add on top of Recurly — and what it can&apos;t</H2>
      <P>
        Being precise about the boundary here matters more than a feature list. Recurly remains the
        system of record for your subscriptions and billing logic — that does not change when you add
        a recovery layer on top, and no tool that connects read-only to Recurly should claim
        otherwise. What a recovery layer like Revova adds is specifically the gaps covered above:
        decline-reason-aware email copy generated automatically instead of one generic template, and
        a historical scan across accounts that already exhausted Recurly&apos;s own Dunning Cycle.
        Account Updater keeps doing what it already does well — refreshing stale card data — and a
        recovery layer does not need to, and should not try to, replicate that.
      </P>
      <ProsCons
        pros={[
          'Recurly\'s Account Updater and Dunning Cycle are already configured and working — no need to rip anything out or migrate billing logic.',
          'Adjusting the cycle, email copy, and expiration-action settings directly in Recurly costs nothing and can meaningfully improve recovery on its own.',
          'A recovery layer connects read-only, so Recurly stays the single source of truth for subscription state.',
        ]}
        cons={[
          'Decline-reason branching and a historical scan require either custom engineering work inside Recurly\'s webhook/API layer, or a separate connected tool — neither is free.',
          'A recovery layer cannot fix a deliverability problem in your sending domain by itself — that still requires the SPF/DKIM/DMARC work covered in our deliverability guide.',
          'Some of what a recovery layer adds (AI-personalized copy, automatic historical scans) is genuinely new functionality, not something you can toggle on inside Recurly\'s existing settings.',
        ]}
      />
      <P>
        Full plan details, including exactly what&apos;s included on Starter versus Pro, are on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>

      <InlineCTA>
        See what your Recurly billing history already shows: run Revova&apos;s free Lost Revenue
        Finder — read-only, connects in minutes, no card required.
      </InlineCTA>

      <H2 id="audit">How to audit your current Recurly setup, starting today</H2>
      <UL>
        <LI>
          <Strong>Pull up your Dunning Cycle settings for every active plan and currency</Strong> in
          Recurly and confirm the retry count, day intervals, and expiration action match what
          you&apos;d actually choose today, rather than whatever was configured at initial setup.
        </LI>
        <LI>
          <Strong>Verify Account Updater is enabled and check its recent match rate</Strong> if
          Recurly surfaces one — this tells you how much of your expired-card churn is already being
          silently fixed versus still slipping through.
        </LI>
        <LI>
          <Strong>Read your current Dunning Cycle emails as if you were a customer</Strong> who was
          just temporarily short on funds, and separately as one whose bank flagged the charge as
          suspicious — if the email reads identically for both, that is the decline-reason gap
          described above, live in your account right now.
        </LI>
        <LI>
          <Strong>Filter your accounts for a past_due or canceled status</Strong> older than your
          configured Dunning Cycle window, and count how many there are — that count, multiplied by
          average transaction value, is a rough floor on what the historical-exhausted-account gap
          has already cost.
        </LI>
        <LI>
          <Strong>Check your sending domain&apos;s SPF, DKIM, and DMARC records</Strong> independently
          of anything in Recurly&apos;s settings — a cycle-and-copy problem and a deliverability
          problem look identical from the outside (low recovery rate) but need completely different
          fixes.
        </LI>
        <LI>
          <Strong>Run a historical scan against your actual Recurly billing data</Strong> if you want
          a precise number rather than a rough estimate — this reads account state directly and does
          not depend on Recurly&apos;s own Dunning Cycle having been configured correctly at the time.
        </LI>
      </UL>

      <Divider />

      <P>
        For Recurly&apos;s own documentation on configuring the Dunning Cycle, retry schedules, and
        Account Updater, see{' '}
        <A href="https://docs.recurly.com/docs/dunning-management">Recurly&apos;s dunning management documentation</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Recurly's Dunning Cycle is only as good as what it can't see"
        body="Revova connects read-only to Recurly, adds decline-reason-aware recovery emails on top of your existing Dunning Cycle, and scans your full billing history for anything that already exhausted dunning and went unrecovered. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
