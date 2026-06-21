'use client'
import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'vehicles',   no: '02', label: 'Bereiche' },
  { id: 'autocenter', no: '03', label: 'Autocenter' },
  { id: 'pflege',     no: '04', label: 'Fahrzeugpflege' },
  { id: 'process',    no: '05', label: 'Ablauf' },
  { id: 'about',      no: '06', label: 'Unser Standort' },
  { id: 'ceo',        no: '07', label: 'Der Geschäftsführer' },
  { id: 'reviews',    no: '08', label: 'Die Bewertungen' },
  { id: 'cta',        no: '09', label: 'Kontakt' },
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
