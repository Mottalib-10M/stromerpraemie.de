import { defineGuide } from '../../lib/guide-types';
import { fristen, zeitraumOk } from '../../lib/engine/foerderung';
import { datumText, teile } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Laufzeit: Richtlinie 19.5.2026 bis 31.12.2029; Erstzulassung BEV bis 31.12.2029, PHEV/EREV bis 30.6.2027.
 * Danach für PHEV nur eine angekündigte Prüfung (realer CO2-Ausstoß). Kein Rechtsanspruch, Mittel aus dem KTF,
 * Förderstopp möglich. Offene Frage: Anträge 2030 für Zulassungen Ende 2029 (Richtlinie endet am selben Tag).
 */
const F = P.foerderung;
const monateBis = (von: string, bis: string) => { const [a, b] = teile(von), [c, d] = teile(bis); return (c * 12 + d) - (a * 12 + b); };
const heute = '2026-10-19';
const tageSeitStart = Math.round((Date.parse(F.statistik_stand) - Date.parse(F.richtlinie_datum)) / 86400000);
const jeTag = Math.round(F.bewilligungen / tageSeitStart);
const mittel = Math.round((F.ausgezahlt_mio * 1e6) / F.bewilligungen);
const daten = ['2026-11-01', '2027-06-30', '2027-07-01', '2028-06-01', '2029-12-31', '2030-01-01'];

