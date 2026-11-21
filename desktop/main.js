'use strict'

/* ──────────────────────────────────────────────────────────────────────────
   Nearby für Mac und Windows.

   Ein eigenes Programm mit eigenem Fenster, Symbol im Dock bzw. auf dem Desktop und im
   Startmenü. Es lädt Nearby live von der Webseite (config.json → startUrl). Darum ist es
   immer aktuell und braucht Internet, genau wie die Webseite selbst.

   Auf dem Gerät gespeichert wird, im Programmordner des Benutzers und wie bei einem Browser:
   - die Anmeldung und die Einstellungen (lokaler Speicher),
   - der Zwischenspeicher (Bilder, Skripte, Schriften), damit Nearby schneller startet,
   - Grösse und Ort des Fensters (fenster.json).
   Das steht in der Datenschutzerklärung (Abschnitt 3.5) und ändert sich nur zusammen mit ihr.

   Was das Programm nicht tut: Es speichert keine Geschäfte oder Produkte, schickt nichts an
   Dritte und hat keinen Zugriff auf Dateien des Benutzers. Links, die aus Nearby hinausführen,
   öffnen sich im Browser des Benutzers, nicht im Programm.
   ────────────────────────────────────────────────────────────────────────── */

const { app, BrowserWindow, Menu, clipboard, screen, session, shell } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const konfig = require('./config.json')

// Nur für Entwicklung und Tests, nie im installierten Programm: andere Adresse, anderer Datenordner.
if (!app.isPackaged) {
  if (process.env.NEARBY_START_URL) konfig.startUrl = process.env.NEARBY_START_URL
  if (process.env.NEARBY_USER_DATA) app.setPath('userData', process.env.NEARBY_USER_DATA)
}

const START = new URL(konfig.startUrl)
const NAME = 'Nearby'

/* Die Webseite erkennt das Programm am Zusatz «NearbyDesktop/<Version>» im User-Agent
   (src/lib/app-installation.ts, alsAppGeoeffnet): Dann bleibt die Anmeldung im lokalen Speicher
   erhalten, und «App herunterladen» wird nicht mehr angeboten. «Electron/…» und der Programmname
   fliegen heraus, damit Webseiten das Programm wie einen gewöhnlichen Chrome behandeln. */
app.userAgentFallback = app.userAgentFallback
  .replace(/\s+Electron\/\S+/, '')
  .replace(/\s+[^\s/]+\/[\d.]+(?=\s+Chrome\/)/, '')
  + ' NearbyDesktop/' + app.getVersion()

/* ── Wohin das Fenster gehen darf ───────────────────────────────────────── */

const PASSEND = (konfig.imFensterBleiben || [])

function hostPasst(host) {
  return PASSEND.some(e => (e.startsWith('*.') ? host === e.slice(2) || host.endsWith(e.slice(1)) : host === e))
}

function istEigen(url) {
  try { return new URL(url).host === START.host } catch { return false }
}

/* Bleibt die Adresse im Fenster? Ja für Nearby selbst und für das, was Nearby selbst anstösst
   (PayPal beim Bezahlen, die Anmeldung bei Vercel, solange die Seite dahinter liegt). Wer sich
   schon auf einer solchen Seite befindet, kommt auch wieder weiter. Alles andere öffnet sich im
   Browser. */
function bleibtImFenster(url, vonUrl) {
  let ziel
  try { ziel = new URL(url) } catch { return false }
  if (ziel.protocol === 'file:') return true
  if (ziel.protocol !== 'https:' && ziel.protocol !== 'http:') return false
  if (ziel.host === START.host || hostPasst(ziel.hostname)) return true
  if (vonUrl) {
    try {
      const von = new URL(vonUrl)
      if ((von.protocol === 'https:' || von.protocol === 'http:') && von.host !== START.host) return true
    } catch { /* ohne Herkunft: nach aussen */ }
  }
  return false
}

function extern(url) {
  try {
    const u = new URL(url)
    if (['https:', 'http:', 'mailto:', 'tel:'].includes(u.protocol)) shell.openExternal(u.toString()).catch(() => {})
  } catch { /* keine gültige Adresse */ }
}

/* Gilt für jedes Fenster, auch für solche, die die Seite selbst öffnet (target="_blank"). */
app.on('web-contents-created', (_e, wc) => {
  wc.setWindowOpenHandler(({ url }) => {
    if (bleibtImFenster(url, wc.getURL())) wc.loadURL(url).catch(() => {})
    else extern(url)
    return { action: 'deny' }
  })
  wc.on('will-navigate', (e, url) => {
    if (!bleibtImFenster(url, wc.getURL())) { e.preventDefault(); extern(url) }
  })
})

