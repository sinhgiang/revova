export interface SlackPayload {
  type: 'recovered' | 'test' | 'retry_success'
  customerEmail?: string
  customerName?: string | null
  amount?: number
  currency?: string
  businessName?: string | null
}

export async function sendSlackNotification(webhookUrl: string, data: SlackPayload) {
  const { type, customerEmail, customerName, amount, currency, businessName } = data

  let text: string
  if (type === 'test') {
    text = ':white_check_mark: *Revova connected!* Slack notifications are working. You\'ll be alerted here when payments are recovered.'
  } else {
    const name = customerName || customerEmail || 'A customer'
    const formattedAmount = amount
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: currency?.toUpperCase() ?? 'USD' }).format(amount / 100)
      : ''
    const label = type === 'retry_success' ? 'auto-retried & recovered' : 'recovered'
    text = `:money_with_wings: *Payment ${label}!* ${name} — ${formattedAmount}${businessName ? ` · ${businessName}` : ''}`
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    throw new Error(`Slack webhook returned ${res.status}`)
  }
}
