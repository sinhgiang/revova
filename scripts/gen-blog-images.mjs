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

// Hero for the churn-reduction pillar: a churn line trending down (good) with a
// green downward badge.
function reduceChurnHeroSVG() {
  const pts = [[210, 200], [370, 250], [530, 288], [690, 356], [860, 396], [1000, 430]]
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')
  const area = `${line} L1000 486 L210 486 Z`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6366f1" stop-opacity="0.42"/><stop offset="1" stop-color="#6366f1" stop-opacity="0.02"/></linearGradient>
      <radialGradient id="glow" cx="0.3" cy="0.35" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.82" cy="0.75" r="0.55"><stop offset="0" stop-color="#10b981" stop-opacity="0.28"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>
    <line x1="180" y1="486" x2="1020" y2="486" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2"/>
    <path d="${area}" fill="url(#lf)"/>
    <path d="${line}" fill="none" stroke="#6366f1" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1000,430)">
      <circle r="46" fill="#10b981" stroke="#0a0a16" stroke-width="8"/>
      <path d="M0 -18 L0 16 M-15 1 L0 18 L15 1" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="210" y="168" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="800" fill="#e5e7eb">Churn</text>
    <text x="330" y="168" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="800" fill="#34d399">down</text>
    <g transform="translate(210,96)">
      <rect width="52" height="52" rx="15" fill="#4f46e5"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for the Revova product review: an on-brand "scorecard" card showing a
