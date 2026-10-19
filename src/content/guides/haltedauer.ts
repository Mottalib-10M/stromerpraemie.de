import { defineGuide } from '../../lib/guide-types';
import { fristen } from '../../lib/engine/foerderung';
import { plusMonate, minusTag, datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Haltedauer: 36 Monate durchgehend auf die antragstellende Person in Deutschland zugelassen. Verkauf, Abmeldung,
 * Totalschaden, Diebstahl: unverzüglich melden, BAFA entscheidet nach Ermessen (anteilig oder vollständig).
 * Wandlung: keine Rückforderung bei gleichwertigem Ersatz binnen 6 Monaten, Haltedauer verlängert sich um die Lücke.
 * Erbfall: Erben übernehmen die Restdauer. Zeitanteilige Zahlen sind nur Größenordnungen.
 */
const F = P.foerderung;
const zul = '2026-11-15';
const ende = fristen(zul).haltenBis;
// Wandlung: Rückgabe am 1.6.2027, Ersatz zugelassen am 1.9.2027 (drei Monate Lücke).
const rueck = '2027-06-01', ersatz = '2027-09-01';
const ersatzBis = plusMonate(rueck, F.ersatzfahrzeug_monate);
const neuesEnde = minusTag(plusMonate(plusMonate(zul, F.haltedauer_monate), 3));
const anteil = (betrag: number, gehalten: number) => Math.round((betrag * Math.max(0, F.haltedauer_monate - gehalten)) / F.haltedauer_monate);

export default defineGuide({
  id: 'haltedauer',
  group: 'antrag',
  order: 20,
  mini: 'aHalte',
  related: ['leasing', 'antrag', 'zuzug', 'selbststaendige'],
  sources: ['bafaFaq', 'richtlinie', 'bafaVoraussetzungen'],
  de: {
    slug: 'haltedauer-verkauf',
    nav: 'Haltedauer',
    card: 'Was passiert, wenn das geförderte Auto vor Ablauf der Haltedauer verkauft, gestohlen oder zurückgegeben wird.',
    title: 'E-Auto-Förderung Haltedauer 2026: Verkauf und Rückforderung',
    description: `E-Auto-Förderung Haltedauer 2026: ${F.haltedauer_monate} Monate auf Sie zugelassen; was bei Verkauf, Unfall, Diebstahl, Wandlung und Erbfall gilt und wann eine Rückforderung droht.`,
    h1: 'Haltedauer der E-Auto-Förderung: Verkauf, Schaden, Rückforderung',
    intro: `Die Förderung ist an eine Bedingung geknüpft, die ${F.haltedauer_monate} Monate dauert. Was Sie in dieser Zeit melden müssen und wie das BAFA mit Verkauf, Totalschaden, Wandlung und Erbfall umgeht.`,
    resume: `Wer die E-Auto-Förderung 2026 erhält, muss das Auto mindestens ${F.haltedauer_monate} Monate durchgehend auf sich in Deutschland zugelassen lassen. Die Frist beginnt mit dem Tag der Zulassung; ein Auto, das am ${datumText(zul, 'de')} zugelassen wird, muss bis zum ${datumText(ende, 'de')} gehalten werden. Wird es vorher verkauft, abgemeldet, ins Ausland gebracht oder auf eine andere Person umgeschrieben, ist das dem BAFA unverzüglich zu melden. Das BAFA entscheidet dann nach pflichtgemäßem Ermessen im Einzelfall, ob es die Förderung anteilig oder vollständig zurückfordert; eine feste Formel ist nicht veröffentlicht. Bei Totalschaden oder Diebstahl gilt dasselbe Verfahren, mit Rücksicht auf die Umstände. Wird der Kaufvertrag wegen eines Mangels rückabgewickelt, entfällt die Rückforderung, wenn innerhalb von ${F.ersatzfahrzeug_monate} Monaten ein gleichwertiges förderfähiges Ersatzfahrzeug zugelassen wird; die Haltedauer verlängert sich um die Lücke. Stirbt der Halter, übernehmen die Erben die restliche Zeit. Ein Leasingvertrag über 24 Monate reicht für die Haltedauer nicht aus.`,
    faqs: [
      { q: `Was passiert, wenn ich das geförderte E-Auto vor ${F.haltedauer_monate} Monaten verkaufe?`, a: 'Sie müssen den Verkauf dem BAFA unverzüglich melden. Das BAFA entscheidet dann nach pflichtgemäßem Ermessen im Einzelfall über eine anteilige oder vollständige Rückforderung der Förderung. Eine feste Formel dafür hat es nicht veröffentlicht. Wer verschweigt, dass er verkauft hat, riskiert mehr als die Rückzahlung, weil eine falsche Angabe Folgen über die Förderung hinaus haben kann.' },
      { q: 'Muss ich die Förderung nach einem Totalschaden zurückzahlen?', a: 'Nicht automatisch. Melden Sie den Totalschaden oder Diebstahl dem BAFA und erläutern Sie, was passiert ist. Das BAFA entscheidet unter Berücksichtigung der Umstände des Einzelfalls über eine anteilige oder vollständige Rückforderung. Unterlagen wie das Gutachten, die Diebstahlsanzeige und die Abmeldebescheinigung helfen, den Fall zu belegen.' },
      { q: 'Was gilt für die Haltedauer bei einer Rückgabe wegen Mangel?', a: `Wird der Kauf- oder Leasingvertrag wegen gesetzlicher Gewährleistungsrechte rückabgewickelt, fordert das BAFA nichts zurück, wenn Sie innerhalb von ${F.ersatzfahrzeug_monate} Monaten ein gleichwertiges, förderfähiges Ersatzfahrzeug zulassen. Die Haltedauer verlängert sich um die Zeit zwischen Rückgabe und neuer Zulassung. Melden Sie den Ersatz mit Abmeldebescheinigung und neuer Zulassungsbescheinigung.` },
      { q: 'Kann ich das Auto während der Haltedauer auf meinen Partner umschreiben?', a: `Das Auto muss ${F.haltedauer_monate} Monate auf die Person zugelassen bleiben, die den Antrag gestellt hat. Eine Umschreibung auf eine andere Person, auch auf den Partner im selben Haushalt, ist ein Halterwechsel und damit vor Ablauf der Frist dem BAFA zu melden. Eine Ausnahme nennt das BAFA nur für den Erbfall.` },
      { q: 'Darf ich während der Haltedauer innerhalb Deutschlands umziehen?', a: 'Ja. Die Bedingung lautet, dass das Auto auf Sie in Deutschland zugelassen bleibt. Ein Umzug in eine andere Stadt mit Ummeldung bei der neuen Zulassungsstelle ändert daran nichts, solange Sie Halter bleiben. Anders ist es bei einem Umzug ins Ausland mit dem Auto: Dann endet die Zulassung in Deutschland, und das ist zu melden.' },
    ],
    body: (h) => `
<h2>Was die Haltedauer verlangt</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} knüpft die Förderung an eine Mindesthaltedauer. Das ${h.src('bafaFaq', 'BAFA')} formuliert sie so: Das Fahrzeug muss mindestens ${h.P.foerderung.haltedauer_monate} Monate durchgehend auf die antragstellende Person in Deutschland zugelassen bleiben. Darin stecken drei Bedingungen: dieselbe Person, dieselbe Zulassung ohne Unterbrechung, und Deutschland.</p>
${h.table(['Zulassung', 'Haltedauer endet', 'Frühester Verkauf ohne Meldung'], ['2026-03-01', zul, '2027-06-30', '2029-12-31'].map((d) => [h.date(d), h.date(fristen(d).haltenBis), h.date(plusMonate(d, h.P.foerderung.haltedauer_monate))]), 'Ende der Haltedauer nach dem Tag der Zulassung', ['l', 'r', 'r'])}
<h2>Verkauf und Abmeldung vor Ablauf</h2>
<p>Wer vorher verkauft oder abmeldet, muss das dem BAFA unverzüglich anzeigen. Das BAFA entscheidet dann im Rahmen des pflichtgemäßen Ermessens, ob und wie viel es zurückfordert, anteilig oder vollständig. Eine Rechenformel hat es nicht veröffentlicht. Die folgende Tabelle zeigt deshalb nur eine Größenordnung, die sich ergäbe, wenn das BAFA rein zeitanteilig nach den fehlenden Monaten rechnen würde. Ein Bescheid kann höher ausfallen.</p>
${h.table(['Gehalten', 'Fehlende Monate', `Zeitanteilig bei ${h.eur(h.P.foerderung.bev[0][0])}`, `Zeitanteilig bei ${h.eur(h.P.foerderung.bev[2][0])}`], [6, 12, 24, 30, 35].map((m) => [`${m} Monate`, String(h.P.foerderung.haltedauer_monate - m), h.eur(anteil(h.P.foerderung.bev[0][0], m)), h.eur(anteil(h.P.foerderung.bev[2][0], m))]), 'Größenordnung einer zeitanteiligen Rückforderung, keine Regel des BAFA', ['l', 'r', 'r', 'r'])}
<p>Der Mini-Rechner oben rechnet die fehlenden Monate für Ihre Daten. Ob sich ein früher Verkauf trotz Rückforderung lohnen würde, hängt vom Wiederverkaufswert und von Ihren Gründen ab; die Förderung ist dabei nur ein Teil der Rechnung.</p>
<h2>Totalschaden und Diebstahl</h2>
<p>Für Fälle, die Sie nicht in der Hand haben, gilt dasselbe Verfahren mit einem Unterschied in der Abwägung. Sie melden dem BAFA, was passiert ist, und erläutern die Umstände. Das BAFA entscheidet unter Berücksichtigung des Einzelfalls über eine anteilige oder vollständige Rückforderung. Halten Sie bereit, was den Fall belegt: das Gutachten bei einem Unfall, die Anzeige bei der Polizei bei einem Diebstahl, die Abmeldebescheinigung und, falls vorhanden, die Abrechnung der Versicherung.</p>
<h2>Wandlung: Rückgabe wegen Mangel</h2>
<p>Ein Sonderfall ist die Rückabwicklung des Kauf- oder Leasingvertrags wegen gesetzlicher Gewährleistungsrechte. Dann fordert das BAFA nichts zurück, wenn innerhalb von ${h.P.foerderung.ersatzfahrzeug_monate} Monaten nach der Rückabwicklung ein gleichwertiges, nach der Richtlinie förderfähiges Ersatzfahrzeug zugelassen wird. Die Haltedauer verlängert sich um den Zeitraum zwischen Rückgabe und neuer Zulassung.</p>
${h.table(['Schritt', 'Datum'], [
  ['Zulassung des ersten Autos', h.date(zul)],
  ['Rückgabe wegen Mangel', h.date(rueck)],
  ['Ersatz spätestens zuzulassen bis', h.date(ersatzBis)],
  ['Ersatz tatsächlich zugelassen', h.date(ersatz)],
  ['Haltedauer ursprünglich bis', h.date(ende)],
  ['Haltedauer verlängert bis', h.date(neuesEnde)],
], 'Beispiel einer Wandlung mit drei Monaten Lücke', ['l', 'r'])}
<p>Den Ersatz zeigen Sie dem BAFA unverzüglich an, mit der Abmeldebescheinigung des ersten und der Zulassungsbescheinigung des neuen Autos. „Gleichwertig“ ist nicht näher bestimmt; ein Auto derselben Klasse, das selbst förderfähig wäre, liegt nahe.</p>
<h2>Erbfall</h2>
<p>Stirbt der Halter vor Ablauf der Haltedauer, ist die Ummeldung auf die Erbin oder den Erben nicht förderschädlich. Die restliche Haltedauer ist dann von der erbenden Person einzuhalten. Gegenüber dem BAFA wird die Erbschaft mit einem Erbschein belegt.</p>
<h2>Was kein Halterwechsel ist</h2>
<p>Die Haltedauer betrifft die Zulassung, nicht die Frage, wer fährt. Ihr Partner, Ihre Kinder mit Führerschein oder Freunde dürfen das Auto nutzen, solange es auf Sie zugelassen bleibt. Auch ein finanziertes Auto, bei dem die Bank die Zulassungsbescheinigung Teil II als Sicherheit verwahrt, bleibt auf Sie zugelassen, denn Halter ist, wer in Teil I steht. Eine Reparatur in der Werkstatt, ein Ersatzwagen für einige Tage oder eine vorübergehende Stilllegung über den Winter sind etwas anderes als ein Verkauf. Bei einer Außerbetriebsetzung ist allerdings Vorsicht geboten: Das BAFA verlangt eine durchgehende Zulassung, und eine Abmeldung ist ausdrücklich zu melden. Wer ein Saisonkennzeichen plant, sollte das vorher mit dem BAFA klären.</p>
<h2>Drei Fälle aus der Praxis</h2>
<p><strong>Der Jobwechsel ins Ausland.</strong> Ein Ingenieur bekommt nach 20 Monaten ein Angebot in der Schweiz und nimmt das Auto mit. Die Zulassung in Deutschland endet, ${h.P.foerderung.haltedauer_monate - 20} Monate fehlen. Er meldet den Umzug dem BAFA, das über die Rückforderung entscheidet.</p>
<p><strong>Der Unfall ohne eigene Schuld.</strong> Eine Pendlerin erleidet nach 14 Monaten einen Totalschaden, die gegnerische Versicherung zahlt. Sie meldet den Schaden mit Gutachten und Abmeldebescheinigung. Das BAFA berücksichtigt die Umstände; ein Ersatzkauf ist hier nicht vorgeschrieben, weil es keine Wandlung ist.</p>
<p><strong>Der Mangel an der Batterie.</strong> Ein Paar gibt das Auto nach acht Monaten wegen eines wiederkehrenden Defekts zurück und lässt drei Monate später ein gleichwertiges Modell zu. Es fordert niemand etwas zurück, und die Haltedauer verlängert sich um die drei Monate.</p>
<h2>Leasing, Umzug, Betrieb</h2>
<ul>
<li><strong>Leasing:</strong> Ein Vertrag über 24 Monate erfüllt die Haltedauer nicht. Sie müssen verlängern oder das Auto übernehmen, damit es ${h.P.foerderung.haltedauer_monate} Monate auf Sie zugelassen bleibt. Mehr unter ${h.a('leasing', 'Leasing')}.</li>
<li><strong>Umzug ins Ausland:</strong> Das Auto muss in Deutschland zugelassen bleiben. Wer mit dem Auto wegzieht, beendet die Haltedauer vorzeitig; dazu ${h.a('zuzug', 'neu in Deutschland')}.</li>
<li><strong>Betriebsvermögen:</strong> Das Auto darf während der Haltedauer nicht nachträglich in ein Unternehmen eingebracht werden; siehe ${h.a('selbststaendige', 'Selbstständige')}.</li>
<li><strong>Umzug im Inland, neues Kennzeichen:</strong> Solange Sie Halter bleiben und das Auto in Deutschland zugelassen ist, ändert eine Ummeldung nichts.</li>
</ul>
<h2>Nach dem Ende der Haltedauer</h2>
<p>Ist die Frist abgelaufen, sind Sie frei. Sie können das Auto verkaufen, auf den Partner umschreiben, ins Ausland mitnehmen oder abmelden, ohne das BAFA zu fragen und ohne Rückforderung. Die Pflicht, die Unterlagen aufzubewahren, läuft aber länger als die Haltedauer selbst. Für den Käufer eines gebrauchten Elektroautos gibt es übrigens keine Förderung, weil sie nur für Neuwagen gilt; er übernimmt aber die restliche Befreiung von der Kfz-Steuer und kann ab dem Kauf die THG-Prämie für sich beantragen.</p>
<h2>Melden: wie und was</h2>
<p>Melden Sie eine Änderung so bald wie möglich und nicht erst, wenn das BAFA nachfragt. Halten Sie die Nummer Ihres Zuwendungsbescheids bereit, das Datum der Änderung und den Beleg: Kaufvertrag des Käufers, Abmeldebescheinigung, Gutachten, Anzeige, Erbschein. Bewahren Sie alle Unterlagen ${h.P.foerderung.aufbewahrung_jahre} Jahre auf. Das Verfahren für den ursprünglichen Antrag beschreibt ${h.a('antrag', 'Antrag stellen')}.</p>`,
  },
  en: {
    slug: 'holding-period',
    nav: 'Holding period',
    card: 'What happens if the funded car is sold, stolen or returned before the holding period ends.',
    title: 'EV grant holding period 2026: selling early and claw-backs',
    description: `EV grant holding period 2026: ${F.haltedauer_monate} months registered to you; what a sale, write-off, theft, warranty return or death means, and when a claw-back follows.`,
    h1: 'The EV grant holding period: selling, damage and claw-backs',
    intro: `The grant comes with a condition that lasts ${F.haltedauer_monate} months. What you must report in that time and how BAFA deals with a sale, a write-off, a return under warranty and a death.`,
    resume: `If you receive Germany’s 2026 EV grant, the car must stay registered to you in Germany for at least ${F.haltedauer_monate} continuous months. The period starts on the day of registration; a car registered on ${datumText(zul, 'en')} must be kept until ${datumText(ende, 'en')}. If it is sold, deregistered, taken abroad or transferred to someone else before then, you must report this to BAFA without delay. BAFA then decides case by case, at its due discretion, whether to reclaim the grant partly or in full; no fixed formula has been published. A write-off or theft follows the same procedure, taking the circumstances into account. If the purchase is reversed because of a defect, nothing is reclaimed provided an equivalent eligible replacement is registered within ${F.ersatzfahrzeug_monate} months; the holding period is extended by the gap. If the keeper dies, the heirs take over the remaining time. A 24-month lease is not long enough for the holding period.`,
    faqs: [
      { q: `What happens if I sell the funded EV before ${F.haltedauer_monate} months?`, a: 'You must report the sale to BAFA without delay. BAFA then decides case by case, at its due discretion, on a partial or full claw-back of the grant. It has not published a fixed formula. Keeping a sale quiet risks more than repayment, because a false statement can have consequences beyond the grant.' },
      { q: 'Do I repay the grant after a write-off?', a: 'Not automatically. Report the write-off or theft to BAFA and explain what happened. BAFA decides, taking the individual circumstances into account, on a partial or full claw-back. Documents such as the assessor’s report, the police report of the theft and the deregistration certificate help support your case.' },
      { q: 'How does a return under warranty affect the holding period?', a: `If the purchase or lease is reversed under statutory warranty rights, BAFA reclaims nothing provided you register an equivalent, eligible replacement within ${F.ersatzfahrzeug_monate} months. The holding period is extended by the time between the return and the new registration. Report the replacement with the deregistration certificate and the new registration certificate.` },
      { q: 'Can I transfer the car to my partner during the holding period?', a: `The car must stay registered for ${F.haltedauer_monate} months to the person who applied. Transferring it to someone else, even a partner in the same household, is a change of keeper and must be reported to BAFA before the period ends. BAFA only names an exception for inheritance.` },
      { q: 'Can I move house within Germany during the holding period?', a: 'Yes. The condition is that the car stays registered to you in Germany. Moving to another town and re-registering with the new registration office changes nothing, as long as you remain the keeper. Moving abroad with the car is different: the German registration ends, and that must be reported.' },
    ],
    body: (h) => `
<h2>What the holding period requires</h2>
<p>The ${h.src('richtlinie', 'funding guideline')} ties the grant to a minimum holding period. ${h.src('bafaFaq', 'BAFA')} puts it this way: the vehicle must stay registered to the applicant in Germany for at least ${h.P.foerderung.haltedauer_monate} continuous months. That contains three conditions: the same person, the same registration without interruption, and Germany.</p>
${h.table(['Registration', 'Holding period ends', 'Earliest sale without reporting'], ['2026-03-01', zul, '2027-06-30', '2029-12-31'].map((d) => [h.date(d), h.date(fristen(d).haltenBis), h.date(plusMonate(d, h.P.foerderung.haltedauer_monate))]), 'End of the holding period by registration date', ['l', 'r', 'r'])}
<h2>Selling or deregistering early</h2>
<p>If you sell or deregister before then, you must notify BAFA without delay. BAFA then decides at its due discretion whether and how much to reclaim, partly or in full. It has not published a formula. The table below therefore only shows an order of magnitude, the figure that would result if BAFA worked purely pro rata on the missing months. An actual decision can be higher.</p>
${h.table(['Kept', 'Months missing', `Pro rata on ${h.eur(h.P.foerderung.bev[0][0])}`, `Pro rata on ${h.eur(h.P.foerderung.bev[2][0])}`], [6, 12, 24, 30, 35].map((m) => [`${m} months`, String(h.P.foerderung.haltedauer_monate - m), h.eur(anteil(h.P.foerderung.bev[0][0], m)), h.eur(anteil(h.P.foerderung.bev[2][0], m))]), 'Order of magnitude of a pro rata claw-back, not a BAFA rule', ['l', 'r', 'r', 'r'])}
<p>The small calculator above works out the missing months for your dates. Whether selling early would pay despite a claw-back depends on resale value and your reasons; the grant is only one part of that sum.</p>
<h2>Write-off and theft</h2>
<p>For events outside your control, the same procedure applies with a difference in how things are weighed. You tell BAFA what happened and explain the circumstances. BAFA decides on a partial or full claw-back taking the individual case into account. Keep ready whatever supports your case: the assessor’s report after an accident, the police report after a theft, the deregistration certificate and, if available, the insurer’s settlement.</p>
<h2>Return under warranty</h2>
<p>A special case is reversing the purchase or lease under statutory warranty rights (Wandlung). BAFA then reclaims nothing if an equivalent replacement that qualifies under the guideline is registered within ${h.P.foerderung.ersatzfahrzeug_monate} months of the reversal. The holding period is extended by the time between the return and the new registration.</p>
${h.table(['Step', 'Date'], [
  ['First car registered', h.date(zul)],
  ['Returned because of a defect', h.date(rueck)],
  ['Replacement to be registered by', h.date(ersatzBis)],
  ['Replacement actually registered', h.date(ersatz)],
  ['Original end of holding period', h.date(ende)],
  ['Extended end of holding period', h.date(neuesEnde)],
], 'Example of a return with a three-month gap', ['l', 'r'])}
<p>Report the replacement to BAFA without delay, with the deregistration certificate of the first car and the registration certificate of the new one. “Equivalent” is not defined further; a car of the same class that would qualify in its own right is the obvious reading.</p>
<h2>Death of the keeper</h2>
<p>If the keeper dies before the holding period ends, re-registering the car to the heir does not harm the grant. The heir must then complete the remaining holding period. The inheritance is proven to BAFA with a certificate of inheritance (Erbschein).</p>
<h2>What is not a change of keeper</h2>
<p>The holding period concerns registration, not who drives. Your partner, children with a licence or friends may use the car as long as it stays registered to you. A financed car whose part II registration certificate (Zulassungsbescheinigung Teil II) is held by the bank as security also stays registered to you, because the keeper is whoever is named on part I. A workshop repair, a courtesy car for a few days or laying the car up for a while are different from a sale. Be careful with deregistration, though: BAFA requires continuous registration, and deregistering must be reported. If you plan seasonal plates (Saisonkennzeichen), clarify it with BAFA first.</p>
<h2>Three cases from practice</h2>
<p><strong>A job abroad.</strong> An engineer gets an offer in Switzerland after 20 months and takes the car. The German registration ends and ${h.P.foerderung.haltedauer_monate - 20} months are missing. He reports the move to BAFA, which decides on a claw-back.</p>
<p><strong>An accident that was not her fault.</strong> A commuter’s car is written off after 14 months and the other driver’s insurer pays. She reports it with the assessor’s report and deregistration certificate. BAFA takes the circumstances into account; a replacement is not required here because it is not a warranty return.</p>
<p><strong>A battery defect.</strong> A couple returns the car after eight months because of a recurring fault and registers an equivalent model three months later. Nothing is reclaimed and the holding period is extended by those three months.</p>
<h2>Leasing, moving, business use</h2>
<ul>
<li><strong>Leasing:</strong> a 24-month contract does not meet the holding period. You must extend it or buy the car so that it stays registered to you for ${h.P.foerderung.haltedauer_monate} months. More under ${h.a('leasing', 'leasing')}.</li>
<li><strong>Moving abroad:</strong> the car must stay registered in Germany. Taking it with you ends the holding period early; see ${h.a('zuzug', 'new to Germany')}.</li>
<li><strong>Business assets:</strong> the car may not be moved into a business during the holding period; see ${h.a('selbststaendige', 'self-employed')}.</li>
<li><strong>Moving within Germany, new plates:</strong> as long as you remain the keeper and the car is registered in Germany, re-registering changes nothing.</li>
</ul>
<h2>After the holding period</h2>
<p>Once the period is over, you are free. You can sell the car, transfer it to your partner, take it abroad or deregister it without asking BAFA and without a claw-back. The duty to keep documents, however, runs longer than the holding period itself.</p>
<h2>Reporting: how and what</h2>
<p>Report a change as soon as possible, not only when BAFA asks. Have your grant notice number to hand, the date of the change and the evidence: the buyer’s contract, deregistration certificate, assessor’s report, police report, certificate of inheritance. Keep all documents for ${h.P.foerderung.aufbewahrung_jahre} years. The procedure for the original application is under ${h.a('antrag', 'how to apply')}.</p>`,
  },
});
