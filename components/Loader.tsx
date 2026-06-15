'use client'
import { useEffect } from 'react'
import Image from 'next/image'

export default function Loader() {
  useEffect(() => {
    const fromTransition = sessionStorage.getItem('shabani-from-transition') === '1'
    sessionStorage.removeItem('shabani-from-transition')
    const duration = fromTransition ? 600 : 2400
    document.body.style.overflow = 'hidden'
    const onLoad = () => {
      setTimeout(() => {
        const loader = document.getElementById('loader')
        if (loader) loader.classList.add('out')
        document.body.style.overflow = ''
      }, duration)
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div id="loader" role="status" aria-label="Seite wird geladen">
      <div id="loader-inner">
        <div id="loader-logo-wrap">
          <div id="loader-glow" />
          <div id="loader-glow2" />
          <div id="loader-wheel" aria-hidden="true">
            <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="150" r="142" fill="#141414" stroke="#222" strokeWidth="2"/>
              <circle cx="150" cy="150" r="136" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="8" strokeDasharray="10 7"/>
              <circle cx="150" cy="150" r="118" fill="#0f0f0f" stroke="rgba(255,255,255,.14)" strokeWidth="2"/>
              <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1.5"/>
              <line x1="150" y1="150" x2="150" y2="38" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="254" y2="116" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="214" y2="239" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="86"  y2="239" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="46"  y2="116" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="150" y2="38" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="254" y2="116" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="214" y2="239" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="86"  y2="239" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
              <line x1="150" y1="150" x2="46"  y2="116" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="150" cy="150" r="26" fill="#e30613" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
              <circle cx="150" cy="150" r="14" fill="rgba(0,0,0,.5)" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
              <circle cx="150" cy="150" r="5" fill="rgba(255,255,255,.3)"/>
            </svg>
          </div>
          <Image
            src="/LOGO_crop.png"
            alt="Auto Shabani Logo"
            width={200}
            height={150}
            style={{ height: 150, width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 3 }}
            priority
          />
        </div>
        <div id="loader-word">
          <span className="lw">Autocenter</span>
          <span className="ld">·</span>
          <span className="lw">Fahrzeugpflege</span>
        </div>
        <div id="loader-line" />
      </div>
    </div>
  )
}
