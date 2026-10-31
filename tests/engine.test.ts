import { describe, expect, it } from 'vitest';
import { foerderung, haushaltsZvE, stufe, obergrenze, betragTabelle, fristen, tabelle, zeitraumOk, phevFoerderfaehig, nettopreis } from '../src/lib/engine/foerderung';
import { gewichtSteuer, elektroSteuer, befreiung, phevSteuer } from '../src/lib/engine/kfz';
import { plusMonate, minusTag } from '../src/lib/engine/datum';
import { angerechnet, erloes } from '../src/lib/engine/thg';

const f = (zve: number, kinder: number, antrieb: 'bev' | 'phev' = 'bev', zulassung = '2026-07-01') => foerderung({ zve, kinder, antrieb, zulassung }).betrag;

describe('Förderhöhe nach der Tabelle der Richtlinie', () => {
  it('BEV: alle 15 Felder', () => {
    expect([0, 1, 2].map((k) => f(30000, k))).toEqual([5000, 5500, 6000]);
    expect([0, 1, 2].map((k) => f(50000, k))).toEqual([4000, 4500, 5000]);
    expect([0, 1, 2].map((k) => f(70000, k))).toEqual([3000, 3500, 4000]);
    expect([0, 1, 2].map((k) => f(82000, k))).toEqual([0, 3500, 4000]);
    expect([0, 1, 2].map((k) => f(88000, k))).toEqual([0, 0, 4000]);
  });
  it('PHEV: alle 15 Felder', () => {
    expect([0, 1, 2].map((k) => f(30000, k, 'phev'))).toEqual([3500, 4000, 4500]);
    expect([0, 1, 2].map((k) => f(50000, k, 'phev'))).toEqual([2500, 3000, 3500]);
    expect([0, 1, 2].map((k) => f(70000, k, 'phev'))).toEqual([1500, 2000, 2500]);
    expect([0, 1, 2].map((k) => f(82000, k, 'phev'))).toEqual([0, 2000, 2500]);
    expect([0, 1, 2].map((k) => f(88000, k, 'phev'))).toEqual([0, 0, 2500]);
  });
  it('Grenzen sind eingeschlossen', () => {
    expect(f(45000, 0)).toBe(5000); expect(f(45001, 0)).toBe(4000);
    expect(f(60000, 0)).toBe(4000); expect(f(60001, 0)).toBe(3000);
    expect(f(80000, 0)).toBe(3000); expect(f(80001, 0)).toBe(0);
    expect(f(85000, 1)).toBe(3500); expect(f(85001, 1)).toBe(0);
    expect(f(90000, 2)).toBe(4000); expect(f(90001, 2)).toBe(0);
    expect(f(45000.5, 0)).toBe(4000);
  });
  it('höchstens zwei Kinder zählen', () => {
    expect(f(30000, 3)).toBe(6000); expect(f(30000, 5)).toBe(6000);
    expect(obergrenze(4)).toBe(90000); expect(f(90001, 4)).toBe(0);
  });
  it('Zeitraum der Erstzulassung', () => {
    expect(f(30000, 0, 'bev', '2025-12-31')).toBe(0);
    expect(f(30000, 0, 'bev', '2026-01-01')).toBe(5000);
    expect(f(30000, 0, 'bev', '2029-12-31')).toBe(5000);
    expect(f(30000, 0, 'bev', '2030-01-01')).toBe(0);
    expect(f(30000, 0, 'phev', '2027-06-30')).toBe(3500);
    expect(f(30000, 0, 'phev', '2027-07-01')).toBe(0);
    expect(zeitraumOk('phev', '2026-01-01')).toBe(true);
  });
  it('Spielraum und nächste Kürzung', () => {
    const e = foerderung({ zve: 44000, kinder: 0, antrieb: 'bev', zulassung: '2026-07-01' });
    expect(e.stufe).toBe(0); expect(e.spielraum).toBe(1000); expect(e.naechsterBetrag).toBe(4000); expect(e.plusKind).toBe(500);
    const g = foerderung({ zve: 82000, kinder: 1, antrieb: 'bev', zulassung: '2026-07-01' });
    expect(g.stufe).toBe(3); expect(g.spielraum).toBe(3000); expect(g.naechsterBetrag).toBe(0); expect(g.plusKind).toBe(500);
    const h = foerderung({ zve: 70000, kinder: 2, antrieb: 'bev', zulassung: '2026-07-01' });
    expect(h.spielraum).toBe(20000); expect(h.naechsterBetrag).toBe(0); expect(h.plusKind).toBe(0);
    expect(foerderung({ zve: 95000, kinder: 2, antrieb: 'bev', zulassung: '2026-07-01' }).spielraum).toBeNull();
  });
  it('Tabelle mit fünf Zeilen', () => {
    const t = tabelle('bev');
    expect(t.map((z) => z.bis)).toEqual([45000, 60000, 80000, 85000, 90000]);
    expect(t[3].betraege).toEqual([0, 3500, 4000]);
    expect(t[4].betraege).toEqual([0, 0, 4000]);
  });
});

