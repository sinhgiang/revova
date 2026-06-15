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
}

const SEQUENCE_CONTEXT: Record<number, string> = {
  1: 'This is the first gentle reminder (Day 1). Be warm, understanding, and helpful. No urgency.',
  2: 'This is the second follow-up (Day 3). Be friendly but slightly more direct. Mention their access may be affected.',
  3: 'This is the third reminder (Day 7). Be professional and clear. Mention access will be suspended soon if not updated.',
  4: 'This is the fourth notice (Day 14). Be firm but respectful. Access is now suspended or about to be. Create urgency to act now.',
  5: 'This is the final notice (Day 21). This is the last email. Be direct and clear that the subscription will be permanently cancelled unless they act today.',
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
}): string {
  return `You are a professional customer success email writer for ${params.businessName}.

Write a payment recovery email with these details:
- Customer name: ${params.customerName || 'there'}
- Product/Service: ${params.productName}
- Amount due: ${params.formattedAmount}
- Decline reason: ${params.declineInfo}
- Sequence: Email #${params.emailSequence}
- Tone guidance: ${params.sequenceContext}
- Card update link: ${params.updateCardUrl}

Rules:
1. Write in English only
2. Subject line must be compelling and personal (not spammy)
3. Body should be 3-4 short paragraphs max
4. Include the update card link as a clear CTA
5. Never be rude or threatening
6. Sound human, not automated
7. Preview text should make them want to open the email

Respond in this exact JSON format:
{
  "subject": "email subject line here",
  "previewText": "preview text here (max 90 chars)",
  "body": "full email body in plain text with \\n for line breaks"
}`
}

function parseAIResponse(text: string): EmailTemplate {
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const parsed = JSON.parse(clean)
  return {
    subject: parsed.subject,
    previewText: parsed.previewText,
    body: parsed.body,
  }
}

function fallbackEmail(params: {
  customerName: string
  businessName: string
  formattedAmount: string
  updateCardUrl: string
  emailSequence: number
}): EmailTemplate {
  const { customerName, businessName, formattedAmount, updateCardUrl, emailSequence } = params
  const name = customerName && customerName !== 'there' ? customerName : 'there'

  const subjects = [
    `Action needed: Your ${businessName} payment of ${formattedAmount} didn't go through`,
    `Reminder: Please update your payment details for ${businessName}`,
    `Your ${businessName} access may be affected — quick fix needed`,
    `Final reminder: Update your ${businessName} payment to keep access`,
    `Last chance: Your ${businessName} subscription will be cancelled today`,
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
    model: 'claude-haiku-4-5-20251001',
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
    model: 'gemini-2.0-flash',
    contents: prompt,
  })
  const text = response.text
  if (!text) throw new Error('Empty Gemini response')
  return parseAIResponse(text)
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
}): Promise<EmailTemplate> {
  const declineInfo = params.declineCode
    ? DECLINE_CONTEXT[params.declineCode] ?? DECLINE_CONTEXT.generic_decline
    : DECLINE_CONTEXT.generic_decline

  const sequenceContext = SEQUENCE_CONTEXT[params.emailSequence] ?? SEQUENCE_CONTEXT[1]
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
  })

  const fallback = fallbackEmail({
    customerName: params.customerName,
    businessName: params.businessName,
    formattedAmount,
    updateCardUrl: params.updateCardUrl,
    emailSequence: params.emailSequence,
  })

  // 1. Try Anthropic Claude (best quality)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const result = await tryAnthropic(prompt)
      console.log('[AI] Used: Anthropic Claude Haiku')
      return result
    } catch (err) {
      console.warn('[AI] Anthropic failed, trying Gemini next:', (err as Error).message)
    }
  }

  // 2. Try Google Gemini Flash (free tier — 1500 req/day)
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await tryGemini(prompt)
      console.log('[AI] Used: Google Gemini Flash (fallback)')
      return result
    } catch (err) {
      console.warn('[AI] Gemini also failed, using static template:', (err as Error).message)
    }
  }

  // 3. Static template — always works, no external dependency
  console.warn('[AI] All providers failed — using static template')
  return fallback
}
