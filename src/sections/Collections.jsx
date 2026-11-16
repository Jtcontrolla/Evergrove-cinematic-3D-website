import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { collections } from '../data/content'
import Media from '../components/Media'
import Cta from '../components/Cta'
import { Eyebrow, RevealLines } from '../components/Reveal'
import GrassFinder from './GrassFinder'

/**
 * Grass & Botanical Collections — a pinned horizontal gallery on desktop
 * (native swipe with snap on touch / small screens).
 */
export default function Collections() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.current.querySelector('.coll-track')
        const distance = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.coll-pin',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.coll-progress-fill', { scaleX: self.progress }),
          },
        })
        // Images drift inside their frames while the track moves (parallax).
        gsap.utils.toArray('.coll-card .media').forEach((m) => {
          gsap.fromTo(
            m,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: m, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="greenery" ref={root} className="collections section-forest">
      <div className="coll-pin">
        <div className="container coll-head">
          <div>
            <Eyebrow light>04 — Grass &amp; Botanical Collections</Eyebrow>
            <RevealLines className="display" lines={['A living library,', <em key="e">chosen by hand.</em>]} />
          </div>
          <div className="coll-head-side">
            <p>
              Five natural grasses, engineered turf and a collection of exotic plants, specimen trees and palms — each
              supplied, installed and cared for by EVERGROVE.
            </p>
            <Cta cta={{ label: 'Find Your Perfect Grass', href: '#grass-finder' }} variant="ghost-light" />
          </div>
        </div>

        <div className="coll-viewport">
          <ul className="coll-track">
            {collections.map((c, i) => {
              const isGrass = c.group !== 'Botanicals'
              return (
                <li key={c.id} className="coll-card" data-cursor="Enquire">
                  <div className="coll-media">
                    <Media item={c.media} sizes="(max-width: 899px) 82vw, 30vw" />
                    <span className="coll-count">
                      {String(i + 1).padStart(2, '0')} / {String(collections.length).padStart(2, '0')}
                    </span>
                    <span className="coll-group">{c.group}</span>
                  </div>
                  <div className="coll-body">
                    <div className="coll-name">
                      <h3>{c.name}</h3>
                      <p className="coll-latin">{c.latin}</p>
                    </div>
                    <p className="coll-desc">{c.body}</p>
                    <ul className="coll-traits">
                      {c.traits.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <Cta
                      cta={
                        isGrass
                          ? { label: 'Request a Grass Consultation', enquiry: 'grass' }
                          : { label: `Enquire about ${c.name}`, enquiry: 'supply' }
                      }
                      subject={c.name}
                      variant="text-light"
                    />
                  </div>
                </li>
              )
            })}
            <li className="coll-card coll-end">
              <p className="eyebrow eyebrow-light">
                <span className="eyebrow-dot" />
                Not sure which?
              </p>
              <h3 className="display-sm">
                The right grass depends on <em>light, use and climate.</em>
              </h3>
              <Cta cta={{ label: 'Find Your Perfect Grass', href: '#grass-finder' }} variant="lime" />
            </li>
          </ul>
        </div>

        <div className="container coll-progress" aria-hidden="true">
          <span className="coll-progress-fill" />
        </div>
      </div>

      <GrassFinder />
    </section>
  )
}
