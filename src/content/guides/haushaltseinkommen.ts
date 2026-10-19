import { defineGuide } from '../../lib/guide-types';
import { foerderung, haushaltsZvE } from '../../lib/engine/foerderung';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Haushaltseinkommen: wer zum Haushalt zählt, Durchschnitt je Person, Summe, Zusammenveranlagung, WG,
 * eheähnliche Gemeinschaft (vermutet, widerlegbar), erwachsene Kinder. Beispiele mit vier Bescheiden.
 */
const F = P.foerderung;
const z = '2026-11-01';
const b = (zve: number, kinder = 0) => foerderung({ zve, kinder, antrieb: 'bev', zulassung: z }).betrag;
// Beispiel Lena und Tom: Lena 41 000 und 47 000, Tom 9 000 (Studium) und 21 000 (Berufseinstieg).
const lena = haushaltsZvE([[41000, 47000]]), tom = haushaltsZvE([[9000, 21000]]);
const paar = haushaltsZvE([[41000, 47000], [9000, 21000]]);
// Beispiel Heirat im zweiten Jahr: Jahr 1 zwei Einzelbescheide (36 000 + 30 000), Jahr 2 gemeinsamer Bescheid 70 000.
const heirat = (36000 + 30000 + 70000) / 2;
// WG: drei Erwachsene, jede Person allein.
const wg = [24000, 51000, 83000];

