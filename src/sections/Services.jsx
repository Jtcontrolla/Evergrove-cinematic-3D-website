import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { gsap, useGSAP } from '../lib/motion'
import { services } from '../data/content'
import Media from '../components/Media'
import Cta from '../components/Cta'
import { Eyebrow, FadeUp, RevealLines } from '../components/Reveal'

/**
 * What We Do — a minimal editorial index. On desktop, hovering a row shows a
 * floating image that follows the cursor; rows expand for detail + CTA.
 */
export default function Services() {
  const root = useRef(null)
  const [hover, setHover] = useState(null)
  const [open, setOpen] = useState(0)
  const preview = useRef(null)

  useGSAP(
    () => {
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (!fine) return
      const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' })
      const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' })
      const move = (e) => {
        const r = root.current.getBoundingClientRect()
        xTo(e.clientX - r.left)
        yTo(e.clientY - r.top)
      }
      root.current.addEventListener('pointermove', move)
      return () => root.current?.removeEventListener('pointermove', move)
    },
    { scope: root },
  )

  return (
    <section id="services" ref={root} className="services section-ivory">
      <div className="container">
        <div className="svc-head">
          <Eyebrow>07 — What We Do</Eyebrow>
          <RevealLines className="display" lines={['Six disciplines,', <em key="e">one team.</em>]} />
        </div>

        <FadeUp as="ol" className="svc-list" onMouseLeave={() => setHover(null)}>
          {services.map((s, i) => (
            <li
              key={s.n}
              className={`svc-row ${open === i ? 'is-open' : ''}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <button className="svc-trigger" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="svc-n">{s.n}</span>
                <span className="svc-title">{s.title}</span>
                <span className="svc-plus" aria-hidden="true">
                  <Plus size={20} strokeWidth={1.5} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    className="svc-detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="svc-detail-inner">
                      <Media item={s.media} className="svc-inline-media" sizes="(max-width: 700px) 92vw, 160px" />
                      <p>{s.body}</p>
                      <Cta cta={s.cta} variant="dark" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </FadeUp>
      </div>

      <div ref={preview} className={`svc-preview ${hover !== null ? 'is-visible' : ''}`} aria-hidden="true">
        {services.map((s, i) => (
          <div key={s.n} className={`svc-preview-img ${hover === i ? 'is-active' : ''}`}>
            <Media item={s.media} alt="" sizes="300px" showTag={false} />
          </div>
        ))}
      </div>
    </section>
  )
}
