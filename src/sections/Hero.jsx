import { useCallback, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { gsap, useGSAP, useSmoothScroll, usePrefersReducedMotion } from '../lib/motion'
import { useFrameSequence } from '../lib/useFrameSequence'
import { media } from '../data/media'
import Media from '../components/Media'
import Cta from '../components/Cta'

/**
 * HERO — scroll-scrubbed aerial flight.
 * The section pins while a 150-frame drone sequence (Pexels, free licence)
 * plays forward/backward with the scroll: up the lawn avenue, over the
 * estate, across the woodland and out to open parkland. Copy is
 * choreographed in chapters over the flight. Reduced motion (or no AVIF
 * support) shows the still hero photograph instead.
 */
const FRAMES = 150
const SEQ = '/assets/sequences/hero-flight'

const chapters = [
  { k: 'Supply', t: 'Grown and sourced', b: 'Premium grasses, turf, palms, specimen trees and rare botanicals.' },
  { k: 'Install', t: 'Built with precision', b: 'Lawns, gardens, green walls and rooftop landscapes by our own crews.' },
  { k: 'Care', t: 'Kept extraordinary', b: 'Mowing, feeding, irrigation and restoration, season after season.' },
  { k: 'Advise', t: 'Chosen with expertise', b: 'Site assessments and planting strategies for every kind of property.' },
]

export default function Hero() {
  const root = useRef(null)
  const canvasRef = useRef(null)
  const progress = useRef(0)
  const timecode = useRef(null)
  const reduced = usePrefersReducedMotion()
  const { scrollTo } = useSmoothScroll()
  const [portrait] = useState(() => window.innerWidth / window.innerHeight < 0.9)

  const url = useCallback(
    (i) => `${SEQ}/${portrait ? 'mobile' : 'desktop'}/f${String(i + 1).padStart(3, '0')}.avif`,
    [portrait],
  )
  const { ready, supported } = useFrameSequence({ canvasRef, target: progress, count: FRAMES, url, enabled: !reduced })
  const animated = !reduced && supported

  useGSAP(
    () => {
      if (!animated) return
      // Intro: veil lifts, wordmark and headline rise.
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-veil', { opacity: 1, duration: 1.6, ease: 'power2.inOut' })
        .from('.hero-word .char', { yPercent: 115, duration: 1.6, stagger: 0.05 }, 0.4)
        .from('.hero-tagline .line-inner', { yPercent: 110, duration: 1.3, stagger: 0.08 }, 0.8)
        .from('.hero-fade', { y: 30, opacity: 0, duration: 1.2, stagger: 0.1 }, 1.1)

      // Scroll: pin and drive the flight + chapter choreography.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.hero-pin',
          start: 'top top',
          end: '+=340%',
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress
            if (timecode.current) {
              const s = Math.round(self.progress * 36)
              timecode.current.textContent = `00:${String(s).padStart(2, '0')}`
            }
          },
        },
      })

      // 0 → 0.14: opening copy lifts away, wordmark sinks.
      tl.to('.hero-content', { yPercent: -25, opacity: 0, duration: 0.12 }, 0.02)
        .to('.hero-word', { yPercent: 40, opacity: 0, duration: 0.14 }, 0.02)
        .to('.hero-scroll', { opacity: 0, duration: 0.05 }, 0.02)
        .to('.hero-shade', { opacity: 0.85, duration: 0.1 }, 0.05)

      // Chapters: each rises in, holds, then dissolves.
      gsap.utils.toArray('.hero-chapter').forEach((el, i) => {
        const at = 0.16 + i * 0.17
        tl.fromTo(el, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.05 }, at)
          .fromTo(el.querySelector('.hc-k'), { letterSpacing: '0.35em' }, { letterSpacing: '0.02em', duration: 0.045 }, at)
          .to(el, { autoAlpha: 0, y: -50, duration: 0.05 }, at + 0.12)
      })
      tl.fromTo('.hero-hud-bar i', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)

      // Finale: arrival line, then the frame closes into the next section.
      tl.fromTo('.hero-arrive', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.86)
        .to('.hero-frame', { clipPath: 'inset(5% 4% 5% 4% round 32px)', duration: 0.1 }, 0.9)
    },
    { scope: root, dependencies: [animated] },
  )

  return (
    <section id="home" ref={root} className="hero" aria-label="Introduction">
      <div className="hero-pin">
        <div className="hero-frame">
          {animated ? (
            <>
              {/* Still photo shows until the first frame arrives. */}
              {!ready && <Media item={media.hero} priority sizes="100vw" className="hero-media" />}
              <canvas ref={canvasRef} className={`hero-canvas ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
            </>
          ) : (
            <Media item={media.hero} priority sizes="100vw" className="hero-media" />
          )}
          <div className="hero-shade" />
          <div className="hero-veil" />
          <div className="grain" />

          <div className="hero-content container">
            <p className="eyebrow eyebrow-light hero-fade">
              <span className="eyebrow-dot" />
              Greenery · Landscape Architecture · Care
            </p>
            <h1 className="hero-tagline">
              <span className="line">
                <span className="line-inner">Where nature</span>
              </span>
              <span className="line">
                <span className="line-inner">
                  <em>meets design.</em>
                </span>
              </span>
            </h1>
            <div className="hero-row">
              <p className="hero-lede hero-fade">
                We transform ordinary spaces into extraordinary living environments through exceptional greenery and
                landscape design.
              </p>
              <div className="hero-actions hero-fade">
                <Cta cta={{ label: 'Explore Our World', href: '#world' }} variant="lime" />
                <Cta cta={{ label: 'Discover Our Services', href: '#services' }} variant="ghost-light" />
              </div>
            </div>
          </div>

          {animated && (
            <>
              <div className="hero-chapters container" aria-hidden="true">
                {chapters.map((c, i) => (
                  <div className="hero-chapter" key={c.k}>
                    <p className="hc-n">0{i + 1} / 04</p>
                    <h2 className="hc-k">{c.k}.</h2>
                    <p className="hc-t">{c.t}</p>
                    <p className="hc-b">{c.b}</p>
                  </div>
                ))}
              </div>

              <div className="hero-arrive container" aria-hidden="true">
                <p className="eyebrow eyebrow-light">
                  <span className="eyebrow-dot" />
                  One team · Every season
                </p>
                <p className="hero-arrive-t">
                  Welcome to the world of <em>EVERGROVE.</em>
                </p>
              </div>

              <div className="hero-hud hero-fade" aria-hidden="true">
                <span className="hero-rec" />
                <span ref={timecode}>00:00</span>
                <span className="hero-hud-bar">
                  <i />
                </span>
                <span>Aerial approach</span>
              </div>
            </>
          )}

          <div className="hero-word" aria-hidden="true">
            {'EVERGROVE'.split('').map((c, i) => (
              <span className="char-mask" key={i}>
                <span className="char">{c}</span>
              </span>
            ))}
          </div>

          <a
            href="#world"
            className="hero-scroll hero-fade"
            aria-label="Scroll to explore"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#world')
            }}
          >
            <ArrowDown size={16} />
            <span>{animated ? 'Scroll to fly' : 'Scroll'}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
