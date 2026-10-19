/** Neu in Deutschland: ein deutscher Bescheid aus dem Zuzugsjahr und einer aus dem ersten vollen Jahr. */
import type { MiniSpec } from '../mini-types';
import { haushaltsZvE, foerderung } from '../engine/foerderung';
import { T, eur, kinderOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Zugezogen: Zuzugsjahr und erstes volles Jahr', 'Moved here: arrival year and first full year'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'a', label: T(l, 'zvE im Zuzugsjahr (Bescheid)', 'Taxable income in the arrival year (assessment)'), def: 31000, unit: '€', max: 1000000 },
    { id: 'b', label: T(l, 'zvE im ersten vollen Jahr', 'Taxable income in the first full year'), def: 74000, unit: '€', max: 1000000 },
    { id: 'p', label: T(l, 'Partner, Durchschnitt zvE', 'Partner, average taxable income'), def: 0, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 1, options: kinderOpt(l) },
  ],
  run: (v) => {
    const zve = haushaltsZvE([[v.a, v.b], [v.p, v.p]]);
    const e = foerderung({ zve, kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' });
    const voll = foerderung({ zve: haushaltsZvE([[v.b, v.b], [v.p, v.p]]), kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' });
    return {
      head: [T(l, 'Förderung, Elektroauto', 'Grant, battery electric'), eur(e.betrag, l)],
      rows: [
        [T(l, 'Haushaltseinkommen', 'Household income'), eur(zve, l)],
        [T(l, 'Ein Jahr später, zwei volle Jahre', 'A year later, two full years'), eur(voll.betrag, l)],
      ],
      note: T(l, 'Nur deutsche Einkommensteuerbescheide zählen. Ausländisches Einkommen, das im Bescheid nicht im zvE steht, zählt nicht mit.', 'Only German income tax assessments count. Foreign income that is not part of the taxable income on the assessment is not included.'),
    };
  },
});
