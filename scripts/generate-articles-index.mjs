#!/usr/bin/env node
/**
 * Génère data/articles/index.ts avec des imports statiques de tous les *.json.
 * Appelé en prebuild → Next/Vercel bundle correctement les articles
 * (fs runtime + "use client" cassait le site).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "data", "articles");
const outFile = path.join(dir, "index.ts");

function readArticleFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw || raw === "[]" || /PLACEHOLDER/i.test(raw)) return null;
  const parse = (text) => {
    const data = JSON.parse(text);
    return Array.isArray(data) && data.length > 0 ? data : null;
  };
  try {
    return parse(raw);
  } catch {
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start === -1 || end <= start) return null;
    try {
      const data = parse(raw.slice(start, end + 1));
      if (data) {
        console.warn(
          `[generate-articles-index] texte après le JSON ignoré : ${path.basename(filePath)}`
        );
      }
      return data;
    } catch {
      return null;
    }
  }
}

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .filter((f) => readArticleFile(path.join(dir, f)))
  // Plus récents d'abord (2026-09-22 > 2026-09-l > 2026-09-b)
  .sort((a, b) => b.localeCompare(a));

function varName(file) {
  return (
    "a_" +
    file
      .replace(/\.json$/, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
  );
}

const imports = files
  .map((f) => `import ${varName(f)} from "./${f}";`)
  .join("\n");

const arrayEntries = files.map((f) => `  ${varName(f)} as Article[],`).join("\n");

const content = `/**
 * FICHIER GÉNÉRÉ — ne pas éditer à la main.
 * Source : scripts/generate-articles-index.mjs (npm run prebuild)
 * La veille n'a qu'à déposer data/articles/YYYY-MM-DD.json
 */
${imports}

import type { Article } from "@/lib/types";

const MONTH_FILES: Article[][] = [
${arrayEntries}
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
`;

fs.writeFileSync(outFile, content, "utf8");
console.log(
  `[generate-articles-index] ${files.length} fichiers → index.ts`
);
files.forEach((f) => console.log("  -", f));
