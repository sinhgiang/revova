import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Does Zuora have built-in dunning and payment retry management?',
    a: 'Yes — Zuora Billing includes configurable Payment Retry Rules for re-attempting a failed subscription charge, and Zuora Workflow (Zuora\'s automation/orchestration product) can be used to build a full dunning process around those retries, including notification steps that trigger customer emails via Zuora\'s notification templates. Unlike a simpler platform where dunning is a handful of settings fields, Zuora\'s version is more of an assemble-it-yourself automation canvas — powerful and highly configurable, but requiring deliberate setup rather than working out of the box with sensible defaults.',
  },
  {
    q: 'What is the difference between Zuora Payment Retry Rules and a Zuora Workflow for dunning?',
    a: 'Payment Retry Rules are the specific configuration for how many times and how a failed charge gets re-attempted. Zuora Workflow is the broader automation product used to orchestrate what happens around that retry — sending a notification, waiting a set period, escalating to account suspension, and so on. A basic Zuora setup might use Payment Retry Rules alone with default notifications; a more mature dunning process typically involves a custom Workflow that ties retries, notifications, and account state changes together explicitly.',
  },
  {
    q: 'Is Zuora dunning harder to set up than Chargebee or Stripe?',
    a: 'Generally, yes, in the sense that Zuora is built for larger, more complex enterprise billing scenarios and exposes more configuration surface as a result — Payment Retry Rules, Workflow, and notification templates are three separate pieces you connect together, versus a single dunning settings page in a simpler platform. That tradeoff is deliberate: Zuora customers are typically running more complex billing models (usage-based, multi-entity, complex proration) where that extra configurability earns its keep, but it does mean dunning specifically takes more deliberate design work to get right.',
  },
  {
    q: 'Does Zuora\'s payment retry automatically adjust based on the decline reason?',
    a: 'Not by default. Zuora\'s Payment Retry Rules apply a configured retry count and interval, and unless you specifically build branching logic into a custom Workflow, the same retry treatment applies regardless of whether the decline was a temporary insufficient-funds issue or a permanent hard decline like an expired card. This is the same structural gap that shows up across nearly every rule-based dunning system, covered in more general terms in our soft decline vs. hard decline guide.',
  },
  {
    q: 'What happens to a Zuora subscription after payment retries are exhausted?',
    a: 'That depends entirely on how you configured the account\'s dunning process or Workflow — commonly, the account moves to a past-due or suspended state, and further action (cancellation, collections handoff, manual review) depends on what you built into the process. Because Zuora gives you this much control, there is no single universal default outcome the way there might be in a simpler platform — which also means it is worth explicitly confirming what your configuration actually does today, rather than assuming.',
  },
  {
    q: 'What is Zuora Collections, and is it the same as dunning?',
    a: 'Zuora Collections is a separate, more advanced module aimed at the broader accounts-receivable collections process — things like escalating overdue balances, payment plans, and collections agent workflows — which goes beyond what a typical subscription dunning sequence covers. Dunning (retrying a failed charge and reminding the customer) is usually the earlier, lighter-weight layer; Collections is a heavier, often add-on capability for accounts that have gone further past due. Not every Zuora customer uses Collections, but every Zuora customer running subscriptions is using some form of payment retry.',
  },
  {
    q: 'Do Zuora\'s past-due accounts get automatically retried again later?',
    a: 'Once a Payment Retry Rule sequence (or the Workflow built around it) completes and the account reaches whatever end state you configured, nothing in Zuora automatically comes back to re-attempt that specific invoice later on its own. It sits in whatever status it landed in — past due, suspended, or otherwise — until a person, a scheduled process, or a connected tool specifically revisits it.',
  },
  {
    q: 'Can a recovery tool like Revova connect to Zuora?',
    a: 'Yes — Revova connects to Zuora read-only alongside Stripe, Paddle, Braintree, Chargebee, and Recurly, and is built specifically to work alongside Zuora\'s existing Payment Retry Rules and Workflow setup rather than replace them. It adds decline-reason-aware recovery emails without requiring you to build that branching logic into a custom Workflow yourself, and scans historical invoice data for accounts that already exhausted retries and went unrecovered.',
  },
  {
    q: 'How is this different from your Chargebee dunning guide?',
    a: 'The underlying gaps are structurally similar — a rule-based retry schedule that does not automatically branch by decline reason, and a hard stop once retries are exhausted with nothing automatically revisiting the account later. The practical difference is configurability and complexity: Chargebee\'s dunning is a settings page; Zuora\'s is an assemble-it-yourself combination of Payment Retry Rules, Workflow, and notification templates, aimed at more complex enterprise billing scenarios.',
  },
]

