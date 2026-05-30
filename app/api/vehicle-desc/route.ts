import { NextResponse } from 'next/server'

const AID = '1003686'
const BASE = `https://autocenter-shabani.motornetzwerk.at/app/php-wrappers/php-wrapper.php?aid=${AID}&vid=`

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ description: '', equipment: [] })

  try {
    const res = await fetch(`${BASE}${id}`, { next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json({ description: '', equipment: [] })
    const d = await res.json()

    const description = String(d.description ?? '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .split('\n').map(l => l.trim()).join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    return NextResponse.json({
      description,
      equipment:  Array.isArray(d.equipmentList) ? d.equipmentList : [],
      color:      d.mainExteriorColour ?? d.exteriorColour ?? '',
      doors:      d.numberOfDoors      ?? null,
      seats:      d.numberOfSeats      ?? null,
      owners:     d.numberOfOwners     ?? null,
      drive:      d.wheelDrive         ?? '',
      condition:  [d.conditionReport, d.motorCondition].map(v => typeof v === 'string' ? v.trim() : '').find(v => v) ?? '',
      url:        d.infoUrl            ?? '',
    })
  } catch {
    return NextResponse.json({ description: '', equipment: [] })
  }
}
