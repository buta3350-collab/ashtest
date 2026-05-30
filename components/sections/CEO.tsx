import Image from 'next/image'

export default function CEO() {
  return (
    <section id="ceo" aria-label="Über den Geschäftsführer">
      <div className="ceo-shell">

        <div className="section-num reveal">
          <span className="section-num-no">02</span>
          <span className="section-num-line" />
          <span className="section-num-label">Meister</span>
        </div>
        <div className="ceo-rule reveal" aria-hidden="true">
          <span className="ceo-rule-line" />
          <span className="ceo-rule-label">Geschäftsführer &amp; Inhaber</span>
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
      </div>
    </section>
  )
}
