# Nearby für Mac und Windows

> **Warum liegt das hier?** Dieses Repository ist öffentlich, die Nearby-Repositories sind privat. Die Installationsdateien
> müssen ohne GitHub-Anmeldung herunterladbar sein, und Dateien in Releases eines privaten Repositorys sind das nicht.
> Darum baut und veröffentlicht dieser Ordner das Programm. Die Seiten `/app`, `/download/mac` und `/download/windows`
> der Nearby-Webseite führen auf die Releases hier. Den Nearby-Quellcode enthält dieses Repository nicht.

Ein richtiges Programm zum Herunterladen: `Nearby-mac.dmg` (Mac) und `Nearby-Setup.exe` (Windows).
Es öffnet Nearby in einem eigenen Fenster, mit Symbol im Dock bzw. auf dem Desktop und im Startmenü.
Die Seiten selbst lädt es live von der Webseite (`config.json` → `startUrl`). Darum ist es immer
aktuell, und darum braucht es, wie die Webseite, Internet.

## Was auf dem Gerät gespeichert wird

Im Programmordner des Benutzers, wie bei einem Browser:

- Anmeldung und Einstellungen (lokaler Speicher). Die Webseite erkennt das Programm am Zusatz
  `NearbyDesktop/<Version>` im User-Agent und behält die Anmeldung dann auch nach dem Beenden
  (`src/lib/app-installation.ts` → `alsAppGeoeffnet`).
- Zwischenspeicher für Bilder, Skripte und Schriften (schnellerer Start).
- Grösse und Ort des Fensters (`fenster.json`).

Geschäfte, Produkte und Öffnungszeiten werden **nicht** gespeichert, sie ändern sich laufend.
Ohne Verbindung zeigt das Programm eine Hinweisseite und lädt Nearby von selbst, sobald es wieder geht.
Das alles steht in `/datenschutz` 3.5. Ändert sich etwas daran, dort mitziehen.

## Neue Installationsdateien bauen

1. Es startet von selbst bei einem Push, der das Programm ändert. Von Hand: GitHub → **Actions** → **Desktop-App bauen** → **Run workflow**.
2. Nach etwa 10 Minuten liegen unter **Releases** `Nearby-mac.dmg` und `Nearby-Setup.exe`.
3. Die Seiten `/download/mac` und `/download/windows` der Nearby-Webseite leiten auf das jeweils neueste Release hier (`src/lib/desktop.ts` in den Nearby-Repositories).

Das Programm selbst ändert sich selten, weil der Inhalt von der Webseite kommt. Neu bauen muss man nur,
wenn sich `main.js`, die Adresse oder das Symbol ändern. Für ein neues Release vorher die Version in
`package.json` erhöhen (sonst werden die Dateien des gleichen Releases ersetzt).

## Selbst ausprobieren

```
cd desktop
npm install
npm start
```

Für Tests lässt sich die Adresse überschreiben: `NEARBY_START_URL=http://localhost:3000/ npm start`
(nur im nicht installierten Programm). Entwicklertools: Menü «Ansicht».

## Adresse ändern (z. B. zum Start auf der eigenen Domain)

`config.json` → `startUrl`, dann neu bauen. Solange die Seite hinter dem Vercel-Login liegt, muss man sich
im Programmfenster einmal bei Vercel anmelden (`imFensterBleiben` erlaubt dafür `vercel.com`). Auf einer
eigenen Domain ohne Login entfällt das.

## Warum Windows und macOS warnen: Signieren

Ohne Zertifikate sind die Dateien **nicht signiert**. Das Programm funktioniert, aber das System warnt beim
ersten Öffnen:

- **Mac:** «Apple konnte nicht prüfen, ob Nearby frei von Schadsoftware ist.» → Systemeinstellungen →
  Datenschutz & Sicherheit → unten **Trotzdem öffnen**.
- **Windows:** «Der Computer wurde durch Windows geschützt» → **Weitere Informationen** → **Trotzdem ausführen**.

Das ist für den Start in Ordnung, für Kundinnen und Kunden zum Launch nicht schön. Wegzubekommen ist es mit:

- **Apple Developer Program** (ca. 99 USD pro Jahr): «Developer ID Application»-Zertifikat, dazu Beglaubigung
  (Notarisierung). Als GitHub-Secrets `MAC_CSC_LINK` (Zertifikat als Base64) und `MAC_CSC_KEY_PASSWORD` ablegen;
  für die Beglaubigung zusätzlich `mac.notarize` in `electron-builder.yml` setzen und `APPLE_ID`,
  `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` als Secrets hinterlegen.
- **Windows-Zertifikat** (Code Signing, ca. 100 bis 400 USD pro Jahr, oder «Azure Trusted Signing»): als Secrets
  `WIN_CSC_LINK` und `WIN_CSC_KEY_PASSWORD`.

Der Arbeitsablauf `.github/workflows/desktop.yml` nimmt die Secrets automatisch, sobald sie da sind.

## Aufbau

| Datei | Zweck |
|---|---|
| `main.js` | Fenster, Menü, Links, Rechte, Offline-Seite, Fenstergrösse merken, nur ein Programm gleichzeitig |
| `offline.html` | Hinweisseite ohne Verbindung |
| `config.json` | Adresse, die geöffnet wird, und Seiten, die im Fenster bleiben dürfen (PayPal, Vercel-Login) |
| `electron-builder.yml` | Pakete: `.dmg` (universal) und `.exe` (NSIS, pro Benutzer, ohne Administratorrechte) |
| `scripts/adhoc-signatur.js` | Einfache Signatur auf dem Mac, wenn es keine echte gibt |
| `build/icon*.png` | Symbole, erzeugt mit `node scripts/app-symbole.cjs` im Hauptordner |
