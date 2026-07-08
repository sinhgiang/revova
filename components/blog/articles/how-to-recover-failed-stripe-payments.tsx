import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, H3, UL, OL, LI, A, Strong, Callout, ProsCons, CTA, Divider,
  KeyTakeaways, StatCards, InlineCTA, BarChart, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'How do I recover a failed payment in Stripe?',
    a: 'Combine three things: enable and tune Stripe Smart Retries so the card is re-attempted on the days it is most likely to succeed; send a short sequence of personalized dunning emails asking the customer to update their card; and add pre-dunning to warn customers before a card expires. Together these typically recover 40–60% of failed charges, most of it automatically. A dedicated recovery tool automates all three, and can also recover failures from before you set it up.',
  },
  {
    q: 'Does Stripe automatically retry failed payments?',
    a: 'Partly. Stripe Billing includes Smart Retries, which re-attempts failed subscription charges using machine learning to pick better times, and it can send basic built-in emails. On its own that recovers roughly 30–40% of failed charges. It does not write personalized, decline-reason-specific emails, and it only acts on failures going forward — not the ones already sitting in your history.',
  },
  {
    q: 'Why do Stripe payments fail?',
    a: 'The most common reasons are insufficient funds, an expired or invalid card, a generic bank decline (do_not_honor), and cards reported lost, stolen or blocked for fraud. In Europe, some charges also fail because they require Strong Customer Authentication (SCA / 3D Secure) under PSD2. Each reason needs a different recovery approach — a hard "lost card" decline will never succeed on retry, while "insufficient funds" often clears within a few days.',
  },
  {
    q: 'How much of my failed Stripe revenue can I recover?',
    a: 'It depends on your decline mix, but the range is meaningful. Stripe’s retries alone recover about 30–40%, and well-timed, personalized recovery emails on top of that push total recoverable revenue into the 40–60% range for many businesses. The only way to know your real number is to scan your own Stripe history.',
  },
  {
    q: 'Do I need a developer to recover failed Stripe payments?',
    a: 'No. You can configure Smart Retries and basic emails inside the Stripe Dashboard without code. For personalized emails, pre-dunning, SCA handling and historical recovery, a no-code tool like Revova connects with a single Stripe key in about three minutes — no webhooks or engineering required.',
  },
  {
    q: 'Will recovery emails annoy my customers?',
    a: 'Not if they are done right. A good recovery email is warm, specific to the failure reason, sent at a human hour in the customer’s timezone, and includes a one-click card-update link and an unsubscribe. Customers whose card genuinely failed usually appreciate the heads-up — they wanted to keep paying you.',
  },
]

