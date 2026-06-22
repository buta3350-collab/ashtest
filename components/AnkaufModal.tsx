'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const CY = new Date().getFullYear()
const YEARS = Array.from({ length: CY - 1984 }, (_, i) => CY - i)
const FUELS = ['Benzin', 'Diesel', 'Hybrid Elektro/Benzin', 'Hybrid Elektro/Diesel', 'Elektro', 'Gas (LPG)', 'Gas (CNG)', 'Wasserstoff']
const CONDITIONS = ['Sehr gut', 'Gut', 'Befriedigend', 'Schlecht / Reparaturbedürftig', 'Unfallschaden']
const DIAL_CODES = [
  ['+43','🇦🇹'],['+49','🇩🇪'],['+41','🇨🇭'],['+39','🇮🇹'],['+36','🇭🇺'],
  ['+421','🇸🇰'],['+420','🇨🇿'],['+48','🇵🇱'],['+386','🇸🇮'],['+385','🇭🇷'],
  ['+381','🇷🇸'],['+387','🇧🇦'],['+382','🇲🇪'],['+355','🇦🇱'],['+389','🇲🇰'],
  ['+40','🇷🇴'],['+359','🇧🇬'],['+30','🇬🇷'],['+90','🇹🇷'],['+44','🇬🇧'],
  ['+33','🇫🇷'],['+34','🇪🇸'],['+351','🇵🇹'],['+31','🇳🇱'],['+32','🇧🇪'],
  ['+352','🇱🇺'],['+45','🇩🇰'],['+46','🇸🇪'],['+47','🇳🇴'],['+358','🇫🇮'],
]

interface Props { onClose: () => void }

const INIT = {
  marke:'', modell:'', baujahr:'', km:'', kraftstoff:'', getriebe:'', zustand:'',
  wunschpreis:'', vorname:'', nachname:'', telefon:'', email:'', notizen:'',
}
type Field = keyof typeof INIT

export default function AnkaufModal({ onClose }: Props) {
  const [f, setF] = useState(INIT)
  const [dialCode, setDialCode] = useState('+43')
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverErr, setServerErr] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [onClose])

  function set(key: Field, val: string) {
    setF(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: false }))
  }

  async function submit() {
    const required: Field[] = ['marke','modell','baujahr','km','kraftstoff','zustand','vorname','nachname','telefon','email']
    const errs: Partial<Record<Field, boolean>> = {}
    required.forEach(k => { if (!f[k].trim()) errs[k] = true })
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true); setServerErr('')
    try {
      const res = await fetch('/api/ankauf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, telefon: `${dialCode} ${f.telefon}` }),
      })
      if (res.ok) setSubmitted(true)
      else setServerErr('Fehler beim Senden. Bitte anrufen: +43 664 1060411')
    } catch { setServerErr('Verbindungsfehler. Bitte erneut versuchen.') }
    setSubmitting(false)
  }

  return createPortal(
    <div className="akm-backdrop" onClick={onClose}>
      <div className="akm-panel" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

        <button className="akm-close" onClick={onClose} aria-label="Schließen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="akm-inner">
          <div className="akm-eyebrow">Autocenter Shabani</div>

          {submitted ? (
            <div className="akm-success">
              <div className="akm-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h3>Anfrage gesendet!</h3>
              <p>Vielen Dank, <strong>{f.vorname}</strong>. Wir melden uns schnellstmöglich unter <strong>{dialCode} {f.telefon}</strong> bei Ihnen mit einer Bewertung.</p>
              <button className="akm-close-btn" onClick={onClose}>Schließen</button>
            </div>
          ) : (
            <>
              <h2 className="akm-title">Fahrzeug <em>verkaufen</em></h2>
              <p className="akm-subtitle">Kostenlose Bewertung — wir kaufen Fahrzeuge aller Marken &amp; Modelle.</p>

              {/* Vehicle details */}
              <div className="akm-section-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="7" rx="2"/><path d="M6 11L9 5h6l3 6"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/></svg>
                Ihr Fahrzeug
              </div>
              <div className="akm-form">
                <input
                  className={errors.marke ? 'err' : ''}
                  type="text" placeholder="Marke *" value={f.marke}
                  onChange={e => set('marke', e.target.value)}
                />
                <input
                  className={errors.modell ? 'err' : ''}
                  type="text" placeholder="Modell *" value={f.modell}
                  onChange={e => set('modell', e.target.value)}
                />
                <select
                  className={errors.baujahr ? 'err' : ''}
                  value={f.baujahr}
                  onChange={e => set('baujahr', e.target.value)}
                >
                  <option value="">Baujahr *</option>
                  {YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
                <input
                  className={errors.km ? 'err' : ''}
                  type="number" placeholder="Kilometerstand *" min="0" value={f.km}
                  onChange={e => set('km', e.target.value)}
                />
                <select
                  className={errors.kraftstoff ? 'err' : ''}
                  value={f.kraftstoff}
                  onChange={e => set('kraftstoff', e.target.value)}
                >
                  <option value="">Kraftstoff *</option>
                  {FUELS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select
                  value={f.getriebe}
                  onChange={e => set('getriebe', e.target.value)}
                >
                  <option value="">Getriebe (optional)</option>
                  <option value="Automatik">Automatik</option>
                  <option value="Schaltgetriebe">Schaltgetriebe</option>
                </select>
                <select
                  className={`full${errors.zustand ? ' err' : ''}`}
                  value={f.zustand}
                  onChange={e => set('zustand', e.target.value)}
                >
                  <option value="">Zustand *</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  className="full"
                  type="text" placeholder="Ihr Wunschpreis (optional, z.B. € 8.500)" value={f.wunschpreis}
                  onChange={e => set('wunschpreis', e.target.value)}
                />
                <textarea
                  className="full"
                  rows={3}
                  placeholder="Besonderheiten, Ausstattung, bekannte Mängel… (optional)"
                  value={f.notizen}
                  onChange={e => set('notizen', e.target.value)}
                />
              </div>

              {/* Contact */}
              <div className="akm-section-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Ihre Kontaktdaten
              </div>
              <div className="akm-form">
                <input
                  className={errors.vorname ? 'err' : ''}
                  type="text" placeholder="Vorname *" value={f.vorname}
                  onChange={e => set('vorname', e.target.value)}
                />
                <input
                  className={errors.nachname ? 'err' : ''}
                  type="text" placeholder="Nachname *" value={f.nachname}
                  onChange={e => set('nachname', e.target.value)}
                />
                <div className={`ckm-phone-wrap akm-phone${errors.telefon ? ' err' : ''}`} style={{gridColumn:'1/-1'}}>
                  <select className="ckm-dial" value={dialCode} onChange={e => setDialCode(e.target.value)}>
                    {DIAL_CODES.map(([code, flag]) => (
                      <option key={code} value={code}>{flag} {code}</option>
                    ))}
                  </select>
                  <input
                    type="tel" placeholder="Telefonnummer *" value={f.telefon}
                    onChange={e => set('telefon', e.target.value)}
                  />
                </div>
                <input
                  className={`full${errors.email ? ' err' : ''}`}
                  type="email" placeholder="E-Mail *" value={f.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>

              {serverErr && <p className="akm-server-err">{serverErr}</p>}

              <button className="akm-submit" disabled={submitting} onClick={submit}>
                {submitting ? 'Wird gesendet…' : 'Kostenlose Bewertung anfragen'}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
