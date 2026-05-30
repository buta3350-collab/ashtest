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
