# Organisation des données Signal

## Structure réelle (novembre 2026)

```
data/articles/
  index.ts                 # GÉNÉRÉ automatiquement par scripts/generate-articles-index.mjs
  2026-11-09.json          # articles du jour (max ~5)
  2026-11-09-b.json        # suite éventuelle
  2026-11-09-c.json        # ...
  2026-11-08.json
  2026-11-08-b.json
  ...
```

- Un fichier = un jour (ou une tranche du jour).
- Le script `scripts/generate-articles-index.mjs` (lancé en prebuild) scanne **tous** les `*.json` valides, les trie du plus récent au plus ancien, et produit `index.ts` avec des imports statiques.
- Le site n’utilise **jamais** de lecture runtime de fichiers JSON. Tout est bundlé.

### Pourquoi des fichiers journaliers + splits ?

- Diffs Git lisibles.
- Évite les fichiers trop gros qui font planter les outils de push (limite de taille des contenus dans les appels d’API).
- Le site gère nativement les suffixes `-b`, `-c`, `-d`… grâce au générateur d’index.

### Format d’un article (champs obligatoires)

```json
{
  "id": "2026-11-09-categorie-slug",
  "titre": "Titre clair et informatif",
  "categorie": "Société & Politique",
  "resume": "2 à 3 phrases COMPLÈTES. Jamais de phrase coupée.",
  "contenu": "Analyse détaillée en plusieurs paragraphes.",
  "perspective": "Point de vue pour relativiser / ce que ça change vraiment.",
  "potentiel_business": "Impact business concret (optionnel mais recommandé).",
  "potentiel_perso": "Impact pour le lecteur individuel (optionnel).",
  "date": "2026-11-09T08:00:00Z",
  "urgence": "normal | important | breaking",
  "tags": ["tag1", "tag2"],
  "source_url": "https://…"
}
```

Catégories autorisées : `IA`, `Modèles IA`, `Web`, `Gaming`, `Hack & Console`, `Société & Politique`, `Dev`, `Astuces`, `Nouveautés`.

---

## Règles STRICTES pour la veille quotidienne (à respecter à chaque run)

Ces règles existent pour empêcher définitivement le bug « un seul article / contenu tronqué / PLACEHOLDER ».

1. **Générer d’abord tous les articles en mémoire** (6 à 10 idéalement).
2. **Valider** que chaque article a :
   - un `resume` qui se termine par un point ;
   - un `contenu` d’au moins 2 paragraphes ;
   - un `id` unique au format `YYYY-MM-DD-categorie-slug`.
3. **Découper** en fichiers de **maximum 5 articles** :
   - `data/articles/YYYY-MM-DD.json`
   - `data/articles/YYYY-MM-DD-b.json`
   - `data/articles/YYYY-MM-DD-c.json`
   - etc.
4. **Jamais** de fichier contenant `PLACEHOLDER`, `[]` vide ou un seul article incomplet.
5. **Push atomique** : utiliser `github___push_files` (ou équivalent) pour envoyer **tous** les fichiers du jour dans un seul commit.
6. Message de commit clair : `Signal: N articles du JJ mois AAAA`.
7. Après le push, le prebuild de Vercel régénère automatiquement `index.ts`. Aucune action manuelle sur `index.ts`.

### Volume cible

- 6–10 articles / jour
- Qualité > quantité
- Toujours indiquer en fin de run ce qui a été ajouté et ce qui a été écarté.

### En cas de doute sur la taille

Si le payload risque d’être trop gros → splitter encore plus tôt (4 articles max par fichier). Mieux vaut 3 fichiers de 4 articles qu’un seul fichier qui échoue à mi-chemin.
