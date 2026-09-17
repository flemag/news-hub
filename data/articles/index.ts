/**
 * Index articles. Automation : TOUJOURS écrire dans un fichier du jour
 * (ex. 2026-09-g.json) et l’ajouter ici. Ne JAMAIS remplacer un fichier
 * existant par un seul article.
 */
import month202609 from "./2026-09.json";
import month202609b from "./2026-09-b.json";
import month202609c from "./2026-09-c.json";
import month202609d from "./2026-09-d.json";
import month202609e from "./2026-09-e.json";
import month202609f from "./2026-09-f.json";
import month202609g from "./2026-09-g.json";
import month202609h from "./2026-09-h.json";

import type { Article } from "@/lib/types";

const MONTH_FILES: Article[][] = [
  month202609h as Article[],
  month202609g as Article[],
  month202609f as Article[],
  month202609d as Article[],
  month202609c as Article[],
  month202609 as Article[],
  month202609e as Article[],
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
