# Contenu expert BIA vers PPL : concepts, formules, valeurs, pièges, simulations

Note de méthode : environ 20 appels d'outils. Les valeurs marquées [SOURCÉ] ont été vérifiées dans une source consultée pendant cette session. Les éléments sous « Inferences » marqués (std) relèvent de la connaissance de cours standard (manuel du pilote, cours CIRAS) et n'ont PAS été revérifiés en ligne ici : à faire relire avant publication. Le site officiel du BO (programme BIA, MENE1505167N) n'a pas pu être récupéré (erreur côté site) ; voir Gaps.

## Cadre : programme BIA et syllabus PPL/LAPL (Part-FCL)

### Takeaway
Le BIA (arrêté du 19 février 2015, BO n°11 du 12 mars 2015) couvre 5 domaines plus une épreuve facultative d'anglais. Le PPL/LAPL EASA prolonge ces domaines en 9 matières théoriques, avec 75 % requis par matière. Les quatre premiers domaines BIA correspondent directement à des matières PPL. Le domaine histoire n'a pas d'équivalent au PPL.

### Cited Findings
- Le programme BIA et les arrêtés de 2015 sont publiés au BO n°11 du 12 mars 2015 (MENE1500689A, MENE1500688A, note MENE1505167N). Le programme PDF est aussi disponible sur eduscol — [BO n°11 2015](https://www.education.gouv.fr/bo/15/Hebdo11/MENE1500689A.htm) ; [eduscol programme BIA](https://sti.eduscol.education.fr/sites/eduscol.education.fr.sti/files/textes/formations-tout-niveau-brevet-dinitiation-aeronautique-bia/5950-bia-programme.pdf) ; [arrêtés BIA 19/02/2015 (CIRAS Grenoble)](https://ciras.web.ac-grenoble.fr/sites/default/files/media-fichiers/2018-12/arretes_bia_19_02_2015.pdf) ; [BO BIA 2024 (CIRAS Lille)](https://ciras.site.ac-lille.fr/wp-content/uploads/sites/22/2023/07/BO-BIA2024.pdf)
- PPL/LAPL, 9 matières. Communes : Air law, Human performance, Meteorology, Communications, Navigation. Propres à la catégorie d'aéronef : Principles of flight, Operational procedures, Flight performance and planning, Aircraft general knowledge — [UK CAA, TK exams](https://www.caa.co.uk/general-aviation/pilot-licences/easa-requirements/theoretical-knowledge-examinations/)
- Il faut 75 % à chaque examen PPL. Tous les examens doivent être réussis en 18 mois, comptés à partir de la fin du mois calendaire de la première tentative. Le théorique reste valable 24 mois après le dernier succès pour délivrer la licence — [UK CAA](https://www.caa.co.uk/general-aviation/pilot-licences/easa-requirements/theoretical-knowledge-examinations/)
- PPL(A) : âge minimum 17 ans (FCL.200). Premier vol solo élève à 16 ans (FCL.020). Formation de 45 h minimum, dont 5 h maximum sur FSTD, avec 25 h en double commande et 10 h en solo. Le solo inclut une navigation de 270 km (150 NM) avec 2 atterrissages sur des aérodromes autres que celui de départ (FCL.210.A) — [EASA quick reference rev2 2015 (site ecologie.gouv.fr)](https://www.ecologie.gouv.fr/sites/default/files/documents/Licensing_requirements_-_quick_reference-rev2-May-2015.pdf)
- LAPL(A) : âge minimum 17 ans. 30 h de vol, dont 15 h en double et 6 h en solo. Le solo inclut 3 h de navigation et un vol d'au moins 80 NM (150 km) avec atterrissage sur un autre aérodrome. Expérience récente : sur les 24 derniers mois, 12 h comme commandant de bord, 12 décollages et atterrissages, et 1 h de vol avec instructeur (FCL.140.A) — [EASA quick reference](https://www.ecologie.gouv.fr/sites/default/files/documents/Licensing_requirements_-_quick_reference-rev2-May-2015.pdf). Ce document date de 2015 (rev2). Les heures LAPL citées (30/15/6) correspondent aux valeurs post-amendement. À confirmer dans les Easy Access Rules Aircrew en vigueur en 2026 : [EASA FCL.200](https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-aircrew-regulation-eu-no?page=9)

### Inferences
- Correspondance pédagogique pour le site :
  - Météo BIA → Meteorology
  - Aérodynamique → Principles of flight, et une partie de Flight performance and planning
  - Aéronefs → Aircraft general knowledge
  - Navigation/réglementation/sécurité → Navigation, Air law, Communications, Human performance, Operational procedures
  - Anglais → Communications, et la mention FCL.055 (compétence linguistique)
- Message clé pour un adolescent : solo possible à 16 ans, licence à 17 ans. Le BIA ouvre souvent droit à des aides au financement de la formation (FFA, bourses). À vérifier, non sourcé ici.
- (std) Pour le PPL, il faut un certificat médical de classe 2. Le LAPL accepte un certificat médical LAPL. Non vérifié ici.

### Gaps
- Le texte intégral du programme BIA (liste détaillée des items par domaine) et le format d'épreuve actuel n'ont pas été extraits : la page BO a renvoyé une erreur. Source connue : QCM de 100 questions, 20 par domaine, 2 h 30, anglais facultatif. Ces chiffres sont à vérifier sur le PDF eduscol ci-dessus.
- Les amendements Part-FCL 2024-2026 (Basic Instrument Rating, modification du LAPL) n'ont pas été vérifiés.

## 1. Météorologie et aérologie

### Takeaway
L'ossature quantitative tient en peu de valeurs ISA :
- au niveau de la mer : 15 °C, 1013,25 hPa, 1,225 kg/m³ ;
- un gradient de −6,5 °C/km (≈ −2 °C/1000 ft) ;
- une tropopause à 11 km à −56,5 °C.

S'y ajoutent la classification en 10 genres de nuages et le décodage METAR/TAF, en particulier la définition de CAVOK.

### Cited Findings
**Atmosphère standard (ISA / ISO 2533)**
- Au niveau de la mer : +15,0 °C (288,15 K), 101 325 Pa, masse volumique 1,225 kg/m³, gradient de 6,5 °C/km.
- Tropopause à 11 000 m géopotentiels, −56,5 °C (216,65 K), 22 632 Pa, 0,3639 kg/m³, puis gradient nul jusqu'à 20 km.

Source : [Wikipedia, International Standard Atmosphere](https://en.wikipedia.org/wiki/International_Standard_Atmosphere)

Couches ISA, pour une simulation de profil :

| Altitude (km) | Température (°C) | Pression (Pa) | Gradient dans la couche (°C/km) |
|---|---|---|---|
| 0 | 15 | 101 325 | −6,5 |
| 11 | −56,5 | 22 632 | 0 |
| 20 | −56,5 | 5 474,9 | +1 (inversion) |
| 32 | −44,5 | 868 | +2,8 |
| 47 | −2,5 | 110,9 | 0 (stratopause) |

Source : [Wikipedia ISA](https://en.wikipedia.org/wiki/International_Standard_Atmosphere). La convention de signe du tableau source est inversée : « lapse rate » positif = décroissance.

**Nuages (10 genres)**
- Étage élevé, base au-dessus de 5 000 m : cirrus, cirrostratus, cirrocumulus.
- Étage moyen, environ 2 000 à 7 000 m en régions tempérées : altostratus, altocumulus.
- Étage inférieur, du sol à 2 000 m : stratus, stratocumulus, nimbostratus.
- Développement vertical, base vers 450 m et plus : cumulus, cumulonimbus.
- Les limites varient avec la latitude. L'étage élevé va de 5 à 13 km en zone tempérée et de 6 à 18 km en zone tropicale.

Source : [CIRAS Nancy-Metz, Cahier du BIA, formation des nuages](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/mto3/nuagesetprecipitation.html)

- Précipitations associées : bruine sous stratus ; pluie ou neige continue sous nimbostratus ; averses, orages et grêle sous cumulonimbus ; virga (précipitation évaporée avant le sol) sous cirrus — [CIRAS Nancy-Metz](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/mto3/nuagesetprecipitation.html)
- Formation : convection, relief ou soulèvement frontal pour les cumuliformes ; refroidissement isobare au contact d'un sol froid, refroidissement nocturne ou soulèvement synoptique pour les stratiformes. Altostratus en avant d'un front chaud. Turbulence en rotor sous les nuages lenticulaires (ondes de relief) — [CIRAS Nancy-Metz](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/mto3/nuagesetprecipitation.html)

**METAR/TAF (Météo-France, « Comprendre le TAF »)**
- Exemple : « TAF LFXX 150500Z 1506/1606 30010KT 4000 BR BKN014 ». Se lit : émis le 15 à 05 h UTC, valable du 15 à 06 h UTC au 16 à 06 h UTC. Vent du 300° à 10 kt, visibilité 4000 m, brume, nuages fragmentés (BKN) à 1400 ft — [Météo-France, Comprendre le TAF](https://aviation.meteo.fr/documentation/comprendre_letaf.pdf)
- CAVOK exige les quatre conditions suivantes :
  - visibilité d'au moins 10 km ;
  - aucun nuage sous la plus grande des deux hauteurs : 5000 ft (1500 m) au-dessus de l'aérodrome, ou altitude minimale de secteur moins altitude de l'aérodrome ;
  - ni cumulonimbus (CB) ni cumulus bourgeonnant (TCU) ;
  - aucun phénomène significatif.

  Source : [Météo-France](https://aviation.meteo.fr/documentation/comprendre_letaf.pdf)
- Seuils de visibilité significatifs dans un TAF : 150, 350, 600, 800, 1500, 3000 et 5000 m. Seuils de plafond (couches BKN/OVC seulement) : 100, 200, 500, 1000 et 1500 ft. BECMG et TEMPO ne sont suivis que des éléments qui franchissent un seuil — [Météo-France](https://aviation.meteo.fr/documentation/comprendre_letaf.pdf)
- Critères vent en France : un changement est significatif s'il atteint 60° de direction avec un vent moyen d'au moins 10 kt, 10 kt de vitesse moyenne, ou 10 kt de rafales avec un vent moyen d'au moins 15 kt — [Météo-France](https://aviation.meteo.fr/documentation/comprendre_letaf.pdf)
- Guides de décodage complémentaires : [Met Office, METAR decode](https://docs.mavis.metoffice.gov.uk/guidance/metar-decode/) ; [Met Office, TAF decode](https://docs.mavis.metoffice.gov.uk/guidance/taf-decode/) ; [SKYbrary METAR](https://skybrary.aero/articles/meteorological-aerodrome-report-metar)

**Vent en altitude (règle pratique BIA)**
- Au-dessus de 1000 ft, on estime le vent en tournant la direction de +30° et en doublant la vitesse (exemple : 160°/14 kt devient 190°/28 kt) — [CIRAS Nancy-Metz, formulaire BIA/CAEA](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/formules/formulaire.html)

### Inferences
(std) Les valeurs ci-dessous sont classiques en préparation BIA mais n'ont pas été revérifiées ici.
- **Pression et calages altimétriques :**
  - environ 1 hPa par 28 ft (≈ 8,5 m) près du sol ;
  - QNH : l'altimètre affiche l'altitude topographique ;
  - QFE : il affiche 0 au sol de l'aérodrome, donc la hauteur ;
  - QNE (1013) : il affiche le niveau de vol.
  - Mnémonique : « du chaud vers le froid, ou des hautes vers les basses pressions, méfiance en bas ». L'altimètre surestime alors l'altitude vraie.
- **Masse volumique et pression :** à 5500 m, la pression vaut environ 500 hPa, soit la moitié de celle du niveau de la mer.
- **Buys-Ballot (hémisphère Nord) :** dos au vent, les basses pressions sont à gauche. En altitude, le vent est parallèle aux isobares et tourne dans le sens horaire autour des anticyclones, antihoraire autour des dépressions. En surface, le frottement le fait dévier d'environ 30° vers les basses pressions.
- **Brises thermiques :** brise de mer le jour (de la mer vers la terre), brise de terre la nuit. Brise de vallée montante le jour, brise de montagne descendante la nuit.
- **Foehn :**
  - Côté au vent : l'air monte et se refroidit d'abord selon l'adiabatique sèche (≈ 1 °C/100 m), puis selon l'adiabatique saturée (≈ 0,5 à 0,6 °C/100 m) une fois la condensation atteinte. Il précipite.
  - Côté sous le vent : il redescend sec et se réchauffe à 1 °C/100 m. Il arrive donc plus chaud et plus sec.
- **Point de rosée et base des cumulus :** base des cumulus ≈ 125 m × (T − Td), ou ≈ 400 ft par °C d'écart.
- **Thermiques :**
  - l'air s'élève tant qu'il est plus chaud que l'air ambiant, ce qui suppose une atmosphère instable (gradient réel supérieur à l'adiabatique) ;
  - au-dessus de la condensation, des cumulus se forment ; on parle de thermique « bleu » quand l'air est trop sec pour former des nuages.
- **Fronts :**
  - Front chaud, nuages dans l'ordre : Ci → Cs → As → Ns, avec des pluies continues.
  - Front froid : Cb et averses, saute de vent, chute de température.
  - Front occlus : combinaison des deux.
  - Symboles : triangles bleus pour le front froid, demi-cercles rouges pour le front chaud.
- **Givrage :** risque maximal entre 0 et −10/−15 °C dans un nuage à gouttelettes surfondues. Types : verglas ou givre transparent (pluie surfondue, le plus dangereux), givre blanc, gelée blanche. Le givrage carburateur est possible jusqu'à environ +25 °C par air humide.
- **Phénomènes dangereux :** orage et Cb (cisaillement, microrafale, grêle, foudre, givrage) ; brouillard (de rayonnement ou d'advection) ; ondes et rotors ; turbulence en air clair (CAT) ; cisaillement de vent ; pluie verglaçante.
- **TEMSI :** carte de temps significatif. En France, la TEMSI France couvre la surface jusqu'au FL150 et la TEMSI EUROC jusqu'au FL450. On y lit les fronts, les zones nuageuses, les isothermes 0 °C, la turbulence et le givrage.
- **Codes METAR :**
  - nébulosité : FEW (1–2/8), SCT (3–4/8), BKN (5–7/8), OVC (8/8) ;
  - préfixes : « − » faible, « + » fort, VC au voisinage ;
  - phénomènes : RA pluie, SN neige, DZ bruine, TS orage, SH averse, FG brouillard (visibilité inférieure à 1000 m), BR brume (visibilité de 1000 à 5000 m), HZ brume sèche, GR grêle.
- **Pièges fréquents :** confondre QNH et QFE ; oublier que le TAF est en UTC ; confondre BR et FG ; croire que CAVOK signifie « ciel clair » (il peut y avoir des nuages au-dessus de 5000 ft) ; inverser la règle de Buys-Ballot dans l'hémisphère Sud.

### Gaps
- Le guide TEMSI de Météo-France et les codes complets PROB30/40, FM et VC n'ont pas été extraits : la partie FM du PDF est une image.
- Les seuils exacts de visibilité FG/BR et les plages octas FEW/SCT/BKN/OVC n'ont pas été revérifiés sur l'Annexe 3 OACI.
- Les valeurs des adiabatiques et la règle des 125 m sont à confirmer dans un cours CIRAS ou le manuel du pilote FFA.

## 2. Aérodynamique, aérostatique et principes du vol

### Takeaway
Tout découle de Fz = ½ ρ S V² Cz et de Fx = ½ ρ S V² Cx :
- la finesse vaut Cz/Cx ;
- le facteur de charge en virage vaut n = 1/cos φ (2 g à 60°) ;
- la vitesse de décrochage croît comme √n (+41 % à 60°) ;
- le rayon de virage vaut R = V²/(g·tan φ).

### Cited Findings
- Équation de la portance : L = Cl × (ρV²/2) × A. Le terme ρV²/2 est la pression dynamique. Cl regroupe la forme, l'inclinaison par rapport à l'écoulement (l'incidence), la viscosité et la compressibilité. Il est en général déterminé expérimentalement — [NASA Glenn, Beginner's Guide, lift equation](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation) ; voir aussi [NASA lift coefficient](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-coefficient)
- **Formulaire BIA/CAEA (CIRAS Nancy-Metz) :**
  - Traînée : Fx = ½ ρ S Cx V².
  - Portance : Fz = ½ ρ S Cz V².
  - Charge alaire : masse totale en vol divisée par la surface alaire (kg/m²).
  - Finesse : Cz/Cx si les deux coefficients sont rapportés à la même surface.
  - Portance aérostatique : (ρext − ρint) × volume. Le formulaire omet g, il faut multiplier par g pour obtenir une force en newtons.
  - Facteur de charge : n = poids apparent / poids réel. Il vaut 1 en palier, 0 en chute libre et 1/cos φ en virage.
  - Rayon de virage : R = V²/(g·tan φ), avec g = 9,81 m/s².
  - Température d'impact : Ti = Ts (1 + 0,2 M²).

  Source : [Formulaire BIA CAEA](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/formules/formulaire.html)
- Facteur de charge et vitesse de décrochage en fonction de l'inclinaison, avec Vs = Vs0 × √n et Vs0 = 94 km/h :

| Inclinaison | n | Vs (km/h) |
|---|---|---|
| 0° | 1 | 94 |
| 15° | 1,035 | 96 |
| 30° | 1,155 | 101 |
| 45° | 1,414 | 112 |
| 60° | 2 | 133 |
| 75° | 3,864 | 185 |

  Le document établit aussi n = 1 + V²/(r·g) en ressource. Source : [CIRAS Orléans-Tours, Modification de trajectoire](https://pedagogie.ac-orleans-tours.fr/fileadmin/user_upload/ciras/ressources/aero_meca_vol/modification_de_trajectoire.pdf) ; voir aussi la fiche FFPLUM sur le facteur de charge en virage : [FFPLUM fp09](https://ffplum.fr/images/pdf/fiches/fp09-fact%20charge%20virage.pdf)
- Le formulaire CIRAS contient des coquilles signalées lors de l'extraction : « 1 hPa = 0,98 mbar » est faux (1 hPa = 1 mbar), et la formule aérostatique omet g. Ne pas les recopier — [Formulaire CIRAS](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/formules/formulaire.html)
- Annales thématiques « mécanique du vol » (sujets 1991-2002) : [cockpitseeker BIA 1997](https://cockpitseeker.com/wp-content/uploads/goodies/misc/bia/mecavol/1_sujets/BIA_1997_01.pdf)

### Inferences
(std)
- **Incidence ≠ assiette.**
  - L'incidence (α) est l'angle entre la corde du profil et le vent relatif.
  - L'assiette (θ) est l'angle entre l'axe longitudinal et l'horizon.
  - La pente (γ) est l'angle entre la trajectoire et l'horizon.
  - En première approximation, θ = α + γ.
  - Piège classique : on peut décrocher à n'importe quelle assiette et à n'importe quelle vitesse, car le décrochage dépend de l'incidence critique, environ 15 à 18° pour un profil classique.
- **Polaire (Cz en fonction de Cx) :**
  - la finesse maximale se lit à la tangente issue de l'origine ;
  - le point de Cz max correspond au décrochage ;
  - le point de Cz nul correspond à l'incidence de portance nulle.
  - En plané, distance franchissable = hauteur × finesse (finesse 10 : 1000 m de hauteur donnent 10 km).
- **Traînée :** traînée induite (tourbillons marginaux), en ∝ Cz²/(π·λ) avec λ l'allongement ; traînée de forme et de frottement.
  - Planeurs : un grand allongement réduit la traînée induite.
- **Hypersustentateurs :**
  - becs de bord d'attaque : ils augmentent l'incidence critique ;
  - volets de courbure, à fente, Fowler : ils augmentent Cz max et donc réduisent Vs ;
  - les volets augmentent aussi la traînée (utiles pour la pente d'approche).
- **Stabilité :**
  - longitudinale : le centre de gravité doit être en avant du foyer ; un centrage arrière rend l'avion instable ;
  - latérale : dièdre, flèche ;
  - de route : dérive.
- **Effet de sol :** la traînée induite diminue à une hauteur inférieure à environ une envergure.
- **Aérostats (Archimède) :**
  - poussée = ρair × V × g ;
  - l'air chaud à 100 °C (373 K) contre 15 °C (288 K) a une masse volumique d'environ 0,95 kg/m³ contre 1,225 kg/m³, soit environ 0,28 kg de charge utile brute par m³ ;
  - l'hélium donne environ 1 kg/m³ de force ascensionnelle, l'hydrogène environ 1,1 kg/m³.
- **Hélicoptère :**
  - le rotor principal assure portance et propulsion ;
  - le pas collectif fait monter ou descendre, le pas cyclique incline le disque pour le déplacement ;
  - le rotor anticouple (ou fenestron, invention française) contre le couple ;
  - l'autorotation permet un atterrissage moteur en panne ;
  - la pale avançante et la pale reculante créent une dissymétrie de portance, compensée par le battement.
- **Pièges fréquents :** confondre le cosinus et la tangente ; oublier V² (doubler la vitesse multiplie la portance par 4) ; croire que décrochage signifie panne moteur ; confondre n = 2 à 60° avec 2 à 45° (à 45°, n = 1,41).

### Gaps
- Le taux de virage standard (3°/s, virage au taux 1) et la relation entre vitesse et taux n'ont pas été vérifiés ; le PDF CIRAS ne les couvre pas.
- Les données de stabilité (marge statique) et d'hélicoptère n'ont pas été sourcées ; pistes : NASA Glenn, manuel FFA.

## 3. Étude des aéronefs et engins spatiaux

### Takeaway
Les sources consultées couvrent surtout la partie spatiale : orbite basse à environ 7,8 km/s et 28 000 km/h, ISS à 400 km, orbite géostationnaire à environ 36 000 km avec une période de 24 h. Structure, moteurs et instruments relèvent du cours standard et restent à sourcer.

### Cited Findings
- Vitesse de satellisation : 7,8 km/s à 300 km d'altitude, soit environ 28 000 km/h.
- Altitudes : orbite basse (LEO) d'environ 300 à 3 000 km ; orbite moyenne (MEO) d'environ 2 000 à 36 000 km ; ISS à 400 km.
- Orbite géostationnaire : le CNES écrit « précisément à 35 880 km ». La valeur de référence courante est 35 786 km au-dessus de l'équateur, il faut signaler l'écart. Le satellite fait un tour en 24 h, comme la Terre.
- Orbite polaire : inclinée à 90°. Orbite héliosynchrone : entre 400 et 900 km, chaque région est survolée à la même heure solaire.
- La Terre tourne autour du Soleil à presque 30 km/s.
- Première loi de Kepler : les orbites sont des ellipses.

Source : [CNES, Qu'est-ce qu'une orbite ?](https://cnes.fr/dossiers/orbite)

- Repères historiques de l'aéronautique utiles au domaine « aéronefs » :
  - premier vol à réaction, Heinkel He 178 (27 août 1939) ;
  - premier hélicoptère à vol libre, Sikorsky VS-300 (13 mai 1940) ;
  - Me 262, premier chasseur à réaction au combat (1944).

  Source : [CIRAS Orléans-Tours, Histoire de l'aviation et de l'espace](https://pedagogie.ac-orleans-tours.fr/fileadmin/user_upload/ciras/ressources/histoire/histoire_de_l_aviation_et_de_l_espace.pdf)
- Mach 1 vaut environ 1 191,6 km/h à 0 °C. 1 ch (cheval-vapeur) = 736 W — [Formulaire CIRAS](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/formules/formulaire.html)

### Inferences
(std) Non vérifié en ligne dans cette session.
- **Axes et gouvernes :**
  - roulis (axe longitudinal) : ailerons, manche à gauche ou à droite ;
  - tangage (axe transversal) : profondeur, manche avant ou arrière ;
  - lacet (axe vertical) : direction, palonnier.
  - Effets secondaires : le lacet inverse (aileron baissé = plus de traînée) et le roulis induit par le lacet.
  - Le compensateur (trim) annule l'effort au manche.
- **Structure :**
  - fuselage treillis, coque ou semi-monocoque (cadres, lisses, revêtement travaillant) ;
  - aile : longerons, nervures ;
  - train classique (roulette de queue) ou tricycle ;
  - aile haute ou basse, cantilever ou haubanée.
- **Moteur à pistons 4 temps (cycle de Beau de Rochas/Otto) :** admission, compression, combustion-détente (seul temps moteur), échappement. Il faut 2 tours de vilebrequin par cycle.
- **Spécificités aviation :**
  - double allumage par magnétos, indépendant de la batterie ; on teste les magnétos au point fixe (chute de régime) ;
  - mélange (richesse) à appauvrir en altitude ;
  - réchauffage carburateur contre le givrage ;
  - moteurs à plat, refroidis par air.
- **Turbomachines :**
  - turboréacteur simple flux : compresseur, chambre de combustion, turbine, tuyère ;
  - turbofan double flux : le taux de dilution (flux secondaire sur flux primaire) dépasse 10:1 sur les moteurs récents ;
  - turbopropulseur : la turbine entraîne l'hélice via un réducteur ;
  - turbomoteur : équipe les hélicoptères ;
  - statoréacteur : pas de pièces tournantes.
- **Hélice :** l'angle de calage varie le long de la pale (vrillage).
  - Hélice à pas fixe ; hélice à pas variable ou à vitesse constante (régulateur), avec la manette « hélice » (tr/min) distincte de la manette des gaz (pression d'admission).
  - Le souffle hélicoïdal et le couple de renversement provoquent du lacet au décollage.
- **Instruments, chaîne anémo-barométrique :**
  - la prise de pression totale (tube de Pitot) alimente seulement l'anémomètre ;
  - la prise statique alimente l'anémomètre, l'altimètre et le variomètre ;
  - l'anémomètre mesure la pression dynamique (totale moins statique).
  - Arcs de l'anémomètre : blanc (volets, de VS0 à VFE), vert (de VS1 à VNO), jaune (prudence, de VNO à VNE), trait rouge VNE.
  - Pannes :
    - Pitot bouché, drain ouvert : l'anémomètre tombe à 0.
    - Pitot et drain bouchés : l'anémomètre se comporte comme un altimètre (la vitesse indiquée augmente en montée). Piège classique.
    - Statique bouchée : l'altimètre et le variomètre sont figés.
  - Secours : prise statique de secours en cabine.
- **Instruments gyroscopiques :**
  - horizon artificiel : rigidité dans l'espace ;
  - conservateur de cap, à recaler sur le compas toutes les 15 minutes ;
  - indicateur de virage et bille : la bille indique la symétrie du vol (« le pied chasse la bille »).
- **Compas magnétique :**
  - déviation propre à l'avion (tableau de compensation) ;
  - erreurs de virage : dans l'hémisphère Nord, en virage le compas retarde au passage du nord et avance au passage du sud. Mnémonique « NORD retard, SUD avance », ou « UNOS » en anglais (Undershoot North, Overshoot South) ;
  - erreurs d'accélération : en cap est ou ouest, une accélération fait indiquer le nord. Mnémonique anglais « ANDS » (Accelerate North, Decelerate South).
- **Électricité :** alternateur et batterie 12 ou 24 V ; ampèremètre ; disjoncteurs ; master switch. Les magnétos sont indépendantes du circuit électrique.
- **Spatial :**
  - Kepler : 2e loi, les aires balayées sont égales en des temps égaux ; 3e loi, T²/a³ = constante ;
  - vitesse de libération ≈ 11,2 km/s ;
  - période de l'ISS ≈ 90 à 92 minutes ;
  - lanceurs à étages ; propergols solides et liquides (LOX/LH2 pour l'étage principal d'Ariane 5 et d'Ariane 6) ;
  - le Centre spatial guyanais à Kourou, proche de l'équateur, profite de la vitesse de rotation de la Terre ;
  - orbite de transfert géostationnaire (GTO) ;
  - formule de Tsiolkovski : Δv = Isp·g0·ln(m0/mf).

### Gaps
- Aucune source primaire consultée sur le moteur, l'hélice, les instruments ou le compas. À sourcer : manuel du pilote d'avion (Cépaduès), FAA PHAK (Pilot's Handbook of Aeronautical Knowledge, chapitre 8), cours CIRAS « connaissance des aéronefs ».
- Vitesse de libération, 2e et 3e lois de Kepler et période de l'ISS : non sourcées (page CNES incomplète).
- Statut d'Ariane 6 en 2026 (premier vol en juillet 2024) : non vérifié ici.

## 4. Navigation, réglementation, sécurité des vols

### Takeaway
Les règles SERA de minima VMC se résument à 8 km au-dessus du FL100 et 5 km en dessous, avec 1500 m horizontalement et 300 m (1000 ft) verticalement des nuages. Sous 3000 ft AMSL ou 1000 ft sol en classes F et G, il suffit d'être hors nuages avec la surface en vue. Les codes transpondeur d'urgence sont 7500 (intervention illicite), 7600 (panne radio) et 7700 (détresse). En France, on utilise surtout les classes A, C, D, E et G.

### Cited Findings
**Minima VMC (SERA.5001), table S5-1**
- À partir de 10 000 ft AMSL : 8 km de visibilité, 1500 m horizontalement et 300 m verticalement des nuages.
- Sous 10 000 ft et au-dessus de la plus haute valeur entre 3000 ft AMSL et 1000 ft sol : 5 km, 1500 m, 300 m.
- En dessous, classes B à E : mêmes minima.
- En dessous, classes F et G : 5 km, hors nuages et surface en vue.
- Notes :
  - le FL100 remplace 10 000 ft si l'altitude de transition est plus basse ;
  - les minima de la classe A sont indicatifs, le VFR n'y étant pas admis ;
  - en classes F et G, une visibilité de 1500 m est acceptée de jour à 140 kt de vitesse indiquée maximum. L'autorité compétente peut adopter ce minimum. Les hélicoptères ont des minima spécifiques.

Source : [UK CAA, SERA.5001](https://regulatorylibrary.caa.co.uk/923-2012/Content/Regs/01250_SERA5001_VMC_visibility_and_distance_from_cloud_minima.htm) ; texte EASA : [Easy Access Rules SERA](https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-standardised-european?page=13)

La version UK consultée comporte une note spécifique sur la classe D (hors nuages, 140 kt). Il faut vérifier la transposition française dans l'AIP France ENR 1.2 ou le guide SERA FFPLUM : [Guide SERA DSAC](https://ffplum.fr/images/pdf/guide-sera-ed1-v2-oct2017.pdf) ; [SERA complet, SIA](https://www.sia.aviation-civile.gouv.fr/pub/media/reglementation/file/s/e/sera_complet_1.pdf)

**Espace aérien français (Cahier du BIA)**
- Les classes A à E sont contrôlées, F et G ne le sont pas. Le cours indique que la France utilise A, D, E et G, avec la classe C au-dessus du FL195 depuis novembre 2004. Le C est en réalité présent aussi dans certaines TMA, à vérifier sur l'AIP.
- VFR interdit en classe A. En classes B, C et D, il faut contacter l'organisme et obtenir une clairance avant d'entrer.
- CTR : du sol à un plafond donné, autour de l'aérodrome ; S-CTR quand elle est militaire. TMA : au-dessus, pour les arrivées et départs.
- Zones P (interdite), R (réglementée, clairance nécessaire), D (dangereuse) ; zones temporaires TRA, TSA, CBA.
- L'AFIS donne des informations sans délivrer d'instructions.
- Surface S : la plus haute valeur entre 3000 ft AMSL et 1000 ft sol.

Source : [CIRAS Nancy-Metz, Organisation de l'espace aérien français](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/NRS_espace_aerien/NRS_espace_aerien_francais.html). Page pédagogique, potentiellement datée.

**Transpondeur (SERA.13005)**
- 7700 signale une situation d'urgence.
- 7600 signale une panne de radiocommunication.
- 7500 signale une intervention illicite ; on peut lui préférer 7700 si les circonstances le justifient.

Source : [SERA.13005, UK CAA](https://regulatorylibrary.caa.co.uk/923-2012/Content/Regs/03000_SERA13005_SSR_transponder_Mode_A_code_setting.htm) ; [SERA.13001, EASA](https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-standardised-european?page=21)

**Phraséologie (manuel SIA, chapitre 9 « Urgences et pannes-incidents »)**
- « squawk ident » ; en panne radio, « squawk 7 6 0 0 » et accusé de réception par ident.
- Le pilote collationne les messages d'alerte et les mots « immédiatement/immediately ».
- Exemples : « Marseille, me recevez-vous ? », « trafic 11 heures, 5 nautiques », « minimum fuel ».

Source : [SIA, phraséologie chap. 9 v12](https://www.sia.aviation-civile.gouv.fr/pub/media/reglementation/file/p/h/phraseo_chap09_v12.pdf)

**Formules de navigation (formulaire CIRAS)**
- Facteur de base : Fb = 60/Vp (minutes par NM). Temps sans vent : TSV = distance × Fb. Avec vent, on utilise Fb' = 60/Vs.
- Route vraie : Rv = Rm + Dm. Cap vrai : Cv = Rv + dérive selon le signe.
- Dérive maximale (Xmax) = vitesse du vent × Fb.
- Composantes du vent : vent de travers = V·sin α, vent effectif = V·cos α.
- Conversions :
  - 1 NM = 1852 m ;
  - 1 kt = 1,852 km/h ≈ 0,514 m/s ;
  - 1 ft = 0,3048 m ;
  - 1 inHg ≈ 33,86 hPa.

  Les signes de la déclinaison sont incohérents dans le document, à harmoniser.

Source : [Formulaire BIA CAEA](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/formules/formulaire.html)

### Inferences
(std) Non vérifié en ligne dans cette session.
- **Coordonnées :** la latitude va de 0 à 90° Nord ou Sud, la longitude de 0 à 180° Est ou Ouest. 1' de latitude = 1 NM, et 1° de latitude = 60 NM. 1' de longitude = cos(latitude) NM.
  - Piège : un degré de longitude ne vaut 60 NM qu'à l'équateur.
- **Chaîne des caps :** Cv = Cm + Dm, et Cm = Cc + d (déviation). Déclinaison Est positive, Ouest négative.
  - Mnémonique anglais : « East is least, West is best », pour passer du vrai au magnétique (Est : on retranche ; Ouest : on ajoute).
  - Mnémonique française de la chaîne : « Cv → Cm → Cc », dans l'ordre Vrai, Magnétique, Compas.
- **Triangle des vitesses :**
  - Vp (vitesse propre) + vent = Vs (vitesse sol) ;
  - le cap est l'orientation de l'axe avion, la route est la trajectoire sol ;
  - dérive X ≈ Xmax × sin α ;
  - la dérive est droite si le vent vient de gauche.
- **Heure :** UTC (Z). En France, heure locale = UTC + 1 en hiver et UTC + 2 en été.
  - Le VFR de jour s'étend du lever du soleil moins 30 minutes au coucher du soleil plus 30 minutes (règle française de jour aéronautique, à vérifier).
- **Règles de l'air :**
  - Hauteur minimale de survol hors agglomération : 500 ft au-dessus de l'obstacle le plus élevé dans un rayon de 150 m. Au-dessus des agglomérations, 1000 ft au-dessus de l'obstacle le plus élevé dans un rayon de 600 m (SERA.5005(f)). En France, des hauteurs supérieures s'appliquent selon la taille de la ville (arrêté de 1957 modifié).
  - Priorités : ballon > planeur > dirigeable > aéronef remorquant > motorisé.
  - Croisement : on cède le passage à l'aéronef qui vient de droite ; face à face, chacun s'écarte à droite ; on dépasse par la droite.
  - Règle semi-circulaire VFR au-dessus de 3000 ft sol : routes de 0 à 179°, niveaux impairs + 500 (FL35, 55…) ; routes de 180 à 359°, niveaux pairs + 500 (FL45, 65…).
- **Radio :**
  - alphabet OACI : Alfa, Bravo, Charlie… Zulu ;
  - chiffres : « niner » pour 9 en anglais ;
  - éléments toujours collationnés : clairances, piste, QNH, code transpondeur, fréquences, niveaux, caps et vitesses ;
  - MAYDAY ×3 pour la détresse, PAN PAN ×3 pour l'urgence ;
  - fréquence de détresse 121,5 MHz ;
  - en France, la phraséologie française est autorisée sur certains aérodromes, l'anglais partout.
- **Licences et médical :** voir la section Cadre. Validité de la qualification SEP : 24 mois. Mention de compétence linguistique FCL.055, niveau 4 minimum en anglais pour le vol international.
- **Facteurs humains :**
  - hypoxie au-dessus d'environ 10 000 ft ;
  - désorientation spatiale (oreille interne) ;
  - illusions à l'atterrissage (piste en pente, piste large ou étroite) ;
  - plongée : pas de vol dans les 24 h après une plongée avec décompression (12 h sans) ;
  - alcool : règle des 8 h « bottle to throttle » et limite de 0,2 g/L en Europe (à vérifier) ;
  - modèle SHELL ; modèle de Reason (fromage suisse) ;
  - gestion des menaces et erreurs (TEM) ;
  - mnémonique IMSAFE (Illness, Medication, Stress, Alcohol, Fatigue, Eating).
- **Sécurité :** visite prévol ; check-lists ; carburant (réserve VFR de 30 min de jour) ; masse et centrage ; météo ; NOTAM (SOFIA-Briefing en France).

### Gaps
- Le texte français de la transposition SERA (notamment la note sur la classe D et les spécificités françaises du VFR de nuit) n'a pas été extrait. Sources à consulter : [SERA complet, SIA](https://www.sia.aviation-civile.gouv.fr/pub/media/reglementation/file/s/e/sera_complet_1.pdf) et [Guide SERA](https://ffplum.fr/images/pdf/guide-sera-ed1-v2-oct2017.pdf).
- La règle semi-circulaire, les hauteurs de survol des villes françaises, la réserve carburant (Part-NCO) et la limite d'alcool n'ont pas été vérifiées.
- La classe C en TMA françaises et les évolutions de l'espace aérien 2024-2026 (AIP en vigueur) n'ont pas été vérifiées.

## 5. Histoire et culture aéronautique et spatiale

### Takeaway
Le corpus CIRAS Orléans-Tours fournit une chronologie datée très complète, adaptée à un quiz ou une frise interactive. Plusieurs dates sont à recouper : la date de 1917 pour l'Aéropostale et l'ordre Cochran/Auriol.

### Cited Findings
Toutes les entrées proviennent de [CIRAS Orléans-Tours, Histoire de l'aviation et de l'espace](https://pedagogie.ac-orleans-tours.fr/fileadmin/user_upload/ciras/ressources/histoire/histoire_de_l_aviation_et_de_l_espace.pdf).

**Ballons**
- 25 avril 1783 : montgolfière captive des frères Montgolfier.
- 27 août 1783 : ballon à hydrogène de Charles et des frères Robert.
- 21 novembre 1783 : premier vol libre habité, Pilâtre de Rozier et le marquis d'Arlandes.
- 7 janvier 1785 : traversée de la Manche en ballon par Blanchard et Jeffries.
- 22 octobre 1797 : premier saut en parachute, Garnerin (1000 m).
- 22 septembre 1852 : dirigeable de Giffard.
- 10 août 1896 : mort de Lilienthal.

**Pionniers**
- 9 octobre 1890 : Éole de Clément Ader, environ 50 m.
- 14 octobre 1897 : Avion III d'Ader à Satory.
- 17 décembre 1903 : Flyer des frères Wright, premier vol motorisé et contrôlé d'un plus lourd que l'air.
- 23 juillet et 12 novembre 1906 : Santos-Dumont, dont le premier vol homologué (220 m en 21 s) à Bagatelle.
- 25 juillet 1909 : Blériot traverse la Manche (Calais–Douvres).
- 23 octobre 1909 : la baronne de Laroche, première femme pilote (sa licence date de 1910).
- 1910 : Chavez franchit les Alpes.
- 21 septembre 1913 : premier looping, Pégoud.
- 23 septembre 1913 : Roland Garros traverse la Méditerranée.

**Première Guerre mondiale**
- 5 octobre 1914 : première victoire aérienne, Frantz et Quenault.
- 1er avril 1915 : victoire de Garros en tirant à travers l'hélice (déflecteurs).
- Guynemer disparaît le 11 septembre 1917.
- Richthofen est abattu le 21 avril 1918.
- 26 septembre 1918 : Fonck abat 6 avions en un jour.

**Entre-deux-guerres**
- 14 juin 1919 : Alcock et Brown traversent l'Atlantique Nord sans escale.
- 1er avril 1921 : Adrienne Bolland franchit la Cordillère des Andes.
- 20-21 mai 1927 : Lindbergh (Spirit of Saint-Louis).
- 12 mai 1930 : Mermoz relie Saint-Louis du Sénégal à Natal.
- 16 janvier 1933 : Mermoz sur l'Arc-en-Ciel de Couzinet.
- 21 mai 1932 : Amelia Earhart traverse l'Atlantique en solo.
- 1er avril 1933 : création de l'Armée de l'air.
- 30 août 1933 : création d'Air France.
- 30 novembre 1934 : mort d'Hélène Boucher à Guyancourt.
- 17 décembre 1935 : premier vol du DC-3.
- 7 décembre 1936 : disparition de Mermoz (Croix-du-Sud).
- 6 mai 1937 : destruction du Hindenburg.
- 2 juillet 1937 : disparition d'Earhart.
- 27 août 1939 : He 178, premier avion à réaction.

**Seconde Guerre mondiale**
- 13 mai 1940 : Sikorsky VS-300.
- 27 novembre 1940 : Guillaumet est abattu.
- 1944 : Me 262.
- 31 juillet 1944 : disparition de Saint-Exupéry (P-38).
- 6 et 9 août 1945 : Hiroshima et Nagasaki.

**Ère du jet**
- 14 octobre 1947 : Yeager franchit Mach 1 sur Bell X-1.
- 18 mai 1953 : Jacqueline Cochran franchit le mur du son.
- 15 août 1953 : Jacqueline Auriol franchit le mur du son.
- 15 juillet 1954 : Boeing 707.
- 9 février 1969 : Boeing 747.
- 2 mars 1969 : Concorde 001 à Toulouse.
- 21 janvier 1976 : premiers vols commerciaux de Concorde.
- 2003 : fin de l'exploitation de Concorde.

**Airbus**
- 28 octobre 1972 : A300.
- 22 février 1987 : A320.
- 27 avril 2005 : A380.
- 14 juin 2013 : A350.

**Espace**
- 4 octobre 1957 : Spoutnik 1.
- 3 novembre 1957 : la chienne Laïka.
- 12 avril 1961 : Gagarine (Vostok 1).
- 5 mai 1961 : Alan Shepard.
- 16 juin 1963 : Valentina Terechkova.
- 18 mars 1965 : Leonov, première sortie extravéhiculaire.
- 21 juillet 1969 : Armstrong marche sur la Lune (Apollo 11, Saturn V). C'est le 21 juillet en heure UTC, le 20 juillet en heure des États-Unis.
- 24 décembre 1979 : premier vol d'Ariane.
- Juin 1996 : premier lancement d'Ariane 5.
- 24 juin 1982 : Jean-Loup Chrétien, premier Français dans l'espace.
- 17 juin 1985 : Patrick Baudry.
- Août 1996 : Claudie André-Deshays (mission Cassiopée).

Chronologies alternatives et compléments par période : [Histographie, BIA Domaine 5](https://histographie.net/wp-content/uploads/2025/10/BIA-Domaine-5-1.pdf) ; [CIRAS Normandie, cours complet](https://ciras.ac-normandie.fr/IMG/pdf/complet.pdf) ; [Hérodote, aviation 1890-1933](https://www.herodote.net/1890_1933-synthese-472.php)

### Inferences
- Le document CIRAS date le premier courrier de l'Aéropostale au 17 août 1917 (Paris–Saint-Nazaire). La date retenue par la plupart des cours pour les Lignes aériennes Latécoère est le 25 décembre 1918 (Toulouse–Barcelone). Il faut recouper avant publication (std, non vérifié).
- Le document mentionne aussi « 14 octobre 1953 » pour Cochran ; la date usuelle est le 18 mai 1953, à recouper.
- Thèmes très fréquents au BIA (std) : Ader (« Avion », chauve-souris), Wright (lanceur à contrepoids, gauchissement), Blériot XI, Aéropostale (Mermoz, Saint-Exupéry, Guillaumet ; Vol de nuit, Terre des hommes), Concorde, A320 (commandes de vol électriques), Ariane, les femmes pionnières (Boucher, Bolland, Auriol, Maryse Bastié, Élisabeth Boselli), Thomas Pesquet (missions Proxima 2016-2017 et Alpha 2021).

### Gaps
- Sophie Blanchard, Hélène Dutrieu, Maryse Bastié et Élisabeth Boselli : non couvertes dans la source principale.
- Ariane 6 (premier vol en 2024), Thomas Pesquet et Sophie Adenot (astronaute ESA) : non vérifiés ici.
- Statistiques de fréquence des questions d'histoire dans les annales : non trouvées. Il faudrait une analyse des annales (annales-bia.fr).

## 6. Anglais aéronautique et phraséologie

### Takeaway
Les sources primaires consultées ne couvrent que la phraséologie d'urgence du SIA. L'épreuve d'anglais du BIA (facultative) porte sur le vocabulaire aéronautique de base et la phraséologie VFR.

### Cited Findings
- Le manuel de phraséologie du SIA (chapitre 9) donne des expressions bilingues, par exemple « Roger », « Affirm », « negative contact », « squawk ident », « minimum fuel » et le collationnement de « immediately » — [SIA phraséologie chap. 9](https://www.sia.aviation-civile.gouv.fr/pub/media/reglementation/file/p/h/phraseo_chap09_v12.pdf)
- Le guide de phraséologie VFR de Nav Canada (en français) sert de référence complémentaire — [Nav Canada phraséologie VFR](https://www.navcanada.ca/fr/phraseologie-vfr.pdf)

### Inferences
(std)
- **Vocabulaire à maîtriser :** wilco, roger, affirm, negative, say again, standby, readback, cleared for take-off, line up and wait, hold short, go around, report final, downwind/base/final, QNH, squawk, traffic in sight, unable.
- **Lexique technique :**
  - lift, drag, thrust, weight ;
  - stall, spin ;
  - flaps, slats ;
  - aileron, elevator, rudder ;
  - landing gear ;
  - fuel, mixture, throttle ;
  - airspeed indicator, altimeter, attitude indicator ;
  - heading, track, drift, wind, visibility, ceiling.
- **Faux amis :**
  - « assiette » se dit pitch attitude, à ne pas confondre avec angle of attack (incidence) ;
  - « route » se dit track ;
  - « cap » se dit heading.

### Gaps
- Le programme officiel de l'épreuve d'anglais du BIA et la liste du manuel SIA « phraséologie VFR » (chapitres VFR) n'ont pas été extraits.

## 7. Idées de simulations interactives (modèles et formules)

### Takeaway
Chaque domaine possède au moins une loi simple, directement paramétrable par des curseurs. Les modèles ci-dessous s'appuient sur les formules sourcées plus haut : ISA, Fz/Fx, 1/cos φ, √n, R = V²/(g·tan φ), triangle des vitesses, Archimède, METAR.

### Cited Findings
- Paramètres sourcés utilisables :
  - **ISA :** T = 15 − 6,5·h(km) jusqu'à 11 km, puis −56,5 °C. P0 = 101 325 Pa, ρ0 = 1,225 kg/m³ — [Wikipedia ISA](https://en.wikipedia.org/wiki/International_Standard_Atmosphere)
  - **Mécanique du vol :** Fz = ½ρSV²Cz, n = 1/cos φ, R = V²/(g·tan φ), Vs = Vs0·√n — [Formulaire CIRAS](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/formules/formulaire.html) ; [CIRAS Orléans-Tours](https://pedagogie.ac-orleans-tours.fr/fileadmin/user_upload/ciras/ressources/aero_meca_vol/modification_de_trajectoire.pdf)
  - **Navigation :** Fb = 60/Vp, Xmax = Vw × Fb, travers = Vw·sin α, effectif = Vw·cos α — [Formulaire CIRAS](https://sites.ac-nancy-metz.fr/ciras/cahierdubia/formules/formulaire.html)
  - **Météo :** seuils du TAF et définition de CAVOK — [Météo-France](https://aviation.meteo.fr/documentation/comprendre_letaf.pdf)
  - **VMC :** table SERA S5-1 — [SERA.5001](https://regulatorylibrary.caa.co.uk/923-2012/Content/Regs/01250_SERA5001_VMC_visibility_and_distance_from_cloud_minima.htm)
  - **Orbites :** 7,8 km/s à 300 km, GEO en 24 h — [CNES](https://cnes.fr/dossiers/orbite)
  - **Atelier NASA de référence (FoilSim) :** la page NASA Glenn sur l'équation de portance sert de base — [NASA Glenn](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation)

### Inferences
Propositions de conception, nos idées à partir des formules ci-dessus.

**Météo**
1. **Profil ISA et altimètre :** un curseur d'altitude de 0 à 15 km affiche T, P et ρ. Un curseur ΔT (ISA ± x) et un curseur QNH montrent l'erreur altimétrique. Modèle : correction d'environ 4 % par 10 °C d'écart à l'ISA (std), et environ 28 ft par hPa.
2. **Base des cumulus et foehn :** curseurs T et Td donnant la base (≈ 125 m/°C) ; animation d'une particule sur une montagne (adiabatique sèche à 1 °C/100 m, saturée à environ 0,6 °C/100 m).
3. **Décodeur et générateur METAR/TAF :**
   - mode « décoder » : l'élève clique sur les groupes ;
   - mode « composer » : il glisse des groupes pour décrire une scène ;
   - vérification automatique de CAVOK et des minima VMC ;
   - quiz « VFR possible ? » croisant le METAR et la table SERA.
4. **Buys-Ballot et carte isobare :** placer une flèche de vent à faire glisser selon l'hémisphère.

**Aérodynamique**

5. **Soufflerie virtuelle :** curseurs V, ρ (altitude), S et α. Cz(α) est modélisé linéairement (≈ 0,1 par degré) jusqu'à α critique ≈ 15°, puis chute brutale. On affiche Fz, Fx et la polaire avec le point courant. La sortie « Décroché » se déclenche selon α, pas selon V.
6. **Virage :** un curseur φ de 0 à 80° affiche n, Vs = Vs0·√n et R. Un bandeau rouge apparaît quand V < Vs. Une jauge g complète l'affichage.
7. **Plané et finesse :** curseurs de finesse et de hauteur ; cône de plané sur une carte, avec le vent en option.
8. **Montgolfière :** curseurs de température interne, de volume et d'altitude, qui donnent la charge utile via Δρ·V. On utilise ρ = P/(R·T) avec R = 287 J/(kg·K) (std).
9. **Centrage :** glisser des passagers et du carburant pour voir le centre de gravité dans l'enveloppe, et l'effet sur la stabilité.

**Aéronefs**

10. **Chaîne anémo-barométrique et pannes :** on bouche le Pitot, le drain ou la prise statique, et les trois aiguilles réagissent selon le modèle Pt − Ps.
11. **Moteur 4 temps animé :** un curseur de régime fait défiler les 4 temps ; les magnétos se commutent avec chute de régime.
12. **Compas :** virage animé dans l'hémisphère Nord montrant le retard au nord et l'avance au sud, avec l'erreur d'accélération.
13. **Orbites :** curseur d'altitude, avec v = √(GM/r) et T = 2π√(r³/GM). On compare l'ISS (≈ 7,7 km/s) et la GEO (3,07 km/s, 24 h) (std).

**Navigation**

14. **Triangle des vitesses :** faire glisser le vecteur vent ; calcul de la dérive, du cap à afficher, de Vs et du temps ; comparaison avec la règle Xmax·sin α.
15. **Chaîne des caps :** cascade de curseurs Cv → déclinaison → Cm → déviation → Cc.
16. **Coupe d'espace aérien 3D :** glisser un avion entre les classes A, C, D, E et G, les zones P, R et D et les CTR/TMA ; afficher les exigences (contact radio, clairance, transpondeur, minima VMC).
17. **Panneau transpondeur et radio :** saisir 7500, 7600 ou 7700 selon un scénario ; simulateur de collationnement.

**Histoire**

18. **Frise chronologique à glisser-déposer :** remettre dans l'ordre Montgolfier 1783, Ader 1890, Wright 1903, Blériot 1909, Lindbergh 1927, Yeager 1947, Gagarine 1961, Apollo 11 1969, Concorde 1969/1976, A320 1987, A380 2005.
19. **Jeu d'association :** relier une femme pionnière à son exploit (Bolland et les Andes 1921, Boucher et ses records, Auriol et le mur du son 1953).

### Gaps
- Le modèle Cz(α) réaliste (données NACA 2412 ou 4412, par exemple) et la correction altimétrique de température ne sont pas sourcés. On peut utiliser FoilSim (NASA) comme référence.
- Aucune vérification des licences de réutilisation des contenus CIRAS et Météo-France pour un site web.
