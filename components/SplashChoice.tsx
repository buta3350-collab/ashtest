'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SplashChoice() {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(true)
    window.addEventListener('loader-choice', handler)
    return () => window.removeEventListener('loader-choice', handler)
  }, [])

  function choose(dest: 'main' | 'autocenter') {
    if (exiting) return
    setExiting(true)
    if (dest === 'autocenter') {
      setTimeout(() => { window.location.href = '/verkauf' }, 650)
    } else {
      setTimeout(() => {
        setVisible(false)
        document.body.style.overflow = ''
      }, 650)
    }
  }

  function handleKey(e: React.KeyboardEvent, dest: 'main' | 'autocenter') {
    if (e.key === 'Enter' || e.key === ' ') choose(dest)
  }

  if (!visible) return null

  return (
    <div id="splash-choice" className={exiting ? 'sc-exit' : ''} aria-modal="true" role="dialog" aria-label="Bereich wählen">

      <div className="sc-header">
        <Image src="/LOGO_crop.png" alt="Auto Shabani" width={90} height={68} className="sc-logo" priority />
        <div className="sc-header-label">Wählen Sie Ihren Bereich</div>
      </div>

      <div className="sc-panels">

        <div
          className="sc-panel sc-panel-left"
          onClick={() => choose('main')}
          onKeyDown={(e) => handleKey(e, 'main')}
          tabIndex={0}
          role="button"
          aria-label="Zur Hauptseite"
        >
          <div className="sc-bg-glow sc-glow-l" />
          <div className="sc-num">01</div>
          <div className="sc-panel-content">
            <div className="sc-category">Fahrzeugpflege &amp; Service</div>
            <h2 className="sc-title">Hauptseite.</h2>
            <div className="sc-tags">
              <span>Reinigung</span>
              <span className="sc-dot">·</span>
              <span>Pflege</span>
              <span className="sc-dot">·</span>
              <span>Standort</span>
            </div>
            <div className="sc-arrow-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="sc-bottom-line" />
        </div>

        <div className="sc-divider" aria-hidden="true">
          <div className="sc-divider-line" />
        </div>

        <div
          className="sc-panel sc-panel-right"
          onClick={() => choose('autocenter')}
          onKeyDown={(e) => handleKey(e, 'autocenter')}
          tabIndex={0}
          role="button"
          aria-label="Zum Autocenter"
        >
          <div className="sc-bg-glow sc-glow-r" />
          <div className="sc-num">02</div>
          <div className="sc-panel-content sc-content-delay">
            <div className="sc-category">Gebrauchtwagenhandel</div>
            <h2 className="sc-title">Autocenter.</h2>
            <div className="sc-tags">
              <span>Ankauf</span>
              <span className="sc-dot">·</span>
              <span>Verkauf</span>
              <span className="sc-dot">·</span>
              <span>Beratung</span>
            </div>
            <div className="sc-arrow-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="sc-bottom-line" />
        </div>

      </div>
    </div>
  )
}