// Inline 5-step overview diagram — numbered nodes on a path. width/height set so
// it never collapses; a different visual from the roundup article's diagrams.
function StepFlow5() {
  const steps = ['Tune Smart Retries', 'Dunning emails', 'Pre-dunning', 'Handle SCA', 'Recover the past']
  const x0 = 76, x1 = 684, y = 46
  return (
    <figure className="my-8">
      <svg viewBox="0 0 760 118" width="760" height="118" className="w-full h-auto" role="img"
        aria-label="The five steps to recover failed Stripe payments: tune Smart Retries, send dunning emails, add pre-dunning, handle SCA, recover past failures">
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="#e5e7eb" strokeWidth="3" />
        {steps.map((s, i) => {
          const x = x0 + (i * (x1 - x0)) / (steps.length - 1)
          return (
            <g key={i} fontFamily="Segoe UI, Arial, sans-serif">
              <circle cx={x} cy={y} r="19" fill="#4f46e5" />
              <text x={x} y={y + 6} textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff">{i + 1}</text>
              <text x={x} y={y + 44} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#374151">{s}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-3 text-center text-sm text-gray-400">The five-step failed-payment recovery workflow.</figcaption>
    </figure>
  )
}

export default function Article() {
  return (
    <>
      <Lead>
        To recover failed Stripe payments, combine three things: <Strong>smart card retries</Strong>,
        a timed sequence of <Strong>personalized recovery emails</Strong>, and{' '}
        <Strong>pre-dunning</Strong> that warns customers before a card expires. Do all three and you
        can typically win back <Strong>40–60% of failed charges</Strong> — most of it automatically.
      </Lead>
      <P>
        Failed payments are the quietest way a subscription business loses money. A card expires, a
        bank declines a charge, an account is short on funds — the subscription lapses, and unless
        something chases it, that revenue is simply gone. This is <Strong>involuntary churn</Strong>,
        and it usually accounts for 5–10% of revenue. The good news: it is the most recoverable revenue
        you have, because the customer never chose to leave. Here is exactly how to recover it on
        Stripe, step by step.
      </P>

      <KeyTakeaways
        items={[
          <>Stripe recovers some failures on its own via <Strong>Smart Retries</Strong> (~30–40%) — but it misses personalized emails, SCA handling, and past failures.</>,
          <>The full recovery stack is <Strong>retries + personalized dunning emails + pre-dunning</Strong>, and it can recover 40–60% of failed charges.</>,
          <>Match the tactic to the decline reason — a <Strong>lost-card</Strong> decline never clears on retry, while <Strong>insufficient funds</Strong> usually does within days.</>,
          <>Your biggest quick win is often <Strong>past failures</Strong> nobody ever followed up on — scan your Stripe history to find them.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '5–10%', label: 'of revenue lost to failed payments' },
          { value: '30–40%', label: 'recovered by Stripe Smart Retries alone' },
          { value: '40–60%', label: 'recoverable with the full stack' },
        ]}
      />

      <H2 id="why-fail">Why Stripe payments fail in the first place</H2>
      <P>
        Before you can recover a failed payment, it helps to know why it failed — because the reason
        decides whether a retry will ever work. Stripe returns a decline code with every failed charge,
        and the mix usually looks something like this:
      </P>
      <BarChart
        bars={[
          { label: 'Insufficient funds', pct: 35, value: '~35%' },
          { label: 'Expired / invalid card', pct: 22, value: '~22%' },
          { label: 'Generic bank decline', pct: 18, value: '~18%' },
          { label: 'Lost / stolen / fraud', pct: 12, value: '~12%' },
          { label: 'Other (SCA, currency…)', pct: 13, value: '~13%' },
        ]}
        caption="Approximate, illustrative mix of Stripe decline reasons — your actual distribution will vary."
      />
      <P>
        The distinction that matters is <Strong>soft declines vs hard declines</Strong>. Soft declines
        like <code>insufficient_funds</code> or a temporary <code>do_not_honor</code> are worth
        retrying — the card often works a few days later, especially around payday. Hard declines like{' '}
        <code>lost_card</code>, <code>stolen_card</code>, or <code>expired_card</code> will never
        succeed on retry; the only fix is getting the customer to enter a new card. Treating these two
        groups the same is the single most common recovery mistake.
      </P>

      <H2 id="stripe-automatic">Does Stripe recover failed payments automatically?</H2>
      <P>
        Partly — and it is worth turning on before anything else. Stripe Billing includes{' '}
        <A href="https://stripe.com/docs/billing/revenue-recovery/smart-retries">Smart Retries</A>,
        which uses machine learning to re-attempt failed subscription charges at the moments they are
        most likely to succeed, plus optional built-in dunning emails and a customer portal for
        updating cards. On its own, this recovers roughly 30–40% of failed charges — real money for
        zero effort.
      </P>
      <P>What Stripe&apos;s built-in tools do <em>not</em> do:</P>
      <UL>
        <LI>Write <Strong>personalized emails per decline reason</Strong> — the built-in emails are generic templates, and generic &quot;your payment failed&quot; emails convert poorly.</LI>
        <LI>Send at the <Strong>optimal local time</Strong> or in your customer&apos;s language.</LI>
        <LI>Run <Strong>pre-dunning</Strong> to catch cards <em>before</em> they expire.</LI>
        <LI>Recover <Strong>past failures</Strong> — Smart Retries only acts on charges that fail after you enable it.</LI>
      </UL>
      <P>That gap between ~35% and ~60% is what the next five steps close.</P>

      <Divider />

      <H2 id="steps">How to recover failed Stripe payments: 5 steps</H2>
      <StepFlow5 />

      <H3>Step 1 — Turn on and tune Stripe Smart Retries</H3>
      <P>
        In the Stripe Dashboard, go to <em>Settings → Billing → Subscriptions and emails</em> and enable
        Smart Retries. Set the retry window to span several days so the schedule can hit a payday, and
        turn on the customer portal so customers have a one-click way to update their card. This is the
        no-code foundation everything else builds on.
      </P>

      <H3>Step 2 — Send a personalized dunning email sequence</H3>
      <P>
        Retries recover the cards that will clear on their own; emails recover the rest. Send a short
        sequence — typically on Day 1, 3, 7, 14 and 21 — where each message is written for the specific
        decline reason and sent at a human hour (around 8:30am in the customer&apos;s timezone). Lead
        with a warm, specific heads-up and a single, obvious &quot;update your card&quot; button. Always
        include one-click unsubscribe and stop emailing addresses that bounce, or you will wreck your
        sender reputation.
      </P>

      <H3>Step 3 — Add pre-dunning for expiring cards</H3>
      <P>
        The cheapest failure to recover is the one that never happens. Pre-dunning scans for cards that
        are about to expire and emails those customers <em>before</em> the next charge fails, asking
        them to update the card in advance. This quietly removes a big slice of the{' '}
        <code>expired_card</code> declines from the chart above.
      </P>

      <H3>Step 4 — Handle SCA / 3D Secure declines correctly</H3>
      <P>
        If you sell to customers in Europe, some charges fail because they require{' '}
        <A href="https://stripe.com/guides/strong-customer-authentication">Strong Customer Authentication</A>{' '}
        under PSD2 — the bank wants the customer to re-authenticate. These are not &quot;out of
        money&quot; failures; retrying alone will not fix them. The recovery email needs to send the
        customer to a Stripe-hosted authentication page to approve the payment. Getting this right
        recovers charges most tools silently drop.
      </P>

      <H3>Step 5 — Recover the failures you&apos;ve already lost</H3>
      <P>
        Steps 1–4 fix new failures. But if you have been on Stripe for months, there is very likely a
        pile of old failed charges nobody ever chased. Stripe&apos;s Events API only keeps 30 days of
        history, so the way to find them is to scan your charge history directly, dedupe by customer,
        and launch a gentle win-back sequence for those old failures. This is usually the single biggest
        one-time recovery a business can make — and no built-in Stripe feature does it.
      </P>

      <InlineCTA>
        Want to see how much you&apos;ve already lost? Revova&apos;s free Lost Revenue Finder scans your
        Stripe history — 30 days up to 12 months — and shows the exact number before you pay anything.
      </InlineCTA>

      <H2 id="diy-vs-tool">Should you build this yourself or use a tool?</H2>
      <P>
        You can absolutely do Steps 1–3 inside Stripe with no code, and that alone is worth doing today.
        The question is whether steps 2, 4 and 5 — personalized emails, SCA handling, and historical
        recovery — are worth building and maintaining yourself.
      </P>
      <ProsCons
        pros={[
          'Native Stripe retries and basic emails are free and take minutes to switch on.',
          'Full control if you have engineering time to build custom email logic.',
          'No extra vendor for the parts Stripe already covers.',
        ]}
        cons={[
          'Personalized per-reason emails, SCA re-auth flows, and pre-dunning are real engineering to build well.',
          'Stripe cannot recover your past failures at all — that money stays lost.',
          'Maintaining deliverability, suppression and timezones yourself is ongoing work.',
        ]}
      />
      <P>
        A dedicated tool exists to close exactly that gap. <A href="/pricing">Revova</A> connects to
        Stripe with a single key, adds AI-written per-reason emails, pre-dunning, SCA handling and the
        Lost Revenue Finder, and runs flat at $29–$79/month with no commission on what it recovers. If
        you want the full picture across tools, see our{' '}
        <A href="/blog/best-payment-recovery-dunning-tools-2026">comparison of the best payment recovery tools</A>.
      </P>

      <InlineCTA>
        Set up full Stripe recovery in about 3 minutes — paste your key, no code. Flat $29–79/month, no
        commission on recovered revenue, 14-day free trial.
      </InlineCTA>

      <H2 id="mistakes">Common mistakes to avoid</H2>
      <OL>
        <LI><Strong>Retrying hard declines.</Strong> Hammering a <code>lost_card</code> or <code>expired_card</code> with retries just burns processor goodwill. Route those straight to a &quot;please update your card&quot; email.</LI>
        <LI><Strong>One generic email.</Strong> A single &quot;your payment failed&quot; template underperforms a reason-specific sequence badly. Personalize.</LI>
        <LI><Strong>Bad timing.</Strong> Emails at 3am local time and retries that miss payday leave money on the table. Send human-hour; retry across a multi-day window.</LI>
        <LI><Strong>Ignoring SCA.</Strong> Treating a 3D Secure decline like an out-of-funds decline means it never recovers.</LI>
        <LI><Strong>Forgetting the past.</Strong> Teams obsess over new failures and never scan their back-catalogue — where the biggest one-time win usually sits.</LI>
      </OL>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <CTA
        heading="Recover your failed Stripe payments — starting with the ones you've already lost"
        body="Connect Stripe in about 3 minutes. Revova runs smart retries, AI recovery emails, pre-dunning and SCA handling — and its free Lost Revenue Finder shows exactly what you've already lost before you pay a cent."
      />
    </>
  )
}
