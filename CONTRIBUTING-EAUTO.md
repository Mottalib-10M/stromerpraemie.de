# Seiten von Stromerprämie (de-eauto) schreiben und erweitern

Notice pour les agents qui prolongent le site (aide d'État allemande à l'achat d'une voiture électrique neuve,
Richtlinie du 19 mai 2026 ; prix net par modèle ; THG-Quote ; Kfz-Steuer ; wallbox ; de + en).
À lire avec `~/Documents/GitHub/RECETTE-SITE.md` (§0, §3, §5, §6, §7, §9.3, §11, §17.4, §21, §26) et
**`research/fakten.md`** (seuls faits autorisés, avec la clé de source de chaque fait).

## Principe : une page = un fichier

- `src/content/guides/<id>.ts` : guide (champ `mini`, ≥ 1 300 mots resume + FAQ + corps par langue) ;
- `src/content/rechner/<id>.ts` : page outil (champ `tool` : `praemie`, `thg`, `kfz`, `modelle`) ;
- `src/content/modelle/<id>.ts` : page modèle (outil `praemie` + `toolPreset: { modell: '<id de modelle.json>' }`) ;
- `src/content/home.ts` : textes de l'accueil (page pilier, ≥ 2 000 mots par langue).

Liste fermée des pages prévues (id, dossier, slugs, groupe, mini/outil, requêtes) : `tests/planned-ids.json`.
Format de fichier : `src/lib/guide-types.ts`. Exemples de structure (sujet différent, copier la forme, jamais le
fond) : `../rentenfenster.de/src/content/guides/arbeitslos-vor-der-rente.ts`. `check-unique` ≤ 30 % entre deux pages ;
une question de FAQ n'existe qu'une fois sur le site.

Le cœur (routes, menus, sitemap, hreflang, schémas, pied de page) lit ces fichiers seul : ne pas modifier
`src/components`, `src/layouts`, `src/i18n`, `src/lib/*.ts` hors `minis/`, `src/pages`.

## Données et moteur

| Fichier | Contenu |
|---|---|
| `src/data/params-2026.json` | Förderung (stufen, montants, limites, dates, délais), Kfz-Steuer, THG, wallbox, `sources` |
| `src/data/modelle.json` | 29 modèles : Listenpreis constructeur daté, BAFA, KBA FZ10 par mois. Généré par `python3 scripts/build-modelle.py` |
| `research/` | Prix relevés (`preise-lot-*.json` avec URL et citation), FZ10 du KBA, statistique BAFA, `fakten.md` |

Moteur (`src/lib/engine/`) : `foerderung.ts` (`haushaltsZvE`, `stufe`, `obergrenze`, `foerderung`, `fristen`,
`tabelle`, `phevFoerderfaehig`, `nettopreis`), `kfz.ts` (`elektroSteuer`, `befreiung`, `phevSteuer`), `thg.ts`,
`datum.ts`. Tests : `tests/engine.test.ts`. Calculateurs : `src/components/calc/*.tsx`.
Mini-simulateurs : `src/lib/minis/<kind>.ts` (chargés automatiquement, appellent le moteur ; helpers `./_kit`).

## Règles propres à ce site

- **Aucune valeur réglementaire en dur** : `h.P` dans `body`, `P` et `DE`/`EN` (`src/lib/fmt.ts`) ailleurs ; les
  exemples sont des appels au moteur en tête de fichier. Les seuls nombres en clair : hypothèses d'exemple (un revenu,
  un prix) et références de textes (§, dates de publication).
- **Jamais BAFA, BMUKN, KfW ou « Bundesregierung » comme auteur** : le site est indépendant ; pas de conseil
  personnalisé ; renvoyer au BAFA pour un dossier.
- **2027 et au-delà** : ce qui est annoncé reste « angekündigt / announced » ; rien n'entre au moteur avant publication.
- **Pas de lead, pas de téléphone, aucune recommandation d'achat**, aucun lien vers un autre site du portefeuille ni
  vers bussgeldrechnen.de, solarrechnen.de, guidevoitureelectrique.fr.
- **Allemand** : pas de tiret cadratin ; guillemets „…“. **Anglais** : pour un expatrié qui vit en Allemagne ; terme
  allemand entre parenthèses à la première occurrence ; montants en euros.
- **FAQ** : 4 à 8 (3 minimum sur une page outil), réponses 40 à 90 mots ; question unique sur tout le site.
- **Snippets** : titre 50-60 car., description 150-160, 2026 dans les deux, terme-clé en tête (jamais pays,
  « Rechner », rubrique ni question en tête).
- `resume` : UN paragraphe ≥ 120 mots, citable, avec les chiffres.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/de-eauto
export NODE_PATH=$(npm root -g):$PWD/node_modules
PAGE_FILES=<id> npx vitest run tests/pages.test.ts   # une page
npm run build && npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py .
python3 scripts/check-simulateurs.py . ; python3 scripts/check-hreflang.py . ; python3 scripts/check-anglais.py .
python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py . ; python3 scripts/check-cookies.py . ; python3 scripts/check-snippets.py dist
node scripts/check-legal.mjs . ; node scripts/check-sources.mjs . ; node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60
node scripts/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check ; node scripts/check-url-propre.mjs dist ; node scripts/check-premier-ecran.mjs .
node scripts/check-layout.mjs dist
```

Contrôles Playwright un par un, jamais en parallèle. Serveur local : port 5604 (`npm run preview`).
Arrêt : `lsof -ti tcp:5604 | xargs kill`.

## Mise à jour

1. Chaque mois (vers le 7) : nouveau fichier FZ10 du KBA dans `research/kba/`, puis `python3 scripts/build-modelle.py`.
2. Chaque statistique BAFA : mettre à jour les nombres `bafa` dans `scripts/build-modelle.py` et
   `P.foerderung.bewilligungen`, `ausgezahlt_mio`, `statistik_stand`.
3. Prix : relire les preislisten (URL dans `research/preise-lot-*.json`) ; un prix sans source constructeur lisible
   reste `null`.
4. 1er juillet 2027 : fin des PHEV (`phev_erstzulassung_bis`) ; n'ajouter un nouveau barème qu'après publication.
5. THG : montants de marché datés (`P.thg.markt_*`), à relire chaque trimestre.

## Ce qu'on ne fait pas

Pas de dépôt GitHub, pas de push, pas de DNS. Ne toucher ni `_trame` ni la RECETTE. Aucune identité personnelle :
l'éditeur est Radif Partners.
