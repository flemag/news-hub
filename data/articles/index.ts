/**
 * Chargement automatique de TOUS les fichiers *.json du dossier.
 *
 * La veille quotidienne n'a plus qu'à CRÉER un nouveau fichier
 *   data/articles/YYYY-MM-DD.json
 * (ou 2026-09-m.json, etc.) — SANS modifier ce fichier index.ts.
 *
 * - Ignore les fichiers vides / PLACEHOLDER / JSON invalide
 * - Déduplique par `id` (premier fichier lu gagne ; tri anti-chrono sur le nom)
 * - Compatible avec l'historique (2026-09.json, 2026-09-b.json, …)
 */
import fs from "fs";
import path from "path";
import type { Article } from "@/lib/types";

function loadAllArticles(): Article[] {
  const dir = path.join(process.cwd(), "data", "articles");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    // Noms les plus récents d'abord (YYYY-MM-DD > 2026-09-z > 2026-09-a)
    .sort((a, b) => b.localeCompare(a));

  const byId = new Map<string, Article>();

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const trimmed = raw.trim();
      if (!trimmed || trimmed === "[]") continue;
      if (/PLACEHOLDER/i.test(trimmed)) continue;

      const data = JSON.parse(trimmed);
      if (!Array.isArray(data)) continue;

      for (const item of data) {
        if (!item || typeof item !== "object") continue;
        const id = (item as Article).id;
        if (typeof id !== "string" || id.length === 0) continue;
        if (!byId.has(id)) {
          byId.set(id, item as Article);
        }
      }
    } catch {
      // Fichier corrompu : on ignore pour ne pas casser le build
      continue;
    }
  }

  return Array.from(byId.values());
}

export const allArticles: Article[] = loadAllArticles();
export default allArticles;
