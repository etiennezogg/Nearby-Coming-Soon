/* Der Zusatz zur Wortmarke: «Nearby» bleibt, wie sie ist; unten rechts steht klein «ZOGG» (gleiche Schrift, nur Grossbuchstaben).
   Grund (Etienne): Nearby ist ein Einzelunternehmen, und der Familienname gehört zur Firma. Er steht darum an jeder Wortmarke
   auf der Seite. Die Schrift und das Aussehen stehen in globals.css unter «.zogg» und «.zogg-anker».

   So wird er eingesetzt: <Zogg /> kommt unmittelbar hinter den Text der Wortmarke, im selben Textbehälter (kein Flex-Behälter,
   sonst wird der Anker zum eigenen Flex-Element). Der Anker sitzt auf der Grundlinie des Textes, darum stimmt der Abstand zum «y»
   bei jeder Zeilenhöhe, und der Behälter braucht weder «relative» noch eine bestimmte Breite. Er verschiebt nichts.
   Andere Grösse: style={{ ['--zogg-groesse' as string]: '1.5rem' }} an der Wortmarke. */
export default function Zogg() {
  return <span className="zogg-anker"><span className="zogg">Zogg</span></span>
}
