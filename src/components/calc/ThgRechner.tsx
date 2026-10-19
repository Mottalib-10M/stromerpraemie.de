/**
 * THG-Prämie: was der Verkauf der THG-Quote eines Elektroautos über mehrere Jahre bringt. Der Betrag je Jahr ist ein
 * Marktpreis des Anbieters, kein Rechtswert; der Rechner multipliziert ihn und zeigt die anrechenbare Strommenge
 * (Schätzwert nach § 7 der 38. BImSchV, dreifach angerechnet) und die Meldefrist.
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { erloes, schaetzwert, angerechnet, type Klasse } from '../../lib/engine/thg';
import { P } from '../../lib/engine/params';
import { datumText } from '../../lib/engine/datum';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

const T = P.thg;
interface Props { lang?: L; methodHref?: string; preset?: Record<string, never> }
export default function ThgRechner({ lang = 'de', methodHref }: Props) {
  const f = fm(lang);
  const d = { kl: 'm1', an: 'bev', pr: T.markt_ohne_bonus_ab_eur, geb: 0, j: 3, n: 1 };
  const [kl, setKl] = useState(d.kl); const [an, setAn] = useState(d.an);
  const [pr, setPr] = useState(d.pr); const [geb, setGeb] = useState(d.geb);
  const [j, setJ] = useState(String(d.j)); const [n, setN] = useState(d.n);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setKl(str(u, 'kl', d.kl)); setAn(str(u, 'an', d.an)); setPr(num(u, 'pr', d.pr)); setGeb(num(u, 'g', d.geb)); setJ(str(u, 'j', String(d.j))); setN(num(u, 'n', d.n));
  }, []);
  useEffect(() => { updateURL({ kl, an, pr, g: geb, j, n }); }, [kl, an, pr, geb, j, n]);
  const ok = an === 'bev';
  const fz = Math.max(1, Math.round(n) || 1);
  const e = erloes({ praemie: ok ? pr : 0, jahre: Number(j), fahrzeuge: fz, gebuehr: geb });
  const k = kl as Klasse;
  const steps = [
    tx(lang, `Schätzwert je ${k === 'm1' ? 'Pkw' : 'leichtem Nutzfahrzeug'}: ${f.num(schaetzwert(k))} kWh im Jahr, ohne Nachweis des tatsächlichen Verbrauchs (Bekanntmachung des Umweltbundesamts).`, `Estimate per ${k === 'm1' ? 'car' : 'light commercial vehicle'}: ${f.num(schaetzwert(k))} kWh a year, with no proof of actual use (Federal Environment Agency notice).`),
    tx(lang, `Auf die Quote der Mineralölwirtschaft zählt Strom ${T.multiplikator_strom}-fach: ${f.num(angerechnet(k))} kWh. Diese Menge kauft ein Quotenpflichtiger über den Anbieter.`, `Electricity counts ${T.multiplikator_strom} times towards the fuel suppliers' quota: ${f.num(angerechnet(k))} kWh. A supplier under the obligation buys that amount through your provider.`),
    ok ? tx(lang, `Auszahlung: (${f.eur(pr)} − ${f.eur(geb)} Gebühr) × ${fz} Fahrzeug(e) × ${j} Jahr(e) = ${f.eur(e.gesamt)}.`, `Payout: (${f.eur(pr)} − ${f.eur(geb)} fee) × ${fz} vehicle(s) × ${j} year(s) = ${f.eur(e.gesamt)}.`)
      : tx(lang, 'Plug-in-Hybride können den Schätzwert nicht nutzen; nur reine Elektrofahrzeuge.', 'Plug-in hybrids cannot use the flat estimate; only battery electric vehicles can.'),
  ];
  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(ev) => ev.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="thg-pr" label={tx(lang, 'Prämie des Anbieters je Jahr', 'Provider payout a year')} value={pr} onChange={setPr} unit="€" max={2000} lang={lang} />
            <NumberField id="thg-g" label={tx(lang, 'Gebühr je Antrag', 'Fee per claim')} value={geb} onChange={setGeb} unit="€" max={500} lang={lang} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <Toggle id="thg-an" label={tx(lang, 'Antrieb', 'Drive')} value={an} onChange={setAn} options={[{ value: 'bev', label: tx(lang, 'Elektro', 'Electric') }, { value: 'phev', label: 'Plug-in' }]} />
            <Toggle id="thg-kl" label={tx(lang, 'Fahrzeugklasse', 'Vehicle class')} value={kl} onChange={setKl} options={[{ value: 'm1', label: tx(lang, 'Pkw', 'Car') }, { value: 'n1', label: tx(lang, 'Transporter', 'Van') }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="thg-j" label={tx(lang, 'Jahre', 'Years')} value={j} onChange={setJ} options={[1, 2, 3, 4, 5].map((x) => ({ value: String(x), label: String(x) }))} />
            <NumberField id="thg-n" label={tx(lang, 'Fahrzeuge', 'Vehicles')} value={n} onChange={setN} max={50} lang={lang} />
          </div>
          <p className="text-xs text-navy-600">{tx(lang, `Marktstand ${datumText(T.markt_stand, 'de')}: über ${f.eur(T.markt_ohne_bonus_ab_eur)} auch ohne Bonus, bis ${f.eur(T.markt_bis_eur)} mit Bonus (Finanztip). Ihr Angebot zählt.`, `Market as of ${datumText(T.markt_stand, 'en')}: over ${f.eur(T.markt_ohne_bonus_ab_eur)} even without a bonus, up to ${f.eur(T.markt_bis_eur)} with one (Finanztip). Your offer is what counts.`)}</p>
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'THG-Prämie insgesamt', 'GHG quota payout in total')} wert={f.eur(e.gesamt)} unter={ok ? tx(lang, `${f.eur(e.jeJahr)} je Jahr`, `${f.eur(e.jeJahr)} a year`) : tx(lang, 'nicht über den Schätzwert', 'not through the flat estimate')} />
          <Zeilen rows={[
            { label: tx(lang, 'Schätzwert je Fahrzeug und Jahr', 'Estimate per vehicle and year'), value: `${f.num(schaetzwert(k))} kWh` },
            { label: tx(lang, 'Angerechnet (dreifach)', 'Credited (three times)'), value: `${f.num(angerechnet(k))} kWh` },
            { label: tx(lang, 'Wer beantragen darf', 'Who may claim'), value: tx(lang, 'Halter laut Fahrzeugschein', 'Keeper on the registration') },
            { label: tx(lang, 'Meldung an das UBA bis', 'Report to the UBA by'), value: tx(lang, `${T.frist_mitteilung} des Folgejahres`, '28 February of the following year'), sep: true },
          ]} />
          <Hinweis lang={lang} methodHref={methodHref} text={tx(lang, 'Schätzung mit dem Betrag, den Sie eingeben; die THG-Prämie ist ein Marktpreis und keine staatliche Leistung. ', 'Estimate with the amount you enter; the GHG quota payout is a market price, not a state benefit. ')} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={() => tx(lang, `THG-Prämie: ${f.eur(e.gesamt)}`, `GHG quota payout: ${f.eur(e.gesamt)}`)} />
        </div>
      </div>
    </div>
  );
}
