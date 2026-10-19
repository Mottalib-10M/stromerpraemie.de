import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Nachgerechnet von',
  skipToContent: 'Zum Inhalt', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Pfad', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Was Käufer fragen', relatedCalculators: 'Passend dazu', sourcesTitle: 'Richtlinie, Gesetze und Quellen', writtenBy: 'Herausgegeben von',
  asOf: 'Stand', lastUpdated: 'gelesen am', footerValidated: 'Alle 30 Felder der Fördertabelle, die Einkommensgrenzen und die Kfz-Steuer als Tests nachgerechnet', footerBrowser: 'Gerechnet wird in Ihrem Browser · keine Anmeldung · keine Daten an uns',
  footerDisclaimer: 'Stromerprämie ist ein unabhängiges Angebot von Radif Partners. Wir sind weder das BAFA noch ein Ministerium oder eine andere Behörde, kein Autohaus und kein THG-Anbieter, und wir verkaufen nichts. Die Ergebnisse sind Schätzungen nach der Förderrichtlinie vom 19. Mai 2026 und keine persönliche Beratung; verbindlich ist allein der Zuwendungsbescheid. Auf die Förderung besteht kein Rechtsanspruch.', footerPopular: '', notFound: 'Unter dieser Adresse gibt es keine Seite.',
  readMore: 'Ganzen Absatz lesen',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Worked through by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Path', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'What buyers in Germany ask', relatedCalculators: 'Related', sourcesTitle: 'Guideline, laws and sources', writtenBy: 'Published by',
  asOf: 'As of', lastUpdated: 'read on', footerValidated: 'All 30 cells of the grant table, the income limits and the vehicle tax run as tests', footerBrowser: 'Calculated in your browser · no sign-up · nothing sent to us',
  footerDisclaimer: 'Stromerprämie is an independent service by Radif Partners. We are not BAFA, a ministry or any other authority, not a car dealer and not a GHG quota provider, and we sell nothing. Results are indicative estimates under the funding guideline of 19 May 2026 and not personal advice; only the grant decision (Zuwendungsbescheid) is binding. There is no legal entitlement to the grant.', footerPopular: '', notFound: 'There is no page at this address.',
  readMore: 'Read the whole paragraph',
};
export function t(lang: Locale) { return lang === 'en' ? en : de; }
