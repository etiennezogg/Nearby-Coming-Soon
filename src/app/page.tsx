'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, ReactNode } from 'react'

const kantone = [
  'Aargau','Appenzell Ausserrhoden','Appenzell Innerrhoden','Basel-Landschaft','Basel-Stadt',
  'Bern','Fribourg','Genf','Glarus','Graubünden','Jura','Luzern','Neuenburg','Nidwalden',
  'Obwalden','Schaffhausen','Schwyz','Solothurn','St. Gallen','Tessin','Thurgau','Uri',
  'Waadt','Wallis','Zug','Zürich',
]

/* ── ContainerScroll ── */
function ContainerScroll({ titleComponent, children }: { titleComponent: ReactNode; children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1])
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])
  return (
    <div className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20" ref={containerRef}>
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: '1000px' }}>
        <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center mb-8">
          {titleComponent}
        </motion.div>
        <motion.div
          style={{
            rotateX: rotate, scale,
            boxShadow: '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-3 bg-[#222222] rounded-[30px] shadow-2xl"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ── Map Mockup (ContainerScroll section) ── */
const matchaResults = [
  { name: 'Tea House Gardens', dist: '2.3 km', price: 'CHF 18.90', tag: 'Bio Matcha 30g', img: '/matcha-1.png' },
  { name: 'Épicérie Japonaise', dist: '0.7 km', price: 'CHF 24.50', tag: 'Ceremonial Grade', img: '/matcha-2.png' },
  { name: 'Global Delicatessen', dist: '1.1 km', price: 'CHF 12.80', tag: 'Matcha Latte Pulver', img: '/matcha-3.png' },
  { name: 'Bio Matcha Garage', dist: '1.4 km', price: 'CHF 9.90', tag: 'Matcha 50g', img: '/matcha-4.png' },
]

function MapMockup() {
  return (
    <div className="relative w-full h-full flex flex-col select-none">
      <div className="absolute top-3 left-3 right-3 z-10">
        <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-sm font-medium text-ink flex-1">Matcha</span>
          <div className="flex items-center gap-1.5 border-l pl-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs text-gray-500 whitespace-nowrap">Zug (ZG)</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <div className="bg-ink text-white text-xs font-medium px-3 py-1.5 rounded-xl flex-shrink-0">Suchen →</div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 256px)', gridTemplateRows: 'repeat(4, 256px)', justifyContent: 'center', alignContent: 'center', margin: '-2px' }}>
        {['46011','46012','46013','46014'].map(y =>
          ['68634','68635','68636','68637','68638'].map(x => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${x}-${y}`} src={`https://tile.openstreetmap.org/17/${x}/${y}.png`}
              alt="" width={256} height={256} draggable={false} style={{ display: 'block' }} />
          ))
        )}
      </div>
      {[
        { left: '45%', top: '30%' },
        { left: '34%', top: '44%' },
        { left: '50%', top: '50%' },
        { left: '38%', top: '62%' },
      ].map((pos, i) => (
        <div key={`pin${i}`} className="absolute z-10 flex flex-col items-center" style={{ left: pos.left, top: pos.top, transform: 'translate(-50%,-100%)' }}>
          <div className="bg-green text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap">
            {matchaResults[i].price}
          </div>
          <div className="w-2 h-2 bg-green rounded-full mt-0.5 shadow" />
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-t-2xl shadow-xl px-3 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-ink">4 Ergebnisse · Matcha in Zug</span>
            <span className="text-xs text-green font-medium">Karte</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {matchaResults.map((r, i) => (
              <div key={i} className="flex-shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden w-40 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.img} alt={r.tag} className="w-full h-24 object-cover" draggable={false} />
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-ink leading-tight truncate">{r.tag}</p>
                  <p className="text-xs text-gray-400 truncate">{r.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-bold text-green">{r.price}</span>
                    <span className="text-xs text-gray-400">{r.dist}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── EmailSignup ── */
function EmailSignup({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [kanton, setKanton] = useState('')
  const [gemeinde, setGemeinde] = useState('')
  const [role, setRole] = useState<'kunde' | 'verkäufer'>('kunde')
  const [honeypot, setHoneypot] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Bitte Name eingeben.'); return }
    if (!email || !email.includes('@')) { setError('Bitte gültige E-Mail eingeben.'); return }
    if (!kanton) { setError('Bitte Kanton auswählen.'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email, kanton, gemeinde: gemeinde || null, role, website: honeypot }),
    })
    setLoading(false)
    if (res.status === 429) {
      setError('Zu viele Versuche. Bitte warte eine Stunde.')
    } else if (!res.ok) {
      setError('Etwas ist schiefgelaufen. Bitte versuch es nochmals.')
    } else {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setName('')
        setEmail('')
        setKanton('')
        setGemeinde('')
        setRole('kunde')
      }, 4000)
    }
  }

  const isDark = variant === 'dark'

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 280 }}
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-medium shadow-lg ${isDark ? 'bg-white/20 text-white border border-white/30 backdrop-blur-md' : 'bg-green-light text-green'}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Merci — wir melden uns!
      </motion.div>
    )
  }

  const cls = `w-full border rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
    isDark
      ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/40 backdrop-blur-md'
      : 'bg-white border-gray-200 text-ink placeholder-gray-400 focus:border-green/40 focus:ring-2 focus:ring-green/10'
  }`

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {/* Rolle-Toggle */}
      <div className={`flex rounded-2xl p-1 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
        {(['kunde', 'verkäufer'] as const).map(r => (
          <button key={r} onClick={() => setRole(r)} type="button"
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              role === r
                ? isDark ? 'bg-white text-ink shadow-sm' : 'bg-white text-ink shadow-sm'
                : isDark ? 'text-white/50' : 'text-gray-400'
            }`}>
            {r === 'kunde' ? 'Ich bin Kunde' : 'Ich bin Verkäufer'}
          </button>
        ))}
      </div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="Dein Name *" className={cls} />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder="deine@email.ch *" className={cls} />
      <div className="relative">
        <select value={kanton} onChange={e => setKanton(e.target.value)} className={`${cls} appearance-none cursor-pointer ${!kanton ? (isDark ? 'text-white/40' : 'text-gray-400') : ''}`}>
          <option value="" disabled>Kanton wählen *</option>
          {kantone.map(k => <option key={k} value={k} style={{ color: '#0d0d0d' }}>{k}</option>)}
        </select>
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <input type="text" value={gemeinde} onChange={e => setGemeinde(e.target.value)} placeholder="Gemeinde (optional)" className={cls} />
      {/* Honeypot: hidden from real users, bots fill it */}
      <input type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      {error && <p className={`text-xs ${isDark ? 'text-red-300' : 'text-red-500'}`}>{error}</p>}
      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading}
        className={`w-full py-4 rounded-2xl text-sm font-medium font-dm shadow-lg transition-opacity disabled:opacity-60 ${isDark ? 'bg-white text-ink hover:opacity-90' : 'bg-green text-white hover:opacity-90'}`}>
        {loading ? 'Laden...' : 'Benachrichtigen →'}
      </motion.button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   FEATURE SHOWCASE — exakt kopiert von FeatureShowcase.tsx
   ══════════════════════════════════════════════════════════ */

