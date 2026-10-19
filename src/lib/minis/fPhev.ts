/** Plug-in-Hybrid: förderfähig nach CO2 oder Reichweite, Betrag im Vergleich zum Elektroauto. */
import type { MiniSpec } from '../mini-types';
import { foerderung, phevFoerderfaehig } from '../engine/foerderung';
import { P } from '../engine/params';
import { T, eur, kinderOpt, dat, type L } from './_kit';
export default (l: L): MiniSpec => ({
  title: T(l, 'Ist Ihr Plug-in-Hybrid förderfähig?', 'Does your plug-in hybrid qualify?'),
  cta: T(l, 'Mit allen Angaben rechnen', 'Calculate with every detail'),
  inputs: [
    { id: 'c', label: T(l, 'CO2 gewichtet kombiniert (CoC 49.4)', 'Weighted combined CO2 (CoC 49.4)'), def: 28, unit: 'g/km', max: 400 },
    { id: 'r', label: T(l, 'Elektrische Reichweite (CoC 49.5)', 'Electric range (CoC 49.5)'), def: 75, unit: 'km', max: 1000 },
    { id: 'z', label: T(l, 'Haushaltseinkommen (zvE)', 'Household taxable income'), def: 52000, unit: '€', max: 1000000 },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 1, options: kinderOpt(l) },
  ],
  run: (v) => {
    const ok = phevFoerderfaehig(v.c, v.r);
    const ph = foerderung({ zve: v.z, kinder: v.k, antrieb: 'phev', zulassung: '2026-11-01' }).betrag;
    const bev = foerderung({ zve: v.z, kinder: v.k, antrieb: 'bev', zulassung: '2026-11-01' }).betrag;
    return {
      head: [T(l, 'Förderung für diesen Hybrid', 'Grant for this hybrid'), eur(ok ? ph : 0, l)],
      rows: [
        [T(l, `CO2 höchstens ${P.foerderung.phev_co2_max_g_km} g/km`, `CO2 at most ${P.foerderung.phev_co2_max_g_km} g/km`), v.c <= P.foerderung.phev_co2_max_g_km ? T(l, 'erfüllt', 'met') : T(l, 'nicht erfüllt', 'not met')],
        [T(l, `Reichweite mindestens ${P.foerderung.phev_reichweite_min_km} km`, `Range at least ${P.foerderung.phev_reichweite_min_km} km`), v.r >= P.foerderung.phev_reichweite_min_km ? T(l, 'erfüllt', 'met') : T(l, 'nicht erfüllt', 'not met')],
        [T(l, 'Zum Vergleich: Elektroauto', 'For comparison: battery electric'), eur(bev, l)],
      ],
      note: T(l, `Eine der beiden Bedingungen genügt. Erstzulassung bis ${dat(P.foerderung.phev_erstzulassung_bis, l)}.`, `Either condition is enough. First registration by ${dat(P.foerderung.phev_erstzulassung_bis, l)}.`),
    };
  },
});
