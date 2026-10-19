import { defineGuide } from '../../lib/guide-types';
import { modell, preis, netto, quote, rang, nettoTabelle, monatsTabelle, vorNach, spitze, mitPreis, MODELLE } from '../../lib/modell-seite';
import { betragTabelle } from '../../lib/engine/foerderung';
import { datumText, monatsName } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Dacia Spring: Neuer Spring Expression, 60 kW, 17 900 € UPE zzgl. Überführung, WLTP 246 km (dacia.de, gelesen 19.10.2026).
 * Das bisherige Modell steht dort weiter als „Spring Extreme Electric 100“ für 19 700 €. Batteriegröße auf der Seite nicht
 * angegeben. Bewilligungen der Marke Dacia laut BAFA-Statistik vom 1.10.2026: 2 403 (research/fakten.md, Abschnitt 2).
 */
const F = P.foerderung;
const m = modell('dacia-spring');
const lp = preis(m);
/** Bisheriger Spring laut dacia.de, gelesen 19.10.2026. */
const ALT = 19700;
/** BAFA, Bewilligungen der Marke Dacia, Stand 1.10.2026. */
const DACIA = 2403;
const s1 = F.grenzen[0], s2 = F.grenzen[1], s3 = F.grenzen[2];
const vn = vorNach(m);
const sp = spitze(m);
const max = betragTabelle(s1, 2, 'bev');
const zweitguenstig = mitPreis()[1];
const anteile = mitPreis().map((x) => ({ x, a: max / preis(x) })).sort((a, b) => b.a - a.a);
const monate = F.haltedauer_monate;
const thg3 = P.thg.markt_ohne_bonus_ab_eur * 3;

