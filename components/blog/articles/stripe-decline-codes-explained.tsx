import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, CompareTable, CodeCard, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is a Stripe decline code?',
    a: 'A Stripe decline code is a short machine-readable string, like insufficient_funds or expired_card, that explains why a card payment failed. Stripe returns it on the charge in the outcome object (outcome.reason and, when the bank provides it, decline_code). It tells you whether the failure is worth retrying or needs the customer to take action.',
  },
  {
    q: 'What is the difference between a soft decline and a hard decline?',
    a: 'A soft decline is temporary — the card is fine but the charge failed for a passing reason like insufficient funds or a processor timeout, so a later retry often succeeds. A hard decline is permanent for that card — expired, incorrect details, lost, stolen, or blocked — so retrying never works and you need the customer to enter a new card.',
  },
  {
    q: 'What does the decline code do_not_honor mean?',
    a: 'do_not_honor is a generic decline from the customer’s bank with no specific reason given. It is ambiguous: sometimes it clears on a retry a day or two later, and sometimes it is effectively permanent. The best approach is to retry once or twice, and if it persists, email the customer to try a different card or contact their bank.',
  },
  {
    q: 'Should I retry a declined card?',
    a: 'It depends on the code. Retry soft declines (insufficient_funds, processing_error, issuer_not_available) — ideally around a payday window. Do not retry hard declines (expired_card, incorrect_cvc, lost_card, stolen_card); they will never succeed, and repeated attempts can hurt your processing reputation. For authentication_required, send the customer to re-authenticate rather than retrying.',
  },
  {
    q: 'Where do I see the decline code in Stripe?',
    a: 'In the Stripe Dashboard, open the failed payment and look at the payment details — the decline reason is shown there. Via the API, check the charge’s outcome object: outcome.reason gives Stripe’s categorization, and outcome.network_status plus the raw decline_code give the bank’s response when available.',
  },
  {
    q: 'How do I recover payments that failed with these codes?',
    a: 'Match the tactic to the code: smart retries for soft declines, a personalized "add a new card" email for hard declines, and a re-authentication link for SCA. A tool like Revova reads each decline code automatically and sends the right recovery action, then also scans your history to recover past failures.',
  },
]

// Inline decision flow: failed charge -> soft/hard -> action. width/height set.
function DeclineFlow() {
  return (
    <figure className="my-8">
      <svg viewBox="0 0 760 250" width="760" height="250" className="w-full h-auto" role="img"
        aria-label="Decision flow: a failed charge is either a soft decline (retry near payday) or a hard decline (ask for a new card or re-authenticate)">
        <defs>
          <marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 z" fill="#cbd5e1" />
          </marker>
        </defs>
        {/* failed */}
        <rect x="16" y="98" width="150" height="54" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
        <text x="91" y="130" textAnchor="middle" fontSize="14" fontWeight="700" fill="#9f1239" fontFamily="Segoe UI, Arial, sans-serif">Failed charge</text>
        {/* connectors to soft/hard */}
        <path d="M166 125 C 210 125, 210 55, 296 55" fill="none" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah)" />
        <path d="M166 125 C 210 125, 210 195, 296 195" fill="none" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah)" />
        {/* soft */}
        <rect x="300" y="28" width="176" height="54" rx="12" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5" />
        <text x="388" y="60" textAnchor="middle" fontSize="14" fontWeight="700" fill="#065f46" fontFamily="Segoe UI, Arial, sans-serif">Soft decline</text>
        {/* hard */}
        <rect x="300" y="168" width="176" height="54" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.5" />
        <text x="388" y="200" textAnchor="middle" fontSize="14" fontWeight="700" fill="#9f1239" fontFamily="Segoe UI, Arial, sans-serif">Hard decline</text>
        {/* action connectors */}
        <path d="M476 55 L556 55" fill="none" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah)" />
        <path d="M476 195 L556 195" fill="none" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ah)" />
        {/* actions */}
        <rect x="560" y="28" width="188" height="54" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x="654" y="60" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#3730a3" fontFamily="Segoe UI, Arial, sans-serif">Retry near payday</text>
        <rect x="560" y="168" width="188" height="54" rx="12" fill="#eef2ff" stroke="#a5b4fc" strokeWidth="1.5" />
        <text x="654" y="194" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#3730a3" fontFamily="Segoe UI, Arial, sans-serif">Ask for a new card</text>
        <text x="654" y="211" textAnchor="middle" fontSize="11.5" fill="#6366f1" fontFamily="Segoe UI, Arial, sans-serif">(or re-authenticate)</text>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">Route every decline by type: retry the soft ones, ask for a new card on the hard ones.</figcaption>
    </figure>
  )
}

