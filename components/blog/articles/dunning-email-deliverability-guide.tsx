import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CompareTable, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, BarChart, ProsCons, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'Why do my dunning emails go to spam even though the copy and timing are good?',
    a: 'Almost always because the sending domain fails one of three authentication checks a mailbox provider runs before it ever reads a word of the message: an SPF record, a DKIM signature, and a DMARC policy. Gmail, Outlook, and Yahoo decide inbox placement using sender reputation and authentication results first, and content quality second — a beautifully written, perfectly-timed dunning email sent from an unauthenticated domain routinely loses to a mediocre email sent from a properly authenticated one. Fix the DNS layer before you touch the subject line.',
  },
  {
    q: 'What is an SPF record, in plain terms?',
    a: 'An SPF (Sender Policy Framework) record is a DNS TXT record published on your sending domain that lists which mail servers are allowed to send email claiming to be from that domain. When a receiving server gets a message, it checks the connecting server’s IP address against your domain’s SPF record; if the sending server is not on the list, the message can fail SPF outright. It is the simplest of the three checks and the one most DIY setups get right — the trap is forgetting to add every service that sends on your behalf, including your dunning tool, your marketing ESP, and your transactional mailer, to the same record.',
  },
  {
    q: 'What is a DKIM signature and how is it different from SPF?',
    a: 'DKIM (DomainKeys Identified Mail) attaches a cryptographic signature to each outgoing message, generated with a private key your sending service holds; the receiving server verifies that signature against a public key published in a DNS TXT record on your domain (something like selector._domainkey.yourdomain.com). Where SPF checks which server sent the message, DKIM checks that the message itself was not altered in transit and genuinely came from a holder of your domain’s private key. You want both — they catch different kinds of spoofing and a strong DMARC policy leans on both being correctly aligned.',
  },
  {
    q: 'What do p=none, p=quarantine, and p=reject mean in a DMARC record?',
    a: 'They are the three policy levels a DMARC TXT record can set at _dmarc.yourdomain.com, telling receiving mailbox providers what to do with a message that fails SPF or DKIM alignment. p=none means monitor only — mail still gets delivered, but you receive aggregate reports showing pass/fail rates, which is the correct starting point for any new domain. p=quarantine tells providers to route failing mail to spam instead of blocking it outright. p=reject tells providers to refuse the message entirely. Jumping straight to p=reject before you have reviewed a few weeks of aggregate reports is one of the most common ways well-intentioned teams accidentally block their own legitimate dunning email.',
  },
  {
    q: 'Does Revova handle SPF, DKIM, and DMARC for me?',
    a: 'Revova generates the exact DNS records your dunning, pre-dunning, and win-back emails need and sends through infrastructure that is already warmed and monitored — but adding those records to your domain’s DNS is still something only you can do, since only the domain owner can edit DNS through their registrar or DNS host. This is genuinely technical work, and we would rather tell you that plainly than pretend a signup form removes it. What Revova does remove is the ongoing monitoring, IP reputation management, and suppression-list maintenance that sits on top of those records once they are in place.',
  },
  {
    q: 'What is sender reputation, and why do I need it if my DNS records are already correct?',
    a: 'Sender reputation is a mailbox provider’s ongoing, largely invisible score of how trustworthy your sending domain and IP address are, built from signals like your bounce rate, your spam complaint rate, and engagement signals — opens, clicks, replies, and how often recipients mark your mail as “not spam.” Correct SPF, DKIM, and DMARC only prove you are who you say you are; they say nothing about whether recipients actually want your mail. A perfectly authenticated domain with a rising spam complaint rate or a high bounce rate still loses inbox placement over time, which is why deliverability is a maintained process, not a one-time DNS setup.',
  },
  {
    q: 'How do I check whether my dunning emails are actually reaching the inbox?',
    a: 'For Gmail specifically, Google Postmaster Tools is the most direct source — it is free, requires only a DNS TXT record to verify domain ownership, and reports your spam complaint rate, IP and domain reputation, and authentication success rate directly from Google’s own data. Beyond that, watch your delivery rate and bounce rate inside whatever tool sends the mail, and pay attention to whether your dunning open rate is meaningfully below the 30–40% industry benchmark — a domain-wide drop is a stronger signal of a deliverability problem than any single customer complaint.',
  },
  {
    q: 'How long does it take for SPF, DKIM, and DMARC changes to take effect?',
    a: 'DNS propagation itself is usually fast — often under an hour, occasionally up to 24–48 hours depending on the TTL (time-to-live) set on the record and how aggressively resolvers cache it. What takes longer is sender reputation: a brand-new sending domain or subdomain has no history with mailbox providers yet, so a sudden burst of volume on day one — even from a perfectly authenticated domain — can still land in spam simply because the provider has nothing to trust it against. That is why subdomain warming, a gradual ramp-up in sending volume over one to two weeks, matters as much as getting the DNS records right.',
  },
  {
    q: 'What should I do first if I already suspect my dunning emails are landing in spam?',
    a: 'Verify domain ownership in Google Postmaster Tools and check your spam complaint rate and authentication pass rate there first — it will tell you within a day or two whether the problem is authentication, reputation, or something else entirely, like a suppressed or bounced address list. From there, confirm SPF and DKIM are both passing and aligned with your DMARC policy, check whether your DMARC policy is still at the conservative p=none setting long after it should have moved to quarantine, and review your bounce rate and unsubscribe rate for signs of list hygiene problems. Fix the authentication layer first; reputation recovers over subsequent weeks of clean sending, not overnight.',
  },
]

