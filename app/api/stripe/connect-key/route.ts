import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendNewSignupAdminAlert } from '@/lib/email/lifecycle'

export async function POST(request: NextRequest) {
  try {
    const { apiKey, businessName: inputBusinessName } = await request.json()

    if (!apiKey || !apiKey.startsWith('sk_')) {
      return NextResponse.json({ error: 'Invalid Stripe API key' }, { status: 400 })
    }

    // Verify the key by fetching balance (works for any Stripe account)
    const stripeClient = new Stripe(apiKey)
    try {
      await stripeClient.balance.retrieve()
    } catch {
      return NextResponse.json({ error: 'Invalid Stripe key — could not connect to Stripe' }, { status: 400 })
    }

    // Try to get business name from Stripe account info
    let businessName: string | null = inputBusinessName?.trim() || null
    let stripeEmail: string | null = null
    if (!businessName) {
      try {
        const acct = await stripeClient.accounts.retrieve()
        businessName = (acct as any).business_profile?.name ||
                       (acct as any).settings?.dashboard?.display_name ||
                       null
        stripeEmail = (acct as any).email || null
      } catch {
        // accounts.retrieve() may not work for all key types — leave null
      }
    }

    // Get current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use a stable account ID based on user (since we can't get Stripe account ID from regular key)
    const accountId = `acct_manual_${user.id.replace(/-/g, '').slice(0, 16)}`

    // Is this the merchant's FIRST connect? (so we only welcome them once)
    const { data: existing } = await (supabase as any)
      .from('stripe_accounts').select('user_id').eq('user_id', user.id).maybeSingle()

    // Delete existing record for this user first
    await (supabase as any).from('stripe_accounts').delete().eq('user_id', user.id)

    const { error: dbError } = await (supabase as any)
      .from('stripe_accounts')
      .insert({
        user_id: user.id,
        stripe_account_id: accountId,
        access_token: apiKey,
        business_name: businessName,
        email: stripeEmail ?? user.email ?? null,
        connected_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save account: ' + dbError.message }, { status: 500 })
    }

    // First-time onboarding → welcome the merchant + alert the founder (trial begins now)
    if (!existing) {
      const merchantEmail = stripeEmail ?? user.email
      if (merchantEmail) {
        await sendWelcomeEmail(merchantEmail, businessName)
        await sendNewSignupAdminAlert(merchantEmail, businessName)
      }
    }

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
