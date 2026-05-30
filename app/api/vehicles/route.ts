import { NextResponse } from 'next/server'

// Willhaben unofficial internal API — filtered by seller ID
// No official public API exists; this uses willhaben's own frontend JSON endpoint.
// If willhaben changes their API structure this route needs updating.


export interface WillhabenCar {
  id:          string
  title:       string
  make:        string
  price:       number
  priceText:   string
  year:        number | null
  km:          number | null
  fuel:        string
  trans:       string
  body:        string
  power:       number | null
  color:       string
  doors:       number | null
  drive:       string
  url:         string
  image:       string | null
  images:      string[]
  description: string
  equipment:   string[]
  seats:       number | null
  owners:      number | null
  condition:   string
  isOffer:     boolean
}

// willhaben equipment code → German label mapping
const EQUIP_MAP: Record<string, string> = {
  '2':'Fahrerairbag','3':'Beifahrerairbag','5':'ABS','6':'Anhängerkupplung',
  '9':'Seitenairbags','11':'CD-Player','15':'ESP','19':'Klimaanlage',
  '24':'Navigationssystem','28':'Parksensor hinten','34':'Radio',
  '38':'Schiebedach','42':'Ledersitze','68':'Sitzheizung hinten',
  '69':'Tempomat','74':'USB','75':'Xenon','76':'Bluetooth',
  '77':'Bordcomputer','78':'Elektr. Fensterheber','81':'Start/Stop',
  '85':'Freisprecheinrichtung','88':'Tagfahrlicht','89':'Nebelscheinwerfer',
  '93':'Lederlenkrad','97':'Multifunktionslenkrad','99':'Reifendruckkontrolle',
  '101':'Elektr. Spiegel','104':'Kurvenlicht','105':'Sommerreifen',
  '110':'Sitzheizung','111':'Winterreifen','117':'Zentralverriegelung',
  '127':'Wegfahrsperre','133':'Reserverad','136':'Nichtraucherfahrzeug',
  '143':'Panoramadach','145':'Parksensor vorne','148':'Rückfahrkamera',
  '152':'Spurhalteassistent','157':'Head-Up Display','159':'Sitzlüftung',
  '160':'360°-Kamera','161':'Ambientebeleuchtung',
}

// Extract a labelled value from willhaben's description HTML
// e.g. "Außenfarbe: Weiß<br>" → "Weiß"
function fromDesc(html: string, labelPattern: string): string {
  const re = new RegExp(labelPattern + '[^:]*:?\\s*(?:<[^>]+>\\s*)*([^<\\n,;()]{2,40})', 'i')
  const m = html.match(re)
  return m ? m[1].replace(/&[a-z]+;/g, ' ').trim() : ''
}

