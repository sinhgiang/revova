import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, AreaChart, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What actually happens if Stripe sends invoice.payment_failed and my server is down?',
    a: 'Stripe does not give up after one attempt. If your webhook endpoint is unreachable, times out, or returns anything other than a 2xx response, Stripe treats the delivery as failed and retries it on a backoff schedule — starting within minutes and stretching out over a period of time (Stripe’s own documentation covers the exact retry window). If your server comes back before that window closes, you likely still receive the event. If the outage outlasts the retry window, the delivery attempts stop and that event sits in your Stripe Dashboard’s event log marked as failed, with nothing automatically trying it again after that point.',
  },
  {
    q: 'Does Stripe guarantee my webhook endpoint receives every event exactly once?',
    a: 'No, and this is one of the most misunderstood parts of building on webhooks. Stripe documents at-least-once delivery, not exactly-once — meaning a given event can legitimately arrive at your endpoint more than once, whether because of a retried delivery after a timeout, a network hiccup, or your own server accepting the request but crashing before it finished responding. A webhook handler that is not written to be idempotent (safe to process the same event twice without a side effect happening twice) can end up sending a customer two recovery emails, double-logging a recovered charge, or applying a state change twice.',
  },
  {
    q: 'Can Stripe webhook events actually arrive out of order?',
    a: 'Yes, and it is a genuine, well-documented possibility rather than an edge case you can safely ignore. Two events for the same object — say invoice.payment_failed followed shortly by invoice.paid, once a retry succeeds — are not guaranteed to reach your endpoint in the order they occurred, because retries, network timing, and queuing all introduce their own delay independently. A handler that assumes the last event it received reflects the current truth can act on stale information. The safer pattern is to treat each event as a signal to go check the object’s current state via the API, or to compare timestamps, rather than trusting arrival order as ground truth.',
  },
  {
    q: 'What is a webhook signing secret and why does it matter?',
    a: 'A webhook signing secret is a unique key Stripe generates for each webhook endpoint you register, used to compute a cryptographic signature that Stripe attaches to every event it sends in the Stripe-Signature header. Your endpoint recomputes that signature from the raw request body and the same secret, and compares the two — if they match, you have verified the event genuinely came from Stripe and was not altered or forged in transit. Skipping this check means anyone who discovers or guesses your endpoint URL can POST a fake invoice.payment_failed or invoice.paid payload and have your system act on it as if it were real.',
  },
  {
    q: 'Why would signature verification fail even though my webhook endpoint URL is correct?',
    a: 'The most common cause is not a wrong URL at all — it is something in the request pipeline modifying the raw request body before your signature-verification code sees it. Many web frameworks automatically parse JSON before your handler runs, which reformats whitespace and changes the exact bytes Stripe originally signed; verifying against that reformatted body will always fail even though the event is completely legitimate. The fix is almost always to read the raw, unparsed body specifically for the webhook route. A stale or mismatched webhook signing secret after rotating keys, or a proxy that alters headers, are the other common causes.',
  },
  {
    q: 'How do I test my webhook handler locally before it ever touches production billing events?',
    a: 'The Stripe CLI can forward real test-mode events from your Stripe account directly to a local server, and its trigger command can fire a specific event type like invoice.payment_failed on demand, without waiting for a real card to actually fail. A tunneling tool like ngrok serves the same forwarding purpose if you need a public URL for a service the Stripe CLI can’t reach directly. Testing this way lets you exercise your idempotency handling, signature verification, and retry-safety logic against realistic payloads before a single real customer event depends on the code working correctly.',
  },
  {
    q: 'How can I tell, retroactively, whether I have already been missing webhook events?',
    a: 'Start with the event log in your Stripe Dashboard, which shows every event Stripe attempted to deliver to each registered endpoint along with the delivery outcome and attempt history — a cluster of failed attempts on a specific date range is a direct signal. From there, cross-reference: count invoices marked as failed or uncollectible in Stripe against how many dunning emails or retry actions your own system logged for the same period: a gap between those two numbers usually means events went missing rather than customers simply not responding. A historical processor scan, which looks at invoice and charge state directly rather than depending on whether a webhook fired at the time, is the most reliable way to find what a missed-webhook window actually cost.',
  },
  {
    q: 'Does Revova ever miss or double-process a webhook itself?',
    a: 'We built Revova’s own webhook receiver to verify every event’s signature against the raw request body, respond with a fast 2xx before doing slower processing asynchronously, and de-duplicate by event ID so a retried delivery cannot double-send a recovery email or double-log a recovered charge — the same idempotent, signature-verified design this article describes as the baseline any handler needs. What we cannot do is inspect or fix the reliability of a merchant’s own backend systems, CRM, or internal billing logic — if your own systems miss an event before or separately from what reaches Revova, that is outside anything a connected tool can see or correct.',
  },
  {
    q: 'How is this different from the dunning email deliverability problem?',
    a: 'They are companion problems at two different layers, and it is worth being precise about which one you are diagnosing. This article covers whether your system finds out a payment failed (or recovered) at all — the Stripe webhook event actually reaching your endpoint and being processed correctly. Our separate guide on dunning email deliverability covers what happens after that: once your system correctly knows about the failure and sends a recovery email, whether that email actually reaches the customer’s inbox past SPF, DKIM, and DMARC checks. A business can have one of these solved and not the other — diagnosing which layer is actually broken saves a lot of wasted effort rewriting email copy when the real problem is upstream.',
  },
  {
    q: 'How is this different from the historical payment recovery problem?',
    a: 'Historical payment recovery is about finding and re-approaching old failed charges that already fell through the cracks, regardless of why. This article is about the specific mechanism that most often creates that backlog silently in the first place: a webhook that was missed, arrived late, arrived twice, arrived out of order, or failed signature verification, so the failure never entered a dunning or retry pipeline to begin with. Read this guide to understand and reduce why gaps happen at the infrastructure level; read the historical recovery guide for how to find and act on whatever already slipped through before you fixed it.',
  },
]

