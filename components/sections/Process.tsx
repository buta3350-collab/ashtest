const IconPflege = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c0 0-7 7.5-7 12a7 7 0 0014 0c0-4.5-7-12-7-12z" />
    <path d="M9.5 16.5a3.5 3.5 0 005 0" />
    <path d="M19.5 4.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" />
  </svg>
)

const IconAutocenter = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 11l2-5h10l2 5" />
    <rect x="2" y="11" width="20" height="7" rx="1" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M2 15h20" />
  </svg>
)

const TRACKS = [
  {
    name: 'Fahrzeugpflege',
    Icon: IconPflege,
    steps: [
      { n: '01', title: 'Termin vereinbaren', text: 'Anruf oder WhatsApp genügt. Wir finden einen Termin, der in Ihre Woche passt.' },
      { n: '02', title: 'Fahrzeug bringen', text: 'Sie bringen das Auto am Termintag an den Drosselweg. Vor Ort besprechen wir kurz den Umfang.' },
      { n: '03', title: 'Fahrzeug abholen', text: 'Sobald wir fertig sind, melden wir uns. Meist am selben oder am nächsten Werktag.' },
    ],
  },
  {
    name: 'Autocenter',
    Icon: IconAutocenter,
    steps: [
      { n: '01', title: 'Bestand ansehen', text: 'Im Autocenter-Bereich sehen Sie unseren aktuellen Bestand mit Bildern und allen wichtigen Daten.' },
      { n: '02', title: 'Termin buchen', text: 'Wenn ein Fahrzeug passt: Sie wählen einen Besichtigungstermin und hinterlassen Ihre Kontaktdaten.' },
      { n: '03', title: 'Vor Ort prüfen', text: 'Sie sehen sich das Fahrzeug in Ruhe an, machen eine Probefahrt. Wenn es passt, klären wir die Abwicklung direkt.' },
    ],
  },
] as const

export default function Process() {
  return (
    <section id="process">
      <div className="proc-shell">

        <div className="section-num reveal">
          <span className="section-num-no">05</span>
          <span className="section-num-line" />
          <span className="section-num-label">Ablauf</span>
        </div>
        <h2 className="proc-h2 reveal">
          In drei Schritten.
          <span className="h2-sub">So läuft Ihr Termin bei uns ab.</span>
        </h2>

        <div className="proc-tracks">
          {TRACKS.map((track, ti) => (
            <div key={track.name} className={`proc-track ${ti === 0 ? 'reveal-left' : 'reveal-right'}`}>
              <div className="proc-track-head">
                <span className="proc-track-icon">
                  <track.Icon />
                </span>
                <div className="proc-track-info">
                  <div className="proc-track-name">{track.name}</div>
                </div>
              </div>

              <div className="proc-trail">
                <div className="proc-rail" aria-hidden="true" />
                {track.steps.map((step, si) => (
                  <div key={step.n} className={`proc-stop reveal d${si + 1}`}>
                    <div className="proc-stop-marker">
                      <span className="proc-stop-dot" />
                    </div>
                    <div className="proc-stop-body">
                      <div className="proc-stop-step">Schritt {step.n}</div>
                      <h3 className="proc-stop-title">{step.title}</h3>
                      <p className="proc-stop-text">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
