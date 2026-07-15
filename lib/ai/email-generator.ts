import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenAI } from '@google/genai'
import { DeclineCode, EmailTemplate } from '@/types'

const DECLINE_CONTEXT: Record<string, string> = {
  insufficient_funds: 'The card was declined due to insufficient funds.',
  expired_card: 'The card has expired.',
  do_not_honor: 'The bank declined the transaction — likely due to international transaction restrictions.',
  card_declined: 'The card was declined by the bank.',
  incorrect_cvc: 'The CVC/CVV code was incorrect.',
  lost_card: 'The card has been reported as lost.',
  stolen_card: 'The card has been reported as stolen.',
  generic_decline: 'The card was declined for an unspecified reason.',
  // Not a lack of funds — the bank needs the customer to verify the payment
  // (3-D Secure / Strong Customer Authentication). Common in the EU/UK. The fix
  // is to CONFIRM the payment, not to replace the card.
  authentication_required: 'The payment needs the customer to verify it with their bank (3-D Secure / Strong Customer Authentication). The card itself is fine — the charge just needs to be confirmed.',
}

const SEQUENCE_CONTEXT: Record<number, string> = {
  1: 'This is the first gentle reminder (Day 1). Be warm, understanding, and helpful. No urgency.',
  2: 'This is the second follow-up (Day 3). Be friendly but slightly more direct. Mention their access may be affected.',
  3: 'This is the third reminder (Day 7). Be professional and clear. Mention access will be suspended soon if not updated.',
  4: 'This is the fourth notice (Day 14). Be firm but respectful. Access is now suspended or about to be. Create urgency to act now.',
  5: 'This is the final notice (Day 21). This is the last email. Be direct and clear that the subscription will be permanently cancelled unless they act today.',
}

const HARD_DECLINE_CODES = new Set([
  'lost_card', 'stolen_card', 'pickup_card', 'restricted_card',
  'security_violation', 'transaction_not_allowed', 'do_not_honor',
  'fraudulent', 'card_declined',
])

export function getDeclineSeverity(code: string | null): 'hard' | 'soft' {
  return HARD_DECLINE_CODES.has(code ?? '') ? 'hard' : 'soft'
}

// Authentication failures (3-D Secure / SCA) are a THIRD class, distinct from
// soft/hard declines. The card works; the customer simply never completed the
// bank verification. These must NOT be treated as "update your card" — they need
// a re-authentication prompt, or EU/UK recovery rates look far worse than reality.
const AUTH_DECLINE_CODES = new Set([
  'authentication_required', 'authentication_declined',
  'card_authentication_required', 'payment_intent_authentication_failure',
])

export type DeclineClass = 'soft' | 'hard' | 'auth'

export function getDeclineClass(code: string | null): DeclineClass {
  if (AUTH_DECLINE_CODES.has(code ?? '')) return 'auth'
  return HARD_DECLINE_CODES.has(code ?? '') ? 'hard' : 'soft'
}

// Per-customer audience detection (B2B vs B2C). A single merchant often has
// both, so we adapt tone PER CUSTOMER — better than one global toggle. Consumer
// mailbox domains → B2C (warm, personal); anything else → likely B2B (a business
// address, so keep it professional and it may be forwarded to finance/AP).
const CONSUMER_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'ymail.com',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com',
  'gmx.com', 'gmx.net', 'mail.com', 'yandex.com', 'zoho.com', 'qq.com', '163.com',
])

export type Audience = 'b2b' | 'b2c'

export function inferAudience(email: string | null | undefined): Audience {
  const domain = (email ?? '').split('@')[1]?.toLowerCase().trim()
  if (!domain) return 'b2c'
  return CONSUMER_DOMAINS.has(domain) ? 'b2c' : 'b2b'
}

const AUDIENCE_HINT: Record<Audience, string> = {
  b2b: 'This is a business customer (work email). Keep the tone professional and efficient. It is fine to acknowledge they may need to forward this to whoever handles billing or finance, and to frame it around their company\'s subscription/invoice.',
  b2c: 'This is an individual customer. Keep the tone warm, personal and friendly — like a short note from a real person, not a corporate billing department.',
}

