import Link from 'next/link'
import type { Metadata } from 'next'
import { sortedPosts, type BlogPost } from '@/lib/blog'
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

// Post cover: absolutely fills its (relative, sized) parent. Uses the article's
// AVIF hero with a WebP fallback, or an on-brand gradient for posts without one.
function Cover({ post }: { post: BlogPost }) {
  if (!post.hero) {
    return <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600" />
  }
  return (
    <picture>
      <source srcSet={`${post.hero}.avif`} type="image/avif" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${post.hero}.webp`}
        alt={post.heroAlt ?? post.title}
        width={1200}
        height={600}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </picture>
  )
}

function Meta({ post, featured }: { post: BlogPost; featured?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
      {featured && (
        <span className="font-bold uppercase tracking-wide text-indigo-600">Featured</span>
      )}
      <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{post.category}</span>
      <span>{formatDate(post.date)}</span>
      <span aria-hidden>·</span>
      <span>{post.readingMinutes} min read</span>
    </div>
  )
}

export default function BlogIndexPage() {
  const [featured, ...rest] = sortedPosts

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '' }, { name: 'Blog', path: 'blog' }])} />

      <header className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/blog" className="text-gray-900 font-medium">Blog</Link>
            <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">Start free →</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-14 pb-20">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">The Revova blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.08] mb-4 text-balance">
            Recover more revenue. Lose fewer customers.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Practical guides, honest tool comparisons, and tips on failed-payment recovery, dunning,
            and reducing involuntary churn.
          </p>
        </div>

        {/* Featured post — large cover card */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-2 rounded-3xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 mb-16"
          >
            <div className="relative min-h-[240px] md:min-h-[300px] overflow-hidden bg-gray-50">
              <Cover post={featured} />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <Meta post={featured} featured />
              <h2 className="mt-4 text-2xl md:text-[1.75rem] font-bold text-gray-900 leading-tight tracking-tight group-hover:text-indigo-700 transition-colors text-balance">
                {featured.title}
              </h2>
              <p className="mt-3 text-gray-500 leading-relaxed line-clamp-3">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                Read article <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        )}

        {/* Remaining posts — image-top grid */}
        {rest.length > 0 && (
          <>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">More articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
                    <Cover post={post} />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Meta post={post} />
                    <h3 className="mt-3 text-lg font-bold text-gray-900 leading-snug tracking-tight group-hover:text-indigo-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <span className="mt-4 text-sm font-semibold text-indigo-600">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Bottom CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#060612] text-white p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-balance">
            See what you&apos;ve already lost to failed payments
          </h2>
          <p className="text-white/55 max-w-xl mx-auto mb-8 leading-relaxed">
            Connect your payment processor and Revova&apos;s free Lost Revenue Finder shows the exact
            number — from the last 30 days up to 12 months. No credit card, no code.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            Run the free scan →
          </Link>
        </div>
      </section>

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
