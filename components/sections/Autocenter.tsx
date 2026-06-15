'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import CarDetailModal, { BrandLogo } from '@/components/CarDetailModal'
import CarProbefahrtModal from '@/components/CarProbefahrtModal'
import AnkaufModal from '@/components/AnkaufModal'
import type { WillhabenCar as WCar } from '@/app/api/vehicles/route'

// ── Filter constants ─────────────────────────────────────────────
const PRICE_STEPS = [
  { l:'Beliebig', v:'' },
  { l:'€ 1.000', v:'1000' }, { l:'€ 2.000', v:'2000' }, { l:'€ 3.000', v:'3000' },
  { l:'€ 5.000', v:'5000' }, { l:'€ 7.500', v:'7500' }, { l:'€ 10.000', v:'10000' },
  { l:'€ 15.000', v:'15000' }, { l:'€ 20.000', v:'20000' }, { l:'€ 25.000', v:'25000' },
  { l:'€ 30.000', v:'30000' }, { l:'€ 40.000', v:'40000' }, { l:'€ 50.000', v:'50000' },
  { l:'€ 75.000', v:'75000' }, { l:'€ 100.000', v:'100000' },
]
const KM_STEPS = [
  { l:'Beliebig', v:'' },
  { l:'5.000 km', v:'5000' }, { l:'10.000 km', v:'10000' }, { l:'20.000 km', v:'20000' },
  { l:'30.000 km', v:'30000' }, { l:'50.000 km', v:'50000' }, { l:'75.000 km', v:'75000' },
  { l:'100.000 km', v:'100000' }, { l:'125.000 km', v:'125000' }, { l:'150.000 km', v:'150000' },
  { l:'200.000 km', v:'200000' },
]
const CY = new Date().getFullYear()
const YR_STEPS = [
  { l:'Beliebig', v:'' },
  ...Array.from({ length: CY - 1989 }, (_, i) => { const y = CY - i; return { l: String(y), v: String(y) } }),
]
const PS_STEPS = [
  { l:'Beliebig', v:'' },
  ...['50','75','100','125','150','175','200','250','300','400','500'].map(v => ({ l:`${v} PS`, v })),
]
const KW_STEPS = [
  { l:'Beliebig', v:'' },
  ...['37','55','74','92','110','130','147','184','221','294','368'].map(v => ({ l:`${v} kW`, v })),
]
const SEAT_STEPS = [{ l:'Beliebig', v:'' }, ...['2','3','4','5','6','7','8','9'].map(v => ({ l:v, v }))]
const BODY_OPTS = [
  'Limousine', 'Kombi / Family Van', 'SUV / Geländewagen', 'Sportwagen / Coupé',
  'Cabrio / Roadster', 'Klein-/ Kompaktwagen', 'Kleinbus', 'Pickup',
]
const BODY_KEYS: Record<string, string[]> = {
  'Limousine':             ['limousine'],
  'Kombi / Family Van':    ['kombi', 'family'],
  'SUV / Geländewagen':    ['suv', 'geländewagen', 'gel'],
  'Sportwagen / Coupé':   ['sportwagen', 'coup'],
  'Cabrio / Roadster':     ['cabrio', 'roadster'],
  'Klein-/ Kompaktwagen':  ['klein', 'kompakt'],
  'Kleinbus':              ['kleinbus', 'van', 'minivan', 'bus'],
  'Pickup':                ['pickup'],
}

const CONDITIONS  = ['Gebrauchtwagen','Jahreswagen','Neuwagen','Oldtimer','Tageszulassung','Unfallwagen','Vorführwagen']
const FUELS       = ['Benzin','Diesel','Elektro','Gas','Hybrid Elektro/Benzin','Hybrid Elektro/Diesel','Wasserstoff']
const TRANS_OPTS  = ['Automatik','Schaltgetriebe']
const COLORS = [
  { l:'Schwarz', hex:'#111' }, { l:'Weiß', hex:'#f0f0f0' }, { l:'Silber', hex:'#bbb' },
  { l:'Grau', hex:'#777' },    { l:'Blau', hex:'#1a4db5' }, { l:'Rot', hex:'#cc1122' },
  { l:'Grün', hex:'#2a7a2a' }, { l:'Braun', hex:'#7a4a1a' },{ l:'Beige', hex:'#d4c4a0' },
  { l:'Gelb', hex:'#e8c420' }, { l:'Orange', hex:'#e86020' },{ l:'Gold', hex:'#c8a820' },
  { l:'Bronze', hex:'#8c5e2a'},{ l:'Violett', hex:'#6a1a8a'},
]
const EQUIP_CATS = [
  { id:'komfort', label:'Ausstattung & Komfort', items:[
    'Ambientebeleuchtung','Elektr. Fensterheber','Elektr. Heckklappe',
    'Elektr. Sitze','Elektr. Spiegel','Frontscheibenheizung',
    'Keyless Go','Lederausstattung','Lederlenkrad','Lenkradheizung',
    'Lordosenstütze','Massagesitze','Sitzbelüftung','Sitzheizung hinten',
    'Sitzheizung','Sportsitze','Standheizung','Start/Stop','Zentralverriegelung',
  ]},
  { id:'klima', label:'Klimatisierung', items:[
    '2-Zonen-Klimaautomatik','3-Zonen-Klimaautomatik','4-Zonen-Klimaautomatik',
    'Klimaanlage','Klimaautomatik',
  ]},
  { id:'assistenz', label:'Fahrassistenzsysteme', items:[
    '360°-Kamera','Abstandstempomat','Berganfahrassistent','Fernlichtassistent',
    'Notbremsassistent','Rückfahrkamera','Servolenkung','Spurhalteassistent',
    'Spurwechselassistent','Tempomat','Totwinkelassistent','Traktionskontrolle',
    'Verkehrszeichenerkennung',
  ]},
  { id:'info', label:'Infotainment & Konnektivität', items:[
    'Bluetooth','Bordcomputer','CD-Player','Freisprecheinrichtung',
    'Head-Up Display','Multifunktionslenkrad','Navigationssystem','Radio','USB',
  ]},
  { id:'lights', label:'Scheinwerfer', items:[
    'Kurvenlicht','Nebelscheinwerfer','Tagfahrlicht','Xenon',
  ]},
  { id:'safety', label:'Sicherheit & Sensoren', items:[
    'ABS','Beifahrerairbag','ESP','Fahrerairbag','Parksensor hinten',
    'Parksensor vorne','Reifendruckkontrolle','Seitenairbags','Wegfahrsperre',
  ]},
  { id:'extras', label:'Extras', items:[
    'Anhängerkupplung','Nichtraucherfahrzeug','Panoramadach',
    'Reserverad','Schiebedach','Sommerreifen','Winterreifen',
  ]},
]

// ── Types ────────────────────────────────────────────────────────
interface F {
  search: string; brands: string[]
  priceMin: string; priceMax: string
  kmMin: string; kmMax: string
  yearMin: string; yearMax: string
  bodyTypes: string[]; conditions: string[]
  powerMin: string; powerMax: string; powerUnit: 'PS' | 'kW'
  fuels: string[]; transmissions: string[]
  colors: string[]
  seatsMin: string; seatsMax: string
  equipment: string[]
  sort: string
}
const DF: F = {
  search: '', brands: [],
  priceMin: '', priceMax: '',
  kmMin: '', kmMax: '',
  yearMin: '', yearMax: '',
  bodyTypes: [], conditions: [],
  powerMin: '', powerMax: '', powerUnit: 'PS',
  fuels: [], transmissions: [],
  colors: [],
  seatsMin: '', seatsMax: '',
  equipment: [],
  sort: 'newest',
}

// ── Helpers ──────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('de-AT') }
function splitTitle(t: string) {
  const p = t.trim().split(' ')
  return { brand: p[0] ?? t, model: p.slice(1).join(' ') || '' }
}
function tog<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]
}
function normEq(s: string) { return s.toLowerCase().replace(/[-/°\s]/g, '') }
function normColor(s: string) { return s.toLowerCase().replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/[-\s]/g,'') }
function eqMatch(carEq: string[], item: string): boolean {
  const n = normEq(item)
  return carEq.some(e => { const ne = normEq(e); return ne.includes(n) || n.includes(ne) })
}
function bodyMatch(carBody: string, opt: string): boolean {
  const keys = BODY_KEYS[opt] ?? [opt.toLowerCase()]
  const cb = carBody.toLowerCase()
  return keys.some(k => cb.includes(k))
}

