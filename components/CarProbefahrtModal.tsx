'use client'
import { useState, useEffect, useRef } from 'react'

const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
function pad(n: number) { return String(n).padStart(2, '0') }
function fmtDate(d: Date) { return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}` }

function getSlots(d: Date) {
  const dow = d.getDay()
  if (dow === 0) return []
  if (dow === 6) return ['09:00','10:00','11:00','12:00','13:00']
  return ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00']
}

interface Props {
  carTitle: string
  onClose: () => void
}

export default function CarProbefahrtModal({ carTitle, onClose }: Props) {
  const now = new Date(); now.setHours(0,0,0,0)
  const maxDate = new Date(now); maxDate.setDate(maxDate.getDate() + 90)

  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [calYear,  setCalYear]  = useState(now.getFullYear())
  const [selDate,  setSelDate]  = useState<Date|null>(null)
  const [selTime,  setSelTime]  = useState('')
  const [booked,   setBooked]   = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState('')
  const [dialCode, setDialCode] = useState('+43')
  const nameRef  = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  // Block body scroll + Escape key
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [onClose])

  // Fetch booked slots for autocenter mailbox
  useEffect(() => {
    const start = now.toISOString().split('T')[0]
    const end   = maxDate.toISOString().split('T')[0]
    fetch(`/api/booking/slots?start=${start}&end=${end}&mailboxType=autocenter`)
      .then(r => r.json())
      .then(d => setBooked(new Set(d.bookedSlots ?? [])))
      .catch(() => {})
  }, [])

  function isBooked(date: Date, time: string) {
    return booked.has(`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${time}`)
  }

  function isFullyBooked(date: Date) {
    const slots = getSlots(date)
    return slots.length > 0 && slots.every(t => isBooked(date, t))
  }

  async function submit() {
    const name  = nameRef.current?.value.trim()  || ''
    const phone = phoneRef.current?.value.trim() || ''
    const email = emailRef.current?.value.trim() || ''
    if (!selDate || !selTime || !name || !phone || !email) {
      if (!name  && nameRef.current)  nameRef.current.style.borderColor  = 'rgba(227,6,19,.6)'
      if (!phone && phoneRef.current) phoneRef.current.style.borderColor = 'rgba(227,6,19,.6)'
      if (!email && emailRef.current) emailRef.current.style.borderColor = 'rgba(227,6,19,.6)'
      return
    }
    setSubmitting(true); setError('')
    try {
      const dateStr = `${selDate.getFullYear()}-${pad(selDate.getMonth()+1)}-${pad(selDate.getDate())}`
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'Probefahrt / Besichtigung',
          date: dateStr, time: selTime,
          name, phone: `${dialCode} ${phone}`, email,
          notes: `Fahrzeug: ${carTitle}`,
          mailboxType: 'autocenter',
        }),
      })
      if (res.ok) setSubmitted(true)
      else setError('Fehler beim Senden. Bitte anrufen: +43 664 1060411')
    } catch { setError('Verbindungsfehler. Bitte erneut versuchen.') }
    setSubmitting(false)
  }

  const daysInMonth  = new Date(calYear, calMonth+1, 0).getDate()
  const firstDow     = (new Date(calYear, calMonth, 1).getDay() + 6) % 7
  const slots        = selDate ? getSlots(selDate) : []
  const canSubmit    = !!(selDate && selTime && !submitting)

  const prevMax = now.getMonth()
  const prevDis = calYear === now.getFullYear() && calMonth === prevMax
  const nextMax2 = new Date(now); nextMax2.setMonth(nextMax2.getMonth() + 2)
  const nextDis = calYear === nextMax2.getFullYear() && calMonth === nextMax2.getMonth()

  return (
    <div className="pfm-backdrop" onClick={onClose}>
      <div className="pfm-panel" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

        <button className="pfm-close" onClick={onClose} aria-label="Schließen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="pfm-inner">
          <div className="pfm-eyebrow">Autocenter Shabani</div>

          {submitted ? (
            <div className="pfm-success">
              <div className="pfm-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h3>Anfrage gesendet!</h3>
              <p>Wir bestätigen Ihren Termin innerhalb von 24 Stunden per Telefon oder E-Mail.</p>
            </div>
          ) : (
            <div className="pfm-content">
              <h2 className="pfm-title">Probefahrt <em>anfragen</em></h2>
              <div className="ckm-car-ref">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17h1m16 0h1M5 17H3a1 1 0 0 1-1-1v-4l2-5h12l2 5v4a1 1 0 0 1-1 1h-2"/>
                  <circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
                </svg>
                <span>{carTitle}</span>
              </div>

              {/* Calendar */}
              <div className="pfm-label">Datum wählen</div>
              <div className="calendar">
                <div className="cal-header">
                  <button type="button" className="cal-nav cal-prev" disabled={prevDis}
                    onClick={() => { if (calMonth===0){setCalMonth(11);setCalYear(y=>y-1)}else setCalMonth(m=>m-1) }}>‹</button>
                  <span className="cal-month">{MONTHS[calMonth]} {calYear}</span>
                  <button type="button" className="cal-nav cal-next" disabled={nextDis}
                    onClick={() => { if (calMonth===11){setCalMonth(0);setCalYear(y=>y+1)}else setCalMonth(m=>m+1) }}>›</button>
                </div>
                <div className="cal-weekdays">
                  {['Mo','Di','Mi','Do','Fr','Sa','So'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="cal-days">
                  {Array.from({length: firstDow}, (_, i) => (
                    <span key={'e'+i} className="cal-day cal-empty" />
                  ))}
                  {Array.from({length: daysInMonth}, (_, i) => {
                    const day  = i + 1
                    const date = new Date(calYear, calMonth, day)
                    const dis  = date < now || date.getDay() === 0 || date > maxDate || isFullyBooked(date)
                    const isSel = selDate?.getTime() === date.getTime()
                    return (
                      <button key={day} type="button"
                        className={`cal-day${date.getTime()===now.getTime()?' cal-today':''}${isSel?' cal-selected':''}`}
                        disabled={dis}
                        onClick={() => { setSelDate(date); setSelTime('') }}>
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div className="pfm-label">Uhrzeit wählen</div>
              <div className="time-slots">
                {!selDate ? (
                  <span className="time-empty">Bitte zuerst ein Datum wählen.</span>
                ) : slots.length === 0 ? (
                  <span className="time-empty">Kein Termin an diesem Tag.</span>
                ) : slots.map(t => {
                  const b = isBooked(selDate!, t)
                  return (
                    <button key={t} type="button"
                      className={`time-slot${selTime===t?' selected':''}${b?' booked':''}`}
                      disabled={b}
                      onClick={() => setSelTime(t)}>{t}</button>
                  )
                })}
              </div>

              {/* Contact form */}
              <div className="pfm-label">Ihre Kontaktdaten</div>
              <div className="booking-form">
                <input ref={nameRef}  type="text"  placeholder="Vor- und Nachname *" required autoComplete="name"
                  onChange={e => { e.target.style.borderColor = '' }} />
                <div className="ckm-phone-wrap" style={{gridColumn:'1/-1'}}>
                  <select className="ckm-dial" value={dialCode} onChange={e => setDialCode(e.target.value)}>
                    <option value="+43">🇦🇹 +43</option><option value="+49">🇩🇪 +49</option><option value="+41">🇨🇭 +41</option>
                    <option value="+39">🇮🇹 +39</option><option value="+36">🇭🇺 +36</option><option value="+421">🇸🇰 +421</option>
                    <option value="+420">🇨🇿 +420</option><option value="+48">🇵🇱 +48</option><option value="+386">🇸🇮 +386</option>
                    <option value="+385">🇭🇷 +385</option><option value="+381">🇷🇸 +381</option><option value="+387">🇧🇦 +387</option>
                    <option value="+382">🇲🇪 +382</option><option value="+355">🇦🇱 +355</option><option value="+389">🇲🇰 +389</option>
                    <option value="+40">🇷🇴 +40</option><option value="+359">🇧🇬 +359</option><option value="+30">🇬🇷 +30</option>
                    <option value="+90">🇹🇷 +90</option><option value="+44">🇬🇧 +44</option><option value="+33">🇫🇷 +33</option>
                    <option value="+34">🇪🇸 +34</option><option value="+351">🇵🇹 +351</option><option value="+31">🇳🇱 +31</option>
                    <option value="+32">🇧🇪 +32</option><option value="+352">🇱🇺 +352</option><option value="+45">🇩🇰 +45</option>
                    <option value="+46">🇸🇪 +46</option><option value="+47">🇳🇴 +47</option><option value="+358">🇫🇮 +358</option>
                  </select>
                  <input ref={phoneRef} type="tel" placeholder="Telefonnummer *" required autoComplete="tel"
                    onChange={e => { e.target.style.borderColor = '' }} />
                </div>
                <input ref={emailRef} type="email" placeholder="E-Mail Adresse *"    required autoComplete="email" className="full"
                  onChange={e => { e.target.style.borderColor = '' }} />
              </div>

              {error && <p style={{color:'rgba(227,6,19,.85)',fontSize:'.82rem',marginTop:4}}>{error}</p>}

              {selDate && selTime && (
                <div className="pfm-summary">
                  {fmtDate(selDate)} · {selTime} Uhr
                </div>
              )}

              <button className="pfm-submit" disabled={!canSubmit} onClick={submit}>
                {submitting ? 'Wird gesendet…' : 'Termin verbindlich anfragen'}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
