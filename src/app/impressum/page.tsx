import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Impressum — Nearby',
  description: 'Betreiber und Kontakt von Nearby.',
}

/* Gleicher Inhalt wie das Impressum der App (Abschnitt «Betreiber» bis
   «Unternehmensform»), nur ohne die Verweise auf Seiten, die es hier nicht gibt.
   Ändert sich etwas an Name, Postfach oder E-Mail, muss es in beiden stehen. */
const h2 = 'font-syne font-bold text-xl text-ink mb-3'
const text = 'text-gray-700 leading-relaxed'
const link = 'text-green hover:underline'

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[760px] mx-auto px-5 pt-14 pb-16 md:pt-24">
        <Link href="/" className="inline-block text-sm text-gray-400 hover:text-ink transition-colors mb-10">
          ← Zur Startseite
        </Link>

        <p className="text-xs text-gray-400 mb-2">Stand: November 2026</p>
        <h1
          className="font-syne font-extrabold text-ink tracking-tight leading-[1.1] mb-2"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Impressum
        </h1>
        <p className="text-gray-500 mb-12">Nearby — Lokales Einkaufen in der Schweiz</p>

        <div className="flex flex-col gap-8">
          <section>
            <h2 className={h2}>Betreiber</h2>
            <p className={text}>
              Etienne Zogg<br />
              Postfach<br />
              6330 Cham<br />
              Schweiz
            </p>
          </section>

          <section>
            <h2 className={h2}>Über das Projekt</h2>
            <p className={text}>
              Nearby ist vor einigen Jahren aus einer einfachen Beobachtung entstanden: Was ein
              Laden ein paar Hundert Meter weiter im Regal hat, erfährt man online oft nicht —
              online sichtbar ist, wer gross genug für einen eigenen Shop ist. Nearby schliesst
              diese Lücke und macht lokale Sortimente auffindbar, ohne dass ein Geschäft dafür
              eine Website braucht.
            </p>
            <p className={`${text} mt-3`}>
              Die Plattform wird als Einzelunternehmen betrieben und laufend weiterentwickelt.
            </p>
          </section>

          <section>
            <h2 className={h2}>Kontakt</h2>
            <p className={text}>
              E-Mail: <a href="mailto:etiennezogg@gmail.com" className={link}>etiennezogg@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className={h2}>Unternehmensform</h2>
            <p className={text}>
              Einzelunternehmen<br />
              Nicht im Handelsregister eingetragen — daher keine UID-Nummer.<br />
              Nicht mehrwertsteuerpflichtig.
            </p>
          </section>

          <section>
            <h2 className={h2}>Urheberrecht</h2>
            <p className={text}>
              Die Inhalte dieser Website — Texte, Grafiken und Logos — sind urheberrechtlich geschützt.
            </p>
          </section>

          <section>
            <h2 className={h2}>Haftungsausschluss</h2>
            <p className={text}>
              Trotz sorgfältiger Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
              Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
