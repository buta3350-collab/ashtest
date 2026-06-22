'use client'
import { useEffect, useRef, useState } from 'react'

const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const WEEKDAY_NAMES = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']

function pad(n: number) { return n < 10 ? '0' + n : '' + n }
function fmt(d: Date) { return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}` }
function wkday(d: Date) { return WEEKDAY_NAMES[d.getDay()] }

const SVC_OPTIONS = [
  { id: 'Innenreinigung', title: 'Innenreinigung', desc: 'Saugen, Polster-Tiefenreinigung, Armaturen-Pflege', price: 'ab 89 €',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg> },
  { id: 'Außenreinigung', title: 'Außenreinigung', desc: 'Handwäsche, Felgenpflege, Lackschutz-Behandlung', price: 'ab 49 €',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
  { id: 'Lackpolitur', title: 'Lackpolitur', desc: 'Hochglanzpolitur mit professioneller Maschine', price: 'ab 199 €',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg> },
  { id: 'Keramikversiegelung', title: 'Keramik­versiegelung', desc: 'Bis zu 7 Jahre Schutz für Ihren Lack', price: 'ab 499 €',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> },
  { id: 'Komplettpaket', title: 'Komplettpaket', desc: 'Innen + Außen + Politur — alles aus einer Hand', price: 'auf Anfrage',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
]

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSvc, setSelectedSvc] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  // booked slots from the calendar API, format: "YYYY-MM-DD HH:MM"
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set())

  const [dialCode, setDialCode] = useState('+43')
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const notesRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    function handleOpen(e: Event) { e.preventDefault(); setIsOpen(true) }
    document.querySelectorAll('[data-booking-open]').forEach((el) =>
      el.addEventListener('click', handleOpen)
    )
    return () => {
      document.querySelectorAll('[data-booking-open]').forEach((el) =>
        el.removeEventListener('click', handleOpen)
      )
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    document.body.classList.toggle('modal-open', isOpen)
    return () => { document.body.classList.remove('modal-open') }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  // Fetch booked slots when modal opens
  useEffect(() => {
    if (!isOpen) return
    const start = new Date().toISOString().split('T')[0]
    const end   = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
    fetch(`/api/booking/slots?start=${start}&end=${end}`)
      .then((r) => r.json())
      .then((data) => setBookedSlots(new Set(data.bookedSlots ?? [])))
      .catch(() => {})
  }, [isOpen])

  function close() {
    setIsOpen(false)
  }

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0)

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDow = (new Date(calYear, calMonth, 1).getDay() + 6) % 7

  function getTimeSlots(d: Date | null): string[] {
    if (!d) return []
    const dow = d.getDay()
    if (dow === 0) return []
    if (dow === 6) return ['08:00','09:00','10:00','11:00','12:00','13:00']
    return ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00']
  }

  const timeSlots = getTimeSlots(selectedDate)
  const canSubmit = !!(selectedSvc && selectedDate && selectedTime) && !submitting

  function isSlotBooked(date: Date, time: string): boolean {
    const pad = (n: number) => String(n).padStart(2, '0')
    const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${time}`
    return bookedSlots.has(key)
  }

  function isDateFullyBooked(date: Date): boolean {
    const slots = getTimeSlots(date)
    return slots.length > 0 && slots.every((t) => isSlotBooked(date, t))
  }

  async function handleSubmit() {
    if (submitting) return
    const name  = nameRef.current?.value.trim()  || ''
    const phone = phoneRef.current?.value.trim() || ''
    const email = emailRef.current?.value.trim() || ''
    const notes = notesRef.current?.value.trim() || ''
    if (!name || !phone || !email) {
      if (!name  && nameRef.current)  nameRef.current.style.borderColor  = 'rgba(227,6,19,.6)'
      if (!phone && phoneRef.current) phoneRef.current.style.borderColor = 'rgba(227,6,19,.6)'
      if (!email && emailRef.current) emailRef.current.style.borderColor = 'rgba(227,6,19,.6)'
      return
    }
    const pad = (n: number) => String(n).padStart(2, '0')
    const d   = selectedDate!
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedSvc,
          date:    dateStr,
          time:    selectedTime,
          name, phone: `${dialCode} ${phone}`, email, notes,
        }),
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        setSubmitError('Termin konnte nicht gespeichert werden. Bitte rufen Sie uns an: +43 664 1060411')
      }
    } catch {
      setSubmitError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
    } finally {
      setSubmitting(false)
    }
  }

  const prevMonthDisabled = calYear === today.getFullYear() && calMonth === today.getMonth()
  const maxM = (today.getMonth() + 2) % 12
  const maxY = today.getFullYear() + (today.getMonth() + 2 >= 12 ? 1 : 0)
  const nextMonthDisabled = calYear === maxY && calMonth === maxM

  if (!isOpen) return null

  return (
    <div id="booking-modal" className="open" aria-modal="true" role="dialog" aria-label="Termin vereinbaren">
      <div className="booking-backdrop" onClick={close} />
      <div className="booking-panel">
        <button className="booking-close" type="button" aria-label="Schließen" onClick={close}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="booking-inner">
          <div className="booking-header">
            <div className="booking-eyebrow">Termin vereinbaren</div>
            <h2 className="booking-h2">Wann darf&apos;s <em>losgehen?</em></h2>
            <p className="booking-p">Ihr persönlicher Termin für Reinigung &amp; Versiegelung — in vier einfachen Schritten gebucht.</p>
          </div>

          {success ? (
            <div className="booking-success show">
              <div className="booking-success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3>Vielen Dank für Ihre Anfrage!</h3>
              <p>Wir prüfen Ihren Wunschtermin und melden uns binnen 24 Stunden persönlich bei Ihnen.</p>
            </div>
          ) : (
            <>
              {/* Step 1 */}
              <div className="booking-step">
                <div className="booking-step-label">Schritt 01</div>
                <h3 className="step-title">Service wählen</h3>
                <div className="svc-options">
                  {SVC_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`svc-opt${selectedSvc === opt.id ? ' selected' : ''}`}
                      onClick={() => setSelectedSvc(opt.id)}
                    >
                      <div className="opt-icon">{opt.icon}</div>
                      <div className="opt-title">{opt.title}</div>
                      <div className="opt-desc">{opt.desc}</div>
                      <div className="opt-price">{opt.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 */}
              <div className="booking-step">
                <div className="booking-step-label">Schritt 02</div>
                <h3 className="step-title">Datum wählen</h3>
                <div className="calendar">
                  <div className="cal-header">
                    <button
                      type="button"
                      className="cal-nav cal-prev"
                      aria-label="Vorheriger Monat"
                      disabled={prevMonthDisabled}
                      onClick={() => {
                        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
                        else setCalMonth(m => m - 1)
                      }}
                    >‹</button>
                    <span className="cal-month">{MONTH_NAMES[calMonth]} {calYear}</span>
                    <button
                      type="button"
                      className="cal-nav cal-next"
                      aria-label="Nächster Monat"
                      disabled={nextMonthDisabled}
                      onClick={() => {
                        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
                        else setCalMonth(m => m + 1)
                      }}
                    >›</button>
                  </div>
                  <div className="cal-weekdays">
                    {['Mo','Di','Mi','Do','Fr','Sa','So'].map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="cal-days">
                    {Array.from({ length: firstDow }, (_, i) => (
                      <span key={'e' + i} className="cal-day cal-empty" />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1
                      const date = new Date(calYear, calMonth, day)
                      const dow = date.getDay()
                      const past = date < today
                      const sun = dow === 0
                      const far = date > maxDate
                      const fullBooked = isDateFullyBooked(date)
                      const dis = past || sun || far || fullBooked
                      const isToday = date.getTime() === today.getTime()
                      const isSel = selectedDate?.getTime() === date.getTime()
                      let cls = 'cal-day'
                      if (isToday) cls += ' cal-today'
                      if (isSel) cls += ' cal-selected'
                      if (fullBooked && !dis) cls += ' cal-booked'
                      return (
                        <button
                          key={day}
                          type="button"
                          className={cls}
                          disabled={dis}
                          onClick={() => { setSelectedDate(date); setSelectedTime(null) }}
                        >{day}</button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="booking-step">
                <div className="booking-step-label">Schritt 03</div>
                <h3 className="step-title">Uhrzeit wählen</h3>
                <div className="time-slots">
                  {!selectedDate ? (
                    <span className="time-empty">Bitte zuerst ein Datum auswählen.</span>
                  ) : timeSlots.length === 0 ? (
                    <span className="time-empty">An diesem Tag sind keine Termine verfügbar.</span>
                  ) : timeSlots.map((t) => {
                    const booked = isSlotBooked(selectedDate!, t)
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`time-slot${selectedTime === t ? ' selected' : ''}${booked ? ' booked' : ''}`}
                        disabled={booked}
                        onClick={() => setSelectedTime(t)}
                      >{t}</button>
                    )
                  })}
                </div>
              </div>

              {/* Step 4 */}
              <div className="booking-step">
                <div className="booking-step-label">Schritt 04</div>
                <h3 className="step-title">Ihre Daten</h3>
                <div className="booking-form">
                  <input ref={nameRef} type="text" placeholder="Vor- und Nachname *" required autoComplete="name" onChange={(e) => { e.target.style.borderColor = '' }} />
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
                    <input ref={phoneRef} type="tel" placeholder="Telefonnummer *" required autoComplete="tel" onChange={e => { e.target.style.borderColor = ''; setDialCode(dialCode) }} />
                  </div>
                  <input ref={emailRef} type="email" placeholder="E-Mail Adresse *" required autoComplete="email" className="full" onChange={(e) => { e.target.style.borderColor = '' }} />
                  <textarea ref={notesRef} placeholder="Fahrzeug / Anmerkungen (optional)" className="full" />
                </div>
              </div>

              {/* Summary */}
              <div className="booking-summary">
                <div className="summary-list">
                  <div className="sum-row">
                    <span className="sum-label">Service</span>
                    <strong>{selectedSvc || '— noch nicht gewählt —'}</strong>
                  </div>
                  <div className="sum-row">
                    <span className="sum-label">Datum</span>
                    <strong>{selectedDate ? `${wkday(selectedDate)}, ${fmt(selectedDate)}` : '— noch nicht gewählt —'}</strong>
                  </div>
                  <div className="sum-row">
                    <span className="sum-label">Uhrzeit</span>
                    <strong>{selectedTime ? selectedTime + ' Uhr' : '— noch nicht gewählt —'}</strong>
                  </div>
                </div>
                {submitError && (
                  <p style={{ color:'rgba(227,6,19,.85)', fontSize:'.82rem', marginBottom:10 }}>{submitError}</p>
                )}
                <button
                  type="button"
                  className="booking-submit"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Wird gesendet…' : 'Termin verbindlich anfragen'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
