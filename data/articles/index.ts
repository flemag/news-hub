/**
 * FICHIER GÉNÉRÉ — ne pas éditer à la main.
 * Source : scripts/generate-articles-index.mjs (npm run prebuild)
 * La veille n'a qu'à déposer data/articles/YYYY-MM-DD.json
 */
import a_2026_09_22 from "./2026-09-22.json";
import a_2026_09_l from "./2026-09-l.json";
import a_2026_09_k from "./2026-09-k.json";
import a_2026_09_j from "./2026-09-j.json";
import a_2026_09_i from "./2026-09-i.json";
import a_2026_09_h from "./2026-09-h.json";
import a_2026_09_g from "./2026-09-g.json";
import a_2026_09_f from "./2026-09-f.json";
import a_2026_09_e from "./2026-09-e.json";
import a_2026_09_d from "./2026-09-d.json";
import a_2026_09_c from "./2026-09-c.json";
import a_2026_09_b from "./2026-09-b.json";
import a_2026_09 from "./2026-09.json";

import type { Article } from "@/lib/types";

const MONTH_FILES: Article[][] = [
  a_2026_09_22 as Article[],
  a_2026_09_l as Article[],
  a_2026_09_k as Article[],
  a_2026_09_j as Article[],
  a_2026_09_i as Article[],
  a_2026_09_h as Article[],
  a_2026_09_g as Article[],
  a_2026_09_f as Article[],
  a_2026_09_e as Article[],
  a_2026_09_d as Article[],
  a_2026_09_c as Article[],
  a_2026_09_b as Article[],
  a_2026_09 as Article[],
];

export const allArticles: Article[] = (() => {
  const byId = new Map<string, Article>();
  for (const month of MONTH_FILES) {
    for (const article of month) {
      if (article?.id && !byId.has(article.id)) byId.set(article.id, article);
    }
  }
  return Array.from(byId.values());
})();

export default allArticles;
