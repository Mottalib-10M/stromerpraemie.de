/** Neuwagen-Prüfung: Fahrzeugart, Ort und Jahr der Erstzulassung. */
import type { MiniSpec } from '../mini-types';
import { zeitraumOk } from '../engine/foerderung';
import { iso } from '../engine/datum';
import { T, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Zählt Ihr Auto als Neuwagen?', 'Does your car count as new?'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'a', label: T(l, 'Art des Fahrzeugs', 'Type of vehicle'), def: 0, options: [
      { value: '0', label: T(l, 'Neuwagen, nie zugelassen', 'New, never registered') },
      { value: '1', label: T(l, 'Tageszulassung', 'Pre-registered (Tageszulassung)') },
      { value: '2', label: T(l, 'Vorführwagen', 'Demonstrator') },
      { value: '3', label: T(l, 'Gebrauchtwagen', 'Used car') },
    ] },
    { id: 'o', label: T(l, 'Erste Zulassung', 'First registration'), def: 0, options: [
      { value: '0', label: T(l, 'in Deutschland', 'in Germany') },
      { value: '1', label: T(l, 'im Ausland', 'abroad') },
    ] },
    { id: 'j', label: T(l, 'Jahr der Erstzulassung', 'Year of first registration'), def: 2026, options: [2025, 2026, 2027, 2028, 2029, 2030].map((j) => ({ value: String(j), label: String(j) })) },
  ],
  run: (v) => {
    const d = iso(v.j, 6, 1);
    const art = v.a === 0, ort = v.o === 0, zeit = zeitraumOk('bev', d);
    const ok = art && ort && zeit;
    return {
      head: [T(l, 'Förderfähig als Elektroauto', 'Eligible as a battery electric car'), ok ? T(l, 'ja', 'yes') : T(l, 'nein', 'no')],
      rows: [
        [T(l, 'Fahrzeugart', 'Vehicle type'), art ? T(l, 'in Ordnung', 'fine') : T(l, 'ausgeschlossen', 'excluded')],
        [T(l, 'Ort der Erstzulassung', 'Place of first registration'), ort ? T(l, 'in Ordnung', 'fine') : T(l, 'muss Deutschland sein', 'must be Germany')],
        [T(l, 'Förderzeitraum', 'Funding window'), zeit ? T(l, 'in Ordnung', 'fine') : T(l, 'außerhalb', 'outside')],
      ],
      note: T(l, 'Für den Zeitraum zählt das genaue Datum; hier ist die Jahresmitte angenommen.', 'The exact date counts for the window; mid-year is assumed here.'),
    };
  },
});
