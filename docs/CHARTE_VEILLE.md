# Charte éditoriale Signal

Référence pour la rédaction quotidienne (`data/articles/YYYY-MM-DD.json`).

## Catégories (10)

| Catégorie | Usage |
|-----------|--------|
| **IA** | Produit, lab, incident, business IA (hors pure release modèle) |
| **Modèles IA** | Release / benchmark modèle + champ `modele_enjeu` obligatoire |
| **Web** | Navigateurs, standards, front, plateformes web |
| **Cloud & Infra** | Hyperscalers, GPU, coûts, outages, edge, serverless |
| **Gaming** | Jeux, hardware gaming, stores |
| **Hack & Console** | Vulns, incidents sécu, outils offensifs/défensifs |
| **Société & Politique** | Régulation, géopolitique tech, emploi, opinion publique |
| **Dev** | Langages, outils dev, OSS, DX |
| **Astuces** | Gestes concrets courts, workflow |
| **Nouveautés** | Produits / hardware hors cases ci-dessus |

Élargir la couverture avec des **tags** (`cloud`, `open-source`, `mobile`, `levée`, `régulation`, `emploi`, `recherche`, `gpu`, `sécurité`, `api`) plutôt qu’avec de nouvelles catégories.

## Fiabilité (`fiabilite`)

| Valeur | Quand |
|--------|--------|
| `confirme` | Source primaire (blog lab, CVE, doc officielle) ou plusieurs médias sérieux alignés |
| `probable` | Une source sérieuse, détails encore flous |
| `a_surveiller` | Rumeur, source unique faible, claim extraordinaire non recoupé |

Renseigner le champ **explicitement**. L’UI infère un niveau pour les anciens articles, mais la veille doit trancher.

## Champs actionnables

### `potentiel_business` (pro)
Doit répondre à au moins une question :
- Quel **métier** est touché ?
- Quel **geste** sous 7–30 jours ?
- Quel **coût / risque** ?

❌ « Fort potentiel de disruption pour les entreprises. »  
✅ « Auditer le routing API : volume sur modèle économique, frontier réservé aux 20 % de tickets critiques. »

Laisser **vide** si rien de concret.

### `potentiel_perso` (lecteur / craft)
- Un **test** ce soir / ce week-end, ou un **non-geste** utile.

❌ « Intéressant pour les passionnés. »  
✅ « Comparer sur 3 prompts code avant de changer le modèle par défaut. »

### `perspective`
- Ce que l’annonce **exagère** ou **omet**, horizon de temps (annonce ≠ dispo).

## Urgence

- `breaking` : vraie dernière minute (1 max / jour sauf crise)
- `important` : impact net cette semaine
- `normal` : le reste

## Volume

10–14 articles / jour, idéalement 12. Diversité : viser au moins une entrée par catégorie quand les sources le permettent.
