import { NextRequest, NextResponse } from 'next/server'
import { graphFetch } from '@/lib/graph'

export async function POST(req: NextRequest) {
  try {
    const { name, contact, subject, message } = await req.json()

    if (!name || !contact || !message) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const emailBody = `
Neue Kontaktanfrage über die Website

Name:      ${name}
Kontakt:   ${contact}
Betreff:   ${subject || 'Allgemeine Anfrage'}

Nachricht:
${message}
    `.trim()

    const res = await graphFetch(
      `/users/${process.env.CONTACT_FROM_EMAIL}/sendMail`,
      {
        method: 'POST',
        body: JSON.stringify({
          message: {
            subject: `Website-Anfrage: ${subject || 'Allgemeine Anfrage'}`,
            body: { contentType: 'Text', content: emailBody },
            toRecipients: [
              { emailAddress: { address: process.env.CONTACT_TO_EMAIL } },
            ],
            replyTo: contact.includes('@')
              ? [{ emailAddress: { address: contact, name } }]
              : [],
          },
          saveToSentItems: true,
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Graph sendMail Fehler:', err)
      return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Contact API Fehler:', e)
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
  }
}
