import { defineGuide } from '../../lib/guide-types';
import { foerderung, nettopreis } from '../../lib/engine/foerderung';
import { erloes } from '../../lib/engine/thg';
import M from '../../data/modelle.json';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Kombinieren: Förderung + Hersteller- oder Händlerrabatt (Preisnachlass, keine öffentliche Förderung) + THG-Prämie
 * (Marktpreis) + Kfz-Steuerbefreiung (Gesetz). Ausgeschlossen: andere öffentliche Förderung für dasselbe Fahrzeug,
 * es sei denn eine Verwaltungsvereinbarung mit dem BMUKN sieht es vor; vergleichbare Förderung eines anderen EU-Staates.
 * Beispiel ID.3 mit Listenpreis aus modelle.json; die „ID. Kaufprämie“ von VW (bis 4 000 €) ist nicht abgezogen.
 */
const F = P.foerderung;
const z = '2026-11-01';
const b = (zve: number, kinder = 0) => foerderung({ zve, kinder, antrieb: 'bev', zulassung: z }).betrag;
const id3 = M.modelle.find((m) => m.id === 'vw-id3')!;
const LP = id3.preis as number;
const HERST = 4000; // „bis zu 4 000 €“ laut VW-Website am 19.10.2026, Höchstwert, nicht garantiert
const thg3 = erloes({ praemie: P.thg.markt_ohne_bonus_ab_eur, jahre: 3, fahrzeuge: 1 }).gesamt;
const hh: Array<[number, number]> = [[40000, 0], [55000, 1], [75000, 2]];