// Pure filter — skip: set of F-keys to not apply (for faceted counts)
function applyFilter(cars: WCar[], f: F, skip: ReadonlySet<keyof F> = new Set()): WCar[] {
  return cars.filter(c => {
    const br = c.make || splitTitle(c.title).brand
    if (!skip.has('search') && f.search) {
      const q = f.search.toLowerCase()
      if (!c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false
    }
    if (!skip.has('brands') && f.brands.length && !f.brands.includes(br)) return false
    if (!skip.has('priceMin') && f.priceMin && c.price < +f.priceMin) return false
    if (!skip.has('priceMax') && f.priceMax && c.price > +f.priceMax) return false
    if (!skip.has('kmMin') && f.kmMin && (c.km ?? 0) < +f.kmMin) return false
    if (!skip.has('kmMax') && f.kmMax && (c.km ?? Infinity) > +f.kmMax) return false
    if (!skip.has('yearMin') && f.yearMin && (c.year ?? 0) < +f.yearMin) return false
    if (!skip.has('yearMax') && f.yearMax && (c.year ?? 9999) > +f.yearMax) return false
    if (!skip.has('bodyTypes') && f.bodyTypes.length && !f.bodyTypes.some(bt => bodyMatch(c.body, bt))) return false
    // For fields where API data may be absent: only filter if the car has data AND it doesn't match.
    // Cars with no data for the field pass through (better than hiding valid results).
    if (!skip.has('conditions') && f.conditions.length && c.condition && !f.conditions.some(cd => c.condition.toLowerCase().includes(cd.toLowerCase()))) return false
    if (!skip.has('fuels') && f.fuels.length && c.fuel && !f.fuels.some(fu => c.fuel.toLowerCase().includes(fu.toLowerCase()))) return false
    if (!skip.has('transmissions') && f.transmissions.length && c.trans && !f.transmissions.some(tr => c.trans.toLowerCase().includes(tr.toLowerCase()))) return false
    if (!skip.has('colors') && f.colors.length) {
      const nc = normColor(c.color)
      // strict: if color filter active, cars with no color data are excluded too
      if (!nc || !f.colors.some(cl => { const nl = normColor(cl); return nl.length > 0 && (nc.includes(nl) || nl.includes(nc)) })) return false
    }
    // Seats: pass through if car has no data (null), only filter when data is present
    if (!skip.has('seatsMin') && f.seatsMin && c.seats !== null && c.seats < +f.seatsMin) return false
    if (!skip.has('seatsMax') && f.seatsMax && c.seats !== null && c.seats > +f.seatsMax) return false
    if (!skip.has('equipment') && f.equipment.length && !f.equipment.every(item => eqMatch(c.equipment, item))) return false
    if (f.powerMin || f.powerMax) {
      const toPS = (v: string) => f.powerUnit === 'kW' ? Math.round(+v * 1.35962) : +v
      if (!skip.has('powerMin') && f.powerMin && (c.power ?? 0) < toPS(f.powerMin)) return false
      if (!skip.has('powerMax') && f.powerMax && (c.power ?? 0) > toPS(f.powerMax)) return false
    }
    return true
  })
}

// ── Sub-components ───────────────────────────────────────────────
function FpSec({ id, title, badge, open, toggle, children }: {
  id: string; title: string; badge?: number; open: boolean
  toggle: (id: string) => void; children: React.ReactNode
}) {
  return (
    <div className={`fp-sec${badge ? ' fp-sec-active' : ''}`}>
      <button type="button" className="fp-sec-head" onClick={() => toggle(id)}>
        {badge ? <span className="fp-active-dot" aria-hidden="true" /> : null}
        <span className="fp-sec-title">{title}</span>
        {badge ? <span className="fp-badge">{badge}</span> : null}
        <svg className={`fp-chevron${open ? ' open' : ''}`} width="13" height="13"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && <div className="fp-sec-body">{children}</div>}
    </div>
  )
}

function ChkItem({ label, count, checked, onChange }: {
  label: string; count?: number; checked: boolean; onChange: () => void
}) {
  return (
    <label className={`fp-chk${checked ? ' on' : ''}`} onClick={onChange}>
      <span className={`fp-chk-box${checked ? ' on' : ''}`}>
        {checked && (
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 6l3 3 5-5"/>
          </svg>
        )}
      </span>
      <span className="fp-chk-label">{label}</span>
      {count != null && count > 0 && <span className="fp-chk-cnt">{count}</span>}
    </label>
  )
}

