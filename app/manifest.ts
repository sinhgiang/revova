import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Revova — AI Payment Recovery',
    short_name: 'Revova',
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#060612',
    theme_color: '#4f46e5',
    icons: [
      { src: '/brand/revova-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/revova-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