export default defineGuide({
  id: 'kumulierung',
  group: 'antrag',
  order: 50,
  mini: 'aKombi',
  related: ['neuwagen', 'thg-praemie', 'wallbox', 'leasing', 'vw-id3'],
  sources: ['richtlinie', 'bafaFaq', 'bmukn', 'finanztip'],
  de: {
    slug: 'kaufpraemie-kombinieren',
    nav: 'Prämien kombinieren',
    card: 'Was sich mit der Förderung verbinden lässt: Herstellerprämie, THG-Quote, Steuerbefreiung, und was nicht.',
    title: 'E-Auto Kaufprämie kombinieren 2026: Hersteller, Land, Quote',
    description: 'E-Auto Kaufprämie kombinieren 2026: Herstellerrabatt, THG-Prämie und Steuerbefreiung gehen zusammen, eine zweite öffentliche Förderung meist nicht mehr.',
    h1: 'Kaufprämie kombinieren: was zusammen geht und was nicht',
    intro: 'Neben der staatlichen Förderung werben Hersteller mit eigenen Prämien, Länder und Städte mit Programmen, Anbieter mit der THG-Quote. Welche Beträge sich addieren lassen und wo die Grenze liegt.',
    resume: `Die staatliche E-Auto-Förderung 2026 lässt sich mit mehreren anderen Vorteilen verbinden, aber nicht mit allen. Ein Rabatt des Herstellers oder Händlers ist ein Preisnachlass und keine öffentliche Förderung; er schließt die Förderung nicht aus. Volkswagen wirbt zum Beispiel mit einer eigenen „ID. Kaufprämie“ von bis zu ${DE.eur(HERST)}, die mit der Förderung des Bundes nichts zu tun hat. Die THG-Prämie ist ein Erlös am Markt und kommt jedes Jahr dazu; im Oktober 2026 lagen die Angebote über ${DE.eur(P.thg.markt_ohne_bonus_ab_eur)}. Die Befreiung von der Kfz-Steuer gilt kraft Gesetzes für jedes Elektroauto. Ausgeschlossen ist dagegen eine zweite öffentliche Förderung für dasselbe Fahrzeug, etwa aus einem Landes- oder Kommunalprogramm, es sei denn, eine Verwaltungsvereinbarung mit dem Bundesumweltministerium sieht die Kombination ausdrücklich vor. Auch eine vergleichbare Förderung eines anderen EU-Staates schließt die deutsche aus. Für einen VW ID.3 mit ${DE.eur(LP)} Listenpreis ergibt sich bei ${DE.eur(55000)} Haushaltseinkommen und einem Kind eine Förderung von ${DE.eur(b(55000, 1))}; mit einem Rabatt von ${DE.eur(HERST)} sinkt der Preis auf ${DE.eur(nettopreis(LP - HERST, b(55000, 1)))}.`,
    faqs: [
      { q: 'Darf ich die Herstellerprämie und die E-Auto-Förderung zusammen nutzen?', a: 'Ja. Eine Prämie des Herstellers oder ein Nachlass des Händlers ist ein kaufmännischer Rabatt und keine öffentliche Förderung. Er senkt den Preis, berührt aber die Förderung nicht. Die Förderung des Bundes wird auch nicht gekürzt, wenn der Rabatt hoch ist; es gibt keine Preisobergrenze, und der Betrag hängt nur von Einkommen, Kindern und Antrieb ab.' },
      { q: 'Kann ich eine Förderung meines Bundeslandes zusätzlich bekommen?', a: 'Nur, wenn das ausdrücklich vorgesehen ist. Die Richtlinie schließt eine Kumulierung mit anderen öffentlichen Förderungen für dasselbe Fahrzeug aus, es sei denn, eine Verwaltungsvereinbarung mit dem Bundesumweltministerium erlaubt sie. Ob ein Land oder eine Stadt eine solche Vereinbarung hat, steht in den Bedingungen des jeweiligen Programms. Ohne diesen Hinweis gilt: entweder Bund oder Land.' },
      { q: 'Schließt die THG-Prämie die E-Auto-Förderung aus?', a: 'Nein. Die THG-Prämie ist keine öffentliche Förderung, sondern der Erlös aus dem Verkauf Ihrer Treibhausgasquote an ein Unternehmen. Sie kommt jedes Jahr zusätzlich zur einmaligen Förderung. Beide haben unterschiedliche Grundlagen: die Förderrichtlinie aus dem Bundeshaushalt und die 38. Bundes-Immissionsschutzverordnung für die Quote.' },
      { q: 'Wird die Förderung gekürzt, wenn der Händler einen großen Rabatt gibt?', a: `Nein. Die Förderung ist ein fester Betrag aus der Tabelle der Richtlinie, zwischen ${DE.eur(F.bev[2][0])} und ${DE.eur(F.bev[0][2])} beim Elektroauto. Sie hängt nicht vom Kaufpreis ab und wird nicht anteilig gekürzt, wenn der Preis sinkt. Ein Rabatt kann allerdings Bedingungen haben, etwa eine Mindestlaufzeit beim Leasing; prüfen Sie, ob diese zur Haltedauer passen.` },
      { q: 'Kann ich Kaufförderung und Wallbox-Zuschuss kombinieren?', a: 'Die Förderung für Ladeinfrastruktur in Mehrparteienhäusern betrifft das Gebäude, nicht das Auto, und wird von Eigentümergemeinschaften oder Vermietern beantragt. Sie ist deshalb keine zweite Förderung für dasselbe Fahrzeug. Für die Wallbox am Einfamilienhaus gibt es 2026 keinen Bundeszuschuss, sodass sich die Frage dort nicht stellt.' },
    ],
    body: (h) => `
<h2>Vier Vorteile, vier Grundlagen</h2>
${h.table(['Vorteil', 'Wer zahlt', 'Grundlage', 'Mit der Förderung kombinierbar'], [
  ['E-Auto-Förderung', 'Bund, über das BAFA', 'Förderrichtlinie', 'Ausgangspunkt'],
  ['Hersteller- oder Händlerrabatt', 'Hersteller oder Händler', 'Kaufvertrag', 'ja'],
  ['THG-Prämie', 'Anbieter, aus dem Quotenhandel', '38. BImSchV, Marktpreis', 'ja'],
  ['Befreiung von der Kfz-Steuer', 'niemand, es entfällt eine Steuer', 'Kraftfahrzeugsteuergesetz', 'ja'],
  ['Förderprogramm eines Landes oder einer Stadt', 'Land oder Kommune', 'eigenes Programm', 'nur mit Verwaltungsvereinbarung'],
  ['Kaufprämie eines anderen EU-Staates', 'anderer Staat', 'dortiges Programm', 'nein'],
], 'Was sich mit der E-Auto-Förderung verbinden lässt', ['l', 'l', 'l', 'l'])}
<p>Die Regel steht in der ${h.src('richtlinie', 'Förderrichtlinie')}: Für dasselbe Fahrzeug darf keine andere öffentliche Förderung in Anspruch genommen werden, es sei denn, eine Verwaltungsvereinbarung mit dem ${h.src('bmukn', 'Bundesumweltministerium')} sieht das vor. „Öffentlich“ ist das Schlüsselwort. Ein Rabatt eines Unternehmens ist keine öffentliche Förderung, ein Zuschuss einer Stadt dagegen schon.</p>
<h2>Herstellerprämien</h2>
<p>Viele Hersteller werben 2026 mit eigenen Prämien, die oft ähnlich klingen wie die staatliche Förderung. Volkswagen nannte am Tag unserer Preisrecherche auf seiner Website eine „ID. Kaufprämie“ von bis zu ${h.eur(HERST)}. Solche Prämien sind Preisnachlässe des Herstellers und werden vom Händler im Kaufvertrag abgezogen. Die staatliche Förderung zahlt dagegen das BAFA nach der Zulassung auf Ihr Konto. Wer beides bekommt, sieht den Rabatt im Vertrag und die Förderung Wochen später auf dem Kontoauszug. Die Bedingungen einer Herstellerprämie legt allein der Hersteller fest; manche gelten nur für bestimmte Versionen, Lagerfahrzeuge oder Finanzierungen.</p>
<h2>Rechenbeispiel mit einem VW ID.3</h2>
<p>Der Listenpreis des ${h.a('vw-id3', 'VW ID.3')} in der Einstiegsversion lag laut Preisliste des Herstellers bei ${h.eur(LP)}. Die Tabelle rechnet für drei Haushalte mit einem Rabatt in Höhe der beworbenen Höchstprämie und der THG-Prämie über drei Jahre zum Marktwert vom Oktober.</p>
${h.table(['Haushalt', 'Förderung', 'Preis nach Rabatt', 'Nach Förderung', 'Dazu THG in drei Jahren'], hh.map(([zv, k]) => [`${h.eur(zv)}, ${k} Kinder`, h.eur(b(zv, k)), h.eur(LP - HERST), h.eur(nettopreis(LP - HERST, b(zv, k))), h.eur(thg3)]), 'VW ID.3 Neo: Listenpreis, Rabatt, Förderung und Quote', ['l', 'r', 'r', 'r', 'r'])}
<p>Ob der volle Rabatt für ein bestimmtes Auto gilt, entscheidet der Hersteller; die Tabelle nimmt den beworbenen Höchstwert an und ist deshalb ein günstiger Fall. Die THG-Prämie ist ein Marktpreis, der sich jedes Jahr ändern kann. Der Mini-Rechner oben lässt Sie Listenpreis, Rabatt und Einkommen frei eingeben.</p>
<h2>Wann welches Geld kommt</h2>
<p>Die Vorteile kommen zu sehr verschiedenen Zeitpunkten, und das ist für die Finanzierung wichtig. Der Rabatt des Herstellers oder Händlers wirkt sofort, weil er den Kaufpreis im Vertrag senkt. Die staatliche Förderung kommt erst nach der Zulassung, nach dem Antrag und nach dem Zuwendungsbescheid, also oft einige Wochen oder Monate nach der Übergabe. Die THG-Prämie gibt es einmal im Jahr, meist ein paar Wochen nach der Bescheinigung durch das Umweltbundesamt. Die Befreiung von der Kfz-Steuer merkt man gar nicht als Zahlung, sondern nur daran, dass kein Steuerbescheid mit einem Betrag kommt. Wer den Kauf mit einem Kredit finanziert, muss die Förderung also zunächst vorstrecken. Eine Sondertilgung nach der Auszahlung ist bei vielen Krediten möglich; ob sie kostenlos ist, steht im Kreditvertrag und nicht in den Regeln der Förderung.</p>
<h2>Fallen in Angeboten mit Prämie</h2>
<ul>
<li><strong>Die Förderung ist schon eingerechnet:</strong> Manche Angebote nennen einen Preis „nach Förderung“. Das BAFA zahlt aber an Sie, und nur, wenn Ihr Einkommen passt. Fragen Sie, was passiert, wenn die Förderung nicht bewilligt wird.</li>
<li><strong>Der Rabatt gilt nur für Lagerfahrzeuge:</strong> Prüfen Sie, ob ein Lagerfahrzeug schon zugelassen war. Eine Tageszulassung bekommt keine Förderung.</li>
<li><strong>Der Rabatt verlangt eine Finanzierung:</strong> Dann zählen die Kosten des Kredits mit. Die Förderung selbst hängt nicht davon ab, wie Sie bezahlen.</li>
<li><strong>Der Leasingrabatt gilt nur für kurze Laufzeiten:</strong> Ein Vertrag unter ${h.P.foerderung.haltedauer_monate} Monaten erfüllt die Haltedauer nicht ohne Verlängerung.</li>
</ul>
<h2>Länder und Kommunen</h2>
<p>Einige Länder, Städte, Landkreise und Energieversorger haben eigene Programme für Elektroautos, Lastenräder oder Ladepunkte. Für das Auto selbst gilt: Eine öffentliche Förderung eines Landes oder einer Kommune für dasselbe Fahrzeug schließt die Bundesförderung aus, es sei denn, eine Verwaltungsvereinbarung mit dem Bundesumweltministerium erlaubt die Kombination. Programme von Stadtwerken, die als Unternehmen handeln, sind ein Grenzfall; entscheidend ist, ob der Zuschuss aus öffentlichen Mitteln stammt. Diese Seite nennt keine Beträge solcher Programme, weil sie häufig wechseln und nur auf den Seiten der Träger verlässlich stehen. Fragen Sie im Zweifel beim BAFA nach, bevor Sie zwei öffentliche Zuschüsse für ein Auto beantragen.</p>
<h2>Ausländische Förderungen</h2>
<p>Wer ein Auto im Ausland kauft, sollte prüfen, ob dort eine staatliche Prämie gewährt wurde, etwa automatisch beim Händler. Eine vergleichbare Förderung eines anderen EU-Mitgliedstaates für dasselbe Fahrzeug schließt die deutsche Förderung aus. Mehr zum Kauf im Ausland steht unter ${h.a('neuwagen', 'Neuwagen, Tageszulassung und Auslandskauf')}.</p>
<h2>Was nicht doppelt geht</h2>
<ul>
<li>Zwei Bundesförderungen für dieselbe Person: Jede Person bekommt die Förderung nur einmal.</li>
<li>Mehr als ${h.P.foerderung.antraege_je_haushalt} Förderungen in einem Haushalt.</li>
<li>Förderung für ein Auto, das zuvor in einem anderen Land gefördert wurde.</li>
<li>Bund und Land für dasselbe Auto ohne Verwaltungsvereinbarung.</li>
<li>Eine Förderung für ein Auto, das später ins Betriebsvermögen wechselt und dort noch einmal als Firmenwagen gefördert werden soll; während der Haltedauer ist der Wechsel ohnehin ausgeschlossen.</li>
</ul>
<h2>Was ohne Weiteres zusammen geht</h2>
<ul>
<li>Förderung und Herstellerrabatt, auch wenn beide hoch sind.</li>
<li>Förderung und jährliche ${h.a('thg-praemie', 'THG-Prämie')}.</li>
<li>Förderung und Befreiung von der Kfz-Steuer.</li>
<li>Förderung für das Auto und Zuschuss für die Ladeinfrastruktur im Mehrparteienhaus, weil sie verschiedene Dinge fördern; siehe ${h.a('wallbox', 'Wallbox-Förderung')}.</li>
<li>Förderung bei Kauf, Finanzierung oder ${h.a('leasing', 'Leasing')}.</li>
<li>Förderung und Rabatt auf Zubehör, Wartungspakete oder Versicherung, weil das alles Preisnachlässe von Unternehmen sind.</li>
</ul>
<p>Die THG-Werte stammen aus dem Anbietervergleich von ${h.src('finanztip', 'Finanztip')} mit Stand Oktober 2026; die Förderung ist eine Zuwendung des Bundes, deren Bedingungen das ${h.src('bafaFaq', 'BAFA')} in seinen häufigen Fragen erläutert.</p>`,
  },
  en: {
    slug: 'combining-bonuses',
    nav: 'Combining bonuses',
    card: 'What can be combined with the grant: maker bonuses, the GHG quota, the tax exemption, and what cannot.',
    title: 'Combining EV bonuses in Germany 2026: maker, state, quota',
    description: 'Combining EV bonuses in Germany 2026: maker discounts, the GHG quota payout and the tax exemption add up, a second public grant for one car usually does not.',
    h1: 'Combining bonuses: what adds up and what does not',
    intro: 'Besides the federal grant, makers advertise their own bonuses, states and cities their own schemes, providers the GHG quota. Which amounts add up and where the line is.',
    resume: `Germany’s 2026 federal EV grant can be combined with several other benefits, but not all of them. A manufacturer or dealer discount is a price reduction, not public funding, and does not rule out the grant. Volkswagen, for example, advertises its own “ID. Kaufprämie” of up to ${EN.eur(HERST)}, which has nothing to do with the federal grant. The GHG quota payout (THG-Prämie) is a market income that comes on top every year; in October 2026 offers were above ${EN.eur(P.thg.markt_ohne_bonus_ab_eur)}. The vehicle tax exemption applies by law to every electric car. What is excluded is a second public grant for the same vehicle, for instance from a state or municipal scheme, unless an administrative agreement (Verwaltungsvereinbarung) with the Federal Environment Ministry expressly allows the combination. Comparable funding from another EU state also rules out the German grant. For a VW ID.3 with a list price of ${EN.eur(LP)}, a household on ${EN.eur(55000)} with one child gets ${EN.eur(b(55000, 1))}; with a ${EN.eur(HERST)} discount the price falls to ${EN.eur(nettopreis(LP - HERST, b(55000, 1)))}.`,
    faqs: [
      { q: 'Can I use a maker’s bonus and the EV grant together?', a: 'Yes. A manufacturer’s bonus or dealer’s discount is a commercial reduction, not public funding. It lowers the price but does not touch the grant. The federal grant is not cut if the discount is large either; there is no price cap, and the amount depends only on income, children and drive type.' },
      { q: 'Can I also get a grant from my federal state?', a: 'Only if that is expressly provided for. The guideline rules out combining with other public funding for the same vehicle unless an administrative agreement with the Federal Environment Ministry allows it. Whether a state or city has such an agreement is in that scheme’s terms. Without that, it is either federal or state.' },
      { q: 'Does the GHG quota payout rule out the EV grant?', a: 'No. The quota payout is not public funding but the proceeds of selling your greenhouse gas quota to a company. It comes every year on top of the one-off grant. The two have different bases: the funding guideline from the federal budget, and the 38th Federal Immission Control Ordinance for the quota.' },
      { q: 'Is the grant cut if the dealer gives a big discount?', a: `No. The grant is a fixed amount from the guideline’s table, between ${EN.eur(F.bev[2][0])} and ${EN.eur(F.bev[0][2])} for a battery electric car. It does not depend on the price and is not reduced pro rata if the price falls. A discount may have conditions, such as a minimum lease term; check that they fit the holding period.` },
      { q: 'Can I combine the purchase grant with a wallbox grant?', a: 'The funding for charging in apartment buildings concerns the building, not the car, and is applied for by owners’ associations or landlords. It is therefore not a second grant for the same vehicle. For a wallbox at a house there is no federal grant in 2026, so the question does not arise there.' },
    ],
    body: (h) => `
<h2>Four benefits, four bases</h2>
${h.table(['Benefit', 'Who pays', 'Basis', 'Combinable with the grant'], [
  ['Federal EV grant', 'federal government, via BAFA', 'funding guideline', 'starting point'],
  ['Maker or dealer discount', 'maker or dealer', 'purchase contract', 'yes'],
  ['GHG quota payout', 'provider, from quota trading', '38th BImSchV, market price', 'yes'],
  ['Vehicle tax exemption', 'nobody, a tax simply falls away', 'Motor Vehicle Tax Act', 'yes'],
  ['State or city scheme', 'state or municipality', 'its own scheme', 'only with an administrative agreement'],
  ['Purchase bonus from another EU state', 'other state', 'that state’s scheme', 'no'],
], 'What can be combined with the EV grant', ['l', 'l', 'l', 'l'])}
<p>The rule is in the ${h.src('richtlinie', 'funding guideline')}: no other public funding may be used for the same vehicle unless an administrative agreement with the ${h.src('bmukn', 'Federal Environment Ministry')} provides for it. “Public” is the key word. A company’s discount is not public funding; a city’s subsidy is.</p>
<h2>Maker bonuses</h2>
<p>Many makers advertise their own bonuses in 2026, often with names that sound like the federal grant. On the day of our price research, Volkswagen’s website named an “ID. Kaufprämie” of up to ${h.eur(HERST)}. Such bonuses are the maker’s price reductions and are deducted by the dealer in the contract. The federal grant, by contrast, is paid by BAFA into your account after registration. If you get both, you see the discount in the contract and the grant weeks later on your bank statement. The conditions of a maker’s bonus are set by the maker alone; some only apply to certain versions, stock cars or finance deals.</p>
<h2>Worked example with a VW ID.3</h2>
<p>The list price of the ${h.a('vw-id3', 'VW ID.3')} entry version was ${h.eur(LP)} according to the maker’s price list. The table works out three households with a discount equal to the advertised maximum bonus and the quota payout over three years at October’s market value.</p>
${h.table(['Household', 'Grant', 'Price after discount', 'After the grant', 'Plus quota over three years'], hh.map(([zv, k]) => [`${h.eur(zv)}, ${k} children`, h.eur(b(zv, k)), h.eur(LP - HERST), h.eur(nettopreis(LP - HERST, b(zv, k))), h.eur(thg3)]), 'VW ID.3 Neo: list price, discount, grant and quota', ['l', 'r', 'r', 'r', 'r'])}
<p>Whether the full discount applies to a particular car is the maker’s decision; the table assumes the advertised maximum and is therefore a favourable case. The quota payout is a market price that can change every year. The small calculator above lets you enter list price, discount and income freely.</p>
<h2>When each payment arrives</h2>
<p>The benefits arrive at very different times, which matters for financing. The discount works immediately, because it lowers the price in the contract. The federal grant only comes after registration, application and the grant notice, often weeks or months after handover. The quota payout comes once a year. The vehicle tax exemption never shows up as a payment at all. If you finance the purchase, you will have to bridge the grant at first. Many loans allow an extra repayment once the money arrives; whether that is free is set by the loan contract, not by the grant rules.</p>
<h2>Traps in offers with bonuses</h2>
<ul>
<li><strong>The grant is already built in:</strong> some offers quote a price “after the grant”. BAFA pays you, and only if your income fits. Ask what happens if it is not approved.</li>
<li><strong>The discount only applies to stock cars:</strong> check whether a stock car has already been registered. A pre-registered car gets no grant.</li>
<li><strong>The lease discount only applies to short terms:</strong> a contract under ${h.P.foerderung.haltedauer_monate} months does not meet the holding period without an extension.</li>
</ul>
<h2>States and municipalities</h2>
<p>Some states, cities, districts and energy suppliers run their own schemes for electric cars, cargo bikes or charging points. For the car itself: public funding from a state or municipality for the same vehicle rules out the federal grant, unless an administrative agreement with the Federal Environment Ministry allows the combination. Schemes from municipal utilities acting as companies are a grey area; what matters is whether the subsidy comes from public funds. This page gives no amounts for such schemes, because they change often and are only reliable on the providers’ own pages. If in doubt, ask BAFA before applying for two public subsidies for one car.</p>
<h2>Foreign grants</h2>
<p>If you buy a car abroad, check whether a state bonus was granted there, for example automatically at the dealer. Comparable funding from another EU member state for the same vehicle rules out the German grant. More on buying abroad under ${h.a('neuwagen', 'new cars only')}.</p>
<h2>What cannot be doubled</h2>
<ul>
<li>Two federal grants for the same person: each person receives the grant only once.</li>
<li>More than ${h.P.foerderung.antraege_je_haushalt} grants in one household.</li>
<li>A grant for a car already funded in another country.</li>
<li>Federal and state funding for the same car without an administrative agreement.</li>
</ul>
<h2>What simply adds up</h2>
<ul>
<li>The grant and a maker’s discount, even if both are large.</li>
<li>The grant and the yearly ${h.a('thg-praemie', 'GHG quota payout')}.</li>
<li>The grant and the vehicle tax exemption.</li>
<li>The grant for the car and the subsidy for charging infrastructure in an apartment building, because they fund different things; see ${h.a('wallbox', 'wallbox grant')}.</li>
<li>The grant whether you buy, finance or ${h.a('leasing', 'lease')}.</li>
</ul>
<p>Quota figures come from ${h.src('finanztip', 'Finanztip’s')} provider comparison as of October 2026; the grant is a federal payment whose conditions ${h.src('bafaFaq', 'BAFA')} explains in its FAQ.</p>`,
  },
});
