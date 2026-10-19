import { defineGuide } from '../../lib/guide-types';
import { foerderung, fristen } from '../../lib/engine/foerderung';
import { plusMonate, minusTag, datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Leasing: förderfähig wie Kauf; Antrag stellt der Halter (Leasingnehmer, wenn er eingetragen ist); Haltedauer
 * 36 Monate gilt unabhängig von der Laufzeit; kurze Verträge verlängern oder übernehmen. Förderung je Monat
 * als Vergleichsgröße zur Leasingrate. BAFA-Statistik: Kauf und Leasing fast gleich häufig.
 */
const F = P.foerderung;
const z = '2026-11-01';
const b = (zve: number, kinder = 0) => foerderung({ zve, kinder, antrieb: 'bev', zulassung: z }).betrag;
const laufzeiten = [24, 36, 48];
const zul = '2026-11-03';
const haltenBis = fristen(zul).haltenBis;
const rueckgabe36 = minusTag(plusMonate('2026-11-05', 36));
const LEASING = 48462, KAUF = 49328; // BAFA-Statistik, Stand 1.10.2026 (src/data/bafa-statistik.json)

export default defineGuide({
  id: 'leasing',
  group: 'antrag',
  order: 30,
  mini: 'aLeasing',
  related: ['haltedauer', 'antrag', 'kumulierung', 'selbststaendige'],
  sources: ['bafaFaq', 'richtlinie', 'bafaStatistik'],
  de: {
    slug: 'leasing',
    nav: 'Leasing',
    card: 'Förderung beim Leasing: wer beantragt, warum 24 Monate nicht reichen und was die Förderung je Monat bedeutet.',
    title: 'E-Auto-Förderung Leasing 2026: Laufzeit, Halter und Antrag',
    description: `E-Auto-Förderung beim Leasing 2026: gleich hoch wie beim Kauf, Antrag durch den Halter, ${F.haltedauer_monate} Monate Zulassung nötig; was bei 24 Monaten Laufzeit zu tun ist.`,
    h1: 'E-Auto-Förderung beim Leasing 2026',
    intro: 'Fast jede zweite bewilligte Förderung betrifft ein geleastes Auto. Was beim Leasing anders ist: wer den Antrag stellt, wie Laufzeit und Haltedauer zusammenpassen und wohin das Geld fließt.',
    resume: `Die E-Auto-Förderung 2026 gilt für geleaste Neuwagen genauso wie für gekaufte, mit denselben Beträgen und denselben Einkommensgrenzen. Nach der BAFA-Statistik vom ${datumText(F.statistik_stand, 'de')} entfielen ${DE.num(LEASING)} der ${DE.num(F.bewilligungen)} Bewilligungen auf Leasing und ${DE.num(KAUF)} auf Kauf. Den Antrag stellt der Halter, also die Person, auf die das Auto zugelassen ist. Beim privaten Leasing ist das meist der Leasingnehmer; Käufer oder Leasingnehmer und Halter müssen aber nicht dieselbe Person sein. Ist die Leasinggesellschaft als Halter eingetragen, gibt es keine Förderung für den Fahrer. Die Haltedauer von ${F.haltedauer_monate} Monaten gilt unabhängig von der Vertragslaufzeit. Ein Vertrag über 24 Monate reicht deshalb nicht: Er muss verlängert oder das Auto übernommen werden, sonst droht eine Rückforderung. Das Geld zahlt das BAFA auf das Konto des Halters, nicht an die Leasinggesellschaft. Als Vergleichsgröße: ${DE.eur(b(40000))} Förderung entsprechen über ${F.haltedauer_monate} Monate ${DE.eur(b(40000) / F.haltedauer_monate, 2)} im Monat.`,
    faqs: [
      { q: 'Wer stellt beim Leasing den Antrag auf E-Auto-Förderung?', a: 'Der Halter, also die Person, die in der Zulassungsbescheinigung Teil I steht. Beim privaten Leasing ist das in der Regel der Leasingnehmer selbst. Das BAFA stellt klar, dass Halter und Leasingnehmer nicht dieselbe Person sein müssen. Ist dagegen die Leasinggesellschaft als Halter eingetragen, kann der Fahrer keinen Antrag stellen.' },
      { q: 'Reicht ein Leasingvertrag über 24 Monate für die Förderung?', a: `Nein, nicht ohne weiteres. Das BAFA verlangt, dass das Auto ${F.haltedauer_monate} Monate durchgehend auf Sie zugelassen bleibt, gleich wie lang der Vertrag läuft. Bei 24 Monaten Laufzeit fehlen 12 Monate. Sie müssen den Vertrag verlängern oder das Auto am Ende übernehmen. Geben Sie es nach 24 Monaten zurück, ist das dem BAFA zu melden.` },
      { q: 'Bekommt die Leasinggesellschaft die Förderung oder ich?', a: 'Sie. Das BAFA zahlt auf das Konto des Halters, der im Antrag angegeben wird. Eine Auszahlung an die Leasinggesellschaft oder an das Autohaus ist nicht vorgesehen, auch wenn diese den Antrag mit Ihrer Vollmacht stellt. Was Sie mit dem Geld machen, ist Ihre Sache; eine Verrechnung mit der Leasingrate erfolgt nicht automatisch.' },
      { q: 'Ist die Förderung beim Leasing niedriger als beim Kauf?', a: 'Nein. Die Richtlinie unterscheidet bei den Beträgen nicht zwischen Kauf und Leasing. Maßgeblich sind nur Fahrzeugart, Haushaltseinkommen und Kinderzahl. Ob das Auto bar bezahlt, finanziert oder geleast wird, spielt für die Höhe keine Rolle. Unterschiede gibt es nur bei der Frage, wer Halter ist, und bei der Laufzeit.' },
      { q: 'Was passiert, wenn ich das Leasingauto ein paar Tage zu früh zurückgebe?', a: `Dann endet die Zulassung vor Ablauf der Haltedauer, und das ist dem BAFA zu melden. Es lohnt deshalb, das Rückgabedatum im Vertrag mit dem Tag der Zulassung zu vergleichen. Wurde das Auto einige Tage nach Vertragsbeginn zugelassen, kann ein Vertrag über genau ${F.haltedauer_monate} Monate wenige Tage zu früh enden.` },
    ],
    body: (h) => `
<h2>Leasing ist gleichgestellt</h2>
<p>Die ${h.src('richtlinie', 'Förderrichtlinie')} fördert Neuwagen, die gekauft oder geleast werden. Das ${h.src('bafaFaq', 'BAFA')} sagt dazu nur, dass das Fahrzeug über Kauf oder Leasing erworben werden muss; Kreditkonditionen und andere Erwerbsbedingungen spielen keine Rolle. Die ${h.src('bafaStatistik', 'Statistik vom Oktober 2026')} zeigt, wie verbreitet Leasing ist:</p>
${h.table(['Erwerbsart', 'Bewilligungen', 'Anteil'], [
  ['Kauf', h.num(KAUF), h.pct(KAUF / h.P.foerderung.bewilligungen)],
  ['Leasing', h.num(LEASING), h.pct(LEASING / h.P.foerderung.bewilligungen)],
], `Bewilligungen nach Erwerbsart, Stand ${h.date(h.P.foerderung.statistik_stand)}`, ['l', 'r', 'r'])}
<h2>Halter, Leasingnehmer, Antragsteller</h2>
<p>Beim Leasing gibt es drei Rollen, die auseinanderfallen können: der Leasingnehmer, der den Vertrag unterschreibt, der Halter, der in der Zulassungsbescheinigung Teil I steht, und der Eigentümer, das ist die Leasinggesellschaft. Für die Förderung zählt allein der Halter. Er stellt den Antrag, auf ihn wird das Geld überwiesen, und er muss die Haltedauer einhalten. Wer unsicher ist, wer am Ende im Schein stehen wird, fragt den Anbieter vor der Unterschrift; nachträglich lässt sich das nur mit einer Umschreibung ändern, und die ist während der Haltedauer selbst meldepflichtig.</p>
${h.table(['Fall', 'Halter laut Schein', 'Förderung möglich'], [
  ['Privatleasing, Sie sind eingetragen', 'Sie', 'ja'],
  ['Privatleasing, Partner unterschreibt, Sie sind eingetragen', 'Sie', 'ja, Antrag durch Sie'],
  ['Leasinggesellschaft lässt auf sich zu', 'Leasinggesellschaft', 'nein'],
  ['Gewerbeleasing über Ihre Firma', 'Firma', 'nein'],
], 'Wer beim Leasing antragsberechtigt ist', ['l', 'l', 'l'])}
<h2>Laufzeit und Haltedauer</h2>
<p>Das Auto muss ${h.P.foerderung.haltedauer_monate} Monate durchgehend auf Sie zugelassen bleiben. Viele Leasingangebote laufen kürzer. Die Tabelle zeigt, was das bedeutet.</p>
${h.table(['Laufzeit', 'Fehlende Monate', 'Was zu tun ist'], laufzeiten.map((t) => [`${t} Monate`, String(Math.max(0, h.P.foerderung.haltedauer_monate - t)), t < h.P.foerderung.haltedauer_monate ? 'verlängern oder Auto übernehmen' : 'Rückgabedatum mit dem Zulassungstag vergleichen']), 'Leasinglaufzeit gegen Haltedauer', ['l', 'r', 'l'])}
<p>Bei einer Laufzeit von genau ${h.P.foerderung.haltedauer_monate} Monaten kommt es auf die Tage an. Ein Beispiel: Das Auto wird am ${h.date(zul)} zugelassen, die Haltedauer läuft bis zum ${h.date(haltenBis)}. Beginnt der Vertrag erst bei der Übergabe am ${h.date('2026-11-05')}, endet er am ${h.date(rueckgabe36)}, also nach dem Ende der Haltedauer. Wäre das Auto dagegen erst nach Vertragsbeginn zugelassen worden, und gibt man es am letzten Vertragstag zurück, fehlen womöglich einige Tage. Wer sichergehen will, vereinbart die Rückgabe nicht vor dem Tag nach dem Ende der Haltedauer.</p>
<h2>Die Förderung im Verhältnis zur Rate</h2>
<p>Das BAFA zahlt die Förderung als Einmalbetrag auf Ihr Konto, nicht als Abschlag auf die Rate. Um sie mit einem Leasingangebot zu vergleichen, kann man sie auf die Monate der Haltedauer verteilen:</p>
${h.table(['Haushaltseinkommen', 'Kinder', 'Förderung', `Je Monat über ${h.P.foerderung.haltedauer_monate} Monate`], [[38000, 0], [52000, 1], [72000, 2], [86000, 2]].map(([zv, k]) => [h.eur(zv), String(k), h.eur(b(zv, k)), h.eur(b(zv, k) / h.P.foerderung.haltedauer_monate, 2)]), 'Förderung für ein geleastes Elektroauto, umgerechnet je Monat', ['r', 'r', 'r', 'r'])}
<p>Manche Angebote rechnen die Förderung als Sonderzahlung ein, die Sie leisten, sobald das Geld da ist. Das ist eine Vereinbarung zwischen Ihnen und dem Anbieter; das BAFA zahlt trotzdem an Sie. Solche Angebote sind nicht unzulässig, aber sie verschieben ein Risiko auf Sie. Lesen Sie genau, was passiert, wenn die Förderung nicht bewilligt wird, etwa weil das Einkommen über der Grenze liegt oder ein Förderstopp kommt.</p>
<h2>Zwei Angebote im Vergleich</h2>
<p>Ein Beispiel mit gedachten Zahlen: Angebot A läuft ${h.P.foerderung.haltedauer_monate} Monate zu 279 € im Monat, Angebot B läuft 24 Monate zu 249 €. Auf den ersten Blick ist B günstiger. Für die Förderung ist B aber nur dann geeignet, wenn der Anbieter eine Verlängerung um zwölf Monate oder eine Übernahme zu einem festen Preis zusagt. Fehlt diese Zusage, müssten Sie nach 24 Monaten entweder zu Bedingungen verlängern, die Sie heute nicht kennen, oder das Auto zurückgeben und mit einer Rückforderung rechnen. Ein Haushalt mit ${h.eur(52000)} und einem Kind bekäme ${h.eur(b(52000, 1))}. Eine zeitanteilige Rückforderung für zwölf fehlende Monate läge in der Größenordnung von ${h.eur(Math.round(b(52000, 1) * 12 / h.P.foerderung.haltedauer_monate))}; das BAFA kann auch anders entscheiden. Der Vorteil von 30 € im Monat bei B wäre damit schnell aufgezehrt.</p>
<h2>Quote, Steuer und Einkommen beim Leasing</h2>
<p>Die THG-Prämie steht beim Leasing dem Halter zu, also in der Regel Ihnen. Sie können die Quote jedes Jahr selbst verkaufen; die Leasinggesellschaft hat darauf keinen Anspruch, solange sie nicht als Halter eingetragen ist. Die Kfz-Steuer schuldet ebenfalls der Halter; für ein Elektroauto mit Erstzulassung bis zum ${h.date(h.P.kfz.befreiung_zulassung_bis)} fällt sie in den ersten Jahren ohnehin nicht an. Beim Einkommen gibt es keine Besonderheit: Wer über der Grenze liegt, bekommt auch beim Leasing nichts, und ein Angebot, das mit der Förderung rechnet, wird dann teurer als beworben.</p>
<h2>Am Ende des Vertrags</h2>
<ul>
<li><strong>Rückgabe nach der Haltedauer:</strong> keine Meldung nötig, keine Rückforderung.</li>
<li><strong>Rückgabe vorher:</strong> Meldung an das BAFA, das über eine anteilige oder vollständige Rückforderung entscheidet; Einzelheiten unter ${h.a('haltedauer', 'Haltedauer und Verkauf')}.</li>
<li><strong>Verlängerung:</strong> Der Vertrag läuft weiter, das Auto bleibt auf Sie zugelassen. Lassen Sie sich die Verlängerung schriftlich bestätigen.</li>
<li><strong>Übernahme:</strong> Sie kaufen das Auto zum Restwert. Es bleibt auf Sie zugelassen, die Haltedauer läuft ohne Unterbrechung weiter.</li>
<li><strong>Wechsel auf ein neues Leasingauto:</strong> Das neue Auto kann nicht noch einmal gefördert werden, weil jede Person die Förderung nur einmal bekommt. Ein Partner im selben Haushalt, der noch keine Förderung hatte, könnte für ein eigenes Auto dagegen selbst einen Antrag stellen, sofern der Haushalt nicht schon zwei Anträge gestellt hat.</li>
</ul>
<h2>Gewerbe- und Dienstwagenleasing</h2>
<p>Ein Leasing über eine Firma ist ausgeschlossen, weil Antragsteller nur Privatpersonen sein können und das Auto nicht zum Betriebsvermögen gehören darf. Das gilt auch für einen Dienstwagen, den der Arbeitgeber least und Ihnen überlässt. Wie Selbstständige vorgehen, steht unter ${h.a('selbststaendige', 'Selbstständige und Firmenwagen')}. Wie Leasing mit Herstellerprämien zusammenspielt, zeigt ${h.a('kumulierung', 'Kaufprämie kombinieren')}.</p>
<h2>Prüfliste für Leasingkunden</h2>
<ol>
<li>Sie selbst als Halter in der Zulassungsbescheinigung Teil I eingetragen.</li>
<li>Laufzeit mindestens ${h.P.foerderung.haltedauer_monate} Monate oder eine Zusage für Verlängerung oder Übernahme.</li>
<li>Rückgabedatum nicht vor dem Ende der Haltedauer.</li>
<li>Leasingvertrag als PDF für den Antrag, vollständig und lesbar, mit allen Seiten einschließlich der Anlagen zur Laufzeit.</li>
<li>Ein Plan für das Vertragsende: Rückgabe, Verlängerung oder Übernahme, schriftlich festgehalten.</li>
<li>Antrag innerhalb von ${h.P.foerderung.antragsfrist_monate} Monaten nach der Zulassung, mit Ihrer eigenen Kontoverbindung.</li>
</ol>`,
  },
  en: {
    slug: 'leasing',
    nav: 'Leasing',
    card: 'The grant on a lease: who applies, why 24 months is not enough and what the grant means per month.',
    title: 'EV grant on a lease 2026: term, keeper and application',
    description: `EV grant on a leased car 2026: the same amount as buying, the keeper applies, ${F.haltedauer_monate} months of registration needed; what to do about a 24-month lease term.`,
    h1: 'The 2026 EV grant on a leased car',
    intro: 'Almost every second approved grant is for a leased car. What is different with leasing: who applies, how the lease term and holding period fit together, and where the money goes.',
    resume: `Germany’s 2026 EV grant applies to new cars that are leased just as it does to bought ones, with the same amounts and the same income limits. According to BAFA’s statistics of ${datumText(F.statistik_stand, 'en')}, ${EN.num(LEASING)} of ${EN.num(F.bewilligungen)} approvals were for leases and ${EN.num(KAUF)} for purchases. The application is made by the keeper (Halter), the person the car is registered to. With a private lease that is usually the lessee; the buyer or lessee and the keeper need not be the same person, though. If the leasing company is entered as keeper, the driver gets no grant. The ${F.haltedauer_monate}-month holding period applies whatever the lease term. A 24-month contract is therefore not enough: it must be extended or the car bought, or a claw-back may follow. BAFA pays into the keeper’s account, not to the leasing company. As a yardstick, a grant of ${EN.eur(b(40000))} spread over ${F.haltedauer_monate} months is ${EN.eur(b(40000) / F.haltedauer_monate, 2)} a month.`,
    faqs: [
      { q: 'Who applies for the EV grant on a leased car?', a: 'The keeper, the person named on part I of the registration certificate. With a private lease that is normally the lessee. BAFA makes clear that keeper and lessee need not be the same person. If the leasing company is entered as keeper, however, the driver cannot apply.' },
      { q: 'Is a 24-month lease enough for the grant?', a: `No, not on its own. BAFA requires the car to stay registered to you for ${F.haltedauer_monate} continuous months, however long the contract runs. With a 24-month term, 12 months are missing. You must extend the lease or buy the car at the end. Returning it after 24 months must be reported to BAFA.` },
      { q: 'Does the leasing company get the grant, or do I?', a: 'You do. BAFA pays into the keeper’s account given in the application. Payment to the leasing company or the dealer is not provided for, even if they apply with your power of attorney. What you do with the money is up to you; it is not set off against the lease rate automatically.' },
      { q: 'Is the grant lower on a lease than on a purchase?', a: 'No. The guideline makes no distinction between buying and leasing for the amounts. Only vehicle type, household income and number of children matter. Whether you pay cash, finance or lease makes no difference to the amount. The differences lie only in who is the keeper and in the term.' },
      { q: 'What if I return the leased car a few days early?', a: `Then the registration ends before the holding period is over, and that must be reported to BAFA. It is worth comparing the return date in the contract with the registration date. If the car was registered a few days after the contract started, a lease of exactly ${F.haltedauer_monate} months can end a few days too soon.` },
    ],
    body: (h) => `
<h2>Leasing is treated the same</h2>
<p>The ${h.src('richtlinie', 'funding guideline')} funds new cars that are bought or leased. ${h.src('bafaFaq', 'BAFA')} only says the vehicle must be acquired by purchase or lease; loan terms and other conditions play no part. The ${h.src('bafaStatistik', 'October 2026 statistics')} show how common leasing is:</p>
${h.table(['Acquisition', 'Approvals', 'Share'], [
  ['Purchase', h.num(KAUF), h.pct(KAUF / h.P.foerderung.bewilligungen)],
  ['Lease', h.num(LEASING), h.pct(LEASING / h.P.foerderung.bewilligungen)],
], `Approvals by acquisition type, as of ${h.date(h.P.foerderung.statistik_stand)}`, ['l', 'r', 'r'])}
<h2>Keeper, lessee, applicant</h2>
<p>A lease has three roles that can differ: the lessee who signs the contract, the keeper named on part I of the registration certificate (Zulassungsbescheinigung Teil I), and the owner, which is the leasing company. For the grant, only the keeper counts. The keeper applies, receives the money and must keep to the holding period.</p>
${h.table(['Case', 'Keeper on the certificate', 'Grant possible'], [
  ['Private lease, you are entered', 'you', 'yes'],
  ['Private lease, partner signs, you are entered', 'you', 'yes, you apply'],
  ['Leasing company registers the car to itself', 'leasing company', 'no'],
  ['Business lease through your company', 'company', 'no'],
], 'Who can apply on a lease', ['l', 'l', 'l'])}
<h2>Lease term and holding period</h2>
<p>The car must stay registered to you for ${h.P.foerderung.haltedauer_monate} continuous months. Many lease offers are shorter. The table shows what that means.</p>
${h.table(['Term', 'Months missing', 'What to do'], laufzeiten.map((t) => [`${t} months`, String(Math.max(0, h.P.foerderung.haltedauer_monate - t)), t < h.P.foerderung.haltedauer_monate ? 'extend or buy the car' : 'compare the return date with the registration day']), 'Lease term against the holding period', ['l', 'r', 'l'])}
<p>With a term of exactly ${h.P.foerderung.haltedauer_monate} months, the days matter. An example: the car is registered on ${h.date(zul)}, and the holding period runs until ${h.date(haltenBis)}. If the contract only starts at handover on ${h.date('2026-11-05')}, it ends on ${h.date(rueckgabe36)}, after the holding period. Had the car been registered only after the contract began and you return it on the last contract day, a few days could be missing. To be safe, agree a return date no earlier than the day after the holding period ends.</p>
<h2>The grant against the monthly rate</h2>
<p>BAFA pays the grant as a lump sum into your account, not as a reduction of the rate. To compare it with a lease offer, you can spread it over the months of the holding period:</p>
${h.table(['Household income', 'Children', 'Grant', `Per month over ${h.P.foerderung.haltedauer_monate} months`], [[38000, 0], [52000, 1], [72000, 2], [86000, 2]].map(([zv, k]) => [h.eur(zv), String(k), h.eur(b(zv, k)), h.eur(b(zv, k) / h.P.foerderung.haltedauer_monate, 2)]), 'Grant for a leased battery electric car, spread per month', ['r', 'r', 'r', 'r'])}
<p>Some offers count the grant in as a special payment that you make once the money arrives. That is an agreement between you and the provider; BAFA still pays you. Read such offers carefully for what happens if the grant is not approved, for example because income is over the limit or funding stops.</p>
<h2>Two offers compared</h2>
<p>An example with made-up figures: offer A runs ${h.P.foerderung.haltedauer_monate} months at €279 a month, offer B runs 24 months at €249. At first sight B is cheaper. For the grant, though, B only works if the provider commits to a twelve-month extension or a buyout at a fixed price. Without that commitment, after 24 months you would have to extend on terms you do not know today, or return the car and expect a claw-back. A household on ${h.eur(52000)} with one child would get ${h.eur(b(52000, 1))}. A pro rata claw-back for twelve missing months would be around ${h.eur(Math.round(b(52000, 1) * 12 / h.P.foerderung.haltedauer_monate))}; BAFA may decide differently. B’s €30 a month advantage would soon be gone.</p>
<h2>Quota, tax and income on a lease</h2>
<p>On a lease, the GHG quota payout belongs to the keeper, usually you. You can sell the quota yourself every year; the leasing company has no claim to it unless it is entered as keeper. Vehicle tax is also owed by the keeper, and for an electric car first registered by ${h.date(h.P.kfz.befreiung_zulassung_bis)} there is none for years anyway. Income works no differently: above the limit there is no grant on a lease either, and an offer that counts on the grant then costs more than advertised.</p>
<h2>At the end of the lease</h2>
<ul>
<li><strong>Return after the holding period:</strong> no report needed, no claw-back.</li>
<li><strong>Return earlier:</strong> report to BAFA, which decides on a partial or full claw-back; details under ${h.a('haltedauer', 'holding period and resale')}.</li>
<li><strong>Extension:</strong> the contract continues and the car stays registered to you. Get the extension confirmed in writing.</li>
<li><strong>Buyout:</strong> you buy the car at its residual value. It stays registered to you and the holding period runs on without a break.</li>
<li><strong>Switching to a new leased car:</strong> the new car cannot be funded again, because each person receives the grant only once. A partner in the same household who has not had a grant could apply for a car of their own.</li>
</ul>
<h2>Business and company car leases</h2>
<p>A lease through a company is excluded, because only private individuals can apply and the car may not be a business asset. That also applies to a company car your employer leases and lets you use. How the self-employed should proceed is under ${h.a('selbststaendige', 'self-employed and company cars')}. How leasing works with manufacturer bonuses is shown in ${h.a('kumulierung', 'combining bonuses')}.</p>
<h2>Checklist for leasing customers</h2>
<ol>
<li>You are entered as keeper on part I of the registration certificate.</li>
<li>A term of at least ${h.P.foerderung.haltedauer_monate} months, or a commitment to extend or buy.</li>
<li>Return date no earlier than the end of the holding period.</li>
<li>The lease contract as a PDF for the application, complete with all pages.</li>
<li>A written plan for the end of the lease: return, extension or buyout.</li>
<li>Apply within ${h.P.foerderung.antragsfrist_monate} months of registration, with your own bank details.</li>
</ol>`,
  },
});
