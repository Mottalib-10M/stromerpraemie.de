import { defineGuide } from '../../lib/guide-types';
import { foerderung, phevFoerderfaehig, fristen, nettopreis } from '../../lib/engine/foerderung';
import { phevSteuer } from '../../lib/engine/kfz';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Plug-in-Hybrid und Range Extender: förderfähig bei höchstens 60 g CO2/km (CoC 49.4) ODER mindestens 80 km
 * elektrischer Reichweite (EAER city, CoC 49.5); Erstzulassung bis 30.6.2027. Danach nur angekündigte Prüfung.
 * Beispiele: drei gedachte Fahrzeuge (keine echten Modelle), Beträge aus dem Rechenkern.
 */
const F = P.foerderung;
const co2 = F.phev_co2_max_g_km, km = F.phev_reichweite_min_km;
const z = '2026-11-01';
const b = (zve: number, kinder: number, antrieb: 'bev' | 'phev' = 'phev') => foerderung({ zve, kinder, antrieb, zulassung: z }).betrag;
const autos: Array<[string, string, number, number]> = [
  ['Kompakter Hybrid A', 'Compact hybrid A', 24, 72],
  ['SUV-Hybrid B', 'SUV hybrid B', 68, 86],
  ['Großer Hybrid C', 'Large hybrid C', 74, 61],
  ['Range Extender D', 'Range extender D', 12, 160],
];
const letzte = fristen(F.phev_erstzulassung_bis);
const spaet = foerderung({ zve: 50000, kinder: 0, antrieb: 'phev', zulassung: '2027-07-01' }).betrag;

