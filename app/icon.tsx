import { ImageResponse } from 'next/og'

// Generated favicon / app icon — the site previously shipped no icon.
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
          color: 'white',
          fontSize: 340,
          fontWeight: 800,
          borderRadius: 110,
          fontFamily: 'sans-serif',
        }}
      >
        R
      </div>
    ),
    { ...size },
  )
}
