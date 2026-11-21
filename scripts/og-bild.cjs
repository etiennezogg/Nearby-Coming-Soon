/* ──────────────────────────────────────────────────────────────────────────
   Erzeugt das Vorschaubild für geteilte Links (WhatsApp, LinkedIn, Instagram …):

     node scripts/og-bild.cjs        →  public/og-nearby.jpg  (1200 × 630)

   Markengrün (derselbe Verlauf wie im Hero der App), links das schwarze Block-N,
   rechts Name und Satz. Braucht Playwright (nur lokal, steht nicht in package.json).

   Das Bild heisst absichtlich nicht mehr og-image: Messenger und Netzwerke merken
   sich Vorschaubilder nach Adresse. Mit einem neuen Namen holen sie das neue Bild
   statt des alten. Ändert sich das Bild wieder, auch den Namen ändern (und in
   src/app/layout.tsx nachziehen).
   ────────────────────────────────────────────────────────────────────────── */
const { chromium } = require('playwright');
const path = require('path');

const N = `<svg width="330" height="370" viewBox="280 252 464 520" xmlns="http://www.w3.org/2000/svg">
  <g fill="#0d0d0d">
    <rect x="280" y="252" width="130" height="520"/>
    <rect x="614" y="252" width="130" height="520"/>
    <polygon points="280,252 446,252 744,772 578,772"/>
  </g></svg>`;

const HTML = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&family=DM+Sans:wght@300;400&display=swap">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; background: linear-gradient(160deg, #4ade80 0%, #22c55e 50%, #3fd672 100%);
    display: flex; align-items: center; gap: 76px; padding: 0 84px; color: #0d0d0d; font-family: 'DM Sans', system-ui, sans-serif; }
  .n { flex: none; }
  /* Die Überschriftenschrift der Seite: .font-syne heisst in tailwind.config.js «Plus Jakarta Sans». */
  .name { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; font-size: 156px; line-height: 1; letter-spacing: -0.04em; white-space: nowrap; }
  .satz { margin-top: 20px; font-size: 42px; font-weight: 400; line-height: 1.25; color: rgba(13,13,13,0.82); }
  .adresse { margin-top: 34px; font-size: 27px; font-weight: 400; color: rgba(13,13,13,0.6); letter-spacing: 0.02em; }
</style></head><body>
  <div class="n">${N}</div>
  <div>
    <div class="name">Nearby</div>
    <div class="satz">Lokales Einkaufen,<br>neu gedacht.</div>
    <div class="adresse">nearby-switzerland.ch</div>
  </div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const seite = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await seite.setContent(HTML, { waitUntil: 'networkidle' });
  await seite.evaluate(() => document.fonts.ready);
  const schriften = await seite.evaluate(() => ({ jakarta: document.fonts.check('800 40px "Plus Jakarta Sans"'), dm: document.fonts.check('400 20px "DM Sans"') }));
  console.log('Schriften geladen:', JSON.stringify(schriften));
  const ziel = path.join(__dirname, '..', 'public', 'og-nearby.jpg');
  await seite.screenshot({ path: ziel, type: 'jpeg', quality: 90 });
  console.log('geschrieben:', ziel);
  await browser.close();
})();
