import { NextRequest, NextResponse } from 'next/server'
import { graphFetch } from '@/lib/graph'

// Returns already-booked time slots for a date range so the calendar can block them.
// Query: ?start=2026-05-17&end=2026-06-17
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start') || new Date().toISOString().split('T')[0]
    const end   = searchParams.get('end')   || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]

    const mailboxType = searchParams.get('mailboxType')
    const mailbox = (mailboxType === 'autocenter' && process.env.BOOKING_MAILBOX_AUTOCENTER)
      ? process.env.BOOKING_MAILBOX_AUTOCENTER
      : process.env.BOOKING_MAILBOX!

    // Fetch calendar events in the given range from the shared mailbox
    const res = await graphFetch(
      `/users/${mailbox}/calendarView` +
      `?startDateTime=${start}T00:00:00&endDateTime=${end}T23:59:59` +
      `&$select=start,end,subject&$top=200`
    )

    if (!res.ok) {
      console.error('Graph calendarView Fehler:', await res.text())
      return NextResponse.json({ bookedSlots: [] })
    }

    const data = await res.json()
    const events: Array<{ start: { dateTime: string }; end: { dateTime: string } }> =
      data.value ?? []

    // Return booked slots as "YYYY-MM-DD HH:MM" strings
    const bookedSlots = events.map((e) => {
      const dt = new Date(e.start.dateTime)
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
    })

    return NextResponse.json({ bookedSlots })
  } catch (e) {
    console.error('Slots API Fehler:', e)
    return NextResponse.json({ bookedSlots: [] })
  }
}