// 4.5/5 rating badge and a few feature check chips — signals a thorough review.
function revovaReviewHeroSVG() {
  const chips = ['No-code setup', 'AI recovery emails', 'Lost Revenue Finder']
  const chipSvg = chips.map((c, i) => `
    <g transform="translate(600,${230 + i * 70})">
      <rect width="360" height="52" rx="14" fill="#161628" stroke="#2a2a44" stroke-width="1.5"/>
      <g transform="translate(24,26)"><circle r="11" fill="#10b981"/><path d="M-5 0 l3.5 4 l7 -8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>
      <text x="52" y="33" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="600" fill="#e5e7eb">${c}</text>
    </g>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.3" cy="0.35" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.8" cy="0.7" r="0.55"><stop offset="0" stop-color="#9333ea" stop-opacity="0.3"/><stop offset="1" stop-color="#9333ea" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <!-- rating card -->
    <g transform="translate(150,214)">
      <rect width="330" height="230" rx="24" fill="url(#card)"/>
      <text x="40" y="70" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="700" fill="#e0e7ff" letter-spacing="2">REVIEW</text>
      <text x="40" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="86" font-weight="800" fill="#ffffff">4.5</text>
      <text x="205" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#e0e7ff">/ 5</text>
      <text x="40" y="190" font-family="Segoe UI, Arial, sans-serif" font-size="26" letter-spacing="3" fill="#fde68a">★★★★<tspan fill="#c7b3ff">★</tspan></text>
    </g>
    ${chipSvg}

    <g transform="translate(150,120)">
      <rect width="52" height="52" rx="15" fill="url(#card)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for the "Revova vs competitors" comparison: Revova's $29 card lit up in
// brand colour beside a stack of greyed, higher competitor price tags.
function revovaVsHeroSVG() {
  const rivals = [
    { name: 'Churnkey', price: '$199' },
    { name: 'Churn Buster', price: '$149' },
    { name: 'Baremetrics', price: '$129' },
    { name: 'Stunning', price: '$110' },
  ]
  const rivalSvg = rivals.map((r, i) => `
    <g transform="translate(660,${186 + i * 66})">
      <rect width="300" height="50" rx="12" fill="#161628" stroke="#2a2a44" stroke-width="1.5"/>
      <text x="20" y="32" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="600" fill="#8b8ba7">${r.name}</text>
      <text x="280" y="32" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="800" fill="#6b6b85">${r.price}/mo</text>
    </g>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="win" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.28" cy="0.4" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.42"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.82" cy="0.7" r="0.55"><stop offset="0" stop-color="#10b981" stop-opacity="0.26"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <!-- Revova winner card -->
    <g transform="translate(150,214)">
      <rect width="330" height="196" rx="24" fill="url(#win)"/>
      <text x="40" y="66" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="700" fill="#e0e7ff" letter-spacing="2">REVOVA</text>
      <text x="40" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="82" font-weight="800" fill="#ffffff">$29</text>
      <text x="215" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#e0e7ff">/mo</text>
      <g transform="translate(214,-20)"><rect width="120" height="40" rx="20" fill="#10b981"/><text x="60" y="27" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="800" fill="#fff">best value</text></g>
    </g>

    <text x="540" y="316" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="800" fill="#4b4b6b">vs</text>
    ${rivalSvg}

    <g transform="translate(150,120)">
      <rect width="52" height="52" rx="15" fill="url(#win)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for "Paddle vs Stripe for Subscriptions": two processor cards side by
// side — Stripe (indigo/purple, "2.9% + 30¢") and Paddle (amber/orange,
// "MoR · handles VAT") — with a "VS" divider. Neither card is styled as the
// loser; the point is the structural trade-off, not a winner.
function paddleVsStripeHeroSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="stripeCard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <linearGradient id="paddleCard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#ea580c"/></linearGradient>
      <radialGradient id="glow" cx="0.26" cy="0.32" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.84" cy="0.68" r="0.55"><stop offset="0" stop-color="#ea580c" stop-opacity="0.28"/><stop offset="1" stop-color="#ea580c" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <!-- Stripe card -->
    <g transform="translate(110,168)">
      <rect width="380" height="300" rx="26" fill="url(#stripeCard)"/>
      <text x="36" y="58" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#e0e7ff" letter-spacing="2">STRIPE</text>
      <text x="36" y="128" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="600" fill="#e0e7ff" opacity="0.85">Payment facilitator</text>
      <g transform="translate(36,158)">
        <rect width="308" height="66" rx="16" fill="#0a0a16" fill-opacity="0.28"/>
        <text x="20" y="42" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="800" fill="#ffffff">2.9% + 30&#162;</text>
      </g>
      <text x="36" y="262" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="600" fill="#e0e7ff" opacity="0.8">You handle VAT / sales tax</text>
    </g>

    <text x="600" y="336" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="800" fill="#6b6b85">VS</text>

    <!-- Paddle card -->
    <g transform="translate(710,168)">
      <rect width="380" height="300" rx="26" fill="url(#paddleCard)"/>
      <text x="36" y="58" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#fff7ed" letter-spacing="2">PADDLE</text>
      <text x="36" y="128" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="600" fill="#fff7ed" opacity="0.85">Merchant of Record</text>
      <g transform="translate(36,158)">
        <rect width="308" height="66" rx="16" fill="#0a0a16" fill-opacity="0.28"/>
        <text x="20" y="42" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="800" fill="#ffffff">MoR &#183; handles VAT</text>
      </g>
      <text x="36" y="262" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="600" fill="#fff7ed" opacity="0.8">~5% + 50&#162; all-in fee</text>
    </g>

    <g transform="translate(110,90)">
      <rect width="52" height="52" rx="15" fill="url(#stripeCard)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for "How Much Revenue Are You Losing to Failed Payments?": a risk
// gauge dial (emerald -> amber -> rose zones) with a needle pointing into the
// risk zone, plus a stack of bills leaking coins — the loss/benchmark theme.
function revenueAtRiskGaugeHeroSVG() {
  const cx = 350
  const cy = 470
  const r = 230
  const trackW = 40

  const toXY = (deg, radius = r) => {
    const rad = (deg * Math.PI) / 180
    return [cx + radius * Math.cos(rad), cy - radius * Math.sin(rad)]
  }
  const arcPath = (a0, a1) => {
    const [x0, y0] = toXY(a0)
    const [x1, y1] = toXY(a1)
    const large = Math.abs(a0 - a1) > 180 ? 1 : 0
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }

  const needleAngle = 42
  const [nx, ny] = toXY(needleAngle, 150)

  const drips = [
    { cx: 940, cy: 300, r: 10 },
    { cx: 978, cy: 356, r: 13 },
    { cx: 1006, cy: 422, r: 16 },
  ]
  const dripSvg = drips
    .map((d) => `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="#f43f5e" fill-opacity="0.9"/>`)
    .join('\n    ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <radialGradient id="glow" cx="0.26" cy="0.3" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.86" cy="0.62" r="0.55"><stop offset="0" stop-color="#f43f5e" stop-opacity="0.26"/><stop offset="1" stop-color="#f43f5e" stop-opacity="0"/></radialGradient>
      <linearGradient id="bills" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10b981"/><stop offset="1" stop-color="#059669"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <path d="${arcPath(180, 0)}" fill="none" stroke="#1c1c30" stroke-width="${trackW + 10}" stroke-linecap="round"/>
    <path d="${arcPath(180, 100)}" fill="none" stroke="#10b981" stroke-width="${trackW}" stroke-linecap="round"/>
    <path d="${arcPath(100, 55)}" fill="none" stroke="#fbbf24" stroke-width="${trackW}" stroke-linecap="round"/>
    <path d="${arcPath(55, 0)}" fill="none" stroke="#f43f5e" stroke-width="${trackW}" stroke-linecap="round"/>

    <line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="#e5e7eb" stroke-width="7" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="17" fill="#e5e7eb"/>
    <circle cx="${cx}" cy="${cy}" r="9" fill="#0a0a16"/>

    <text x="${cx}" y="${cy - 150}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">5&#8211;10%</text>
    <text x="${cx}" y="${cy - 108}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="600" fill="#9ca3af">of revenue at risk / cycle</text>

    <g transform="translate(860,150)">
      <rect width="220" height="30" rx="7" fill="url(#bills)"/>
      <rect y="16" width="220" height="30" rx="7" fill="url(#bills)" fill-opacity="0.88"/>
      <rect y="32" width="220" height="30" rx="7" fill="url(#bills)" fill-opacity="0.76"/>
      <circle cx="110" cy="24" r="9" fill="#ffffff" fill-opacity="0.5"/>
      <path d="M150 62 C 170 100, 180 150, 118 158" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 10"/>
    </g>
    ${dripSvg}

    <g transform="translate(150,110)">
      <rect width="52" height="52" rx="15" fill="#4f46e5"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for "What Is Dunning?": a Day 1 -> Day 3 -> Day 7 -> Day 14 envelope
// timeline, deepening in urgency color (indigo -> violet -> amber -> rose) along
// a dashed track, with a recovered check badge branching off the final envelope.
function dunningSequenceHeroSVG() {
  const steps = [
    { x: 190, day: 'DAY 1', color: '#6366f1' },
    { x: 460, day: 'DAY 3', color: '#8b5cf6' },
    { x: 730, day: 'DAY 7', color: '#f59e0b' },
    { x: 1000, day: 'DAY 14', color: '#fb7185' },
  ]
  const envW = 150
  const envH = 96
  const envY = 232
  const trackY = 460

  const envelopes = steps.map((s) => `
    <g transform="translate(${s.x - envW / 2},${envY})">
      <rect width="${envW}" height="${envH}" rx="18" fill="${s.color}"/>
      <path d="M0 20 L${envW / 2} ${envH / 2 + 6} L${envW} 20" fill="none" stroke="#0a0a16" stroke-opacity="0.35" stroke-width="6" stroke-linejoin="round"/>
    </g>
    <line x1="${s.x}" y1="${envY + envH}" x2="${s.x}" y2="${trackY}" stroke="${s.color}" stroke-opacity="0.55" stroke-width="3" stroke-dasharray="3 7"/>
    <circle cx="${s.x}" cy="${trackY}" r="9" fill="${s.color}"/>
    <text x="${s.x}" y="${envY + envH + 46}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="800" fill="#e5e7eb">${s.day}</text>
  `).join('')

  const arrows = [0, 1, 2].map((i) => {
    const x0 = steps[i].x + 9
    const x1 = steps[i + 1].x - 9
    const mid = (x0 + x1) / 2
    return `
      <line x1="${x0}" y1="${trackY}" x2="${x1}" y2="${trackY}" stroke="#ffffff" stroke-opacity="0.16" stroke-width="3"/>
      <path d="M${mid - 8} ${trackY - 7} L${mid + 8} ${trackY} L${mid - 8} ${trackY + 7} Z" fill="#ffffff" fill-opacity="0.32"/>
    `
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <radialGradient id="glow" cx="0.24" cy="0.28" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.86" cy="0.3" r="0.55"><stop offset="0" stop-color="#10b981" stop-opacity="0.3"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <line x1="150" y1="${trackY}" x2="1050" y2="${trackY}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
    ${arrows}
    ${envelopes}

    <!-- recovered badge, branching off the Day 14 envelope -->
    <path d="M${steps[3].x + 30} ${envY + 18} C 1080 150, 1110 150, 1112 150" fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 11"/>
    <g transform="translate(1112,150)">
      <circle r="58" fill="#10b981" stroke="#0a0a16" stroke-width="7"/>
      <path d="M-26 3 l16 18 l34 -40" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <g transform="translate(150,110)">
      <rect width="52" height="52" rx="15" fill="#6366f1"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for "How to Set Up a Dunning Email Sequence": a config-panel card showing
// the build checklist ticking off one step at a time (connect -> cadence ->
// branch -> timing -> test), plus a "SEQUENCE: LIVE" toggle switch — the
// practical setup story, distinct from the taxonomy/timeline heroes above.
function dunningSetupPanelHeroSVG() {
  const steps = [
    { label: 'Connect processor', state: 'done' },
    { label: 'Pick cadence', state: 'done' },
    { label: 'Branch by decline reason', state: 'done' },
    { label: 'Set send timing', state: 'active' },
    { label: 'Test &amp; go live', state: 'pending' },
  ]
  const panelX = 150, panelY = 132, panelW = 560, panelH = 372
  const rowH = 62, rowStartY = 96

  const rowSvg = steps.map((s, i) => {
    const y = rowStartY + i * rowH
    const dot =
      s.state === 'done'
        ? `<circle cx="26" cy="${y}" r="15" fill="#10b981"/>
           <path d="M${26 - 7} ${y} l5 6 l10 -12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
        : s.state === 'active'
        ? `<circle cx="26" cy="${y}" r="15" fill="#161628" stroke="#f59e0b" stroke-width="3"/>
           <circle cx="26" cy="${y}" r="6" fill="#f59e0b"/>`
        : `<circle cx="26" cy="${y}" r="15" fill="#161628" stroke="#33334d" stroke-width="3"/>`
    const textColor = s.state === 'pending' ? '#6b6b85' : '#e5e7eb'
    return `
      <g transform="translate(30,0)" font-family="Segoe UI, Arial, sans-serif">
        ${dot}
        <text x="54" y="${y + 6}" font-size="21" font-weight="700" fill="${textColor}">${s.label}</text>
      </g>`
  }).join('')

  const doneCount = steps.filter((s) => s.state === 'done').length
  const barW = panelW - 80
  const barFill = (doneCount / steps.length) * barW

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.26" cy="0.3" r="0.7"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.88" cy="0.72" r="0.55"><stop offset="0" stop-color="#10b981" stop-opacity="0.28"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <!-- config panel -->
    <g transform="translate(${panelX},${panelY})">
      <rect width="${panelW}" height="${panelH}" rx="26" fill="#12122a" stroke="#25254a" stroke-width="1.5"/>
      <text x="34" y="48" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2" fill="#8b8ba7">SEQUENCE SETUP</text>
      ${rowSvg}
      <!-- progress bar -->
      <rect x="34" y="${panelH - 44}" width="${barW}" height="10" rx="5" fill="#20203c"/>
      <rect x="34" y="${panelH - 44}" width="${barFill}" height="10" rx="5" fill="url(#brand)"/>
    </g>

    <!-- "sequence: live" toggle badge -->
    <g transform="translate(870,168)">
      <rect width="200" height="56" rx="28" fill="#0f2e22" stroke="#10b981" stroke-width="1.5"/>
      <circle cx="150" cy="28" r="20" fill="#10b981"/>
      <text x="24" y="35" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="700" fill="#6ee7b7">SEQUENCE: LIVE</text>
    </g>

    <!-- small processor chips feeding into the panel -->
    <g font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" fill="#c7d2fe">
      <rect x="870" y="256" width="120" height="38" rx="10" fill="#161628" stroke="#2a2a44"/>
      <text x="905" y="280">Stripe</text>
      <rect x="870" y="304" width="120" height="38" rx="10" fill="#161628" stroke="#2a2a44"/>
      <text x="898" y="328">Paddle</text>
      <rect x="870" y="352" width="150" height="38" rx="10" fill="#161628" stroke="#2a2a44"/>
      <text x="890" y="376">Chargebee</text>
    </g>

    <g transform="translate(150,64)">
      <rect width="52" height="52" rx="15" fill="url(#brand)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>
  </svg>`
}

// Hero for "Stripe Smart Retries Explained": a two-week calendar strip where
// most days are dim (no attempt) and a handful are lit as ML-picked retry
// attempts of rising confidence, ending in a green success burst — distinct
// from the envelope/timeline and config-panel heroes above, this one is about
// *timing intelligence*, not communication.
function smartRetriesCalendarHeroSVG() {
  const days = 14
  const attemptDays = { 2: 0.32, 5: 0.55, 9: 0.78, 13: 1 }
  const stripX = 120, stripY = 240, cellW = 68, cellGap = 6, cellH = 92

  const cells = Array.from({ length: days }, (_, i) => {
    const x = stripX + i * (cellW + cellGap)
    const isAttempt = i in attemptDays
    const conf = attemptDays[i] ?? 0
    const isFinal = i === 13
    const fill = isAttempt ? (isFinal ? '#10b981' : '#312e81') : '#14142c'
    const stroke = isAttempt ? (isFinal ? '#34d399' : '#6366f1') : '#26264a'
    const dotOpacity = isAttempt ? 0.35 + conf * 0.65 : 0
    return `
      <g>
        <rect x="${x}" y="${stripY}" width="${cellW}" height="${cellH}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="${isAttempt ? 2 : 1}"/>
        <text x="${x + cellW / 2}" y="${stripY + 24}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="${isAttempt ? '#e0e7ff' : '#4b4b6b'}">D${i + 1}</text>
        ${isAttempt ? `<circle cx="${x + cellW / 2}" cy="${stripY + 58}" r="16" fill="${isFinal ? '#10b981' : '#818cf8'}" opacity="${dotOpacity}"/>` : ''}
        ${isFinal ? `<path d="M${x + cellW / 2 - 8} ${stripY + 58} l6 7 l12 -15" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
      </g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.22" cy="0.28" r="0.65"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.92" cy="0.75" r="0.5"><stop offset="0" stop-color="#10b981" stop-opacity="0.3"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <g transform="translate(120,64)">
      <rect width="52" height="52" rx="15" fill="url(#brand)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>

    <g font-family="Segoe UI, Arial, sans-serif">
      <text x="120" y="160" font-size="30" font-weight="800" fill="#f1f5f9">Smart Retries</text>
      <text x="120" y="192" font-size="16" fill="#9ca3af">ML-timed re-attempts, not a fixed daily interval</text>
    </g>

    <!-- "not smart" reference row, faint, above the strip -->
    <g font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#5a5a7a">
      <text x="120" y="222">Fixed interval: retries every 24h regardless of outcome</text>
    </g>

    ${cells}

    <!-- ML chip -->
    <g transform="translate(945,60)">
      <rect width="135" height="46" rx="23" fill="#161628" stroke="#3730a3" stroke-width="1.5"/>
      <circle cx="26" cy="23" r="8" fill="#a5b4fc"/>
      <circle cx="44" cy="23" r="8" fill="#818cf8" opacity="0.7"/>
      <text x="62" y="29" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" fill="#c7d2fe">ML timing</text>
    </g>
  </svg>`
}

// Hero for "SCA and 3D Secure Explained": a phone showing a 3D Secure challenge
// prompt (bank push notification) next to a locked/authenticated card, with an
// EU-flag-toned accent — distinct from the calendar/panel/timeline heroes above,
// this one is about identity verification at the moment of charge, not timing
// or communication cadence.
function scaAuthChallengeHeroSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <linearGradient id="eu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#1e40af"/></linearGradient>
      <radialGradient id="glow" cx="0.24" cy="0.3" r="0.65"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.86" cy="0.7" r="0.55"><stop offset="0" stop-color="#1e40af" stop-opacity="0.35"/><stop offset="1" stop-color="#1e40af" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <g transform="translate(150,64)">
      <rect width="52" height="52" rx="15" fill="url(#brand)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>

    <!-- EU stars ring, small badge top-right -->
    <g transform="translate(970,80)">
      <circle r="42" fill="url(#eu)" stroke="#3b82f6" stroke-width="1.5"/>
      ${Array.from({ length: 12 }, (_, i) => {
        const ang = (i / 12) * Math.PI * 2 - Math.PI / 2
        const r = 27
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#fde047"/>`
      }).join('')}
      <text x="0" y="65" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="#93c5fd">PSD2 / SCA</text>
    </g>

    <!-- phone with 3DS challenge -->
    <g transform="translate(150,150)">
      <rect width="230" height="360" rx="30" fill="#12122a" stroke="#2a2a4d" stroke-width="2"/>
      <rect x="14" y="14" width="202" height="332" rx="18" fill="#0d0d20"/>
      <text x="115" y="60" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" fill="#8b8ba7">CONFIRM PAYMENT</text>
      <rect x="34" y="90" width="162" height="70" rx="14" fill="#161628" stroke="#33334d"/>
      <text x="115" y="118" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#c7d2fe">Revova Subscription</text>
      <text x="115" y="142" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" fill="#fff">€49.00</text>
      <circle cx="115" cy="220" r="34" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
      <path d="M100 220 a15 15 0 1 1 30 0 a15 15 0 1 1 -30 0" fill="none" stroke="#fbbf24" stroke-width="3"/>
      <text x="115" y="226" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" fill="#fbbf24">?</text>
      <rect x="34" y="272" width="162" height="42" rx="21" fill="url(#brand)"/>
      <text x="115" y="298" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" fill="#fff">Approve in app</text>
    </g>

    <!-- lock + card, "authenticated" side -->
    <g transform="translate(560,190)">
      <rect width="300" height="188" rx="20" fill="#14142c" stroke="#26264a" stroke-width="1.5"/>
      <rect x="24" y="24" width="252" height="60" rx="10" fill="#1e1b4b"/>
      <circle cx="52" cy="54" r="14" fill="#6366f1"/>
      <text x="80" y="50" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#c7d2fe">Card ending 4242</text>
      <text x="80" y="68" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#818cf8">Renewal — Day 0</text>
      <g transform="translate(24,108)">
        <circle cx="18" cy="18" r="18" fill="#0f2e22" stroke="#10b981" stroke-width="2"/>
        <path d="M11 18 l5 6 l11 -14" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="46" y="14" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="#6ee7b7">Authenticated</text>
        <text x="46" y="32" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#9ca3af">2 of 3 SCA factors confirmed</text>
      </g>
    </g>
    <g transform="translate(560,406)">
      <rect width="300" height="70" rx="16" fill="#2a1a12" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="20" y="30" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="#fbbf24">authentication_required</text>
      <text x="20" y="52" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#d1a35c">No customer present to complete challenge</text>
    </g>
  </svg>`
}

// Hero for "Historical Payment Recovery Guide": a 12-month backward timeline of
// invoice-folder icons, oldest (dead, dim/grey with an x) on the left fading to
// newest (recoverable, indigo, lit) on the right, with a magnifying-glass "scan"
// sweeping the recent months and a found-count badge — distinct from the
// forward-looking calendar/panel/gauge heroes above, this one is about looking
// backward through already-closed history, not timing a future retry.
function historicalScanHeroSVG() {
  const months = 12
  const stripX = 110, stripY = 250, cellW = 78, cellGap = 8, cellH = 100
  const deadCount = 6 // oldest 6 months: dead, unrecoverable
  const foundCount = 4 // next 4 months: backlog, found by the scan
  // last 2 months: still fresh / already inside a live sequence

  const cells = Array.from({ length: months }, (_, i) => {
    const x = stripX + i * (cellW + cellGap)
    const isDead = i < deadCount
    const isFound = i >= deadCount && i < deadCount + foundCount
    const isFresh = i >= deadCount + foundCount
    const fill = isDead ? '#14142c' : isFound ? '#1e1b4b' : '#0f2e22'
    const stroke = isDead ? '#26264a' : isFound ? '#6366f1' : '#10b981'
    const opacity = isDead ? 0.55 : 1
    return `
      <g opacity="${opacity}">
        <rect x="${x}" y="${stripY}" width="${cellW}" height="${cellH}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="${isDead ? 1 : 2}"/>
        <path d="M${x + 14} ${stripY + 16} h${cellW - 28} v10 h-8 l-6 -8 h-${cellW - 44} z" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="0.8"/>
        ${isDead
          ? `<path d="M${x + cellW / 2 - 10} ${stripY + 58} l20 20 M${x + cellW / 2 + 10} ${stripY + 58} l-20 20" stroke="#52526b" stroke-width="3" stroke-linecap="round"/>`
          : isFound
            ? `<circle cx="${x + cellW / 2}" cy="${stripY + 68}" r="15" fill="#312e81" stroke="#818cf8" stroke-width="2"/><text x="${x + cellW / 2}" y="${stripY + 73}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" fill="#c7d2fe">$</text>`
            : `<path d="M${x + cellW / 2 - 9} ${stripY + 68} l6 7 l12 -15" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`}
        <text x="${x + cellW / 2}" y="${stripY + cellH - 12}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="700" fill="${isDead ? '#4b4b6b' : '#9ca3af'}">${i === 0 ? '12mo' : i === months - 1 ? 'Now' : ''}</text>
      </g>`
  }).join('')

  const scanCenterIdx = deadCount + foundCount / 2 - 0.5
  const scanX = stripX + scanCenterIdx * (cellW + cellGap) + cellW / 2

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.2" cy="0.3" r="0.6"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.85" cy="0.65" r="0.5"><stop offset="0" stop-color="#10b981" stop-opacity="0.28"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
      <radialGradient id="scanGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#818cf8" stop-opacity="0.5"/><stop offset="1" stop-color="#818cf8" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <g transform="translate(110,58)">
      <rect width="52" height="52" rx="15" fill="url(#brand)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>

    <g font-family="Segoe UI, Arial, sans-serif">
      <text x="110" y="150" font-size="30" font-weight="800" fill="#f1f5f9">Lost Revenue Finder</text>
      <text x="110" y="182" font-size="16" fill="#9ca3af">Scanning already-closed invoices, oldest to newest</text>
    </g>

    <!-- ruler above the strip -->
    <g font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#5a5a7a">
      <line x1="${stripX}" y1="222" x2="${stripX + months * cellW + (months - 1) * cellGap}" y2="222" stroke="#26264a" stroke-width="1.5"/>
      <text x="${stripX}" y="212">12 months ago</text>
      <text x="${stripX + months * cellW + (months - 1) * cellGap}" y="212" text-anchor="end">Today</text>
    </g>

    ${cells}

    <!-- magnifying glass scanning the "found" band -->
    <g transform="translate(${scanX.toFixed(1)},${stripY - 18})">
      <circle r="70" fill="url(#scanGlow)"/>
      <circle r="26" fill="none" stroke="#c7d2fe" stroke-width="4"/>
      <line x1="18" y1="18" x2="40" y2="40" stroke="#c7d2fe" stroke-width="5" stroke-linecap="round"/>
    </g>

    <!-- found-count badge -->
    <g transform="translate(945,60)">
      <rect width="145" height="46" rx="23" fill="#161628" stroke="#3730a3" stroke-width="1.5"/>
      <circle cx="26" cy="23" r="8" fill="#a5b4fc"/>
      <text x="42" y="29" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="700" fill="#c7d2fe">Backlog found</text>
    </g>
  </svg>`
}

// Hero for "Churn Buster Alternatives": a ranked leaderboard of 6 tool rows,
// Revova highlighted at #1 in the brand gradient with a "flat" price chip, the
// rest dimmed with a mix of "scales" and "flat" tags — distinct from the
// crossed-out-price-then-arrow concept used for the Churnkey alternatives hero,
// this one is about ranking a field of options, not a single before/after swap.
function churnBusterAlternativesHeroSVG() {
  const rows = [
    { rank: 1, name: 'Revova', tag: 'flat $29–79', highlight: true },
    { rank: 2, name: 'Churn Buster', tag: 'scales w/ volume' },
    { rank: 3, name: 'Churnkey', tag: '~$199+/mo' },
    { rank: 4, name: 'Stunning', tag: '~$100/mo' },
    { rank: 5, name: 'Baremetrics Recover', tag: 'add-on' },
    { rank: 6, name: 'Paddle Retain', tag: '% of recovered' },
  ]
  const rowH = 66, rowGap = 10, startY = 150, rowX = 440, rowW = 620

  const rowsMarkup = rows.map((r, i) => {
    const y = startY + i * (rowH + rowGap)
    const fill = r.highlight ? 'url(#brand)' : '#14142c'
    const stroke = r.highlight ? '#818cf8' : '#26264a'
    const nameColor = r.highlight ? '#ffffff' : '#c7d2fe'
    const tagColor = r.highlight ? '#e0e7ff' : '#6b6b85'
    const rankFill = r.highlight ? '#ffffff' : '#26264a'
    const rankColor = r.highlight ? '#4f46e5' : '#8b8ba7'
    return `
      <g>
        <rect x="${rowX}" y="${y}" width="${rowW}" height="${rowH}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="${r.highlight ? 2 : 1}"/>
        <circle cx="${rowX + 40}" cy="${y + rowH / 2}" r="20" fill="${rankFill}"/>
        <text x="${rowX + 40}" y="${y + rowH / 2 + 6}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="800" fill="${rankColor}">${r.rank}</text>
        <text x="${rowX + 78}" y="${y + rowH / 2 - 4}" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="700" fill="${nameColor}">${r.name}</text>
        <text x="${rowX + 78}" y="${y + rowH / 2 + 18}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="${tagColor}">${r.tag}</text>
        ${r.highlight ? `<g transform="translate(${rowX + rowW - 56},${y + rowH / 2 - 14})"><rect width="40" height="28" rx="14" fill="#10b981"/><text x="20" y="19" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="800" fill="#fff">#1</text></g>` : ''}
      </g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.15" cy="0.3" r="0.6"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.85" cy="0.75" r="0.5"><stop offset="0" stop-color="#10b981" stop-opacity="0.22"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <g transform="translate(110,58)">
      <rect width="52" height="52" rx="15" fill="url(#brand)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>

    <g font-family="Segoe UI, Arial, sans-serif">
      <text x="110" y="150" font-size="30" font-weight="800" fill="#f1f5f9">Churn Buster</text>
      <text x="110" y="182" font-size="16" fill="#9ca3af">alternatives, ranked</text>
    </g>

    <g transform="translate(110,220)" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#5a5a7a">
      <text x="0" y="0">6 tools compared</text>
      <text x="0" y="26">by price model,</text>
      <text x="0" y="52">processor coverage,</text>
      <text x="0" y="78">and historical recovery</text>
    </g>

    ${rowsMarkup}
  </svg>`
}

// Hero for "Reduce Annual Plan Renewal Failures": a row of 12 small card icons
// tracing one calendar year, fading from solid indigo (fresh) to washed-out grey
// (decayed) as months pass, ending in one large, single "$" charge burst hitting
// the last, faded card with a crack/decline mark — versus a thin row of 12 tiny
// green monthly charge dots underneath that all stay solid the whole way across.
// The size contrast (one big fragile hit vs many small resilient ones) is the
// whole story — distinct from every prior calendar/timeline/gauge hero used so far.
function annualCardDecayHeroSVG() {
  const n = 12
  const startX = 150
  const endX = 1010
  const stepX = (endX - startX) / (n - 1)
  const cardY = 150
  const cardW = 46
  const cardH = 30

  const cards = []
  for (let i = 0; i < n; i++) {
    const x = startX + i * stepX
    const t = i / (n - 1) // 0 = fresh, 1 = decayed
    const fill = i < n - 1 ? `rgba(99,102,241,${(1 - t * 0.85).toFixed(2)})` : '#3b1d2e'
    const stroke = i < n - 1 ? `rgba(129,140,248,${(1 - t * 0.6).toFixed(2)})` : '#f43f5e'
    cards.push(
      `<rect x="${x - cardW / 2}" y="${cardY - cardH / 2}" width="${cardW}" height="${cardH}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="${i === n - 1 ? '4 3' : '0'}"/>`,
    )
    cards.push(
      `<rect x="${x - cardW / 2}" y="${cardY - cardH / 2 + 7}" width="${cardW}" height="5" fill="${i < n - 1 ? `rgba(199,210,254,${(1 - t * 0.7).toFixed(2)})` : '#f43f5e'}" opacity="${i < n - 1 ? '0.8' : '0.6'}"/>`,
    )
  }

  // large single annual charge burst hitting the last (decayed) card
  const lastX = startX + (n - 1) * stepX
  const burstY = cardY - 110

  // small monthly dots row underneath, all solid/successful
  const dotY = 340
  const dots = []
  for (let i = 0; i < n; i++) {
    const x = startX + i * stepX
    dots.push(`<circle cx="${x}" cy="${dotY}" r="7" fill="#10b981"/>`)
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a16"/><stop offset="1" stop-color="#0f0f22"/></linearGradient>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
      <radialGradient id="glow" cx="0.15" cy="0.2" r="0.6"><stop offset="0" stop-color="#4f46e5" stop-opacity="0.4"/><stop offset="1" stop-color="#4f46e5" stop-opacity="0"/></radialGradient>
      <radialGradient id="glow2" cx="0.9" cy="0.25" r="0.5"><stop offset="0" stop-color="#f43f5e" stop-opacity="0.28"/><stop offset="1" stop-color="#f43f5e" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#glow2)"/>

    <g transform="translate(110,54)">
      <rect width="52" height="52" rx="15" fill="url(#brand)"/>
      <text x="26" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff" text-anchor="middle">R</text>
    </g>

    <g font-family="Segoe UI, Arial, sans-serif" fill="#5a5a7a" font-size="13">
      <text x="150" y="112">Mo 1</text>
      <text x="${lastX - 20}" y="112" fill="#f43f5e">Mo 12</text>
    </g>

    <!-- one big fragile annual charge, aimed at the decayed card -->
    <g transform="translate(${lastX},${burstY})">
      <circle r="46" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3 5" opacity="0.6"/>
      <circle r="34" fill="#3b1d2e" stroke="#f43f5e" stroke-width="2"/>
      <text x="0" y="9" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="800" fill="#f87171">$</text>
      <text x="0" y="66" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="700" fill="#f87171">1 charge / year</text>
    </g>
    <line x1="${lastX}" y1="${burstY + 50}" x2="${lastX}" y2="${cardY - cardH / 2 - 6}" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>

    ${cards.join('\n    ')}

    <line x1="${startX - 30}" y1="${dotY}" x2="${endX + 30}" y2="${dotY}" stroke="#26264a" stroke-width="1.5"/>
    ${dots.join('\n    ')}
    <text x="${endX + 60}" y="${dotY + 5}" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#6ee7b7" font-weight="700">12 charges / year</text>

    <g font-family="Segoe UI, Arial, sans-serif">
      <text x="150" y="440" font-size="26" font-weight="800" fill="#f1f5f9">One card. Twelve months. One shot.</text>
      <text x="150" y="472" font-size="15" fill="#9ca3af">Annual renewals ride on a card that had a full year to change — pre-dunning catches it before the charge fires.</text>
    </g>
  </svg>`
}

const targets = [
  { slug: 'reduce-annual-plan-renewal-failures', svg: annualCardDecayHeroSVG() },
  { slug: 'churn-buster-alternatives', svg: churnBusterAlternativesHeroSVG() },
  { slug: 'historical-payment-recovery-guide', svg: historicalScanHeroSVG() },
  { slug: 'sca-3d-secure-explained', svg: scaAuthChallengeHeroSVG() },
  { slug: 'stripe-smart-retries-explained', svg: smartRetriesCalendarHeroSVG() },
  { slug: 'dunning-email-sequence-setup-guide', svg: dunningSetupPanelHeroSVG() },
  { slug: 'what-is-dunning', svg: dunningSequenceHeroSVG() },
  { slug: 'how-much-revenue-lost-to-failed-payments', svg: revenueAtRiskGaugeHeroSVG() },
  { slug: 'paddle-vs-stripe-subscriptions', svg: paddleVsStripeHeroSVG() },
  { slug: 'revova-vs-competitors-2026', svg: revovaVsHeroSVG() },
  { slug: 'revova-review-2026', svg: revovaReviewHeroSVG() },
  { slug: 'best-payment-recovery-dunning-tools-2026', svg: recoveryHeroSVG() },
  { slug: 'how-to-recover-failed-stripe-payments', svg: stripeRecoveryHeroSVG() },
  { slug: 'what-is-involuntary-churn', svg: involuntaryChurnHeroSVG() },
  { slug: 'dunning-email-examples-templates', svg: dunningEmailHeroSVG() },
  { slug: 'stripe-decline-codes-explained', svg: declineCodesHeroSVG() },
  { slug: 'churnkey-alternatives', svg: churnkeyAlternativesHeroSVG() },
  { slug: 'how-to-reduce-saas-churn', svg: reduceChurnHeroSVG() },
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
