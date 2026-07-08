import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep authenticated app surfaces, API routes and per-user links out of the index.
        disallow: [
          '/api/',
          '/dashboard',
          '/settings',
          '/analytics',
          '/payments',
          '/sequences',
          '/onboarding',
          '/recover',
          '/billing',
          '/admin',
          '/auth/',
          '/cancel/',
          '/unsubscribe',
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
