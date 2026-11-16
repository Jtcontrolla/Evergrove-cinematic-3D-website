import { useMemo, useState } from 'react'

const tones = {
  forest: ['#10251D', '#1c3b2b', '#315C3B', '#A8D85A'],
  jungle: ['#0c1d16', '#17382a', '#2f6b45', '#8fcf6a'],
  moss: ['#142a1f', '#2a4a32', '#4f7a44', '#c3e48a'],
  lime: ['#1a3322', '#315C3B', '#6f9f45', '#d6f09c'],
  sage: ['#16271f', '#33493d', '#6e8a76', '#cfe0c4'],
  dusk: ['#121a17', '#2b3229', '#5d5a3c', '#e9cf8f'],
}

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed) {
  let s = seed || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** A single leaf path: pointed ellipse with a midrib, drawn pointing up from (0,0). */
const LEAF = 'M0 0 C -26 -30 -30 -82 0 -120 C 30 -82 26 -30 0 0 Z'

/**
 * Art-directed placeholder: layered botanical silhouettes over a tonal
 * gradient. Deterministic per brief, so each slot keeps the same composition.
 */
export function BotanicalPlate({ brief = '', tone = 'forest' }) {
  const [c0, c1, c2, c3] = tones[tone] || tones.forest
  const id = useMemo(() => `p${hash(brief + tone).toString(36)}`, [brief, tone])

  const leaves = useMemo(() => {
    const r = rng(hash(brief))
    const layers = []
    for (let layer = 0; layer < 3; layer++) {
      const count = 5 + Math.floor(r() * 4)
      for (let i = 0; i < count; i++) {
        layers.push({
          layer,
          x: r() * 400,
          y: 300 + r() * 160 - layer * 40,
          s: (0.9 + r() * 1.6) * (1 + layer * 0.35),
          rot: -55 + r() * 110,
        })
      }
    }
    return layers
  }, [brief])

  return (
    <svg className="plate" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-bg`} cx="65%" cy="25%" r="90%">
          <stop offset="0%" stopColor={c2} />
          <stop offset="55%" stopColor={c1} />
          <stop offset="100%" stopColor={c0} />
        </radialGradient>
        <radialGradient id={`${id}-sun`} cx="72%" cy="18%" r="45%">
          <stop offset="0%" stopColor={c3} stopOpacity="0.45" />
          <stop offset="100%" stopColor={c3} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id}-bg)`} />
      <rect width="400" height="400" fill={`url(#${id}-sun)`} />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`}>
          <path
            d={LEAF}
            fill={l.layer === 2 ? c0 : l.layer === 1 ? c1 : c2}
            opacity={l.layer === 0 ? 0.55 : l.layer === 1 ? 0.75 : 0.95}
          />
          <path d="M0 -4 L0 -112" stroke={c3} strokeOpacity={0.12 + l.layer * 0.06} strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  )
}

/**
 * <Media> renders a manifest photo (responsive WebP srcset, lazy-loaded) or
 * video. The botanical plate is only a fallback if a file fails to load.
 * `sizes` should describe the rendered width so the browser picks the
 * smallest adequate file.
 */
export default function Media({ item, alt, className = '', video = false, priority = false, sizes = '100vw', showTag = true }) {
  const [failed, setFailed] = useState(false)
  const has = item?.src && !failed
  const altText = alt ?? item?.alt ?? ''

  return (
    <div className={`media ${className}`}>
      {has && video ? (
        <video
          className="media-el"
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? 'auto' : 'metadata'}
          poster={item.poster || undefined}
          onError={() => setFailed(true)}
        >
          {item.webm && <source src={item.webm} type="video/webm" />}
          <source src={item.src} type="video/mp4" />
        </video>
      ) : has ? (
        <img
          className="media-el"
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.srcSet ? sizes : undefined}
          alt={altText}
          style={item.focus ? { objectPosition: item.focus } : undefined}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <BotanicalPlate brief={item?.brief || altText} tone={item?.tone} />
          {import.meta.env.DEV && showTag && item?.brief && (
            <span className="media-tag" title={item.brief}>
              Placeholder · {item.brief.split(/[—,.]/)[0]}
            </span>
          )}
        </>
      )}
    </div>
  )
}
