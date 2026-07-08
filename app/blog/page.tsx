import Link from 'next/link'
import type { Metadata } from 'next'
import { sortedPosts } from '@/lib/blog'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Blog — Payment Recovery, Dunning & Churn',
  description:
    'Guides, comparisons and tips on failed-payment recovery, dunning, and reducing involuntary churn for subscription businesses.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Revova Blog — Payment Recovery, Dunning & Churn',
    description: 'Guides, comparisons and tips on recovering failed payments and reducing involuntary churn.',
    url: '/blog',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '' }, { name: 'Blog', path: 'blog' }])} />

      <header className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/blog" className="text-gray-900 font-medium">Blog</Link>
            <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">Start free →</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">The Revova blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Recover more revenue. Lose fewer customers.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Practical guides, honest tool comparisons, and tips on failed-payment recovery, dunning,
            and reducing involuntary churn.
          </p>
        </div>

        <div className="space-y-5">
          {sortedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-gray-200 p-7 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{post.category}</span>
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors mb-2 tracking-tight">
                {post.title}
              </h2>
              <p className="text-gray-500 leading-relaxed">{post.excerpt}</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Read article →</span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
          <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        </div>
      </footer>
    </div>
  )
}
