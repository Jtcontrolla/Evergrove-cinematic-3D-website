import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'

/**
 * Line-by-line masked text reveal. Pass `lines` (array of strings / nodes) so
 * line breaks are art-directed rather than left to the browser.
 */
export function RevealLines({ as: Tag = 'h2', lines, className = '', delay = 0, start = 'top 85%', immediate = false }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(ref.current.querySelectorAll('.line-inner'), {
          yPercent: 110,
          rotate: 2,
          duration: 1.25,
          ease: 'expo.out',
          stagger: 0.09,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: ref.current, start },
        })
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span className="line-inner">{l}</span>
        </span>
      ))}
    </Tag>
  )
}

/** Fades and lifts children into view as they enter the viewport. */
export function FadeUp({ children, className = '', as: Tag = 'div', y = 40, stagger = 0.08, selector, ...rest }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = selector ? ref.current.querySelectorAll(selector) : ref.current.children
        gsap.from(targets, {
          y,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        })
      })
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, light = false }) {
  return (
    <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>
      <span className="eyebrow-dot" />
      {children}
    </p>
  )
}
