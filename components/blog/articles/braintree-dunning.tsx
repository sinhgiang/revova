import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Does Braintree have built-in dunning management?',
    a: 'Braintree\'s Recurring Billing lets you configure a retry schedule for failed subscription charges directly in the Control Panel — a number of retry attempts and the interval between them — so the retry mechanics themselves are real and built in. What Braintree does not do out of the box is send a customer-facing dunning email when one of those retries fails. It fires a webhook so your own system can react, but the email itself is something you have to build, unlike Chargebee, Stripe Billing, or Recurly, which ship default reminder emails alongside their retry schedules.',
  },
  {
    q: 'What webhook does Braintree send when a subscription payment fails?',
    a: 'Braintree sends subscription-related webhooks such as a charged-unsuccessfully event when a recurring charge fails, and a went-past-due event once a subscription has been unpaid long enough to cross whatever past-due threshold you have configured. These are real, reliable signals — the gap is not that Braintree fails to tell you a payment failed, it is that nothing downstream of that webhook automatically becomes a customer email unless your own code (or a connected tool) is listening for it and generates one.',
  },
  {
    q: 'Why doesn\'t Braintree send dunning emails like Chargebee or Stripe does?',
    a: 'Braintree was built primarily as a payment gateway and processor — originally for one-off and card-present transactions — with Recurring Billing added as a subscription layer on top, rather than being designed from the ground up as a full subscription-management platform the way Chargebee or Recurly were. That history shows up in the feature gap: the retry mechanics exist, but the customer-communication layer that platforms built specifically around subscription billing include by default was never part of Braintree\'s core product.',
  },
  {
    q: 'Can I build my own dunning emails on top of Braintree?',
    a: 'Yes, and many merchants using Braintree for subscriptions do exactly this — a webhook handler listens for the relevant subscription events, looks up the customer and invoice details via Braintree\'s API, and triggers an email through whatever sending service you already use (Postmark, SendGrid, Resend, and so on). It is a real engineering project, not a checkbox in a settings panel, which is the central practical difference from a platform with dunning management built in.',
  },
  {
    q: 'How many retry attempts should I configure in Braintree Recurring Billing?',
    a: 'There is no single correct number, and it depends on your billing cycle length and how many total attempts feel proportionate to your transaction value — the same tradeoff that applies to any rule-based retry schedule, which we cover in more depth in our Chargebee dunning guide (the retry-schedule mechanics there generalize to Braintree\'s Recurring Billing settings too). Too few attempts spread too close together mostly catch hard declines that were never going to recover; too many spread too far apart leave a subscription in a past-due state for a long stretch before anything decisive happens.',
  },
  {
    q: 'Does Braintree distinguish between soft declines and hard declines?',
    a: 'Braintree\'s gateway response includes a processor decline code that indicates the reason for the failure, and that code does map to the same soft-decline-versus-hard-decline distinction that applies across the industry — insufficient funds is recoverable with time, an expired or stolen card is not. What Braintree\'s Recurring Billing retry schedule does not do automatically is treat those two categories differently: by default the same retry count and interval applies regardless of the specific decline reason, so a hard decline still consumes retry attempts that were never going to succeed unless you build logic to skip them.',
  },
  {
    q: 'What happens to a Braintree subscription after all retries fail?',
    a: 'Once Recurring Billing exhausts the configured number of retry attempts, the subscription status changes (commonly to Past Due or Canceled, depending on your configuration), and Braintree fires the corresponding webhook. From that point, nothing in Braintree itself keeps attempting to charge the card or re-engage the customer — whatever happens next, whether that is a manual outreach, a cancellation flow, or a recovery tool taking over, has to be built or added separately.',
  },
  {
    q: 'Is PayPal Braintree the same as PayPal Recurring Payments?',
    a: 'They are related but distinct — Braintree is a full payment gateway (owned by PayPal) that supports cards, PayPal, Venmo, and other methods, with its own Recurring Billing subscription feature and API. PayPal\'s own separate recurring/subscriptions products are a different integration surface. This guide is specifically about Braintree\'s Recurring Billing and its webhook-based failed-payment handling, not PayPal\'s standalone subscription tools.',
  },
  {
    q: 'Can a recovery tool like Revova work with Braintree if Braintree has no native dunning emails?',
    a: 'Yes — this is precisely the gap a recovery layer is positioned to fill for a Braintree merchant. Revova connects to Braintree (alongside Stripe, Paddle, Chargebee, and Recurly) and listens for the same failed-charge and past-due signals Braintree already generates, then handles the part Braintree does not: writing and sending the decline-reason-aware customer email, on a schedule, without you having to build that webhook-to-email pipeline yourself.',
  },
  {
    q: 'How is this different from your Chargebee dunning guide?',
    a: 'The two platforms sit at different points on the same spectrum. Chargebee ships a configurable retry schedule and default dunning emails together, so the gaps discussed in our Chargebee guide are about the schedule\'s rigidity and blind spots, not about whether emails exist at all. Braintree\'s gap is a layer earlier and more fundamental: retries exist, webhooks exist, but the customer email step is absent by default and has to be built from scratch or added through a connected tool.',
  },
]

