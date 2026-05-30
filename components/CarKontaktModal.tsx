'use client'
import { useState, useEffect } from 'react'

interface Props {
  carTitle: string
  carPrice: number
  carPriceText?: string
  onClose: () => void
}

const CATS = [
  {
    id: 'probefahrt',
    label: 'Probefahrt',
    sub: 'Besichtigung vereinbaren',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17h1m16 0h1M5 17H3a1 1 0 0 1-1-1v-4l2-5h12l2 5v4a1 1 0 0 1-1 1h-2"/>
        <circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
        <path d="M14 12H5"/>
      </svg>
    ),
  },
  {
    id: 'finanzierung',
    label: 'Finanzierung',
    sub: 'Finanzierungsanfrage',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
        <line x1="6" y1="15" x2="10" y2="15"/>
      </svg>
    ),
  },
  {
    id: 'inzahlung',
    label: 'Inzahlungnahme',
    sub: 'Fahrzeug eintauschen',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
  },
  {
    id: 'frage',
    label: 'Allg. Frage',
    sub: 'Zum Fahrzeug',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <circle cx="12" cy="17" r=".5" fill="currentColor"/>
      </svg>
    ),
  },
]

const PLACEHOLDERS: Record<string, string> = {
  probefahrt:  'Haben Sie einen Wunschtermin oder besondere Anmerkungen?',
  finanzierung:'Ihre monatliche Wunschrate, Anzahlung oder weitere Details…',
  inzahlung:   'Bitte beschreiben Sie Ihr Fahrzeug (Marke, Modell, km, Zustand)…',
  frage:       'Ihre Frage zum Fahrzeug…',
}

