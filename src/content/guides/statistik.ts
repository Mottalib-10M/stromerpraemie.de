import { defineGuide } from '../../lib/guide-types';
import S from '../../data/bafa-statistik.json';
import M from '../../data/modelle.json';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Statistik der Bewilligungen: BAFA-Zwischenbericht vom 1.10.2026 (src/data/bafa-statistik.json) und, je Modell,
 * Bewilligungen (BAFA) neben Neuzulassungen Januar bis September 2026 (KBA FZ10) aus modelle.json.
 * Das Verhältnis ist ein Hinweis auf den Anteil privater, geförderter Käufe, keine Förderquote im strengen Sinn.
 */
const F = P.foerderung;
const n = S.bewilligungen;
const anteil = (x: number) => x / n;
const kinderMit = S.kinder.eins + S.kinder.zwei_plus;
const ueber80 = S.einkommen[3].anzahl + S.einkommen[4].anzahl;
const top = [...M.modelle].sort((a, b) => b.bafa - a.bafa).slice(0, 15);
const quote = (m: { bafa: number; kba_summe: number }) => m.bafa / m.kba_summe;
const hoch = [...M.modelle].sort((a, b) => quote(b) - quote(a)).slice(0, 5);
const tief = [...M.modelle].sort((a, b) => quote(a) - quote(b)).slice(0, 5);
const tage = Math.round((Date.parse(S.stand) - Date.parse(S.antrag_ab)) / 86400000);

