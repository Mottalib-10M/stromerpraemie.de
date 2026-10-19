import { defineGuide } from '../../lib/guide-types';
import { foerderung, obergrenze } from '../../lib/engine/foerderung';
import { plusMonate } from '../../lib/engine/datum';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Kinder: doppelte Wirkung (Betrag + Obergrenze), förderrelevant = im Haushalt, Kindergeld, unter 18 am Tag der
 * Erstzulassung; höchstens zwei. Wechselmodell nach § 64 EStG. Beispiel 18. Geburtstag um die Zulassung herum.
 */
const F = P.foerderung;
const z = '2026-11-01';
const b = (zve: number, kinder: number, antrieb: 'bev' | 'phev' = 'bev') => foerderung({ zve, kinder, antrieb, zulassung: z }).betrag;
const plus = F.bev[0][1] - F.bev[0][0];
const zv = [40000, 55000, 75000, 83000, 88000];
// 18. Geburtstag: Kind geboren am 10.12.2008; Zulassung am 1.12.2026 oder am 15.12.2026.
const geb = '2008-12-10', achtzehn = plusMonate(geb, F.kind_alter_unter * 12);
const vorher = '2026-12-01', nachher = '2026-12-15';

export default defineGuide({
  id: 'kinder',
  group: 'foerderung',
  order: 30,
  mini: 'fKind',
  related: ['einkommensgrenze', 'haushaltseinkommen', 'antrag', 'home'],
  sources: ['bafaFaq', 'estg64', 'richtlinie', 'bafaMerkblatt'],
  de: {
    slug: 'kinderbonus',
    nav: 'Kinderbonus',
    card: 'Was jedes Kind an Förderung und an Einkommensgrenze bringt, wer zählt und was im Wechselmodell gilt.',
    title: 'Kinderbonus E-Auto-Förderung 2026: was jedes Kind bringt',
    description: `Kinderbonus der E-Auto-Förderung 2026: je Kind ${DE.eur(plus)} mehr und ${DE.eur(F.obergrenze_je_kind)} höhere Einkommensgrenze, höchstens ${F.max_kinder === 2 ? 'zwei' : F.max_kinder} Kinder unter ${F.kind_alter_unter}, Wechselmodell nach Kindergeld.`,
    h1: 'Kinderbonus der E-Auto-Förderung 2026',
    intro: 'Kinder wirken bei der Förderung zweimal: Sie erhöhen den Betrag und heben die Einkommensgrenze an. Wer zählt, entscheidet das Kindergeld und der Tag der Zulassung.',
    resume: `Kinder verändern die E-Auto-Förderung 2026 auf zwei Wegen. Erstens steigt der Betrag in jeder Einkommensstufe um ${DE.eur(plus)} je Kind, für ein Elektroauto in der ersten Stufe also von ${DE.eur(F.bev[0][0])} auf ${DE.eur(F.bev[0][1])} und ${DE.eur(F.bev[0][2])}. Zweitens hebt jedes Kind die Obergrenze des Haushaltseinkommens um ${DE.eur(F.obergrenze_je_kind)} an, von ${DE.eur(F.obergrenze_basis)} auf ${DE.eur(obergrenze(1))} und ${DE.eur(obergrenze(2))}. Gezählt werden höchstens ${F.max_kinder} Kinder. Förderrelevant ist ein Kind, das im Haushalt lebt, für das Kindergeld bezogen wird und das am Tag der Erstzulassung des Autos jünger als ${F.kind_alter_unter} Jahre ist. Das Datum des Antrags spielt für das Alter keine Rolle. Im Wechselmodell zählt das Kind in dem Haushalt, dem die Eltern das Kindergeld zugeordnet haben. Nachweisen lässt sich die Kinderzahl mit dem Kindergeldbescheid, einer Bescheinigung der Familienkasse oder einer erweiterten Meldebescheinigung. Ein Haushalt mit zwei Kindern und ${DE.eur(88000)} Einkommen bekommt so noch ${DE.eur(b(88000, 2))}, ohne Kinder wären es ${DE.eur(0)}.`,
    faqs: [
      { q: 'Wie viel mehr Förderung bringt ein Kind beim Elektroauto?', a: `In jeder Stufe ${DE.eur(plus)} mehr, beim Plug-in-Hybrid ebenso. Wichtiger ist oft die zweite Wirkung: Die Einkommensgrenze steigt um ${DE.eur(F.obergrenze_je_kind)}. Ein Haushalt mit ${DE.eur(83000)} bekommt ohne Kind nichts, mit einem Kind ${DE.eur(b(83000, 1))}. Der Unterschied liegt dann nicht bei ${DE.eur(plus)}, sondern beim ganzen Betrag.` },
      { q: 'Zählt mein Kind, wenn es kurz nach der Zulassung 18 wird?', a: `Ja. Maßgeblich ist das Alter am Tag der Erstzulassung des Autos. Ist das Kind an diesem Tag noch ${F.kind_alter_unter - 1}, zählt es, auch wenn es eine Woche später volljährig wird und der Antrag erst Monate danach gestellt wird. Wird das Auto dagegen einen Tag nach dem ${F.kind_alter_unter}. Geburtstag zugelassen, zählt das Kind nicht mehr.` },
      { q: 'Welcher Elternteil bekommt den Kinderbonus im Wechselmodell?', a: 'Der Elternteil, dem das Kindergeld zugeordnet ist. Nach § 64 EStG wird Kindergeld an den Berechtigten gezahlt, der das Kind in seinen Haushalt aufgenommen hat; im Wechselmodell bestimmen die Eltern gemeinsam, wem. Die Förderung folgt strikt dieser Zuordnung. Der andere Elternteil kann das Kind nicht zusätzlich angeben, auch wenn es die Hälfte der Zeit bei ihm lebt.' },
      { q: 'Gibt es für das dritte Kind noch einmal mehr Förderung?', a: `Nein. Die Richtlinie zählt höchstens ${F.max_kinder} Kinder. Ab dem dritten Kind ändern sich weder der Betrag noch die Einkommensgrenze. Eine Familie mit vier Kindern wird genauso behandelt wie eine mit zwei, die Obergrenze bleibt bei ${DE.eur(F.obergrenze_max)}. Wer drei Kinder hat, gibt im Antrag trotzdem alle an; gezählt werden zwei.` },
      { q: 'Wie weise ich die Kinder im Antrag nach?', a: 'Mit einer Kindergeldbescheinigung der Familienkasse, einer erweiterten Meldebescheinigung oder dem Kindergeldbescheid. Beim Bescheid bestätigen Sie im Antragsformular zusätzlich, dass er noch aktuell ist und die Kinder weiter im Haushalt leben. Lesbar sein müssen Empfänger, Name und Geburtsdatum des Kindes, Kindergeldnummer, Datum und Anschrift; alles andere dürfen Sie schwärzen.' },
    ],
    body: (h) => `
<h2>Zwei Wirkungen eines Kindes</h2>
<p>Die Förderrichtlinie behandelt Kinder in der Tabelle als eigene Spalten. Für reine Elektroautos und Plug-in-Hybride steigt der Betrag je Kind um ${h.eur(plus)}. Zusätzlich verschiebt jedes Kind die Grenze, bis zu der überhaupt gefördert wird. Die zweite Wirkung ist für Haushalte mit mittlerem bis höherem Einkommen meist entscheidend.</p>
${h.table(['Haushaltseinkommen', 'Ohne Kind', '1 Kind', '2 Kinder'], zv.map((x) => [h.eur(x), h.eur(b(x, 0)), h.eur(b(x, 1)), h.eur(b(x, 2))]), 'Elektroauto: Förderung nach Kinderzahl bei gleichem Einkommen', ['r', 'r', 'r', 'r'])}
${h.table(['Haushaltseinkommen', 'Ohne Kind', '1 Kind', '2 Kinder'], zv.map((x) => [h.eur(x), h.eur(b(x, 0, 'phev')), h.eur(b(x, 1, 'phev')), h.eur(b(x, 2, 'phev'))]), 'Plug-in-Hybrid: Förderung nach Kinderzahl bei gleichem Einkommen', ['r', 'r', 'r', 'r'])}
<p>Bei ${h.eur(40000)} macht jedes Kind ${h.eur(plus)} aus. Bei ${h.eur(83000)} entscheidet das erste Kind darüber, ob es überhaupt etwas gibt. Bei ${h.eur(88000)} braucht es zwei Kinder. Der Mini-Rechner oben zeigt die vier Fälle für Ihr eigenes Einkommen nebeneinander.</p>
<h2>Wann ein Kind förderrelevant ist</h2>
<p>Das ${h.src('bafaFaq', 'BAFA')} nennt drei Bedingungen, die zusammen erfüllt sein müssen:</p>
<ol>
<li>Das Kind lebt im Haushalt der antragstellenden Person.</li>
<li>Für das Kind besteht eine Kindergeldberechtigung in diesem Haushalt.</li>
<li>Das Kind ist am Tag der Erstzulassung des geförderten Autos jünger als ${h.P.foerderung.kind_alter_unter} Jahre.</li>
</ol>
<p>Leibliche Kinder, Adoptivkinder und Pflegekinder kommen gleichermaßen in Frage, solange für sie in Ihrem Haushalt Kindergeld gezahlt wird. Das Einkommen der Kinder zählt nie zum Haushaltseinkommen, auch nicht das eines Auszubildenden unter ${h.P.foerderung.kind_alter_unter}.</p>
<h2>Der ${h.P.foerderung.kind_alter_unter}. Geburtstag und der Tag der Zulassung</h2>
<p>Weil das Alter am Tag der Erstzulassung zählt, kann der Termin bei der Zulassungsstelle über mehrere hundert Euro entscheiden. Ein Beispiel: Ein Kind ist am ${h.date(geb)} geboren und wird am ${h.date(achtzehn)} volljährig.</p>
${h.table(['Zulassung', 'Alter des Kindes', 'Gezählte Kinder', 'Förderung bei ' + h.eur(50000)], [
  [h.date(vorher), `${h.P.foerderung.kind_alter_unter - 1} Jahre`, '1', h.eur(b(50000, 1))],
  [h.date(nachher), `${h.P.foerderung.kind_alter_unter} Jahre`, '0', h.eur(b(50000, 0))],
], `Zulassung vor und nach dem ${h.P.foerderung.kind_alter_unter}. Geburtstag, Elektroauto`, ['l', 'r', 'r', 'r'])}
<p>Liegt das Haushaltseinkommen über ${h.eur(h.P.foerderung.obergrenze_basis)}, geht es nicht um ${h.eur(plus)}, sondern um den ganzen Betrag. Das Datum des Kaufvertrags und das Datum des Antrags spielen für das Alter keine Rolle. Den Antrag können Sie bis zu ${h.P.foerderung.antragsfrist_monate} Monate nach der Zulassung stellen; das Kind bleibt gezählt.</p>
<h2>Wechselmodell und getrennte Eltern</h2>
<p>Leben Eltern getrennt und betreuen ein Kind abwechselnd, kann es nur in einem Haushalt zählen. Entscheidend ist der Kindergeldbescheid: Nach ${h.src('estg64', '§ 64 EStG')} wird das Kindergeld an den Berechtigten gezahlt, der das Kind in seinen Haushalt aufgenommen hat, und bei mehreren Haushalten bestimmen die Eltern gemeinsam, wem. Die Förderung folgt dieser Zuordnung ohne Ausnahme. Für den anderen Elternteil zählt das Kind nicht, auch wenn er Unterhalt zahlt oder das Kind die Hälfte der Woche bei ihm wohnt.</p>
<p>Planen beide Eltern ein Elektroauto, kann es sich lohnen, die Lage vorher nüchtern zu betrachten: Das Kind wirkt nur bei einem von beiden. Eine Umstellung des Kindergeldes allein wegen der Förderung ist eine Entscheidung mit Folgen weit über das Auto hinaus und gehört deshalb nicht in eine Rechnung über ${h.eur(plus)}.</p>
<h2>Nachweise für den Antrag</h2>
<p>Für die Kinderzahl akzeptiert das BAFA nach dem ${h.src('bafaMerkblatt', 'Merkblatt zu den Nachweisunterlagen')} drei Dokumente:</p>
<ul>
<li>eine Kindergeldbescheinigung der Familienkasse,</li>
<li>eine erweiterte Meldebescheinigung, die zeigt, wer unter Ihrer Adresse gemeldet ist,</li>
<li>den Kindergeldbescheid; dann bestätigen Sie im Formular, dass er noch aktuell ist.</li>
</ul>
<p>Lesbar sein müssen der Empfänger des Kindergeldes, Name und Geburtsdatum des Kindes, die Kindergeldnummer, das Datum des Bescheids und die vollständige Anschrift. Alle übrigen Angaben dürfen und sollten Sie auf der Kopie schwärzen. Hochgeladen wird als PDF mit höchstens ${h.P.foerderung.pdf_max_mb} MB je Datei.</p>
<h2>Sonderfälle</h2>
<ul>
<li><strong>Kind lebt nicht im Haushalt:</strong> Ein Kind, das zum Beispiel im Internat oder bei Großeltern lebt, zählt nur, wenn für Sie Kindergeld bezogen wird und es als im Haushalt aufgenommen gilt. Im Zweifel klärt das BAFA den Einzelfall.</li>
<li><strong>Kind im Ausland:</strong> Ohne deutsches Kindergeld für Ihren Haushalt kein förderrelevantes Kind.</li>
<li><strong>Zwei Anträge im Haushalt:</strong> Beide Partner können je einen Antrag stellen; das Kind wirkt bei beiden, weil es zum selben Haushalt gehört.</li>
<li><strong>Kind nach der Zulassung geboren:</strong> Für die Kinderzahl kommt es auf die Lage am Tag der Erstzulassung an; ein später geborenes Kind lässt sich nach dem Wortlaut nicht nachmelden.</li>
</ul>
<h2>Rechenbeispiel: eine Familie, zwei Autos</h2>
<p>Ein Ehepaar mit zwei Kindern von 9 und 13 Jahren hat ein Haushaltseinkommen von ${h.eur(87000)}. Ohne Kinder läge es über jeder Grenze. Mit zwei förderrelevanten Kindern liegt die Obergrenze bei ${h.eur(obergrenze(2))}, und für ein Elektroauto gibt es ${h.eur(b(87000, 2))}. Kauft der Haushalt ein zweites Elektroauto, das auf den anderen Partner zugelassen wird, kann auch dieser einen Antrag stellen: Es gelten dasselbe Einkommen und dieselben Kinder, zusammen also ${h.eur(2 * b(87000, 2))}. Für einen Plug-in-Hybrid wären es je ${h.eur(b(87000, 2, 'phev'))}. Ändert sich das Einkommen später, bleibt es bei den bewilligten Beträgen. Wichtig ist nur, dass beide Autos jeweils vor dem ${h.P.foerderung.kind_alter_unter}. Geburtstag des älteren Kindes zugelassen werden, wenn es auf beide Kinder ankommt; hier ist das ältere Kind erst 13, die Frage stellt sich also noch lange nicht. Bei Teenagern kurz vor der Volljährigkeit lohnt dagegen ein Blick in den Kalender.</p>
<h2>Kinder und die übrigen Regeln</h2>
<p>Am übrigen Verfahren ändern Kinder nichts. Die Haltedauer bleibt bei ${h.P.foerderung.haltedauer_monate} Monaten, die Fristen bleiben gleich, und ein Kind, das während der Haltedauer volljährig wird oder auszieht, ändert an der bewilligten Förderung nichts. Wie das Haushaltseinkommen zustande kommt, steht unter ${h.a('haushaltseinkommen', 'Haushaltseinkommen berechnen')}; die vollständige Tabelle mit allen Stufen unter ${h.a('einkommensgrenze', 'Einkommensgrenze')}. Für eine Rechnung mit Ihrem Wunschauto und dessen Nettopreis nutzen Sie den ${h.a('home', 'Prämienrechner')}.</p>`,
  },
  en: {
    slug: 'children-bonus',
    nav: 'Children bonus',
    card: 'What each child adds to the grant and to the income limit, who counts and what applies with shared care.',
    title: 'EV grant children bonus 2026: what each child adds',
    description: `EV grant children bonus in Germany 2026: ${EN.eur(plus)} more and a ${EN.eur(F.obergrenze_je_kind)} higher income limit per child, at most ${F.max_kinder === 2 ? 'two' : F.max_kinder} children under ${F.kind_alter_unter}, shared care follows Kindergeld.`,
    h1: 'The children bonus in the 2026 EV grant',
    intro: 'Children affect the grant twice: they raise the amount and lift the income limit. Who counts is decided by Kindergeld and by the day the car is registered.',
    resume: `Children change Germany’s 2026 EV grant in two ways. First, the amount rises by ${EN.eur(plus)} per child in every income band, so a battery electric car in the first band goes from ${EN.eur(F.bev[0][0])} to ${EN.eur(F.bev[0][1])} and ${EN.eur(F.bev[0][2])}. Second, each child lifts the household income ceiling by ${EN.eur(F.obergrenze_je_kind)}, from ${EN.eur(F.obergrenze_basis)} to ${EN.eur(obergrenze(1))} and ${EN.eur(obergrenze(2))}. At most ${F.max_kinder} children are counted. A child qualifies if they live in the household, Kindergeld (child benefit) is received for them, and they are under ${F.kind_alter_unter} on the day the car is first registered. The application date plays no part for age. With shared care (Wechselmodell), the child counts in the household to which the parents have assigned Kindergeld. You prove the number with the Kindergeld notice, a certificate from the family benefits office (Familienkasse) or an extended registration certificate (erweiterte Meldebescheinigung). A household with two children and ${EN.eur(88000)} income still receives ${EN.eur(b(88000, 2))}; without children it would be ${EN.eur(0)}.`,
    faqs: [
      { q: 'How much more grant does a child add for an electric car?', a: `${EN.eur(plus)} more in every band, and the same for a plug-in hybrid. The second effect often matters more: the income limit rises by ${EN.eur(F.obergrenze_je_kind)}. A household on ${EN.eur(83000)} gets nothing without children and ${EN.eur(b(83000, 1))} with one. The difference is then not ${EN.eur(plus)} but the whole amount.` },
      { q: 'Does my child count if they turn 18 just after registration?', a: `Yes. What counts is the child’s age on the day the car is first registered. If they are still ${F.kind_alter_unter - 1} that day, they count, even if they come of age a week later and you apply months afterwards. If the car is registered a day after their ${F.kind_alter_unter}th birthday, they no longer count.` },
      { q: 'Which parent gets the children bonus with shared care?', a: 'The parent to whom Kindergeld is assigned. Under section 64 of the Income Tax Act, Kindergeld goes to the person who has taken the child into their household; with several households the parents decide together. The grant follows that assignment strictly. The other parent cannot add the child as well, even if the child lives with them half the time.' },
      { q: 'Is there extra grant for a third child?', a: `No. The guideline counts at most ${F.max_kinder} children. From the third child neither the amount nor the income limit changes. A family with four children is treated the same as one with two, and the ceiling stays at ${EN.eur(F.obergrenze_max)}. With three children you still list them all; two are counted.` },
      { q: 'How do I prove my children in the application?', a: 'With a Kindergeld certificate from the Familienkasse, an extended registration certificate or the Kindergeld notice. With the notice, you also confirm in the form that it is still current and the children still live with you. Recipient, child’s name and date of birth, Kindergeld number, date and address must be legible; anything else may be blacked out.' },
    ],
    body: (h) => `
<h2>Two effects of one child</h2>
<p>The funding guideline gives children their own columns in the table. For battery electric cars and plug-in hybrids, the amount rises by ${h.eur(plus)} per child. On top of that, each child moves the limit up to which any grant is paid at all. For households on middle to higher incomes, that second effect is usually what decides.</p>
${h.table(['Household income', 'No children', '1 child', '2 children'], zv.map((x) => [h.eur(x), h.eur(b(x, 0)), h.eur(b(x, 1)), h.eur(b(x, 2))]), 'Battery electric: grant by number of children at the same income', ['r', 'r', 'r', 'r'])}
${h.table(['Household income', 'No children', '1 child', '2 children'], zv.map((x) => [h.eur(x), h.eur(b(x, 0, 'phev')), h.eur(b(x, 1, 'phev')), h.eur(b(x, 2, 'phev'))]), 'Plug-in hybrid: grant by number of children at the same income', ['r', 'r', 'r', 'r'])}
<p>At ${h.eur(40000)} each child is worth ${h.eur(plus)}. At ${h.eur(83000)} the first child decides whether there is any grant at all. At ${h.eur(88000)} it takes two. The small calculator above shows the four cases side by side for your own income.</p>
<h2>When a child qualifies</h2>
<p>${h.src('bafaFaq', 'BAFA')} names three conditions that must all be met:</p>
<ol>
<li>The child lives in the applicant’s household.</li>
<li>There is an entitlement to Kindergeld for the child in that household.</li>
<li>The child is under ${h.P.foerderung.kind_alter_unter} on the day the funded car is first registered.</li>
</ol>
<p>Birth children, adopted children and foster children all qualify as long as Kindergeld is paid for them in your household. Children’s income never counts towards household income, not even an apprentice under ${h.P.foerderung.kind_alter_unter}.</p>
<h2>The ${h.P.foerderung.kind_alter_unter}th birthday and the registration date</h2>
<p>Because age on the day of first registration counts, the appointment at the registration office can be worth hundreds of euros. An example: a child born on ${h.date(geb)} comes of age on ${h.date(achtzehn)}.</p>
${h.table(['Registration', 'Child’s age', 'Children counted', 'Grant at ' + h.eur(50000)], [
  [h.date(vorher), `${h.P.foerderung.kind_alter_unter - 1} years`, '1', h.eur(b(50000, 1))],
  [h.date(nachher), `${h.P.foerderung.kind_alter_unter} years`, '0', h.eur(b(50000, 0))],
], `Registration before and after the ${h.P.foerderung.kind_alter_unter}th birthday, battery electric`, ['l', 'r', 'r', 'r'])}
<p>If household income is above ${h.eur(h.P.foerderung.obergrenze_basis)}, the stake is not ${h.eur(plus)} but the whole amount. The date of the purchase contract and of the application make no difference to age. You can apply up to ${h.P.foerderung.antragsfrist_monate} months after registration, and the child still counts.</p>
<h2>Shared care and separated parents</h2>
<p>If parents live apart and share care of a child, the child can only count in one household. The Kindergeld notice decides: under ${h.src('estg64', 'section 64 EStG')}, Kindergeld is paid to the person who has taken the child into their household, and with several households the parents choose together. The grant follows that assignment without exception. For the other parent the child does not count, even if they pay maintenance or the child lives with them half the week.</p>
<p>If both parents are planning an electric car, it helps to look at this calmly beforehand: the child only works for one of them. Switching Kindergeld just for the grant has consequences far beyond the car and does not belong in a calculation about ${h.eur(plus)}.</p>
<h2>Proof for the application</h2>
<p>According to BAFA’s ${h.src('bafaMerkblatt', 'leaflet on supporting documents')}, three documents are accepted for the number of children:</p>
<ul>
<li>a Kindergeld certificate from the Familienkasse,</li>
<li>an extended registration certificate showing who is registered at your address,</li>
<li>the Kindergeld notice, in which case you confirm in the form that it is still current.</li>
</ul>
<p>The Kindergeld recipient, the child’s name and date of birth, the Kindergeld number, the date of the notice and the full address must be legible. You may and should black out everything else on the copy. Uploads are PDF only, at most ${h.P.foerderung.pdf_max_mb} MB per file.</p>
<h2>Special cases</h2>
<ul>
<li><strong>Child not living at home:</strong> a child at boarding school or with grandparents only counts if Kindergeld is paid to you and the child is treated as part of your household. BAFA decides individual cases.</li>
<li><strong>Child abroad:</strong> without German Kindergeld for your household, the child does not qualify.</li>
<li><strong>Two applications in the household:</strong> both partners can each apply, and the child counts for both because they belong to the same household.</li>
<li><strong>Child born after registration:</strong> the number of children is set on the day of first registration; on the wording, a child born later cannot be added.</li>
</ul>
<h2>Worked example: one family, two cars</h2>
<p>A married couple with two children aged 9 and 13 has household income of ${h.eur(87000)}. Without children they would be over every limit. With two qualifying children the ceiling is ${h.eur(obergrenze(2))}, and a battery electric car brings ${h.eur(b(87000, 2))}. If they buy a second electric car registered to the other partner, that partner can also apply: same income, same children, so ${h.eur(2 * b(87000, 2))} together. For a plug-in hybrid it would be ${h.eur(b(87000, 2, 'phev'))} each. If income changes later, the approved amounts stand. Where both children matter, each car simply has to be registered before the older child turns ${h.P.foerderung.kind_alter_unter}.</p>
<h2>Children and the other rules</h2>
<p>Children change nothing else in the procedure. The holding period stays at ${h.P.foerderung.haltedauer_monate} months, deadlines stay the same, and a child who comes of age or moves out during the holding period does not affect the approved grant. How household income is built is under ${h.a('haushaltseinkommen', 'household income')}; the full table with every band under ${h.a('einkommensgrenze', 'income limit')}. For a calculation with the car you want and its net price, use the ${h.a('home', 'grant calculator')}.</p>`,
  },
});
