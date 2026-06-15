export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    Tables: {
      stripe_accounts: {
        Row: {
          id: string
          user_id: string
          stripe_account_id: string
          access_token: string
          business_name: string | null
          email: string | null
          connected_at: string
        }
        Insert: Omit<Database['public']['Tables']['stripe_accounts']['Row'], 'id' | 'connected_at'>
        Update: Partial<Database['public']['Tables']['stripe_accounts']['Insert']>
      }
      failed_payments: {
        Row: {
          id: string
          user_id: string
          stripe_account_id: string
          stripe_invoice_id: string
          customer_email: string
          customer_name: string | null
          amount: number
          currency: string
          decline_code: string | null
          status: string
          stripe_customer_id: string
          stripe_payment_intent_id: string | null
          country: string | null
          emails_sent: number
          last_email_at: string | null
          recovered_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['failed_payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['failed_payments']['Insert']>
      }
      email_logs: {
        Row: {
          id: string
          failed_payment_id: string
          user_id: string
          email_type: string
          recipient_email: string
          subject: string
          sent_at: string
          opened_at: string | null
          clicked_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['email_logs']['Row'], 'id' | 'sent_at'>
        Update: Partial<Database['public']['Tables']['email_logs']['Insert']>
      }
    }
  }
}
