import { defineGuide } from '../../lib/guide-types';
import { modell, preis, netto, quote, rang, nettoTabelle, monatsTabelle, vorNach, spitze, MODELLE } from '../../lib/modell-seite';
import { betragTabelle } from '../../lib/engine/foerderung';
import { datumText, monatsName } from '../../lib/engine/datum';
import { befreiung } from '../../lib/engine/kfz';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Leapmotor T03: Preisliste MY27, Stand 1.10.2026 (leapmotor.net, gelesen 19.10.2026): T03 Smart, 70 kW, LFP 37,3 kWh,
 * 18 900 € UVP zzgl. Überführung, WLTP bis 275 km. Bewilligungen der Marke nach Modellen: BAFA-Statistik vom 1.10.2026
 * (research/bafa/statistik-2026-10-01.txt), C10 als Elektroauto ohne die Range-Extender-Version.
 */
const F = P.foerderung;
const m = modell('leapmotor-t03');
const lp = preis(m);
const s1 = F.grenzen[0], s2 = F.grenzen[1], s3 = F.grenzen[2];
const vn = vorNach(m);
const sp = spitze(m);
const klein = ['dacia-spring', 'leapmotor-t03', 'renault-twingo', 'citroen-e-c3', 'hyundai-inster', 'fiat-500e'].map(modell);
/** BAFA, Bewilligungen Leapmotor nach Modell, Stand 1.10.2026 (Marke gesamt 5 816). */
const MARKE: Array<[string, number]> = [['T03', 3561], ['B10', 1268], ['C10', 784]];
const markeGesamt = 5816;
const zweiter = [...MODELLE.modelle].sort((a, b) => quote(b) - quote(a))[1];
const juniSprung = m.kba[5] / m.kba[4];
const thg3 = P.thg.markt_ohne_bonus_ab_eur * 3;
const steuer = befreiung('2026-11-01');
const spring = modell('dacia-spring');

