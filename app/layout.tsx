import type { Metadata, Viewport } from 'next'
import { Manrope, Syncopate } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import CookieConsent from '@/components/CookieConsent'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const syncopate = Syncopate({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syncopate',
  display: 'swap',
})

const ethnocentric = localFont({
  src: './fonts/ethnocentric/Ethnocentric-Regular.otf',
  variable: '--font-ethnocentric',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Autoreinigung & Autocenter Shabani | Wolfsberg',
  description: 'Gebrauchtwagenhandel & professionelle Fahrzeugpflege in Wolfsberg. Seit 2004 — persönlich, ehrlich, zuverlässig.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0d10',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Early display-mode detection — prevents flash on light mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('shabani-modus');var p=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches;if(s==='light'||(!s&&p))document.documentElement.classList.add('light');})();`,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${syncopate.variable} ${ethnocentric.variable}`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
