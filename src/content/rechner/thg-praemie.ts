import { defineGuide } from '../../lib/guide-types';
import { erloes, angerechnet, schaetzwert } from '../../lib/engine/thg';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * THG-Prämie: was der Verkauf der Quote eines Elektroautos bringt. Der Betrag ist ein Marktpreis (Finanztip, ADAC,
 * Stand Oktober 2026), die Strommenge ist der Schätzwert des Umweltbundesamts. Beispiele: 300 € und 350 € je Jahr,
 * drei Jahre (die Haltedauer der E-Auto-Förderung), ein Pkw und eine kleine Flotte.
 */
const T = P.thg;
const fristEn = T.frist_mitteilung.replace(/^(\d+)\. Februar$/, '$1 February');
const lo = T.markt_ohne_bonus_ab_eur, hi = T.markt_bis_eur;
const drei = erloes({ praemie: lo, jahre: 3, fahrzeuge: 1 });
const dreiHi = erloes({ praemie: hi, jahre: 3, fahrzeuge: 1 });
const flotte = erloes({ praemie: lo, jahre: 1, fahrzeuge: 5 });
const mitGeb = erloes({ praemie: lo, jahre: 1, fahrzeuge: 1, gebuehr: 30 });
const d = (iso: string, l: 'de' | 'en') => datumText(iso, l);

