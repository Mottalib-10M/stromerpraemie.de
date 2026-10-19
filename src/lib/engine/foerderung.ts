/**
 * E-Auto-Förderung nach der Richtlinie vom 19. Mai 2026 (BAnz AT 19.06.2026 B3).
 * Haushaltseinkommen: für jede erwachsene Person des Haushalts (Antragsteller, Ehe- oder Lebenspartner,
 * eheähnliche Gemeinschaft) der Durchschnitt der zu versteuernden Einkommen aus den zwei letzten
 * Steuerbescheiden, dann die Summe. Stufen bis 45 000, bis 60 000, bis 80 000 € (Grenzen eingeschlossen);
 * Obergrenze 80 000 € plus 5 000 € je förderrelevantem Kind, höchstens zwei Kinder, also höchstens 90 000 €.
 * Über 80 000 € gilt der Betrag der dritten Stufe, sofern die Obergrenze der Kinderzahl nicht überschritten ist.
 */
import { P } from './params';
import { plusMonate, zwischen, minusTag } from './datum';

export type Antrieb = 'bev' | 'phev';
const F = P.foerderung;

/** Durchschnitt der zwei Bescheide je Person, dann Summe des Haushalts. */
export function haushaltsZvE(personen: Array<[number, number]>): number {
  return personen.reduce((s, [a, b]) => s + (Math.max(0, a) + Math.max(0, b)) / 2, 0);
}
export const kinderGezaehlt = (k: number) => Math.max(0, Math.min(Math.floor(k), F.max_kinder));
export const obergrenze = (k: number) => Math.min(F.obergrenze_basis + F.obergrenze_je_kind * kinderGezaehlt(k), F.obergrenze_max);

/** Stufe 0, 1, 2 (bis 45 000, 60 000, 80 000 €), 3 = über 80 000 € bis zur Obergrenze, -1 = über der Obergrenze. */
export function stufe(zve: number, kinder: number): number {
  if (zve > obergrenze(kinder)) return -1;
  const i = F.grenzen.findIndex((g) => zve <= g);
  return i === -1 ? 3 : i;
}
export function zeitraumOk(antrieb: Antrieb, zulassung: string): boolean {
  const bis = antrieb === 'bev' ? F.bev_erstzulassung_bis : F.phev_erstzulassung_bis;
  return zwischen(zulassung, F.erstzulassung_ab, bis);
}
/** Betrag der Tabelle für Einkommen und Kinder, ohne Prüfung des Zulassungsdatums. */
export function betragTabelle(zve: number, kinder: number, antrieb: Antrieb): number {
  const s = stufe(zve, kinder);
  if (s < 0) return 0;
  return (antrieb === 'bev' ? F.bev : F.phev)[Math.min(s, 2)][kinderGezaehlt(kinder)];
}
export interface Ergebnis {
  betrag: number;
  stufe: number;
  grenze: number;
  zeitraum: boolean;
  /** Spielraum bis zur nächsten Kürzung (Euro zvE), null über der Obergrenze. */
  spielraum: number | null;
  /** Betrag nach der nächsten Kürzung. */
  naechsterBetrag: number;
  /** Plus mit einem weiteren förderrelevanten Kind (0, wenn schon zwei gezählt). */
  plusKind: number;
}
export function foerderung(o: { zve: number; kinder: number; antrieb: Antrieb; zulassung: string }): Ergebnis {
  const s = stufe(o.zve, o.kinder);
  const zeitraum = zeitraumOk(o.antrieb, o.zulassung);
  const grenze = obergrenze(o.kinder);
  const tab = betragTabelle(o.zve, o.kinder, o.antrieb);
  const betrag = zeitraum ? tab : 0;
  let spielraum: number | null = null;
  let naechsterBetrag = 0;
  if (s >= 0) {
    const bis = s <= 1 ? F.grenzen[s] : grenze;
    spielraum = Math.max(0, bis - o.zve);
    naechsterBetrag = betragTabelle(bis + 1, o.kinder, o.antrieb);
  }
  const plusKind = kinderGezaehlt(o.kinder) < F.max_kinder ? betragTabelle(o.zve, o.kinder + 1, o.antrieb) - tab : 0;
  return { betrag, stufe: s, grenze, zeitraum, spielraum, naechsterBetrag, plusKind: zeitraum ? plusKind : 0 };
}
/** Antrag spätestens 12 Monate nach der Erstzulassung; Haltedauer 36 Monate ab Zulassung. */
export function fristen(zulassung: string) {
  return {
    antragBis: plusMonate(zulassung, F.antragsfrist_monate),
    haltenBis: minusTag(plusMonate(zulassung, F.haltedauer_monate)),
  };
}
export const nettopreis = (preis: number, betrag: number) => Math.max(0, preis - betrag);
/** Die Tabelle der Richtlinie: Zeilen = Einkommensstufen, Spalten = 0, 1, 2 Kinder. */
export function tabelle(antrieb: Antrieb) {
  const zeilen = [
    { von: 0, bis: F.grenzen[0] },
    { von: F.grenzen[0] + 1, bis: F.grenzen[1] },
    { von: F.grenzen[1] + 1, bis: F.grenzen[2] },
    { von: F.grenzen[2] + 1, bis: F.obergrenze_basis + F.obergrenze_je_kind },
    { von: F.obergrenze_basis + F.obergrenze_je_kind + 1, bis: F.obergrenze_max },
  ];
  return zeilen.map((z) => ({ ...z, betraege: [0, 1, 2].map((k) => betragTabelle(z.bis, k, antrieb)) }));
}
/** Plug-in-Hybrid oder Range Extender: förderfähig mit höchstens 60 g CO2/km (gewichtet kombiniert) oder mindestens 80 km elektrischer Reichweite. */
export const phevFoerderfaehig = (co2: number, reichweite: number) => co2 <= F.phev_co2_max_g_km || reichweite >= F.phev_reichweite_min_km;
