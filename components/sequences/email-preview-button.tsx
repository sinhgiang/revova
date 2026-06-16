'use client'

import { useState } from 'react'
import { Eye, X, Loader2 } from 'lucide-react'

interface EmailPreview {
  subject: string
  previewText: string
  body: string
}

interface Props {
  sequence: number
}

export function EmailPreviewButton({ sequence }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<EmailPreview | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleOpen() {
    setOpen(true)
    if (preview) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/ai/preview-email?sequence=${sequence}`)
      if (!res.ok) throw new Error('Failed to generate preview')
      const data = await res.json()
      setPreview(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
      >
        <Eye className="w-3.5 h-3.5" />
        Preview
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-900">Email {sequence} Preview</h3>
                <p className="text-xs text-gray-400 mt-0.5">AI-generated sample for your business</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-6">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  <p className="text-sm text-gray-500">Generating with AI…</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-sm text-red-500">{error}</p>
                  <button
                    onClick={() => { setPreview(null); handleOpen() }}
                    className="mt-3 text-xs text-indigo-600 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {preview && !loading && (
                <div className="space-y-4">
                  {/* Email client mockup */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Email header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 space-y-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-400 w-14 flex-shrink-0">From</span>
                        <span className="text-xs text-gray-600">noreply@revova.io</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-400 w-14 flex-shrink-0">To</span>
                        <span className="text-xs text-gray-600">alex@example.com</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-400 w-14 flex-shrink-0">Subject</span>
                        <span className="text-xs font-semibold text-gray-900">{preview.subject}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-gray-400 w-14 flex-shrink-0">Preview</span>
                        <span className="text-xs text-gray-400 italic">{preview.previewText}</span>
                      </div>
                    </div>
                    {/* Email body */}
                    <div className="px-5 py-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {preview.body}
                      </pre>
                    </div>
                  </div>

                  <p className="text-xs text-center text-gray-400">
                    Sample generated with AI using your business name. Actual emails are personalized per customer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
