import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { MousePointer2 } from 'lucide-react'
import { gsap, useGSAP } from '../lib/motion'
import { Eyebrow } from '../components/Reveal'
import Cta from '../components/Cta'

const BotanicalScene = lazy(() => import('../three/BotanicalScene'))

const chapters = [
  {
    k: 'Leaf architecture',
    t: 'Selected for form.',
    b: 'Every plant we supply is chosen individually — structure, health and character — for the space it will live in.',
  },
  {
    k: 'Grown to thrive',
    t: 'Conditioned before it arrives.',
    b: 'Our greenery is grown, hardened and acclimatised so it establishes quickly once installed.',
  },
  {
    k: 'Season after season',
    t: 'Cared for long after.',
    b: 'Feeding, pruning, irrigation and restoration from the same team that planted it.',
  },
]

/**
 * 3D Botanical Experience — pinned for three chapters. Scroll orbits the
 * camera and turns the specimen; the cursor tilts it.
 */
export default function Botanical() {
  const root = useRef(null)
  const progress = useRef(0)
  const [chapter, setChapter] = useState(0)
  const [inView, setInView] = useState(false)
  const [mobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '200px 0px' })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: '.bot-pin',
            start: 'top top',
            end: '+=260%',
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              progress.current = self.progress
              setChapter(Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length)))
            },
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="experience" ref={root} className="botanical section-forest" aria-label="3D botanical experience">
      <div className="bot-pin">
        <div className="bot-glow" aria-hidden="true" />
        {inView && (
          <Suspense fallback={<div className="bot-loading">Growing specimen…</div>}>
            <BotanicalScene progress={progress} active={inView} mobile={mobile} />
          </Suspense>
        )}

        <div className="bot-ui container">
          <div className="bot-top">
            <Eyebrow light>06 — The Botanical Experience</Eyebrow>
            <p className="bot-hint">
              <MousePointer2 size={14} /> Move to tilt · Scroll to orbit
            </p>
          </div>

          <div className="bot-chapters">
            {chapters.map((c, i) => (
              <div key={c.k} className={`bot-chapter ${i === chapter ? 'is-active' : ''}`} aria-hidden={i !== chapter}>
                <p className="bot-k">
                  <span>0{i + 1}</span> {c.k}
                </p>
                <h2 className="display">{c.t}</h2>
                <p className="bot-b">{c.b}</p>
              </div>
            ))}
          </div>

          <div className="bot-bottom">
            <ol className="bot-dots" aria-hidden="true">
              {chapters.map((c, i) => (
                <li key={c.k} className={i <= chapter ? 'is-on' : ''} />
              ))}
            </ol>
            <Cta cta={{ label: 'Explore Grass & Turf', href: '#greenery' }} variant="ghost-light" />
          </div>
        </div>
      </div>
    </section>
  )
}
