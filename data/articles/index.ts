/**
 * FICHIER GÉNÉRÉ — ne pas éditer à la main.
 * Source : scripts/generate-articles-index.mjs (npm run prebuild)
 * La veille n'a qu'à déposer data/articles/YYYY-MM-DD.json
 */
import a_2026_10_11 from "./2026-10-11.json";
import a_2026_10_10 from "./2026-10-10.json";
import a_2026_10_09 from "./2026-10-09.json";
import a_2026_10_08 from "./2026-10-08.json";
import a_2026_10_07 from "./2026-10-07.json";
import a_2026_10_06 from "./2026-10-06.json";
import a_2026_10_05 from "./2026-10-05.json";
import a_2026_10_05_b from "./2026-10-05-b.json";
import a_2026_10_04 from "./2026-10-04.json";
import a_2026_10_03 from "./2026-10-03.json";
import a_2026_10_02 from "./2026-10-02.json";
import a_2026_10_01 from "./2026-10-01.json";
import a_2026_10_01_d from "./2026-10-01-d.json";
import a_2026_10_01_c from "./2026-10-01-c.json";
import a_2026_10_01_b from "./2026-10-01-b.json";
import a_2026_09 from "./2026-09.json";
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
import a_2026_09_30 from "./2026-09-30.json";
import a_2026_09_30_e from "./2026-09-30-e.json";
import a_2026_09_30_d from "./2026-09-30-d.json";
import a_2026_09_30_c from "./2026-09-30-c.json";
import a_2026_09_30_b from "./2026-09-30-b.json";
import a_2026_09_29 from "./2026-09-29.json";
import a_2026_09_29_c from "./2026-09-29-c.json";
import a_2026_09_29_b from "./2026-09-29-b.json";
import a_2026_09_28 from "./2026-09-28.json";
import a_2026_09_27 from "./2026-09-27.json";
import a_2026_09_27_b from "./2026-09-27-b.json";
import a_2026_09_26 from "./2026-09-26.json";
import a_2026_09_26_b from "./2026-09-26-b.json";
import a_2026_09_25 from "./2026-09-25.json";
import a_2026_09_25_b from "./2026-09-25-b.json";
import a_2026_09_24 from "./2026-09-24.json";
import a_2026_09_24_b from "./2026-09-24-b.json";
import a_2026_09_23 from "./2026-09-23.json";
import a_2026_09_23_b from "./2026-09-23-b.json";
import a_2026_09_22 from "./2026-09-22.json";

import type { Article } from "@/lib/types";

const MONTH_FILES: Article[][] = [
  a_2026_10_11 as Article[],
  a_2026_10_10 as Article[],
  a_2026_10_09 as Article[],
  a_2026_10_08 as Article[],
  a_2026_10_07 as Article[],
  a_2026_10_06 as Article[],
  a_2026_10_05 as Article[],
  a_2026_10_05_b as Article[],
  a_2026_10_04 as Article[],
  a_2026_10_03 as Article[],
  a_2026_10_02 as Article[],
  a_2026_10_01 as Article[],
  a_2026_10_01_d as Article[],
  a_2026_10_01_c as Article[],
  a_2026_10_01_b as Article[],
  a_2026_09 as Article[],
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
  a_2026_09_30 as Article[],
  a_2026_09_30_e as Article[],
  a_2026_09_30_d as Article[],
  a_2026_09_30_c as Article[],
  a_2026_09_30_b as Article[],
  a_2026_09_29 as Article[],
  a_2026_09_29_c as Article[],
  a_2026_09_29_b as Article[],
  a_2026_09_28 as Article[],
  a_2026_09_27 as Article[],
  a_2026_09_27_b as Article[],
  a_2026_09_26 as Article[],
  a_2026_09_26_b as Article[],
  a_2026_09_25 as Article[],
  a_2026_09_25_b as Article[],
  a_2026_09_24 as Article[],
  a_2026_09_24_b as Article[],
  a_2026_09_23 as Article[],
  a_2026_09_23_b as Article[],
  a_2026_09_22 as Article[],
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
