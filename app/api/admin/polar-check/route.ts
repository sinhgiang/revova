/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin'

// TEMPORARY diagnostic — admin only. Verifies the Polar upgrade config:
// is POLAR_ACCESS_TOKEN valid, does POLAR_PRO_PRODUCT_ID resolve to a real Pro
// product, and are there any active subscriptions to test an upgrade with.
// Returns only non-secret metadata. Delete after checking.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const token = process.env.POLAR_ACCESS_TOKEN
  const proId = process.env.POLAR_PRO_PRODUCT_ID
  const out: any = {
    env: { POLAR_ACCESS_TOKEN: token ? 'set' : 'MISSING', POLAR_PRO_PRODUCT_ID: proId ? 'set' : 'MISSING' },
  }
  if (!token || !proId) {
    out.result = 'Config incomplete — set both env vars and redeploy.'
    return NextResponse.json(out)
  }

  // 1) Token valid? List products.
  try {
    const r = await fetch('https://api.polar.sh/v1/products?limit=100&is_archived=false', {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    })
    out.tokenValid = r.ok
    if (!r.ok) {
      out.result = `Token rejected by Polar (HTTP ${r.status}). Check the token / its scopes.`
      return NextResponse.json(out)
    }
    const body = await r.json()
    const items: any[] = body?.items ?? body?.result?.items ?? body ?? []
    out.products = items.map((p) => ({ id: p.id, name: p.name, prices: (p.prices ?? []).map((x: any) => x.price_amount) }))
    const match = items.find((p) => p.id === proId)
    out.proProductIdMatches = Boolean(match)
    out.proProductName = match?.name ?? null
  } catch (e: any) {
    out.result = 'Could not reach Polar API: ' + (e?.message ?? 'error')
    return NextResponse.json(out)
  }

  // 2) Any active subscriptions to upgrade?
  try {
    const r = await fetch('https://api.polar.sh/v1/subscriptions?limit=10&active=true', {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    })
    if (r.ok) {
      const body = await r.json()
      const items: any[] = body?.items ?? body?.result?.items ?? []
      out.activeSubscriptions = items.length
      out.subscriptionSample = items.slice(0, 5).map((s) => ({ id: s.id, product: s.product?.name ?? s.product_id, status: s.status }))
    }
  } catch { /* non-critical */ }

  out.result = out.proProductIdMatches
    ? '✅ Config OK — token works and POLAR_PRO_PRODUCT_ID matches your Pro product. One-click upgrade will work for real Starter subscribers.'
    : '⚠️ Token works, but POLAR_PRO_PRODUCT_ID does NOT match any of your products above. Copy the correct Pro product id from the products list.'
  return NextResponse.json(out)
}