const slides = [
  {
    step: '01', tag: 'Suchen',
    title: 'Was du brauchst.\nDirekt um die Ecke.',
    description: 'Tippe ein Produkt ein — Nearby zeigt dir sofort welche Geschäfte es in deiner Umgebung haben. Mit Distanz, Öffnungszeiten und Echtzeit-Verfügbarkeit.',
    accent: '#22c55e',
  },
  {
    step: '02', tag: 'Karte',
    title: 'Sieh wo es\nin deiner Nähe liegt.',
    description: 'Die interaktive Karte zeigt dir alle Geschäfte in der Umgebung. Filter nach Kategorie, Distanz oder Öffnungszeit — alles auf einen Blick.',
    accent: '#3b82f6',
  },
  {
    step: '03', tag: 'Wallet',
    title: 'Alle Karten.\nEin Ort.',
    description: 'Cumulus, IKEA Family, Gutscheine — alles digital in deiner Nearby Wallet. Barcode vorzeigen, fertig. Nie wieder Plastikstapel im Portemonnaie.',
    accent: '#f59e0b',
  },
  {
    step: '04', tag: 'Für Geschäfte',
    title: 'Sichtbar sein.\nOhne Aufwand.',
    description: 'Produkte hochladen wie einen Social-Media-Post. Sofort sichtbar für Kunden — ohne Website, ohne technisches Know-how. Ab CHF 29 / Monat.',
    accent: '#a78bfa',
  },
]

