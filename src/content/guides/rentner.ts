import { defineGuide } from '../../lib/guide-types';
import { foerderung, haushaltsZvE } from '../../lib/engine/foerderung';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Rentner: antragsberechtigt; ohne Erklärungspflicht freiwillige Steuererklärung nachreichen, Bescheid über 0 €
 * zählt; Übergang Arbeit → Rente über den Durchschnitt; spätere Änderungen ohne Wirkung; Vollmacht, Erbfall.
 */
const F = P.foerderung;
const z = '2026-11-01';
const b = (zve: number, kinder = 0, antrieb: 'bev' | 'phev' = 'bev') => foerderung({ zve, kinder, antrieb, zulassung: z }).betrag;
// Übergang: letztes Arbeitsjahr 52 000, erstes Rentenjahr 14 000, Partnerin 6 000 in beiden Jahren.
const ueber = haushaltsZvE([[52000, 14000], [6000, 6000]]);
const spaeter = haushaltsZvE([[14000, 15000], [6000, 6000]]);
// Rentnerpaar ohne Erklärungspflicht: zwei freiwillige Bescheide je 0 €.
const null0 = haushaltsZvE([[0, 0], [0, 0]]);
// Rentner mit Nebenverdienst: 23 000 und 27 000.
const neben = haushaltsZvE([[23000, 27000]]);

