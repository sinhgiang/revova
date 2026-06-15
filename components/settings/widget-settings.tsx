'use client'

import { useState } from 'react'
import { Copy, CheckCircle, Code2 } from 'lucide-react'

interface Props {
  userId: string
  appUrl: string
}

export function WidgetSettings({ userId, appUrl }: Props) {
  const [copied, setCopied] = useState(false)

  const embedUrl = `${appUrl}/api/widget/${userId}/embed`
  const snippet = `<!-- Revova In-App Banner — paste before </body> -->
<script>
  window.REVOVA_CUSTOMER_EMAIL = '{{ current_user.email }}';
</script>
<script src="${embedUrl}" async></script>`

  function copySnippet() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Code2 className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">In-App Payment Banner</h2>
          <p className="text-xs text-gray-500">Auto-shows a recovery banner to customers with failed payments</p>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Add this to your website or web app. When a logged-in customer has a failed payment, they&apos;ll see a red banner with a direct link to update their card.
      </p>

      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap break-all">
          {snippet}
        </pre>
        <button
          onClick={copySnippet}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors bg-gray-800 rounded p-1.5"
        >
          {copied
            ? <CheckCircle className="w-4 h-4 text-emerald-400" />
            : <Copy className="w-4 h-4" />
          }
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Replace <code className="bg-gray-100 px-1 rounded text-gray-600">{'{{ current_user.email }}'}</code> with the actual logged-in user&apos;s email from your auth system (e.g. <code className="bg-gray-100 px-1 rounded text-gray-600">session.user.email</code>).
      </p>
    </div>
  )
}
