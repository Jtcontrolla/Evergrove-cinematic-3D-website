import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEnquiry } from '../lib/enquiry'
import { useSmoothScroll } from '../lib/motion'
import { enquiryTypes } from '../data/content'
import EnquiryForm from './EnquiryForm'

/** Side drawer opened by any enquiry CTA. Focus-trapped, Esc to close. */
export default function EnquiryDrawer() {
  const { open, type, subject, closeEnquiry } = useEnquiry()
  const { lenis } = useSmoothScroll()
  const panel = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement
    lenis?.stop()
    document.documentElement.classList.add('no-scroll')
    const t = setTimeout(() => panel.current?.querySelector('input, select, textarea, button')?.focus(), 450)

    const onKey = (e) => {
      if (e.key === 'Escape') closeEnquiry()
      if (e.key === 'Tab' && panel.current) {
        const els = panel.current.querySelectorAll('button, input, select, textarea, a[href]')
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      document.documentElement.classList.remove('no-scroll')
      lastFocus.current?.focus?.()
    }
  }, [open, lenis, closeEnquiry])

  return (
    <AnimatePresence>
      {open && (
        <div className="drawer-root">
          <motion.div
            className="drawer-backdrop"
            onClick={closeEnquiry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            ref={panel}
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="drawer-head">
              <p className="eyebrow">
                <span className="eyebrow-dot" />
                Consultation &amp; Enquiries
              </p>
              <button className="drawer-close" onClick={closeEnquiry} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <h2 id="drawer-title" className="display-sm">
              {enquiryTypes[type]?.title}
              {subject && <em> — {subject}</em>}
            </h2>
            <EnquiryForm type={type} subject={subject} onDone={closeEnquiry} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
