import { defineGuide } from '../../lib/guide-types';
import { fristen, zeitraumOk, nettopreis } from '../../lib/engine/foerderung';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Nur Neuwagen: keine Tageszulassung, kein Vorführwagen, keine Werkszulassung, kein Gebrauchtwagen; Klasse M1;
 * Erstzulassung in Deutschland ab 1.1.2026; Kauf überall möglich (auch außerhalb der EU); keine vergleichbare
 * Förderung eines anderen EU-Staates; keine EU-Produktionsregel (nur in Diskussion); kein Preisdeckel.
 * Rückwirkung: Zulassungen ab Januar 2026 vor Öffnung des Portals am 19.5.2026, Antragsfrist 12 Monate.
 */
const F = P.foerderung;
const LP = 36000, RT = 4000, RN = 1000;
const faelle: Array<[string, string, string]> = [
  ['2025-12-20', 'Zulassung kurz vor dem Jahreswechsel', 'Registered just before New Year'],
  ['2026-01-15', 'Zulassung vor Öffnung des Portals', 'Registered before the portal opened'],
  ['2026-05-19', 'Zulassung am Tag der Portalöffnung', 'Registered on the day the portal opened'],
  ['2026-11-01', 'Zulassung im Herbst 2026', 'Registered in autumn 2026'],
];

