import { defineGuide } from '../../lib/guide-types';
import { foerderung, haushaltsZvE } from '../../lib/engine/foerderung';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Selbstständige und Firmenwagen: antragsberechtigt als Privatperson, Auto im Privatvermögen, kein späteres
 * Einbringen ins Betriebsvermögen während der Haltedauer; Unternehmen, Vereine, Kommunen ausgeschlossen.
 * Schwankende Gewinne: Durchschnitt aus zwei Bescheiden. Beispiele mit dem Rechenkern.
 */
const F = P.foerderung;
const z = '2026-11-01';
const b = (zve: number, kinder = 0) => foerderung({ zve, kinder, antrieb: 'bev', zulassung: z }).betrag;
const jahre: Array<[string, string, number, number, number]> = [
  ['Grafikdesignerin, Aufbaujahr und gutes Jahr', 'Graphic designer, start-up year and good year', 22000, 58000, 0],
  ['Handwerksmeister, Rekordjahr und normales Jahr', 'Master tradesman, record year and normal year', 104000, 52000, 2],
  ['Berater, zwei ähnliche Jahre', 'Consultant, two similar years', 61000, 63000, 0],
  ['Physiotherapeutin, Elternzeit und Rückkehr', 'Physiotherapist, parental leave and return', 9000, 47000, 1],
];

