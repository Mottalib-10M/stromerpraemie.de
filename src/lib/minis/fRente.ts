/** Rentner: zwei Bescheide, auch 0 €, je Person gemittelt; Partner optional. */
import type { MiniSpec } from '../mini-types';
import { haushaltsZvE, foerderung } from '../engine/foerderung';
import { T, eur, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Rente und Bescheid: was die Förderung ergibt', 'Pension and assessment: what the grant comes to'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'a', label: T(l, 'zvE im letzten Arbeitsjahr', 'Taxable income, last working year'), def: 52000, unit: '€', max: 1000000 },
    { id: 'b', label: T(l, 'zvE im ersten Rentenjahr', 'Taxable income, first pension year'), def: 14000, unit: '€', max: 1000000 },
    { id: 'p', label: T(l, 'Partner, Durchschnitt zvE', 'Partner, average taxable income'), def: 6000, unit: '€', max: 1000000 },
  ],
  run: (v) => {
    const zve = haushaltsZvE([[v.a, v.b], [v.p, v.p]]);
    const e = foerderung({ zve, kinder: 0, antrieb: 'bev', zulassung: '2026-11-01' });
    const nurRente = foerderung({ zve: haushaltsZvE([[v.b, v.b], [v.p, v.p]]), kinder: 0, antrieb: 'bev', zulassung: '2026-11-01' });
    return {
      head: [T(l, 'Förderung, Elektroauto', 'Grant, battery electric'), eur(e.betrag, l)],
      rows: [
        [T(l, 'Haushaltseinkommen', 'Household income'), eur(zve, l)],
        [T(l, 'Wenn beide Bescheide aus der Rente stammen', 'If both assessments are from retirement'), eur(nurRente.betrag, l)],
      ],
      note: T(l, 'Ein Bescheid über 0 € zählt. Ohne Bescheid kann eine Steuererklärung freiwillig nachgereicht werden.', 'An assessment showing €0 counts. Without one, a voluntary tax return can be filed afterwards.'),
    };
  },
});
