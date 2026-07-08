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

// Hero for "what is involuntary churn": a churn ring (voluntary vs involuntary)
// where the involuntary slice is recoverable — emerald coins rising back up.
function involuntaryChurnHeroSVG() {
  const cx = 340, cy = 300, r = 150, sw = 50, C = 2 * Math.PI * r
  const vol = 0.68
  const volLen = vol * C
  const invLen = (1 - vol) * C
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <radialGradient id="glow" cx="0.28" cy="0.4" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.8" cy="0.55" r="0.55"><stop offset="0" stop-color="#10b981" stop-opacity="0.3"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <g transform="rotate(-90 ${cx} ${cy})">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#23233a" stroke-width="${sw}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#4b4b6b" stroke-width="${sw}" stroke-dasharray="${volLen} ${C - volLen}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#6366f1" stroke-width="${sw}" stroke-dasharray="${invLen} ${C - invLen}" stroke-dashoffset="${-volLen}"/>
    </g>
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="800" fill="#ffffff">~30%</text>
    <text x="${cx}" y="${cy + 30}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="600" fill="#9ca3af">involuntary</text>

    <!-- recoverable: emerald coins rising -->
    <g>
      <circle cx="760" cy="400" r="26" fill="#10b981" fill-opacity="0.85"/>
      <circle cx="838" cy="330" r="31" fill="#10b981"/>
      <circle cx="922" cy="252" r="37" fill="#34d399"/>
      <path d="M700 430 C 780 360, 860 300, 946 236" fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"/>
      <path d="M934 214 l20 20 l-27 7 z" fill="#34d399"/>
      <text x="836" y="336" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="800" fill="#053a2b">$</text>
    </g>

    <g transform="translate(150,110)">
      <rect width="52" height="52" rx="15" fill="#4f46e5"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for the dunning-email templates guide: an envelope (the recovery email)
// with a green "recovered" check badge.
function dunningEmailHeroSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="env" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.32" cy="0.4" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.78" cy="0.35" r="0.55"><stop offset="0" stop-color="#10b981" stop-opacity="0.3"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <!-- envelope -->
    <g>
      <rect x="330" y="196" width="470" height="300" rx="26" fill="url(#env)"/>
      <path d="M330 232 L565 392 L800 232" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="6" stroke-linejoin="round"/>
      <g fill="#ffffff" fill-opacity="0.85">
        <rect x="392" y="404" width="200" height="16" rx="8"/>
        <rect x="392" y="436" width="330" height="14" rx="7"/>
      </g>
      <rect x="392" y="404" width="1" height="1" fill="none"/>
    </g>

    <!-- recovered check badge -->
    <g transform="translate(778,208)">
      <circle r="66" fill="#10b981" stroke="#0a0a16" stroke-width="8"/>
      <path d="M-30 4 l18 20 l38 -44" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <g transform="translate(200,150)">
      <rect width="52" height="52" rx="15" fill="url(#env)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for the decline-codes reference: a card plus three colour-coded decline
// code chips (soft/green, hard/rose, ambiguous/amber).
function declineCodesHeroSVG() {
  const chips = [
    { y: 214, dot: '#34d399', code: 'insufficient_funds' },
    { y: 292, dot: '#fb7185', code: 'expired_card' },
    { y: 370, dot: '#fbbf24', code: 'do_not_honor' },
  ]
  const chipSvg = chips.map((c) => `
    <g transform="translate(600,${c.y})">
      <rect width="340" height="54" rx="14" fill="#161628" stroke="#2a2a44" stroke-width="1.5"/>
      <circle cx="30" cy="27" r="8" fill="${c.dot}"/>
      <text x="54" y="34" font-family="Consolas, monospace" font-size="21" font-weight="600" fill="#e5e7eb">${c.code}</text>
    </g>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.28" cy="0.4" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>

    <g transform="translate(170,214)">
      <rect width="330" height="206" rx="22" fill="url(#card)"/>
      <rect y="40" width="330" height="34" fill="#000" fill-opacity="0.28"/>
      <rect x="28" y="104" width="52" height="40" rx="7" fill="#fbbf24" fill-opacity="0.9"/>
      <g fill="#fff" fill-opacity="0.85"><circle cx="130" cy="168" r="6"/><circle cx="148" cy="168" r="6"/><circle cx="166" cy="168" r="6"/><circle cx="200" cy="168" r="6"/></g>
      <g transform="translate(250,-22)"><circle r="30" fill="#f43f5e"/><text y="11" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="38" font-weight="800" fill="#fff">!</text></g>
    </g>
    ${chipSvg}
    <g transform="translate(170,120)">
      <rect width="52" height="52" rx="15" fill="url(#card)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for "Churnkey alternatives": an expensive price tag swapped for a cheap
// one — the core promise (same recovery, far less money).
function churnkeyAlternativesHeroSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="cheap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.3" cy="0.4" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.38"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.82" cy="0.4" r="0.55"><stop offset="0" stop-color="#10b981" stop-opacity="0.28"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <!-- expensive tag -->
    <g transform="translate(150,232)">
      <rect width="270" height="136" rx="20" fill="#1a1a2b" stroke="#33334d" stroke-width="1.5"/>
      <text x="135" y="66" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="800" fill="#8b8ba7">$199</text>
      <line x1="42" y1="52" x2="228" y2="52" stroke="#f43f5e" stroke-width="5"/>
      <text x="135" y="104" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="600" fill="#6b6b85">/mo · Churnkey</text>
    </g>

    <!-- arrow -->
    <path d="M452 300 L556 300" fill="none" stroke="#34d399" stroke-width="6" stroke-linecap="round"/>
    <path d="M544 286 l20 14 l-20 14 z" fill="#34d399"/>

    <!-- cheap tag -->
    <g transform="translate(600,214)">
      <rect width="300" height="172" rx="22" fill="url(#cheap)"/>
      <text x="150" y="82" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="66" font-weight="800" fill="#ffffff">$29</text>
      <text x="150" y="120" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600" fill="#e0e7ff">/mo · alternatives from</text>
      <g transform="translate(214,-20)"><rect width="120" height="40" rx="20" fill="#10b981"/><text x="60" y="27" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" fill="#fff">-85%</text></g>
    </g>

    <g transform="translate(150,120)">
      <rect width="52" height="52" rx="15" fill="url(#cheap)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

const targets = [
  { slug: 'best-payment-recovery-dunning-tools-2026', svg: recoveryHeroSVG() },
  { slug: 'how-to-recover-failed-stripe-payments', svg: stripeRecoveryHeroSVG() },
  { slug: 'what-is-involuntary-churn', svg: involuntaryChurnHeroSVG() },
  { slug: 'dunning-email-examples-templates', svg: dunningEmailHeroSVG() },
  { slug: 'stripe-decline-codes-explained', svg: declineCodesHeroSVG() },
  { slug: 'churnkey-alternatives', svg: churnkeyAlternativesHeroSVG() },
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