/* ── Rechte: nur für Nearby selbst, und nur, was Nearby braucht ─────────── */

function rechteSetzen(sitzung) {
  // Standort für «In deiner Nähe», Kamera zum Scannen von Codes, Kopieren in die Zwischenablage.
  const frage = (permission, url, details) => {
    if (!istEigen(url)) return false
    if (permission === 'geolocation' || permission === 'clipboard-sanitized-write' || permission === 'fullscreen') return true
    if (permission === 'media') return Array.isArray(details && details.mediaTypes) ? details.mediaTypes.every(t => t === 'video') : true
    return false
  }
  sitzung.setPermissionRequestHandler((wc, permission, antwort, details) => {
    antwort(frage(permission, (details && details.requestingUrl) || wc.getURL(), details))
  })
  sitzung.setPermissionCheckHandler((wc, permission, origin, details) => {
    if (permission === 'media') return istEigen(origin || '') && details && details.mediaType === 'video'
    return frage(permission, origin || '', details)
  })
}

/* ── Grösse und Ort des Fensters merken ─────────────────────────────────── */

const ZUSTAND = () => path.join(app.getPath('userData'), 'fenster.json')

function zustandLesen() {
  try {
    const z = JSON.parse(fs.readFileSync(ZUSTAND(), 'utf8'))
    const ok = n => Number.isFinite(n)
    if (!ok(z.width) || !ok(z.height)) return {}
    // Nur übernehmen, wenn das Fenster noch auf einem angeschlossenen Bildschirm liegt.
    if (ok(z.x) && ok(z.y)) {
      const flaeche = screen.getDisplayMatching({ x: z.x, y: z.y, width: z.width, height: z.height }).workArea
      const sichtbar = z.x < flaeche.x + flaeche.width - 80 && z.x + z.width > flaeche.x + 80 && z.y >= flaeche.y - 20 && z.y < flaeche.y + flaeche.height - 80
      if (!sichtbar) return { width: z.width, height: z.height }
    }
    return z
  } catch { return {} }
}

function zustandSichern(win) {
  try {
    if (win.isDestroyed() || win.isMinimized() || win.isFullScreen()) return
    fs.writeFileSync(ZUSTAND(), JSON.stringify({ ...win.getNormalBounds(), maximiert: win.isMaximized() }))
  } catch { /* nicht schlimm: dann öffnet sich das Fenster nächstes Mal in Standardgrösse */ }
}

/* ── Fenster ────────────────────────────────────────────────────────────── */

function laden(win, pfad) {
  if (win && !win.isDestroyed()) win.loadURL(new URL(pfad, START.origin).toString()).catch(() => {})
}