// Hard declines: max 3 emails, faster cadence (days 1, 3, 7)
const HARD_SEQUENCE_CONTEXT: Record<number, string> = {
  1: 'First email (Day 1) for a hard bank decline. Be warm but clear: the card was blocked and they need to use a different card. Emphasize how quick the fix is.',
  2: 'Second email (Day 3) for a hard decline. Their card was blocked by the bank. Gently urge them to add a new card so they don\'t lose access.',
  3: 'Final email (Day 7) for a hard bank decline. This is the last attempt. Be respectful but clear that this may be their last chance to keep their account active.',
}

// Auth failures (3-D Secure / SCA): the card is fine — the customer just needs
// to CONFIRM/VERIFY the payment with their bank. Short 3-email cadence, and the
// language is "confirm/verify", never "update your card".
const AUTH_SEQUENCE_CONTEXT: Record<number, string> = {
  1: 'First email (Day 1) for a payment that needs bank verification (3-D Secure). Reassure them their card is fine — the bank just needs them to confirm the payment. Make it feel like a 20-second tap, not a problem.',
  2: 'Second email (Day 3) for an unconfirmed 3-D Secure payment. Friendly nudge: the payment is still waiting for their quick verification with the bank so their subscription keeps running.',
  3: 'Final email (Day 7) for an unconfirmed 3-D Secure payment. Last reminder — respectful and clear that the payment needs verifying now to avoid an interruption, and that it only takes a moment.',
}

function buildPrompt(params: {
  customerName: string
  businessName: string
  productName: string
  formattedAmount: string
  declineInfo: string
  sequenceContext: string
  updateCardUrl: string
  emailSequence: number
  mode?: 'recover' | 'authenticate'
  audience?: Audience
  language?: string
  customNote?: string
}): string {
  const lang = params.language && params.language !== 'en' ? params.language : null
  const langInstruction = lang
    ? `1. Write entirely in ${lang}. Every word — subject, preview, body — must be in ${lang}. Do NOT use English.`
    : '1. Write in English only.'

  // Authentication (3-D Secure / SCA) failures need a DIFFERENT ask: the card is
  // fine, so we tell the customer to confirm/verify the payment with their bank —
  // never to "update" or "replace" their card, which would confuse them.
  const authenticate = params.mode === 'authenticate'
  const linkLabel = authenticate ? 'Verify / confirm-payment link' : 'Card update link'
  const ctaRule = authenticate
    ? '4. The card is valid — do NOT ask them to update or replace it. Ask them to CONFIRM / VERIFY the payment with their bank using the link (e.g. "confirm your payment", "verify with your bank"). This is 3-D Secure / bank authentication, not a card problem.'
    : '4. Include the update card link as a clear CTA but do not use "click here" — use natural language like "update your payment details"'

  return `You are a professional customer success email writer for ${params.businessName}.

Write a payment recovery email with these details:
- Customer name: ${params.customerName || 'there'}
- Product/Service: ${params.productName}
- Amount due: ${params.formattedAmount}
- Decline reason: ${params.declineInfo}
- Sequence: Email #${params.emailSequence}
- Tone guidance: ${params.sequenceContext}
- Audience: ${AUDIENCE_HINT[params.audience ?? 'b2c']}
- ${linkLabel}: ${params.updateCardUrl}

Rules:
${langInstruction}
2. Subject line must be personal and conversational — never use words like FREE, URGENT, ACT NOW, CLICK HERE, WINNER, GUARANTEED, OFFER, DEAL, LIMITED TIME, or excessive punctuation like !!! or ALL CAPS
3. Body should be 3-4 short paragraphs max
${ctaRule}
5. Never be rude or threatening
6. Sound like a human colleague, not an automated system
7. Preview text should make them want to open the email — be specific, not generic
8. Never mention money-back guarantees, discounts, or promotional offers unless explicitly instructed below
9. Keep sentences short and conversational — avoid corporate jargon
10. Adapt the tone AND wording specifically to the decline reason above AND to the audience above — an insufficient-funds message, an expired-card message, and a bank-verification message should each read differently, and a business customer should read differently from an individual, not like a generic "your payment failed" template${params.customNote ? `\n11. Special instructions from the business (follow these carefully): "${params.customNote}"` : ''}

Respond in this exact JSON format:
{
  "subject": "email subject line here",
  "previewText": "preview text here (max 90 chars)",
  "body": "full email body in plain text with \\n for line breaks"
}`
}

