# Signal — site d'actu 24h

Site Next.js qui affiche des articles depuis un seul fichier de données :
`data/articles.json`. Chaque push sur GitHub redéploie automatiquement le
site sur Vercel.

## Navigation

- **Accueil** : flux, hero, filtres par catégorie.
- **Clic sur un article** → page interne `/article/[id]` avec :
  - résumé (et `contenu` si renseigné),
  - **Perspective** (avis / mise en contexte pour relativiser),
  - lien **source** en bas de page (pas d'ouverture forcée au clic sur la carte).

## 1. Ajouter des articles

Ouvre `data/articles.json` et ajoute un objet dans le tableau :

```json
{
  "id": "2026-09-08-ia-exemple",
  "titre": "Titre court et clair",
  "categorie": "IA",
  "resume": "Deux phrases maximum, l'essentiel de la news.",
  "contenu": "",
  "perspective": "Optionnel : ton point de vue pour relativiser le sujet.",
  "date": "2026-09-08T10:00:00Z",
  "urgence": "normal",
  "tags": ["mot-clé"],
  "source_url": "https://...",
  "image": "/vignettes/cat-ia.svg"
}
```

Points importants :
- `categorie` : `IA`, `Web`, `Gaming`, `Hack & Console`, `Société & Politique`, `Dev`, `Astuces`, `Nouveautés`.
- `urgence` : `normal`, `important` ou `breaking`.
- `date` : ISO UTC (avec `Z`).
- `id` unique (ex. `date-categorie-mot-clé`).
- `perspective` (optionnel) : texte affiché dans le bloc « Perspective » de la page article. S'il est absent, un texte de repli par catégorie est utilisé.
- `image` (optionnel) : sinon vignette auto selon la catégorie.

## Vignettes

Fichiers dans `public/vignettes/` : `cat-ia.svg`, `cat-web.svg`, `cat-gaming.svg`, `cat-hack.svg`, `cat-societe.svg`, `cat-dev.svg`, `cat-astuces.svg`, `cat-nouveautes.svg`.

## 2. Envoyer sur GitHub

```bash
git add data/articles.json
git commit -m "Nouveaux articles du jour"
git push
```

Ou édition directe sur GitHub (bouton crayon → Commit).

## 3. Vercel

Chaque `git push` redéploie le site. Après le premier déploiement, mets à jour l'URL dans `app/layout.tsx`, `app/sitemap.ts` et `app/robots.ts` si besoin.

## Développement local

```bash
npm install
npm run dev
```

http://localhost:3000 — les articles s'ouvrent sur `/article/...`
