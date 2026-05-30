// Lightweight helper for Server Components — fetches only the count
// of currently listed vehicles from willhaben. Cached for 5 minutes.

export async function getVehicleCount(): Promise<number | null> {
  const sellerId = process.env.WILLHABEN_SELLER_ID
  if (!sellerId || sellerId.startsWith('APIWERT')) return null

  const url = `https://www.willhaben.at/webapi/iad/classified/iad/classified/search/result.json?ADVERTISER_ID=${sellerId}&rows=200&isSearchPage=true&sort=1`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'de-AT,de;q=0.9',
        'Referer': 'https://www.willhaben.at/',
      },
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = await res.json()
    const ads = json?.advertSummaryList?.advertSummary ?? []
    return Array.isArray(ads) ? ads.length : null
  } catch {
    return null
  }
}
