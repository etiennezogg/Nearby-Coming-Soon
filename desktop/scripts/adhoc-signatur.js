'use strict'

/* Setzt auf dem Mac eine einfache («ad-hoc») Signatur, wenn es keine echte gibt.

   Warum: Apple-Chips starten nur Programme mit gültiger Signatur. Beim Zusammenfügen der Intel- und
   der Apple-Fassung (universal) verliert die mitgelieferte Signatur ihre Gültigkeit. Ohne diesen Schritt
   meldet macOS «Nearby ist beschädigt». Mit der einfachen Signatur startet die App; macOS warnt beim
   ersten Öffnen trotzdem, dass der Entwickler nicht bekannt ist (siehe README → «Signieren»).

   Gibt es ein Zertifikat (CSC_LINK / CSC_NAME), signiert electron-builder selbst, und dieser Schritt tut nichts.

   Eingehängt als «afterPack», nicht als «afterSign»: afterSign läuft nur, wenn wirklich signiert wurde. */

const { execFileSync } = require('node:child_process')
const path = require('node:path')

exports.default = async function adhocSignatur(context) {
  if (context.electronPlatformName !== 'darwin') return
  if (process.env.CSC_LINK || process.env.CSC_NAME) return
  // Bei «universal» entstehen zuerst zwei Zwischenordner (…-temp); signiert wird nur das fertige Programm.
  if (/-temp$/.test(context.appOutDir)) return
  const programm = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`)
  console.log(`  • einfache (ad-hoc) Signatur: ${programm}`)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', programm], { stdio: 'inherit' })
}
