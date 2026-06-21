import Image from 'next/image'

export default function Hero() {
  return (
    <section id="hero" aria-label="Willkommen bei Auto Shabani">

      <div className="hero-aura-spark" aria-hidden="true" />

      <div id="hero-content">

        <div className="hero-eyebrow">
          Wolfsberg, Kärnten. Inhabergeführt seit 2004.
        </div>

        <div className="hero-label">Autoreinigung &amp; Autocenter</div>

        <h1 className="hero-h1"><em>Shabani</em></h1>

        <p className="hero-sub">
          Gebrauchtwagen und Fahrzeugpflege im Familienbetrieb
          am Drosselweg 1 in Wolfsberg, seit 2004.
        </p>

        <div className="hero-actions">
          <a href="#vehicles" className="hero-btn-primary">
            <span>Leistungen entdecken</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#cta" className="hero-btn-ghost">
            <span>Kontakt aufnehmen</span>
          </a>
        </div>

        <a href="#vehicles" className="hero-scroll" aria-label="Weiter zur Übersicht scrollen">
          <span className="hero-scroll-label">Runter scrollen</span>
          <svg className="hero-scroll-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </a>

      </div>

      <aside id="hero-map" aria-label="Unser Standort">
        <div className="hero-photo">
          <Image
            src="/material/firmenstandort/firma.png"
            alt="Firmengelände Auto Shabani Wolfsberg"
            fill
            sizes="(min-width: 1200px) 820px, 0px"
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            priority
            quality={90}
          />
        </div>
        <div className="hero-photo-fade" aria-hidden="true" />

        <div className="hero-photo-caption">
          <span className="hero-caption-icon-wrap">
            <svg className="hero-photo-caption-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </span>
          <h3 className="hero-photo-caption-name">Unser Standort</h3>
          <p className="hero-photo-caption-addr">Drosselweg 1 · 9400 Wolfsberg</p>
          <div className="hero-photo-caption-links">
            <a
              href="https://maps.google.com/?q=Drosselweg+1,+9400+Wolfsberg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Google G icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Maps
            </a>
            <a
              href="https://maps.apple.com/?q=Drosselweg+1,+9400+Wolfsberg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Apple logo icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple Maps
            </a>
          </div>
        </div>
      </aside>

    </section>
  )
}
