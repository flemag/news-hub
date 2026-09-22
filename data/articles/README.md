# Articles Signal — organisation

## Règle d'or pour la veille automatique

1. **Créer uniquement** un fichier du jour :
   - **Préféré** : `YYYY-MM-DD.json` (ex. `2026-09-22.json`)
   - Si déjà présent : `YYYY-MM-DD-b.json`
2. Contenu = **tableau JSON** de 10–14 nouveaux articles.
3. **Taille max ~18 ko** (sinon scinder).
4. **Ne jamais** :
   - modifier `index.ts` (régénéré au `prebuild` Vercel),
   - écraser un fichier existant,
   - pousser PLACEHOLDER / stub à 1 article.
5. Après push : relire le fichier et vérifier le nombre d'articles.

## Build

`npm run prebuild` (automatique avant `next build`) scanne ce dossier et régénère `index.ts` avec des **imports statiques** — obligatoire pour que Vercel embarque les JSON.

## Catégories

IA | Modèles IA | Web | Gaming | Hack & Console | Société & Politique | Dev | Astuces | Nouveautés
