import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function getDeclineMessage(code: string | null): string {
  const messages: Record<string, string> = {
    insufficient_funds: 'Insufficient funds',
    expired_card: 'Card expired',
    do_not_honor: 'Bank declined',
    card_declined: 'Card declined',
    incorrect_cvc: 'Incorrect CVC',
    lost_card: 'Card reported lost',
    stolen_card: 'Card reported stolen',
    generic_decline: 'Declined',
  }
  return code ? (messages[code] ?? 'Declined') : 'Unknown'
}
