'use client'
import { useEffect, useRef } from 'react'

const WORDS = ['DAS', 'SIND', 'WIR'] as const
const FINAL_Y_VH = [-22, 0, 22] as const
const PARKED_AT = 0.95

export default function DasSindWir() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    const wordEls = stage.querySelectorAll<HTMLElement>('.dsw-word')

    let pending = false
    let rafId: number | null = null
    let maxProgress = 0
    let sheenTriggered = false

    function update() {
      pending = false
      const rect = section!.getBoundingClientRect()
      const viewportH = window.innerHeight
      const earlyOffset = viewportH * 0.6
      const totalScroll = section!.offsetHeight - viewportH + earlyOffset
      const scrolled = -rect.top + earlyOffset
      const progress = totalScroll > 0
        ? Math.max(0, Math.min(1, scrolled / totalScroll))
        : 0

      if (progress > maxProgress) maxProgress = progress
      const p = maxProgress

      const PHASE_DURATION = 0.45
      const PHASE_SPACING = (PARKED_AT - PHASE_DURATION) / (WORDS.length - 1)

      wordEls.forEach((el, i) => {
        const phaseStart = i * PHASE_SPACING
        const phaseEnd = phaseStart + PHASE_DURATION
        const t = Math.max(0, Math.min(1, (p - phaseStart) / (phaseEnd - phaseStart)))
        const eased = 1 - Math.pow(1 - t, 3)
        const startY = 120
        const finalY = FINAL_Y_VH[i]
        const y = startY + (finalY - startY) * eased
        el.style.transform = `translate(-50%, calc(-50% + ${y}vh))`
        el.style.opacity = y > 50 ? '0' : '1'
      })

      if (!sheenTriggered && p >= PARKED_AT) {
        sheenTriggered = true
        stage!.classList.add('dsw-sheen')
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
        <h2 className="dsw-sr">Das sind wir.</h2>
      </div>
    </section>
  )
}
