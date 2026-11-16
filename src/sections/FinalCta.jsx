import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { media } from '../data/media'
import Media from '../components/Media'
import Cta from '../components/Cta'

/** Closing statement: the frame opens from a window to full-bleed as you arrive. */
export default function FinalCta() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 10%', scrub: true },
        })
        tl.fromTo('.fcta-frame', { clipPath: 'inset(18% 22% 18% 22% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
          .fromTo('.fcta-frame .media', { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
        gsap.from('.fcta-title .line-inner', {
          yPercent: 110,
          stagger: 0.08,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.fcta-title', start: 'top 80%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="fcta" aria-label="Let's make space for nature">
      <div className="fcta-frame">
        <Media item={media.ctaBackdrop} sizes="100vw" />
        <div className="fcta-shade" />
        <div className="grain" />
      </div>
      <div className="fcta-content container">
        <h2 className="fcta-title display-xl">
          <span className="line">
            <span className="line-inner">Let’s make</span>
          </span>
          <span className="line">
            <span className="line-inner">
              space for <em>nature.</em>
            </span>
          </span>
        </h2>
        <p className="fcta-copy">
          Whether you’re transforming a private residence, developing a property or creating a beautiful outdoor
          environment, let’s bring your vision to life.
        </p>
        <div className="fcta-actions">
          <Cta cta={{ label: 'Book a Consultation', enquiry: 'landscaping' }} variant="lime" />
          <Cta cta={{ label: 'Talk to Our Team', enquiry: 'expert' }} variant="ghost-light" />
          <Cta cta={{ label: 'Explore Our Greenery', href: '#greenery' }} variant="text-light" />
        </div>
      </div>
    </section>
  )
}
