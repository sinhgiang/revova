// Telegram notifications — mirrors lib/slack.ts. Each merchant brings their own
// bot (created via @BotFather), so it's fully isolated per account.

export interface TelegramPayload {
  type: 'recovered' | 'test' | 'retry_success'
  customerEmail?: string
  customerName?: string | null
  amount?: number
  currency?: string
  businessName?: string | null
}

function buildText(data: TelegramPayload): string {
  if (data.type === 'test') {
    return '✅ *Revova connected!* Telegram notifications are working. You\'ll be alerted here whenever a failed payment is recovered.'
  }
  const name = data.customerName || data.customerEmail || 'A customer'
  const amount = data.amount
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency?.toUpperCase() ?? 'USD' }).format(data.amount / 100)
    : ''
  const label = data.type === 'retry_success' ? 'auto-retried & recovered' : 'recovered'
  return `💸 *Payment ${label}!* ${name} — ${amount}${data.businessName ? ` · ${data.businessName}` : ''}`
}

export async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
  if (!res.ok) throw new Error(`Telegram API returned ${res.status}`)
}

export async function sendTelegramNotification(botToken: string, chatId: string, data: TelegramPayload) {
  await sendTelegramMessage(botToken, chatId, buildText(data))
}

// After the merchant messages their bot, getUpdates lets us read the chat id so
// they never have to find it manually. Returns the most recent chat id, or null.
export async function detectChatId(botToken: string): Promise<string | null> {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`)
  if (!res.ok) throw new Error(`Telegram API returned ${res.status}`)
  const json = await res.json()
  if (!json.ok || !Array.isArray(json.result)) return null
  let chatId: string | null = null
  for (const update of json.result) {
    const id = update.message?.chat?.id ?? update.my_chat_member?.chat?.id ?? update.channel_post?.chat?.id
    if (id != null) chatId = String(id)
  }
  return chatId
}
