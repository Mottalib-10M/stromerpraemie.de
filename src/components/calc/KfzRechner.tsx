/**
 * Kfz-Steuer für Elektroautos und Plug-in-Hybride: Befreiung nach § 3d KraftStG (zehn Jahre, längstens bis 31.12.2035),
 * danach § 9 Abs. 1 Nr. 3 nach Gewicht mit 50 % Ermäßigung (§ 9 Abs. 2). Plug-in-Hybride: § 9 Abs. 1 Nr. 2 c, ohne Befreiung.
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { elektroSteuer, gewichtSteuer, befreiung, phevSteuer } from '../../lib/engine/kfz';
import { iso, monatsName, datumText } from '../../lib/engine/datum';
import { P } from '../../lib/engine/params';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

const K = P.kfz;
interface Props { lang?: L; methodHref?: string; preset?: { antrieb?: string } }
export default function KfzRechner({ lang = 'de', methodHref, preset = {} }: Props) {
  const f = fm(lang);
  const d = { an: preset.antrieb ?? 'bev', zgg: 2200, mon: '11', jahr: '2026', ccm: 1498, co2: 30 };
  const [an, setAn] = useState(d.an); const [zgg, setZgg] = useState(d.zgg);
  const [mon, setMon] = useState(d.mon); const [jahr, setJahr] = useState(d.jahr);
  const [ccm, setCcm] = useState(d.ccm); const [co2, setCo2] = useState(d.co2);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setAn(str(u, 'an', d.an)); setZgg(num(u, 'kg', d.zgg)); setMon(str(u, 'm', d.mon)); setJahr(str(u, 'j', d.jahr)); setCcm(num(u, 'cc', d.ccm)); setCo2(num(u, 'co', d.co2));
  }, []);
  useEffect(() => { updateURL({ an, kg: zgg, m: mon, j: jahr, cc: an === 'phev' ? ccm : undefined, co: an === 'phev' ? co2 : undefined }); }, [an, zgg, mon, jahr, ccm, co2]);
  const z = iso(Number(jahr), Number(mon), 1);
  const bev = an === 'bev';
  const b = befreiung(z);
  const steuer = bev ? elektroSteuer(zgg) : phevSteuer(ccm, co2);
  const jahreFrei = b.bis ? (Number(b.bis.slice(0, 4)) - Number(jahr)) + (Number(b.bis.slice(5, 7)) - Number(mon) + 1) / 12 : 0;
  const ersparnis = bev && b.befreit ? Math.round(steuer * jahreFrei) : 0;
  const jahre = Array.from({ length: 2030 - 2011 + 1 }, (_, i) => String(2011 + i)).map((x) => ({ value: x, label: x }));
  const monate = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, lang) }));
  const kopf = bev ? (b.befreit ? tx(lang, `steuerfrei bis ${datumText(b.bis!, 'de')}`, `tax-free until ${datumText(b.bis!, 'en')}`) : tx(lang, 'keine Befreiung für dieses Zulassungsdatum', 'no exemption for this registration date')) : tx(lang, 'Plug-in-Hybride sind nicht befreit', 'plug-in hybrids are not exempt');
  const steps = bev ? [
    tx(lang, `Gewicht ${f.num(zgg)} kg: ${Math.ceil(Math.min(zgg, 3500) / K.je_kg)} angefangene 200-kg-Stufen nach § 9 Abs. 1 Nr. 3 KraftStG, zusammen ${f.eur2(gewichtSteuer(zgg))}.`, `Weight ${f.num(zgg)} kg: ${Math.ceil(Math.min(zgg, 3500) / K.je_kg)} started 200 kg steps under section 9(1) no. 3 KraftStG, together ${f.eur2(gewichtSteuer(zgg))}.`),
    tx(lang, `Elektrofahrzeuge zahlen die Hälfte (§ 9 Abs. 2): ${f.eur2(steuer)} im Jahr.`, `Electric vehicles pay half (section 9(2)): ${f.eur2(steuer)} a year.`),
    b.befreit ? tx(lang, `§ 3d: zehn Jahre ab Erstzulassung, längstens bis ${datumText(K.befreiung_ende_spaetestens, 'de')}. Hier: bis ${datumText(b.bis!, 'de')}.`, `Section 3d: ten years from first registration, at the latest until ${datumText(K.befreiung_ende_spaetestens, 'en')}. Here: until ${datumText(b.bis!, 'en')}.`) : tx(lang, `§ 3d gilt nur für Erstzulassungen vom ${datumText(K.befreiung_zulassung_von, 'de')} bis ${datumText(K.befreiung_zulassung_bis, 'de')}.`, `Section 3d only covers first registrations from ${datumText(K.befreiung_zulassung_von, 'en')} to ${datumText(K.befreiung_zulassung_bis, 'en')}.`),
  ] : [
    tx(lang, `Hubraum ${f.num(ccm)} cm³: je angefangene 100 cm³ ${f.eur2(K.hubraum_otto_eur)} (Benziner) = ${f.eur2(Math.ceil(ccm / 100) * K.hubraum_otto_eur)}.`, `Engine ${f.num(ccm)} cc: ${f.eur2(K.hubraum_otto_eur)} per started 100 cc (petrol) = ${f.eur2(Math.ceil(ccm / 100) * K.hubraum_otto_eur)}.`),
    tx(lang, `CO2 ${f.num(co2)} g/km: erst über ${K.co2_frei_g_km} g/km kostet jedes Gramm, gestaffelt ab ${f.eur2(K.co2_stufen[0].eur)}.`, `CO2 ${f.num(co2)} g/km: each gram only costs above ${K.co2_frei_g_km} g/km, tiered from ${f.eur2(K.co2_stufen[0].eur)}.`),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(ev) => ev.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="kfz-kg" label={tx(lang, 'Zulässiges Gesamtgewicht', 'Permitted total weight')} value={zgg} onChange={setZgg} unit="kg" max={3500} lang={lang} help={tx(lang, 'Fahrzeugschein, Feld F.2', 'registration certificate, field F.2')} />
            <Toggle id="kfz-an" label={tx(lang, 'Antrieb', 'Drive')} value={an} onChange={setAn} options={[{ value: 'bev', label: tx(lang, 'Elektro', 'Electric') }, { value: 'phev', label: 'Plug-in' }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="kfz-m" label={tx(lang, 'Erstzulassung', 'First registration')} value={mon} onChange={setMon} options={monate} />
            <SelectField id="kfz-j" label={tx(lang, 'Jahr', 'Year')} value={jahr} onChange={setJahr} options={jahre} />
          </div>
          {!bev && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberField id="kfz-cc" label={tx(lang, 'Hubraum', 'Engine size')} value={ccm} onChange={setCcm} unit="cm³" max={8000} lang={lang} />
              <NumberField id="kfz-co" label={tx(lang, 'CO2 gewichtet', 'CO2 weighted')} value={co2} onChange={setCo2} unit="g/km" max={400} lang={lang} />
            </div>
          )}
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={bev ? tx(lang, 'Kfz-Steuer heute', 'Vehicle tax today') : tx(lang, 'Kfz-Steuer im Jahr', 'Vehicle tax a year')} wert={bev && b.befreit ? f.eur(0) : f.eur2(steuer)} unter={kopf} />
          <Zeilen rows={[
            { label: tx(lang, bev ? 'Jahressteuer nach der Befreiung' : 'Jahressteuer', bev ? 'Annual tax after the exemption' : 'Annual tax'), value: f.eur2(steuer) },
            ...(bev && b.befreit ? [{ label: tx(lang, 'Ersparnis bis zum Ende der Befreiung', 'Saving until the exemption ends'), value: f.eur(ersparnis), strong: true }] : []),
            { label: tx(lang, 'Zahlung', 'Payment'), value: steuer > K.halbjahr_ab_eur ? tx(lang, 'jährlich, halbjährlich möglich', 'yearly, half-yearly possible') : tx(lang, 'jährlich im Voraus', 'yearly in advance'), muted: true },
          ]} />
          <Hinweis lang={lang} methodHref={methodHref} text={tx(lang, 'Schätzung nach §§ 3d und 9 KraftStG; festgesetzt wird die Steuer vom Hauptzollamt. ', 'Estimate under sections 3d and 9 KraftStG; the main customs office sets the tax. ')} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `Kfz-Steuer: ${f.eur2(steuer)} im Jahr`, `Vehicle tax: ${f.eur2(steuer)} a year`)} />
        </div>
      </div>
    </div>
  );
}
