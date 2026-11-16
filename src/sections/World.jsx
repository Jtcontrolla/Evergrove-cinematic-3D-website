import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { media } from '../data/media'
import Media from '../components/Media'
import { Eyebrow, RevealLines } from '../components/Reveal'

/**
 * A pinned "camera push": the visitor travels forward through a collage of
 * botanical frames — outer frames fly past, the centre frame opens to fill
 * the screen and the copy for the world of EVERGROVE takes over.
 */
const frames = [
  { item: media.worldTrees, cls: 'wf-1', sizes: '(max-width: 768px) 40vw, 24vw' },
  { item: media.worldLawn, cls: 'wf-2', sizes: '(max-width: 768px) 40vw, 24vw' },
  { item: media.worldExotic, cls: 'wf-3', sizes: '(max-width: 768px) 40vw, 24vw' },
  { item: media.worldResidence, cls: 'wf-4', sizes: '(max-width: 768px) 40vw, 24vw' },
]

export default function World() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.world-pin', start: 'top top', end: '+=220%', scrub: 1, pin: true },
        })
        tl.to('.world-intro', { opacity: 0, y: -60, ease: 'power1.in', duration: 0.35 }, 0)
          .to('.wf-1', { xPercent: -160, yPercent: -90, scale: 1.8, ease: 'power1.in' }, 0)
          .to('.wf-2', { xPercent: 170, yPercent: -80, scale: 1.7, ease: 'power1.in' }, 0)
          .to('.wf-3', { xPercent: -170, yPercent: 90, scale: 1.9, ease: 'power1.in' }, 0)
          .to('.wf-4', { xPercent: 160, yPercent: 100, scale: 1.8, ease: 'power1.in' }, 0)
          .to('.world-center', { width: '100%', height: '100%', top: '50%', borderRadius: 0, ease: 'power2.inOut' }, 0)
          .to('.world-center .media', { scale: 1, ease: 'power2.inOut' }, 0)
          .from('.world-overlay', { opacity: 0, duration: 0.3 }, 0.65)
          .from('.world-overlay .line-inner', { yPercent: 110, stagger: 0.05, duration: 0.3 }, 0.7)
          .from('.world-tags li', { y: 30, opacity: 0, stagger: 0.04, duration: 0.25 }, 0.8)
      })
    },
    { scope: root },
  )

  return (
    <section id="world" ref={root} className="world" aria-label="The world of EVERGROVE">
      <div className="world-pin">
        <div className="world-intro container">
          <Eyebrow light>02 — The World of EVERGROVE</Eyebrow>
          <RevealLines
            className="display world-title"
            lines={['Step into a', <em key="e">living world.</em>]}
          />
        </div>

        <div className="world-stage">
          {frames.map((f) => (
            <div key={f.cls} className={`world-frame ${f.cls}`}>
              <Media item={f.item} sizes={f.sizes} />
            </div>
          ))}
          <div className="world-center">
            <Media item={media.worldTropical} sizes="100vw" />
            <div className="world-overlay">
              <div className="container">
                <h2 className="display">
                  <span className="line">
                    <span className="line-inner">Exotic plants. Mature trees.</span>
                  </span>
                  <span className="line">
                    <span className="line-inner">
                      <em>Lawns like velvet.</em>
                    </span>
                  </span>
                </h2>
                <p className="world-copy">
                  Every EVERGROVE environment begins with living material chosen by hand — then is composed, installed
                  and cared for as one continuous craft.
                </p>
                <ul className="world-tags">
                  {['Tropical gardens', 'Specimen trees', 'Natural lawns', 'Rare foliage', 'Residential landscapes'].map(
                    (t) => (
                      <li key={t}>{t}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