function RangeRow({ aOpts, bOpts, aVal, bVal, onA, onB }: {
  aOpts: { l: string; v: string }[]; bOpts: { l: string; v: string }[]
  aVal: string; bVal: string
  onA: (v: string) => void; onB: (v: string) => void
}) {
  const selStyle = 'fp-sel'
  return (
    <div className="fp-range-row">
      <select className={selStyle} value={aVal} onChange={e => onA(e.target.value)}>
        {aOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      <span className="fp-range-sep">–</span>
      <select className={selStyle} value={bVal} onChange={e => onB(e.target.value)}>
        {bOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

function CardBrand({ brand }: { brand: string }) {
  return <BrandLogo brand={brand} className="brand-badge-mono" size="lg" mono />
}

// ── Main section ──────────────────────────────────────────────────
export default function Autocenter() {
  const [filterOpen, setFilterOpen] = useState(false)
  const fpScrollRef      = useRef<HTMLDivElement>(null)
  const fpThumbRef     = useRef<HTMLDivElement>(null)
  const fpIndicatorRef = useRef<HTMLDivElement>(null)
  const fpRafRef       = useRef<number | null>(null)
  const [f, setF] = useState<F>(DF)
  const [cars, setCars] = useState<WCar[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)
  const [selectedCar, setSelectedCar]   = useState<WCar | null>(null)
  const [showProbefahrt, setShowProbefahrt] = useState(false)
  const [compareList, setCompareList]   = useState<WCar[]>([])
  const [showCompare, setShowCompare]   = useState(false)
  const [returnToCompare, setReturnToCompare] = useState(false)
  const [showSuche, setShowSuche]       = useState(false)
  const [showAnkauf, setShowAnkauf]     = useState(false)
  const [openSecs, setOpenSecs] = useState<Set<string>>(
    new Set(['brand', 'search', 'basis', 'type', 'motor', 'ausstattung', 'equip'])
  )
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try { return new Set(JSON.parse(localStorage.getItem('asc_favorites') || '[]')) } catch { return new Set() }
  })
  const [showFavsOnly, setShowFavsOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem('asc_recent') || '[]') } catch { return [] }
  })
  const [newCarIds, setNewCarIds] = useState<Set<string>>(new Set())

  function toggleFavorite(id: string) {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem('asc_favorites', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  function openCar(car: WCar) {
    setSelectedCar(car)
    setRecentlyViewed(prev => {
      const next = [car.id, ...prev.filter(id => id !== car.id)].slice(0, 6)
      try { localStorage.setItem('asc_recent', JSON.stringify(next)) } catch {}
      return next
    })
  }

  useEffect(() => {
    fetch('/api/vehicles')
      .then(r => r.json())
      .then(data => {
        const loadedCars: WCar[] = data.cars ?? []
        setCars(loadedCars); setLoading(false)
        try {
          const stored = JSON.parse(localStorage.getItem('asc_firstseen') || 'null')
          if (!stored) {
            const initial: Record<string, number> = {}
            loadedCars.forEach(c => { initial[c.id] = 0 })
            localStorage.setItem('asc_firstseen', JSON.stringify(initial))
          } else {
            const now = Date.now(); const updated = { ...stored }; const newIds = new Set<string>()
            loadedCars.forEach(c => { if (!(c.id in updated)) { updated[c.id] = now; newIds.add(c.id) } })
            localStorage.setItem('asc_firstseen', JSON.stringify(updated))
            setNewCarIds(newIds)
          }
        } catch {}
        const urlParam = new URLSearchParams(window.location.search).get('car')
        if (urlParam) { const found = loadedCars.find(c => c.id === urlParam); if (found) openCar(found) }
      })
      .catch(() => { setApiError(true); setLoading(false) })
  }, [])

  function updateFpSb(el: HTMLDivElement) {
    const thumb = fpThumbRef.current
    if (!thumb) return
    const ratio  = el.clientHeight / el.scrollHeight
    const thumbH = Math.max(ratio * el.clientHeight, 30)
    const maxTop = el.clientHeight - thumbH
    const thumbT = el.scrollHeight > el.clientHeight
      ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * maxTop
      : 0
    thumb.style.height    = thumbH + 'px'
    thumb.style.transform = `translateY(${thumbT}px)`
  }
  function handleFpScroll() {
    if (fpRafRef.current) cancelAnimationFrame(fpRafRef.current)
    fpRafRef.current = requestAnimationFrame(() => {
      const el  = fpScrollRef.current
      const ind = fpIndicatorRef.current
      if (!el) return
      const hasMore = el.scrollTop + el.clientHeight < el.scrollHeight - 24
      if (ind) ind.style.display = hasMore ? 'flex' : 'none'
      updateFpSb(el)
    })
  }
  useEffect(() => {
    const el  = fpScrollRef.current
    const ind = fpIndicatorRef.current
    if (!el) return
    if (ind) ind.style.display = el.scrollHeight > el.clientHeight + 24 ? 'flex' : 'none'
    updateFpSb(el)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOpen])


  // Faceted counts: each dimension computed from cars filtered by everything EXCEPT that dimension
  // → when brand = Audi, body type counts show only Audi body types, etc.
  const counts = useMemo(() => {
    const S = (k: keyof F) => new Set<keyof F>([k])
    const brand: Record<string, number> = {}
    const body:  Record<string, number> = {}
    const fuel:  Record<string, number> = {}
    const trans: Record<string, number> = {}
    const cond:  Record<string, number> = {}
    const color: Record<string, number> = {}
    const equip: Record<string, number> = {}

    applyFilter(cars, f, S('brands')).forEach(c => {
      const br = c.make || splitTitle(c.title).brand
      brand[br] = (brand[br] || 0) + 1
    })
    applyFilter(cars, f, S('bodyTypes')).forEach(c => {
      BODY_OPTS.forEach(bt => { if (bodyMatch(c.body, bt)) body[bt] = (body[bt] || 0) + 1 })
    })
    applyFilter(cars, f, S('fuels')).forEach(c => {
      FUELS.forEach(fu => { if (c.fuel.toLowerCase().includes(fu.toLowerCase())) fuel[fu] = (fuel[fu] || 0) + 1 })
    })
    applyFilter(cars, f, S('transmissions')).forEach(c => {
      TRANS_OPTS.forEach(tr => { if (c.trans.toLowerCase().includes(tr.toLowerCase())) trans[tr] = (trans[tr] || 0) + 1 })
    })
    applyFilter(cars, f, S('conditions')).forEach(c => {
      CONDITIONS.forEach(cd => { if (c.condition.toLowerCase().includes(cd.toLowerCase())) cond[cd] = (cond[cd] || 0) + 1 })
    })
    applyFilter(cars, f, S('colors')).forEach(c => {
      COLORS.forEach(cl => { const nc = normColor(c.color), nl = normColor(cl.l); if (nc && (nc.includes(nl) || nl.includes(nc))) color[cl.l] = (color[cl.l] || 0) + 1 })
    })
    applyFilter(cars, f, S('equipment')).forEach(c => {
      EQUIP_CATS.forEach(cat => {
        cat.items.forEach(item => { if (eqMatch(c.equipment, item)) equip[item] = (equip[item] || 0) + 1 })
      })
    })

    return { brand, body, fuel, trans, cond, color, equip }
  }, [cars, f])

  const uniqueBrands = useMemo(
    () => [...new Set(cars.map(c => c.make || splitTitle(c.title).brand).filter(Boolean))].sort(),
    [cars]
  )

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let r = applyFilter(cars, f)
    if (showFavsOnly) r = r.filter(c => favorites.has(c.id))
    switch (f.sort) {
      case 'price-asc':  r.sort((a, b) => a.price - b.price); break
      case 'price-desc': r.sort((a, b) => b.price - a.price); break
      case 'year-desc':  r.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)); break
      case 'year-asc':   r.sort((a, b) => (a.year ?? 0) - (b.year ?? 0)); break
      case 'km-asc':     r.sort((a, b) => (a.km ?? 0) - (b.km ?? 0)); break
    }
    return r
  }, [f, cars, showFavsOnly, favorites])

  const CARS_PER_PAGE = 6
  const totalPages = Math.ceil(filtered.length / CARS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * CARS_PER_PAGE, page * CARS_PER_PAGE)

  // Reset to page 1 whenever filters/sort change
  useEffect(() => { setPage(1) }, [filtered])

  function goToPage(p: number) {
    setPage(p)
    document.querySelector('#autocenter .cars-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeCount = useMemo(() => (
    f.brands.length + f.bodyTypes.length + f.conditions.length +
    f.fuels.length + f.transmissions.length +
    f.colors.length + f.equipment.length +
    (f.priceMin || f.priceMax ? 1 : 0) +
    (f.kmMin || f.kmMax ? 1 : 0) +
    (f.yearMin || f.yearMax ? 1 : 0) +
    (f.powerMin || f.powerMax ? 1 : 0) +
    (f.seatsMin || f.seatsMax ? 1 : 0) +
    (f.search ? 1 : 0)
  ), [f])

  const secBadge = useMemo(() => ({
    basis:      (f.priceMin || f.priceMax ? 1 : 0) + (f.kmMin || f.kmMax ? 1 : 0) + (f.yearMin || f.yearMax ? 1 : 0),
    type:       f.bodyTypes.length + f.conditions.length,
    motor:      f.fuels.length + f.transmissions.length + (f.powerMin || f.powerMax ? 1 : 0),
    ausstattung: f.colors.length + (f.seatsMin || f.seatsMax ? 1 : 0),
    equip:      f.equipment.length,
  }), [f])

  useEffect(() => {
    if (filterOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [filterOpen])


  function toggleSec(id: string) {
    setOpenSecs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function setKey<K extends keyof F>(key: K, val: F[K]) {
    setF(prev => ({ ...prev, [key]: val }))
  }
  function toggleMulti(key: keyof F, val: string) {
    setF(prev => ({ ...prev, [key]: tog(prev[key] as string[], val) }))
  }
  function reset() { setF(DF) }
  function toggleCompare(car: WCar) {
    setCompareList(prev =>
      prev.find(c => c.id === car.id)
        ? prev.filter(c => c.id !== car.id)
        : prev.length < 3 ? [...prev, car] : prev
    )
  }

  const PSS = f.powerUnit === 'PS' ? PS_STEPS : KW_STEPS

  return (
    <section id="autocenter" aria-label="Autocenter — Gebrauchtwagenbestand" className="ac-section">

      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          allCars={cars}
          onClose={() => {
            setSelectedCar(null)
            if (returnToCompare) { setReturnToCompare(false); setShowCompare(true) }
          }}
          onBook={() => setShowProbefahrt(true)}
          onCarSelect={c => openCar(c)}
          isFav={favorites.has(selectedCar.id)}
          onFav={() => toggleFavorite(selectedCar.id)}
          recentlyViewed={recentlyViewed.filter(id => id !== selectedCar.id).slice(0,5).map(id => cars.find(c => c.id === id)).filter(Boolean) as WCar[]}
        />
      )}
      {showProbefahrt && selectedCar && (
        <CarProbefahrtModal
          carTitle={selectedCar.title}
          onClose={() => setShowProbefahrt(false)}
        />
      )}

      <div className="ac-shell">

      <div className="ac-header">
        <div className="section-icon reveal" aria-hidden="true">
          <span className="section-icon-top" />
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 11l2-5h10l2 5" />
            <rect x="2" y="11" width="20" height="7" rx="1.5" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
            <path d="M2 15h4M18 15h4" />
          </svg>
        </div>
        <div className="section-num reveal">
          <span className="section-num-no">03</span>
          <span className="section-num-line" />
          <span className="section-num-label">Autocenter</span>
        </div>
        <h2 className="ac-h2 reveal">
          Fahrzeug<em>angebot</em>.
          <span className="h2-sub">Geprüfter Bestand aus Wolfsberg.</span>
        </h2>
        <p className="ac-lede reveal">
          Aktuelle Gebrauchtwagen direkt aus unserem Bestand. Filtern Sie nach Marke,
          Preis, Baujahr oder Ausstattung — oder lassen Sie uns Ihr Wunschfahrzeug suchen.
        </p>
      </div>

      <main className="verkauf-main">
        {/* Mobile filter toggle */}
        <button className="vk-filter-toggle" onClick={() => setFilterOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
          Filter
          {activeCount > 0 && <span className="vk-filter-count">{activeCount}</span>}
        </button>

        {filterOpen && <div className="vk-filter-backdrop open" onClick={() => setFilterOpen(false)} />}

        {/* ── FILTER PANEL ────────────────────────────────────── */}
        <aside className={`filter-panel${filterOpen ? ' open' : ''}`}>
        <div className="fp-scroll-wrap">
        <div className="fp-scroll-body" ref={fpScrollRef} onScroll={handleFpScroll}>

          {/* Header */}
          <div className="filter-head">
            <div className="fp-head-left">
              <h3>Filter</h3>
              {activeCount > 0 && <span className="fp-active-badge">{activeCount} aktiv</span>}
            </div>
            <button className="filter-reset-btn" type="button" onClick={reset}>Zurücksetzen</button>
          </div>

          {/* Brand grid */}
          {uniqueBrands.length > 0 && (
            <FpSec id="brand" title="Marke" badge={f.brands.length || undefined} open={openSecs.has('brand')} toggle={toggleSec}>
              <div className="fp-brand-grid">
                {uniqueBrands.map(br => (
                  <button
                    key={br}
                    type="button"
                    className={`fp-brand-chip${f.brands.includes(br) ? ' on' : ''}`}
                    onClick={() => toggleMulti('brands', br)}
                  >
                    <BrandLogo brand={br} size="sm" className="fp-brand-icon" mono />
                    <span className="fp-brand-name">{br}</span>
                    {counts.brand[br] && <span className="fp-brand-cnt">{counts.brand[br]}</span>}
                  </button>
                ))}
              </div>
            </FpSec>
          )}

          {/* Suchbegriff */}
          <FpSec id="search" title="Suchbegriff" badge={f.search ? 1 : undefined} open={openSecs.has('search')} toggle={toggleSec}>
            <div className="fp-input-wrap">
              <svg className="fp-input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="fp-input"
                placeholder="z. B. Modellvariante, Ausstattung…"
                value={f.search}
                onChange={e => setKey('search', e.target.value)}
              />
            </div>
          </FpSec>

          {/* Basisdaten */}
          <FpSec id="basis" title="Basisdaten" badge={secBadge.basis || undefined} open={openSecs.has('basis')} toggle={toggleSec}>
            <div className="fp-group-label">Preis</div>
            <RangeRow
              aOpts={PRICE_STEPS} bOpts={PRICE_STEPS}
              aVal={f.priceMin} bVal={f.priceMax}
              onA={v => setKey('priceMin', v)} onB={v => setKey('priceMax', v)}
            />
            <div className="fp-group-label">Kilometerstand</div>
            <RangeRow
              aOpts={KM_STEPS} bOpts={KM_STEPS}
              aVal={f.kmMin} bVal={f.kmMax}
              onA={v => setKey('kmMin', v)} onB={v => setKey('kmMax', v)}
            />
            <div className="fp-group-label">Erstzulassung</div>
            <RangeRow
              aOpts={YR_STEPS} bOpts={YR_STEPS}
              aVal={f.yearMin} bVal={f.yearMax}
              onA={v => setKey('yearMin', v)} onB={v => setKey('yearMax', v)}
            />
          </FpSec>

          {/* Typ & Zustand */}
          <FpSec id="type" title="Typ & Zustand" badge={secBadge.type || undefined} open={openSecs.has('type')} toggle={toggleSec}>
            <div className="fp-group-label">Fahrzeugtyp</div>
            <div className="fp-check-list">
              {BODY_OPTS.map(bt => (
                <ChkItem key={bt} label={bt} count={counts.body[bt]}
                  checked={f.bodyTypes.includes(bt)}
                  onChange={() => toggleMulti('bodyTypes', bt)} />
              ))}
            </div>
            <div className="fp-group-label" style={{ marginTop: 14 }}>Zustand</div>
            <div className="fp-check-list">
              {CONDITIONS.map(cd => (
                <ChkItem key={cd} label={cd} count={counts.cond[cd]}
                  checked={f.conditions.includes(cd)}
                  onChange={() => toggleMulti('conditions', cd)} />
              ))}
            </div>
          </FpSec>

          {/* Motor */}
          <FpSec id="motor" title="Motor" badge={secBadge.motor || undefined} open={openSecs.has('motor')} toggle={toggleSec}>
            <div className="fp-group-label">Leistung</div>
            <div className="fp-power-row">
              <div className="fp-unit-toggle">
                {(['PS','kW'] as const).map(u => (
                  <button key={u} type="button"
                    className={`fp-unit-btn${f.powerUnit === u ? ' on' : ''}`}
                    onClick={() => { setKey('powerUnit', u); setKey('powerMin', ''); setKey('powerMax', '') }}>
                    {u}
                  </button>
                ))}
              </div>
              <RangeRow
                aOpts={PSS} bOpts={PSS}
                aVal={f.powerMin} bVal={f.powerMax}
                onA={v => setKey('powerMin', v)} onB={v => setKey('powerMax', v)}
              />
            </div>
            <div className="fp-group-label" style={{ marginTop: 14 }}>Treibstoff</div>
            <div className="fp-check-list">
              {FUELS.map(fu => (
                <ChkItem key={fu} label={fu} count={counts.fuel[fu]}
                  checked={f.fuels.includes(fu)}
                  onChange={() => toggleMulti('fuels', fu)} />
              ))}
            </div>
            <div className="fp-group-label" style={{ marginTop: 14 }}>Getriebeart</div>
            <div className="fp-check-list">
              {TRANS_OPTS.map(tr => (
                <ChkItem key={tr} label={tr} count={counts.trans[tr]}
                  checked={f.transmissions.includes(tr)}
                  onChange={() => toggleMulti('transmissions', tr)} />
              ))}
            </div>
          </FpSec>

          {/* Ausstattung (Farbe, Türen, Sitze) */}
          <FpSec id="ausstattung" title="Ausstattung" badge={secBadge.ausstattung || undefined} open={openSecs.has('ausstattung')} toggle={toggleSec}>
            <div className="fp-group-label">Farbe</div>
            <div className="fp-color-grid">
              {COLORS.map(c => (
                <button key={c.l} type="button"
                  className={`fp-color-btn${f.colors.includes(c.l) ? ' on' : ''}`}
                  title={c.l}
                  onClick={() => toggleMulti('colors', c.l)}
                  style={{ '--color-hex': c.hex } as React.CSSProperties}
                >
                  <span className="fp-color-swatch" style={{ background: c.hex }} />
                  <span className="fp-color-label">{c.l}</span>
                  {counts.color[c.l] ? <span className="fp-color-cnt">{counts.color[c.l]}</span> : null}
                </button>
              ))}
            </div>
            <div className="fp-group-label" style={{ marginTop: 14 }}>Anzahl der Sitze</div>
            <RangeRow
              aOpts={SEAT_STEPS} bOpts={SEAT_STEPS}
              aVal={f.seatsMin} bVal={f.seatsMax}
              onA={v => setKey('seatsMin', v)} onB={v => setKey('seatsMax', v)}
            />
          </FpSec>

          {/* Ausstattung & Extras */}
          <FpSec id="equip" title="Ausstattung & Extras" badge={secBadge.equip || undefined} open={openSecs.has('equip')} toggle={toggleSec}>
            {EQUIP_CATS.map(cat => (
              <div key={cat.id} className="fp-equip-cat">
                <div className="fp-equip-cat-label">{cat.label}</div>
                <div className="fp-check-list">
                  {cat.items.map(item => (
                    <ChkItem key={item} label={item}
                      count={counts.equip[item]}
                      checked={f.equipment.includes(item)}
                      onChange={() => toggleMulti('equipment', item)} />
                  ))}
                </div>
              </div>
            ))}
          </FpSec>

        </div>{/* end fp-scroll-body */}

        {/* Scroll-down indicator — visibility toggled directly via ref */}
        <div ref={fpIndicatorRef} className="cv2-scroll-indicator" style={{ display: 'none' }}>
          <div className="cv2-scroll-indicator-fade" />
          <div className="cv2-scroll-indicator-btn" onClick={() => fpScrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' })}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9l7 7 7-7"/>
            </svg>
          </div>
        </div>
        {/* Custom red scrollbar */}
        <div className="cv2-custom-sb" aria-hidden="true">
          <div ref={fpThumbRef} className="cv2-custom-sb-thumb" />
        </div>

        </div>{/* end fp-scroll-wrap */}
        </aside>

        {/* ── CARS SECTION ─────────────────────────────────────── */}
        <section className="cars-section">
          <div className="cars-toolbar">
            <span className="results-count">
              {loading ? 'Lade Fahrzeuge…' : <><strong>{filtered.length}</strong> Fahrzeuge gefunden</>}
            </span>
            <div className="cars-toolbar-right">
              <button className={`favs-toggle-btn${showFavsOnly ? ' on' : ''}`} onClick={() => setShowFavsOnly(s => !s)} title="Merkliste anzeigen">
                <svg width="13" height="13" viewBox="0 0 24 24" fill={showFavsOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                {showFavsOnly ? 'Alle anzeigen' : `Merkliste${favorites.size > 0 ? ` (${favorites.size})` : ''}`}
              </button>
              <div className="sort-wrap">
                <svg className="sort-wrap-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 5h18M6 10h12M9 15h6M11 20h2"/></svg>
                <span className="sort-wrap-label">Sortieren</span>
                <select className="sort-select" value={f.sort} onChange={e => setKey('sort', e.target.value)}>
                  <option value="newest">Neueste zuerst</option>
                  <option value="price-asc">Preis ↑</option>
                  <option value="price-desc">Preis ↓</option>
                  <option value="year-desc">Baujahr: neueste</option>
                  <option value="year-asc">Baujahr: älteste</option>
                  <option value="km-asc">Kilometer ↑</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="no-results"><p>Fahrzeuge werden geladen…</p></div>
          ) : apiError ? (
            <div className="no-results">
              <h3>Fehler beim Laden</h3>
              <p>Die Fahrzeugdaten konnten nicht abgerufen werden. Bitte versuchen Sie es später erneut.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <h3>Keine Fahrzeuge gefunden</h3>
              <p>Versuchen Sie es mit anderen Filtereinstellungen oder setzen Sie die Filter zurück.</p>
              <button type="button" className="filter-reset-btn" style={{ marginTop: 12, fontSize: '.9rem' }} onClick={reset}>
                Filter zurücksetzen
              </button>
              <button type="button" className="suche-noresults-btn" onClick={() => setShowSuche(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Wunschfahrzeug anfragen
              </button>
            </div>
          ) : (
            <>
              <div className="cars-grid">
                {paginated.map(car => (
                  <CarCard key={car.id} car={car}
                    onDetails={() => openCar(car)}
                    comparing={compareList.some(c => c.id === car.id)}
                    onCompare={() => toggleCompare(car)}
                    compareDisabled={compareList.length >= 3 && !compareList.some(c => c.id === car.id)}
                    isFav={favorites.has(car.id)}
                    onFav={() => toggleFavorite(car.id)}
                    isNew={newCarIds.has(car.id)}
                  />
                ))}
              </div>

              {/* ── Wunschfahrzeug CTA + Pagination + Ankauf ─── */}
              <div className="wunsch-cta">
                {totalPages > 1 && (
                  <>
                    <div className="pagination">
                      <button className="pg-btn pg-arrow" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label="Vorherige Seite">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                        const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1
                        const showDotsBefore = p === page - 2 && page > 4
                        const showDotsAfter  = p === page + 2 && page < totalPages - 3
                        if (showDotsBefore) return <span key={`db${p}`} className="pg-dots">…</span>
                        if (showDotsAfter)  return <span key={`da${p}`} className="pg-dots">…</span>
                        if (!show) return null
                        return (
                          <button key={p} className={`pg-btn${page === p ? ' active' : ''}`} onClick={() => goToPage(p)}>
                            {p}
                          </button>
                        )
                      })}
                      <button className="pg-btn pg-arrow" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label="Nächste Seite">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                    <div className="pg-info">
                      <span>Seite</span>
                      <input
                        className="pg-jump-input"
                        type="number"
                        min={1}
                        max={totalPages}
                        defaultValue={page}
                        key={page}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const v = parseInt((e.target as HTMLInputElement).value)
                            if (!isNaN(v) && v >= 1 && v <= totalPages) goToPage(v)
                          }
                        }}
                        onBlur={e => {
                          const v = parseInt(e.target.value)
                          if (!isNaN(v) && v >= 1 && v <= totalPages) goToPage(v)
                          else e.target.value = String(page)
                        }}
                        aria-label="Zur Seite springen"
                      />
                      <span>von {totalPages}</span>
                    </div>
                    <div className="wunsch-cta-divider" />
                  </>
                )}
                <div className="wunsch-cta-row">
                  <div className="wunsch-cta-text">
                    <span className="wunsch-cta-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      Wunschfahrzeug nicht dabei?
                    </span>
                    <span className="wunsch-cta-sub">Wir suchen österreichweit gezielt für Sie — kostenlos &amp; unverbindlich.</span>
                  </div>
                  <button className="wunsch-cta-btn" onClick={() => setShowSuche(true)}>Anfrage stellen</button>
                </div>
                <div className="wunsch-cta-divider" />
                <div className="wunsch-cta-row">
                  <div className="wunsch-cta-text">
                    <span className="wunsch-cta-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      Möchten Sie Ihr Fahrzeug verkaufen?
                    </span>
                    <span className="wunsch-cta-sub">Wir kaufen Fahrzeuge aller Marken &amp; Modelle — kostenlose Bewertung, faire Preise.</span>
                  </div>
                  <button className="wunsch-cta-btn" onClick={() => setShowAnkauf(true)}>Jetzt anfragen</button>
                </div>
              </div>

            </>
          )}


        </section>
      </main>

      {/* ── Compare bar ─────────────────────────────────── */}
      {compareList.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-inner">
            <div className="compare-bar-cars">
              {compareList.map(c => (
                <div key={c.id} className="compare-bar-item">
                  {c.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={c.image} alt={c.title} className="compare-bar-img" />
                    : <div className="compare-bar-img compare-bar-img-empty" />}
                  <div className="compare-bar-info">
                    <span className="compare-bar-name">{c.title}</span>
                    <span className="compare-bar-price">{c.price > 0 ? `€ ${c.price.toLocaleString('de-AT')}` : c.priceText}</span>
                  </div>
                  <button className="compare-bar-remove" onClick={() => toggleCompare(c)} aria-label="Entfernen">×</button>
                </div>
              ))}
              {compareList.length < 3 && (
                <div className="compare-bar-item compare-bar-placeholder">
                  <div className="compare-bar-add-icon">+</div>
                  <span>Fahrzeug hinzufügen</span>
                </div>
              )}
            </div>
            <div className="compare-bar-actions">
              <button className="compare-bar-btn" onClick={() => setShowCompare(true)}
                disabled={compareList.length < 2}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10M12 20V4M6 20v-6"/>
                </svg>
                Vergleichen ({compareList.length})
              </button>
              <button className="compare-bar-clear" onClick={() => setCompareList([])}>Alles löschen</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Compare modal ────────────────────────────────── */}
      {showCompare && compareList.length >= 2 && (
        <CompareModal
          cars={compareList}
          onClose={() => setShowCompare(false)}
          onDetails={c => { setShowCompare(false); setReturnToCompare(true); setSelectedCar(c) }}
          onRemove={(c) => {
            const next = compareList.filter(x => x.id !== c.id)
            setCompareList(next)
            if (next.length < 2) setShowCompare(false)
          }}
        />
      )}

      {/* ── Suche für mich modal ─────────────────────────── */}
      {showSuche && <SucheModal onClose={() => setShowSuche(false)} />}

      {/* ── Ankauf modal ─────────────────────────────────── */}
      {showAnkauf && <AnkaufModal onClose={() => setShowAnkauf(false)} />}


      </div>{/* ac-shell */}
    </section>
  )
}

