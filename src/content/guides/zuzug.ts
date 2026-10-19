import { defineGuide } from '../../lib/guide-types';
import { foerderung, haushaltsZvE, fristen } from '../../lib/engine/foerderung';
import { P, DE, EN } from '../../lib/fmt';

/**
 * Neu in Deutschland: Staatsangehörigkeit egal, Hauptwohnsitz in Deutschland, Erstzulassung in Deutschland,
 * zwei deutsche Einkommensteuerbescheide je Person (freiwillige Veranlagung möglich), Dokumente auf Deutsch
 * oder beglaubigt übersetzt, BundID mit Online-Ausweis oder ELSTER, Wegzug in der Haltedauer = Rückforderung.
 * Unsicher (vom BAFA nicht beantwortet): Nachweis für ein Jahr ohne Wohnsitz in Deutschland.
 */
const F = P.foerderung;
const z = '2026-11-01';
const b = (zve: number, kinder = 0) => foerderung({ zve, kinder, antrieb: 'bev', zulassung: z }).betrag;
// Priya: Zuzug im Juli 2025, Bescheid 2025 über 31 000 (nur deutsche Monate), 2026 voll 74 000; Partner ohne Einkommen, ein Kind.
const zuzug = haushaltsZvE([[31000, 74000], [0, 0]]);
const spaeter = haushaltsZvE([[74000, 76000], [0, 0]]);
const f = fristen(z);

