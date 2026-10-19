/** Statistik: in welcher Einkommensgruppe der BAFA-Statistik ein Haushalt liegt und wie viele Bewilligungen es dort gab. */
import type { MiniSpec } from '../mini-types';
import S from '../../data/bafa-statistik.json';
import { stufe } from '../engine/foerderung';
import { T, num, pct, eur, kinderOpt, dat, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Wie viele Haushalte wie Ihrer schon gefördert wurden', 'How many households like yours have been funded'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'z', label: T(l, 'Haushaltseinkommen (zvE)', 'Household taxable income'), def: 52000, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 0, options: kinderOpt(l) },
  ],
  run: (v) => {
    const s = stufe(v.z, v.k);
    const g = s < 0 ? null : S.einkommen.find((e) => v.z <= e.bis) ?? null;
    return {
      head: [T(l, 'Bewilligungen in Ihrer Gruppe', 'Approvals in your band'), g ? num(g.anzahl, l) : '0'],
      rows: [
        [T(l, 'Einkommensgruppe', 'Income band'), g ? `${eur(g.von, l)} – ${eur(g.bis, l)}` : T(l, 'über der Grenze', 'above the limit')],
        [T(l, 'Anteil an allen Bewilligungen', 'Share of all approvals'), g ? pct(g.anzahl / S.bewilligungen, l) : '0'],
      ],
      note: T(l, `BAFA-Statistik, Stand ${dat(S.stand, l)}.`, `BAFA statistics as of ${dat(S.stand, l)}.`),
    };
  },
});
