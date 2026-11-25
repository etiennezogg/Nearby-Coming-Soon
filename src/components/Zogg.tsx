/* Der Zusatz zur Wortmarke: «Nearby» bleibt, wie sie ist; unten rechts steht klein «ZOGG» (gleiche Schrift, nur Grossbuchstaben).
   Grund (Etienne): Nearby ist ein Einzelunternehmen, und der Familienname gehört zur Firma. Er steht darum an jeder Wortmarke
   auf der Seite. Die Schrift und das Aussehen stehen in globals.css unter «.zogg».

   So wird er eingesetzt: Der Behälter der Wortmarke braucht «relative» und die Breite seines Textes (inline-block, w-fit oder ein
   Flex-Element), dann kommt <Zogg /> hinter den Text. Er verschiebt nichts, die Wortmarke bleibt an ihrem Platz.
   Andere Grösse oder anderer Abstand: style={{ ['--zogg-groesse' as string]: '1.5rem', ['--zogg-versatz' as string]: '1.2em' }} am Behälter. */
export default function Zogg() {
  return <span className="zogg">Zogg</span>
}
