/**
 * Index des fichiers mensuels d'articles.
 * Convention : data/articles/YYYY-MM.json (+ compléments a/b/c si besoin).
 * L'automation écrit dans le fichier principal du mois et DOIT fusionner
 * (lire → prepend → conserver existants). Jamais écraser.
 */
import month202609 from "./2026-09.json";
import month202609b from "./2026-09-b.json";
import month202609c from "./2026-09-c.json";

import type { Article } from "@/lib/types";

const MONTH_FILES: Article[][] = [
  month202609c as Article[],
  month202609 as Article[],
  month202609b as Article[],
];

export const allArticles: Article[] = (() => {
  const byId = new Map<string, Article>();
  for (const month of MONTH_FILES) {
    for (const article of month) {
      if (!byId.has(article.id)) byId.set(article.id, article);
    }
  }
  return Array.from(byId.values());
})();

export default allArticles;
