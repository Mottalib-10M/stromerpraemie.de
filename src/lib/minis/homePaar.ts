/** Paar: zwei Erwachsene, je Durchschnitt aus zwei Bescheiden, dann die Summe und der Betrag. */
import type { MiniSpec } from '../mini-types';
import { haushaltsZvE, foerderung, obergrenze } from '../engine/foerderung';
import { T, eur, kinderOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Zwei Erwachsene: was der Haushalt bekommt', 'Two adults: what the household gets'),
  cta: T(l, 'Mit allen Angaben rechnen', 'Calculate with every detail'),
  inputs: [
    { id: 'a', label: T(l, 'Person 1: Durchschnitt zvE', 'Person 1: average taxable income'), def: 44000, unit: '€', max: 1000000 },
    { id: 'b', label: T(l, 'Person 2: Durchschnitt zvE', 'Person 2: average taxable income'), def: 20000, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 0, options: kinderOpt(l) },
  ],
  run: (v) => {
    const zve = haushaltsZvE([[v.a, v.a], [v.b, v.b]]);
    const e = foerderung({ zve, kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' });
    return {
      head: [T(l, 'Förderung für ein Elektroauto', 'Grant for a battery electric car'), eur(e.betrag, l)],
      rows: [
        [T(l, 'Haushaltseinkommen', 'Household income'), eur(zve, l)],
        [T(l, 'Grenze für diese Kinderzahl', 'Limit for this number of children'), eur(obergrenze(v.k), l)],
        [T(l, 'Allein gerechnet, Person 1', 'Person 1 counted alone'), eur(foerderung({ zve: v.a, kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' }).betrag, l)],
      ],
      note: T(l, 'Zusammen zählen beide Einkommen, egal ob verheiratet oder nicht, solange beide im selben Haushalt leben.', 'Both incomes count together, married or not, as long as both live in the same household.'),
    };
  },
});