export default defineGuide({
  id: 'neuwagen',
  group: 'antrag',
  order: 40,
  mini: 'aNeu',
  related: ['antrag', 'kumulierung', 'zuzug', 'foerderfaehige-modelle'],
  sources: ['bafaFaq', 'bafaVoraussetzungen', 'richtlinie'],
  de: {
    slug: 'neuwagen-tageszulassung-ausland',
    nav: 'Nur Neuwagen',
    card: 'Warum Tageszulassung, Vorführwagen und Gebrauchte nicht gefördert werden und was beim Kauf im Ausland gilt.',
    title: 'Tageszulassung und Förderung 2026: nur Neuwagen zählen',
    description: `Tageszulassung, Vorführwagen, Gebrauchte: keine E-Auto-Förderung 2026. Nur Neuwagen mit Erstzulassung in Deutschland ab ${datumText(F.erstzulassung_ab, 'de')}, auch im Ausland gekauft.`,
    h1: 'Nur Neuwagen: Tageszulassung, Gebrauchte und Auslandskauf',
    intro: 'Die Förderung gilt nur für Autos, die zum ersten Mal zugelassen werden, und zwar in Deutschland. Was das für Tageszulassungen, Vorführwagen, Reimporte und Käufe im Ausland heißt.',
    resume: `Gefördert werden 2026 nur Neufahrzeuge der Klasse M1, also Pkw, die zum ersten Mal überhaupt zugelassen werden, und zwar in Deutschland auf die antragstellende Person. Tageszulassungen, Vorführwagen und Werkszulassungen sind ausgeschlossen, weil sie schon einmal zugelassen waren, ebenso jeder Gebrauchtwagen. Die Erstzulassung muss ab dem ${datumText(F.erstzulassung_ab, 'de')} liegen, für reine Elektroautos bis zum ${datumText(F.bev_erstzulassung_bis, 'de')}, für Plug-in-Hybride bis zum ${datumText(F.phev_erstzulassung_bis, 'de')}. Weil das Antragsportal erst am ${datumText(F.richtlinie_datum, 'de')} öffnete, konnten auch Autos, die schon im Januar 2026 zugelassen wurden, nachträglich gefördert werden, sofern der Antrag innerhalb von ${F.antragsfrist_monate} Monaten nach der Zulassung gestellt wird. Wo das Auto gekauft wird, ist gleich, auch außerhalb der EU; entscheidend ist die erste Zulassung in Deutschland. Hat ein anderer EU-Staat dasselbe Auto schon gefördert, ist die deutsche Förderung ausgeschlossen. Eine Regel, nach der das Auto in der EU gebaut sein muss, gibt es derzeit nicht, und eine Preisobergrenze ebenfalls nicht.`,
    faqs: [
      { q: 'Gibt es die E-Auto-Förderung für eine Tageszulassung?', a: 'Nein. Eine Tageszulassung ist ein Auto, das der Händler oder Hersteller schon einmal auf sich zugelassen hat, oft nur für einen Tag. Damit ist die Erstzulassung bereits erfolgt, und zwar nicht auf Sie. Die Förderung verlangt aber eine erstmalige Zulassung auf die antragstellende Person. Dasselbe gilt für Vorführwagen und Werkszulassungen, auch wenn sie kaum gefahren wurden.' },
      { q: 'Wird ein gebrauchtes Elektroauto 2026 gefördert?', a: 'Nein. Die Richtlinie fördert ausschließlich Neufahrzeuge. Für gebrauchte Elektroautos gibt es keine Kaufförderung des Bundes. Der Käufer eines gebrauchten Elektroautos kann aber die restliche Befreiung von der Kfz-Steuer übernehmen und als neuer Halter die THG-Prämie verkaufen, soweit der Vorbesitzer sie für das laufende Jahr nicht schon genutzt hat.' },
      { q: 'Kann ich ein im Ausland gekauftes E-Auto fördern lassen?', a: 'Ja, wenn es neu ist und in Deutschland zum ersten Mal zugelassen wird. Nach Auskunft des BAFA ist der Ort des Kaufs unerheblich, auch ein Kauf außerhalb der EU ist möglich. War das Auto im Ausland schon zugelassen, ist es kein Neuwagen mehr. Eine Förderung desselben Fahrzeugs durch einen anderen EU-Staat schließt die deutsche aus.' },
      { q: 'Muss ein gefördertes E-Auto in der EU gebaut sein?', a: 'Derzeit nicht. Das BAFA schreibt, die Europäische Kommission arbeite an einem Vorschlag für einen „Industrial Accelerator Act“, der Präferenzregeln für europäische Produktion enthalten könnte. Diese Entwürfe haben keine Auswirkung auf die heutige Förderfähigkeit. Sollten solche Vorgaben später übernommen werden, will das BAFA vorher informieren.' },
      { q: 'Bekomme ich Förderung für ein E-Auto, das im Januar 2026 zugelassen wurde?', a: `Ja. Gefördert werden Erstzulassungen ab dem ${datumText(F.erstzulassung_ab, 'de')}, auch wenn das Antragsportal erst später öffnete. Der Antrag muss aber innerhalb von ${F.antragsfrist_monate} Monaten nach der Zulassung gestellt werden. Bei einer Zulassung am 15. Januar 2026 endet die Frist am ${datumText(fristen('2026-01-15').antragBis, 'de')}.` },
    ],
    body: (h) => `
<h2>Was „Neufahrzeug“ bedeutet</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} fördert den Kauf oder das Leasing eines neuen Pkw der Klasse M1, der erstmals in Deutschland auf die antragstellende Person zugelassen wird. Das ${h.src('bafaVoraussetzungen', 'BAFA')} nennt die Ausschlüsse ausdrücklich: Tageszulassungen, Vorführwagen, Werkszulassungen und gebrauchte Fahrzeuge. Gemeinsam ist ihnen, dass die Erstzulassung schon erfolgt ist, und zwar auf jemand anderen. Der Kilometerstand ist dabei gleich: Ein Vorführwagen mit 50 km ist genauso ausgeschlossen wie einer mit 5 000 km.</p>
${h.table(['Fahrzeug', 'Förderfähig', 'Warum'], [
  ['Neuwagen, nie zugelassen, Erstzulassung auf Sie in Deutschland', 'ja', 'Erstzulassung auf die antragstellende Person'],
  ['Tageszulassung des Händlers', 'nein', 'schon einmal zugelassen'],
  ['Vorführwagen', 'nein', 'schon einmal zugelassen'],
  ['Werkszulassung des Herstellers', 'nein', 'schon einmal zugelassen'],
  ['Gebrauchtwagen', 'nein', 'kein Neufahrzeug'],
  ['Neuwagen aus dem Ausland, dort nie zugelassen', 'ja', 'Kaufort unerheblich, Erstzulassung in Deutschland'],
  ['Reimport mit ausländischer Tageszulassung', 'nein', 'schon im Ausland zugelassen'],
  ['Elektro-Transporter der Klasse N1', 'nein', 'keine Klasse M1'],
], 'Was als Neufahrzeug im Sinne der Förderung gilt', ['l', 'l', 'l'])}
<p>Der Mini-Rechner oben prüft die drei Bedingungen Fahrzeugart, Ort und Zeitraum für Ihren Fall.</p>
<h2>Warum Tageszulassungen trotzdem angeboten werden</h2>
<p>Händler und Hersteller lassen Autos auf sich zu, um Verkaufsziele zu erreichen, und geben sie dann mit Rabatt ab. Für Käufer kann das günstig sein, aber die staatliche Förderung fällt dann weg. Ein Rabatt von ${h.eur(4000)} auf eine Tageszulassung ist für einen Haushalt in der ersten Stufe ohne Kind weniger wert als ein Neuwagen mit ${h.eur(h.P.foerderung.bev[0][0])} Förderung zum selben Listenpreis, für einen Haushalt in der dritten Stufe mit ${h.eur(h.P.foerderung.bev[2][0])} dagegen mehr. Achten Sie im Angebot auf die Angabe zur Erstzulassung: Steht dort ein Datum vor Ihrer eigenen Zulassung, ist das Auto keine Erstzulassung auf Sie.</p>
<h2>Rechenbeispiel: Tageszulassung oder Neuwagen</h2>
<p>Ein Elektroauto kostet laut Liste ${h.eur(LP)}. Der Händler bietet dasselbe Modell als Tageszulassung mit ${h.eur(RT)} Rabatt an, als Neuwagen mit ${h.eur(RN)} Nachlass. Ob sich die Tageszulassung lohnt, hängt allein von Ihrer Förderstufe ab.</p>
${h.table(['Haushalt', 'Tageszulassung', 'Neuwagen mit Förderung', 'Vorteil Neuwagen'], [[0, 0], [1, 0], [2, 0], [2, 2]].map(([st, k]) => { const f = h.P.foerderung.bev[st][k]; const neu = nettopreis(LP - RN, f); const tz = LP - RT; return [`Stufe ${st + 1}, ${k} Kinder`, h.eur(tz), h.eur(neu), h.eur(tz - neu)]; }), 'Endpreis nach Rabatt und Förderung, gedachtes Angebot', ['l', 'r', 'r', 'r'])}
<p>Ist der Vorteil negativ, wäre die Tageszulassung günstiger. Über der Einkommensgrenze gibt es keine Förderung, dann zählt nur der Rabatt. Die Rechnung lässt die THG-Prämie außer Acht, weil sie beide Autos gleich betrifft: Auch der Halter einer Tageszulassung kann sie jedes Jahr verkaufen. Ebenso gleich bleibt die Befreiung von der Kfz-Steuer, die beim Händler mit der Tageszulassung zu laufen beginnt; ein paar Tage Unterschied sind dabei ohne Bedeutung.</p>
<h2>Der Zeitraum der Erstzulassung</h2>
<p>Die Förderung gilt für Erstzulassungen ab dem ${h.date(h.P.foerderung.erstzulassung_ab)}. Das Antragsportal öffnete erst am ${h.date(h.P.foerderung.richtlinie_datum)}; wer schon vorher zugelassen hatte, konnte trotzdem beantragen. Begrenzt wird das nur durch die Antragsfrist von ${h.P.foerderung.antragsfrist_monate} Monaten.</p>
${h.table(['Fall', 'Zulassung', 'Elektroauto im Zeitraum', 'Antrag spätestens'], faelle.map(([d, de]) => [de, h.date(d), zeitraumOk('bev', d) ? 'ja' : 'nein', zeitraumOk('bev', d) ? h.date(fristen(d).antragBis) : 'entfällt']), 'Zeitraum und Antragsfrist an einigen Daten', ['l', 'r', 'l', 'r'])}
<p>Am anderen Ende liegt der ${h.date(h.P.foerderung.bev_erstzulassung_bis)} für reine Elektroautos und der ${h.date(h.P.foerderung.phev_erstzulassung_bis)} für Plug-in-Hybride und Range Extender. Was nach diesen Daten kommt, steht unter ${h.a('laufzeit', 'Laufzeit bis 2029')}.</p>
<h2>Kauf im Ausland</h2>
<p>Das ${h.src('bafaFaq', 'BAFA')} beantwortet die Frage nach Käufen außerhalb Deutschlands und der EU mit Ja: Für die Förderfähigkeit ist unerheblich, wo das Fahrzeug gekauft wurde. Wichtig ist die erstmalige Zulassung ab dem ${h.date(h.P.foerderung.erstzulassung_ab)} in Deutschland. Drei Punkte verdienen bei einem Kauf im Ausland Aufmerksamkeit:</p>
<ol>
<li><strong>Keine Zulassung im Ausland:</strong> Das Auto muss mit Überführungskennzeichen oder auf dem Transporter kommen und darf dort nicht regulär zugelassen worden sein.</li>
<li><strong>Keine ausländische Förderung:</strong> Eine vergleichbare Förderung eines anderen EU-Mitgliedstaates für dasselbe Auto schließt die deutsche Förderung aus.</li>
<li><strong>Unterlagen auf Deutsch:</strong> Ein fremdsprachiger Kaufvertrag braucht eine beglaubigte Übersetzung.</li>
</ol>
<p>Für ein Auto, das Sie bei einem Umzug nach Deutschland mitbringen und das schon im Herkunftsland zugelassen war, gibt es keine Förderung. Was Zugezogene sonst beachten müssen, steht unter ${h.a('zuzug', 'neu in Deutschland')}.</p>
<h2>Kein Preisdeckel, keine Modellliste, keine EU-Regel</h2>
<p>Drei Annahmen halten sich hartnäckig und stimmen für 2026 nicht. Erstens gibt es keine Preisobergrenze: Auch ein teures Elektroauto ist förderfähig, wenn das Haushaltseinkommen passt. Zweitens gibt es keine amtliche Liste förderfähiger Modelle; das BAFA veröffentlicht nur eine Statistik der bewilligten Anträge nach Marken und Modellen. Drittens gibt es keine Vorgabe, dass das Auto in der EU gebaut sein muss. Das BAFA verweist auf einen Vorschlag der Europäischen Kommission für einen „Industrial Accelerator Act“, der solche Präferenzen enthalten könnte; die Entwürfe haben keine Wirkung auf die heutige Förderung. Welche Modelle am häufigsten gefördert wurden und was sie nach der Förderung kosten, zeigt ${h.a('foerderfaehige-modelle', 'förderfähige Modelle')}.</p>
<h2>Was Sie im Kaufvertrag prüfen</h2>
<ul>
<li>Die Bezeichnung „Neufahrzeug“ und kein Hinweis auf eine Tages-, Händler- oder Werkszulassung.</li>
<li>Kein Datum einer Erstzulassung vor Ihrer eigenen; im Zweifel fragen Sie nach der Fahrzeug-Identifizierungsnummer und lassen sich bestätigen, dass das Auto nie zugelassen war.</li>
<li>Bei Reimporten: eine Erklärung, dass das Auto im Ausland weder zugelassen noch gefördert wurde.</li>
<li>Den Halter: Das Auto wird auf Sie zugelassen, nicht auf den Händler, eine Firma oder eine andere Person.</li>
<li>Das voraussichtliche Zulassungsdatum, vor allem bei Plug-in-Hybriden kurz vor dem Ende ihres Zeitraums.</li>
</ul>
<h2>Brennstoffzelle und Range Extender</h2>
<p>Neben reinen Batterieautos fördert die Richtlinie Fahrzeuge mit Brennstoffzelle zu denselben Beträgen und im selben Zeitraum. Range Extender werden wie Plug-in-Hybride behandelt: niedrigere Beträge, technische Grenzen bei CO2 oder Reichweite, Erstzulassung bis zum ${h.date(h.P.foerderung.phev_erstzulassung_bis)}.</p>
<h2>Rabatte und Händlerprämien</h2>
<p>Ein Rabatt beim Kauf eines Neuwagens ist kein Ausschlussgrund. Herstellerprämien und Händlernachlässe sind Preisnachlässe, keine öffentlichen Förderungen, und lassen sich mit der staatlichen Förderung verbinden. Wie die Beträge zusammenkommen, rechnet ${h.a('kumulierung', 'Kaufprämie kombinieren')}. Den Ablauf des Antrags nach der Zulassung beschreibt ${h.a('antrag', 'Antrag stellen')}.</p>`,
  },
  en: {
    slug: 'new-cars-only',
    nav: 'New cars only',
    card: 'Why pre-registered cars, demonstrators and used cars are not funded and what applies when buying abroad.',
    title: 'Pre-registered cars and the EV grant 2026: new cars only',
    description: `Pre-registered cars, demonstrators and used cars get no EV grant. Only new cars first registered in Germany from ${datumText(F.erstzulassung_ab, 'en')} qualify, wherever bought.`,
    h1: 'New cars only: pre-registrations, used cars and buying abroad',
    intro: 'The grant only covers cars registered for the very first time, and in Germany. What that means for pre-registered cars, demonstrators, parallel imports and purchases abroad.',
    resume: `In 2026 the German EV grant only covers new M1 passenger cars, meaning cars registered for the very first time, in Germany, to the applicant. Pre-registered cars (Tageszulassung), demonstrators and factory registrations are excluded because they have already been registered once, and so is every used car. First registration must be on or after ${datumText(F.erstzulassung_ab, 'en')}, up to ${datumText(F.bev_erstzulassung_bis, 'en')} for battery electric cars and ${datumText(F.phev_erstzulassung_bis, 'en')} for plug-in hybrids. Because the application portal only opened on ${datumText(F.richtlinie_datum, 'en')}, cars registered as early as January 2026 could be funded retrospectively, provided the application is made within ${F.antragsfrist_monate} months of registration. Where the car is bought makes no difference, even outside the EU; what matters is first registration in Germany. If another EU state has already funded the same car, the German grant is ruled out. There is currently no rule that the car must be built in the EU, and no price cap either.`,
    faqs: [
      { q: 'Is there an EV grant for a pre-registered car (Tageszulassung)?', a: 'No. A pre-registered car is one the dealer or maker has already registered to itself, often for a single day. That means first registration has already happened, and not to you. The grant requires first registration to the applicant. The same applies to demonstrators and factory registrations, however few kilometres they have done.' },
      { q: 'Is a used electric car funded in 2026?', a: 'No. The guideline only funds new vehicles. There is no federal purchase grant for used electric cars. The buyer of a used electric car can, however, take over the remaining vehicle tax exemption and, as the new keeper, sell the GHG quota, provided the previous owner has not already used it for the current year.' },
      { q: 'Can I get the grant for an EV bought abroad?', a: 'Yes, if it is new and first registered in Germany. According to BAFA, where you buy is irrelevant, even outside the EU. If the car was already registered abroad, it is no longer new. Funding of the same car by another EU state rules out the German grant.' },
      { q: 'Does a funded EV have to be built in the EU?', a: 'Not at present. BAFA writes that the European Commission is working on a proposal for an “Industrial Accelerator Act”, which could contain preference rules for European production. These drafts have no effect on eligibility today. Should such rules be adopted later, BAFA intends to announce them in advance.' },
      { q: 'Can I get the grant for an EV registered in January 2026?', a: `Yes. First registrations from ${datumText(F.erstzulassung_ab, 'en')} are funded, even though the application portal opened later. You must, however, apply within ${F.antragsfrist_monate} months of registration. For a registration on 15 January 2026, the deadline is ${datumText(fristen('2026-01-15').antragBis, 'en')}, so such cases are now urgent.` },
    ],
    body: (h) => `
<h2>What “new vehicle” means</h2>
<p>The ${h.src('richtlinie', 'funding guideline')} funds buying or leasing a new M1 passenger car that is first registered in Germany to the applicant. ${h.src('bafaVoraussetzungen', 'BAFA')} names the exclusions explicitly: pre-registrations, demonstrators, factory registrations and used vehicles. What they have in common is that first registration has already happened, to someone else. Mileage makes no difference: a demonstrator with 50 km is excluded just like one with 5,000 km.</p>
${h.table(['Vehicle', 'Qualifies', 'Why'], [
  ['New car, never registered, first registered to you in Germany', 'yes', 'first registration to the applicant'],
  ['Dealer pre-registration', 'no', 'already registered once'],
  ['Demonstrator', 'no', 'already registered once'],
  ['Factory registration', 'no', 'already registered once'],
  ['Used car', 'no', 'not a new vehicle'],
  ['New car from abroad, never registered there', 'yes', 'place of purchase irrelevant, first registration in Germany'],
  ['Parallel import with a foreign pre-registration', 'no', 'already registered abroad'],
  ['Electric van, class N1', 'no', 'not class M1'],
], 'What counts as a new vehicle for the grant', ['l', 'l', 'l'])}
<p>The small calculator above checks the three conditions of vehicle type, place and period for your case.</p>
<h2>Why pre-registered cars are still offered</h2>
<p>Dealers and makers register cars to themselves to hit sales targets and then sell them at a discount. That can be good value for buyers, but the federal grant is lost. A €4,000 discount on a pre-registered car is worth less than a new car with a ${h.eur(h.P.foerderung.bev[0][0])} grant at the same list price for a first-band household without children, but more for a third-band household on ${h.eur(h.P.foerderung.bev[2][0])}. Check the first-registration date in the offer: if it is earlier than your own registration, the car is not a first registration to you.</p>
<h2>Worked example: pre-registered or new</h2>
<p>An electric car lists at ${h.eur(LP)}. The dealer offers the same model as a pre-registration with a ${h.eur(RT)} discount, or new with ${h.eur(RN)} off. Whether the pre-registered car is better value depends only on your band.</p>
${h.table(['Household', 'Pre-registered', 'New with grant', 'Advantage of new'], [[0, 0], [1, 0], [2, 0], [2, 2]].map(([st, k]) => { const f = h.P.foerderung.bev[st][k]; const neu = nettopreis(LP - RN, f); const tz = LP - RT; return [`band ${st + 1}, ${k} children`, h.eur(tz), h.eur(neu), h.eur(tz - neu)]; }), 'Final price after discount and grant, illustrative offer', ['l', 'r', 'r', 'r'])}
<p>A negative advantage means the pre-registered car would be cheaper. Above the income limit there is no grant, and only the discount counts. The sum leaves out the quota payout because it applies equally to both cars.</p>
<h2>The registration window</h2>
<p>The grant covers first registrations from ${h.date(h.P.foerderung.erstzulassung_ab)}. The application portal only opened on ${h.date(h.P.foerderung.richtlinie_datum)}; people who had registered earlier could still apply. The only limit is the ${h.P.foerderung.antragsfrist_monate}-month application deadline.</p>
${h.table(['Case', 'Registration', 'Battery electric in window', 'Apply by'], faelle.map(([d, , en]) => [en, h.date(d), zeitraumOk('bev', d) ? 'yes' : 'no', zeitraumOk('bev', d) ? h.date(fristen(d).antragBis) : 'n/a']), 'Window and application deadline for a few dates', ['l', 'r', 'l', 'r'])}
<p>At the other end are ${h.date(h.P.foerderung.bev_erstzulassung_bis)} for battery electric cars and ${h.date(h.P.foerderung.phev_erstzulassung_bis)} for plug-in hybrids and range extenders. What comes after those dates is under ${h.a('laufzeit', 'how long it runs')}.</p>
<h2>Buying abroad</h2>
<p>${h.src('bafaFaq', 'BAFA')} answers the question of purchases outside Germany and the EU with yes: where the vehicle was bought is irrelevant. What matters is first registration in Germany on or after ${h.date(h.P.foerderung.erstzulassung_ab)}. Three points deserve attention when buying abroad:</p>
<ol>
<li><strong>No registration abroad:</strong> the car must arrive on transfer plates or on a transporter and may not have been registered there normally.</li>
<li><strong>No foreign grant:</strong> comparable funding from another EU member state for the same car rules out the German grant.</li>
<li><strong>Documents in German:</strong> a contract in another language needs a certified translation.</li>
</ol>
<p>A car you bring with you when moving to Germany that was already registered in your home country gets no grant. What else newcomers need to know is under ${h.a('zuzug', 'new to Germany')}.</p>
<h2>No price cap, no model list, no EU rule</h2>
<p>Three assumptions persist and are not true for 2026. First, there is no price cap: an expensive electric car qualifies too if household income fits. Second, there is no official list of eligible models; BAFA only publishes statistics of approved applications by brand and model. Third, there is no requirement for the car to be built in the EU. BAFA refers to a European Commission proposal for an “Industrial Accelerator Act” that could contain such preferences; the drafts have no effect on today’s grant. Which models have been funded most and what they cost after the grant is shown under ${h.a('foerderfaehige-modelle', 'eligible models')}.</p>
<h2>What to check in the purchase contract</h2>
<ul>
<li>The description “new vehicle” (Neufahrzeug) and no mention of a pre-, dealer or factory registration.</li>
<li>No first-registration date earlier than your own; if in doubt, ask for the vehicle identification number and confirmation that the car was never registered.</li>
<li>For parallel imports: a statement that the car was neither registered nor funded abroad.</li>
<li>The keeper: the car is registered to you, not to the dealer, a company or someone else.</li>
<li>The expected registration date, especially for plug-in hybrids close to the end of their window.</li>
</ul>
<h2>Fuel cells and range extenders</h2>
<p>Besides battery cars, the guideline funds fuel cell vehicles at the same amounts and over the same period. Range extenders are treated like plug-in hybrids: lower amounts, technical limits on CO2 or range, first registration by ${h.date(h.P.foerderung.phev_erstzulassung_bis)}.</p>
<h2>Discounts and dealer bonuses</h2>
<p>A discount on a new car does not rule out the grant. Manufacturer bonuses and dealer reductions are price cuts, not public funding, and can be combined with the federal grant. How the amounts add up is worked out in ${h.a('kumulierung', 'combining bonuses')}. The application after registration is described in ${h.a('antrag', 'how to apply')}.</p>`,
  },
});
