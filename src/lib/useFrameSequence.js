import { useEffect, useRef, useState } from 'react'

/**
 * Loads an image sequence progressively (sparse → dense) and draws the frame
 * nearest to `target.current` (0..1) onto a canvas, cover-fitted and DPR-aware.
 * The displayed frame eases toward the target so scrubbing feels like video.
 *
 * Returns { ready, supported } — `supported` is false when the browser can't
 * decode the format, in which case the caller shows a static fallback.
 */
const avifProbe =
  'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='

function canDecodeAvif() {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img.width > 0)
    img.onerror = () => resolve(false)
    img.src = avifProbe
  })
}

/** Load order: every 16th frame, then 8th, 4th, 2nd, then the rest. */
function loadOrder(count) {
  const order = []
  const seen = new Set()
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i)
        order.push(i)
      }
    }
  }
  return order
}

export function useFrameSequence({ canvasRef, target, count, url, enabled = true }) {
  const frames = useRef([])
  const [ready, setReady] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let raf = 0
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    let current = 0
    let lastDrawn = -1

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      lastDrawn = -1
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const nearestLoaded = (i) => {
      for (let d = 0; d < count; d++) {
        const a = frames.current[i - d]
        if (a?.complete && a.naturalWidth) return i - d
        const b = frames.current[i + d]
        if (b?.complete && b.naturalWidth) return i + d
      }
      return -1
    }

    const draw = (i) => {
      const img = frames.current[i]
      const cw = canvas.width
      const ch = canvas.height
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * s
      const h = img.naturalHeight * s
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    const tick = () => {
      const goal = Math.max(0, Math.min(1, target.current)) * (count - 1)
      current += (goal - current) * 0.18
      if (Math.abs(goal - current) < 0.01) current = goal
      const idx = nearestLoaded(Math.round(current))
      if (idx >= 0 && idx !== lastDrawn) {
        draw(idx)
        lastDrawn = idx
      }
      raf = requestAnimationFrame(tick)
    }

    canDecodeAvif().then((ok) => {
      if (cancelled) return
      if (!ok) {
        setSupported(false)
        return
      }
      frames.current = new Array(count)
      const order = loadOrder(count)
      let inFlight = 0
      let next = 0
      const pump = () => {
        while (inFlight < 6 && next < order.length && !cancelled) {
          const i = order[next++]
          const img = new Image()
          img.decoding = 'async'
          inFlight++
          img.onload = img.onerror = () => {
            inFlight--
            if (i === 0 && !cancelled) setReady(true)
            pump()
          }
          img.src = url(i)
          frames.current[i] = img
        }
      }
      pump()
      raf = requestAnimationFrame(tick)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      frames.current.forEach((img) => img && (img.src = ''))
      frames.current = []
    }
  }, [enabled, count, url, canvasRef, target])

  return { ready, supported }
}