export default defineGuide({
  id: 'leapmotor-t03',
  group: 'modelle',
  order: 40,
  tool: 'praemie',
  toolPreset: { modell: 'leapmotor-t03' },
  related: ['foerderfaehige-modelle', 'dacia-spring', 'hyundai-inster', 'einkommensgrenze', 'statistik'],
  sources: ['bafaStatistik', 'kba', 'richtlinie', 'bafaHaushalt'],
  de: {
    slug: 'leapmotor-t03-foerderung',
    nav: 'Leapmotor T03',
    card: 'Was der Leapmotor T03 nach der E-Auto-Förderung kostet, warum er so oft gefördert gekauft wird und wie er neben anderen Kleinwagen steht.',
    title: `Leapmotor T03 Förderung 2026: Preis ab ${DE.eur(netto(m, s1, 2))} netto`,
    description: `Leapmotor T03 Förderung 2026: ${DE.eur(lp)} Listenpreis, nach der E-Auto-Förderung ${DE.eur(netto(m, s1, 2))} bis ${DE.eur(netto(m, s3, 0))}. Kein anderes Modell wird so oft gefördert gekauft.`,
    h1: 'Leapmotor T03: Preis nach der E-Auto-Förderung 2026',
    intro: 'Der Rechner ist auf den Leapmotor T03 eingestellt. Geben Sie Einkommen und Kinder ein, um den Preis nach der Förderung für Ihren Haushalt zu sehen.',
    resume: `Der Leapmotor T03 ist ein kleiner Viertürer mit ${DE.num(m.batterie as number, 1)} kWh Batterie und bis zu ${DE.num(m.reichweite as number)} km Reichweite nach WLTP. Laut Preisliste vom Oktober kostet er ${DE.eur(lp)} plus Überführung. Mit der E-Auto-Förderung bleiben einem Haushalt mit höchstens ${DE.eur(s1)} zu versteuerndem Einkommen ohne Kind ${DE.eur(netto(m, s1, 0))}, mit zwei Kindern ${DE.eur(netto(m, s1, 2))}. Selbst in der dritten Stufe bis ${DE.eur(s3)} kostet er nur ${DE.eur(netto(m, s3, 0))}. Die Förderung deckt damit bis zu ${DE.pct(betragTabelle(s1, 2, 'bev') / lp)} des Listenpreises. Kein anderes Modell der Statistik wird so oft gefördert gekauft: Auf ${DE.num(m.kba_summe)} Neuzulassungen von Januar bis September kommen ${DE.num(m.bafa)} Bewilligungen, ${DE.pct(quote(m), 1)}. Das ist Platz ${DE.num(rang(m))} nach der Zahl der Bewilligungen. Nach dem Start der Anträge stiegen die Zulassungen sprunghaft: Im Juni kamen ${DE.num(m.kba[5])} neue T03 auf die Straße, mehr als dreimal so viele wie im Mai.`,
    faqs: [
      { q: 'Was kostet der Leapmotor T03 nach der Förderung?', a: `Je nach Haushalt zwischen ${DE.eur(netto(m, s1, 2))} und ${DE.eur(netto(m, s3, 0))}, ausgehend vom Listenpreis von ${DE.eur(lp)} ohne Überführung. Den niedrigsten Wert erreicht ein Haushalt mit zwei förderrelevanten Kindern und höchstens ${DE.eur(s1)} zu versteuerndem Einkommen. Liegt das Einkommen über der Grenze für Ihre Kinderzahl, gibt es keine Förderung, und es bleibt beim vollen Preis.` },
      { q: 'Warum wird der Leapmotor T03 so oft mit Förderung gekauft?', a: `Weil er fast nur an Privatleute geht. Firmen und Flotten kaufen selten einen so kleinen Wagen, und die Käufer eines günstigen Autos liegen häufig unter der Einkommensgrenze. Deshalb kommen auf eine Neuzulassung ${DE.pct(quote(m), 1)} Bewilligungen, beim Modell auf Platz zwei, dem ${zweiter.marke} ${zweiter.name}, ${DE.pct(quote(zweiter), 1)}. Weil Anträge mit Verzug bearbeitet werden, dürfte der echte Anteil noch höher liegen.` },
      { q: 'Wird der Leapmotor T03 trotz chinesischer Marke gefördert?', a: 'Ja. Die Richtlinie stellt keine Bedingung an das Herstellerland oder den Produktionsort. Gefördert wird jedes neue Elektroauto der Klasse M1, das erstmals in Deutschland zugelassen wird. Leapmotor gehört in Europa zu einem Gemeinschaftsunternehmen mit Stellantis. Über eine Regel zur Herkunft wird auf europäischer Ebene diskutiert, für die laufende Förderung gilt sie nicht.' },
      { q: 'Reicht ein geringes Einkommen ohne Steuererklärung für die Förderung?', a: `Das BAFA verlangt für jede erwachsene Person im Haushalt ${DE.num(F.bescheide_je_person)} Steuerbescheide. Ein Bescheid über ein zu versteuerndes Einkommen von 0 Euro zählt ebenfalls. Wer bisher keine Steuererklärung abgegeben hat, etwa als Studentin oder mit einem Minijob, kann eine Steuererklärung freiwillig abgeben und erhält so die nötigen Bescheide. Wie das geht, steht auf der Seite zum Haushaltseinkommen.` },
      { q: 'Darf ich den geförderten T03 nach drei Jahren verkaufen?', a: `Ja. Die Haltedauer beträgt ${DE.num(F.haltedauer_monate)} Monate ab der Zulassung. Danach können Sie den T03 verkaufen oder abmelden, ohne dass das BAFA etwas zurückfordert. Wer früher verkauft, muss das melden und mit einer Rückforderung rechnen. Ein Unfall mit Totalschaden oder ein Diebstahl sind Sonderfälle, für die eigene Regeln gelten; sie stehen auf der Seite zur Haltedauer.` },
    ],
    body: (h) => `
<h2>Der T03 nach der Förderung</h2>
<p>Ausgangspunkt ist der Listenpreis von ${h.eur(lp)} für den ${m.version?.de}. Die Überführung kommt hinzu, ebenso Zulassung und Kennzeichen. Rechnen Sie also mit dem Endpreis aus Ihrem Angebot, wenn Sie den Rechner oben nutzen.</p>
${nettoTabelle(h, m)}
<p>Für einen Kleinwagen ist die Förderung ein großer Teil des Preises. In der ersten Stufe ohne Kind sind es ${h.pct(betragTabelle(s1, 0, 'bev') / lp)}, mit zwei Kindern ${h.pct(betragTabelle(s1, 2, 'bev') / lp)}. Zum Vergleich: Beim Skoda Elroq deckt derselbe Betrag nur gut ein Achtel. Ein Auszubildender mit ${h.eur(18000)} zu versteuerndem Einkommen zahlt für den T03 ${h.eur(netto(m, 18000, 0))}, ein Paar mit einem Kind und ${h.eur(58000)} ${h.eur(netto(m, 58000, 1))}.</p>
<h2>Kein Modell wird öfter gefördert gekauft</h2>
<p>Teilt man die ${h.src('bafaStatistik', 'Bewilligungen des BAFA')} durch die ${h.src('kba', 'Neuzulassungen des KBA')}, liegt der T03 mit ${h.pct(quote(m))} vorn, mit deutlichem Abstand zum ${zweiter.marke} ${zweiter.name} mit ${h.pct(quote(zweiter))}. Bei großen Modellen wie dem Tesla Model Y oder dem Skoda Enyaq liegt der Wert weit darunter. Das Muster ist einfach: Je günstiger ein Auto und je seltener es als Firmenwagen läuft, desto größer der Anteil privater Käufer unter der Einkommensgrenze. Weil zwischen Zulassung und Bewilligung einige Wochen liegen, unterschätzt der Wert den wahren Anteil eher.</p>
<h2>Der Sprung im Juni</h2>
${monatsTabelle(h, m)}
<p>Von Januar bis April kamen im Schnitt ${h.num(vn.vor)} neue T03 im Monat auf die Straße. Im Juni, wenige Wochen nach dem Start der Anträge am ${h.date(F.richtlinie_datum)}, waren es ${h.num(m.kba[5])}, das ${h.num(juniSprung, 1)}-Fache des Mai. Auch der Juli lag mit ${h.num(m.kba[6])} hoch. Im Schnitt von Juni bis September sind es ${h.num(vn.nach)} im Monat, mehr als doppelt so viele wie im Frühjahr. Kein anderes Modell mit eigener Seite zeigt so deutlich, wie die Förderung die Nachfrage nach günstigen Elektroautos bewegt. Die Spitze im ${monatsName(sp.monat, 'de')} dürfte zum Teil auch Bestellungen enthalten, die Käufer bis zur Klarheit über die Förderung zurückgehalten hatten.</p>
<h2>Der T03 neben anderen Kleinwagen</h2>
${h.table(['Modell', 'Listenpreis', 'Batterie', 'Reichweite', `netto bis ${h.eur(s1)}, 2 Kinder`, 'Euro je km nach Förderung'], klein.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), x.batterie ? `${h.num(x.batterie, 1)} kWh` : 'k. A.', x.reichweite ? `${h.num(x.reichweite)} km` : 'k. A.', h.eur(netto(x, s1, 2)), x.reichweite ? h.eur(netto(x, s1, 2) / x.reichweite) : 'k. A.']), 'Kleinwagen bis rund 26 000 Euro, Herstellerangaben gelesen am 19.10.2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Nur der Dacia Spring ist noch günstiger, hat aber weniger Reichweite. Nach dem Preis je Kilometer Reichweite liegt der T03 vorn. Größer und teurer sind der Hyundai Inster und der Fiat 500e; der Inster bietet mehr Reichweite, der 500e weniger. Die letzte Spalte ist nur eine grobe Hilfe für den ersten Vergleich, kein Urteil über das bessere Auto: Platz im Innenraum, Ladeleistung und Ausstattung sind für viele Käufer wichtiger.</p>
<h2>Batterie und Alltag</h2>
<p>Der T03 hat eine Batterie mit Lithium-Eisenphosphat-Zellen, kurz LFP, mit ${h.num(m.batterie as number, 1)} kWh. Diese Zellchemie gilt als robust und verträgt häufiges Vollladen besser als andere, dafür ist sie bei gleicher Größe etwas schwerer. Die Reichweite von bis zu ${h.num(m.reichweite as number)} km nach WLTP reicht für Stadt, Pendeln und Einkäufe gut; im Winter und auf der Autobahn sinkt sie spürbar. Für lange Strecken ist der T03 weniger gedacht, auch wenn sie mit Ladepausen machbar sind. Wer ihn als Zweitwagen neben einem älteren Verbrenner nutzt, kommt mit der Reichweite meist problemlos aus. Für die Förderung spielt all das keine Rolle: Bei reinen Elektroautos gibt es keine Mindestreichweite.</p>
<h2>Rechenbeispiel über drei Jahre</h2>
<p>Ein Haushalt ohne Kind in der ersten Stufe zahlt nach Förderung ${h.eur(netto(m, s1, 0))}. Die Kfz-Steuer entfällt bei einer Erstzulassung im November 2026 bis zum ${h.date(steuer.bis as string)}. Mit der THG-Prämie von mindestens ${h.eur(P.thg.markt_ohne_bonus_ab_eur)} im Jahr nach dem Marktstand vom Oktober kommen über die drei Jahre der Haltedauer rund ${h.eur(thg3)} zurück. Rechnerisch bleiben so ${h.eur(netto(m, s1, 0) - thg3)} für das Auto, beim etwas günstigeren ${spring.marke} ${spring.name} wären es ${h.eur(netto(spring, s1, 0) - thg3)}. Strom, Versicherung und Wartung kommen hinzu, ebenso der Wertverlust, den niemand sicher vorhersagen kann. Wie die THG-Prämie funktioniert, steht unter ${h.a('thg-praemie', 'THG-Prämie')}.</p>
<h2>Leapmotor in der Statistik</h2>
${h.table(['Modell', 'Bewilligungen', 'Anteil an der Marke'], MARKE.map(([n, x]) => [`Leapmotor ${n}`, h.num(x), h.pct(x / markeGesamt)]), `Leapmotor: Bewilligungen nach Modell, Stand ${h.date(MODELLE.bafa_stand)}`, ['l', 'r', 'r'])}
<p>Mit zusammen ${h.num(markeGesamt)} Bewilligungen steht Leapmotor unter den Marken auf Platz 4, obwohl die Marke in Deutschland neu ist. Der größte Teil entfällt auf den T03. Der B10 ist ein kompaktes SUV ab ${h.eur(preis(modell('leapmotor-b10')))}, der C10 ein größeres SUV, das es auch mit Range Extender gibt; diese Version zählt das BAFA als Plug-in-Hybrid.</p>
<h2>Was Sie vor dem Kauf klären</h2>
<ul>
<li>Den Endpreis mit Überführung: Bei einem Listenpreis unter ${h.eur(20000)} fällt sie anteilig stärker ins Gewicht als bei einem großen Auto.</li>
<li>Ob der Händler den Wagen schon zugelassen hat: Eine Tageszulassung ist nicht förderfähig, auch wenn der Preis verlockend ist.</li>
<li>Ihre Steuerbescheide: Das ${h.src('bafaHaushalt', 'BAFA erklärt')}, welche Bescheide für den Haushalt zählen. Bei geringen Einkommen fehlen sie oft, siehe ${h.a('haushaltseinkommen', 'Haushaltseinkommen')}.</li>
<li>Die Haltedauer von ${h.num(F.haltedauer_monate)} Monaten: Wer das Auto als Übergang plant, sollte das einrechnen.</li>
<li>Den Zeitpunkt des Antrags: Er ist bis ${h.num(F.antragsfrist_monate)} Monate nach der Zulassung möglich. Stellen Sie ihn trotzdem bald, denn die Bearbeitung dauert einige Wochen, und erst danach fließt das Geld. Gerade bei einem günstigen Auto, das viele ohne große Rücklagen kaufen, macht dieser Zeitraum einen Unterschied für die Haushaltskasse.</li>
</ul>`,
  },
  en: {
    slug: 'leapmotor-t03-grant',
    nav: 'Leapmotor T03',
    card: 'What the Leapmotor T03 costs after the German EV grant, why it is so often bought with it and how it compares with other small cars.',
    title: `Leapmotor T03 EV grant 2026: price from ${EN.eur(netto(m, s1, 2))} net`,
    description: `Leapmotor T03 EV grant 2026: ${EN.eur(lp)} list price, ${EN.eur(netto(m, s1, 2))} to ${EN.eur(netto(m, s3, 0))} after the German EV grant. No other model is bought with the grant as often as this.`,
    h1: 'Leapmotor T03: price after the 2026 EV grant',
    intro: 'The calculator is set to the Leapmotor T03. Enter income and children to see the price after the grant for your household.',
    resume: `The Leapmotor T03 is a small four-door car with a ${EN.num(m.batterie as number, 1)} kWh battery and up to ${EN.num(m.reichweite as number)} km of WLTP range. According to the October price list it costs ${EN.eur(lp)} plus delivery. With the German EV grant, a household with taxable income of at most ${EN.eur(s1)} and no child pays ${EN.eur(netto(m, s1, 0))}, with two children ${EN.eur(netto(m, s1, 2))}. Even in the third band up to ${EN.eur(s3)} it costs only ${EN.eur(netto(m, s3, 0))}. The grant thus covers up to ${EN.pct(betragTabelle(s1, 2, 'bev') / lp)} of the list price. No other model in the statistics is bought with the grant so often: against ${EN.num(m.kba_summe)} new registrations from January to September there are ${EN.num(m.bafa)} approvals, ${EN.pct(quote(m), 1)}. That puts it ${EN.num(rang(m))}th by number of approvals. After applications opened, registrations jumped: in June ${EN.num(m.kba[5])} new T03s took to the road, more than three times as many as in May.`,
    faqs: [
      { q: 'What does the Leapmotor T03 cost after the grant?', a: `Depending on the household, between ${EN.eur(netto(m, s1, 2))} and ${EN.eur(netto(m, s3, 0))}, starting from the ${EN.eur(lp)} list price without delivery. The lowest figure applies to a household with two qualifying children and taxable income of at most ${EN.eur(s1)}. If income is above the limit for your number of children, there is no grant and the full price remains.` },
      { q: 'Why is the Leapmotor T03 so often bought with the grant?', a: `Because it goes almost entirely to private buyers. Companies and fleets rarely buy such a small car, and buyers of a cheap car are often under the income limit. So there are ${EN.pct(quote(m), 1)} approvals per new registration, against ${EN.pct(quote(zweiter), 1)} for the runner-up, the ${zweiter.marke} ${zweiter.name}. Since applications are processed with a delay, the real share is probably higher still.` },
      { q: 'Does the Leapmotor T03 qualify despite being a Chinese brand?', a: 'Yes. The guideline sets no condition on the manufacturer’s country or the place of production. Any new M1 electric car first registered in Germany qualifies. In Europe, Leapmotor belongs to a joint venture with Stellantis. A rule on origin is being discussed at European level, but it does not apply to the current grant.' },
      { q: 'Is a low income without a tax return enough for the grant?', a: `BAFA requires ${EN.num(F.bescheide_je_person)} tax assessments for every adult in the household. An assessment showing taxable income of 0 euros counts as well. If you have not filed a tax return so far, for example as a student or with a mini-job, you can file one voluntarily and receive the assessments that way. How that works is on the household income page.` },
      { q: 'May I sell the funded T03 after three years?', a: `Yes. The holding period is ${EN.num(F.haltedauer_monate)} months from registration. After that you can sell or deregister the T03 without BAFA reclaiming anything. If you sell earlier, you must report it and expect a claim for repayment. An accident with a write-off or a theft are special cases with their own rules, which are set out on the holding period page.` },
    ],
    body: (h) => `
<h2>The T03 after the grant</h2>
<p>The starting point is the ${h.eur(lp)} list price for the ${m.version?.en}. Delivery comes on top, as do registration and number plates. So use the final price from your quote when you use the calculator above.</p>
${nettoTabelle(h, m)}
<p>On a small car the grant is a big part of the price. In the first band without children it is ${h.pct(betragTabelle(s1, 0, 'bev') / lp)}, with two children ${h.pct(betragTabelle(s1, 2, 'bev') / lp)}. For comparison, on the Skoda Elroq the same amount covers only just over an eighth. An apprentice with taxable income of ${h.eur(18000)} pays ${h.eur(netto(m, 18000, 0))} for the T03, a couple with one child on ${h.eur(58000)} ${h.eur(netto(m, 58000, 1))}.</p>
<h2>No model is bought with the grant more often</h2>
<p>Dividing ${h.src('bafaStatistik', 'BAFA approvals')} by ${h.src('kba', 'KBA new registrations')}, the T03 leads at ${h.pct(quote(m))}, well ahead of the ${zweiter.marke} ${zweiter.name} at ${h.pct(quote(zweiter))}. For large models such as the Tesla Model Y or Skoda Enyaq the figure is far lower. The pattern is simple: the cheaper a car and the less often it runs as a company car, the larger the share of private buyers under the income limit. Because approval follows registration by a few weeks, the figure tends to understate the true share.</p>
<h2>The June jump</h2>
${monatsTabelle(h, m)}
<p>From January to April an average of ${h.num(vn.vor)} new T03s a month took to the road. In June, a few weeks after applications opened on ${h.date(F.richtlinie_datum)}, there were ${h.num(m.kba[5])}, ${h.num(juniSprung, 1)} times the May figure. July was high too at ${h.num(m.kba[6])}. Averaged over June to September it is ${h.num(vn.nach)} a month, more than twice the spring level. No other model with its own page shows so clearly how the grant moves demand for cheap electric cars. The peak in ${monatsName(sp.monat, 'en')} probably also includes orders that buyers had held back until the grant was clear.</p>
<h2>The T03 next to other small cars</h2>
${h.table(['Model', 'List price', 'Battery', 'Range', `net to ${h.eur(s1)}, 2 children`, 'Euros per km after grant'], klein.map((x) => [`${x.marke} ${x.name}`, h.eur(preis(x)), x.batterie ? `${h.num(x.batterie, 1)} kWh` : 'n/a', x.reichweite ? `${h.num(x.reichweite)} km` : 'n/a', h.eur(netto(x, s1, 2)), x.reichweite ? h.eur(netto(x, s1, 2) / x.reichweite) : 'n/a']), 'Small cars up to about 26,000 euros, manufacturer figures read on 19 October 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Only the Dacia Spring is cheaper, but with less range. On price per kilometre of range, the T03 leads. The Hyundai Inster and Fiat 500e are larger and dearer; the Inster offers more range, the 500e less. The last column is a rough aid, not a verdict: interior space, charging power and equipment matter more to many buyers.</p>
<h2>Battery and daily use</h2>
<p>The T03 has a ${h.num(m.batterie as number, 1)} kWh battery with lithium iron phosphate cells, LFP for short. This chemistry is considered robust and tolerates frequent full charging better than others, but it is a little heavier for the same capacity. The range of up to ${h.num(m.reichweite as number)} km WLTP is fine for town, commuting and shopping; in winter and on the motorway it drops noticeably. The T03 is less suited to long journeys. Used as a second car alongside an older combustion car, the range is usually no problem. None of this matters for the grant: there is no minimum range for battery electric cars.</p>
<h2>Worked example over three years</h2>
<p>A household with no child in the first band pays ${h.eur(netto(m, s1, 0))} after the grant. Vehicle tax is waived until ${h.date(steuer.bis as string)} for a first registration in November 2026. With the GHG quota payment of at least ${h.eur(P.thg.markt_ohne_bonus_ab_eur)} a year at October market prices, about ${h.eur(thg3)} comes back over the three-year holding period. On paper that leaves ${h.eur(netto(m, s1, 0) - thg3)} for the car; for the slightly cheaper ${spring.marke} ${spring.name} it would be ${h.eur(netto(spring, s1, 0) - thg3)}. Electricity, insurance and servicing come on top, as does depreciation, which nobody can predict reliably. How the GHG payment works is under ${h.a('thg-praemie', 'GHG quota payment')}.</p>
<h2>Leapmotor in the statistics</h2>
${h.table(['Model', 'Approvals', 'Share of brand'], MARKE.map(([n, x]) => [`Leapmotor ${n}`, h.num(x), h.pct(x / markeGesamt)]), `Leapmotor: approvals by model as of ${h.date(MODELLE.bafa_stand)}`, ['l', 'r', 'r'])}
<p>With ${h.num(markeGesamt)} approvals in total, Leapmotor ranks fourth among brands although it is new to Germany. Most of these are for the T03. The B10 is a compact SUV from ${h.eur(preis(modell('leapmotor-b10')))}, the C10 a larger SUV also available with a range extender; BAFA counts that version as a plug-in hybrid.</p>
<h2>What to settle before buying</h2>
<ul>
<li>The final price including delivery: with a list price under ${h.eur(20000)}, it weighs more heavily than on a large car.</li>
<li>Whether the dealer has already registered the car: a pre-registration does not qualify, however tempting the price.</li>
<li>Your tax assessments: ${h.src('bafaHaushalt', 'BAFA explains')} which assessments count for the household. On low incomes they are often missing; see ${h.a('haushaltseinkommen', 'household income')}.</li>
<li>The holding period of ${h.num(F.haltedauer_monate)} months: if you see the car as a stopgap, factor that in.</li>
<li>When to apply: it is possible up to ${h.num(F.antragsfrist_monate)} months after registration. Still apply soon, because processing takes a few weeks and only then is the money paid.</li>
</ul>`,
  },
});
