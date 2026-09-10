# Organisation des données Signal

## Structure

```
data/
  articles/
    index.ts          # importe et fusionne les mois
    2026-09.json      # articles de septembre 2026
    2026-10.json      # (à créer au 1er octobre)
  articles.json       # legacy (vide) — ne plus utiliser
```

### Pourquoi un fichier par mois ?

- Diffs Git lisibles (un mois = un fichier touché par jour)
- Historique stable : les mois passés ne bougent plus
- Moins de risques de conflits / fichiers énormes
- L'automatisation n'écrit que dans `YYYY-MM.json` du mois courant

### Format d'un article

```json
{
  "id": "2026-09-10-ia-exemple",
  "titre": "…",
  "categorie": "IA",
  "resume": "2–3 phrases max",
  "contenu": "Analyse détaillée (plusieurs paragraphes)",
  "perspective": "Point de vue pour relativiser",
  "date": "2026-09-10T08:00:00Z",
  "urgence": "normal",
  "tags": ["mot-clé"],
  "source_url": "https://…",
  "image": "/vignettes/cat-ia.svg"
}
```

Catégories autorisées : `IA`, `Web`, `Gaming`, `Hack & Console`, `Société & Politique`, `Dev`, `Astuces`, `Nouveautés`.  
Urgence : `normal` | `important` | `breaking`.

### Nouveau mois

1. Créer `data/articles/2026-10.json` avec `[]`
2. Dans `data/articles/index.ts` : `import month202610 from "./2026-10.json"` et l'ajouter dans `MONTH_FILES`
3. Commit + push

### Automatisation quotidienne (Grok)

Une automation Grok peut :
1. Chercher l'actu des dernières 24h (sources FR/tech)
2. Lire `data/articles/YYYY-MM.json` sur GitHub
3. Ajouter 3–8 articles **nouveaux** (id unique, contenu + perspective)
4. Pousser uniquement ce fichier sur `main`

Voir le prompt d'automation dans le README.