function buildWinbackPrompt(params: {
  customerName: string
  businessName: string
  productName: string
  emailSequence: number
  discountCode?: string | null
  language?: string
  customNote?: string
}): string {
  const lang = params.language && params.language !== 'en' ? params.language : null
  const langInstruction = lang
    ? `1. Write entirely in ${lang}. Every word must be in ${lang}.`
    : '1. Write in English only.'

  const winbackContext: Record<number, string> = {
    1: 'First winback email (3 days after cancellation). Warm, empathetic tone. Express genuine sadness that they left. Ask if there was something the company could improve. No hard sell — just authentic human care.',
    2: 'Second winback email (14 days after cancellation). Highlight improvements or value they are missing without the product. Friendly reminder of benefits. Mention support is available. Still no pressure.',
    3: `Final winback email (30 days after cancellation). Last attempt. ${params.discountCode ? `Offer them a special comeback discount: use code "${params.discountCode}" to get a discount when they reactivate.` : 'Make reactivation as frictionless as possible.'} Be direct but warm — this is the last email.`,
  }
  const ctx = winbackContext[Math.min(params.emailSequence, 3)]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://revova.io'
  const reactivateUrl = `${appUrl}/signup`

  return `You are a customer success expert writing a winback email for ${params.businessName}.

The customer recently cancelled their ${params.productName} subscription. Write an email to win them back.

Details:
- Customer name: ${params.customerName || 'there'}
- Product: ${params.productName}
- Winback sequence: Email #${params.emailSequence} of 3
- Tone guidance: ${ctx}
- Reactivation link: ${reactivateUrl}

Rules:
${langInstruction}
2. Do NOT mention payment failures or billing problems
3. Focus on the value they are missing, or genuine care for why they left
4. Subject line must be personal, not spammy — no ALL CAPS, no excessive punctuation
5. Body: 3 short paragraphs max
6. Sound like it comes from a real human being at the company
7. Keep it warm and brief — do not be pushy${params.customNote ? `\n8. Special instructions: "${params.customNote}"` : ''}

Respond in this exact JSON format:
{
  "subject": "email subject line here",
  "previewText": "preview text here (max 90 chars)",
  "body": "full email body in plain text with \\n for line breaks"
}`
}

function buildPredunningPrompt(params: {
  customerName: string
  businessName: string
  productName: string
  expMonthName: string
  expYear: number
  updateCardUrl: string
  language?: string
  customNote?: string
}): string {
  const lang = params.language && params.language !== 'en' ? params.language : null
  const langInstruction = lang
    ? `1. Write entirely in ${lang}. Every word — subject, preview, body — must be in ${lang}.`
    : '1. Write in English only.'

  return `You are a professional customer success email writer for ${params.businessName}.

Write a PROACTIVE pre-expiry reminder email. The customer's card is about to expire — the payment has NOT failed yet. The goal is to get them to update their card BEFORE any disruption happens.

Details:
- Customer name: ${params.customerName || 'there'}
- Product/Service: ${params.productName}
- Card expires: ${params.expMonthName} ${params.expYear}
- Card update link: ${params.updateCardUrl}

Rules:
${langInstruction}
2. Tone: helpful, calm, proactive — NOT urgent or alarming. Nothing has gone wrong yet.
3. Make clear this is a friendly heads-up so their subscription continues smoothly.
4. Subject line must be personal and conversational — no FREE, URGENT, ACT NOW, ALL CAPS, or excessive punctuation.
5. Body: 2-3 short paragraphs max.
6. Include the update link as a natural CTA — never "click here".
7. Sound like a thoughtful human colleague, not an automated system.${params.customNote ? `\n8. Special instructions from the business: "${params.customNote}"` : ''}

Respond in this exact JSON format:
{
  "subject": "email subject line here",
  "previewText": "preview text here (max 90 chars)",
  "body": "full email body in plain text with \\n for line breaks"
}`
}

