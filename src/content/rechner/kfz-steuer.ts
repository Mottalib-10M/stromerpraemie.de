import { defineGuide } from '../../lib/guide-types';
import { elektroSteuer, gewichtSteuer, befreiung, phevSteuer, ersparnis } from '../../lib/engine/kfz';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Kfz-Steuer für Elektroautos: zehn Jahre Befreiung nach § 3d KraftStG (Erstzulassung im Zeitfenster), danach
 * Gewichtssteuer nach § 9 Abs. 1 Nr. 3 mit 50 % Ermäßigung; Plug-in-Hybride zahlen Hubraum und CO2.
 * Beispiele: Gewichte 1 800, 2 000, 2 300, 2 600 kg; Zulassungen 2016, 2021, 2026; zwei Plug-in-Hybride.
 */
const K = P.kfz;
const gew = [1800, 2000, 2300, 2600, 3000];
const z2016 = befreiung('2016-06-30'), z2021 = befreiung('2021-04-01'), z2026 = befreiung('2026-03-15');
const ph1 = phevSteuer(1498, 30), ph2 = phevSteuer(1998, 120);
const ab2036 = elektroSteuer(2100), bis2040 = r4(ab2036);
function r4(x: number) { return Math.round(x * 4 * 100) / 100; }
const dd = (iso: string | null, l: 'de' | 'en') => (iso ? datumText(iso, l) : '');

