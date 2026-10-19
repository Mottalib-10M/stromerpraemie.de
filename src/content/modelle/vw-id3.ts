import { defineGuide } from '../../lib/guide-types';
import { modell, preis, netto, quote, rang, nettoTabelle, monatsTabelle, MODELLE } from '../../lib/modell-seite';
import { betragTabelle } from '../../lib/engine/foerderung';
import { befreiung } from '../../lib/engine/kfz';
import { datumText, monatsName } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * VW ID.3: Listenpreis ID.3 Neo, Einstieg (volkswagen.de, gelesen 19.10.2026: „Preis ab 33.995 € inkl. MwSt abzüglich
 * Volkswagen ID. Kaufprämie bis zu 4.000 €“). Die Kaufprämie ist ein Angebot des Herstellers, kein Teil der Förderung.
 * Bewilligungen je Variante: BAFA-Statistik vom 1.10.2026 (research/bafa/statistik-2026-10-01.txt, Abschnitt 7.3).
 */
const F = P.foerderung;
const m = modell('vw-id3');
const lp = preis(m);
const s1 = F.grenzen[0], s2 = F.grenzen[1], s3 = F.grenzen[2];
/** Herstellerprämie laut volkswagen.de, Höchstbetrag („bis zu“), gelesen am 19.10.2026. */
const VW_PRAEMIE = 4000;
/** BAFA, Bewilligungen nach Modellen, Stand 1.10.2026; „NEO 170kW“ und „NEO 170 KW“ zusammengefasst. */
const VARIANTEN: Array<[string, number, boolean]> = [
  ['ID.3 Pro, 150 kW', 1863, false], ['ID.3 Pure, 125 kW', 1013, false], ['ID.3 Pro S, 170 kW', 252, false],
  ['ID.3 Neo, 140 kW', 125, true], ['ID.3 GTX, 210 kW', 105, false], ['ID.3 Neo, 125 kW', 79, true],
  ['ID.3 GTX Performance, 240 kW', 64, false], ['ID.3 Neo, 170 kW', 40, true],
];
const neo = VARIANTEN.filter((v) => v[2]).reduce((s, v) => s + v[1], 0);
const vergleich = ['leapmotor-b10', 'vw-id3', 'kia-ev3', 'skoda-elroq', 'cupra-born'].map(modell);
const elroq = modell('skoda-elroq');
const tief = m.kba.indexOf(Math.min(...m.kba)) + 1;
const steuer = befreiung('2026-12-01');

