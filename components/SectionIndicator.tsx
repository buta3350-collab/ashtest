'use client'
import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'about',    no: '01', label: 'Standort' },
  { id: 'ceo',      no: '02', label: 'Meister' },
  { id: 'vehicles', no: '03', label: 'Fahrzeuge' },
  { id: 'services', no: '04', label: 'Leistungen' },
  { id: 'process',  no: '05', label: 'Ablauf' },
  { id: 'reviews',  no: '06', label: 'Stimmen' },
  { id: 'cta',      no: '07', label: 'Kontakt' },
] as const

export default function SectionIndicator() {
  const [active, setActive] = useState<string>('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={`section-indicator ${show ? 'si-show' : ''}`} aria-label="Seitennavigation">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`si-item ${active === s.id ? 'active' : ''}`}
          aria-label={`Zu ${s.label}`}
        >
          <span className="si-label">{s.label}</span>
          <span className="si-tick" />
          <span className="si-no">{s.no}</span>
        </a>
      ))}
    </nav>
  )
}