function parseAIResponse(text: string): EmailTemplate {
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  // Some models put RAW newlines/tabs inside JSON string values, which is invalid
  // JSON. Escape any control chars before parsing so JSON.parse won't choke.
  const escapeCtrl = (s: string) => s.replace(/[ -]/g, c =>
    c === '\n' ? '\\n' : c === '\t' ? '\\t' : c === '\r' ? '\\r' : '')
  let parsed: any
  try {
    parsed = JSON.parse(clean)
  } catch {
    try {
      parsed = JSON.parse(escapeCtrl(clean))
    } catch {
      // Last resort: grab the first {...} block and escape control chars in it
      const m = clean.match(/\{[\s\S]*\}/)
      if (!m) throw new Error('No JSON object in AI response')
      parsed = JSON.parse(escapeCtrl(m[0]))
    }
  }
  // Normalize HTML line breaks to \n (resend.ts splits the body on \n into <p>s)
  const body = String(parsed.body ?? '').replace(/<br\s*\/?>/gi, '\n')
  return {
    subject: parsed.subject,
    previewText: parsed.previewText,
    body,
  }
}

function fallbackEmail(params: {
  customerName: string
  businessName: string
  formattedAmount: string
  updateCardUrl: string
  emailSequence: number
  mode?: 'recover' | 'authenticate'
}): EmailTemplate {
  const { customerName, businessName, formattedAmount, updateCardUrl, emailSequence } = params
  const name = customerName && customerName !== 'there' ? customerName : 'there'

  // Authentication (3-D Secure / SCA): the card is fine — ask them to CONFIRM the
  // payment with their bank, never to "update" their card.
  if (params.mode === 'authenticate') {
    const authSubjects = [
      `Quick verification needed for your ${businessName} payment`,
      `Your ${businessName} payment is waiting for bank verification`,
      `${businessName}: please confirm your payment with your bank`,
    ]
    const subject = authSubjects[Math.min(emailSequence - 1, authSubjects.length - 1)]
    const body = `Hi ${name},

Your recent payment of ${formattedAmount} for ${businessName} just needs a quick confirmation with your bank — your card is fine, this is a standard security check (3-D Secure).

It only takes a moment. Please confirm the payment using the link below so your subscription keeps running without any interruption:

${updateCardUrl}

If you have any questions, just reply to this email — we're happy to help.

Best,
The ${businessName} Team`
    return {
      subject,
      previewText: `A quick bank verification will complete your ${formattedAmount} payment.`,
      body,
    }
  }

  const subjects = [
    `Your ${businessName} payment of ${formattedAmount} didn't go through`,
    `Quick update needed for your ${businessName} account`,
    `Your ${businessName} access — payment update required`,
    `${businessName}: your subscription payment is still pending`,
    `${businessName} subscription update needed`,
  ]
  const subject = subjects[Math.min(emailSequence - 1, subjects.length - 1)]

  const body = `Hi ${name},

We weren't able to process your recent payment of ${formattedAmount} for ${businessName}.

This can happen for a few common reasons — an expired card, a temporary bank hold, or updated card details. It's an easy fix and only takes 30 seconds.

Please click the link below to update your payment information and keep your access uninterrupted:

${updateCardUrl}

If you have any questions, just reply to this email — we're happy to help.

Best,
The ${businessName} Team`

  return {
    subject,
    previewText: `Please update your payment of ${formattedAmount} to keep your access.`,
    body,
  }
}

async function tryAnthropic(prompt: string): Promise<EmailTemplate> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })
  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')
  return parseAIResponse(content.text)
}

async function tryGemini(prompt: string): Promise<EmailTemplate> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }, // force valid JSON
  })
  const text = response.text
  if (!text) throw new Error('Empty Gemini response')
  return parseAIResponse(text)
}

