import type { Article, Fiabilite } from "./types";

export const FIABILITE_META: Record<
  Fiabilite,
  { label: string; short: string; className: string; color: string }
> = {
  confirme: {
    label: "Sources solides",
    short: "Confirmé",
    className: "text-emerald-300/90 border-emerald-400/25 bg-emerald-400/10",
    color: "#34D399",
  },
  probable: {
    label: "À confirmer",
    short: "Probable",
    className: "text-cyan/90 border-cyan/30 bg-cyan/10",
    color: "#5EEBFF",
  },
  a_surveiller: {
    label: "Signal faible",
    short: "À surveiller",
    className: "text-amber border-amber/30 bg-amber/10",
    color: "#FFC45C",
  },
};

/** Mots-clés dans titre/résumé qui baissent la confiance. */
const WEAK_MARKERS =
  /\b(rumeur|rumeurs|sources?\s+proches?|selon\s+des\s+sources|non\s+confirmé|allègue|aurait|pourrait\s+avoir|fuite\s+non|unverified|allegedly)\b/i;

const PRIMARY_HOSTS =
  /github\.com|arxiv\.org|openai\.com|anthropic\.com|blog\.google|cloud\.google|aws\.amazon|microsoft\.com|azure\.microsoft|developer\.mozilla|cve\.mitre|nvd\.nist|europa\.eu|legifrance\.gouv|cloudflare\.com|vercel\.com|huggingface\.co/i;

const SERIOUS_PRESS =
  /reuters\.com|ft\.com|wsj\.com|nytimes\.com|bloomberg\.com|techcrunch\.com|theverge\.com|wired\.com|arstechnica\.com|lemonde\.fr|lesechos\.fr|sifted\.eu/i;

/**
 * Infère un niveau si le champ fiabilite est absent (anciens JSON).
 * Heuristique légère — la veille doit renseigner le champ explicitement.
 */
export function resolveFiabilite(article: Article): Fiabilite {
  if (article.fiabilite) return article.fiabilite;

  const blob = `${article.titre} ${article.resume} ${article.contenu ?? ""}`;
  if (WEAK_MARKERS.test(blob)) return "a_surveiller";

  const url = article.source_url ?? "";
  if (PRIMARY_HOSTS.test(url)) return "confirme";
  if (SERIOUS_PRESS.test(url)) return "probable";

  // Breaking sans source claire → prudence
  if (article.urgence === "breaking" && !url) return "a_surveiller";

  return "probable";
}

/** Afficher un badge seulement si utile (pas de bruit sur tout « confirmé »). */
export function shouldShowFiabiliteBadge(level: Fiabilite): boolean {
  return level === "probable" || level === "a_surveiller";
}
