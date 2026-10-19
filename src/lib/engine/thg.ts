/** THG-Quote: Schätzwert je Fahrzeug (§ 7 der 38. BImSchV, UBA-Bekanntmachung), Strom dreifach angerechnet. Auszahlung = Marktpreis des Anbieters. */
import { P } from './params';
const T = P.thg;
export type Klasse = 'm1' | 'n1';
export const schaetzwert = (k: Klasse) => (k === 'm1' ? T.schaetzwert_m1_kwh : T.schaetzwert_n1_kwh);
export const angerechnet = (k: Klasse) => schaetzwert(k) * T.multiplikator_strom;
/** Erlös über mehrere Jahre bei einem festen Betrag je Jahr und Fahrzeug, abzüglich einer festen Gebühr je Antrag. */
export function erloes(o: { praemie: number; jahre: number; fahrzeuge: number; gebuehr?: number }) {
  const je = Math.max(0, o.praemie - (o.gebuehr ?? 0));
  return { jeJahr: je * o.fahrzeuge, gesamt: je * o.fahrzeuge * o.jahre };
}
