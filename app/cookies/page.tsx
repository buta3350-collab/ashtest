import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie-Richtlinie | Autoreinigung & Autocenter Shabani',
}

export default function Cookies() {
  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Zurück zur Startseite</Link>
        <h1>Cookie-Richtlinie</h1>

        <section>
          <h2>Was sind Cookies?</h2>
          <p>
            Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Sie ermöglichen es, bestimmte Informationen zu speichern und beim nächsten Besuch wieder abzurufen.
          </p>
        </section>

        <section>
          <h2>Welche Cookies verwenden wir?</h2>
          <h3>Technisch notwendige Cookies</h3>
          <p>Diese Cookies sind für den Betrieb der Website unbedingt erforderlich und können nicht deaktiviert werden.</p>
          <table className="legal-table">
            <thead>
              <tr><th>Name</th><th>Zweck</th><th>Speicherdauer</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>shabani-modus</code></td>
                <td>Speichert Ihre Darstellungs-Einstellung (Hell/Dunkel)</td>
                <td>Dauerhaft (localStorage)</td>
              </tr>
              <tr>
                <td><code>shabani-from-transition</code></td>
                <td>Steuert die Ladeanimation beim Seitenwechsel</td>
                <td>Einmalig (sessionStorage)</td>
              </tr>
            </tbody>
          </table>
          <h3>Keine Tracking- oder Werbe-Cookies</h3>
          <p>
            Wir setzen keine Cookies für Analysezwecke, Tracking oder personalisierte Werbung ein. Es werden keine Daten an Drittanbieter übermittelt.
          </p>
        </section>

        <section>
          <h2>Cookies verwalten</h2>
          <p>
            Sie können Cookies jederzeit über die Einstellungen Ihres Browsers löschen oder blockieren. Bitte beachten Sie, dass das Deaktivieren von Cookies die Funktionalität der Website beeinträchtigen kann.
          </p>
        </section>

        <section>
          <h2>Kontakt</h2>
          <p>
            Bei Fragen zu unserer Cookie-Richtlinie wenden Sie sich bitte an:<br />
            <a href="mailto:auto_shabani@live.at">auto_shabani@live.at</a>
          </p>
        </section>
      </div>
    </div>
  )
}
