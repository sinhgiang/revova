import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, ProsCons, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, BarChart, EmailExample, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is a dunning email?',
    a: 'A dunning email is an automated message sent to a customer when their subscription payment fails, asking them to update their payment method so their service continues. Good dunning emails are personalized to the specific decline reason, sent on a timed sequence, and include a single one-click link to fix the card.',
  },
  {
    q: 'How many dunning emails should I send?',
    a: 'Most effective sequences use four to five emails over about three weeks — commonly Day 1, 3, 7, 14 and 21. The first two recover the majority; the later ones add urgency and a final notice before the subscription is cancelled. Sending more than that rarely helps and risks annoying customers.',
  },
  {
    q: 'What should a dunning email say?',
    a: 'Lead with a calm, honest heads-up that a payment did not go through, state the specific reason if you know it, and give one obvious button to update the card. Keep it short, write it as if it came from a person, reassure the customer their account is safe for now, and always include a one-click unsubscribe.',
  },
  {
    q: 'When is the best time to send dunning emails?',
    a: 'Send at a human hour in the customer’s own timezone — around 8:30am local tends to perform well — rather than whenever the charge happened to fail. Space the sequence over days so retries can hit a payday, and avoid late-night sends that feel automated.',
  },
  {
    q: 'Do dunning emails actually work?',
    a: 'Yes. Personalized, well-timed dunning emails on top of automatic card retries can recover a large share of failed payments — pushing total recovered revenue into the 40–60% range for many businesses. Generic "your payment failed" templates underperform badly, which is why personalization matters.',
  },
  {
    q: 'Should I write dunning emails myself or automate them?',
    a: 'You can start with templates like the ones below, but maintaining per-reason personalization, correct timing, timezone sends, deliverability and suppression by hand is a lot of ongoing work. A tool like Revova writes a unique email per decline reason automatically and sends it at the right time, so you set it up once.',
  },
]

