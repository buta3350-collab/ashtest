import { NextRequest, NextResponse } from 'next/server'
import { graphFetch } from '@/lib/graph'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { carTitle, carPrice, carPriceText, kategorie, vorname, nachname, telefon, email, nachricht } = body

    if (!vorname?.trim() || !nachname?.trim() || !telefon?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 })
    }

    const name = `${vorname.trim()} ${nachname.trim()}`
    const priceStr = carPrice > 0 ? `€ ${Number(carPrice).toLocaleString('de-AT')}` : (carPriceText ?? '')

    const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1)">

        <tr><td style="background:#0d0d10;padding:28px 36px;text-align:center">
          <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e30613;font-weight:700">AUTO SHABANI</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-.02em">Neue Kundenanfrage</h1>
        </td></tr>

        <tr><td style="padding:32px 36px">

          <h2 style="margin:0 0 16px;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#e30613;border-bottom:2px solid #e30613;padding-bottom:8px">Fahrzeug</h2>
          <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px">
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Fahrzeug</td><td style="padding:6px 0;font-weight:700;font-size:15px">${carTitle}</td></tr>
            ${priceStr ? `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Preis</td><td style="padding:6px 0;font-weight:600">${priceStr}</td></tr>` : ''}
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Anliegen</td><td style="padding:6px 0"><span style="background:#e30613;color:#fff;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:700">${kategorie}</span></td></tr>
          </table>

          <h2 style="margin:0 0 16px;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#e30613;border-bottom:2px solid #e30613;padding-bottom:8px">Kontaktdaten</h2>
          <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px">
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Name</td><td style="padding:6px 0;font-weight:700;font-size:16px">${name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">E-Mail</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#e30613;text-decoration:none;font-weight:600">${email}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Telefon</td><td style="padding:6px 0"><a href="tel:${telefon.replace(/\s/g,'')}" style="color:#e30613;text-decoration:none;font-weight:600">${telefon}</a></td></tr>
          </table>

          ${nachricht?.trim() ? `
          <h2 style="margin:0 0 16px;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#e30613;border-bottom:2px solid #e30613;padding-bottom:8px">Nachricht</h2>
          <p style="color:#333;line-height:1.6;white-space:pre-wrap">${nachricht.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
          ` : ''}

        </td></tr>

        <tr><td style="background:#f8f8f8;padding:20px 36px;border-top:1px solid #eee">
          <p style="margin:0;font-size:12px;color:#aaa;text-align:center">
            Anfrage eingegangen über <strong>autoshabani.at</strong> — bitte telefonisch zur Bestätigung kontaktieren.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await graphFetch(
      `/users/${process.env.CONTACT_FROM_EMAIL}/sendMail`,
      {
        method: 'POST',
        body: JSON.stringify({
          message: {
            subject: `${kategorie}: ${carTitle} — ${name}`,
            body: { contentType: 'HTML', content: html },
            toRecipients: [{ emailAddress: { address: process.env.CONTACT_TO_EMAIL } }],
            replyTo: [{ emailAddress: { address: email, name } }],
          },
          saveToSentItems: true,
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('[kontakt] Graph sendMail Fehler:', err)
      return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[kontakt] Serverfehler:', e)
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
  }
}
