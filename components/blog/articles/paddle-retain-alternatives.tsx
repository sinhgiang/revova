import type { Faq } from '@/lib/seo'
import {
  Lead, P, H2, UL, OL, LI, A, Strong, Callout, CTA, Divider,
  KeyTakeaways, StatCards, ProsCons, InlineCTA, CompareTable, InBodyImage, FAQ,
} from '@/components/blog/prose'

export const faqs: Faq[] = [
  {
    q: 'What is the best Paddle Retain alternative?',
    a: 'Revova is the strongest alternative if you want a flat, predictable monthly price instead of a bill that grows with how much revenue you recover — $29–$79/month regardless of recovery volume, plus historical recovery and a wider processor list. Churn Buster is worth a look if you specifically want a proven Stripe/Recurly specialist, and Churnkey if you want a broader retention suite with budget to spare. If you are deep in the Paddle ecosystem and like paying only when Retain actually recovers revenue, Paddle Retain itself remains a reasonable, honest choice.',
  },
  {
    q: 'How much does Paddle Retain actually cost?',
    a: "Paddle Retain (formerly ProfitWell Retain) prices as a percentage of the revenue it recovers rather than a flat monthly fee — so there is no single number to quote. The practical effect is that the bill scales with your own success: recover more failed payments, pay more for the tool that recovered them. Check Paddle's current pricing page for the exact percentage, since it has changed over time.",
  },
  {
    q: 'Why do people look for a Paddle Retain alternative?',
    a: 'Three reasons come up most often: the percentage-of-recovered pricing means the bill keeps climbing as your MRR and recovery volume grow, with no ceiling; Retain has historically not offered historical recovery of already-failed payments or an in-app cancel-flow, both of which dedicated standalone tools increasingly ship; and its native fit is strongest for teams billing through Paddle specifically, which is a narrower footprint than a processor-agnostic tool covering Stripe, Braintree, Chargebee, and Recurly as well.',
  },
  {
    q: 'Is Paddle Retain a good product?',
    a: 'Yes, for the right team. Pay-on-results pricing is a genuinely appealing model if you are early-stage or cost-sensitive and want your dunning spend to track your dunning results rather than a fixed line item. It also plugs in natively if Paddle is already your merchant of record, with no separate processor integration to manage. The tradeoff is that the same pricing model that feels cheap at low volume can end up costing more than a flat fee once your recovery volume scales.',
  },
  {
    q: 'Does Paddle Retain work with Stripe, Braintree, or Chargebee?',
    a: 'Paddle Retain is built around the Paddle billing ecosystem — that is its core strength, not a limitation to apologize for. If your subscriptions run primarily through Stripe, Braintree, Chargebee, or Recurly rather than Paddle, a processor-agnostic tool like Revova, which connects read-only to all five, is likely to fit your actual stack better than asking a Paddle-native tool to stretch across processors it was not primarily built for.',
  },
  {
    q: 'Does the percentage-of-recovered pricing ever cost more than a flat fee?',
    a: "It can, and this is the single most important thing to model before committing either way. At low recovery volume, a percentage of a small number is a small number, which is exactly why the pricing model feels attractive early on. But the percentage does not cap — as your MRR and recovery volume grow, the bill grows in lockstep, and at some point it can cross above what a flat $29–$79/month would have cost for the exact same recovery outcome. Project the bill at your recovery volume six to twelve months out, not just today's numbers, before assuming the pricing model that looks cheapest now stays cheapest.",
  },
  {
    q: 'Does Paddle Retain offer historical recovery of past failed payments?',
    a: 'Not historically. Retain has been built around catching and retrying failures as they happen going forward, rather than scanning back through months of already-failed payments that were never retried. If a chunk of your recoverable revenue is sitting in old, abandoned failures rather than new ones, a tool that offers historical recovery — Revova scans 90 days to 12 months back, depending on plan — will typically surface money Retain never touches.',
  },
  {
    q: 'How hard is it to switch from Paddle Retain to Revova?',
    a: "It is a no-code change most teams finish in an afternoon. Connect Paddle (or whichever processor you actually bill through) to Revova with a single read-only API key, run the free Lost Revenue Finder to see what historical recovery alone is worth, recreate or accept the default dunning cadence, confirm the new sequence is firing correctly, then turn off Retain's outbound emails to avoid double-emailing customers during the overlap.",
  },
]

