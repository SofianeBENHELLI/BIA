# Le BIA de Saleem

Application web installable (PWA) de préparation au brevet d'initiation aéronautique, et au-delà vers le brevet de pilote.
Adresse : https://bia.benhelli.org (Worker Cloudflare `bia`).

## Structure

| Chemin | Rôle |
|---|---|
| `site/index.html` | Accueil : domaines, compte à rebours, format de l'examen, simulateur de note, sauvegarde |
| `site/assets/core.js` | Briques communes : stockage local, navigation, moteur de QCU, curseurs, glisser sur SVG, atmosphère standard |
| `site/assets/app.css` | Styles communs, mobile d'abord |
| `site/assets/pwa.js` | Service worker, bandeau de mise à jour, bouton « Installer » |
| `site/aerodynamique/` | Domaine 2 : cours, 8 ateliers interactifs (`labs.js`), 38 QCU (`questions.js`) |
| `site/credits/` | Sources et licences |
| `scripts/build-pwa.mjs` | Génère `site/sw.js` (liste des fichiers mis en cache, version) |
| `docs/recherche/` | Rapport de recherche et notes sourcées (programme, annales, contenu expert, visuels, DR400, parcours pilote) |

Aucune étape de build pour le site : les fichiers de `site/` sont servis tels quels.
La progression est stockée dans le navigateur (localStorage), exportable en JSON.

## Règles

- Après toute modification de `site/` : `npm run pwa` (sinon le bandeau de mise à jour ne se déclenche pas).
- Chaque chiffre affiché porte sa source (certificat de type, manuel de vol, texte officiel). Les modèles d'atelier sont pédagogiques.
- Questions et explications rédigées pour le site ; pas de copie des banques privées (annales-bia.fr, France-BIA, Ambassadair).
- Pas de tiret cadratin dans les textes.

## Tests

```sh
node tests/content.test.mjs   # banque de questions
node scripts/build-pwa.mjs --check
python3 tests/browser.py      # ordinateur et mobile, ateliers, QCU, hors ligne (Playwright)
```

## Déploiement

Cloudflare Workers Builds connecté à ce dépôt : un push sur `main` met en production, une autre branche donne une adresse d'aperçu.
Manuel : `npm run deploy` (wrangler login requis).