export default defineGuide({
  id: 'plug-in-hybrid',
  group: 'foerderung',
  order: 40,
  mini: 'fPhev',
  related: ['einkommensgrenze', 'kfz-steuer', 'laufzeit', 'thg-quote', 'foerderfaehige-modelle'],
  sources: ['richtlinie', 'bafaFaq', 'bafaMerkblatt', 'kraftstg9'],
  de: {
    slug: 'plug-in-hybrid-foerderung',
    nav: 'Plug-in-Hybrid',
    card: 'Welche Hybride gefördert werden, wo CO2 und Reichweite im CoC stehen und warum der Juni 2027 zählt.',
    title: `Plug-in-Hybrid Förderung 2026: bis ${co2} g CO2 oder ab ${km} km`,
    description: `Plug-in-Hybrid Förderung 2026: ${DE.eur(F.phev[2][0])} bis ${DE.eur(F.phev[0][2])} für einen Neuwagen bei höchstens ${co2} g CO2/km oder ${km} km elektrisch, Erstzulassung bis ${datumText(F.phev_erstzulassung_bis, 'de')}.`,
    h1: 'Förderung für Plug-in-Hybride 2026',
    intro: 'Ein Plug-in-Hybrid oder Range Extender bekommt Förderung, wenn er eine von zwei technischen Grenzen einhält und rechtzeitig zugelassen wird. Wo die Werte stehen und was die Förderung bringt.',
    resume: `Plug-in-Hybride und Fahrzeuge mit Range Extender werden 2026 gefördert, aber nicht alle und nicht unbegrenzt lange. Förderfähig ist ein solches Auto, wenn es entweder höchstens ${co2} g CO2 je Kilometer ausstößt, gemessen als gewichteter kombinierter WLTP-Wert, oder mindestens ${km} km rein elektrisch fahren kann. Eine der beiden Bedingungen genügt. Beide Werte stehen in der EU-Übereinstimmungsbescheinigung, dem CoC, unter den Nummern 49.4 und 49.5. Die Erstzulassung in Deutschland muss zwischen dem ${datumText(F.erstzulassung_ab, 'de')} und dem ${datumText(F.phev_erstzulassung_bis, 'de')} liegen; für reine Elektroautos läuft die Frist bis Ende 2029. Die Beträge sind niedriger als beim Elektroauto: ${DE.eur(F.phev[0][0])} in der ersten Einkommensstufe ohne Kind, ${DE.eur(F.phev[1][0])} in der zweiten, ${DE.eur(F.phev[2][0])} in der dritten, je Kind ${DE.eur(F.phev[0][1] - F.phev[0][0])} mehr. Für die Zeit ab Juli 2027 prüft die Bundesregierung nach Angaben des BAFA eine neue Förderung, die sich am CO2-Ausstoß im realen Betrieb orientiert; beschlossen ist dazu nichts. Von der Kfz-Steuer ist ein Plug-in-Hybrid nicht befreit, und die THG-Prämie gibt es für ihn nicht.`,
    faqs: [
      { q: 'Wo finde ich den CO2-Wert meines Plug-in-Hybrids für die Förderung?', a: `In der EU-Übereinstimmungsbescheinigung, dem Certificate of Conformity, unter Nummer 49.4: dort steht der gewichtete kombinierte CO2-Wert nach WLTP. Die elektrische Reichweite im Stadtzyklus steht unter 49.5. Liegt der CO2-Wert über ${co2} g/km, laden Sie das CoC im Antrag hoch, um die Reichweite von mindestens ${km} km nachzuweisen.` },
      { q: 'Reicht eine der beiden Bedingungen beim Plug-in-Hybrid aus?', a: `Ja. Die Richtlinie verlangt höchstens ${co2} g CO2/km oder mindestens ${km} km elektrische Reichweite, nicht beides. Ein Hybrid mit ${DE.num(68)} g und ${DE.num(86)} km ist förderfähig, einer mit ${DE.num(24)} g und ${DE.num(72)} km ebenfalls. Nur wer beide Grenzen verfehlt, geht leer aus.` },
      { q: `Was passiert mit der Hybrid-Förderung nach dem ${datumText(F.phev_erstzulassung_bis, 'de')}?`, a: 'Für Plug-in-Hybride und Range Extender, die später erstmals zugelassen werden, gibt es nach heutiger Richtlinie keine Förderung. Das BAFA schreibt, die Bundesregierung prüfe eine Förderung, die sich am CO2-Ausstoß im realen Betrieb orientiert. Das ist eine angekündigte Prüfung, keine Regel. Beträge oder Bedingungen dafür gibt es nicht.' },
      { q: 'Wird ein Range Extender wie ein Plug-in-Hybrid gefördert?', a: 'Ja. Die Richtlinie behandelt Fahrzeuge mit Range Extender wie Plug-in-Hybride: gleiche Tabelle, gleiche technische Bedingungen, gleiche Frist für die Erstzulassung. Weil ein Range Extender meist eine große elektrische Reichweite hat, erfüllt er die Bedingung bei Reichweite oder CO2 oft deutlich. Maßgeblich sind die Werte im CoC.' },
      { q: 'Lohnt sich bei der Förderung ein Plug-in-Hybrid statt eines Elektroautos?', a: `Das hängt vom Fahrzeug und Ihrem Fahrprofil ab, nicht von der Förderung allein. Die Förderung ist beim Hybrid in jeder Stufe um ${DE.eur(F.bev[0][0] - F.phev[0][0])} niedriger, die Frist kürzer, die Kfz-Steuer fällt an und die THG-Prämie fehlt. Dieser Vergleich ersetzt keine Kaufentscheidung; er zeigt nur, was die Förderregeln beitragen.` },
    ],
    body: (h) => `
<h2>Zwei Wege zur Förderfähigkeit</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} unterscheidet bei Fahrzeugen mit Verbrennungsmotor und Stecker nicht nach Bauart, sondern nach zwei Messwerten. Entweder liegt der gewichtete kombinierte CO2-Ausstoß bei höchstens ${co2} g/km, oder die rein elektrische Reichweite im Stadtzyklus beträgt mindestens ${km} km. Das „oder“ ist wichtig: Ein schwerer Hybrid mit großem Akku kann über dem CO2-Wert liegen und trotzdem über die Reichweite förderfähig sein.</p>
${h.table(['Fahrzeug (gedacht)', 'CO2 (49.4)', 'Reichweite (49.5)', 'Förderfähig', 'Weg'], autos.map(([de, , c, r]) => [de, `${h.num(c)} g/km`, `${h.num(r)} km`, phevFoerderfaehig(c, r) ? 'ja' : 'nein', c <= co2 ? 'CO2' : r >= km ? 'Reichweite' : 'keiner']), 'Vier gedachte Fahrzeuge, geprüft mit den Grenzen der Richtlinie', ['l', 'r', 'r', 'l', 'l'])}
<p>Die Fahrzeuge in der Tabelle sind Beispiele, keine Modelle eines Herstellers. Für Ihr Auto zählt allein, was im CoC steht. Prospektwerte, Angaben aus Konfiguratoren oder Testberichte genügen nicht, weil das BAFA auf die Bescheinigung des konkreten Fahrzeugs schaut.</p>
<h2>Die Werte im CoC finden</h2>
<p>Die EU-Übereinstimmungsbescheinigung, englisch Certificate of Conformity, liegt jedem Neuwagen bei, oft als Papier im Fahrzeugordner, manchmal als PDF vom Händler. Sie ist nummeriert. Für die Förderung zählen zwei Felder:</p>
<ul>
<li><strong>49.4</strong>: der gewichtete kombinierte CO2-Wert nach WLTP, in g/km.</li>
<li><strong>49.5</strong>: die elektrische Reichweite im Stadtzyklus, auf Englisch Equivalent All Electric Range city, in km.</li>
</ul>
<p>Liegt der CO2-Wert über ${h.P.foerderung.phev_co2_max_g_km} g/km, verlangt das ${h.src('bafaMerkblatt', 'Merkblatt zu den Nachweisunterlagen')} das CoC als Nachweis der Reichweite. Liegt er darunter, verlangt das Merkblatt das CoC nicht. Fehlt das CoC, kann der Hersteller oder Händler es ausstellen.</p>
<h2>Was ein Plug-in-Hybrid bringt</h2>
${h.table(['Haushaltseinkommen', 'Ohne Kind', '1 Kind', '2 Kinder', 'Elektroauto ohne Kind'], [30000, 52000, 70000, 84000, 89000].map((x) => [h.eur(x), h.eur(b(x, 0)), h.eur(b(x, 1)), h.eur(b(x, 2)), h.eur(b(x, 0, 'bev'))]), 'Förderung für einen förderfähigen Plug-in-Hybrid, Zulassung im November 2026', ['r', 'r', 'r', 'r', 'r'])}
<p>In jeder Stufe liegt der Hybrid ${h.eur(F.bev[0][0] - F.phev[0][0])} unter dem Elektroauto. Die Kinder wirken gleich: ${h.eur(F.phev[0][1] - F.phev[0][0])} mehr je Kind, ${h.eur(F.obergrenze_je_kind)} mehr Einkommensgrenze. Der Mini-Rechner oben prüft die beiden technischen Bedingungen und rechnet den Betrag für Ihren Haushalt.</p>
<h2>Rechenbeispiel: Familie mit Hybrid-Kombi</h2>
<p>Eine Familie mit einem Kind und einem Haushaltseinkommen von ${h.eur(56000)} bestellt einen Plug-in-Hybrid-Kombi mit einem Listenpreis von ${h.eur(44000)}. Laut CoC stößt er 31 g CO2/km aus und fährt 78 km elektrisch; förderfähig ist er über den CO2-Wert, obwohl die Reichweite knapp unter ${km} km liegt. Die Förderung beträgt ${h.eur(b(56000, 1))}, der Preis nach Förderung ${h.eur(nettopreis(44000, b(56000, 1)))}. Ein vergleichbares Elektroauto zum selben Preis käme auf ${h.eur(nettopreis(44000, b(56000, 1, 'bev')))}. Die Förderung zahlt das BAFA nach der Zulassung auf das Konto des Halters, nicht der Händler beim Kauf.</p>
<h2>Drei Irrtümer über Hybride und Förderung</h2>
<ul>
<li><strong>„Jeder Plug-in-Hybrid wird gefördert.“</strong> Nein. Große Hybride mit hohem Verbrauch und kurzer Reichweite verfehlen beide Grenzen.</li>
<li><strong>„Die Reichweite aus dem Prospekt zählt.“</strong> Nein. Maßgeblich ist der Wert im CoC des konkreten Fahrzeugs, im Stadtzyklus gemessen; eine Ausstattung mit größeren Rädern kann ihn verändern.</li>
<li><strong>„Wer bis Juni 2027 bestellt, ist auf der sicheren Seite.“</strong> Nein. Es zählt die Erstzulassung, nicht die Bestellung.</li>
<li><strong>„Der Händler zieht die Förderung vom Preis ab.“</strong> Nein. Das BAFA zahlt nach der Zulassung an den Halter. Ein Rabatt des Händlers oder des Herstellers ist eine eigene Sache und ändert an der staatlichen Förderung nichts.</li>
</ul>
<h2>Die Frist bis Ende Juni 2027</h2>
<p>Ein Plug-in-Hybrid muss bis zum ${h.date(F.phev_erstzulassung_bis)} in Deutschland erstmals zugelassen sein. Maßgeblich ist der Tag der Zulassung, nicht der Tag des Kaufvertrags und nicht der Liefertermin, den der Händler zugesagt hat. Ein Auto, das am ${h.date('2027-07-01')} zugelassen wird, bekommt nach heutiger Richtlinie ${h.eur(spaet)}. Wer am letzten möglichen Tag zulässt, kann den Antrag noch bis zum ${h.date(letzte.antragBis)} stellen und muss das Auto bis zum ${h.date(letzte.haltenBis)} halten.</p>
<p>Bei Bestellungen mit langer Lieferzeit lohnt deshalb ein Blick in den Vertrag: Ist ein Liefertermin fest zugesagt, und was geschieht, wenn er sich verschiebt? Eine Förderung, die an einem Tag hängt, ist ein Risiko, das kein Händler abnimmt, solange es nicht schriftlich vereinbart ist.</p>
<h2>Nach Juli 2027: nur angekündigt</h2>
<p>Das ${h.src('bafaFaq', 'BAFA')} schreibt, dass die Bundesregierung für die Zeit ab dem 1. Juli 2027 eine Förderung von Plug-in-Hybriden und Range Extendern prüft, die sich an den CO2-Emissionen im realen Betrieb orientiert. Damit soll ein Anreiz entstehen, möglichst viel elektrisch zu fahren. Wie das gemessen werden soll, welche Beträge gelten und ob es überhaupt dazu kommt, ist offen. Diese Seite rechnet deshalb für Zulassungen nach dem ${h.date(F.phev_erstzulassung_bis)} mit null und nimmt eine neue Regel erst auf, wenn sie veröffentlicht ist. Was zur Laufzeit des ganzen Programms bekannt ist, steht unter ${h.a('laufzeit', 'Laufzeit bis 2029')}.</p>
<h2>Steuer und Quote: zwei Nachteile</h2>
<p>Zwei Vorteile reiner Elektroautos fehlen beim Hybrid. Die Befreiung von der Kfz-Steuer gilt nicht; ein Plug-in-Hybrid zahlt nach ${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 2 KraftStG')} für den Hubraum und für CO2 über ${h.P.kfz.co2_frei_g_km} g/km. Mit 1 498 cm³ und 30 g/km sind das ${h.eur(phevSteuer(1498, 30), 2)} im Jahr. Und die THG-Prämie, die reine Elektroautos jedes Jahr bringen, gibt es nicht, weil der Schätzwert des Umweltbundesamts nur für Fahrzeuge ohne Verbrenner gilt. Die Rechnung zur Steuer steht im ${h.a('kfz-steuer', 'Kfz-Steuer-Rechner')}, die Regeln der Quote unter ${h.a('thg-quote', 'THG-Quote')}.</p>
<h2>Was für alle Antriebe gleich bleibt</h2>
<ul>
<li>Neufahrzeug der Klasse M1, gekauft oder geleast, Erstzulassung in Deutschland auf die antragstellende Person.</li>
<li>Antrag erst nach der Zulassung, höchstens ${h.P.foerderung.antragsfrist_monate} Monate danach.</li>
<li>Haltedauer ${h.P.foerderung.haltedauer_monate} Monate, Einkommensgrenzen und Kinderregeln wie beim Elektroauto.</li>
<li>Keine Preisobergrenze für das Fahrzeug und keine amtliche Modellliste.</li>
</ul>
<p>Welche Modelle am Markt die Bedingungen erfüllen, prüfen Sie am besten im CoC des konkreten Fahrzeugs. Eine Übersicht über Elektroautos mit Preisen und Zulassungszahlen steht unter ${h.a('foerderfaehige-modelle', 'förderfähige Modelle')}.</p>`,
  },
  en: {
    slug: 'plug-in-hybrid-grant',
    nav: 'Plug-in hybrids',
    card: 'Which hybrids qualify, where CO2 and range appear on the CoC, and why June 2027 matters.',
    title: `Plug-in hybrid grant 2026: ${co2} g CO2 or ${km} km electric range`,
    description: `Plug-in hybrid grant in Germany 2026: ${EN.eur(F.phev[2][0])} to ${EN.eur(F.phev[0][2])} for a new car or lease at up to ${co2} g CO2/km or ${km} km electric range, first registration by ${datumText(F.phev_erstzulassung_bis, 'en')}.`,
    h1: 'The 2026 grant for plug-in hybrids',
    intro: 'A plug-in hybrid or range extender qualifies if it meets one of two technical limits and is registered in time. Where to find the figures and what the grant is worth.',
    resume: `Plug-in hybrids and range-extender cars are funded in 2026, but not all of them and not for long. Such a car qualifies if it either emits at most ${co2} g of CO2 per kilometre, measured as the weighted combined WLTP figure, or can drive at least ${km} km on electricity alone. Either condition is enough. Both values are on the EU certificate of conformity (CoC, Übereinstimmungsbescheinigung) under items 49.4 and 49.5. First registration in Germany must fall between ${datumText(F.erstzulassung_ab, 'en')} and ${datumText(F.phev_erstzulassung_bis, 'en')}; for battery electric cars the window runs to the end of 2029. Amounts are lower than for a battery electric car: ${EN.eur(F.phev[0][0])} in the first income band without children, ${EN.eur(F.phev[1][0])} in the second, ${EN.eur(F.phev[2][0])} in the third, and ${EN.eur(F.phev[0][1] - F.phev[0][0])} more per child. For the period from July 2027, BAFA says the federal government is examining a new scheme based on real-world CO2 emissions; nothing has been decided. A plug-in hybrid is not exempt from vehicle tax and earns no GHG quota payout.`,
    faqs: [
      { q: 'Where do I find my plug-in hybrid’s CO2 figure for the grant?', a: `On the EU certificate of conformity, item 49.4, which gives the weighted combined WLTP CO2 figure. The electric range in the city cycle is item 49.5. If CO2 is above ${co2} g/km, upload the CoC with your application to prove a range of at least ${km} km.` },
      { q: 'Is one of the two conditions enough for a plug-in hybrid?', a: `Yes. The guideline asks for at most ${co2} g CO2/km or at least ${km} km electric range, not both. A hybrid with ${EN.num(68)} g and ${EN.num(86)} km qualifies, and so does one with ${EN.num(24)} g and ${EN.num(72)} km. Only a car that misses both limits gets nothing.` },
      { q: `What happens to the hybrid grant after ${datumText(F.phev_erstzulassung_bis, 'en')}?`, a: 'Plug-in hybrids and range extenders first registered later receive nothing under the current guideline. BAFA writes that the federal government is examining a scheme based on CO2 emissions in real-world use. That is an announced review, not a rule. There are no amounts or conditions for it.' },
      { q: 'Is a range extender funded like a plug-in hybrid?', a: 'Yes. The guideline treats range-extender vehicles like plug-in hybrids: same table, same technical conditions, same registration deadline. Because a range extender usually has a long electric range, it often clears the range or CO2 condition easily. The figures on the CoC decide.' },
      { q: 'Does the grant make a plug-in hybrid better value than an EV?', a: `That depends on the car and how you drive, not on the grant alone. The hybrid grant is ${EN.eur(F.bev[0][0] - F.phev[0][0])} lower in every band, the deadline is shorter, vehicle tax applies and the quota payout is missing. This comparison is not a buying decision; it only shows what the funding rules contribute.` },
    ],
    body: (h) => `
<h2>Two routes to eligibility</h2>
<p>For cars with a combustion engine and a plug, the ${h.src('richtlinie', 'funding guideline')} does not look at design but at two measured values. Either the weighted combined CO2 output is at most ${co2} g/km, or the purely electric range in the city cycle is at least ${km} km. The “or” matters: a heavy hybrid with a big battery can exceed the CO2 limit and still qualify through range.</p>
${h.table(['Vehicle (illustrative)', 'CO2 (49.4)', 'Range (49.5)', 'Qualifies', 'Route'], autos.map(([, en, c, r]) => [en, `${h.num(c)} g/km`, `${h.num(r)} km`, phevFoerderfaehig(c, r) ? 'yes' : 'no', c <= co2 ? 'CO2' : r >= km ? 'range' : 'none']), 'Four illustrative vehicles checked against the guideline’s limits', ['l', 'r', 'r', 'l', 'l'])}
<p>The vehicles in the table are examples, not any maker’s models. For your car, only what is on the CoC counts. Brochure figures, configurator data or reviews are not enough, because BAFA looks at the certificate of the actual vehicle.</p>
<h2>Finding the figures on the CoC</h2>
<p>The EU certificate of conformity comes with every new car, often on paper in the vehicle folder, sometimes as a PDF from the dealer. It is numbered. Two items matter for the grant:</p>
<ul>
<li><strong>49.4</strong>: the weighted combined WLTP CO2 figure, in g/km.</li>
<li><strong>49.5</strong>: the electric range in the city cycle (Equivalent All Electric Range city), in km.</li>
</ul>
<p>If CO2 is above ${h.P.foerderung.phev_co2_max_g_km} g/km, BAFA’s ${h.src('bafaMerkblatt', 'leaflet on supporting documents')} requires the CoC as proof of range. Below that, the leaflet does not ask for the CoC. If the CoC is missing, the manufacturer or dealer can issue one.</p>
<h2>What a plug-in hybrid brings</h2>
${h.table(['Household income', 'No children', '1 child', '2 children', 'Battery electric, no children'], [30000, 52000, 70000, 84000, 89000].map((x) => [h.eur(x), h.eur(b(x, 0)), h.eur(b(x, 1)), h.eur(b(x, 2)), h.eur(b(x, 0, 'bev'))]), 'Grant for a qualifying plug-in hybrid, registered in November 2026', ['r', 'r', 'r', 'r', 'r'])}
<p>In every band the hybrid is ${h.eur(F.bev[0][0] - F.phev[0][0])} below the battery electric car. Children work the same way: ${h.eur(F.phev[0][1] - F.phev[0][0])} more per child and a ${h.eur(F.obergrenze_je_kind)} higher income limit. The small calculator above checks both technical conditions and works out the amount for your household.</p>
<h2>Worked example: a family with a hybrid estate</h2>
<p>A family with one child and household income of ${h.eur(56000)} orders a plug-in hybrid estate with a list price of ${h.eur(44000)}. Its CoC shows 31 g CO2/km and 78 km electric range; it qualifies through CO2 even though the range is just under ${km} km. The grant is ${h.eur(b(56000, 1))}, the price after the grant ${h.eur(nettopreis(44000, b(56000, 1)))}. A comparable battery electric car at the same price would come to ${h.eur(nettopreis(44000, b(56000, 1, 'bev')))}. BAFA pays the grant into the keeper’s account after registration; the dealer does not deduct it at purchase.</p>
<h2>Three misconceptions about hybrids and the grant</h2>
<ul>
<li><strong>“Every plug-in hybrid is funded.”</strong> No. Large hybrids with high consumption and short range miss both limits.</li>
<li><strong>“The brochure range counts.”</strong> No. The value on the CoC of the actual car, measured in the city cycle, decides; larger wheels can change it.</li>
<li><strong>“Ordering by June 2027 is safe.”</strong> No. First registration counts, not the order.</li>
</ul>
<h2>The deadline at the end of June 2027</h2>
<p>A plug-in hybrid must be first registered in Germany by ${h.date(F.phev_erstzulassung_bis)}. What counts is the registration date, not the date of the purchase contract and not the delivery date the dealer promised. A car registered on ${h.date('2027-07-01')} gets ${h.eur(spaet)} under the current guideline. If you register on the last possible day, you can still apply until ${h.date(letzte.antragBis)} and must keep the car until ${h.date(letzte.haltenBis)}.</p>
<p>With long delivery times, check the contract: is a delivery date firmly promised, and what happens if it slips? A grant that hangs on a single day is a risk no dealer carries unless it is agreed in writing.</p>
<h2>After July 2027: announced only</h2>
<p>${h.src('bafaFaq', 'BAFA')} writes that for the period from 1 July 2027 the federal government is examining funding for plug-in hybrids and range extenders based on CO2 emissions in real-world use, to encourage as much electric driving as possible. How that would be measured, what amounts would apply and whether it will happen at all is open. This site therefore works with zero for registrations after ${h.date(F.phev_erstzulassung_bis)} and will only add a new rule once it is published. What is known about the programme’s overall run is under ${h.a('laufzeit', 'how long it runs')}.</p>
<h2>Tax and quota: two drawbacks</h2>
<p>Two advantages of battery electric cars are missing for a hybrid. The vehicle tax exemption does not apply; a plug-in hybrid pays under ${h.src('kraftstg9', 'section 9(1) no. 2 KraftStG')} for engine size and for CO2 above ${h.P.kfz.co2_frei_g_km} g/km. With 1,498 cm³ and 30 g/km that is ${h.eur(phevSteuer(1498, 30), 2)} a year. And the GHG quota payout that battery electric cars earn every year is not available, because the Federal Environment Agency’s estimate only covers vehicles without a combustion engine. The tax is worked out on the ${h.a('kfz-steuer', 'vehicle tax calculator')}, the quota rules are under ${h.a('thg-quote', 'GHG quota rules')}.</p>
<h2>What stays the same for every drive</h2>
<ul>
<li>A new M1 passenger car, bought or leased, first registered in Germany to the applicant.</li>
<li>Apply only after registration, at most ${h.P.foerderung.antragsfrist_monate} months later.</li>
<li>Holding period of ${h.P.foerderung.haltedauer_monate} months; income limits and child rules as for battery electric cars.</li>
<li>No price cap on the car and no official list of models.</li>
</ul>
<p>Whether a particular car on the market meets the conditions is best checked on the CoC of that vehicle. An overview of electric cars with prices and registration figures is under ${h.a('foerderfaehige-modelle', 'eligible models')}.</p>`,
  },
});
