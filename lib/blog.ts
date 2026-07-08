// Blog post metadata — the single source of truth for the blog index, the
// per-post <head>, the sitemap, and JSON-LD. The article *bodies* live in
// components/blog/articles/* and are wired to slugs in app/blog/[slug]/page.tsx,
// so this file stays lightweight and importable from the sitemap.

export type BlogPost = {
  slug: string
  title: string
  description: string
  excerpt: string
  date: string // ISO date, publication
  updated?: string
  author: string
  category: string
  readingMinutes: number
}

export const posts: BlogPost[] = [
  {
    slug: 'best-payment-recovery-dunning-tools-2026',
    title: 'The 6 Best Payment Recovery (Dunning) Tools in 2026, Compared',
    description:
      'An honest comparison of the best failed-payment recovery tools in 2026 — Churnkey, Churn Buster, Stunning, Baremetrics Recover, Paddle Retain and Revova — with pricing, pros, cons, and how to choose.',
    excerpt:
      'Churnkey, Churn Buster, Stunning, Baremetrics Recover, Paddle Retain and Revova — what each is good at, roughly what it costs, and which one fits your stage and stack.',
    date: '2026-07-08',
    author: 'Revova',
    category: 'Comparison',
    readingMinutes: 13,
  },
]

// Newest first for listings.
export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
