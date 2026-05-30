import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''

  // verkauf.autoshabani.at → rewrite to /verkauf internally
  if (hostname.startsWith('verkauf.')) {
    const url = request.nextUrl.clone()
    // Avoid double-prefixing on internal Next.js asset requests
    if (!url.pathname.startsWith('/verkauf')) {
      url.pathname = `/verkauf${url.pathname === '/' ? '' : url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
