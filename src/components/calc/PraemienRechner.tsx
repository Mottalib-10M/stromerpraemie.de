/**
 * Prämienrechner: Förderung je Haushalt nach der Richtlinie vom 19. Mai 2026, dann Preis nach Förderung für ein Modell
 * und die beiden Fristen (Antrag 12 Monate, Haltedauer 36 Monate). Haushaltseinkommen: je Person der Durchschnitt
 * der zwei letzten Steuerbescheide, dann die Summe. Premier rendu = valeurs par défaut (url-state.ts, RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { foerderung, haushaltsZvE, fristen, kinderGezaehlt, nettopreis, type Antrieb } from '../../lib/engine/foerderung';
import { iso, monatsName, datumText } from '../../lib/engine/datum';
import { P } from '../../lib/engine/params';
import M from '../../data/modelle.json';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Zeilen, Aktionen, Kopf, Rechenweg, Hinweis, kasten, rahmen, raster, tx, fm, type L } from './kit';

const F = P.foerderung;
const STUFE = (s: number, l: L) => s < 0 ? tx(l, 'über der Einkommensgrenze', 'above the income limit')
  : s === 3 ? tx(l, `über ${fm(l).eur(F.grenzen[2])}, mit Kinderzuschlag`, `above ${fm(l).eur(F.grenzen[2])}, child top-up`)
  : tx(l, `Stufe ${s + 1}: bis ${fm(l).eur(F.grenzen[s])}`, `Band ${s + 1}: up to ${fm(l).eur(F.grenzen[s])}`);

export interface Preset { antrieb?: Antrieb; modell?: string; paar?: boolean; kinder?: number; e1?: number; e2?: number }
interface Props { lang?: L; methodHref?: string; preset?: Preset }

export default function PraemienRechner({ lang = 'de', methodHref, preset = {} }: Props) {
  const f = fm(lang);
  const startModell = preset.modell ?? (preset.antrieb === 'phev' ? 'byd-seal-u-dmi' : 'skoda-elroq');
  const m0 = M.modelle.find((m) => m.id === startModell);
  const d = {
    an: preset.antrieb ?? (m0?.antrieb as Antrieb) ?? 'bev', paar: preset.paar ? '1' : '0', a1: preset.e1 ?? 38000, b1: preset.e1 ?? 40000, a2: preset.e2 ?? 0, b2: preset.e2 ?? 0,
    k: String(preset.kinder ?? 0), mon: '11', jahr: '2026', mod: m0 && m0.preis ? m0.id : 'frei', preis: m0?.preis ?? 35000,
  };
  const [an, setAn] = useState<string>(d.an);
  const [paar, setPaar] = useState(d.paar);
  const [a1, setA1] = useState(d.a1); const [b1, setB1] = useState(d.b1);
  const [a2, setA2] = useState(d.a2); const [b2, setB2] = useState(d.b2);
  const [k, setK] = useState(d.k);
  const [mon, setMon] = useState(d.mon); const [jahr, setJahr] = useState(d.jahr);
  const [mod, setMod] = useState(d.mod); const [preis, setPreis] = useState(d.preis);
  useEffect(() => {
    const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setAn(str(u, 'an', d.an)); setPaar(str(u, 'p', d.paar)); setA1(num(u, 'a1', d.a1)); setB1(num(u, 'b1', d.b1)); setA2(num(u, 'a2', d.a2)); setB2(num(u, 'b2', d.b2));
    setK(str(u, 'k', d.k)); setMon(str(u, 'm', d.mon)); setJahr(str(u, 'j', d.jahr)); setMod(str(u, 'mo', d.mod)); setPreis(num(u, 'pr', d.preis));
  }, []);
  useEffect(() => { updateURL({ an, p: paar, a1, b1, a2: paar === '1' ? a2 : undefined, b2: paar === '1' ? b2 : undefined, k, m: mon, j: jahr, mo: mod, pr: preis }); }, [an, paar, a1, b1, a2, b2, k, mon, jahr, mod, preis]);

  const antrieb = (an === 'phev' ? 'phev' : 'bev') as Antrieb;
  const modelle = M.modelle.filter((m) => m.preis && m.antrieb === antrieb);
  const waehle = (id: string) => { setMod(id); const m = M.modelle.find((x) => x.id === id); if (m?.preis) setPreis(m.preis); };
  const wechsleAntrieb = (v: string) => { setAn(v); const erstes = M.modelle.find((m) => m.preis && m.antrieb === v); if (erstes) { setMod(erstes.id); setPreis(erstes.preis!); } else setMod('frei'); };
  const personen: Array<[number, number]> = paar === '1' ? [[a1, b1], [a2, b2]] : [[a1, b1]];
  const zve = haushaltsZvE(personen);
  const kinder = Number(k);
  const zulassung = iso(Number(jahr), Number(mon), 1);
  const e = useMemo(() => foerderung({ zve, kinder, antrieb, zulassung }), [zve, kinder, antrieb, zulassung]);
  const fr = fristen(zulassung);
  const netto = nettopreis(preis, e.betrag);
  const modell = M.modelle.find((m) => m.id === mod);
  const monatText = (isoD: string) => { const [j, m] = isoD.split('-').map(Number); return `${monatsName(m, lang)} ${j}`; };

  const jahre = ['2026', '2027', '2028', '2029'].map((j) => ({ value: j, label: j }));
  const monate = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monatsName(i + 1, lang) }));
  const kinderOpt = [0, 1, 2, 3].map((x) => ({ value: String(x), label: x === 3 ? tx(lang, '3 oder mehr', '3 or more') : String(x) }));
  const modellOpt = [...modelle.map((m) => ({ value: m.id, label: `${m.marke} ${m.name}` })), { value: 'frei', label: tx(lang, 'Anderes Modell, Preis eingeben', 'Other model, enter a price') }];

  const zeitraumText = antrieb === 'bev' ? datumText(F.bev_erstzulassung_bis, lang) : datumText(F.phev_erstzulassung_bis, lang);
  const unter = !e.zeitraum
    ? tx(lang, `nicht förderfähig: Erstzulassung nach dem ${zeitraumText}`, `not eligible: first registration after ${zeitraumText}`)
    : e.stufe < 0 ? tx(lang, `Haushaltseinkommen ${f.eur(zve)} über der Grenze von ${f.eur(e.grenze)}`, `household income ${f.eur(zve)} above the ${f.eur(e.grenze)} limit`)
    : STUFE(e.stufe, lang);
  const steps = [
    paar === '1'
      ? tx(lang, `Haushaltseinkommen: Person 1 (${f.eur(a1)} + ${f.eur(b1)}) / 2 = ${f.eur((a1 + b1) / 2)}, Person 2 (${f.eur(a2)} + ${f.eur(b2)}) / 2 = ${f.eur((a2 + b2) / 2)}, zusammen ${f.eur(zve)}.`, `Household income: person 1 (${f.eur(a1)} + ${f.eur(b1)}) / 2 = ${f.eur((a1 + b1) / 2)}, person 2 (${f.eur(a2)} + ${f.eur(b2)}) / 2 = ${f.eur((a2 + b2) / 2)}, together ${f.eur(zve)}.`)
      : tx(lang, `Haushaltseinkommen: (${f.eur(a1)} + ${f.eur(b1)}) / 2 = ${f.eur(zve)}, der Durchschnitt der zwei letzten Steuerbescheide.`, `Household income: (${f.eur(a1)} + ${f.eur(b1)}) / 2 = ${f.eur(zve)}, the average of the last two tax assessments.`),
    tx(lang, `Förderrelevante Kinder: ${kinderGezaehlt(kinder)}${kinder > F.max_kinder ? ` (höchstens ${F.max_kinder} zählen)` : ''}. Einkommensgrenze: ${f.eur(F.obergrenze_basis)} + ${f.eur(F.obergrenze_je_kind)} je Kind = ${f.eur(e.grenze)}.`, `Children counted: ${kinderGezaehlt(kinder)}${kinder > F.max_kinder ? ` (at most ${F.max_kinder} count)` : ''}. Income limit: ${f.eur(F.obergrenze_basis)} + ${f.eur(F.obergrenze_je_kind)} per child = ${f.eur(e.grenze)}.`),
    e.stufe >= 0 ? tx(lang, `Stufe nach der Tabelle der Richtlinie: ${STUFE(e.stufe, lang)}. ${antrieb === 'bev' ? 'Elektroauto' : 'Plug-in-Hybrid'} mit ${kinderGezaehlt(kinder)} Kind(ern): ${f.eur(e.zeitraum ? e.betrag : 0)}.`, `Band from the guideline table: ${STUFE(e.stufe, lang)}. ${antrieb === 'bev' ? 'Battery electric' : 'Plug-in hybrid'} with ${kinderGezaehlt(kinder)} child(ren): ${f.eur(e.zeitraum ? e.betrag : 0)}.`) : '',
    tx(lang, `Erstzulassung im ${monatText(zulassung)}: ${e.zeitraum ? 'im Förderzeitraum' : 'außerhalb des Förderzeitraums'} (${antrieb === 'bev' ? 'Elektroautos' : 'Plug-in-Hybride'} bis ${zeitraumText}).`, `First registration in ${monatText(zulassung)}: ${e.zeitraum ? 'inside the funding period' : 'outside the funding period'} (${antrieb === 'bev' ? 'battery electric cars' : 'plug-in hybrids'} until ${zeitraumText}).`),
    tx(lang, `Preis nach Förderung: ${f.eur(preis)} − ${f.eur(e.betrag)} = ${f.eur(netto)}. Die Förderung wird nach der Zulassung auf Ihr Konto gezahlt, nicht vom Händler abgezogen.`, `Price after the grant: ${f.eur(preis)} − ${f.eur(e.betrag)} = ${f.eur(netto)}. The grant is paid into your account after registration; the dealer does not deduct it.`),
  ].filter(Boolean);
  const text = () => tx(lang, `E-Auto-Förderung: ${f.eur(e.betrag)}, Preis nach Förderung ${f.eur(netto)}`, `EV grant: ${f.eur(e.betrag)}, price after grant ${f.eur(netto)}`);

  return (
    <div className={rahmen} data-chrome>
      <div className="srg h-1.5" aria-hidden="true" />
      <div className={raster}>
        <form onSubmit={(ev) => ev.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="pr-a1" label={tx(lang, 'zvE letzter Steuerbescheid', 'Taxable income, last assessment')} value={a1} onChange={setA1} unit="€" max={1000000} lang={lang} />
            <NumberField id="pr-b1" label={tx(lang, 'zvE vorletzter Bescheid', 'Assessment before that')} value={b1} onChange={setB1} unit="€" max={1000000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Toggle id="pr-an" label={tx(lang, 'Antrieb', 'Drive')} value={an} onChange={wechsleAntrieb} options={[{ value: 'bev', label: tx(lang, 'Elektro', 'Electric') }, { value: 'phev', label: 'Plug-in' }]} />
            <Toggle id="pr-p" label={tx(lang, 'Haushalt', 'Household')} value={paar} onChange={setPaar} options={[{ value: '0', label: tx(lang, 'Allein', 'Single') }, { value: '1', label: tx(lang, 'Paar', 'Couple') }]} />
          </div>
          {paar === '1' && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <NumberField id="pr-a2" label={tx(lang, 'Partner: zvE letzter Bescheid', 'Partner: last assessment')} value={a2} onChange={setA2} unit="€" max={1000000} lang={lang} />
              <NumberField id="pr-b2" label={tx(lang, 'Partner: vorletzter Bescheid', 'Partner: assessment before')} value={b2} onChange={setB2} unit="€" max={1000000} lang={lang} />
            </div>
          )}
          <div className="grid grid-cols-3 gap-x-4 gap-y-4">
            <SelectField id="pr-k" label={tx(lang, 'Kinder unter 18', 'Children under 18')} value={k} onChange={setK} options={kinderOpt} />
            <SelectField id="pr-m" label={tx(lang, 'Zulassung', 'Registration')} value={mon} onChange={setMon} options={monate} />
            <SelectField id="pr-j" label={tx(lang, 'Jahr', 'Year')} value={jahr} onChange={setJahr} options={jahre} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="pr-mo" label={tx(lang, 'Modell', 'Model')} value={mod} onChange={waehle} options={modellOpt} />
            <NumberField id="pr-pr" label={tx(lang, 'Kaufpreis', 'Purchase price')} value={preis} onChange={(x) => { setPreis(x); setMod('frei'); }} unit="€" max={300000} lang={lang} />
          </div>
          <p className="text-xs text-navy-600">{tx(lang, 'zvE = zu versteuerndes Einkommen laut Steuerbescheid. Bei Zusammenveranlagung: den gemeinsamen Wert halbiert je Person eintragen.', 'zvE = taxable income on the tax assessment. For a joint assessment, enter half of the joint figure for each person.')}</p>
        </form>
        <div aria-live="polite" data-resultat className={kasten}>
          <Kopf label={tx(lang, 'Ihre E-Auto-Förderung', 'Your EV grant')} wert={f.eur(e.betrag)} unter={unter} />
          <Zeilen rows={[
            { label: tx(lang, 'Haushaltseinkommen (zvE)', 'Household taxable income'), value: f.eur(zve) },
            { label: tx(lang, 'Grenze für Ihre Kinderzahl', 'Limit for your number of children'), value: f.eur(e.grenze) },
            ...(e.spielraum !== null && e.betrag > 0 ? [{ label: e.naechsterBetrag ? tx(lang, `Einkommen-Spielraum, bevor die Förderung auf ${f.eur(e.naechsterBetrag)} sinkt`, `Income headroom before the grant drops to ${f.eur(e.naechsterBetrag)}`) : tx(lang, 'Einkommen-Spielraum, bevor die Förderung entfällt', 'Income headroom before the grant ends'), value: f.eur(e.spielraum), muted: true }] : []),
            { label: modell && mod !== 'frei' ? `${modell.marke} ${modell.name}` : tx(lang, 'Kaufpreis', 'Purchase price'), value: f.eur(preis), sep: true },
            { label: tx(lang, 'Preis nach Förderung', 'Price after the grant'), value: f.eur(netto), strong: true },
            { label: tx(lang, `Antrag spätestens (${F.antragsfrist_monate} Monate nach Zulassung)`, `Apply by (${F.antragsfrist_monate} months after registration)`), value: monatText(fr.antragBis), sep: true },
            { label: tx(lang, 'Halten bis zum Vortag des Zulassungstags im', 'Keep the car until the day before the registration day in'), value: monatText(fr.haltenMonat) },
          ]} />
          {e.plusKind > 0 && <p className="mt-2 text-sm text-navy-700">{tx(lang, `Mit einem weiteren Kind unter 18: ${f.eur(e.plusKind)} mehr.`, `With one more child under 18: ${f.eur(e.plusKind)} more.`)}</p>}
          {antrieb === 'phev' && <p className="mt-2 text-sm text-navy-700">{tx(lang, `Plug-in-Hybride nur mit höchstens ${F.phev_co2_max_g_km} g CO2/km oder mindestens ${F.phev_reichweite_min_km} km elektrischer Reichweite (Übereinstimmungsbescheinigung).`, `Plug-in hybrids only with at most ${F.phev_co2_max_g_km} g CO2/km or at least ${F.phev_reichweite_min_km} km electric range (certificate of conformity).`)}</p>}
          {modell && mod !== 'frei' && modell.gelesen && <p className="mt-2 text-xs text-navy-600">{tx(lang, `Listenpreis ${modell.version?.[lang]}, Herstellerangabe gelesen am ${datumText(modell.gelesen, 'de')}.`, `List price ${modell.version?.[lang]}, manufacturer figure read on ${datumText(modell.gelesen, 'en')}.`)}</p>}
          <Hinweis lang={lang} methodHref={methodHref} />
          <Rechenweg lang={lang} steps={steps} />
          <Aktionen lang={lang} text={text} />
        </div>
      </div>
    </div>
  );
}
