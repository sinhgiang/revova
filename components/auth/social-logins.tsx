'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Provider } from '@supabase/supabase-js'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#181717" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="17" height="17" viewBox="0 0 21 21" aria-hidden="true">
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
)

const PROVIDERS: { id: Provider; name: string; Icon: () => React.ReactElement }[] = [
  { id: 'google', name: 'Google', Icon: GoogleIcon },
  { id: 'github', name: 'GitHub', Icon: GitHubIcon },
  { id: 'azure', name: 'Microsoft', Icon: MicrosoftIcon },
]

// Social sign-in buttons (Google, GitHub, Microsoft) via Supabase OAuth. After
// auth the user lands on /auth/callback which forwards to the dashboard.
export function SocialLogins({ verb = 'Continue' }: { verb?: string }) {
  const [busy, setBusy] = useState<Provider | null>(null)
  const supabase = createClient()

  async function handle(provider: Provider) {
    setBusy(provider)
    const options: { redirectTo: string; scopes?: string } = {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    }
    if (provider === 'azure') options.scopes = 'email'
    const { error } = await supabase.auth.signInWithOAuth({ provider, options })
    if (error) setBusy(null) // on success the browser redirects away
  }

  return (
    <div className="space-y-2.5">
      {PROVIDERS.map(({ id, name, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handle(id)}
          disabled={busy !== null}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {busy === id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon />}
          {verb} with {name}
        </button>
      ))}
    </div>
  )
}