export default defineGuide({
  id: 'dacia-spring',
  group: 'modelle',
  order: 50,
  tool: 'praemie',
  toolPreset: { modell: 'dacia-spring' },
  related: ['foerderfaehige-modelle', 'leapmotor-t03', 'neuwagen', 'haushaltseinkommen', 'thg-praemie'],
  sources: ['bafaStatistik', 'kba', 'richtlinie', 'bafaVoraussetzungen'],
  de: {
    slug: 'dacia-spring-foerderung',
    nav: 'Dacia Spring',
    card: 'Der Dacia Spring nach der E-Auto-Förderung: das günstigste Elektroauto der Liste, der größte Anteil der Förderung am Preis.',
    title: `Dacia Spring Förderung 2026: ab ${DE.eur(netto(m, s1, 2))} nach der Prämie`,
    description: `Dacia Spring Förderung 2026: ${DE.eur(lp)} Listenpreis, nach der E-Auto-Förderung ${DE.eur(netto(m, s1, 2))} bis ${DE.eur(netto(m, s3, 0))}. Das günstigste Elektroauto der Liste, Rechnung je Haushalt.`,
    h1: 'Dacia Spring: Preis nach der E-Auto-Förderung 2026',
    intro: 'Der Rechner ist auf den Dacia Spring eingestellt. Einkommen und Kinder eingeben, und er zeigt, was vom Preis des Spring nach der Förderung bleibt.',
    resume: `Der Dacia Spring ist das günstigste Elektroauto in der Liste dieser Seite. Der neue ${m.version?.de} kostet laut Dacia ${DE.eur(lp)} plus Überführung und fährt bis zu ${DE.num(m.reichweite as number)} km nach WLTP. Mit der E-Auto-Förderung bleiben einem Haushalt mit höchstens ${DE.eur(s1)} zu versteuerndem Einkommen ohne Kind ${DE.eur(netto(m, s1, 0))}, mit zwei Kindern ${DE.eur(netto(m, s1, 2))}. In der dritten Stufe bis ${DE.eur(s3)} sind es ohne Kind ${DE.eur(netto(m, s3, 0))}. Mit dem Höchstbetrag von ${DE.eur(max)} deckt die Förderung ${DE.pct(max / lp)} des Listenpreises, mehr als bei jedem anderen Modell. Das BAFA hat bis zum ${datumText(MODELLE.bafa_stand, 'de')} ${DE.num(m.bafa)} Spring gefördert, fast jede Bewilligung der Marke Dacia. Die Zulassungen sind seit dem Start der Anträge stark gestiegen: Von Januar bis April kamen im Schnitt ${DE.num(vn.vor)} neue Spring im Monat auf die Straße, von Juni bis September ${DE.num(vn.nach)}, mehr als viermal so viele.`,
    faqs: [
      { q: 'Was kostet der Dacia Spring nach der E-Auto-Förderung?', a: `Zwischen ${DE.eur(netto(m, s1, 2))} und ${DE.eur(netto(m, s3, 0))}, ausgehend vom Listenpreis von ${DE.eur(lp)} für den ${m.version?.de}. Den niedrigsten Preis zahlt ein Haushalt mit zwei förderrelevanten Kindern und höchstens ${DE.eur(s1)} zu versteuerndem Einkommen. Die Überführung kommt hinzu. Über der Einkommensgrenze für Ihre Kinderzahl gibt es keine Förderung.` },
      { q: 'Wird auch der ältere Dacia Spring Extreme gefördert?', a: `Ja, wenn er neu ist und erstmals auf Sie in Deutschland zugelassen wird. Dacia führt ihn neben dem neuen Spring weiter, für ${DE.eur(ALT)}. Die Förderung ist für beide gleich hoch. Weil der neue Spring günstiger ist, kostet der ältere nach der Förderung ${DE.eur(ALT - lp)} mehr. Ein Lagerfahrzeug mit Tageszulassung ist dagegen nicht förderfähig.` },
      { q: 'Lohnt sich ein neuer Spring mit Förderung mehr als ein gebrauchtes Elektroauto?', a: `Das hängt vom Gebrauchtwagen ab, aber die Förderung verschiebt die Rechnung. Gebrauchte Elektroautos werden nicht gefördert. Ein neuer Spring kostet in der ersten Stufe ohne Kind ${DE.eur(netto(m, s1, 0))}, mit voller Garantie und unbenutzter Batterie. Ein gebrauchtes, größeres Elektroauto kann trotzdem die bessere Wahl sein, wenn Sie mehr Platz oder Reichweite brauchen.` },
      { q: 'Warum sind die Zulassungen des Dacia Spring 2026 so stark gestiegen?', a: `Die Statistik zeigt den Anstieg, nicht seine Ursache. Zwei Dinge fallen zeitlich zusammen: der Start der Anträge auf die E-Auto-Förderung im Mai und der neue, günstigere Spring. Im Juni kamen ${DE.num(m.kba[5])} Spring auf die Straße, im Mai ${DE.num(m.kba[4])}. Bei einem so günstigen Auto wirkt ein fester Förderbetrag besonders stark auf den Preis.` },
      { q: 'Muss ich für die Förderung meinen alten Wagen verschrotten lassen?', a: 'Nein. Unter den Bedingungen des BAFA findet sich keine Pflicht, ein altes Auto abzugeben, zu verschrotten oder abzumelden. Sie können Ihren bisherigen Wagen verkaufen, behalten oder weitergeben. Gefördert wird allein der Kauf oder das private Leasing des neuen Elektroautos, wenn Haushalt und Fahrzeug die Bedingungen erfüllen. Eine Abwrackprämie wie im Jahr 2009 ist das Programm nicht.' },
    ],
    body: (h) => `
<h2>Der Spring nach der Förderung</h2>
<p>Die Tabelle zieht jeden Förderbetrag vom Listenpreis des ${m.version?.de} ab, ${h.eur(lp)}. Die Überführung ist darin nicht enthalten; bei einem Auto dieser Preisklasse macht sie einen spürbaren Anteil aus. Für die eigene Rechnung nehmen Sie den Endpreis aus dem Angebot.</p>
${nettoTabelle(h, m)}
<p>Kein anderes Auto in der Liste kommt nach der Förderung so weit nach unten. Zum Vergleich: Der zweitgünstigste Wagen, der ${zweitguenstig.marke} ${zweitguenstig.name}, kostet in der ersten Stufe ohne Kind ${h.eur(netto(zweitguenstig, s1, 0))}, der Spring ${h.eur(netto(m, s1, 0))}. Eine Studentin mit ${h.eur(9000)} zu versteuerndem Einkommen zahlt ${h.eur(netto(m, 9000, 0))}; ein Paar mit zwei Kindern und ${h.eur(56000)} zahlt ${h.eur(netto(m, 56000, 2))}.</p>
<h2>Der größte Anteil der Förderung am Preis</h2>
<p>Weil der Förderbetrag fest ist, wirkt er umso stärker, je günstiger das Auto ist. Mit dem Höchstbetrag von ${h.eur(max)} sieht die Rangfolge so aus:</p>
${h.table(['Modell', 'Listenpreis', `Anteil von ${h.eur(max)}`], anteile.slice(0, 6).map(({ x, a }) => [`${x.marke} ${x.name}`, h.eur(preis(x)), h.pct(a)]), 'Anteil des Höchstbetrags am Listenpreis, die sechs günstigsten Modelle', ['l', 'r', 'r'])}
<p>Beim Spring trägt der Staat bis zu einem Drittel des Listenpreises. Selbst mit dem kleinsten Betrag von ${h.eur(betragTabelle(s3, 0, 'bev'))} ist es noch ${h.pct(betragTabelle(s3, 0, 'bev') / lp)}. Bei einem Elektroauto für ${h.eur(50000)} wären es selbst mit dem Höchstbetrag nur ${h.pct(max / 50000, 0)}.</p>
<h2>Neuer und alter Spring</h2>
<p>Dacia verkauft zwei Spring nebeneinander. Der neue ${m.version?.de} kostet ${h.eur(lp)}, der bisherige Spring Extreme Electric 100 ${h.eur(ALT)}. Der neue ist also das günstigere Modell und der Einstieg in die Baureihe. Für die Förderung gibt es keinen Unterschied: Beide sind reine Elektroautos der Klasse M1 und bekommen denselben Betrag. Wer einen älteren Spring vom Lager angeboten bekommt, sollte prüfen, ob er schon zugelassen war; dann fällt die Förderung weg, so günstig das Angebot sein mag. Die ${h.src('bafaVoraussetzungen', 'Bedingungen des BAFA')} schließen Tageszulassungen, Vorführwagen und Werkszulassungen ausdrücklich aus. Mehr dazu unter ${h.a('neuwagen', 'Neuwagen und Tageszulassung')}.</p>
<h2>Zulassungen je Monat</h2>
${monatsTabelle(h, m)}
<p>Im Januar und Februar kamen jeweils nur gut hundert neue Spring auf die Straße. Ab Juni sprangen die Zahlen nach oben, im ${monatsName(sp.monat, 'de')} waren es ${h.num(sp.wert)}, so viele wie nie zuvor in diesem Jahr. Im Schnitt von Juni bis September waren es das ${h.num(vn.nach / vn.vor, 1)}-Fache der ersten vier Monate. Wie viel davon auf die Förderung und wie viel auf den neuen Spring entfällt, lässt sich aus den Zahlen nicht trennen. Fest steht: ${h.num(m.bafa)} der ${h.num(m.kba_summe)} Spring des Jahres sind bereits gefördert, ${h.pct(quote(m))}, und weil Anträge mit Verzug bearbeitet werden, wird der Anteil noch steigen.</p>
<h2>Dacia in der Statistik</h2>
<p>Die Marke Dacia hat bis Oktober ${h.num(DACIA)} Bewilligungen, davon ${h.num(m.bafa)} für den Spring. Auf alle anderen Modelle der Marke zusammen entfällt nur ${h.num(DACIA - m.bafa)} Bewilligung. Unter allen Modellen steht der Spring nach der Zahl der Bewilligungen auf Platz ${h.num(rang(m))}. Vor ihm liegen Modelle, die insgesamt deutlich häufiger zugelassen werden, darunter auch zwei Kleinwagen: der Leapmotor T03 und der Hyundai Inster.</p>
<h2>Was der Spring über die Haltedauer kostet</h2>
<p>Wer gefördert kauft, muss den Spring ${h.num(monate)} Monate behalten. Teilt man den Preis nach der Förderung durch diese Monate, ergibt sich ein grober Richtwert dafür, was das Auto im Monat bindet: in der ersten Stufe ohne Kind ${h.eur(netto(m, s1, 0) / monate)}, mit zwei Kindern ${h.eur(netto(m, s1, 2) / monate)}. Das ist kein Wertverlust, denn das Auto hat nach drei Jahren noch einen Restwert. Dagegen stehen die ${h.a('thg-praemie', 'THG-Prämie')}, nach dem Marktstand vom Oktober über ${h.eur(P.thg.markt_ohne_bonus_ab_eur)} im Jahr, und die Befreiung von der ${h.a('kfz-steuer', 'Kfz-Steuer')}. Bei einem so günstigen Auto decken drei Jahre THG-Prämie mit mindestens ${h.eur(thg3)} rund ${h.pct(thg3 / netto(m, s1, 0), 0)} des Preises nach Förderung.</p>
<h2>Der Spring statt eines alten Kleinwagens</h2>
<p>Viele Käufer ersetzen mit dem Spring einen älteren Benziner. Abgeben müssen sie ihn für die Förderung nicht; wer ihn verkauft, kann den Erlös zusätzlich gegen den Preis rechnen. Im Alltag ändern sich drei Posten. Die Kfz-Steuer des alten Wagens entfällt, weil der Spring als reines Elektroauto befreit ist. Statt Benzin zahlen Sie Strom, zu Hause meist deutlich günstiger je Kilometer. Und die Wartung ist einfacher, weil Ölwechsel, Auspuff und Kupplung wegfallen. Wie viel das im Jahr ausmacht, hängt von Ihrer Strecke und Ihrem Stromtarif ab; eine pauschale Zahl wäre hier unseriös.</p>
<h2>Reichweite und Einsatz</h2>
<p>Mit bis zu ${h.num(m.reichweite as number)} km nach WLTP ist der Spring ein Auto für kurze und mittlere Strecken. Für die tägliche Fahrt zur Arbeit, Einkäufe und Wege in der Stadt reicht das, im Winter und bei höherem Tempo kommt man weniger weit. Wer regelmäßig lange Strecken fährt, ist mit einem größeren Auto besser bedient, auch wenn es nach der Förderung mehr kostet. Für die Förderung spielt die Reichweite keine Rolle, eine Mindestreichweite gibt es nur für Plug-in-Hybride.</p>
<h2>Vor dem Kauf</h2>
<ul>
<li>Lassen Sie sich den Endpreis mit Überführung schriftlich nennen und rechnen Sie damit, nicht mit dem Listenpreis.</li>
<li>Prüfen Sie Ihr zu versteuerndes Einkommen in den beiden letzten Steuerbescheiden. Wer keine hat, etwa im Studium, kann eine Steuererklärung freiwillig abgeben; mehr unter ${h.a('haushaltseinkommen', 'Haushaltseinkommen')}.</li>
<li>Der Spring muss auf die Person zugelassen werden, die den Antrag stellt, und diese muss mindestens ${h.num(F.mindestalter)} Jahre alt sein.</li>
<li>Den Antrag stellen Sie nach der Zulassung, spätestens nach ${h.num(F.antragsfrist_monate)} Monaten.</li>
</ul>`,
  },
  en: {
    slug: 'dacia-spring-grant',
    nav: 'Dacia Spring',
    card: 'The Dacia Spring after the German EV grant: the cheapest electric car on the list, with the largest share of the price covered.',
    title: `Dacia Spring EV grant 2026: from ${EN.eur(netto(m, s1, 2))} after the grant`,
    description: `Dacia Spring EV grant 2026: ${EN.eur(lp)} list price, ${EN.eur(netto(m, s1, 2))} to ${EN.eur(netto(m, s3, 0))} after the German EV grant. The cheapest electric car on the list, worked out per household.`,
    h1: 'Dacia Spring: price after the 2026 EV grant',
    intro: 'The calculator is set to the Dacia Spring. Enter income and children and it shows what is left of the Spring’s price after the grant.',
    resume: `The Dacia Spring is the cheapest electric car on this site’s list. The new ${m.version?.en} costs ${EN.eur(lp)} plus delivery according to Dacia and covers up to ${EN.num(m.reichweite as number)} km WLTP. With the German EV grant, a household with taxable income of at most ${EN.eur(s1)} and no child pays ${EN.eur(netto(m, s1, 0))}, with two children ${EN.eur(netto(m, s1, 2))}. In the third band up to ${EN.eur(s3)} it is ${EN.eur(netto(m, s3, 0))} without children. With the maximum of ${EN.eur(max)}, the grant covers ${EN.pct(max / lp)} of the list price, more than for any other model. BAFA had funded ${EN.num(m.bafa)} Springs by ${datumText(MODELLE.bafa_stand, 'en')}, almost every approval for the Dacia brand. Registrations have risen sharply since applications opened: from January to April an average of ${EN.num(vn.vor)} new Springs a month took to the road, from June to September ${EN.num(vn.nach)}, more than four times as many.`,
    faqs: [
      { q: 'What does the Dacia Spring cost after the EV grant?', a: `Between ${EN.eur(netto(m, s1, 2))} and ${EN.eur(netto(m, s3, 0))}, starting from the ${EN.eur(lp)} list price for the ${m.version?.en}. The lowest price applies to a household with two qualifying children and taxable income of at most ${EN.eur(s1)}. Delivery comes on top. Above the income limit for your number of children there is no grant.` },
      { q: 'Does the older Dacia Spring Extreme qualify too?', a: `Yes, if it is new and first registered in your name in Germany. Dacia still sells it alongside the new Spring, for ${EN.eur(ALT)}. The grant is the same for both. Because the new Spring is cheaper, the older one costs ${EN.eur(ALT - lp)} more after the grant. A stock car with a pre-registration, however, does not qualify.` },
      { q: 'Is a new Spring with the grant better value than a used electric car?', a: `It depends on the used car, but the grant shifts the sums. Used electric cars are not funded. A new Spring costs ${EN.eur(netto(m, s1, 0))} in the first band without children, with a full warranty and an unused battery. A larger used electric car may still be the better choice if you need more space or range.` },
      { q: 'Why did Dacia Spring registrations rise so much in 2026?', a: `The statistics show the rise, not its cause. Two things coincide: applications for the EV grant opening in May and the new, cheaper Spring. In June ${EN.num(m.kba[5])} Springs were registered, in May ${EN.num(m.kba[4])}. On such a cheap car, a fixed grant amount has a particularly strong effect on the price.` },
      { q: 'Do I have to scrap my old car to get the grant?', a: 'No. BAFA’s conditions contain no obligation to hand in, scrap or deregister an old car. You can sell your previous car, keep it or pass it on. The grant is solely for buying or privately leasing the new electric car, provided household and vehicle meet the conditions. The programme is not a scrappage bonus like the one in 2009.' },
    ],
    body: (h) => `
<h2>The Spring after the grant</h2>
<p>The table deducts each grant amount from the list price of the ${m.version?.en}, ${h.eur(lp)}. Delivery is not included; on a car in this price range it is a noticeable share. For your own sums, use the final price from the quote.</p>
${nettoTabelle(h, m)}
<p>No other car on the list comes down so far after the grant. For comparison, the second-cheapest car, the ${zweitguenstig.marke} ${zweitguenstig.name}, costs ${h.eur(netto(zweitguenstig, s1, 0))} in the first band without children, the Spring ${h.eur(netto(m, s1, 0))}. A student with taxable income of ${h.eur(9000)} pays ${h.eur(netto(m, 9000, 0))}; a couple with two children on ${h.eur(56000)} pays ${h.eur(netto(m, 56000, 2))}.</p>
<h2>The largest share of the price</h2>
<p>Because the grant is a fixed amount, it has more effect the cheaper the car. With the maximum of ${h.eur(max)}, the ranking looks like this:</p>
${h.table(['Model', 'List price', `Share of ${h.eur(max)}`], anteile.slice(0, 6).map(({ x, a }) => [`${x.marke} ${x.name}`, h.eur(preis(x)), h.pct(a)]), 'Maximum grant as a share of list price, the six cheapest models', ['l', 'r', 'r'])}
<p>On the Spring the state pays up to a third of the list price. Even with the smallest amount, ${h.eur(betragTabelle(s3, 0, 'bev'))}, it is still ${h.pct(betragTabelle(s3, 0, 'bev') / lp)}. On an electric car costing ${h.eur(50000)}, even the maximum would be only ${h.pct(max / 50000, 0)}.</p>
<h2>New and old Spring</h2>
<p>Dacia sells two Springs side by side. The new ${m.version?.en} costs ${h.eur(lp)}, the previous Spring Extreme Electric 100 ${h.eur(ALT)}. So the new one is the cheaper model and the entry to the range. For the grant there is no difference: both are battery electric M1 cars and receive the same amount. If you are offered an older Spring from stock, check whether it has already been registered; if so, the grant is lost, however cheap the offer. ${h.src('bafaVoraussetzungen', 'BAFA’s conditions')} expressly exclude pre-registrations, demonstrators and factory registrations. More under ${h.a('neuwagen', 'new cars and pre-registration')}.</p>
<h2>Registrations by month</h2>
${monatsTabelle(h, m)}
<p>In January and February only just over a hundred new Springs a month were registered. From June the figures jumped; in ${monatsName(sp.monat, 'en')} there were ${h.num(sp.wert)}, more than in any earlier month this year. Averaged over June to September, it was ${h.num(vn.nach / vn.vor, 1)} times the first four months. How much of that is due to the grant and how much to the new Spring cannot be separated from the figures. What is certain: ${h.num(m.bafa)} of the year’s ${h.num(m.kba_summe)} Springs have already been funded, ${h.pct(quote(m))}, and because applications are processed with a delay, the share will rise further.</p>
<h2>Dacia in the statistics</h2>
<p>The Dacia brand had ${h.num(DACIA)} approvals by October, ${h.num(m.bafa)} of them for the Spring. All the brand’s other models together account for just ${h.num(DACIA - m.bafa)} approval. Among all models, the Spring ranks ${h.num(rang(m))}th by number of approvals. Ahead of it are models registered far more often overall, including two small cars: the Leapmotor T03 and the Hyundai Inster.</p>
<h2>What the Spring costs over the holding period</h2>
<p>If you buy with the grant, you must keep the Spring for ${h.num(monate)} months. Dividing the price after the grant by those months gives a rough guide to how much the car ties up each month: ${h.eur(netto(m, s1, 0) / monate)} in the first band without children, ${h.eur(netto(m, s1, 2) / monate)} with two children. That is not depreciation, since the car still has a residual value after three years. Against it stand the ${h.a('thg-praemie', 'GHG quota payment')}, over ${h.eur(P.thg.markt_ohne_bonus_ab_eur)} a year at October market prices, and the exemption from ${h.a('kfz-steuer', 'vehicle tax')}. On such a cheap car, three years of GHG payments of at least ${h.eur(thg3)} cover about ${h.pct(thg3 / netto(m, s1, 0), 0)} of the price after the grant.</p>
<h2>The Spring instead of an old small car</h2>
<p>Many buyers use the Spring to replace an older petrol car. They do not have to give it up for the grant; if they sell it, the proceeds can be set against the price as well. Three items change in daily life. The old car’s vehicle tax disappears, because the Spring as a battery electric car is exempt. Instead of petrol you pay for electricity, usually much cheaper per kilometre at home. And servicing is simpler, since oil changes, exhaust and clutch fall away. How much that adds up to in a year depends on your mileage and electricity tariff; a blanket figure would be misleading here.</p>
<h2>Range and use</h2>
<p>With up to ${h.num(m.reichweite as number)} km WLTP, the Spring is a car for short and medium distances. It is enough for the daily commute, shopping and trips around town; in winter and at higher speeds it goes less far. If you regularly drive long distances, a larger car will serve you better, even if it costs more after the grant. Range plays no part in the grant.</p>
<h2>Before buying</h2>
<ul>
<li>Ask for the final price including delivery and work from that.</li>
<li>Check your taxable income in your last two tax assessments. If you have none, for example as a student, you can file a tax return voluntarily; more under ${h.a('haushaltseinkommen', 'household income')}.</li>
<li>The Spring must be registered to the person who applies, who must be at least ${h.num(F.mindestalter)} years old.</li>
<li>Apply after registration, at the latest after ${h.num(F.antragsfrist_monate)} months.</li>
</ul>`,
  },
});
