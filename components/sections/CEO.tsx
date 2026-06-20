import Image from 'next/image'

export default function CEO() {
  return (
    <section id="ceo" aria-label="Geschäftsführer und Historie">
      <div className="ceo-shell">

        <div className="section-num reveal">
          <span className="section-num-no">07</span>
          <span className="section-num-line" />
          <span className="section-num-label">Unser Geschäftsführer</span>
        </div>
        <div className="ceo-comp">

          {/* ── Portrait column ────────────────────────────── */}
          <figure className="ceo-portrait reveal-left">
            <div className="ceo-portrait-frame">
              <Image
                src="/material/arbeiter/geschaeftsfuehrer/IMG_7658.JPG.jpeg"
                alt="Meister Behar Shabani — Geschäftsführer und Inhaber"
                width={900}
                height={1100}
                quality={100}
                priority
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div className="ceo-portrait-tone" aria-hidden="true" />
            </div>

          </figure>

          {/* ── Editorial column ───────────────────────────── */}
          <div className="ceo-editorial">

            <div className="ceo-title-block reveal-right">
              <h2 className="ceo-display">
                Meister<span className="ceo-display-dot">.</span>
              </h2>
              <div className="ceo-name">
                <span className="ceo-name-line" />
                Behar Shabani
              </div>
            </div>

            <blockquote className="ceo-pullquote reveal-right d1">
              <p className="ceo-pullquote-text">
                <span className="ceo-quote-mark ceo-quote-mark-open" aria-hidden="true">„</span>
                Ich mach das jetzt seit über zwanzig Jahren. Jedes Auto, das hier rausgeht, hab ich mir selber angeschaut. Anders kenne ich es nicht.
                <span className="ceo-quote-mark ceo-quote-mark-close" aria-hidden="true">&ldquo;</span>
              </p>
            </blockquote>

            <p className="ceo-bio reveal-right d2">
              2004 habe ich den Betrieb in Wolfsberg eröffnet. Das Handwerk habe ich
              von Grund auf gelernt und über die Jahre die Meisterprüfung abgelegt.
              Bis heute leite ich beide Bereiche selbst, Fahrzeugpflege und
              Gebrauchtwagenverkauf.
            </p>

            <div className="ceo-spec-head reveal-right d3" aria-hidden="true">
              <span className="ceo-spec-head-line" />
              <span>Steckbrief</span>
            </div>

            <dl className="ceo-spec reveal-right d3">
              <div className="ceo-spec-row">
                <dt>Grad</dt>
                <dd>Geprüfter Meister</dd>
              </div>
              <div className="ceo-spec-row">
                <dt>Erfahrung</dt>
                <dd>22<sup>+</sup> Jahre</dd>
              </div>
              <div className="ceo-spec-row">
                <dt>Standort</dt>
                <dd>Wolfsberg, Kärnten</dd>
              </div>
              <div className="ceo-spec-row">
                <dt>Aktiv seit</dt>
                <dd>2004</dd>
              </div>
            </dl>

          </div>
        </div>

        {/* ── Historie ─────────────────────────────────────── */}
        <div className="ceo-history reveal">
          <div className="ceo-history-head" aria-hidden="true">
            <span className="ceo-history-head-line" />
            <span className="ceo-history-head-label">Historie</span>
            <span className="ceo-history-head-line" />
          </div>

          <ol className="ceo-history-timeline" aria-label="Meilensteine">
            <li className="ceo-history-item reveal d1">
              <div className="ceo-history-year">2004</div>
              <div className="ceo-history-dot" aria-hidden="true" />
              <div className="ceo-history-body">
                <h4 className="ceo-history-title">Eröffnung am Drosselweg</h4>
                <p className="ceo-history-text">
                  Gründung des Betriebs in Wolfsberg.
                  Fahrzeugpflege und Gebrauchtwagenhandel von Anfang an
                  unter einem Dach.
                </p>
              </div>
            </li>

            <li className="ceo-history-item reveal d2">
              <div className="ceo-history-year">Werdegang</div>
              <div className="ceo-history-dot" aria-hidden="true" />
              <div className="ceo-history-body">
                <h4 className="ceo-history-title">Meisterprüfung</h4>
                <p className="ceo-history-text">
                  Behar Shabani absolviert das Handwerk von Grund auf und
                  legt im Laufe der Jahre die Meisterprüfung ab.
                </p>
              </div>
            </li>

            <li className="ceo-history-item reveal d3">
              <div className="ceo-history-year">Konstanz</div>
              <div className="ceo-history-dot" aria-hidden="true" />
              <div className="ceo-history-body">
                <h4 className="ceo-history-title">Zwei Bereiche, ein Standort</h4>
                <p className="ceo-history-text">
                  Beide Bereiche werden seither persönlich vom Meister
                  geführt — keine Subaufträge, keine Filialen.
                </p>
              </div>
            </li>

            <li className="ceo-history-item reveal d4">
              <div className="ceo-history-year">Heute</div>
              <div className="ceo-history-dot ceo-history-dot-now" aria-hidden="true" />
              <div className="ceo-history-body">
                <h4 className="ceo-history-title">22<sup>+</sup> Jahre am Drosselweg</h4>
                <p className="ceo-history-text">
                  Inhabergeführt, am ursprünglichen Standort.
                  Familienbetrieb in Wolfsberg, Kärnten.
                </p>
              </div>
            </li>
          </ol>
        </div>

      </div>
    </section>
  )
}
