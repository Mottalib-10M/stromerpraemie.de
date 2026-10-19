# -*- coding: utf-8 -*-
"""Baut src/data/modelle.json: Modelle × Listenpreis (Herstellerquelle, datiert) × Neuzulassungen KBA FZ10 je Monat
× Bewilligungen der E-Auto-Förderung (BAFA-Statistik, Stand 1. Oktober 2026).

Rejouable :  python3 scripts/build-modelle.py
Entrées :
  research/kba/fz10_2026_MM.xlsx   KBA, Datenlizenz Deutschland – Namensnennung – Version 2.0 (© Kraftfahrt-Bundesamt, Flensburg)
                                   Blatt « FZ 10.1 », Spalte 3 Monat ; BEV Spalte 36, PHEV Spalte 27 (0-basiert ab Spalte A).
  research/preise-lot-*.json       Listenpreise (UVP/UPE inkl. 19 % MwSt.) aus Preislisten und Modellseiten der Hersteller,
                                   mit URL, Lesedatum und wörtlichem Zitat. Ohne lesbare Herstellerquelle: preis null.
  BAFA                             Bewilligungen je Modell aus research/bafa/statistik-2026-10-01.txt (PDF des BAFA),
                                   unten als Summe der Varianten eingetragen ; die Varianten stehen im Kommentar.
"""
import glob
import json
import os
import re
import sys

import openpyxl

HIER = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HIER)