// The one-hop gap Braintree leaves open: a real, firing webhook that never
// automatically becomes a customer-facing email unless something is built
// (or connected) to listen for it and generate one.
function BraintreeWebhookGapFlow() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 820 300" width="820" height="300" className="w-full h-auto" role="img"
        aria-label="A Braintree subscription charge fails, Recurring Billing retries it on your configured schedule, and if every retry fails Braintree fires a subscription-past-due webhook. That webhook is a real signal, but nothing downstream of it automatically becomes a customer email unless your own code or a connected recovery tool is listening for it">
        <defs>
          <marker id="bwA" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#cbd5e1" />
          </marker>
        </defs>
        <g fontFamily="Segoe UI, Arial, sans-serif">
          <rect x="15" y="120" width="165" height="60" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="97" y="144" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">Subscription charge</text>
          <text x="97" y="162" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">fails</text>

          <path d="M180 150 L208 150" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#bwA)" fill="none" />

          <rect x="212" y="120" width="190" height="60" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
          <text x="307" y="144" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">Configured retries</text>
          <text x="307" y="162" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">run (Control Panel)</text>

          <path d="M402 150 L430 150" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#bwA)" fill="none" />

          <rect x="434" y="120" width="180" height="60" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
          <text x="524" y="144" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e">Webhook fires:</text>
          <text x="524" y="162" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">subscription past due</text>

          <path d="M614 150 L642 150" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#bwA)" fill="none" />

          <rect x="646" y="90" width="160" height="60" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
          <text x="726" y="114" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9f1239">Nothing listens —</text>
          <text x="726" y="131" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9f1239">no email sent</text>

          <rect x="646" y="160" width="160" height="60" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
          <text x="726" y="184" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">Custom code or a</text>
          <text x="726" y="201" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">recovery layer reacts</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">
        Braintree&apos;s webhook is a real, reliable signal — the gap is the step after it, which Braintree leaves entirely to you.
      </figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        Braintree&apos;s Recurring Billing genuinely retries failed subscription charges on a schedule
        you configure, and it genuinely fires a webhook every time one of those retries fails — both of
        those mechanisms are real, working, and reliable. What Braintree does not do, unlike Chargebee,
        Stripe Billing, or Recurly, is turn that webhook into a customer-facing reminder email by default.
        The retry logic and the customer-communication logic are two separate systems everywhere else in
        the industry; Braintree ships the first and leaves the second for you to build.
      </Lead>
      <P>
        That is a meaningfully different starting point for a &ldquo;Braintree dunning&rdquo; guide than
        for a Chargebee or Stripe one, and it is worth being precise about it rather than describing a
        feature Braintree does not actually have. This guide covers exactly what Braintree&apos;s Recurring
        Billing retry configuration does, which webhooks fire and when, what building the missing email
        layer actually involves, and where a connected recovery tool fits without overstating what it
        replaces. Revova connects to Braintree directly alongside Stripe, Paddle, Chargebee, and Recurly,
        so this is a gap we have had to design around ourselves.
      </P>

      <KeyTakeaways
        items={[
          <>Braintree&apos;s Recurring Billing retries failed subscription charges on a schedule you configure in the Control Panel — the retry mechanics are real and built in.</>,
          <>Braintree fires a <Strong>webhook</Strong> (like a charged-unsuccessfully or went-past-due event) on each failure — but does <Strong>not send a customer email</Strong> automatically the way Chargebee, Stripe, or Recurly do.</>,
          <>Building the missing email layer means writing a webhook handler that looks up the customer and invoice, then sends through your own email service — a real engineering task, not a settings toggle.</>,
          <>Braintree&apos;s retry schedule, like Chargebee&apos;s, does not automatically branch by decline reason — a hard decline still consumes retry attempts that were never going to succeed.</>,
          <>A recovery layer connected to Braintree can take over exactly the missing piece — turning the existing webhook signal into a decline-aware customer email — without replacing Braintree as the processor or subscription engine.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '0 emails', label: 'sent automatically by Braintree Recurring Billing when a subscription charge fails, by default' },
          { value: '1 webhook', label: 'fires reliably on failure — the signal exists, the customer-facing action does not' },
          { value: '5–10%', label: 'of subscription invoices fail or get declined in a typical billing cycle across the industry' },
        ]}
      />

      <H2 id="how-it-works">How Braintree Recurring Billing actually handles failed payments</H2>
      <P>
        Braintree&apos;s Recurring Billing feature lets you set up subscription plans with their own billing
        cycle, price, and — relevant here — a retry configuration for failed charges. In the Control Panel,
        you can set the number of times Braintree will automatically re-attempt a failed subscription
        charge and roughly how far apart those attempts fall. When a charge fails, Braintree runs that
        configured retry sequence against the same payment method, exactly the way Chargebee&apos;s dunning
        schedule or Stripe Billing&apos;s retry logic does.
      </P>
      <P>
        The difference shows up at the next step. Chargebee, Stripe Billing, and Recurly all pair their
        retry schedule with a default reminder-email sequence sent to the customer alongside each retry.
        Braintree pairs its retry schedule with webhooks — events your own systems can subscribe to — but
        ships no default customer email. The charge gets retried; the customer, absent something else you
        build, never hears about it until the subscription is cancelled or they notice the product stopped
        working.
      </P>
      <BraintreeWebhookGapFlow />

      <H2 id="webhooks">The webhooks Braintree actually fires</H2>
      <P>
        Braintree&apos;s subscription webhooks are a real, dependable part of its API — this is not a case
        of Braintree failing to signal that something went wrong. The relevant events for failed-payment
        handling generally include a charged-unsuccessfully event fired each time a scheduled or retried
        charge fails, and a went-past-due event fired once a subscription has remained unpaid past
        whatever threshold you have configured. Braintree&apos;s own webhook documentation is the
        authoritative source for the exact event names, payload fields, and configuration options current
        to your account and API version.
      </P>
      <InBodyImage
        file="/blog/braintree-dunning-img-1"
        alt="A nine-day calendar strip showing Braintree Recurring Billing's configurable retry schedule — retry attempts on a handful of scheduled days configured in the Control Panel, ending with a final attempt on day 7"
        caption="The retry mechanics themselves are real and configurable in Braintree's Control Panel — the gap sits one step further down the pipeline, at the customer-communication layer."
      />
      <Callout title="A webhook is not an email">
        It is easy to read &ldquo;Braintree sends a webhook when a payment fails&rdquo; as functionally
        equivalent to &ldquo;Braintree handles dunning.&rdquo; They are not the same claim. A webhook is a
        server-to-server notification — useful, necessary, and genuinely present in Braintree&apos;s API —
        but it requires something on your side to receive it, decide what to do, and generate the
        customer-facing action. Chargebee and Stripe do that decision-and-generation step for you by
        default; Braintree does not.
      </Callout>

      <H2 id="the-gap">Where the gap actually costs recoverable revenue</H2>
      <P>
        This gap matters more than it might first appear, because the businesses most likely to be running
        subscriptions on Braintree rather than a dedicated subscription-billing platform are often teams
        that adopted Braintree first for its payment-gateway strengths (broad payment-method support,
        PayPal and Venmo, strong developer tooling) and added Recurring Billing later, sometimes without
        fully building out the customer-communication layer that a purpose-built subscription platform
        would have shipped by default.
      </P>
      <CompareTable
        rows={[
          ['Platform', 'Retry schedule', 'Default customer email'],
          ['Chargebee', 'Configurable in dunning settings', 'Yes — configurable templates ship by default'],
          ['Stripe Billing', 'Smart Retries / configurable schedule', 'Yes — default dunning emails included'],
          ['Recurly', 'Configurable dunning schedule', 'Yes — default templates included'],
          ['Braintree Recurring Billing', 'Configurable in the Control Panel', 'No — webhook only, email is built separately'],
        ]}
      />
      <InBodyImage
        file="/blog/braintree-dunning-img-2"
        alt="Side by side comparison: Chargebee, Stripe, and Recurly automatically sending a customer email when a subscription charge fails, versus Braintree firing only a webhook with no default customer email"
        caption="The retry step looks similar across all four platforms. The customer-communication step is where Braintree diverges from the others."
      />
      <P>
        The practical consequence is straightforward: a subscription customer on a Chargebee- or Stripe-
        billed product who has a card decline typically receives at least one reminder before their access
        lapses. The same customer on a Braintree-billed product, without additional engineering work, may
        receive nothing — the charge silently retries in the background, then the subscription silently
        goes past due or cancels, and the first the customer hears about it is when the product stops
        working or they notice a missed renewal.
      </P>

      <InlineCTA>
        Revova connects to Braintree and listens for the same subscription webhooks Braintree already
        fires, then handles the missing step: writing and sending the customer email. No credit card
        required to see what your current Braintree subscriptions look like.
      </InlineCTA>

      <H2 id="build-it-yourself">What building the missing email layer actually involves</H2>
      <P>
        If you want to keep this entirely in-house rather than adding a connected tool, the shape of the
        work is fairly well defined, even if the implementation details depend on your stack.
      </P>
      <OL>
        <LI>
          <Strong>Subscribe to the relevant Braintree webhooks</Strong> (charged-unsuccessfully, went-
          past-due, and cancelled, at minimum) and verify each incoming webhook&apos;s signature per
          Braintree&apos;s documentation before trusting its payload.
        </LI>
        <LI>
          <Strong>Look up the customer and subscription context</Strong> the webhook payload references —
          typically you need the customer&apos;s email address, name, plan, and the amount due, which may
          require a follow-up call to Braintree&apos;s API depending on what the webhook payload includes
          directly.
        </LI>
        <LI>
          <Strong>Decide your own retry-and-reminder cadence</Strong> for the emails themselves, separate
          from Braintree&apos;s charge-retry schedule — for example, sending a reminder on the first failure,
          a second on the last retry, and a final notice when the subscription goes past due.
        </LI>
        <LI>
          <Strong>Write decline-reason-aware copy</Strong> where possible — Braintree&apos;s processor
          response includes a decline code, and branching your email copy on it (per our{' '}
          <A href="/blog/soft-decline-vs-hard-decline">soft decline vs. hard decline guide</A>) meaningfully
          improves how actionable each message is.
        </LI>
        <LI>
          <Strong>Send through a transactional email provider</Strong> and confirm SPF, DKIM, and DMARC are
          correctly configured for your sending domain — a technically correct pipeline still under-
          recovers if the emails never clear deliverability checks, covered in full in our{' '}
          <A href="/blog/dunning-email-deliverability-guide">dunning email deliverability guide</A>.
        </LI>
        <LI>
          <Strong>Handle the historical backlog separately</Strong> — subscriptions that already went past
          due or cancelled before this pipeline existed will not be caught by new webhook events, since
          webhooks only fire on new state changes going forward.
        </LI>
      </OL>

      <InBodyImage
        file="/blog/braintree-dunning-img-3"
        alt="Diagram showing a Braintree webhook (subscription went past due) feeding into a recovery layer that writes and sends the customer email Braintree itself never sends automatically"
        caption="A recovery layer listens to the same Braintree webhook signal that already exists and adds exactly the step Braintree leaves out: the customer-facing email."
      />

      <H2 id="honest-limits">What a recovery layer honestly adds on top of Braintree</H2>
      <P>
        Braintree remains the payment gateway and the subscription engine — that does not change. What a
        recovery layer like Revova adds, specifically for a Braintree merchant, is the customer-
        communication step Braintree&apos;s Recurring Billing does not ship: listening for the same
        subscription webhooks, generating decline-reason-aware email copy automatically instead of requiring
        custom engineering, and scanning historical subscription data for past-due accounts that predate
        any webhook pipeline you build.
      </P>
      <ProsCons
        pros={[
          'Braintree\'s retry mechanics and webhooks already work — no need to change how charges are retried.',
          'A recovery layer removes the need to design, build, and maintain a custom webhook-to-email pipeline from scratch.',
          'Connecting a recovery layer is typically much faster than an in-house engineering project covering webhook handling, templating, sending, and deliverability.',
        ]}
        cons={[
          'Building the email layer yourself costs engineering time but no subscription fee, which may be the right tradeoff for a small volume of failed charges.',
          'A recovery layer cannot fix deliverability problems in your sending domain by itself — SPF/DKIM/DMARC configuration is still required regardless of who sends the email.',
          'Historical subscriptions that already went past due before any pipeline (custom or connected) existed need a specific backfill or historical scan, not just new webhook handling.',
        ]}
      />
      <P>
        Full plan details, including exactly what&apos;s included on Starter versus Pro, are on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>

      <InlineCTA>
        Revova&apos;s AI writes decline-reason-aware recovery emails automatically for Braintree
        subscriptions and pairs them with a historical scan. Starter is $29/month, Pro is $79/month, both
        with a 14-day free trial and no credit card required.
      </InlineCTA>

      <H2 id="audit">How to check where your Braintree setup actually stands</H2>
      <UL>
        <LI>
          <Strong>Check your Recurring Billing retry settings</Strong> in the Braintree Control Panel and
          confirm the retry count and interval match what you would actually choose today.
        </LI>
        <LI>
          <Strong>Confirm whether any customer email currently goes out</Strong> when a subscription charge
          fails — if the answer is no, that is the core gap this guide describes, live in your account.
        </LI>
        <LI>
          <Strong>Check whether your webhook endpoint actually verifies signatures</Strong> and handles
          retries/duplicates correctly if you have already built custom logic — a webhook handler with the
          same reliability issues covered in our{' '}
          <A href="/blog/stripe-webhook-reliability-lost-revenue">webhook reliability guide</A> (written
          around Stripe, but the failure modes — missed, late, duplicate, out-of-order events — generalize
          to any webhook-based integration, Braintree included).
        </LI>
        <LI>
          <Strong>Count how many subscriptions are currently past due or cancelled</Strong> due to payment
          failure, and multiply by average subscription value for a rough floor on what this gap has
          already cost.
        </LI>
        <LI>
          <Strong>Decide deliberately</Strong> whether to build the missing email layer in-house or connect
          a recovery tool — either is a legitimate choice, but leaving it undecided by default is the one
          option that guarantees the gap stays open.
        </LI>
      </UL>

      <Divider />

      <P>
        For Braintree&apos;s own documentation on Recurring Billing configuration and webhook events, see{' '}
        <A href="https://developer.paypal.com/braintree/docs/guides/recurring-billing/overview">Braintree&apos;s Recurring Billing documentation</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Braintree tells you a payment failed. It won't tell your customer."
        body="Revova connects to Braintree, listens for the same subscription webhooks Braintree already fires, and writes and sends the decline-reason-aware customer email Braintree doesn't. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