// A dunning email moving through the three authentication checks a mailbox
// provider runs before deciding inbox vs spam. width/height set.
function AuthPipelineFlow() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 800 270" width="800" height="270" className="w-full h-auto" role="img"
        aria-label="A dunning email passes through an SPF check, a DKIM check, and a DMARC alignment decision before a mailbox provider routes it to the inbox or to spam">
        <defs>
          <marker id="ah2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#cbd5e1" />
          </marker>
        </defs>
        <rect x="10" y="103" width="130" height="54" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x="75" y="135" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#3730a3" fontFamily="Segoe UI, Arial, sans-serif">Dunning email</text>
        <path d="M140 130 L204 130" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah2)" fill="none" />
        <rect x="208" y="103" width="110" height="54" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
        <text x="263" y="125" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#166534" fontFamily="Segoe UI, Arial, sans-serif">SPF</text>
        <text x="263" y="141" textAnchor="middle" fontSize="11" fill="#166534" fontFamily="Segoe UI, Arial, sans-serif">check</text>
        <path d="M318 130 L382 130" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah2)" fill="none" />
        <rect x="386" y="103" width="110" height="54" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
        <text x="441" y="125" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#166534" fontFamily="Segoe UI, Arial, sans-serif">DKIM</text>
        <text x="441" y="141" textAnchor="middle" fontSize="11" fill="#166534" fontFamily="Segoe UI, Arial, sans-serif">check</text>
        <path d="M496 130 L560 130" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah2)" fill="none" />
        <rect x="564" y="103" width="130" height="54" rx="12" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1.5" />
        <text x="629" y="125" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#92400e" fontFamily="Segoe UI, Arial, sans-serif">DMARC</text>
        <text x="629" y="141" textAnchor="middle" fontSize="11" fill="#92400e" fontFamily="Segoe UI, Arial, sans-serif">alignment</text>
        <path d="M600 157 C 560 190, 480 190, 415 213" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah2)" fill="none" />
        <path d="M660 157 C 700 190, 730 190, 780 213" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah2)" fill="none" />
        <rect x="340" y="216" width="150" height="40" rx="10" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
        <text x="415" y="241" textAnchor="middle" fontSize="13" fontWeight="700" fill="#065f46" fontFamily="Segoe UI, Arial, sans-serif">Inbox</text>
        <rect x="620" y="216" width="170" height="40" rx="10" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
        <text x="705" y="241" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9f1239" fontFamily="Segoe UI, Arial, sans-serif">Spam / rejected</text>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">
        Every dunning email is checked against SPF, DKIM, and DMARC before a mailbox provider decides where it lands — content and timing only matter after it clears this gate.
      </figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        Dunning email deliverability fails most often for a reason that has nothing to do with the
        email itself: the sending domain never passed the three checks a mailbox provider runs before
        it reads a single word of the message — an <Strong>SPF record</Strong>, a{' '}
        <Strong>DKIM signature</Strong>, and a <Strong>DMARC policy</Strong>. Get the copy and the
        timing exactly right, as our other dunning guides cover in depth, and it still will not matter
        if Gmail, Outlook, or Yahoo route the message straight to spam or drop it before delivery. This
        guide covers the part almost nobody writes about: what these three DNS records actually check,
        how sender reputation decides the rest once authentication passes, the setup mistakes that
        quietly cap recovery, and an honest answer to how much of this a tool like Revova can — and
        cannot — do for you.
      </Lead>
      <P>
        We build the software that sends these emails for other people&rsquo;s Stripe, Paddle, Braintree,
        Chargebee, and Recurly accounts, and the single most common support conversation we have is not
        about subject lines or send times — it is a founder asking why their open rate suddenly cratered,
        and the answer is almost always sitting in a DNS record they never touched. This is the guide we
        point people to before we point them anywhere else, because no amount of tuning a recovery
        sequence&rsquo;s wording matters until the underlying delivery pipe is proven trustworthy to Gmail,
        Outlook, and Yahoo.
      </P>
      <P>
        None of this is exotic. SPF, DKIM, and DMARC are decades-old, well-documented internet standards
        that every legitimate transactional sender — receipts, password resets, shipping notifications —
        already relies on. Dunning email is unusual only in how much revenue rides on a handful of
        messages reaching an inbox at exactly the right moment in a billing cycle, which makes a silent
        deliverability failure on this specific email category more expensive than almost any other kind
        of email a subscription business sends.
      </P>

      <KeyTakeaways
        items={[
          <>Deliverability is decided before content: mailbox providers check <Strong>SPF, DKIM, and DMARC</Strong> first, and judge sender reputation continuously — good copy cannot overcome a failed authentication check.</>,
          <>An <Strong>SPF record</Strong> and a <Strong>DKIM signature</Strong> are both DNS TXT records that prove you are who you say you are; a <Strong>DMARC policy</Strong> decides what happens when they disagree with the visible From: address.</>,
          <>Move a new DMARC policy from <code>p=none</code> to <code>p=quarantine</code> to <code>p=reject</code> gradually, over weeks, not on day one — jumping straight to <code>p=reject</code> is a common way to accidentally block your own dunning email.</>,
          <>Authentication only proves identity — <Strong>sender reputation</Strong> (bounce rate, spam complaint rate, engagement signals) decides inbox placement afterward, and has to be maintained continuously.</>,
          <>Revova can generate the exact records and send through warmed, monitored infrastructure, but adding DNS records to your domain is work only you, as the domain owner, can do.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of subscription charges fail on a given billing cycle — the volume deliverability has to carry' },
          { value: '30–40%', label: 'typical open rate for a dunning email that actually reaches the inbox' },
          { value: '40–60%', label: 'of failed charges recoverable via retries + dunning combined — only if the emails get delivered' },
        ]}
      />

      <H2 id="why">Why dunning emails land in spam even when the copy is perfect</H2>
      <P>
        A dunning email lands in spam when a mailbox provider&rsquo;s automated systems decide, before a
        human ever sees it, that the sending domain either cannot be verified or does not have enough
        earned trust to reach the inbox — and neither of those decisions has anything to do with whether
        the subject line is good or the send time is right. Gmail, Microsoft (Outlook/Hotmail), and Yahoo
        each run their own spam-filtering pipelines, but all three lean heavily on the same foundation:
        can this message be authenticated back to a real, consistent sending identity, and does that
        identity have a track record of sending mail people actually want.
      </P>
      <P>
        This is the gap almost every other dunning resource skips. Our own guides on{' '}
        <A href="/blog/dunning-email-examples-templates">dunning email examples and templates</A> and{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">setting up a dunning email sequence</A> cover
        what to say and when to say it — the content and timing layer. Neither one can help if the
        message never reaches an inbox at all. A technically perfect, decline-reason-personalized,
        timezone-aware email sent from an unauthenticated domain routinely loses to a mediocre generic
        template sent from a domain with clean SPF, DKIM, and DMARC and a healthy sending history. If
        you have not read <A href="/blog/what-is-dunning">what is dunning</A> yet and want the foundation
        first, that is a good starting point before this one — this guide assumes you already know why
        dunning matters and want to know why it is not working.
      </P>
      <Callout title="The order that actually matters">
        Fix authentication first, reputation second, and copy or timing last. A domain that fails SPF or
        DKIM has a ceiling on inbox placement that no amount of copywriting raises. Once authentication
        passes cleanly, reputation determines how close you get to that ceiling — and only once both are
        solid does the difference between a good subject line and a great one start to matter.
      </Callout>

      <H2 id="authentication">The three DNS records mailbox providers check before anything else</H2>
      <P>
        SPF, DKIM, and DMARC are three separate DNS TXT records that together let a receiving mail
        server verify that a message genuinely came from your domain and was not altered along the way.
        They are complementary, not redundant — each one closes a different gap, and DMARC specifically
        depends on the other two being set up correctly to do its job.
      </P>

      <H3>SPF record — which servers are allowed to send as you</H3>
      <P>
        An SPF (Sender Policy Framework) record is a DNS TXT record on your sending domain that lists the
        mail servers authorized to send email on your behalf. When a receiving server gets a message
        claiming to be from <code>yourdomain.com</code>, it looks up that domain&rsquo;s SPF record and
        checks whether the connecting server&rsquo;s IP address is on the approved list. A record commonly
        looks something like <code>v=spf1 include:_spf.yourprovider.com ~all</code> — the{' '}
        <code>include</code> mechanism adds a provider&rsquo;s servers to your allowed list, and the
        trailing qualifier tells receiving servers how strictly to treat a mismatch. The most common DIY
        mistake is not writing the record wrong, but forgetting to add every service that sends on the
        domain&rsquo;s behalf — your dunning tool, your marketing ESP, your transactional receipts — to the
        same record, since a domain can only have one SPF record and each sender needs its own{' '}
        <code>include</code> line inside it.
      </P>

      <H3>DKIM signature — proof the message was not altered</H3>
      <P>
        DKIM (DomainKeys Identified Mail) works differently: instead of checking which server sent the
        message, it attaches a cryptographic signature to the message headers, generated with a private
        key your sending service holds. The receiving server pulls a matching public key from a DNS TXT
        record — typically at a path like <code>selector._domainkey.yourdomain.com</code>, where{' '}
        <code>selector</code> is a short string your provider assigns — and verifies the signature against
        it. If anything in the signed portion of the message changed in transit, or if the signature does
        not match the public key on file, DKIM fails. SPF and DKIM catch different failure modes: SPF
        stops an unauthorized server from claiming your domain; DKIM stops a message from being tampered
        with, or a spoofed message from lacking a valid signature at all.
      </P>

      <H3>DMARC policy — what happens when SPF or DKIM disagree with the From address</H3>
      <P>
        DMARC (Domain-based Message Authentication, Reporting and Conformance) is the policy layer sitting
        on top of both. It is a DNS TXT record published at <code>_dmarc.yourdomain.com</code> that does
        two things: it requires SPF and DKIM results to be in alignment with the domain shown in the
        visible From: address, not just technically passing somewhere, and it tells receiving providers
        what to do when that alignment fails. The policy is set with a <code>p=</code> tag with three
        possible values — <code>p=none</code> (monitor only, deliver anyway, but generate aggregate
        reports), <code>p=quarantine</code> (route failing mail to spam), or <code>p=reject</code> (refuse
        it outright). DMARC also supports a <code>rua</code> tag pointing to an email address where you
        receive daily aggregate reports summarizing pass/fail rates across every source claiming to send
        as your domain — genuinely useful for catching a misconfigured tool before it becomes a spam
        problem.
      </P>
      <CompareTable
        rows={[
          ['Record', 'What it checks', 'Where it lives', 'What it stops'],
          ['SPF record', 'Which mail servers are authorized to send for your domain', 'A DNS TXT record on the root or sending domain', 'An unauthorized server sending mail claiming to be from you'],
          ['DKIM signature', 'A cryptographic signature verified against a public key', 'A DNS TXT record at selector._domainkey.yourdomain.com', 'Message tampering in transit and unsigned spoofed mail'],
          ['DMARC policy', 'Whether SPF/DKIM results align with the visible From: domain', 'A DNS TXT record at _dmarc.yourdomain.com (p=none/quarantine/reject)', 'Misaligned mail from reaching the inbox — or from sending at all under p=reject'],
        ]}
      />
      <P>
        Get all three passing and aligned, and a mailbox provider has confirmed your identity as far as
        DNS can prove it. That is necessary, but it is only half the picture — the other half, covered
        below, is whether recipients have actually been treating your mail as wanted.
      </P>

      <H2 id="setup">How to actually set up SPF, DKIM, and DMARC for dunning email</H2>
      <P>
        Setting up all three is genuinely a DNS task, not a code task — you are adding TXT records
        through your domain registrar or DNS host (Cloudflare, Route 53, GoDaddy, Namecheap, and similar),
        and the records themselves are supplied by whichever service actually sends the mail. The order
        below is the one that avoids the two most common self-inflicted outages.
      </P>
      <OL>
        <LI>
          <Strong>Decide on a sending domain or subdomain.</Strong> Many teams send dunning email from a
          dedicated subdomain — something like <code>mail.yourdomain.com</code> or{' '}
          <code>notify.yourdomain.com</code> — rather than the root domain. This isolates the sending
          reputation of transactional and recovery email from your primary domain, so a reputation problem
          on one does not drag down the other.
        </LI>
        <LI>
          <Strong>Add the SPF record.</Strong> Publish a single TXT record on the sending domain listing
          every service authorized to send on your behalf, combined into one record with the correct{' '}
          <code>include</code> mechanisms — a domain with two competing SPF records is invalid and will
          fail checks entirely.
        </LI>
        <LI>
          <Strong>Add the DKIM record.</Strong> Your sending provider generates a public/private key pair
          and gives you the exact TXT record and selector to publish; paste it in verbatim, since a single
          truncated or malformed DKIM key will fail silently rather than throwing an obvious error.
        </LI>
        <LI>
          <Strong>Set a return-path domain that matches.</Strong> The return-path domain (sometimes called
          the bounce domain, used for the technical <code>Return-Path:</code> header) should also live
          under your sending domain and be covered by the same SPF record — a return-path domain that
          points somewhere unrelated is a common reason SPF alignment quietly fails even when the record
          itself looks correct.
        </LI>
        <LI>
          <Strong>Publish DMARC at <code>p=none</code> first.</Strong> Start in monitor-only mode and
          point the <code>rua</code> aggregate-report address somewhere you will actually check. Watch
          reports for one to two weeks, confirm every legitimate sender is passing, then move to{' '}
          <code>p=quarantine</code>, and only move to <code>p=reject</code> once you have confirmed nothing
          legitimate is still failing.
        </LI>
        <LI>
          <Strong>Warm the subdomain before sending at full volume.</Strong> A brand-new sending domain or
          subdomain has no history with any mailbox provider, so a sudden burst of volume on day one can
          land in spam even with perfect DNS records, simply because the provider has nothing to trust it
          against yet. Ramp volume gradually over one to two weeks — a small, engaged batch first, larger
          batches as engagement signals accumulate.
        </LI>
      </OL>
      <AuthPipelineFlow />
      <Callout title="Do not skip straight to p=reject">
        Going straight from no DMARC record to <code>p=reject</code> is one of the fastest ways to
        accidentally block your own dunning email — if any legitimate sending path was missed in the SPF
        record or misconfigured in DKIM, <code>p=reject</code> instructs receiving providers to refuse
        that mail outright, with no warning beyond an aggregate report you may not be watching yet.
        <code>p=none</code> costs you nothing in deliverability while you confirm everything is aligned.
      </Callout>

      <InlineCTA>
        Revova generates the exact SPF, DKIM, and DMARC records your dunning sequence needs and sends
        through infrastructure that is already warmed and monitored — Starter is $29/month, Pro is
        $79/month, both with a 14-day free trial and no credit card required.
      </InlineCTA>

      <H2 id="reputation">Sender reputation: the layer no DNS record fixes</H2>
      <P>
        Sender reputation is a mailbox provider&rsquo;s ongoing, mostly invisible score of how trustworthy
        your sending domain and IP address are, and it keeps being recalculated long after your SPF,
        DKIM, and DMARC records are already correct. A domain can pass every authentication check and
        still lose inbox placement over time if its bounce rate climbs, its spam complaint rate rises, or
        its engagement signals — opens, clicks, replies, and how often recipients mark mail as wanted —
        trend downward. Authentication proves identity once, at send time; reputation is a rolling
        judgment built from weeks of behavior.
      </P>
      <P>
        Three signals matter most, and dunning email has a structural advantage on at least one of them:
      </P>
      <UL>
        <LI>
          <Strong>Bounce rate.</Strong> A hard bounce (invalid or nonexistent address) that keeps getting
          resent damages reputation fast — this is exactly why list hygiene and address suppression matter
          for a recovery sequence, not just for marketing email.
        </LI>
        <LI>
          <Strong>Spam complaint rate.</Strong> Every time a recipient clicks &ldquo;report spam&rdquo;
          instead of unsubscribing, it counts against the sending domain&rsquo;s reputation with that
          provider specifically. Gmail and Yahoo both publish bulk-sender guidance asking senders to keep
          this rate low and to make unsubscribing genuinely one click, precisely because a rising complaint
          rate is one of the strongest negative signals a mailbox provider tracks.
        </LI>
        <LI>
          <Strong>Engagement signals.</Strong> Opens, clicks, and replies tell a provider real humans want
          this mail. This is where dunning email has a structural edge over marketing email: because the
          recipient has direct, self-interested reason to open it — their subscription is at risk — dunning
          emails commonly see notably higher engagement than typical marketing sends, which is also exactly
          why a deliverability failure on this category of email is such an expensive mistake to make.
        </LI>
      </UL>
      <P>
        Put engagement in context against the same open- and click-rate benchmarks we cite across our
        dunning guides — this is the ceiling reputation is trying to protect, not add to:
      </P>
      <BarChart
        bars={[
          { label: 'Open rate', pct: 35, value: '30–40%' },
          { label: 'Click rate', pct: 12, value: '10–15%' },
        ]}
        caption="Typical dunning email engagement once it reaches the inbox — the exact numbers a deliverability failure zeroes out entirely, regardless of how good the copy is."
      />
      <P>
        <A href="https://support.google.com/a/answer/81126" >Google&rsquo;s bulk sender guidelines</A>{' '}
        (which apply once a domain sends meaningful volume to Gmail addresses) are the clearest public
        statement of how seriously mailbox providers take this: authenticated SPF and DKIM, a published
        DMARC policy, a low spam complaint rate, and a functioning one-click unsubscribe are treated as
        baseline requirements, not best practices. A domain that ignores any one of them risks having mail
        throttled or blocked at the provider level, independent of anything about the message content.
      </P>
      <Callout title="Google Postmaster Tools is the closest thing to ground truth">
        For Gmail specifically, Google Postmaster Tools is free, requires only a DNS TXT record to verify
        domain ownership, and reports your spam complaint rate, domain and IP reputation, and
        authentication success rate directly from Google&rsquo;s own data — rather than inferring
        deliverability indirectly from open-rate drops days after the fact.
      </Callout>

      <H2 id="beyond-dns">Beyond DNS: how spam filters weigh everything else</H2>
      <P>
        Passing SPF, DKIM, and DMARC gets a dunning email past the front door — it does not guarantee a
        seat at the table. Once a message is authenticated, mailbox providers layer additional,
        largely proprietary signals on top before deciding final placement, and understanding what those
        signals broadly reward is useful even though none of the providers publish exact weightings.
      </P>
      <UL>
        <LI>
          <Strong>Recipient-level history.</Strong> Gmail in particular personalizes inbox placement per
          recipient — a customer who has opened and clicked several of your previous dunning emails is far
          more likely to see the next one land in their primary inbox than a recipient who has never
          engaged with your domain before, independent of your domain-wide reputation.
        </LI>
        <LI>
          <Strong>Link and domain reputation inside the message.</Strong> Every link in a dunning email —
          the &ldquo;update your payment method&rdquo; button, in particular — points to a domain that has
          its own reputation, separate from your sending domain. Linking to a URL shortener, an unfamiliar
          third-party checkout host, or a domain with a poor reputation of its own can drag down an
          otherwise well-authenticated message.
        </LI>
        <LI>
          <Strong>Feedback loops.</Strong> Several large mailbox providers offer feedback loops that report
          spam complaints back to the originating sending service in near real time. A dunning platform
          that ignores these signals keeps sending to addresses actively marking mail as spam, which
          compounds the reputation damage instead of containing it.
        </LI>
        <LI>
          <Strong>Consistency over time.</Strong> A sending pattern that looks stable and predictable —
          similar volume, similar structure, similar send windows — reads as more trustworthy than one that
          spikes unpredictably, which is part of why a slow, monitored ramp beats an abrupt full-volume
          launch even after authentication is already correct.
        </LI>
      </UL>
      <P>
        None of these four signals are things a DNS record can fix, and none of them are things a subject
        line rewrite fixes either — they are earned gradually, through consistent sending behavior and a
        list that genuinely wants the mail it receives. This is the layer that keeps deliverability a
        maintained discipline rather than a one-time technical project.
      </P>

      <H2 id="mistakes">Deliverability mistakes that quietly cap dunning recovery</H2>
      <P>
        Most underperforming dunning sequences are not obviously broken — they send without error, and
        the sender has no idea a meaningful share never reached an inbox. These are the mistakes we see
        most often, roughly in order of how much damage they do:
      </P>
      <UL>
        <LI>
          <Strong>No SPF or DKIM at all.</Strong> Still common on domains that migrated ESPs or added a
          new sending tool without updating DNS — the single fastest way to have every dunning email
          treated with suspicion by default.
        </LI>
        <LI>
          <Strong>Publishing DMARC at p=reject on day one.</Strong> Well-intentioned but backwards; it
          turns any small SPF or DKIM misconfiguration into silently blocked mail instead of a visible
          warning.
        </LI>
        <LI>
          <Strong>Sending dunning email from the same domain and IP pool as bulk marketing email.</Strong>{' '}
          A marketing campaign with a rough send — high complaint rate, aggressive frequency — drags down
          the shared reputation that your dunning sequence depends on, even though the two email types have
          nothing to do with each other.
        </LI>
        <LI>
          <Strong>No subdomain warming before a volume launch.</Strong> Turning on a dunning sequence for
          an entire existing customer base at once, from a brand-new sending domain, looks statistically
          identical to a spam burst to a mailbox provider that has never seen that domain before.
        </LI>
        <LI>
          <Strong>No suppression list.</Strong> Continuing to send to addresses that already bounced or
          filed a spam complaint damages sender reputation for every subsequent email from that domain, not
          just the ones sent to that address.
        </LI>
        <LI>
          <Strong>A broken or hidden unsubscribe link.</Strong> If unsubscribing is not genuinely one click,
          a meaningful share of recipients who want out will click &ldquo;report spam&rdquo; instead,
          which is far more damaging to reputation than a clean unsubscribe would have been.
        </LI>
        <LI>
          <Strong>Never checking Google Postmaster Tools or equivalent reporting.</Strong> Most teams find
          out about a deliverability problem when open rates visibly crater — weeks after the underlying
          cause started, and after a meaningful amount of recoverable revenue already went unseen.
        </LI>
      </UL>
      <Callout title="The pattern behind almost every item on this list">
        Every mistake above is a maintenance failure, not a one-time setup failure. DNS records can be
        correct on day one and still degrade in effect as tools change, volume grows, or list hygiene
        slips — deliverability is closer to an ongoing operational discipline than a checkbox you tick
        once and forget.
      </Callout>

      <H2 id="diy-vs-tool">Should you manage deliverability yourself, or let a tool help?</H2>
      <P>
        Plenty of technical teams run this entirely in-house, and for a team with existing DevOps or
        email-infrastructure experience, that is a reasonable choice. The honest trade-off is less about
        whether it is possible and more about whether it is the best use of a non-technical founder&rsquo;s
        limited time, especially given that this work never really finishes.
      </P>
      <P>
        The clearest way to think about it: SPF, DKIM, and DMARC are a setup cost, paid mostly once per
        domain. Sender reputation is a running cost, paid continuously in attention — watching Postmaster
        Tools, reviewing DMARC aggregate reports, keeping list hygiene clean, and reacting quickly when a
        number starts trending the wrong way. A founder weighing this against everything else on their
        plate is really deciding who carries that running cost, not just who configures the DNS records on
        day one.
      </P>
      <ProsCons
        pros={[
          'Full control over the sending domain, IP reputation, and every DNS record — nothing routes through a third party.',
          'No recurring dependency on a vendor for the highest-trust channel you have with a customer.',
          'Reasonable at low volume, where a single missed check is unlikely to trigger provider-level blocking.',
        ]}
        cons={[
          'SPF, DKIM, and DMARC all have to be configured correctly and kept current — a new ESP, a new marketing tool, or a migrated mail server can silently break SPF without anyone noticing for weeks.',
          'Sender reputation has to be built and monitored continuously (bounce rate, spam complaint rate, engagement signals), not configured once and left alone.',
          'Recovering from a reputation problem, or warming a new sending domain from scratch, takes real weeks most non-technical founders have not budgeted for.',
        ]}
      />
      <P>
        Revova sends dunning, pre-dunning, and win-back email through infrastructure that is already
        warmed, monitored, and configured with correct authentication, and it automatically suppresses
        addresses that bounce or file a spam complaint so a reputation problem on one recipient does not
        spread to the rest of your list. It does not, and honestly cannot, add the DNS records to your
        domain for you — that step belongs to whoever owns the domain&rsquo;s registrar account, and no
        SaaS tool can bypass that without asking for access you almost certainly should not grant. What a
        dedicated tool mainly buys back is everything downstream of that one setup step: ongoing reputation
        monitoring, suppression-list maintenance, and not having to become the person on your team who
        understands DMARC aggregate reports. Full plan and pricing details are on the{' '}
        <A href="/pricing">Revova pricing page</A>.
      </P>

      <InlineCTA>
        Not sure how much of your failed-payment revenue is actually recoverable once deliverability is
        fixed? Run Revova&rsquo;s free Lost Revenue Finder — it connects read-only and scans your real
        payment history, no card required.
      </InlineCTA>

      <H2 id="verify">How to verify your dunning emails are actually landing</H2>
      <P>
        The only reliable way to know whether deliverability is a problem is to check authentication and
        reputation data directly, rather than inferring it from a falling open rate days or weeks after
        the fact. A short verification routine, run monthly at minimum and immediately after any change to
        your sending setup, catches most problems before they cost meaningful recovered revenue.
      </P>
      <P>
        It helps to treat this the same way you would treat monitoring for a payment webhook or an API
        integration — something with an owner, a cadence, and a defined response when a number moves the
        wrong way, rather than something checked only when a customer happens to mention their card update
        email never arrived. A calendar reminder tied to whoever owns billing operations is usually enough;
        this does not need to be a full-time responsibility, it needs to be nobody&rsquo;s forgotten one.
      </P>
      <UL>
        <LI>
          <Strong>Verify domain ownership in Google Postmaster Tools</Strong> and check your spam
          complaint rate, IP reputation, and domain reputation panels — this is the closest thing to
          ground truth for Gmail-bound mail specifically.
        </LI>
        <LI>
          <Strong>Check your DMARC aggregate reports</Strong> (sent to whatever address your{' '}
          <code>rua</code> tag points to) for any source claiming to send as your domain that is failing
          alignment — this catches a misconfigured tool before it becomes a delivery problem.
        </LI>
        <LI>
          <Strong>Confirm SPF and DKIM are both still passing</Strong> after any change to your ESP,
          dunning tool, or DNS host — a routine migration is the single most common way a previously
          correct setup silently breaks.
        </LI>
        <LI>
          <Strong>Compare your actual dunning open rate against the 30–40% benchmark.</Strong> A domain-wide
          drop, especially one that lines up with a change you made, is a stronger deliverability signal
          than any individual customer complaint.
        </LI>
        <LI>
          <Strong>Review your bounce rate and unsubscribe rate</Strong> for a rising trend, which usually
          points to list hygiene rather than a copy or timing problem.
        </LI>
      </UL>

      <H2 id="fix">What to do if your dunning emails are already in spam</H2>
      <P>
        If you already suspect a deliverability problem, the fix is authentication first, reputation
        second — do not start by rewriting the emails, because copy changes cannot repair a failed SPF
        check or a damaged sender reputation.
      </P>
      <OL>
        <LI>
          Confirm SPF, DKIM, and DMARC are all correctly published and passing, using your DNS host&rsquo;s
          TXT record lookup and your DMARC aggregate reports as the source of truth.
        </LI>
        <LI>
          Check whether your DMARC policy is still sitting at <code>p=none</code> long after you meant to
          tighten it — or, less commonly, whether it jumped to <code>p=reject</code> before every
          legitimate sender was confirmed passing.
        </LI>
        <LI>
          Review your suppression list and remove or stop sending to any address that has bounced or
          complained recently — continuing to email them actively damages the reputation of every other
          send.
        </LI>
        <LI>
          If reputation has genuinely degraded, consider sending dunning email from a fresh, dedicated
          subdomain and warming it gradually rather than trying to repair the existing one&rsquo;s history
          — a clean start is often faster than a slow rehabilitation.
        </LI>
        <LI>
          Once authentication and list hygiene are both clean, give it several weeks of consistent,
          low-complaint sending before expecting reputation to fully recover — mailbox providers weigh
          recent history more heavily than a single clean week.
        </LI>
      </OL>
      <InlineCTA>
        Revova&rsquo;s Pro plan ($79/month) includes ongoing deliverability monitoring and automatic
        suppression alongside the AI-written, decline-reason-routed sequence — 14-day free trial, no
        credit card.
      </InlineCTA>
      <P>
        Once the underlying delivery problem is actually fixed, the content and timing work in our other
        guides starts paying off again — see{' '}
        <A href="/blog/dunning-email-examples-templates">dunning email examples and templates</A> for copy
        that converts once it lands, and{' '}
        <A href="/blog/dunning-email-sequence-setup-guide">how to set up a dunning email sequence</A> for
        the cadence and decline-reason routing on top of it. If you are also running Stripe&rsquo;s
        built-in retries alongside your dunning sequence, <A href="/blog/stripe-smart-retries-explained">
          how Stripe Smart Retries works
        </A>{' '}
        is worth reading too — retries and deliverable dunning email solve different halves of the same
        recovery problem.
      </P>

      <Divider />

      <P>
        For Google&rsquo;s own published requirements for bulk senders, see{' '}
        <A href="https://support.google.com/a/answer/81126">Google&rsquo;s bulk sender guidelines</A>, and
        for the technical specification behind DMARC alignment and policy reporting, see the{' '}
        <A href="https://dmarc.org/overview/">DMARC.org overview</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Fix deliverability, then let the sequence do its job"
        body="Revova sends dunning, pre-dunning, and win-back email through infrastructure that is already authenticated, warmed, and monitored, and generates the exact SPF, DKIM, and DMARC records your domain needs. Start with a free scan of what you've already lost, then make sure the recovery emails actually land. 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