export default defineGuide({
  id: 'rentner',
  group: 'foerderung',
  order: 50,
  mini: 'fRente',
  related: ['haushaltseinkommen', 'antrag', 'einkommensgrenze', 'haltedauer'],
  sources: ['bafaFaq', 'richtlinie', 'bundid', 'estg2'],
  de: {
    slug: 'rentner',
    nav: 'Rentner',
    card: 'Förderung im Ruhestand: freiwillige Steuererklärung, Bescheid über 0 €, Übergang von Arbeit in Rente.',
    title: 'E-Auto-Förderung für Rentner 2026: Bescheid und Einkommen',
    description: 'E-Auto-Förderung für Rentner 2026: ohne Bescheid eine Steuererklärung freiwillig nachreichen, auch 0 € zvE zählen, und der Wechsel in die Rente wird gemittelt.',
    h1: 'E-Auto-Förderung für Rentnerinnen und Rentner 2026',
    intro: 'Viele Rentner zahlen keine Einkommensteuer und haben deshalb keinen aktuellen Bescheid. Für die Förderung ist das lösbar. Was Sie brauchen und wie der Übergang in die Rente gerechnet wird.',
    resume: `Rentnerinnen und Rentner können die E-Auto-Förderung 2026 genauso beantragen wie alle anderen Privatpersonen mit Hauptwohnsitz in Deutschland. Die Hürde liegt beim Nachweis: Das BAFA verlangt für jede erwachsene Person im Haushalt die ${F.bescheide_je_person} aktuellsten Einkommensteuerbescheide. Wer nicht zur Abgabe einer Steuererklärung verpflichtet ist und deshalb keine Bescheide hat, kann die Erklärungen nachträglich abgeben. Das Finanzamt erlässt dann einen förmlichen Bescheid, und wenn kein steuerpflichtiges Einkommen da ist, weist er ein zu versteuerndes Einkommen von ${DE.eur(0)} aus. Auch ein solcher Bescheid gilt als Nachweis. Ein Rentnerpaar mit zwei Bescheiden über ${DE.eur(0)} je Person liegt in der ersten Stufe und bekommt für ein Elektroauto ${DE.eur(b(null0))}. Wer erst vor kurzem in Rente gegangen ist, hat oft einen Bescheid aus dem letzten Arbeitsjahr und einen aus dem ersten Rentenjahr; gezählt wird der Durchschnitt. Bei ${DE.eur(52000)} und ${DE.eur(14000)} sowie einer Partnerin mit ${DE.eur(6000)} sind das ${DE.eur(ueber)} und ${DE.eur(b(ueber))} Förderung. Was sich nach dem Antrag ändert, spielt keine Rolle. Die Bescheide dürfen höchstens ${F.bescheid_max_alter_jahre} Steuerjahre zurückliegen.`,
    faqs: [
      { q: 'Ich bin Rentner und habe keinen Steuerbescheid: wie beantrage ich die Förderung?', a: 'Geben Sie für die letzten zwei Jahre freiwillig eine Einkommensteuererklärung beim Finanzamt ab. Das Finanzamt veranlagt Sie und schickt einen förmlichen Bescheid. Liegt kein steuerpflichtiges Einkommen vor, steht dort ein zu versteuerndes Einkommen von 0 €. Das BAFA nennt genau diesen Weg und erkennt einen solchen Bescheid als Nachweis an.' },
      { q: 'Wie wird die Förderung im ersten Jahr nach dem Renteneintritt gerechnet?', a: `Mit dem Durchschnitt aus den zwei aktuellsten Bescheiden, auch wenn einer noch aus dem Berufsleben stammt. Mit ${DE.eur(52000)} im letzten Arbeitsjahr und ${DE.eur(14000)} im ersten Rentenjahr ergibt sich für diese Person ${DE.eur(haushaltsZvE([[52000, 14000]]))}. Wer ein Jahr später beantragt, hat zwei Rentenbescheide und liegt oft eine Stufe günstiger.` },
      { q: 'Zählt die ganze Rente zum zu versteuernden Einkommen?', a: 'Nein. Nur der steuerpflichtige Teil der Rente geht in die Einkommensteuer ein; wie hoch er ist, hängt vom Jahr des Rentenbeginns ab. Davon gehen noch Pauschalen, Kranken- und Pflegeversicherungsbeiträge und weitere Abzüge ab. Das zu versteuernde Einkommen liegt deshalb meist weit unter der Bruttorente. Maßgeblich ist allein die Zahl im Bescheid.' },
      { q: 'Kann ein Angehöriger den Förderantrag für mich als Rentner stellen?', a: 'Ja. Sie können eine andere Person oder ein Autohaus bevollmächtigen. Die bevollmächtigte Person braucht selbst ein BundID-Konto mit Online-Ausweis oder ELSTER-Zertifikat und lädt Ihre Vollmacht im Antrag hoch. Das Geld geht aber immer auf das Konto des Halters, also auf Ihres, nicht auf das der bevollmächtigten Person.' },
      { q: 'Was passiert mit der Förderung, wenn der Halter während der Haltedauer stirbt?', a: `Die Ummeldung auf die Erbin oder den Erben ist nicht förderschädlich. Die restliche Haltedauer von insgesamt ${F.haltedauer_monate} Monaten muss dann die erbende Person einhalten. Gegenüber dem BAFA wird die Erbschaft mit einem Erbschein belegt. Eine Rückforderung droht in diesem Fall nicht, solange das Auto weiter in Deutschland zugelassen bleibt.` },
    ],
    body: (h) => `
<h2>Rentner sind ausdrücklich antragsberechtigt</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} schließt niemanden wegen des Alters aus. Es gelten dieselben Bedingungen wie für Berufstätige: Hauptwohnsitz in Deutschland, ein neues Auto, das auf Sie erstmals zugelassen wird, ein Haushaltseinkommen unter der Grenze und eine Haltedauer von ${h.P.foerderung.haltedauer_monate} Monaten. Das ${h.src('bafaFaq', 'BAFA')} hat dazu eine eigene Frage in seinen FAQ und nennt dort den Punkt, an dem es für viele Rentner hakt: den Steuerbescheid.</p>
<h2>Kein Bescheid? Eine Erklärung genügt</h2>
<p>Viele Rentnerinnen und Rentner sind nicht verpflichtet, eine Steuererklärung abzugeben, weil ihr steuerpflichtiger Rententeil unter dem Grundfreibetrag liegt. Sie haben deshalb oft seit Jahren keinen Bescheid. Für die Förderung braucht es aber für jede erwachsene Person des Haushalts zwei Bescheide. Der Weg ist einfach:</p>
<ol>
<li>Für die letzten zwei Jahre je eine Einkommensteuererklärung beim Finanzamt abgeben, auf Papier oder über ELSTER.</li>
<li>Das Finanzamt bearbeitet die Erklärungen und erlässt förmliche Bescheide, auch wenn keine Steuer anfällt.</li>
<li>Steht im Bescheid ein zu versteuerndes Einkommen von ${h.eur(0)}, ist das ein gültiger Nachweis.</li>
</ol>
<p>Rechnen Sie für die Bearbeitung beim Finanzamt einige Wochen ein. Da der Antrag ohnehin erst nach der Zulassung gestellt wird und dafür ${h.P.foerderung.antragsfrist_monate} Monate Zeit bleiben, reicht das meist aus, wenn Sie früh anfangen. Die Bescheide dürfen höchstens ${h.P.foerderung.bescheid_max_alter_jahre} Steuerjahre alt sein.</p>
<h2>Rechenbeispiele aus dem Ruhestand</h2>
${h.table(['Haushalt', 'Bescheide', 'Haushaltseinkommen', 'Elektroauto', 'Plug-in-Hybrid'], [
  ['Rentnerpaar ohne Erklärungspflicht', `je zweimal ${h.eur(0)}`, h.eur(null0), h.eur(b(null0)), h.eur(b(null0, 0, 'phev'))],
  ['Frisch im Ruhestand, mit Partnerin', `${h.eur(52000)} und ${h.eur(14000)}; Partnerin ${h.eur(6000)}`, h.eur(ueber), h.eur(b(ueber)), h.eur(b(ueber, 0, 'phev'))],
  ['Dasselbe Paar ein Jahr später', `${h.eur(14000)} und ${h.eur(15000)}; Partnerin ${h.eur(6000)}`, h.eur(spaeter), h.eur(b(spaeter)), h.eur(b(spaeter, 0, 'phev'))],
  ['Rentner mit Nebenverdienst, allein', `${h.eur(23000)} und ${h.eur(27000)}`, h.eur(neben), h.eur(b(neben)), h.eur(b(neben, 0, 'phev'))],
], 'Rentnerhaushalte, Zulassung im November 2026', ['l', 'l', 'r', 'r', 'r'])}
<p>Die Zeile „frisch im Ruhestand“ zeigt den häufigsten Fall: Ein gutes letztes Arbeitsjahr hebt den Durchschnitt, sodass der Haushalt in der zweiten Stufe landet. Ein Jahr später, mit zwei Rentenbescheiden, wären es ${h.eur(b(spaeter) - b(ueber))} mehr. Ob sich das Warten lohnt, hängt vor allem davon ab, wann Sie das Auto brauchen und ob die Förderung bis dahin weiterläuft; eine Garantie dafür gibt es nicht.</p>
<h2>Was im Ruhestand zum zvE zählt</h2>
<p>Das zu versteuernde Einkommen nach ${h.src('estg2', '§ 2 Abs. 5 EStG')} ist bei Rentnern meist deutlich kleiner als die Rente auf dem Kontoauszug. Steuerpflichtig ist nur ein Anteil der gesetzlichen Rente, der vom Jahr des Rentenbeginns abhängt. Davon gehen die Werbungskostenpauschale, die Beiträge zur Kranken- und Pflegeversicherung und weitere Sonderausgaben ab. Betriebsrenten, Riester-Renten, Mieteinnahmen oder eine selbstständige Tätigkeit kommen hinzu, soweit sie steuerpflichtig sind. Kapitalerträge, für die bereits Abgeltungsteuer gezahlt wurde, stehen meist nicht im zvE; was dazugehört, stellt der Bescheid fest.</p>
<p>Leistungen, die nicht im zvE stehen, zählen für die Förderung nicht mit, etwa die Grundsicherung im Alter oder Wohngeld. Wer freiberuflich weiterarbeitet, ist in aller Regel ohnehin zur Erklärung verpflichtet und hat deshalb aktuelle Bescheide.</p>
<h2>Den Antrag stellen</h2>
<p>Der Antrag läuft ausschließlich online über die Förderzentrale des Bundes. Für die Anmeldung braucht es ein ${h.src('bundid', 'BundID-Konto')} mit Online-Ausweis, also dem Personalausweis mit PIN und einem Smartphone oder Kartenleser, oder mit ELSTER-Zertifikat. Wer seine Steuererklärung ohnehin über ELSTER abgibt, hat das Zertifikat schon. Eine einfache Registrierung mit Benutzername und Passwort genügt nicht.</p>
<p>Wer sich das nicht zutraut, kann eine andere Person bevollmächtigen, zum Beispiel ein Kind, ein Enkelkind oder das Autohaus. Die bevollmächtigte Person meldet sich mit ihrem eigenen Konto an und lädt die Vollmacht hoch. Die Auszahlung geht in jedem Fall auf das Konto der Person, auf die das Auto zugelassen ist. Die Schritte im Einzelnen stehen unter ${h.a('antrag', 'Antrag stellen')}.</p>
<h2>Ein möglicher Zeitplan</h2>
<p>So kann es für ein Rentnerpaar ohne Erklärungspflicht laufen, das im Frühjahr ein Elektroauto bestellt:</p>
<ol>
<li>Im Januar geben beide Partner ihre Erklärungen für die zwei Vorjahre ab, am einfachsten über ELSTER, das danach auch für die BundID genutzt werden kann.</li>
<li>Im März oder April kommen die Bescheide. Steht dort jeweils ein zvE, prüfen Sie es gleich mit dem Mini-Rechner oben.</li>
<li>Das Auto wird bestellt und später zugelassen. Erst danach lässt sich der Antrag stellen.</li>
<li>Bescheide, Zulassungsbescheinigung und Kaufvertrag werden als PDF hochgeladen; das BAFA bearbeitet vollständige Anträge in der Reihenfolge des Eingangs. Fehlt eine Seite, verzögert sich alles, deshalb lohnt ein zweiter Blick vor dem Absenden.</li>
<li>Einige Wochen nach dem Zuwendungsbescheid kommt das Geld auf das Konto des Halters.</li>
</ol>
<h2>Haltedauer im Alter</h2>
<p>Das Auto muss ${h.P.foerderung.haltedauer_monate} Monate auf Sie zugelassen bleiben. Ein Umzug innerhalb Deutschlands ändert daran nichts. Müssen Sie das Auto früher abgeben, etwa aus gesundheitlichen Gründen, melden Sie das dem BAFA; es entscheidet im Einzelfall über eine anteilige oder vollständige Rückforderung. Stirbt der Halter, kann das Auto auf die Erben umgemeldet werden, ohne dass die Förderung zurückgefordert wird; die Erben übernehmen die restliche Haltedauer. Einzelheiten zu Verkauf und Rückforderung stehen unter ${h.a('haltedauer', 'Haltedauer und Verkauf')}.</p>
<h2>Kurz zusammengefasst</h2>
<ul>
<li>Rentner sind antragsberechtigt; das Alter spielt keine Rolle.</li>
<li>Ohne Bescheid: freiwillige Erklärung für zwei Jahre, auch ein Bescheid über ${h.eur(0)} zählt.</li>
<li>Beim Übergang in die Rente wird gemittelt, ein gutes letztes Arbeitsjahr zählt zur Hälfte.</li>
<li>Was sich nach dem Antrag ändert, hat keine Wirkung auf die Förderung.</li>
<li>Vollmacht ist möglich, ausgezahlt wird immer an den Halter.</li>
<li>Die Haltedauer gilt auch im Alter; im Erbfall übernehmen die Erben sie ohne Rückforderung.</li>
</ul>
<p>Die genaue Einordnung in die Stufen zeigt ${h.a('einkommensgrenze', 'Einkommensgrenze')}; wie Partner mitgerechnet werden, ${h.a('haushaltseinkommen', 'Haushaltseinkommen')}.</p>`,
  },
  en: {
    slug: 'pensioners',
    nav: 'Pensioners',
    card: 'The grant in retirement: a voluntary tax return, a €0 assessment, and moving from work to pension.',
    title: 'EV grant for pensioners 2026: tax assessment and income',
    description: 'EV grant for pensioners in Germany 2026: with no tax assessment, file a voluntary return, a €0 assessment counts, and the move into retirement is averaged out.',
    h1: 'The 2026 EV grant for pensioners',
    intro: 'Many pensioners pay no income tax and so have no recent tax assessment. For the grant that can be solved. What you need and how the move into retirement is counted.',
    resume: `Pensioners can apply for Germany’s 2026 EV grant just like any other private individual with a main residence in Germany. The hurdle is proof: BAFA asks for the ${F.bescheide_je_person} most recent income tax assessments (Einkommensteuerbescheid) for every adult in the household. If you are not required to file a tax return and therefore have no assessments, you can file returns retrospectively. The tax office then issues a formal assessment, and if there is no taxable income it shows taxable income (zu versteuerndes Einkommen) of ${EN.eur(0)}. Such an assessment counts as proof too. A retired couple with two assessments of ${EN.eur(0)} each is in the first band and receives ${EN.eur(b(null0))} for a battery electric car. Someone who has just retired often has one assessment from their last working year and one from their first year of retirement; the average counts. With ${EN.eur(52000)} and ${EN.eur(14000)} plus a partner on ${EN.eur(6000)}, that is ${EN.eur(ueber)} and a grant of ${EN.eur(b(ueber))}. Changes after you apply make no difference. Assessments may be at most ${F.bescheid_max_alter_jahre} tax years old.`,
    faqs: [
      { q: 'I am retired and have no tax assessment: how do I apply for the grant?', a: 'File a voluntary income tax return for the last two years with your tax office (Finanzamt). It will assess you and send a formal assessment. With no taxable income, it shows taxable income of €0. BAFA names exactly this route and accepts such an assessment as proof.' },
      { q: 'How is the grant worked out in the first year after retiring?', a: `With the average of the two most recent assessments, even if one is still from your working life. With ${EN.eur(52000)} in the last working year and ${EN.eur(14000)} in the first year of retirement, that person counts ${EN.eur(haushaltsZvE([[52000, 14000]]))}. Applying a year later, with two pension-year assessments, often puts you a band higher in grant.` },
      { q: 'Does my whole pension count as taxable income?', a: 'No. Only the taxable portion of the pension enters income tax, and its size depends on the year your pension started. Flat allowances, health and care insurance contributions and other deductions come off that. Taxable income is therefore usually far below the gross pension. Only the figure on the assessment matters.' },
      { q: 'Can a relative make the grant application for a pensioner?', a: 'Yes. You can authorise another person or a car dealer. The authorised person needs their own BundID account with the online ID function or an ELSTER certificate and uploads your power of attorney (Vollmacht) with the application. The money always goes to the keeper’s account, so yours, not the authorised person’s.' },
      { q: 'What happens if the keeper dies during the holding period?', a: `Re-registering the car to the heir does not harm the grant. The heir must then complete the remaining part of the ${F.haltedauer_monate}-month holding period. The inheritance is proven to BAFA with a certificate of inheritance (Erbschein). No claw-back follows as long as the car stays registered in Germany.` },
    ],
    body: (h) => `
<h2>Pensioners are expressly eligible</h2>
<p>The ${h.src('richtlinie', 'funding guideline')} excludes nobody on grounds of age. The same conditions apply as for people in work: a main residence in Germany, a new car first registered to you, household income under the limit, and a holding period of ${h.P.foerderung.haltedauer_monate} months. ${h.src('bafaFaq', 'BAFA')} has a separate question on this in its FAQ and names the point where many pensioners get stuck: the tax assessment.</p>
<h2>No assessment? A return is enough</h2>
<p>Many pensioners do not have to file a tax return because the taxable part of their pension is below the basic tax-free allowance. So they often have had no assessment for years. The grant, however, needs two assessments for every adult in the household. The route is simple:</p>
<ol>
<li>File an income tax return for each of the last two years with the tax office, on paper or through ELSTER.</li>
<li>The tax office processes the returns and issues formal assessments, even if no tax is due.</li>
<li>If the assessment shows taxable income of ${h.eur(0)}, that is valid proof.</li>
</ol>
<p>Allow a few weeks for the tax office. Since you only apply after registration anyway and have ${h.P.foerderung.antragsfrist_monate} months to do so, that is usually enough if you start early. Assessments may be at most ${h.P.foerderung.bescheid_max_alter_jahre} tax years old.</p>
<h2>Worked examples from retirement</h2>
${h.table(['Household', 'Assessments', 'Household income', 'Battery electric', 'Plug-in hybrid'], [
  ['Retired couple, no duty to file', `two at ${h.eur(0)} each`, h.eur(null0), h.eur(b(null0)), h.eur(b(null0, 0, 'phev'))],
  ['Newly retired, with partner', `${h.eur(52000)} and ${h.eur(14000)}; partner ${h.eur(6000)}`, h.eur(ueber), h.eur(b(ueber)), h.eur(b(ueber, 0, 'phev'))],
  ['The same couple a year later', `${h.eur(14000)} and ${h.eur(15000)}; partner ${h.eur(6000)}`, h.eur(spaeter), h.eur(b(spaeter)), h.eur(b(spaeter, 0, 'phev'))],
  ['Pensioner with a side income, alone', `${h.eur(23000)} and ${h.eur(27000)}`, h.eur(neben), h.eur(b(neben)), h.eur(b(neben, 0, 'phev'))],
], 'Retired households, registration in November 2026', ['l', 'l', 'r', 'r', 'r'])}
<p>The “newly retired” row shows the most common case: a good last working year lifts the average, so the household lands in the second band. A year later, with two pension-year assessments, it would be ${h.eur(b(spaeter) - b(ueber))} more. Whether waiting is worth it depends mostly on when you need the car and whether the grant is still running then; there is no guarantee of that.</p>
<h2>What counts as taxable income in retirement</h2>
<p>Taxable income under ${h.src('estg2', 'section 2(5) EStG')} is usually much smaller for pensioners than the pension on the bank statement. Only a share of the statutory pension is taxable, and that share depends on the year the pension began. The flat allowance for expenses, health and care insurance contributions and other special expenses come off it. Company pensions, Riester pensions, rental income or self-employment are added where taxable. Investment income already taxed at source (Abgeltungsteuer) is usually not part of taxable income; the assessment states what belongs there.</p>
<p>Payments that are not part of taxable income do not count for the grant, such as basic income support in old age (Grundsicherung) or housing benefit. Anyone still working freelance is normally required to file anyway and so has current assessments.</p>
<h2>Making the application</h2>
<p>Applications are made online only, through the federal funding portal (Förderzentrale). To log in you need a ${h.src('bundid', 'BundID account')} with the online ID function, meaning your ID card with its PIN plus a smartphone or card reader, or with an ELSTER certificate. If you file your tax return through ELSTER, you already have the certificate. A basic sign-up with username and password is not enough.</p>
<p>If you would rather not do it yourself, you can authorise someone else, such as a child, grandchild or the car dealer. The authorised person logs in with their own account and uploads the power of attorney. The payment always goes to the account of the person the car is registered to. The steps in detail are under ${h.a('antrag', 'how to apply')}.</p>
<h2>A possible timeline</h2>
<ol>
<li>In January both partners file returns for the two previous years, most easily through ELSTER, which can then also be used for BundID.</li>
<li>In March or April the assessments arrive. Check the taxable income straight away with the small calculator above.</li>
<li>The car is ordered and later registered. Only then can you apply.</li>
<li>Assessments, registration certificate and purchase contract are uploaded as PDFs; BAFA processes complete applications in order of arrival.</li>
<li>A few weeks after the grant notice (Zuwendungsbescheid), the money reaches the keeper’s account.</li>
</ol>
<h2>The holding period in later life</h2>
<p>The car must stay registered to you for ${h.P.foerderung.haltedauer_monate} months. Moving within Germany does not change that. If you have to give up the car earlier, for health reasons for example, tell BAFA; it decides case by case on a partial or full claw-back. If the keeper dies, the car can be re-registered to the heirs without the grant being reclaimed; they take over the remaining holding period. Details on selling and claw-backs are under ${h.a('haltedauer', 'holding period and resale')}.</p>
<h2>In short</h2>
<ul>
<li>Pensioners are eligible; age plays no part.</li>
<li>No assessment: file a voluntary return for two years; a ${h.eur(0)} assessment counts too.</li>
<li>Moving into retirement is averaged out; a good last working year counts half.</li>
<li>Changes after you apply have no effect on the grant.</li>
<li>Authorising someone is possible; the money always goes to the keeper.</li>
</ul>
<p>The exact band placement is on ${h.a('einkommensgrenze', 'income limit')}; how a partner is included is on ${h.a('haushaltseinkommen', 'household income')}.</p>`,
  },
});