describe('Haushaltseinkommen', () => {
  it('Durchschnitt je Person, dann Summe', () => {
    expect(haushaltsZvE([[40000, 50000]])).toBe(45000);
    expect(haushaltsZvE([[40000, 50000], [20000, 30000]])).toBe(70000);
    expect(haushaltsZvE([[0, 0]])).toBe(0);
    expect(haushaltsZvE([[-5000, 10000]])).toBe(5000);
  });
  it('Paar: knapp über der Stufe', () => {
    expect(stufe(haushaltsZvE([[30000, 31001], [14000, 15000]]), 0)).toBe(1);
    expect(betragTabelle(45000, 0, 'bev')).toBe(5000);
  });
});

describe('Fristen', () => {
  it('Antrag 12 Monate, Haltedauer 36 Monate', () => {
    expect(fristen('2026-03-15')).toEqual({ antragBis: '2027-03-15', haltenBis: '2029-03-14', haltenMonat: '2029-03-15' });
    // Seite Haltedauer: Zulassung im November 2026 → halten bis in den November 2029 (Vortag des Zulassungstags)
    expect(fristen('2026-11-01').haltenMonat.slice(0, 7)).toBe('2029-11');
    expect(plusMonate('2026-01-31', 1)).toBe('2026-02-28');
    expect(minusTag('2029-01-01')).toBe('2028-12-31');
  });
  it('Plug-in-Hybrid förderfähig', () => {
    expect(phevFoerderfaehig(60, 50)).toBe(true); expect(phevFoerderfaehig(61, 80)).toBe(true); expect(phevFoerderfaehig(61, 79)).toBe(false);
    expect(nettopreis(18900, 6000)).toBe(12900);
  });
});

describe('Kfz-Steuer', () => {
  it('§ 9 Abs. 1 Nr. 3, gestaffelt je 200 kg', () => {
    expect(gewichtSteuer(2000)).toBe(112.5);
    expect(gewichtSteuer(2001)).toBe(124.52);
    expect(gewichtSteuer(2400)).toBe(136.54);
    expect(gewichtSteuer(3000)).toBe(172.6);
    expect(gewichtSteuer(3100)).toBe(185.38);
    expect(elektroSteuer(2400)).toBe(68.27);
    expect(elektroSteuer(1500)).toBe(45);
  });
  it('§ 3d: zehn Jahre, längstens bis Ende 2035', () => {
    expect(befreiung('2026-07-01')).toEqual({ befreit: true, bis: '2035-12-31' });
    expect(befreiung('2024-03-10')).toEqual({ befreit: true, bis: '2034-03-09' });
    expect(befreiung('2031-01-01').befreit).toBe(false);
    expect(befreiung('2011-05-17').befreit).toBe(false);
  });
  it('Plug-in-Hybrid', () => {
    expect(phevSteuer(1498, 30)).toBe(30);
    expect(phevSteuer(1998, 120)).toBe(40 + 20 * 2 + 5 * 2.2);
    expect(phevSteuer(1995, 40, true)).toBe(190);
  });
});

describe('THG', () => {
  it('Schätzwert dreifach', () => {
    expect(angerechnet('m1')).toBe(6000); expect(angerechnet('n1')).toBe(9000);
    expect(erloes({ praemie: 300, jahre: 3, fahrzeuge: 1 })).toEqual({ jeJahr: 300, gesamt: 900 });
  });
});
