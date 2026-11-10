import { Article, Categorie } from "./types";
import { isWithinLastDays, isWithinLastMs } from "./dates";
import {
  compareByScore,
  isSpecificActionText,
  normalizeUrgence,
  scoreAll,
  scoreArticle,
  type ArticleScore,
} from "./score";

export {
  compareByScore,
  normalizeUrgence,
  scoreAll,
  scoreArticle,
  PALIER_META,
  NIVEAU_LABEL,
} from "./score";
export type { ArticleScore, PalierImportance, NiveauEditorial } from "./score";

const WEEK_DAYS = 7;
const HOURS_48 = 48 * 60 * 60 * 1000;

/** Groupes d'affichage (ordre stable sur la home). */
export const ENJEU_BLOCKS: {
  id: string;
  label: string;
  categories: Categorie[];
}[] = [
  { id: "modeles", label: "Modèles & labs", categories: ["Modèles IA", "IA"] },
  { id: "securite", label: "Sécurité & hack", categories: ["Hack & Console"] },
  {
    id: "cloud",
    label: "Cloud & infra",
    categories: ["Cloud & Infra"],
  },
  { id: "produit", label: "Produit & web", categories: ["Web", "Nouveautés"] },
  {
    id: "societe",
    label: "Société & règles",
    categories: ["Société & Politique"],
  },
  { id: "dev", label: "Dev & outillage", categories: ["Dev", "Astuces"] },
  { id: "gaming", label: "Gaming & hardware", categories: ["Gaming"] },
];

function scoresOf(
  articles: Article[],
  now: Date,
  scores?: Map<string, ArticleScore>
): Map<string, ArticleScore> {
  return scores ?? scoreAll(articles, now);
}

export function sortByDateDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function sortByImportance(
  articles: Article[],
  now: Date = new Date(),
  scores?: Map<string, ArticleScore>
): Article[] {
  const map = scoresOf(articles, now, scores);
  return [...articles].sort((a, b) => compareByScore(map, a, b));
}

export function filterLastDays(
  articles: Article[],
  days: number,
  now: Date = new Date()
): Article[] {
  return articles.filter((a) => isWithinLastDays(a.date, days, now));
}

export function filterLast48h(
  articles: Article[],
  now: Date = new Date()
): Article[] {
  return articles.filter((a) => isWithinLastMs(a.date, HOURS_48, now));
}

/**
 * Top N de la semaine : indice décroissant, max 2 par catégorie,
 * max 3 breaking pour éviter un mur d'alertes.
 */
export function pickTopWeek(
  articles: Article[],
  limit = 10,
  now: Date = new Date(),
  scores?: Map<string, ArticleScore>
): Article[] {
  const map = scoresOf(articles, now, scores);
  const week = filterLastDays(articles, WEEK_DAYS, now);
  const ranked = [...week].sort((a, b) => compareByScore(map, a, b));

  const out: Article[] = [];
  const perCat = new Map<string, number>();
  let breakingCount = 0;

  for (const a of ranked) {
    if (out.length >= limit) break;
    const n = perCat.get(a.categorie) ?? 0;
    if (n >= 2) continue;
    const niveau = map.get(a.id)?.niveau ?? normalizeUrgence(a.urgence);
    if (niveau === "breaking" && breakingCount >= 3) continue;
    out.push(a);
    perCat.set(a.categorie, n + 1);
    if (niveau === "breaking") breakingCount += 1;
  }

  if (out.length < Math.min(limit, ranked.length)) {
    const ids = new Set(out.map((a) => a.id));
    for (const a of ranked) {
      if (out.length >= limit) break;
      if (ids.has(a.id)) continue;
      out.push(a);
      ids.add(a.id);
    }
  }

  return out;
}

/**
 * Hero : plus fort indice sur 72 h.
 * Sinon meilleur indice de la semaine, sinon le plus récent.
 */
export function pickHero(
  articles: Article[],
  now: Date = new Date(),
  scores?: Map<string, ArticleScore>
): Article | undefined {
  if (!articles.length) return undefined;
  const map = scoresOf(articles, now, scores);
  const h72 = 72 * 60 * 60 * 1000;
  const recent = articles.filter((a) => isWithinLastMs(a.date, h72, now));
  const pool = recent.length
    ? recent
    : filterLastDays(articles, WEEK_DAYS, now);
  const base = pool.length ? pool : articles;
  return [...base].sort((a, b) => compareByScore(map, a, b))[0];
}

export function pickLatestHeadlines(
  articles: Article[],
  limit = 8,
  excludeId?: string,
  now: Date = new Date()
): Article[] {
  return sortByDateDesc(articles)
    .filter((a) => a.id !== excludeId)
    .filter((a) => isWithinLastDays(a.date, WEEK_DAYS, now))
    .slice(0, limit);
}

/** Bandeau : ce qui pèse dans les 48 h, pas seulement ce qui vient de tomber. */
export function pickTicker(
  articles: Article[],
  limit = 8,
  now: Date = new Date(),
  scores?: Map<string, ArticleScore>
): Article[] {
  const map = scoresOf(articles, now, scores);
  const recent = filterLast48h(articles, now);
  const pool = recent.length ? recent : filterLastDays(articles, WEEK_DAYS, now);
  const ranked = [...pool].sort((a, b) => compareByScore(map, a, b));
  if (ranked.length >= 4) return ranked.slice(0, limit);
  return sortByDateDesc(articles).slice(0, limit);
}

export function articlesForEnjeu(
  articles: Article[],
  categories: Categorie[],
  limit = 3,
  excludeIds: Set<string> = new Set(),
  now: Date = new Date(),
  scores?: Map<string, ArticleScore>
): Article[] {
  const map = scoresOf(articles, now, scores);
  const week = filterLastDays(articles, WEEK_DAYS, now);
  return [...week]
    .filter((a) => categories.includes(a.categorie) && !excludeIds.has(a.id))
    .sort((a, b) => compareByScore(map, a, b))
    .slice(0, limit);
}

export type ActionSignal = {
  kind: "business" | "perso" | "vigilance";
  label: string;
  text: string;
  article: Article;
};

/** 3 signaux actionnables — uniquement textes assez spécifiques. */
export function pickActionSignals(
  articles: Article[],
  now: Date = new Date(),
  scores?: Map<string, ArticleScore>
): ActionSignal[] {
  const map = scoresOf(articles, now, scores);
  const week = filterLastDays(articles, WEEK_DAYS, now);
  const ranked = [...week].sort((a, b) => compareByScore(map, a, b));
  const out: ActionSignal[] = [];
  const used = new Set<string>();

  const take = (
    kind: ActionSignal["kind"],
    label: string,
    pred: (a: Article) => string | undefined,
    requireSpecific: boolean
  ) => {
    if (out.length >= 3) return;
    for (const a of ranked) {
      if (used.has(a.id)) continue;
      const text = pred(a)?.trim();
      if (!text) continue;
      if (requireSpecific && !isSpecificActionText(text)) continue;
      if (!requireSpecific && text.length < 40) continue;
      out.push({ kind, label, text, article: a });
      used.add(a.id);
      break;
    }
  };

  take("business", "Business", (a) => a.potentiel_business, true);
  take("perso", "À tester", (a) => a.potentiel_perso, true);
  take("vigilance", "Vigilance", (a) => a.perspective, false);

  return out;
}