// Zuora's payment-retry-plus-workflow handoff: a failed invoice enters the
// configured retry process, and once it's exhausted, whatever end state you
// built into the Workflow fires — nothing automatically revisits it after.
function ZuoraWorkflowHandoffFlow() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 820 360" width="820" height="360" className="w-full h-auto" role="img"
        aria-label="An invoice payment fails in Zuora, entering the configured Payment Retry Rules and any Workflow built around them. If a retry succeeds, the invoice is marked paid. If every configured retry fails, whatever end state the Workflow was built to reach fires — commonly a past-due or suspended account status — and nothing automatically retries that invoice again after that point">
        <defs>
          <marker id="zwA" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#cbd5e1" />
          </marker>
        </defs>
        <g fontFamily="Segoe UI, Arial, sans-serif">
          <rect x="15" y="140" width="160" height="60" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="95" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">Invoice payment</text>
          <text x="95" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">fails</text>

          <path d="M175 170 L203 170" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#zwA)" fill="none" />

          <rect x="207" y="140" width="215" height="60" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
          <text x="314" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">Payment Retry Rules</text>
          <text x="314" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">+ Workflow run</text>

          <path d="M422 170 L450 170" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#zwA)" fill="none" />

          <rect x="454" y="140" width="175" height="60" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
          <text x="541" y="164" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e">Retries + notification</text>
          <text x="541" y="182" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e">steps, as configured</text>

          <path d="M505 200 C 475 230, 445 240, 400 250" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#zwA)" fill="none" />
          <path d="M575 200 C 615 230, 655 240, 695 250" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#zwA)" fill="none" />

          <rect x="290" y="254" width="200" height="54" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
          <text x="390" y="278" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">A retry succeeds</text>
          <text x="390" y="295" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">— invoice paid</text>

          <rect x="600" y="254" width="205" height="54" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
          <text x="702" y="278" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9f1239">Every retry fails —</text>
          <text x="702" y="295" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">process exhausted</text>

          <path d="M702 308 L702 322" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#zwA)" fill="none" />
          <rect x="565" y="326" width="275" height="30" rx="10" fill="#fff1f2" stroke="#fda4af" strokeWidth="1" />
          <text x="702" y="346" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">Account reaches whatever end state the Workflow was built for — nothing retries it further</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">
        Zuora&apos;s Payment Retry Rules and Workflow are more configurable than a simple dunning settings page — but the shape is the same bounded loop, ending wherever you designed it to end.
      </figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        Zuora dunning and payment recovery works through two connected pieces: Payment Retry Rules, which
        control how and how often a failed subscription charge gets re-attempted, and Zuora Workflow, the
        automation product used to orchestrate everything around that retry — notifications, waiting
        periods, account-state escalation. Both are real, working, and considerably more configurable than
        a simple settings page. That configurability is also exactly where the risk sits: Zuora does not
        hand you a sensible dunning process by default the way a smaller subscription platform does — it
        hands you the pieces, and the actual dunning process only exists to the extent someone deliberately
        assembled it.
      </Lead>
      <P>
        This guide covers how Zuora&apos;s Payment Retry Rules and Workflow actually work together, what a
        typical setup looks like, the gaps that persist even in a well-built configuration, and how a
        recovery layer added on top can help — without pretending it replaces Zuora&apos;s billing engine or
        the enterprise-grade configurability that is the whole reason teams choose Zuora in the first place.
        Revova connects to Zuora directly (read-only) alongside Stripe, Paddle, Braintree, Chargebee, and
        Recurly, so this is a platform we integrate with rather than speculate about.
      </P>

      <KeyTakeaways
        items={[
          <>Zuora dunning runs through <Strong>Payment Retry Rules</Strong> (the retry mechanics) combined with <Strong>Zuora Workflow</Strong> (the automation orchestrating notifications and account-state changes) — two separate pieces you connect, not one settings page.</>,
          <>Unlike Chargebee or Stripe, Zuora does not ship a fully-formed default dunning process out of the box — the actual sequence only exists to the extent it was deliberately configured.</>,
          <>Even a well-built Zuora dunning Workflow commonly sends the <Strong>same notification template regardless of decline reason</Strong> unless custom branching logic was specifically added.</>,
          <>Once Payment Retry Rules and any surrounding Workflow are exhausted, the account reaches whatever end state was configured, and <Strong>nothing automatically revisits it</Strong> afterward.</>,
          <>A recovery layer added on top of Zuora (like Revova) can add decline-reason-aware emails and a historical scan without requiring changes to your existing Retry Rules or Workflow configuration.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '2 systems', label: 'you connect yourself: Payment Retry Rules for retries, Workflow for the surrounding dunning process' },
          { value: '5–10%', label: 'of subscription invoices fail or get declined in a typical billing cycle across the industry' },
          { value: '0 retries', label: 'happen automatically once a configured Retry Rule sequence and Workflow are exhausted' },
        ]}
      />

      <H2 id="how-it-works">How Zuora dunning and payment retry actually works</H2>
      <P>
        Zuora Billing&apos;s Payment Retry Rules define how many times and roughly how far apart a failed
        subscription charge gets re-attempted — the core retry mechanics, comparable in shape to what
        Chargebee or Stripe Billing offer, just configured within Zuora&apos;s own settings. On its own, this
        handles the &ldquo;try the charge again&rdquo; part of dunning. It does not, by itself, define what
        happens around that retry — when a customer gets notified, what the account status becomes at each
        stage, or what happens once retries run out.
      </P>
      <P>
        That surrounding process is where Zuora Workflow comes in. Workflow is Zuora&apos;s broader
        automation and orchestration product, used across many parts of billing operations, not exclusively
        for dunning. For payment recovery specifically, a Workflow typically ties together a retry attempt,
        a wait period, a notification step (which triggers a Zuora notification template, i.e. the customer
        email), and an escalation step if retries are exhausted — account suspension, cancellation, or a
        handoff to Zuora Collections for accounts that need heavier collections treatment.
      </P>
      <ZuoraWorkflowHandoffFlow />
      <Callout title="Configurable is not the same as configured">
        A lot of Zuora dunning guidance (including this one) has to describe capability rather than a fixed
        default, because Zuora genuinely does not enforce one default dunning process the way a simpler
        platform might. That is a strength for complex enterprise billing — usage-based plans, multi-entity
        billing, custom proration — but it means the actual quality of your dunning process depends entirely
        on how deliberately it was built, not on what Zuora ships out of the box.
      </Callout>

      <H2 id="workflow-shape">What a typical Zuora dunning Workflow looks like</H2>
      <P>
        There is no single canonical Zuora dunning Workflow — teams build this differently depending on
        billing complexity, account tiers, and how much automation they want versus manual review. But the
        shape tends to recur: a trigger on payment failure, a configurable retry rule, a wait period, a
        notification step, and then a branch — retry succeeded (mark paid) or retry exhausted (escalate).
      </P>
      <InBodyImage
        file="/blog/zuora-dunning-img-1"
        alt="A workflow canvas diagram showing Zuora's dunning process as connected nodes: payment fails trigger, configurable retry rule, wait period, notification template step, then branching into recovered or escalated/suspended outcomes"
        caption="Zuora Workflow gives you this level of control over the dunning process — but unlike a settings-page dunning system, someone has to design and maintain the canvas itself."
      />
      <P>
        The tradeoff is real in both directions. A team with the expertise to build this well gets a
        dunning process precisely tuned to their billing model — different retry cadences for different
        account tiers, different escalation paths for enterprise versus self-serve customers, integration
        with Zuora Collections for accounts that need it. A team without that expertise, or one that
        inherited a Zuora instance configured years ago by someone no longer at the company, may be running
        a dunning Workflow that nobody has actually reviewed in a long time — which is functionally worse
        than a simple, transparent default settings page precisely because its complexity makes it easy to
        stop looking at.
      </P>

      <H2 id="the-gaps">The gaps that persist even in a well-built Zuora Workflow</H2>
      <P>
        These are not failures of Zuora&apos;s platform — they are structural gaps that show up in almost
        any rule-based retry-and-notify system, Zuora&apos;s included, unless specifically engineered around.
      </P>
      <CompareTable
        rows={[
          ['Gap', 'What a typical Zuora setup does', 'What it costs'],
          ['Decline-reason branching', 'Sends the same notification template at each Workflow step, regardless of why the card failed, unless custom branching was built', 'A customer with an expired card gets the same passive notice as one with a temporary insufficient-funds decline'],
          ['Historical past-due accounts', 'Stops entirely once Retry Rules and Workflow are exhausted; the account stays wherever it landed', 'Accounts that went past due months ago and were never revisited sit untouched unless someone manually re-engages them'],
          ['Configuration drift', 'Nothing flags when a dunning Workflow has gone stale or was never fully built out', 'A Workflow built early and never revisited can silently under-recover for a long time before anyone notices'],
        ]}
      />
      <InBodyImage
        file="/blog/zuora-dunning-img-2"
        alt="Side by side comparison: one generic 'payment failed' notification template sent for every decline reason, versus three decline-reason-branched templates for insufficient funds, expired card, and bank decline"
        caption="Even a well-built Zuora Workflow commonly routes every decline reason through the same notification template unless someone specifically built branching logic into it."
      />
      <P>
        The historical-accounts gap tends to be the most expensive one in practice, for the same reason it
        is expensive on other platforms: a retry-and-notify process is designed to handle a failure once, at
        the time it happens, then hand off to whatever end state you configured. It is not designed to
        periodically re-scan old, already-exhausted accounts on its own — see our{' '}
        <A href="/blog/historical-payment-recovery-guide">historical payment recovery guide</A> for the
        general pattern, which applies to Zuora exactly as it does to any other billing platform.
      </P>
      <InBodyImage
        file="/blog/zuora-dunning-img-3"
        alt="Diagram showing accounts that already exhausted a Zuora Retry Rules and Workflow sequence sitting in an untouched past-due pile on one side, versus a historical scan reading billing data directly and surfacing them for recovery on the other"
        caption="Accounts that already exhausted the configured retry-and-notify process don't disappear — they sit in whatever state they landed in until something reads the billing data directly."
      />

      <InlineCTA>
        Revova connects read-only to Zuora and scans your invoice and account history — including accounts
        that already exhausted your Payment Retry Rules and Workflow — to show exactly how much is sitting
        there unrecovered. No credit card required to run it.
      </InlineCTA>

      <H2 id="how-to-improve">How to strengthen your Zuora dunning setup today</H2>
      <OL>
        <LI>
          <Strong>Audit your current Payment Retry Rules and Workflow together, not separately.</Strong>{' '}
          It is common for the retry mechanics to be well configured while the surrounding notification and
          escalation Workflow was built once and never revisited — confirm both pieces still reflect what
          you would actually choose today.
        </LI>
        <LI>
          <Strong>Check who actually owns and understands the dunning Workflow.</Strong> Because Zuora
          Workflow is a general automation tool, dunning-specific logic can end up buried inside a canvas
          built by someone who has since left, with no one currently confident in exactly what it does.
        </LI>
        <LI>
          <Strong>Add decline-reason branching to your notification step if it is not already there.</Strong>{' '}
          Even a simple split — hard decline gets an &ldquo;update your payment method&rdquo; message,
          soft decline gets a lighter &ldquo;we&apos;ll retry automatically&rdquo; message — meaningfully
          improves how actionable the notification is.
        </LI>
        <LI>
          <Strong>Confirm your notification emails are actually reaching the inbox.</Strong> A well-designed
          Workflow sending well-branched copy still recovers nothing if the emails land in spam — check
          SPF, DKIM, and DMARC per our{' '}
          <A href="/blog/dunning-email-deliverability-guide">dunning email deliverability guide</A>, a
          separate layer entirely from anything inside Zuora&apos;s Workflow.
        </LI>
        <LI>
          <Strong>Decide, explicitly, what happens to accounts once Retry Rules and Workflow are exhausted.</Strong>{' '}
          Whether that is a handoff to Zuora Collections, a manual review process, or a connected recovery
          tool re-scanning periodically, an explicit decision beats letting exhausted accounts sit
          unaddressed by default.
        </LI>
      </OL>

      <InlineCTA>
        Revova&apos;s AI writes decline-reason-branched recovery emails and pairs them with a historical scan
        of your Zuora invoice history — without requiring changes to your existing Retry Rules or Workflow.
        Starter is $29/month, Pro is $79/month, both with a 14-day free trial and no credit card required.
      </InlineCTA>

      <H2 id="honest-limits">What a recovery layer can honestly add on top of Zuora — and what it can&apos;t</H2>
      <P>
        Zuora remains the system of record for subscriptions, invoicing, and billing logic — a recovery
        layer connecting read-only does not and should not change that. What it adds specifically is the
        three gaps above: decline-reason-aware email copy generated automatically instead of requiring
        custom Workflow branching logic, a historical scan across accounts that already exhausted your
        configured process, and a layer that keeps working even if the underlying Workflow configuration
        is imperfect, stale, or only partially built out.
      </P>
      <ProsCons
        pros={[
          'Zuora\'s Payment Retry Rules and Workflow already provide real, working retry mechanics — nothing needs to be ripped out.',
          'Reviewing and rebuilding the notification/escalation Workflow directly in Zuora costs nothing but engineering time and can meaningfully improve recovery on its own.',
          'A recovery layer connects read-only, so Zuora stays the single source of truth for subscription and billing state.',
        ]}
        cons={[
          'Decline-reason branching and historical re-engagement inside Zuora itself require Workflow engineering expertise that not every team has in-house.',
          'A recovery layer cannot fix a deliverability problem in your sending domain by itself — SPF/DKIM/DMARC work is still required regardless of who sends the email.',
          'Some capability a recovery layer adds (AI-personalized copy, automatic historical scans) is genuinely new functionality, not something togglable inside Zuora\'s existing Workflow canvas.',
        ]}
      />
      <P>
        Full plan details, including exactly what&apos;s included on Starter versus Pro, are on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>

      <Divider />

      <P>
        For Zuora&apos;s own documentation on Payment Retry Rules and Workflow configuration, see{' '}
        <A href="https://knowledgecenter.zuora.com/">Zuora&apos;s Knowledge Center</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="A configurable dunning process is only as good as how it was configured"
        body="Revova connects read-only to Zuora, adds decline-reason-aware recovery emails on top of your existing Payment Retry Rules and Workflow, and scans your full invoice history for accounts that already exhausted retries and went unrecovered. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
