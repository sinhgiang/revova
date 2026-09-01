import Script from 'next/script'

// Google's "Preferred Sources" button (Search Central, announced Aug 20, 2026).
// One click lets a reader mark revova.io as a preferred source, so it's shown
// more often to them in Top Stories, AI Overviews, and AI Mode going forward.
// Placed right after the article body, per Google's own placement guidance:
// "the best place is just after someone has read something that helped them."
// Docs: https://developers.google.com/search/docs/appearance/preferred-sources
export function PreferredSourceButton() {
  // `google-add-preferred-source-btn` is a bare custom attribute (not a
  // `data-*` one), so it's passed via spread to sidestep the JSX intrinsic
  // typing rather than declaring it as a known div prop.
  const buttonAttrs = { 'google-add-preferred-source-btn': '' } as Record<string, string>

  return (
    <div className="my-10 flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
      <Script
        id="google-preferred-source-sdk"
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="afterInteractive"
      />
      <p className="text-sm text-gray-500">Found this useful? Tell Google you'd like to see more from us.</p>
      <div {...buttonAttrs} data-theme="light" />
    </div>
  )
}