export default defineGuide({
  id: 'selbststaendige',
  group: 'foerderung',
  order: 60,
  mini: 'fSelbst',
  related: ['einkommensgrenze', 'haltedauer', 'leasing', 'kfz-steuer'],
  sources: ['bafaFaq', 'richtlinie', 'bafaVoraussetzungen', 'estg2'],
  de: {
    slug: 'selbststaendige-firmenwagen',
    nav: 'Selbstständige',
    card: 'Förderung für Selbstständige und Freiberufler, warum Firmenwagen ausgeschlossen sind und wie schwankende Gewinne zählen.',
    title: 'E-Auto-Förderung Selbstständige 2026: privat statt Firma',
    description: 'E-Auto-Förderung für Selbstständige 2026: als Privatperson möglich, Auto im Privatvermögen, kein Firmenwagen; Gewinne zählen gemittelt aus zwei Bescheiden.',
    h1: 'E-Auto-Förderung für Selbstständige und Freiberufler 2026',
    intro: 'Selbstständige können die Förderung bekommen, aber nur für ein Auto, das privat bleibt. Was das für Betriebsvermögen, Dienstwagen und schwankende Gewinne bedeutet.',
    resume: `Selbstständige, Freiberufler und Einzelunternehmer sind für die E-Auto-Förderung 2026 antragsberechtigt, und zwar als Privatpersonen. Das BAFA stellt klar: Der geförderte Pkw muss privat gehalten werden und darf nicht zum Betriebsvermögen gehören. Unternehmen, Vereine und Kommunen können keinen Antrag stellen, und ein Auto, das auf eine GmbH oder ein anderes Unternehmen zugelassen ist, ist nicht förderfähig. Auch während der Haltedauer von ${F.haltedauer_monate} Monaten darf das Auto nicht nachträglich ins Betriebsvermögen wechseln. Ansonsten gelten dieselben Regeln wie für alle: Haushaltseinkommen aus den ${F.bescheide_je_person} aktuellsten Einkommensteuerbescheiden, gemittelt je Person. Gerade für Selbstständige mit schwankenden Gewinnen ist dieser Durchschnitt wichtig. Ein Handwerksmeister mit ${DE.eur(104000)} in einem Rekordjahr und ${DE.eur(52000)} im Jahr danach kommt auf ${DE.eur(haushaltsZvE([[104000, 52000]]))}; mit zwei Kindern und ohne weiteres Einkommen im Haushalt bekommt er für ein Elektroauto ${DE.eur(b(haushaltsZvE([[104000, 52000]]), 2))}. Maßgeblich ist das zu versteuernde Einkommen, also nach Abzug der Betriebsausgaben und aller übrigen Abzüge, nicht der Umsatz.`,
    faqs: [
      { q: 'Kann ich als Selbstständiger die E-Auto-Förderung beantragen?', a: 'Ja, als Privatperson. Selbstständige, Freiberufler und Einzelunternehmer sind ausdrücklich antragsberechtigt. Das Auto muss aber privat gehalten werden, also im Privatvermögen stehen und auf Sie persönlich zugelassen sein. Einkommensnachweis sind wie bei allen anderen die Einkommensteuerbescheide. Ein Antrag über die Firma oder für ein Betriebsfahrzeug ist nicht möglich.' },
      { q: 'Darf ich das geförderte E-Auto auch beruflich nutzen?', a: 'Die Richtlinie verlangt, dass das Auto zum Privatvermögen gehört, nicht, dass Sie es nie für eine berufliche Fahrt nutzen. Entscheidend ist die steuerliche Zuordnung. Wird das Auto überwiegend betrieblich genutzt, gehört es steuerlich in der Regel zum Betriebsvermögen und wäre dann nicht förderfähig. Klären Sie die Zuordnung im Zweifel mit Ihrer Steuerberatung, bevor Sie den Antrag stellen.' },
      { q: 'Gibt es die E-Auto-Förderung für einen Firmenwagen?', a: 'Nein. Unternehmen, Vereine und Kommunen sind nicht antragsberechtigt, und ein auf eine Firma zugelassenes Auto kann nicht gefördert werden. Das gilt auch für einen Dienstwagen, den Ihnen Ihr Arbeitgeber überlässt. Für Firmenfahrzeuge gibt es eigene steuerliche Regeln, die mit dieser Förderung nichts zu tun haben.' },
      { q: 'Kann ich das Auto nach dem Antrag ins Betriebsvermögen übernehmen?', a: `Nicht während der Haltedauer. Das Auto muss ${F.haltedauer_monate} Monate auf Sie zugelassen und im Privatvermögen bleiben. Ein späteres Einbringen ins Betriebsvermögen in dieser Zeit verstößt gegen die Bedingungen und kann zur Rückforderung führen. Nach Ablauf der Haltedauer ist das keine Frage der Förderung mehr.` },
      { q: 'Welche Bescheide zählen, wenn mein Steuerberater spät abgibt?', a: `Immer die zwei aktuellsten Einkommensteuerbescheide, die zum Zeitpunkt des Antrags vorliegen. Wer mit Steuerberatung längere Abgabefristen hat, legt oft Bescheide vor, die zwei oder drei Jahre zurückliegen. Das ist zulässig, solange das Steuerjahr höchstens ${F.bescheid_max_alter_jahre} Jahre zurückliegt. Ein Bescheid über Vorauszahlungen enthält kein festgestelltes zvE und ersetzt keinen Einkommensteuerbescheid.` },
    ],
    body: (h) => `
<h2>Privatperson ja, Unternehmen nein</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} richtet sich an natürliche Personen. Das ${h.src('bafaFaq', 'BAFA')} beantwortet die Frage nach Selbstständigen deshalb mit einem klaren Ja und einer Bedingung: Der geförderte Pkw muss privat gehalten werden und darf nicht Teil des Betriebsvermögens sein. Für alles andere gelten dieselben Anforderungen wie für Angestellte oder Rentner. Ausgeschlossen sind dagegen Antragsteller, die keine natürlichen Personen sind: Unternehmen jeder Rechtsform, Vereine und Kommunen.</p>
${h.table(['Fall', 'Förderfähig', 'Warum'], [
  ['Freiberuflerin, Auto privat zugelassen und im Privatvermögen', 'ja', 'natürliche Person, Privatvermögen'],
  ['Einzelunternehmer, Auto im Betriebsvermögen', 'nein', 'Betriebsvermögen'],
  ['GmbH-Geschäftsführer, Auto auf die GmbH zugelassen', 'nein', 'Halter ist ein Unternehmen'],
  ['GmbH-Geschäftsführer, Auto privat gekauft und zugelassen', 'ja', 'natürliche Person, Privatvermögen'],
  ['Angestellte mit Dienstwagen des Arbeitgebers', 'nein', 'Halter ist der Arbeitgeber'],
  ['Verein kauft ein Elektroauto für Fahrdienste', 'nein', 'keine natürliche Person'],
], 'Wer mit welchem Auto antragsberechtigt ist', ['l', 'l', 'l'])}
<h2>Privatvermögen und berufliche Fahrten</h2>
<p>Die Grenze zieht das Steuerrecht, nicht die Förderrichtlinie. Ein Fahrzeug gehört zum Betriebsvermögen, wenn es überwiegend betrieblich genutzt wird; dann ist es notwendiges Betriebsvermögen. Bei einer betrieblichen Nutzung zwischen einem kleineren Anteil und der Hälfte besteht unter Umständen ein Wahlrecht. Wer das Auto im Privatvermögen hält und gelegentlich zu Kunden fährt, verliert die Förderung dadurch nicht. Wer es dagegen in die Bilanz aufnimmt, Abschreibungen geltend macht oder die Kosten als Betriebsausgaben verbucht, hat es dem Betriebsvermögen zugeordnet. Diese Zuordnung lässt sich nicht nachträglich für die Förderung umdeuten.</p>
<p>Weil die Abgrenzung im Einzelfall steuerliche Folgen hat, ist sie Sache Ihrer Steuerberatung. Diese Seite beschreibt nur, was die Förderung verlangt: privat zugelassen, privat gehalten, für ${h.P.foerderung.haltedauer_monate} Monate.</p>
<h2>Schwankende Gewinne und der Durchschnitt</h2>
<p>Für das Haushaltseinkommen zählt bei Selbstständigen das zu versteuernde Einkommen laut Bescheid, also nach Abzug der Betriebsausgaben, der Vorsorgeaufwendungen und der übrigen Abzüge nach ${h.src('estg2', '§ 2 Abs. 5 EStG')}. Der Umsatz spielt keine Rolle. Weil der Durchschnitt aus zwei Jahren gebildet wird, wiegt ein Ausreißer nach oben oder unten nur halb.</p>
${h.table(['Fall', 'Jahr 1', 'Jahr 2', 'Durchschnitt', 'Kinder', 'Förderung'], jahre.map(([de, , a, c, k]) => [de, h.eur(a), h.eur(c), h.eur(haushaltsZvE([[a, c]])), String(k), h.eur(b(haushaltsZvE([[a, c]]), k))]), 'Selbstständige allein im Haushalt, Elektroauto, Zulassung im November 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Der Handwerksmeister läge mit dem Rekordjahr allein weit über jeder Grenze, mit dem normalen Jahr allein in der zweiten Stufe. Der Durchschnitt bringt ihn in den Kinderbereich über ${h.eur(h.P.foerderung.obergrenze_basis)}, wo er mit zwei Kindern noch ${h.eur(b(haushaltsZvE([[104000, 52000]]), 2))} bekommt. Die Physiotherapeutin profitiert umgekehrt vom schwachen Jahr in Elternzeit. Lebt ein Partner im Haushalt, kommt dessen Durchschnitt hinzu; wie, steht unter ${h.a('einkommensgrenze', 'Einkommensgrenze')}.</p>
<h2>Welche Bescheide gelten</h2>
<p>Maßgeblich sind die zwei aktuellsten Einkommensteuerbescheide zum Zeitpunkt des Antrags. Mit Steuerberatung gelten für die Abgabe der Erklärung längere Fristen, und Bescheide kommen entsprechend später. Das ist kein Hindernis, solange das jeweils geprüfte Steuerjahr nicht mehr als ${h.P.foerderung.bescheid_max_alter_jahre} Jahre zurückliegt. Ein Bescheid über Vorauszahlungen setzt nur Abschläge fest und enthält kein festgestelltes zu versteuerndes Einkommen; er ersetzt den Einkommensteuerbescheid nicht.</p>
<p>Ein Gedanke liegt nahe: den Antrag so zu legen, dass ein schwaches Jahr mitzählt. Das ist im Rahmen der Fristen möglich, denn welche Bescheide die neuesten sind, entscheidet sich am Tag des Antrags. Spätere Bescheide mit höherem Einkommen ändern an einer Bewilligung nichts. Umgekehrt lässt sich ein bereits ergangener neuerer Bescheid nicht weglassen, weil das BAFA die aktuellsten verlangt.</p>
<h2>Gründungsphase und Wechsel in die Selbstständigkeit</h2>
<p>Wer sich gerade selbstständig gemacht hat, hat meist noch Bescheide aus der Zeit als Angestellter. Sie zählen ganz normal, denn das BAFA fragt nach dem zu versteuernden Einkommen, nicht nach der Art der Tätigkeit. Ein Gründer mit ${h.eur(48000)} aus dem letzten Angestelltenjahr und ${h.eur(12000)} aus dem ersten Jahr als Selbstständiger kommt auf ${h.eur(haushaltsZvE([[48000, 12000]]))} und damit allein im Haushalt auf ${h.eur(b(haushaltsZvE([[48000, 12000]])))} für ein Elektroauto. Ein Verlust im Gründungsjahr senkt das zvE, unter Umständen bis auf ${h.eur(0)}; auch ein solcher Bescheid ist ein gültiger Nachweis. Wechselt jemand während der Haltedauer von der Selbstständigkeit zurück in eine Anstellung oder umgekehrt, hat das keine Auswirkung, weil allein die Bescheide beim Antrag zählen.</p>
<p>Für Paare, in denen beide selbstständig sind, gilt dasselbe wie für alle Haushalte: Jeder Durchschnitt wird für sich gebildet, dann wird addiert. Zwei gute Jahre bei einem Partner können so ein schwaches Jahr beim anderen ausgleichen und umgekehrt. Der Mini-Rechner oben zeigt, was der Durchschnitt im Vergleich zu jedem einzelnen Jahr ergibt, damit Sie sehen, wie stark ein Ausreißer wirkt.</p>
<h2>Leasing und Finanzierung für Selbstständige</h2>
<p>Ob ein Auto gekauft, finanziert oder geleast wird, ist für die Förderung gleich, solange es neu ist, auf Sie privat zugelassen wird und die Haltedauer erfüllt. Ein Privatleasing mit kürzerer Laufzeit als ${h.P.foerderung.haltedauer_monate} Monate reicht nicht ohne Verlängerung oder Übernahme. Ein Gewerbeleasing über die Firma ist ausgeschlossen, weil das Auto dann zum Betrieb gehört. Mehr dazu unter ${h.a('leasing', 'Leasing')}.</p>
<h2>Kfz-Steuer und Quote bleiben gleich</h2>
<p>Die Befreiung von der Kfz-Steuer und die THG-Prämie gelten unabhängig davon, ob das Auto privat oder betrieblich gehalten wird. Für ein Firmenfahrzeug ohne Förderung bleiben diese Vorteile also erhalten. Die Rechnung zur Steuer zeigt der ${h.a('kfz-steuer', 'Kfz-Steuer-Rechner')}. Was passiert, wenn das Auto vor Ablauf der Haltedauer verkauft, abgemeldet oder umgewidmet wird, steht unter ${h.a('haltedauer', 'Haltedauer und Verkauf')}.</p>
<h2>Prüfliste vor dem Antrag</h2>
<ul>
<li>Auto auf Sie persönlich zugelassen, nicht auf die Firma und nicht auf eine Gesellschaft, an der Sie beteiligt sind.</li>
<li>Steuerlich dem Privatvermögen zugeordnet, ohne Abschreibung im Betrieb.</li>
<li>Zwei aktuelle Einkommensteuerbescheide für jede erwachsene Person des Haushalts.</li>
<li>Haushaltseinkommen unter der Grenze für Ihre Kinderzahl.</li>
<li>Kaufvertrag oder Leasingvertrag auf Sie oder eine andere Privatperson, nicht über ein Gewerbekonto abgeschlossen.</li>
<li>Kein Plan, das Auto innerhalb von ${h.P.foerderung.haltedauer_monate} Monaten in den Betrieb zu übernehmen.</li>
</ul>`,
  },
  en: {
    slug: 'self-employed-company-cars',
    nav: 'Self-employed',
    card: 'The grant for the self-employed and freelancers, why company cars are excluded and how fluctuating profits count.',
    title: 'EV grant for the self-employed 2026: private, not company',
    description: 'EV grant for the self-employed 2026: eligible as a private person, car held privately, no company cars; fluctuating profits are averaged over two assessments.',
    h1: 'The 2026 EV grant for the self-employed and freelancers',
    intro: 'Self-employed people can get the grant, but only for a car that stays private. What that means for business assets, company cars and profits that go up and down.',
    resume: `The self-employed, freelancers and sole traders can apply for Germany’s 2026 EV grant as private individuals. BAFA is clear: the funded car must be held privately and may not be part of business assets (Betriebsvermögen). Companies, associations and local authorities cannot apply, and a car registered to a limited company (GmbH) or another business does not qualify. During the ${F.haltedauer_monate}-month holding period, the car may not be moved into business assets later either. Otherwise the same rules apply as for everyone: household income from the ${F.bescheide_je_person} most recent income tax assessments (Einkommensteuerbescheid), averaged per person. For the self-employed with fluctuating profits, that average matters. A master tradesman with ${EN.eur(104000)} in a record year and ${EN.eur(52000)} the year after averages ${EN.eur(haushaltsZvE([[104000, 52000]]))}; with two children and no other income in the household he gets ${EN.eur(b(haushaltsZvE([[104000, 52000]]), 2))} for a battery electric car. What counts is taxable income (zu versteuerndes Einkommen) after business expenses and all other deductions, not turnover.`,
    faqs: [
      { q: 'Can I apply for the EV grant as a self-employed person?', a: 'Yes, as a private individual. The self-employed, freelancers and sole traders are expressly eligible. The car must, however, be held privately, meaning it is part of your private assets and registered to you personally. Income is proven with income tax assessments, as for everyone else. Applying through your business or for a business vehicle is not possible.' },
      { q: 'May I use the funded EV for work trips too?', a: 'The guideline requires the car to be a private asset, not that you never use it for a work trip. The tax allocation decides. If the car is used mainly for business, it normally counts as a business asset for tax purposes and would then not qualify. If in doubt, settle the allocation with your tax adviser before applying.' },
      { q: 'Is there an EV grant for a company car?', a: 'No. Companies, associations and local authorities cannot apply, and a car registered to a business cannot be funded. That also applies to a company car your employer provides. Company vehicles have their own tax rules, which have nothing to do with this grant.' },
      { q: 'Can I move the car into my business after applying?', a: `Not during the holding period. The car must stay registered to you and in your private assets for ${F.haltedauer_monate} months. Moving it into business assets in that time breaches the conditions and can lead to a claw-back. Once the holding period is over, it is no longer a question for the grant.` },
      { q: 'Which assessments count if my tax adviser files late?', a: `Always the two most recent income tax assessments available when you apply. With a tax adviser, filing deadlines are longer, so assessments often date back two or three years. That is allowed as long as the tax year is no more than ${F.bescheid_max_alter_jahre} years back. An advance payment notice (Vorauszahlungsbescheid) contains no assessed taxable income and does not replace an income tax assessment.` },
    ],
    body: (h) => `
<h2>Private person yes, business no</h2>
<p>The ${h.src('richtlinie', 'funding guideline')} is aimed at natural persons. ${h.src('bafaFaq', 'BAFA')} therefore answers the question about the self-employed with a clear yes and one condition: the funded car must be held privately and not be part of business assets. Everything else follows the same requirements as for employees or pensioners. Excluded are applicants who are not natural persons: companies of any legal form, associations and local authorities.</p>
${h.table(['Case', 'Qualifies', 'Why'], [
  ['Freelancer, car registered privately and in private assets', 'yes', 'natural person, private assets'],
  ['Sole trader, car in business assets', 'no', 'business assets'],
  ['GmbH director, car registered to the GmbH', 'no', 'the keeper is a company'],
  ['GmbH director, car bought and registered privately', 'yes', 'natural person, private assets'],
  ['Employee with an employer’s company car', 'no', 'the keeper is the employer'],
  ['Association buys an electric car for a driving service', 'no', 'not a natural person'],
], 'Who is eligible with which car', ['l', 'l', 'l'])}
<h2>Private assets and work trips</h2>
<p>Tax law draws the line, not the funding guideline. A vehicle is a business asset if it is used mainly for business; it is then a necessary business asset. With business use between a smaller share and half, there may be a choice. If you keep the car in private assets and occasionally drive to clients, you do not lose the grant. If you put it on the balance sheet, claim depreciation or book its costs as business expenses, you have assigned it to the business. That assignment cannot be reinterpreted afterwards for the grant.</p>
<p>Because the dividing line has tax consequences in each case, it is a matter for your tax adviser. This page only describes what the grant requires: registered privately, held privately, for ${h.P.foerderung.haltedauer_monate} months.</p>
<h2>Fluctuating profits and the average</h2>
<p>For the self-employed, household income is the taxable income on the assessment, after business expenses, pension and insurance contributions and the other deductions under ${h.src('estg2', 'section 2(5) EStG')}. Turnover plays no part. Because the average is taken over two years, an outlier up or down only weighs half.</p>
${h.table(['Case', 'Year 1', 'Year 2', 'Average', 'Children', 'Grant'], jahre.map(([, en, a, c, k]) => [en, h.eur(a), h.eur(c), h.eur(haushaltsZvE([[a, c]])), String(k), h.eur(b(haushaltsZvE([[a, c]]), k))]), 'Self-employed living alone, battery electric, registered in November 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>On the record year alone, the tradesman would be far above any limit; on the normal year alone, in the second band. The average puts him in the child range above ${h.eur(h.P.foerderung.obergrenze_basis)}, where with two children he still gets ${h.eur(b(haushaltsZvE([[104000, 52000]]), 2))}. The physiotherapist, on the other hand, benefits from the weak year of parental leave. If a partner lives in the household, their average is added; how is explained on ${h.a('einkommensgrenze', 'income limit')}.</p>
<h2>Which assessments apply</h2>
<p>What counts is the two most recent income tax assessments at the time you apply. With a tax adviser, filing deadlines are longer and assessments arrive later. That is no obstacle as long as each tax year assessed is no more than ${h.P.foerderung.bescheid_max_alter_jahre} years back. An advance payment notice only sets instalments and contains no assessed taxable income; it does not replace the income tax assessment.</p>
<p>One idea suggests itself: timing the application so that a weak year counts. Within the deadlines that is possible, because which assessments are the latest is decided on the day you apply. Later assessments with higher income do not change an approval. Conversely, you cannot leave out a newer assessment that has already been issued, since BAFA asks for the latest ones.</p>
<h2>Starting out and switching to self-employment</h2>
<p>If you have only just become self-employed, you will usually still have assessments from your time as an employee. They count normally, because BAFA asks about taxable income, not the type of work. A founder with ${h.eur(48000)} from the last employed year and ${h.eur(12000)} from the first self-employed year averages ${h.eur(haushaltsZvE([[48000, 12000]]))}, and living alone gets ${h.eur(b(haushaltsZvE([[48000, 12000]])))} for a battery electric car. A loss in the first year lowers taxable income, possibly to ${h.eur(0)}; such an assessment is valid proof too. Switching back to employment during the holding period, or the other way round, has no effect, since only the assessments at application count.</p>
<h2>Leasing and finance for the self-employed</h2>
<p>Whether a car is bought, financed or leased makes no difference to the grant, as long as it is new, registered to you privately and kept for the holding period. A private lease shorter than ${h.P.foerderung.haltedauer_monate} months is not enough without extending it or buying the car. A business lease through your company is excluded, because the car then belongs to the business. More on this under ${h.a('leasing', 'leasing')}.</p>
<h2>Vehicle tax and quota stay the same</h2>
<p>The vehicle tax exemption and the GHG quota payout apply whether the car is held privately or by a business. A company vehicle without the grant keeps those advantages. The tax sum is on the ${h.a('kfz-steuer', 'vehicle tax calculator')}. What happens if the car is sold, deregistered or reassigned before the holding period ends is under ${h.a('haltedauer', 'holding period and resale')}.</p>
<h2>Checklist before applying</h2>
<ul>
<li>Car registered to you personally, not to the business.</li>
<li>Assigned to private assets for tax, with no depreciation in the business.</li>
<li>Two current income tax assessments for each adult in the household.</li>
<li>Household income under the limit for your number of children.</li>
<li>No plan to move the car into the business within ${h.P.foerderung.haltedauer_monate} months.</li>
</ul>`,
  },
});