// Single stacked bar: share of declines that are soft vs hard. width/height set.
function SoftHardBar() {
  const soft = 60, hard = 40, x0 = 20, x1 = 740, y = 34, bw = x1 - x0
  const softW = (soft / 100) * bw
  return (
    <figure className="my-8">
      <svg viewBox="0 0 760 96" width="760" height="96" className="w-full h-auto" role="img"
        aria-label={`About ${soft}% of declines are soft (retryable) and ${hard}% are hard`}>
        <rect x={x0} y={y} width={softW} height="34" rx="8" fill="#10b981" />
        <rect x={x0 + softW} y={y} width={bw - softW} height="34" rx="8" fill="#f43f5e" />
        <text x={x0 + 14} y={y + 22} fontSize="14" fontWeight="800" fill="#ffffff" fontFamily="Segoe UI, Arial, sans-serif">Soft · retryable ~{soft}%</text>
        <text x={x1 - 14} y={y + 22} textAnchor="end" fontSize="14" fontWeight="800" fill="#ffffff" fontFamily="Segoe UI, Arial, sans-serif">Hard ~{hard}%</text>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">Roughly 6 in 10 declines are soft and worth retrying — an illustrative split.</figcaption>
    </figure>
  )
}

const softCodes = [
  { code: 'insufficient_funds', type: 'soft' as const, meaning: 'The account does not currently have enough money to cover the charge.', action: 'Retry over a few days, ideally around a payday window — this often clears on its own.' },
  { code: 'processing_error', type: 'soft' as const, meaning: 'A temporary error occurred while processing the card, usually on the network or processor side.', action: 'Retry shortly. If it repeats across many customers, check for a processor incident.' },
  { code: 'issuer_not_available', type: 'soft' as const, meaning: 'Stripe could not reach the customer’s bank to authorize the charge.', action: 'Retry a bit later once the issuer is reachable again.' },
  { code: 'try_again_later', type: 'soft' as const, meaning: 'The bank asked to retry the transaction later without giving a specific reason.', action: 'Wait and retry — do not hammer it repeatedly in a short window.' },
  { code: 'card_velocity_exceeded', type: 'soft' as const, meaning: 'The card has been used too many times in a short period and the bank temporarily blocked it.', action: 'Wait, then retry later. Avoid rapid repeated attempts, which make it worse.' },
  { code: 'reenter_transaction', type: 'soft' as const, meaning: 'The bank could not process the transaction for an unknown reason and suggests re-submitting.', action: 'Retry once; if it fails again, treat it like a generic decline and email the customer.' },
]

const hardCodes = [
  { code: 'expired_card', type: 'hard' as const, meaning: 'The card on file has passed its expiration date.', action: 'Do not retry — email the customer to add a current card.' },
  { code: 'incorrect_cvc', type: 'hard' as const, meaning: 'The CVC security code provided does not match the card.', action: 'Ask the customer to re-enter their card details correctly.' },
  { code: 'incorrect_number', type: 'hard' as const, meaning: 'The card number entered is invalid.', action: 'Ask the customer to re-enter a valid card number.' },
  { code: 'card_declined', type: 'hard' as const, meaning: 'A generic decline from the bank; when the reason is fraud-related it is permanent for that card.', action: 'Retry once if the reason is unclear; if it persists, ask for a different card.' },
  { code: 'lost_card', type: 'hard' as const, meaning: 'The card was reported lost. Stripe often masks this as a generic decline to avoid tipping off fraud.', action: 'Do not retry — request a new card.' },
  { code: 'stolen_card', type: 'hard' as const, meaning: 'The card was reported stolen. Like lost_card, this is a permanent block.', action: 'Do not retry — request a new card.' },
  { code: 'pickup_card', type: 'hard' as const, meaning: 'The bank has flagged the card and wants it retained; it will not authorize charges.', action: 'Do not retry — ask the customer to use a different card.' },
  { code: 'currency_not_supported', type: 'hard' as const, meaning: 'The card cannot be charged in the currency of the transaction.', action: 'Ask the customer for a card that supports your billing currency.' },
  { code: 'invalid_account', type: 'hard' as const, meaning: 'The card or account is invalid or closed.', action: 'Do not retry — request a new payment method.' },
]

