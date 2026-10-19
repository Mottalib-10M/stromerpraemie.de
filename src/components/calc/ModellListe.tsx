/**
 * Nettopreis je Modell: Listenpreis der Hersteller (datiert) minus Förderung des Haushalts, dazu Bewilligungen der
 * E-Auto-Förderung je Modell (BAFA, Stand 1. Oktober 2026) und Neuzulassungen des KBA (FZ10, Januar bis September 2026).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { foerderung } from '../../lib/engine/foerderung';
import M from '../../data/modelle.json';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Hinweis, rahmen, tx, fm, type L } from './kit';

interface Props { lang?: L; methodHref?: string; preset?: { bis?: number } }
export default function ModellListe({ lang = 'de', methodHref, preset = {} }: Props) {
  const f = fm(lang);
  const d = { zve: 40000, k: '0', s: 'netto', bis: preset.bis ?? 0 };
  const [zve, setZve] = useState(d.zve); const [k, setK] = useState(d.k); const [s, setS] = useState(d.s); const [bis, setBis] = useState(d.bis);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setZve(num(u, 'z', d.zve)); setK(str(u, 'k', d.k)); setS(str(u, 's', d.s)); setBis(num(u, 'b', d.bis));
  }, []);
  useEffect(() => { updateURL({ z: zve, k, s, b: bis || undefined }); }, [zve, k, s, bis]);
  const rows = useMemo(() => {
    const r = M.modelle.filter((m) => m.preis).map((m) => {
      const e = foerderung({ zve, kinder: Number(k), antrieb: m.antrieb as 'bev' | 'phev', zulassung: '2026-11-01' });
      return { ...m, betrag: e.betrag, netto: (m.preis ?? 0) - e.betrag };
    }).filter((m) => !bis || m.netto <= bis);
    return r.sort((a, b) => (s === 'netto' ? a.netto - b.netto : b.bafa - a.bafa));
  }, [zve, k, s, bis]);
  const kinderOpt = [0, 1, 2].map((x) => ({ value: String(x), label: x === 2 ? tx(lang, '2 oder mehr', '2 or more') : String(x) }));
  const betrag = rows[0]?.betrag ?? foerderung({ zve, kinder: Number(k), antrieb: 'bev', zulassung: '2026-11-01' }).betrag;
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6">
        <form onSubmit={(ev) => ev.preventDefault()} className="grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4">
          <NumberField id="ml-z" label={tx(lang, 'Haushaltseinkommen (zvE)', 'Household taxable income')} value={zve} onChange={setZve} unit="€" max={1000000} lang={lang} />
          <SelectField id="ml-k" label={tx(lang, 'Kinder unter 18', 'Children under 18')} value={k} onChange={setK} options={kinderOpt} />
          <NumberField id="ml-b" label={tx(lang, 'Höchstens (nach Förderung)', 'At most (after grant)')} value={bis} onChange={setBis} unit="€" max={300000} lang={lang} />
          <Toggle id="ml-s" label={tx(lang, 'Sortieren', 'Sort')} value={s} onChange={setS} options={[{ value: 'netto', label: tx(lang, 'Preis', 'Price') }, { value: 'bafa', label: tx(lang, 'Gefragt', 'Popular') }]} />
        </form>
        <div aria-live="polite" data-resultat className="mt-5">
          <p className="text-sm text-navy-700">{tx(lang, `Förderung Ihres Haushalts für ein Elektroauto: `, `Your household's grant for a battery electric car: `)}<strong className="tabular-nums text-navy-900">{f.eur(betrag)}</strong>{tx(lang, ` · ${rows.length} Modelle mit Listenpreis`, ` · ${rows.length} models with a list price`)}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="journal w-full text-sm">
              <thead><tr className="text-left text-navy-700">
                <th scope="col" className="py-2 pr-3">{tx(lang, 'Modell', 'Model')}</th>
                <th scope="col" className="py-2 pr-3 text-right">{tx(lang, 'Listenpreis', 'List price')}</th>
                <th scope="col" className="py-2 pr-3 text-right">{tx(lang, 'Nach Förderung', 'After grant')}</th>
                <th scope="col" className="hidden py-2 pr-3 text-right sm:table-cell">{tx(lang, 'Bewilligungen', 'Approvals')}</th>
                <th scope="col" className="hidden py-2 text-right md:table-cell">{tx(lang, `Neuzulassungen bis ${M.kba_bis_text.de}`, `Registrations to ${M.kba_bis_text.en}`)}</th>
              </tr></thead>
              <tbody>{rows.map((m) => (
                <tr key={m.id} className="border-t border-navy-200">
                  <th scope="row" className="py-2 pr-3 text-left font-medium text-navy-900">{m.marke} {m.name}<span className="block text-xs font-normal text-navy-600">{m.version?.[lang]}</span></th>
                  <td className="tabular-nums py-2 pr-3 text-right text-navy-800">{f.eur(m.preis ?? 0)}</td>
                  <td className="tabular-nums py-2 pr-3 text-right font-semibold text-navy-900">{f.eur(m.netto)}</td>
                  <td className="tabular-nums hidden py-2 pr-3 text-right text-navy-800 sm:table-cell">{f.num(m.bafa)}</td>
                  <td className="tabular-nums hidden py-2 text-right text-navy-800 md:table-cell">{f.num(m.kba_summe)}</td>
                </tr>))}</tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-navy-600">{tx(lang, 'Listenpreise der Hersteller inkl. 19 % MwSt., ohne Überführung, gelesen am 19. Oktober 2026; Bewilligungen: BAFA, Stand 1. Oktober 2026; Neuzulassungen: Kraftfahrt-Bundesamt, FZ10 (Datenlizenz Deutschland, Namensnennung, dl-de/by-2-0). Händlerrabatte und Herstellerprämien sind nicht abgezogen.', 'Manufacturer list prices incl. 19% VAT, before delivery, read on 19 October 2026; approvals: BAFA as of 1 October 2026; registrations: Federal Motor Transport Authority, FZ10 (Data licence Germany, attribution 2.0). Dealer discounts and manufacturer bonuses are not deducted.')}</p>
          <Hinweis lang={lang} methodHref={methodHref} />
        </div>
      </div>
    </div>
  );
}
