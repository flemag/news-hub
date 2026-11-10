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

Valeurs canoniques (à préférer) :

- `breaking` : vraie dernière minute (1 max / jour sauf crise)
- `important` : impact net cette semaine
- `normal` : le reste

Alias acceptés à la lecture (le site les normalise, inutile d’en inventer de nouveaux) : `haute` / `high` → important, `normale` → normal, `moyenne` / `medium` → intermédiaire, `basse` / `low` → faible.

## Indice Signal (classement)

Le Top 10, le hero et le tri « Importance » ne suivent pas le champ `urgence` seul. Chaque article reçoit un indice **0–100** à l’affichage, somme de cinq parts plafonnées :

| Part | Max | Ce que ça mesure |
|------|-----|------------------|
| Niveau rédigé | 32 | `breaking` 32, important 23, intermédiaire 16, normal 10, faible 4 |
| Portée | 28 | Mots du titre, du résumé et des tags (incident, régulation, levée, emploi…) + léger biais de catégorie. Minorée si le signal est fragile. |
| Fraîcheur | 20 | Décroissance continue, demi-vie 30 h, nulle après 14 jours |
| Substance | 12 | Geste business/perso concret, enjeu modèle, perspective, analyse |
| Confiance | 8 | `confirme` 8, `probable` 5, `a_surveiller` 1 |

Paliers affichés : Critique ≥ 80, Majeure ≥ 68, Élevée ≥ 56, Notable ≥ 44, Courante ≥ 32, Discrète ≥ 20, sinon Bruit de fond.

Le hero est le plus fort indice sur 72 h (plus le premier `breaking` de la liste). Le top semaine garde au plus 2 articles par catégorie et 3 breaking.

## Volume

10–14 articles / jour, idéalement 12. Diversité : viser au moins une entrée par catégorie quand les sources le permettent.
