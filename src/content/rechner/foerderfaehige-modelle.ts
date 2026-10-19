import { defineGuide } from '../../lib/guide-types';
import { MODELLE as M, mitPreis, netto, quote, preis } from '../../lib/modell-seite';
import { betragTabelle } from '../../lib/engine/foerderung';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Förderfähige Modelle: alle Modelle aus modelle.json mit Listenpreis des Herstellers (gelesen am 19.10.2026),
 * Nettopreis in der ersten und dritten Einkommensstufe, Bewilligungen (BAFA) und Neuzulassungen (KBA FZ10).
 * Das BAFA veröffentlicht keine Modellliste; förderfähig ist jedes neue Fahrzeug, das die Bedingungen erfüllt.
 */
const F = P.foerderung;
const liste = mitPreis();
const billig = liste[0];
const teuer = liste[liste.length - 1];
const ohnePreis = M.modelle.filter((m) => !m.preis);
const s1 = F.grenzen[0], s3 = F.grenzen[2];
const max = betragTabelle(s1, F.max_kinder, 'bev');
const min = betragTabelle(s3, 0, 'bev');
const unter20 = liste.filter((m) => netto(m, s1, 0) < 20000);
const gelesen = M.preise_gelesen;
const zeile = (h: { eur: (n: number) => string; num: (n: number) => string; pct: (x: number) => string }, m: (typeof liste)[number]) =>
  [`${m.marke} ${m.name}`, h.eur(preis(m)), h.eur(netto(m, s1, 0)), h.eur(netto(m, s3, 0)), h.num(m.bafa), h.pct(quote(m))];