# id, Marke, Name, Antrieb, (KBA-Marke, KBA-Modellreihe), BAFA-Bewilligungen, Muster für den Preis (modele im Preis-JSON)
MODELLE = [
    ('tesla-model-y', 'Tesla', 'Model Y', 'bev', ('TESLA', 'MODEL Y'), 8297, r'Model Y'),
    ('tesla-model-3', 'Tesla', 'Model 3', 'bev', ('TESLA', 'MODEL 3'), 3845, r'Model 3'),
    # ELROQ 85 2 097 + 60 1 567 + 50 1 212 + RS 602 + 85X 232
    ('skoda-elroq', 'Skoda', 'Elroq', 'bev', ('SKODA', 'ELROQ'), 5710, r'Elroq'),
    # ENYAQ 85 594 + 60 270 + RS 253 + 85X 71
    ('skoda-enyaq', 'Skoda', 'Enyaq', 'bev', ('SKODA', 'ENYAQ'), 1188, r'Enyaq'),
    ('leapmotor-t03', 'Leapmotor', 'T03', 'bev', ('LEAPMOTOR', 'T03'), 3561, r'T03'),
    ('leapmotor-b10', 'Leapmotor', 'B10', 'bev', ('LEAPMOTOR', 'B10'), 1268, r'B10'),
    ('hyundai-inster', 'Hyundai', 'Inster', 'bev', ('HYUNDAI', 'INSTER'), 3337, r'Inster'),
    ('hyundai-kona', 'Hyundai', 'Kona Elektro', 'bev', ('HYUNDAI', 'KONA'), 1084, r'Kona'),
    # iX1 eDrive20 2 518 + xDrive30 421 ; KBA zählt den iX1 in der Reihe X1 (Spalte BEV)
    ('bmw-ix1', 'BMW', 'iX1', 'bev', ('BMW', 'X1'), 2939, r'iX1'),
    # KBA-Reihe C3 (BEV) enthält ë-C3 ; der ë-C3 Aircross steht beim BAFA getrennt (1 070)
    ('citroen-e-c3', 'Citroën', 'ë-C3', 'bev', ('CITROEN', 'C3'), 2513, r'ë-C3(?! Aircross)|e-C3(?! Aircross)'),
    ('dacia-spring', 'Dacia', 'Spring', 'bev', ('DACIA', 'SPRING'), 2402, r'Spring'),
    ('fiat-500e', 'Fiat', '500e', 'bev', ('FIAT', '500'), 2137, r'500e|500 Elektro'),
    ('fiat-grande-panda', 'Fiat', 'Grande Panda Elektro', 'bev', ('FIAT', 'GRANDE PANDA'), 1325, r'Panda'),
    ('renault-5', 'Renault', 'Renault 5', 'bev', ('RENAULT', 'R5'), 1963, r'Renault 5\b|\bR5\b'),
    ('renault-twingo', 'Renault', 'Twingo', 'bev', ('RENAULT', 'TWINGO'), 1257, r'Twingo'),
    ('renault-4', 'Renault', 'Renault 4', 'bev', ('RENAULT', 'R4'), 1241, r'Renault 4\b|\bR4\b'),
    ('kia-ev3', 'Kia', 'EV3', 'bev', ('KIA', 'EV3'), 1934, r'EV3'),
    ('kia-ev2', 'Kia', 'EV2', 'bev', ('KIA', 'EV2'), 1443, r'EV2'),
    ('kia-ev4', 'Kia', 'EV4', 'bev', ('KIA', 'EV4'), 883, r'EV4'),
    # ID.3 PRO 1 863 + PURE 1 013 + PRO S 252 + NEO 140 kW 125 + GTX 105 + NEO 125 kW 79 + GTX PERF. 64 + NEO 170 kW 39 + 1
    ('vw-id3', 'Volkswagen', 'ID.3', 'bev', ('VW', 'ID.3'), 3541, r'ID\.3'),
    # Cupra zählt das KBA unter SEAT
    ('cupra-tavascan', 'Cupra', 'Tavascan', 'bev', ('SEAT', 'TAVASCAN'), 1687, r'Tavascan'),
    # BORN 170/60 1 172 + 140/58 566 + 150/60 559 + 170/79 342 + 240/79 156 + 170/77 11
    ('cupra-born', 'Cupra', 'Born', 'bev', ('SEAT', 'BORN'), 2806, r'Born'),
    ('ford-explorer', 'Ford', 'Explorer', 'bev', ('FORD', 'EXPLORER'), 1543, r'Explorer'),
    ('ford-puma', 'Ford', 'Puma Gen-E', 'bev', ('FORD', 'PUMA'), 1338, r'Puma'),
    ('byd-dolphin-surf', 'BYD', 'Dolphin Surf', 'bev', ('BYD', 'DOLPHIN SURF'), 1388, r'Dolphin Surf'),
    ('byd-seal-u-dmi', 'BYD', 'Seal U DM-i', 'phev', ('BYD', 'SEAL U'), 1436, r'Seal U'),
    ('opel-corsa', 'Opel', 'Corsa Electric', 'bev', ('OPEL', 'CORSA'), 1228, r'Corsa'),
    ('mg4-urban', 'MG', 'MG4 Urban', 'bev', ('MG ROEWE', '4'), 932, r'MG4 Urban'),
    ('volvo-ex30', 'Volvo', 'EX30', 'bev', ('VOLVO', 'EX30'), 777, r'EX30'),
]

# Bezeichnung der Version zum Listenpreis, wie in der Herstellerquelle (de, en)
VERSION = {
    'skoda-elroq': 'Elroq 60 Essence, 140 kW', 'leapmotor-t03': 'T03 Smart, 37,3 kWh', 'vw-id3': ('ID.3 Neo, Einstiegsversion', 'ID.3 Neo, entry version'),
    'hyundai-inster': 'Inster Select, 42 kWh', 'bmw-ix1': 'iX1 eDrive20, 65,2 kWh', 'cupra-born': 'Born 140 kW, 58 kWh',
    'citroen-e-c3': 'ë-C3 You, Urban Range 29,3 kWh', 'dacia-spring': 'Spring Expression', 'fiat-500e': '500 Elektro Pop, 23,8 kWh',
    'renault-5': 'Evolution 120 Urban Range, 40 kWh', 'kia-ev3': 'EV3 Air, 58,3 kWh', 'cupra-tavascan': 'Tavascan Endurance, 58 kWh',
    'ford-explorer': 'Explorer Style, 58 kWh', 'kia-ev2': 'EV2 Light, 42,2 kWh', 'ford-puma': 'Puma Gen-E, 46,8 kWh',
    'leapmotor-b10': ('B10, Einstiegsversion', 'B10, entry version'), 'renault-twingo': 'Twingo Evolution 80 Urban Range, 27,5 kWh',
    'renault-4': ('Renault 4, Einstiegspreis', 'Renault 4, entry price'), 'skoda-enyaq': 'Enyaq 60 Essence', 'hyundai-kona': 'Kona Elektro Select, 49 kWh',
    'kia-ev4': 'EV4 Air, 58,3 kWh',
}

MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']


def zahl(x):
    return int(x) if isinstance(x, (int, float)) else 0


def kba_monat(datei):
    ws = openpyxl.load_workbook(datei, read_only=True, data_only=True)['FZ 10.1']
    marke, out = None, {}
    for r in list(ws.iter_rows(values_only=True))[9:]:
        if r[1]:
            marke = str(r[1]).strip()
        if r[2] is None or marke is None:
            continue
        out[(marke, str(r[2]).strip())] = {'bev': zahl(r[36]), 'phev': zahl(r[27])}
    return out


def main():
    dateien = sorted(glob.glob(os.path.join(SITE, 'research/kba/fz10_2026_*.xlsx')))
    if not dateien:
        sys.exit('research/kba/fz10_2026_*.xlsx fehlt')
    monate = [kba_monat(d) for d in dateien]
    letzter = int(re.search(r'_(\d\d)\.xlsx$', dateien[-1]).group(1))
    preise = []
    for f in sorted(glob.glob(os.path.join(SITE, 'research/preise-lot-*.json'))):
        preise += json.load(open(f, encoding='utf-8'))
    out = []
    for mid, marke, name, antrieb, kba, bafa, muster in MODELLE:
        reihe = [m.get(kba, {}).get(antrieb, 0) for m in monate]
        if not any(reihe):
            sys.exit(f'{mid} : keine KBA-Zeile {kba} ({antrieb})')
        p = next((x for x in preise if re.search(muster, x['modele'], re.I)), None)
        if p and p.get('prix_eur') is not None and not str(p.get('url', '')).startswith('http'):
            sys.exit(f'{mid} : Preis ohne Quelle')
        if p and p.get('prix_eur') is not None and mid not in VERSION:
            sys.exit(f'{mid} : Version fehlt in VERSION')
        out.append({
            'id': mid, 'marke': marke, 'name': name, 'antrieb': antrieb,
            'version': (lambda v: {'de': v[0], 'en': re.sub(r'(\d),(\d)', r'\1.\2', v[1])} if isinstance(v, tuple) else {'de': v, 'en': re.sub(r'(\d),(\d)', r'\1.\2', v)})(VERSION[mid]) if p and p.get('prix_eur') else None,
            'preis': p.get('prix_eur') if p else None,
            'batterie': p.get('batterie_kwh') if p and p.get('prix_eur') else None,
            'reichweite': p.get('autonomie_km') if p and p.get('prix_eur') else None,
            'quelle': p.get('url') if p and p.get('prix_eur') else None,
            'gelesen': p.get('lu_le') if p and p.get('prix_eur') else None,
            'bafa': bafa,
            'kba': reihe,
            'kba_summe': sum(reihe),
        })
    out.sort(key=lambda x: -x['bafa'])
    daten = {
        '_quelle': 'Generiert von scripts/build-modelle.py. KBA FZ10 (Datenlizenz Deutschland – Namensnennung 2.0, © Kraftfahrt-Bundesamt), BAFA-Statistik vom 1. Oktober 2026, Listenpreise der Hersteller.',
        'kba_bis_monat': letzter,
        'kba_bis_text': {'de': f'{MONATE[letzter - 1]} 2026', 'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][letzter - 1] + ' 2026'},
        'kba_veroeffentlicht': '2026-10-07',
        'bafa_stand': '2026-10-01',
        'preise_gelesen': '2026-10-19',
        'modelle': out,
    }
    ziel = os.path.join(SITE, 'src/data/modelle.json')
    json.dump(daten, open(ziel, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    mit = sum(1 for m in out if m['preis'])
    print(f'{ziel} : {len(out)} Modelle, {mit} mit Listenpreis, KBA Januar bis {MONATE[letzter - 1]} 2026')


if __name__ == '__main__':
    main()
