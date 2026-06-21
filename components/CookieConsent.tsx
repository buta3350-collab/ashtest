'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [state, setState] = useState<'hidden' | 'visible' | 'closing'>('hidden')

  useEffect(() => {
    const consent = localStorage.getItem('shabani-cookie-consent')
    if (!consent) {
      const t = setTimeout(() => setState('visible'), 2600)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss(choice: 'accepted' | 'declined') {
    localStorage.setItem('shabani-cookie-consent', choice)
    setState('closing')
    setTimeout(() => setState('hidden'), 480)
  }

  if (state === 'hidden') return null

  return (
    <div id="cookie-banner" className={state === 'closing' ? 'closing' : ''} role="dialog" aria-label="Cookie-Hinweis">
      <div id="cookie-inner">
        <div id="cookie-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="8" cy="8" r="1" fill="currentColor"/>
            <circle cx="16" cy="9" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div id="cookie-text">
          <p id="cookie-title">Cookie-Hinweis</p>
          <p id="cookie-desc">
            Wir verwenden ausschließlich technisch notwendige Cookies (Darstellung &amp; Seitenübergänge). Kein Tracking, keine Werbung.{' '}
            <Link href="/cookies">Mehr erfahren</Link>
          </p>
        </div>
        <div id="cookie-actions">
          <button className="cookie-btn-decline" onClick={() => dismiss('declined')}>Ablehnen</button>
          <button className="cookie-btn-accept" onClick={() => dismiss('accepted')}>Akzeptieren</button>
        </div>
      </div>
    </div>
  )
}
