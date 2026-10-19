/** Leasing: Laufzeit gegen Haltedauer, und die Förderung umgerechnet auf jeden Monat des Vertrags. */
import type { MiniSpec } from '../mini-types';
import { foerderung } from '../engine/foerderung';
import { P } from '../engine/params';
import { T, eur, num, kinderOpt, type L } from './_kit';
const F = P.foerderung;
export default (l: L): MiniSpec => ({
  title: T(l, 'Leasingvertrag und Haltedauer', 'Lease term and holding period'),
  cta: T(l, 'Mit allen Angaben rechnen', 'Calculate with every detail'),
  inputs: [
    { id: 't', label: T(l, 'Laufzeit des Vertrags', 'Lease term'), def: 24, options: [12, 18, 24, 30, 36, 42, 48, 60].map((m) => ({ value: String(m), label: `${m} ${T(l, 'Monate', 'months')}` })) },
    { id: 'z', label: T(l, 'Haushaltseinkommen (zvE)', 'Household taxable income'), def: 48000, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 0, options: kinderOpt(l) },
  ],
  run: (v) => {
    const b = foerderung({ zve: v.z, kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' }).betrag;
    const luecke = Math.max(0, F.haltedauer_monate - v.t);
    return {
      head: [T(l, 'Monate über die Laufzeit hinaus', 'Months beyond the lease term'), num(luecke, l)],
      rows: [
        [T(l, 'Förderung', 'Grant'), eur(b, l)],
        [T(l, 'Je Monat der Haltedauer', 'Per month of the holding period'), eur(b / F.haltedauer_monate, l)],
        [T(l, 'Haltedauer erfüllt', 'Holding period met'), luecke === 0 ? T(l, 'ja, mit dem Vertrag', 'yes, by the lease') : T(l, 'nur mit Verlängerung oder Übernahme', 'only with an extension or buyout')],
      ],
      note: T(l, `Das Auto muss ${F.haltedauer_monate} Monate durchgehend auf Sie zugelassen bleiben, gleich wie lange der Vertrag läuft.`, `The car must stay registered to you for ${F.haltedauer_monate} continuous months, however long the lease runs.`),
    };
  },
});
