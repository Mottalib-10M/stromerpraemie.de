/** Haltedauer: wie lange das Auto gehalten wurde, was fehlt, und eine rein zeitanteilige Größenordnung. */
import type { MiniSpec } from '../mini-types';
import { fristen } from '../engine/foerderung';
import { iso, monatsName } from '../engine/datum';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
const F = P.foerderung;
const jahre = (l: L) => [2026, 2027, 2028, 2029].map((j) => ({ value: String(j), label: String(j) }));
const monate = (l: L) => Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, l) }));
export default (l: L): MiniSpec => ({
  title: T(l, 'Früher verkaufen: wie viel der Haltedauer fehlt', 'Selling early: how much of the holding period is missing'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'zm', label: T(l, 'Zulassung, Monat', 'Registration, month'), def: 11, options: monate(l) },
    { id: 'zj', label: T(l, 'Zulassung, Jahr', 'Registration, year'), def: 2026, options: jahre(l) },
    { id: 'vm', label: T(l, 'Verkauf, Monat', 'Sale, month'), def: 5, options: monate(l) },
    { id: 'vj', label: T(l, 'Verkauf, Jahr', 'Sale, year'), def: 2028, options: jahre(l) },
    { id: 'b', label: T(l, 'Erhaltene Förderung', 'Grant received'), def: 4000, unit: '€', max: 10000 },
  ],
  run: (v) => {
    const z = iso(v.zj, v.zm, 1);
    const gehalten = Math.max(0, (v.vj * 12 + v.vm) - (v.zj * 12 + v.zm));
    const fehlt = Math.max(0, F.haltedauer_monate - gehalten);
    return {
      head: [T(l, 'Fehlende Monate', 'Months missing'), num(fehlt, l)],
      rows: [
        [T(l, 'Gehalten', 'Kept'), `${num(Math.min(gehalten, F.haltedauer_monate), l)} ${T(l, 'Monate', 'months')}`],
        [T(l, 'Haltedauer endet', 'Holding period ends'), (() => { const [j, m] = fristen(z).haltenBis.split('-').map(Number); return `${monatsName(m, l)} ${j}`; })()],
        [T(l, 'Rein zeitanteilig gerechnet', 'Purely pro rata'), eur(Math.round(v.b * fehlt / F.haltedauer_monate), l)],
      ],
      note: T(l, 'Das BAFA entscheidet im Einzelfall über eine anteilige oder vollständige Rückforderung; die zeitanteilige Zahl ist nur eine Größenordnung, kein Bescheid.', 'BAFA decides case by case on a partial or full claw-back; the pro rata figure is only an order of magnitude, not a decision.'),
    };
  },
});
