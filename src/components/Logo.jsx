import { media } from '../data/media'

/**
 * Brand logo slot. The official EVERGROVE logo was not in the project folder,
 * so until /public/media/brand/evergrove-logo.svg is supplied (and set in the
 * media manifest), a neutral typographic wordmark stands in. It is a stand-in
 * only — swap in the real file rather than refining this.
 */
export default function Logo({ className = '' }) {
  if (media.logo.src) {
    return <img src={media.logo.src} alt="EVERGROVE" className={`logo logo-img ${className}`} />
  }
  return (
    <span className={`logo logo-word ${className}`} aria-label="EVERGROVE">
      EVERGROVE
    </span>
  )
}
