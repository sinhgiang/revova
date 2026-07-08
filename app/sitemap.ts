import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'

// Public, indexable marketing/legal pages only. App routes (dashboard, settings, etc.)
// are intentionally excluded — they're gated and disallowed in robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: 'pricing', priority: 0.9, changeFrequency: 'weekly' },
    { path: 'signup', priority: 0.7, changeFrequency: 'monthly' },
    { path: 'about', priority: 0.6, changeFrequency: 'monthly' },
    { path: 'guide', priority: 0.6, changeFrequency: 'monthly' },
    { path: 'contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: 'security', priority: 0.5, changeFrequency: 'monthly' },
    { path: 'refund', priority: 0.4, changeFrequency: 'yearly' },
    { path: 'login', priority: 0.4, changeFrequency: 'yearly' },
    { path: 'privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: 'terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: 'dpa', priority: 0.3, changeFrequency: 'yearly' },
  ]
  return pages.map((p) => ({
    url: `${SITE.url}${p.path ? `/${p.path}` : ''}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))
}
