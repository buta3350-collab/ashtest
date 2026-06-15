const FOUNDED_YEAR = 2004

export default function About() {
  const yearsActive = new Date().getFullYear() - FOUNDED_YEAR
  return (
    <section id="about">
      <div className="about-shell">

        <div className="about-hero">
          <div className="about-hero-text reveal-left">
            <div className="section-num reveal">
              <span className="section-num-no">06</span>
              <span className="section-num-line" />
              <span className="section-num-label">Standort</span>
            </div>
            <h2 className="about-h2">
              Drosselweg 1,<br />
              Wolfsberg.
              <span className="h2-sub">Inhabergeführt seit 2004.</span>
            </h2>
            <p className="about-p">
              Behar Shabani hat den Betrieb 2004 eröffnet und führt ihn bis heute selbst —
              beim Verkauf wie bei der Pflege. Der Standort in Wolfsberg ist seither
              unverändert geblieben.
            </p>
            <div className="about-sig">
              <span className="about-sig-line" />
              <span>Inhabergeführt · Wolfsberg, Kärnten</span>
            </div>
          </div>

          <aside className="about-marquee reveal-right">
            <div className="about-marquee-n">
              {yearsActive}<sup>+</sup>
            </div>
            <div className="about-marquee-divider" />
            <div className="about-marquee-meta">
              <div className="about-marquee-label">Jahre</div>
              <div className="about-marquee-sub">am selben Standort</div>
            </div>
          </aside>
        </div>

        <div className="about-strip">
          <div className="about-strip-item reveal d1">
            <div className="about-strip-n">57</div>
            <div className="about-strip-l">Google Reviews</div>
          </div>
          <div className="about-strip-sep" aria-hidden="true" />
          <div className="about-strip-item reveal d2">
            <div className="about-strip-n">4,6<sup>★</sup></div>
            <div className="about-strip-l">Ø Bewertung</div>
          </div>
          <div className="about-strip-sep" aria-hidden="true" />
          <div className="about-strip-item reveal d3">
            <div className="about-strip-n">2004</div>
            <div className="about-strip-l">Gegründet</div>
          </div>
        </div>

      </div>
    </section>
  )
}