export default defineGuide({
  id: 'laufzeit',
  group: 'antrag',
  order: 60,
  mini: 'aLauf',
  related: ['plug-in-hybrid', 'statistik', 'antrag', 'neuwagen'],
  sources: ['richtlinie', 'bafaFaq', 'bmukn', 'breg', 'bafaStatistik'],
  de: {
    slug: 'laufzeit-foerderung',
    nav: 'Laufzeit bis 2029',
    card: 'Wie lange die Förderung läuft, was für 2027 angekündigt ist und warum ein früheres Ende möglich bleibt.',
    title: 'E-Auto-Förderung 2027: Laufzeit von 2026 bis Ende 2029',
    description: `E-Auto-Förderung 2026 bis 2029: Elektroautos mit Erstzulassung bis ${datumText(F.bev_erstzulassung_bis, 'de')}, Plug-in-Hybride bis ${datumText(F.phev_erstzulassung_bis, 'de')}; was für 2027 angekündigt ist.`,
    h1: 'Wie lange die E-Auto-Förderung läuft',
    intro: 'Die Förderung ist auf mehrere Jahre angelegt, aber nicht für alle Antriebe gleich lang, und sie steht unter dem Vorbehalt verfügbarer Mittel. Was feststeht, was angekündigt ist und was offen bleibt.',
    resume: `Die Förderrichtlinie für Elektroautos gilt vom ${datumText(F.richtlinie_datum, 'de')} bis zum ${datumText(F.richtlinie_gueltig_bis, 'de')}. Reine Elektroautos und Brennstoffzellenfahrzeuge werden gefördert, wenn sie zwischen dem ${datumText(F.erstzulassung_ab, 'de')} und dem ${datumText(F.bev_erstzulassung_bis, 'de')} erstmals in Deutschland zugelassen werden. Für Plug-in-Hybride und Range Extender endet der Zeitraum schon am ${datumText(F.phev_erstzulassung_bis, 'de')}. Für die Zeit danach prüft die Bundesregierung nach Angaben des BAFA eine Förderung dieser Fahrzeuge, die sich am CO2-Ausstoß im realen Betrieb orientiert; das ist angekündigt, nicht beschlossen. Auf die Förderung besteht kein Rechtsanspruch. Sie wird aus dem Klima- und Transformationsfonds bezahlt, solange Mittel da sind, und kann vorzeitig enden. Bis zum ${datumText(F.statistik_stand, 'de')} hatte das BAFA ${DE.num(F.bewilligungen)} Anträge bewilligt und ${DE.num(F.ausgezahlt_mio)} Millionen Euro ausgezahlt, im Schnitt rund ${DE.num(jeTag)} Bewilligungen je Tag seit dem Start. Wer im Oktober 2026 plant, hat für ein Elektroauto noch ${DE.num(monateBis(heute, F.bev_erstzulassung_bis))} Monate, für einen Plug-in-Hybrid noch ${DE.num(monateBis(heute, F.phev_erstzulassung_bis))}.`,
    faqs: [
      { q: 'Gibt es die E-Auto-Förderung auch 2027 noch?', a: `Für reine Elektroautos ja, nach der geltenden Richtlinie bis zur Erstzulassung am ${datumText(F.bev_erstzulassung_bis, 'de')}, mit denselben Beträgen. Für Plug-in-Hybride endet sie mit Zulassungen bis zum ${datumText(F.phev_erstzulassung_bis, 'de')}. Beides gilt nur, solange Mittel verfügbar sind; ein Rechtsanspruch besteht nicht.` },
      { q: 'Kann die E-Auto-Förderung vorzeitig gestoppt werden?', a: 'Ja. Die Förderung ist eine freiwillige Leistung des Bundes ohne Rechtsanspruch und hängt von den Mitteln im Klima- und Transformationsfonds ab. Reichen sie nicht, kann das Programm vor dem Ende der Laufzeit schließen. Ein solcher Termin ist bisher nicht angekündigt. Wer auf die Förderung angewiesen ist, sollte das bei langen Lieferzeiten einkalkulieren.' },
      { q: 'Was ist für Plug-in-Hybride nach Juni 2027 geplant?', a: 'Das BAFA schreibt, die Bundesregierung prüfe für die Zeit ab Juli 2027 eine Förderung von Plug-in-Hybriden und Range Extendern, die sich an den CO2-Emissionen im realen Betrieb orientiert. Es gibt dazu weder Beträge noch Bedingungen noch einen Termin. Bis etwas veröffentlicht ist, rechnet diese Seite für spätere Zulassungen mit null.' },
      { q: 'Kann ich nach dem Ende der Richtlinie noch einen Antrag stellen?', a: `Das ist offen. Die Richtlinie gilt bis zum ${datumText(F.richtlinie_gueltig_bis, 'de')}, und am selben Tag endet der Zeitraum für die Erstzulassung von Elektroautos. Die Antragsfrist von ${F.antragsfrist_monate} Monaten würde rechnerisch bis ins Jahr 2030 reichen. Ob Anträge nach dem Ende der Richtlinie noch angenommen werden, hat das BAFA bisher nicht erklärt.` },
      { q: 'Ändern sich die Förderbeträge während der Laufzeit?', a: 'Nach der geltenden Richtlinie nicht. Die Tabelle mit den Beträgen nach Einkommen und Kindern gilt für die gesamte Laufzeit. Eine Änderung wäre nur durch eine neue oder geänderte Richtlinie möglich, die im Bundesanzeiger veröffentlicht würde. Diese Seite übernimmt eine Änderung erst nach der Veröffentlichung.' },
    ],
    body: (h) => `
<h2>Die Termine auf einen Blick</h2>
${h.table(['Termin', 'Datum', 'Was gilt'], [
  ['Erstzulassung frühestens', h.date(F.erstzulassung_ab), 'auch rückwirkend vor Start des Portals'],
  ['Richtlinie in Kraft, Portal offen', h.date(F.richtlinie_datum), 'Anträge möglich'],
  ['Plug-in-Hybride: letzte Erstzulassung', h.date(F.phev_erstzulassung_bis), 'danach nur angekündigte Prüfung'],
  ['Elektroautos: letzte Erstzulassung', h.date(F.bev_erstzulassung_bis), 'Ende des Zeitraums'],
  ['Richtlinie gilt bis', h.date(F.richtlinie_gueltig_bis), 'Ende der Richtlinie'],
], 'Laufzeit der E-Auto-Förderung nach der Richtlinie vom Mai 2026', ['l', 'r', 'l'])}
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} ist ein Programm des ${h.src('bmukn', 'Bundesumweltministeriums')}; das BAFA setzt es um. Die ${h.src('breg', 'Bundesregierung')} hat den Start im Mai 2026 angekündigt, das Portal ist seitdem offen.</p>
<h2>Welche Zulassung noch passt</h2>
${h.table(['Erstzulassung', 'Elektroauto', 'Plug-in-Hybrid', 'Antrag spätestens'], daten.map((d) => [h.date(d), zeitraumOk('bev', d) ? 'ja' : 'nein', zeitraumOk('phev', d) ? 'ja' : 'nein', zeitraumOk('bev', d) ? h.date(fristen(d).antragBis) : 'entfällt']), 'Förderzeitraum an einigen Daten', ['l', 'l', 'l', 'r'])}
<p>Die letzte Zeile der Tabelle zeigt eine Frage, die das BAFA bisher nicht beantwortet hat: Wer sein Elektroauto am letzten Tag zulässt, hätte nach der Antragsfrist bis Ende 2030 Zeit, die Richtlinie selbst gilt aber nur bis Ende 2029. Ob Anträge danach noch angenommen werden, ist offen. Wer im Herbst 2029 zulässt, sollte den Antrag deshalb vorsichtshalber noch im selben Jahr stellen.</p>
<h2>2027: was feststeht und was angekündigt ist</h2>
<p>Für reine Elektroautos ändert sich 2027 nach der geltenden Richtlinie nichts: dieselben Beträge, dieselben Einkommensgrenzen, dieselben Kinderregeln. Für Plug-in-Hybride und Range Extender endet der Zeitraum am ${h.date(F.phev_erstzulassung_bis)}. Das ${h.src('bafaFaq', 'BAFA')} schreibt, die Bundesregierung prüfe für die Zeit danach eine Förderung, die sich an den CO2-Emissionen im realen Betrieb orientiert, um einen Anreiz für möglichst viel elektrisches Fahren zu setzen. Das ist eine angekündigte Prüfung. Es gibt weder Beträge noch Bedingungen noch ein Datum. Alles, was über 2027 hinaus an Zahlen kursiert, ist entweder eine Vermutung oder eine Ankündigung ohne Rechtskraft.</p>
<p>Ebenfalls angekündigt, aber ohne Wirkung ist eine mögliche Vorgabe zur Herkunft der Fahrzeuge. Die Europäische Kommission arbeitet an einem „Industrial Accelerator Act“, der Präferenzen für europäische Produktion enthalten könnte. Das BAFA betont, dass diese Entwürfe die heutige Förderfähigkeit nicht berühren und es vor einer Änderung informieren würde.</p>
<h2>Kein Rechtsanspruch, ein endliches Budget</h2>
<p>Die Förderung ist eine Zuwendung ohne Rechtsanspruch. Sie wird aus dem Klima- und Transformationsfonds bezahlt und steht unter dem Vorbehalt verfügbarer Mittel. Das bedeutet zweierlei: Ein Antrag, der alle Bedingungen erfüllt, wird bewilligt, solange Geld da ist. Und das Programm kann früher enden als vorgesehen, wenn die Mittel erschöpft sind oder der Haushalt sie kürzt. Einen solchen Förderstopp gab es bei früheren Programmen; für dieses ist keiner angekündigt.</p>
<p>Wie schnell Mittel abfließen, zeigt die ${h.src('bafaStatistik', 'Statistik des BAFA')}. Bis zum ${h.date(F.statistik_stand)} wurden ${h.num(F.bewilligungen)} Anträge bewilligt, in den ${h.num(tageSeitStart)} Tagen seit dem Start also rund ${h.num(jeTag)} je Tag. Ausgezahlt waren ${h.num(F.ausgezahlt_mio)} Millionen Euro, rechnerisch ${h.eur(mittel)} je Bewilligung; weil bewilligte Anträge nicht sofort ausgezahlt werden, ist das eine Untergrenze für den Durchschnitt. Wie sich die Bewilligungen verteilen, steht unter ${h.a('statistik', 'Bewilligungen und Statistik')}.</p>
<h2>Was frühere Programme lehren</h2>
<p>Die Kaufförderung von 2026 ist nicht das erste Programm dieser Art. Der Umweltbonus, der bis Ende 2023 lief, endete nach einem Haushaltsbeschluss kurzfristig und früher, als viele Käufer erwartet hatten. Wer damals ein bestelltes Auto erst nach dem Stichtag zugelassen bekam, ging leer aus. Daraus folgt keine Vorhersage für das heutige Programm, aber eine Vorsicht: Eine Förderung, die vom Haushalt abhängt, ist kein fester Bestandteil eines Kaufpreises, bis der Zuwendungsbescheid da ist. Wie im Fall eines Stopps mit Anträgen umgegangen würde, die schon eingegangen, aber noch nicht bewilligt sind, müsste die Entscheidung über den Stopp selbst regeln.</p>
<h2>Drei Planungen</h2>
<p><strong>Elektroauto, Lieferung Anfang 2027.</strong> Ein Paar bestellt im Herbst 2026, die Zulassung ist für Februar 2027 zugesagt. Nach der Richtlinie ist das kein Problem: Der Zeitraum läuft bis Ende 2029, die Beträge bleiben gleich. Das verbleibende Risiko ist ein vorzeitiges Ende des Programms, auf das niemand Einfluss hat.</p>
<p><strong>Plug-in-Hybrid, Lieferung im Juni 2027.</strong> Ein Pendler bestellt einen Hybrid mit langer Lieferzeit. Verschiebt sich die Zulassung auf Juli, fällt die Förderung nach heutigem Stand ganz weg. Ein schriftlich zugesagter Liefertermin und ein Puffer von einigen Wochen sind hier mehr wert als ein Rabatt.</p>
<p><strong>Elektroauto, Zulassung im Dezember 2029.</strong> Eine Familie kauft kurz vor dem Ende. Sie stellt den Antrag noch im Dezember, weil offen ist, ob das BAFA im Jahr 2030 noch Anträge annimmt.</p>
<h2>Was das für die Planung heißt</h2>
<ul>
<li><strong>Plug-in-Hybrid:</strong> Die Zulassung bis zum ${h.date(F.phev_erstzulassung_bis)} ist die harte Grenze. Lieferzeiten und Zulassungstermine gehören in die Planung; mehr dazu unter ${h.a('plug-in-hybrid', 'Plug-in-Hybrid-Förderung')}.</li>
<li><strong>Elektroauto:</strong> Zeit bis Ende 2029, aber ohne Garantie, dass das Geld so lange reicht.</li>
<li><strong>Antrag:</strong> nach der Zulassung möglichst bald stellen, vollständig, weil das BAFA in der Reihenfolge des Eingangs bearbeitet; der Ablauf steht unter ${h.a('antrag', 'Antrag stellen')}.</li>
<li><strong>Ende 2029:</strong> den Antrag noch im Jahr der Zulassung stellen, solange offen ist, ob 2030 noch angenommen wird.</li>
</ul>
<h2>Was sich ändern könnte und was nicht</h2>
<p>Für Haushalte, die schon einen Zuwendungsbescheid haben, ändert ein späterer Stopp oder eine neue Richtlinie nichts an der bewilligten Förderung; es gelten die Bedingungen des Bescheids, also vor allem die Haltedauer. Für alle anderen könnten sich Beträge, Grenzen oder Fristen mit einer neuen Richtlinie ändern, und zwar in beide Richtungen. Was bisher nur diskutiert wird, etwa eine Herkunftsregel oder eine neue Hybridförderung, gilt erst, wenn es veröffentlicht ist. Bis dahin rechnet diese Seite mit dem, was heute im Bundesanzeiger steht. Wer eine Entscheidung von einer erwarteten Änderung abhängig macht, wettet auf einen politischen Prozess, dessen Ausgang heute niemand kennt, auch nicht diese Seite.</p>
<h2>Wie diese Seite mit Änderungen umgeht</h2>
<p>Der Rechner verwendet nur die Werte der veröffentlichten Richtlinie. Ankündigungen, Entwürfe oder Berichte über mögliche Änderungen fließen nicht ein, bis sie im Bundesanzeiger stehen oder das BAFA sie veröffentlicht. Ändert sich eine Zahl, wird sie mit Datum und Quelle übernommen. Der Mini-Rechner oben zeigt, wie viele Monate ab einem gewählten Zeitpunkt für die Zulassung bleiben.</p>`,
  },
  en: {
    slug: 'how-long-it-runs',
    nav: 'How long it runs',
    card: 'How long the grant runs, what is announced for 2027 and why it could still end early.',
    title: 'EV grant 2027: how long it runs, from 2026 to end of 2029',
    description: `German EV grant 2026 to 2029: battery electric cars first registered by ${datumText(F.bev_erstzulassung_bis, 'en')}, plug-in hybrids by ${datumText(F.phev_erstzulassung_bis, 'en')}; what is announced for 2027.`,
    h1: 'How long the EV grant runs',
    intro: 'The grant is planned over several years, but not equally long for every drive type, and it depends on available funds. What is fixed, what is announced and what remains open.',
    resume: `The funding guideline for electric cars applies from ${datumText(F.richtlinie_datum, 'en')} to ${datumText(F.richtlinie_gueltig_bis, 'en')}. Battery electric and fuel cell cars are funded if first registered in Germany between ${datumText(F.erstzulassung_ab, 'en')} and ${datumText(F.bev_erstzulassung_bis, 'en')}. For plug-in hybrids and range extenders the window already closes on ${datumText(F.phev_erstzulassung_bis, 'en')}. For the period after that, BAFA says the federal government is examining funding for these vehicles based on real-world CO2 emissions; this is announced, not decided. There is no legal entitlement to the grant. It is paid from the Climate and Transformation Fund (Klima- und Transformationsfonds) while money lasts and can end early. By ${datumText(F.statistik_stand, 'en')}, BAFA had approved ${EN.num(F.bewilligungen)} applications and paid out ${EN.num(F.ausgezahlt_mio)} million euros, an average of about ${EN.num(jeTag)} approvals a day since the start. Planning in October 2026, you have ${EN.num(monateBis(heute, F.bev_erstzulassung_bis))} months left for a battery electric car and ${EN.num(monateBis(heute, F.phev_erstzulassung_bis))} for a plug-in hybrid.`,
    faqs: [
      { q: 'Will the EV grant still exist in 2027?', a: `For battery electric cars, yes: under the current guideline, up to first registration on ${datumText(F.bev_erstzulassung_bis, 'en')}, with the same amounts. For plug-in hybrids it ends with registrations by ${datumText(F.phev_erstzulassung_bis, 'en')}. Both apply only while funds last; there is no legal entitlement.` },
      { q: 'Can the EV grant be stopped early?', a: 'Yes. The grant is a voluntary federal payment without legal entitlement and depends on the money in the Climate and Transformation Fund. If that runs short, the programme can close before its end date. No such date has been announced so far. If you depend on the grant, allow for this with long delivery times.' },
      { q: 'What is planned for plug-in hybrids after June 2027?', a: 'BAFA writes that for the period from July 2027 the federal government is examining funding for plug-in hybrids and range extenders based on CO2 emissions in real-world use. There are no amounts, conditions or dates for it. Until something is published, this site works with zero for later registrations.' },
      { q: 'Can I still apply after the guideline ends?', a: `That is open. The guideline applies until ${datumText(F.richtlinie_gueltig_bis, 'en')}, and the first-registration window for battery electric cars closes the same day. The ${F.antragsfrist_monate}-month application deadline would mathematically reach into 2030. BAFA has not yet said whether applications will be accepted after the guideline ends.` },
      { q: 'Will the grant amounts change during the programme?', a: 'Not under the current guideline. The table of amounts by income and children applies for the whole period. A change would require a new or amended guideline published in the Federal Gazette (Bundesanzeiger). This site only adopts a change once it has been published.' },
    ],
    body: (h) => `
<h2>The dates at a glance</h2>
${h.table(['Milestone', 'Date', 'What applies'], [
  ['Earliest first registration', h.date(F.erstzulassung_ab), 'also before the portal opened'],
  ['Guideline in force, portal open', h.date(F.richtlinie_datum), 'applications possible'],
  ['Plug-in hybrids: last first registration', h.date(F.phev_erstzulassung_bis), 'afterwards only an announced review'],
  ['Battery electric: last first registration', h.date(F.bev_erstzulassung_bis), 'end of the window'],
  ['Guideline valid until', h.date(F.richtlinie_gueltig_bis), 'end of the guideline'],
], 'Duration of the EV grant under the May 2026 guideline', ['l', 'r', 'l'])}
<p>The ${h.src('richtlinie', 'funding guideline')} is a programme of the ${h.src('bmukn', 'Federal Environment Ministry')}; BAFA runs it. The ${h.src('breg', 'federal government')} announced the start in May 2026, and the portal has been open since.</p>
<h2>Which registration still fits</h2>
${h.table(['First registration', 'Battery electric', 'Plug-in hybrid', 'Apply by'], daten.map((d) => [h.date(d), zeitraumOk('bev', d) ? 'yes' : 'no', zeitraumOk('phev', d) ? 'yes' : 'no', zeitraumOk('bev', d) ? h.date(fristen(d).antragBis) : 'n/a']), 'Funding window for a few dates', ['l', 'l', 'l', 'r'])}
<p>The last row shows a question BAFA has not yet answered: if you register a battery electric car on the last day, the application deadline would give you until the end of 2030, but the guideline itself only runs to the end of 2029. Whether applications are accepted after that is open. If you register in autumn 2029, apply in the same year to be safe.</p>
<h2>2027: what is fixed and what is announced</h2>
<p>For battery electric cars nothing changes in 2027 under the current guideline: same amounts, same income limits, same child rules. For plug-in hybrids and range extenders the window closes on ${h.date(F.phev_erstzulassung_bis)}. ${h.src('bafaFaq', 'BAFA')} writes that the federal government is examining funding for the period after that based on real-world CO2 emissions, to encourage as much electric driving as possible. That is an announced review. There are no amounts, conditions or dates. Any figures circulating for beyond 2027 are either guesses or announcements without legal force.</p>
<p>A possible rule on where cars are built is also announced but without effect. The European Commission is working on an “Industrial Accelerator Act” that could include preferences for European production. BAFA stresses that the drafts do not affect eligibility today and that it would give notice before any change.</p>
<h2>No legal entitlement, a finite budget</h2>
<p>The grant is a payment without legal entitlement. It comes from the Climate and Transformation Fund and depends on available money. That means two things: an application meeting all conditions is approved while money is there, and the programme can end earlier than planned if funds run out or the budget is cut. Earlier programmes have seen such funding stops; none has been announced for this one.</p>
<p>${h.src('bafaStatistik', 'BAFA’s statistics')} show how fast money is flowing. By ${h.date(F.statistik_stand)}, ${h.num(F.bewilligungen)} applications had been approved, about ${h.num(jeTag)} a day over the ${h.num(tageSeitStart)} days since the start. ${h.num(F.ausgezahlt_mio)} million euros had been paid, or ${h.eur(mittel)} per approval on paper; because approved applications are not paid at once, that is a lower bound for the average. How approvals break down is under ${h.a('statistik', 'approval statistics')}.</p>
<h2>What earlier programmes teach</h2>
<p>The 2026 purchase grant is not the first of its kind. The previous environmental bonus (Umweltbonus), which ran until the end of 2023, ended at short notice after a budget decision, earlier than many buyers expected. Anyone whose ordered car was registered after the cut-off got nothing. That is no forecast for today’s programme, but a caution: a grant that depends on the budget is not a fixed part of a price until the grant notice has arrived. How applications already received but not yet approved would be treated in a stop would have to be set by the stop decision itself.</p>
<h2>Three plans</h2>
<p><strong>Battery electric, delivery early 2027.</strong> A couple orders in autumn 2026 with registration promised for February 2027. Under the guideline that is fine: the window runs to the end of 2029 and the amounts stay the same. The remaining risk is an early end to the programme, which nobody controls.</p>
<p><strong>Plug-in hybrid, delivery in June 2027.</strong> A commuter orders a hybrid with a long delivery time. If registration slips to July, the grant disappears entirely on current rules. A delivery date promised in writing and a few weeks’ buffer are worth more here than a discount.</p>
<p><strong>Battery electric, registered in December 2029.</strong> A family buys just before the end. It applies in December, because it is open whether BAFA will still accept applications in 2030.</p>
<h2>What this means for planning</h2>
<ul>
<li><strong>Plug-in hybrid:</strong> registration by ${h.date(F.phev_erstzulassung_bis)} is the hard limit. Delivery times and registration appointments belong in the plan; more under ${h.a('plug-in-hybrid', 'plug-in hybrid grant')}.</li>
<li><strong>Battery electric:</strong> time until the end of 2029, but no guarantee the money lasts that long.</li>
<li><strong>Application:</strong> apply soon after registration and completely, because BAFA works in order of arrival; the steps are under ${h.a('antrag', 'how to apply')}.</li>
<li><strong>End of 2029:</strong> apply in the year of registration while it is open whether 2030 applications are accepted.</li>
</ul>
<h2>What could change and what will not</h2>
<p>For households that already have a grant notice, a later stop or a new guideline changes nothing about the approved grant; the notice’s conditions apply, above all the holding period. For everyone else, amounts, limits or deadlines could change with a new guideline, in either direction. What is only being discussed, such as a rule on origin or a new hybrid scheme, applies only once published.</p>
<h2>How this site handles changes</h2>
<p>The calculator only uses the values of the published guideline. Announcements, drafts or reports of possible changes are not included until they appear in the Federal Gazette or BAFA publishes them. If a figure changes, it is adopted with date and source. The small calculator above shows how many months remain from a chosen point to register the car.</p>`,
  },
});
