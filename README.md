# Nearby-Coming-Soon
Öffentliche Coming-Soon-Seite von Nearby (nearby-switzerland.ch).

## Vorschaubild für geteilte Links

`public/og-nearby.jpg` (1200 × 630) ist das Bild, das WhatsApp, LinkedIn und Co. zeigen, wenn jemand
den Link teilt: Markengrün mit schwarzem N. Neu erzeugen mit `node scripts/og-bild.cjs` (braucht
Playwright, lokal). Das frühere Foto mit dem N auf der Blumenwiese wird nicht mehr verwendet.
Ändert sich das Bild, auch den Dateinamen ändern und in `src/app/layout.tsx` nachziehen — Netzwerke
merken sich Vorschaubilder nach Adresse.