export default defineGuide({
  id: 'thg-praemie',
  group: 'kosten',
  order: 10,
  tool: 'thg',
  related: ['thg-quote', 'kfz-steuer', 'wallbox', 'leasing', 'home'],
  sources: ['uba', 'ubaSchaetzwert', 'bimschv38', 'finanztip', 'adacThg'],
  de: {
    slug: 'thg-praemie',
    nav: 'THG-Prämie',
    card: 'Was der Verkauf der THG-Quote bringt, wer beantragen darf und bis wann.',
    title: 'THG-Prämie 2026: Auszahlung, Fristen und Halter-Regeln',
    description: `THG-Prämie 2026 für Elektroautos: über ${DE.eur(lo)} im Jahr laut Marktstand Oktober, ${DE.num(schaetzwert('m1'))} kWh Schätzwert des Umweltbundesamts, beantragen darf nur der Halter.`,
    h1: 'THG-Prämie 2026 rechnen',
    intro: 'Betrag des Anbieters, Fahrzeugklasse und Jahre eingeben: Der Rechner zeigt, was die THG-Quote Ihres Elektroautos insgesamt bringt und welche Strommenge dahintersteht.',
    resume: `Die THG-Prämie ist Geld, das Halter reiner Elektroautos jedes Jahr für ihre Treibhausgasquote bekommen. Die Grundlage ist die 38. Bundes-Immissionsschutzverordnung: Unternehmen, die Benzin und Diesel verkaufen, müssen ihre Emissionen mindern und dürfen dafür Strom aus Elektrofahrzeugen anrechnen, und zwar ${T.multiplikator_strom}-fach. Für einen Pkw ohne gemessenen Verbrauch setzt das Umweltbundesamt pauschal ${DE.num(schaetzwert('m1'))} kWh im Jahr an, für einen leichten Transporter ${DE.num(schaetzwert('n1'))} kWh. Was ein Anbieter dafür zahlt, legt kein Gesetz fest, sondern der Markt: Im Oktober 2026 lagen die Angebote nach Finanztip über ${DE.eur(lo)} auch ohne Bonus und mit Bonus bei bis zu ${DE.eur(hi)}. Über drei Jahre ergibt das ${DE.eur(drei.gesamt)} bis ${DE.eur(dreiHi.gesamt)}. Beantragen darf nur der Halter laut Fahrzeugschein, ein Plug-in-Hybrid kann den Schätzwert nicht nutzen, und die Anbieter schließen ihre Annahme oft lange vor der gesetzlichen Meldefrist am ${T.frist_mitteilung} des Folgejahres.`,
    faqs: [
      { q: 'Wie hoch ist die THG-Prämie im Oktober 2026?', a: `Nach dem Vergleich von Finanztip mit Stand ${d(T.markt_stand, 'de')} zahlen Anbieter für einen Elektro-Pkw über ${DE.eur(lo)} auch ohne Bonus, mit Bonusaktion bis zu ${DE.eur(hi)}; der ADAC nennt ebenfalls über 300 € für das Quotenjahr 2026. Das sind Marktpreise, die sich im Lauf des Jahres ändern. Ältere Angaben von 260 € oder weniger sind für 2026 überholt.` },
      { q: 'Bekomme ich die THG-Prämie auch für ein geleastes Elektroauto?', a: 'Ja, wenn Sie in der Zulassungsbescheinigung Teil I als Halter eingetragen sind. Beim privaten Leasing ist das meist die Leasingnehmerin oder der Leasingnehmer. Ist die Leasinggesellschaft als Halter eingetragen, kann nur sie die Quote verkaufen. Ein Blick in den Fahrzeugschein klärt das; den Antrag stellt immer die Person oder Firma, die dort steht.' },
      { q: 'Kann ich die THG-Quote für einen Plug-in-Hybrid verkaufen?', a: `Nein, nicht über den Schätzwert. Die pauschalen ${DE.num(schaetzwert('m1'))} kWh gelten nur für reine Elektrofahrzeuge. Ein Plug-in-Hybrid ist für die THG-Prämie, wie sie die Anbieter für Privatleute anbieten, nicht vorgesehen. Für die E-Auto-Förderung beim Kauf kann ein solcher Hybrid dagegen unter Bedingungen förderfähig sein.` },
      { q: 'Wann muss ich die THG-Prämie für 2026 spätestens beantragen?', a: `Der Anbieter muss die Strommengen dem Umweltbundesamt bis zum ${T.frist_mitteilung} des Folgejahres melden. Damit er das schafft, nehmen viele Anbieter Fahrzeugscheine für das laufende Jahr nur bis zu einem früheren Stichtag an, häufig bis Ende Oktober. Wer ein Angebot nutzen will, sollte die Frist des eigenen Anbieters prüfen, nicht die gesetzliche.` },
      { q: 'Gibt es die THG-Prämie auch für ein gebrauchtes Elektroauto?', a: 'Ja. Die Quote hängt am Fahrzeug und am Kalenderjahr, nicht daran, ob das Auto neu ist. Wer ein gebrauchtes Elektroauto kauft und als Halter eingetragen ist, kann die Quote für das laufende Jahr verkaufen, sofern der Vorbesitzer sie für dieses Jahr nicht schon genutzt hat. Fragen Sie beim Kauf danach; für die Folgejahre steht sie dann allein Ihnen zu.' },
    ],
    body: (h) => `
<h2>Woher das Geld kommt</h2>
<p>Die THG-Prämie ist keine staatliche Leistung. Unternehmen, die Kraftstoffe in Verkehr bringen, müssen die Treibhausgasemissionen ihrer Produkte jedes Jahr um einen gesetzlichen Prozentsatz mindern. Schaffen sie das nicht selbst, kaufen sie Minderungen zu, unter anderem aus Strom, der in Elektrofahrzeugen getankt wurde. Die ${h.src('bimschv38', '38. BImSchV')} regelt, wie dieser Strom angerechnet wird, das Umweltbundesamt bescheinigt die Mengen, und die bescheinigte Menge wird einem Pflichtigen auf seine Quote angerechnet. Zwischen dem Halter eines Elektroautos und dem Mineralölunternehmen steht ein Anbieter, der viele Fahrzeuge bündelt, die Bescheinigung beantragt und die Quote weiterverkauft. Von dem Erlös zahlt er Ihnen einen Teil aus: das ist die THG-Prämie.</p>
<h2>Die Strommenge hinter der Prämie</h2>
<p>Gemessen wird bei Privatleuten nichts. Für jedes reine Elektrofahrzeug ohne öffentlichen Ladepunkt setzt das Umweltbundesamt einen ${h.src('ubaSchaetzwert', 'Schätzwert')} an: ${h.num(schaetzwert('m1'))} kWh im Jahr für einen Pkw der Klasse M1, ${h.num(schaetzwert('n1'))} kWh für ein leichtes Nutzfahrzeug der Klasse N1. Weil Strom auf die Quote ${h.P.thg.multiplikator_strom}-fach zählt, stehen hinter einem Pkw ${h.num(angerechnet('m1'))} kWh, hinter einem Transporter ${h.num(angerechnet('n1'))} kWh. Ob Sie viel oder wenig fahren, ob Sie zu Hause oder unterwegs laden, spielt für diese Pauschale keine Rolle.</p>
${h.table(['Fahrzeug', 'Schätzwert', 'Angerechnet', 'Prämie bei ' + h.eur(lo) + ' je Pkw-Jahr'], [
  ['Elektro-Pkw (M1)', `${h.num(schaetzwert('m1'))} kWh`, `${h.num(angerechnet('m1'))} kWh`, h.eur(lo)],
  ['Elektro-Transporter (N1)', `${h.num(schaetzwert('n1'))} kWh`, `${h.num(angerechnet('n1'))} kWh`, 'Angebot je Klasse'],
], 'Schätzwerte des Umweltbundesamts für das Quotenjahr 2026', ['l', 'r', 'r', 'r'])}
<p>Für Transporter verlangen Anbieter eigene Preise; den Pkw-Betrag einfach hochzurechnen wäre eine Vermutung. Geben Sie im Rechner das Angebot ein, das Sie für Ihre Fahrzeugklasse bekommen.</p>
<h2>Was der Markt im Oktober 2026 zahlt</h2>
<p>Der Vergleich von ${h.src('finanztip', 'Finanztip')} nannte am ${h.date(h.P.thg.markt_stand)} Angebote über ${h.eur(lo)} auch ohne Bonus und bis zu ${h.eur(hi)} mit Bonusaktion; der ${h.src('adacThg', 'ADAC')} spricht für 2026 von über 300 €. Ältere Zahlen, die in Ratgebern noch stehen, etwa 260 €, beschreiben einen früheren Stand. Der Preis hängt davon ab, wie viele Quoten am Markt sind und was die Pflichtigen zahlen müssen, wenn sie ihre Pflicht verfehlen. Er kann im Lauf eines Jahres fallen oder steigen.</p>
${h.table(['Annahme', 'Ein Jahr', 'Drei Jahre'], [
  [`${h.eur(lo)} je Jahr, ohne Gebühr`, h.eur(lo), h.eur(drei.gesamt)],
  [`${h.eur(hi)} je Jahr, mit Bonus`, h.eur(hi), h.eur(dreiHi.gesamt)],
  [`${h.eur(lo)} je Jahr, 30 € Gebühr`, h.eur(mitGeb.gesamt), h.eur(mitGeb.gesamt * 3)],
  [`Fünf Pkw, ${h.eur(lo)} je Fahrzeug`, h.eur(flotte.gesamt), h.eur(flotte.gesamt * 3)],
], 'Rechnung mit den Marktwerten vom Oktober 2026, ein Elektro-Pkw', ['l', 'r', 'r'])}
<p>Drei Jahre sind hier gewählt, weil die E-Auto-Förderung eine Haltedauer von ${h.P.foerderung.haltedauer_monate} Monaten verlangt; wer das Auto so lange behält, kann in dieser Zeit drei Quotenjahre verkaufen, wenn die Zulassung früh im Jahr liegt.</p>
<h2>Festpreis oder Auszahlung nach Erlös</h2>
<p>Anbieter arbeiten mit zwei Modellen. Beim Festpreis steht der Betrag fest, sobald Sie Ihren Fahrzeugschein hochladen, und wird nach der Bescheinigung durch das Umweltbundesamt gezahlt. Beim variablen Modell zahlt der Anbieter, was er beim Verkauf der gebündelten Quoten tatsächlich erzielt, abzüglich seines Anteils; das kann mehr oder weniger sein als ein Festpreis, und das Geld kommt später. Achten Sie auf drei Dinge: ob eine Gebühr oder Provision abgezogen wird, ob der Betrag je Kalenderjahr gilt oder einmalig ist, und bis wann der Anbieter Anträge für das laufende Jahr annimmt. Das Umweltbundesamt erhebt seit dem 17. April 2026 Gebühren für die Bescheinigung; sie tragen die Anbieter, die sie in ihre Preise einrechnen.</p>
<h2>Wer beantragen darf</h2>
<p>Berechtigt ist der Halter, also die Person oder Firma, die in der Zulassungsbescheinigung Teil I steht. Das ist beim Kauf in aller Regel der Käufer. Beim Leasing kommt es darauf an, wer eingetragen ist; bei privatem Leasing meistens der Leasingnehmer. Für einen Dienstwagen, den die Firma zulässt, kann nur die Firma verkaufen. Je Fahrzeug und Jahr ist der Verkauf einmal möglich. Wechselt das Auto im Lauf des Jahres den Halter, kann für dieses Jahr nur einer die Quote nutzen; wer ein gebrauchtes Elektroauto kauft, sollte nachfragen, ob der Vorbesitzer sie schon verkauft hat.</p>
<h2>Die Termine eines Quotenjahres</h2>
<ol>
<li>Das Quotenjahr ist das Kalenderjahr. Ein Auto, das im November 2026 zugelassen wird, kann für 2026 noch verkauft werden, wenn der Anbieter es annimmt.</li>
<li>Der Anbieter meldet die Fahrzeuge beim Umweltbundesamt, gesetzlich bis zum ${h.P.thg.frist_mitteilung} des Folgejahres. Am ${h.date(h.P.thg.uba_bearbeitung_stand)} bearbeitete das Amt Anträge für 2026, die seit dem ${h.date(h.P.thg.uba_bearbeitung_eingang_ab)} eingegangen waren (${h.src('uba', 'Umweltbundesamt')}).</li>
<li>Nach der Bescheinigung verkauft der Anbieter die Quote und zahlt aus, beim Festpreis meist innerhalb weniger Wochen.</li>
</ol>
<h2>Fehler, die eine Auszahlung verzögern</h2>
<p>Die meisten Verzögerungen haben einfache Gründe. Das hochgeladene Foto des Fahrzeugscheins ist unscharf oder abgeschnitten, sodass Halter, Fahrzeugklasse oder Fahrzeug-Identifizierungsnummer nicht lesbar sind. Der Name im Kundenkonto passt nicht zum Halter im Schein, etwa weil das Auto auf den Partner zugelassen ist. Das Fahrzeug wurde für dasselbe Jahr schon bei einem zweiten Anbieter angemeldet, was das Umweltbundesamt ablehnt. Oder die Antriebsart im Schein lautet nicht auf reinen Elektroantrieb. Wer vor dem Hochladen diese vier Punkte prüft, spart meist Wochen. Nach einem Halterwechsel, einer Ummeldung in einen anderen Zulassungsbezirk oder einem neuen Kennzeichen gilt der neue Schein; der alte genügt dann nicht mehr.</p>
<h2>Die Prämie im Rechner</h2>
<p>Der Rechner oben multipliziert das Angebot Ihres Anbieters mit der Zahl der Jahre und Fahrzeuge und zieht eine Gebühr ab, wenn Sie eine eingeben. Er zeigt daneben die Strommenge, für die Sie bezahlt werden. Er sagt nicht voraus, was ein Anbieter 2027 zahlen wird: Ein Marktpreis lässt sich nicht fortschreiben, und für spätere Jahre gibt es nur angekündigte Änderungen am Gesetz, keine festen Beträge.</p>
<h2>THG-Prämie, Förderung und Kfz-Steuer zusammen</h2>
<p>Die drei Vorteile eines Elektroautos haben nichts miteinander zu tun und schließen sich nicht aus. Die E-Auto-Förderung ist ein einmaliger Zuschuss, der vom Haushaltseinkommen abhängt; die THG-Prämie ist ein jährlicher Verkaufserlös für jeden Halter, unabhängig vom Einkommen; die Befreiung von der Kfz-Steuer gilt für jedes Elektroauto mit Erstzulassung bis ${h.date(h.P.kfz.befreiung_zulassung_bis)}. Für einen Haushalt in der ersten Stufe ohne Kind kommen so ${h.eur(h.P.foerderung.bev[0][0])} Förderung und, mit den Werten vom Oktober, rund ${h.eur(drei.gesamt)} THG-Prämie in drei Jahren zusammen. Die Steuer rechnet der ${h.a('kfz-steuer', 'Kfz-Steuer-Rechner')}, die Förderung der ${h.a('home', 'Prämienrechner')}. Die Regeln der Quote selbst, die Gesetzesänderung von 2026 und die Rolle des Umweltbundesamts erklärt ${h.a('thg-quote', 'THG-Quote 2026')}.</p>`,
  },
  en: {
    slug: 'ghg-quota-payout',
    nav: 'GHG quota payout',
    card: 'What selling your car’s greenhouse gas quota pays, who can claim and by when.',
    title: 'GHG quota payout 2026: THG-Prämie for EVs in Germany',
    description: `GHG quota payout 2026 for electric cars in Germany: above ${EN.eur(lo)} a year at October market prices, a ${EN.num(schaetzwert('m1'))} kWh flat estimate, and only the keeper may claim.`,
    h1: 'Work out your THG-Prämie for 2026',
    intro: 'Enter the provider’s offer, the vehicle class and the number of years: the calculator shows what your electric car’s greenhouse gas quota brings in and the electricity behind it.',
    resume: `The THG-Prämie, or GHG quota payout, is money that keepers of battery electric cars in Germany receive every year for their greenhouse gas quota. It rests on the 38th Federal Immission Control Ordinance (38. BImSchV): companies selling petrol and diesel must cut their emissions and may count electricity used by electric vehicles towards that, at ${T.multiplikator_strom} times its amount. For a car without metered charging, the Federal Environment Agency (Umweltbundesamt) assumes a flat ${EN.num(schaetzwert('m1'))} kWh a year, and ${EN.num(schaetzwert('n1'))} kWh for a light van. No law sets what a provider pays for that; the market does. In October 2026, according to Finanztip, offers were above ${EN.eur(lo)} even without a bonus and up to ${EN.eur(hi)} with one. Over three years that comes to ${EN.eur(drei.gesamt)} to ${EN.eur(dreiHi.gesamt)}. Only the keeper (Halter) named on the registration certificate can claim, plug-in hybrids cannot use the estimate, and providers often stop accepting claims long before the legal reporting deadline of ${fristEn} of the following year.`,
    faqs: [
      { q: 'How much is the GHG quota payout in October 2026?', a: `Finanztip’s comparison as of ${d(T.markt_stand, 'en')} shows providers paying over ${EN.eur(lo)} for an electric car even without a bonus, and up to ${EN.eur(hi)} with a bonus offer; the ADAC also gives over €300 for quota year 2026. These are market prices that change during the year. Older figures of €260 or less are out of date for 2026.` },
      { q: 'Can I claim the THG-Prämie on a leased electric car?', a: 'Yes, if you are entered as the keeper (Halter) on part I of the registration certificate (Zulassungsbescheinigung Teil I). With a private lease that is usually the lessee. If the leasing company is entered as keeper, only it can sell the quota. A look at the registration settles it; the claim is always made by whoever is named there.' },
      { q: 'Can a plug-in hybrid earn a GHG quota payout?', a: `Not through the flat estimate. The ${EN.num(schaetzwert('m1'))} kWh apply only to battery electric vehicles. A plug-in hybrid is not covered by the payouts that providers offer private keepers. For the purchase grant, on the other hand, such a hybrid can qualify under certain conditions.` },
      { q: 'What is the last date to claim the 2026 quota?', a: `The provider must report the electricity to the Federal Environment Agency by ${fristEn} of the following year. To manage that, many providers accept registrations for the current year only up to an earlier cut-off, often the end of October. If you want a particular offer, check that provider’s deadline rather than the legal one.` },
      { q: 'Can I get the GHG quota payout on a used electric car?', a: 'Yes. The quota belongs to the vehicle and the calendar year, not to whether the car is new. If you buy a used electric car and are entered as keeper, you can sell the current year’s quota, provided the previous owner has not already used it for that year. Ask when you buy; from the following year it is yours alone.' },
    ],
    body: (h) => `
<h2>Where the money comes from</h2>
<p>The quota payout is not a state benefit. Companies that put fuel on the German market must reduce the greenhouse gas emissions of what they sell by a legal percentage each year. If they fall short, they buy reductions from elsewhere, including electricity charged into electric vehicles. The ${h.src('bimschv38', '38th BImSchV')} sets out how that electricity is credited, the Federal Environment Agency certifies the amounts, and the certified amount is then credited to an obliged company’s quota. Between you as the keeper and the oil company sits a provider, who bundles many cars, applies for the certificate and sells the quota on. It pays part of the proceeds to you: that is the payout.</p>
<h2>The electricity behind the payout</h2>
<p>Nothing is metered for private keepers. For every battery electric vehicle without a public charging point, the Federal Environment Agency applies an ${h.src('ubaSchaetzwert', 'estimate')}: ${h.num(schaetzwert('m1'))} kWh a year for a passenger car (class M1), ${h.num(schaetzwert('n1'))} kWh for a light commercial vehicle (class N1). Because electricity counts ${h.P.thg.multiplikator_strom} times towards the quota, a car stands for ${h.num(angerechnet('m1'))} kWh and a van for ${h.num(angerechnet('n1'))} kWh. How far you drive, and whether you charge at home or on the road, makes no difference to the flat rate.</p>
${h.table(['Vehicle', 'Estimate', 'Credited', `Payout at ${h.eur(lo)} per car-year`], [
  ['Electric car (M1)', `${h.num(schaetzwert('m1'))} kWh`, `${h.num(angerechnet('m1'))} kWh`, h.eur(lo)],
  ['Electric van (N1)', `${h.num(schaetzwert('n1'))} kWh`, `${h.num(angerechnet('n1'))} kWh`, 'offer per class'],
], 'Federal Environment Agency estimates for quota year 2026', ['l', 'r', 'r', 'r'])}
<p>Providers price vans separately; scaling up the car figure would be guesswork. Enter the offer you receive for your vehicle class in the calculator.</p>
<h2>What the market pays in October 2026</h2>
<p>${h.src('finanztip', 'Finanztip’s comparison')} on ${h.date(h.P.thg.markt_stand)} listed offers above ${h.eur(lo)} even without a bonus and up to ${h.eur(hi)} with one; the ${h.src('adacThg', 'ADAC')} gives over €300 for 2026. Older figures that still circulate, such as €260, describe an earlier market. The price depends on how many quotas are on offer and on what the obliged companies would pay for missing their target, and it can move either way during a year.</p>
${h.table(['Assumption', 'One year', 'Three years'], [
  [`${h.eur(lo)} a year, no fee`, h.eur(lo), h.eur(drei.gesamt)],
  [`${h.eur(hi)} a year, with a bonus`, h.eur(hi), h.eur(dreiHi.gesamt)],
  [`${h.eur(lo)} a year, €30 fee`, h.eur(mitGeb.gesamt), h.eur(mitGeb.gesamt * 3)],
  [`Five cars, ${h.eur(lo)} each`, h.eur(flotte.gesamt), h.eur(flotte.gesamt * 3)],
], 'Worked with October 2026 market values, one electric car', ['l', 'r', 'r'])}
<p>Three years is used here because the purchase grant requires you to keep the car for ${h.P.foerderung.haltedauer_monate} months; if you keep it that long and registered it early in a year, you can sell three quota years in that time.</p>
<h2>Fixed price or a share of the proceeds</h2>
<p>Providers use two models. With a fixed price, the amount is set when you upload your registration and is paid once the Federal Environment Agency has certified it. With a variable model, the provider pays what it actually gets for the bundled quotas, minus its share; that can be more or less than a fixed price, and the money arrives later. Check three things: whether a fee or commission is deducted, whether the amount is per calendar year or one-off, and until when the provider accepts claims for the current year. Since 17 April 2026 the agency has charged fees for certification; providers pay them and build them into their prices.</p>
<h2>Who can claim</h2>
<p>The person or company named as keeper on part I of the registration certificate. When you buy, that is normally you. With a lease it depends on who is entered; with a private lease usually the lessee. For a company car registered by the employer, only the employer can sell. Each car can be sold once per year. If the keeper changes during a year, only one of them can use that year’s quota; if you buy a used electric car, ask whether the previous owner has already sold it.</p>
<h2>The dates in a quota year</h2>
<ol>
<li>The quota year is the calendar year. A car registered in November 2026 can still be sold for 2026 if the provider accepts it.</li>
<li>The provider reports the cars to the Federal Environment Agency, legally by ${fristEn} of the following year. On ${h.date(h.P.thg.uba_bearbeitung_stand)} the agency was processing 2026 claims received from ${h.date(h.P.thg.uba_bearbeitung_eingang_ab)} (${h.src('uba', 'Federal Environment Agency')}).</li>
<li>After certification the provider sells the quota and pays out, usually within a few weeks for a fixed price.</li>
</ol>
<h2>Mistakes that hold up a payout</h2>
<p>Most delays have plain causes. The photo of the registration is blurred or cropped, so the keeper, vehicle class or vehicle identification number cannot be read. The name on the provider account does not match the keeper, for instance because the car is registered to a partner. The car has already been entered with a second provider for the same year, which the agency rejects. Or the fuel type on the registration is not purely electric. Checking those four points before uploading usually saves weeks. After a change of keeper, a move to another registration district or new plates, the new certificate counts and the old one is no longer enough.</p>
<h2>The payout, the grant and vehicle tax together</h2>
<p>The three benefits of an electric car are unrelated and do not rule each other out. The purchase grant is a one-off payment that depends on household income; the quota payout is a yearly sale open to every keeper whatever their income; the vehicle tax exemption applies to every electric car first registered by ${h.date(h.P.kfz.befreiung_zulassung_bis)}. A household in the first band without children therefore collects ${h.eur(h.P.foerderung.bev[0][0])} of grant and, at October prices, about ${h.eur(drei.gesamt)} of quota payouts over three years. The tax is on the ${h.a('kfz-steuer', 'vehicle tax calculator')}, the grant on the ${h.a('home', 'grant calculator')}. How the quota itself works, the 2026 change in the law and the agency’s role are covered in ${h.a('thg-quote', 'GHG quota rules')}.</p>`,
  },
});