export default function Article() {
  return (
    <>
      <Lead>
        The best Paddle Retain alternatives in 2026 are <Strong>Revova</Strong>, <Strong>Churn Buster</Strong>,
        {' '}and <Strong>Churnkey</Strong> — each priced as a flat monthly fee rather than a percentage of
        recovered revenue. Paddle Retain, formerly ProfitWell Retain, is a genuinely appealing pay-on-results
        product: instead of a fixed bill, you pay a cut of whatever revenue it actually recovers, which feels
        cheap when your recovery volume is small. The two most common reasons people look elsewhere are that
        the bill has no ceiling — it keeps climbing as your MRR grows — and that Retain has historically
        skipped features like historical recovery and an in-app cancel-flow that dedicated standalone tools
        increasingly ship.
      </Lead>
      <P>
        This guide lays out that tradeoff honestly: what the pay-on-results model gets right, where it can
        quietly cost more than a flat fee once you scale, and what a standalone alternative like Revova offers
        instead — including for teams that are not on Paddle at all.
      </P>

      <KeyTakeaways
        items={[
          <>Paddle Retain charges a <Strong>percentage of recovered revenue</Strong>, not a flat fee — the bill has no ceiling and grows as your recovery volume does.</>,
          <>Retain is built for the <Strong>Paddle billing ecosystem</Strong> specifically; teams on Stripe, Braintree, Chargebee, or Recurly are a narrower fit.</>,
          <>Retain has historically not offered <Strong>historical recovery</Strong> of already-failed payments or an <Strong>in-app cancel-flow</Strong>.</>,
          <>A flat-fee alternative like Revova can be <Strong>cheaper at scale</Strong> even though pay-on-results feels cheaper at first, depending on your recovery volume.</>,
        ]}
      />

      <StatCards
        stats={[
          { value: '% of revenue', label: 'Retain’s pricing model — the bill grows with your recovery success, with no cap' },
          { value: '$29/mo', label: 'Revova Starter — flat, regardless of how much is recovered' },
          { value: '5 processors', label: 'Revova connects read-only to Stripe, Paddle, Braintree, Chargebee, and Recurly' },
        ]}
      />

      <H2 id="what-retain-is">What Paddle Retain actually is</H2>
      <P>
        Paddle Retain started life as ProfitWell Retain, a dedicated failed-payment recovery tool that Paddle
        acquired along with the rest of ProfitWell and folded into its own billing platform. Its defining
        feature is the pricing model: rather than a flat monthly subscription, Retain charges a percentage of
        the revenue it actually recovers. Recover nothing in a given month, pay nothing that month. Recover a
        lot, pay a proportional cut of it. For an early-stage team unsure how much a dunning tool is really
        worth to them, that is a genuinely low-risk way to try one.
      </P>
      <InBodyImage
        file="/blog/paddle-retain-alternatives-img-1"
        alt="Chart comparing a percentage-of-recovered-revenue bill that climbs month over month as recovery volume grows, against a flat monthly fee that stays constant regardless of how much revenue is recovered"
        caption="A percentage-of-recovered bill scales with your success — for better or worse, it never plateaus the way a flat fee does."
      />
      <Callout title="This is not a case against Paddle Retain">
        Pay-on-results pricing is a legitimate, honest model, and Retain&apos;s native fit inside the Paddle
        ecosystem is a real advantage if Paddle is your merchant of record. The comparison here is specifically
        about whether that pricing model and that ecosystem fit still make sense once your recovery volume — or
        your processor mix — grows beyond what Retain was built around.
      </Callout>

      <H2 id="why-alternatives">Why people look for a Paddle Retain alternative</H2>
      <UL>
        <LI>
          <Strong>No ceiling on the bill.</Strong> Because Retain charges a percentage of recovered revenue,
          the bill scales directly with your own success. A model that looks inexpensive at low volume can
          end up costing meaningfully more than a flat fee once your MRR — and the amount of revenue Retain is
          recovering — grows.
        </LI>
        <LI>
          <Strong>Feature depth.</Strong> Retain has historically focused on forward-looking retry logic
          rather than scanning back through months of already-failed payments, and has not offered an in-app
          cancel-flow the way some newer standalone tools do.
        </LI>
        <LI>
          <Strong>Processor fit.</Strong> Retain is built around the Paddle ecosystem specifically. Teams
          billing primarily through Stripe, Braintree, Chargebee, or Recurly are asking a Paddle-native tool
          to do a job it was not primarily built for.
        </LI>
      </UL>
      <InBodyImage
        file="/blog/paddle-retain-alternatives-img-2"
        alt="Comparison of ecosystem fit: Paddle Retain shown as strongest when Paddle is the merchant of record, versus Revova shown as a processor-agnostic read-only connection across Stripe, Paddle, Braintree, Chargebee, and Recurly"
        caption="Retain's fit is strongest inside the Paddle ecosystem. A processor-agnostic tool keeps the same recovery stack no matter where you bill from."
      />

      <H2 id="processor-coverage">Processor coverage</H2>
      <P>
        If Paddle is genuinely your merchant of record and you have no plans to add another processor, Retain&apos;s
        native integration is a real strength worth weighing. But plenty of teams bill through more than one
        processor, or migrate processors over time, and a tool tied closely to one ecosystem does not travel
        with you the way a processor-agnostic one does.
      </P>
      <InBodyImage
        file="/blog/paddle-retain-alternatives-img-3"
        alt="Processor coverage comparison: Paddle Retain shown as Paddle-oriented with legacy ProfitWell roots, versus Revova connecting read-only to five processors — Stripe, Paddle, Braintree, Chargebee, and Recurly"
        caption="Revova connects read-only across five processors; Retain's strongest fit stays inside the Paddle ecosystem."
      />

      <InlineCTA>
        Already billing through Stripe, Paddle, Braintree, Chargebee, or Recurly? Revova connects read-only in
        minutes, with a flat price no matter how much revenue it recovers. $29/mo Starter or $79/mo Pro, 14-day
        free trial, no credit card required.
      </InlineCTA>

      <H2 id="comparison">Paddle Retain alternatives compared</H2>
      <CompareTable
        rows={[
          ['Alternative', 'Pricing', 'Pricing model', 'Processors', 'Historical recovery', 'Best for'],
          ['Revova', '$29–$79/mo flat', 'Flat fee', 'Stripe, Paddle, Braintree, Chargebee, Recurly', 'Yes (90 days–12 mo)', 'Predictable pricing, broad processor coverage'],
          ['Paddle Retain', '% of recovered revenue', 'Pay-on-results', 'Paddle / ProfitWell', 'No', 'Pay-on-results model, Paddle-native ecosystem'],
          ['Churn Buster', 'Scales with recovery volume', 'Volume-tiered', 'Stripe, Recurly', 'No', 'Proven Stripe/Recurly dunning specialist'],
          ['Churnkey', '~$199+/mo', 'Flat fee', 'Stripe-centric', 'No', 'Full retention suite, budget flexible'],
        ]}
      />
      <P>
        For a broader look at this category, our <A href="/blog/churn-buster-alternatives">Churn Buster
        alternatives guide</A> covers several of these same names from a different starting point, including a
        full feature-by-feature breakdown.
      </P>

      <H2 id="which-fits">Which fits your situation</H2>
      <ProsCons
        pros={[
          'Early-stage, low recovery volume, want to try dunning at minimal upfront cost → Paddle Retain’s pay-on-results model is a reasonable, low-risk starting point',
          'Paddle is your merchant of record and you have no near-term plans to add another processor → Retain’s native fit is a real advantage',
          'Want a predictable, flat monthly bill regardless of recovery volume → Revova',
          'Growing MRR and want the dunning bill to stay flat as recovery volume scales → Revova',
          'Running Stripe, Braintree, Chargebee, or Recurly alongside or instead of Paddle → Revova, built for all five processors',
        ]}
        cons={[
          'Percentage-of-recovered pricing means the bill keeps climbing as your MRR grows — model it at your projected volume, not just today’s',
          'None of the flat-fee alternatives offer a pay-nothing-if-nothing-recovered guarantee the way Retain’s model inherently does',
          'Switching away from Retain if you are deep in the Paddle ecosystem means losing a native, single-vendor integration',
        ]}
      />
      <P>
        If your reason for comparing pricing models is really about sizing the opportunity first, it is worth
        reading our <A href="/blog/how-much-revenue-lost-to-failed-payments">guide on how much revenue is
        typically lost to failed payments</A> before running the percentage-of-recovered math against a flat
        fee side by side.
      </P>

      <H2 id="how-to-switch">How to switch from Paddle Retain</H2>
      <OL>
        <LI><Strong>Project the bill at your future volume, not just today&apos;s.</Strong> Take your current recovery volume, apply Retain&apos;s percentage, then redo the math at your MRR six and twelve months out to see whether a flat fee would actually be cheaper by then.</LI>
        <LI><Strong>Connect your processor to the alternative read-only.</Strong> For Revova, that&apos;s a single API key for Stripe, Paddle, Braintree, Chargebee, or Recurly, with no webhook setup required.</LI>
        <LI><Strong>Run a historical scan before changing anything else.</Strong> See what is actually recoverable in your existing payment history — Retain does not offer this, so it is often the first tangible difference you will notice.</LI>
        <LI><Strong>Recreate your cadence or accept the defaults</Strong>, confirm the new sequence is firing correctly, then turn off Retain&apos;s emails specifically to avoid double-emailing customers.</LI>
      </OL>
      <Callout title="Watch out for double-emailing during the overlap">
        Run both tools in parallel only briefly, and disable Retain&apos;s outbound emails as soon as your new
        sequence is confirmed working — a customer getting two different dunning emails about the same failed
        charge in the same week is an easy mistake to avoid with a short, deliberate cutover.
      </Callout>

      <InlineCTA>
        See what a flat-fee recovery layer would actually cost on your own account — Revova&apos;s free Lost
        Revenue Finder connects read-only and scans your payment history before you commit to anything. No
        credit card required.
      </InlineCTA>

      <H2 id="faq">Frequently asked questions</H2>
      <FAQ items={faqs} />

      <Divider />

      <CTA
        heading="See what a flat-fee recovery layer would actually recover"
        body="Revova connects read-only to Stripe, Paddle, Braintree, Chargebee, or Recurly — a flat price no matter how much revenue it recovers. $29/mo Starter or $79/mo Pro, 14-day free trial, no credit card, 30-day money-back guarantee."
      />
    </>
  )
}
