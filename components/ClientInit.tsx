'use client'
import { useEffect } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ClientInit() {
  useScrollReveal()

  useEffect(() => {
    const t = setTimeout(() => {
      const em = document.querySelector<HTMLElement>('.hero-h1 em')
      if (!em) return
      em.classList.add('sheen-play')
      em.addEventListener('animationend', () => em.classList.remove('sheen-play'), { once: true })
    }, 3400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const aboutSec = document.getElementById('about')
    if (!aboutSec) return

    const ao = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.querySelectorAll<HTMLElement>('.about-card-n[data-val]').forEach((el) => {
            const num = parseFloat(el.dataset.val!)
            if (isNaN(num)) return
            const sup = el.querySelector('sup')
            const supHtml = sup ? sup.outerHTML : ''
            const isFloat = el.dataset.val!.includes('.')
            let start: number | null = null
            const dur = 2000
            const tick = (ts: number) => {
              if (!start) start = ts
              const prog = Math.min((ts - start) / dur, 1)
              const eased = 1 - Math.pow(1 - prog, 3)
              const val = isFloat
                ? (eased * num).toFixed(1).replace('.', ',')
                : Math.floor(eased * num)
              el.innerHTML = val + supHtml
              if (prog < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          })
          ao.unobserve(e.target)
        })
      },
      { threshold: 0.3 }
    )
    ao.observe(aboutSec)
    return () => ao.disconnect()
  }, [])

  useEffect(() => {
    function handleAnchor(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth' })
      history.pushState(null, '', window.location.pathname)
    }
    document.addEventListener('click', handleAnchor)
    return () => document.removeEventListener('click', handleAnchor)
  }, [])

  useEffect(() => {
    if (!window.matchMedia) return
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (localStorage.getItem('shabani-modus')) return
      document.documentElement.classList.toggle('light', e.matches)
    })
  }, [])

  // Hero cursor spotlight — smooth lerp follow, only runs when needed
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    let rafId: number | null = null
    let targetX = 30, targetY = 50
    let curX = 30, curY = 50
    let active = false

    function loop() {
      const dx = targetX - curX
      const dy = targetY - curY
      curX += dx * 0.07
      curY += dy * 0.07
      hero!.style.setProperty('--mx', curX + '%')
      hero!.style.setProperty('--my', curY + '%')
      // Stop loop once converged AND not actively tracking
      if (!active && Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        rafId = null
        return
      }
      rafId = requestAnimationFrame(loop)
    }
    function ensureLoop() {
      if (rafId == null) rafId = requestAnimationFrame(loop)
    }
    function onMove(e: MouseEvent) {
      const rect = hero!.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / rect.width) * 100
      targetY = ((e.clientY - rect.top) / rect.height) * 100
      active = true
      if (!hero!.classList.contains('hero-cursor-active')) {
        hero!.classList.add('hero-cursor-active')
      }
      ensureLoop()
    }
    function onLeave() {
      targetX = 30
      targetY = 50
      active = false
      hero!.classList.remove('hero-cursor-active')
      ensureLoop()
    }
    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Pause background animations when scrolled out of Hero (frees GPU)
  useEffect(() => {
    const hero = document.getElementById('hero')
    const smoke = document.getElementById('red-smoke')
    if (!hero) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const paused = !e.isIntersecting
          hero!.style.setProperty('--anim-state', paused ? 'paused' : 'running')
          if (smoke) smoke.style.setProperty('--anim-state', paused ? 'paused' : 'running')
        })
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const overlay = document.getElementById('page-transition')
    if (!overlay) return
    function handleAutocenter(e: Event) {
      const link = (e.currentTarget as HTMLAnchorElement)
      e.preventDefault()
      const href = link.getAttribute('href') || '/verkauf'
      overlay!.classList.add('active')
      document.body.style.overflow = 'hidden'
      sessionStorage.setItem('shabani-from-transition', '1')
      setTimeout(() => { window.location.href = href }, 3900)
    }
    const links = document.querySelectorAll<HTMLAnchorElement>('[data-autocenter-link]')
    links.forEach(l => l.addEventListener('click', handleAutocenter))
    return () => links.forEach(l => l.removeEventListener('click', handleAutocenter))
  }, [])

  return null
}
