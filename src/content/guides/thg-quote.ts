import { defineGuide } from '../../lib/guide-types';
import { angerechnet, schaetzwert } from '../../lib/engine/thg';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * THG-Quote: die Regel hinter der Prämie. 38. BImSchV, Rolle des Umweltbundesamts, Gesetz zur Weiterentwicklung
 * der Quote (Bundestag 24.4.2026), THG-Wert des Stroms 2026. Beispiele: Strommenge eines Haushalts mit zwei Autos,
 * eines Handwerksbetriebs mit Transportern. Keine Tonnen CO2 rechnen (fakten.md).
 */
const T = P.thg;
const fristEn = T.frist_mitteilung.replace(/^(\d+)\. Februar$/, '$1 February');
const zweiPkw = 2 * angerechnet('m1');
const betrieb = 2 * angerechnet('m1') + 3 * angerechnet('n1');
const betriebRoh = 2 * schaetzwert('m1') + 3 * schaetzwert('n1');
const beschluss = (l: 'de' | 'en') => datumText(T.bundestag_beschluss, l);

export default defineGuide({
  id: 'thg-quote',
  group: 'kosten',
  order: 20,
  mini: 'kQuote',
  miniHref: 'thg-praemie',
  related: ['thg-praemie', 'kfz-steuer', 'wallbox', 'leasing'],
  sources: ['bimschv38', 'ubaSchaetzwert', 'ubaThgWert', 'bundestagThg', 'uba'],
  de: {
    slug: 'thg-quote',
    nav: 'THG-Quote',
    card: 'Die Regel hinter der Prämie: Gesetz, Schätzwert, Faktor drei und die Änderung von 2026.',
    title: 'THG-Quote 2026: Gesetz, Schätzwert und Rolle des UBA',
    description: `THG-Quote 2026 erklärt: Strom aus Elektroautos zählt ${T.multiplikator_strom}-fach, ${DE.num(schaetzwert('m1'))} kWh je Pkw, Gesetz im April 2026 vom Bundestag beschlossen, Quote bis ${DE.pct(T.quote_2040, 0)} im Jahr 2040.`,
    h1: 'THG-Quote 2026: was hinter der Prämie steht',
    intro: 'Wer die THG-Prämie verstehen will, muss die Quote kennen: wer sie erfüllen muss, wie Strom aus Ihrem Auto darauf zählt und was sich 2026 geändert hat.',
    resume: `Die Treibhausgasminderungsquote, kurz THG-Quote, verpflichtet Unternehmen, die Benzin und Diesel in Deutschland verkaufen, die Emissionen ihrer Kraftstoffe jedes Jahr um einen festgelegten Anteil zu senken. Eine Möglichkeit, das zu erreichen, ist Strom, der in Elektrofahrzeugen verbraucht wird. Die 38. Bundes-Immissionsschutzverordnung erlaubt, diesen Strom ${T.multiplikator_strom}-fach anzurechnen. Weil Privatleute ihren Ladestrom nicht messen, setzt das Umweltbundesamt für jeden reinen Elektro-Pkw einen Schätzwert von ${DE.num(schaetzwert('m1'))} kWh im Jahr an, für einen leichten Transporter ${DE.num(schaetzwert('n1'))} kWh; angerechnet werden also ${DE.num(angerechnet('m1'))} und ${DE.num(angerechnet('n1'))} kWh. Für 2026 gilt ein THG-Wert des Stroms von ${DE.num(T.thg_wert_strom_2026_kg_gj)} kg CO2-Äquivalent je Gigajoule. Am ${beschluss('de')} hat der Bundestag ein Gesetz beschlossen, das die Quote bis 2040 auf ${DE.pct(T.quote_2040, 0)} anhebt. Halter verkaufen ihren Anteil über einen Anbieter; der Erlös ist die THG-Prämie.`,
    faqs: [
      { q: 'Wer ist bei der THG-Quote verpflichtet und wer profitiert?', a: 'Verpflichtet sind Unternehmen, die fossile Kraftstoffe in Verkehr bringen, also vor allem Mineralölgesellschaften. Profitieren können alle, die anrechenbare Minderungen liefern, darunter Betreiber von Ladepunkten. Ein privater Halter eines Elektroautos gilt dabei selbst als Betreiber seines Ladepunkts und kann seine Strommenge deshalb über einen Anbieter verkaufen.' },
      { q: 'Warum zählt Strom bei der THG-Quote dreifach?', a: `Die Verordnung rechnet Strom für Elektrofahrzeuge mit dem Faktor ${P.thg.multiplikator_strom} an, um Elektromobilität im Verkehr zu begünstigen. Ein Pkw mit ${DE.num(schaetzwert('m1'))} kWh Schätzwert steht so für ${DE.num(angerechnet('m1'))} kWh auf der Quote. Berichte über eine Änderung dieses Faktors stammen nicht aus einem amtlichen Text; maßgeblich bleibt, was im Bundesgesetzblatt steht.` },
      { q: 'Was hat das Gesetz zur THG-Quote von 2026 geändert?', a: `Der Bundestag hat am ${beschluss('de')} die Weiterentwicklung der Quote beschlossen, der Bundesrat hat im Mai 2026 ohne Vermittlungsausschuss zugestimmt. Die Quote steigt danach schrittweise bis auf ${DE.pct(P.thg.quote_2040, 0)} im Jahr 2040. Die Zwischenschritte nach 2026 sind angekündigt und gelten erst in ihrem jeweiligen Jahr; für Halter ändert sich am Verfahren nichts.` },
      { q: 'Prüft das Umweltbundesamt jeden einzelnen Fahrzeugschein?', a: `Das Umweltbundesamt bescheinigt die Strommengen, die ein Anbieter gebündelt einreicht, und prüft dabei die Angaben der Fahrzeuge. Am ${datumText(P.thg.uba_bearbeitung_stand, 'de')} bearbeitete es Anträge für 2026, die seit dem ${datumText(P.thg.uba_bearbeitung_eingang_ab, 'de')} eingegangen waren. Seit April 2026 erhebt es dafür Gebühren, die der Anbieter trägt.` },
      { q: 'Kann ich meinen Ladestrom statt des Schätzwerts abrechnen?', a: 'Als privater Halter ohne öffentlich zugänglichen Ladepunkt nutzen Sie den Schätzwert; ob Sie mehr oder weniger fahren, ändert nichts. Wer einen öffentlich zugänglichen Ladepunkt betreibt, kann dagegen die gemessene Strommenge geltend machen. Das betrifft Unternehmen und Betreiber von Ladesäulen, nicht die Wallbox in der eigenen Garage.' },
    ],
    body: (h) => `
<h2>Eine Pflicht für Mineralölunternehmen, ein Markt für Halter</h2>
<p>Das Bundes-Immissionsschutzgesetz legt fest, um welchen Anteil die Treibhausgasemissionen der in Verkehr gebrachten Kraftstoffe sinken müssen. Wer diese Pflicht hat, kann sie auf mehreren Wegen erfüllen: Biokraftstoffe beimischen, grünen Wasserstoff einsetzen oder Minderungen anderer anrechnen lassen. Die ${h.src('bimschv38', '38. BImSchV')} beschreibt, wie Strom für Elektrofahrzeuge dazu beiträgt. Damit entsteht ein Markt: Auf der einen Seite stehen Unternehmen, die Quote brauchen, auf der anderen Halter von Elektroautos, die Strommengen liefern können. Anbieter dazwischen sammeln tausende Fahrzeuge, lassen die Mengen bescheinigen und verkaufen sie in großen Paketen.</p>
<h2>Vom Fahrzeugschein zur bescheinigten Menge</h2>
<ol>
<li>Sie laden die Zulassungsbescheinigung Teil I bei einem Anbieter hoch. Er prüft, ob das Fahrzeug rein elektrisch fährt und Sie Halter sind.</li>
<li>Der Anbieter meldet die gesammelten Fahrzeuge beim ${h.src('uba', 'Umweltbundesamt')}, spätestens bis zum ${h.P.thg.frist_mitteilung} des Folgejahres.</li>
<li>Das Amt bescheinigt für jedes Fahrzeug den ${h.src('ubaSchaetzwert', 'Schätzwert')}; doppelte Meldungen desselben Autos im selben Jahr fallen dabei auf.</li>
<li>Der Anbieter verkauft die bescheinigte Menge an ein verpflichtetes Unternehmen, das sie auf seine Quote anrechnen lässt.</li>
<li>Sie erhalten den vereinbarten Betrag. Wie viel das ist, erklärt die Seite ${h.a('thg-praemie', 'THG-Prämie')}.</li>
</ol>
<h2>Die Zahlen, mit denen gerechnet wird</h2>
${h.table(['Größe', 'Wert 2026', 'Herkunft'], [
  ['Schätzwert Elektro-Pkw (M1)', `${h.num(schaetzwert('m1'))} kWh im Jahr`, 'Bekanntmachung des Umweltbundesamts'],
  ['Schätzwert leichtes Nutzfahrzeug (N1)', `${h.num(schaetzwert('n1'))} kWh im Jahr`, 'Bekanntmachung des Umweltbundesamts'],
  ['Faktor für Strom', `× ${h.P.thg.multiplikator_strom}`, '38. BImSchV'],
  ['THG-Wert des Stroms', `${h.num(h.P.thg.thg_wert_strom_2026_kg_gj)} kg CO2-Äq. je GJ`, 'Bekanntmachung für 2026'],
  ['Quote im Jahr 2040', h.pct(h.P.thg.quote_2040, 0), `Gesetzesbeschluss vom ${h.date(h.P.thg.bundestag_beschluss)}`],
], 'Rechengrößen der THG-Quote', ['l', 'r', 'l'])}
<p>Der ${h.src('ubaThgWert', 'THG-Wert des Stroms')} beschreibt, wie viel Treibhausgas der deutsche Strommix je Energieeinheit verursacht. Je sauberer der Strom, desto größer der Abstand zu Benzin und Diesel und desto mehr Minderung bringt eine Kilowattstunde. Für den Halter spielt diese Größe keine direkte Rolle: Er verkauft eine Strommenge, keine Tonnen CO2. Eine Umrechnung in eingesparte Tonnen wäre hier eine Schätzung, die keine amtliche Stelle für einzelne Autos veröffentlicht.</p>
<h2>Was das Gesetz von 2026 bedeutet</h2>
<p>Am ${h.date(h.P.thg.bundestag_beschluss)} hat der ${h.src('bundestagThg', 'Bundestag')} das Gesetz zur Weiterentwicklung der Quote beschlossen. Es hebt die Pflicht der Mineralölunternehmen in Stufen an, bis auf ${h.pct(h.P.thg.quote_2040, 0)} im Jahr 2040. Eine höhere Pflicht bedeutet mehr Nachfrage nach Minderungen, also tendenziell stabilere Preise für Quoten. Ob sich das in den Prämien der kommenden Jahre zeigt, hängt aber auch davon ab, wie viele Elektroautos und andere Erfüllungsoptionen auf den Markt kommen. Die Werte für 2027 und später sind beschlossen und angekündigt, gelten aber jeweils erst in ihrem Jahr. In Ratgebern kursieren außerdem Angaben zu einem geänderten Faktor für Strom; einen amtlichen Text dazu gibt es nicht, deshalb rechnet diese Seite weiter mit dem Faktor ${h.P.thg.multiplikator_strom}.</p>
<h2>Beispiel: Haushalt mit zwei Autos</h2>
<p>Eine Familie fährt zwei Elektro-Pkw, beide auf sie zugelassen. Für jedes Auto setzt das Amt ${h.num(schaetzwert('m1'))} kWh an, zusammen werden ${h.num(zweiPkw)} kWh auf die Quote angerechnet. Sind die beiden Autos auf zwei verschiedene Personen zugelassen, verkauft jede ihr eigenes Auto; zusammenlegen lässt sich nichts, weil der Halter im Schein entscheidet.</p>
<h2>Beispiel: Handwerksbetrieb mit Transportern</h2>
<p>Ein Betrieb hat zwei Elektro-Pkw und drei elektrische Transporter der Klasse N1 zugelassen. Vor dem Faktor sind das ${h.num(betriebRoh)} kWh, angerechnet ${h.num(betrieb)} kWh. Anbieter zahlen für Nutzfahrzeuge eigene Preise, und für Flotten gibt es oft eigene Verträge. Den Mini-Rechner oben können Sie mit Ihren Stückzahlen füllen.</p>
${h.table(['Fuhrpark', 'Schätzwert', 'Angerechnet'], [
  ['1 Pkw', `${h.num(schaetzwert('m1'))} kWh`, `${h.num(angerechnet('m1'))} kWh`],
  ['2 Pkw', `${h.num(2 * schaetzwert('m1'))} kWh`, `${h.num(zweiPkw)} kWh`],
  ['2 Pkw und 3 Transporter', `${h.num(betriebRoh)} kWh`, `${h.num(betrieb)} kWh`],
], 'Angerechnete Strommenge je Jahr', ['l', 'r', 'r'])}
<h2>Was nicht auf die Quote zählt</h2>
<ul>
<li>Plug-in-Hybride: Der Schätzwert gilt nur für reine Elektrofahrzeuge, auch wenn ein Hybrid viel elektrisch fährt.</li>
<li>Elektro-Motorräder und Leichtfahrzeuge: Sie sind in eigenen Klassen eingetragen; ob ein Anbieter sie annimmt, steht in seinen Bedingungen.</li>
<li>Ein Auto, das im Quotenjahr schon von einem früheren Halter verkauft wurde.</li>
<li>Eine Meldung nach dem Stichtag des Anbieters, auch wenn die gesetzliche Frist noch läuft.</li>
</ul>
<h2>Wie der Preis einer Quote entsteht</h2>
<p>Kein Gesetz nennt einen Preis je Kilowattstunde. Die verpflichteten Unternehmen vergleichen, was sie eine Tonne Minderung auf dem jeweils günstigsten Weg kostet: Biokraftstoff, Wasserstoff, Strom oder die Strafzahlung, die fällig wird, wenn sie ihre Pflicht verfehlen. Die Strafzahlung wirkt wie eine Obergrenze, denn mehr als sie würde niemand für eine Quote bezahlen. Nach unten drückt ein großes Angebot: In Jahren, in denen viele Elektroautos neu zugelassen werden oder viel Biokraftstoff angerechnet wird, fallen die Preise. Deshalb schwankten die Prämien für Halter in den vergangenen Jahren stark, und deshalb ist ein Betrag, den ein Anbieter für ein Jahr zusagt, keine Aussage über das nächste. Die steigende Pflicht bis 2040 spricht eher für Nachfrage, die wachsende Zahl von Elektroautos eher für mehr Angebot.</p>
<h2>Drei Missverständnisse</h2>
<p>Erstens: Die Prämie ist keine Förderung des Staates und hat mit dem BAFA nichts zu tun; sie wird zwischen Unternehmen gehandelt. Zweitens: Wer viel fährt, bekommt nicht mehr, denn der Schätzwert ist eine Pauschale für jedes Fahrzeug. Drittens: Die gesetzliche Meldefrist im Folgejahr ist nicht die Frist, die für Sie gilt; maßgeblich ist der Stichtag des Anbieters, bei dem Sie Ihren Schein einreichen.</p>
<h2>Was Sie für die Meldung brauchen</h2>
<p>Mehr als ein gut lesbares Foto oder einen Scan der Vorder- und Rückseite der Zulassungsbescheinigung Teil I verlangt kein Anbieter, dazu Ihre Kontoverbindung für die Auszahlung. Eine Rechnung über den Strom, ein Ladeprotokoll oder einen Nachweis über eine Wallbox braucht es nicht, weil der Schätzwert gilt.</p>
<h2>Die Quote und die Kaufförderung</h2>
<p>Die Quote ist ein Instrument des Klimaschutzrechts für Kraftstoffe, die Kaufförderung eine Zuwendung aus dem Bundeshaushalt. Beide gelten nebeneinander: Wer mit der Förderung ein Elektroauto kauft, kann ab dem Zulassungsjahr zusätzlich jedes Jahr die Quote verkaufen. Die Haltedauer der Förderung von ${h.P.foerderung.haltedauer_monate} Monaten berührt die Quote nicht, und ein Verkauf der Quote gefährdet die Förderung nicht. Wie die Steuer dazukommt, zeigt der ${h.a('kfz-steuer', 'Kfz-Steuer-Rechner')}; was das Laden zu Hause kostet und welche Zuschüsse es gibt, steht unter ${h.a('wallbox', 'Wallbox-Förderung')}.</p>`,
  },
  en: {
    slug: 'ghg-quota-rules',
    nav: 'GHG quota rules',
    card: 'The rule behind the payout: the law, the estimate, the factor of three and the 2026 change.',
    title: 'GHG quota rules 2026: THG-Quote law and the UBA estimate',
    description: `GHG quota rules 2026 explained: EV electricity counts ${T.multiplikator_strom} times, ${EN.num(schaetzwert('m1'))} kWh per car, a new law passed by the Bundestag, the quota rising to ${EN.pct(T.quote_2040, 0)} in 2040.`,
    h1: 'The GHG quota in 2026: what sits behind the payout',
    intro: 'To make sense of the payout you need the quota itself: who has to meet it, how electricity from your car counts and what changed in 2026.',
    resume: `Germany’s greenhouse gas reduction quota (Treibhausgasminderungsquote, or THG-Quote) obliges companies that sell petrol and diesel to cut the emissions of their fuels by a set share each year. One way to do that is electricity used by electric vehicles. The 38th Federal Immission Control Ordinance (38. BImSchV) lets that electricity count ${T.multiplikator_strom} times. Because private keepers do not meter their charging, the Federal Environment Agency (Umweltbundesamt, UBA) assumes a flat ${EN.num(schaetzwert('m1'))} kWh a year for every battery electric car and ${EN.num(schaetzwert('n1'))} kWh for a light van, so ${EN.num(angerechnet('m1'))} and ${EN.num(angerechnet('n1'))} kWh are credited. For 2026 the greenhouse gas value of electricity is ${EN.num(T.thg_wert_strom_2026_kg_gj)} kg of CO2 equivalent per gigajoule. On ${beschluss('en')} the Bundestag passed a law raising the quota step by step to ${EN.pct(T.quote_2040, 0)} by 2040. Keepers sell their share through a provider, and the proceeds are the payout.`,
    faqs: [
      { q: 'Who must meet the GHG quota and who benefits from it?', a: 'The obligation lies with companies that put fossil fuels on the market, mainly oil companies. Anyone who supplies a creditable reduction can benefit, including operators of charging points. A private keeper of an electric car counts as the operator of their own charging point, which is why they can sell their electricity through a provider.' },
      { q: 'Why does EV electricity count three times towards the quota?', a: `The ordinance credits electricity for electric vehicles with a factor of ${P.thg.multiplikator_strom} to favour electric driving in transport. A car with a ${EN.num(schaetzwert('m1'))} kWh estimate therefore stands for ${EN.num(angerechnet('m1'))} kWh on the quota. Reports of a change to this factor do not come from an official text; what counts is what is published in the Federal Law Gazette.` },
      { q: 'What did the 2026 GHG quota law change?', a: `On ${beschluss('en')} the Bundestag passed the further development of the quota, and the Bundesrat agreed in May 2026 without calling the mediation committee. The quota now rises in steps to ${EN.pct(P.thg.quote_2040, 0)} in 2040. The steps after 2026 are announced and only apply in their own year; for keepers the procedure stays the same.` },
      { q: 'Does the Federal Environment Agency check each registration?', a: `The agency certifies the electricity that a provider submits in bulk and checks the vehicle details in doing so. On ${datumText(P.thg.uba_bearbeitung_stand, 'en')} it was processing 2026 claims received from ${datumText(P.thg.uba_bearbeitung_eingang_ab, 'en')}. Since April 2026 it has charged fees for this, which the provider pays.` },
      { q: 'Can I use my metered charging instead of the flat estimate?', a: 'As a private keeper without a publicly accessible charging point you use the estimate, and driving more or less changes nothing. Someone who runs a publicly accessible charging point can claim the metered amount instead. That concerns businesses and charging station operators, not the wallbox in your own garage.' },
    ],
    body: (h) => `
<h2>A duty for oil companies, a market for keepers</h2>
<p>The Federal Immission Control Act sets by how much the greenhouse gas emissions of fuel sold in Germany must fall. Companies under that duty can meet it in several ways: blending biofuels, using green hydrogen, or having other parties’ reductions credited to them. The ${h.src('bimschv38', '38th BImSchV')} sets out how electricity for electric vehicles contributes. That creates a market: on one side, companies that need quota; on the other, keepers of electric cars who can supply electricity. Providers in between collect thousands of cars, have the amounts certified and sell them in large bundles.</p>
<h2>From registration to certified amount</h2>
<ol>
<li>You upload part I of your registration certificate (Zulassungsbescheinigung Teil I) to a provider, who checks that the car is fully electric and that you are the keeper (Halter).</li>
<li>The provider reports the collected cars to the ${h.src('uba', 'Federal Environment Agency')} by ${fristEn} of the following year at the latest.</li>
<li>The agency certifies the ${h.src('ubaSchaetzwert', 'flat estimate')} for each car; the same car reported twice in one year is caught at this point.</li>
<li>The provider sells the certified amount to an obliged company, which has it credited to its quota.</li>
<li>You receive the agreed sum. How much that is, is covered on the ${h.a('thg-praemie', 'GHG quota payout')} page.</li>
</ol>
<h2>The figures used</h2>
${h.table(['Item', '2026 value', 'Origin'], [
  ['Estimate, electric car (M1)', `${h.num(schaetzwert('m1'))} kWh a year`, 'Federal Environment Agency notice'],
  ['Estimate, light commercial vehicle (N1)', `${h.num(schaetzwert('n1'))} kWh a year`, 'Federal Environment Agency notice'],
  ['Factor for electricity', `× ${h.P.thg.multiplikator_strom}`, '38th BImSchV'],
  ['Greenhouse gas value of electricity', `${h.num(h.P.thg.thg_wert_strom_2026_kg_gj)} kg CO2e per GJ`, 'Notice for 2026'],
  ['Quota in 2040', h.pct(h.P.thg.quote_2040, 0), `Law passed on ${h.date(h.P.thg.bundestag_beschluss)}`],
], 'Figures behind the GHG quota', ['l', 'r', 'l'])}
<p>The ${h.src('ubaThgWert', 'greenhouse gas value of electricity')} describes how much greenhouse gas the German power mix causes per unit of energy. The cleaner the power, the wider the gap to petrol and diesel, and the more reduction one kilowatt hour delivers. For you as keeper this number plays no direct part: you sell an amount of electricity, not tonnes of CO2. Turning it into tonnes saved for a single car would be an estimate that no official body publishes.</p>
<h2>What the 2026 law means</h2>
<p>On ${h.date(h.P.thg.bundestag_beschluss)} the ${h.src('bundestagThg', 'Bundestag')} passed the law developing the quota further. It raises the oil companies’ duty in steps to ${h.pct(h.P.thg.quote_2040, 0)} in 2040. A higher duty means more demand for reductions, which tends to support quota prices. Whether that shows up in payouts over the coming years also depends on how many electric cars and other compliance options enter the market. The values for 2027 onwards are passed and announced, but each applies only in its own year. Guides also mention a changed factor for electricity; there is no official text for that, so this page keeps working with a factor of ${h.P.thg.multiplikator_strom}.</p>
<h2>Example: a household with two cars</h2>
<p>A family runs two electric cars, both registered to them. The agency assumes ${h.num(schaetzwert('m1'))} kWh for each, so ${h.num(zweiPkw)} kWh are credited in total. If the cars are registered to two different people, each sells their own; nothing can be pooled, because the keeper on the certificate decides.</p>
<h2>Example: a trade business with vans</h2>
<p>A business has two electric cars and three electric N1 vans registered. Before the factor that is ${h.num(betriebRoh)} kWh, credited ${h.num(betrieb)} kWh. Providers price commercial vehicles separately and often offer fleet contracts. You can enter your own numbers in the small calculator above.</p>
${h.table(['Fleet', 'Estimate', 'Credited'], [
  ['1 car', `${h.num(schaetzwert('m1'))} kWh`, `${h.num(angerechnet('m1'))} kWh`],
  ['2 cars', `${h.num(2 * schaetzwert('m1'))} kWh`, `${h.num(zweiPkw)} kWh`],
  ['2 cars and 3 vans', `${h.num(betriebRoh)} kWh`, `${h.num(betrieb)} kWh`],
], 'Credited electricity per year', ['l', 'r', 'r'])}
<h2>What does not count</h2>
<ul>
<li>Plug-in hybrids: the estimate only covers battery electric vehicles, however much a hybrid drives on electricity.</li>
<li>Electric motorbikes and light vehicles: they are registered in their own classes, and whether a provider accepts them is in its terms.</li>
<li>A car whose quota for the year has already been sold by a previous keeper.</li>
<li>A claim after the provider’s cut-off, even if the legal deadline is still open.</li>
</ul>
<h2>How a quota price comes about</h2>
<p>No law sets a price per kilowatt hour. Obliged companies compare what a tonne of reduction costs them by the cheapest route: biofuel, hydrogen, electricity, or the penalty they owe if they miss their target. The penalty works as a ceiling, since nobody would pay more than that for quota. A large supply pushes prices down: in years when many electric cars are newly registered or a lot of biofuel is credited, prices fall. That is why keeper payouts have swung widely in past years, and why an amount promised for one year says nothing about the next.</p>
<h2>What you need to report a car</h2>
<p>Providers ask for nothing more than a clear photo or scan of the front and back of part I of the registration certificate, plus your bank details for the payout. No electricity bill, charging log or proof of a wallbox is needed, because the flat estimate applies.</p>
<h2>The quota and the purchase grant</h2>
<p>The quota is a climate law instrument for fuels; the purchase grant is a payment from the federal budget. They run side by side: if you buy an electric car with the grant, you can also sell the quota every year from the year of registration. The grant’s holding period of ${h.P.foerderung.haltedauer_monate} months has no effect on the quota, and selling the quota does not put the grant at risk. How tax fits in is on the ${h.a('kfz-steuer', 'vehicle tax calculator')}; what charging at home costs and which grants exist is under ${h.a('wallbox', 'wallbox grant')}.</p>`,
  },
});
