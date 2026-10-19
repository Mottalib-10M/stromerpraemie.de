/** Haushaltseinkommen aus vier Bescheiden: je Person Durchschnitt aus zwei Jahren, dann Summe. */
import type { MiniSpec } from '../mini-types';
import { haushaltsZvE, foerderung } from '../engine/foerderung';
import { T, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Vier Bescheide, ein Haushaltseinkommen', 'Four tax assessments, one household income'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'a1', label: T(l, 'Person 1, älterer Bescheid', 'Person 1, older assessment'), def: 41000, unit: '€', max: 1000000 },
    { id: 'a2', label: T(l, 'Person 1, neuerer Bescheid', 'Person 1, newer assessment'), def: 47000, unit: '€', max: 1000000 },
    { id: 'b1', label: T(l, 'Person 2, älterer Bescheid', 'Person 2, older assessment'), def: 9000, unit: '€', max: 1000000 },
    { id: 'b2', label: T(l, 'Person 2, neuerer Bescheid', 'Person 2, newer assessment'), def: 21000, unit: '€', max: 1000000 },
  ],
  run: (v) => {
    const p1 = haushaltsZvE([[v.a1, v.a2]]), p2 = haushaltsZvE([[v.b1, v.b2]]);
    const zve = haushaltsZvE([[v.a1, v.a2], [v.b1, v.b2]]);
    const e = foerderung({ zve, kinder: 0, antrieb: 'bev', zulassung: '2026-11-01' });
    return {
      head: [T(l, 'Haushaltseinkommen', 'Household income'), eur(zve, l)],
      rows: [
        [T(l, 'Durchschnitt Person 1', 'Average, person 1'), eur(p1, l)],
        [T(l, 'Durchschnitt Person 2', 'Average, person 2'), eur(p2, l)],
        [T(l, 'Förderung, Elektroauto ohne Kind', 'Grant, battery electric, no children'), eur(e.betrag, l)],
      ],
      note: T(l, 'Bei Zusammenveranlagung steht in beiden Jahren ein gemeinsamer Wert im Bescheid: dann den gemeinsamen Wert bei Person 1 eintragen und Person 2 auf 0 lassen.', 'With a joint assessment, one combined figure appears for each year: enter it for person 1 and leave person 2 at 0.'),
    };
  },
});
