# Nearby-Coming-Soon
Öffentliche Coming-Soon-Seite von Nearby (nearby-switzerland.ch).

## Vorschaubild für geteilte Links

`public/og-nearby.jpg` (1200 × 630) ist das Bild, das WhatsApp, LinkedIn und Co. zeigen, wenn jemand
den Link teilt: Markengrün mit schwarzem N. Neu erzeugen mit `node scripts/og-bild.cjs` (braucht
Playwright, lokal). Das frühere Foto mit dem N auf der Blumenwiese wird nicht mehr verwendet.
Ändert sich das Bild, auch den Dateinamen ändern und in `src/app/layout.tsx` nachziehen — Netzwerke
merken sich Vorschaubilder nach Adresse.

## Desktop-App (Ordner `desktop/`)

Nearby gibt es auch als Programm für Mac und Windows (`Nearby-mac.dmg`, `Nearby-Setup.exe`). Der Ordner `desktop/`
enthält die kleine Programm-Hülle (Electron); GitHub Actions («Desktop-App bauen») baut daraus die Dateien und legt sie
unter **Releases** ab. Sie liegen in diesem öffentlichen Repository, damit der Download ohne Anmeldung geht: Die
Nearby-Webseite leitet mit `/download/mac` und `/download/windows` hierher. Mit der Startseite hat das nichts zu tun;
Genaueres steht in `desktop/README.md`.
