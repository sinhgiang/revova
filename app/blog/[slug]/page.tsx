import Link from 'next/link'
import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import { posts, getPost, sortedPosts, AUTHOR, type BlogPost } from '@/lib/blog'
import { JsonLd } from '@/components/json-ld'
import { blogPostingSchema, breadcrumbSchema, faqPageSchema, type Faq } from '@/lib/seo'
import BestPaymentRecoveryTools2026, { faqs as bestToolsFaqs } from '@/components/blog/articles/best-payment-recovery-tools-2026'
import HowToRecoverFailedStripePayments, { faqs as stripeFaqs } from '@/components/blog/articles/how-to-recover-failed-stripe-payments'
import WhatIsInvoluntaryChurn, { faqs as churnFaqs } from '@/components/blog/articles/what-is-involuntary-churn'
import DunningEmailExamples, { faqs as dunningFaqs } from '@/components/blog/articles/dunning-email-examples-templates'
import StripeDeclineCodes, { faqs as declineFaqs } from '@/components/blog/articles/stripe-decline-codes-explained'
import ChurnkeyAlternatives, { faqs as churnkeyFaqs } from '@/components/blog/articles/churnkey-alternatives'
import HowToReduceSaasChurn, { faqs as reduceChurnFaqs } from '@/components/blog/articles/how-to-reduce-saas-churn'
import RevovaReview2026, { faqs as revovaReviewFaqs } from '@/components/blog/articles/revova-review-2026'
import RevovaVsCompetitors2026, { faqs as revovaVsFaqs } from '@/components/blog/articles/revova-vs-competitors-2026'
import PaddleVsStripeSubscriptions, { faqs as paddleVsStripeFaqs } from '@/components/blog/articles/paddle-vs-stripe-subscriptions'
import HowMuchRevenueLostToFailedPayments, { faqs as revenueLostFaqs } from '@/components/blog/articles/how-much-revenue-lost-to-failed-payments'

// Wire each post slug to its article body. Bodies live outside app/ so this
// registry is the one place routing meets content.
const bodies: Record<string, ComponentType> = {
  'how-much-revenue-lost-to-failed-payments': HowMuchRevenueLostToFailedPayments,
  'paddle-vs-stripe-subscriptions': PaddleVsStripeSubscriptions,
  'revova-vs-competitors-2026': RevovaVsCompetitors2026,
  'revova-review-2026': RevovaReview2026,
  'best-payment-recovery-dunning-tools-2026': BestPaymentRecoveryTools2026,
  'how-to-recover-failed-stripe-payments': HowToRecoverFailedStripePayments,
  'what-is-involuntary-churn': WhatIsInvoluntaryChurn,
  'dunning-email-examples-templates': DunningEmailExamples,
  'stripe-decline-codes-explained': StripeDeclineCodes,
  'churnkey-alternatives': ChurnkeyAlternatives,
  'how-to-reduce-saas-churn': HowToReduceSaasChurn,
}

// Posts that ship an on-page FAQ also emit matching FAQPage structured data.
const faqsBySlug: Record<string, Faq[]> = {
  'how-much-revenue-lost-to-failed-payments': revenueLostFaqs,
  'paddle-vs-stripe-subscriptions': paddleVsStripeFaqs,
  'revova-vs-competitors-2026': revovaVsFaqs,
  'revova-review-2026': revovaReviewFaqs,
  'best-payment-recovery-dunning-tools-2026': bestToolsFaqs,
  'how-to-recover-failed-stripe-payments': stripeFaqs,
  'what-is-involuntary-churn': churnFaqs,
  'dunning-email-examples-templates': dunningFaqs,
  'stripe-decline-codes-explained': declineFaqs,
  'churnkey-alternatives': churnkeyFaqs,
  'how-to-reduce-saas-churn': reduceChurnFaqs,
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Article not found' }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  }
}

// Cover image for a related-post card (absolute-fills its relative parent).
function RelatedCover({ post }: { post: BlogPost }) {
  if (!post.hero) return <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600" />
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

// The 3 articles to show at the bottom — the next posts after this one, wrapping
// around, so every article surfaces a different, non-repeating trio.
function relatedFor(slug: string): BlogPost[] {
  const i = sortedPosts.findIndex((p) => p.slug === slug)
  const ordered = [...sortedPosts.slice(i + 1), ...sortedPosts.slice(0, Math.max(0, i))]
  return ordered.slice(0, 3)
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  const Body = bodies[slug]
  if (!post || !Body) notFound()

  const postFaqs = faqsBySlug[slug]
  const related = relatedFor(slug)

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '' },
            { name: 'Blog', path: 'blog' },
            { name: post.title, path: `blog/${post.slug}` },
          ]),
          ...(postFaqs ? [faqPageSchema(postFaqs)] : []),
        ]}
      />

      <header className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900 text-lg">Revova</Link>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-gray-900">Blog</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">Start free →</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/blog" className="hover:text-gray-600">← All articles</Link>
        </nav>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <h1 className="text-4xl md:text-[2.75rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6 text-balance">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 pb-8 mb-2 border-b border-gray-100">
          <picture>
            <source srcSet={`${AUTHOR.avatar}.avif`} type="image/avif" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${AUTHOR.avatar}.webp`}
              alt={AUTHOR.name}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover border border-gray-100"
            />
          </picture>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">{post.author}</p>
            <p className="text-gray-400">{AUTHOR.role}</p>
          </div>
        </div>

        {post.hero && (
          <figure className="mt-8 -mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <picture>
              <source srcSet={`${post.hero}.avif`} type="image/avif" />
              <img
                src={`${post.hero}.webp`}
                alt={post.heroAlt ?? post.title}
                width={1200}
                height={600}
                fetchPriority="high"
                className="w-full h-auto rounded-2xl border border-gray-100"
              />
            </picture>
          </figure>
        )}

        <article className="pt-8">
          <Body />
        </article>

        <div className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Keep reading</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 transition-all hover:border-indigo-300 hover:shadow-lg hover:shadow-gray-100"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
                  <RelatedCover post={rp} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-1.5 text-[11px] font-semibold text-indigo-600">{rp.category}</span>
                  <h3 className="text-[15px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-indigo-700 line-clamp-2">{rp.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/blog" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">← Back to all articles</Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
          <Link href="/contact" className="hover:text-gray-600">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
