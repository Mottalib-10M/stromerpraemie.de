/** Wohnungseigentümergemeinschaft: Mindestzahl vorverkabelter Stellplätze und Förderhöchstbetrag nach dem BMV-Aufruf. */
import type { MiniSpec } from '../mini-types';
import { P } from '../engine/params';
import { T, eur, num, dat, type L } from './_kit';
const W = P.wallbox;
export default (l: L): MiniSpec => ({
  title: T(l, 'Mehrfamilienhaus: wie viele Stellplätze, wie viel Zuschuss', 'Apartment building: how many spaces, how much support'),
  cta: '',
  inputs: [
    { id: 's', label: T(l, 'Stellplätze insgesamt', 'Parking spaces in total'), def: 24, max: 2000 },
    { id: 'a', label: T(l, 'Ausbau je Stellplatz', 'Work per space'), def: 1, options: [
      { value: '0', label: T(l, 'nur Vorverkabelung', 'pre-wiring only') },
      { value: '1', label: T(l, 'mit Ladepunkt', 'with a charging point') },
      { value: '2', label: T(l, 'bidirektional', 'bidirectional') },
    ] },
  ],
  run: (v) => {
    const min = Math.max(W.mph_min_stellplaetze, Math.ceil(v.s * W.mph_min_anteil_stellplaetze));
    const je = [W.mph_je_stellplatz_vorverkabelt, W.mph_je_stellplatz_mit_ladepunkt, W.mph_je_stellplatz_bidirektional][v.a] ?? 0;
    const moeglich = v.s >= W.mph_min_stellplaetze;
    return {
      head: [T(l, 'Höchstens bei der Mindestzahl', 'At most at the minimum number'), moeglich ? eur(min * je, l) : eur(0, l)],
      rows: [
        [T(l, 'Mindestens vorzuverkabeln', 'Spaces to pre-wire at least'), moeglich ? num(min, l) : T(l, 'zu wenige Stellplätze', 'too few spaces')],
        [T(l, 'Höchstbetrag je Stellplatz', 'Maximum per space'), eur(je, l)],
        [T(l, 'Alle Stellplätze ausgebaut, höchstens', 'All spaces fitted, at most'), moeglich ? eur(v.s * je, l) : eur(0, l)],
      ],
      note: T(l, `Gebäude mit mindestens ${W.mph_min_wohneinheiten} Wohneinheiten; Antrag bis ${dat(W.mph_antrag_bis, l)}. Die Beträge sind Obergrenzen, gezahlt wird höchstens der Anteil der förderfähigen Kosten.`, `Buildings with at least ${W.mph_min_wohneinheiten} homes; apply by ${dat(W.mph_antrag_bis, l)}. The amounts are caps; at most the eligible share of the costs is paid.`),
    };
  },
});
