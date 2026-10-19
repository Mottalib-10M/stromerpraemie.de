/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://stromerpraemie.de";
export const SITE_NAMES: Record<string, string> = {"de": "Stromerprämie", "en": "Stromerprämie"};
export const LANG_TAGS: Record<string, string> = {"de": "de-DE", "en": "en-DE"};
export const OG_LOCALES: Record<string, string> = {"de": "de_DE", "en": "en_GB"};
export const LOCALE_TAG = 'de-DE';
/** Zahlenformat je Sprache: Deutsch 1.234,50 €, Englisch €1,234.50. */
export const LOCALE_BY_LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-19';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber von Rechnern zur E-Auto-Förderung: Zuschuss je Haushalt, Nettopreis je Modell, THG-Prämie und Kfz-Steuer", "en": "Publisher of calculators for Germany's EV grant: amount per household, net price per model, GHG quota payout and vehicle tax"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners rechnet die E-Auto-Förderung nach dem Wortlaut der Förderrichtlinie vom 19. Mai 2026 nach: Durchschnitt der zwei letzten Steuerbescheide je Partner, Einkommensstufen, Kinder, Antriebsart. Dazu kommen die Bewilligungszahlen des Programms und die Neuzulassungen des Kraftfahrt-Bundesamts je Modell. Wir verkaufen keine Autos und vermitteln keine Verträge.", "en": "Radif Partners works through Germany's EV grant exactly as the funding guideline of 19 May 2026 words it: the average of each partner's last two tax assessments, income bands, children and drive type, alongside the programme's approval statistics and the Federal Motor Transport Authority's registrations per model. We sell no cars and broker no contracts."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Sozial gestaffelte E-Auto-Förderung (Richtlinie vom 19. Mai 2026)", "Zu versteuerndes Einkommen nach § 2 Abs. 5 EStG", "THG-Quote für Elektroautos (38. BImSchV)", "Kfz-Steuerbefreiung für Elektrofahrzeuge (§ 3d KraftStG)"], "en": ["Germany's income-based EV purchase grant (guideline of 19 May 2026)", "Taxable income under section 2(5) of the Income Tax Act", "GHG quota trading for electric cars (38th BImSchV)", "Vehicle tax exemption for electric cars (section 3d KraftStG)"]};
export const CONTACT_EMAIL = "kontakt@stromerpraemie.de";
export const THEME_COLOR = '#0B6B5A';
export const LOGO_SYMBOL = 'eclair';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-2VN9JWTMG1';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'z08md1mmvc';
export const INDEXNOW_KEY = '783a7300336d32e97300e06f1ee00ace';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "Frankreich / France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt-IdNr.",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
