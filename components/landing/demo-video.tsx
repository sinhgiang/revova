'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

// Click-to-play YouTube facade: shows only the thumbnail until the visitor
// clicks, so the page stays fast and no YouTube cookies load before consent.
// Uses youtube-nocookie.com for the actual embed.
export function DemoVideo({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-gray-200 shadow-2xl bg-[#060612]">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            onError={(e) => {
              e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
            }}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform group-hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-indigo-600 text-indigo-600" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
