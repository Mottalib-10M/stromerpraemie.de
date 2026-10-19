/** Kfz-Steuer: Befreiung § 3d KraftStG, danach § 9 Abs. 1 Nr. 3 mit 50 % Ermäßigung (§ 9 Abs. 2); Plug-in-Hybride § 9 Abs. 1 Nr. 2 c. */
import { P, r2 } from './params';
import { plusMonate, minusTag, zwischen } from './datum';
const K = P.kfz;

/** Jahressteuer nach Gewicht, je 200 kg oder Teil davon, gestaffelt. */
export function gewichtSteuer(zgg: number): number {
  const einheiten = Math.ceil(Math.max(0, Math.min(zgg, 3500)) / K.je_kg);
  let s = 0;
  for (let i = 1; i <= einheiten; i++) {
    const oben = i * K.je_kg;
    const st = K.stufen.find((x) => oben <= x.bis_kg) ?? K.stufen[K.stufen.length - 1];
    s += st.eur;
  }
  return r2(s);
}
export const elektroSteuer = (zgg: number) => r2(gewichtSteuer(zgg) * (1 - K.ermaessigung_elektro));
export function befreiung(zulassung: string): { befreit: boolean; bis: string | null } {
  if (!zwischen(zulassung, K.befreiung_zulassung_von, K.befreiung_zulassung_bis)) return { befreit: false, bis: null };
  const zehn = minusTag(plusMonate(zulassung, K.befreiung_jahre * 12));
  return { befreit: true, bis: zehn < K.befreiung_ende_spaetestens ? zehn : K.befreiung_ende_spaetestens };
}
/** Plug-in-Hybrid (Erstzulassung ab 2021): Hubraum je 100 cm³ oder Teil davon, dazu CO2 über 95 g/km gestaffelt. */
export function phevSteuer(ccm: number, co2: number, diesel = false): number {
  const h = Math.ceil(Math.max(0, ccm) / K.hubraum_je_ccm) * (diesel ? K.hubraum_diesel_eur : K.hubraum_otto_eur);
  let c = 0, unten = K.co2_frei_g_km;
  for (const st of K.co2_stufen) {
    if (co2 <= unten) break;
    c += (Math.min(co2, st.bis) - unten) * st.eur;
    unten = st.bis;
  }
  return r2(h + c);
}
/** Steuer, die ein Elektroauto in der Befreiungszeit spart (ganze Jahre). */
export const ersparnis = (zgg: number, jahre: number) => r2(elektroSteuer(zgg) * jahre);
