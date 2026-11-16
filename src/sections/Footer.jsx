import { ArrowUp } from 'lucide-react'
import Logo from '../components/Logo'
import { contact, nav, services } from '../data/content'
import { useSmoothScroll } from '../lib/motion'

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'YouTube', href: '#' },
]

export default function Footer() {
  const { scrollTo } = useSmoothScroll()
  const go = (e, href) => {
    e.preventDefault()
    scrollTo(href)
  }

  return (
    <footer className="footer section-forest">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>Premium greenery, landscape architecture and lawn care. Supplied, installed and cared for by one team.</p>
          </div>
          <div className="footer-cols">
            <div>
              <h4>Navigate</h4>
              <ul>
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} onClick={(e) => go(e, n.href)}>
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Services</h4>
              <ul>
                {services.map((s) => (
                  <li key={s.n}>
                    <a href="#services" onClick={(e) => go(e, '#services')}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>{contact.phone}</li>
                <li>{contact.email}</li>
                <li>{contact.studio}</li>
              </ul>
              <h4 className="footer-social-h">Follow</h4>
              <ul className="footer-social">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} aria-label={`EVERGROVE on ${s.label} (link to be added)`}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-word" aria-hidden="true">
          EVERGROVE
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EVERGROVE. All rights reserved.</p>
          <p>Where nature meets design.</p>
          <a href="#home" onClick={(e) => go(e, '#home')} className="footer-top-link">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