function parseDealerAds(ads: any[]): WillhabenCar[] {
  return ads.map((item: any) => {
    const attrMap: Record<string, string> = {}
    const attrMulti: Record<string, string[]> = {}
    ;(item?.attributes?.attribute ?? []).forEach((a: any) => {
      const vals = (a.values ?? []).filter(Boolean)
      attrMap[a.name] = attrMap[a.name] || vals[0] || ''
      if (!attrMulti[a.name]) attrMulti[a.name] = []
      attrMulti[a.name].push(...vals)
    })

    const price   = parseInt(attrMap['PRICE'] ?? attrMap['PRICE/AMOUNT'] ?? '0') || 0
    const kwRaw   = attrMap['ENGINE/EFFECT']
    const power   = kwRaw ? Math.round(parseFloat(kwRaw) * 1.35962) : null  // kW → PS
    const km      = attrMap['MILEAGE'] ? parseInt(attrMap['MILEAGE']) : null
    const yearRaw = attrMap['YEAR_MODEL'] ?? ''

    const MAKE_NORM: Record<string, string> = { 'VW': 'Volkswagen' }
    const makeRaw = attrMap['CAR_MODEL/MAKE'] ?? ''
    const make  = MAKE_NORM[makeRaw] ?? makeRaw
    const model = (attrMap['CAR_MODEL/MODEL_SPECIFICATION'] ?? attrMap['CAR_MODEL/MODEL'] ?? '').replace(/\.{2,}$/, '').trim()
    const title = `${make} ${model}`.trim() || item.description || 'Fahrzeug'

    const seoUrl = attrMap['SEO_URL'] ?? ''
    const url    = seoUrl
      ? `https://www.willhaben.at/${seoUrl}`
      : `https://www.willhaben.at/iad/kaufen-und-verkaufen/d/${item.id ?? ''}`

    // All images from ALL_IMAGE_URLS (semicolon-separated paths)
    const allImgRaw = attrMap['ALL_IMAGE_URLS'] ?? ''
    const images = allImgRaw.split(';').filter(Boolean)
      .map((p: string) => `https://cache.willhaben.at/mmo/${p}`)

    const mmo   = attrMap['MMO'] ?? ''
    const image = images[0] ?? (mmo ? `https://cache.willhaben.at/mmo/${mmo}` : null)

    // Equipment: prefer multi-value EQUIPMENT_RESOLVED, fallback to code mapping
    const equipResolved = (attrMulti['EQUIPMENT_RESOLVED'] ?? []).filter(Boolean)
    const equipCodes    = (attrMap['EQUIPMENT'] ?? '').split(';').filter(Boolean)
    const equipment = equipResolved.length > 1
      ? equipResolved
      : equipCodes.map((c: string) => EQUIP_MAP[c] ?? '').filter(Boolean)

    // BODY_DYN is HTML — willhaben splits it across multiple values, join all chunks
    // Note: willhaben truncates descriptions in search results (anti-scraping). The full
    // description is only available on the individual listing page which blocks server fetches.
    const rawDesc = (attrMulti['BODY_DYN'] ?? []).join('') || attrMap['BODY_DYN'] || ''
    const description = rawDesc
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\.{3}\s*$/, '')  // remove trailing "..." truncation indicator
      .trim()
    const isOffer = /angebot/i.test(rawDesc) || /angebot/i.test(attrMap['HEADING'] ?? '')

    // Willhaben EXTERIORCOLOURMAIN codes — extracted from willhaben's own __NEXT_DATA__
    // on /iad/gebrauchtwagen/auto/detailsuche. Cross-verified with live dealer data.
    // Codes 12, 16 don't exist; 17 = Sonstige (intentionally unmapped).
    const EXTERIOR_COLOR_MAP: Record<string,string> = {
      '1':'Beige', '2':'Blau',   '3':'Bronze','4':'Braun', '5':'Grün',
      '6':'Grau',  '7':'Gelb',   '8':'Gold',  '9':'Weiß', '10':'Violett',
      '11':'Orange','13':'Rot',  '14':'Schwarz','15':'Silber',
    }
    const DRIVE_CODE: Record<string,string> = {
      'FWD':'Vorderrad','AWD':'Allrad','RWD':'Hinterrad','4WD':'Allrad',
      'FRONT':'Vorderrad','REAR':'Hinterrad','ALL':'Allrad',
    }

    // Description-based extraction is most reliable (text says "Außenfarbe: Schwarz Metallic")
    const colorFromDesc = fromDesc(rawDesc, 'Au[ßs]enfarbe') || fromDesc(rawDesc, 'Farbe')
    const extColorCode = attrMap['EXTERIORCOLOURMAIN'] || attrMap['EXTERIORCOLOUR'] || ''
    const colorFromCode = EXTERIOR_COLOR_MAP[extColorCode] || ''
    // Normalize "Schwarz Metallic" → "Schwarz", "Silber Metallic" → "Silber" etc.
    const colorRaw = colorFromDesc || attrMap['COLOR_RESOLVED'] || attrMap['COLOUR_RESOLVED'] || colorFromCode
    const color = colorRaw
      .replace(/\s*(Metallic|Perleffekt|Matt|Uni|Pearl|Solid|Effect)\s*/gi, '')
      .trim()

    const driveRaw = attrMap['CAR_DRIVE_TRAIN'] || attrMap['DRIVE_TRAIN_RESOLVED'] || attrMap['DRIVE_TYPE'] || attrMap['DRIVETRAIN'] || ''
    const drive = DRIVE_CODE[driveRaw.toUpperCase()] || driveRaw || fromDesc(rawDesc, 'Antrieb') || ''

    const doorsRaw = attrMap['DOORS'] || attrMap['NO_OF_DOORS'] || attrMap['CAR_DOORS']
      || attrMap['CAR_DOOR_NUM'] || attrMap['DOOR_COUNT'] || attrMap['NUMBER_OF_DOORS']
      || attrMap['CAR_NUM_DOORS'] || attrMap['ANZAHL_TUEREN']
      || fromDesc(rawDesc, 'Anzahl.{0,6}T[üu]')
    const seatsRaw = attrMap['NOOFSEATS'] || attrMap['NO_OF_SEATS'] || attrMap['SEATS'] || attrMap['NUMBEROFSEATS'] || fromDesc(rawDesc, 'Anzahl.{0,6}Sit')

    return {
      id:          String(item.id ?? ''),
      title,
      make,
      price,
      priceText:   attrMap['PRICE_FOR_DISPLAY'] || (price > 0 ? `€ ${price.toLocaleString('de-AT')}` : 'Preis auf Anfrage'),
      year:        yearRaw ? parseInt(yearRaw) : null,
      km,
      fuel:        attrMap['ENGINE/FUEL_RESOLVED']  || attrMap['FUEL_RESOLVED'] || fromDesc(rawDesc, 'Kraftstoff'),
      trans:       attrMap['TRANSMISSION_RESOLVED'] || attrMap['GEARBOX_RESOLVED'] || fromDesc(rawDesc, 'Getriebe'),
      body:        attrMap['CAR_TYPE'] || attrMap['BODY_TYPE'] || '',
      power,
      color,
      doors:       doorsRaw ? parseInt(doorsRaw) : null,
      drive,
      url,
      image,
      images,
      description,
      equipment,
      seats:       seatsRaw ? parseInt(seatsRaw) : null,
      owners:      attrMap['NO_OF_OWNERS']   ? parseInt(attrMap['NO_OF_OWNERS'])   : null,
      condition:   attrMap['CONDITION_RESOLVED'] || attrMap['CONDITION'] || fromDesc(rawDesc, 'Zustand'),
      isOffer,
    } satisfies WillhabenCar
  })
}

