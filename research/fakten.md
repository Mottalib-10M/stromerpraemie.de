# Faits vérifiés pour Stromerprämie (de-eauto), lus le 2026-10-19

Toute valeur réglementaire écrite dans une page vient de `src/data/params-2026.json` (objet `P`) ou du moteur
(`src/lib/engine/`). Ce fichier sert à écrire le texte : il dit ce qui est vrai et d'où cela vient. Clé de source
entre crochets = clé de `P.sources` (à citer avec `h.src('cle', 'texte')`).

## 1. La Förderung (Richtlinie vom 19. Mai 2026, BAnz AT 19.06.2026 B3) [richtlinie] [bafaVoraussetzungen] [bafaFaq]

- Programme du BMUKN (Bundesministerium für Umwelt, Klimaschutz, Naturschutz und nukleare Sicherheit) [bmukn] ;
  Bewilligungsbehörde : BAFA. Demande via le portail de la Förderzentrale des Bundes [foerderzentrale], connexion
  BundID [bundid] avec « Online-Ausweis » (eID) ou « ELSTER-Zertifikat » ; le compte BundID basique (nom d'utilisateur
  et mot de passe) ne suffit pas. Portail ouvert depuis le 19 mai 2026 [breg].
- Montants : `P.foerderung.bev` et `P.foerderung.phev` (lignes = stufen bis 45 000 / 60 000 / 80 000 ; colonnes
  = 0, 1, 2 enfants). BEV 5 000/5 500/6 000, 4 000/4 500/5 000, 3 000/3 500/4 000 ; PHEV 3 500/4 000/4 500,
  2 500/3 000/3 500, 1 500/2 000/2 500. Au-dessus de 80 000 : montant de la 3e stufe si la limite est respectée.
  Limite = 80 000 + 5 000 par enfant förderrelevant, au plus 90 000 ; au plus 2 enfants comptés.
  → 80 001–85 000 : seulement avec ≥ 1 enfant ; 85 001–90 000 : seulement avec 2 enfants ; > 90 000 : rien.
  Bornes incluses (45 000 = stufe 1 ; 45 000,50 = stufe 2 ; pas d'arrondi).
- Véhicules : neufs, catégorie M1, Kauf ou Leasing, première immatriculation (Erstzulassung) en Allemagne entre le
  1.1.2026 et le 31.12.2029 pour les BEV et les véhicules à pile à combustible (Brennstoffzelle), jusqu'au 30.6.2027
  pour PHEV et Range Extender (EREV). PHEV/EREV seulement si ≤ 60 g CO2/km (valeur pondérée combinée WLTP,
  CoC/Übereinstimmungsbescheinigung n° 49.4) OU ≥ 80 km d'autonomie électrique (EAER city, CoC n° 49.5).
  Après le 30.6.2027 pour les PHEV : un appel séparé est annoncé, rien n'est fixé (ne jamais inventer de montant).
- Pas de Tageszulassung, Vorführwagen, Werkszulassung, pas d'occasion. AUCUN plafond de prix du véhicule.
  Pas de liste officielle de modèles éligibles (le BAFA n'en publie pas). Pas de règle « production UE » à ce jour
  (un « Industrial Accelerator Act » est discuté au niveau UE : seulement « en discussion », sans effet).
- Achat possible partout (même hors UE), mais l'Erstzulassung doit être en Allemagne.
- Demandeur : personne physique ≥ 18 ans, Hauptwohnsitz en Allemagne, nationalité indifférente ; véhicule dans le
  Privatvermögen (pas Betriebsvermögen ; un indépendant peut demander pour un usage privé, pas pour un véhicule
  d'entreprise) ; Halter (détenteur inscrit) = demandeur ; Käufer et Leasingnehmer peuvent différer du Halter ?
  → règle : c'est le Halter qui demande ; acheteur/preneur de leasing peuvent être une autre personne.
  Une seule aide par personne ; deux demandes au plus par foyer (Haushalt). Colocation (WG) : chacun est son propre
  foyer. Exclus : procédure d'insolvabilité, Vermögensauskunft (déclaration de patrimoine) en cours.
- Haushalt [bafaHaushalt] : demandeur + conjoint ou partenaire enregistré + personne en eheähnliche Gemeinschaft
  (présumée quand deux adultes non mariés ont la même résidence principale ; réfutable par Eigenerklärung).
  Les enfants ne comptent pas comme revenu (leur revenu n'est pas compté).
- Haushaltseinkommen : pour chaque adulte du foyer, MOYENNE du zu versteuerndes Einkommen (§ 2 Abs. 5 Satz 1 EStG
  [estg2]) des deux derniers Einkommensteuerbescheide disponibles, puis SOMME. Les Bescheide ne doivent pas être plus
  vieux que trois années civiles (l'année d'imposition compte). Bescheid à 0 € valable. Les Rentner sans obligation
  de déclarer peuvent déposer une déclaration après coup pour obtenir un Bescheid. Un changement de revenu après la
  demande est sans effet. Les Einmalzahlungen (indemnité de licenciement, etc.) comptent si elles sont dans le zvE.
  Zusammenveranlagung : un seul zvE commun dans le Bescheid, réparti entre les deux (la somme est la même).
- Kind förderrelevant : vit dans le foyer, Kindergeld perçu pour lui (Kindergeldberechtigung), moins de 18 ans le jour
  de l'Erstzulassung. Wechselmodell (enfant alterné) : compte chez le parent qui perçoit le Kindergeld (§ 64 EStG
  [estg64]). Justificatif : Kindergeldbescheid ou Bescheinigung der Familienkasse, ou erweiterte Meldebescheinigung.
- Antrag : SEULEMENT après l'immatriculation, au plus tard 12 mois après (P.foerderung.antragsfrist_monate).
  Pas de « réservation » avant achat. Documents en PDF, 5 MB max par fichier ; Steuerbescheide : pages montrant
  destinataire, Steuer-ID, date, année d'imposition, zvE, le reste peut être noirci ; Zulassungsbescheinigung Teil I ;
  Kauf- ou Leasingvertrag ; pour PHEV au-dessus de 60 g : CoC [bafaMerkblatt]. Documents en allemand ou traduction
  assermentée. Vollmacht possible (par ex. l'Autohaus dépose pour vous), mais versement sur le compte du Halter.
  Traitement dans l'ordre d'arrivée des dossiers complets ; versement quelques semaines après le Zuwendungsbescheid.
  Pas de Rechtsanspruch, sous réserve des fonds (Klima- und Transformationsfonds), arrêt possible (Förderstopp).
  Richtlinie valable du 19.5.2026 au 31.12.2029. Conserver les documents 5 ans.
- Mindesthaltedauer : 36 mois continus immatriculé en Allemagne au nom du demandeur. Un leasing de 24 mois ne suffit
  pas (il faut prolonger, racheter, ou rembourser). Vente/Abmeldung anticipée à déclarer au BAFA : Rückforderung
  au prorata ou totale selon le cas. Totalschaden, vol : idem (déclaration, décision au cas par cas). Wandlung
  (résolution du contrat) : pas de remboursement si un véhicule de remplacement équivalent est immatriculé dans les
  6 mois (la durée de détention continue). Décès : l'héritier reprend la durée restante. Pas d'apport ultérieur au
  Betriebsvermögen pendant la durée.
- Cumul : pas avec une autre aide publique pour le même véhicule, sauf si une Verwaltungsvereinbarung avec le BMUKN
  le prévoit ; pas d'aide comparable d'un autre État de l'UE. Les remises et primes des constructeurs (par ex.
  « ID. Kaufprämie » de VW jusqu'à 4 000 €) sont des remises commerciales, pas des aides publiques.

## 2. Statistique BAFA, Stand 1. Oktober 2026 [bafaStatistik]

97 790 Bewilligungen, 432 Mio € ausgezahlt ; BEV 89 594, PHEV 8 196 ; Kauf 49 328, Leasing 48 462 ;
par revenu 0–45 000 : 51 209 ; 45 001–60 000 : 21 337 ; 60 001–80 000 : 22 560 ; 80 001–85 000 : 2 045 ;
85 001–90 000 : 639 ; ≥ 2 enfants 21 390, 1 enfant 11 424, sans enfant 64 976.
Marques : Tesla 12 155, Skoda 7 224, Cupra 6 229, Leapmotor 5 816, BYD 5 814, Renault 5 721, VW 5 464, Kia 5 424,
Hyundai 4 988, BMW 4 679, Ford 4 340, Citroën 3 797, Fiat 3 535, Opel 3 250, Peugeot 2 649, Dacia 2 403, MG 2 132.
Par modèle : voir `src/data/modelle.json` (champ `bafa`, variantes additionnées) et
`research/bafa/statistik-2026-10-01.txt`. Ces nombres ne sont pas encore dans params : pour une page, les écrire
via un objet de données (pas de nombre réglementaire en dur ; une statistique datée et sourcée dans un tableau est
acceptable si elle vient de `modelle.json` ou d'une constante commentée avec la source).

## 3. Modèles (src/data/modelle.json)

29 modèles, 21 avec Listenpreis du constructeur (UVP/UPE TTC 19 %, avant Überführung, lus le 2026-10-19), BAFA
(Stand 1.10.2026), KBA FZ10 janvier à septembre 2026 par mois (`kba`: tableau de 9 nombres, `kba_summe`).
Tesla : prix non lisible (site bloqué), donc `preis: null` : ne jamais écrire de prix Tesla.
VW affiche une « ID. Kaufprämie » constructeur jusqu'à 4 000 € non déduite ; ne pas la confondre avec l'aide d'État.

## 4. Kfz-Steuer [kraftstg3d] [kraftstg9] [kraftstg11]

§ 3d : BEV immatriculés pour la première fois du 18.5.2011 au 31.12.2030 : 10 ans d'exonération, au plus tard
jusqu'au 31.12.2035 ; une fois par véhicule, passe au nouveau détenteur ; une mise hors circulation ne prolonge rien.
Ensuite § 9 Abs. 1 Nr. 3 (par 200 kg ou fraction, tranches : 11,25 € jusqu'à 2 000 kg, 12,02 € jusqu'à 3 000 kg,
12,78 € jusqu'à 3 500 kg), moins 50 % (§ 9 Abs. 2). Moteur : `elektroSteuer(zgg)`, `befreiung(iso)`.
PHEV : pas d'exonération ; § 9 Abs. 1 Nr. 2 c : 2 € par 100 cm³ (essence), 9,50 € (diesel) + CO2 au-delà de 95 g/km
par paliers (2,00/2,20/2,50/2,90/3,40/4,00 €) ; un PHEV ≤ 60 g ne paie que la cylindrée : `phevSteuer(ccm, co2)`.
§ 11 : paiement annuel d'avance ; semestriel possible au-delà de 500 € (avec 3 % de supplément).

## 5. THG-Quote [bimschv38] [uba] [ubaSchaetzwert] [ubaThgWert] [bundestagThg] [finanztip] [adacThg]

38. BImSchV : l'électricité des véhicules électriques peut être comptée sur la quote de réduction des gaz à effet de
serre des vendeurs de carburants ; elle compte trois fois (`P.thg.multiplikator_strom`). Pour un BEV M1 sans mesure :
Schätzwert 2 000 kWh/an (N1 : 3 000), Bekanntmachung UBA (BAnz AT 28.08.2023 B2). Valeur THG de l'électricité 2026 :
119 kg CO2e/GJ (BAnz AT 05.11.2025 B7). Seul le Halter (détenteur, = Ladepunktbetreiber réputé) peut faire valoir la
quantité ; PHEV exclus du Schätzwert. Le prestataire (THG-Anbieter) transmet à l'UBA qui certifie ; la quote est
vendue à un obligé ; communication à l'UBA jusqu'au 28 février de l'année suivante ; la plupart des prestataires
ferment plus tôt (souvent au 31 octobre). Frais UBA (Gebühren) depuis le 17.04.2026, de 94,60 € à 6 500 € par
dossier groupé (payés par le prestataire, pas par vous directement). Au 12.10.2026, l'UBA traite les demandes 2026
reçues depuis le 06.08.2026. Année 2025 : environ 5 192 GWh, environ 1,26 million de BEV.
Bundestag : loi de développement de la quote adoptée le 24.4.2026 (Drucksache 21/4083, 21/5530), quote jusqu'à
65 % en 2040 ; Bundesrat le 8.5.2026 sans Vermittlungsausschuss. NE PAS écrire de changement du multiplicateur
(source non officielle). Montants de marché (pas des valeurs légales) : Finanztip (Stand 14.10.2026) « bis zu 350 €
(Verivox, avec bonus) », « über 300 € auch ohne Bonus » ; ADAC « über 300 Euro für 2026 ». Ne pas calculer de
tonnes de CO2.

## 6. Wallbox [kfw442] [bmvMph] [mphAufruf]

Pas d'aide fédérale pour une wallbox de maison individuelle en 2026. KfW 442 (Solarstrom für Elektroautos) :
« können Sie nicht mehr beantragen ». KfW 440 : page qui renvoie vers l'aperçu des aides (vu le 19.10.2026), plus de
programme. Programme du BMV « Ladeinfrastruktur in und an Mehrparteienhäusern » (Richtlinie 16.3.2026, BAnz AT
24.03.2026 B1 ; 500 Mio €) : pour WEG (copropriétés), PME, propriétaires bailleurs ; bâtiments ≥ 3 Wohneinheiten ;
≥ 20 % des places et au moins 6 places précâblées ; 11 à 22 kW ; par place au plus 1 300 € (précâblage seul),
1 500 € (avec point de charge), 2 000 € (bidirectionnel) ; demande du 15.4. au 10.11.2026 (grandes entreprises :
jusqu'au 15.10.2026, procédure de compétition) ; exclu si le Bauantrag est postérieur au 24.3.2021 (GEIG impose déjà
le précâblage) ; Zweckbindung 3 ans ; les locataires ne peuvent pas demander eux-mêmes ; portail
laden-im-mehrparteienhaus.de, Projektträger PwC. Valeurs dans `P.wallbox`. Aides des Länder/communes : variables,
ne pas citer de montant sans source officielle lue.

## 7. Concurrents et erreurs constatées (pour l'angle, ne jamais nommer ni lier ces sites dans les pages)

SERP Google (gl=de, 2026-10-19) : bafa.de, bundesumweltministerium.de, foerderzentrale.gov.de, adac.de, cupra.com,
ace.de. Personne ne calcule la moyenne des deux Steuerbescheide par partenaire. Erreurs vues ailleurs : portail
« ab Mai 2026 » écrit au futur en octobre, « maximal 4.000 Euro » (faux : 6 000 €), Haltedauer « 12–24 Monate »
(faux : 36), THG « 260 € » (dépassé : > 300 € en octobre 2026). Ne JAMAIS citer ni lier bussgeldrechnen.de,
solarrechnen.de, guidevoitureelectrique.fr ni aucun site du portefeuille.

## 8. Règles d'écriture (rappel)

Jamais se présenter comme BAFA, ministère ou administration ; pas de « BAFA » dans un titre comme marque.
Pas de conseil personnalisé. Pas de tiret cadratin. Chiffres 2027 et au-delà : « annoncé », jamais « officiel ».
Anglais : pour un expatrié vivant en Allemagne ; garder les termes allemands utiles entre parenthèses
(zu versteuerndes Einkommen, Einkommensteuerbescheid, Kindergeld, Zulassungsbescheinigung, Halter, BundID).
