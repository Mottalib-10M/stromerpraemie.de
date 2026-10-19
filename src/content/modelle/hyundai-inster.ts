import { defineGuide } from '../../lib/guide-types';
import { modell, preis, netto, quote, rang, nettoTabelle, monatsTabelle, vorNach, spitze, MODELLE } from '../../lib/modell-seite';
import { betragTabelle, fristen } from '../../lib/engine/foerderung';
import { datumText, monatsName } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Hyundai Inster: Inster Select, 71 kW, 42 kWh, 24 650 €, WLTP 327 km (hyundai.com/de, Varianten und Preise, gelesen
 * 19.10.2026, „Angebot gültig bis 31.12.2026“; bestätigt durch die Preisliste als PDF). Marke Hyundai in der
 * BAFA-Statistik vom 1.10.2026: 4 988 Bewilligungen (research/fakten.md, Abschnitt 2).
 */
const F = P.foerderung;
const m = modell('hyundai-inster');
const kona = modell('hyundai-kona');
const ev2 = modell('kia-ev2');
const lp = preis(m);
const s1 = F.grenzen[0], s2 = F.grenzen[1], s3 = F.grenzen[2];
const vn = vorNach(m);
const sp = spitze(m);
/** Hyundai-Angebot laut Herstellerseite gültig bis (gelesen 19.10.2026). */
const ANGEBOT_BIS = '2026-12-31';
/** BAFA, Bewilligungen der Marke Hyundai, Stand 1.10.2026. */
const HYUNDAI = 4988;
const feld = ['citroen-e-c3', 'hyundai-inster', 'fiat-500e', 'renault-5', 'kia-ev2', 'renault-4'].map(modell);
const april = fristen('2026-04-15');

