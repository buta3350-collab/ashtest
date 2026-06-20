import ReviewsTicker from '@/components/ReviewsTicker'

export default function Reviews() {
  return (
    <section id="reviews" aria-label="Kundenbewertungen">
      <div className="rev-shell">

        <div className="rev-hero">

          <div className="rev-hero-text reveal-left">
            <div className="section-num reveal">
              <span className="section-num-no">08</span>
              <span className="section-num-line" />
              <span className="section-num-label">Unsere Stimmen</span>
            </div>
            <h2 className="rev-h2">
              Kundenstimmen.
              <span className="h2-sub">Ungekürzt aus Google Maps.</span>
            </h2>
            <p className="rev-credo">
              Was unsere Kunden geschrieben haben — Wort für Wort, wie es bei Google steht.
            </p>
            <div className="rev-credo-sig">
              <span className="rev-credo-sig-line" />
              Quelle: Google Maps · Autoreinigung Shabani
            </div>
          </div>

          <aside className="rev-rating reveal-right">

            <div className="rev-rating-head" aria-hidden="true">
              <span className="rev-rating-head-line" />
              <span>Gesamtbewertung</span>
            </div>

            <div className="rev-rating-n">
              4<span className="rev-rating-comma">,</span>6
            </div>

            <div className="rev-rating-stars" role="img" aria-label="4,6 von 5 Sternen">
              <div className="rev-rating-stars-bg">★★★★★</div>
              <div className="rev-rating-stars-fg" style={{ width: '92%' }}>★★★★★</div>
            </div>

            <div className="rev-rating-meta">
              <div className="rev-rating-meta-row">
                <span className="rev-rating-meta-k">Total</span>
                <span className="rev-rating-meta-v">57 Reviews</span>
              </div>
              <div className="rev-rating-meta-row">
                <span className="rev-rating-meta-k">Quelle</span>
                <span className="rev-rating-meta-v">Google Maps</span>
              </div>
              <div className="rev-rating-meta-row">
                <span className="rev-rating-meta-k">Stand</span>
                <span className="rev-rating-meta-v">Mai 2026</span>
              </div>
            </div>

            <a
              className="rev-rating-link"
              href="https://www.google.com/maps/search/Autoreinigung+Autocenter+Shabani+Wolfsberg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Alle Bewertungen lesen</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </aside>

        </div>

        <ReviewsTicker />

        <div className="rev-badge reveal">
          <div className="rev-badge-l">
            <svg className="rev-badge-icon" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <div className="rev-badge-text">
              <div className="rev-badge-tag">Google Verified</div>
              <div className="rev-badge-meta">
                <span className="rev-badge-stars">
                  <span className="rev-badge-stars-bg">★★★★★</span>
                  <span className="rev-badge-stars-fg" style={{ width: '92%' }}>★★★★★</span>
                </span>
                <strong className="rev-badge-rating">4,6</strong>
                <span className="rev-badge-sep">/</span>
                <span className="rev-badge-count">57 Bewertungen</span>
              </div>
            </div>
          </div>
          <a
            className="rev-badge-cta"
            href="https://www.google.com/maps/search/Autoreinigung+Autocenter+Shabani+Wolfsberg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Bewertung abgeben</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
