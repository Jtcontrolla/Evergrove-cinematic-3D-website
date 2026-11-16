import { ArrowUpRight } from 'lucide-react'
import { useEnquiry } from '../lib/enquiry'
import { useSmoothScroll } from '../lib/motion'

/**
 * One CTA component for the whole site.
 *  - { href: '#section' }      -> smooth-scrolls to that section
 *  - { enquiry: 'landscaping' } -> opens the consultation drawer pre-set
 */
export default function Cta({ cta, variant = 'solid', subject = '', className = '', icon = true, children }) {
  const { openEnquiry } = useEnquiry()
  const { scrollTo } = useSmoothScroll()
  const label = children || cta.label

  const onClick = (e) => {
    if (cta.enquiry) {
      e.preventDefault()
      openEnquiry(cta.enquiry, subject)
    } else if (cta.href?.startsWith('#')) {
      e.preventDefault()
      scrollTo(cta.href)
    }
  }

  return (
    <a href={cta.href || '#contact'} onClick={onClick} className={`btn btn-${variant} ${className}`}>
      <span className="btn-label">{label}</span>
      {icon && (
        <span className="btn-icon" aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={1.75} />
        </span>
      )}
    </a>
  )
}
