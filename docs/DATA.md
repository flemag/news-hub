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

Catégories : `IA`, `Web`, `Gaming`, `Hack & Console`, `Société & Politique`, `Dev`, `Astuces`, `Nouveautés`.  
Urgence : `normal` | `important` | `breaking`.

### Nouveau mois

1. Créer `data/articles/2026-10.json` avec `[]`
2. Dans `data/articles/index.ts` : importer le mois et l'ajouter à `MONTH_FILES`
3. Commit + push

---

## Veille idéale (automation quotidienne 08:00 Europe/Paris)

### Piliers scannés chaque jour

| Pilier | Exemples de sources |
|--------|---------------------|
| **Labs IA** | OpenAI, Anthropic, DeepMind, Meta, xAI, Mistral, HF, Microsoft, AWS, Apple ML |
| **Recherche** | arXiv (`cs.AI`, `cs.LG`, `cs.CL`, `cs.CV`, `cs.CR`), HF Daily Papers, Papers With Code |
| **Presse FR** | Usine Digitale, Numerama, BFMTV Tech, ZDNet, Next INpact, BdM |
| **Presse EN** | Verge, Ars, TechCrunch, MIT TR, Bloomberg (si signal majeur) |
| **Sécurité** | ANSSI, CERT-FR, CVE critiques, scène console (Logic-Sunrise…) |
| **Gaming** | Nintendo / Sony / MS, Gameblog, GamerGen |
| **Web & Dev** | Standards, frameworks, blogs ingénierie |
| **Société** | AI Act, CNIL, géopolitique puces/cloud |
| **Hardware** | Apple, Samsung, Google, gadgets à impact |

### Filtre arXiv (anti-bruit)

Un papier n'est retenu que s'il coche **au moins un** critère :

1. Lab / auteur de premier plan, **ou**
2. Code public + claim vérifiable, **ou**
3. SOTA / changement de pratique (agents, safety, efficiency…), **ou**
4. Déjà relayé par la presse ou la communauté (HN, HF, chercheurs)

Rédaction : problème + idée centrale + **pourquoi le lecteur Signal s'en soucie** (pas un abstract traduit).

### Volume

- 4–10 articles / jour (idéal 6–8)
- Qualité > quantité
- Rapport de fin de run : ce qui a été ajouté **et** ce qui a été vu mais écarté
