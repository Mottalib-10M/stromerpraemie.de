/** THG-Quote: angerechnete Strommenge für eine Flotte (Schätzwert × Multiplikator). */
import type { MiniSpec } from '../mini-types';
import { angerechnet, schaetzwert } from '../engine/thg';
import { P } from '../engine/params';
import { T, num, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Wie viel Strom auf die Quote zählt', 'How much electricity counts towards the quota'),
  cta: T(l, 'THG-Prämie rechnen', 'Work out the payout'),
  inputs: [
    { id: 'p', label: T(l, 'Elektro-Pkw', 'Electric cars'), def: 1, max: 1000 },
    { id: 'n', label: T(l, 'Elektro-Transporter', 'Electric vans'), def: 0, max: 1000 },
  ],
  run: (v) => {
    const roh = v.p * schaetzwert('m1') + v.n * schaetzwert('n1');
    const ang = v.p * angerechnet('m1') + v.n * angerechnet('n1');
    return {
      head: [T(l, 'Angerechnete Menge im Jahr', 'Credited amount a year'), `${num(ang, l)} kWh`],
      rows: [
        [T(l, 'Schätzwert ohne Faktor', 'Estimate before the factor'), `${num(roh, l)} kWh`],
        [T(l, 'Faktor für Strom', 'Factor for electricity'), `× ${P.thg.multiplikator_strom}`],
        [T(l, 'Meldung beim Umweltbundesamt', 'Report to the Federal Environment Agency'), T(l, `bis ${P.thg.frist_mitteilung} des Folgejahres`, 'by 28 February of the following year')],
      ],
      note: T(l, 'Nur reine Elektrofahrzeuge; der Halter laut Zulassungsbescheinigung kann die Menge einmal im Jahr über einen Anbieter verkaufen.', 'Battery electric vehicles only; the keeper named on the registration can sell the amount once a year through a provider.'),
    };
  },
});