export default defineGuide({
  id: 'statistik',
  group: 'antrag',
  order: 70,
  mini: 'aStat',
  related: ['laufzeit', 'foerderfaehige-modelle', 'leasing', 'einkommensgrenze', 'kinder'],
  sources: ['bafaStatistik', 'kba', 'bafaFaq'],
  de: {
    slug: 'bewilligungen-statistik',
    nav: 'Statistik',
    card: 'Wie viele Anträge bewilligt wurden, an wen, für welche Marken und Modelle, und was der Vergleich mit den Zulassungen zeigt.',
    title: 'E-Auto-Förderung Statistik 2026: Bewilligungen und Modelle',
    description: `E-Auto-Förderung Statistik 2026: ${DE.num(n)} Bewilligungen und ${DE.num(S.ausgezahlt_mio)} Mio. € bis Oktober, nach Einkommen, Kindern, Marken und Modellen, mit den KBA-Zulassungen.`,
    h1: 'Bewilligungen der E-Auto-Förderung: die Statistik 2026',
    intro: 'Das BAFA veröffentlicht regelmäßig, wie viele Anträge es bewilligt hat. Hier sind die Zahlen vom Oktober aufbereitet und je Modell mit den Neuzulassungen des Kraftfahrt-Bundesamts verglichen.',
    resume: `Bis zum ${datumText(S.stand, 'de')} hat das BAFA ${DE.num(n)} Anträge auf E-Auto-Förderung bewilligt und ${DE.num(S.ausgezahlt_mio)} Millionen Euro ausgezahlt, in den ${DE.num(tage)} Tagen seit Öffnung des Portals am ${datumText(S.antrag_ab, 'de')}. ${DE.pct(anteil(S.antrieb.bev))} der Bewilligungen betrafen reine Elektroautos, ${DE.pct(anteil(S.antrieb.phev))} Plug-in-Hybride. Kauf und Leasing waren fast gleich häufig: ${DE.num(S.erwerb.kauf)} zu ${DE.num(S.erwerb.leasing)}. Mehr als die Hälfte der Förderungen, ${DE.pct(anteil(S.einkommen[0].anzahl))}, ging an Haushalte mit höchstens ${DE.eur(S.einkommen[0].bis)} zu versteuerndem Einkommen. Haushalte über ${DE.eur(F.obergrenze_basis)}, die nur dank ihrer Kinder gefördert wurden, machten ${DE.pct(anteil(ueber80))} aus. ${DE.pct(anteil(kinderMit))} der geförderten Haushalte hatten mindestens ein förderrelevantes Kind. Die meisten Bewilligungen erhielt Tesla mit ${DE.num(S.marken[0][1])}, vor Skoda und Cupra. Je Modell lagen Tesla Model Y und Skoda Elroq vorn. Vergleicht man die Bewilligungen mit allen Neuzulassungen von Januar bis September, zeigen sich große Unterschiede: Kleinwagen wie der Leapmotor T03 wurden zu einem großen Teil gefördert gekauft, Modelle mit vielen Firmenwagen wie der Skoda Enyaq nur zu einem kleinen.`,
    faqs: [
      { q: 'Wie viele Anträge auf E-Auto-Förderung wurden bisher bewilligt?', a: `Nach dem Zwischenbericht des BAFA mit Stand ${datumText(S.stand, 'de')} wurden ${DE.num(n)} Anträge bewilligt und ${DE.num(S.ausgezahlt_mio)} Millionen Euro ausgezahlt. Davon entfielen ${DE.num(S.antrieb.bev)} auf reine Elektroautos und ${DE.num(S.antrieb.phev)} auf Plug-in-Hybride. Das BAFA aktualisiert die Statistik in unregelmäßigen Abständen; diese Seite übernimmt jede neue Fassung mit Datum.` },
      { q: 'Welche Automarke hat die meisten E-Auto-Förderungen bekommen?', a: `Tesla mit ${DE.num(S.marken[0][1])} Bewilligungen, vor Skoda mit ${DE.num(S.marken[1][1])} und Cupra mit ${DE.num(S.marken[2][1])}. Nach Konzernen liegt die Volkswagen-Gruppe vorn, weil sie mehrere Marken bündelt. Die Statistik zählt bewilligte Anträge, nicht verkaufte Autos; Käufe ohne Förderung, etwa Firmenwagen oder Haushalte über der Einkommensgrenze, fehlen darin.` },
      { q: 'Warum werden manche E-Auto-Modelle kaum gefördert gekauft?', a: 'Weil viele Neuzulassungen gar nicht förderfähig sind. Firmenwagen, Dienstwagen, Autos von Vermietern und Händlerzulassungen fallen heraus, ebenso Haushalte über der Einkommensgrenze. Modelle, die oft als Dienstwagen gefahren werden, haben deshalb einen kleinen Anteil geförderter Käufe, günstige Kleinwagen für Privatleute einen großen. Der Vergleich ist ein Hinweis, keine genaue Quote.' },
      { q: 'Profitieren vor allem Haushalte mit geringem Einkommen von der Förderung?', a: `Gemessen an der Zahl ja. ${DE.pct(anteil(S.einkommen[0].anzahl))} der Bewilligungen gingen an Haushalte mit höchstens ${DE.eur(S.einkommen[0].bis)} zu versteuerndem Einkommen, das ist die Stufe mit den höchsten Beträgen. Weil das zvE deutlich unter dem Bruttoeinkommen liegt, gehören dazu aber auch viele Haushalte mit mittleren Gehältern.` },
    ],
    body: (h) => `
<h2>Die Kennzahlen</h2>
<p>Die folgenden Zahlen stammen aus dem ${h.src('bafaStatistik', 'Zwischenbericht des BAFA')} mit Stand ${h.date(S.stand)}, 0 Uhr. Gezählt werden bewilligte Anträge, nicht eingereichte und nicht ausgezahlte.</p>
${h.table(['Kennzahl', 'Wert', 'Anteil'], [
  ['Bewilligungen', h.num(n), ''],
  ['Ausgezahlt', `${h.num(S.ausgezahlt_mio)} Mio. €`, ''],
  ['Reine Elektroautos', h.num(S.antrieb.bev), h.pct(anteil(S.antrieb.bev))],
  ['Plug-in-Hybride', h.num(S.antrieb.phev), h.pct(anteil(S.antrieb.phev))],
  ['Kauf', h.num(S.erwerb.kauf), h.pct(anteil(S.erwerb.kauf))],
  ['Leasing', h.num(S.erwerb.leasing), h.pct(anteil(S.erwerb.leasing))],
], `Bewilligungen der E-Auto-Förderung, Stand ${h.date(S.stand)}`, ['l', 'r', 'r'])}
<p>Rechnerisch sind das gut ${h.num(Math.round(n / tage))} Bewilligungen je Tag seit dem Start. Die ausgezahlte Summe je Bewilligung liegt bei ${h.eur((S.ausgezahlt_mio * 1e6) / n)}; da zwischen Bewilligung und Auszahlung einige Wochen liegen, ist das eher eine Untergrenze.</p>
<h2>Nach Einkommen und Kindern</h2>
${h.table(['Haushaltseinkommen', 'Bewilligungen', 'Anteil'], S.einkommen.map((e) => [`${h.eur(e.von)} bis ${h.eur(e.bis)}`, h.num(e.anzahl), h.pct(anteil(e.anzahl))]), 'Bewilligungen nach zu versteuerndem Haushaltseinkommen', ['l', 'r', 'r'])}
<p>Über die Hälfte der Förderungen ging in die erste Stufe. Die beiden Gruppen über ${h.eur(F.obergrenze_basis)} sind klein, weil dort nur Haushalte mit förderrelevanten Kindern zum Zug kommen: zwischen ${h.eur(S.einkommen[3].von)} und ${h.eur(S.einkommen[3].bis)} mit mindestens einem Kind, darüber mit mindestens zwei. Wie die Grenzen genau wirken, steht unter ${h.a('einkommensgrenze', 'Einkommensgrenze')}.</p>
${h.table(['Haushalt', 'Bewilligungen', 'Anteil'], [
  ['ohne förderrelevantes Kind', h.num(S.kinder.null), h.pct(anteil(S.kinder.null))],
  ['mit einem Kind', h.num(S.kinder.eins), h.pct(anteil(S.kinder.eins))],
  ['mit zwei oder mehr Kindern', h.num(S.kinder.zwei_plus), h.pct(anteil(S.kinder.zwei_plus))],
], 'Bewilligungen nach Haushaltsstruktur', ['l', 'r', 'r'])}
<p>Auffällig ist, dass Haushalte mit zwei oder mehr Kindern fast doppelt so oft vertreten sind wie Haushalte mit einem Kind. Ein Grund liegt in der Regel selbst: Zwei Kinder heben die Grenze auf ${h.eur(F.obergrenze_max)} und erhöhen den Betrag zweimal. Mehr dazu unter ${h.a('kinder', 'Kinderbonus')}.</p>
<h2>Nach Marken</h2>
${h.table(['Platz', 'Marke', 'Bewilligungen', 'Anteil'], S.marken.slice(0, 15).map(([m, x], i) => [String(i + 1), String(m), h.num(Number(x)), h.pct(anteil(Number(x)))]), 'Die 15 Marken mit den meisten Bewilligungen', ['r', 'l', 'r', 'r'])}
<h2>Nach Modellen, neben den Zulassungen</h2>
<p>Das BAFA nennt auch Bewilligungen je Modell. Diese Seite stellt sie neben die Neuzulassungen desselben Modells von Januar bis ${M.kba_bis_text.de} aus der Statistik ${h.src('kba', 'FZ10 des Kraftfahrt-Bundesamts')}. Varianten eines Modells sind zusammengefasst. Das Verhältnis ist kein exakter Anteil: Das KBA zählt alle Zulassungen ab Januar, auch Firmenwagen, Vermieter und Händler; das BAFA zählt bewilligte Anträge, die erst ab Mai möglich waren und mit einigen Wochen Verzug bearbeitet werden. Es zeigt aber, bei welchen Modellen private, geförderte Käufe eine große Rolle spielen.</p>
${h.table(['Modell', 'Bewilligungen', 'Neuzulassungen Jan. bis Sep.', 'Verhältnis'], top.map((m) => [`${m.marke} ${m.name}`, h.num(m.bafa), h.num(m.kba_summe), h.pct(quote(m))]), 'Die 15 Modelle mit den meisten Bewilligungen', ['l', 'r', 'r', 'r'])}
<p>Die höchsten Verhältnisse haben ${hoch.map((m) => `${m.marke} ${m.name} (${h.pct(quote(m))})`).join(', ')}. Die niedrigsten haben ${tief.map((m) => `${m.marke} ${m.name} (${h.pct(quote(m))})`).join(', ')}. Das passt zu einem einfachen Bild: Günstige Kleinwagen werden oft von Privatleuten mit mittlerem Einkommen gekauft, die gefördert werden; größere Modelle laufen häufiger als Firmen- oder Dienstwagen, die nicht förderfähig sind. Was die Modelle kosten und was nach der Förderung bleibt, zeigt ${h.a('foerderfaehige-modelle', 'förderfähige Modelle')}.</p>
<h2>Kauf und Leasing in der Statistik</h2>
<p>Dass Leasing mit ${h.num(S.erwerb.leasing)} Bewilligungen fast so häufig ist wie der Kauf mit ${h.num(S.erwerb.kauf)}, überrascht nur auf den ersten Blick. Leasing ist bei neuen Elektroautos seit Jahren verbreitet, und die Förderung gilt für Privatleasing ab einer Mindestlaufzeit genauso wie für den Kauf. Für Antragsteller bedeutet das: Wer least, steht mit seinem Antrag nicht am Rand, sondern in der Mitte der Statistik. Was beim Leasing anders ist, vor allem bei Laufzeit, Anzahlung und Rückgabe, steht unter ${h.a('leasing', 'Leasing')}.</p>
<h2>Plug-in-Hybride: ein kleiner Anteil</h2>
<p>Nur ${h.pct(anteil(S.antrieb.phev))} der Bewilligungen betreffen Plug-in-Hybride. Das liegt an den strengeren Bedingungen: Ein Hybrid muss beim CO2-Ausstoß oder bei der elektrischen Reichweite bestimmte Werte erreichen, und das Angebot an solchen Modellen ist kleiner. Hinzu kommt, dass viele Hybride als Dienstwagen gefahren werden und deshalb gar nicht gefördert werden können. Wer einen Plug-in-Hybrid in Betracht zieht, sollte die Werte des konkreten Modells vor dem Kauf prüfen, nicht erst beim Antrag.</p>
<h2>Was die Zahlen für Ihren Antrag bedeuten</h2>
<p>Die Statistik sagt nichts darüber, ob ein einzelner Antrag bewilligt wird; darüber entscheiden allein die Bedingungen der Richtlinie. Sie hilft aber, drei Dinge einzuordnen. Erstens: Die Förderung ist kein Programm für wenige. Bei fast ${h.num(Math.round(n / 1000) * 1000)} Bewilligungen in wenigen Monaten ist ein sauber gestellter Antrag Routine. Zweitens: Haushalte mit mittlerem Einkommen sind die größte Gruppe. Wer glaubt, mit einem normalen Gehalt zu viel zu verdienen, sollte das zu versteuernde Einkommen aus dem Steuerbescheid nachsehen, nicht das Brutto. Drittens: Kinder zählen. Gut ein Drittel der geförderten Haushalte hatte förderrelevante Kinder, und gerade oberhalb von ${h.eur(F.obergrenze_basis)} entscheiden sie über Förderung oder keine.</p>
<p>Ein Beispiel: Ein Paar mit zwei Kindern und einem gemeinsamen zu versteuernden Einkommen von ${h.eur(84000)} fällt in die Gruppe zwischen ${h.eur(S.einkommen[3].von)} und ${h.eur(S.einkommen[3].bis)}. Ohne Kinder läge es über der Grenze. Mit zwei förderrelevanten Kindern ist es förderfähig und gehört zu den rund ${h.num(S.einkommen[3].anzahl)} Haushalten dieser Gruppe. Wie hoch der Betrag genau ist, rechnet der Mini-Rechner oben oder der Förderrechner auf der Startseite aus.</p>
<h2>Woher die Zahlen kommen und wie oft sie sich ändern</h2>
<p>Das BAFA veröffentlicht die Statistik als PDF auf seiner Seite zur E-Auto-Förderung, in unregelmäßigen Abständen. Die Modellzahlen des KBA stammen aus der Reihe FZ10, die jeden Monat die Neuzulassungen nach Marke und Modellreihe ausweist. Diese Seite übernimmt beide Quellen mit Datum und rechnet die Anteile selbst aus. Abweichungen um wenige Fälle entstehen, wenn das BAFA Modellnamen anders schreibt als das KBA oder Varianten getrennt zählt. Das Verhältnis je Modell ist deshalb nur ein Richtwert und keine amtliche Zahl des BAFA oder des KBA.</p>
<h2>Was die Statistik nicht zeigt</h2>
<ul>
<li>Wie viele Anträge eingereicht, aber noch nicht bewilligt oder abgelehnt wurden.</li>
<li>Wie viel Geld insgesamt noch zur Verfügung steht.</li>
<li>Die Verteilung nach Bundesländern oder Altersgruppen.</li>
<li>Wie viele Haushalte über der Einkommensgrenze ein Elektroauto ohne Förderung gekauft haben.</li>
</ul>
<p>Wer wissen will, wie lange die Förderung noch läuft, findet die bekannten Termine und offenen Fragen unter ${h.a('laufzeit', 'Laufzeit der Förderung')}. Der Mini-Rechner oben ordnet Ihr Haushaltseinkommen in die Gruppen der Statistik ein.</p>`,
  },
  en: {
    slug: 'approval-statistics',
    nav: 'Statistics',
    card: 'How many applications were approved, for whom, for which brands and models, and what comparing with registrations shows.',
    title: 'EV grant statistics 2026: approvals by income and model',
    description: `EV grant statistics 2026: ${EN.num(n)} approvals and €${EN.num(S.ausgezahlt_mio)} million paid by October, by income, children, brand and model, with the KBA new registration figures.`,
    h1: 'EV grant approvals: the 2026 statistics',
    intro: 'BAFA regularly publishes how many applications it has approved. Here are the October figures, set out clearly and compared model by model with new registrations from the Federal Motor Transport Authority.',
    resume: `By ${datumText(S.stand, 'en')}, BAFA had approved ${EN.num(n)} EV grant applications and paid out ${EN.num(S.ausgezahlt_mio)} million euros, in the ${EN.num(tage)} days since the portal opened on ${datumText(S.antrag_ab, 'en')}. ${EN.pct(anteil(S.antrieb.bev))} of approvals were for battery electric cars, ${EN.pct(anteil(S.antrieb.phev))} for plug-in hybrids. Purchases and leases were almost equally common: ${EN.num(S.erwerb.kauf)} to ${EN.num(S.erwerb.leasing)}. More than half of grants, ${EN.pct(anteil(S.einkommen[0].anzahl))}, went to households with taxable income of at most ${EN.eur(S.einkommen[0].bis)}. Households above ${EN.eur(F.obergrenze_basis)}, funded only thanks to their children, made up ${EN.pct(anteil(ueber80))}. ${EN.pct(anteil(kinderMit))} of funded households had at least one qualifying child. Tesla received the most approvals, ${EN.num(S.marken[0][1])}, ahead of Skoda and Cupra. By model, the Tesla Model Y and Skoda Elroq led. Comparing approvals with all new registrations from January to September shows large differences: small cars like the Leapmotor T03 were largely bought with the grant, models with many company cars like the Skoda Enyaq only to a small extent.`,
    faqs: [
      { q: 'How many EV grant applications have been approved so far?', a: `According to BAFA’s interim report as of ${datumText(S.stand, 'en')}, ${EN.num(n)} applications were approved and ${EN.num(S.ausgezahlt_mio)} million euros paid out. Of those, ${EN.num(S.antrieb.bev)} were battery electric cars and ${EN.num(S.antrieb.phev)} plug-in hybrids. BAFA updates the statistics at irregular intervals; this site adopts each new edition with its date.` },
      { q: 'Which car brand has received the most EV grants?', a: `Tesla, with ${EN.num(S.marken[0][1])} approvals, ahead of Skoda with ${EN.num(S.marken[1][1])} and Cupra with ${EN.num(S.marken[2][1])}. By group, Volkswagen leads because it combines several brands. The statistics count approved applications, not cars sold; purchases without the grant, such as company cars or households over the income limit, are not included.` },
      { q: 'Why are some EV models rarely bought with the grant?', a: 'Because many new registrations are not eligible at all. Company cars, fleet vehicles, rental cars and dealer registrations are excluded, and so are households over the income limit. Models often driven as company cars therefore show a small share of funded purchases, cheap small cars bought privately a large one. The comparison is an indicator, not an exact rate.' },
      { q: 'Does the grant mainly go to lower-income households?', a: `By number, yes. ${EN.pct(anteil(S.einkommen[0].anzahl))} of approvals went to households with taxable income of at most ${EN.eur(S.einkommen[0].bis)}, the band with the highest amounts. Because taxable income is well below gross income, that band also includes many households on fairly ordinary middle salaries.` },
    ],
    body: (h) => `
<h2>Key figures</h2>
<p>The figures below come from ${h.src('bafaStatistik', 'BAFA’s interim report')} as of ${h.date(S.stand)}, midnight. They count approved applications, not those submitted or paid.</p>
${h.table(['Figure', 'Value', 'Share'], [
  ['Approvals', h.num(n), ''],
  ['Paid out', `€${h.num(S.ausgezahlt_mio)} million`, ''],
  ['Battery electric', h.num(S.antrieb.bev), h.pct(anteil(S.antrieb.bev))],
  ['Plug-in hybrid', h.num(S.antrieb.phev), h.pct(anteil(S.antrieb.phev))],
  ['Purchase', h.num(S.erwerb.kauf), h.pct(anteil(S.erwerb.kauf))],
  ['Lease', h.num(S.erwerb.leasing), h.pct(anteil(S.erwerb.leasing))],
], `EV grant approvals as of ${h.date(S.stand)}`, ['l', 'r', 'r'])}
<p>On paper that is just over ${h.num(Math.round(n / tage))} approvals a day since the start. The amount paid per approval is ${h.eur((S.ausgezahlt_mio * 1e6) / n)}; since payment follows approval by a few weeks, that is more of a lower bound.</p>
<h2>By income and children</h2>
${h.table(['Household income', 'Approvals', 'Share'], S.einkommen.map((e) => [`${h.eur(e.von)} to ${h.eur(e.bis)}`, h.num(e.anzahl), h.pct(anteil(e.anzahl))]), 'Approvals by household taxable income', ['l', 'r', 'r'])}
<p>More than half of grants went to the first band. The two groups above ${h.eur(F.obergrenze_basis)} are small because only households with qualifying children are eligible there: between ${h.eur(S.einkommen[3].von)} and ${h.eur(S.einkommen[3].bis)} with at least one child, above that with at least two. How the limits work exactly is under ${h.a('einkommensgrenze', 'income limit')}.</p>
${h.table(['Household', 'Approvals', 'Share'], [
  ['no qualifying child', h.num(S.kinder.null), h.pct(anteil(S.kinder.null))],
  ['one child', h.num(S.kinder.eins), h.pct(anteil(S.kinder.eins))],
  ['two or more children', h.num(S.kinder.zwei_plus), h.pct(anteil(S.kinder.zwei_plus))],
], 'Approvals by household type', ['l', 'r', 'r'])}
<p>Households with two or more children appear almost twice as often as those with one. Part of the reason is the rule itself: two children lift the limit to ${h.eur(F.obergrenze_max)} and raise the amount twice. More under ${h.a('kinder', 'children bonus')}.</p>
<h2>By brand</h2>
${h.table(['Rank', 'Brand', 'Approvals', 'Share'], S.marken.slice(0, 15).map(([m, x], i) => [String(i + 1), String(m), h.num(Number(x)), h.pct(anteil(Number(x)))]), 'The 15 brands with the most approvals', ['r', 'l', 'r', 'r'])}
<h2>By model, next to registrations</h2>
<p>BAFA also lists approvals by model. This site sets them beside the same model’s new registrations from January to ${M.kba_bis_text.en} from the ${h.src('kba', 'Federal Motor Transport Authority’s FZ10 statistics')}. Variants of a model are combined. The ratio is not an exact share: the KBA counts all registrations since January, including company cars, rental firms and dealers; BAFA counts approved applications, which were only possible from May and are processed with a few weeks’ delay. It does show, however, for which models private funded purchases play a large part.</p>
${h.table(['Model', 'Approvals', 'Registrations Jan. to Sep.', 'Ratio'], top.map((m) => [`${m.marke} ${m.name}`, h.num(m.bafa), h.num(m.kba_summe), h.pct(quote(m))]), 'The 15 models with the most approvals', ['l', 'r', 'r', 'r'])}
<p>The highest ratios are for ${hoch.map((m) => `${m.marke} ${m.name} (${h.pct(quote(m))})`).join(', ')}. The lowest are for ${tief.map((m) => `${m.marke} ${m.name} (${h.pct(quote(m))})`).join(', ')}. That fits a simple picture: cheap small cars are often bought by private buyers on middle incomes who receive the grant; larger models run more often as company or fleet cars, which are not eligible. What the models cost and what remains after the grant is on ${h.a('foerderfaehige-modelle', 'eligible models')}.</p>
<h2>Purchase and lease in the statistics</h2>
<p>That leasing, with ${h.num(S.erwerb.leasing)} approvals, is almost as common as purchase, with ${h.num(S.erwerb.kauf)}, is only surprising at first sight. Leasing has been widespread for new electric cars for years, and the grant applies to private leases above a minimum term just as it does to purchases. For applicants this means that a lease puts you in the middle of the statistics, not at the edge. What is different with a lease, mainly the term, the down payment and the return, is explained under ${h.a('leasing', 'leasing')}.</p>
<h2>Plug-in hybrids: a small share</h2>
<p>Only ${h.pct(anteil(S.antrieb.phev))} of approvals concern plug-in hybrids. The reason is the stricter conditions: a hybrid must meet certain values for CO2 emissions or electric range, and fewer models qualify. On top of that, many hybrids are driven as company cars and cannot be funded at all. If you are considering a plug-in hybrid, check the values of the exact model before you buy, not when you apply.</p>
<h2>What the figures mean for your application</h2>
<p>The statistics say nothing about whether an individual application will be approved; only the conditions of the guideline decide that. They do help put three things in context. First, the grant is not a programme for a few. With almost ${h.num(Math.round(n / 1000) * 1000)} approvals in a few months, a properly prepared application is routine. Second, middle-income households are the largest group. If you think you earn too much on an ordinary salary, look up the taxable income on your tax assessment, not your gross pay. Third, children count. Just over a third of funded households had qualifying children, and above ${h.eur(F.obergrenze_basis)} they decide between a grant and none.</p>
<p>An example: a couple with two children and a joint taxable income of ${h.eur(84000)} falls into the band between ${h.eur(S.einkommen[3].von)} and ${h.eur(S.einkommen[3].bis)}. Without children they would be over the limit. With two qualifying children they are eligible and belong to the roughly ${h.num(S.einkommen[3].anzahl)} households in that band. The exact amount is worked out by the small calculator above or the grant calculator on the home page.</p>
<h2>Where the figures come from and how often they change</h2>
<p>BAFA publishes the statistics as a PDF on its EV grant page, at irregular intervals. The KBA model figures come from the FZ10 series, which reports new registrations by make and model range every month. This site takes both sources with their dates and calculates the shares itself. Differences of a few cases arise when BAFA writes model names differently from the KBA or counts variants separately. The ratio per model is therefore a guide figure, not an official number.</p>
<h2>What the statistics do not show</h2>
<ul>
<li>How many applications have been submitted but not yet approved or rejected.</li>
<li>How much money remains available in total.</li>
<li>A breakdown by federal state or age group.</li>
<li>How many households over the income limit bought an electric car without the grant.</li>
</ul>
<p>If you want to know how long the grant will run, the known dates and open questions are under ${h.a('laufzeit', 'how long it runs')}. The small calculator above places your household income in the statistics’ bands.</p>`,
  },
});
