import Anthropic from '@anthropic-ai/sdk'
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
  1: 'This is the first gentle reminder. Be warm, understanding, and helpful.',
  2: 'This is the second follow-up. Be friendly but slightly more direct. Mention access may be interrupted.',
  3: 'This is the final notice. Be professional and clear that access will be suspended soon unless updated.',
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

  const prompt = `You are a professional customer success email writer for ${params.businessName}.

Write a payment recovery email with these details:
- Customer name: ${params.customerName || 'there'}
- Product/Service: ${params.productName}
- Amount due: ${formattedAmount}
- Decline reason: ${declineInfo}
- Sequence: Email #${params.emailSequence}
- Tone guidance: ${sequenceContext}
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

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected AI response type')

  // Strip markdown code fences if AI wraps response in ```json ... ```
  const rawText = content.text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const parsed = JSON.parse(rawText)
  return {
    subject: parsed.subject,
    previewText: parsed.previewText,
    body: parsed.body,
  }
}