export default defineGuide({
  id: 'hyundai-inster',
  group: 'modelle',
  order: 30,
  tool: 'praemie',
  toolPreset: { modell: 'hyundai-inster' },
  related: ['foerderfaehige-modelle', 'leapmotor-t03', 'rentner', 'antrag', 'thg-praemie'],
  sources: ['bafaStatistik', 'kba', 'richtlinie', 'bafaAntrag'],
  de: {
    slug: 'hyundai-inster-foerderung',
    nav: 'Hyundai Inster',
    card: 'Was der Hyundai Inster nach der E-Auto-Förderung kostet, für wen er sich rechnet und wie er neben Renault 5 und Kia EV2 steht.',
    title: `Hyundai Inster Förderung 2026: ab ${DE.eur(netto(m, s1, 2))} nach Prämie`,
    description: `Hyundai Inster Förderung 2026: ${DE.eur(lp)} Listenpreis, nach der E-Auto-Förderung ${DE.eur(netto(m, s1, 2))} bis ${DE.eur(netto(m, s3, 0))}, mit ${DE.num(m.reichweite as number)} km Reichweite. Rechnung für Ihren Haushalt.`,
    h1: 'Hyundai Inster: Preis nach der E-Auto-Förderung 2026',
    intro: 'Der Rechner ist auf den Hyundai Inster eingestellt. Mit Ihrem Einkommen und Ihren Kindern rechnet er den Preis nach der Förderung aus.',
    resume: `Der Hyundai Inster ist ein kleines, hohes Stadtauto, das Hyundai als ${m.version?.de} für ${DE.eur(lp)} anbietet, mit bis zu ${DE.num(m.reichweite as number)} km Reichweite nach WLTP. Hyundai nennt dieses Angebot gültig bis zum ${datumText(ANGEBOT_BIS, 'de')}. Mit der E-Auto-Förderung kostet der Inster einen Haushalt ohne Kind und mit höchstens ${DE.eur(s1)} zu versteuerndem Einkommen ${DE.eur(netto(m, s1, 0))}, mit zwei Kindern ${DE.eur(netto(m, s1, 2))}. In der zweiten Stufe bis ${DE.eur(s2)} sind es ohne Kind ${DE.eur(netto(m, s2, 0))}, in der dritten bis ${DE.eur(s3)} ${DE.eur(netto(m, s3, 0))}. Das BAFA hat bis zum ${datumText(MODELLE.bafa_stand, 'de')} ${DE.num(m.bafa)} Anträge für den Inster bewilligt, Platz ${DE.num(rang(m))} unter allen Modellen und zwei Drittel aller Bewilligungen der Marke Hyundai. Auf ${DE.num(m.kba_summe)} Neuzulassungen seit Januar kommen ${DE.pct(quote(m), 1)} Bewilligungen, einer der höchsten Werte der Statistik. Anders als beim Leapmotor T03 lag die Spitze der Zulassungen schon vor dem Start der Anträge, im April.`,
    faqs: [
      { q: 'Wie viel kostet der Hyundai Inster mit Förderung?', a: `Ausgehend vom Listenpreis von ${DE.eur(lp)} für den ${m.version?.de} zwischen ${DE.eur(netto(m, s1, 2))} und ${DE.eur(netto(m, s3, 0))}. Die Spanne ergibt sich allein aus Ihrem Haushalt: Einkommensstufe und Zahl der förderrelevanten Kinder bestimmen den Betrag. Überführung und Zulassung sind im Listenpreis nicht enthalten. Liegt Ihr Einkommen über der Grenze, gibt es keine Förderung.` },
      { q: 'Ich habe meinen Inster schon im Frühjahr gekauft. Bekomme ich die Förderung noch?', a: `Ja, wenn er ab dem ${datumText(F.erstzulassung_ab, 'de')} erstmals zugelassen wurde und Ihr Haushalt die Bedingungen erfüllt. Die Frist für den Antrag beträgt ${DE.num(F.antragsfrist_monate)} Monate ab Zulassung. Ein Inster, der am 15. April zugelassen wurde, kann also bis zum ${datumText(april.antragBis, 'de')} beantragt werden. Danach ist die Förderung verloren.` },
      { q: 'Was passiert mit der Förderung, wenn Hyundai den Preis des Inster ändert?', a: `Nichts. Der Förderbetrag hängt nicht vom Kaufpreis ab, sondern nur von Einkommen, Kindern und Antriebsart. Hyundai nennt den aktuellen Preis gültig bis zum ${datumText(ANGEBOT_BIS, 'de')}; ein späterer Preis kann höher oder niedriger sein. Entscheidend für Ihre Rechnung ist der Preis in Ihrem Kaufvertrag, von dem Sie den Betrag der Förderung abziehen.` },
      { q: 'Ist der Inster oder der Kia EV2 mit Förderung günstiger?', a: `Nach Listenpreis der Inster: ${DE.eur(lp)} gegen ${DE.eur(preis(ev2))} für den ${ev2.version?.de}. Die Förderung ist für beide gleich, der Abstand von ${DE.eur(preis(ev2) - lp)} bleibt. Beide haben eine Batterie von rund ${DE.num(m.batterie as number)} kWh und eine ähnliche Reichweite. Den Ausschlag geben Platz, Ausstattung und das Angebot des Händlers, nicht die staatliche Förderung.` },
      { q: 'Kann ein Paar zwei Elektroautos fördern lassen, etwa einen Inster als Zweitwagen?', a: `Ja. Die Richtlinie erlaubt ${DE.num(F.antraege_je_haushalt)} Anträge je Haushalt und ${DE.num(F.antrag_je_person)} je Person. Ein Paar kann also für zwei Autos je einen Antrag stellen, jeder für das Auto, auf das er als Halter eingetragen ist. Für beide Anträge zählt dasselbe Haushaltseinkommen, und für beide gilt die Haltedauer von ${DE.num(F.haltedauer_monate)} Monaten.` },
    ],
    body: (h) => `
<h2>Der Inster nach der Förderung</h2>
<p>Die Tabelle zieht jeden Betrag der Richtlinie vom Listenpreis von ${h.eur(lp)} ab. Gerechnet wird mit dem zu versteuernden Einkommen des Haushalts, gemittelt über die beiden letzten Steuerbescheide jeder erwachsenen Person.</p>
${nettoTabelle(h, m)}
<p>Drei Haushalte als Beispiel. Eine alleinstehende Rentnerin mit ${h.eur(28000)} zu versteuerndem Einkommen zahlt ${h.eur(netto(m, 28000, 0))}; wie Renten zählen und was ohne Steuerbescheid gilt, steht unter ${h.a('rentner', 'Rentner')}. Ein Paar mit einem Kind und ${h.eur(64000)} liegt in der dritten Stufe und zahlt ${h.eur(netto(m, 64000, 1))}. Ein Paar ohne Kind mit ${h.eur(81000)} liegt knapp über der Grundgrenze von ${h.eur(F.obergrenze_basis)} und bekommt nichts: Für dieses Paar bleibt es bei ${h.eur(lp)}.</p>
<p>Gerade das letzte Beispiel zeigt, wie hart die Grenze wirkt. Ein Euro über ${h.eur(F.obergrenze_basis)} ohne Kind kostet beim Inster die volle Förderung von ${h.eur(betragTabelle(s3, 0, 'bev'))}. Weil der Durchschnitt zweier Bescheide zählt, kann ein Jahr mit Kurzarbeit, Elternzeit oder Teilzeit den Ausschlag geben. Die Einzelheiten stehen unter ${h.a('einkommensgrenze', 'Einkommensgrenze')}.</p>
<h2>Zulassungen: die Spitze lag vor dem Start</h2>
${monatsTabelle(h, m)}
<p>Der Inster verhält sich anders als die meisten Kleinwagen. Die meisten Neuzulassungen gab es im ${monatsName(sp.monat, 'de')} mit ${h.num(sp.wert)}, also bevor das BAFA im Mai die Anträge öffnete. Von Januar bis April waren es im Schnitt ${h.num(vn.vor)} im Monat, von Juni bis September ${h.num(vn.nach)}. Eine mögliche Erklärung: Die Förderung gilt rückwirkend für Zulassungen ab dem ${h.date(F.erstzulassung_ab)}. Wer im Frühjahr kaufte, verlor also nichts und konnte den Antrag später stellen. Die Statistik der Bewilligungen spricht dafür, dass viele das getan haben.</p>
<h2>Die Förderung für einen Kauf aus dem Frühjahr</h2>
<p>Wer seinen Inster vor dem Start der Anträge zugelassen hat, hat noch Zeit, aber nicht unbegrenzt. Die Frist beträgt ${h.num(F.antragsfrist_monate)} Monate ab der Erstzulassung. Für eine Zulassung am ${h.date('2026-04-15')} endet sie am ${h.date(april.antragBis)}. Die Haltedauer von ${h.num(F.haltedauer_monate)} Monaten zählt ebenfalls ab der Zulassung, nicht ab dem Antrag; sie endet in diesem Beispiel am ${h.date(april.haltenBis)}. Das ${h.src('bafaAntrag', 'BAFA beschreibt')} den Antrag im Portal; welche Unterlagen Sie bereithalten, steht unter ${h.a('antrag', 'Antrag')}.</p>
<h2>Der Inster in seiner Klasse</h2>
${h.table(['Modell', 'Listenpreis', 'Batterie', 'Reichweite', `netto bis ${h.eur(s2)}, 1 Kind`, 'Verhältnis'], feld.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), x.batterie ? `${h.num(x.batterie, 1)} kWh` : 'k. A.', x.reichweite ? `${h.num(x.reichweite)} km` : 'k. A.', h.eur(netto(x, s2, 1)), h.pct(quote(x))]), 'Kleinwagen von rund 20 000 bis 28 000 Euro, Herstellerangaben gelesen am 19.10.2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Unter den Modellen dieser Gruppe mit Reichweitenangabe hat der Inster die größte Reichweite, bei einem Preis im unteren Mittelfeld. Der Citroën ë-C3 ist günstiger, kommt in der Ausstattung mit der kleineren Batterie aber nicht so weit. Der Kia EV2 stammt aus demselben Konzern und ist technisch eng verwandt. Bei den geförderten Käufen liegt der Inster vorn: Sein Verhältnis von Bewilligungen zu Zulassungen ist das höchste der Gruppe.</p>
<h2>Inster und Kona: zwei Hyundai, zwei Käufergruppen</h2>
<p>Von den ${h.num(HYUNDAI)} Bewilligungen der Marke Hyundai entfallen ${h.num(m.bafa)} auf den Inster und ${h.num(kona.bafa)} auf den größeren Kona Elektro. Bei den Zulassungen liegt der Kona mit ${h.num(kona.kba_summe)} gar nicht so weit hinter dem Inster mit ${h.num(m.kba_summe)}. Der Kona kostet als ${kona.version?.de} ${h.eur(preis(kona))} und wird häufiger als Firmenwagen oder von Haushalten über der Einkommensgrenze gekauft. Der Inster ist dagegen ein typisches Auto für Privathaushalte mit mittlerem Einkommen, also genau die Gruppe, die die Förderung erreichen soll.</p>
<h2>Der Inster als Zweitwagen</h2>
<p>Viele Haushalte denken beim Inster an einen zweiten Wagen für Stadt und Pendeln, neben einem größeren Auto für Urlaub und Familie. Für die Förderung ist das kein Problem: Ein Haushalt kann bis zu ${h.num(F.antraege_je_haushalt)} Anträge stellen, jede Person einen. Kauft die eine Partnerin den Inster und der andere Partner später ein zweites Elektroauto, bekommen beide den Betrag ihres Haushalts, sofern jeweils die Person, die den Antrag stellt, als Halter eingetragen ist. Für beide Anträge zählt dasselbe Haushaltseinkommen, gebildet aus den Bescheiden beider Partner. Liegt der Haushalt beim ersten Antrag in der zweiten Stufe und beim zweiten, ein Jahr später, wegen neuer Bescheide in der dritten, bekommt das zweite Auto entsprechend weniger; jeder Antrag wird mit den Bescheiden geprüft, die zu seinem Zeitpunkt die neuesten sind. Ein Elektroauto als Zweitwagen rechnet sich besonders, wenn es zu Hause laden kann. Was eine Wallbox kostet und welche Zuschüsse es dafür gibt, steht unter ${h.a('wallbox', 'Wallbox')}.</p>
<h2>Laufende Kosten</h2>
<p>Für ein reines Elektroauto mit Erstzulassung bis zum ${h.date(h.P.kfz.befreiung_zulassung_bis)} fällt ${h.num(h.P.kfz.befreiung_jahre)} Jahre lang keine ${h.a('kfz-steuer', 'Kfz-Steuer')} an, längstens bis zum ${h.date(h.P.kfz.befreiung_ende_spaetestens)}. Die ${h.a('thg-praemie', 'THG-Prämie')} bringt jedes Jahr Geld, nach dem Marktstand vom Oktober über ${h.eur(P.thg.markt_ohne_bonus_ab_eur)}. Beim Inster mit seinem niedrigen Preis machen diese beiden Posten über die Haltedauer einen spürbaren Teil des Kaufpreises aus. Den größten Unterschied im Alltag macht aber der Strompreis: Wer zu Hause laden kann, fährt deutlich günstiger als an öffentlichen Schnellladern.</p>
<h2>Kurz vor dem Kauf</h2>
<ul>
<li>Prüfen Sie, ob Ihr Haushalt unter der Grenze für Ihre Kinderzahl liegt, mit dem Rechner oben.</li>
<li>Lassen Sie den Inster auf sich zulassen; der Halter muss der Antragsteller sein.</li>
<li>Ein Vorführwagen oder eine Tageszulassung des Händlers ist nicht förderfähig, auch wenn der Wagen fast neu ist.</li>
<li>Stellen Sie den Antrag nach der Zulassung und vor Ablauf von ${h.num(F.antragsfrist_monate)} Monaten.</li>
</ul>`,
  },
  en: {
    slug: 'hyundai-inster-grant',
    nav: 'Hyundai Inster',
    card: 'What the Hyundai Inster costs after the German EV grant, who it suits and how it compares with the Renault 5 and Kia EV2.',
    title: `Hyundai Inster EV grant 2026: from ${EN.eur(netto(m, s1, 2))} after grant`,
    description: `Hyundai Inster EV grant 2026: ${EN.eur(lp)} list price, ${EN.eur(netto(m, s1, 2))} to ${EN.eur(netto(m, s3, 0))} after the German EV grant, ${EN.num(m.reichweite as number)} km of range. Worked out for your household’s income.`,
    h1: 'Hyundai Inster: price after the 2026 EV grant',
    intro: 'The calculator is set to the Hyundai Inster. With your income and children it works out the price after the grant.',
    resume: `The Hyundai Inster is a small, tall city car that Hyundai offers as the ${m.version?.en} for ${EN.eur(lp)}, with up to ${EN.num(m.reichweite as number)} km of WLTP range. Hyundai states that this offer is valid until ${datumText(ANGEBOT_BIS, 'en')}. With the German EV grant, the Inster costs a household with no child and taxable income of at most ${EN.eur(s1)} ${EN.eur(netto(m, s1, 0))}, with two children ${EN.eur(netto(m, s1, 2))}. In the second band up to ${EN.eur(s2)} it is ${EN.eur(netto(m, s2, 0))} without children, in the third up to ${EN.eur(s3)} ${EN.eur(netto(m, s3, 0))}. BAFA had approved ${EN.num(m.bafa)} applications for the Inster by ${datumText(MODELLE.bafa_stand, 'en')}, ${EN.num(rang(m))}th among all models and two thirds of all approvals for the Hyundai brand. Against ${EN.num(m.kba_summe)} new registrations since January there are ${EN.pct(quote(m), 1)} approvals, one of the highest figures in the statistics. Unlike the Leapmotor T03, registrations peaked before applications opened, in April.`,
    faqs: [
      { q: 'How much does the Hyundai Inster cost with the grant?', a: `Starting from the ${EN.eur(lp)} list price for the ${m.version?.en}, between ${EN.eur(netto(m, s1, 2))} and ${EN.eur(netto(m, s3, 0))}. The range comes entirely from your household: the income band and number of qualifying children set the amount. Delivery and registration are not in the list price. If your income is above the limit, there is no grant.` },
      { q: 'I bought my Inster in the spring. Can I still get the grant?', a: `Yes, if it was first registered on or after ${datumText(F.erstzulassung_ab, 'en')} and your household meets the conditions. The application deadline is ${EN.num(F.antragsfrist_monate)} months from registration. An Inster registered on 15 April can therefore be applied for until ${datumText(april.antragBis, 'en')}. After that the grant is lost.` },
      { q: 'What happens to the grant if Hyundai changes the Inster’s price?', a: `Nothing. The grant does not depend on the purchase price, only on income, children and drive type. Hyundai states the current price is valid until ${datumText(ANGEBOT_BIS, 'en')}; a later price may be higher or lower. What matters for your sums is the price in your purchase contract, from which you deduct the grant amount.` },
      { q: 'Is the Inster or the Kia EV2 cheaper with the grant?', a: `On list price, the Inster: ${EN.eur(lp)} against ${EN.eur(preis(ev2))} for the ${ev2.version?.en}. The grant is the same for both, so the gap of ${EN.eur(preis(ev2) - lp)} remains. Both have a battery of about ${EN.num(m.batterie as number)} kWh and similar range. Space, equipment and the dealer’s offer decide, not the state grant.` },
      { q: 'Can a couple have two electric cars funded, such as an Inster as a second car?', a: `Yes. The guideline allows ${EN.num(F.antraege_je_haushalt)} applications per household and ${EN.num(F.antrag_je_person)} per person. A couple can therefore make one application each for two cars, each for the car registered in their name. The same household income counts for both, and the ${EN.num(F.haltedauer_monate)}-month holding period applies to both.` },
    ],
    body: (h) => `
<h2>The Inster after the grant</h2>
<p>The table deducts each amount in the guideline from the ${h.eur(lp)} list price. The calculation uses the household’s taxable income, averaged over the last two tax assessments of each adult.</p>
${nettoTabelle(h, m)}
<p>Three households as examples. A single retired woman with taxable income of ${h.eur(28000)} pays ${h.eur(netto(m, 28000, 0))}; how pensions count and what applies without a tax assessment is under ${h.a('rentner', 'pensioners')}. A couple with one child on ${h.eur(64000)} is in the third band and pays ${h.eur(netto(m, 64000, 1))}. A couple without children on ${h.eur(81000)} is just above the basic limit of ${h.eur(F.obergrenze_basis)} and gets nothing: for them the price stays at ${h.eur(lp)}.</p>
<p>The last example shows how sharply the limit bites. One euro above ${h.eur(F.obergrenze_basis)} without children costs the full ${h.eur(betragTabelle(s3, 0, 'bev'))} grant on the Inster. Because the average of two assessments counts, a year of short-time work, parental leave or part-time work can tip the balance. The details are under ${h.a('einkommensgrenze', 'income limit')}.</p>
<h2>Registrations: the peak came before the start</h2>
${monatsTabelle(h, m)}
<p>The Inster behaves differently from most small cars. Registrations peaked in ${monatsName(sp.monat, 'en')} at ${h.num(sp.wert)}, before BAFA opened applications in May. From January to April the average was ${h.num(vn.vor)} a month, from June to September ${h.num(vn.nach)}. One possible explanation: the grant applies retroactively to registrations from ${h.date(F.erstzulassung_ab)}. Spring buyers therefore lost nothing and could apply later. The approval statistics suggest that many did.</p>
<h2>The grant for a spring purchase</h2>
<p>If you registered your Inster before applications opened, you still have time, but not unlimited time. The deadline is ${h.num(F.antragsfrist_monate)} months from first registration. For a registration on ${h.date('2026-04-15')} it ends on ${h.date(april.antragBis)}. The ${h.num(F.haltedauer_monate)}-month holding period also runs from registration, not from the application; in this example it ends on ${h.date(april.haltenBis)}. ${h.src('bafaAntrag', 'BAFA describes')} the application in its portal; which documents to have ready is under ${h.a('antrag', 'application')}.</p>
<h2>The Inster in its class</h2>
${h.table(['Model', 'List price', 'Battery', 'Range', `net to ${h.eur(s2)}, 1 child`, 'Ratio'], feld.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), x.batterie ? `${h.num(x.batterie, 1)} kWh` : 'n/a', x.reichweite ? `${h.num(x.reichweite)} km` : 'n/a', h.eur(netto(x, s2, 1)), h.pct(quote(x))]), 'Small cars from about 20,000 to 28,000 euros, manufacturer figures read on 19 October 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Among the models in this group with a range figure, the Inster goes furthest, at a price in the lower middle. The Citroën ë-C3 is cheaper but, in the trim with the smaller battery, does not go as far. The Kia EV2 comes from the same group and is technically closely related. On funded purchases the Inster leads: its ratio of approvals to registrations is the highest in the group.</p>
<h2>Inster and Kona: two Hyundais, two kinds of buyer</h2>
<p>Of the ${h.num(HYUNDAI)} approvals for the Hyundai brand, ${h.num(m.bafa)} are for the Inster and ${h.num(kona.bafa)} for the larger Kona Electric. On registrations, the Kona at ${h.num(kona.kba_summe)} is not that far behind the Inster at ${h.num(m.kba_summe)}. The Kona costs ${h.eur(preis(kona))} as the ${kona.version?.en} and is bought more often as a company car or by households above the income limit. The Inster, by contrast, is a typical car for private households on middle incomes, exactly the group the grant is meant to reach.</p>
<h2>The Inster as a second car</h2>
<p>Many households see the Inster as a second car for town and commuting, alongside a larger car for holidays and family. That is no problem for the grant: a household can make up to ${h.num(F.antraege_je_haushalt)} applications, one per person. If one partner buys the Inster and the other later buys a second electric car, both receive their household’s amount, provided the applicant in each case is the registered keeper. The same household income counts for both, formed from both partners’ assessments. If the household is in the second band at the first application and, a year later with newer assessments, in the third, the second car gets correspondingly less; each application is checked against the assessments that are the latest at its time. An electric second car pays off especially if it can charge at home. What a wallbox costs and which subsidies exist for it is under ${h.a('wallbox', 'wallbox')}.</p>
<h2>Running costs</h2>
<p>A battery electric car first registered by ${h.date(h.P.kfz.befreiung_zulassung_bis)} pays no ${h.a('kfz-steuer', 'vehicle tax')} for ${h.num(h.P.kfz.befreiung_jahre)} years, until ${h.date(h.P.kfz.befreiung_ende_spaetestens)} at the latest. The ${h.a('thg-praemie', 'GHG quota payment')} brings money every year, over ${h.eur(P.thg.markt_ohne_bonus_ab_eur)} at October market prices. With the Inster’s low price, these two items make up a noticeable part of the purchase price over the holding period. The biggest difference in daily use, though, is the electricity price: charging at home is much cheaper than at public fast chargers.</p>
<h2>Just before buying</h2>
<ul>
<li>Check whether your household is under the limit for your number of children, with the calculator above.</li>
<li>Register the Inster in your own name; the keeper must be the applicant.</li>
<li>A dealer’s demonstrator or pre-registered car does not qualify, even if it is almost new.</li>
<li>Apply after registration and before ${h.num(F.antragsfrist_monate)} months have passed.</li>
</ul>`,
  },
});
