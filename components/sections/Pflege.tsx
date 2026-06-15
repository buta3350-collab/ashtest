export default function Pflege() {
  return (
    <section id="pflege" aria-label="Fahrzeugpflege — Reinigung &amp; Versiegelung">
      <div className="pfl-shell">

        <div className="section-icon reveal" aria-hidden="true">
          <span className="section-icon-top" />
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c0 0-7 7.5-7 12a7 7 0 0014 0c0-4.5-7-12-7-12z" />
            <path d="M9.5 16.5a3.5 3.5 0 005 0" />
            <path d="M19.2 5.3l.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4z" />
          </svg>
        </div>
        <div className="section-num reveal">
          <span className="section-num-no">04</span>
          <span className="section-num-line" />
          <span className="section-num-label">Pflege</span>
        </div>
        <h2 className="pfl-h2 reveal">
          Reinigung &amp;<br />
          <em>Versiegelung.</em>
          <span className="h2-sub">Selbst aufbereitet — vom Meister abgenommen.</span>
        </h2>

        <div className="pfl-grid">

          {/* ── Linke Spalte: Manifest + CTA ───────────────────────── */}
          <div className="pfl-manifest reveal-left">
            <p className="pfl-lede">
              Innenraumreinigung, Lackpflege, Keramikversiegelung — alles im eigenen Haus,
              ohne Subauftrag. Sie bringen das Fahrzeug, wir machen den Rest.
            </p>

            <div className="pfl-pills">
              <span className="pfl-pill">Innenraumreinigung</span>
              <span className="pfl-pill">Außenwäsche</span>
              <span className="pfl-pill">Lackpolitur</span>
              <span className="pfl-pill">Keramikversiegelung</span>
              <span className="pfl-pill">Lederpflege</span>
              <span className="pfl-pill">Felgenreinigung</span>
              <span className="pfl-pill">Geruchsneutralisation</span>
              <span className="pfl-pill">Aufbereitung</span>
            </div>

            <div className="pfl-actions">
              <button className="pfl-cta-main" data-booking-open>
                <span>Termin vereinbaren</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <a className="pfl-cta-tel" href="tel:+436641060411" aria-label="Anrufen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +43 664 1060411
              </a>
            </div>

            <div className="pfl-meta">
              <div className="pfl-meta-row">
                <span className="pfl-meta-k">Standort</span>
                <span className="pfl-meta-v">Drosselweg 1 · Wolfsberg</span>
              </div>
              <div className="pfl-meta-row">
                <span className="pfl-meta-k">Termine</span>
                <span className="pfl-meta-v">Mo–Fr 08:00–19:00 · Sa 08:00–14:00</span>
              </div>
              <div className="pfl-meta-row">
                <span className="pfl-meta-k">Preise</span>
                <span className="pfl-meta-v">Nach Fahrzeug &amp; Zustand</span>
              </div>
            </div>
          </div>

          {/* ── Rechte Spalte: Spec-Card ───────────────────────────── */}
          <aside className="pfl-spec reveal-right" aria-label="Leistungsübersicht">
            <div className="pfl-spec-head">
              <span className="pfl-spec-head-line" />
              <span className="pfl-spec-head-label">Leistungsumfang</span>
            </div>

            <div className="pfl-spec-block">
              <div className="pfl-spec-block-title">
                <span className="pfl-spec-block-no">01</span>
                <span>Innenraum</span>
              </div>
              <p className="pfl-spec-block-text">
                Sitze, Teppich, Himmel, Lederpflege, Geruchsneutralisation.
                Bei Bedarf Tiefenreinigung mit Extraktion.
              </p>
            </div>

            <div className="pfl-spec-block">
              <div className="pfl-spec-block-title">
                <span className="pfl-spec-block-no">02</span>
                <span>Lack &amp; Außen</span>
              </div>
              <p className="pfl-spec-block-text">
                Vorwäsche, Politur, Aufbereitung. Felgenreinigung,
                Kunststoff- und Glaspflege inklusive.
              </p>
            </div>

            <div className="pfl-spec-block">
              <div className="pfl-spec-block-title">
                <span className="pfl-spec-block-no">03</span>
                <span>Keramikversiegelung</span>
              </div>
              <p className="pfl-spec-block-text">
                Profi-Versiegelung mit <strong>bis zu 7 Jahren Garantie</strong>.
                Schützt Lack vor UV, Wasser und Verschmutzung.
              </p>
            </div>

            <div className="pfl-spec-foot">
              <span className="pfl-spec-foot-dot" />
              Alle Schritte selbst ausgeführt — keine Subaufträge.
            </div>
          </aside>

        </div>

      </div>
    </section>
  )
}
