import { defineGuide } from '../../lib/guide-types';
import { foerderung, obergrenze, tabelle } from '../../lib/engine/foerderung';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Einkommensgrenze: drei Stufen, Obergrenze mit Kindern, Grenzfälle (genau auf der Grenze, 1 € darüber,
 * Kinderbereich über 80 000 €). Alle Beträge aus dem Rechenkern; Zulassung im November 2026 als Annahme.
 */
const F = P.foerderung;
const [g1, g2, g3] = F.grenzen;
const z = '2026-11-01';
const b = (zve: number, kinder = 0, antrieb: 'bev' | 'phev' = 'bev') => foerderung({ zve, kinder, antrieb, zulassung: z }).betrag;
const hh: Array<[string, string, number, number]> = [
  ['Alleinstehende Pflegekraft', 'Single nurse', 38000, 0],
  ['Alleinerziehende Lehrerin, ein Kind', 'Single parent teacher, one child', 46000, 1],
  ['Paar mit einem Kind', 'Couple with one child', 52000 + 31000, 1],
  ['Paar mit zwei Kindern', 'Couple with two children', 61000 + 28500, 2],
  ['Paar ohne Kind, zwei Vollzeitstellen', 'Couple without children, two full-time jobs', 47000 + 39000, 0],
];
const faelle: Array<[number, number]> = [[g1, 0], [g1 + 1, 0], [g2, 0], [g2 + 1, 0], [g3, 0], [g3 + 1, 0], [g3 + 1, 1], [obergrenze(1) + 1, 1], [obergrenze(1) + 1, 2], [obergrenze(2), 2], [obergrenze(2) + 1, 2]];

