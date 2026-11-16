import { useEffect } from 'react'
import { SmoothScrollProvider, ScrollTrigger } from './lib/motion'
import { EnquiryProvider } from './lib/enquiry'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import EnquiryDrawer from './components/EnquiryDrawer'
import Hero from './sections/Hero'
import World from './sections/World'
import About from './sections/About'
import Collections from './sections/Collections'
import Landscape from './sections/Landscape'
import Botanical from './sections/Botanical'
import Services from './sections/Services'
import Projects from './sections/Projects'
import FinalCta from './sections/FinalCta'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  // Recalculate pin/scrub positions once fonts and late layout have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <SmoothScrollProvider>
      <EnquiryProvider>
        <Cursor />
        <Nav />
        <main>
          <Hero />
          <World />
          <About />
          <Collections />
          <Landscape />
          <Botanical />
          <Services />
          <Projects />
          <FinalCta />
          <Contact />
        </main>
        <Footer />
        <EnquiryDrawer />
      </EnquiryProvider>
    </SmoothScrollProvider>
  )
}
