import { defineGuide } from '../../lib/guide-types';
import { modell, preis, netto, quote, rang, nettoTabelle, monatsTabelle, spitze, MODELLE } from '../../lib/modell-seite';
import { betragTabelle } from '../../lib/engine/foerderung';
import { befreiung } from '../../lib/engine/kfz';
import { datumText, monatsName } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Skoda Elroq: Listenpreis Elroq 60 Essence (Skoda Preis- und Ausstattungsübersicht, Stand 15.10.2026, gelesen 19.10.2026),
 * Bewilligungen je Variante aus der BAFA-Statistik vom 1.10.2026 (research/bafa/statistik-2026-10-01.txt, Abschnitt 7.3),
 * Neuzulassungen KBA FZ10 Januar bis September 2026.
 */
const F = P.foerderung;
const m = modell('skoda-elroq');
const enyaq = modell('skoda-enyaq');
const lp = preis(m);
const s1 = F.grenzen[0], s2 = F.grenzen[1], s3 = F.grenzen[2];
/** BAFA, Bewilligungen nach Modellen, Stand 1.10.2026. */
const VARIANTEN: Array<[string, number]> = [['Elroq 85', 2097], ['Elroq 60', 1567], ['Elroq 50', 1212], ['Elroq RS', 602], ['Elroq 85x', 232]];
const nachbarn = ['kia-ev3', 'ford-puma', 'kia-ev4', 'skoda-elroq', 'hyundai-kona', 'ford-explorer'].map(modell);
const sp = spitze(m);
const steuer = befreiung('2026-11-01');
const thg3 = P.thg.markt_ohne_bonus_ab_eur * 3;
const familie = netto(m, 70000, 2);

