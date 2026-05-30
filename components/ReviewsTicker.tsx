'use client'
import { useEffect, useRef } from 'react'
import { reviews } from '@/lib/reviews'

export default function ReviewsTicker() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap   = wrapRef.current
    const ticker = tickerRef.current
    if (!wrap || !ticker) return

    ticker.innerHTML += ticker.innerHTML

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const autoSpeed = reduceMotion ? 0 : 0.15
    let pos = 0, halfWidth = 0
    let isDragging = false, startX = 0, startPos = 0, lastX = 0, lastTime = 0, momentum = 0

    function measure() { halfWidth = ticker!.scrollWidth / 2 }
    function wrapPos() {
      if (halfWidth <= 0) return
      while (pos <= -halfWidth) pos += halfWidth
      while (pos >= 0) pos -= halfWidth
    }
    function tick() {
      if (!isDragging) {
        if (Math.abs(momentum) > 0.1) { pos += momentum; momentum *= 0.94 }
        else pos -= autoSpeed
        wrapPos()
        ticker!.style.transform = `translate3d(${pos}px,0,0)`
      }
      requestAnimationFrame(tick)
    }
    const getX = (e: MouseEvent | TouchEvent) => 'touches' in e ? e.touches[0].clientX : e.clientX
    function onStart(e: MouseEvent | TouchEvent) {
      isDragging = true; momentum = 0
      startX = getX(e); startPos = pos; lastX = startX; lastTime = performance.now()
      ticker!.classList.add('dragging')
    }
    function onMove(e: MouseEvent | TouchEvent) {
      if (!isDragging) return
      const x = getX(e); pos = startPos + (x - startX); wrapPos()
      ticker!.style.transform = `translate3d(${pos}px,0,0)`
      const now = performance.now(); const dt = now - lastTime
      if (dt > 0) momentum = (x - lastX) / dt * 16
      lastX = x; lastTime = now
      if ('touches' in e && e.cancelable) e.preventDefault()
    }
    function onEnd() { if (!isDragging) return; isDragging = false; ticker!.classList.remove('dragging') }

    wrap.addEventListener('touchstart', onStart as EventListener, { passive: true })
    wrap.addEventListener('touchmove',  onMove as EventListener,  { passive: false })
    wrap.addEventListener('touchend',   onEnd)
    wrap.addEventListener('touchcancel',onEnd)
    wrap.addEventListener('mousedown',  (e: MouseEvent) => { e.preventDefault(); onStart(e) })
    window.addEventListener('mousemove', onMove as EventListener)
    window.addEventListener('mouseup',   onEnd)
    window.addEventListener('mouseleave',onEnd)
    window.addEventListener('resize', measure)

    if (document.readyState === 'complete') { measure(); requestAnimationFrame(tick) }
    else window.addEventListener('load', () => { measure(); requestAnimationFrame(tick) })
  }, [])

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

  return (
    <div className="ticker-wrap" ref={wrapRef} aria-label="Bewertungen Karussell">
      <div className="ticker" id="reviewTicker" ref={tickerRef}>
        {reviews.map((r, i) => (
          <div className="rcard" key={i}>
            <div className="rcard-stars">{stars(r.stars)}</div>
            <p className="rcard-text">{r.text}</p>
            <div className="rcard-author">
              <div className="rcard-av" aria-hidden="true">{r.initial}</div>
              <div>
                <div className="rcard-name">{r.name}</div>
                <div className="rcard-src">{r.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