// Annotated "anatomy" of a dunning email — an inline SVG mock with numbered
// callouts. width/height set so it never collapses to zero height.
function EmailAnatomy() {
  const cardX = 60, cardW = 380
  const marks = [
    { y: 51, label: 'Calm, honest subject line' },
    { y: 101, label: 'Personal greeting' },
    { y: 194, label: 'The exact reason it failed' },
    { y: 256, label: 'One obvious button' },
    { y: 305, label: 'Reassure + gentle deadline' },
    { y: 376, label: 'One-click unsubscribe' },
  ]
  return (
    <figure className="my-8">
      <svg viewBox="0 0 760 430" width="760" height="430" className="w-full h-auto" role="img"
        aria-label="The anatomy of a dunning email: a calm subject, personal greeting, the exact decline reason, one clear button, reassurance, and a one-click unsubscribe">
        <rect x={cardX} y="20" width={cardW} height="390" rx="16" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5" />
        <line x1={cardX} y1="76" x2={cardX + cardW} y2="76" stroke="#f3f4f6" strokeWidth="1.5" />
        <rect x="84" y="44" width="250" height="15" rx="7" fill="#111827" />
        <rect x="84" y="96" width="120" height="11" rx="5" fill="#9ca3af" />
        <rect x="84" y="124" width="330" height="9" rx="4" fill="#d1d5db" />
        <rect x="84" y="144" width="300" height="9" rx="4" fill="#d1d5db" />
        <rect x="84" y="172" width="330" height="46" rx="8" fill="#eef2ff" stroke="#c7d2fe" />
        <rect x="100" y="187" width="190" height="9" rx="4" fill="#6366f1" />
        <rect x="100" y="202" width="150" height="7" rx="3" fill="#a5b4fc" />
        <rect x="84" y="236" width="180" height="40" rx="10" fill="#4f46e5" />
        <text x="174" y="261" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Segoe UI, Arial, sans-serif">Update your card</text>
        <rect x="84" y="300" width="250" height="9" rx="4" fill="#d1d5db" />
        <rect x="84" y="372" width="110" height="8" rx="4" fill="#e5e7eb" />
        {marks.map((m, i) => (
          <g key={i} fontFamily="Segoe UI, Arial, sans-serif">
            <line x1={cardX + cardW} y1={m.y} x2="458" y2={m.y} stroke="#c7d2fe" strokeWidth="1.5" />
            <circle cx="470" cy={m.y} r="13" fill="#4f46e5" />
            <text x="470" y={m.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">{i + 1}</text>
            <text x="492" y={m.y + 5} fontSize="14.5" fontWeight="600" fill="#374151">{m.label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">The six parts of a dunning email that actually recovers.</figcaption>
    </figure>
  )
}

// Template data kept as strings so apostrophe-heavy copy needs no JSX escaping.
const sequence = [
  {
    tag: 'Sequence · Day 1',
    subject: 'A quick heads-up about your [Product] payment',
    lines: [
      'Hi [First name],',
      'Just a quick note — we tried to process your latest [Product] payment of [amount] today and it didn’t go through. No stress, this happens all the time and it’s usually a 30-second fix.',
      'You can update your card here: [update link]',
      'Your account is fully active in the meantime. Thanks for being a customer!',
      '— [Your name], [Product]',
    ],
    why: 'Opens soft and blame-free, states the amount, gives one link, and reassures the customer nothing is broken yet. Most recoveries happen right here.',
  },
  {
    tag: 'Sequence · Day 3',
    subject: 'Still can’t process your [Product] payment',
    lines: [
      'Hi [First name],',
      'We tried your card again and it still isn’t going through. To keep your [Product] account running without interruption, could you update your payment details?',
      'Update in one click: [update link]',
      'If you’ve already updated it, you can ignore this — thank you!',
    ],
    why: 'A gentle second nudge. Acknowledges a retry was attempted and pre-empts the "I already fixed it" reply, which reduces support noise.',
  },
  {
    tag: 'Sequence · Day 7',
    subject: 'Don’t lose access to [Product]',
    lines: [
      'Hi [First name],',
      'Your [Product] payment is still outstanding, and we’d hate for you to lose access to [key benefit] over a card issue.',
      'It takes less than a minute to fix: [update link]',
      'Any questions, just reply to this email — a real person will help.',
    ],
    why: 'Shifts from "a payment failed" to "here’s what you’ll lose," which reframes the ask around the customer’s stake. The reply-to-a-human line lifts trust.',
  },
  {
    tag: 'Sequence · Day 14',
    subject: 'Action needed: your [Product] account will pause soon',
    lines: [
      'Hi [First name],',
      'We still haven’t been able to process your payment, so your [Product] account is scheduled to pause on [date] unless the card is updated.',
      'Keep everything running: [update link]',
      'We’d genuinely like to keep you — if something’s changed or you’re unsure, just reply and we’ll sort it out together.',
    ],
    why: 'Introduces a concrete deadline and consequence (a specific pause date) while still offering a human off-ramp. Urgency plus empathy converts better than either alone.',
  },
  {
    tag: 'Sequence · Day 21 — final notice',
    subject: 'Final notice: [Product] access ends [date]',
    lines: [
      'Hi [First name],',
      'This is the last reminder — after several attempts we still can’t process your payment, so your [Product] subscription will be cancelled on [date].',
      'You can still keep it active by updating your card now: [update link]',
      'If this is goodbye, thank you for being a customer. You’re always welcome back, and your data will be here if you return.',
    ],
    why: 'A clear, respectful final notice. The graceful "you’re welcome back" close leaves the door open for a later win-back instead of burning the relationship.',
  },
]

const byReason = [
  {
    tag: 'By decline reason · Expired card',
    subject: 'Your card on file has expired',
    lines: [
      'Hi [First name],',
      'The card we have on file for [Product] has expired, so your latest payment couldn’t go through. Adding a current card takes about 30 seconds:',
      '[update link]',
      'That’s all it takes to keep everything running — thanks!',
    ],
    why: 'Expired cards are a hard decline — retries will never work, so the email goes straight to "add a new card" instead of implying it might resolve itself.',
  },
  {
    tag: 'By decline reason · Insufficient funds',
    subject: 'We’ll try your [Product] payment again',
    lines: [
      'Hi [First name],',
      'Your recent payment didn’t clear — often that’s just a timing thing with available funds. We’ll automatically try again in a couple of days, so you may not need to do anything.',
      'Prefer to use a different card? You can switch here anytime: [update link]',
    ],
    why: 'Insufficient funds is a soft decline that frequently clears on a retry near payday. This email lowers panic, sets the retry expectation, and still offers a card switch.',
  },
  {
    tag: 'By decline reason · Card declined',
    subject: 'Your bank declined your [Product] payment',
    lines: [
      'Hi [First name],',
      'Your bank declined the latest charge for [Product]. This is usually a quick fix — either your bank needs to approve the payment, or a different card will work.',
      'Update or switch cards here: [update link]',
      'If it keeps happening, a quick call to your bank usually clears it.',
    ],
    why: 'Generic declines are opaque, so the email names the two realistic fixes (approve with the bank, or use another card) instead of leaving the customer guessing.',
  },
  {
    tag: 'By decline reason · Authentication needed (SCA)',
    subject: 'One quick step to confirm your [Product] payment',
    lines: [
      'Hi [First name],',
      'Your bank needs you to confirm this payment for security — a common step for customers in Europe. It only takes a moment:',
      '[authentication link]',
      'Once you approve it, you’re all set. Thanks for verifying!',
    ],
    why: 'SCA / 3D Secure declines are not a money problem — retrying won’t help. The email links to a Stripe-hosted authentication page instead of a card-update page.',
  },
]

const special = [
  {
    tag: 'Special · Pre-dunning (before it fails)',
    subject: 'Heads-up: your card expires before your next payment',
    lines: [
      'Hi [First name],',
      'A small heads-up — the card on file for [Product] expires on [expiry], which is before your next payment on [date]. Updating it now means no interruption:',
      '[update link]',
      'Thanks for staying ahead of it!',
    ],
    why: 'The cheapest failure is the one that never happens. Pre-dunning catches expiring cards before the charge fails and quietly removes a whole category of declines.',
  },
  {
    tag: 'Special · Win-back (old failure)',
    subject: 'We’d love to have you back at [Product]',
    lines: [
      'Hi [First name],',
      'A while ago your [Product] subscription ended because a payment didn’t go through — and we never want a card glitch to be the reason someone leaves.',
      'If you’d like to pick up where you left off, you can reactivate in one click: [reactivate link]',
      'No pressure at all — just wanted you to know the door’s open (and your data is still here).',
    ],
    why: 'For failures that lapsed months ago, the tone shifts from dunning to re-engagement. Framing it as "a card glitch, not you" removes any awkwardness about coming back.',
  },
  {
    tag: 'Special · Trial ending, card needed',
    subject: 'Your [Product] trial ends in 3 days',
    lines: [
      'Hi [First name],',
      'Your free trial of [Product] ends on [date]. To keep your account and everything you’ve set up, add a payment method before then:',
      '[add card link]',
      'Not ready? No worries — reply and tell us what’s holding you back, and we’ll help.',
    ],
    why: 'Technically pre-empts involuntary churn at the trial-to-paid moment. The "what’s holding you back" line turns a silent drop-off into a conversation.',
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        A dunning email is the automated message you send when a subscription payment fails, asking the
        customer to update their card. Below are <Strong>12 dunning email examples you can copy</Strong>
        {' '}— a full recovery sequence, templates by decline reason, and special cases — plus the
        anatomy of one that actually recovers revenue, and the subject lines that get opened.
      </Lead>
      <P>
        Recovery emails are where most failed-payment revenue is actually won back. Automatic card
        retries catch the charges that will clear on their own; the emails recover the rest — but only
        if they are written well. A generic &quot;your payment failed&quot; blast underperforms badly.
        A short, personal, decline-reason-specific sequence, sent at the right time, can recover a large
        share of what would otherwise be lost. Here is exactly how to write them, with templates you
        can paste in today.
      </P>

      <KeyTakeaways
        items={[
          <>Use a <Strong>4–5 email sequence</Strong> over ~3 weeks (Day 1, 3, 7, 14, 21) — the first two recover most of the revenue.</>,
          <>Personalize by <Strong>decline reason</Strong>: an expired card, insufficient funds, and an SCA prompt each need a different message.</>,
          <>Every email needs one calm subject, the exact reason, <Strong>one obvious button</Strong>, reassurance, and a one-click unsubscribe.</>,
          <>Send at a <Strong>human hour</Strong> in the customer&apos;s timezone — not whenever the charge happened to fail.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '4–5', label: 'emails is the ideal sequence length' },
          { value: '40–60%', label: 'of failed charges are recoverable' },
          { value: '~8:30am', label: 'local time is a strong send window' },
        ]}
      />

      <H2 id="anatomy">The anatomy of a dunning email that recovers</H2>
      <P>
        Before the templates, it helps to see the shape. Almost every high-performing recovery email has
        the same six parts — miss one and conversion drops:
      </P>
      <EmailAnatomy />
      <OL>
        <LI><Strong>A calm, honest subject line.</Strong> No ALL CAPS, no fake alarm. &quot;A quick heads-up about your payment&quot; beats &quot;URGENT: ACTION REQUIRED.&quot;</LI>
        <LI><Strong>A personal greeting.</Strong> Use the first name and write as a person, not a billing system.</LI>
        <LI><Strong>The exact reason.</Strong> If you know it failed because the card expired, say so — it tells the customer precisely what to fix.</LI>
        <LI><Strong>One obvious button.</Strong> A single &quot;update your card&quot; call to action. Competing links kill conversion.</LI>
        <LI><Strong>Reassurance and a gentle deadline.</Strong> Tell them their account is safe for now, and (later in the sequence) when it will not be.</LI>
        <LI><Strong>A one-click unsubscribe.</Strong> Non-negotiable for deliverability — and it keeps you out of the spam folder.</LI>
      </OL>

      <Divider />

      <H2 id="sequence">The core recovery sequence (5 templates)</H2>
      <P>
        This is the backbone: five emails over three weeks that escalate gently from a friendly
        heads-up to a respectful final notice. Send them alongside automatic retries. Replace anything
        in [brackets] with your own details.
      </P>
      {sequence.map((t, i) => (
        <EmailExample key={i} tag={t.tag} subject={t.subject} why={t.why}>
          {t.lines.map((l, j) => <p key={j}>{l}</p>)}
        </EmailExample>
      ))}

      <InlineCTA>
        Rather not write and time all of these yourself? Revova writes a unique recovery email per
        decline reason and sends it at 8:30am in each customer&apos;s timezone — automatically. Free
        trial, no card.
      </InlineCTA>

      <H2 id="by-reason">Templates by decline reason (4 templates)</H2>
      <P>
        The single biggest upgrade over a generic sequence is matching the message to <em>why</em> the
        card failed. A hard decline like an expired card needs a different ask than a soft decline like
        insufficient funds. These four cover the most common reasons.
      </P>
      {byReason.map((t, i) => (
        <EmailExample key={i} tag={t.tag} subject={t.subject} why={t.why}>
          {t.lines.map((l, j) => <p key={j}>{l}</p>)}
        </EmailExample>
      ))}

      <H2 id="special">Special-situation templates (3 templates)</H2>
      <P>
        Three more that catch revenue the core sequence misses — before a failure, long after one, and
        at the trial-to-paid moment.
      </P>
      {special.map((t, i) => (
        <EmailExample key={i} tag={t.tag} subject={t.subject} why={t.why}>
          {t.lines.map((l, j) => <p key={j}>{l}</p>)}
        </EmailExample>
      ))}

      <H2 id="which-email">Which email in the sequence recovers the most?</H2>
      <P>
        Recoveries are heavily front-loaded. The first two emails typically do most of the work, which
        is why getting Day 1 right matters more than adding a sixth or seventh message:
      </P>
      <BarChart
        bars={[
          { label: 'Email 1 (Day 1)', pct: 38, value: '~38%' },
          { label: 'Email 2 (Day 3)', pct: 24, value: '~24%' },
          { label: 'Email 3 (Day 7)', pct: 18, value: '~18%' },
          { label: 'Email 4 (Day 14)', pct: 12, value: '~12%' },
          { label: 'Email 5 (Day 21)', pct: 8, value: '~8%' },
        ]}
        caption="Illustrative share of total recoveries by email in the sequence — the first two carry it."
      />

      <H2 id="subject-lines">15 dunning email subject lines that get opened</H2>
      <P>
        The email cannot recover anything if it is not opened. These subject lines are calm, specific,
        and curiosity-free-of-alarm — swap in your product name:
      </P>
      <UL>
        <LI>A quick heads-up about your [Product] payment</LI>
        <LI>We couldn&apos;t process your last payment</LI>
        <LI>Your card on file needs a quick update</LI>
        <LI>Small issue with your [Product] subscription</LI>
        <LI>Don&apos;t lose access to [Product]</LI>
        <LI>Your card on file has expired</LI>
        <LI>We&apos;ll try your payment again in a couple of days</LI>
        <LI>One quick step to confirm your payment</LI>
        <LI>Action needed: your account will pause soon</LI>
        <LI>Your [Product] payment is still outstanding</LI>
        <LI>Final notice: [Product] access ends [date]</LI>
        <LI>Heads-up: your card expires before your next payment</LI>
        <LI>Keep your [Product] account running</LI>
        <LI>A 30-second fix for your [Product] account</LI>
        <LI>We&apos;d love to keep you at [Product]</LI>
      </UL>

      <H2 id="best-practices">Dunning email best practices (and mistakes to avoid)</H2>
      <UL>
        <LI><Strong>Do</Strong> send from a real person&apos;s name and a monitored reply-to address.</LI>
        <LI><Strong>Do</Strong> keep each email short — one idea, one button.</LI>
        <LI><Strong>Do</Strong> send at a human hour in the customer&apos;s local timezone.</LI>
        <LI><Strong>Don&apos;t</Strong> use fake urgency or countdown timers that aren&apos;t real.</LI>
        <LI><Strong>Don&apos;t</Strong> send the same generic email five times — personalize by reason and by position in the sequence.</LI>
        <LI><Strong>Don&apos;t</Strong> keep emailing addresses that bounce or complain; suppress them or you&apos;ll wreck your sender reputation.</LI>
      </UL>

      <H2 id="diy-vs-tool">Write these yourself, or automate them?</H2>
      <P>
        These templates will get you a long way. The question is whether maintaining the whole system by
        hand is a good use of your time.
      </P>
      <ProsCons
        pros={[
          'Templates are free and you can send them from tools you already have.',
          'Full control over voice and content.',
          'Fine for low volumes where you can watch each failure by hand.',
        ]}
        cons={[
          'Personalizing per decline reason, per sequence position, in each timezone is a lot of manual setup.',
          'You still need retries, SCA handling, suppression and deliverability management around the emails.',
          'Nothing here recovers the failures that already happened before you set it up.',
        ]}
      />
      <P>
        A tool closes that gap. <A href="/pricing">Revova</A> writes a unique AI email per decline
        reason, sends it at the right local time, runs the retries and pre-dunning around it, and its
        Lost Revenue Finder recovers past failures too — flat $29–$79/month, no commission. For the
        wider setup, see our guide on{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>{' '}
        and our comparison of the{' '}
        <A href="/blog/best-payment-recovery-dunning-tools-2026">best payment recovery tools</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Let AI write and send these for you"
        body="Revova turns this whole playbook into an automatic system — a unique recovery email per decline reason, sent at the perfect local time, with retries and pre-dunning built in. Start free and see what you've already lost."
      />
    </>
  )
}