/* — SearchVisual (1:1 von Hauptseite) — */
function SearchVisual({ accent, isMobile = false }: { accent: string; isMobile?: boolean }) {
  const suggestions = [
    { name: 'Bio Rindfleisch',    kategorie: 'Lebensmittel' },
    { name: 'Biofleisch Metzgerei', kategorie: 'Lebensmittel' },
    { name: 'Biowurst',           kategorie: 'Lebensmittel' },
    { name: 'Bio Milch',          kategorie: 'Lebensmittel' },
  ]
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, background: '#fff', border: '1px solid #fff', borderRadius: 9999, padding: isMobile ? '14px 18px' : '20px 32px', boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 12px 28px rgba(0,0,0,0.11), 0 32px 56px rgba(0,0,0,0.08)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
        <span style={{ flex: 1, fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 500, color: '#374151', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Biofleisch</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8, borderLeft: '1px solid #f3f4f6', paddingLeft: isMobile ? 12 : 20, flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span style={{ fontSize: isMobile ? '0.85rem' : '1rem', fontWeight: 500, color: '#6b7280', whiteSpace: 'nowrap' }}>Zürich</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111', padding: isMobile ? '7px 13px' : '10px 22px', borderRadius: 14, fontSize: isMobile ? '0.82rem' : '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>Suchen →</div>
      </div>
      <div style={{ marginTop: 10, background: '#fff', borderRadius: 28, boxShadow: '0 16px 48px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: isMobile ? '10px 18px 8px' : '12px 24px 10px', borderBottom: '1px solid #f9fafb' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vorschläge</span>
        </div>
        {suggestions.map((v, i) => (
          <div key={v.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '11px 18px' : '13px 24px', borderBottom: i < suggestions.length - 1 ? '1px solid #f9fafb' : 'none', background: i === 0 ? '#f9fafb' : '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <span style={{ fontSize: isMobile ? '0.82rem' : '0.88rem', fontWeight: i === 0 ? 600 : 400, color: '#1f2937' }}>{v.name}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: i === 0 ? accent : '#9ca3af' }}>{v.kategorie}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* — MapVisual (1:1 von Hauptseite) — */
function MapVisual({ accent }: { accent: string }) {
  const stores = [
    { label: 'Bäckerei Brunner',  dist: '87 m',  top: '28%', left: '38%' },
    { label: 'Metzgerei Huwyler', dist: '142 m', top: '22%', left: '63%' },
    { label: 'Biomarkt Seefeld',  dist: '218 m', top: '62%', left: '32%' },
    { label: 'Boutique Blanche',  dist: '374 m', top: '58%', left: '68%' },
  ]
  const userTop = '44%', userLeft = '50%'
  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 22, overflow: 'hidden', aspectRatio: '16/10' }}>
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=8.546%2C47.354%2C8.566%2C47.364&layer=mapnik"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% + 75px)', border: 'none', filter: 'contrast(1.3) saturate(0.88) brightness(0.97)', pointerEvents: 'none' }}
        scrolling="no"
        title="map"
      />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)', pointerEvents: 'none' }} />
      {stores.map(store => (
        <div key={store.label} style={{ position: 'absolute', top: store.top, left: store.left, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent, border: '2.5px solid #fff', boxShadow: `0 0 12px ${accent}99`, margin: '0 auto 4px' }} />
          <div style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '4px 10px', whiteSpace: 'nowrap', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#111' }}>{store.label}</div>
            <div style={{ fontSize: '0.57rem', color: accent, marginTop: 1 }}>{store.dist}</div>
          </div>
        </div>
      ))}
      <div style={{ position: 'absolute', top: userTop, left: userLeft, transform: 'translate(-50%, -50%)', zIndex: 11 }}>
        <div style={{ position: 'relative', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `${accent}30` }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: accent, border: '3px solid #fff', boxShadow: `0 0 16px ${accent}` }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
        <span style={{ fontSize: '0.72rem', color: '#333' }}>4 Geschäfte in 374 m</span>
      </div>
    </div>
  )
}

/* — WalletVisual (vereinfacht, kein PreviewCardFace) — */
function WalletVisual() {
  const cards = [
    { color: '#7c3f1e' },
    { color: '#1a1a1a' },
    { color: '#c0392b' },
    { color: '#2563eb' },
    { color: '#f59e0b' },
    { color: '#e5e7eb' },
    { color: '#92400e' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ position: 'relative', width: 340, height: 220 }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: 240, height: 155,
            background: c.color, left: i * 18, top: i * 4,
            transform: `rotate(${-8 + i * 2}deg)`,
            zIndex: cards.length - i,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {i === 0 && (
              <div style={{ padding: 20 }}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, fontStyle: 'italic' }}>Tchibo</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>CARD</div>
                <div style={{ position: 'absolute', bottom: 16, left: 20, color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>•••• 9911</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* — BizVisual mit Aktienchart — */
function BizVisual({ accent }: { accent: string }) {
  const data = [
    { day: 'Mo', v: 14 },
    { day: 'Di', v: 22 },
    { day: 'Mi', v: 18 },
    { day: 'Do', v: 38 },
    { day: 'Fr', v: 30 },
    { day: 'Sa', v: 12 },
    { day: 'So', v: 8  },
  ]
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const W = 360, H = 100, LEFT = 32
  const maxV = Math.max(...data.map(d => d.v))
  const xs = data.map((_, i) => LEFT + 6 + (i / (data.length - 1)) * (W - LEFT - 16))
  const ys = data.map(d => 12 + (1 - d.v / maxV) * (H - 24))
  const step = 10
  const yMax = Math.ceil(maxV / step) * step
  const yLabels = Array.from({ length: Math.floor(yMax / step) + 1 }, (_, i) => i * step)
  const peakIdx = data.findIndex(d => d.v === maxV)
  const gradId = `gbiz${accent.replace('#','')}`

  const pathD = xs.map((x, i) =>
    i === 0 ? `M ${x.toFixed(1)},${ys[i].toFixed(1)}` : `L ${x.toFixed(1)},${ys[i].toFixed(1)}`
  ).join(' ')
  const areaD = `${pathD} L ${xs[xs.length-1].toFixed(1)},${H} L ${xs[0].toFixed(1)},${H} Z`
  const activeIdx = hoveredIdx !== null ? hoveredIdx : null

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Map */}
      <div style={{ borderRadius: 18, overflow: 'hidden', height: 110, position: 'relative', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(4, 256px)', gridTemplateRows: 'repeat(2, 256px)', justifyContent: 'center', alignContent: 'center' }}>
          {['11475','11476'].map(y =>
            ['17160','17161','17162','17163'].map(x => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${x}-${y}`} src={`https://tile.openstreetmap.org/15/${x}/${y}.png`}
                alt="" width={256} height={256} draggable={false}
                style={{ display: 'block', filter: 'contrast(1.25) saturate(0.45) brightness(0.82)' }} />
            ))
          )}
        </div>
        {[
          { top: '28%', left: '22%', r: 36 }, { top: '55%', left: '68%', r: 48 },
          { top: '38%', left: '60%', r: 30 }, { top: '72%', left: '35%', r: 26 },
          { top: '18%', left: '78%', r: 22 },
        ].map((b, i) => (
          <div key={i} style={{ position: 'absolute', top: b.top, left: b.left, transform: 'translate(-50%,-50%)', width: b.r*2, height: b.r*2, borderRadius: '50%', background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`, pointerEvents: 'none' }} />
        ))}
        <div style={{ position: 'absolute', top: '48%', left: '46%', transform: 'translate(-50%,-100%)' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.18)', border: '1.5px solid rgba(0,0,0,0.3)' }} />
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none" style={{ display: 'block', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }}>
            <path d="M11 0C6.03 0 2 4.03 2 9c0 6.75 9 19 9 19s9-12.25 9-19c0-4.97-4.03-9-9-9z" fill="#0d0d0d" />
            <circle cx="11" cy="9" r="3.5" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* Product card */}
      <div style={{ borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: '1.35rem' }}>🧴</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>Lotion Naturelle</div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Apotheke Goldbach</div>
        </div>
        <div style={{ background: '#22c55e', borderRadius: 20, padding: '4px 11px', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>Live</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '13px 14px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Aufrufe diese Woche</span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>142 total · +12%</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {/* Y-axis labels */}
          {yLabels.map((val, i) => {
            const yy = 12 + (1 - val / yMax) * (H - 24)
            return (
              <text key={i} x={LEFT - 4} y={yy} textAnchor="end" dominantBaseline="middle"
                fill="rgba(255,255,255,0.35)" fontSize="8" fontWeight="400">
                {val}
              </text>
            )
          })}
          {/* Y-axis line */}
          <line x1={LEFT} y1={12} x2={LEFT} y2={H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          {[0.33, 0.66].map((t, i) => (
            <line key={i} x1={LEFT} y1={12 + t * (H - 24)} x2={xs[xs.length-1]} y2={12 + t * (H - 24)}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 4" />
          ))}
          <path d={areaD} fill={`url(#${gradId})`} />
          <path d={pathD} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r={activeIdx === i ? 4 : 2.5}
              fill={activeIdx === i ? '#fff' : 'rgba(255,255,255,0.3)'}
              style={{ transition: 'r 0.15s, fill 0.15s' }} />
          ))}
          {/* Invisible hit areas */}
          {xs.map((x, i) => (
            <rect key={`hit${i}`}
              x={x - 22} y={0} width={44} height={H}
              fill="transparent" style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)} />
          ))}
          {/* Tooltip on hover */}
          {activeIdx !== null && (() => {
            const tx = xs[activeIdx]
            const ty = ys[activeIdx]
            const flip = tx > W * 0.75
            const ox = flip ? -34 : 34
            return (
              <g transform={`translate(${tx},${ty})`}>
                <line x1="0" y1="-4" x2="0" y2="-18" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
                <g transform={`translate(${ox},-30)`}>
                  <rect x="-30" y="-14" width="60" height="28" rx="7" fill="rgba(30,30,30,0.92)" />
                  <rect x="-30" y="-14" width="60" height="28" rx="7" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <text x="0" y="-2" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">{data[activeIdx].v}</text>
                  <text x="0" y="10" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7.5" fontWeight="500">Aufrufe</text>
                </g>
              </g>
            )
          })()}
          {data.map((d, i) => (
            <text key={d.day} x={xs[i]} y={H + 16} textAnchor="middle"
              fill={activeIdx === i ? '#fff' : 'rgba(255,255,255,0.35)'}
              fontSize="9" fontWeight={activeIdx === i ? '700' : '400'}>
              {d.day}
            </text>
          ))}
        </svg>
      </div>

    </div>
  )
}

function Visual({ index, accent, isMobile = false }: { index: number; accent: string; isMobile?: boolean }) {
  if (index === 0) return <SearchVisual accent={accent} isMobile={isMobile} />
  if (index === 1) return <MapVisual accent={accent} />
  if (index === 2) return <WalletVisual />
  return <BizVisual accent={accent} />
}

/* — FeatureShowcase Container (1:1 von Hauptseite) — */
function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const outerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const outer = outerRef.current
      if (!outer) return
      const scrolled        = -outer.getBoundingClientRect().top
      const totalScrollable = outer.offsetHeight - window.innerHeight
      if (scrolled <= 0)               { setActiveIndex(0);                return }
      if (scrolled >= totalScrollable)  { setActiveIndex(slides.length - 1); return }
      setActiveIndex(Math.min(slides.length - 1, Math.floor((scrolled / totalScrollable) * slides.length)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSlide = (idx: number) => {
    const outer = outerRef.current
    if (!outer) return
    const absoluteTop     = outer.getBoundingClientRect().top + window.scrollY
    const totalScrollable = outer.offsetHeight - window.innerHeight
    window.scrollTo({ top: absoluteTop + (totalScrollable / slides.length) * idx, behavior: 'smooth' })
  }

  const s = slides[activeIndex]

  return (
    <div ref={outerRef} style={{ height: `${slides.length * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#0d0d0d' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '54px 54px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: s.accent, boxShadow: `0 0 40px 4px ${s.accent}55`, transition: 'background-color 0.6s ease, box-shadow 0.6s ease' }} />

        {isMobile ? (
          /* ── MOBILE LAYOUT ── */
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0 20px 14px' }}>
            {/* Step pills */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 88, paddingBottom: 12, flexShrink: 0 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => scrollToSlide(i)}
                  style={{ height: 3, border: 'none', cursor: 'pointer', padding: 0, borderRadius: 9999, flexShrink: 0,
                    width: i === activeIndex ? 40 : 14,
                    backgroundColor: i === activeIndex ? s.accent : 'rgba(255,255,255,0.15)',
                    transition: 'width 0.5s ease, background-color 0.5s ease' }} />
              ))}
            </div>

            {/* Text content */}
            <div style={{ position: 'relative', height: 178, flexShrink: 0 }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                  opacity: i === activeIndex ? 1 : 0, transform: i === activeIndex ? 'translateY(0)' : 'translateY(14px)',
                  transition: 'opacity 0.55s ease, transform 0.55s ease', pointerEvents: i === activeIndex ? 'auto' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.18em', color: slide.accent }}>{slide.step}</span>
                    <span style={{ padding: '3px 12px', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 600,
                      border: `1px solid ${slide.accent}40`, color: slide.accent, backgroundColor: `${slide.accent}12` }}>{slide.tag}</span>
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.65rem, 7.5vw, 2.1rem)', lineHeight: 1.05, color: '#ffffff', marginBottom: 12, whiteSpace: 'pre-line' }}>{slide.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.42)', fontWeight: 300, lineHeight: 1.65, fontSize: '0.85rem',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{slide.description}</p>
                </div>
              ))}
            </div>

            {/* Visual */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: i === activeIndex ? 1 : 0, transition: 'opacity 0.55s ease',
                  pointerEvents: i === activeIndex ? 'auto' : 'none',
                  transform: 'scale(0.94)', transformOrigin: 'top center' }}>
                  <Visual index={i} accent={slide.accent} isMobile={true} />
                </div>
              ))}
            </div>

            {/* Counter */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0, paddingTop: 6 }}>
              <span style={{ fontWeight: 800, fontSize: '1.7rem', color: s.accent, transition: 'color 0.6s ease' }}>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.8rem' }}>/ {String(slides.length).padStart(2, '0')}</span>
            </div>
          </div>
        ) : (
          /* ── DESKTOP LAYOUT ── */
          <div style={{ height: '100%', maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0 32px' }}>
            {/* LEFT */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px 0 16px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ position: 'absolute', top: 76, left: 16, display: 'flex', gap: 8 }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => scrollToSlide(i)}
                    style={{ height: 3, border: 'none', cursor: 'pointer', padding: 0, borderRadius: 9999, width: i === activeIndex ? 40 : 14, backgroundColor: i === activeIndex ? s.accent : 'rgba(255,255,255,0.15)', transition: 'width 0.5s ease, background-color 0.5s ease' }} />
                ))}
              </div>
              <div style={{ position: 'relative', height: 300 }}>
                {slides.map((slide, i) => (
                  <div key={i} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: i === activeIndex ? 1 : 0, transform: i === activeIndex ? 'translateY(0px)' : 'translateY(18px)', transition: 'opacity 0.55s ease, transform 0.55s ease', pointerEvents: i === activeIndex ? 'auto' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.18em', color: slide.accent }}>{slide.step}</span>
                      <span style={{ padding: '4px 14px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 600, border: `1px solid ${slide.accent}40`, color: slide.accent, backgroundColor: `${slide.accent}12` }}>{slide.tag}</span>
                    </div>
                    <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem, 3.6vw, 3.5rem)', lineHeight: 1.0, color: '#ffffff', marginBottom: 20, whiteSpace: 'pre-line' }}>{slide.title}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.42)', fontWeight: 300, lineHeight: 1.75, maxWidth: 400, fontSize: '0.98rem' }}>{slide.description}</p>
                  </div>
                ))}
              </div>
              <div style={{ position: 'absolute', bottom: 48, left: 16, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: '2.8rem', color: s.accent, transition: 'color 0.6s ease' }}>{String(activeIndex + 1).padStart(2, '0')}</span>
                <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '1.1rem' }}>/ {String(slides.length).padStart(2, '0')}</span>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px 24px 48px', position: 'relative' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 600, height: 520 }}>
                {slides.map((slide, i) => (
                  <div key={i} style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                    opacity: i === activeIndex ? 1 : 0,
                    transform: i === activeIndex ? 'translateY(0px)' : 'translateY(20px)',
                    transition: 'opacity 0.55s ease, transform 0.55s ease',
                    pointerEvents: i === activeIndex ? 'auto' : 'none',
                  }}>
                    <Visual index={i} accent={slide.accent} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════ */

const bizFeatures = [
  'Produkte wie Social-Media-Posts hochladen',
  'Eigenes Geschäftsprofil mit Standort & Öffnungszeiten',
  'Automatisch auf der Karte für Kunden sichtbar',
  'Digitale Gutscheine & Treuekarten anbieten',
  'Statistiken: Reichweite, Klicks & Heatmap',
  'Ab CHF 29 / Monat — ohne Einrichtungsgebühr',
]

const stats = [
  { value: '60\'000+', label: 'Läden & Hofläden in der Schweiz' },
  { value: '1 Mio.+', label: 'Produkte im Schweizer Handel' },
  { value: '2.4 kg', label: 'CO₂ gespart pro Einkauf' },
  { value: '∅ 330 m', label: 'Distanz zum nächsten Laden' },
]

export default function ComingSoonPage() {
  return (
    <div className="bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="font-syne font-extrabold text-2xl text-ink tracking-tight">Nearby</div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          Coming Soon
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-6 pt-20 md:pt-24"
        style={{ background: 'linear-gradient(160deg, #4ade80 0%, #22c55e 40%, #16a34a 100%)' }}>
        <motion.div className="absolute pointer-events-none rounded-full"
          style={{ width: 600, height: 600, left: '-15%', top: '-20%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ y: [0, -40, 0], x: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute pointer-events-none rounded-full"
          style={{ width: 500, height: 500, right: '-10%', bottom: '-15%', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 text-center max-w-5xl w-full">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Bald verfügbar in der Schweiz
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-extrabold text-ink tracking-tight leading-[0.92] mb-16" style={{ fontSize: 'clamp(6rem, 18vw, 14rem)' }}>
            Nearby.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="text-white/90 font-semibold leading-snug max-w-3xl mx-auto mb-5" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>
            Lokales Einkaufen, neu gedacht.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            className="text-white/70 font-light leading-relaxed max-w-2xl mx-auto" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)' }}>
            Dein Lieblingsprodukt ist längst um die Ecke. Du hast es bloss noch nie gefunden — weil über 60'000 Läden und Hofläden in der Schweiz kein digitales Schaufenster haben. Das ändert sich jetzt.
          </motion.p>
        </motion.div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }} transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </section>

      {/* WARUM NEARBY */}
      <section className="px-6 md:px-10 py-24 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Die Vision</p>
          <h2 className="font-syne font-extrabold text-ink tracking-tight leading-tight mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>Warum Nearby?</h2>
          <div className="space-y-5 text-gray-600 font-light leading-relaxed text-base md:text-lg max-w-3xl">
            <p className="text-xl md:text-2xl font-medium text-ink leading-snug">Das Produkt das du suchst liegt oft nur 500 Meter entfernt. Du weisst es bloss nicht.</p>
            <p>89% der Schweizer:innen kaufen lieber lokal als online — aber sie finden die lokalen Angebote nicht. Also wird online bestellt — oft im Ausland. Dabei wäre das gleiche Produkt direkt um die Ecke verfügbar.</p>
            <p>Über <strong className="text-ink font-medium">50'000 Läden, Hofläden und Bäckereien</strong> in der Schweiz haben kein digitales Schaufenster. Nearby gibt ihnen eines — und dir die Möglichkeit, ihr Angebot in Sekunden zu finden.</p>
            <p>Kein Warten. Keine Liefergebühren. Einfach suchen, hingehen, kaufen.</p>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex flex-col gap-2">
              <div className="font-syne font-extrabold tracking-tight text-ink leading-none whitespace-nowrap" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>{s.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest leading-snug max-w-[160px]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES — sticky scroll, 1:1 von Hauptseite */}
      <FeatureShowcase />

      {/* KARTEN-VORSCHAU */}
      <section className="bg-gray-50 border-y border-gray-100 overflow-hidden">
        <ContainerScroll
          titleComponent={
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Vorschau</p>
              <h2 className="font-syne font-extrabold text-ink tracking-tight leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Deine Nachbarschaft auf einen Blick.
              </h2>
              <p className="text-gray-500 font-light max-w-lg mx-auto">Die interaktive Karte zeigt dir alle teilnehmenden Geschäfte in deiner Umgebung — mit Sortiment, Distanz und Öffnungszeiten.</p>
            </motion.div>
          }
        >
          <MapMockup />
        </ContainerScroll>
      </section>

      {/* FÜR UNTERNEHMEN */}
      <section className="px-6 md:px-10 py-24 bg-ink">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-14">
            <p className="text-xs uppercase tracking-widest text-green mb-4">Für Unternehmen</p>
            <h2 className="font-syne font-extrabold text-white tracking-tight leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Dein Geschäft.<br />Digital sichtbar.
            </h2>
            <p className="text-white/50 font-light leading-relaxed max-w-xl">Nearby gibt lokalen Geschäften eine digitale Bühne — einfach einrichten, sofort sichtbar, messbar wirksam.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                title: 'In 5 Minuten live',
                desc: 'Produkte hochladen wie einen Social-Media-Post. Kein technisches Know-how nötig.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                title: 'Lokal gefunden werden',
                desc: 'Automatisch auf der Karte für alle Kunden in deiner Nähe sichtbar — ohne Werbung.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                title: 'Neue Kunden erreichen',
                desc: 'Kunden die aktiv nach Produkten in der Nähe suchen — kaufbereit, ohne Umweg.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                title: 'Gezielte Sichtbarkeit',
                desc: 'Deine Produkte erscheinen genau dann, wenn Kunden in deiner Nähe danach suchen.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
                title: 'Echte Statistiken',
                desc: 'Sieh wie oft deine Produkte aufgerufen werden und wann die Nachfrage am höchsten ist.',
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: 'Schweizer Qualität',
                desc: 'Entwickelt in der Schweiz, für Schweizer Geschäfte. Deine Daten bleiben in der Schweiz.',
              },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                className="rounded-2xl border border-white/8 bg-white/4 p-6 flex flex-col gap-4 hover:bg-white/7 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green/15 flex items-center justify-center text-green flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-1.5">{item.title}</div>
                  <div className="text-white/45 text-sm font-light leading-relaxed">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Launch</p>
            <h2 className="font-syne font-extrabold text-ink tracking-tight leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Sei beim Start dabei.
            </h2>
            <p className="text-gray-500 font-light leading-relaxed max-w-xl mx-auto mb-10">Trag dich ein und erfahre als Erstes, wann Nearby in deiner Region live geht.</p>
            <div className="flex justify-center">
              <EmailSignup variant="light" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 px-6 md:px-10 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="font-syne font-extrabold text-xl text-ink tracking-tight mb-1">Nearby</div>
              <p className="text-xs text-gray-400">© 2025 Nearby · Zug, Schweiz</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-xs uppercase tracking-widest text-gray-400">Kontakt</p>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-ink font-medium">Etienne Zogg</p>
                  <p className="text-sm text-gray-500 font-light">Gründer & Entwickler</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-green/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              <a href="mailto:etienne.zogg@yahoo.com" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green transition-colors group">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-green transition-colors">
                  <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                etienne.zogg@yahoo.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


