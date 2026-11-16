import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { projects } from '../data/content'
import Media from '../components/Media'
import Cta from '../components/Cta'
import { Eyebrow, RevealLines } from '../components/Reveal'

/**
 * Signature Environments — editorial stacked cards. Each project pins and the
 * next slides over it while the previous one recedes. All projects shown are
 * demonstration concepts, labelled as such.
 */
export default function Projects() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray('.proj-card')
        cards.forEach((card, i) => {
          const inner = card.querySelector('.proj-inner')
          const img = card.querySelector('.proj-media .media')
          gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
          })
          if (i < cards.length - 1) {
            gsap.to(inner, {
              scale: 0.9,
              opacity: 0.35,
              ease: 'none',
              scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 12%', scrub: true },
            })
          }
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="projects" ref={root} className="projects section-ivory">
      <div className="container proj-head">
        <div>
          <Eyebrow>08 — Signature Environments</Eyebrow>
          <RevealLines className="display" lines={['Spaces we imagine', <em key="e">into being.</em>]} />
        </div>
        <p className="proj-note">
          Concept studies showing the kind of environments EVERGROVE designs, installs and maintains. Shown for
          demonstration — not client commissions.
        </p>
      </div>

      <div className="proj-stack container">
        {projects.map((p, i) => (
          <article className="proj-card" key={p.id} style={{ '--i': i }}>
            <div className="proj-inner">
              <div className="proj-media" data-cursor="Concept">
                <Media item={p.media} sizes="(max-width: 899px) 100vw, 58vw" />
                <span className="proj-badge">Concept study</span>
              </div>
              <div className="proj-text">
                <p className="proj-num">{String(i + 1).padStart(2, '0')}</p>
                <p className="proj-type">{p.type}</p>
                <h3>{p.title}</h3>
                <p className="proj-body">{p.body}</p>
                <ul className="proj-scope">
                  {p.scope.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <Cta cta={{ label: 'Transform Your Garden', enquiry: 'landscaping' }} subject={p.title} variant="text" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