// Groq — free, very fast inference of Llama 3.3 70B. OpenAI-compatible API.
async function tryGroq(prompt: string): Promise<EmailTemplate> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // 8b-instant: free tier 500k tokens/day (5× the 70b limit), fast, and more
      // than enough quality for writing a short personalized recovery email.
      model: 'llama-3.1-8b-instant',
      max_tokens: 1024,
      temperature: 0.7,
      // Force strictly-valid JSON output (the prompt already asks for JSON).
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`)
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty Groq response')
  return parseAIResponse(text)
}

// Run the AI providers free-first: Groq (free) → Gemini (free) → Claude (paid)
// → null if all fail. The caller falls back to a static template on null.
async function runAICascade(prompt: string): Promise<EmailTemplate | null> {
  if (process.env.GROQ_API_KEY) {
    try { const r = await tryGroq(prompt); console.log('[AI] Used: Groq Llama 3.3 (free)'); return r }
    catch (err) { console.warn('[AI] Groq failed:', (err as Error).message) }
  }
  if (process.env.GEMINI_API_KEY) {
    try { const r = await tryGemini(prompt); console.log('[AI] Used: Google Gemini Flash (free)'); return r }
    catch (err) { console.warn('[AI] Gemini failed:', (err as Error).message) }
  }
  if (process.env.ANTHROPIC_API_KEY) {
    try { const r = await tryAnthropic(prompt); console.log('[AI] Used: Anthropic Claude Haiku (paid)'); return r }
    catch (err) { console.warn('[AI] Anthropic failed:', (err as Error).message) }
  }
  return null
}

export async function generateWinbackEmail(params: {
  customerName: string
  businessName: string
  productName: string
  emailSequence: number
  discountCode?: string | null
  language?: string
  customNote?: string
}): Promise<EmailTemplate> {
  const prompt = buildWinbackPrompt(params)
  const fallback: EmailTemplate = {
    subject: `We miss you at ${params.businessName}`,
    previewText: `It's been a while — we'd love to have you back.`,
    body: `Hi ${params.customerName || 'there'},\n\nWe noticed you're no longer subscribed to ${params.productName}.\n\nIf there's anything we could have done better, we'd genuinely love to hear it. And if you're ever ready to come back, we'll be here.\n\nBest,\nThe ${params.businessName} Team`,
  }

  return (await runAICascade(prompt)) ?? fallback
}

export async function generatePredunningEmail(params: {
  customerName: string
  businessName: string
  productName: string
  expMonthName: string
  expYear: number
  updateCardUrl: string
  language?: string
  customNote?: string
}): Promise<EmailTemplate> {
  const prompt = buildPredunningPrompt(params)
  const fallback: EmailTemplate = {
    subject: `Your card expires in ${params.expMonthName} — a quick heads-up`,
    previewText: `Update your card before ${params.expMonthName} to keep your subscription active.`,
    body: `Hi ${params.customerName || 'there'},

Quick heads-up: the card on your ${params.businessName} account expires in ${params.expMonthName} ${params.expYear}.

To make sure your subscription continues without any disruption, you can update your payment method here:

${params.updateCardUrl}

Thanks for being a customer!

Best,
The ${params.businessName} Team`,
  }

  return (await runAICascade(prompt)) ?? fallback
}

export async function generateRecoveryEmail(params: {
  customerName: string
  customerEmail: string
  businessName: string
  productName: string
  amount: number
  currency: string
  declineCode: DeclineCode | null
  emailSequence: number
  updateCardUrl: string
  country?: string
  language?: string
  customNote?: string
}): Promise<EmailTemplate> {
  const declineClass = getDeclineClass(params.declineCode)
  const declineInfo = params.declineCode
    ? DECLINE_CONTEXT[params.declineCode] ?? DECLINE_CONTEXT.generic_decline
    : DECLINE_CONTEXT.generic_decline

  // Pick the cadence + tone by class: auth (verify) → hard (new card) → soft (retry).
  const sequenceContext =
    declineClass === 'auth'
      ? (AUTH_SEQUENCE_CONTEXT[params.emailSequence] ?? AUTH_SEQUENCE_CONTEXT[3])
      : declineClass === 'hard'
        ? (HARD_SEQUENCE_CONTEXT[params.emailSequence] ?? HARD_SEQUENCE_CONTEXT[3])
        : (SEQUENCE_CONTEXT[params.emailSequence] ?? SEQUENCE_CONTEXT[1])

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: params.currency.toUpperCase(),
  }).format(params.amount / 100)

  const prompt = buildPrompt({
    customerName: params.customerName,
    businessName: params.businessName,
    productName: params.productName,
    formattedAmount,
    declineInfo,
    sequenceContext,
    updateCardUrl: params.updateCardUrl,
    emailSequence: params.emailSequence,
    mode: declineClass === 'auth' ? 'authenticate' : 'recover',
    audience: inferAudience(params.customerEmail),
    language: params.language,
    customNote: params.customNote,
  })

  const fallback = fallbackEmail({
    customerName: params.customerName,
    businessName: params.businessName,
    formattedAmount,
    updateCardUrl: params.updateCardUrl,
    emailSequence: params.emailSequence,
    mode: declineClass === 'auth' ? 'authenticate' : 'recover',
  })

  // Free-first cascade: Groq → Gemini → Claude → static template
  const result = await runAICascade(prompt)
  if (result) return result
  console.warn('[AI] All providers failed — using static template')
  return fallback
}
