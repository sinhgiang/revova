import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export function getStripeConnectUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.STRIPE_CLIENT_ID!,
    scope: 'read_write',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/callback`,
    state,
  })
  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`
}

export async function getConnectedStripeClient(accessToken: string) {
  return new Stripe(accessToken)
}
