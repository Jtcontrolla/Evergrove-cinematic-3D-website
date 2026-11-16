import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

const reducedQuery = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(reducedQuery).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(reducedQuery)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

const ScrollCtx = createContext({ scrollTo: () => {}, lenis: null })
export const useSmoothScroll = () => useContext(ScrollCtx)

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share a single animation frame. Disabled under prefers-reduced-motion.
 */
export function SmoothScrollProvider({ children }) {
  const reduced = usePrefersReducedMotion()
  const lenisRef = useRef(null)
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = instance
    setLenis(instance)
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [reduced])

  const scrollTo = (target, opts = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0, duration: 1.6, ...opts })
    } else {
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    }
  }

  return <ScrollCtx.Provider value={{ scrollTo, lenis }}>{children}</ScrollCtx.Provider>
}
