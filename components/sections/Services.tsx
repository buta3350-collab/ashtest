import { getVehicleCount } from '@/lib/willhaben'

export default async function Services() {
  const count = await getVehicleCount()
  return (
    <section id="services" aria-label="Unsere Leistungen">
      <div className="svc-shell">

        <h2 className="svc-section-h2 reveal">
          Leistungen.
          <span className="h2-sub">Fahrzeugpflege und Autocenter.</span>
        </h2>

        {/* ── Row 1: Autocenter (text left, art right) ── */}
        <article className="svc-row reveal-left">
          <div className="svc-row-meta">
            <div className="svc-row-eyebrow">
              <span className="svc-row-eyebrow-line" />
              <span>Autocenter</span>
            </div>
            <h3 className="svc-row-h3">
              Gebraucht&shy;wagen<br />
              <em>aus Wolfsberg.</em>
            </h3>
            <p className="svc-row-p">
              Geprüfter Bestand auf unserem Gelände in Wolfsberg.
              Sie suchen ein bestimmtes Modell? Wir finden es.
            </p>
            <div className="svc-row-pills">
              <span className="svc-row-pill">Gebrauchtwagenhandel</span>
              <span className="svc-row-pill">Persönliche Beratung</span>
              <span className="svc-row-pill">Qualitätsgeprüft</span>
              <span className="svc-row-pill">Österreichweit</span>
            </div>
            <a href="/verkauf" className="svc-row-cta" data-autocenter-link="">
              <span>Zum Autocenter</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="svc-row-art svc-row-art-a" aria-hidden="true">
            <div className="svc-art-bgn">01</div>

            <div className="svc-art-index">
              <span className="svc-art-index-n">№ 01</span>
              <span className="svc-art-index-rule" />
              <span className="svc-art-index-label">Bereich</span>
            </div>

            <div className="svc-art-display">
              <h4 className="svc-art-display-h">Autocenter</h4>
              <div className="svc-art-display-rule" />
              <p className="svc-art-display-sub">
                Gebrauchtwagen aus geprüfter Hand. Direkt vom Meister am Drosselweg.
              </p>
            </div>

            <div className="svc-art-spec">
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Bestand</span>
                <span className={count !== null ? 'svc-art-spec-v svc-art-spec-v-live' : 'svc-art-spec-v'}>
                  {count !== null ? `${count} ${count === 1 ? 'Fahrzeug' : 'Fahrzeuge'}` : 'Vor Ort'}
                </span>
              </div>
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Standort</span>
                <span className="svc-art-spec-v">Wolfsberg</span>
              </div>
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Handel</span>
                <span className="svc-art-spec-v">Österreichweit</span>
              </div>
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Beratung</span>
                <span className="svc-art-spec-v">Kostenlos</span>
              </div>
            </div>

          </div>
        </article>

        {/* ── Row 2: Fahrzeugpflege (art left, text right) ── */}
        <article id="reinigung" className="svc-row svc-row-reverse reveal-right">
          <div className="svc-row-art svc-row-art-b" aria-hidden="true">
            <div className="svc-art-bgn">02</div>

            <div className="svc-art-index">
              <span className="svc-art-index-n">№ 02</span>
              <span className="svc-art-index-rule" />
              <span className="svc-art-index-label">Bereich</span>
            </div>

            <div className="svc-art-display">
              <h4 className="svc-art-display-h">Fahrzeugpflege</h4>
              <div className="svc-art-display-rule" />
              <p className="svc-art-display-sub">
                Reinigung, Lackpflege und Keramikversiegelung — alles selbst gemacht.
              </p>
            </div>

            <div className="svc-art-spec">
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Reinigung</span>
                <span className="svc-art-spec-v">Innen &amp; Außen</span>
              </div>
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Lack</span>
                <span className="svc-art-spec-v">Politur · Aufbereitung</span>
              </div>
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Versiegelung</span>
                <span className="svc-art-spec-v">Keramik · 7 Jahre</span>
              </div>
              <div className="svc-art-spec-row">
                <span className="svc-art-spec-k">Termin</span>
                <span className="svc-art-spec-v">Online buchbar</span>
              </div>
            </div>
          </div>

          <div className="svc-row-meta">
            <div className="svc-row-eyebrow">
              <span className="svc-row-eyebrow-line" />
              <span>Fahrzeugpflege</span>
            </div>
            <h3 className="svc-row-h3">
              Reinigung &amp;<br />
              <em>Versiegelung.</em>
            </h3>
            <p className="svc-row-p">
              Innenraum, Lackpflege, Keramikversiegelung.
              Termine nach Absprache. Preis abhängig vom Fahrzeug und Zustand.
            </p>
            <div className="svc-row-pills">
              <span className="svc-row-pill">Innenraumreinigung</span>
              <span className="svc-row-pill">Lackpolitur</span>
              <span className="svc-row-pill">Keramikversiegelung</span>
              <span className="svc-row-pill">Aufbereitung</span>
            </div>
            <button className="svc-row-cta" data-booking-open>
              <span>Termin vereinbaren</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </article>

      </div>
    </section>
  )
}
