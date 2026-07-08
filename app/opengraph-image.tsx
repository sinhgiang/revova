import { ImageResponse } from 'next/og'

// Dynamic social-share image for the whole site (inherited by every route unless
// a segment provides its own). Replaces the old missing /og.png reference.
export const alt = 'Revova — AI Payment Recovery for Stripe, Paddle, Braintree, Chargebee & Recurly'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#060612',
          color: 'white',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 44 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            R
          </div>
          <div style={{ fontSize: 46, fontWeight: 800 }}>Revova</div>
        </div>
        <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>
          Stop losing revenue to failed payments
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#a7a7c4', marginTop: 30, maxWidth: 900 }}>
          AI payment recovery that wins back failed &amp; declined charges — on autopilot.
        </div>
      </div>
    ),
    { ...size },
  )
}