export default defineGuide({
  id: 'kfz-steuer',
  group: 'kosten',
  order: 30,
  tool: 'kfz',
  related: ['thg-praemie', 'plug-in-hybrid', 'haltedauer', 'thg-quote', 'home'],
  sources: ['kraftstg3d', 'kraftstg9', 'kraftstg11'],
  de: {
    slug: 'kfz-steuer-elektroauto',
    nav: 'Kfz-Steuer',
    card: 'Bis wann Ihr Elektroauto steuerfrei bleibt und was es danach im Jahr kostet.',
    title: 'Kfz-Steuer Elektroauto 2026: Befreiung und Steuer danach',
    description: `Kfz-Steuer für Elektroautos 2026: ${K.befreiung_jahre} Jahre frei bei Erstzulassung bis ${datumText(K.befreiung_zulassung_bis, 'de')}, längstens bis Ende 2035; danach halber Gewichtssatz, ${DE.eur(elektroSteuer(2000), 2)} bei 2 t.`,
    h1: 'Kfz-Steuer für Elektroautos 2026 berechnen',
    intro: 'Erstzulassung und zulässiges Gesamtgewicht eingeben: Der Rechner zeigt, bis wann die Befreiung läuft, welche Steuer danach fällig wird und was Sie bis dahin sparen.',
    resume: `Reine Elektroautos sind in Deutschland von der Kfz-Steuer befreit, wenn sie zwischen dem ${datumText(K.befreiung_zulassung_von, 'de')} und dem ${datumText(K.befreiung_zulassung_bis, 'de')} erstmals zugelassen werden. Die Befreiung nach § 3d des Kraftfahrzeugsteuergesetzes dauert ${K.befreiung_jahre} Jahre ab der Erstzulassung, endet aber spätestens am ${datumText(K.befreiung_ende_spaetestens, 'de')}. Ein Auto, das im März 2026 zugelassen wird, ist deshalb nicht bis 2036 frei, sondern bis zum ${dd(z2026.bis, 'de')}. Danach richtet sich die Steuer nach dem zulässigen Gesamtgewicht: je angefangene ${K.je_kg} kg ein Satz zwischen ${DE.eur(K.stufen[0].eur, 2)} und ${DE.eur(K.stufen[2].eur, 2)}, davon wird für Elektroautos die Hälfte erhoben. Bei 2 000 kg sind das ${DE.eur(elektroSteuer(2000), 2)} im Jahr, bei 2 600 kg ${DE.eur(elektroSteuer(2600), 2)}. Die Befreiung gilt einmal je Fahrzeug, geht beim Verkauf auf den neuen Halter über und verlängert sich durch eine Abmeldung nicht. Plug-in-Hybride sind nie befreit; sie zahlen nach Hubraum und CO2-Ausstoß.`,
    faqs: [
      { q: 'Bis wann ist mein Elektroauto von der Kfz-Steuer befreit?', a: `${K.befreiung_jahre} Jahre ab dem Tag der Erstzulassung, aber höchstens bis zum ${datumText(K.befreiung_ende_spaetestens, 'de')}. Ein im Juni 2016 zugelassenes Auto war bis zum ${dd(z2016.bis, 'de')} frei, ein im April 2021 zugelassenes bleibt es bis zum ${dd(z2021.bis, 'de')}. Wer ab 2026 zulässt, erreicht die vollen ${K.befreiung_jahre} Jahre nicht mehr, weil die feste Grenze früher greift.` },
      { q: 'Übernimmt der Käufer eines gebrauchten E-Autos die Steuerbefreiung?', a: 'Ja. Die Befreiung hängt am Fahrzeug, nicht an der Person. Der neue Halter übernimmt die restliche Zeit bis zum Ende, das sich aus der Erstzulassung ergibt. Einen neuen Zeitraum gibt es beim Halterwechsel nicht, und eine Abmeldung mit späterer Wiederzulassung hält die Uhr ebenfalls nicht an.' },
      { q: 'Wie viel Kfz-Steuer zahlt ein Elektroauto nach der Befreiung?', a: `Die Steuer richtet sich nach dem zulässigen Gesamtgewicht in Feld F.2 des Fahrzeugscheins. Für jede angefangenen ${K.je_kg} kg gilt ein gestaffelter Satz, und Elektroautos zahlen davon ${DE.pct(1 - K.ermaessigung_elektro, 0)}. Ein Auto mit 2 000 kg kostet dann ${DE.eur(elektroSteuer(2000), 2)} im Jahr, eines mit 3 000 kg ${DE.eur(elektroSteuer(3000), 2)}. Das Zollamt zieht den Betrag jährlich im Voraus ein.` },
      { q: 'Warum ist mein Plug-in-Hybrid nicht von der Kfz-Steuer befreit?', a: `Die Befreiung nach § 3d gilt nur für Fahrzeuge mit ausschließlich elektrischem Antrieb. Ein Plug-in-Hybrid zahlt wie ein Verbrenner nach Hubraum und CO2-Ausstoß. Weil der gewichtete CO2-Wert meist unter ${K.co2_frei_g_km} g/km liegt, bleibt oft nur der Hubraumanteil: Bei 1 498 cm³ Benziner sind das ${DE.eur(ph1, 0)} im Jahr.` },
      { q: 'Muss ich die Steuerbefreiung beim Zoll extra beantragen?', a: 'Nein. Die Zulassungsstelle meldet das Fahrzeug an den Zoll, der die Steuer festsetzt. Für ein befreites Elektroauto erhalten Sie einen Bescheid, in dem der Zeitraum der Befreiung steht. Prüfen Sie dort das Enddatum; ist es falsch, können Sie innerhalb der Einspruchsfrist beim Hauptzollamt widersprechen.' },
    ],
    body: (h) => `
<h2>Die Regel in zwei Schritten</h2>
<p>Für ein reines Elektroauto gibt es zwei Phasen. In der ersten zahlt es keine Kfz-Steuer: Das ${h.src('kraftstg3d', '§ 3d KraftStG')} befreit alle Fahrzeuge, die zwischen dem ${h.date(h.P.kfz.befreiung_zulassung_von)} und dem ${h.date(h.P.kfz.befreiung_zulassung_bis)} erstmals zugelassen werden, für ${h.P.kfz.befreiung_jahre} Jahre, längstens bis zum ${h.date(h.P.kfz.befreiung_ende_spaetestens)}. In der zweiten Phase gilt der Steuersatz nach ${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 3 KraftStG')}: Er wird aus dem zulässigen Gesamtgewicht berechnet und für Elektroautos um ${h.pct(h.P.kfz.ermaessigung_elektro, 0)} ermäßigt. Hubraum und CO2-Wert spielen dabei keine Rolle.</p>
<h2>Wann die Befreiung endet</h2>
<p>Das Ende ergibt sich aus zwei Daten, von denen das frühere gilt: ${h.P.kfz.befreiung_jahre} Jahre nach der Erstzulassung, oder der ${h.date(h.P.kfz.befreiung_ende_spaetestens)}. Für Autos, die bis Ende 2025 zugelassen wurden, greift meist die Zehnjahresfrist; wer seit Anfang 2026 zulässt, stößt auf die feste Grenze.</p>
${h.table(['Erstzulassung', 'Befreit bis', 'Was greift'], [
  [h.date('2016-06-30'), h.date(z2016.bis!), 'zehn Jahre, schon abgelaufen'],
  [h.date('2021-04-01'), h.date(z2021.bis!), 'zehn Jahre'],
  [h.date('2026-03-15'), h.date(z2026.bis!), 'feste Grenze'],
  [h.date(h.P.kfz.befreiung_zulassung_bis), h.date(befreiung(h.P.kfz.befreiung_zulassung_bis).bis!), 'feste Grenze, letzter Tag'],
], 'Ende der Steuerbefreiung nach § 3d KraftStG', ['l', 'r', 'l'])}
<p>Die ersten Elektroautos, die 2016 zugelassen wurden, zahlen also schon jetzt Steuer. Ein Auto, das nach dem ${h.date(h.P.kfz.befreiung_zulassung_bis)} erstmals zugelassen wird, ist nach heutigem Recht gar nicht mehr befreit. Ob der Gesetzgeber diese Daten noch einmal verschiebt, ist offen; der Rechner verwendet nur das geltende Gesetz.</p>
<h2>Die Steuer nach der Befreiung</h2>
<p>Gerechnet wird in Schritten von ${h.P.kfz.je_kg} kg. Für jeden angefangenen Schritt bis ${h.num(h.P.kfz.stufen[0].bis_kg)} kg fallen ${h.eur(h.P.kfz.stufen[0].eur, 2)} an, bis ${h.num(h.P.kfz.stufen[1].bis_kg)} kg ${h.eur(h.P.kfz.stufen[1].eur, 2)}, bis ${h.num(h.P.kfz.stufen[2].bis_kg)} kg ${h.eur(h.P.kfz.stufen[2].eur, 2)}. Die Summe wird für Elektroautos halbiert. Maßgeblich ist das zulässige Gesamtgewicht in Feld F.2 der Zulassungsbescheinigung, nicht das Leergewicht.</p>
${h.table(['Zulässiges Gesamtgewicht', 'Voller Satz', 'Elektroauto im Jahr', 'Zehn Jahre gespart'], gew.map((z) => [`${h.num(z)} kg`, h.eur(gewichtSteuer(z), 2), h.eur(elektroSteuer(z), 2), h.eur(ersparnis(z, 10), 2)]), 'Kfz-Steuer nach § 9 Abs. 1 Nr. 3 KraftStG mit Ermäßigung für Elektroautos', ['l', 'r', 'r', 'r'])}
<p>Die Ersparnis in der letzten Spalte ist die Steuer, die ein Auto in ${h.P.kfz.befreiung_jahre} vollen Jahren zahlen würde. Wer 2026 zulässt, kommt auf weniger, weil die Befreiung früher endet; der Rechner oben zeigt den genauen Betrag bis zum Enddatum. Im Vergleich zur Förderung beim Kauf und zur jährlichen THG-Prämie ist die Steuer ein kleiner Posten: Ein Kompaktwagen spart im Jahr etwa so viel, wie eine Tankfüllung kostet.</p>
<h2>Plug-in-Hybride: keine Befreiung</h2>
<p>Ein Plug-in-Hybrid hat einen Verbrennungsmotor und ist deshalb nicht nach § 3d befreit. Er zahlt nach ${h.src('kraftstg9', '§ 9 Abs. 1 Nr. 2 KraftStG')} wie jeder Pkw: ${h.eur(h.P.kfz.hubraum_otto_eur, 2)} je angefangene ${h.P.kfz.hubraum_je_ccm} cm³ Hubraum beim Benziner, ${h.eur(h.P.kfz.hubraum_diesel_eur, 2)} beim Diesel, dazu ein gestaffelter Betrag für jedes Gramm CO2 über ${h.P.kfz.co2_frei_g_km} g/km. Weil der gewichtete WLTP-Wert eines Plug-in-Hybrids meist darunter liegt, bleibt der Hubraum.</p>
${h.table(['Beispiel', 'Hubraum', 'CO2', 'Steuer im Jahr'], [
  ['Plug-in-Hybrid, Benziner', '1 498 cm³', '30 g/km', h.eur(ph1, 2)],
  ['Benziner ohne Stecker, zum Vergleich', '1 998 cm³', '120 g/km', h.eur(ph2, 2)],
  ['Elektroauto, 2 000 kg, nach der Befreiung', 'entfällt', 'entfällt', h.eur(elektroSteuer(2000), 2)],
], 'Kfz-Steuer im Vergleich', ['l', 'r', 'r', 'r'])}
<p>Für die Kaufförderung zählt bei einem Plug-in-Hybrid etwas anderes, nämlich der CO2-Wert und die elektrische Reichweite; das erklärt ${h.a('plug-in-hybrid', 'Plug-in-Hybrid-Förderung')}.</p>
<h2>Sonderfälle</h2>
<ul>
<li><strong>Gebrauchtkauf:</strong> Der Käufer übernimmt die restliche Befreiung. Wer ein 2017 zugelassenes Auto kauft, sollte wissen, dass sie im Jahr 2027 endet.</li>
<li><strong>Abmeldung:</strong> Eine Zeit ohne Zulassung verlängert die Befreiung nicht. Die ${h.P.kfz.befreiung_jahre} Jahre laufen ab der Erstzulassung weiter.</li>
<li><strong>Umbau:</strong> Ein auf Elektroantrieb umgerüsteter Verbrenner kann unter Bedingungen ebenfalls befreit sein; maßgeblich ist der Bescheid des Zolls.</li>
<li><strong>Zahlung:</strong> Die Steuer wird nach ${h.src('kraftstg11', '§ 11 KraftStG')} jährlich im Voraus fällig. Halbjährliche Zahlung ist erst bei mehr als ${h.eur(h.P.kfz.halbjahr_ab_eur)} im Jahr möglich, mit Aufschlag; ein Elektroauto erreicht diesen Betrag nicht.</li>
</ul>
<h2>Beispiel: ein Kompaktwagen von 2026 bis 2040</h2>
<p>Ein Haushalt lässt im März 2026 ein neues Elektroauto mit 2 100 kg zulässigem Gesamtgewicht zu. Bis zum ${h.date(z2026.bis!)} zahlt er keine Kfz-Steuer. Ab dem 1. Januar 2036 setzt das Hauptzollamt die ermäßigte Gewichtssteuer fest: elf angefangene Schritte von ${h.P.kfz.je_kg} kg, davon zehn zum ersten und einer zum zweiten Satz, halbiert ${h.eur(ab2036, 2)} im Jahr. Fährt der Haushalt das Auto bis Ende 2039, kommen in diesen vier Jahren ${h.eur(bis2040, 2)} zusammen. Verkauft er es vorher, setzt der Zoll die Steuer für den neuen Halter fest.</p>
<h2>Wo das Gewicht steht</h2>
<p>Der Rechner fragt nach dem zulässigen Gesamtgewicht, weil das Gesetz darauf abstellt. Sie finden es in der Zulassungsbescheinigung Teil I unter F.2, ; daneben steht unter F.1 die technisch zulässige Masse, die meist gleich ist. Das Leergewicht unter G liegt meist 400 bis 500 kg darunter und führt zu einer zu niedrigen Steuer, wenn man es einsetzt. Bei großen Elektro-SUV mit schwerer Batterie kann das zulässige Gesamtgewicht über 2 500 kg liegen; dann greift für die Schritte oberhalb von ${h.num(h.P.kfz.stufen[0].bis_kg)} kg der höhere Satz.</p>
<h2>Elektroauto als Firmenwagen</h2>
<p>Für die Kfz-Steuer macht es keinen Unterschied, ob ein Elektroauto privat oder auf eine Firma zugelassen ist: Die Befreiung und der Satz danach sind dieselben. Für die Kaufförderung dagegen zählt, wer Halter ist, und Firmenwagen sind ausgeschlossen; Einzelheiten stehen unter ${h.a('selbststaendige', 'Selbstständige und Firmenwagen')}.</p>
<h2>Kfz-Steuer und Förderung zusammen sehen</h2>
<p>Die Haltedauer der Kaufförderung beträgt ${h.P.foerderung.haltedauer_monate} Monate; in dieser Zeit fällt bei jedem neuen Elektroauto keine Kfz-Steuer an. Eine Rolle spielt die Steuer erst, wenn Sie über das Jahr 2035 hinaus planen oder ein älteres Elektroauto gebraucht kaufen. Was die Förderung für Ihren Haushalt ergibt, rechnet der ${h.a('home', 'Prämienrechner')}; was ein Verkauf vor Ablauf der Haltedauer bedeutet, steht unter ${h.a('haltedauer', 'Haltedauer und Verkauf')}.</p>
<p>Für die Gesamtrechnung eines Elektroautos lohnt deshalb ein Blick auf die Reihenfolge der Beträge: zuerst die einmalige Förderung, die vom Einkommen abhängt, dann jedes Jahr die THG-Prämie, die jeder Halter bekommt, und erst ganz am Ende eine Kfz-Steuer im zweistelligen Bereich. Wer ein Auto zehn Jahre fährt, merkt von der Steuer in den meisten Fällen nur in den letzten Jahren etwas.</p>`,
  },
  en: {
    slug: 'vehicle-tax',
    nav: 'Vehicle tax',
    card: 'How long your electric car stays exempt from vehicle tax and what it costs afterwards.',
    title: 'Vehicle tax on electric cars 2026: Kfz-Steuer exemption',
    description: `Vehicle tax on electric cars in Germany 2026: ${K.befreiung_jahre} years exempt if first registered by ${datumText(K.befreiung_zulassung_bis, 'en')}, ending 2035 at the latest, then half rate, ${EN.eur(elektroSteuer(2000), 2)} at 2 t.`,
    h1: 'Work out the vehicle tax on your electric car in 2026',
    intro: 'Enter the first registration date and the permitted total weight: the calculator shows when the exemption ends, what tax is due afterwards and how much you save until then.',
    resume: `Battery electric cars in Germany are exempt from vehicle tax (Kfz-Steuer) if they are first registered between ${datumText(K.befreiung_zulassung_von, 'en')} and ${datumText(K.befreiung_zulassung_bis, 'en')}. The exemption under section 3d of the Motor Vehicle Tax Act (KraftStG) lasts ${K.befreiung_jahre} years from first registration but ends on ${datumText(K.befreiung_ende_spaetestens, 'en')} at the latest. A car registered in March 2026 is therefore not exempt until 2036 but until ${dd(z2026.bis, 'en')}. After that, the tax depends on the permitted total weight: for every started ${K.je_kg} kg a rate between ${EN.eur(K.stufen[0].eur, 2)} and ${EN.eur(K.stufen[2].eur, 2)} applies, and electric cars pay half of the total. At 2,000 kg that is ${EN.eur(elektroSteuer(2000), 2)} a year, at 2,600 kg ${EN.eur(elektroSteuer(2600), 2)}. The exemption applies once per vehicle, passes to the new keeper (Halter) when the car is sold, and is not extended by taking the car off the road. Plug-in hybrids are never exempt; they pay by engine size and CO2 emissions.`,
    faqs: [
      { q: 'Until when is my electric car exempt from vehicle tax?', a: `For ${K.befreiung_jahre} years from the day of first registration, but no later than ${datumText(K.befreiung_ende_spaetestens, 'en')}. A car registered in June 2016 was exempt until ${dd(z2016.bis, 'en')}; one registered in April 2021 stays exempt until ${dd(z2021.bis, 'en')}. If you register from 2026 onwards, you no longer get the full ${K.befreiung_jahre} years, because the fixed end date comes first.` },
      { q: 'Does a used EV buyer keep the vehicle tax exemption?', a: 'Yes. The exemption belongs to the vehicle, not to the person. The new keeper takes over the time remaining up to the end date set by the first registration. A change of keeper does not start a new period, and deregistering and registering the car again does not stop the clock either.' },
      { q: 'How much vehicle tax does an electric car pay after the exemption?', a: `The tax depends on the permitted total weight in field F.2 of the registration certificate. A tiered rate applies to every started ${K.je_kg} kg, and electric cars pay ${EN.pct(1 - K.ermaessigung_elektro, 0)} of it. A car of 2,000 kg then costs ${EN.eur(elektroSteuer(2000), 2)} a year, one of 3,000 kg ${EN.eur(elektroSteuer(3000), 2)}. Customs collects the amount yearly in advance.` },
      { q: 'Why is my plug-in hybrid not exempt from vehicle tax?', a: `The section 3d exemption only covers vehicles with purely electric drive. A plug-in hybrid pays like a combustion car, by engine size and CO2 emissions. Because its weighted CO2 value is usually below ${K.co2_frei_g_km} g/km, often only the engine part remains: for a 1,498 cm³ petrol engine that is ${EN.eur(ph1, 0)} a year.` },
      { q: 'Do I have to apply to customs for the exemption?', a: 'No. The registration office reports the car to customs (Zoll), which sets the tax. For an exempt electric car you receive a notice stating the exemption period. Check the end date there; if it is wrong, you can object to the main customs office (Hauptzollamt) within the objection period.' },
    ],
    body: (h) => `
<h2>The rule in two stages</h2>
<p>A battery electric car goes through two phases. In the first it pays no vehicle tax: ${h.src('kraftstg3d', 'section 3d KraftStG')} exempts every vehicle first registered between ${h.date(h.P.kfz.befreiung_zulassung_von)} and ${h.date(h.P.kfz.befreiung_zulassung_bis)} for ${h.P.kfz.befreiung_jahre} years, until ${h.date(h.P.kfz.befreiung_ende_spaetestens)} at most. In the second phase the rate under ${h.src('kraftstg9', 'section 9(1) no. 3 KraftStG')} applies: it is worked out from the permitted total weight and reduced by ${h.pct(h.P.kfz.ermaessigung_elektro, 0)} for electric cars. Engine size and CO2 play no part.</p>
<h2>When the exemption ends</h2>
<p>The end follows from two dates, and the earlier one wins: ${h.P.kfz.befreiung_jahre} years after first registration, or ${h.date(h.P.kfz.befreiung_ende_spaetestens)}. For cars registered up to the end of 2025 the ten-year period usually decides; anyone registering from early 2026 runs into the fixed limit.</p>
${h.table(['First registration', 'Exempt until', 'What applies'], [
  [h.date('2016-06-30'), h.date(z2016.bis!), 'ten years, already over'],
  [h.date('2021-04-01'), h.date(z2021.bis!), 'ten years'],
  [h.date('2026-03-15'), h.date(z2026.bis!), 'fixed limit'],
  [h.date(h.P.kfz.befreiung_zulassung_bis), h.date(befreiung(h.P.kfz.befreiung_zulassung_bis).bis!), 'fixed limit, last day'],
], 'End of the section 3d exemption', ['l', 'r', 'l'])}
<p>The first electric cars registered in 2016 are already paying tax. A car first registered after ${h.date(h.P.kfz.befreiung_zulassung_bis)} is not exempt at all under current law. Whether lawmakers move these dates again is open; the calculator only uses the law as it stands.</p>
<h2>The tax after the exemption</h2>
<p>The tax is counted in steps of ${h.P.kfz.je_kg} kg. Each started step up to ${h.num(h.P.kfz.stufen[0].bis_kg)} kg costs ${h.eur(h.P.kfz.stufen[0].eur, 2)}, up to ${h.num(h.P.kfz.stufen[1].bis_kg)} kg ${h.eur(h.P.kfz.stufen[1].eur, 2)}, up to ${h.num(h.P.kfz.stufen[2].bis_kg)} kg ${h.eur(h.P.kfz.stufen[2].eur, 2)}. For electric cars the total is halved. What counts is the permitted total weight in field F.2 of the registration certificate (Zulassungsbescheinigung Teil I), not the kerb weight.</p>
${h.table(['Permitted total weight', 'Full rate', 'Electric car per year', 'Ten years saved'], gew.map((z) => [`${h.num(z)} kg`, h.eur(gewichtSteuer(z), 2), h.eur(elektroSteuer(z), 2), h.eur(ersparnis(z, 10), 2)]), 'Vehicle tax under section 9(1) no. 3 KraftStG with the electric reduction', ['l', 'r', 'r', 'r'])}
<p>The saving in the last column is the tax a car would pay over ${h.P.kfz.befreiung_jahre} full years. If you register in 2026 you save less, because the exemption ends earlier; the calculator above shows the exact amount up to the end date. Next to the purchase grant and the yearly quota payout, vehicle tax is a small item: a compact car saves roughly the price of one tank of fuel a year.</p>
<h2>Plug-in hybrids: no exemption</h2>
<p>A plug-in hybrid has a combustion engine and so is not exempt under section 3d. It pays under ${h.src('kraftstg9', 'section 9(1) no. 2 KraftStG')} like any car: ${h.eur(h.P.kfz.hubraum_otto_eur, 2)} per started ${h.P.kfz.hubraum_je_ccm} cm³ for petrol, ${h.eur(h.P.kfz.hubraum_diesel_eur, 2)} for diesel, plus a tiered amount for every gram of CO2 above ${h.P.kfz.co2_frei_g_km} g/km. Since a plug-in hybrid’s weighted WLTP figure is usually below that, the engine part is what remains.</p>
${h.table(['Example', 'Engine', 'CO2', 'Tax a year'], [
  ['Plug-in hybrid, petrol', '1,498 cm³', '30 g/km', h.eur(ph1, 2)],
  ['Petrol car without a plug, for comparison', '1,998 cm³', '120 g/km', h.eur(ph2, 2)],
  ['Electric car, 2,000 kg, after the exemption', 'none', 'none', h.eur(elektroSteuer(2000), 2)],
], 'Vehicle tax compared', ['l', 'r', 'r', 'r'])}
<p>For the purchase grant a plug-in hybrid is judged on something else, its CO2 figure and electric range; that is covered under ${h.a('plug-in-hybrid', 'plug-in hybrid grant')}.</p>
<h2>Special cases</h2>
<ul>
<li><strong>Buying used:</strong> the buyer takes over the remaining exemption. If you buy a car first registered in 2017, it ends in 2027.</li>
<li><strong>Deregistration:</strong> time off the road does not extend the exemption. The ${h.P.kfz.befreiung_jahre} years keep running from first registration.</li>
<li><strong>Conversions:</strong> a combustion car converted to electric drive can also be exempt under conditions; the customs notice decides.</li>
<li><strong>Payment:</strong> under ${h.src('kraftstg11', 'section 11 KraftStG')} the tax is due yearly in advance. Half-yearly payment is only possible above ${h.eur(h.P.kfz.halbjahr_ab_eur)} a year, with a surcharge; an electric car never reaches that.</li>
</ul>
<h2>Example: a compact car from 2026 to 2040</h2>
<p>A household registers a new electric car with a permitted total weight of 2,100 kg in March 2026. It pays no vehicle tax until ${h.date(z2026.bis!)}. From 1 January 2036 the main customs office sets the reduced weight tax: eleven started steps of ${h.P.kfz.je_kg} kg, ten at the first rate and one at the second, halved to ${h.eur(ab2036, 2)} a year. If the household keeps the car to the end of 2039, those four years add up to ${h.eur(bis2040, 2)}. If it sells earlier, the buyer takes over the tax notice.</p>
<h2>Where to find the weight</h2>
<p>The calculator asks for the permitted total weight because the law is based on it. You find it in field F.2 of part I of the registration certificate. The kerb weight in field G is usually 400 to 500 kg lower and gives a tax figure that is too low if you use it. Large electric SUVs with heavy batteries can exceed 2,500 kg permitted weight, in which case the higher rate applies to the steps above ${h.num(h.P.kfz.stufen[0].bis_kg)} kg.</p>
<h2>Electric company cars</h2>
<p>For vehicle tax it makes no difference whether an electric car is registered privately or to a company: the exemption and the later rate are the same. For the purchase grant, by contrast, the keeper matters and company cars are excluded; details are under ${h.a('selbststaendige', 'self-employed and company cars')}.</p>
<h2>Vehicle tax and the grant side by side</h2>
<p>The purchase grant comes with a holding period of ${h.P.foerderung.haltedauer_monate} months, and during that time no new electric car pays vehicle tax. Tax only matters if you plan beyond 2035 or buy an older electric car second-hand. What the grant comes to for your household is on the ${h.a('home', 'grant calculator')}; what selling before the end of the holding period means is under ${h.a('haltedauer', 'holding period and resale')}.</p>`,
  },
});
