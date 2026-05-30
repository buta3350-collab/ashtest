import { NextRequest, NextResponse } from 'next/server'
import { graphFetch } from '@/lib/graph'

export async function POST(req: NextRequest) {
  try {
    const { service, date, time, name, phone, email, notes, mailboxType } = await req.json()

    if (!service || !date || !time || !name || !phone || !email) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const mailbox = (mailboxType === 'autocenter' && process.env.BOOKING_MAILBOX_AUTOCENTER)
      ? process.env.BOOKING_MAILBOX_AUTOCENTER
      : process.env.BOOKING_MAILBOX!

    // date = "2026-05-20", time = "10:00"
    const startISO = `${date}T${time}:00`
    const [h, m]   = time.split(':').map(Number)
    const endHour  = String(h + 1).padStart(2, '0')
    const endISO   = `${date}T${endHour}:${String(m).padStart(2, '0')}:00`

    // Create calendar event on the shared mailbox calendar
    const res = await graphFetch(`/users/${mailbox}/events`, {
      method: 'POST',
      body: JSON.stringify({
        subject:  `Termin: ${service} — ${name}`,
        body: {
          contentType: 'Text',
          content: [
            `Service:  ${service}`,
            `Name:     ${name}`,
            `Telefon:  ${phone}`,
            `E-Mail:   ${email}`,
            notes ? `Anmerkung: ${notes}` : '',
          ].filter(Boolean).join('\n'),
        },
        start:    { dateTime: startISO, timeZone: 'Europe/Vienna' },
        end:      { dateTime: endISO,   timeZone: 'Europe/Vienna' },
        attendees: [
          {
            emailAddress: { address: email, name },
            type: 'required',
          },
        ],
        isReminderOn: true,
        reminderMinutesBeforeStart: 60,
      }),
    })

    if (!res.ok) {
      console.error('Graph Kalender-Event Fehler:', await res.text())
      return NextResponse.json({ error: 'Termin konnte nicht erstellt werden' }, { status: 502 })
    }

    // Confirmation e-mail to customer
    await graphFetch(`/users/${mailbox}/sendMail`, {
      method: 'POST',
      body: JSON.stringify({
        message: {
          subject: `Ihre Terminbestätigung — Auto Shabani`,
          body: {
            contentType: 'Text',
            content: [
              `Guten Tag ${name},`,
              '',
              `Ihr Termin bei Auto Shabani wurde vorgemerkt:`,
              '',
              `  Service:  ${service}`,
              `  Datum:    ${date.split('-').reverse().join('.')}`,
              `  Uhrzeit:  ${time} Uhr`,
              '',
              'Wir bestätigen Ihren Termin telefonisch oder per E-Mail.',
              '',
              'Mit freundlichen Grüßen',
              'Auto Shabani — Drosselweg 1, 9400 Wolfsberg',
              'Tel: +43 664 1060411',
            ].join('\n'),
          },
          toRecipients: [{ emailAddress: { address: email, name } }],
        },
        saveToSentItems: true,
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Booking API Fehler:', e)
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
  }
}
