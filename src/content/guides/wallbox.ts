import { defineGuide } from '../../lib/guide-types';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Wallbox-Förderung 2026: keine Bundesförderung für das Einfamilienhaus (KfW 442 beendet), aber das BMV-Programm
 * „Ladeinfrastruktur in und an Mehrparteienhäusern“ (Richtlinie 16.3.2026). Beispiele mit derselben Regel wie der
 * Mini kWeg: Mindestzahl = max(Mindeststellplätze, Anteil × Stellplätze), Höchstbetrag je Stellplatz nach Ausbau.
 */
const W = P.wallbox;
const mindest = (s: number) => Math.max(W.mph_min_stellplaetze, Math.ceil(s * W.mph_min_anteil_stellplaetze));
const stufen = [W.mph_je_stellplatz_vorverkabelt, W.mph_je_stellplatz_mit_ladepunkt, W.mph_je_stellplatz_bidirektional];
const bsp = [12, 24, 40, 80];
const d = (iso: string, l: 'de' | 'en') => datumText(iso, l);

export default defineGuide({
  id: 'wallbox',
  group: 'kosten',
  order: 40,
  mini: 'kWeg',
  related: ['thg-praemie', 'kfz-steuer', 'kumulierung', 'thg-quote'],
  sources: ['bmvMph', 'mphAufruf', 'kfw442'],
  de: {
    slug: 'wallbox-foerderung',
    nav: 'Wallbox-Förderung',
    card: 'Was es 2026 für das Laden zu Hause gibt: nichts vom Bund fürs Einfamilienhaus, ein Programm fürs Mehrfamilienhaus.',
    title: 'Wallbox-Förderung 2026: was Bund und KfW noch zahlen',
    description: `Wallbox-Förderung 2026: keine Bundesförderung fürs Einfamilienhaus, KfW 442 beendet; Mehrfamilienhäuser bekommen bis ${DE.eur(W.mph_je_stellplatz_bidirektional)} je Stellplatz, Antrag bis November.`,
    h1: 'Wallbox-Förderung 2026: was es noch gibt',
    intro: 'Für die Wallbox am Einfamilienhaus zahlt der Bund 2026 nichts. Für Eigentümergemeinschaften und Vermieter von Mehrfamilienhäusern gibt es dagegen ein neues Programm mit klaren Regeln.',
    resume: `Eine eigene Wallbox am Einfamilienhaus fördert der Bund 2026 nicht. Das KfW-Programm 442 „Solarstrom für Elektroautos“ kann nicht mehr beantragt werden, und das frühere Programm 440 für private Ladestationen gibt es nicht mehr. Gefördert wird dagegen das Laden in Mehrparteienhäusern: Nach der Richtlinie des Bundesverkehrsministeriums vom ${d(W.mph_richtlinie, 'de')} stehen ${DE.num(W.mph_budget_mio)} Millionen Euro bereit. Antragsberechtigt sind Wohnungseigentümergemeinschaften, kleine und mittlere Unternehmen und private Vermieter, wenn das Gebäude mindestens ${W.mph_min_wohneinheiten} Wohneinheiten hat. Mindestens ${DE.pct(W.mph_min_anteil_stellplaetze, 0)} der Stellplätze, wenigstens aber ${W.mph_min_stellplaetze}, müssen vorverkabelt werden, mit Ladeleistungen von ${W.mph_kw_min} bis ${W.mph_kw_max} kW. Je Stellplatz gibt es höchstens ${DE.eur(W.mph_je_stellplatz_vorverkabelt)} für die Vorverkabelung, ${DE.eur(W.mph_je_stellplatz_mit_ladepunkt)} mit Ladepunkt und ${DE.eur(W.mph_je_stellplatz_bidirektional)} für bidirektionales Laden. Anträge laufen vom ${d(W.mph_antrag_von, 'de')} bis zum ${d(W.mph_antrag_bis, 'de')}. Mieterinnen und Mieter können nicht selbst beantragen.`,
    faqs: [
      { q: 'Gibt es 2026 eine KfW-Förderung für die Wallbox am Einfamilienhaus?', a: 'Nein. Die KfW führt das Programm 442 für Solarstrom und Ladestation als beendet, und für das frühere Programm 440 gibt es keine neue Ausschreibung. Für eine Wallbox am eigenen Haus bietet der Bund 2026 keinen Zuschuss. Manche Länder, Städte oder Stadtwerke haben eigene Programme; ob und in welcher Höhe, steht nur auf deren Seiten und ändert sich oft kurzfristig.' },
      { q: 'Wer kann die Förderung für Ladepunkte im Mehrfamilienhaus beantragen?', a: `Wohnungseigentümergemeinschaften, kleine und mittlere Unternehmen sowie private Vermieter, die Eigentümer des Gebäudes sind. Das Haus braucht mindestens ${P.wallbox.mph_min_wohneinheiten} Wohneinheiten. Große Unternehmen konnten nur bis zum ${d(P.wallbox.mph_grossunternehmen_bis, 'de')} in einem Wettbewerbsverfahren einreichen. Wer zur Miete wohnt, kann den Antrag nicht selbst stellen, sondern muss den Vermieter dafür gewinnen.` },
      { q: 'Warum ist mein Neubau von der Ladepunkt-Förderung ausgeschlossen?', a: `Wurde der Bauantrag nach dem ${d(P.wallbox.mph_bauantrag_nach, 'de')} gestellt, verlangt das Gebäude-Elektromobilitätsinfrastruktur-Gesetz die Vorverkabelung ohnehin. Was ein Gesetz schon vorschreibt, fördert der Bund nicht zusätzlich. Der Ausschluss betrifft also jüngere Gebäude; bei älteren Häusern, die nachgerüstet werden, gilt er nicht.` },
      { q: 'Wie lange muss die geförderte Ladeinfrastruktur betrieben werden?', a: `Die Förderung ist an eine Zweckbindung von ${P.wallbox.mph_zweckbindung_jahre} Jahren gebunden. In dieser Zeit muss die Infrastruktur für den geförderten Zweck bereitstehen. Wer sie früher abbaut oder anders nutzt, riskiert eine Rückforderung. Das gilt für die Gemeinschaft oder den Vermieter, der den Antrag gestellt hat, nicht für die einzelnen Nutzer der Stellplätze.` },
      { q: 'Darf ich als Wohnungseigentümer eine Wallbox verlangen?', a: 'Ja. Seit der Reform des Wohnungseigentumsrechts 2020 kann jeder Eigentümer nach § 20 Abs. 2 WEG verlangen, dass ihm der Einbau einer Lademöglichkeit gestattet wird; Mieter haben nach § 554 BGB einen ähnlichen Anspruch gegen den Vermieter. Die Kosten trägt in der Regel, wer verlangt. Die Förderung für Mehrparteienhäuser setzt dagegen einen gemeinsamen Beschluss voraus.' },
    ],
    body: (h) => `
<h2>Einfamilienhaus: kein Zuschuss vom Bund</h2>
<p>Viele Seiten nennen noch Beträge für die private Wallbox, die aus früheren Jahren stammen. Für 2026 gilt: Die ${h.src('kfw442', 'KfW führt das Programm 442')} als beendet, ein Antrag ist nicht mehr möglich. Das ältere Programm 440 für Ladestationen an Wohngebäuden läuft ebenfalls nicht mehr. Die Kaufförderung für Elektroautos enthält keinen Zuschuss für die Ladestation. Wer im eigenen Haus eine Wallbox einbauen lässt, trägt die Kosten also selbst, sofern nicht ein Land, eine Kommune oder ein Energieversorger ein eigenes Programm anbietet. Solche Programme sind klein, oft schnell ausgeschöpft und an Bedingungen wie Ökostrom oder eine Photovoltaikanlage geknüpft. Prüfen Sie die Seite Ihrer Stadt und Ihres Stadtwerks; Beträge nennt diese Seite nur, wenn eine amtliche Quelle sie bestätigt.</p>
<h2>Mehrparteienhaus: das Programm von 2026</h2>
<p>Das ${h.src('bmvMph', 'Bundesverkehrsministerium')} fördert seit April 2026 Ladeinfrastruktur in und an Gebäuden mit mehreren Wohnungen. Die Grundlage ist eine Richtlinie vom ${h.date(h.P.wallbox.mph_richtlinie)}, der ${h.src('mphAufruf', 'Förderaufruf für Eigentümergemeinschaften')} beschreibt die Einzelheiten. Das Budget beträgt ${h.num(h.P.wallbox.mph_budget_mio)} Millionen Euro. Abgewickelt wird über ein eigenes Portal mit einem Projektträger; das BAFA ist nicht beteiligt.</p>
${h.table(['Bedingung', 'Wert'], [
  ['Gebäude', `mindestens ${h.P.wallbox.mph_min_wohneinheiten} Wohneinheiten`],
  ['Vorverkabelung', `mindestens ${h.pct(h.P.wallbox.mph_min_anteil_stellplaetze, 0)} der Stellplätze, wenigstens ${h.P.wallbox.mph_min_stellplaetze}`],
  ['Ladeleistung', `${h.P.wallbox.mph_kw_min} bis ${h.P.wallbox.mph_kw_max} kW`],
  ['Höchstens je Stellplatz, nur Vorverkabelung', h.eur(h.P.wallbox.mph_je_stellplatz_vorverkabelt)],
  ['Höchstens je Stellplatz, mit Ladepunkt', h.eur(h.P.wallbox.mph_je_stellplatz_mit_ladepunkt)],
  ['Höchstens je Stellplatz, bidirektional', h.eur(h.P.wallbox.mph_je_stellplatz_bidirektional)],
  ['Antragszeitraum', `${h.date(h.P.wallbox.mph_antrag_von)} bis ${h.date(h.P.wallbox.mph_antrag_bis)}`],
  ['Zweckbindung', `${h.P.wallbox.mph_zweckbindung_jahre} Jahre`],
  ['Ausgeschlossen', `Bauantrag nach dem ${h.date(h.P.wallbox.mph_bauantrag_nach)}`],
], 'Förderung von Ladeinfrastruktur in Mehrparteienhäusern, Richtlinie 2026', ['l', 'l'])}
<h2>Rechenbeispiele für Eigentümergemeinschaften</h2>
<p>Die Mindestzahl ergibt sich aus dem Anteil der Stellplätze, aufgerundet, aber nie weniger als ${h.P.wallbox.mph_min_stellplaetze}. Bei kleinen Tiefgaragen greift deshalb die Untergrenze, bei großen der Anteil. Die Tabelle zeigt die Höchstbeträge, wenn genau die Mindestzahl ausgebaut wird; gezahlt wird nie mehr als der förderfähige Anteil der tatsächlichen Kosten.</p>
${h.table(['Stellplätze', 'Mindestens auszubauen', 'Nur Vorverkabelung', 'Mit Ladepunkt', 'Bidirektional'], bsp.map((s) => [h.num(s), h.num(mindest(s)), ...stufen.map((j) => h.eur(mindest(s) * j))]), 'Höchstbeträge bei der Mindestzahl ausgebauter Stellplätze', ['r', 'r', 'r', 'r', 'r'])}
<p>Eine Gemeinschaft mit 24 Stellplätzen muss also mindestens ${h.num(mindest(24))} vorverkabeln, weil ${h.pct(h.P.wallbox.mph_min_anteil_stellplaetze, 0)} von 24 weniger als die Untergrenze ergeben. Baut sie alle 24 Plätze mit Ladepunkt aus, liegt die Obergrenze bei ${h.eur(24 * stufen[1])}. Den Mini-Rechner oben können Sie mit der Zahl Ihrer Stellplätze füllen.</p>
<h2>Der Weg zum Antrag in der Eigentümergemeinschaft</h2>
<ol>
<li>Ein Eigentümer oder die Verwaltung bringt das Thema auf die Tagesordnung der Versammlung.</li>
<li>Ein Elektrobetrieb prüft den Hausanschluss und erstellt ein Angebot für die Vorverkabelung, mit oder ohne Ladepunkte.</li>
<li>Die Versammlung beschließt Maßnahme und Antrag. Ohne Beschluss gibt es keinen Antrag der Gemeinschaft.</li>
<li>Die Verwaltung stellt den Antrag im Portal, vor Beginn der Arbeiten und bis zum ${h.date(h.P.wallbox.mph_antrag_bis)}.</li>
<li>Nach der Bewilligung wird gebaut, danach werden die Kosten nachgewiesen und der Zuschuss ausgezahlt.</li>
</ol>
<h2>11 oder 22 kW, mit oder ohne Rückspeisung</h2>
<p>Das Programm verlangt Ladepunkte mit ${h.P.wallbox.mph_kw_min} bis ${h.P.wallbox.mph_kw_max} kW. Für ein Auto, das über Nacht in der Garage steht, reichen 11 kW fast immer: In acht Stunden kommen so mehr Kilometer zusammen, als die meisten an einem Tag fahren. 22 kW lohnen sich eher, wenn Plätze geteilt werden oder Fahrzeuge tagsüber kurz stehen. Jeder Ladepunkt muss beim Netzbetreiber angemeldet werden, Anlagen über 12 kVA brauchen nach § 19 der Niederspannungsanschlussverordnung zusätzlich dessen Zustimmung. Bidirektional heißt, dass das Auto Strom nicht nur laden, sondern auch zurück ins Haus oder ins Netz abgeben kann. Dafür braucht es ein Fahrzeug, das das unterstützt, und eine passende Ladestation; deshalb liegt der Höchstbetrag hier am höchsten.</p>
<h2>Fehler, die einen Antrag scheitern lassen</h2>
<ul>
<li>Die Arbeiten haben vor der Bewilligung begonnen. Ein vorzeitiger Beginn schließt eine Förderung in der Regel aus.</li>
<li>Es fehlt der Beschluss der Eigentümerversammlung, oder er deckt nur einen Teil der Maßnahme.</li>
<li>Das Haus hat weniger als ${h.P.wallbox.mph_min_wohneinheiten} Wohneinheiten, etwa ein Zweifamilienhaus.</li>
<li>Geplant sind weniger Stellplätze als die Mindestzahl, oder die Ladeleistung liegt unter ${h.P.wallbox.mph_kw_min} kW.</li>
<li>Der Bauantrag des Gebäudes stammt aus der Zeit nach dem ${h.date(h.P.wallbox.mph_bauantrag_nach)}.</li>
<li>Der Antrag geht nach dem ${h.date(h.P.wallbox.mph_antrag_bis)} ein.</li>
</ul>
<h2>Was die Wallbox im Haus ohne Zuschuss kostet</h2>
<p>Ohne Förderung bestimmen drei Posten den Preis: das Gerät, die Leitung vom Zählerschrank zum Stellplatz und mögliche Arbeiten am Zählerschrank selbst. Je weiter der Weg und je älter die Elektrik, desto teurer wird der Einbau. Holen Sie mindestens zwei Angebote von eingetragenen Elektrobetrieben ein und achten Sie darauf, dass die Anmeldung beim Netzbetreiber enthalten ist.</p>
<p>Wer eine Photovoltaikanlage hat oder plant, kann die Wallbox so wählen, dass sie Überschussstrom vom Dach nutzt. Das senkt die Ladekosten, ist aber keine Bedingung für irgendeine der hier genannten Förderungen und auch keine Voraussetzung für die THG-Prämie. Bei einer Mietwohnung ohne eigenen Stellplatz bleibt meist nur das Laden beim Arbeitgeber oder an öffentlichen Säulen.</p>
<h2>Mieter, Vermieter, Eigentümer</h2>
<p>Wer zur Miete wohnt, kann das Programm nicht selbst nutzen. Ein privater Vermieter kann aber beantragen, wenn das Haus die Bedingungen erfüllt, und die Kosten für den Mieter damit senken. Unabhängig von jeder Förderung haben Wohnungseigentümer nach § 20 Abs. 2 WEG und Mieter nach § 554 BGB einen Anspruch darauf, dass ihnen der Einbau einer Lademöglichkeit erlaubt wird; bezahlen müssen sie ihn dann in der Regel selbst. Für ein einzelnes Elektroauto in einer großen Tiefgarage ist der eigene Anspruch oft schneller als ein gemeinsamer Förderantrag, für eine Gemeinschaft, in der mehrere Eigentümer elektrisch fahren wollen, rechnet sich der gemeinsame Ausbau eher.</p>
<h2>Was die Wallbox nicht beeinflusst</h2>
<ul>
<li>Die ${h.a('thg-praemie', 'THG-Prämie')}: Sie gilt pauschal für jedes Elektroauto, ob es zu Hause, beim Arbeitgeber oder an der Säule lädt.</li>
<li>Die Kaufförderung: Sie hängt am Fahrzeug und am Haushaltseinkommen, nicht an einer Lademöglichkeit.</li>
<li>Die ${h.a('kfz-steuer', 'Kfz-Steuer')}: Sie richtet sich allein nach Zulassung und Gewicht.</li>
</ul>
<p>Ob sich ein Elektroauto ohne eigene Wallbox lohnt, hängt vor allem von den Strompreisen ab, zu denen Sie laden können. Wie sich Förderung und andere Prämien kombinieren lassen, zeigt ${h.a('kumulierung', 'Kaufprämie kombinieren')}.</p>`,
  },
  en: {
    slug: 'wallbox-grant',
    nav: 'Wallbox grant',
    card: 'What there is in 2026 for charging at home: nothing federal for a house, a programme for apartment buildings.',
    title: 'Wallbox grant 2026: what federal and KfW funding is left',
    description: `Wallbox grant in Germany 2026: no federal grant for a house, KfW 442 closed; apartment buildings get up to ${EN.eur(W.mph_je_stellplatz_bidirektional)} per parking space if they apply by November.`,
    h1: 'Wallbox grants in 2026: what is still available',
    intro: 'For a wallbox at a detached or terraced house, there is no federal money in 2026. For owners’ associations and landlords of apartment buildings, a new programme with clear rules exists.',
    resume: `There is no federal grant in 2026 for your own wallbox at a house. The KfW programme 442 (Solarstrom für Elektroautos, solar power for electric cars) can no longer be applied for, and the earlier programme 440 for private charging stations no longer exists. What is funded is charging in apartment buildings: under a guideline of the Federal Transport Ministry (BMV) dated ${d(W.mph_richtlinie, 'en')}, ${EN.num(W.mph_budget_mio)} million euros are available. Owners’ associations (Wohnungseigentümergemeinschaft, WEG), small and medium-sized businesses and private landlords can apply if the building has at least ${W.mph_min_wohneinheiten} homes. At least ${EN.pct(W.mph_min_anteil_stellplaetze, 0)} of the parking spaces, and never fewer than ${W.mph_min_stellplaetze}, must be pre-wired for charging at ${W.mph_kw_min} to ${W.mph_kw_max} kW. Per space the cap is ${EN.eur(W.mph_je_stellplatz_vorverkabelt)} for pre-wiring, ${EN.eur(W.mph_je_stellplatz_mit_ladepunkt)} with a charging point and ${EN.eur(W.mph_je_stellplatz_bidirektional)} for bidirectional charging. Applications run from ${d(W.mph_antrag_von, 'en')} to ${d(W.mph_antrag_bis, 'en')}. Tenants cannot apply themselves.`,
    faqs: [
      { q: 'Is there a KfW wallbox grant for a house in 2026?', a: 'No. KfW lists programme 442 for solar power and charging as closed, and there has been no new round of the earlier programme 440. For a wallbox at your own house there is no federal grant in 2026. Some federal states, cities or municipal utilities run their own schemes; whether they exist and how much they pay is only on their own pages and often changes at short notice.' },
      { q: 'Who can apply for charging points in an apartment building?', a: `Owners’ associations, small and medium-sized businesses and private landlords who own the building. It needs at least ${P.wallbox.mph_min_wohneinheiten} homes. Large companies could only submit until ${d(P.wallbox.mph_grossunternehmen_bis, 'en')} in a competitive procedure. If you rent, you cannot apply yourself; you would need to persuade your landlord.` },
      { q: 'Why is a newer building excluded from the charging point grant?', a: `If the planning application (Bauantrag) was made after ${d(P.wallbox.mph_bauantrag_nach, 'en')}, the Building Electromobility Infrastructure Act (GEIG) already requires the pre-wiring. The federal government does not fund what a law already demands. The exclusion therefore hits younger buildings; older ones being retrofitted are not affected.` },
      { q: 'How long must funded charging infrastructure stay in use?', a: `The grant comes with a commitment period (Zweckbindung) of ${P.wallbox.mph_zweckbindung_jahre} years. During that time the infrastructure must remain available for its funded purpose. Removing it earlier or using it otherwise risks a claw-back. This applies to the association or landlord that applied, not to the individual users of the spaces.` },
      { q: 'Can I insist on a wallbox as a flat owner or tenant?', a: 'Yes. Since the 2020 reform of apartment ownership law, every owner can demand under section 20(2) WEG to be allowed to install charging; tenants have a similar right against the landlord under section 554 BGB. Whoever asks normally pays. The apartment building grant, by contrast, needs a joint decision of the association.' },
    ],
    body: (h) => `
<h2>Houses: no federal grant</h2>
<p>Many pages still quote amounts for a private wallbox that date from earlier years. For 2026 the position is simple: ${h.src('kfw442', 'KfW lists programme 442')} as closed and no longer takes applications. The older programme 440 for charging stations at homes has ended too. The purchase grant for electric cars includes nothing for a charging station. If you have a wallbox installed at your own house, you pay for it, unless a state, a municipality or an energy supplier runs its own scheme. Those schemes are small, often used up quickly and tied to conditions such as green electricity or solar panels. Check your city’s and your utility’s pages; this site only gives amounts that an official source confirms.</p>
<h2>Apartment buildings: the 2026 programme</h2>
<p>Since April 2026 the ${h.src('bmvMph', 'Federal Transport Ministry')} has funded charging infrastructure in and at buildings with several homes. It rests on a guideline dated ${h.date(h.P.wallbox.mph_richtlinie)}; the ${h.src('mphAufruf', 'call for owners’ associations')} gives the details. The budget is ${h.num(h.P.wallbox.mph_budget_mio)} million euros. It is run through its own portal with a project agency; BAFA is not involved.</p>
${h.table(['Condition', 'Value'], [
  ['Building', `at least ${h.P.wallbox.mph_min_wohneinheiten} homes`],
  ['Pre-wiring', `at least ${h.pct(h.P.wallbox.mph_min_anteil_stellplaetze, 0)} of spaces, never fewer than ${h.P.wallbox.mph_min_stellplaetze}`],
  ['Charging power', `${h.P.wallbox.mph_kw_min} to ${h.P.wallbox.mph_kw_max} kW`],
  ['Cap per space, pre-wiring only', h.eur(h.P.wallbox.mph_je_stellplatz_vorverkabelt)],
  ['Cap per space, with a charging point', h.eur(h.P.wallbox.mph_je_stellplatz_mit_ladepunkt)],
  ['Cap per space, bidirectional', h.eur(h.P.wallbox.mph_je_stellplatz_bidirektional)],
  ['Application window', `${h.date(h.P.wallbox.mph_antrag_von)} to ${h.date(h.P.wallbox.mph_antrag_bis)}`],
  ['Commitment period', `${h.P.wallbox.mph_zweckbindung_jahre} years`],
  ['Excluded', `planning application after ${h.date(h.P.wallbox.mph_bauantrag_nach)}`],
], 'Funding for charging in apartment buildings, 2026 guideline', ['l', 'l'])}
<h2>Worked examples for owners’ associations</h2>
<p>The minimum follows from the share of spaces, rounded up, but is never below ${h.P.wallbox.mph_min_stellplaetze}. Small garages therefore hit the floor, large ones the share. The table shows the caps if exactly the minimum is fitted; the grant never exceeds the eligible share of actual costs.</p>
${h.table(['Spaces', 'Minimum to fit', 'Pre-wiring only', 'With charging point', 'Bidirectional'], bsp.map((s) => [h.num(s), h.num(mindest(s)), ...stufen.map((j) => h.eur(mindest(s) * j))]), 'Caps at the minimum number of fitted spaces', ['r', 'r', 'r', 'r', 'r'])}
<p>An association with 24 spaces must pre-wire at least ${h.num(mindest(24))}, because ${h.pct(h.P.wallbox.mph_min_anteil_stellplaetze, 0)} of 24 falls short of the floor. If it fits all 24 with charging points, the cap is ${h.eur(24 * stufen[1])}. You can enter your own number of spaces in the small calculator above.</p>
<h2>How an owners’ association gets to an application</h2>
<ol>
<li>An owner or the property manager (Verwaltung) puts the topic on the agenda of the owners’ meeting.</li>
<li>An electrician checks the building’s connection and quotes for pre-wiring, with or without charging points.</li>
<li>The meeting votes on the work and the application. Without a resolution, the association cannot apply.</li>
<li>The manager applies through the portal before work starts and by ${h.date(h.P.wallbox.mph_antrag_bis)}.</li>
<li>Once approved, the work is done, the costs are documented and the grant is paid.</li>
</ol>
<h2>11 or 22 kW, with or without feeding back</h2>
<p>The programme requires charging points of ${h.P.wallbox.mph_kw_min} to ${h.P.wallbox.mph_kw_max} kW. For a car parked overnight, 11 kW is almost always enough: eight hours add more range than most people drive in a day. 22 kW makes more sense where spaces are shared or cars stop only briefly. Every charging point must be notified to the grid operator, and units above 12 kVA also need its consent under section 19 of the Low Voltage Connection Ordinance (NAV). Bidirectional means the car can feed electricity back into the building or the grid as well as charge. That needs a car that supports it and a matching charger, which is why the cap is highest here.</p>
<h2>Mistakes that sink an application</h2>
<ul>
<li>Work started before approval. Starting early normally rules out funding.</li>
<li>The owners’ meeting resolution is missing, or covers only part of the work.</li>
<li>The building has fewer than ${h.P.wallbox.mph_min_wohneinheiten} homes, a two-family house for example.</li>
<li>Fewer spaces than the minimum are planned, or the power is below ${h.P.wallbox.mph_kw_min} kW.</li>
<li>The building’s planning application dates from after ${h.date(h.P.wallbox.mph_bauantrag_nach)}.</li>
<li>The application arrives after ${h.date(h.P.wallbox.mph_antrag_bis)}.</li>
</ul>
<h2>What a wallbox at a house costs without a grant</h2>
<p>Without funding, three items set the price: the unit, the cable from the meter cabinet to the parking space, and any work on the meter cabinet itself. The longer the run and the older the wiring, the more it costs. Get at least two quotes from registered electricians and check that notifying the grid operator is included.</p>
<h2>Tenants, landlords, owners</h2>
<p>If you rent, you cannot use the programme yourself. A private landlord can apply if the building qualifies, which lowers the cost for tenants. Separately from any grant, flat owners under section 20(2) WEG and tenants under section 554 BGB have a right to be allowed to install charging; they then normally pay for it themselves. For a single electric car in a large underground garage, using that individual right is often quicker than a joint application; for an association where several owners want to drive electric, fitting the garage together usually works out better.</p>
<h2>What a wallbox does not change</h2>
<ul>
<li>The ${h.a('thg-praemie', 'GHG quota payout')}: it is a flat rate for every electric car, whether it charges at home, at work or at a public charger.</li>
<li>The purchase grant: it depends on the car and household income, not on whether you can charge.</li>
<li>${h.a('kfz-steuer', 'Vehicle tax')}: it depends only on registration date and weight.</li>
</ul>
<p>Whether an electric car makes sense without your own wallbox depends mainly on the electricity prices you can charge at. How the grant combines with other bonuses is covered under ${h.a('kumulierung', 'combining bonuses')}.</p>`,
  },
});