export default defineGuide({
  id: 'einkommensgrenze',
  group: 'foerderung',
  order: 10,
  mini: 'fGrenze',
  related: ['haushaltseinkommen', 'kinder', 'selbststaendige', 'rentner', 'home'],
  sources: ['richtlinie', 'bafaFaq', 'bafaHoehe', 'estg2'],
  de: {
    slug: 'einkommensgrenze-e-auto-foerderung',
    nav: 'Einkommensgrenze',
    card: 'Die drei Stufen, die Obergrenze mit Kindern und was genau auf der Grenze gilt.',
    title: 'Einkommensgrenze E-Auto-Förderung 2026: Stufen und Kinder',
    description: `Einkommensgrenze der E-Auto-Förderung 2026: Stufen bis ${DE.eur(g1)}, ${DE.eur(g2)} und ${DE.eur(g3)} zvE, mit Kindern bis ${DE.eur(F.obergrenze_max)}. Alle Grenzen sind eingeschlossen.`,
    h1: 'Einkommensgrenze der E-Auto-Förderung 2026',
    intro: 'Welche Stufe gilt für Ihren Haushalt, wie viel Abstand bleibt bis zur nächsten Kürzung und was passiert, wenn das Einkommen genau auf einer Grenze liegt.',
    resume: `Die E-Auto-Förderung 2026 hängt vom zu versteuernden Einkommen des Haushalts ab, nicht vom Bruttogehalt. Die Richtlinie kennt drei Stufen: bis ${DE.eur(g1)}, bis ${DE.eur(g2)} und bis ${DE.eur(g3)}. Ein Elektroauto bringt ohne Kind ${DE.eur(F.bev[0][0])}, ${DE.eur(F.bev[1][0])} oder ${DE.eur(F.bev[2][0])}, ein förderfähiger Plug-in-Hybrid ${DE.eur(F.phev[0][0])}, ${DE.eur(F.phev[1][0])} oder ${DE.eur(F.phev[2][0])}. Die Grenzen sind eingeschlossen: Wer genau ${DE.eur(g1)} hat, bleibt in der ersten Stufe, ein Euro mehr führt in die zweite. Über ${DE.eur(g3)} gibt es nur noch etwas mit Kindern: Für jedes förderrelevante Kind steigt die Obergrenze um ${DE.eur(F.obergrenze_je_kind)}, höchstens auf ${DE.eur(F.obergrenze_max)} mit zwei Kindern. In diesem Bereich gilt der Betrag der dritten Stufe. Wer über der Obergrenze liegt, bekommt nichts, auch nicht anteilig. Gezählt wird für jede erwachsene Person im Haushalt der Durchschnitt aus den zwei letzten Steuerbescheiden; die Summe ist das Haushaltseinkommen.`,
    faqs: [
      { q: 'Was passiert, wenn mein Einkommen genau auf der Einkommensgrenze liegt?', a: `Dann gilt die günstigere Stufe. Die Richtlinie formuliert die Stufen als „bis einschließlich“: ${DE.eur(g1)} gehören zur ersten Stufe, ${DE.eur(g2)} zur zweiten, ${DE.eur(g3)} zur dritten. Schon ${DE.eur(g1 + 0.5, 2)} liegen dagegen in der zweiten Stufe. Gerundet wird nicht; maßgeblich ist der Durchschnitt aus Ihren Bescheiden, auf den Cent genau.` },
      { q: 'Ist die Einkommensgrenze brutto oder netto gemeint?', a: 'Weder noch. Gemeint ist das zu versteuernde Einkommen, das im Einkommensteuerbescheid steht. Es liegt deutlich unter dem Bruttolohn, weil Werbungskosten, Vorsorgeaufwendungen, Sonderausgaben und weitere Abzüge schon abgezogen sind. Wer nur sein Bruttogehalt kennt, unterschätzt meist, wie viel Förderung möglich ist. Die richtige Zahl steht in der Berechnung auf den ersten Seiten des Bescheids.' },
      { q: 'Bekomme ich über 80 000 Euro Haushaltseinkommen noch eine Förderung?', a: `Nur mit förderrelevanten Kindern. Mit einem Kind liegt die Grenze bei ${DE.eur(obergrenze(1))}, mit zwei oder mehr bei ${DE.eur(obergrenze(2))}. Innerhalb dieser Grenze gibt es den Betrag der dritten Stufe, für ein Elektroauto mit einem Kind also ${DE.eur(F.bev[2][1])}. Ohne Kind endet die Förderung bei ${DE.eur(g3)}.` },
      { q: 'Wird die Förderung oberhalb der Grenze anteilig gekürzt?', a: 'Nein. Die Beträge springen von Stufe zu Stufe, und über der Obergrenze fällt die Förderung ganz weg. Es gibt keine gleitende Kürzung. Deshalb lohnt der genaue Blick auf den Durchschnitt der Bescheide: Wenige hundert Euro können den Unterschied zwischen zwei Stufen ausmachen, und ein Euro über der Obergrenze kostet die ganze Förderung.' },
      { q: 'Zählt eine Gehaltserhöhung nach dem Antrag für die Einkommensgrenze?', a: 'Nein. Maßgeblich sind die zwei aktuellsten Bescheide zum Zeitpunkt der Antragstellung. Was sich danach ändert, etwa ein höheres Gehalt, ein Jobwechsel oder der Übergang in die Rente, hat keine Auswirkung auf die bewilligte Förderung, auch nicht während der Haltedauer. Umgekehrt hilft ein späterer Einkommensrückgang nicht mehr, wenn der Antrag schon gestellt ist.' },
    ],
    body: (h) => `
<h2>Die Tabelle der Richtlinie</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} legt die Beträge in einer Tabelle fest: Zeilen nach Einkommen, Spalten nach der Zahl der Kinder. Für reine Elektroautos und Brennstoffzellenfahrzeuge gilt die erste, für Plug-in-Hybride und Range Extender die zweite Tabelle. Die ${h.src('bafaHoehe', 'Übersicht des BAFA')} zeigt dieselben Werte.</p>
${h.table(['Haushaltseinkommen', 'Ohne Kind', '1 Kind', '2 Kinder'], tabelle('bev').map((r) => [`${h.eur(r.von)} bis ${h.eur(r.bis)}`, ...r.betraege.map((x) => (x ? h.eur(x) : 'keine'))]), 'Elektroauto (BEV): Förderung nach Einkommen und Kindern', ['l', 'r', 'r', 'r'])}
${h.table(['Haushaltseinkommen', 'Ohne Kind', '1 Kind', '2 Kinder'], tabelle('phev').map((r) => [`${h.eur(r.von)} bis ${h.eur(r.bis)}`, ...r.betraege.map((x) => (x ? h.eur(x) : 'keine'))]), 'Plug-in-Hybrid (PHEV): Förderung nach Einkommen und Kindern', ['l', 'r', 'r', 'r'])}
<p>Zwischen zwei Stufen liegen beim Elektroauto jeweils ${h.eur(F.bev[0][0] - F.bev[1][0])}, beim Plug-in-Hybrid ebenso viel. Jedes Kind erhöht den Betrag in jeder Stufe um ${h.eur(F.bev[0][1] - F.bev[0][0])}. Die Spalten zeigen, dass die Kinder zweimal wirken: Sie erhöhen den Betrag und verschieben die Obergrenze.</p>
<h2>Grenzfälle, Euro für Euro</h2>
<p>Die folgenden Fälle rechnet der Rechenkern dieser Seite mit einem Elektroauto, zugelassen im November 2026. Sie zeigen, wo genau die Sprünge liegen.</p>
${h.table(['Haushaltseinkommen', 'Kinder', 'Förderung'], faelle.map(([zve, k]) => [h.eur(zve), String(k), h.eur(b(zve, k))]), 'Förderung an den Grenzen, Elektroauto', ['r', 'r', 'r'])}
<p>Auffällig ist der Bereich direkt über ${h.eur(g3)}: Ein Haushalt ohne Kind bekommt dort nichts, ein Haushalt mit einem Kind bekommt ${h.eur(b(g3 + 1, 1))}. Bei ${h.eur(obergrenze(1) + 1)} reicht ein Kind nicht mehr, zwei Kinder schon. Ein drittes Kind verschiebt nichts mehr, weil die Richtlinie höchstens ${F.max_kinder} Kinder zählt.</p>
<h2>Was „zu versteuerndes Einkommen“ bedeutet</h2>
<p>Das zu versteuernde Einkommen ist ein Begriff aus dem ${h.src('estg2', '§ 2 Abs. 5 EStG')}. Es ist das, was nach allen Abzügen als Grundlage für die Einkommensteuer übrig bleibt. Vom Bruttolohn gehen unter anderem ab: die Werbungskosten, mindestens die Pauschale, die Beiträge zur Renten-, Kranken- und Pflegeversicherung als Vorsorgeaufwendungen, Spenden, Kirchensteuer und andere Sonderausgaben, außergewöhnliche Belastungen. Bei Selbstständigen beginnt die Rechnung beim Gewinn, nicht beim Umsatz. Die Zahl steht im Einkommensteuerbescheid, meist in der Berechnung auf Seite zwei oder drei, in der Zeile „zu versteuerndes Einkommen“.</p>
<p>Weil die Abzüge je nach Lage sehr verschieden sind, lässt sich aus einem Bruttogehalt kein sicheres zvE ableiten. Dieser Rechner fragt deshalb nur nach der Zahl aus dem Bescheid. Wer noch keinen Bescheid für das letzte Jahr hat, kann eine Steuererklärung abgeben; für die Förderung zählen nur Bescheide, keine Erklärungen und keine Lohnsteuerbescheinigungen.</p>
<h2>Der Durchschnitt aus zwei Jahren</h2>
<p>Für jede erwachsene Person des Haushalts zählt der Mittelwert der zvE aus den zwei aktuellsten Bescheiden; danach werden die Mittelwerte addiert. Ein Jahr mit einer Abfindung oder einem besonders guten Geschäftsergebnis wiegt deshalb nur halb. Das ${h.src('bafaFaq', 'BAFA')} nennt das ausdrücklich als Zweck des Durchschnitts. Die genaue Rechnung mit zwei Personen und vier Bescheiden zeigt ${h.a('haushaltseinkommen', 'Haushaltseinkommen berechnen')}. Wie schwankende Gewinne wirken, steht unter ${h.a('selbststaendige', 'Selbstständige und Firmenwagen')}.</p>
<h2>Wie viel Spielraum Sie haben</h2>
<p>Der Mini-Rechner oben zeigt den Abstand bis zur nächsten Kürzung. Ein Beispiel: Ein Paar ohne Kind hat im Durchschnitt ${h.eur(58000)}. Es liegt in der zweiten Stufe und bekommt für ein Elektroauto ${h.eur(b(58000))}. Bis zur nächsten Grenze bleiben ${h.eur(g2 - 58000)}; darüber gäbe es ${h.eur(b(g2 + 1))}. Läge das Haushaltseinkommen bei ${h.eur(44800)}, wären es ${h.eur(b(44800))}, also ${h.eur(b(44800) - b(58000))} mehr. Ändern lässt sich daran nach dem Antrag nichts, vorher aber durchaus etwas: Welche zwei Bescheide die neuesten sind, hängt davon ab, wann Sie Ihre Steuererklärung abgeben und wann das Finanzamt sie bearbeitet.</p>
<h2>Fünf Haushalte im Vergleich</h2>
<p>Die Zahlen in dieser Tabelle sind Annahmen für den Durchschnitt aus zwei Bescheiden, keine typischen Werte eines Berufs. Sie zeigen, wie verschieden Haushalte mit ähnlichem Bruttoeinkommen eingeordnet werden können.</p>
${h.table(['Haushalt', 'Haushaltseinkommen', 'Kinder', 'Elektroauto', 'Plug-in-Hybrid'], hh.map(([de, , zve, k]) => [de, h.eur(zve), String(k), h.eur(b(zve, k)), h.eur(b(zve, k, 'phev'))]), 'Beispielhaushalte, Zulassung im November 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>Das Paar ohne Kind mit zwei Vollzeitstellen liegt mit ${h.eur(47000 + 39000)} über der Grenze und geht leer aus, obwohl jede Person für sich allein in der ersten oder zweiten Stufe läge. Das Paar mit zwei Kindern liegt mit ${h.eur(61000 + 28500)} knapp unter der höchsten Obergrenze von ${h.eur(F.obergrenze_max)} und bekommt den Betrag der dritten Stufe mit zwei Kindern. Wer zusammenlebt, zählt zusammen, verheiratet oder nicht; die Regeln dazu stehen unter ${h.a('haushaltseinkommen', 'Haushaltseinkommen')}.</p>
<h2>Wie das BAFA die Grenze prüft</h2>
<p>Das BAFA rechnet nicht mit Ihren eigenen Angaben, sondern mit den hochgeladenen Bescheiden. Es braucht daraus nur wenige Angaben: Adressat, Steuer-ID, Datum, Steuerjahr und die Höhe des zu versteuernden Einkommens. Alle übrigen Seiten müssen nicht eingereicht werden, und was nicht benötigt wird, dürfen Sie schwärzen, aber nur auf der Kopie. Die Bescheide dürfen höchstens ${h.P.foerderung.bescheid_max_alter_jahre} Jahre alt sein, gemessen am geprüften Steuerjahr, nicht am Datum, an dem das Finanzamt sie verschickt hat. Wer zwei passende Bescheide schon im Ordner hat, kann den Antrag also sofort nach der Zulassung stellen.</p>
<h2>Was nicht zur Grenze zählt</h2>
<ul>
<li>Einkommen erwachsener Kinder, die im Haushalt leben: Es bleibt außen vor.</li>
<li>Steuerfreie Leistungen wie Kindergeld, Elterngeld oder Wohngeld: Sie stehen nicht im zvE. Ob sie über den Progressionsvorbehalt den Steuersatz erhöhen, ist für die Förderung gleichgültig.</li>
<li>Vermögen: Ersparnisse, Immobilien oder Depots spielen keine Rolle, nur deren steuerpflichtige Erträge, soweit sie im zvE stehen.</li>
<li>Der Preis des Autos: Eine Preisobergrenze für das Fahrzeug gibt es nicht.</li>
</ul>
<p>Was die Förderung für einen bestimmten Wagen ergibt, rechnet der ${h.a('home', 'Prämienrechner')} mit Listenpreis und Nettopreis.</p>`,
  },
  en: {
    slug: 'income-limit',
    nav: 'Income limit',
    card: 'The three bands, the higher limit with children, and what applies exactly on a limit.',
    title: 'EV grant income limit 2026: bands, children and edge cases',
    description: `EV grant income limit in Germany 2026: bands up to ${EN.eur(g1)}, ${EN.eur(g2)} and ${EN.eur(g3)} taxable income, up to ${EN.eur(F.obergrenze_max)} with children. All limits are inclusive.`,
    h1: 'The income limit for the 2026 EV grant',
    intro: 'Which band your household falls in, how much room is left before the next cut, and what happens when income sits exactly on a limit.',
    resume: `Germany’s 2026 EV grant depends on the household’s taxable income (zu versteuerndes Einkommen, zvE), not on gross salary. The guideline has three bands: up to ${EN.eur(g1)}, up to ${EN.eur(g2)} and up to ${EN.eur(g3)}. A battery electric car brings ${EN.eur(F.bev[0][0])}, ${EN.eur(F.bev[1][0])} or ${EN.eur(F.bev[2][0])} without children; a qualifying plug-in hybrid ${EN.eur(F.phev[0][0])}, ${EN.eur(F.phev[1][0])} or ${EN.eur(F.phev[2][0])}. The limits are inclusive: exactly ${EN.eur(g1)} stays in the first band, one euro more moves you into the second. Above ${EN.eur(g3)} there is only something with children: each qualifying child raises the ceiling by ${EN.eur(F.obergrenze_je_kind)}, up to ${EN.eur(F.obergrenze_max)} with two. In that range the third-band amount applies. Above the ceiling there is nothing, not even a partial grant. For each adult in the household, the average of the last two income tax assessments (Einkommensteuerbescheid) counts, and the sum is the household income.`,
    faqs: [
      { q: 'What if my income is exactly on the EV grant income limit?', a: `Then the better band applies. The guideline sets the bands as “up to and including”: ${EN.eur(g1)} belongs to the first band, ${EN.eur(g2)} to the second, ${EN.eur(g3)} to the third. Even ${EN.eur(g1 + 0.5, 2)} falls into the second band. Nothing is rounded; what counts is the average from your assessments, to the cent.` },
      { q: 'Is the income limit based on gross or net pay?', a: 'Neither. It is the taxable income shown on your income tax assessment. That is well below gross pay, because work expenses, pension and health insurance contributions, special expenses and other deductions have already been taken off. People who only know their gross salary usually underestimate how much grant is possible. The right figure is in the calculation on the first pages of the assessment.' },
      { q: 'Is there any grant above €80,000 household income?', a: `Only with qualifying children. With one child the ceiling is ${EN.eur(obergrenze(1))}, with two or more ${EN.eur(obergrenze(2))}. Within that ceiling the third-band amount applies, so ${EN.eur(F.bev[2][1])} for a battery electric car with one child. Without children the grant stops at ${EN.eur(g3)}.` },
      { q: 'Is the grant tapered just above the limit?', a: 'No. Amounts jump from band to band, and above the ceiling the grant disappears altogether. There is no sliding reduction. That is why the exact average of your assessments matters: a few hundred euros can decide between two bands, and one euro above the ceiling costs the whole grant.' },
      { q: 'Does a pay rise after I apply affect the income limit?', a: 'No. What counts is the two most recent assessments at the time you apply. Anything that changes afterwards, a higher salary, a new job or retirement, has no effect on the approved grant, including during the holding period. Equally, a later drop in income no longer helps once the application is in.' },
    ],
    body: (h) => `
<h2>The guideline’s table</h2>
<p>The ${h.src('richtlinie', 'funding guideline')} (Förderrichtlinie) sets the amounts in a grid: rows by income, columns by number of children. Battery electric and fuel cell cars use the first table, plug-in hybrids and range extenders the second. The ${h.src('bafaHoehe', 'BAFA overview')} shows the same values.</p>
${h.table(['Household income', 'No children', '1 child', '2 children'], tabelle('bev').map((r) => [`${h.eur(r.von)} to ${h.eur(r.bis)}`, ...r.betraege.map((x) => (x ? h.eur(x) : 'none'))]), 'Battery electric (BEV): grant by income and children', ['l', 'r', 'r', 'r'])}
${h.table(['Household income', 'No children', '1 child', '2 children'], tabelle('phev').map((r) => [`${h.eur(r.von)} to ${h.eur(r.bis)}`, ...r.betraege.map((x) => (x ? h.eur(x) : 'none'))]), 'Plug-in hybrid (PHEV): grant by income and children', ['l', 'r', 'r', 'r'])}
<p>Each band step is worth ${h.eur(F.bev[0][0] - F.bev[1][0])} for a battery electric car, and the same for a plug-in hybrid. Each child adds ${h.eur(F.bev[0][1] - F.bev[0][0])} in every band. The columns show that children work twice: they raise the amount and they move the ceiling.</p>
<h2>Edge cases, euro by euro</h2>
<p>The cases below are worked out by this site’s engine for a battery electric car registered in November 2026. They show exactly where the jumps are.</p>
${h.table(['Household income', 'Children', 'Grant'], faelle.map(([zve, k]) => [h.eur(zve), String(k), h.eur(b(zve, k))]), 'Grant at the limits, battery electric', ['r', 'r', 'r'])}
<p>Note the range just above ${h.eur(g3)}: a household without children gets nothing there, one with a child gets ${h.eur(b(g3 + 1, 1))}. At ${h.eur(obergrenze(1) + 1)} one child is no longer enough, two are. A third child changes nothing, because the guideline counts at most ${F.max_kinder} children.</p>
<h2>What “taxable income” means</h2>
<p>Taxable income is defined in ${h.src('estg2', 'section 2(5) of the Income Tax Act (EStG)')}. It is what remains as the basis for income tax after all deductions. Off gross pay come, among other things: work-related expenses (at least the flat allowance), pension, health and care insurance contributions, donations, church tax and other special expenses, and extraordinary costs. For the self-employed the starting point is profit, not turnover. The figure is on your assessment, usually on page two or three, on the line “zu versteuerndes Einkommen”.</p>
<p>Because deductions vary so much, you cannot reliably derive taxable income from a gross salary. This calculator therefore only asks for the figure on the assessment. If you have no assessment for last year yet, you can file a tax return; only assessments count for the grant, not returns and not the annual payroll tax certificate (Lohnsteuerbescheinigung).</p>
<h2>The two-year average</h2>
<p>For each adult in the household, the mean taxable income from the two most recent assessments counts; the means are then added. A year with a severance payment or an unusually good business result therefore only weighs half. ${h.src('bafaFaq', 'BAFA')} names this explicitly as the purpose of the average. The detailed sum with two people and four assessments is on ${h.a('haushaltseinkommen', 'household income')}. How fluctuating profits play out is under ${h.a('selbststaendige', 'self-employed and company cars')}.</p>
<h2>How much room you have</h2>
<p>The small calculator above shows the distance to the next cut. An example: a couple without children averages ${h.eur(58000)}. They are in the second band and get ${h.eur(b(58000))} for a battery electric car. The next limit is ${h.eur(g2 - 58000)} away; above it they would get ${h.eur(b(g2 + 1))}. At ${h.eur(44800)} they would get ${h.eur(b(44800))}, which is ${h.eur(b(44800) - b(58000))} more. Nothing can be changed after applying, but before that, which two assessments are the latest depends on when you file your return and when the tax office processes it.</p>
<h2>Five households compared</h2>
<p>The figures in this table are assumptions for the average of two assessments, not typical values for a profession. They show how differently households with similar gross pay can be placed.</p>
${h.table(['Household', 'Household income', 'Children', 'Battery electric', 'Plug-in hybrid'], hh.map(([, en, zve, k]) => [en, h.eur(zve), String(k), h.eur(b(zve, k)), h.eur(b(zve, k, 'phev'))]), 'Example households, registration in November 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>The couple without children and two full-time jobs is above the limit at ${h.eur(47000 + 39000)} and gets nothing, although each of them alone would be in the first or second band. The couple with two children is just under the highest ceiling of ${h.eur(F.obergrenze_max)} at ${h.eur(61000 + 28500)} and receives the third-band amount for two children. People who live together count together, married or not; the rules are under ${h.a('haushaltseinkommen', 'household income')}.</p>
<h2>How BAFA checks the limit</h2>
<p>BAFA does not work from your own figures but from the uploaded assessments. It only needs a few details from them: addressee, tax ID, date, tax year and the amount of taxable income. Other pages need not be submitted, and you may black out anything not needed, but only on the copy. Assessments may be at most ${h.P.foerderung.bescheid_max_alter_jahre} years old, measured by the tax year assessed, not the date the tax office sent them.</p>
<h2>What does not count towards the limit</h2>
<ul>
<li>Income of adult children living in the household: it is left out.</li>
<li>Tax-free payments such as Kindergeld, parental allowance or housing benefit: they are not part of taxable income. Whether they raise your tax rate through the progression clause does not matter for the grant.</li>
<li>Wealth: savings, property and investments play no part, only their taxable returns where they appear in taxable income.</li>
<li>The car’s price: there is no price cap on the vehicle.</li>
</ul>
<p>What the grant comes to for a particular car, with list price and net price, is on the ${h.a('home', 'grant calculator')}.</p>`,
  },
});
