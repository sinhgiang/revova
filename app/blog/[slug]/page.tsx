import Link from 'next/link'
import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import { posts, getPost } from '@/lib/blog'
import { JsonLd } from '@/components/json-ld'
import { blogPostingSchema, breadcrumbSchema, faqPageSchema, type Faq } from '@/lib/seo'
import BestPaymentRecoveryTools2026, { faqs as bestToolsFaqs } from '@/components/blog/articles/best-payment-recovery-tools-2026'
import HowToRecoverFailedStripePayments, { faqs as stripeFaqs } from '@/components/blog/articles/how-to-recover-failed-stripe-payments'
import WhatIsInvoluntaryChurn, { faqs as churnFaqs } from '@/components/blog/articles/what-is-involuntary-churn'
import DunningEmailExamples, { faqs as dunningFaqs } from '@/components/blog/articles/dunning-email-examples-templates'

// Wire each post slug to its article body. Bodies live outside app/ so this
// registry is the one place routing meets content.
const bodies: Record<string, ComponentType> = {
  'best-payment-recovery-dunning-tools-2026': BestPaymentRecoveryTools2026,
  'how-to-recover-failed-stripe-payments': HowToRecoverFailedStripePayments,
  'what-is-involuntary-churn': WhatIsInvoluntaryChurn,
  'dunning-email-examples-templates': DunningEmailExamples,
}

// Posts that ship an on-page FAQ also emit matching FAQPage structured data.
const faqsBySlug: Record<string, Faq[]> = {
  'best-payment-recovery-dunning-tools-2026': bestToolsFaqs,
  'how-to-recover-failed-stripe-payments': stripeFaqs,
  'what-is-involuntary-churn': churnFaqs,
  'dunning-email-examples-templates': dunningFaqs,
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  const Body = bodies[slug]
  if (!post || !Body) notFound()

  const postFaqs = faqsBySlug[slug]

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
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            R
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">{post.author}</p>
            <p className="text-gray-400">AI payment recovery for subscription businesses</p>
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

        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href="/blog" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">← Back to all articles</Link>
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
