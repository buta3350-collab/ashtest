'use client'
import { useEffect, useRef } from 'react'

export default function HeroTrace() {
  const svgRef  = useRef<SVGSVGElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = document.getElementById('hero')
    const card = document.getElementById('hero-map')
    const svg  = svgRef.current
    const hint = hintRef.current
    if (!hero || !card || !svg || !hint) return

    const bg     = svg.querySelector('.ht-bg') as SVGPathElement
    const fg     = svg.querySelector('.ht-fg') as SVGPathElement & { _anim?: Animation }
    const staticLine = svg.querySelector('.ht-static') as SVGPathElement

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let traceComplete = false

    // Single continuous path:
    // bottom-center → CCW card trace → bottom-center → down to scroll-hint
    function buildPath(
      cL: number, cT: number, cW: number, cH: number,
      r: number, bY: number, ax: number, at: number
    ) {
      return (
        `M ${cL + cW / 2} ${bY} ` +
        // CCW around card
        `L ${cL + r} ${bY} A ${r} ${r} 0 0 1 ${cL} ${bY - r} ` +
        `L ${cL} ${cT + r} A ${r} ${r} 0 0 1 ${cL + r} ${cT} ` +
        `L ${cL + cW - r} ${cT} A ${r} ${r} 0 0 1 ${cL + cW} ${cT + r} ` +
        `L ${cL + cW} ${bY - r} A ${r} ${r} 0 0 1 ${cL + cW - r} ${bY} ` +
        // back to bottom-center
        `L ${cL + cW / 2} ${bY} ` +
        // connecting line down to scroll-hint
        `L ${ax} ${bY} L ${ax} ${at}`
      )
    }

    // Gap between line end and the arrow — arrow floats this many px below the line tip
    const GAP = 18

    function buildLinePath(cL: number, cW: number, bY: number, ax: number, at: number) {
      return `M ${cL + cW / 2} ${bY} L ${ax} ${bY} L ${ax} ${at}`
    }

    function buildOrSkip() {
      if (reducedMotion.matches) {
        if (getComputedStyle(card!).display === 'none' || window.innerWidth <= 1100) {
          svg!.style.display = 'none'
          hint!.classList.add('arrived')
          traceComplete = true
          return
        }
        svg!.style.display = ''
        const cR = card!.getBoundingClientRect(), hR = hero!.getBoundingClientRect(), hiR = hint!.getBoundingClientRect()
        const cL = cR.left - hR.left, cT = cR.top - hR.top, cW = cR.width, cH = cR.height, r = 20
        const ax = hiR.left + hiR.width / 2 - hR.left, at = hiR.top - hR.top - GAP, bY = cT + cH
        const d = buildPath(cL, cT, cW, cH, r, bY, ax, at)
        bg.setAttribute('d', d); fg.setAttribute('d', d)
        staticLine.setAttribute('d', buildLinePath(cL, cW, bY, ax, at))
        svg!.setAttribute('viewBox', `0 0 ${hR.width} ${hR.height}`)
        svg!.setAttribute('width', String(hR.width)); svg!.setAttribute('height', String(hR.height))
        fg.style.strokeDasharray = 'none'; fg.style.strokeDashoffset = '0'
        fg.classList.add('done')
        hint!.classList.add('arrived')
        traceComplete = true
        return
      }
      build()
    }

    function build() {
      if (getComputedStyle(card!).display === 'none' || window.innerWidth <= 1100) {
        svg!.style.display = 'none'
        setTimeout(() => hint!.classList.add('arrived'), 400)
        traceComplete = true
        return
      }
      svg!.style.display = ''

      const cR = card!.getBoundingClientRect()
      const hR = hero!.getBoundingClientRect()
      const hiR = hint!.getBoundingClientRect()

      const cL = cR.left - hR.left
      const cT = cR.top  - hR.top
      const cW = cR.width
      const cH = cR.height
      const r  = 20
      const ax     = hiR.left + hiR.width / 2 - hR.left
      const at     = hiR.top  - hR.top
      const atLine = at - GAP  // line tip floats GAP px above the arrow
      const bY     = cT + cH

      const d = buildPath(cL, cT, cW, cH, r, bY, ax, atLine)

      bg.setAttribute('d', d)
      fg.setAttribute('d', d)
      staticLine.setAttribute('d', buildLinePath(cL, cW, bY, ax, atLine))
      svg!.setAttribute('viewBox', `0 0 ${hR.width} ${hR.height}`)
      svg!.setAttribute('width',  String(hR.width))
      svg!.setAttribute('height', String(hR.height))

      const SPEED      = 600   // card trace speed (px/s)
      const LINE_SPEED = 110   // connecting line speed (px/s)

      const total = fg.getTotalLength()
      if (total <= 0) return

      // lineLen = horizontal segment + vertical segment to scroll-hint
      const lineLen = Math.abs(cL + cW / 2 - ax) + Math.abs(bY - atLine)
      const cardLen = total - lineLen

      const dashLen = Math.max(50, total * 0.05)
      fg.setAttribute('stroke-dasharray', `${dashLen} ${total}`)

      if (fg._anim) fg._anim.cancel()
      fg.classList.remove('done')
      fg.style.transition = ''
      fg.style.opacity = ''

      const dur1 = (cardLen  / SPEED)      * 1000  // Phase 1: card trace
      const dur2 = (lineLen  / LINE_SPEED) * 1000  // Phase 2: line to arrow

      // Phase 1: trace card perimeter CCW
      fg._anim = fg.animate(
        [{ strokeDashoffset: '0' }, { strokeDashoffset: -cardLen + 'px' }],
        { duration: dur1, iterations: 1, easing: 'linear', fill: 'forwards' }
      )

      fg._anim.onfinish = () => {
        const a1 = fg._anim!
        // Phase 2: line travels down to scroll-hint
        fg._anim = fg.animate(
          [{ strokeDashoffset: -cardLen + 'px' }, { strokeDashoffset: -total + 'px' }],
          { duration: dur2, iterations: 1, easing: 'linear', fill: 'forwards' }
        )
        a1.cancel()

        fg._anim.onfinish = () => {
          const done = fg._anim!
          fg.style.opacity = '0'
          fg.style.strokeDasharray = 'none'
          fg.style.strokeDashoffset = '0'
          requestAnimationFrame(() => {
            done.cancel()
            fg.classList.add('done')
            requestAnimationFrame(() => {
              fg.style.opacity = ''
              // Line has arrived at arrow — now reveal hint smoothly
              hint!.classList.add('arrived')
            })
          })
          traceComplete = true
        }
      }
    }

    let heroWasHidden = false
    let hideIO: IntersectionObserver | null = null
    if (window.IntersectionObserver) {
      new IntersectionObserver((entries) => {
        const visible = entries[0].isIntersecting
        if (!visible) {
          heroWasHidden = true
        } else if (heroWasHidden && !traceComplete) {
          heroWasHidden = false
          buildOrSkip()
        } else {
          heroWasHidden = false
        }
      }, { threshold: 0.2 }).observe(hero)

      // Hide/show both SVG and hint together when hero scrolls out of view
      hideIO = new IntersectionObserver((entries) => {
        const visible = entries[0].isIntersecting
        svg!.classList.toggle('hide', !visible)
        hint!.classList.toggle('hide', !visible)
      }, { threshold: 0 })
      hideIO.observe(hero)
    }

    // Start trace only once the SVG has faded in (heroTraceFadeIn runs at 3.4s delay).
    // Using animationend so timing is exact regardless of load speed.
    let started = false
    let fallback: ReturnType<typeof setTimeout>

    function startTrace() {
      if (started) return
      started = true
      clearTimeout(fallback)
      svg!.classList.add('active')   // fade SVG in via CSS transition
      hint!.classList.add('show')    // fancy blur+slide fade-in
      buildOrSkip()
    }

    // Start trace as soon as the loader fades out (not on a hardcoded timer)
    const loaderEl = document.getElementById('loader')
    if (loaderEl) {
      const mo = new MutationObserver(() => {
        if (loaderEl.classList.contains('out')) {
          mo.disconnect()
          // 900ms = loader fade-out duration, so trace starts when loader is gone
          fallback = setTimeout(startTrace, 920)
        }
      })
      mo.observe(loaderEl, { attributes: true, attributeFilter: ['class'] })
    }
    // Hard fallback in case loader is already gone or MutationObserver misses it
    fallback = setTimeout(startTrace, 3800)

    // ResizeObserver fires once immediately on .observe() — skip that initial call.
    // Only rebuild when the card actually changes size after the trace has started.
    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        if (started) buildOrSkip()
      }).observe(card)
    }
    window.addEventListener('resize', buildOrSkip, { passive: true })

    return () => {
      clearTimeout(fallback)
      hideIO?.disconnect()
      window.removeEventListener('resize', buildOrSkip)
    }
  }, [])

  return (
    <>
      <svg id="hero-trace" ref={svgRef} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path className="ht-bg"/>
        <path className="ht-static"/>
        <path className="ht-fg"/>
      </svg>
      <div
        ref={hintRef}
        className="scroll-hint"
        role="button"
        tabIndex={0}
        aria-label="Nach unten scrollen"
        onClick={() => {
          const t = document.getElementById('about')
          if (t) t.scrollIntoView({ behavior: 'smooth' })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            const t = document.getElementById('about')
            if (t) t.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        <svg viewBox="0 0 54 28" className="scroll-hint-arrow-svg" xmlns="http://www.w3.org/2000/svg">
          <path className="hint-arrow" d="M 17 5 L 27 18 L 37 5"/>
        </svg>
        <span className="scroll-hint-text">Runter scrollen</span>
      </div>
    </>
  )
}