export default defineGuide({
  id: 'skoda-elroq',
  group: 'modelle',
  order: 20,
  tool: 'praemie',
  toolPreset: { modell: 'skoda-elroq' },
  related: ['foerderfaehige-modelle', 'vw-id3', 'kinder', 'leasing', 'kfz-steuer'],
  sources: ['bafaStatistik', 'kba', 'richtlinie', 'kraftstg3d'],
  de: {
    slug: 'skoda-elroq-foerderung',
    nav: 'Skoda Elroq',
    card: 'Preis des Skoda Elroq nach der E-Auto-Förderung für jede Einkommensstufe, Varianten in der Statistik, Vergleich mit dem Enyaq.',
    title: 'Skoda Elroq Förderung 2026: Preis nach Prämie je Einkommen',
    description: `Skoda Elroq Förderung 2026: ab ${DE.eur(lp)} Listenpreis, nach der E-Auto-Prämie ab ${DE.eur(netto(m, s1, 2))}. Preis für jede Einkommensstufe, dazu ${DE.num(m.bafa)} Bewilligungen beim BAFA.`,
    h1: 'Skoda Elroq: Preis nach der E-Auto-Förderung 2026',
    intro: 'Der Rechner ist auf den Skoda Elroq eingestellt. Einkommen und Kinder eingeben, und Sie sehen, was der Elroq Ihren Haushalt nach der Förderung kostet.',
    resume: `Der Skoda Elroq ist nach Bewilligungen das ${DE.num(rang(m))}. häufigste Modell der E-Auto-Förderung: ${DE.num(m.bafa)} Anträge hat das BAFA bis zum ${datumText(MODELLE.bafa_stand, 'de')} bewilligt, nur das Tesla Model Y liegt davor. Der Einstieg ist inzwischen der ${m.version?.de} mit ${DE.eur(lp)} Listenpreis und bis zu ${DE.num(m.reichweite as number)} km Reichweite nach WLTP; den Elroq 50 bietet Skoda nicht mehr an. Mit der Förderung kostet dieser Elroq einen Haushalt ohne Kind und mit höchstens ${DE.eur(s1)} zu versteuerndem Einkommen ${DE.eur(netto(m, s1, 0))}, mit zwei Kindern ${DE.eur(netto(m, s1, 2))}. In der dritten Stufe bis ${DE.eur(s3)} bleiben ohne Kind ${DE.eur(netto(m, s3, 0))}. Das Kraftfahrt-Bundesamt zählte von Januar bis September ${DE.num(m.kba_summe)} neue Elroq. Auf eine Neuzulassung kommen damit ${DE.pct(quote(m), 1)} Bewilligungen, beim größeren Enyaq sind es nur ${DE.pct(quote(enyaq), 1)}. Der Elroq wird also deutlich öfter privat und gefördert gekauft als sein großer Bruder.`,
    faqs: [
      { q: 'Wie viel Förderung gibt es für den Skoda Elroq?', a: `Das hängt nicht vom Modell ab, sondern von Ihrem Haushalt: zwischen ${DE.eur(betragTabelle(s3, 0, 'bev'))} und ${DE.eur(betragTabelle(s1, 2, 'bev'))}, je nach zu versteuerndem Einkommen und Zahl der förderrelevanten Kinder. Für den ${m.version?.de} mit ${DE.eur(lp)} Listenpreis bleiben damit ${DE.eur(netto(m, s1, 2))} bis ${DE.eur(netto(m, s3, 0))}. Jede Elroq-Variante ist förderfähig, auch der RS.` },
      { q: 'Gibt es den Skoda Elroq 50 noch?', a: `Nein, nach der Preisübersicht von Skoda mit Stand Oktober 2026 beginnt die Baureihe mit dem Elroq 60. In der BAFA-Statistik taucht der Elroq 50 trotzdem mit ${DE.num(VARIANTEN[2][1])} Bewilligungen auf: Das sind Autos, die im Lauf des Jahres zugelassen wurden, als er noch bestellbar war. Ein Elroq 50 vom Lager ist förderfähig, solange er neu ist und erstmals in Deutschland zugelassen wird.` },
      { q: 'Warum wird der Elroq öfter gefördert als der Skoda Enyaq?', a: `Der Enyaq kostet als ${enyaq.version?.de} ${DE.eur(preis(enyaq))} und wird viel als Dienstwagen gefahren; Dienstwagen sind nicht förderfähig. Auf eine Neuzulassung des Enyaq kommen deshalb nur ${DE.pct(quote(enyaq), 1)} Bewilligungen, beim Elroq ${DE.pct(quote(m), 1)}. Bei gleichem Haushalt ist die Förderung für beide Modelle gleich hoch.` },
      { q: 'Lohnt sich der Elroq 85 mit Förderung mehr als der Elroq 60?', a: `Die Förderung ist für beide gleich, sie wächst nicht mit dem Preis. Der Aufpreis für die größere Batterie bleibt also voll bei Ihnen. Dass der Elroq 85 in der Statistik mit ${DE.num(VARIANTEN[0][1])} Bewilligungen vorn liegt, zeigt nur, dass viele Käufer die größere Reichweite wollten. Ob sie sich lohnt, hängt von Ihren Strecken ab, nicht von der Förderung.` },
      { q: 'Bekomme ich die Förderung für einen Elroq, der schon im Frühjahr zugelassen wurde?', a: `Ja, wenn die Erstzulassung am oder nach dem ${datumText(F.erstzulassung_ab, 'de')} lag und die Antragsfrist von ${DE.num(F.antragsfrist_monate)} Monaten ab Zulassung noch läuft. Ein Elroq, der im März zugelassen wurde, kann also bis zum März des Folgejahres beantragt werden. Die übrigen Bedingungen gelten wie bei einem neuen Kauf: Ihr Haushalt muss unter der Grenze liegen, und das Auto muss auf Sie zugelassen sein.` },
    ],
    body: (h) => `
<h2>Was der Elroq nach der Förderung kostet</h2>
<p>Die Tabelle rechnet den Listenpreis des ${m.version?.de} von ${h.eur(lp)} gegen jeden Betrag der Richtlinie. Grundlage ist das zu versteuernde Einkommen des Haushalts, nicht das Bruttogehalt. Für eine andere Variante oder ein Angebot mit Rabatt geben Sie im Rechner oben den Preis aus dem Angebot ein.</p>
${nettoTabelle(h, m)}
<p>Zwischen dem günstigsten und dem teuersten Feld liegen ${h.eur(betragTabelle(s1, 2, 'bev') - betragTabelle(s3, 0, 'bev'))}. Ein Paar mit zwei Kindern und ${h.eur(70000)} zu versteuerndem Einkommen, für einen Wagen dieser Größe ein typischer Fall, zahlt für den Elroq ${h.eur(familie)}. Ein Single mit ${h.eur(42000)} kommt auf ${h.eur(netto(m, 42000, 0))}. Wo die Grenzen genau liegen und was knapp darüber passiert, steht unter ${h.a('einkommensgrenze', 'Einkommensgrenze')}.</p>
<h2>Welche Elroq gefördert wurden</h2>
<p>Das BAFA weist die Bewilligungen je Variante aus. Beim Elroq verteilen sie sich so:</p>
${h.table(['Variante', 'Bewilligungen', 'Anteil'], VARIANTEN.map(([v, x]) => [v, h.num(x), h.pct(x / m.bafa)]), `Skoda Elroq: Bewilligungen nach Variante, Stand ${h.date(MODELLE.bafa_stand)}`, ['l', 'r', 'r'])}
<p>Die Variante mit der größten Batterie liegt vorn, obwohl sie mehrere tausend Euro mehr kostet als der Einstieg. Für die Förderung spielt das keine Rolle: Der Betrag ist bei allen Varianten derselbe. Der Allradler 85x und der sportliche RS sind zusammen gut ein Siebtel der Bewilligungen. Auch diese teuren Ausführungen sind förderfähig, weil die Richtlinie keine Preisgrenze kennt.</p>
<h2>Elroq und Enyaq: gleiche Marke, andere Käufer</h2>
<p>Elroq und Enyaq stehen auf derselben Technik, der Enyaq ist größer und teurer. In der Zulassungsstatistik liegen sie fast gleichauf: ${h.num(m.kba_summe)} Elroq gegen ${h.num(enyaq.kba_summe)} Enyaq von Januar bis ${MODELLE.kba_bis_text.de}. Bei der Förderung trennen sie sich deutlich: ${h.num(m.bafa)} Bewilligungen beim Elroq, ${h.num(enyaq.bafa)} beim Enyaq. Die einfachste Erklärung ist der Dienstwagenmarkt. Der Enyaq ist ein beliebtes Firmenauto, und Firmenwagen fallen aus der Förderung heraus. Der Elroq erreicht mehr Privathaushalte, die unter der Einkommensgrenze liegen. Wer privat zwischen beiden schwankt, bekommt für beide denselben Betrag; der Preisabstand von ${h.eur(preis(enyaq) - lp)} zwischen den Einstiegsversionen bleibt bestehen.</p>
<h2>Der Elroq neben Autos der gleichen Preisklasse</h2>
${h.table(['Modell', 'Listenpreis', `netto bis ${h.eur(s2)}, ohne Kind`, 'Reichweite', 'Bewilligungen'], nachbarn.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), h.eur(netto(x, s2, 0)), x.reichweite ? `${h.num(x.reichweite)} km` : 'k. A.', h.num(x.bafa)]), 'Einstiegsversionen um 36 000 bis 40 000 Euro, Listenpreise gelesen am 19.10.2026', ['l', 'r', 'r', 'r', 'r'])}
<p>In diesem Feld hat der Elroq die größte Reichweite unter den Modellen mit Angabe und mit Abstand die meisten Bewilligungen. Die Förderung verschiebt die Reihenfolge nicht, weil alle Modelle denselben Betrag bekommen. Wichtiger für den Vergleich sind Ausstattung, Ladeleistung und das, was der Händler vom Listenpreis nachlässt.</p>
<h2>Familien über ${h.eur(F.obergrenze_basis)}</h2>
<p>Der Elroq ist für viele Familien das erste Elektroauto, und gerade dort entscheiden die Kinder über die Förderung. Ein Paar mit einem förderrelevanten Kind und ${h.eur(83000)} zu versteuerndem Einkommen liegt über der Grundgrenze, aber unter der Grenze von ${h.eur(F.obergrenze_basis + F.obergrenze_je_kind)} für einen Haushalt mit einem Kind. Es bekommt ${h.eur(betragTabelle(83000, 1, 'bev'))} und zahlt für den Elroq ${h.eur(netto(m, 83000, 1))}. Mit ${h.eur(88000)} und einem Kind gäbe es nichts, mit ${h.eur(88000)} und zwei Kindern dagegen ${h.eur(betragTabelle(88000, 2, 'bev'))}, der Elroq kostete dann ${h.eur(netto(m, 88000, 2))}. Wer knapp an einer Grenze liegt, sollte die beiden letzten Steuerbescheide genau ansehen; gezählt wird der Durchschnitt. Mehr dazu unter ${h.a('kinder', 'Kinderbonus')}.</p>
<p>Zur Reichweite: Skoda nennt für den Elroq 60 je nach Ausstattung 408 bis ${h.num(m.reichweite as number)} km nach WLTP, für die Essence-Ausstattung 444 bis ${h.num(m.reichweite as number)} km. Im Alltag liegt der Wert je nach Jahreszeit und Tempo darunter. Für die Förderung zählt die Reichweite nicht, anders als bei Plug-in-Hybriden.</p>
<h2>Zulassungen je Monat</h2>
${monatsTabelle(h, m)}
<p>Der Elroq ist seit Jahresbeginn gleichmäßig gefragt, zwischen gut ${h.num(3000)} und gut ${h.num(4000)} neuen Autos im Monat. Der Start der Anträge im Mai hat keinen sichtbaren Sprung ausgelöst, anders als bei einigen Kleinwagen. Die meisten Neuzulassungen gab es im ${monatsName(sp.monat, 'de')} mit ${h.num(sp.wert)}. Weil die Förderung auch für Autos gilt, die seit dem ${h.date(F.erstzulassung_ab)} zugelassen wurden, konnten Käufer aus dem Frühjahr ihren Antrag nachholen.</p>
<h2>Kosten über die Haltedauer</h2>
<p>Wer gefördert kauft, muss den Elroq ${h.num(F.haltedauer_monate)} Monate behalten. In dieser Zeit kommen zwei Posten hinzu, die den Preis weiter senken. Die ${h.a('kfz-steuer', 'Kfz-Steuer')} entfällt nach ${h.src('kraftstg3d', '§ 3d KraftStG')} bei einer Erstzulassung im November 2026 bis zum ${h.date(steuer.bis as string)}. Die ${h.a('thg-praemie', 'THG-Prämie')} bringt nach dem Marktstand vom Oktober über ${h.eur(P.thg.markt_ohne_bonus_ab_eur)} im Jahr, über drei Jahre also mindestens ${h.eur(thg3)}. Für das Paar mit zwei Kindern aus dem Beispiel oben sinkt der Elroq so rechnerisch auf ${h.eur(familie - thg3)}, bevor Strom, Versicherung und Wartung hinzukommen.</p>
<h2>Worauf Sie beim Kauf achten</h2>
<ul>
<li>Die Erstzulassung muss in Deutschland und auf Sie erfolgen; ein Elroq, den der Händler schon auf sich zugelassen hat, ist nicht förderfähig.</li>
<li>Den Antrag stellen Sie nach der Zulassung, spätestens ${h.num(F.antragsfrist_monate)} Monate danach. Mehr unter ${h.a('antrag', 'Antrag')}.</li>
<li>Beim Leasing zählt die Laufzeit; die Regeln stehen unter ${h.a('leasing', 'Leasing')}.</li>
<li>Rabatte des Händlers kürzen die staatliche Förderung nicht. Verhandeln lohnt sich also doppelt, denn jeder Euro Nachlass senkt den Preis, den Sie nach der Förderung tatsächlich tragen.</li>
<li>Heben Sie Kaufvertrag oder Leasingvertrag, Rechnung und Zulassungsbescheinigung gut auf; das BAFA kann sie noch ${h.num(F.aufbewahrung_jahre)} Jahre lang anfordern, auch lange nach der Auszahlung.</li>
</ul>`,
  },
  en: {
    slug: 'skoda-elroq-grant',
    nav: 'Skoda Elroq',
    card: 'Skoda Elroq price after the German EV grant for each income band, variants in the statistics, comparison with the Enyaq.',
    title: 'Skoda Elroq EV grant 2026: price after the grant by income',
    description: `Skoda Elroq EV grant 2026 in Germany: from ${EN.eur(lp)} list price, from ${EN.eur(netto(m, s1, 2))} after the grant. Price for every income band and ${EN.num(m.bafa)} BAFA approvals so far.`,
    h1: 'Skoda Elroq: price after the 2026 EV grant',
    intro: 'The calculator is set to the Skoda Elroq. Enter income and children to see what the Elroq costs your household after the grant.',
    resume: `By approvals, the Skoda Elroq is the number ${EN.num(rang(m))} model of the German EV grant: BAFA had approved ${EN.num(m.bafa)} applications by ${datumText(MODELLE.bafa_stand, 'en')}, with only the Tesla Model Y ahead. The entry model is now the ${m.version?.en} at ${EN.eur(lp)} list price with up to ${EN.num(m.reichweite as number)} km of WLTP range; Skoda no longer offers the Elroq 50. With the grant, this Elroq costs a household with no child and taxable income of at most ${EN.eur(s1)} ${EN.eur(netto(m, s1, 0))}, with two children ${EN.eur(netto(m, s1, 2))}. In the third band up to ${EN.eur(s3)}, ${EN.eur(netto(m, s3, 0))} remains without children. The Federal Motor Transport Authority counted ${EN.num(m.kba_summe)} new Elroq registrations from January to September. That gives ${EN.pct(quote(m), 1)} approvals per new registration, against only ${EN.pct(quote(enyaq), 1)} for the larger Enyaq. The Elroq is bought privately with the grant far more often than its big brother.`,
    faqs: [
      { q: 'How much grant is there for the Skoda Elroq?', a: `It depends on your household, not the model: between ${EN.eur(betragTabelle(s3, 0, 'bev'))} and ${EN.eur(betragTabelle(s1, 2, 'bev'))}, according to taxable income and the number of qualifying children. For the ${m.version?.en} at ${EN.eur(lp)} list price, that leaves ${EN.eur(netto(m, s1, 2))} to ${EN.eur(netto(m, s3, 0))}. Every Elroq variant qualifies, including the RS.` },
      { q: 'Is the Skoda Elroq 50 still available?', a: `No. According to Skoda’s price overview as of October 2026, the range starts with the Elroq 60. The Elroq 50 still appears in the BAFA statistics with ${EN.num(VARIANTEN[2][1])} approvals: those are cars registered during the year while it could still be ordered. An Elroq 50 from stock qualifies as long as it is new and first registered in Germany.` },
      { q: 'Why is the Elroq funded more often than the Skoda Enyaq?', a: `The Enyaq costs ${EN.eur(preis(enyaq))} as the ${enyaq.version?.en} and is widely used as a company car; company cars do not qualify. The Enyaq therefore has only ${EN.pct(quote(enyaq), 1)} approvals per new registration, the Elroq ${EN.pct(quote(m), 1)}. For the same household, the grant is the same for both models.` },
      { q: 'Is the Elroq 85 better value with the grant than the Elroq 60?', a: `The grant is the same for both; it does not grow with the price. The extra cost of the larger battery stays entirely with you. That the Elroq 85 leads the statistics with ${EN.num(VARIANTEN[0][1])} approvals only shows that many buyers wanted more range. Whether it pays off depends on your journeys, not on the grant.` },
      { q: 'Can I get the grant for an Elroq registered back in the spring?', a: `Yes, if the first registration was on or after ${datumText(F.erstzulassung_ab, 'en')} and the application deadline of ${EN.num(F.antragsfrist_monate)} months from registration has not passed. An Elroq registered in March can therefore be applied for until March of the following year. The other conditions apply as for a new purchase: your household must be under the limit and the car must be registered in your name.` },
    ],
    body: (h) => `
<h2>What the Elroq costs after the grant</h2>
<p>The table sets the list price of the ${m.version?.en}, ${h.eur(lp)}, against each amount in the guideline. The basis is the household’s taxable income, not gross salary. For another variant or a discounted offer, enter the price from your quote in the calculator above.</p>
${nettoTabelle(h, m)}
<p>Between the cheapest and the most expensive cell lie ${h.eur(betragTabelle(s1, 2, 'bev') - betragTabelle(s3, 0, 'bev'))}. A couple with two children and taxable income of ${h.eur(70000)}, a typical case for a car this size, pays ${h.eur(familie)} for the Elroq. A single person on ${h.eur(42000)} comes to ${h.eur(netto(m, 42000, 0))}. Where the limits lie and what happens just above them is under ${h.a('einkommensgrenze', 'income limit')}.</p>
<h2>Which Elroq versions were funded</h2>
<p>BAFA reports approvals by variant. For the Elroq they break down as follows:</p>
${h.table(['Variant', 'Approvals', 'Share'], VARIANTEN.map(([v, x]) => [v, h.num(x), h.pct(x / m.bafa)]), `Skoda Elroq: approvals by variant as of ${h.date(MODELLE.bafa_stand)}`, ['l', 'r', 'r'])}
<p>The variant with the largest battery leads, although it costs several thousand euros more than the entry model. That makes no difference to the grant: the amount is the same for every variant. The all-wheel-drive 85x and the sporty RS together make up just over a seventh of approvals. These expensive versions qualify too, because the guideline has no price cap.</p>
<h2>Elroq and Enyaq: same brand, different buyers</h2>
<p>The Elroq and Enyaq share the same technology; the Enyaq is larger and dearer. In the registration statistics they are almost level: ${h.num(m.kba_summe)} Elroq against ${h.num(enyaq.kba_summe)} Enyaq from January to ${MODELLE.kba_bis_text.en}. On the grant they part company: ${h.num(m.bafa)} approvals for the Elroq, ${h.num(enyaq.bafa)} for the Enyaq. The simplest explanation is the company car market. The Enyaq is a popular company car, and company cars are excluded from the grant. The Elroq reaches more private households under the income limit. If you are choosing privately between the two, you get the same amount for both; the price gap of ${h.eur(preis(enyaq) - lp)} between the entry versions remains.</p>
<h2>The Elroq next to cars in the same price range</h2>
${h.table(['Model', 'List price', `net to ${h.eur(s2)}, no child`, 'Range', 'Approvals'], nachbarn.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), h.eur(netto(x, s2, 0)), x.reichweite ? `${h.num(x.reichweite)} km` : 'n/a', h.num(x.bafa)]), 'Entry versions around 36,000 to 40,000 euros, list prices read on 19 October 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>In this group, the Elroq has the longest range among models with a figure and by far the most approvals. The grant does not change the order, because every model gets the same amount. What matters more for the comparison is equipment, charging power and how much the dealer takes off the list price.</p>
<h2>Families above ${h.eur(F.obergrenze_basis)}</h2>
<p>For many families the Elroq is their first electric car, and that is where children decide the grant. A couple with one qualifying child and taxable income of ${h.eur(83000)} is above the basic limit but below the limit of ${h.eur(F.obergrenze_basis + F.obergrenze_je_kind)} for a household with one child. They receive ${h.eur(betragTabelle(83000, 1, 'bev'))} and pay ${h.eur(netto(m, 83000, 1))} for the Elroq. With ${h.eur(88000)} and one child there would be nothing, whereas with ${h.eur(88000)} and two children the grant is ${h.eur(betragTabelle(88000, 2, 'bev'))} and the Elroq would cost ${h.eur(netto(m, 88000, 2))}. If you are close to a limit, look carefully at your last two tax assessments; it is the average that counts. More under ${h.a('kinder', 'children bonus')}.</p>
<p>On range: Skoda gives 408 to ${h.num(m.reichweite as number)} km WLTP for the Elroq 60 depending on equipment, and 444 to ${h.num(m.reichweite as number)} km for the Essence trim. In daily use the figure is lower depending on season and speed. Range does not matter for the grant, unlike with plug-in hybrids.</p>
<h2>Registrations by month</h2>
${monatsTabelle(h, m)}
<p>Demand for the Elroq has been steady since January, between just over ${h.num(3000)} and just over ${h.num(4000)} new cars a month. The opening of applications in May caused no visible jump, unlike some small cars. Registrations peaked in ${monatsName(sp.monat, 'en')} at ${h.num(sp.wert)}. Because the grant also covers cars registered since ${h.date(F.erstzulassung_ab)}, spring buyers could apply afterwards.</p>
<h2>Costs over the holding period</h2>
<p>If you buy with the grant, you must keep the Elroq for ${h.num(F.haltedauer_monate)} months. Two items lower the price further during that time. ${h.a('kfz-steuer', 'Vehicle tax')} is waived under ${h.src('kraftstg3d', 'section 3d of the Motor Vehicle Tax Act')} until ${h.date(steuer.bis as string)} for a first registration in November 2026. The ${h.a('thg-praemie', 'GHG quota payment')} brings over ${h.eur(P.thg.markt_ohne_bonus_ab_eur)} a year at October market prices, so at least ${h.eur(thg3)} over three years. For the couple with two children in the example above, the Elroq comes down on paper to ${h.eur(familie - thg3)}, before electricity, insurance and servicing.</p>
<h2>What to watch when buying</h2>
<ul>
<li>The first registration must be in Germany and in your name; an Elroq the dealer has already registered to itself does not qualify.</li>
<li>You apply after registration, at the latest ${h.num(F.antragsfrist_monate)} months afterwards. More under ${h.a('antrag', 'application')}.</li>
<li>For a lease, the term matters; the rules are under ${h.a('leasing', 'leasing')}.</li>
<li>Dealer discounts do not reduce the state grant, so negotiating pays twice: every euro off lowers the price you actually bear after the grant.</li>
<li>Keep the purchase or lease contract, the invoice and the registration certificate; BAFA can ask for them for ${h.num(F.aufbewahrung_jahre)} years, long after payment.</li>
</ul>`,
  },
});
