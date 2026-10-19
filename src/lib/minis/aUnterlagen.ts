/** Antrag: welche Unterlagen für diesen Haushalt nötig sind und bis wann der Antrag spätestens gestellt werden muss. */
import type { MiniSpec } from '../mini-types';
import { fristen } from '../engine/foerderung';
import { iso, monatsName } from '../engine/datum';
import { P } from '../engine/params';
import { T, num, janein, type L } from './_kit';
const F = P.foerderung;
const mon = (d: string, l: L) => { const [j, m] = d.split('-').map(Number); return `${monatsName(m, l)} ${j}`; };
export default (l: L): MiniSpec => ({
  title: T(l, 'Ihre Unterlagen für den Antrag', 'Your documents for the application'),
  cta: T(l, 'Förderung rechnen', 'Calculate the grant'),
  inputs: [
    { id: 'p', label: T(l, 'Erwachsene im Haushalt', 'Adults in the household'), def: 2, options: [{ value: '1', label: '1' }, { value: '2', label: '2' }] },
    { id: 'g', label: T(l, 'Gemeinsam veranlagt', 'Assessed jointly'), def: 0, options: janein(l) },
    { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 1, options: janein(l) },
    { id: 'h', label: T(l, 'Plug-in-Hybrid über dem CO2-Wert', 'Plug-in hybrid above the CO2 value'), def: 0, options: janein(l) },
    { id: 'm', label: T(l, 'Monat der Zulassung', 'Month of registration'), def: 11, options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, l) })) },
  ],
  run: (v) => {
    const bescheide = v.p === 2 && v.g === 1 ? F.bescheide_je_person : v.p * F.bescheide_je_person;
    const n = bescheide + 2 + (v.k ? 1 : 0) + (v.h ? 1 : 0);
    const f = fristen(iso(2026, v.m, 1));
    return {
      head: [T(l, 'Dokumente als PDF', 'Documents as PDF'), num(n, l)],
      rows: [
        [T(l, 'Einkommensteuerbescheide', 'Income tax assessments'), num(bescheide, l)],
        [T(l, 'Zulassungsbescheinigung Teil I und Vertrag', 'Registration certificate and contract'), num(2, l)],
        [T(l, 'Kindernachweis', 'Proof of children'), v.k ? num(1, l) : '0'],
        [T(l, 'CoC für die Reichweite', 'CoC for the range'), v.h ? num(1, l) : '0'],
        [T(l, 'Antrag spätestens im (Zulassung 2026)', 'Apply at the latest in (registered 2026)'), mon(f.antragBis, l)],
      ],
      note: T(l, `Je Datei höchstens ${F.pdf_max_mb} MB. Vom Bescheid nur die Seiten mit Adressat, Steuer-ID, Datum, Steuerjahr und zvE.`, `At most ${F.pdf_max_mb} MB per file. From each assessment, only the pages with addressee, tax ID, date, tax year and taxable income.`),
    };
  },
});