// ── Car card ─────────────────────────────────────────────────────
function carSilhouette(body: string) {
  const sil: Record<string, string> = {
    'SUV':        '<svg viewBox="0 0 200 80" fill="currentColor"><path d="M10 60 L20 60 C20 68 26 74 34 74 C42 74 48 68 48 60 L152 60 C152 68 158 74 166 74 C174 74 180 68 180 60 L190 60 L190 50 L175 30 L155 22 L140 18 L80 18 L60 22 L45 30 L20 38 L10 45 Z"/></svg>',
    'Limousine':  '<svg viewBox="0 0 200 70" fill="currentColor"><path d="M5 52 L15 52 C15 60 21 66 29 66 C37 66 43 60 43 52 L157 52 C157 60 163 66 171 66 C179 66 185 60 185 52 L195 52 L195 45 L175 30 L150 22 L130 18 L70 18 L50 22 L30 30 L15 38 L5 42 Z"/></svg>',
    'Kombi':      '<svg viewBox="0 0 200 70" fill="currentColor"><path d="M5 52 L15 52 C15 60 21 66 29 66 C37 66 43 60 43 52 L157 52 C157 60 163 66 171 66 C179 66 185 60 185 52 L195 52 L195 22 L180 18 L155 14 L130 14 L70 14 L45 18 L25 26 L10 36 L5 42 Z"/></svg>',
    'Coupé':      '<svg viewBox="0 0 200 65" fill="currentColor"><path d="M5 48 L15 48 C15 56 21 62 29 62 C37 62 43 56 43 48 L157 48 C157 56 163 62 171 62 C179 62 185 56 185 48 L195 48 L195 42 L165 22 L130 14 L80 16 L50 24 L25 32 L10 38 L5 42 Z"/></svg>',
    'Cabrio':     '<svg viewBox="0 0 200 60" fill="currentColor"><path d="M5 48 L15 48 C15 54 20 58 28 58 C36 58 42 54 42 48 L158 48 C158 54 164 58 172 58 C180 58 186 54 186 48 L195 48 L195 38 L170 26 L130 22 L70 22 L30 28 L10 36 L5 42 Z M50 22 L150 22 L150 18 L50 18 Z"/></svg>',
    'Van':        '<svg viewBox="0 0 200 80" fill="currentColor"><path d="M10 62 L20 62 C20 70 26 76 34 76 C42 76 48 70 48 62 L152 62 C152 70 158 76 166 76 C174 76 180 70 180 62 L190 62 L190 30 L175 14 L150 10 L50 10 L30 18 L15 32 L10 42 Z"/></svg>',
    'Kleinwagen': '<svg viewBox="0 0 200 70" fill="currentColor"><path d="M15 52 L25 52 C25 60 31 66 39 66 C47 66 53 60 53 52 L147 52 C147 60 153 66 161 66 C169 66 175 60 175 52 L185 52 L185 44 L165 24 L140 18 L60 18 L35 24 L20 36 L15 42 Z"/></svg>',
    'Pickup':     '<svg viewBox="0 0 200 75" fill="currentColor"><path d="M5 58 L15 58 C15 66 21 72 29 72 C37 72 43 66 43 58 L157 58 C157 66 163 72 171 72 C179 72 185 66 185 58 L195 58 L195 28 L130 28 L130 14 L70 14 L70 28 L40 28 L25 36 L10 46 L5 50 Z"/></svg>',
  }
  return sil[body] ?? sil['Limousine']
}

