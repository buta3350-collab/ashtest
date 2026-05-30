import { NextRequest, NextResponse } from 'next/server'
import { graphFetch } from '@/lib/graph'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, telefon, marke, modell, baujahr, budget, km, kraftstoff, karosserie, notiz } = body

    if (!name?.trim() || !email?.trim() || !telefon?.trim()) {
      return NextResponse.json({ error: 'Name, E-Mail und Telefon sind Pflichtfelder.' }, { status: 400 })
    }

    const fahrzeugZeilen = [
      marke       && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Wunsch-Marke</td><td style="padding:6px 0;font-weight:600">${marke}</td></tr>`,
      modell      && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Modell</td><td style="padding:6px 0;font-weight:600">${modell}</td></tr>`,
      baujahr     && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Baujahr ab</td><td style="padding:6px 0;font-weight:600">${baujahr}</td></tr>`,
      budget      && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Max. Budget</td><td style="padding:6px 0;font-weight:600">€ ${Number(budget).toLocaleString('de-AT')}</td></tr>`,
      km          && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Max. Kilometerstand</td><td style="padding:6px 0;font-weight:600">${Number(km).toLocaleString('de-AT')} km</td></tr>`,
      kraftstoff  && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Kraftstoff</td><td style="padding:6px 0;font-weight:600">${kraftstoff}</td></tr>`,
      karosserie  && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Karosserie</td><td style="padding:6px 0;font-weight:600">${karosserie}</td></tr>`,
      notiz       && `<tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap;vertical-align:top">Weitere Wünsche</td><td style="padding:6px 0">${notiz.replace(/\n/g, '<br>')}</td></tr>`,
    ].filter(Boolean).join('')

    const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1)">

        <!-- Header -->
        <tr><td style="background:#0d0d10;padding:28px 36px;text-align:center">
          <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e30613;font-weight:700">AUTO SHABANI</p>
          <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-.02em">Neue Fahrzeuganfrage</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 36px">

          <!-- Kontaktdaten -->
          <h2 style="margin:0 0 16px;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#e30613;border-bottom:2px solid #e30613;padding-bottom:8px">Kontaktdaten</h2>
          <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:28px">
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Name</td><td style="padding:6px 0;font-weight:700;font-size:16px">${name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">E-Mail</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#e30613;text-decoration:none;font-weight:600">${email}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap">Telefon</td><td style="padding:6px 0"><a href="tel:${telefon.replace(/\s/g,'')}" style="color:#e30613;text-decoration:none;font-weight:600">${telefon}</a></td></tr>
          </table>

          <!-- Fahrzeugwünsche -->
          <h2 style="margin:0 0 16px;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#e30613;border-bottom:2px solid #e30613;padding-bottom:8px">Fahrzeugwünsche</h2>
          ${fahrzeugZeilen
            ? `<table cellpadding="0" cellspacing="0" style="width:100%">${fahrzeugZeilen}</table>`
            : `<p style="color:#888;font-style:italic">Keine spezifischen Angaben</p>`}

        </td></tr>

        <!-- Footer -->
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

    const plainText = [
      `NEUE FAHRZEUGANFRAGE — AUTO SHABANI`,
      ``,
      `KONTAKT`,
      `Name:     ${name}`,
      `E-Mail:   ${email}`,
      `Telefon:  ${telefon}`,
      ``,
      `FAHRZEUGWÜNSCHE`,
      marke      && `Marke:         ${marke}`,
      modell     && `Modell:        ${modell}`,
      baujahr    && `Baujahr ab:    ${baujahr}`,
      budget     && `Max. Budget:   € ${Number(budget).toLocaleString('de-AT')}`,
      km         && `Max. KM:       ${Number(km).toLocaleString('de-AT')} km`,
      kraftstoff && `Kraftstoff:    ${kraftstoff}`,
      karosserie && `Karosserie:    ${karosserie}`,
      notiz      && `Wünsche:       ${notiz}`,
    ].filter(Boolean).join('\n')

    const res = await graphFetch(
      `/users/${process.env.CONTACT_FROM_EMAIL}/sendMail`,
      {
        method: 'POST',
        body: JSON.stringify({
          message: {
            subject: `Fahrzeuganfrage: ${[marke, modell].filter(Boolean).join(' ') || 'Wunschfahrzeug'} — ${name}`,
            body: { contentType: 'HTML', content: html },
            toRecipients: [
              { emailAddress: { address: process.env.CONTACT_TO_EMAIL } },
            ],
            replyTo: [
              { emailAddress: { address: email, name } },
            ],
          },
          saveToSentItems: true,
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('[anfrage] Graph sendMail Fehler:', err)
      return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[anfrage] Serverfehler:', e)
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
  }
}
