/** Datumsrechnung ohne Zeitzone: ISO-Tage (JJJJ-MM-TT), Monate wie im Kalender. */
export const iso = (j: number, m: number, t: number) => `${j}-${String(m).padStart(2, '0')}-${String(t).padStart(2, '0')}`;
export const teile = (d: string) => d.split('-').map(Number) as [number, number, number];
const tageIm = (j: number, m: number) => new Date(Date.UTC(j, m, 0)).getUTCDate();
/** Gleicher Kalendertag n Monate später; fehlt der Tag (31. → Februar), der letzte Tag des Monats. */
export function plusMonate(d: string, n: number): string {
  const [j, m, t] = teile(d);
  const k = (j * 12 + (m - 1)) + n;
  const jj = Math.floor(k / 12), mm = (k % 12) + 1;
  return iso(jj, mm, Math.min(t, tageIm(jj, mm)));
}
export function minusTag(d: string): string {
  const [j, m, t] = teile(d);
  const x = new Date(Date.UTC(j, m - 1, t - 1));
  return iso(x.getUTCFullYear(), x.getUTCMonth() + 1, x.getUTCDate());
}
export const vor = (a: string, b: string) => a < b;
export const zwischen = (d: string, von: string, bis: string) => d >= von && d <= bis;
const MON = {
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
/** „19. Mai 2026“ / „19 May 2026“. */
export function datumText(d: string, l: 'de' | 'en'): string {
  const [j, m, t] = teile(d);
  return l === 'de' ? `${t}. ${MON.de[m - 1]} ${j}` : `${t} ${MON.en[m - 1]} ${j}`;
}
export const monatsName = (m: number, l: 'de' | 'en') => MON[l][m - 1];
