import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { landscapes } from '../data/content'
import { media } from '../data/media'
import Media from '../components/Media'
import Cta from '../components/Cta'
import { Eyebrow, RevealLines } from '../components/Reveal'

/**
 * Landscape Architecture — a pinned cinematic sequence. Each scene wipes in
 * over the last while the previous one keeps pushing in (slow zoom), like
 * cuts in a drone film. Optional fly-through video sits behind the intro.
 */
export default function Landscape() {
  const root = useRef(null)
  const [index, setIndex] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scenes = gsap.utils.toArray('.ls-scene')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.ls-pin',
            start: 'top top',
            end: () => `+=${scenes.length * 85}%`,
            pin: true,
            scrub: 1,
            onUpdate: (self) =>
              setIndex(Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length * 0.999))),
          },
        })
        scenes.forEach((scene, i) => {
          const img = scene.querySelector('.media')
          if (i > 0) {
            tl.fromTo(
              scene,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 },
              i - 0.5,
            )
          }
          tl.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1.5 }, Math.max(0, i - 0.5))
        })
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.ls-scene', { clipPath: 'none', position: 'relative' })
      })
    },
    { scope: root },
  )

  return (
    <section id="landscaping" ref={root} className="landscape section-dark">
      <div className="container ls-intro">
        <Eyebrow light>05 — Landscape Architecture</Eyebrow>
        <RevealLines className="display" lines={['Landscapes composed', <em key="e">like architecture.</em>]} />
        <div className="ls-intro-row">
          <p className="lede lede-light">
            From estates and modern courtyards to rooftop lawns and living walls, our landscape architects and build
            crews shape outdoor environments that frame the way you live.
          </p>
          <div className="ls-actions">
            <Cta cta={{ label: 'Book a Landscaping Consultation', enquiry: 'landscaping' }} variant="lime" />
          </div>
        </div>
      </div>

      <div className="ls-pin">
        {landscapes.map((l, i) => (
          <article className="ls-scene" key={l.title} style={{ zIndex: i + 1 }}>
            <Media item={i === 0 && media.landVideo.src ? media.landVideo : l.media} video={i === 0 && !!media.landVideo.src} sizes="100vw" />
            <div className="ls-shade" />
            <div className="ls-caption container">
              <p className="ls-num">
                {String(i + 1).padStart(2, '0')}
                <span> / {String(landscapes.length).padStart(2, '0')}</span>
              </p>
              <h3>{l.title}</h3>
              <p>{l.caption}</p>
            </div>
          </article>
        ))}

        <div className="ls-hud container">
          <ul aria-hidden="true">
            {landscapes.map((l, i) => (
              <li key={l.title} className={i === index ? 'is-active' : ''}>
                {l.title}
              </li>
            ))}
          </ul>
          <Cta cta={{ label: 'Transform Your Garden', enquiry: 'landscaping' }} variant="ghost-light" />
        </div>
      </div>
    </section>
  )
}
