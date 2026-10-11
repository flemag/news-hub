import { Article, Categorie } from "./types";
import { isWithinLastDays, isWithinLastMs } from "./dates";
import { resolveFiabilite } from "./fiabilite";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_DAYS = 7;
const HOURS_48 = 48 * 60 * 60 * 1000;

const URGENCY_SCORE: Record<string, number> = {
  breaking: 50,
  important: 25,
  normal: 10,
};

/** Phrases trop génériques à exclure des signaux actionnables. */
const GENERIC_ACTION =
  /\b(fort potentiel|opportunité(s)? (de |pour )?(marché|business)?|disrupt|révolutionn|intéressant pour|les entreprises peuvent|à surveiller de près)\b/i;

function isSpecificActionText(text: string): boolean {
  const t = text.trim();
  if (t.length < 40) return false;
  if (GENERIC_ACTION.test(t)) return false;
  // Au moins un verbe d'action ou un marqueur concret
  return /\b(tester|auditer|migrer|comparer|mesurer|revoir|activer|désactiver|documenter|piloter|chiffrer|attendre|éviter|remplacer|monitorer|mettre à jour)\b/i.test(
    t
  ) || /\d/.test(t);
}

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

export function sortByDateDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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

/** Score d'importance (urgence + récence 7j + bonus champs utiles). */
export function scoreArticle(article: Article, now: Date = new Date()): number {
  const urg = URGENCY_SCORE[article.urgence] ?? 10;
  const ageMs = Math.max(0, now.getTime() - new Date(article.date).getTime());
  const ageDays = ageMs / DAY_MS;
  const recency = Math.max(0, 30 * (1 - ageDays / WEEK_DAYS));

  let bonus = 0;
  if (article.potentiel_business?.trim() && isSpecificActionText(article.potentiel_business))
    bonus += 6;
  else if (article.potentiel_business?.trim()) bonus += 2;

  if (article.potentiel_perso?.trim() && isSpecificActionText(article.potentiel_perso))
    bonus += 4;
  else if (article.potentiel_perso?.trim()) bonus += 1;

  if (article.modele_enjeu?.trim()) bonus += 5;
  if (article.perspective?.trim() && article.perspective.length > 40) bonus += 2;

  const fiab = resolveFiabilite(article);
  if (fiab === "confirme") bonus += 3;
  if (fiab === "a_surveiller") bonus -= 8;

  return urg + recency + bonus;
}

/**
 * Top N de la semaine : score décroissant, max 2 par catégorie,
 * max 3 breaking pour éviter un mur d'alertes.
 */
export function pickTopWeek(
  articles: Article[],
  limit = 10,
  now: Date = new Date()
): Article[] {
  const week = filterLastDays(articles, WEEK_DAYS, now);
  const ranked = [...week].sort(
    (a, b) => scoreArticle(b, now) - scoreArticle(a, now)
  );

  const out: Article[] = [];
  const perCat = new Map<string, number>();
  let breakingCount = 0;

  for (const a of ranked) {
    if (out.length >= limit) break;
    const n = perCat.get(a.categorie) ?? 0;
    if (n >= 2) continue;
    if (a.urgence === "breaking" && breakingCount >= 3) continue;
    out.push(a);
    perCat.set(a.categorie, n + 1);
    if (a.urgence === "breaking") breakingCount += 1;
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

/** Hero : breaking ≤72h, sinon important ≤72h, sinon meilleur score semaine. */
export function pickHero(
  articles: Article[],
  now: Date = new Date()
): Article | undefined {
  const sorted = sortByDateDesc(articles);
  if (!sorted.length) return undefined;

  const h72 = 72 * 60 * 60 * 1000;
  const breaking = sorted.find(
    (a) => a.urgence === "breaking" && isWithinLastMs(a.date, h72, now)
  );
  if (breaking) return breaking;

  const important = sorted.find(
    (a) => a.urgence === "important" && isWithinLastMs(a.date, h72, now)
  );
  if (important) return important;

  const top = pickTopWeek(articles, 1, now)[0];
  return top ?? sorted[0];
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

export function articlesForEnjeu(
  articles: Article[],
  categories: Categorie[],
  limit = 3,
  excludeIds: Set<string> = new Set(),
  now: Date = new Date()
): Article[] {
  const week = filterLastDays(articles, WEEK_DAYS, now);
  return [...week]
    .filter((a) => categories.includes(a.categorie) && !excludeIds.has(a.id))
    .sort((a, b) => scoreArticle(b, now) - scoreArticle(a, now))
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
  now: Date = new Date()
): ActionSignal[] {
  const week = filterLastDays(articles, WEEK_DAYS, now);
  const ranked = [...week].sort(
    (a, b) => scoreArticle(b, now) - scoreArticle(a, now)
  );
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