export async function GET() {
  try {
    const sellerId = process.env.WILLHABEN_SELLER_ID

    if (!sellerId || sellerId.startsWith('APIWERT')) {
      return NextResponse.json(
        { error: 'WILLHABEN_SELLER_ID nicht konfiguriert', cars: [] },
        { status: 200 }
      )
    }

    // Try both known URL patterns — willhaben changes their API structure occasionally
    const urls = [
      `https://api.willhaben.at/iad/classified/iad/classified/search/result.json?ADVERTISER_ID=${sellerId}&rows=100&isSearchPage=true&sort=1`,
      `https://www.willhaben.at/webapi/iad/classified/iad/classified/search/result.json?ADVERTISER_ID=${sellerId}&rows=100&isSearchPage=true&sort=1`,
    ]

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'de-AT,de;q=0.9',
      'Referer': 'https://www.willhaben.at/',
    }

    // 1. Try the JSON search API first — returns full attributes including color, drive, doors
    const jsonApiUrl = `https://www.willhaben.at/webapi/iad/classified/iad/classified/search/result.json?ADVERTISER_ID=${sellerId}&rows=200&isSearchPage=true&sort=1`
    console.log('[vehicles] Trying JSON API:', jsonApiUrl)
    let dealerAds: any[] = []

    try {
      const apiRes = await fetch(jsonApiUrl, { headers, cache: 'no-store' })
      console.log('[vehicles] JSON API status:', apiRes.status)
      if (apiRes.ok) {
        const json = await apiRes.json()
        dealerAds = json?.advertSummaryList?.advertSummary ?? []
        console.log('[vehicles] JSON API ads:', dealerAds.length)
        if (dealerAds.length > 0) {
          // Debug: log all attribute names from first car
          const firstAttrs = (dealerAds[0]?.attributes?.attribute ?? []).map((a: any) => a.name)
          console.log('[vehicles] First car attr names:', firstAttrs.join(', '))
        }
      }
    } catch (e) {
      console.log('[vehicles] JSON API failed:', e)
    }

    // 2. Fall back to HTML page + __NEXT_DATA__ parsing
    if (dealerAds.length === 0) {
      const pageUrl = `https://www.willhaben.at/iad/haendler/autocenter-shabani/auto?orgId=${sellerId}`
      console.log('[vehicles] Falling back to HTML page:', pageUrl)
      const res = await fetch(pageUrl, { headers, next: { revalidate: 300 } })
      console.log('[vehicles] Page status:', res.status)
      if (!res.ok) {
        return NextResponse.json({ error: 'Willhaben nicht erreichbar', cars: [], _debug: { status: res.status } }, { status: 200 })
      }
      const html = await res.text()
      const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)
      if (!match) {
        return NextResponse.json({ error: '__NEXT_DATA__ nicht gefunden', cars: [] }, { status: 200 })
      }
      const nextData = JSON.parse(match[1])
      const pageProps = nextData?.props?.pageProps ?? {}
      dealerAds = pageProps?.dealerAds?.advertSummary ?? []
      if (dealerAds.length > 0) {
        const firstAttrs = (dealerAds[0]?.attributes?.attribute ?? []).map((a: any) => a.name)
        console.log('[vehicles] HTML fallback attr names:', firstAttrs.join(', '))
      }
    }

    const cars = parseDealerAds(dealerAds)

    // Debug: include first car's raw attributes so we can verify color/drive field names
    const debugAttrs: Record<string,string> = {}
    ;(dealerAds[0]?.attributes?.attribute ?? []).forEach((a: any) => { debugAttrs[a.name] = (a.values ?? [])[0] ?? '' })

    return NextResponse.json({ cars, _debug_attrs: debugAttrs })
  } catch (e) {
    console.error('[vehicles] Serverfehler:', e)
    return NextResponse.json({ error: String(e), cars: [] }, { status: 200 })
  }
}
