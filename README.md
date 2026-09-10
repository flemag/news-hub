# Signal — site d'actu 24h

Site Next.js alimenté par des fichiers JSON mensuels dans `data/articles/`.
Chaque push sur GitHub redéploie le site sur Vercel.

## Organisation des données

```
data/articles/
  index.ts       # fusionne tous les mois
  2026-09.json   # un fichier = un mois
```

- **Écrire** uniquement dans le fichier du mois courant.
- Au 1er du mois suivant : créer `YYYY-MM.json` + l'importer dans `index.ts`.
- Détails : [docs/DATA.md](docs/DATA.md).

## Navigation

- Accueil : flux, hero, filtres.
- Clic article → `/article/[id]` : résumé, analyse, perspective, source en bas.

## Ajouter un article (manuel)

Édite `data/articles/2026-09.json` (mois en cours) :

```json
{
  "id": "2026-09-11-ia-exemple",
  "titre": "Titre court",
  "categorie": "IA",
  "resume": "L'essentiel en 2 phrases.",
  "contenu": "Analyse détaillée…",
  "perspective": "Pour relativiser…",
  "date": "2026-09-11T08:00:00Z",
  "urgence": "normal",
  "tags": ["tag"],
  "source_url": "https://…"
}
```

Puis :

```bash
git add data/articles/2026-09.json
git commit -m "Articles du jour"
git push
```

## Automatisation quotidienne Grok

Tu peux planifier une tâche Grok (Automations) qui, chaque matin :

1. Recherche l'actu tech FR des 24h (IA, Web, Gaming, Hack, Société, Dev, Nouveautés)
2. Lit le JSON du mois sur `github.com/flemag/news-hub`
3. Ajoute 3–8 articles **nouveaux** avec `contenu` + `perspective`
4. Push sur `main` → Vercel redéploie

Le prompt type est fourni via l'automation « Signal — veille quotidienne ».

## Vignettes

`public/vignettes/cat-*.svg` — fallback auto par catégorie si pas de champ `image`.

## Dev local

```bash
npm install
npm run dev
```

http://localhost:3000
