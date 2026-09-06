# Signal — site d'actu 24h

Site Next.js qui affiche des articles depuis un seul fichier de données :
`data/articles.json`. Chaque push sur GitHub redéploie automatiquement le
site sur Vercel.

## 1. Ajouter des articles (le seul geste répété au quotidien)

Ouvre `data/articles.json` et ajoute un objet dans le tableau, sur ce modèle :

```json
{
  "id": "2026-09-08-ia-exemple",
  "titre": "Titre court et clair",
  "categorie": "IA",
  "resume": "Deux phrases maximum, l'essentiel de la news.",
  "contenu": "",
  "date": "2026-09-08T10:00:00Z",
  "urgence": "normal",
  "tags": ["mot-clé"],
  "source_url": "https://..."
}
```

Points importants :
- `categorie` doit être exactement l'une de : `IA`, `Web`, `Gaming`,
  `Hack & Console`, `Société & Politique`, `Dev`, `Astuces`, `Nouveautés`.
- `urgence` : `normal`, `important` ou `breaking`.
- `date` au format ISO avec l'heure UTC (le `Z` à la fin) — c'est ce qui
  permet au site de calculer automatiquement ce qui a moins de 24h.
- `id` doit être unique ; le plus simple est `date-categorie-mot-clé`.
- N'oublie pas la virgule entre deux articles (JSON est strict là-dessus).

## 2. Envoyer sur GitHub

La première fois :

```bash
cd news-hub
git init
git add .
git commit -m "Site initial"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/TON-REPO.git
git push -u origin main
```

Ensuite, à chaque ajout d'article, seulement :

```bash
git add data/articles.json
git commit -m "Nouveaux articles du jour"
git push
```

Tu peux aussi éditer `articles.json` directement dans l'interface web de
GitHub (bouton crayon sur le fichier) et cliquer "Commit changes" — pas
besoin de terminal du tout si tu préfères.

## 3. Brancher Vercel (une seule fois)

1. Va sur vercel.com, connecte ton compte GitHub.
2. "Add New Project" → sélectionne ce repo.
3. Vercel détecte Next.js automatiquement, laisse les réglages par défaut.
4. "Deploy".

À partir de là, chaque `git push` déclenche un rebuild automatique
(20 à 60 secondes) et le site en ligne se met à jour tout seul.

## Mettre à jour l'URL du site (une fois, après le premier déploiement)

Trois fichiers contiennent `https://news-hub.vercel.app` comme URL par
défaut, utilisée pour les métadonnées de partage (réseaux sociaux) et le
sitemap. Une fois ton site en ligne, remplace cette URL par la tienne dans :

- `app/layout.tsx` (`metadataBase`)
- `app/sitemap.ts`
- `app/robots.ts`

## Développement local

```bash
npm install
npm run dev
```

Site disponible sur http://localhost:3000
