'use client'

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

/* ── Map Mockup ── */
const matchaResults = [
  { name: 'Tea House Gardens', dist: '2.3 km', price: 'CHF 18.90', tag: 'Bio Matcha 30g', img: '/matcha-1.png' },
  { name: 'Épicérie Japonaise', dist: '0.7 km', price: 'CHF 24.50', tag: 'Ceremonial Grade', img: '/matcha-2.png' },
  { name: 'Global Delicatessen', dist: '1.1 km', price: 'CHF 12.80', tag: 'Matcha Latte Pulver', img: '/matcha-3.png' },
  { name: 'Bio Matcha Garage', dist: '1.4 km', price: 'CHF 9.90', tag: 'Matcha 50g', img: '/matcha-4.png' },
]

function MapMockup() {
  return (
    <div className="relative w-full h-full flex flex-col select-none">
      {/* Search bar */}
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

      {/* Zug Altstadt — OSM tiles zoom 17, 5×4 grid filling card */}
      <div className="absolute inset-0 overflow-hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 256px)', gridTemplateRows: 'repeat(4, 256px)', justifyContent: 'center', alignContent: 'center', margin: '-2px' }}>
        {['46011','46012','46013','46014'].map(y =>
          ['68634','68635','68636','68637','68638'].map(x => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${x}-${y}`} src={`https://tile.openstreetmap.org/17/${x}/${y}.png`}
              alt="" width={256} height={256} draggable={false}
              style={{ display: 'block' }} />
          ))
        )}
      </div>

      {/* Store pins — Kolinplatz, Fischmarkt, Unterstadt, Burg Zug */}
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

      {/* Results panel bottom */}
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
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Bitte Name eingeben.'); return }
    if (!email || !email.includes('@')) { setError('Bitte gültige E-Mail eingeben.'); return }
    if (!kanton) { setError('Bitte Kanton auswählen.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.from('waitlist').insert({ name: name.trim(), email, kanton, gemeinde: gemeinde || null })
    setLoading(false)
    if (error && error.code === '23505') {
      setSubmitted(true)
    } else if (error) {
      setError('Etwas ist schiefgelaufen. Bitte versuch es nochmals.')
    } else {
      setSubmitted(true)
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
      {error && <p className={`text-xs ${isDark ? 'text-red-300' : 'text-red-500'}`}>{error}</p>}
      <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading}
        className={`w-full py-4 rounded-2xl text-sm font-medium font-dm shadow-lg transition-opacity disabled:opacity-60 ${isDark ? 'bg-white text-ink hover:opacity-90' : 'bg-green text-white hover:opacity-90'}`}>
        {loading ? 'Laden...' : 'Benachrichtigen →'}
      </motion.button>
    </div>
  )
}

const features = [
  { emoji: '📍', title: 'Produkte in der Nähe finden', desc: 'Gib ein was du suchst — Nearby zeigt dir sofort wo es in deiner Umgebung erhältlich ist, mit Distanz und Öffnungszeiten.' },
  { emoji: '🛍️', title: 'Lokale Geschäfte entdecken', desc: 'Finde Bäckereien, Metzgereien, Boutiquen und mehr in deiner Nachbarschaft. Mit Profil, Bewertungen und Live-Sortiment.' },
  { emoji: '💳', title: 'Digitale Wallet', desc: 'Alle Treuekarten, Cumulus-Punkte und Gutscheine an einem Ort. Immer dabei, nie vergessen.' },
  { emoji: '⚡', title: 'Sofort verfügbar', desc: 'Kein Warten auf die Lieferung. Was du heute brauchst, holst du heute — direkt um die Ecke.' },
]

const bizFeatures = [
  'Produkte wie Social-Media-Posts hochladen',
  'Eigenes Geschäftsprofil mit Standort & Öffnungszeiten',
  'Automatisch auf der Karte für Kunden sichtbar',
  'Digitale Gutscheine & Treuekarten anbieten',
  'Statistiken: Reichweite, Klicks & Heatmap',
  'Ab CHF 29 / Monat — ohne Einrichtungsgebühr',
]

const stats = [
  { value: '4200+', label: 'Lokale Geschäfte' },
  { value: '38000+', label: 'Produkte verfügbar' },
  { value: '2.4 kg', label: 'CO₂ gespart pro Einkauf' },
  { value: '< 5 km', label: 'Ø Distanz zum Produkt' },
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
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #4ade80 0%, #22c55e 40%, #16a34a 100%)' }}>
        <motion.div className="absolute pointer-events-none rounded-full"
          style={{ width: 600, height: 600, left: '-15%', top: '-20%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ y: [0, -40, 0], x: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute pointer-events-none rounded-full"
          style={{ width: 500, height: 500, right: '-10%', bottom: '-15%', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 text-center max-w-3xl w-full">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Bald verfügbar in der Schweiz
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-extrabold text-ink tracking-tight leading-[0.92] mb-6" style={{ fontSize: 'clamp(4.5rem, 13vw, 10rem)' }}>
            Nearby.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="text-white/85 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto mb-3">
            Lokales Einkaufen, neu gedacht.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            className="text-white/65 text-base font-light leading-relaxed max-w-lg mx-auto">
            Entdecke Produkte aus lokalen Geschäften direkt in deiner Nähe — frisch, sofort verfügbar, ohne Liefergebühren.
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
            <p>Über <strong className="text-ink font-medium">600'000 Läden, Hofläden und Bäckereien</strong> in der Schweiz haben kein digitales Schaufenster. Nearby gibt ihnen eines — und dir die Möglichkeit, ihr Angebot in Sekunden zu finden.</p>
            <p>Kein Warten. Keine Liefergebühren. Einfach suchen, hingehen, kaufen.</p>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-8 md:p-12 border-r border-gray-100 last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r text-center">
              <div className="font-syne font-extrabold text-4xl md:text-5xl tracking-tight text-green mb-2">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 md:px-10 py-24 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Für Käufer</p>
          <h2 className="font-syne font-extrabold text-ink tracking-tight leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Alles was du suchst —<br /><span className="text-gray-400 font-light font-dm">direkt um die Ecke.</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
              <span className="text-3xl mb-4 block">{f.emoji}</span>
              <h3 className="font-syne font-bold text-ink text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* KARTEN-VORSCHAU — Scroll Animation */}
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
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-xs uppercase tracking-widest text-green mb-4">Für Unternehmen</p>
            <h2 className="font-syne font-extrabold text-white tracking-tight leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Zeig der Welt,<br />was du anbietest.
            </h2>
            <p className="text-white/70 font-light leading-relaxed max-w-xl mb-10">Nearby gibt lokalen Geschäften eine digitale Bühne. Präsentiere dein Sortiment deinen Kundinnen und Kunden direkt in der Umgebung — einfach, schnell und ohne technische Hürden.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {bizFeatures.map((feature, i) => (
                <motion.div key={feature} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/85">{feature}</motion.div>
              ))}
            </div>
            <div className="mt-12 flex justify-start">
              <EmailSignup variant="dark" />
            </div>
          </motion.div>
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