// The path a single failed-charge event takes through Stripe's at-least-once
// delivery and retry-backoff model before landing on a terminal outcome.
function WebhookRetryFlow() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 820 500" width="820" height="500" className="w-full h-auto" role="img"
        aria-label="A charge fails on Stripe, which sends an invoice.payment_failed event to your webhook endpoint. If the endpoint returns a 2xx response quickly, the event is marked delivered. If it times out, returns a 5xx error, or is offline, Stripe retries with exponential backoff over minutes, then hours, then up to several days, looping back to the endpoint each attempt, until either a retry succeeds or the retry window is exhausted and the event sits marked failed with nothing chasing it further">
        <defs>
          <marker id="whA" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#cbd5e1" />
          </marker>
          <marker id="whB" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#fcd34d" />
          </marker>
        </defs>
        <g fontFamily="Segoe UI, Arial, sans-serif">
          <rect x="15" y="163" width="140" height="54" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="85" y="185" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#374151">Charge fails</text>
          <text x="85" y="201" textAnchor="middle" fontSize="11" fill="#6b7280">on Stripe</text>

          <path d="M155 190 L183 190" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#whA)" fill="none" />

          <rect x="187" y="163" width="205" height="54" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
          <text x="289" y="185" textAnchor="middle" fontSize="12" fontWeight="700" fill="#3730a3">Stripe sends</text>
          <text x="289" y="201" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#3730a3">invoice.payment_failed</text>

          <path d="M392 190 L406 190" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#whA)" fill="none" />

          <rect x="410" y="163" width="175" height="54" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
          <text x="497" y="185" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">Your webhook</text>
          <text x="497" y="201" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#3730a3">endpoint</text>

          <path d="M470 217 C 440 240, 410 248, 397 258" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#whA)" fill="none" />
          <path d="M525 217 C 570 240, 620 248, 660 258" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#whA)" fill="none" />

          <rect x="300" y="262" width="195" height="52" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
          <text x="397" y="284" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">Returns a 2xx</text>
          <text x="397" y="300" textAnchor="middle" fontSize="12" fontWeight="700" fill="#166534">response quickly</text>

          <rect x="560" y="262" width="220" height="52" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
          <text x="670" y="284" textAnchor="middle" fontSize="12" fontWeight="700" fill="#92400e">Times out, 5xx,</text>
          <text x="670" y="300" textAnchor="middle" fontSize="12" fontWeight="700" fill="#92400e">or offline</text>

          <path d="M397 314 L397 340" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#whA)" fill="none" />
          <path d="M670 314 L670 340" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#whB)" fill="none" />

          <rect x="300" y="344" width="195" height="48" rx="12" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
          <text x="397" y="373" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#065f46">Event marked delivered</text>

          <rect x="555" y="344" width="230" height="66" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
          <text x="670" y="366" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">Stripe retries with</text>
          <text x="670" y="381" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">exponential backoff —</text>
          <text x="670" y="396" textAnchor="middle" fontSize="11" fill="#92400e">minutes, then hours, then days</text>

          <path d="M560 377 C 480 350, 440 260, 480 220" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#whB)" fill="none" />
          <text x="470" y="315" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#b45309">retry attempt</text>

          <path d="M670 410 L670 424" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#whA)" fill="none" />

          <rect x="540" y="428" width="250" height="60" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
          <text x="665" y="450" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">Retries exhausted — event sits</text>
          <text x="665" y="465" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#9f1239">marked failed in the Dashboard,</text>
          <text x="665" y="480" textAnchor="middle" fontSize="11" fill="#9f1239">nothing retries it without a manual replay</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">
        Stripe&apos;s at-least-once delivery model: a non-2xx response triggers exponential backoff over minutes, then hours, then days — not an immediate, permanent loss, but a window in which an outage or a bug in your handler can still let an event fall through uncaught.
      </figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        Stripe webhook reliability is the discipline of making sure events like{' '}
        <code>invoice.payment_failed</code>, <code>charge.failed</code>, and <code>invoice.paid</code>{' '}
        actually reach your system, get verified, and get processed exactly once — and when that
        breaks, a subscription business can lose revenue that never even makes it into a dunning or
        retry pipeline, because the system never found out anything happened at all. Every guide we and
        everyone else in this space has published about recovering failed payments — retries, dunning
        sequences, decline-reason routing — quietly assumes your system already knows a charge failed.
        That assumption depends entirely on a webhook event arriving, being authenticated, and being
        processed correctly, and Stripe is explicit in its own documentation that none of those three
        things are guaranteed by default: delivery is <Strong>at-least-once</Strong>, not exactly-once;
        events can arrive <Strong>out of order</Strong>; and a non-2xx response triggers a bounded{' '}
        <Strong>retry schedule with exponential backoff</Strong>, not an instant, infinite retry. This
        guide covers the engineering layer that sits one step earlier than every other payment-recovery
        article we&apos;ve written: what happens when the signal itself goes missing, arrives late,
        arrives twice, arrives in the wrong order, or fails signature verification — and an honest
        answer to what a tool like Revova can, and cannot, do about it.
      </Lead>
      <P>
        We operate a webhook receiver ourselves, listening to events from other people&apos;s Stripe,
        Paddle, Braintree, Chargebee, and Recurly accounts, which means the failure modes in this
        article are not theoretical to us — they are the exact edge cases our own event-processing
        pipeline has to be built to survive, every day, at scale. Almost nothing written about payment
        recovery covers this layer, because it is genuinely less interesting to write about than a
        clever dunning email or a well-timed retry — until the day a founder discovers their recovery
        rate quietly dropped for a week and traces it back not to a bad subject line, but to a webhook
        endpoint that silently stopped receiving events.
      </P>
      <P>
        This is a companion piece to two guides we&apos;ve already published on adjacent infrastructure
        problems. Our{' '}
        <A href="/blog/historical-payment-recovery-guide">historical payment recovery guide</A> covers
        how to find and re-approach old failed charges that already fell through the cracks, regardless
        of why. This guide covers the specific mechanism that creates that backlog silently in the first
        place at the infrastructure level — read this one to understand and reduce <em>why</em> the
        gaps happen, and the historical guide for how to clean up whatever already slipped through
        before you fixed it. And our{' '}
        <A href="/blog/dunning-email-deliverability-guide">dunning email deliverability guide</A> covers
        the mirror-image problem one step later in the pipeline: whether your recovery email actually
        reaches an inbox once your system correctly knows about the failure. Together the two answer the
        two questions that have to both be true before any dunning copy or retry timing even matters:
        did you find out, and did your response get delivered.
      </P>

      <KeyTakeaways
        items={[
          <>Every payment-recovery tactic — retries, dunning, pre-dunning — assumes your system already knows a charge failed via a webhook like <code>invoice.payment_failed</code>. If that event never arrives, gets processed twice, or arrives out of order, nothing downstream ever runs.</>,
          <>Stripe documents <Strong>at-least-once delivery</Strong> (duplicates are possible), a bounded <Strong>retry schedule with exponential backoff</Strong> on non-2xx responses, and the real possibility of <Strong>out-of-order delivery</Strong> — a webhook handler has to be built for all three, not assume a clean, single, ordered stream.</>,
          <>Signature verification via the <code>Stripe-Signature</code> header and your <Strong>webhook signing secret</Strong> most often fails silently for a boring reason: middleware reformatting the raw request body before your code checks it.</>,
          <>A missed or mis-processed webhook is invisible by default — there is no error message, no failed charge notification, nothing that looks like lost revenue. It just looks like nothing happened.</>,
          <>Revova can get its own webhook pipeline right — idempotent, signature-verified, monitored — and offers a historical catch-up scan as a safety net, but it honestly cannot verify or fix bugs in a merchant&apos;s own backend systems.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription charges fail or get declined in a typical billing cycle — the volume every webhook pipeline has to carry without dropping events' },
          { value: '30–40%', label: 'of failed charges Stripe Smart Retries alone typically recovers — but only for charges the system actually knows failed' },
          { value: '40–60%', label: 'of failed charges commonly recoverable via retries and dunning combined, industry-wide, once the underlying event pipeline is reliable' },
        ]}
      />

      <H2 id="why-know">Why &ldquo;payment recovery works&rdquo; doesn&apos;t matter if your system never found out</H2>
      <P>
        A recovery stack can have perfectly tuned Stripe Smart Retries, a well-written dunning sequence,
        and decline-reason-aware routing, and still lose revenue silently if the event telling it a
        charge failed never arrives, arrives too late, or gets discarded — because every one of those
        downstream systems is triggered by an event, not by the charge failure itself. Stripe doesn&apos;t
        push a failed charge into your dashboard and your dunning tool simultaneously by magic; it fires
        an event, most commonly <code>invoice.payment_failed</code> for subscription billing or{' '}
        <code>charge.failed</code> for a one-off <Strong>PaymentIntent</Strong>, and something on your
        side has to receive that event at a <Strong>webhook endpoint</Strong>, verify it, and act on it.
        If that chain breaks anywhere, the charge failed in Stripe&apos;s systems, full stop, and your
        system has no idea.
      </P>
      <P>
        Our own guides on{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>{' '}
        and <A href="/blog/stripe-decline-codes-explained">Stripe decline codes explained</A> both start
        from the moment your system already has the decline reason in hand and has to decide what to do
        with it — retry, email, or write off. That is the right place for those guides to start,
        because deciding what to do with a known failure is a real and separate problem. This guide is
        about the layer directly underneath both of them: how the decline reason gets from Stripe&apos;s
        systems into yours at all, and the several distinct ways that handoff can quietly fail without
        producing anything that looks like an error.
      </P>
      <Callout title="The blind spot every recovery metric shares">
        A recovery rate — the percentage of failed charges you successfully win back — is calculated
        against the failures your system knew about. It cannot see the failures it never heard of. A
        webhook gap doesn&apos;t lower your recovery rate on paper; it removes charges from the
        denominator entirely, which is exactly why this failure mode is so easy to miss even while
        watching every other dunning metric closely.
      </Callout>

      <H2 id="how-it-works">How Stripe is supposed to tell your system about a failure in the first place</H2>
      <P>
        Stripe communicates state changes — a charge failing, an invoice getting paid, a subscription
        canceling — by sending an HTTP POST request, containing an event object, to every{' '}
        <Strong>webhook endpoint</Strong> you&apos;ve registered for that event type, either directly in
        the Stripe Dashboard or via the API. Your server is expected to receive that request, verify it
        genuinely came from Stripe, do whatever processing the event requires, and respond quickly with
        a <Strong>2xx response</Strong> to acknowledge receipt. That acknowledgment matters more than it
        sounds like it should: it is the only signal Stripe has that your side actually got the message.
      </P>
      <P>
        The events most relevant to payment recovery are <code>invoice.payment_failed</code> (a
        subscription invoice attempt failed, whether the first attempt or a Smart Retries re-attempt),{' '}
        <code>charge.failed</code> (a lower-level charge or PaymentIntent failed, which matters for
        one-off charges or integrations that predate Stripe Billing), and <code>invoice.paid</code> (a
        previously failing invoice succeeded, whether via a retry, a manual card update, or Stripe
        Radar clearing a hold). A dunning sequence typically starts on the first, needs to stop cleanly
        on the third, and a webhook pipeline that mishandles any one of those three events either
        under-recovers or, just as damaging, keeps emailing a customer who already fixed their card.
      </P>
      <P>
        Every event Stripe sends is signed. Stripe computes a cryptographic signature over the raw
        request body using your webhook endpoint&apos;s unique <Strong>webhook signing secret</Strong>,
        and attaches it in the <code>Stripe-Signature</code> header. Your endpoint is expected to
        recompute that signature independently, using the same secret and the exact raw bytes of the
        body it received, and reject the request if the two don&apos;t match. Skipping that check means
        your endpoint will process any POST request shaped like a Stripe event, from anyone who finds the
        URL — which is precisely why Stripe treats signature verification as a baseline requirement,
        not an optional hardening step, in its{' '}
        <A href="https://docs.stripe.com/webhooks">webhooks documentation</A>.
      </P>

      <H2 id="five-ways">The five ways a Stripe webhook silently breaks before dunning ever starts</H2>
      <P>
        None of these five failure modes throw an exception a developer notices right away. Each one
        looks, from inside your own system, exactly like nothing happened — which is what makes this
        category of bug so much more expensive, dollar for dollar, than a bug that actually crashes
        something.
      </P>
      <CompareTable
        rows={[
          ['Failure mode', 'What it looks like', 'Common cause', 'What breaks silently'],
          ['Missed entirely', 'No event ever recorded for this endpoint, for that charge', 'Endpoint down, a bad deploy, a firewall rule, or the wrong URL registered in the Dashboard', 'invoice.payment_failed never fires; the charge looks like it simply never happened'],
          ['Arrives late', 'The event lands hours after the charge actually failed', 'A server outage window; Stripe’s own retry backoff eventually catching up once you’re back', 'A time-boxed dunning cadence starts late, or part of a retry window has already elapsed'],
          ['Arrives out of order', 'invoice.paid is processed before invoice.payment_failed for the same invoice', 'Two events queued near-simultaneously; retries reordering relative delivery timing', 'A handler that trusts arrival order marks a recovered customer as still failing, or the reverse'],
          ['Arrives twice (duplicate)', 'The same event ID gets processed more than once', 'At-least-once delivery, combined with a retried delivery after a slow or ambiguous response', 'A non-idempotent handler double-sends a dunning email or double-logs a recovered charge'],
          ['Fails signature verification', 'Endpoint returns 400/401; the event is never processed at all', 'Wrong or rotated webhook signing secret, or middleware reformatting the body before verification', 'Every event to that endpoint is silently rejected until someone notices the pattern'],
        ]}
      />

      <H3>Missed entirely</H3>
      <P>
        This is the most damaging failure mode because it produces zero trace on your side. An endpoint
        that&apos;s down during a deploy, a URL that got changed in the Dashboard without updating
        whatever deployed the new one, a firewall or load balancer rule that blocks Stripe&apos;s
        outbound IP ranges, or an endpoint that was quietly disabled during testing and never
        re-enabled — any of these mean the event never lands, and unless Stripe&apos;s retry window
        happens to close during a window you&apos;re actively monitoring, nothing tells you it
        happened. The charge failed in Stripe&apos;s systems. Your system has no record it ever
        occurred.
      </P>
      <H3>Arrives late</H3>
      <P>
        Late delivery is less catastrophic than a full miss, but it still costs something. If your
        endpoint was down for an hour during a deploy and Stripe&apos;s retry backoff eventually
        succeeds once you&apos;re back, you do get the event — just hours after the actual failure. For
        a dunning sequence timed around when a customer is statistically likely to have funds
        available, or a retry window that&apos;s partially bounded by elapsed time rather than attempt
        count, a late-arriving event can mean your system effectively starts the clock with less runway
        than it thinks it has.
      </P>
      <H3>Arrives out of order (a race condition)</H3>
      <P>
        Two events for the same invoice, fired close together, are not guaranteed to reach your
        endpoint in the order Stripe generated them — network timing, queuing, and independent retry
        schedules can all reorder relative delivery. The classic version of this: a customer updates
        their card right as a scheduled retry succeeds, so <code>invoice.paid</code> and a lingering{' '}
        <code>invoice.payment_failed</code> from an earlier attempt are both in flight near-simultaneously.
        A handler written to assume &ldquo;the last event I received reflects current truth&rdquo; can
        mark a genuinely recovered customer as still failing, cancel a subscription that just got paid,
        or keep a dunning sequence running against someone who already fixed the problem.
      </P>
      <H3>Arrives twice — duplicate delivery</H3>
      <P>
        Stripe&apos;s <A href="https://docs.stripe.com/webhooks">webhook documentation</A> is explicit
        that delivery is <Strong>at-least-once</Strong>, not exactly-once — a retried delivery after an
        ambiguous or slow response, or a network condition where your server processed the request but
        the acknowledgment never made it back to Stripe, can both result in the same event ID arriving
        at your endpoint more than once. A handler that isn&apos;t written to recognize &ldquo;I&apos;ve
        already processed this event ID&rdquo; will happily process it again — sending a second
        dunning email for the same failure, double-counting a recovered charge in a revenue dashboard,
        or triggering a duplicate internal state change.
      </P>
      <H3>Fails signature verification</H3>
      <P>
        A rejected event is at least loud in one sense — your endpoint returns an error rather than
        silently doing nothing — but it&apos;s still commonly invisible in practice, because nobody is
        watching the failed-delivery count on a webhook endpoint that&apos;s otherwise been reliable for
        months. The most common root cause isn&apos;t a wrong secret at all: it&apos;s a web framework or
        middleware layer parsing the JSON body automatically before your verification code runs,
        changing the exact bytes Stripe originally signed. Verifying a reformatted body against the
        original signature will always fail, even for a completely legitimate event, which is why
        Stripe&apos;s official libraries specifically require access to the raw, unparsed request body
        for this check — see{' '}
        <A href="https://docs.stripe.com/webhooks/signatures">Stripe&apos;s signature verification documentation</A>{' '}
        for the exact implementation pattern.
      </P>

      <WebhookRetryFlow />

      <H2 id="why-silent">Why this failure mode is invisible until someone goes looking for it</H2>
      <P>
        A missed or mishandled webhook produces no error message, no failed-charge alert, and no support
        ticket — it produces the absence of an action that should have happened, which is a much
        harder thing for a team to notice than the presence of something broken. Nobody gets paged
        because a dunning email <em>didn&apos;t</em> send; the customer whose card failed simply drifts
        toward cancellation, quietly, looking indistinguishable from voluntary churn unless someone
        specifically cross-references processor data against what the recovery system actually logged.
      </P>
      <P>
        There is no reliable public statistic for how often this happens across the industry, and we
        are not going to invent one — the honest answer is that it depends entirely on how carefully a
        given team built and monitors their own handler, which varies enormously between a team with a
        dedicated on-call engineer and a solo founder who wired up a webhook once and never looked at it
        again. What is true mechanistically, regardless of frequency, is that even a small, transient
        outage window is enough to silently drop events if a handler isn&apos;t built to catch up
        afterward — a five-minute deploy, a brief database outage, or a misconfigured environment
        variable after a routine migration can each open exactly that kind of window.
      </P>
      <AreaChart
        points={[2, 4, 7, 11, 16, 22, 29]}
        xLabels={['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']}
        endLabel="Keeps climbing until someone checks"
        caption="Illustrative only, not real data from any business: how unrecovered revenue can compound across a webhook gap that produces no error, no alert, and no visible symptom until a processor-level audit specifically goes looking for the difference between what failed and what a recovery system actually logged."
      />
      <Callout title="What actually limits the damage">
        The size of the loss is a function of how long the gap runs before someone notices, not how
        often gaps happen in the first place — which is exactly why monitoring for the <em>absence</em>{' '}
        of expected events matters as much as building the handler correctly in the first place. A team
        that catches a gap within a day loses far less than one that only discovers it during an annual
        churn review.
      </Callout>

      <H2 id="build-reliable-handler">How to build a webhook handler that doesn&apos;t miss, duplicate, or drop events</H2>
      <P>
        A reliable webhook handler is built around three properties working together: it verifies every
        event is genuine before trusting it, it acknowledges receipt fast enough that Stripe never has a
        reason to assume the delivery failed, and it can safely process the same event twice without a
        duplicate side effect. None of these are exotic engineering — they are well-documented patterns
        Stripe itself recommends — but skipping any one of them reintroduces exactly the failure modes
        covered above.
      </P>
      <OL>
        <LI>
          <Strong>Verify the signature against the raw body, every time.</Strong> Read the unparsed
          request body specifically for the webhook route, recompute the signature using your{' '}
          <Strong>webhook signing secret</Strong>, and reject anything that doesn&apos;t match before
          doing any further processing — Stripe&apos;s official client libraries handle this
          correctly out of the box if you give them the raw body rather than a pre-parsed object.
        </LI>
        <LI>
          <Strong>Return a 2xx response fast, then process asynchronously.</Strong> Do the minimum work
          needed to acknowledge and queue the event — record its ID, hand it to a background job —
          before doing anything slow like sending an email or calling another API. A handler that does
          all its processing synchronously inside the webhook request risks timing out under load, which
          Stripe correctly interprets as a failed delivery and retries, compounding the problem.
        </LI>
        <LI>
          <Strong>De-duplicate by event ID before processing.</Strong> Store each event&apos;s unique ID
          in a table or cache with a uniqueness constraint, and check it before acting — if you&apos;ve
          already processed that ID, acknowledge with a 2xx and stop, without repeating the side effect.
          This is the core of building an <Strong>idempotent</Strong> handler, and it is the single
          highest-leverage fix against at-least-once delivery producing duplicate emails or double-logged
          recoveries.
        </LI>
        <LI>
          <Strong>Never trust event arrival order as ground truth.</Strong> When an event&apos;s
          correctness depends on current state — is this invoice actually still failing, or did a
          later event already resolve it — re-fetch the object&apos;s current status from the API, or
          compare event timestamps explicitly, rather than assuming the most recently received event is
          the most recent thing that happened.
        </LI>
        <LI>
          <Strong>Monitor the Dashboard&apos;s event log for delivery failures, not just your own logs.</Strong>{' '}
          Stripe&apos;s webhook event log shows every delivery attempt and outcome per endpoint —
          reviewing it periodically, or wiring an alert on a rising failure count, catches a broken
          endpoint days or weeks before a manual audit would.
        </LI>
        <LI>
          <Strong>Test locally with the Stripe CLI before anything reaches production.</Strong> The
          Stripe CLI can forward real test-mode events to a local server and trigger specific event
          types like <code>invoice.payment_failed</code> on demand; a tunneling tool like{' '}
          <Strong>ngrok</Strong> covers the cases where you need a public URL for a service the CLI
          can&apos;t reach directly. Exercise your idempotency and signature-verification logic against
          realistic payloads before a real customer event depends on it working.
        </LI>
        <LI>
          <Strong>Know that event replay exists, and use it after a confirmed gap.</Strong> Stripe
          retains recent events and lets you resend a specific one from the Dashboard or API — useful
          for backfilling a handful of events you can identify by ID after a confirmed outage, though it
          does not substitute for a full historical audit of invoice and charge state when the gap is
          large or its exact boundaries are unclear.
        </LI>
      </OL>

      <InlineCTA>
        Revova&apos;s recovery sequence only starts once an event has actually been received and
        verified — built on the same idempotent, signature-checked handler design covered above.
        Starter is $29/month and Pro is $79/month, both with a 14-day free trial and no credit card
        required.
      </InlineCTA>

      <H2 id="race-conditions">What a race condition actually looks like in a production billing system</H2>
      <P>
        The clearest real-world race condition in payment recovery happens at the exact moment a
        customer fixes their own card. A retry succeeds and Stripe fires <code>invoice.paid</code>,
        while, independently, a delayed or retried delivery of the earlier{' '}
        <code>invoice.payment_failed</code> is still working its way to your endpoint — both are
        legitimate events, both are correctly signed, and both can be in flight within seconds of each
        other. Which one your endpoint happens to process first is not something Stripe promises to
        control on your behalf.
      </P>
      <P>
        A handler built to trust whichever event arrived most recently will sometimes get this backwards:
        it processes the stale <code>invoice.payment_failed</code> after the customer already paid,
        and either sends a needless &ldquo;your card was declined&rdquo; email to someone who just fixed
        it, or worse, cancels a subscription that had already recovered. The fix is structural, not a
        patch: treat every incoming event as a prompt to check the object&apos;s actual current state —
        via the invoice or subscription&apos;s live status field, fetched from the API — rather than as
        the single source of truth in itself. A handler designed this way is naturally resilient to
        out-of-order delivery, because it never depends on order being correct in the first place.
      </P>

      <H2 id="honest-limits">What a payment-recovery tool can honestly fix here — and what it can&apos;t</H2>
      <P>
        Webhook reliability splits cleanly into two zones of responsibility, and being honest about the
        line between them matters more than any feature list. One zone is Revova&apos;s own webhook
        receiver — the code that listens for events from your connected Stripe, Paddle, Braintree,
        Chargebee, or Recurly account and decides what to do with them. The other zone is everything
        upstream and around that: your own backend, your own internal billing logic, any other system
        that also listens to the same Stripe webhooks for its own purposes. Revova controls the first
        zone completely. It has no visibility into, and cannot fix bugs in, the second.
      </P>
      <P>
        What that means concretely: Revova&apos;s webhook receiver verifies every event&apos;s signature
        against the raw body, responds fast, and de-duplicates by event ID — the same idempotent
        design principles covered in this guide, applied to our own pipeline so a retried or duplicated
        Stripe delivery cannot cause Revova to send a customer two recovery emails or double-log a
        recovered charge. What Revova cannot do is inspect, monitor, or repair a merchant&apos;s own
        separate backend systems — if your own CRM, internal dashboard, or custom billing code misses
        an event, has a bug in its own signature verification, or processes something out of order, that
        is entirely outside what any connected third-party tool can see or correct. No SaaS product can
        honestly claim otherwise for systems it doesn&apos;t operate.
      </P>
      <ProsCons
        pros={[
          'Full control over your own webhook endpoint, retry logic, and idempotency design — nothing routes through a third party for your own internal systems.',
          'No new dependency for the systems you already run and understand.',
          'Reasonable for a team with existing engineering capacity to build and monitor this correctly from day one.',
        ]}
        cons={[
          'Idempotent, signature-verified, order-resilient handling is real engineering work that has to be built once and then maintained as your stack changes.',
          'Monitoring for a silent gap — an outage that produces no error — is its own ongoing project most teams never get around to building.',
          'A missed window before you notice compounds quietly, and by the time it is visible in an open-rate or churn number, the backlog has already accumulated.',
        ]}
      />
      <P>
        What we can honestly offer beyond getting our own pipeline right is a safety net for exactly the
        gap this article describes: a{' '}
        <A href="/blog/historical-payment-recovery-guide">historical recovery scan</A> that looks at
        your processor&apos;s actual invoice and charge history directly — rather than depending on
        whether a webhook fired correctly at the time — and surfaces failures that a live,
        webhook-triggered sequence never saw, whether because it wasn&apos;t configured yet or because a
        gap like the ones in this guide let something through. It does not prevent a webhook problem on
        your own other systems; it catches the revenue those gaps would otherwise leave permanently
        unrecovered. Full plan details, including what&apos;s included on Starter versus Pro, are on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>

      <InlineCTA>
        See whether a past gap already cost you anything: run Revova&apos;s free Lost Revenue Finder —
        it connects read-only to your processor and scans real invoice and charge history directly,
        independent of whether a webhook fired at the time. No card required.
      </InlineCTA>

      <H2 id="companion">How this differs from a dunning email deliverability problem</H2>
      <P>
        These are two distinct infrastructure layers, and mixing them up wastes time diagnosing the
        wrong one. This guide covers whether your system finds out about a failure (or a recovery) at
        all — a Stripe webhook event correctly reaching your endpoint, getting verified, and being
        processed. Our separate{' '}
        <A href="/blog/dunning-email-deliverability-guide">dunning email deliverability guide</A> covers
        the next link in the chain: once your system correctly knows about the failure and generates a
        recovery email, whether that email actually reaches the customer&apos;s inbox past SPF, DKIM,
        and DMARC checks and ongoing sender reputation.
      </P>
      <P>
        A business can have either problem without the other. A webhook pipeline that works flawlessly
        feeding a dunning sequence sent from a domain with no SPF record still loses recovery to
        deliverability. A perfectly authenticated sending domain fed by a webhook handler that silently
        drops events during deploys never gets the chance to send the email at all, because it never
        found out there was anything to send. Diagnosing recovery-rate problems means checking both
        layers independently — an unexplained drop could live in either one, and the fix looks
        completely different depending on which.
      </P>

      <H2 id="audit">How to check whether you&apos;ve been missing Stripe webhooks, starting today</H2>
      <P>
        Checking for this doesn&apos;t require new tooling — the data already exists in your Stripe
        Dashboard and your own system&apos;s logs, it just isn&apos;t something most teams think to
        cross-reference until they already suspect a problem.
      </P>
      <UL>
        <LI>
          <Strong>Review the webhook event log for each registered endpoint</Strong> in the Stripe
          Dashboard — it shows every delivery attempt and outcome, and a cluster of failed attempts
          on a specific date range is a direct signal of an outage window.
        </LI>
        <LI>
          <Strong>Compare failed-invoice counts in Stripe against what your own system logged.</Strong>{' '}
          Filter Stripe&apos;s Invoices view by uncollectible or past-due status for a given period, and
          compare that count against how many dunning emails or retry actions your own system recorded
          for the same window — a meaningful gap usually points at missed events rather than customers
          simply not responding.
        </LI>
        <LI>
          <Strong>Confirm your webhook signing secret matches across every environment.</Strong> A
          secret that was rotated in the Dashboard but not updated in production, or that differs
          between staging and production, causes every event to that environment to fail signature
          verification silently until someone checks the failed-delivery count.
        </LI>
        <LI>
          <Strong>Trigger a real test event with the Stripe CLI</Strong> and confirm your handler
          receives it, verifies it, responds with a 2xx, and correctly ignores a deliberately
          re-sent duplicate of the same event ID.
        </LI>
        <LI>
          <Strong>Check your own error monitoring for silent exceptions inside the handler itself</Strong>{' '}
          — a handler that throws after acknowledging receipt can look, from Stripe&apos;s side, like
          a successful delivery even though your own processing never completed.
        </LI>
        <LI>
          <Strong>Run a historical scan to size whatever a past gap already cost.</Strong> Because a
          processor-level scan reads invoice and charge state directly, it finds failures independent of
          whether a webhook fired correctly at the time — which makes it the most reliable way to
          measure the actual cost of a gap you&apos;ve already confirmed.
        </LI>
      </UL>

      <InlineCTA>
        Revova&apos;s Pro plan ($79/month) pairs the same signature-verified, idempotent live pipeline
        with a 12-month historical recovery scan and win-back campaigns for anything a past gap let
        through — 14-day free trial, no credit card, 30-day money-back guarantee.
      </InlineCTA>

      <Divider />

      <P>
        For Stripe&apos;s own documentation on webhook delivery, retry behavior, and best practices, see{' '}
        <A href="https://docs.stripe.com/webhooks">Stripe&apos;s webhooks overview</A>, and for the
        exact mechanics of verifying the <code>Stripe-Signature</code> header against your webhook
        signing secret, see{' '}
        <A href="https://docs.stripe.com/webhooks/signatures">Stripe&apos;s webhook signature verification documentation</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Your recovery stack is only as good as the events it actually receives"
        body="Revova's webhook pipeline is signature-verified and idempotent by design, and the free Lost Revenue Finder scans your real processor history directly — independent of whether a webhook fired at the time — to catch whatever a past gap already let through. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
