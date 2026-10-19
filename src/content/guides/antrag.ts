import { defineGuide } from '../../lib/guide-types';
import { fristen } from '../../lib/engine/foerderung';
import { datumText } from '../../lib/engine/datum';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Antrag Schritt für Schritt: erst nach der Zulassung, höchstens 12 Monate danach, Förderzentrale mit BundID
 * (Online-Ausweis oder ELSTER-Zertifikat), Unterlagen als PDF, Vollmacht, Auszahlung an den Halter,
 * Reihenfolge des Eingangs, kein Rechtsanspruch, Aufbewahrung 5 Jahre.
 */
const F = P.foerderung;
const beispiele = ['2026-03-12', '2026-11-30', '2027-06-30', '2029-12-31'];

export default defineGuide({
  id: 'antrag',
  group: 'antrag',
  order: 10,
  mini: 'aUnterlagen',
  related: ['haltedauer', 'haushaltseinkommen', 'kinder', 'statistik', 'zuzug'],
  sources: ['bafaAntrag', 'bafaFaq', 'bafaMerkblatt', 'foerderzentrale', 'bundid'],
  de: {
    slug: 'antrag-stellen',
    nav: 'Antrag stellen',
    card: 'Der Antrag Schritt für Schritt: BundID, Unterlagen, Fristen, Vollmacht und Auszahlung.',
    title: 'E-Auto-Förderung Antrag 2026: BundID, Unterlagen, Fristen',
    description: `E-Auto-Förderung Antrag 2026: erst nach der Zulassung, spätestens ${F.antragsfrist_monate} Monate danach, online mit BundID; welche PDFs Sie brauchen und wann das Geld kommt.`,
    h1: 'Den Antrag auf E-Auto-Förderung 2026 stellen',
    intro: 'Vom Konto bei der BundID bis zur Auszahlung: welche Schritte in welcher Reihenfolge nötig sind, welche Unterlagen das BAFA sehen will und wo Anträge am häufigsten hängen bleiben.',
    resume: `Den Antrag auf E-Auto-Förderung 2026 stellen Sie online über das Portal der Förderzentrale des Bundes, und zwar erst, wenn das Auto auf Sie zugelassen ist. Vorher ist kein Antrag und keine Reservierung möglich. Danach haben Sie ${F.antragsfrist_monate} Monate Zeit; maßgeblich ist das Datum der Zulassung, nicht das des Kaufvertrags. Für die Anmeldung brauchen Sie ein BundID-Konto mit Online-Ausweis oder ELSTER-Zertifikat; eine einfache Registrierung mit Benutzername und Passwort genügt nicht. Hochgeladen werden als PDF mit höchstens ${F.pdf_max_mb} MB je Datei: die ${F.bescheide_je_person} aktuellsten Einkommensteuerbescheide jeder erwachsenen Person im Haushalt, die Zulassungsbescheinigung Teil I, der Kauf- oder Leasingvertrag, bei Kindern ein Kindergeldnachweis und bei einem Plug-in-Hybrid über ${F.phev_co2_max_g_km} g CO2/km das CoC. Das BAFA bearbeitet vollständige Anträge in der Reihenfolge des Eingangs und zahlt wenige Wochen nach dem Zuwendungsbescheid auf das Konto des Halters. Einen Rechtsanspruch gibt es nicht; die Förderung steht unter dem Vorbehalt verfügbarer Mittel. Am ${datumText(F.statistik_stand, 'de')} waren ${DE.num(F.bewilligungen)} Anträge bewilligt.`,
    faqs: [
      { q: 'Kann ich die E-Auto-Förderung schon vor dem Kauf beantragen?', a: 'Nein. Der Antrag ist erst möglich, wenn das Neufahrzeug auf Sie zugelassen ist. Eine Reservierung von Mitteln vor dem Kauf oder vor der Zulassung gibt es nicht. Wer wissen will, wie viel er bekommt, kann das vorher nur selbst rechnen. Ob dann noch Mittel da sind, lässt sich vorab nicht sichern.' },
      { q: 'Welche BundID brauche ich für den Antrag beim BAFA?', a: 'Ein BundID-Konto mit der Option Online-Ausweis, also dem Personalausweis oder Aufenthaltstitel mit aktivierter Online-Funktion, oder mit der Option ELSTER-Zertifikat. Beide erreichen das nötige Vertrauensniveau, hoch oder substantiell. Eine Basisregistrierung mit Benutzername und Passwort reicht nicht, weil sie keine sichere Identifizierung erlaubt.' },
      { q: 'Darf das Autohaus den Förderantrag für mich stellen?', a: 'Ja, mit Ihrer Vollmacht. Die bevollmächtigte Person oder das Autohaus meldet sich mit eigener BundID oder mit „Mein Unternehmenskonto“ an und lädt die Vollmacht im Antrag hoch. Als Kontoverbindung muss trotzdem Ihre angegeben werden, die des Halters. Eine Auszahlung an das Autohaus ist nicht vorgesehen.' },
      { q: 'Welche Seiten des Steuerbescheids muss ich hochladen?', a: 'Nur die Seiten mit Adressat, Steuer-ID, Datum, Steuerjahr und der Höhe des zu versteuernden Einkommens. Alle übrigen Seiten braucht das BAFA nicht. Schwärzen Sie auf der Kopie alles, was nicht benötigt wird, aber niemals auf dem Original. Scans vom Smartphone sind zulässig, solange keine Seite abgeschnitten ist.' },
      { q: 'Wie lange dauert es bis zur Auszahlung der Förderung?', a: 'Das BAFA prüft vollständige Anträge in der Reihenfolge, in der sie eingehen, und erlässt dann einen Zuwendungsbescheid. Die Auszahlung folgt nach Angaben des BAFA innerhalb weniger Wochen nach diesem Bescheid. Fehlende oder unlesbare Unterlagen verlängern die Bearbeitung, weil das BAFA dann nachfordern muss.' },
      { q: 'Was passiert, wenn das Geld für die Förderung ausgeht?', a: 'Auf die Förderung besteht kein Rechtsanspruch. Sie wird aus dem Klima- und Transformationsfonds bezahlt, solange Mittel verfügbar sind, und kann vorzeitig enden. Bei einem Förderstopp würden Anträge nach dem Stichtag nicht mehr bewilligt. Wann das wäre, lässt sich nicht vorhersagen; einen angekündigten Termin gibt es nicht.' },
    ],
    body: (h) => `
<h2>Die Reihenfolge, die zählt</h2>
<ol>
<li><strong>Einkommen prüfen.</strong> Haushaltseinkommen aus den Bescheiden berechnen und mit der Grenze für Ihre Kinderzahl vergleichen. Der ${h.a('home', 'Prämienrechner')} macht das in einem Schritt.</li>
<li><strong>BundID einrichten.</strong> Ein ${h.src('bundid', 'BundID-Konto')} mit Online-Ausweis oder ELSTER-Zertifikat anlegen. Das dauert mit ELSTER wegen des Briefs mit dem Aktivierungscode einige Tage.</li>
<li><strong>Auto kaufen oder leasen.</strong> Ein neues Fahrzeug der Klasse M1, das noch nie zugelassen war.</li>
<li><strong>Zulassen.</strong> Auf Sie persönlich, in Deutschland. Ab diesem Tag laufen die Antragsfrist und die Haltedauer.</li>
<li><strong>Antrag stellen.</strong> Über die ${h.src('foerderzentrale', 'Förderzentrale des Bundes')}, mit allen Unterlagen als PDF.</li>
<li><strong>Zuwendungsbescheid abwarten.</strong> Das BAFA prüft in der Reihenfolge des Eingangs.</li>
<li><strong>Auszahlung.</strong> Wenige Wochen nach dem Bescheid auf das Konto des Halters.</li>
<li><strong>Halten und aufbewahren.</strong> ${h.P.foerderung.haltedauer_monate} Monate Zulassung, Unterlagen ${h.P.foerderung.aufbewahrung_jahre} Jahre aufheben.</li>
</ol>
<h2>Die Antragsfrist</h2>
<p>Der Antrag muss spätestens ${h.P.foerderung.antragsfrist_monate} Monate nach der Zulassung auf Sie gestellt werden. Das ${h.src('bafaFaq', 'BAFA')} stellt klar, dass das Datum der Zulassung zählt, nicht das Datum des Kauf- oder Leasingvertrags. Die Tabelle zeigt einige Beispiele, gerechnet mit dem Rechenkern dieser Seite.</p>
${h.table(['Zulassung', 'Antrag spätestens', 'Haltedauer bis'], beispiele.map((d) => [h.date(d), h.date(fristen(d).antragBis), h.date(fristen(d).haltenBis)]), 'Antragsfrist und Haltedauer nach dem Tag der Zulassung', ['l', 'r', 'r'])}
<p>Auch wer früh dran sein will, kann nichts vorziehen: Ein Antrag vor der Zulassung wird nicht angenommen. Umgekehrt ist es kein Nachteil, ein paar Wochen nach der Zulassung zu beantragen, wenn dafür alle Unterlagen vollständig sind. Weil das BAFA vollständige Anträge in der Reihenfolge des Eingangs bearbeitet, zählt Vollständigkeit mehr als Schnelligkeit.</p>
<h2>Die Unterlagen</h2>
<p>Das ${h.src('bafaMerkblatt', 'Merkblatt zu den Nachweisunterlagen')} und die Seite ${h.src('bafaAntrag', 'Antrag vorbereiten')} nennen, was hochgeladen wird. Alles muss als PDF vorliegen, höchstens ${h.P.foerderung.pdf_max_mb} MB je Datei, mehrere Dateien sind möglich.</p>
${h.table(['Unterlage', 'Wann', 'Was lesbar sein muss'], [
  ['Einkommensteuerbescheide', `immer, ${h.P.foerderung.bescheide_je_person} je erwachsener Person`, 'Adressat, Steuer-ID, Datum, Steuerjahr, zu versteuerndes Einkommen'],
  ['Zulassungsbescheinigung Teil I', 'immer', 'vollständig, Vorder- und Rückseite'],
  ['Kauf- oder Leasingvertrag', 'immer', 'vollständig'],
  ['Kindergeldnachweis', 'bei Kindern unter 18', 'Empfänger, Name und Geburtsdatum des Kindes, Kindergeldnummer, Datum, Anschrift'],
  ['CoC des Fahrzeugs', `bei Plug-in-Hybrid über ${h.P.foerderung.phev_co2_max_g_km} g CO2/km`, 'elektrische Reichweite unter 49.⁠5'],
  ['Vollmacht', 'wenn eine andere Person beantragt', 'vom Halter unterschrieben'],
], 'Was das BAFA für den Antrag braucht', ['l', 'l', 'l'])}
<p>Bei gemeinsam veranlagten Ehepaaren genügt je Jahr der gemeinsame Bescheid für beide. Dokumente müssen auf Deutsch sein oder als beglaubigte Übersetzung vorliegen. Wer keinen Scanner hat, kann mit dem Smartphone scannen; das BAFA hat dafür Anleitungen veröffentlicht. Achten Sie darauf, dass keine Seite abgeschnitten wird und Schwärzungen nur auf der Kopie stehen.</p>
<p>Der Mini-Rechner oben zählt, wie viele Dateien Ihr Haushalt braucht, und zeigt die Antragsfrist für Ihren Zulassungsmonat.</p>
<h2>Die BundID</h2>
<p>Die Anmeldung im Antragsportal setzt eine digitale Identität mit ausreichendem Vertrauensniveau voraus. Zwei Wege sind zugelassen:</p>
<ul>
<li><strong>Online-Ausweis</strong>: Personalausweis, elektronischer Aufenthaltstitel oder eID-Karte mit aktivierter Online-Funktion und sechsstelliger PIN, ausgelesen mit Smartphone oder Kartenleser.</li>
<li><strong>ELSTER-Zertifikat</strong>: die Zertifikatsdatei aus dem ELSTER-Konto, das viele für die Steuererklärung ohnehin haben.</li>
</ul>
<p>Wer seine PIN vergessen hat, kann beim Bürgeramt eine neue setzen lassen. Wer noch kein ELSTER-Konto hat, sollte für den Brief mit dem Aktivierungscode etwa zwei Wochen einplanen.</p>
<h2>Vollmacht und Auszahlung</h2>
<p>Sie können eine andere Person oder ein Autohaus bevollmächtigen, den Antrag für Sie zu stellen. Die bevollmächtigte Person meldet sich mit ihrem eigenen BundID-Konto oder, als Unternehmen, mit „Mein Unternehmenskonto“ an und lädt die Vollmacht hoch. Als Kontoverbindung wird in jedem Fall die des Halters angegeben. Antragsteller ist immer der Halter, also die Person, auf die das Auto zugelassen ist; Käufer oder Leasingnehmer können dagegen eine andere Person sein.</p>
<h2>Ein Beispiel von der Bestellung bis zum Geld</h2>
<p>Familie Becker bestellt im Juli ein Elektroauto. Während sie auf die Lieferung wartet, richtet sie die BundID mit dem Online-Ausweis ein und sucht die Bescheide beider Partner für die letzten zwei Jahre heraus. Am ${h.date('2026-11-30')} wird das Auto zugelassen. Zwei Tage später stellt sie den Antrag: vier Bescheide, die Zulassungsbescheinigung, den Kaufvertrag und die Kindergeldbescheinigung, alles als PDF unter ${h.P.foerderung.pdf_max_mb} MB. Bis zum ${h.date(fristen('2026-11-30').antragBis)} hätte sie Zeit gehabt. Das BAFA bearbeitet den vollständigen Antrag, schickt den Zuwendungsbescheid, und einige Wochen später ist das Geld auf dem Konto. Das Auto muss bis zum ${h.date(fristen('2026-11-30').haltenBis)} auf sie zugelassen bleiben.</p>
<h2>Wo Anträge hängen bleiben</h2>
<ul>
<li>Ein Bescheid fehlt, etwa der des Partners in einer eheähnlichen Gemeinschaft.</li>
<li>Der Bescheid ist älter als ${h.P.foerderung.bescheid_max_alter_jahre} Steuerjahre oder nicht der aktuellste.</li>
<li>Der Name in der Zulassungsbescheinigung stimmt nicht mit dem Antragsteller überein.</li>
<li>Eine Datei ist größer als ${h.P.foerderung.pdf_max_mb} MB oder kein PDF.</li>
<li>Das Fahrzeug war schon zugelassen, etwa als Tageszulassung; dann ist es nicht förderfähig.</li>
<li>Die Kontoverbindung gehört nicht dem Halter.</li>
</ul>
<h2>Was der Antrag nicht prüft</h2>
<p>Einige Fragen stellt das Antragsformular gar nicht, obwohl sie oft gestellt werden. Der Preis des Autos spielt keine Rolle, eine Preisobergrenze gibt es nicht. Es gibt keine amtliche Liste förderfähiger Modelle; förderfähig ist jedes neue Elektroauto der Klasse M1 und jeder Plug-in-Hybrid, der die technischen Grenzen einhält. Wo Sie das Auto gekauft haben, ist gleich, solange die Erstzulassung in Deutschland ist. Und wie Sie es bezahlen, ob bar, finanziert oder geleast, ändert nichts.</p>
<h2>Nach der Bewilligung</h2>
<p>Mit dem Zuwendungsbescheid beginnen Pflichten, die bis zum Ende der Haltedauer gelten. Das Auto muss ${h.P.foerderung.haltedauer_monate} Monate durchgehend auf Sie in Deutschland zugelassen bleiben. Ein Verkauf, eine Abmeldung, ein Totalschaden oder ein Diebstahl in dieser Zeit ist dem BAFA zu melden. Was dann geschieht, steht unter ${h.a('haltedauer', 'Haltedauer und Verkauf')}. Bewahren Sie alle Unterlagen ${h.P.foerderung.aufbewahrung_jahre} Jahre auf. Wie viele Anträge bisher bewilligt wurden und wie sie sich verteilen, zeigt ${h.a('statistik', 'die Statistik der Bewilligungen')}.</p>`,
  },
  en: {
    slug: 'how-to-apply',
    nav: 'How to apply',
    card: 'The application step by step: BundID, documents, deadlines, power of attorney and payment.',
    title: 'EV grant application 2026: BundID, documents and deadlines',
    description: `How to apply for the German EV grant 2026: only after registration, within ${F.antragsfrist_monate} months, online with BundID; the PDFs you need and when the money arrives.`,
    h1: 'Applying for the 2026 EV grant',
    intro: 'From setting up BundID to the payment: which steps come in which order, which documents BAFA wants to see, and where applications most often get stuck.',
    resume: `You apply for Germany’s 2026 EV grant online through the federal funding portal (Förderzentrale), and only once the car is registered to you. Before that, no application and no reservation is possible. After it you have ${F.antragsfrist_monate} months; the registration date counts, not the date of the purchase contract. To log in you need a BundID account with the online ID function (Online-Ausweis) or an ELSTER certificate; a basic sign-up with username and password is not enough. You upload PDFs of at most ${F.pdf_max_mb} MB each: the ${F.bescheide_je_person} most recent income tax assessments (Einkommensteuerbescheid) of every adult in the household, part I of the registration certificate (Zulassungsbescheinigung Teil I), the purchase or lease contract, proof of Kindergeld if you have children, and for a plug-in hybrid above ${F.phev_co2_max_g_km} g CO2/km the certificate of conformity (CoC). BAFA processes complete applications in order of arrival and pays into the keeper’s account a few weeks after the grant notice (Zuwendungsbescheid). There is no legal entitlement; the grant depends on available funds. By ${datumText(F.statistik_stand, 'en')}, ${EN.num(F.bewilligungen)} applications had been approved.`,
    faqs: [
      { q: 'Can I apply for the EV grant before buying the car?', a: 'No. You can only apply once the new car is registered to you. There is no way to reserve funds before buying or registering. If you want to know how much you will get, you can only work it out yourself beforehand. Whether funds will still be available cannot be secured in advance.' },
      { q: 'Which BundID do I need for the BAFA application?', a: 'A BundID account with the online ID option, meaning an ID card or residence permit with the online function activated, or with the ELSTER certificate option. Both reach the required level of trust. A basic registration with username and password is not enough, because it does not allow secure identification.' },
      { q: 'Can the car dealer submit the grant application for me?', a: 'Yes, with your power of attorney (Vollmacht). The authorised person or dealer logs in with their own BundID or “Mein Unternehmenskonto” and uploads the power of attorney with the application. Your bank details as keeper must still be given. Payment to the dealer is not provided for.' },
      { q: 'Which pages of the tax assessment do I upload?', a: 'Only the pages showing the addressee, tax ID, date, tax year and the amount of taxable income. BAFA does not need the rest. Black out everything not needed on the copy, never on the original. Smartphone scans are accepted as long as no page is cut off.' },
      { q: 'How long until the grant is paid?', a: 'BAFA checks complete applications in the order they arrive and then issues a grant notice. According to BAFA, payment follows within a few weeks of that notice. Missing or illegible documents lengthen processing, because BAFA then has to ask for them.' },
      { q: 'What happens if the money for the grant runs out?', a: 'There is no legal entitlement to the grant. It is paid from the Climate and Transformation Fund while funds last and can end early. In a funding stop, applications after the cut-off would no longer be approved. When that might be cannot be predicted; no date has been announced.' },
    ],
    body: (h) => `
<h2>The order that matters</h2>
<ol>
<li><strong>Check your income.</strong> Work out household income from the assessments and compare it with the limit for your number of children. The ${h.a('home', 'grant calculator')} does this in one step.</li>
<li><strong>Set up BundID.</strong> Create a ${h.src('bundid', 'BundID account')} with the online ID function or an ELSTER certificate. With ELSTER this takes a few days because of the letter with the activation code.</li>
<li><strong>Buy or lease the car.</strong> A new M1 passenger car that has never been registered.</li>
<li><strong>Register it.</strong> To you personally, in Germany. The application deadline and holding period start that day.</li>
<li><strong>Apply.</strong> Through the ${h.src('foerderzentrale', 'federal funding portal')}, with all documents as PDFs.</li>
<li><strong>Wait for the grant notice.</strong> BAFA checks in order of arrival.</li>
<li><strong>Payment.</strong> A few weeks after the notice, into the keeper’s account.</li>
<li><strong>Keep the car and the papers.</strong> ${h.P.foerderung.haltedauer_monate} months of registration, documents kept for ${h.P.foerderung.aufbewahrung_jahre} years.</li>
</ol>
<h2>The application deadline</h2>
<p>You must apply within ${h.P.foerderung.antragsfrist_monate} months of the car being registered to you. ${h.src('bafaFaq', 'BAFA')} makes clear that the registration date counts, not the date of the purchase or lease contract. The table shows some examples, worked out by this site’s engine.</p>
${h.table(['Registration', 'Apply by', 'Hold until'], beispiele.map((d) => [h.date(d), h.date(fristen(d).antragBis), h.date(fristen(d).haltenBis)]), 'Application deadline and holding period by registration date', ['l', 'r', 'r'])}
<p>However keen you are, nothing can be brought forward: an application before registration is not accepted. Equally, there is no disadvantage in applying a few weeks after registration if your documents are then complete. Because BAFA handles complete applications in order of arrival, completeness counts for more than speed.</p>
<h2>The documents</h2>
<p>BAFA’s ${h.src('bafaMerkblatt', 'leaflet on supporting documents')} and its page on ${h.src('bafaAntrag', 'preparing the application')} list what to upload. Everything must be PDF, at most ${h.P.foerderung.pdf_max_mb} MB per file; several files are fine.</p>
${h.table(['Document', 'When', 'What must be legible'], [
  ['Income tax assessments', `always, ${h.P.foerderung.bescheide_je_person} per adult`, 'addressee, tax ID, date, tax year, taxable income'],
  ['Registration certificate part I', 'always', 'complete, front and back'],
  ['Purchase or lease contract', 'always', 'complete'],
  ['Kindergeld proof', 'with children under 18', 'recipient, child’s name and date of birth, Kindergeld number, date, address'],
  ['Vehicle CoC', `plug-in hybrid above ${h.P.foerderung.phev_co2_max_g_km} g CO2/km`, 'electric range under item 49.⁠5'],
  ['Power of attorney', 'if someone else applies', 'signed by the keeper'],
], 'What BAFA needs for the application', ['l', 'l', 'l'])}
<p>For married couples assessed jointly, one joint assessment per year covers both. Documents must be in German or come with a certified translation. Without a scanner you can scan with a smartphone; BAFA has published instructions for this. Make sure no page is cut off and that black-outs are only on the copy.</p>
<p>The small calculator above counts how many files your household needs and shows the application deadline for your registration month.</p>
<h2>BundID</h2>
<p>Logging in to the application portal requires a digital identity with a sufficient level of trust. Two routes are accepted:</p>
<ul>
<li><strong>Online ID function</strong>: German ID card, electronic residence permit or eID card with the online function activated and a six-digit PIN, read by a smartphone or card reader.</li>
<li><strong>ELSTER certificate</strong>: the certificate file from your ELSTER account, which many people already have for their tax return.</li>
</ul>
<p>If you have forgotten your PIN, the citizens’ office (Bürgeramt) can set a new one. If you have no ELSTER account yet, allow about two weeks for the letter with the activation code.</p>
<h2>Power of attorney and payment</h2>
<p>You can authorise another person or a dealer to apply for you. The authorised person logs in with their own BundID account or, as a business, with “Mein Unternehmenskonto”, and uploads the power of attorney. The bank details given are always the keeper’s. The applicant is always the keeper (Halter), the person the car is registered to; the buyer or lessee, on the other hand, can be someone else.</p>
<h2>An example from order to payment</h2>
<p>The Becker family orders an electric car in July. While waiting for delivery they set up BundID with the online ID function and gather both partners’ assessments for the last two years. The car is registered on ${h.date('2026-11-30')}. Two days later they apply with four assessments, the registration certificate, the contract and the Kindergeld certificate. They would have had until ${h.date(fristen('2026-11-30').antragBis)}. A few weeks after the grant notice the money arrives, and the car must stay registered to them until ${h.date(fristen('2026-11-30').haltenBis)}.</p>
<h2>Where applications get stuck</h2>
<ul>
<li>An assessment is missing, such as the partner’s in an unmarried couple.</li>
<li>An assessment is more than ${h.P.foerderung.bescheid_max_alter_jahre} tax years old or not the most recent.</li>
<li>The name on the registration certificate does not match the applicant.</li>
<li>A file is larger than ${h.P.foerderung.pdf_max_mb} MB or not a PDF.</li>
<li>The car was already registered, for example as a pre-registration; it then does not qualify.</li>
<li>The bank account does not belong to the keeper.</li>
</ul>
<h2>After approval</h2>
<p>The grant notice brings obligations that last until the end of the holding period. The car must stay registered to you in Germany for ${h.P.foerderung.haltedauer_monate} continuous months. A sale, deregistration, write-off or theft in that time must be reported to BAFA. What follows is under ${h.a('haltedauer', 'holding period and resale')}. Keep all documents for ${h.P.foerderung.aufbewahrung_jahre} years. How many applications have been approved so far and how they break down is shown in ${h.a('statistik', 'the approval statistics')}.</p>`,
  },
});
