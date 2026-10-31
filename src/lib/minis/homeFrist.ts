/** Zulassungsmonat: Antragsfrist und Ende der Haltedauer. */
import type { MiniSpec } from '../mini-types';
import { fristen, zeitraumOk } from '../engine/foerderung';
import { iso, monatsName } from '../engine/datum';
import { P } from '../engine/params';
import { T, type L } from './_kit';
const mon = (d: string, l: L) => { const [j, m] = d.split('-').map(Number); return `${monatsName(m, l)} ${j}`; };
export default (l: L): MiniSpec => ({
  title: T(l, 'Zugelassen im Monat X: bis wann Antrag und Haltedauer laufen', 'Registered in month X: when the deadlines fall'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'm', label: T(l, 'Monat der Zulassung', 'Month of registration'), def: 11, options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, l) })) },
    { id: 'j', label: T(l, 'Jahr', 'Year'), def: 2026, options: [2026, 2027, 2028, 2029].map((j) => ({ value: String(j), label: String(j) })) },
  ],
  run: (v) => {
    const z = iso(v.j, v.m, 1);
    const f = fristen(z);
    return {
      head: [T(l, 'Antrag spätestens im', 'Apply at the latest in'), mon(f.antragBis, l)],
      rows: [
        [T(l, 'Halten bis zum Vortag des Zulassungstags im', 'Keep the car until the day before the registration day in'), mon(f.haltenMonat, l)],
        [T(l, 'Elektroauto im Förderzeitraum', 'Battery electric inside the period'), zeitraumOk('bev', z) ? T(l, 'ja', 'yes') : T(l, 'nein', 'no')],
        [T(l, 'Plug-in-Hybrid im Förderzeitraum', 'Plug-in hybrid inside the period'), zeitraumOk('phev', z) ? T(l, 'ja', 'yes') : T(l, 'nein', 'no')],
      ],
      note: T(l, `Maßgeblich ist der Tag der Erstzulassung (bei Zulassung am Ersten endet die Haltedauer schon am letzten Tag des Vormonats). Antrag erst nach der Zulassung, höchstens ${P.foerderung.antragsfrist_monate} Monate danach.`, `What counts is the day of first registration (registered on the 1st, the holding period ends on the last day of the month before). Apply only after registration, at most ${P.foerderung.antragsfrist_monate} months later.`),
    };
  },
});
