# Articles Signal — organisation

## Règle d'or pour la veille automatique

1. **Créer uniquement** un fichier du jour :
   - **Préféré** : `YYYY-MM-DD.json` (ex. `2026-09-22.json`)
   - Accepté : `2026-09-m.json` (lettre suivante)
2. Contenu = **tableau JSON** de 10–14 nouveaux articles seulement.
3. **Taille max ~20 ko** (sinon scinder en deux fichiers du même jour : `2026-09-22.json` + `2026-09-22-b.json`).
4. **Ne jamais** :
   - modifier `index.ts` (auto-découverte),
   - écraser un fichier existant,
   - pousser un PLACEHOLDER ou un seul article alors que 12 ont été rédigés.
5. **Après le push** : relire le fichier sur GitHub et vérifier `Array.length`.

## Fichiers historiques

Les lots `2026-09.json`, `2026-09-b.json` … `2026-09-l.json` restent chargés automatiquement.

## Champs article

Voir `lib/types.ts`. Catégories : IA | Modèles IA | Web | Gaming | Hack & Console | Société & Politique | Dev | Astuces | Nouveautés.
