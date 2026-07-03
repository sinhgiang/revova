// Best-effort guards against SSRF (user-supplied hosts/URLs) and open redirects.
// These are literal-value checks (no DNS resolution), so they block the obvious
// internal-network targets and rebinding-by-literal-IP without adding latency.

const PRIVATE_HOST_PATTERNS: RegExp[] = [
  /^localhost$/i,
  /\.localhost$/i,
  /^127\./, // 127.0.0.0/8
  /^0\./, // 0.0.0.0/8
  /^10\./, // 10.0.0.0/8
  /^169\.254\./, // link-local incl. cloud metadata 169.254.169.254
  /^192\.168\./, // 192.168.0.0/16
  /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
  /^::1$/, // IPv6 loopback
  /^\[::1\]$/,
  /^fc00:/i, /^fd00:/i, // IPv6 unique-local
  /^fe80:/i, // IPv6 link-local
  /^metadata\.google\.internal$/i,
]

function isPrivateHost(host: string): boolean {
  const h = host.trim().toLowerCase().replace(/^\[|\]$/g, '')
  if (!h) return true
  return PRIVATE_HOST_PATTERNS.some((re) => re.test(h) || re.test(host.trim().toLowerCase()))
}

// Returns null if the URL is safe to fetch server-side, or an error string if it
// points at a private/internal/non-http(s) destination.
export function checkOutboundUrl(raw: string): string | null {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return 'Invalid URL'
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'Only http(s) URLs are allowed'
  }
  if (isPrivateHost(url.hostname)) {
    return 'URL points to a private or internal address'
  }
  return null
}

// Same private-host check for a bare host string (e.g. an SMTP host).
export function checkOutboundHost(host: string): string | null {
  if (!host) return 'Missing host'
  if (isPrivateHost(host)) {
    return 'Host points to a private or internal address'
  }
  return null
}

// Validate a redirect target from a query param. Only same-origin app URLs and an
// explicit allowlist of trusted external hosts are permitted; anything else falls
// back to the app home so the endpoint can't be used as an open-redirect for
// phishing. `*.stripe.com` covers hosted invoice / billing-portal links.
const ALLOWED_REDIRECT_SUFFIXES = ['stripe.com']

export function safeRedirectTarget(raw: string | null, appUrl: string): string {
  const fallback = appUrl
  if (!raw) return fallback
  let url: URL
  try {
    url = new URL(raw, appUrl) // resolves relative paths against the app origin
  } catch {
    return fallback
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return fallback

  let appHost = ''
  try {
    appHost = new URL(appUrl).hostname.toLowerCase()
  } catch {
    /* ignore */
  }
  const host = url.hostname.toLowerCase()
  const allowed =
    host === appHost ||
    ALLOWED_REDIRECT_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`))

  return allowed ? url.toString() : fallback
}
