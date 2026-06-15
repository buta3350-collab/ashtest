'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { useNavScroll } from '@/hooks/useNavScroll'
import { useColorMode } from '@/hooks/useColorMode'

const NAV_ITEMS = [
  {
    label: 'Über uns',
    href: '#ceo',
    sub: [
      { label: 'Unternehmen',     sub: 'Auto Shabani seit 2004',         href: '#about' },
      { label: 'Geschäftsführer', sub: 'Meister Behar Shabani',          href: '#ceo'   },
    ],
  },
  {
    label: 'Leistungen',
    href: '#vehicles',
    sub: [
      { label: 'Autocenter',           sub: 'Geprüfter Bestand in Wolfsberg',    href: '#autocenter' },
      { label: 'Reinigung & Versiegelung', sub: 'Lackpflege & Keramikversiegelung', href: '#pflege' },
    ],
  },
  { label: 'Bewertungen', href: '#reviews' },
]

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState<string | null>(null)
  const { toggle } = useColorMode()

  useNavScroll(navRef)

  function toggleMenu() {
    setMenuOpen((prev) => {
      document.body.style.overflow = prev ? '' : 'hidden'
      return !prev
    })
  }

  function closeMenu() {
    setMenuOpen(false)
    setMobileOpen(null)
    document.body.style.overflow = ''
  }

  return (
    <>
      <nav id="nav" ref={navRef} aria-label="Hauptnavigation">
        <div className="nav-inner">
          <a href="#hero" aria-label="Zur Startseite">
            <Image className="nav-logo" src="/LOGO_crop.png" alt="Auto Shabani" width={260} height={100} style={{ height: 100, width: 'auto', objectFit: 'contain' }} priority />
          </a>
          <div className="nav-r">
            {NAV_ITEMS.map((item, idx) => (
              <div key={item.label} style={{ display: 'contents' }}>
                {idx > 0 && <span className="nav-sep" aria-hidden="true">|</span>}
                {item.sub ? (
                  <div className="nav-item">
                    <button className="nav-link nav-link-has-drop">
                      <span>{item.label}</span>
                      <svg className="nav-chevron" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="nav-dropdown" role="menu">
                      {item.sub.map((s) => (
                        <a key={s.href} href={s.href} className="nav-drop-item" role="menuitem">
                          <span className="nav-drop-accent" aria-hidden="true" />
                          <span className="nav-drop-text">
                            <span className="nav-drop-label">{s.label}</span>
                            <span className="nav-drop-sub">{s.sub}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a href={item.href} className="nav-link">{item.label}</a>
                )}
              </div>
            ))}
            <a href="#cta" className="nav-btn">Kontakt</a>
            <button id="mode-toggle" onClick={toggle} aria-label="Darstellung wechseln">
              <svg className="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              <svg className="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            </button>
          </div>
        </div>
        <div className="nav-pill-icon" aria-hidden="true">
          <Image src="/LOGO_crop.png" alt="Auto Shabani" width={110} height={34} style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
          <div className="nav-pill-icon-dots">
            <span/><span/><span/>
          </div>
        </div>
        <button
          id="ham"
          onClick={toggleMenu}
          aria-label="Menü öffnen"
          aria-expanded={menuOpen}
          className={menuOpen ? 'open' : ''}
        >
          <span/><span/><span/>
        </button>
      </nav>

      <div id="mob-menu" className={menuOpen ? 'open' : ''} role="dialog" aria-label="Mobile Navigation">
        {NAV_ITEMS.map((item) =>
          item.sub ? (
            <div key={item.label} className="mob-item">
              <button
                className={`mob-item-btn${mobileOpen === item.label ? ' mob-open' : ''}`}
                onClick={() => setMobileOpen(p => p === item.label ? null : item.label)}
                aria-expanded={mobileOpen === item.label}
              >
                <span>{item.label}</span>
                <svg className="mob-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <div className={`mob-sub${mobileOpen === item.label ? ' mob-sub-open' : ''}`}>
                {item.sub.map((s) => (
                  <a key={s.href} href={s.href} onClick={closeMenu} className="mob-sub-link">
                    <span className="mob-sub-label">{s.label}</span>
                    <span className="mob-sub-desc">{s.sub}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}</a>
          )
        )}
        <a href="#cta" onClick={closeMenu} style={{ color: 'var(--red)' }}>Kontakt</a>
      </div>
    </>
  )
}