export default defineGuide({
  id: 'vw-id3',
  group: 'modelle',
  order: 60,
  tool: 'praemie',
  toolPreset: { modell: 'vw-id3' },
  related: ['foerderfaehige-modelle', 'skoda-elroq', 'kumulierung', 'neuwagen', 'haltedauer'],
  sources: ['bafaStatistik', 'kba', 'richtlinie', 'bafaFaq'],
  de: {
    slug: 'vw-id3-foerderung',
    nav: 'VW ID.3',
    card: 'Preis des VW ID.3 Neo nach der E-Auto-Förderung, mit und ohne Kaufprämie von Volkswagen, und welche ID.3 gefördert wurden.',
    title: 'VW ID.3 Förderung 2026: Preis mit Staats- und VW-Prämie',
    description: `VW ID.3 Förderung 2026: ID.3 Neo ab ${DE.eur(lp)}, nach der E-Auto-Förderung ab ${DE.eur(netto(m, s1, 2))}, mit der Kaufprämie von VW noch weniger. Rechnung je Einkommensstufe.`,
    h1: 'VW ID.3: Preis nach der E-Auto-Förderung 2026',
    intro: 'Der Rechner ist auf den VW ID.3 Neo eingestellt. Mit Ihrem Einkommen und Ihren Kindern zeigt er, was nach der staatlichen Förderung vom Preis übrig bleibt.',
    resume: `Den VW ID.3 verkauft Volkswagen inzwischen als ID.3 Neo; die Einstiegsversion kostet laut Hersteller ${DE.eur(lp)}. Die staatliche E-Auto-Förderung beträgt je nach Haushalt ${DE.eur(betragTabelle(s3, 0, 'bev'))} bis ${DE.eur(betragTabelle(s1, 2, 'bev'))}. Ein Haushalt ohne Kind mit höchstens ${DE.eur(s1)} zu versteuerndem Einkommen zahlt damit ${DE.eur(netto(m, s1, 0))}, in der dritten Stufe bis ${DE.eur(s3)} ${DE.eur(netto(m, s3, 0))}. Volkswagen wirbt zusätzlich mit einer eigenen ID. Kaufprämie von bis zu ${DE.eur(VW_PRAEMIE)}; sie ist ein Rabatt des Herstellers und kürzt die staatliche Förderung nicht. Beides zusammen kann den Preis in der ersten Stufe auf ${DE.eur(netto(m, s1, 0) - VW_PRAEMIE)} senken, wenn die volle Herstellerprämie gewährt wird. In der BAFA-Statistik steht der ID.3 mit ${DE.num(m.bafa)} Bewilligungen auf Platz ${DE.num(rang(m))}. Die meisten davon betreffen noch die Versionen Pro und Pure, die neuen Neo-Varianten erst ${DE.num(neo)}. Auf eine Neuzulassung von Januar bis September kommen ${DE.pct(quote(m), 1)} Bewilligungen.`,
    faqs: [
      { q: 'Wie hoch ist die Förderung für den VW ID.3?', a: `Für jeden neuen ID.3 gilt derselbe Betrag wie für jedes andere reine Elektroauto: ${DE.eur(betragTabelle(s3, 0, 'bev'))} bis ${DE.eur(betragTabelle(s1, 2, 'bev'))}, abhängig vom zu versteuernden Haushaltseinkommen und von bis zu ${DE.num(F.max_kinder)} förderrelevanten Kindern. Ob Pure, Pro, Neo oder GTX, spielt keine Rolle. Den Betrag zahlt das BAFA nach der Zulassung auf Ihr Konto, nicht der Händler.` },
      { q: 'Kann ich die ID. Kaufprämie von Volkswagen mit der staatlichen Förderung kombinieren?', a: `Nach der Richtlinie ja: Ein Nachlass des Herstellers senkt den Kaufpreis, die staatliche Förderung bleibt gleich hoch. Volkswagen nennt die Kaufprämie mit „bis zu“ ${DE.eur(VW_PRAEMIE)}; wie viel Sie bekommen und unter welchen Bedingungen, legt Volkswagen fest, nicht das BAFA. Lassen Sie sich den Betrag im Angebot ausweisen, bevor Sie unterschreiben.` },
      { q: 'Ist ein ID.3 Pro vom Lager noch förderfähig?', a: 'Ja, wenn er neu ist und noch nie zugelassen war. Entscheidend ist die erste Zulassung, und die muss auf Sie in Deutschland erfolgen. Hat der Händler den Wagen schon auf sich zugelassen, etwa als Tageszulassung, ist er nicht mehr förderfähig. Fragen Sie bei einem günstigen Lagerwagen deshalb ausdrücklich nach, ob er bereits einen Halter hatte.' },
      { q: 'Warum ist der Anteil geförderter Käufe beim ID.3 eher klein?', a: `Auf eine Neuzulassung kommen beim ID.3 ${DE.pct(quote(m), 1)} Bewilligungen, beim Skoda Elroq ${DE.pct(quote(elroq), 1)}. Der ID.3 wird viel von Firmen, Flotten und Vermietern zugelassen, und solche Zulassungen sind nicht förderfähig. Hinzu kommen Tageszulassungen des Handels. Für einen privaten Käufer unter der Einkommensgrenze ändert das nichts an der Höhe der Förderung.` },
      { q: 'Wird auch der sportliche ID.3 GTX gefördert?', a: `Ja. Die Richtlinie kennt keine Preisgrenze und keine Leistungsgrenze, der GTX bekommt also denselben Betrag wie die Einstiegsversion. In der Statistik stehen der GTX und der GTX Performance zusammen mit ${DE.num(VARIANTEN[4][1] + VARIANTEN[6][1])} Bewilligungen. Weil der Betrag fest ist, macht er beim teureren GTX einen kleineren Teil des Preises aus als beim ID.3 Neo.` },
    ],
    body: (h) => `
<h2>Was der ID.3 Neo nach der Förderung kostet</h2>
<p>Die Tabelle setzt den Listenpreis der Einstiegsversion, ${h.eur(lp)}, gegen jeden Förderbetrag. Die Herstellerprämie ist hier noch nicht abgezogen. Wer eine besser ausgestattete Variante oder ein Angebot mit Rabatt hat, gibt den Preis im Rechner oben ein.</p>
${nettoTabelle(h, m)}
<p>Zwei Beispiele. Ein Rentnerpaar mit zusammen ${h.eur(38000)} zu versteuerndem Einkommen und ohne förderrelevante Kinder liegt in der ersten Stufe und zahlt ${h.eur(netto(m, 38000, 0))}; wie Renten in das Einkommen eingehen, steht unter ${h.a('rentner', 'Rentner')}. Eine Alleinerziehende mit einem Kind und ${h.eur(52000)} landet in der zweiten Stufe und zahlt ${h.eur(netto(m, 52000, 1))}.</p>
<h2>Staatliche Förderung und Prämie von Volkswagen</h2>
<p>Volkswagen schreibt auf seiner Modellseite den Preis „abzüglich Volkswagen ID. Kaufprämie bis zu ${h.eur(VW_PRAEMIE)}“. Diese Prämie kommt vom Hersteller und hat mit der E-Auto-Förderung nichts zu tun. Sie wird beim Kauf verrechnet, die staatliche Förderung erst nach der Zulassung ausgezahlt. Die Rechnung unten nimmt den Höchstbetrag an; ob er für Ihr Fahrzeug gilt, steht im Angebot.</p>
${h.table(['Haushalt ohne Kind', 'Listenpreis', 'Prämie VW, höchstens', 'Förderung', 'bleibt'], [s1, s2, s3].map((z) => [`bis ${h.eur(z)}`, h.eur(lp), h.eur(VW_PRAEMIE), h.eur(betragTabelle(z, 0, 'bev')), h.eur(lp - VW_PRAEMIE - betragTabelle(z, 0, 'bev'))]), 'VW ID.3 Neo, Einstiegsversion: beide Prämien zusammen', ['l', 'r', 'r', 'r', 'r'])}
<p>Wichtig ist die Reihenfolge der Zahlungen: Sie bezahlen den Preis nach Abzug der Herstellerprämie an den Händler und warten danach auf die Auszahlung des BAFA. Wer finanziert, sollte die staatliche Förderung deshalb nicht als Anzahlung einplanen. Mehr zu Rabatten, Landesprogrammen und anderen Zuschüssen unter ${h.a('kumulierung', 'Förderung kombinieren')}.</p>
<h2>Welche ID.3 gefördert wurden</h2>
${h.table(['Variante', 'Bewilligungen', 'Anteil'], VARIANTEN.map(([v, x]) => [v, h.num(x), h.pct(x / m.bafa)]), `VW ID.3: Bewilligungen nach Variante, Stand ${h.date(MODELLE.bafa_stand)}`, ['l', 'r', 'r'])}
<p>Rund vier Fünftel der Bewilligungen gehen auf die Versionen Pro und Pure, die Volkswagen nicht mehr unter diesem Namen anbietet. Die drei Neo-Varianten kommen zusammen erst auf ${h.num(neo)}. Das zeigt, wie viele ID.3 der vorigen Generation im Lauf des Jahres noch neu verkauft wurden. Solche Wagen sind förderfähig, wenn sie neu sind. Gerade bei Restbeständen ist aber Vorsicht geboten: Händler melden sie gern als Tageszulassung an, um Ziele zu erreichen, und dann fällt die Förderung weg. Die Regeln stehen unter ${h.a('neuwagen', 'Neuwagen und Tageszulassung')}.</p>
<h2>Der ID.3 neben vergleichbaren Modellen</h2>
${h.table(['Modell', 'Listenpreis', `netto bis ${h.eur(s1)}, ohne Kind`, 'Bewilligungen', 'Verhältnis'], vergleich.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), h.eur(netto(x, s1, 0)), h.num(x.bafa), h.pct(quote(x))]), 'Kompakte Elektroautos, Listenpreise gelesen am 19.10.2026', ['l', 'r', 'r', 'r', 'r'])}
<p>Der Cupra Born und der Skoda Elroq stehen auf derselben Plattform wie der ID.3. Der Born kostet als Einstieg ${h.eur(preis(modell('cupra-born')) - lp)} mehr, der Elroq ${h.eur(preis(elroq) - lp)}. Vor der Herstellerprämie ist der Leapmotor B10 das günstigste Auto der Gruppe; mit der vollen Prämie von Volkswagen liegt der ID.3 darunter. Die staatliche Förderung ist bei allen gleich und verändert den Abstand nicht.</p>
<h2>Was der Einstiegspreis enthält</h2>
<p>Volkswagen nennt neben dem Preis von ${h.eur(lp)} keine Ausstattungslinie und keine Batteriegröße. Die Angabe „bis 629 km“ auf der Modellseite gilt für die Version mit der größten Reichweite, nicht für den Einstieg. Wer vergleicht, sollte sich deshalb die genaue Version mit Batterie und Reichweite im Angebot nennen lassen. Für die Förderung ist das unerheblich, für die Kaufentscheidung nicht: Zwischen der kleinsten und der größten Batterie liegen beim ID.3 deutliche Preisunterschiede, und der Förderbetrag gleicht sie nicht aus.</p>
<h2>Kauf, Finanzierung oder Leasing</h2>
<p>Die Förderung gilt für den Kauf, auch mit Finanzierung, und für privates Leasing mit ausreichender Laufzeit. Den Antrag stellt in jedem Fall die Person, auf die der ID.3 zugelassen ist. Ob die ID. Kaufprämie von Volkswagen auch im Leasing gilt oder dort in anderer Form in die Rate eingeht, legen die Bedingungen des Herstellers fest; fragen Sie danach, bevor Sie Angebote vergleichen. Bei einer Finanzierung lohnt ein Blick auf die Schlussrate: Die staatliche Förderung kommt erst nach einigen Wochen, kann aber für eine Sondertilgung genutzt werden, wenn der Vertrag das erlaubt. Die Regeln im Einzelnen stehen unter ${h.a('leasing', 'Leasing')}.</p>
<h2>Zulassungen je Monat</h2>
${monatsTabelle(h, m)}
<p>Bis Juni kamen jeden Monat zwischen gut ${h.num(2400)} und gut ${h.num(3500)} neue ID.3 auf die Straße. Im Juli und August sanken die Zahlen deutlich, der Tiefpunkt lag im ${monatsName(tief, 'de')} mit ${h.num(m.kba[tief - 1])}. Im September ging es wieder nach oben. Die Zahlen sagen nichts über die Gründe; ein Modellwechsel wie der zum ID.3 Neo führt aber oft zu einer solchen Delle.</p>
<h2>Nach dem Kauf</h2>
<p>Für die Förderung muss der ID.3 ${h.num(F.haltedauer_monate)} Monate auf Sie zugelassen bleiben. Verkaufen Sie ihn früher, kann das BAFA die Förderung ganz oder teilweise zurückfordern; was bei Unfall, Diebstahl oder Umzug gilt, steht unter ${h.a('haltedauer', 'Haltedauer')}. Die Kfz-Steuer entfällt bei einer Erstzulassung im Dezember 2026 bis zum ${h.date(steuer.bis as string)}, und die THG-Quote können Sie jedes Jahr verkaufen. Das ${h.src('bafaFaq', 'BAFA beantwortet in seinen FAQ')} auch Sonderfälle wie den Tod des Halters oder ein Ersatzfahrzeug nach einer Wandlung.</p>
<p>Ein letzter Hinweis zur Rechnung des Händlers: Steht die Kaufprämie von Volkswagen dort als Nachlass, ist der ausgewiesene Endpreis entsprechend niedriger. Das ist unproblematisch, denn die staatliche Förderung hängt nicht vom Kaufpreis ab. Achten Sie aber darauf, dass Rechnung, Kaufvertrag und Zulassung denselben Namen tragen, sonst fragt das BAFA nach und die Auszahlung verzögert sich.</p>`,
  },
  en: {
    slug: 'vw-id3-grant',
    nav: 'VW ID.3',
    card: 'VW ID.3 Neo price after the German EV grant, with and without the Volkswagen purchase bonus, and which ID.3 versions were funded.',
    title: 'VW ID.3 EV grant 2026: price with state and VW bonus',
    description: `VW ID.3 EV grant 2026 in Germany: ID.3 Neo from ${EN.eur(lp)}, from ${EN.eur(netto(m, s1, 2))} after the grant, less again with the VW purchase bonus. Worked out for your income.`,
    h1: 'VW ID.3: price after the 2026 EV grant',
    intro: 'The calculator is set to the VW ID.3 Neo. With your income and children it shows what is left of the price after the state grant.',
    resume: `Volkswagen now sells the ID.3 as the ID.3 Neo; the entry version costs ${EN.eur(lp)} according to the manufacturer. The German state EV grant is ${EN.eur(betragTabelle(s3, 0, 'bev'))} to ${EN.eur(betragTabelle(s1, 2, 'bev'))} depending on the household. A household with no child and taxable income of at most ${EN.eur(s1)} therefore pays ${EN.eur(netto(m, s1, 0))}, in the third band up to ${EN.eur(s3)} ${EN.eur(netto(m, s3, 0))}. Volkswagen also advertises its own ID. purchase bonus of up to ${EN.eur(VW_PRAEMIE)}; it is a manufacturer discount and does not reduce the state grant. Together they can bring the price in the first band down to ${EN.eur(netto(m, s1, 0) - VW_PRAEMIE)} if the full manufacturer bonus is granted. In the BAFA statistics the ID.3 ranks ${EN.num(rang(m))}th with ${EN.num(m.bafa)} approvals. Most of these are still the Pro and Pure versions, only ${EN.num(neo)} the new Neo variants. There are ${EN.pct(quote(m), 1)} approvals per new registration from January to September.`,
    faqs: [
      { q: 'How much is the grant for the VW ID.3?', a: `Every new ID.3 gets the same amount as any other battery electric car: ${EN.eur(betragTabelle(s3, 0, 'bev'))} to ${EN.eur(betragTabelle(s1, 2, 'bev'))}, depending on household taxable income and up to ${EN.num(F.max_kinder)} qualifying children. Whether Pure, Pro, Neo or GTX makes no difference. BAFA pays the amount into your account after registration; the dealer does not.` },
      { q: 'Can I combine the Volkswagen ID. purchase bonus with the state grant?', a: `Under the guideline, yes: a manufacturer discount lowers the purchase price and the state grant stays the same. Volkswagen describes the bonus as “up to” ${EN.eur(VW_PRAEMIE)}; how much you get and on what conditions is decided by Volkswagen, not BAFA. Have the amount shown in the quote before you sign.` },
      { q: 'Does an ID.3 Pro from dealer stock still qualify?', a: 'Yes, if it is new and has never been registered. What counts is the first registration, which must be in your name in Germany. If the dealer has already registered the car to itself, for instance as a pre-registration, it no longer qualifies. With a cheap stock car, ask explicitly whether it has already had a registered keeper.' },
      { q: 'Why is the share of funded purchases fairly low for the ID.3?', a: `The ID.3 has ${EN.pct(quote(m), 1)} approvals per new registration, the Skoda Elroq ${EN.pct(quote(elroq), 1)}. The ID.3 is registered a lot by companies, fleets and rental firms, and such registrations do not qualify. Dealer pre-registrations add to that. For a private buyer under the income limit, none of this changes the grant amount.` },
      { q: 'Does the sporty ID.3 GTX qualify too?', a: `Yes. The guideline has no price limit and no power limit, so the GTX gets the same amount as the entry version. In the statistics, the GTX and GTX Performance together have ${EN.num(VARIANTEN[4][1] + VARIANTEN[6][1])} approvals. Because the amount is fixed, it is a smaller share of the price on the dearer GTX than on the ID.3 Neo.` },
    ],
    body: (h) => `
<h2>What the ID.3 Neo costs after the grant</h2>
<p>The table sets the entry version’s list price, ${h.eur(lp)}, against each grant amount. The manufacturer bonus is not deducted here yet. If you have a better-equipped variant or a discounted offer, enter the price in the calculator above.</p>
${nettoTabelle(h, m)}
<p>Two examples. A retired couple with joint taxable income of ${h.eur(38000)} and no qualifying children is in the first band and pays ${h.eur(netto(m, 38000, 0))}; how pensions count towards income is under ${h.a('rentner', 'pensioners')}. A single parent with one child on ${h.eur(52000)} lands in the second band and pays ${h.eur(netto(m, 52000, 1))}.</p>
<h2>State grant and Volkswagen bonus</h2>
<p>Volkswagen’s model page shows the price “less Volkswagen ID. purchase bonus of up to ${h.eur(VW_PRAEMIE)}”. This bonus comes from the manufacturer and has nothing to do with the EV grant. It is settled at purchase, while the state grant is paid only after registration. The calculation below assumes the maximum; whether it applies to your car is shown in the quote.</p>
${h.table(['Household, no child', 'List price', 'VW bonus, at most', 'Grant', 'Remains'], [s1, s2, s3].map((z) => [`to ${h.eur(z)}`, h.eur(lp), h.eur(VW_PRAEMIE), h.eur(betragTabelle(z, 0, 'bev')), h.eur(lp - VW_PRAEMIE - betragTabelle(z, 0, 'bev'))]), 'VW ID.3 Neo entry version: both bonuses together', ['l', 'r', 'r', 'r', 'r'])}
<p>The order of payments matters: you pay the dealer the price after the manufacturer bonus and then wait for BAFA’s payment. If you finance the car, do not plan the state grant as a down payment. More on discounts, state programmes and other subsidies under ${h.a('kumulierung', 'combining grants')}.</p>
<h2>Which ID.3 versions were funded</h2>
${h.table(['Variant', 'Approvals', 'Share'], VARIANTEN.map(([v, x]) => [v, h.num(x), h.pct(x / m.bafa)]), `VW ID.3: approvals by variant as of ${h.date(MODELLE.bafa_stand)}`, ['l', 'r', 'r'])}
<p>About four fifths of approvals are for the Pro and Pure versions, which Volkswagen no longer sells under those names. The three Neo variants together reach only ${h.num(neo)}. That shows how many previous-generation ID.3 cars were still sold new during the year. Such cars qualify if they are new. With run-out stock, though, take care: dealers like to register them as pre-registrations to meet targets, and then the grant is lost. The rules are under ${h.a('neuwagen', 'new cars and pre-registration')}.</p>
<h2>The ID.3 next to comparable models</h2>
${h.table(['Model', 'List price', `net to ${h.eur(s1)}, no child`, 'Approvals', 'Ratio'], vergleich.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), h.eur(netto(x, s1, 0)), h.num(x.bafa), h.pct(quote(x))]), 'Compact electric cars, list prices read on 19 October 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>The Cupra Born and the Skoda Elroq use the same platform as the ID.3. The Born costs ${h.eur(preis(modell('cupra-born')) - lp)} more as an entry model, the Elroq ${h.eur(preis(elroq) - lp)}. Before the manufacturer bonus, the Leapmotor B10 is the cheapest car in the group; with Volkswagen’s full bonus the ID.3 comes in below it. The state grant is the same for all and does not change the gaps.</p>
<h2>What the entry price includes</h2>
<p>Next to the ${h.eur(lp)} price, Volkswagen names no trim level and no battery size. The figure “up to 629 km” on the model page applies to the version with the longest range, not the entry model. If you compare, ask for the exact version with battery and range in the quote. It makes no difference to the grant, but it does to the decision: between the smallest and largest battery the ID.3 has clear price differences, and the grant does not offset them.</p>
<h2>Purchase, finance or lease</h2>
<p>The grant applies to a purchase, including with finance, and to a private lease with a sufficient term. In every case, the person the ID.3 is registered to makes the application. Whether Volkswagen’s ID. purchase bonus also applies to a lease, or enters the monthly rate in another form, is set by the manufacturer’s terms; ask before you compare offers. With finance, look at the final instalment: the state grant arrives only after a few weeks, but it can be used for an early repayment if the contract allows. The detailed rules are under ${h.a('leasing', 'leasing')}.</p>
<h2>Registrations by month</h2>
${monatsTabelle(h, m)}
<p>Up to June, between just over ${h.num(2400)} and just over ${h.num(3500)} new ID.3 cars reached the road each month. In July and August the figures fell clearly, with the low in ${monatsName(tief, 'en')} at ${h.num(m.kba[tief - 1])}. In September they rose again. The figures say nothing about the reasons, but a model change such as the switch to the ID.3 Neo often causes a dip like this.</p>
<h2>After the purchase</h2>
<p>For the grant, the ID.3 must stay registered to you for ${h.num(F.haltedauer_monate)} months. If you sell it earlier, BAFA can reclaim all or part of the grant; what applies after an accident, theft or a move is under ${h.a('haltedauer', 'holding period')}. Vehicle tax is waived until ${h.date(steuer.bis as string)} for a first registration in December 2026, and you can sell the GHG quota every year. ${h.src('bafaFaq', 'BAFA’s FAQ')} also cover special cases such as the keeper’s death or a replacement car after a contract is rescinded.</p>
<p>A last note on the dealer’s invoice: if the Volkswagen bonus appears there as a discount, the final price shown is lower accordingly. That is no problem, because the state grant does not depend on the purchase price. Do make sure the invoice, purchase contract and registration carry the same name, otherwise BAFA will ask and payment will be delayed.</p>`,
  },
});
