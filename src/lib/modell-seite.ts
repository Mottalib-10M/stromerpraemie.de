/**
 * Rechenhilfen für die Modellseiten (src/content/modelle/*.ts): Daten eines Modells aus modelle.json,
 * Nettopreis nach der Tabelle der Richtlinie, Zulassungen je Monat (KBA FZ10) und Rang in der BAFA-Statistik.
 * Kein Text: jede Modellseite schreibt ihre eigene Prosa.
 */
import M from '../data/modelle.json';
import { betragTabelle, nettopreis, tabelle } from './engine/foerderung';
import { monatsName } from './engine/datum';
import type { Helpers } from './guide-types';

export type Modell = (typeof M.modelle)[number];
export const modell = (id: string): Modell => {
  const m = M.modelle.find((x) => x.id === id);
  if (!m) throw new Error(`Modell ${id} fehlt in modelle.json`);
  return m;
};
export const MODELLE = M;
/** Listenpreis (für Seiten mit Preis garantiert). */
export const preis = (m: Modell) => m.preis as number;
/** Nettopreis für ein zvE und eine Kinderzahl (reines Elektroauto). */
export const netto = (m: Modell, zve: number, kinder: number) => nettopreis(preis(m), betragTabelle(zve, kinder, 'bev'));
/** Förderung als Anteil am Listenpreis. */
export const anteil = (m: Modell, zve: number, kinder: number) => betragTabelle(zve, kinder, 'bev') / preis(m);
/** Verhältnis Bewilligungen zu Neuzulassungen Januar bis Stand. */
export const quote = (m: Modell) => m.bafa / m.kba_summe;
/** Rang nach Bewilligungen unter allen Modellen der Datei. */
export const rang = (m: Modell) => [...M.modelle].sort((a, b) => b.bafa - a.bafa).findIndex((x) => x.id === m.id) + 1;
/** Durchschnitt Januar bis April (vor dem Antragsstart) und Juni bis zum letzten Monat. */
export const vorNach = (m: Modell) => {
  const avg = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
  return { vor: avg(m.kba.slice(0, 4)), nach: avg(m.kba.slice(5)) };
};
/** Monat mit den meisten Neuzulassungen (1 = Januar). */
export const spitze = (m: Modell) => { const i = m.kba.indexOf(Math.max(...m.kba)); return { monat: i + 1, wert: m.kba[i] }; };
/** Modelle mit Preis, nach Preis sortiert. */
export const mitPreis = () => M.modelle.filter((x) => x.preis).sort((a, b) => (a.preis as number) - (b.preis as number));

/** Tabelle: Nettopreis je Einkommensstufe und Kinderzahl. */
export function nettoTabelle(h: Helpers, m: Modell) {
  const de = h.lang === 'de';
  const rows = tabelle('bev').map((z) => [
    `${h.eur(z.von)} ${de ? 'bis' : 'to'} ${h.eur(z.bis)}`,
    ...z.betraege.map((b) => (b ? h.eur(nettopreis(preis(m), b)) : de ? 'keine Förderung' : 'no grant')),
  ]);
  return h.table(
    [de ? 'zu versteuerndes Haushaltseinkommen' : 'household taxable income', de ? 'ohne Kind' : 'no child', de ? '1 Kind' : '1 child', de ? '2 Kinder' : '2 children'],
    rows,
    de ? `${m.marke} ${m.name}, ${m.version?.de}: Preis nach Förderung` : `${m.marke} ${m.name}, ${m.version?.en}: price after the grant`,
    ['l', 'r', 'r', 'r'],
  );
}
/** Tabelle: Neuzulassungen je Monat. */
export function monatsTabelle(h: Helpers, m: Modell) {
  const de = h.lang === 'de';
  return h.table(
    [de ? 'Monat' : 'Month', de ? 'Neuzulassungen' : 'New registrations'],
    m.kba.map((x, i) => [monatsName(i + 1, h.lang), h.num(x)]),
    de ? `${m.marke} ${m.name}: Neuzulassungen 2026 je Monat (KBA FZ10)` : `${m.marke} ${m.name}: new registrations 2026 by month (KBA FZ10)`,
    ['l', 'r'],
  );
}
