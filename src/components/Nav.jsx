import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Logo from './Logo'
import { nav, contact } from '../data/content'
import { useSmoothScroll } from '../lib/motion'
import { useEnquiry } from '../lib/enquiry'

export default function Nav() {
  const { scrollTo, lenis } = useSmoothScroll()
  const { openEnquiry } = useEnquiry()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  // Solid background after the hero, hide on scroll-down / show on scroll-up.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      // The hero is pinned for several screens: stay transparent until the flight ends.
      const world = document.querySelector('#world')
      const pastHero = world ? world.getBoundingClientRect().top < window.innerHeight * 0.4 : y > window.innerHeight * 0.6
      setScrolled(pastHero)
      setHidden(pastHero && y > last)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active-section tracking.
  useEffect(() => {
    const els = nav.map((n) => document.querySelector(n.href)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.classList.toggle('no-scroll', open)
  }, [open, lenis])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href)
  }

  return (
    <>
      <header className={`nav ${scrolled ? 'is-solid' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={(e) => go(e, '#home')}>
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Primary">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)} className={active === n.href ? 'is-active' : ''}>
                {n.label}
              </a>
            ))}
          </nav>
          <button className="btn btn-lime nav-cta" onClick={() => openEnquiry('expert')}>
            <span className="btn-label">Let’s Talk</span>
            <span className="btn-icon" aria-hidden="true">
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </span>
          </button>
          <button
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile">
              {nav.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => go(e, n.href)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="mm-index">0{i + 1}</span>
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="mobile-menu-foot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                className="btn btn-lime"
                onClick={() => {
                  setOpen(false)
                  openEnquiry('expert')
                }}
              >
                <span className="btn-label">Let’s Talk</span>
                <span className="btn-icon">
                  <ArrowUpRight size={16} />
                </span>
              </button>
              <p>{contact.email}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
