/** Texte der Startseite (Säule). Jede Zahl aus P oder dem Motor. */
import type { Helpers, FAQ } from '../lib/guide-types';
interface HomeText { title: string; description: string; h1: string; intro: string; resume: (h: Helpers) => string; faqs: (h: Helpers) => FAQ[]; body: (h: Helpers) => string }
export const HOME: Record<'de' | 'en', HomeText> = {
  de: { title: 'E-Auto-Förderung 2026', description: '', h1: 'E-Auto-Förderung 2026 berechnen', intro: '', resume: () => '', faqs: () => [], body: () => '' },
  en: { title: 'EV grant 2026', description: '', h1: 'EV grant 2026', intro: '', resume: () => '', faqs: () => [], body: () => '' },
};
