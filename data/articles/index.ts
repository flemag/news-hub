/**
 * Index des fichiers mensuels d'articles.
 *
 * Convention : data/articles/YYYY-MM.json
 * Ajoute ici chaque nouveau mois pour qu'il soit chargé au build.
 *
 * L'automatisation quotidienne Grok n'écrit QUE dans le fichier du mois courant
 * (ex. 2026-09.json). Au 1er du mois suivant, créer 2026-10.json et l'importer ici.
 */
import month202609 from "./2026-09.json";

import type { Article } from "@/lib/types";

/** Liste ordonnée des mois (du plus récent au plus ancien si besoin). */
const MONTH_FILES: Article[][] = [
  month202609 as Article[],
  // month202610 as Article[],
  // month202608 as Article[],
];

/** Tous les articles, dédupliqués par id (le plus récent gagne si collision). */
export const allArticles: Article[] = (() => {
  const byId = new Map<string, Article>();
  for (const month of MONTH_FILES) {
    for (const a of month) {
      if (!byId.has(a.id)) byId.set(a.id, a);
    }
  }
  return Array.from(byId.values());
})();

export default allArticles;