export default defineGuide({
  id: 'haushaltseinkommen',
  group: 'foerderung',
  order: 20,
  mini: 'fZwei',
  related: ['einkommensgrenze', 'kinder', 'antrag', 'zuzug'],
  sources: ['bafaHaushalt', 'bafaFaq', 'richtlinie', 'estg2'],
  de: {
    slug: 'haushaltseinkommen-berechnen',
    nav: 'Haushaltseinkommen',
    card: 'Wer zum Haushalt zählt, wie der Durchschnitt aus zwei Bescheiden entsteht und was für Paare ohne Trauschein gilt.',
    title: 'Haushaltseinkommen E-Auto-Förderung 2026: so rechnen Sie',
    description: 'Haushaltseinkommen für die E-Auto-Förderung 2026: je Person Durchschnitt aus zwei Steuerbescheiden, dann Summe. Mit Paaren, WG, Heirat und erwachsenen Kindern.',
    h1: 'Haushaltseinkommen für die E-Auto-Förderung 2026 berechnen',
    intro: 'Vier Bescheide, zwei Durchschnitte, eine Summe: So entsteht die Zahl, an der die Förderung hängt, und so finden Sie heraus, wer überhaupt zu Ihrem Haushalt zählt.',
    resume: `Für die E-Auto-Förderung 2026 zählt nicht das Einkommen der Person, die den Antrag stellt, sondern das des Haushalts. Zum Haushalt gehören die antragstellende Person, ihr Ehe- oder eingetragener Lebenspartner und eine Person, mit der sie in eheähnlicher Gemeinschaft lebt. Eine solche Gemeinschaft wird vermutet, wenn zwei unverheiratete Erwachsene denselben Hauptwohnsitz haben; widerlegen lässt sich das nur mit einer Erklärung, dass dauerhaft getrennt gewirtschaftet wird. Für jede dieser Personen wird der Durchschnitt des zu versteuernden Einkommens aus den ${F.bescheide_je_person} aktuellsten Einkommensteuerbescheiden gebildet, danach werden die Durchschnitte addiert. Ein Beispiel: Lena hat ${DE.eur(41000)} und ${DE.eur(47000)}, Tom ${DE.eur(9000)} und ${DE.eur(21000)}. Ihr Haushaltseinkommen beträgt ${DE.eur(paar)}, die Förderung für ein Elektroauto ohne Kind ${DE.eur(b(paar))}. Einkommen erwachsener Kinder zählt nicht mit, und in einer Wohngemeinschaft ist jede Person ihr eigener Haushalt. Je Haushalt sind höchstens ${F.antraege_je_haushalt} Anträge möglich.`,
    faqs: [
      { q: 'Zählt das Einkommen meines Partners mit, wenn wir nicht verheiratet sind?', a: 'Ja, wenn Sie zusammen wohnen. Bei zwei Erwachsenen mit gemeinsamem Hauptwohnsitz, die weder verheiratet noch verpartnert sind, vermutet das BAFA eine eheähnliche Gemeinschaft. Dann gehören beide Einkommen zum Haushalt. Die Vermutung lässt sich durch eine Eigenerklärung widerlegen, wenn Sie dauerhaft getrennt wirtschaften, etwa als Wohngemeinschaft mit getrennten Kassen.' },
      { q: 'Wie rechne ich das Haushaltseinkommen bei Zusammenveranlagung?', a: 'Wer gemeinsam veranlagt wird, bekommt einen Bescheid mit einem gemeinsamen zu versteuernden Einkommen. Dieser Bescheid genügt für beide Partner. Sie nehmen den gemeinsamen Wert aus beiden Jahren und bilden daraus den Durchschnitt; das Ergebnis ist dasselbe, als hätten Sie für jede Person getrennt gemittelt und addiert. Im Mini-Rechner tragen Sie den gemeinsamen Wert bei einer Person ein.' },
      { q: 'Gehört das Einkommen meines erwachsenen Kindes zum Haushaltseinkommen?', a: 'Nein. Erwerbstätige Kinder, die noch in der Wohnung leben, werden beim Haushaltseinkommen nicht berücksichtigt, auch wenn sie volljährig sind und gut verdienen. Das gilt ebenso für das Einkommen minderjähriger Kinder. Gezählt werden nur Sie und Ihr Partner. Ein volljähriges Kind kann umgekehrt selbst einen Antrag stellen, wenn das Auto auf es zugelassen wird.' },
      { q: 'Wir haben im letzten Jahr geheiratet: welche Bescheide zählen?', a: `Die zwei aktuellsten Bescheide je Person, gleich welcher Art. Für das Jahr vor der Heirat sind das meist zwei Einzelbescheide, für das Jahr der Heirat oft ein gemeinsamer. Addiert und halbiert ergibt sich dasselbe Haushaltseinkommen. Mit ${DE.eur(36000)} und ${DE.eur(30000)} einzeln sowie ${DE.eur(70000)} gemeinsam sind es ${DE.eur(heirat)}.` },
      { q: 'Können zwei Personen im selben Haushalt je eine Förderung bekommen?', a: `Ja. Je Haushalt sind ${F.antraege_je_haushalt} Anträge möglich, und jede Person kann die Förderung einmal erhalten. Beide Anträge werden mit demselben Haushaltseinkommen geprüft. Jedes Auto muss auf die Person zugelassen sein, die den Antrag stellt, und jede muss ihre eigene Haltedauer einhalten.` },
      { q: 'Was gilt in einer Wohngemeinschaft für das Haushaltseinkommen?', a: 'Wenn mehrere Erwachsene in einer WG wirtschaftlich unabhängig voneinander leben, ist jede Person für die Förderung ein eigener Haushalt. Jede kann für sich einen Antrag stellen, sofern das Auto auf ihren Namen zugelassen ist und ihr eigenes Einkommen unter der Grenze liegt. Bei nur zwei Bewohnern greift aber zunächst die Vermutung einer eheähnlichen Gemeinschaft, die per Erklärung zu widerlegen ist.' },
    ],
    body: (h) => `
<h2>Wer zum Haushalt gehört</h2>
<p>Das ${h.src('bafaFaq', 'BAFA')} beschreibt einen Haushalt als eine einzelne Person oder mehrere Personen, die dauerhaft zusammen wohnen und wirtschaften. Für die Förderung werden aber nur bestimmte Erwachsene mitgezählt. Das ${h.src('bafaHaushalt', 'Schaubild des BAFA zum Haushalt')} fasst es zusammen:</p>
<ul>
<li><strong>Die antragstellende Person</strong>, auf die das Auto zugelassen wird.</li>
<li><strong>Ehe- oder eingetragene Lebenspartner</strong>, die im selben Haushalt leben.</li>
<li><strong>Partner einer eheähnlichen Gemeinschaft</strong>: vermutet bei zwei unverheirateten Erwachsenen mit gemeinsamem Hauptwohnsitz.</li>
</ul>
<p>Nicht mitgezählt werden Kinder, auch erwachsene mit eigenem Einkommen, Eltern oder Großeltern, die im Haus leben, und Mitbewohner einer WG, die getrennt wirtschaften. Kinder unter 18 wirken nur über die Kinderzahl, nicht über ihr Einkommen; wie, steht unter ${h.a('kinder', 'Kinderbonus')}.</p>
<h2>Die Rechnung in drei Schritten</h2>
<ol>
<li>Für jede Person des Haushalts die ${h.P.foerderung.bescheide_je_person} aktuellsten Einkommensteuerbescheide heraussuchen und jeweils die Zeile „zu versteuerndes Einkommen“ ablesen.</li>
<li>Je Person den Durchschnitt bilden: beide Werte addieren und halbieren.</li>
<li>Die Durchschnitte aller Personen addieren. Das ist das Haushaltseinkommen, mit dem das BAFA die Stufe bestimmt.</li>
</ol>
${h.table(['Person', 'Älterer Bescheid', 'Neuerer Bescheid', 'Durchschnitt'], [
  ['Lena', h.eur(41000), h.eur(47000), h.eur(lena)],
  ['Tom', h.eur(9000), h.eur(21000), h.eur(tom)],
  ['Haushalt', '', '', h.eur(paar)],
], 'Beispiel: unverheiratetes Paar mit gemeinsamer Wohnung', ['l', 'r', 'r', 'r'])}
<p>Mit ${h.eur(paar)} liegen Lena und Tom in der dritten Stufe und bekommen für ein Elektroauto ${h.eur(b(paar))}. Hätte Lena allein gewohnt, wären es mit ${h.eur(lena)} ${h.eur(b(lena))} gewesen. Wäre Tom allein Antragsteller und lebte er allein, wären es ${h.eur(b(tom))}. Weil beide zusammenwohnen, zählt nur die gemeinsame Rechnung, egal wer von beiden den Antrag stellt.</p>
<h2>Warum der Durchschnitt fairer ist als ein Jahr</h2>
<p>Ein einzelnes Jahr kann täuschen: der Berufseinstieg nach dem Studium, ein Jahr in Elternzeit, eine Abfindung, ein Jahr mit hohem Gewinn. Der Durchschnitt glättet das. In unserem Beispiel hätte Tom mit dem neueren Bescheid allein ${h.eur(21000)}, mit dem älteren ${h.eur(9000)}; der Mittelwert liegt bei ${h.eur(tom)}. Das Haushaltseinkommen ändert sich dadurch um mehrere tausend Euro gegenüber einer Rechnung nur mit dem letzten Jahr, und damit unter Umständen die Stufe.</p>
<h2>Zusammenveranlagung und Heirat</h2>
<p>Ehepaare, die gemeinsam veranlagt werden, bekommen einen Bescheid mit einem gemeinsamen Wert. Der genügt als Nachweis für beide. Für die Rechnung ist das ohne Bedeutung, weil am Ende ohnehin addiert wird: Ob zwei Personen je ${h.eur(35000)} haben oder ein gemeinsamer Bescheid ${h.eur(70000)} ausweist, das Haushaltseinkommen ist dasselbe.</p>
<p>Etwas mehr Sorgfalt braucht ein Wechsel zwischen den Jahren. Ein Paar hat im ersten Jahr noch zwei Einzelbescheide über ${h.eur(36000)} und ${h.eur(30000)}, im Jahr der Heirat einen gemeinsamen über ${h.eur(70000)}. Das Haushaltseinkommen ist dann (${h.eur(36000)} + ${h.eur(30000)} + ${h.eur(70000)}) geteilt durch zwei, also ${h.eur(heirat)}. Für ein Elektroauto ohne Kind ergibt das ${h.eur(b(heirat))}.</p>
<h2>Wohngemeinschaft: jede Person für sich</h2>
<p>Leben mehrere Erwachsene wirtschaftlich unabhängig in einer WG, gilt jede Person als eigener Haushalt. In einer Dreier-WG mit ${wg.map((x) => h.eur(x)).join(', ')} hätte jede Person ihren eigenen Anspruch:</p>
${h.table(['Mitbewohner', 'Eigenes Einkommen', 'Förderung Elektroauto'], wg.map((x, i) => [`Person ${i + 1}`, h.eur(x), h.eur(b(x))]), 'Wohngemeinschaft mit getrennten Kassen', ['l', 'r', 'r'])}
<p>Bei einer Zweier-WG greift zunächst die Vermutung der eheähnlichen Gemeinschaft. Sie lässt sich widerlegen, wenn beide dauerhaft getrennt wirtschaften, also keine gemeinsame Kasse führen und sich nicht gegenseitig versorgen. Das erklären Sie im Antrag selbst.</p>
<h2>Sonderfälle</h2>
<ul>
<li><strong>Partner ohne Bescheid:</strong> Wer nicht zur Abgabe einer Steuererklärung verpflichtet ist, kann sie freiwillig abgeben. Hat er kein steuerpflichtiges Einkommen, weist der Bescheid ${h.eur(0)} aus, und das genügt als Nachweis.</li>
<li><strong>Trennung:</strong> Wer getrennt wohnt und wirtschaftet, bildet keinen gemeinsamen Haushalt mehr; maßgeblich ist die Lage beim Antrag.</li>
<li><strong>Bescheide unterschiedlicher Jahre:</strong> Jede Person nimmt ihre eigenen zwei aktuellsten Bescheide. Sie müssen nicht dieselben Jahre betreffen, dürfen aber nicht älter als ${h.P.foerderung.bescheid_max_alter_jahre} Steuerjahre sein.</li>
<li><strong>Einmalzahlungen:</strong> Abfindungen und ähnliche Zahlungen zählen, soweit sie im zvE stehen. Der Durchschnitt aus zwei Jahren dämpft ihre Wirkung.</li>
</ul>
<h2>Häufige Rechenfehler</h2>
<ul>
<li><strong>Nur das eigene Einkommen eintragen:</strong> Wer mit einem Partner zusammenlebt, rechnet dessen Durchschnitt immer mit, auch wenn nur ein Name im Fahrzeugschein steht.</li>
<li><strong>Den Bruttolohn statt des zvE nehmen:</strong> Die Lohnsteuerbescheinigung zeigt den Bruttoarbeitslohn, nicht das zu versteuernde Einkommen. Für die Förderung zählt allein der Bescheid.</li>
<li><strong>Einen gemeinsamen Bescheid doppelt zählen:</strong> Steht im gemeinsamen Bescheid ein Wert für beide, wird er nicht noch einmal für den Partner addiert.</li>
<li><strong>Das neueste Jahr übersehen:</strong> Ist ein neuerer Bescheid eingegangen, ersetzt er den ältesten. Welche beiden die aktuellsten sind, entscheidet sich am Tag des Antrags.</li>
</ul>
<p>Der Mini-Rechner oben nimmt vier einzelne Werte und zeigt beide Durchschnitte getrennt, damit sich solche Fehler leicht erkennen lassen. Prüfen Sie das Ergebnis zum Schluss mit dem großen Rechner, der auch Kinder und den Zulassungsmonat berücksichtigt.</p>
<h2>Zwei Anträge in einem Haushalt</h2>
<p>Jede Person kann die Förderung einmal bekommen, ein Haushalt höchstens ${h.P.foerderung.antraege_je_haushalt}-mal. Kauft ein Paar zwei Elektroautos, kann also jeder einen Antrag stellen, beide mit demselben Haushaltseinkommen. Jedes Auto muss auf die jeweilige Person zugelassen sein und ${h.P.foerderung.haltedauer_monate} Monate auf sie zugelassen bleiben. Wie der Antrag abläuft und welche Dokumente Sie brauchen, steht unter ${h.a('antrag', 'Antrag stellen')}. Wer erst vor kurzem nach Deutschland gezogen ist und noch wenige deutsche Bescheide hat, findet Hinweise unter ${h.a('zuzug', 'ohne deutschen Steuerbescheid')}.</p>`,
  },
  en: {
    slug: 'household-income',
    nav: 'Household income',
    card: 'Who counts as your household, how the two-assessment average works and what applies to unmarried couples.',
    title: 'Household income for the EV grant 2026: how to work it out',
    description: 'Household income for the EV grant 2026: each adult’s average from two tax assessments, then the sum. With couples, flatshares, marriage and adult children.',
    h1: 'Working out household income for the 2026 EV grant',
    intro: 'Four assessments, two averages, one sum: this is how the figure the grant depends on is built, and how to tell who belongs to your household in the first place.',
    resume: `For Germany’s 2026 EV grant, what counts is not the applicant’s income but the household’s. The household is the applicant, their spouse or registered partner, and a person they live with in a marriage-like relationship (eheähnliche Gemeinschaft). Such a relationship is presumed when two unmarried adults share a main residence; it can only be rebutted with a statement that they keep their finances permanently separate. For each of these people, the average taxable income (zu versteuerndes Einkommen) from the ${F.bescheide_je_person} most recent income tax assessments (Einkommensteuerbescheid) is taken, and the averages are added. An example: Lena has ${EN.eur(41000)} and ${EN.eur(47000)}, Tom ${EN.eur(9000)} and ${EN.eur(21000)}. Their household income is ${EN.eur(paar)}, and the grant for a battery electric car without children is ${EN.eur(b(paar))}. Income of adult children does not count, and in a flatshare each person is their own household. A household can make at most ${F.antraege_je_haushalt} applications.`,
    faqs: [
      { q: 'Does my partner’s income count if we are not married?', a: 'Yes, if you live together. When two adults share a main residence and are neither married nor in a registered partnership, BAFA presumes a marriage-like relationship, and both incomes belong to the household. You can rebut that with a personal statement if you keep your finances permanently separate, as in a flatshare with separate budgets.' },
      { q: 'How do I work out household income with a joint tax assessment?', a: 'Couples assessed jointly receive one assessment with a combined taxable income. That assessment is enough for both partners. Take the combined figure for both years and average it; the result is the same as averaging each person separately and adding. In the small calculator, enter the combined figure for one person.' },
      { q: 'Is my adult child’s income part of household income?', a: 'No. Working children who still live at home are not counted, even if they are adults and earn well. The same goes for the income of children under 18. Only you and your partner count. An adult child can, however, apply in their own right if the car is registered to them.' },
      { q: 'We married last year: which assessments count?', a: `The two most recent assessments per person, of whatever kind. For the year before the wedding that is usually two individual assessments, for the year of marriage often a joint one. Added and halved, you get the same household income. With ${EN.eur(36000)} and ${EN.eur(30000)} separately and ${EN.eur(70000)} jointly, it is ${EN.eur(heirat)}.` },
      { q: 'Can two people in one household each get a grant?', a: `Yes. A household can make ${F.antraege_je_haushalt} applications, and each person can receive the grant once. Both are assessed on the same household income. Each car must be registered to the person applying, and each person must keep to their own holding period.` },
      { q: 'How does household income work in a flatshare?', a: 'When several adults share a flat but are financially independent, each counts as a separate household for the grant. Each can apply for themselves if the car is registered in their name and their own income is under the limit. With only two people sharing, however, the presumption of a marriage-like relationship applies first and must be rebutted with a statement.' },
    ],
    body: (h) => `
<h2>Who belongs to the household</h2>
<p>${h.src('bafaFaq', 'BAFA')} describes a household as one person or several people who permanently live and manage money together. For the grant, though, only certain adults are counted. ${h.src('bafaHaushalt', 'BAFA’s household diagram')} sums it up:</p>
<ul>
<li><strong>The applicant</strong>, to whom the car is registered.</li>
<li><strong>A spouse or registered partner</strong> living in the same household.</li>
<li><strong>A partner in a marriage-like relationship</strong>: presumed for two unmarried adults with the same main residence.</li>
</ul>
<p>Not counted: children, including adults with their own income, parents or grandparents living in the house, and flatmates who keep separate finances. Children under 18 only matter through the number of children, not their income; how that works is under ${h.a('kinder', 'children bonus')}.</p>
<h2>The sum in three steps</h2>
<ol>
<li>For each person in the household, find the ${h.P.foerderung.bescheide_je_person} most recent income tax assessments and read the line “zu versteuerndes Einkommen” on each.</li>
<li>Average per person: add both figures and halve them.</li>
<li>Add the averages of everyone. That is the household income BAFA uses to set the band.</li>
</ol>
${h.table(['Person', 'Older assessment', 'Newer assessment', 'Average'], [
  ['Lena', h.eur(41000), h.eur(47000), h.eur(lena)],
  ['Tom', h.eur(9000), h.eur(21000), h.eur(tom)],
  ['Household', '', '', h.eur(paar)],
], 'Example: unmarried couple sharing a flat', ['l', 'r', 'r', 'r'])}
<p>At ${h.eur(paar)} Lena and Tom are in the third band and get ${h.eur(b(paar))} for a battery electric car. Had Lena lived alone, her ${h.eur(lena)} would have meant ${h.eur(b(lena))}. Had Tom lived alone and applied, it would have been ${h.eur(b(tom))}. Because they live together, only the joint figure counts, whichever of them applies.</p>
<h2>Why an average is fairer than one year</h2>
<p>A single year can mislead: starting work after university, a year of parental leave, a severance payment, a year of high profit. The average smooths that out. In the example, Tom would have ${h.eur(21000)} on the newer assessment alone and ${h.eur(9000)} on the older one; the mean is ${h.eur(tom)}. Compared with using only the last year, household income moves by several thousand euros, and that can change the band.</p>
<h2>Joint assessment and marriage</h2>
<p>Married couples assessed jointly receive one assessment with a combined figure, which serves as proof for both. For the sum it makes no difference, since everything is added anyway: whether two people have ${h.eur(35000)} each or a joint assessment shows ${h.eur(70000)}, the household income is the same.</p>
<p>A change between years needs a little more care. A couple has two individual assessments of ${h.eur(36000)} and ${h.eur(30000)} in the first year and a joint one of ${h.eur(70000)} in the year they married. Household income is then (${h.eur(36000)} + ${h.eur(30000)} + ${h.eur(70000)}) divided by two, or ${h.eur(heirat)}. For a battery electric car without children that gives ${h.eur(b(heirat))}.</p>
<h2>Flatshares: each person on their own</h2>
<p>When several adults share a flat and are financially independent, each is a separate household. In a three-person flatshare with ${wg.map((x) => h.eur(x)).join(', ')}, each person has their own entitlement:</p>
${h.table(['Flatmate', 'Own income', 'Grant, battery electric'], wg.map((x, i) => [`Person ${i + 1}`, h.eur(x), h.eur(b(x))]), 'Flatshare with separate finances', ['l', 'r', 'r'])}
<p>With two flatmates, the presumption of a marriage-like relationship applies first. It can be rebutted if both permanently keep separate finances, with no shared budget and no support for each other. You state this yourself in the application.</p>
<h2>Special cases</h2>
<ul>
<li><strong>Partner without an assessment:</strong> anyone not required to file a return can file one voluntarily. With no taxable income, the assessment shows ${h.eur(0)}, and that is enough as proof.</li>
<li><strong>Separation:</strong> people who live and manage money apart no longer form a household; what counts is the situation when you apply.</li>
<li><strong>Assessments for different years:</strong> each person uses their own two most recent assessments. They need not cover the same years but may not be more than ${h.P.foerderung.bescheid_max_alter_jahre} tax years old.</li>
<li><strong>One-off payments:</strong> severance and similar payments count where they are part of taxable income. The two-year average softens their effect.</li>
</ul>
<h2>Common mistakes in the sum</h2>
<ul>
<li><strong>Entering only your own income:</strong> if you live with a partner, their average always counts too, even if only one name is on the registration.</li>
<li><strong>Using gross pay instead of taxable income:</strong> the payroll tax certificate shows gross pay, not taxable income. Only the assessment counts.</li>
<li><strong>Counting a joint assessment twice:</strong> a joint figure covers both partners and is not added again for the second person.</li>
<li><strong>Missing the newest year:</strong> once a newer assessment arrives, it replaces the oldest. Which two are the latest is decided on the day you apply.</li>
</ul>
<h2>Two applications in one household</h2>
<p>Each person can receive the grant once, a household at most ${h.P.foerderung.antraege_je_haushalt} times. If a couple buys two electric cars, each can apply, both on the same household income. Each car must be registered to the person applying and stay registered to them for ${h.P.foerderung.haltedauer_monate} months. How the application works and what documents you need is under ${h.a('antrag', 'how to apply')}. If you moved to Germany recently and have few German assessments, see ${h.a('zuzug', 'new to Germany')}.</p>`,
  },
});
