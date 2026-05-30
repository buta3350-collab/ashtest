'use client'
import { useState } from 'react'

export default function CTA() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const name    = (form.elements.namedItem('name')    as HTMLInputElement).value.trim()
    const contact = (form.elements.namedItem('contact') as HTMLInputElement).value.trim()
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value.trim()
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim()
    if (!name || !contact || !message) return

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, subject, message }),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="cta" aria-label="Kontaktformular">
      <div className="cta-shell">

        <div className="cta-grid">

          {/* ── Manifesto column ───────────────────────────── */}
          <div className="cta-manifest reveal-left">
            <h2 className="cta-h2">
              Kontakt aufnehmen.
              <span className="h2-sub">Per Telefon, E-Mail oder über das Formular rechts.</span>
            </h2>
            <p className="cta-lede">
              Schreiben Sie uns über das Formular oder rufen Sie direkt an.
              Wir antworten in der Regel innerhalb eines Werktages.
            </p>

            <div className="cta-contacts-head" aria-hidden="true">
              <span className="cta-contacts-head-line" />
              <span>Direktkontakt</span>
            </div>

            <div className="cta-contacts">
              <a className="cta-contact" href="tel:+436641060411">
                <div className="cta-contact-meta">
                  <span className="cta-contact-k">Telefon</span>
                  <span className="cta-contact-v">+43 664 1060411</span>
                </div>
                <svg className="cta-contact-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
              <a className="cta-contact" href="mailto:auto_shabani@live.at">
                <div className="cta-contact-meta">
                  <span className="cta-contact-k">E-Mail</span>
                  <span className="cta-contact-v">auto_shabani@live.at</span>
                </div>
                <svg className="cta-contact-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
              <div className="cta-contact cta-contact-static">
                <div className="cta-contact-meta">
                  <span className="cta-contact-k">Standort</span>
                  <span className="cta-contact-v">Drosselweg 1 · 9400 Wolfsberg</span>
                </div>
              </div>
            </div>

            <div className="cta-sig" aria-hidden="true">
              <span className="cta-sig-line" />
              <span>Antwort binnen 24h · Werktags</span>
            </div>
          </div>

          {/* ── Form panel ─────────────────────────────────── */}
          <form className="cta-formpanel reveal-right" onSubmit={handleSubmit} noValidate>

            <div className="cta-formpanel-head">
              <span className="cta-formpanel-head-line" />
              <span>Schreiben Sie uns</span>
            </div>

            <div className="cta-fields">
              <div className="cta-field">
                <label htmlFor="cta-name">Ihr Name <span className="cta-req">*</span></label>
                <input id="cta-name" type="text" name="name" placeholder="Vor- und Nachname" required autoComplete="name" />
              </div>
              <div className="cta-field">
                <label htmlFor="cta-contact">E-Mail / Telefon <span className="cta-req">*</span></label>
                <input id="cta-contact" type="text" name="contact" placeholder="ihre@email.at oder Telefonnummer" required autoComplete="email" />
              </div>
              <div className="cta-field">
                <label htmlFor="cta-subject">Betreff</label>
                <input id="cta-subject" type="text" name="subject" placeholder="Worum geht es?" autoComplete="off" />
              </div>
              <div className="cta-field cta-field-msg">
                <label htmlFor="cta-message">Nachricht <span className="cta-req">*</span></label>
                <textarea id="cta-message" name="message" placeholder="Ihr Anliegen — gerne ausführlich." required />
              </div>
            </div>

            <button type="submit" className="cta-submit" disabled={status === 'sending' || status === 'sent'}>
              <span>
                {status === 'sending' ? 'Wird gesendet…' : status === 'sent' ? 'Gesendet ✓' : 'Nachricht senden'}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>

            {status === 'error' && (
              <p className="cta-note cta-note-err">
                Fehler beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an auto_shabani@live.at
              </p>
            )}
            {status !== 'error' && (
              <p className="cta-note">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet.
              </p>
            )}
          </form>

        </div>
      </div>
    </section>
  )
}
