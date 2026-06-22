'use client'
import { useEffect, useRef } from 'react'

const WORDS = ['DAS', 'SIND', 'WIR'] as const

// Reveal vollständig bei diesem Scroll-Anteil → ab hier Sheen + Hint.
const REVEAL_DONE = 0.72
// Pro-Wort Reveal-Fenster (überlappend) innerhalb [0 .. REVEAL_DONE].
const PHASE_DURATION = 0.42

export default function DasSindWir() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    const wordEls = Array.from(stage.querySelectorAll<HTMLElement>('.dsw-word'))
    if (!wordEls.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      wordEls.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none' })
      stage.classList.add('dsw-sheen', 'dsw-hint')
      return
    }

    const n = WORDS.length
    const spacing = n > 1 ? (REVEAL_DONE - PHASE_DURATION) / (n - 1) : 0

    let rafId: number | null = null
    let pending = false
    let maxProgress = 0
    let sheenOn = false

    function update() {
      pending = false
      const rect = section!.getBoundingClientRect()
      const vh = window.innerHeight
      const early = vh * 0.55
      const total = section!.offsetHeight - vh + early
      const scrolled = -rect.top + early
      const progress = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0

      if (progress > maxProgress) maxProgress = progress
      const p = maxProgress

      for (let i = 0; i < wordEls.length; i++) {
        const el = wordEls[i]
        const start = i * spacing
        const t = Math.max(0, Math.min(1, (p - start) / PHASE_DURATION))
        const e = 1 - Math.pow(1 - t, 5) // ease-out quint
        const y = (1 - e) * 0.85 // in em — Aufstieg innerhalb des eigenen Slots
        el.style.transform = `translateY(${y}em)`
        el.style.opacity = String(Math.min(1, t * 1.8))
      }

      if (!sheenOn && p >= REVEAL_DONE) {
        sheenOn = true
        stage!.classList.add('dsw-sheen', 'dsw-hint')
      }
    }

    function onScroll() {
      if (pending) return
      pending = true
      rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section ref={sectionRef} id="das-sind-wir" aria-label="Das sind wir">
      <div className="dsw-sticky">
        <div ref={stageRef} className="dsw-stage" aria-hidden="true">
          {WORDS.map((word, i) => (
            <span key={word} className="dsw-word">
              {word}
              {i === WORDS.length - 1 && <span className="dsw-dot">.</span>}
            </span>
          ))}
        </div>
        <a href="#ceo" className="dsw-scroll-hint" aria-label="Weiter zum Geschäftsführer">
          <span className="dsw-scroll-label">Weiter lesen</span>
          <span className="dsw-scroll-chev">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </span>
        </a>
        <h2 className="dsw-sr">Das sind wir.</h2>
      </div>
    </section>
  )
}