export default defineGuide({
  id: 'zuzug',
  group: 'foerderung',
  order: 70,
  mini: 'fZuzug',
  related: ['haushaltseinkommen', 'antrag', 'haltedauer', 'neuwagen', 'kinder'],
  sources: ['bafaFaq', 'bafaVoraussetzungen', 'bundid', 'foerderzentrale', 'richtlinie'],
  de: {
    slug: 'ohne-deutschen-steuerbescheid',
    nav: 'Neu in Deutschland',
    card: 'Förderung nach dem Umzug nach Deutschland: welche Bescheide zählen, BundID, Übersetzungen und Wegzug.',
    title: 'E-Auto-Förderung neu in Deutschland 2026: Bescheid, BundID',
    description: `E-Auto-Förderung neu in Deutschland 2026: Staatsangehörigkeit egal, nötig sind Hauptwohnsitz, zwei deutsche Steuerbescheide und ${F.haltedauer_monate} Monate Zulassung hier.`,
    h1: 'E-Auto-Förderung 2026 für Neuankömmlinge in Deutschland',
    intro: 'Wer erst seit kurzem in Deutschland lebt, kann die Förderung bekommen, stößt aber auf eigene Hürden: Steuerbescheide, digitale Identität, Übersetzungen und die Haltedauer.',
    resume: `Für die E-Auto-Förderung 2026 spielt die Staatsangehörigkeit keine Rolle. Antragsberechtigt ist, wer seinen Hauptwohnsitz in Deutschland hat und auf wen das neue Auto in Deutschland erstmals zugelassen wird. Wer im Ausland wohnt, ist ausgeschlossen. Die eigentliche Hürde für Zugezogene ist der Einkommensnachweis: Das BAFA verlangt für jede erwachsene Person im Haushalt die ${F.bescheide_je_person} aktuellsten Einkommensteuerbescheide eines deutschen Finanzamts. Im Jahr des Zuzugs steht im Bescheid nur das Einkommen, das in Deutschland zu versteuern war; ausländische Einkünfte aus der Zeit davor erhöhen höchstens den Steuersatz, nicht das zu versteuernde Einkommen. Ein Beispiel: Priya zieht im Juli 2025 nach Deutschland, ihr Bescheid 2025 zeigt ${DE.eur(31000)}, der für 2026 ${DE.eur(74000)}. Ihr Partner hat kein Einkommen und reicht Bescheide über ${DE.eur(0)} ein, ein Kind lebt im Haushalt. Das Haushaltseinkommen beträgt ${DE.eur(zuzug)}, die Förderung für ein Elektroauto ${DE.eur(b(zuzug, 1))}. Der Antrag läuft online mit BundID, Unterlagen müssen auf Deutsch oder beglaubigt übersetzt sein, und das Auto muss ${F.haltedauer_monate} Monate in Deutschland zugelassen bleiben.`,
    faqs: [
      { q: 'Bekomme ich die E-Auto-Förderung ohne deutsche Staatsangehörigkeit?', a: 'Ja. Die Staatsangehörigkeit ist für die Förderung ohne Bedeutung. Erforderlich sind ein Hauptwohnsitz in Deutschland und die erstmalige Zulassung des neuen Autos in Deutschland auf Sie. Wer dagegen im Ausland wohnt und in Deutschland nur einen Zweitwohnsitz hat, kann keinen Antrag stellen.' },
      { q: 'Ich habe erst einen deutschen Steuerbescheid: was nun?', a: 'Das BAFA verlangt zwei Bescheide je Person. Hatten Sie im Jahr davor in Deutschland kein Einkommen, nennt das BAFA den Weg einer freiwilligen Steuererklärung, die zu einem Bescheid über 0 € führen kann. Ob das für ein Jahr gilt, in dem Sie noch gar nicht in Deutschland gewohnt haben, beantwortet das BAFA nicht ausdrücklich; klären Sie das vor dem Antrag mit Finanzamt und BAFA.' },
      { q: 'Zählt mein ausländisches Einkommen für die Förderung mit?', a: 'Nur soweit es im deutschen Bescheid im zu versteuernden Einkommen steht. Einkünfte aus der Zeit vor dem Zuzug, die nach einem Doppelbesteuerungsabkommen im Ausland besteuert werden, erhöhen in Deutschland meist nur den Steuersatz über den Progressionsvorbehalt. Sie stehen dann nicht im zvE und zählen für die Förderung nicht. Maßgeblich ist allein die Zahl im Bescheid.' },
      { q: 'Wie bekomme ich als Neuankömmling eine BundID für den Antrag?', a: 'Sie brauchen ein BundID-Konto mit Online-Ausweis oder mit ELSTER-Zertifikat. Den Online-Ausweis haben Personalausweis, elektronischer Aufenthaltstitel und die eID-Karte für Bürger der EU. Ein ELSTER-Zertifikat bekommen Sie mit Ihrer Steuer-ID über das ELSTER-Portal, der Aktivierungscode kommt per Post. Benutzername und Passwort allein reichen nicht.' },
      { q: 'Was passiert mit der Förderung, wenn ich Deutschland wieder verlasse?', a: `Das Auto muss ${F.haltedauer_monate} Monate durchgehend auf Sie in Deutschland zugelassen bleiben. Ein Umzug ins Ausland mit dem Auto vor Ablauf dieser Zeit ist dem BAFA anzuzeigen, das dann über eine anteilige oder vollständige Rückforderung entscheidet. Wer nur für zwei Jahre nach Deutschland kommt, sollte das vor dem Kauf einplanen.` },
    ],
    body: (h) => `
<h2>Wer antragsberechtigt ist</h2>
<p>Das ${h.src('bafaFaq', 'BAFA')} hat zwei Fragen, die für Zugezogene entscheidend sind. Die erste: Spielt die Staatsangehörigkeit eine Rolle? Nein. Die zweite: Kann man aus dem Ausland beantragen? Auch nein, denn antragsberechtigt sind nur natürliche Personen mit Hauptwohnsitz in Deutschland. Dazu kommen die Bedingungen, die für alle gelten: ein Neuwagen der Klasse M1, die erstmalige Zulassung in Deutschland auf die antragstellende Person, ein Alter von mindestens ${h.P.foerderung.mindestalter} Jahren und ein Haushaltseinkommen unter der Grenze. Ob Sie mit einer Blauen Karte, einer Niederlassungserlaubnis, als EU-Bürger oder mit einem anderen Aufenthaltstitel hier leben, ist nicht gefragt.</p>
<h2>Die Steuerbescheide nach dem Zuzug</h2>
<p>Der Einkommensnachweis ist für Neuankömmlinge die größte Hürde. Das BAFA verlangt je erwachsener Person die ${h.P.foerderung.bescheide_je_person} aktuellsten Einkommensteuerbescheide, ausgestellt von einem deutschen Finanzamt. Lohnsteuerbescheinigungen, Gehaltsabrechnungen oder ausländische Steuerbescheide ersetzen sie nicht. Für Arbeitnehmer gibt es oft keine Pflicht zur Steuererklärung, aber eine Erklärung lohnt sich nach dem Zuzug ohnehin häufig, etwa wegen der Umzugskosten. Mit der Abgabe kommt auch der Bescheid.</p>
<p>Im Jahr des Zuzugs ist das zu versteuernde Einkommen meist niedrig, weil nur die Monate in Deutschland zählen. Einkünfte aus dem Ausland vor dem Umzug werden in vielen Fällen nach einem Doppelbesteuerungsabkommen dort besteuert und gehen in Deutschland nur über den Progressionsvorbehalt in den Steuersatz ein. Für die Förderung zählt das nicht, denn sie schaut allein auf das zvE im Bescheid.</p>
${h.table(['Zeitpunkt des Antrags', 'Bescheide Priya', 'Partner', 'Haushaltseinkommen', 'Förderung mit einem Kind'], [
  ['Frühjahr 2027', `${h.eur(31000)} (2025) und ${h.eur(74000)} (2026)`, `zweimal ${h.eur(0)}`, h.eur(zuzug), h.eur(b(zuzug, 1))],
  ['Ein Jahr später', `${h.eur(74000)} (2026) und ${h.eur(76000)} (2027)`, `zweimal ${h.eur(0)}`, h.eur(spaeter), h.eur(b(spaeter, 1))],
], 'Beispiel: Zuzug im Juli 2025, Elektroauto', ['l', 'l', 'l', 'r', 'r'])}
<p>Das Beispiel zeigt einen Effekt, der Zugezogene oft überrascht: Das halbe Jahr nach dem Umzug drückt den Durchschnitt, und der Haushalt bekommt eine Förderung, die ihm ein Jahr später nicht mehr zustünde. Weil der Antrag erst nach der Zulassung möglich ist, hängt das am Zeitpunkt der Zulassung und an den Bescheiden, die bis dahin vorliegen.</p>
<h2>Was das BAFA offenlässt</h2>
<p>Wer erst einen deutschen Bescheid hat, steht vor einer Frage, die das BAFA nicht ausdrücklich beantwortet. Für Personen, die bisher nur eine Erklärung abgegeben haben, weil sie zuvor kein eigenes Einkommen hatten, nennt es die freiwillige Erklärung, die zu einem Bescheid über ${h.eur(0)} führen kann. Ob sich das auf ein Jahr übertragen lässt, in dem Sie gar nicht in Deutschland gewohnt haben, hängt von Ihrer steuerlichen Lage in jenem Jahr ab. Diese Seite rechnet deshalb nur mit Bescheiden, die vorliegen, und empfiehlt, die Frage vor dem Antrag beim BAFA zu stellen. Bis dahin ist der sichere Weg, zu warten, bis zwei deutsche Bescheide da sind.</p>
<h2>Digitale Identität und Antrag</h2>
<p>Der Antrag läuft ausschließlich online über die ${h.src('foerderzentrale', 'Förderzentrale des Bundes')}. Anmelden können Sie sich nur mit einem ${h.src('bundid', 'BundID-Konto')} auf ausreichendem Vertrauensniveau:</p>
<ul>
<li><strong>Online-Ausweis</strong>: Personalausweis, elektronischer Aufenthaltstitel oder eID-Karte für Bürger der EU und des EWR, jeweils mit aktivierter Online-Funktion und PIN.</li>
<li><strong>ELSTER-Zertifikat</strong>: Mit Ihrer Steuer-Identifikationsnummer im ELSTER-Portal beantragen; der Aktivierungscode kommt per Post an Ihre deutsche Adresse.</li>
</ul>
<p>Eine BundID nur mit Benutzername und Passwort reicht nicht. Wer seine Steuererklärung ohnehin über ELSTER abgibt, hat mit dem Zertifikat beides in der Hand. Planen Sie für die Post mit dem Aktivierungscode etwa zwei Wochen ein, damit der Antrag nicht daran hängt.</p>
<h2>Unterlagen und Sprache</h2>
<p>Hochgeladen werden die Bescheide, die Zulassungsbescheinigung Teil I, der Kauf- oder Leasingvertrag und gegebenenfalls der Nachweis der Kinder, alles als PDF mit höchstens ${h.P.foerderung.pdf_max_mb} MB je Datei. Unterlagen müssen auf Deutsch sein oder als beglaubigte Übersetzung vorliegen. Das betrifft vor allem einen Kaufvertrag aus dem Ausland. Für Kinder zählt nur deutsches Kindergeld; ein Kinderbonus aus einem anderen Land ersetzt den Kindergeldnachweis nicht. Wer gerade erst Kindergeld beantragt hat, wartet am besten den Bescheid der Familienkasse ab, bevor er den Förderantrag stellt.</p>
<h2>Auto aus dem Ausland</h2>
<p>Wo ein Auto gekauft wird, ist nach Auskunft des BAFA gleich, auch außerhalb der EU. Entscheidend ist, dass es neu ist und ab dem ${h.date(h.P.foerderung.erstzulassung_ab)} in Deutschland erstmals zugelassen wird. Ein Auto, das Sie aus Ihrem Herkunftsland mitbringen und das dort schon zugelassen war, ist kein Neuwagen im Sinne der Richtlinie. Eine Kaufprämie eines anderen EU-Staates für dasselbe Auto schließt die deutsche Förderung aus. Mehr dazu unter ${h.a('neuwagen', 'Neuwagen, Tageszulassung und Auslandskauf')}.</p>
<h2>Haltedauer und befristete Aufenthalte</h2>
<p>Das Auto muss ${h.P.foerderung.haltedauer_monate} Monate durchgehend auf Sie in Deutschland zugelassen bleiben. Bei einer Zulassung am ${h.date(z)} endet diese Zeit am ${h.date(f.haltenBis)}. Wer mit einem befristeten Vertrag oder einer Entsendung kommt, sollte das gegen das geplante Ende des Aufenthalts legen. Ziehen Sie vorher mit dem Auto weg oder verkaufen es, müssen Sie das dem BAFA melden; es entscheidet im Einzelfall über eine anteilige oder vollständige Rückforderung. Einzelheiten unter ${h.a('haltedauer', 'Haltedauer und Verkauf')}.</p>
<h2>Prüfliste für Zugezogene</h2>
<ol>
<li>Hauptwohnsitz in Deutschland gemeldet, mit Meldebescheinigung, falls das BAFA nachfragt.</li>
<li>Zwei deutsche Einkommensteuerbescheide je erwachsener Person, oder eine Klärung mit BAFA und Finanzamt, wenn es nur einen gibt.</li>
<li>BundID mit Online-Ausweis oder ELSTER-Zertifikat eingerichtet.</li>
<li>Kaufvertrag auf Deutsch oder beglaubigt übersetzt.</li>
<li>Aufenthalt für mindestens ${h.P.foerderung.haltedauer_monate} Monate ab Zulassung geplant.</li>
<li>Antrag nach der Zulassung, spätestens bis zum ${h.date(f.antragBis)} bei einer Zulassung am ${h.date(z)}.</li>
</ol>
<p>Wie Partner und Kinder mitgerechnet werden, steht unter ${h.a('haushaltseinkommen', 'Haushaltseinkommen')} und ${h.a('kinder', 'Kinderbonus')}; den Ablauf im Portal beschreibt ${h.a('antrag', 'Antrag stellen')}.</p>`,
  },
  en: {
    slug: 'new-to-germany',
    nav: 'New to Germany',
    card: 'The grant after moving to Germany: which assessments count, BundID, translations and leaving again.',
    title: 'Expat EV grant in Germany 2026: tax assessments and BundID',
    description: `Expat EV grant in Germany 2026: nationality is irrelevant, but you need a main residence here, two German tax assessments and ${F.haltedauer_monate} months of German registration.`,
    h1: 'The 2026 EV grant for people new to Germany',
    intro: 'If you have only recently moved to Germany you can get the grant, but you will meet hurdles of your own: tax assessments, digital ID, translations and the holding period.',
    resume: `For Germany’s 2026 EV grant, nationality plays no part. You can apply if your main residence (Hauptwohnsitz) is in Germany and the new car is first registered to you in Germany. People living abroad are excluded. The real hurdle for newcomers is proof of income: BAFA asks for the ${F.bescheide_je_person} most recent income tax assessments (Einkommensteuerbescheid) from a German tax office for every adult in the household. In the year you arrive, the assessment only shows income taxable in Germany; foreign income from before the move at most raises the tax rate, not taxable income (zu versteuerndes Einkommen). An example: Priya moves to Germany in July 2025; her 2025 assessment shows ${EN.eur(31000)}, the 2026 one ${EN.eur(74000)}. Her partner has no income and submits assessments showing ${EN.eur(0)}, and one child lives with them. Household income is ${EN.eur(zuzug)}, the grant for a battery electric car ${EN.eur(b(zuzug, 1))}. You apply online with BundID, documents must be in German or a certified translation, and the car must stay registered in Germany for ${F.haltedauer_monate} months.`,
    faqs: [
      { q: 'Can I get the EV grant without German citizenship?', a: 'Yes. Nationality is irrelevant to the grant. You need a main residence in Germany and the new car must be first registered to you in Germany. If, on the other hand, you live abroad and only have a second home in Germany, you cannot apply.' },
      { q: 'I only have one German tax assessment: what now?', a: 'BAFA asks for two assessments per person. If you had no income in Germany the year before, BAFA points to a voluntary tax return, which can lead to an assessment showing €0. Whether that works for a year in which you did not live in Germany at all is not expressly answered by BAFA; clarify it with the tax office and BAFA before applying.' },
      { q: 'Does my foreign income count towards the grant?', a: 'Only as far as it appears in taxable income on the German assessment. Income from before your move that is taxed abroad under a double taxation agreement usually only raises your German tax rate through the progression clause (Progressionsvorbehalt). It is then not part of taxable income and does not count for the grant. Only the figure on the assessment matters.' },
      { q: 'How do I get a BundID as a newcomer to apply?', a: 'You need a BundID account with the online ID function or with an ELSTER certificate. The online ID function comes with the German ID card, the electronic residence permit (eAT) and the eID card for EU citizens. An ELSTER certificate is requested on the ELSTER portal with your tax ID, and the activation code arrives by post. Username and password alone are not enough.' },
      { q: 'What happens to the grant if I leave Germany again?', a: `The car must stay registered to you in Germany for ${F.haltedauer_monate} continuous months. Moving abroad with the car before then must be reported to BAFA, which decides on a partial or full claw-back. If you are only coming to Germany for two years, plan for this before you buy.` },
    ],
    body: (h) => `
<h2>Who can apply</h2>
<p>${h.src('bafaFaq', 'BAFA')} has two questions that decide things for newcomers. First: does nationality matter? No. Second: can you apply from abroad? Also no, because only natural persons with a main residence in Germany are eligible. On top come the conditions that apply to everyone: a new M1 passenger car, first registration in Germany to the applicant, a minimum age of ${h.P.foerderung.mindestalter}, and household income under the limit. Whether you live here on an EU Blue Card, a settlement permit, as an EU citizen or with another residence title is not asked.</p>
<h2>Tax assessments after the move</h2>
<p>Proof of income is the biggest hurdle for new arrivals. BAFA asks for the ${h.P.foerderung.bescheide_je_person} most recent income tax assessments per adult, issued by a German tax office. Payroll tax certificates, payslips or foreign tax assessments do not replace them. Employees are often not required to file a return, but filing is frequently worthwhile after a move anyway, for instance because of moving costs. Filing is what produces the assessment.</p>
<p>In the year of arrival, taxable income is usually low, because only the months in Germany count. Foreign income from before the move is in many cases taxed abroad under a double taxation agreement and only enters the German tax rate through the progression clause. That does not count for the grant, which only looks at taxable income on the assessment.</p>
${h.table(['When you apply', 'Priya’s assessments', 'Partner', 'Household income', 'Grant with one child'], [
  ['Spring 2027', `${h.eur(31000)} (2025) and ${h.eur(74000)} (2026)`, `${h.eur(0)} twice`, h.eur(zuzug), h.eur(b(zuzug, 1))],
  ['One year later', `${h.eur(74000)} (2026) and ${h.eur(76000)} (2027)`, `${h.eur(0)} twice`, h.eur(spaeter), h.eur(b(spaeter, 1))],
], 'Example: moved in July 2025, battery electric car', ['l', 'l', 'l', 'r', 'r'])}
<p>The example shows an effect that often surprises newcomers: the half year after the move pulls the average down, and the household gets a grant it would no longer be entitled to a year later. Because you can only apply after registration, this depends on when the car is registered and which assessments exist by then.</p>
<h2>What BAFA leaves open</h2>
<p>If you have only one German assessment, you face a question BAFA does not answer directly. For people who have filed only one return because they previously had no income of their own, it points to a voluntary return that can lead to a ${h.eur(0)} assessment. Whether that carries over to a year in which you did not live in Germany at all depends on your tax position in that year. This site therefore only works with assessments that exist and suggests putting the question to BAFA before you apply. Until then, the safe route is to wait until you have two German assessments.</p>
<h2>Digital ID and the application</h2>
<p>Applications are online only, through the ${h.src('foerderzentrale', 'federal funding portal')} (Förderzentrale). You can only log in with a ${h.src('bundid', 'BundID account')} at a sufficient level of trust:</p>
<ul>
<li><strong>Online ID function</strong>: German ID card, electronic residence permit or eID card for EU and EEA citizens, each with the online function activated and a PIN.</li>
<li><strong>ELSTER certificate</strong>: requested on the ELSTER portal with your tax identification number; the activation code is posted to your German address.</li>
</ul>
<p>A BundID with only a username and password is not enough. If you file your tax return through ELSTER anyway, the certificate covers both.</p>
<h2>Documents and language</h2>
<p>You upload the assessments, part I of the registration certificate (Zulassungsbescheinigung Teil I), the purchase or lease contract and, where relevant, proof of children, all as PDFs of at most ${h.P.foerderung.pdf_max_mb} MB each. Documents must be in German or come with a certified translation. That mainly affects a purchase contract from abroad. For children only German Kindergeld counts; a child benefit from another country does not replace the Kindergeld proof.</p>
<h2>A car from abroad</h2>
<p>According to BAFA it makes no difference where a car is bought, even outside the EU. What matters is that it is new and first registered in Germany on or after ${h.date(h.P.foerderung.erstzulassung_ab)}. A car you bring from your home country that was already registered there is not a new car under the guideline. A purchase bonus from another EU state for the same car rules out the German grant. More under ${h.a('neuwagen', 'new cars only')}.</p>
<h2>Holding period and fixed-term stays</h2>
<p>The car must stay registered to you in Germany for ${h.P.foerderung.haltedauer_monate} continuous months. With registration on ${h.date(z)}, that runs until ${h.date(f.haltenBis)}. If you are here on a fixed-term contract or a secondment, compare that with the planned end of your stay. If you move away with the car or sell it earlier, you must tell BAFA, which decides case by case on a partial or full claw-back. Details under ${h.a('haltedauer', 'holding period and resale')}.</p>
<h2>Checklist for newcomers</h2>
<ol>
<li>Main residence registered in Germany (Anmeldung).</li>
<li>Two German income tax assessments per adult, or clarification with BAFA and the tax office if there is only one.</li>
<li>BundID set up with the online ID function or an ELSTER certificate.</li>
<li>Purchase contract in German or with a certified translation.</li>
<li>A stay of at least ${h.P.foerderung.haltedauer_monate} months planned from registration.</li>
<li>Apply after registration, by ${h.date(f.antragBis)} at the latest for a registration on ${h.date(z)}.</li>
</ol>
<p>How partners and children are counted is under ${h.a('haushaltseinkommen', 'household income')} and ${h.a('kinder', 'children bonus')}; the steps in the portal are under ${h.a('antrag', 'how to apply')}.</p>`,
  },
});
