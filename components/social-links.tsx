// Social proof in the footer — real Facebook page + YouTube channel, so the
// site reads as a real business rather than a solo landing page. Icons use
// currentColor so they inherit whatever text/hover color the footer around
// them already uses (text-gray-400 hover:text-gray-600 everywhere today).
export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-4 ${className}`}>
      <a
        href="https://www.facebook.com/profile.php?id=61593358812209"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Revova on Facebook"
        className="hover:text-gray-600"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.351C0 23.41.59 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.41 24 24 23.41 24 22.676V1.325C24 .59 23.41 0 22.675 0z" />
        </svg>
      </a>
      <a
        href="https://www.youtube.com/@revova-x7q"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Revova on YouTube"
        className="hover:text-gray-600"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.524A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.107 2.117c1.886.524 9.391.524 9.391.524s7.505 0 9.391-.524a2.994 2.994 0 0 0 2.107-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z" />
        </svg>
      </a>
    </span>
  )
}
