/** Laufzeit: Monate bis zum Ende des Förderzeitraums für Elektroauto und Plug-in-Hybrid ab einem Monat. */
import type { MiniSpec } from '../mini-types';
import { zeitraumOk } from '../engine/foerderung';
import { iso, monatsName, teile } from '../engine/datum';
import { P } from '../engine/params';
import { T, num, type L } from './_kit';
const F = P.foerderung;
const bis = (von: string, ende: string) => { const [a, b] = teile(von), [c, d] = teile(ende); return Math.max(0, (c * 12 + d) - (a * 12 + b)); };
export default (l: L): MiniSpec => ({
  title: T(l, 'Wie viel Zeit bleibt bis zur Zulassung?', 'How much time is left to register?'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'm', label: T(l, 'Ab Monat', 'From month'), def: 11, options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, l) })) },
    { id: 'j', label: T(l, 'Jahr', 'Year'), def: 2026, options: [2026, 2027, 2028, 2029].map((j) => ({ value: String(j), label: String(j) })) },
  ],
  run: (v) => {
    const d = iso(v.j, v.m, 1);
    return {
      head: [T(l, 'Monate für ein Elektroauto', 'Months for a battery electric car'), zeitraumOk('bev', d) ? num(bis(d, F.bev_erstzulassung_bis), l) : '0'],
      rows: [
        [T(l, 'Monate für einen Plug-in-Hybrid', 'Months for a plug-in hybrid'), zeitraumOk('phev', d) ? num(bis(d, F.phev_erstzulassung_bis), l) : '0'],
        [T(l, 'Richtlinie gilt bis', 'Guideline valid until'), (() => { const [j, m] = teile(F.richtlinie_gueltig_bis); return `${monatsName(m, l)} ${j}`; })()],
      ],
      note: T(l, 'Die Förderung steht unter dem Vorbehalt verfügbarer Mittel; ein früheres Ende ist möglich.', 'The grant is subject to available funds; it may end earlier.'),
    };
  },
});
