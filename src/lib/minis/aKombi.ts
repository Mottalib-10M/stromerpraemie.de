/** Kombinieren: Herstellerrabatt, staatliche Förderung und THG-Prämie über drei Jahre auf den Listenpreis. */
import type { MiniSpec } from '../mini-types';
import { foerderung, nettopreis } from '../engine/foerderung';
import { erloes } from '../engine/thg';
import { P } from '../engine/params';
import { T, eur, kinderOpt, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Rabatt, Förderung und Quote zusammen', 'Discount, grant and quota together'),
  cta: T(l, 'Mit allen Angaben rechnen', 'Calculate with every detail'),
  inputs: [
    { id: 'p', label: T(l, 'Listenpreis', 'List price'), def: 33995, unit: '€', max: 300000 },
    { id: 'r', label: T(l, 'Rabatt des Herstellers oder Händlers', 'Maker or dealer discount'), def: 3000, unit: '€', max: 50000 },
    { id: 'z', label: T(l, 'Haushaltseinkommen (zvE)', 'Household taxable income'), def: 52000, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 1, options: kinderOpt(l) },
  ],
  run: (v) => {
    const b = foerderung({ zve: v.z, kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' }).betrag;
    const nachRabatt = nettopreis(v.p, v.r);
    const nachFoerderung = nettopreis(nachRabatt, b);
    const thg = erloes({ praemie: P.thg.markt_ohne_bonus_ab_eur, jahre: 3, fahrzeuge: 1 }).gesamt;
    return {
      head: [T(l, 'Preis nach Rabatt und Förderung', 'Price after discount and grant'), eur(nachFoerderung, l)],
      rows: [
        [T(l, 'Nach Rabatt', 'After discount'), eur(nachRabatt, l)],
        [T(l, 'Staatliche Förderung', 'Federal grant'), eur(b, l)],
        [T(l, 'Dazu THG-Prämie in drei Jahren', 'Plus quota payouts over three years'), eur(thg, l)],
      ],
      note: T(l, 'Ein Rabatt ist ein Preisnachlass, keine öffentliche Förderung, und schließt die Förderung nicht aus. Die THG-Prämie ist ein Marktpreis vom Oktober 2026.', 'A discount is a price reduction, not public funding, and does not rule out the grant. The quota payout is an October 2026 market price.'),
    };
  },
});
