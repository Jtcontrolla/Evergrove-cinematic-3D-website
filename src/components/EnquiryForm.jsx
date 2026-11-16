import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ArrowUpRight } from 'lucide-react'
import { enquiryTypes, propertyTypes, collections } from '../data/content'

/**
 * Front-end enquiry / consultation form. No backend: on submit it validates,
 * shows a confirmation and logs the payload in development. Wire `onSubmit`
 * to a form service (e.g. email API, CRM webhook) when one is chosen.
 */
const empty = { name: '', email: '', phone: '', location: '', property: '', subject: '', date: '', frequency: '', message: '', consent: false }

export default function EnquiryForm({ type: initialType = 'expert', subject: initialSubject = '', tone = 'light', onDone }) {
  const uid = useId()
  const [type, setType] = useState(initialType)
  const [data, setData] = useState({ ...empty, subject: initialSubject })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  useEffect(() => setType(initialType), [initialType])
  useEffect(() => setData((d) => ({ ...d, subject: initialSubject })), [initialSubject])

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const validate = () => {
    const e = {}
    if (!data.name.trim()) e.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = 'Please enter a valid email.'
    if (!data.message.trim() || data.message.trim().length < 10) e.message = 'A sentence or two about your space helps us prepare.'
    if (!data.consent) e.consent = 'Please confirm we can contact you.'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = ev.currentTarget.querySelector(`[name="${Object.keys(e)[0]}"]`)
      first?.focus()
      return
    }
    if (import.meta.env.DEV) console.info('[EVERGROVE enquiry]', { type, ...data })
    setSent(true)
  }

  const reset = () => {
    setData({ ...empty })
    setSent(false)
    onDone?.()
  }

  const f = (k) => `${uid}-${k}`
  const t = enquiryTypes[type]
  const grassOptions = collections.filter((c) => c.group !== 'Botanicals').map((c) => c.name)
  const supplyOptions = collections.map((c) => c.name)

  return (
    <div className={`eform eform-${tone}`}>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="ok"
            className="eform-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <span className="eform-check">
              <Check size={22} />
            </span>
            <h3>Thank you, {data.name.split(' ')[0]}.</h3>
            <p>
              Your {t.label.toLowerCase()} request has been noted. This is a front-end demonstration — once a form
              service is connected, our team will reply within one working day.
            </p>
            <button type="button" className="btn btn-dark" onClick={reset}>
              <span className="btn-label">Done</span>
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="eform-types" role="radiogroup" aria-label="Enquiry type">
              {Object.entries(enquiryTypes).map(([k, v]) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={type === k}
                  key={k}
                  className={type === k ? 'is-active' : ''}
                  onClick={() => setType(k)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <p className="eform-intro">{t.intro}</p>

            <div className="eform-grid">
              <Field id={f('name')} label="Full name" error={errors.name}>
                <input id={f('name')} name="name" autoComplete="name" value={data.name} onChange={set('name')} />
              </Field>
              <Field id={f('email')} label="Email" error={errors.email}>
                <input id={f('email')} name="email" type="email" autoComplete="email" value={data.email} onChange={set('email')} />
              </Field>
              <Field id={f('phone')} label="Phone (optional)">
                <input id={f('phone')} name="phone" type="tel" autoComplete="tel" value={data.phone} onChange={set('phone')} />
              </Field>
              <Field id={f('location')} label="Property location">
                <input id={f('location')} name="location" placeholder="City / area" value={data.location} onChange={set('location')} />
              </Field>
              <Field id={f('property')} label="Property type">
                <select id={f('property')} name="property" value={data.property} onChange={set('property')}>
                  <option value="">Select…</option>
                  {propertyTypes.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>

              {type === 'grass' && (
                <Field id={f('subject')} label="Grass of interest">
                  <select id={f('subject')} name="subject" value={data.subject} onChange={set('subject')}>
                    <option value="">Not sure yet — advise me</option>
                    {grassOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
              )}
              {type === 'supply' && (
                <Field id={f('subject')} label="Interested in">
                  <select id={f('subject')} name="subject" value={data.subject} onChange={set('subject')}>
                    <option value="">Select…</option>
                    {supplyOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
              )}
              {type === 'maintenance' && (
                <Field id={f('frequency')} label="Preferred frequency">
                  <select id={f('frequency')} name="frequency" value={data.frequency} onChange={set('frequency')}>
                    <option value="">Select…</option>
                    <option>Weekly</option>
                    <option>Fortnightly</option>
                    <option>Monthly</option>
                    <option>Seasonal / one-off</option>
                  </select>
                </Field>
              )}
              {(type === 'landscaping' || type === 'grass') && (
                <Field id={f('date')} label="Preferred consultation date">
                  <input id={f('date')} name="date" type="date" value={data.date} onChange={set('date')} />
                </Field>
              )}
              {(type === 'expert' || type === 'landscaping') && (
                <Field id={f('subject')} label="Topic (optional)">
                  <input id={f('subject')} name="subject" value={data.subject} onChange={set('subject')} />
                </Field>
              )}

              <Field id={f('message')} label="Tell us about your space" error={errors.message} wide>
                <textarea id={f('message')} name="message" rows={4} value={data.message} onChange={set('message')} />
              </Field>
            </div>

            <label className={`eform-consent ${errors.consent ? 'has-error' : ''}`}>
              <input type="checkbox" name="consent" checked={data.consent} onChange={set('consent')} />
              <span>I agree to EVERGROVE contacting me about this enquiry.</span>
            </label>
            {errors.consent && <p className="eform-err">{errors.consent}</p>}

            <button type="submit" className="btn btn-lime eform-submit">
              <span className="btn-label">{t.title}</span>
              <span className="btn-icon" aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({ id, label, error, wide, children }) {
  return (
    <div className={`field ${wide ? 'field-wide' : ''} ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="eform-err" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
