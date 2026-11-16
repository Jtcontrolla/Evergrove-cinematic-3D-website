import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { collections } from '../data/content'
import Cta from '../components/Cta'
import { Eyebrow } from '../components/Reveal'

/**
 * "Find Your Perfect Grass" — a short, front-end-only selector. It gives an
 * indicative starting point and hands off to a grass consultation; it does
 * not replace a site assessment.
 */
const questions = [
  {
    id: 'light',
    q: 'How much sun does the area get?',
    options: [
      { v: 'sun', label: 'Full sun most of the day' },
      { v: 'part', label: 'Partial shade' },
      { v: 'shade', label: 'Mostly shaded' },
    ],
  },
  {
    id: 'use',
    q: 'How will the lawn be used?',
    options: [
      { v: 'high', label: 'Heavy use — kids, pets, sport' },
      { v: 'mid', label: 'Everyday family use' },
      { v: 'low', label: 'Mostly ornamental' },
    ],
  },
  {
    id: 'place',
    q: 'Where is it going?',
    options: [
      { v: 'garden', label: 'Garden at ground level' },
      { v: 'coastal', label: 'Coastal or humid garden' },
      { v: 'roof', label: 'Rooftop, terrace or balcony' },
    ],
  },
  {
    id: 'water',
    q: 'How much watering & upkeep suits you?',
    options: [
      { v: 'minimal', label: 'As little as possible' },
      { v: 'some', label: 'Some is fine' },
      { v: 'full', label: 'Happy with a full care plan' },
    ],
  },
]

// Simple scoring: each answer nudges grass types up or down.
const weights = {
  light: { sun: { bermuda: 3, kikuyu: 2, zoysia: 1 }, part: { zoysia: 3, staugustine: 2, fescue: 1 }, shade: { fescue: 3, staugustine: 2, artificial: 1 } },
  use: { high: { kikuyu: 3, bermuda: 3, artificial: 1 }, mid: { zoysia: 2, kikuyu: 1, staugustine: 1 }, low: { zoysia: 2, fescue: 2 } },
  place: { garden: { kikuyu: 1, zoysia: 1, bermuda: 1 }, coastal: { staugustine: 3, zoysia: 1 }, roof: { artificial: 6 } },
  water: { minimal: { artificial: 3, zoysia: 1, bermuda: 1 }, some: { zoysia: 1, kikuyu: 1 }, full: { fescue: 1, bermuda: 1 } },
}

export default function GrassFinder() {
  const [answers, setAnswers] = useState({})
  const step = Object.keys(answers).length
  const done = step === questions.length

  const result = useMemo(() => {
    if (!done) return null
    const score = {}
    Object.entries(answers).forEach(([k, v]) =>
      Object.entries(weights[k][v] || {}).forEach(([g, w]) => (score[g] = (score[g] || 0) + w)),
    )
    const ranked = Object.entries(score).sort((a, b) => b[1] - a[1])
    return ranked.slice(0, 2).map(([id]) => collections.find((c) => c.id === id))
  }, [answers, done])

  const current = questions[step]

  return (
    <div id="grass-finder" className="finder container">
      <div className="finder-head">
        <Eyebrow light>Find Your Perfect Grass</Eyebrow>
        <h3 className="display-sm">
          Four questions. <em>A considered starting point.</em>
        </h3>
        <p className="finder-note">
          An indicative recommendation only — a consultation confirms soil, drainage and climate on site.
        </p>
      </div>

      <div className="finder-card">
        <div className="finder-steps" aria-hidden="true">
          {questions.map((q, i) => (
            <span key={q.id} className={i < step ? 'is-done' : i === step ? 'is-current' : ''} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.fieldset
              key={current.id}
              className="finder-q"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <legend>
                <span className="finder-n">0{step + 1}</span> {current.q}
              </legend>
              <div className="finder-options">
                {current.options.map((o) => (
                  <button key={o.v} type="button" onClick={() => setAnswers((a) => ({ ...a, [current.id]: o.v }))}>
                    {o.label}
                  </button>
                ))}
              </div>
            </motion.fieldset>
          ) : (
            <motion.div
              key="result"
              className="finder-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="finder-label">Our suggestion</p>
              <h4>
                {result[0].name}
                {result[1] && <span> or {result[1].name}</span>}
              </h4>
              <p>{result[0].body}</p>
              <div className="finder-actions">
                <Cta cta={{ label: 'Request a Grass Consultation', enquiry: 'grass' }} subject={result[0].name} variant="lime" />
                <button type="button" className="finder-reset" onClick={() => setAnswers({})}>
                  <RotateCcw size={14} /> Start again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