const ambiguous = [
  { code: 'do_not_honor', type: 'soft' as const, meaning: 'A catch-all decline from the bank with no reason given — the single most common and most ambiguous code.', action: 'Retry once or twice; if it keeps failing, email the customer to try another card or call their bank.' },
  { code: 'generic_decline', type: 'soft' as const, meaning: 'The bank declined without a specific reason. Similar to do_not_honor.', action: 'Retry cautiously; if it persists, treat it as a hard decline and ask for a new card.' },
  { code: 'authentication_required', type: 'auth' as const, meaning: 'The charge needs Strong Customer Authentication (SCA / 3D Secure) — common for European customers under PSD2.', action: 'Do not retry — send the customer a link to re-authenticate and approve the payment.' },
]

export default function Article() {
  return (
    <>
      <Lead>
        A Stripe decline code is a short label — like <code>insufficient_funds</code>,{' '}
        <code>expired_card</code>, or <code>do_not_honor</code> — that tells you exactly why a card
        payment failed, and whether it is worth retrying. This guide explains every decline code that
        matters, whether each is a <Strong>soft or hard decline</Strong>, and how to recover it.
      </Lead>
      <P>
        When a subscription charge fails, Stripe does not just say &quot;declined&quot; — it returns a
        specific reason on the charge&apos;s <code>outcome</code> object. That reason is the single most
        useful piece of information you have, because it decides your next move. Retrying the wrong code
        wastes attempts and can hurt your processing reputation; emailing for a new card when a simple
        retry would have worked annoys good customers. Read the code right, and recovery gets far more
        effective.
      </P>

      <KeyTakeaways
        items={[
          <>Decline codes fall into two groups: <Strong>soft</Strong> (temporary — retry) and <Strong>hard</Strong> (permanent for that card — get a new one).</>,
          <>Retry <code>insufficient_funds</code> and <code>processing_error</code>; never retry <code>expired_card</code>, <code>lost_card</code>, or <code>stolen_card</code>.</>,
          <><code>do_not_honor</code> is the most common and most ambiguous — retry once or twice, then ask for a new card.</>,
          <><code>authentication_required</code> is not a money problem — send the customer to re-authenticate, don&apos;t retry.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '~60%', label: 'of declines are soft (retryable)' },
          { value: '2', label: 'buckets that decide everything: soft vs hard' },
          { value: '40–60%', label: 'of failed charges are recoverable' },
        ]}
      />

      <H2 id="what-is">What is a Stripe decline code?</H2>
      <P>
        A decline code is a machine-readable string Stripe attaches to a failed charge to describe why
        the bank or network rejected it. You will see two related fields: <code>outcome.reason</code>,
        which is Stripe&apos;s own categorization, and <code>decline_code</code>, the more specific
        reason from the customer&apos;s bank when it is provided. Together they tell you whether the card
        itself is the problem (hard) or the timing is (soft).
      </P>

      <H2 id="soft-vs-hard">Soft vs hard declines — the distinction that matters</H2>
      <P>
        Almost every recovery decision comes down to one question: is this a <Strong>soft</Strong> or a{' '}
        <Strong>hard</Strong> decline? A soft decline is temporary — the card works, but this particular
        charge failed for a passing reason, so a retry a day or two later often succeeds. A hard decline
        is permanent for that card — it is expired, wrong, closed, or blocked — and no number of retries
        will ever clear it.
      </P>
      <SoftHardBar />
      <P>Route every failure by its type, and never treat the two the same:</P>
      <DeclineFlow />

      <H2 id="reference">The most common Stripe decline codes (quick reference)</H2>
      <P>
        Here are the codes you will see most often, with whether to retry and how to fix each. Detailed
        explanations follow below.
      </P>
      <CompareTable
        rows={[
          ['Code', 'Meaning', 'Type', 'Retry?', 'Fix'],
          ['insufficient_funds', 'Not enough money', 'Soft', 'Yes', 'Retry near payday'],
          ['do_not_honor', 'Generic bank decline', 'Ambiguous', 'Once or twice', 'Retry, then new card'],
          ['expired_card', 'Card past expiry', 'Hard', 'No', 'New card'],
          ['incorrect_cvc', 'Wrong security code', 'Hard', 'No', 'Re-enter card'],
          ['card_declined', 'Generic / fraud decline', 'Hard-ish', 'Maybe once', 'New card'],
          ['lost_card / stolen_card', 'Reported lost or stolen', 'Hard', 'No', 'New card'],
          ['processing_error', 'Temporary processor error', 'Soft', 'Yes', 'Retry shortly'],
          ['authentication_required', 'Needs SCA / 3D Secure', 'Auth', 'No', 'Re-authenticate'],
          ['currency_not_supported', 'Card can’t use currency', 'Hard', 'No', 'Different card'],
          ['card_velocity_exceeded', 'Too many attempts', 'Soft', 'Wait', 'Retry later'],
        ]}
      />

      <Divider />

      <H2 id="soft-codes">Soft decline codes (retry these)</H2>
      <P>
        These are temporary. The card is valid, so a well-timed retry — especially around a payday —
        frequently succeeds without the customer doing anything.
      </P>
      {softCodes.map((c) => <CodeCard key={c.code} {...c} />)}

      <H2 id="hard-codes">Hard decline codes (get a new card)</H2>
      <P>
        These are permanent for the card on file. Retrying is pointless and can hurt your processing
        reputation — go straight to a personalized email asking the customer to update their card.
      </P>
      {hardCodes.map((c) => <CodeCard key={c.code} {...c} />)}

      <InlineCTA>
        Revova reads each decline code automatically and sends the right recovery action — a retry for
        soft codes, a new-card email for hard ones, a re-auth link for SCA. See it free, no card.
      </InlineCTA>

      <H2 id="ambiguous-codes">The ambiguous ones (do_not_honor, SCA)</H2>
      <P>
        A few codes do not fit neatly into soft or hard and need judgment.
      </P>
      {ambiguous.map((c) => <CodeCard key={c.code} {...c} />)}

      <Callout title="A note on do_not_honor">
        <p style={{ margin: 0 }}>
          <code>do_not_honor</code> is both the most common decline and the least informative — the bank
          simply refuses without saying why. Treat it as soft <em>once or twice</em> (a short retry can
          clear it), but if it persists, stop retrying and email the customer to try another card or
          call their bank. Endless retries on a persistent <code>do_not_honor</code> just waste attempts.
        </p>
      </Callout>

      <H2 id="how-to-recover">How to recover payments by decline code</H2>
      <P>
        Reading the code is only half the job — the other half is doing the right thing with it:
      </P>
      <OL>
        <LI><Strong>Soft declines → smart retries.</Strong> Re-attempt the charge over several days, timed for when a card is likely to have funds (payday windows).</LI>
        <LI><Strong>Hard declines → a new-card email.</Strong> Send a personalized message naming the exact reason (expired, incorrect, etc.) with one button to update the card. See our <A href="/blog/dunning-email-examples-templates">dunning email templates</A> for copy.</LI>
        <LI><Strong>authentication_required → a re-auth link.</Strong> Send the customer to a Stripe-hosted authentication page rather than retrying.</LI>
        <LI><Strong>Ambiguous → retry once, then escalate.</Strong> Give it one or two retries, then treat it like a hard decline.</LI>
      </OL>
      <P>
        For the full setup — retries, emails, pre-dunning and SCA — see our guide on{' '}
        <A href="/blog/how-to-recover-failed-stripe-payments">how to recover failed Stripe payments</A>,
        or compare the tools that automate all of it in our{' '}
        <A href="/blog/best-payment-recovery-dunning-tools-2026">roundup of the best payment recovery tools</A>.
      </P>

      <H2 id="where-to-find">Where to find the decline code in Stripe</H2>
      <P>
        In the <Strong>Dashboard</Strong>, open any failed payment and read the decline reason in the
        payment details. Via the <Strong>API</Strong>, inspect the charge&apos;s <code>outcome</code>{' '}
        object: <code>outcome.reason</code> and <code>outcome.network_status</code> give Stripe&apos;s
        view, and the raw <code>decline_code</code> gives the bank&apos;s reason when available. Stripe
        documents the full list in its{' '}
        <A href="https://stripe.com/docs/declines/codes">decline codes reference</A>.
      </P>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Let Revova read the code and recover the payment"
        body="Revova reads every decline code automatically and takes the right action — retry, new-card email, or re-authentication — then scans your history to recover past failures too. Start free and see what you've already lost."
      />
    </>
  )
}