function SucheModal({ onClose }: { onClose: () => void }) {
  const [dialCode, setDialCode] = useState('+43')
  const [form, setForm] = useState({
    name: '', email: '', telefon: '',
    marke: '', modell: '', baujahr: '', budget: '', km: '',
    kraftstoff: '', karosserie: '', notiz: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }))

  const canSend = form.name.trim() && form.email.trim() && form.telefon.trim()

  async function send() {
    if (!canSend || status === 'loading') return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, telefon: `${dialCode} ${form.telefon}` }),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error || 'Fehler beim Senden.'); setStatus('error'); return }
      setStatus('success')
    } catch {
      setErrorMsg('Netzwerkfehler. Bitte versuchen Sie es erneut.')
      setStatus('error')
    }
  }

  return (
    <div className="suche-backdrop" onClick={onClose}>
      <div className="suche-modal" onClick={e => e.stopPropagation()}>

        <div className="suche-head">
          <div style={{flex:1}}>
            <div className="akm-eyebrow">Autocenter Shabani</div>
            <h2 className="akm-title" style={{fontSize:'1.2rem'}}>Wunschfahrzeug <em>anfragen</em></h2>
            <p className="akm-subtitle">Kein passendes Fahrzeug gefunden? Teilen Sie uns Ihre Wünsche mit — wir finden es für Sie.</p>
          </div>
          <button className="akm-close" style={{position:'static',float:'none',margin:'0 0 0 12px',flexShrink:0}} onClick={onClose} aria-label="Schließen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="suche-success">
            <div className="suche-success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3>Anfrage erfolgreich übermittelt!</h3>
            <p>Vielen Dank, <strong>{form.name}</strong>. Wir haben Ihre Anfrage erhalten und werden Sie unter <strong>{form.telefon}</strong> telefonisch kontaktieren zur Bestätigung Ihres Suchauftrags.</p>
            <button className="suche-send" style={{ marginTop: 8 }} onClick={onClose}>Schließen</button>
          </div>
        ) : (
          <>
            <div className="suche-body">

              {/* ── Kontaktdaten ──────────────────────────── */}
              <div className="suche-section-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Ihre Kontaktdaten
              </div>
              <div className="suche-grid">
                <div className="suche-field suche-field-full">
                  <label>Vor- und Nachname <span className="suche-required">*</span></label>
                  <input type="text" placeholder="z. B. Max Mustermann" value={form.name} onChange={f('name')} />
                </div>
                <div className="suche-field">
                  <label>E-Mail-Adresse <span className="suche-required">*</span></label>
                  <input type="email" placeholder="ihre@email.at" value={form.email} onChange={f('email')} />
                </div>
                <div className="suche-field">
                  <label>Telefonnummer <span className="suche-required">*</span></label>
                  <div className="ckm-phone-wrap">
                    <select className="ckm-dial" value={dialCode} onChange={e => setDialCode(e.target.value)}>
                      <option value="+43">🇦🇹 +43</option><option value="+49">🇩🇪 +49</option><option value="+41">🇨🇭 +41</option>
                      <option value="+39">🇮🇹 +39</option><option value="+36">🇭🇺 +36</option><option value="+421">🇸🇰 +421</option>
                      <option value="+420">🇨🇿 +420</option><option value="+48">🇵🇱 +48</option><option value="+386">🇸🇮 +386</option>
                      <option value="+385">🇭🇷 +385</option><option value="+381">🇷🇸 +381</option><option value="+387">🇧🇦 +387</option>
                      <option value="+382">🇲🇪 +382</option><option value="+355">🇦🇱 +355</option><option value="+389">🇲🇰 +389</option>
                      <option value="+40">🇷🇴 +40</option><option value="+359">🇧🇬 +359</option><option value="+30">🇬🇷 +30</option>
                      <option value="+90">🇹🇷 +90</option><option value="+44">🇬🇧 +44</option><option value="+33">🇫🇷 +33</option>
                      <option value="+34">🇪🇸 +34</option><option value="+351">🇵🇹 +351</option><option value="+31">🇳🇱 +31</option>
                      <option value="+32">🇧🇪 +32</option><option value="+352">🇱🇺 +352</option><option value="+45">🇩🇰 +45</option>
                      <option value="+46">🇸🇪 +46</option><option value="+47">🇳🇴 +47</option><option value="+358">🇫🇮 +358</option>
                    </select>
                    <input type="tel" placeholder="664 123 456" value={form.telefon} onChange={f('telefon')} />
                  </div>
                </div>
              </div>

              {/* ── Fahrzeugwünsche ───────────────────────── */}
              <div className="suche-section-label" style={{ marginTop: 20 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="7" rx="2"/><path d="M6 11L9 5h6l3 6"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/></svg>
                Fahrzeugwünsche
              </div>
              <div className="suche-grid">
                <div className="suche-field">
                  <label>Wunsch-Marke</label>
                  <input type="text" placeholder="z. B. BMW, Audi, VW…" value={form.marke} onChange={f('marke')} />
                </div>
                <div className="suche-field">
                  <label>Modell</label>
                  <input type="text" placeholder="z. B. 3er, A4, Golf…" value={form.modell} onChange={f('modell')} />
                </div>
                <div className="suche-field">
                  <label>Baujahr ab</label>
                  <input type="number" placeholder="z. B. 2018" min="1990" max="2025" value={form.baujahr} onChange={f('baujahr')} />
                </div>
                <div className="suche-field">
                  <label>Max. Budget (€)</label>
                  <input type="number" placeholder="z. B. 15000" value={form.budget} onChange={f('budget')} />
                </div>
                <div className="suche-field">
                  <label>Max. Kilometerstand</label>
                  <input type="number" placeholder="z. B. 100000" value={form.km} onChange={f('km')} />
                </div>
                <div className="suche-field">
                  <label>Kraftstoff</label>
                  <select value={form.kraftstoff} onChange={f('kraftstoff')}>
                    <option value="">Beliebig</option>
                    {['Benzin','Diesel','Elektro','Hybrid','Gas'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="suche-field">
                  <label>Karosserie</label>
                  <select value={form.karosserie} onChange={f('karosserie')}>
                    <option value="">Beliebig</option>
                    {['Limousine','Kombi','SUV','Coupé','Cabrio','Kleinwagen','Van'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="suche-field suche-field-full" style={{ marginTop: 12 }}>
                <label style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span>Weitere Wünsche</span>
                  <span className={`suche-char-count${form.notiz.length >= 480 ? ' warn' : ''}`}>{form.notiz.length}/500</span>
                </label>
                <textarea placeholder="Farbe, Ausstattung, Getriebe, Sonstiges…" value={form.notiz} onChange={f('notiz')} rows={3} maxLength={500} />
              </div>

              {status === 'error' && (
                <p className="suche-error">{errorMsg}</p>
              )}
            </div>

            <div className="suche-footer">
              <p className="suche-hint">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Wir kontaktieren Sie telefonisch zur Bestätigung des Suchauftrags.
              </p>
              <button className="suche-send" onClick={send} disabled={!canSend || status === 'loading'}>
                {status === 'loading' ? (
                  <><span className="suche-spinner" /> Wird gesendet…</>
                ) : (
                  <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Suchauftrag absenden</>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

const MiGauge = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12L8.5 8.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><path d="M16.5 5.5L22 2"/></svg>
const MiFuel  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M3 11h12"/><path d="M15 6h1a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h0a1 1 0 0 0 1-1V8l-3-3"/><line x1="1" y1="22" x2="23" y2="22"/></svg>
const MiGear  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const MiZap   = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 17.5A9 9 0 0 1 19.5 17.5"/><path d="M12 17.5l3-6"/><circle cx="12" cy="17.5" r="1.5" fill="currentColor" stroke="none"/></svg>

function CarCard({ car, onDetails, comparing, onCompare, compareDisabled, isFav, onFav, isNew }: {
  car: WCar; onDetails: () => void
  comparing: boolean; onCompare: () => void; compareDisabled: boolean
  isFav?: boolean; onFav?: () => void; isNew?: boolean
}) {
  const { brand, model } = splitTitle(car.title)
  const br = car.make || brand
  return (
    <div className="car-card" onClick={onDetails} style={{ cursor: 'pointer' }}>
      <div className="car-img">
        {car.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={car.image} alt={car.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="car-silhouette" dangerouslySetInnerHTML={{ __html: carSilhouette(car.body) }} />
        )}
      </div>
      <div className="car-info">
        <div className="car-brand-row-card">
          <CardBrand brand={br} />
          <span className="car-brand-name">{br}</span>
        </div>
        <h3 className="car-model">{model || br}</h3>
        {(car.year || isNew || car.isOffer) && (
          <div className="car-tags">
            {car.year && <span className="car-tag">{car.year}</span>}
            {isNew && <span className="car-tag car-tag-new">Neu</span>}
            {car.isOffer && <span className="car-tag car-tag-offer">Angebot</span>}
          </div>
        )}
        <div className="car-meta">
          {car.km   != null && <span><MiGauge />{fmt(car.km)} km</span>}
          {car.fuel          && <span><MiFuel />{car.fuel}</span>}
          {car.trans         && <span><MiGear />{car.trans}</span>}
          {car.power != null && <span><MiZap />{car.power} PS</span>}
        </div>
        <div className="car-bottom">
          <div className="car-price">
            {car.price > 0 ? <>€ {fmt(car.price)}<small>,–</small></> : car.priceText}
          </div>
          <div className="car-btns">
            <button type="button" className="car-detail-btn" onClick={e => { e.stopPropagation(); onDetails() }}>
              Details
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button type="button"
              className={`car-compare-btn${comparing ? ' on' : ''}`}
              disabled={compareDisabled}
              onClick={e => { e.stopPropagation(); onCompare() }}
              title={comparing ? 'Aus Vergleich entfernen' : 'Zum Vergleich hinzufügen'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
            </button>
            <button type="button" className={`car-compare-btn${isFav ? ' on' : ''}`}
              onClick={e => { e.stopPropagation(); onFav?.() }}
              title={isFav ? 'Aus Merkliste entfernen' : 'Zur Merkliste hinzufügen'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompareModal({ cars, onClose, onRemove, onDetails }: {
  cars: WCar[]
  onClose: () => void
  onRemove: (c: WCar) => void
  onDetails: (c: WCar) => void
}) {
  const n = cars.length
  const colClass = `cv2-cols-${n}`

  const [gallery, setGallery]     = useState<WCar | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)
  const [panX, setPanX]           = useState(0)
  const [panY, setPanY]           = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const [activeSection, setActiveSection] = useState<'merkmale'|'fahrzeugdaten'|'gesamtwertung'|'ausstattung'|'gemeinsam'|'alleinstellung'>('merkmale')
  const panStartRef           = useRef<{ x: number; y: number; px: number; py: number } | null>(null)
  const sectionLockRef        = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevScrollTopRef      = useRef(0)
  const scrollRef             = useRef<HTMLDivElement>(null)
  const cvThumbRef            = useRef<HTMLDivElement>(null)
  const cvIndicatorRef        = useRef<HTMLDivElement>(null)
  const cvRafRef              = useRef<number | null>(null)
  const secMerkmaleRef        = useRef<HTMLDivElement>(null)
  const secFahrzeugRef        = useRef<HTMLDivElement>(null)
  const secGesamtwertungRef   = useRef<HTMLDivElement>(null)
  const secAusstattungRef     = useRef<HTMLDivElement>(null)
  const secGemeinsamRef       = useRef<HTMLDivElement>(null)
  const secAlleinstellungRef  = useRef<HTMLDivElement>(null)

  function updateCvSb(el: HTMLDivElement) {
    const thumb = cvThumbRef.current
    if (!thumb) return
    const ratio  = el.clientHeight / el.scrollHeight
    const thumbH = Math.max(ratio * el.clientHeight, 30)
    const maxTop = el.clientHeight - thumbH
    const thumbT = el.scrollHeight > el.clientHeight
      ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * maxTop
      : 0
    thumb.style.height    = thumbH + 'px'
    thumb.style.transform = `translateY(${thumbT}px)`
  }
  function handleScroll() {
    if (cvRafRef.current) cancelAnimationFrame(cvRafRef.current)
    cvRafRef.current = requestAnimationFrame(() => {
    const el  = scrollRef.current
    const ind = cvIndicatorRef.current
    if (!el) return
    const scrollingUp = el.scrollTop < prevScrollTopRef.current
    prevScrollTopRef.current = el.scrollTop
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    const hasMore = !atBottom && el.scrollTop + el.clientHeight < el.scrollHeight - 24
    if (ind) ind.style.display = hasMore ? 'flex' : 'none'
    if (sectionLockRef.current) { updateCvSb(el); return }
    const stickyH = secMerkmaleRef.current?.offsetHeight ?? 0
    const fTop  = secFahrzeugRef.current?.offsetTop        ?? Infinity
    const aTop  = secAusstattungRef.current?.offsetTop     ?? Infinity
    const cmTop = secGemeinsamRef.current?.offsetTop       ?? Infinity
    const alTop = secAlleinstellungRef.current?.offsetTop  ?? Infinity
    if (scrollingUp) {
      // UP: a section activates only when its heading is fully visible at the top of the viewport
      const visTop = el.scrollTop + stickyH
      const found = [
        { top: fTop,  key: 'fahrzeugdaten'  as const },
        { top: aTop,  key: 'ausstattung'    as const },
        { top: cmTop, key: 'gemeinsam'      as const },
        { top: alTop, key: 'alleinstellung' as const },
      ].find(s => s.top >= visTop)
      setActiveSection(found?.key ?? 'alleinstellung')
    } else {
      // DOWN: current behaviour (unchanged)
      const st = el.scrollTop + stickyH + 16
      if      (atBottom || st >= alTop) setActiveSection('alleinstellung')
      else if (st >= cmTop) setActiveSection('gemeinsam')
      else if (st >= aTop)  setActiveSection('ausstattung')
      else if (st >= fTop)  setActiveSection('fahrzeugdaten')
      else                  setActiveSection('merkmale')
    }
    updateCvSb(el)
    }) // end rAF
  }
  function scrollToSection(ref: React.RefObject<HTMLDivElement | null>, key?: string) {
    if (key) {
      setActiveSection(key as typeof activeSection)
      if (sectionLockRef.current) clearTimeout(sectionLockRef.current)
      sectionLockRef.current = setTimeout(() => { sectionLockRef.current = null }, 900)
    }
    if (key === 'merkmale') {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const stickyH = secMerkmaleRef.current?.offsetHeight ?? 0
    const top = Math.max(0, (ref.current?.offsetTop ?? 0) - stickyH)
    scrollRef.current?.scrollTo({ top, behavior: 'smooth' })
  }
  useEffect(() => {
    const el  = scrollRef.current
    const ind = cvIndicatorRef.current
    if (!el) return
    if (ind) ind.style.display = el.scrollHeight > el.clientHeight + 24 ? 'flex' : 'none'
    updateCvSb(el)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gallery) { setGallery(null); setZoomScale(1); setPanX(0); setPanY(0); return }
        onClose()
      }
      if (gallery) {
        if (e.key === 'ArrowLeft'  && activeImg > 0)                         { setActiveImg(i => i - 1); setZoomScale(1); setPanX(0); setPanY(0) }
        if (e.key === 'ArrowRight' && activeImg < gallery.images.length - 1) { setActiveImg(i => i + 1); setZoomScale(1); setPanX(0); setPanY(0) }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, gallery, activeImg])

  function openGallery(car: WCar) { setGallery(car); setActiveImg(0); setZoomScale(1); setPanX(0); setPanY(0) }
  function closeGallery()         { setGallery(null); setZoomScale(1); setPanX(0); setPanY(0) }
  function galleryGoTo(i: number) { setActiveImg(i); setZoomScale(1); setPanX(0); setPanY(0) }

  function onZoomPanStart(x: number, y: number) {
    if (zoomScale <= 1) return
    panStartRef.current = { x, y, px: panX, py: panY }
    setIsPanning(true)
  }
  function onZoomPanMove(x: number, y: number) {
    if (!panStartRef.current) return
    setPanX(panStartRef.current.px + x - panStartRef.current.x)
    setPanY(panStartRef.current.py + y - panStartRef.current.y)
  }
  function onZoomPanEnd() { panStartRef.current = null; setIsPanning(false) }
  function onZoomClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (zoomScale >= 2) { setZoomScale(1); setPanX(0); setPanY(0) }
    else setZoomScale(2.5)
  }

  function bestSet(fn: (c: WCar) => number | null, dir: 'high' | 'low'): Set<string> {
    const vals = cars.map(c => ({ id: c.id, v: fn(c) })).filter(x => x.v !== null) as { id: string; v: number }[]
    if (vals.length < 2) return new Set()
    if (vals.every(x => x.v === vals[0].v)) return new Set()
    const best = dir === 'high' ? Math.max(...vals.map(x => x.v)) : Math.min(...vals.map(x => x.v))
    return new Set(vals.filter(x => x.v === best).map(x => x.id))
  }
  function worstSet(fn: (c: WCar) => number | null, dir: 'high' | 'low'): Set<string> {
    const vals = cars.map(c => ({ id: c.id, v: fn(c) })).filter(x => x.v !== null) as { id: string; v: number }[]
    if (vals.length < 2) return new Set()
    if (vals.every(x => x.v === vals[0].v)) return new Set()
    const worst = dir === 'high' ? Math.min(...vals.map(x => x.v)) : Math.max(...vals.map(x => x.v))
    return new Set(vals.filter(x => x.v === worst).map(x => x.id))
  }

  const specDefs: { label: string; fn: (c: WCar) => string; bestFn?: (c: WCar) => number | null; dir?: 'high' | 'low' }[] = [
    { label: 'Baujahr',        fn: c => c.year ? String(c.year) : '—',                              bestFn: c => c.year,   dir: 'high' },
    { label: 'Kilometerstand', fn: c => c.km != null ? `${c.km.toLocaleString('de-AT')} km` : '—',  bestFn: c => c.km,    dir: 'low'  },
    { label: 'Kraftstoff',     fn: c => c.fuel  || '—' },
    { label: 'Getriebe',       fn: c => c.trans || '—' },
    { label: 'Leistung',       fn: c => c.power != null ? `${c.power} PS` : '—',                    bestFn: c => c.power,  dir: 'high' },
    { label: 'Karosserie',     fn: c => c.body  || '—' },
    { label: 'Farbe',          fn: c => c.color || '—' },
    { label: 'Sitze',          fn: c => c.seats  != null ? String(c.seats)  : '—' },
    { label: 'Vorbesitzer',    fn: c => c.owners != null ? String(c.owners) : '—',                  bestFn: c => c.owners, dir: 'low'  },
    { label: 'Zustand',        fn: c => c.condition || '—' },
  ]

  const scores: Record<string, number> = {}
  cars.forEach(c => { scores[c.id] = 0 })
  specDefs.forEach(({ bestFn, dir }) => {
    if (!bestFn || !dir) return
    bestSet(bestFn, dir).forEach(id => { scores[id] = (scores[id] || 0) + 1 })
  })

  const uniqueEquip = cars.map(c =>
    c.equipment.filter(e => !cars.some(o => o.id !== c.id && eqMatch(o.equipment, e)))
  )
  cars.forEach((c, i) => { scores[c.id] += Math.min(uniqueEquip[i].length, 3) })

  const sharedEquip = cars[0].equipment.filter(e => cars.every(c => eqMatch(c.equipment, e)))
  const maxScore = Math.max(...Object.values(scores))
  const minScore = Math.min(...Object.values(scores))

  // All sub-items always visible → cumulative heights:
  // header(44) | Fahrzeugdaten(44) | sub:Gesamtwertung(32) | Ausstattung(44) | sub:Gemeinsam(32) | sub:Alleinstellung(32)
  // Indicator center = padding(8) + sum of item heights above + half current item height
  const navItems = [
    { key: 'fahrzeugdaten'  as const, label: 'Fahrzeugdaten',       ref: secFahrzeugRef,       sub: false, parentKey: null                    },
    { key: 'ausstattung'    as const, label: 'Ausstattung',         ref: secAusstattungRef,    sub: false, parentKey: null                    },
    { key: 'gemeinsam'      as const, label: 'Gemeinsame Ausstattung', ref: secGemeinsamRef,    sub: true,  parentKey: 'ausstattung'  as const  },
    { key: 'alleinstellung' as const, label: 'Alleinstellung',      ref: secAlleinstellungRef, sub: true,  parentKey: 'ausstattung'  as const  },
  ]

  return (
    <>
    <div className="compare-backdrop" onClick={onClose}>
      <div className="cv2-wrapper">
      <div className="compare-v2" onClick={e => e.stopPropagation()}>
        <div className="cv2-head">
          <span className="cv2-title">Fahrzeugvergleich</span>
          <button className="cv2-close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="cv2-scroll-wrap">
        <div className="cv2-scroll" ref={scrollRef} onScroll={handleScroll}>
          {/* Sticky car header row */}
          <div ref={secMerkmaleRef} className={`cv2-cars-header ${colClass}`}>
            <div className="cv2-header-full-title">Ausgewählte Fahrzeuge</div>
            {cars.map(c => (
              <div key={c.id} className="cv2-car-header">
                <div className="cv2-img-wrap">
                  {c.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={c.image} alt={c.title} className="cv2-header-img" />
                    : <div className="cv2-header-img cv2-header-img-empty" />}
                  {c.images.length > 0 && (
                    <button className="cv2-zoom-btn" title="Galerie öffnen" onClick={e => { e.stopPropagation(); openGallery(c) }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                    </button>
                  )}
                </div>
                <div className="cv2-header-title">{c.title}</div>
                <div className="cv2-header-price">{c.price > 0 ? `€ ${c.price.toLocaleString('de-AT')}` : c.priceText}</div>
                <div className="cv2-header-btns">
                  <button className="cv2-detail-btn" onClick={() => { onClose(); onDetails(c) }}>
                    Details
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                  <button className="cv2-remove-btn" onClick={() => onRemove(c)}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    Entfernen
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Specs with color-coded best/worst */}
          <div ref={secFahrzeugRef} className="cv2-section">
            <div className="cv2-section-title">Fahrzeugdaten</div>
            {specDefs.map(({ label, fn, bestFn, dir }) => {
              const best  = bestFn && dir ? bestSet(bestFn, dir)  : new Set<string>()
              const worst = bestFn && dir ? worstSet(bestFn, dir) : new Set<string>()
              return (
                <div key={label} className={`cv2-spec-group ${colClass}`}>
                  {cars.map(c => (
                    <div key={c.id} className={`cv2-row-val${best.has(c.id) ? ' cv2-best' : worst.has(c.id) ? ' cv2-worst' : ''}`}>
                      <div className="cv2-cell">
                        <span className="cv2-cell-label">{label}</span>
                        <span className="cv2-cell-val">
                          {best.has(c.id)  && <span className="cv2-best-icon">▲</span>}
                          {worst.has(c.id) && <span className="cv2-worst-icon">▼</span>}
                          {fn(c)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
            {/* Score summary */}
            <div ref={secGesamtwertungRef} className={`cv2-spec-group cv2-spec-group-score ${colClass}`}>
              {cars.map(c => {
                const isBest  = scores[c.id] === maxScore && maxScore > minScore
                const isWorst = scores[c.id] === minScore && maxScore > minScore
                const isTied  = maxScore === minScore
                const rankLabel = isTied ? 'Ausgeglichen' : isBest ? 'Sieger' : isWorst ? 'Verlierer' : 'Mittelfeld'
                const icon      = isTied ? '─' : isBest ? '▲' : isWorst ? '▼' : '─'
                return (
                  <div key={c.id} className={`cv2-row-val${isBest ? ' cv2-best' : isWorst ? ' cv2-worst' : ''}`}>
                    <div className="cv2-cell">
                      <span className="cv2-cell-label">Gesamtwertung</span>
                      <div className="cv2-rank-cell">
                        <span className="cv2-rank-icon">{icon}</span>
                        <span className="cv2-rank-text">{rankLabel}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Equipment diff */}
          {(uniqueEquip.some(u => u.length > 0) || sharedEquip.length > 0) && (
            <div ref={secAusstattungRef} className="cv2-section">
              <div className="cv2-section-title">Ausstattung & Extras</div>

              {sharedEquip.length > 0 && (
                <div ref={secGemeinsamRef}>
                  <div className="cv2-equip-heading">Gemeinsame Ausstattung ({sharedEquip.length})</div>
                  <div className="cv2-equip-tags-block">
                    {sharedEquip.map(e => <span key={e} className="cv2-equip-tag cv2-equip-shared-tag">{e}</span>)}
                  </div>
                </div>
              )}

              {uniqueEquip.some(u => u.length > 0) && (
                <div ref={secAlleinstellungRef} style={{ paddingBottom: 80 }}>
                  <div className="cv2-equip-heading">Alleinstellung</div>
                  <div className={`cv2-equip-unique-row cv2-cols-${n}`} style={{ display: 'grid' }}>
                    {cars.map((c, i) => (
                      <div key={c.id} className="cv2-equip-col">
                        <div className="cv2-equip-col-count">{uniqueEquip[i].length} exklusiv</div>
                        {uniqueEquip[i].length > 0
                          ? uniqueEquip[i].map(e => <span key={e} className="cv2-equip-tag cv2-equip-unique-tag">{e}</span>)
                          : <span className="cv2-equip-col-empty">—</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scroll-down indicator — visibility toggled directly via ref */}
        <div ref={cvIndicatorRef} className="cv2-scroll-indicator" style={{ display: 'none' }} onClick={() => scrollRef.current?.scrollBy({ top: 220, behavior: 'smooth' })}>
          <div className="cv2-scroll-indicator-fade" />
          <div className="cv2-scroll-indicator-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9l7 7 7-7"/>
            </svg>
          </div>
        </div>
        {/* Custom scrollbar */}
        <div className="cv2-custom-sb" aria-hidden="true">
          <div ref={cvThumbRef} className="cv2-custom-sb-thumb" />
        </div>
        </div>
      </div>

      {/* ── Section sidenav ───────────────────────────────────── */}
      <nav className="cv2-sidenav" onClick={e => e.stopPropagation()}>
        <div className="cv2-sn-conn cv2-sn-conn-top" />
        <div className="cv2-sidenav-track">
          {navItems.map(s => {
            const isActive       = activeSection === s.key
            const isChildActive  = s.sub && s.parentKey === activeSection
            const isParentActive = !s.sub && navItems.some(n => n.parentKey === s.key && n.key === activeSection)
            return (
              <button key={s.key}
                className={[
                  'cv2-sidenav-item',
                  isActive       ? 'active'        : '',
                  isChildActive  ? 'child-active'  : '',
                  isParentActive ? 'parent-active' : '',
                  s.sub          ? 'sub'           : '',
                ].filter(Boolean).join(' ')}
                onClick={() => scrollToSection(s.ref, s.key)}>
                <span className="cv2-sidenav-dot" />
                <span className="cv2-sidenav-label">{s.label}</span>
              </button>
            )
          })}
        </div>
        <div className="cv2-sn-conn cv2-sn-conn-bottom" />
      </nav>
      </div>{/* cv2-wrapper */}
    </div>{/* compare-backdrop */}

      {/* ── Zoom overlay — identical to CarDetailModal ────────── */}
      {gallery && gallery.images.length > 0 && (
        <div className="cdm-zoom-backdrop" onClick={closeGallery}>
          <div className="cdm-zoom-topbar" onClick={e => e.stopPropagation()}>
            <span className="cdm-zoom-title">{gallery.title}</span>
            <button className="cdm-zoom-close" onClick={e => { e.stopPropagation(); closeGallery() }} aria-label="Schliessen">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
              <span className="cdm-zoom-close-label">Schliessen</span>
            </button>
          </div>
          <div className="cdm-zoom-zoombar" onClick={e => e.stopPropagation()}>
            <span className="cdm-zoom-zoombar-label">1x</span>
            <input
              type="range" min={100} max={500} step={5}
              value={Math.round(zoomScale * 100)}
              onChange={e => { const s = Number(e.target.value) / 100; setZoomScale(s); if (s <= 1) { setPanX(0); setPanY(0) } }}
              className="cdm-zoom-zoombar-range"
              aria-label="Zoom-Stufe"
            />
            <span className="cdm-zoom-zoombar-label">5x</span>
            <span className="cdm-zoom-zoombar-pct">{Math.round(zoomScale * 100)}%</span>
            <span className="cdm-zoom-zoombar-sep" />
            <span className="cdm-zoom-zoombar-hint">Scrollen oder Klicken für 2,5x</span>
          </div>
          {gallery.images.length > 1 && (
            <>
              <button className="cdm-zoom-nav cdm-zoom-prev"
                onClick={e => { e.stopPropagation(); if (activeImg > 0) galleryGoTo(activeImg - 1) }}
                disabled={activeImg === 0} aria-label="Vorheriges Bild">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className="cdm-zoom-nav cdm-zoom-next"
                onClick={e => { e.stopPropagation(); if (activeImg < gallery.images.length - 1) galleryGoTo(activeImg + 1) }}
                disabled={activeImg === gallery.images.length - 1} aria-label="Nächstes Bild">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery.images[activeImg]}
            alt={gallery.title}
            className="cdm-zoom-img"
            draggable={false}
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`,
              cursor: zoomScale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
              transition: isPanning ? 'none' : 'transform .14s cubic-bezier(.4,0,.2,1)',
            }}
            onClick={onZoomClick}
            onWheel={e => setZoomScale(s => { const next = Math.min(5, Math.max(1, s * (1 - e.deltaY * 0.002))); if (next === 1) { setPanX(0); setPanY(0) } return next })}
            onMouseDown={e => { e.stopPropagation(); onZoomPanStart(e.clientX, e.clientY) }}
            onMouseMove={e => onZoomPanMove(e.clientX, e.clientY)}
            onMouseUp={() => onZoomPanEnd()}
            onMouseLeave={() => onZoomPanEnd()}
          />
          <div className="cdm-zoom-bottombar" onClick={e => e.stopPropagation()}>
            {gallery.images.length > 1 && (
              <>
                <span className="cdm-zoom-imgcount">{activeImg + 1} / {gallery.images.length}</span>
                <div className="cdm-zoom-imgtrack">
                  <span className="cdm-zoom-imgtrack-label">1</span>
                  <input
                    type="range" min={0} max={gallery.images.length - 1}
                    value={activeImg}
                    onChange={e => galleryGoTo(Number(e.target.value))}
                    className="cdm-zoom-imgtrack-range"
                    aria-label="Bild auswaehlen"
                  />
                  <span className="cdm-zoom-imgtrack-label">{gallery.images.length}</span>
                </div>
              </>
            )}
            <span className="cdm-zoom-hint">
              Nutzen Sie den Schieberegler um die Anzahl der Bilder zu wechseln
            </span>
          </div>
        </div>
      )}
    </>
  )
}

