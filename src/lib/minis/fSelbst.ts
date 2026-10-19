/** Selbstständige: schwankendes zvE, Durchschnitt aus zwei Jahren gegenüber jedem Jahr allein. */
import type { MiniSpec } from '../mini-types';
import { haushaltsZvE, foerderung } from '../engine/foerderung';
import { T, eur, kinderOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Gutes Jahr, schwaches Jahr: was der Durchschnitt ergibt', 'Good year, weak year: what the average gives'),
  cta: T(l, 'Mit allen Angaben rechnen', 'Calculate with every detail'),
  inputs: [
    { id: 'a', label: T(l, 'zvE Jahr 1', 'Taxable income, year 1'), def: 96000, unit: '€', max: 2000000 },
    { id: 'b', label: T(l, 'zvE Jahr 2', 'Taxable income, year 2'), def: 38000, unit: '€', max: 2000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 0, options: kinderOpt(l) },
  ],
  run: (v) => {
    const f = (z: number) => foerderung({ zve: z, kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' }).betrag;
    const avg = haushaltsZvE([[v.a, v.b]]);
    return {
      head: [T(l, 'Förderung mit dem Durchschnitt', 'Grant on the average'), eur(f(avg), l)],
      rows: [
        [T(l, 'Durchschnitt beider Jahre', 'Average of both years'), eur(avg, l)],
        [T(l, 'Nur mit Jahr 1 gerechnet', 'Year 1 alone'), eur(f(v.a), l)],
        [T(l, 'Nur mit Jahr 2 gerechnet', 'Year 2 alone'), eur(f(v.b), l)],
      ],
      note: T(l, 'Maßgeblich sind immer die zwei neuesten Bescheide bei Antragstellung; ein Jahr auszuwählen ist nicht möglich.', 'What counts is always the two newest assessments when you apply; you cannot pick a year.'),
    };
  },
});
