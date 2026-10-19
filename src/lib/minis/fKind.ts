/** Kinder: Betrag und Obergrenze mit 0, 1, 2 und 3 Kindern beim selben Einkommen. */
import type { MiniSpec } from '../mini-types';
import { foerderung, obergrenze } from '../engine/foerderung';
import { T, eur, antriebOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Was jedes Kind beim selben Einkommen ändert', 'What each child changes at the same income'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'z', label: T(l, 'Haushaltseinkommen (zvE)', 'Household taxable income'), def: 83000, unit: '€', max: 1000000 },
    { id: 'a', label: T(l, 'Antrieb', 'Drive'), def: 0, options: antriebOpt(l) },
  ],
  run: (v) => {
    const b = (k: number) => foerderung({ zve: v.z, kinder: k, antrieb: v.a === 1 ? 'phev' : 'bev', zulassung: '2026-11-01' }).betrag;
    return {
      head: [T(l, 'Mit zwei Kindern', 'With two children'), eur(b(2), l)],
      rows: [
        [T(l, 'Ohne Kind', 'No children'), `${eur(b(0), l)} (${T(l, 'Grenze', 'limit')} ${eur(obergrenze(0), l)})`],
        [T(l, 'Ein Kind', 'One child'), `${eur(b(1), l)} (${T(l, 'Grenze', 'limit')} ${eur(obergrenze(1), l)})`],
        [T(l, 'Zwei Kinder', 'Two children'), `${eur(b(2), l)} (${T(l, 'Grenze', 'limit')} ${eur(obergrenze(2), l)})`],
        [T(l, 'Drei Kinder', 'Three children'), `${eur(b(3), l)} (${T(l, 'Grenze', 'limit')} ${eur(obergrenze(3), l)})`],
      ],
      note: T(l, 'Gezählt werden Kinder unter 18 am Tag der Erstzulassung, mit Kindergeld für Ihren Haushalt; ab dem dritten Kind ändert sich nichts.', 'Children count if under 18 on the day of first registration and Kindergeld is paid to your household; from the third child on nothing changes.'),
    };
  },
});