export default function CarKontaktModal({ carTitle, carPrice, carPriceText, onClose }: Props) {
  const [cat,        setCat]        = useState('')
  const [vorname,    setVorname]    = useState('')
  const [nachname,   setNachname]   = useState('')
  const [dialCode,   setDialCode]   = useState('+43')
  const [telefon,    setTelefon]    = useState('')
  const [email,      setEmail]      = useState('')
  const [nachricht,  setNachricht]  = useState('')
  const [errors,     setErrors]     = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [serverErr,  setServerErr]  = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [onClose])

  async function submit() {
    const e: Record<string, boolean> = {}
    if (!cat)                   e.cat      = true
    if (!vorname.trim())        e.vorname  = true
    if (!nachname.trim())       e.nachname = true
    if (!telefon.trim())        e.telefon  = true
    if (!email.trim())          e.email    = true
    if (Object.keys(e).length) { setErrors(e); return }

    setSubmitting(true); setServerErr('')
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carTitle, carPrice, carPriceText,
          kategorie: CATS.find(c => c.id === cat)?.label ?? cat,
          vorname, nachname, telefon: `${dialCode} ${telefon}`, email, nachricht,
        }),
      })
      if (res.ok) setSubmitted(true)
      else setServerErr('Fehler beim Senden. Bitte anrufen: +43 664 1060411')
    } catch { setServerErr('Verbindungsfehler. Bitte erneut versuchen.') }
    setSubmitting(false)
  }

  const priceStr = carPrice > 0 ? `€ ${carPrice.toLocaleString('de-AT')}` : (carPriceText ?? '')

  return (
    <div className="ckm-backdrop" onClick={onClose}>
      <div className="ckm-panel" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

        <button className="ckm-close" onClick={onClose} aria-label="Schließen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="ckm-inner">
          <div className="ckm-eyebrow">Autocenter Shabani</div>

          {submitted ? (
            <div className="ckm-success">
              <div className="ckm-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h3>Nachricht gesendet!</h3>
              <p>Vielen Dank, <strong>{vorname}</strong>. Wir melden uns so schnell wie möglich unter <strong>{dialCode} {telefon}</strong> bei Ihnen.</p>
              <button className="ckm-close-btn" onClick={onClose}>Schließen</button>
            </div>
          ) : (
            <>
              <h2 className="ckm-title">Frage <em>stellen</em></h2>

              {/* Vehicle ref */}
              <div className="ckm-car-ref">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17h1m16 0h1M5 17H3a1 1 0 0 1-1-1v-4l2-5h12l2 5v4a1 1 0 0 1-1 1h-2"/>
                  <circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
                </svg>
                <span>{carTitle}</span>
                {priceStr && <span className="ckm-car-price">{priceStr}</span>}
              </div>

              {/* Category */}
              <div className="ckm-label">
                Ihr Anliegen
                {errors.cat && <span className="ckm-err-inline">Bitte wählen</span>}
              </div>
              <div className="ckm-cats">
                {CATS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={`ckm-cat${cat === c.id ? ' active' : ''}${errors.cat ? ' err' : ''}`}
                    onClick={() => { setCat(c.id); setErrors(p => ({...p, cat: false})) }}
                  >
                    <span className="ckm-cat-icon">{c.icon}</span>
                    <span className="ckm-cat-label">{c.label}</span>
                    <span className="ckm-cat-sub">{c.sub}</span>
                  </button>
                ))}
              </div>

              {/* Personal info */}
              <div className="ckm-label">Ihre Kontaktdaten</div>
              <div className="ckm-form">
                <input
                  className={errors.vorname ? 'err' : ''}
                  type="text" placeholder="Vorname *" value={vorname}
                  onChange={e => { setVorname(e.target.value); setErrors(p => ({...p, vorname: false})) }}
                />
                <input
                  className={errors.nachname ? 'err' : ''}
                  type="text" placeholder="Nachname *" value={nachname}
                  onChange={e => { setNachname(e.target.value); setErrors(p => ({...p, nachname: false})) }}
                />
                <div className={`ckm-phone-wrap${errors.telefon ? ' err' : ''}`}>
                  <select className="ckm-dial" value={dialCode} onChange={e => setDialCode(e.target.value)}>
                    <option value="+43">🇦🇹 +43</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+41">🇨🇭 +41</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+36">🇭🇺 +36</option>
                    <option value="+421">🇸🇰 +421</option>
                    <option value="+420">🇨🇿 +420</option>
                    <option value="+48">🇵🇱 +48</option>
                    <option value="+386">🇸🇮 +386</option>
                    <option value="+385">🇭🇷 +385</option>
                    <option value="+381">🇷🇸 +381</option>
                    <option value="+387">🇧🇦 +387</option>
                    <option value="+382">🇲🇪 +382</option>
                    <option value="+355">🇦🇱 +355</option>
                    <option value="+389">🇲🇰 +389</option>
                    <option value="+40">🇷🇴 +40</option>
                    <option value="+359">🇧🇬 +359</option>
                    <option value="+30">🇬🇷 +30</option>
                    <option value="+90">🇹🇷 +90</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+351">🇵🇹 +351</option>
                    <option value="+31">🇳🇱 +31</option>
                    <option value="+32">🇧🇪 +32</option>
                    <option value="+352">🇱🇺 +352</option>
                    <option value="+45">🇩🇰 +45</option>
                    <option value="+46">🇸🇪 +46</option>
                    <option value="+47">🇳🇴 +47</option>
                    <option value="+358">🇫🇮 +358</option>
                  </select>
                  <input
                    type="tel" placeholder="Telefonnummer *" value={telefon}
                    onChange={e => { setTelefon(e.target.value); setErrors(p => ({...p, telefon: false})) }}
                  />
                </div>
                <input
                  className={`full${errors.email ? ' err' : ''}`}
                  type="email" placeholder="E-Mail *" value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: false})) }}
                />
                <textarea
                  className="full"
                  rows={3}
                  placeholder={cat ? PLACEHOLDERS[cat] : 'Ihre Nachricht (optional)…'}
                  value={nachricht}
                  onChange={e => setNachricht(e.target.value)}
                />
              </div>

              {serverErr && <p className="ckm-server-err">{serverErr}</p>}

              <button className="ckm-submit" disabled={submitting} onClick={submit}>
                {submitting ? 'Wird gesendet…' : 'Nachricht senden'}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
