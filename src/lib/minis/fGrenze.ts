/** Einkommensgrenze: Stufe, Betrag, Abstand zur nächsten Kürzung und Betrag danach. */
import type { MiniSpec } from '../mini-types';
import { foerderung, obergrenze } from '../engine/foerderung';
import { T, eur, kinderOpt, antriebOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Wie weit liegt Ihr Einkommen von der nächsten Grenze?', 'How far is your income from the next limit?'),
  cta: T(l, 'Mit allen Angaben rechnen', 'Calculate with every detail'),
  inputs: [
    { id: 'z', label: T(l, 'Haushaltseinkommen (zvE)', 'Household taxable income'), def: 58000, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 0, options: kinderOpt(l) },
    { id: 'a', label: T(l, 'Antrieb', 'Drive'), def: 0, options: antriebOpt(l) },
  ],
  run: (v) => {
    const e = foerderung({ zve: v.z, kinder: v.k, antrieb: v.a === 1 ? 'phev' : 'bev', zulassung: '2026-11-01' });
    const stufeTxt = e.stufe < 0 ? T(l, 'über der Grenze', 'above the limit') : e.stufe === 3 ? T(l, 'Kinderbereich über 80 000 €', 'child band above €80,000') : T(l, `Stufe ${e.stufe + 1}`, `band ${e.stufe + 1}`);
    return {
      head: [T(l, 'Förderung', 'Grant'), eur(e.betrag, l)],
      rows: [
        [T(l, 'Einordnung', 'Band'), stufeTxt],
        [T(l, 'Spielraum bis zur nächsten Kürzung', 'Room before the next cut'), e.spielraum === null ? '–' : eur(e.spielraum, l)],
        [T(l, 'Betrag danach', 'Amount after that'), eur(e.naechsterBetrag, l)],
        [T(l, 'Obergrenze für diese Kinderzahl', 'Upper limit for this number of children'), eur(obergrenze(v.k), l)],
      ],
      note: T(l, 'Grenzen eingeschlossen: Wer genau auf einer Grenze liegt, bekommt noch den höheren Betrag. Gerechnet mit einer Zulassung im November 2026.', 'Limits are inclusive: income exactly on a limit still gets the higher amount. Worked with a registration in November 2026.'),
    };
  },
});