export default defineGuide({
  id: 'foerderfaehige-modelle',
  group: 'modelle',
  order: 10,
  tool: 'modelle',
  related: ['skoda-elroq', 'leapmotor-t03', 'dacia-spring', 'plug-in-hybrid', 'statistik', 'home'],
  sources: ['richtlinie', 'bafaVoraussetzungen', 'bafaStatistik', 'kba'],
  de: {
    slug: 'foerderfaehige-modelle',
    nav: 'Förderfähige Modelle',
    card: 'Alle gängigen Elektroautos mit Listenpreis, Preis nach Förderung für Ihr Einkommen, Bewilligungen und Zulassungen.',
    title: 'Förderfähige E-Autos 2026: Liste mit Preis nach Förderung',
    description: `Förderfähige E-Autos 2026: ${liste.length} Modelle mit Listenpreis und Preis nach Förderung für Ihr Einkommen, dazu Bewilligungen des BAFA und Neuzulassungen des KBA.`,
    h1: 'Förderfähige Elektroautos 2026: Preis nach Förderung je Modell',
    intro: 'Haushaltseinkommen und Kinder eingeben: Die Liste rechnet für jedes Modell den Preis nach der E-Auto-Förderung aus und sortiert nach dem, was Ihnen bleibt.',
    resume: `Eine amtliche Liste förderfähiger Elektroautos gibt es nicht: Das BAFA fördert jedes neue Fahrzeug der Klasse M1, das die Bedingungen der Richtlinie erfüllt, ohne Preisgrenze und ohne Vorgabe zum Herstellerland. Reine Elektroautos und Brennstoffzellenautos sind förderfähig, wenn sie zwischen dem ${datumText(F.erstzulassung_ab, 'de')} und dem ${datumText(F.bev_erstzulassung_bis, 'de')} in Deutschland erstmals zugelassen werden; Plug-in-Hybride und Range Extender bis zum ${datumText(F.phev_erstzulassung_bis, 'de')}, und nur mit höchstens ${F.phev_co2_max_g_km} g CO2 je km oder mindestens ${F.phev_reichweite_min_km} km elektrischer Reichweite. Diese Seite führt ${liste.length} Modelle mit dem Listenpreis des Herstellers, gelesen am ${datumText(gelesen, 'de')}. Am günstigsten nach Förderung ist der ${billig.marke} ${billig.name}: ${DE.eur(preis(billig))} Listenpreis, in der ersten Einkommensstufe ohne Kind ${DE.eur(netto(billig, s1, 0))}. Mit zwei Kindern und höchstens ${DE.eur(s1)} Einkommen beträgt die Förderung ${DE.eur(max)}, in der dritten Stufe ohne Kind ${DE.eur(min)}. ${unter20.length} Modelle kosten in der ersten Stufe ohne Kind weniger als ${DE.eur(20000)}.`,
    faqs: [
      { q: 'Gibt es eine offizielle Liste der förderfähigen Elektroautos?', a: 'Nein. Das BAFA veröffentlicht keine Modellliste, wie es sie beim früheren Umweltbonus gab. Förderfähig ist jedes neue Fahrzeug der Klasse M1, das die Bedingungen erfüllt: Antriebsart, Zeitraum der Erstzulassung in Deutschland und bei Hybriden die Werte für CO2 oder elektrische Reichweite. Listen im Netz sind deshalb Zusammenstellungen, keine amtlichen Verzeichnisse.' },
      { q: 'Welches Elektroauto ist nach der Förderung am günstigsten?', a: `In dieser Liste ist es der ${billig.marke} ${billig.name} in der Ausstattung ${billig.version?.de} mit ${DE.eur(preis(billig))} Listenpreis. In der ersten Einkommensstufe ohne Kind bleiben ${DE.eur(netto(billig, s1, 0))}, mit zwei Kindern ${DE.eur(netto(billig, s1, F.max_kinder))}. Überführungskosten, Zulassung und Rabatte des Händlers sind nicht eingerechnet und ändern das Ergebnis im Einzelfall.` },
      { q: 'Gibt es eine Preisobergrenze für förderfähige Elektroautos?', a: `Nein. Die Richtlinie begrenzt das Einkommen des Haushalts, nicht den Preis des Autos. Auch der ${teuer.marke} ${teuer.name} mit ${DE.eur(preis(teuer))} Listenpreis ist förderfähig, wenn der Haushalt unter der Grenze liegt. In der Praxis fällt die Förderung bei teuren Modellen anteilig kleiner aus, weil der Betrag fest ist und nicht mit dem Preis wächst.` },
      { q: 'Warum fehlt bei manchen Modellen der Preis?', a: `Bei ${ohnePreis.length} Modellen der Statistik, darunter Tesla, konnte kein Listenpreis zuverlässig von der Herstellerseite gelesen werden. Statt einen Preis zu schätzen, zeigt diese Seite dort nur Bewilligungen und Zulassungen. Den Preis nach Förderung rechnen Sie im Förderrechner mit dem Angebot Ihres Händlers aus; das Ergebnis ist genauer als jeder Listenpreis.` },
    ],
    body: (h) => `
<h2>Was ein Modell förderfähig macht</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} nennt keine Modelle, sondern Bedingungen. Erfüllt ein Fahrzeug sie, ist es förderfähig, gleich von welchem Hersteller und zu welchem Preis. Das ${h.src('bafaVoraussetzungen', 'BAFA fasst sie zusammen')}:</p>
<ul>
<li>Neufahrzeug der Klasse M1, also ein Pkw, gekauft oder privat geleast.</li>
<li>Reines Elektroauto oder Brennstoffzellenauto mit Erstzulassung in Deutschland zwischen dem ${h.date(F.erstzulassung_ab)} und dem ${h.date(F.bev_erstzulassung_bis)}.</li>
<li>Plug-in-Hybrid oder Range Extender mit Erstzulassung bis zum ${h.date(F.phev_erstzulassung_bis)}, und nur mit höchstens ${h.num(F.phev_co2_max_g_km)} g CO2 je km oder mindestens ${h.num(F.phev_reichweite_min_km)} km elektrischer Reichweite.</li>
<li>Keine Tageszulassung, kein Vorführwagen, keine Werkszulassung, kein Gebrauchtwagen.</li>
<li>Gekauft werden darf das Auto auch im Ausland, erstmals zugelassen werden muss es in Deutschland.</li>
</ul>
<p>Weil die Bedingungen am Fahrzeug und nicht am Modellnamen hängen, kann dasselbe Modell förderfähig sein oder nicht: Ein neues Exemplar ist es, ein Vorführwagen desselben Typs nicht. Wie das bei Neuwagen mit kurzer Standzeit aussieht, steht unter ${h.a('neuwagen', 'Neuwagen und Tageszulassung')}; die Regeln für Hybride unter ${h.a('plug-in-hybrid', 'Plug-in-Hybrid')}.</p>
<h2>Die Liste mit Preis nach Förderung</h2>
<p>Die Tabelle zeigt die Modelle mit Listenpreis, sortiert vom günstigsten zum teuersten. Der Preis nach Förderung ist für einen Haushalt ohne förderrelevantes Kind gerechnet, einmal in der ersten Stufe bis ${h.eur(s1)} zu versteuerndem Einkommen und einmal in der dritten bis ${h.eur(s3)}. Wer Kinder hat oder genau rechnen will, nutzt den Rechner oben: Er sortiert die Liste nach Ihrem Einkommen neu. Die letzten beiden Spalten nennen die ${h.src('bafaStatistik', 'Bewilligungen des BAFA')} mit Stand ${h.date(M.bafa_stand)} und deren Verhältnis zu den ${h.src('kba', 'Neuzulassungen laut KBA')} von Januar bis ${M.kba_bis_text.de}.</p>
${h.table(['Modell', 'Listenpreis', `netto bis ${h.eur(s1)}`, `netto bis ${h.eur(s3)}`, 'Bewilligungen', 'Verhältnis'], liste.map((m) => zeile(h, m)), `Listenpreise der Hersteller, gelesen am ${h.date(gelesen)}; Haushalt ohne Kind`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Der Listenpreis ist die unverbindliche Preisempfehlung des Herstellers für die genannte Einstiegsversion, mit Mehrwertsteuer und ohne Überführung. Was der Händler tatsächlich verlangt, kann darüber oder darunter liegen. Die Förderung zieht der Staat nicht vom Preis ab, sondern zahlt sie nach der Zulassung auf Antrag aus; den Kaufpreis zahlen Sie zunächst voll.</p>
<h2>Vom Listenpreis zum echten Preis</h2>
<p>Drei Posten verschieben den Betrag, den Sie am Ende zahlen. Erstens die Überführung: Sie steht nicht im Listenpreis und kostet je nach Hersteller und Händler einige hundert bis über tausend Euro. Zweitens Rabatte und Aktionen des Herstellers, etwa eine eigene Kaufprämie; sie senken den Preis zusätzlich und kürzen die staatliche Förderung nicht. Drittens Zulassung und Kennzeichen. Rechnen Sie deshalb mit dem Endpreis aus dem Angebot und ziehen Sie davon die Förderung ab. Ein Beispiel: Kostet ein Auto laut Angebot ${h.eur(30000)} einschließlich Überführung und liegt der Haushalt ohne Kind in der ersten Stufe, bleiben ${h.eur(30000 - betragTabelle(s1, 0, 'bev'))}. Wie Förderung und Herstellerprämie zusammenwirken, steht unter ${h.a('kumulierung', 'Förderung kombinieren')}.</p>
<h2>Was die Liste zeigt</h2>
<p>Bei den Kleinwagen ist die Förderung im Verhältnis am größten. Beim ${billig.marke} ${billig.name} deckt der Betrag der ersten Stufe ohne Kind ${h.pct(betragTabelle(s1, 0, 'bev') / preis(billig))} des Listenpreises, beim ${teuer.marke} ${teuer.name} nur ${h.pct(betragTabelle(s1, 0, 'bev') / preis(teuer))}. Weil der Betrag nicht mit dem Preis wächst, rückt ein günstiges Auto mit der Förderung noch weiter nach unten: ${unter20.map((m) => `${m.marke} ${m.name}`).join(', ')} kosten in der ersten Stufe ohne Kind weniger als ${h.eur(20000)}.</p>
<p>Zwischen den Stufen liegen je nach Kinderzahl bis zu ${h.eur(betragTabelle(s1, 0, 'bev') - betragTabelle(s3, 0, 'bev'))} Unterschied. Für ein Paar, das knapp über ${h.eur(s1)} liegt, kann es sich lohnen, das zu versteuernde Einkommen genau auszurechnen; oft liegt es niedriger als gedacht. Die Seite ${h.a('haushaltseinkommen', 'Haushaltseinkommen')} zeigt, wie es für zwei Personen gebildet wird.</p>
<h2>Modelle ohne Listenpreis</h2>
<p>Für ${ohnePreis.length} Modelle der BAFA-Statistik nennt diese Seite keinen Preis: ${ohnePreis.map((m) => `${m.marke} ${m.name}`).join(', ')}. Bei einigen ließ die Herstellerseite kein Auslesen zu, bei anderen war der Preis nur nach einem Bonus des Herstellers oder ohne eindeutige Einstiegsversion angegeben. Ein geschätzter Preis würde hier mehr schaden als nützen. Förderfähig sind diese Modelle trotzdem, wenn das einzelne Fahrzeug die Bedingungen erfüllt. Im Förderrechner geben Sie dafür einfach den Preis aus Ihrem Angebot ein.</p>
<h2>Plug-in-Hybride in der Liste</h2>
<p>Die Liste enthält nur reine Elektroautos mit Preis. Bei Plug-in-Hybriden hängt die Förderfähigkeit an zwei Werten, die nicht im Prospekt, sondern in der Übereinstimmungsbescheinigung stehen: dem gewichteten kombinierten CO2-Wert und der elektrischen Reichweite. Erfüllt ein Hybrid einen der beiden, ist er bis zum ${h.date(F.phev_erstzulassung_bis)} förderfähig, mit kleineren Beträgen als ein reines Elektroauto. Das in der Statistik häufigste Hybridmodell ist der BYD Seal U DM-i. Ob ein bestimmtes Hybridmodell die Werte schafft, prüft der Rechner auf der Seite ${h.a('plug-in-hybrid', 'Plug-in-Hybrid')}.</p>
<h2>Die Modelle mit eigener Seite</h2>
<p>Für die fünf Modelle, nach denen am häufigsten gefragt wird, gibt es eigene Seiten mit dem Preis nach Förderung für jede Einkommensstufe, den Zulassungen je Monat und dem, was beim Kauf zu beachten ist: ${h.a('skoda-elroq', 'Skoda Elroq')}, ${h.a('vw-id3', 'VW ID.3')}, ${h.a('hyundai-inster', 'Hyundai Inster')}, ${h.a('leapmotor-t03', 'Leapmotor T03')} und ${h.a('dacia-spring', 'Dacia Spring')}. Wie viele Anträge insgesamt bewilligt wurden und an welche Haushalte, steht unter ${h.a('statistik', 'Statistik')}.</p>
<h2>So lesen Sie das Verhältnis</h2>
<p>Die letzte Spalte teilt die Bewilligungen eines Modells durch seine Neuzulassungen seit Januar. Ein hoher Wert heißt: Viele Käufer dieses Modells sind Privathaushalte mit Förderung. Ein niedriger Wert heißt nicht, dass das Modell schlecht gefördert würde, sondern dass es oft als Firmenwagen, Mietwagen oder Vorführwagen zugelassen wird, die keine Förderung bekommen. Die Zahl ist ein Richtwert: Anträge werden erst seit Mai gestellt und mit Verzug bearbeitet, die Zulassungen laufen seit Januar.</p>`,
  },
  en: {
    slug: 'eligible-models',
    nav: 'Eligible models',
    card: 'The common electric cars with list price, price after the grant for your income, approvals and registrations.',
    title: 'Eligible EVs Germany 2026: list with price after the grant',
    description: `Eligible EVs in Germany 2026: ${liste.length} models with list price and price after the grant for your income, plus the BAFA approvals and the KBA new registration figures.`,
    h1: 'Eligible electric cars 2026: price after the grant by model',
    intro: 'Enter household income and children: the list works out each model’s price after the EV grant and sorts by what you actually pay.',
    resume: `There is no official list of eligible electric cars: BAFA funds any new M1 vehicle that meets the guideline’s conditions, with no price cap and no rule on where it was built. Battery electric and fuel cell cars qualify if first registered in Germany between ${datumText(F.erstzulassung_ab, 'en')} and ${datumText(F.bev_erstzulassung_bis, 'en')}; plug-in hybrids and range extenders until ${datumText(F.phev_erstzulassung_bis, 'en')}, and only with at most ${F.phev_co2_max_g_km} g CO2 per km or at least ${F.phev_reichweite_min_km} km of electric range. This page lists ${liste.length} models with the manufacturer’s list price, read on ${datumText(gelesen, 'en')}. The cheapest after the grant is the ${billig.marke} ${billig.name}: ${EN.eur(preis(billig))} list price, ${EN.eur(netto(billig, s1, 0))} in the first income band with no child. With two children and income of at most ${EN.eur(s1)} the grant is ${EN.eur(max)}, in the third band with no child ${EN.eur(min)}. ${unter20.length} models cost less than ${EN.eur(20000)} in the first band without children.`,
    faqs: [
      { q: 'Is there an official list of eligible electric cars in Germany?', a: 'No. BAFA does not publish a model list like the one that existed for the earlier environmental bonus. Any new M1 vehicle that meets the conditions qualifies: drive type, the period of first registration in Germany and, for hybrids, the CO2 or electric range values. Lists online are compilations, not official registers.' },
      { q: 'Which electric car is cheapest after the grant?', a: `In this list it is the ${billig.marke} ${billig.name}, ${billig.version?.en}, at ${EN.eur(preis(billig))} list price. In the first income band with no child ${EN.eur(netto(billig, s1, 0))} remains, with two children ${EN.eur(netto(billig, s1, F.max_kinder))}. Delivery charges, registration and dealer discounts are not included and change the result case by case.` },
      { q: 'Is there a maximum price for an eligible electric car?', a: `No. The guideline caps household income, not the car’s price. Even the ${teuer.marke} ${teuer.name} at ${EN.eur(preis(teuer))} list price qualifies if the household is under the limit. In practice the grant is proportionally smaller on expensive models, because the amount is fixed and does not grow with the price.` },
      { q: 'Why do some models have no price?', a: `For ${ohnePreis.length} models in the statistics, including Tesla, no list price could be read reliably from the manufacturer’s site. Rather than estimate one, this page shows only approvals and registrations for them. Work out the price after the grant in the grant calculator with your dealer’s quote; that is more precise than any list price.` },
    ],
    body: (h) => `
<h2>What makes a model eligible</h2>
<p>The ${h.src('richtlinie', 'funding guideline')} names no models, only conditions. If a vehicle meets them it qualifies, whatever the brand and whatever the price. ${h.src('bafaVoraussetzungen', 'BAFA summarises them')}:</p>
<ul>
<li>A new M1 vehicle, that is a passenger car, bought or leased privately.</li>
<li>Battery electric or fuel cell car first registered in Germany between ${h.date(F.erstzulassung_ab)} and ${h.date(F.bev_erstzulassung_bis)}.</li>
<li>Plug-in hybrid or range extender first registered by ${h.date(F.phev_erstzulassung_bis)}, and only with at most ${h.num(F.phev_co2_max_g_km)} g CO2 per km or at least ${h.num(F.phev_reichweite_min_km)} km of electric range.</li>
<li>No pre-registered cars, no demonstrators, no factory registrations, no used cars.</li>
<li>The car may be bought abroad, but its first registration must be in Germany.</li>
</ul>
<p>Because the conditions apply to the vehicle rather than the model name, the same model can qualify or not: a new one does, a demonstrator of the same type does not. How that works for new cars with a short registration history is explained under ${h.a('neuwagen', 'new cars and pre-registration')}; the hybrid rules under ${h.a('plug-in-hybrid', 'plug-in hybrid')}.</p>
<h2>The list with price after the grant</h2>
<p>The table shows the models with a list price, sorted from cheapest to most expensive. The price after the grant is for a household with no qualifying child, once in the first band up to ${h.eur(s1)} taxable income and once in the third up to ${h.eur(s3)}. If you have children or want an exact figure, use the calculator above: it re-sorts the list for your income. The last two columns give ${h.src('bafaStatistik', 'BAFA approvals')} as of ${h.date(M.bafa_stand)} and their ratio to ${h.src('kba', 'KBA new registrations')} from January to ${M.kba_bis_text.en}.</p>
${h.table(['Model', 'List price', `net to ${h.eur(s1)}`, `net to ${h.eur(s3)}`, 'Approvals', 'Ratio'], liste.map((m) => zeile(h, m)), `Manufacturer list prices read on ${h.date(gelesen)}; household without children`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The list price is the manufacturer’s recommended retail price for the named entry version, including VAT and excluding delivery. What the dealer actually charges may be higher or lower. The state does not deduct the grant from the price; it pays it on application after registration, so you pay the full purchase price first.</p>
<h2>From list price to real price</h2>
<p>Three items shift the amount you finally pay. First, delivery: it is not in the list price and costs a few hundred to over a thousand euros depending on manufacturer and dealer. Second, manufacturer discounts and offers, such as a brand’s own purchase bonus; they lower the price further and do not reduce the state grant. Third, registration and number plates. So work from the final price in the quote and deduct the grant from that. An example: if a car costs ${h.eur(30000)} including delivery according to the quote and the household is in the first band with no child, ${h.eur(30000 - betragTabelle(s1, 0, 'bev'))} remains. How the grant and a manufacturer bonus combine is explained under ${h.a('kumulierung', 'combining grants')}.</p>
<h2>What the list shows</h2>
<p>The grant is proportionally largest on small cars. On the ${billig.marke} ${billig.name} the first-band amount without children covers ${h.pct(betragTabelle(s1, 0, 'bev') / preis(billig))} of the list price, on the ${teuer.marke} ${teuer.name} only ${h.pct(betragTabelle(s1, 0, 'bev') / preis(teuer))}. Because the amount does not grow with the price, a cheap car moves even further down with the grant: ${unter20.map((m) => `${m.marke} ${m.name}`).join(', ')} cost less than ${h.eur(20000)} in the first band without children.</p>
<p>Depending on the number of children, the bands differ by up to ${h.eur(betragTabelle(s1, 0, 'bev') - betragTabelle(s3, 0, 'bev'))}. For a couple just above ${h.eur(s1)} it can pay to work out taxable income exactly; it is often lower than expected. The page on ${h.a('haushaltseinkommen', 'household income')} shows how it is formed for two people.</p>
<h2>Models without a list price</h2>
<p>For ${ohnePreis.length} models in the BAFA statistics this page gives no price: ${ohnePreis.map((m) => `${m.marke} ${m.name}`).join(', ')}. Some manufacturer sites could not be read, others showed the price only after a manufacturer bonus or without a clear entry version. An estimated price would do more harm than good here. These models still qualify if the individual vehicle meets the conditions. In the grant calculator, just enter the price from your quote.</p>
<h2>Plug-in hybrids in the list</h2>
<p>The list contains only battery electric cars with a price. For plug-in hybrids, eligibility depends on two values that appear not in the brochure but in the certificate of conformity: the weighted combined CO2 figure and the electric range. If a hybrid meets either, it qualifies until ${h.date(F.phev_erstzulassung_bis)}, with smaller amounts than a battery electric car. The most frequent hybrid model in the statistics is the BYD Seal U DM-i. Whether a particular hybrid meets the values is checked by the calculator on the ${h.a('plug-in-hybrid', 'plug-in hybrid')} page.</p>
<h2>Models with their own page</h2>
<p>The five models people ask about most have their own pages with the price after the grant for every income band, monthly registrations and what to watch when buying: ${h.a('skoda-elroq', 'Skoda Elroq')}, ${h.a('vw-id3', 'VW ID.3')}, ${h.a('hyundai-inster', 'Hyundai Inster')}, ${h.a('leapmotor-t03', 'Leapmotor T03')} and ${h.a('dacia-spring', 'Dacia Spring')}. How many applications were approved in total and for which households is under ${h.a('statistik', 'statistics')}.</p>
<h2>How to read the ratio</h2>
<p>The last column divides a model’s approvals by its new registrations since January. A high value means many buyers of that model are private households with the grant. A low value does not mean the model is poorly funded, but that it is often registered as a company car, rental car or demonstrator, which get no grant. The figure is a guide: applications have only been possible since May and are processed with a delay, while registrations run from January.</p>`,
  },
});
