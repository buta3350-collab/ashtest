'use client'
import Image from 'next/image'

const WheelSVG = () => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="150" r="142" fill="#141414" stroke="#222" strokeWidth="2"/>
    <circle cx="150" cy="150" r="136" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="8" strokeDasharray="10 7"/>
    <circle cx="150" cy="150" r="118" fill="#0f0f0f" stroke="rgba(255,255,255,.14)" strokeWidth="2"/>
    <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1.5"/>
    <line x1="150" y1="150" x2="150" y2="38"  stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="254" y2="116" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="214" y2="239" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="86"  y2="239" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="46"  y2="116" stroke="rgba(255,255,255,.22)" strokeWidth="9" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="150" y2="38"  stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="254" y2="116" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="214" y2="239" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="86"  y2="239" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="150" y1="150" x2="46"  y2="116" stroke="rgba(227,6,19,.35)" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="150" cy="150" r="26" fill="#e30613" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"/>
    <circle cx="150" cy="150" r="14" fill="rgba(0,0,0,.5)" stroke="rgba(255,255,255,.15)" strokeWidth="1"/>
    <circle cx="150" cy="150" r="5"  fill="rgba(255,255,255,.3)"/>
  </svg>
)

export default function PageTransition() {
  return (
    <div id="page-transition" aria-hidden="true">
      <div className="pt-dust-trail">
        <span className="pt-dust d1"/>
        <span className="pt-dust d2"/>
        <span className="pt-dust d3"/>
        <span className="pt-dust d4"/>
        <span className="pt-dust d5"/>
        <span className="pt-dust d6"/>
      </div>
      <div className="pt-wheel-pos">
        <div className="pt-wheel-rot">
          <WheelSVG />
        </div>
      </div>
      <div className="pt-logo-wrap">
        <div className="pt-logo-glow"/>
        <div className="pt-logo-glow2"/>
        <Image src="/LOGO_crop.png" alt="" width={200} height={150} style={{ height: 150, width: 'auto', objectFit: 'contain', position: 'relative', zIndex: 3 }} />
      </div>
    </div>
  )
}