function fensterErstellen() {
  const z = zustandLesen()
  const win = new BrowserWindow({
    width: z.width || 1280,
    height: z.height || 860,
    x: z.x,
    y: z.y,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: NAME,
    backgroundColor: '#ffffff',
    autoHideMenuBar: process.platform === 'win32',
    icon: path.join(__dirname, 'build', 'icon-win.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false },
  })
  if (z.maximiert) win.maximize()

  win.once('ready-to-show', () => win.show())
  setTimeout(() => { if (!win.isDestroyed() && !win.isVisible()) win.show() }, 4000)

  let timer = null
  const spaeter = () => { clearTimeout(timer); timer = setTimeout(() => zustandSichern(win), 400) }
  win.on('resize', spaeter)
  win.on('move', spaeter)
  win.on('close', () => zustandSichern(win))

  // Keine Verbindung: eine freundliche Seite statt der Fehlermeldung des Browsers. Sie probiert
  // es von selbst wieder und kehrt zur gewünschten Seite zurück.
  win.webContents.on('did-fail-load', (_e, code, _beschreibung, url, hauptFenster) => {
    if (!hauptFenster || code === -3 || String(url).startsWith('file:')) return
    win.loadFile(path.join(__dirname, 'offline.html'), { query: { ziel: istEigen(url) ? url : konfig.startUrl } }).catch(() => {})
  })
  win.webContents.on('render-process-gone', (_e, d) => { if (d.reason !== 'clean-exit' && !win.isDestroyed()) win.reload() })

  win.webContents.on('context-menu', (_e, p) => {
    const punkte = []
    if (p.linkURL) punkte.push(
      { label: 'Link im Browser öffnen', click: () => extern(p.linkURL) },
      { label: 'Link kopieren', click: () => clipboard.writeText(p.linkURL) },
    )
    if (p.isEditable) {
      if (punkte.length) punkte.push({ type: 'separator' })
      punkte.push(
        { role: 'undo', label: 'Rückgängig' }, { role: 'redo', label: 'Wiederholen' }, { type: 'separator' },
        { role: 'cut', label: 'Ausschneiden' }, { role: 'copy', label: 'Kopieren' }, { role: 'paste', label: 'Einfügen' },
        { role: 'selectAll', label: 'Alles auswählen' },
      )
    } else if (p.selectionText) {
      if (punkte.length) punkte.push({ type: 'separator' })
      punkte.push({ role: 'copy', label: 'Kopieren' })
    }
    if (punkte.length) Menu.buildFromTemplate(punkte).popup({ window: win })
  })

  win.loadURL(konfig.startUrl).catch(() => { /* did-fail-load zeigt die Hinweisseite */ })
  return win
}

/* ── Menü ───────────────────────────────────────────────────────────────── */

function menuErstellen() {
  const mac = process.platform === 'darwin'
  const fenster = () => BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
  const vorlage = [
    ...(mac ? [{
      label: NAME,
      submenu: [
        { role: 'about', label: 'Über Nearby' }, { type: 'separator' },
        { role: 'services', label: 'Dienste' }, { type: 'separator' },
        { role: 'hide', label: 'Nearby ausblenden' }, { role: 'hideOthers', label: 'Andere ausblenden' }, { role: 'unhide', label: 'Alle einblenden' },
        { type: 'separator' }, { role: 'quit', label: 'Nearby beenden' },
      ],
    }] : []),
    {
      label: 'Bearbeiten',
      submenu: [
        { role: 'undo', label: 'Rückgängig' }, { role: 'redo', label: 'Wiederholen' }, { type: 'separator' },
        { role: 'cut', label: 'Ausschneiden' }, { role: 'copy', label: 'Kopieren' }, { role: 'paste', label: 'Einfügen' },
        { role: 'selectAll', label: 'Alles auswählen' },
      ],
    },
    {
      label: 'Ansicht',
      submenu: [
        { label: 'Zur Karte', accelerator: 'CmdOrCtrl+Shift+K', click: () => laden(fenster(), '/in-deiner-naehe') },
        { label: 'Neu laden', accelerator: 'CmdOrCtrl+R', click: () => { const w = fenster(); if (w) w.webContents.reload() } },
        { type: 'separator' },
        { role: 'zoomIn', label: 'Vergrössern' }, { role: 'zoomOut', label: 'Verkleinern' }, { role: 'resetZoom', label: 'Originalgrösse' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Vollbild' },
        ...(app.isPackaged ? [] : [{ type: 'separator' }, { role: 'toggleDevTools', label: 'Entwicklertools' }]),
      ],
    },
    {
      label: 'Gehe',
      submenu: [
        { label: 'Zurück', accelerator: mac ? 'Cmd+[' : 'Alt+Left', click: () => { const w = fenster(); if (w && w.webContents.canGoBack()) w.webContents.goBack() } },
        { label: 'Vor', accelerator: mac ? 'Cmd+]' : 'Alt+Right', click: () => { const w = fenster(); if (w && w.webContents.canGoForward()) w.webContents.goForward() } },
      ],
    },
    {
      label: 'Fenster',
      submenu: [
        { role: 'minimize', label: 'Minimieren' },
        ...(mac ? [{ role: 'zoom', label: 'Zoomen' }] : []),
        { role: 'close', label: 'Schliessen' },
      ],
    },
    {
      label: 'Hilfe',
      submenu: [
        { label: 'Nearby im Browser öffnen', click: () => extern(START.origin) },
        { label: 'Kontakt', click: () => extern('mailto:etiennezogg@gmail.com') },
      ],
    },
  ]
  return Menu.buildFromTemplate(vorlage)
}

/* ── Start ──────────────────────────────────────────────────────────────── */

if (!app.requestSingleInstanceLock()) {
  // Nearby läuft schon: das bestehende Fenster kommt nach vorn, dieses Exemplar beendet sich.
  app.quit()
} else {
  app.on('second-instance', () => {
    const w = BrowserWindow.getAllWindows()[0]
    if (!w) return
    if (w.isMinimized()) w.restore()
    w.focus()
  })

  app.whenReady().then(() => {
    app.setAppUserModelId('ch.nearby.desktop')
    app.setAboutPanelOptions({ applicationName: NAME, applicationVersion: app.getVersion(), copyright: '© 2026 Nearby · Cham, Schweiz' })
    rechteSetzen(session.defaultSession)
    Menu.setApplicationMenu(menuErstellen())
    fensterErstellen()
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) fensterErstellen() })
  })

  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
}
