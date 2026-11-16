import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'

/**
 * Subtle follower cursor for fine pointers only. Grows over interactive
 * elements and shows a label over anything with [data-cursor="View"].
 */
export default function Cursor() {
  const ref = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    const el = ref.current
    el.style.display = 'flex'
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })

    const move = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    const over = (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, select, textarea, label')
      const label = target?.getAttribute?.('data-cursor')
      el.classList.toggle('is-hover', !!target)
      el.classList.toggle('is-label', !!label)
      labelRef.current.textContent = label || ''
    }
    const leave = () => el.classList.add('is-hidden')
    const enter = () => el.classList.remove('is-hidden')

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    document.documentElement.addEventListener('pointerenter', enter)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.documentElement.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span ref={labelRef} className="cursor-label" />
    </div>
  )
}
