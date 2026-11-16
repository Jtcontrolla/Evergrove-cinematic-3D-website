import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { divisions } from '../data/content'
import Cta from '../components/Cta'
import { Eyebrow, RevealLines } from '../components/Reveal'

/**
 * About EVERGROVE: one company across the full life of a green space.
 * The four divisions are presented as a continuous cycle with a growing stem.
 */
export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.cycle-stem-fill',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.cycle', start: 'top 70%', end: 'bottom 70%', scrub: true } },
        )
        gsap.utils.toArray('.cycle-item').forEach((el) => {
          gsap.from(el.querySelectorAll('.ci-anim'), {
            y: 50,
            opacity: 0,
            duration: 1.1,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 80%' },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} className="about section-ivory">
      <div className="container about-grid">
        <div className="about-head">
          <Eyebrow>03 — About EVERGROVE</Eyebrow>
          <RevealLines
            className="display"
            lines={['We supply it.', 'We install it.', <em key="e">We care for it.</em>]}
          />
          <p className="lede">
            EVERGROVE is a premium greenery, landscaping, turf supply and lawn-care company. We don’t just sell plants
            and grass — we create, install, improve and maintain beautiful green environments, with one team
            accountable from first conversation to every season after.
          </p>
          <Cta cta={{ label: 'Explore Our Services', href: '#services' }} variant="dark" />
        </div>

        <ol className="cycle">
          <span className="cycle-stem" aria-hidden="true">
            <span className="cycle-stem-fill" />
          </span>
          {divisions.map((d) => (
            <li className="cycle-item" key={d.id}>
              <span className="cycle-node ci-anim" aria-hidden="true" />
              <p className="cycle-index ci-anim">{d.index}</p>
              <div>
                <p className="cycle-short ci-anim">{d.short}</p>
                <h3 className="cycle-title ci-anim">{d.title}</h3>
                <p className="cycle-body ci-anim">{d.body}</p>
                <div className="ci-anim">
                  <Cta cta={d.cta} variant="text" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
