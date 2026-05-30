'use client'
import { useEffect, useRef, useState } from 'react'

const vidSources = [
  '/material/videos/IMG_7473.mp4',
  '/material/videos/IMG_7883.mp4',
  '/material/videos/IMG_7895.mp4',
]

const IconPflege = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c0 0-7 7.5-7 12a7 7 0 0014 0c0-4.5-7-12-7-12z" />
    <path d="M9.5 16.5a3.5 3.5 0 005 0" />
    <path d="M19.5 4.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" />
  </svg>
)
const IconAutocenter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 11l2-5h10l2 5" />
    <rect x="2" y="11" width="20" height="7" rx="1" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M2 15h20" />
  </svg>
)

const GROUPS = [
  {
    name: 'Fahrzeugpflege',
    Icon: IconPflege,
    items: [
      'Profi-Pflegeprodukte aus dem Fachhandel',
      'Keramikversiegelung mit 7 Jahren Garantie',
      'Abnahme persönlich durch den Meister',
    ],
  },
  {
    name: 'Autocenter',
    Icon: IconAutocenter,
    items: [
      'Gebrauchtwagen aus geprüftem Bestand',
      'Beratung ohne Verkaufsdruck',
      'Eigener Standort am Drosselweg seit 2004',
    ],
  },
] as const

export default function Vehicles() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [curIdx, setCurIdx] = useState(0)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.muted = true
    const attempt = () => { const p = vid.play(); if (p) p.catch(() => {}) }
    attempt()
    vid.addEventListener('loadeddata', attempt, { once: true })
    vid.addEventListener('canplay',    attempt, { once: true })
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) attempt() }) },
      { threshold: 0.05 }
    )
    io.observe(vid)
    const onEnded = () => setCurIdx((prev) => (prev + 1) % vidSources.length)
    vid.addEventListener('ended', onEnded)
    return () => { io.disconnect(); vid.removeEventListener('ended', onEnded) }
  }, [])

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.src = vidSources[curIdx]
    vid.muted = true
    vid.load()
    vid.addEventListener('canplay',    () => vid.play().catch(() => {}), { once: true })
    vid.addEventListener('loadeddata', () => vid.play().catch(() => {}), { once: true })
  }, [curIdx])

  return (
    <section id="vehicles" aria-label="Qualität & Vertrauen">
      <div className="veh-shell">

        {/* Hero — manifesto + showreel */}
        <div className="veh-hero">

          <div className="veh-hero-text reveal-left">
            <h2 className="veh-h2">
              Zwei Bereiche.
              <span className="veh-h2-accent">Ein Ansprechpartner</span>
              <span className="h2-sub">für Verkauf und Pflege.</span>
            </h2>
            <p className="veh-credo">
              Wir machen zwei Dinge: Autos <em>verkaufen</em> und Autos <em>pflegen</em>.
              Beides selbst, beides in Wolfsberg.
            </p>
            <div className="veh-credo-sig">
              <span className="veh-credo-sig-line" />
              Drosselweg 1 · 9400 Wolfsberg · Seit 2004
            </div>
          </div>

          <div className="veh-video reveal-right">
            <div className="veh-video-frame">
              <video
                ref={videoRef}
                id="showcase-video"
                autoPlay muted playsInline preload="auto"
                aria-hidden="true"
                src={vidSources[0]}
              />
              <div className="veh-video-vignette" aria-hidden="true" />
              <div className="veh-video-corner veh-video-corner-tl" aria-hidden="true" />
              <div className="veh-video-corner veh-video-corner-tr" aria-hidden="true" />
              <div className="veh-video-corner veh-video-corner-bl" aria-hidden="true" />
              <div className="veh-video-corner veh-video-corner-br" aria-hidden="true" />
              <div className="veh-video-stamp" aria-hidden="true">
                <span className="veh-video-stamp-dot" /> Aus der Werkstatt · {curIdx + 1} / {vidSources.length}
              </div>
            </div>
            <div className="veh-video-dots" aria-label="Video auswählen">
              {vidSources.map((_, i) => (
                <button
                  key={i}
                  className={`veh-video-dot${curIdx === i ? ' active' : ''}`}
                  aria-label={`Video ${i + 1}`}
                  onClick={() => setCurIdx(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Credentials — grouped */}
        <div className="veh-creds reveal">
          <div className="veh-creds-head" aria-hidden="true">
            <span className="veh-creds-head-line" />
            <span className="veh-creds-head-label">Vorteile</span>
            <span className="veh-creds-head-line" />
          </div>

          <div className="veh-creds-groups">
            {GROUPS.map((group, gi) => (
              <div key={group.name} className={`veh-cred-group reveal d${gi + 1}`}>
                <div className="veh-cred-group-head">
                  <span className="veh-cred-group-icon">
                    <group.Icon />
                  </span>
                  <h3 className="veh-cred-group-name">{group.name}</h3>
                </div>
                <ul className="veh-cred-list">
                  {group.items.map((text, i) => (
                    <li key={i} className="veh-cred-item">
                      <span className="veh-cred-item-mark" aria-hidden="true" />
                      <span className="veh-cred-item-text">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
