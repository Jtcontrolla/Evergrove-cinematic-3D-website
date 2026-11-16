import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { contact } from '../data/content'
import EnquiryForm from '../components/EnquiryForm'
import { Eyebrow, RevealLines } from '../components/Reveal'

export default function Contact() {
  return (
    <section id="contact" className="contact section-ivory">
      <div className="container contact-grid">
        <div className="contact-side">
          <Eyebrow>09 — Contact &amp; Consultation</Eyebrow>
          <RevealLines className="display" lines={['Talk to', <em key="e">an expert.</em>]} />
          <p className="lede">
            Request a grass consultation, book a landscaping consultation, schedule lawn maintenance or simply ask a
            question. One team covers supply, installation, care and advice.
          </p>
          <ul className="contact-list">
            <li>
              <Phone size={16} /> <span>{contact.phone}</span>
            </li>
            <li>
              <Mail size={16} /> <span>{contact.email}</span>
            </li>
            <li>
              <MapPin size={16} /> <span>{contact.studio}</span>
            </li>
            <li>
              <Clock size={16} /> <span>{contact.hours}</span>
            </li>
          </ul>
          <p className="contact-placeholder-note">Contact details are placeholders until confirmed.</p>
        </div>
        <div className="contact-form-wrap">
          <EnquiryForm type="landscaping" tone="card" />
        </div>
      </div>
    </section>
  )
}
