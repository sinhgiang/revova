// Generate lightweight, on-brand blog hero images from code.
//
// Why this exists: per the Revova content playbook (Part 10), raster/hero images
// must ship in a next-gen format (AVIF) to stay light, with a WebP fallback for
// older browsers. We author each hero as an SVG (no stock-photo licensing, fully
// on-brand) and rasterize it to AVIF + WebP with sharp. Diagrams inside articles
// stay as inline SVG (already optimal) — this script is only for hero art.
//
// Run:  node scripts/gen-blog-images.mjs
// Output: public/blog/<slug>-hero.avif  and  .webp

import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'blog')

const W = 1200
const H = 600

// On-brand hero for the payment-recovery roundup: dark ground, indigo→purple
// glow, a revenue bar row where a few "lost" bars (rose) are recovered back up
// (emerald) — the product's core story, no text baked in (the H1 carries that).
function recoveryHeroSVG() {
  const bars = []
  const heights = [120, 170, 90, 210, 60, 150, 100, 190, 130, 220, 80, 160]
  const lostIdx = new Set([2, 4, 10])
  const bw = 46
  const gap = 42
  const startX = 150
  const baseY = 470
  heights.forEach((h, i) => {
    const x = startX + i * (bw + gap)
    const lost = lostIdx.has(i)
    // base (recovered/normal) bar
    bars.push(
      `<rect x="${x}" y="${baseY - h}" width="${bw}" height="${h}" rx="8" fill="${lost ? '#3b1d2e' : 'url(#bar)'}" ${lost ? 'stroke="#f43f5e" stroke-dasharray="5 4" stroke-width="1.5"' : ''}/>`,
    )
    if (lost) {
      // recovered cap in emerald + small up-arrow
      bars.push(`<rect x="${x}" y="${baseY - h - 26}" width="${bw}" height="20" rx="6" fill="#10b981"/>`)
      bars.push(`<path d="M${x + bw / 2} ${baseY - h - 40} l9 12 h-6 v10 h-6 v-10 h-6 z" fill="#34d399"/>`)
    }
  })

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/>
      </linearGradient>
      <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#4f46e5"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.28" cy="0.3" r="0.7">
        <stop offset="0" stop-color="#4f46e5" stop-opacity="0.42"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="0.85" cy="0.75" r="0.6">
        <stop offset="0" stop-color="#9333ea" stop-opacity="0.32"/><stop offset="1" stop-color="#9333ea" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>
    <line x1="120" y1="${baseY}" x2="1080" y2="${baseY}" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2"/>
    ${bars.join('\n    ')}
    <g transform="translate(150,120)">
      <rect width="52" height="52" rx="15" fill="url(#bar)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for the "how to recover failed Stripe payments" guide: a card that was
// declined, a retry arc, and a recovered (green check) badge — the exact story.
function stripeRecoveryHeroSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.3" cy="0.35" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.75" cy="0.7" r="0.6"><stop offset="0" stop-color="#10b981" stop-opacity="0.28"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <!-- credit card -->
    <g transform="translate(190,200)">
      <rect width="400" height="248" rx="24" fill="url(#card)"/>
      <rect y="46" width="400" height="40" fill="#000" fill-opacity="0.28"/>
      <rect x="34" y="120" width="60" height="46" rx="8" fill="#fbbf24" fill-opacity="0.9"/>
      <g fill="#fff" fill-opacity="0.85">
        <circle cx="150" cy="200" r="7"/><circle cx="170" cy="200" r="7"/><circle cx="190" cy="200" r="7"/>
        <circle cx="228" cy="200" r="7"/><circle cx="248" cy="200" r="7"/><circle cx="268" cy="200" r="7"/>
      </g>
      <!-- declined tag -->
      <g transform="translate(250,116)">
        <rect width="120" height="34" rx="17" fill="#f43f5e"/>
        <text x="60" y="23" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="800" fill="#fff">DECLINED</text>
      </g>
    </g>

    <!-- retry arc from card to check -->
    <path d="M640 300 C 720 230, 800 230, 858 288" fill="none" stroke="#34d399" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/>
    <path d="M846 268 l18 22 l-27 6 z" fill="#34d399"/>

    <!-- recovered badge -->
    <g transform="translate(900,324)">
      <circle r="74" fill="#10b981"/>
      <path d="M-32 4 l20 22 l40 -46" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <g transform="translate(190,120)">
      <rect width="52" height="52" rx="15" fill="url(#card)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

const targets = [
  { slug: 'best-payment-recovery-dunning-tools-2026', svg: recoveryHeroSVG() },
  { slug: 'how-to-recover-failed-stripe-payments', svg: stripeRecoveryHeroSVG() },
]

await mkdir(OUT, { recursive: true })
for (const t of targets) {
  const input = Buffer.from(t.svg)
  const avif = await sharp(input).avif({ quality: 55 }).toBuffer()
  const webp = await sharp(input).webp({ quality: 70 }).toBuffer()
  await writeFile(join(OUT, `${t.slug}-hero.avif`), avif)
  await writeFile(join(OUT, `${t.slug}-hero.webp`), webp)
  console.log(`${t.slug}: AVIF ${(avif.length / 1024).toFixed(1)}KB · WebP ${(webp.length / 1024).toFixed(1)}KB`)
}
