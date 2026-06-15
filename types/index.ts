export type FailedPaymentStatus = 'pending' | 'email_sent' | 'recovered' | 'failed' | 'max_emails_reached' | 'cancelled'

export type DeclineCode =
  | 'insufficient_funds'
  | 'expired_card'
  | 'do_not_honor'
  | 'card_declined'
  | 'incorrect_cvc'
  | 'lost_card'
  | 'stolen_card'
  | 'generic_decline'

export interface FailedPayment {
  id: string
  user_id: string
  stripe_account_id: string
  stripe_invoice_id: string
  customer_email: string
  customer_name: string | null
  amount: number
  currency: string
  decline_code: DeclineCode | null
  status: FailedPaymentStatus
  stripe_customer_id: string
  stripe_payment_intent_id: string | null
  country: string | null
  emails_sent: number
  last_email_at: string | null
  recovered_at: string | null
  created_at: string
}

export interface StripeAccount {
  id: string
  user_id: string
  stripe_account_id: string
  access_token: string
  connected_at: string
  business_name: string | null
  email: string | null
}

export interface DashboardStats {
  totalRecovered: number
  recoveryRate: number
  pendingPayments: number
  emailsSent: number
  currency: string
}

export interface EmailTemplate {
  subject: string
  body: string
  previewText: string
}
