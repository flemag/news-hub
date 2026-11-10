import { resolveFiabilite } from "./fiabilite";
import type { Article, Categorie, Fiabilite } from "./types";

/**
 * Indice Signal — classement d'importance sur 100.
 *
 * Cinq composantes indépendantes, plafonnées, pour ne plus dépendre
 * d'un seul mot (breaking / important / normal) ni de l'heure seule :
 *   1. niveau rédigé (alias normalisés)
 *   2. portée du sujet (titre, résumé, tags)
 *   3. fraîcheur (demi-vie 30 h, utile encore à J+7)
 *   4. substance actionnable
 *   5. confiance de la source
 */

export type NiveauEditorial =
  | "breaking"
  | "majeur"
  | "notable"
  | "courant"
  | "mineur";

export type PalierImportance =
  | "critique"
  | "majeure"
  | "elevee"
  | "notable"
  | "courante"
  | "discrete"
  | "fond";

export type ScorePartId =
  | "editorial"
  | "portee"
  | "fraicheur"
  | "substance"
  | "confiance";

export type ScorePart = {
  id: ScorePartId;
  label: string;
  /** Contribution retenue dans le total (déjà plafonnée). */
  value: number;
  max: number;
  detail: string;
};

export type ArticleScore = {
  total: number;
  palier: PalierImportance;
  niveau: NiveauEditorial;
  /** Libellé brut tel qu'écrit dans le JSON, pour expliquer la normalisation. */
  urgenceBrute: string;
  parts: ScorePart[];
};

const MAX = {
  editorial: 32,
  portee: 28,
  fraicheur: 20,
  substance: 12,
  confiance: 8,
} as const;

const HALF_LIFE_H = 30;
const FRESH_CUTOFF_H = 14 * 24;

const EDITORIAL_POINTS: Record<NiveauEditorial, number> = {
  breaking: 32,
  majeur: 23,
  notable: 16,
  courant: 10,
  mineur: 4,
};

export const NIVEAU_LABEL: Record<NiveauEditorial, string> = {
  breaking: "Breaking",
  majeur: "Majeur",
  notable: "Notable",
  courant: "Courant",
  mineur: "Mineur",
};

export const PALIER_META: Record<
  PalierImportance,
  { label: string; short: string; color: string; hint: string }
> = {
  critique: {
    label: "Critique",
    short: "Critique",
    color: "#FF5C5C",
    hint: "À traiter maintenant : portée large et signal fiable.",
  },
  majeure: {
    label: "Majeure",
    short: "Majeure",
    color: "#FFC45C",
    hint: "Change la semaine d'une équipe ou d'un secteur.",
  },
  elevee: {
    label: "Élevée",
    short: "Élevée",
    color: "#5EEBFF",
    hint: "Mérite une lecture, pas seulement un survol.",
  },
  notable: {
    label: "Notable",
    short: "Notable",
    color: "#C4B5FD",
    hint: "Utile si le sujet est le vôtre.",
  },
  courante: {
    label: "Courante",
    short: "Courante",
    color: "#B8C0D6",
    hint: "Veille de routine.",
  },
  discrete: {
    label: "Discrète",
    short: "Discrète",
    color: "#8E98B5",
    hint: "Contexte, peu d'urgence.",
  },
  fond: {
    label: "Bruit de fond",
    short: "Fond",
    color: "#6D7694",
    hint: "Faible enjeu ou signal encore fragile.",
  },
};

/** Alias observés dans les JSON (haute, normale, high…) → niveau canonique. */
const ALIASES: Record<string, NiveauEditorial> = {
  breaking: "breaking",
  flash: "breaking",
  alerte: "breaking",
  critique: "breaking",
  important: "majeur",
  importante: "majeur",
  haute: "majeur",
  haut: "majeur",
  high: "majeur",
  elevee: "majeur",
  majeur: "majeur",
  majeure: "majeur",
  moyenne: "notable",
  medium: "notable",
  notable: "notable",
  normal: "courant",
  normale: "courant",
  courant: "courant",
  courante: "courant",
  basse: "mineur",
  bas: "mineur",
  low: "mineur",
  mineur: "mineur",
  mineure: "mineur",
  faible: "mineur",
};

const CAT_BIAS: Record<Categorie, number> = {
  "Hack & Console": 3,
  "Société & Politique": 3,
  "Cloud & Infra": 2,
  "Modèles IA": 2,
  IA: 1,
  Dev: 1,
  Web: 0,
  Nouveautés: 0,
  Gaming: -1,
  Astuces: -2,
};

type PorteeRule = { re: RegExp; points: number; why: string };

/** Repères sur titre + résumé + tags uniquement (pas le corps, trop bruité). */
const PORTEE_UP: PorteeRule[] = [
  {
    re: /\b(zero[- ]?day|0-?day|cve-\d{4}|ransomware|ransom|rancon|exfiltration|fuite de donnees|data breach|compromission)\b/i,
    points: 9,
    why: "incident de sécurité concret",
  },
  {
    re: /\b(vulnerabilit|faille|correctif de securite|patch de securite)/i,
    points: 5,
    why: "enjeu de sécurité",
  },
  {
    re: /\b(regulation|reglement|directive|sanction|amende|interdiction|ai act|nis2|rgpd)\b/i,
    points: 7,
    why: "cadre réglementaire",
  },
  {
    re: /\b(panne|outage|indisponibilite|incident majeur|black-?out)\b/i,
    points: 6,
    why: "incident de service",
  },
  {
    re: /\b(milliard|levee de|serie [a-e]\b|acquisition|rachet|introduction en bourse)/i,
    points: 6,
    why: "enjeu financier structurant",
  },
  {
    re: /\b(open[- ]?weights?|poids ouverts|apache 2\.0|modele de frontiere|frontier model)\b/i,
    points: 5,
    why: "publication ou frontière de modèle",
  },
  {
    re: /\b(election|geopolit|souverainet)/i,
    points: 5,
    why: "portée politique",
  },
  {
    re: /\b(licenciement|restructuration|plan social|suppression de postes|suppressions de postes)/i,
    points: 4,
    why: "impact emploi",
  },
  {
    re: /\b(benchmark|classement|sota)\b/i,
    points: 3,
    why: "mesure comparative",
  },
];

const PORTEE_DOWN: PorteeRule[] = [
  {
    re: /\b(game pass|day[- ]one|catalogue)\b/i,
    points: -3,
    why: "actualité de catalogue",
  },
  {
    re: /\b(tutoriel|en quelques lignes|astuce|combo gagnant)\b/i,
    points: -3,
    why: "geste pratique, portée limitée",
  },
];

const GENERIC_ACTION =
  /\b(fort potentiel|opportunite(s)? (de |pour )?(marche|business)?|disrupt|revolutionn|interessant pour|les entreprises peuvent|a surveiller de pres|necessite de se former|sensibilisation)\b/i;

const ACTION_VERB =
  /\b(tester|auditer|migrer|comparer|mesurer|revoir|activer|desactiver|documenter|piloter|chiffrer|attendre|eviter|remplacer|monitorer|mettre a jour|planifier|isoler|revoquer)\b/i;

function fold(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function normalizeUrgence(raw: string | undefined | null): NiveauEditorial {
  const key = fold(raw ?? "").trim();
  return ALIASES[key] ?? "courant";
}

export function palierFromScore(total: number): PalierImportance {
  if (total >= 80) return "critique";
  if (total >= 68) return "majeure";
  if (total >= 56) return "elevee";
  if (total >= 44) return "notable";
  if (total >= 32) return "courante";
  if (total >= 20) return "discrete";
  return "fond";
}

export function isSpecificActionText(text: string): boolean {
  const t = fold(text).trim();
  if (t.length < 40) return false;
  if (GENERIC_ACTION.test(t)) return false;
  return ACTION_VERB.test(t) || /\d/.test(t);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

const FIAB_POINTS: Record<Fiabilite, number> = {
  confirme: 8,
  probable: 5,
  a_surveiller: 1,
};

const FIAB_PORTEE: Record<Fiabilite, number> = {
  confirme: 1,
  probable: 0.92,
  a_surveiller: 0.62,
};

const FIAB_DETAIL: Record<Fiabilite, string> = {
  confirme: "source primaire ou plusieurs récits alignés",
  probable: "source sérieuse, détails encore mobiles",
  a_surveiller: "signal fragile — la portée est minorée",
};

function porteeOf(article: Article, fiab: Fiabilite): {
  value: number;
  detail: string;
} {
  const blob = fold(
    [article.titre, article.resume, ...(article.tags ?? [])].filter(Boolean).join(" ")
  );
  const whys: string[] = [];
  let raw = CAT_BIAS[article.categorie] ?? 0;
  if (raw !== 0) {
    whys.push(
      raw > 0
        ? `catégorie ${article.categorie} (+${raw})`
        : `catégorie ${article.categorie} (${raw})`
    );
  }

  for (const rule of PORTEE_UP) {
    if (rule.re.test(blob)) {
      raw += rule.points;
      whys.push(rule.why);
    }
  }
  for (const rule of PORTEE_DOWN) {
    if (rule.re.test(blob)) {
      raw += rule.points;
      whys.push(rule.why);
    }
  }

  const scaled = raw * FIAB_PORTEE[fiab];
  const value = round1(clamp(scaled, 0, MAX.portee));
  const detail =
    whys.length > 0
      ? whys.slice(0, 3).join(" · ")
      : "pas de marqueur de portée particulier";
  return { value, detail };
}

function substanceOf(article: Article): { value: number; detail: string } {
  let raw = 0;
  const bits: string[] = [];
  const business = article.potentiel_business?.trim() ?? "";
  const perso = article.potentiel_perso?.trim() ?? "";

  if (business && isSpecificActionText(business)) {
    raw += 5;
    bits.push("geste business concret");
  } else if (business) {
    raw += 1;
    bits.push("angle business encore général");
  }

  if (perso && isSpecificActionText(perso)) {
    raw += 3;
    bits.push("test lecteur précis");
  }

  if (article.modele_enjeu?.trim()) {
    raw += 2;
    bits.push("enjeu modèle renseigné");
  }

  const perspective = article.perspective?.trim() ?? "";
  if (perspective.length > 80) {
    raw += 1;
    bits.push("mise en perspective");
  }

  if ((article.contenu?.trim().length ?? 0) > 700) {
    raw += 1;
    bits.push("analyse développée");
  }

  return {
    value: round1(clamp(raw, 0, MAX.substance)),
    detail: bits.length ? bits.slice(0, 3).join(" · ") : "fiche encore légère",
  };
}

function fraicheurOf(article: Article, now: Date): { value: number; detail: string } {
  const then = new Date(article.date).getTime();
  const ageH = Math.max(0, (now.getTime() - then) / 3_600_000);
  if (!Number.isFinite(ageH)) {
    return { value: 0, detail: "date illisible" };
  }
  if (ageH > FRESH_CUTOFF_H) {
    return { value: 0, detail: "au-delà de 14 jours" };
  }
  const value = round1(MAX.fraicheur * Math.pow(0.5, ageH / HALF_LIFE_H));
  let detail: string;
  if (ageH < 1) detail = "vient de sortir";
  else if (ageH < 24) detail = `environ ${Math.round(ageH)} h`;
  else detail = `environ ${Math.round(ageH / 24)} j · demi-vie 30 h`;
  return { value, detail };
}

export function scoreArticle(article: Article, now: Date = new Date()): ArticleScore {
  const niveau = normalizeUrgence(article.urgence);
  const brute = (article.urgence ?? "").trim();
  const fiab = resolveFiabilite(article);
  const editorial = EDITORIAL_POINTS[niveau];
  const portee = porteeOf(article, fiab);
  const fraicheur = fraicheurOf(article, now);
  const substance = substanceOf(article);
  const confiance = FIAB_POINTS[fiab];

  const parts: ScorePart[] = [
    {
      id: "editorial",
      label: "Niveau rédigé",
      value: editorial,
      max: MAX.editorial,
      detail:
        fold(brute) === niveau || !brute
          ? NIVEAU_LABEL[niveau]
          : `« ${brute} » lu comme ${NIVEAU_LABEL[niveau].toLowerCase()}`,
    },
    {
      id: "portee",
      label: "Portée",
      value: portee.value,
      max: MAX.portee,
      detail: portee.detail,
    },
    {
      id: "fraicheur",
      label: "Fraîcheur",
      value: fraicheur.value,
      max: MAX.fraicheur,
      detail: fraicheur.detail,
    },
    {
      id: "substance",
      label: "Substance",
      value: substance.value,
      max: MAX.substance,
      detail: substance.detail,
    },
    {
      id: "confiance",
      label: "Confiance",
      value: confiance,
      max: MAX.confiance,
      detail: FIAB_DETAIL[fiab],
    },
  ];

  const sum = parts.reduce((acc, p) => acc + p.value, 0);
  const total = clamp(Math.round(sum), 0, 100);

  return {
    total,
    palier: palierFromScore(total),
    niveau,
    urgenceBrute: brute || "normal",
    parts,
  };
}

export function scoreAll(
  articles: Article[],
  now: Date = new Date()
): Map<string, ArticleScore> {
  const map = new Map<string, ArticleScore>();
  for (const article of articles) {
    map.set(article.id, scoreArticle(article, now));
  }
  return map;
}

export function compareByScore(
  scores: Map<string, ArticleScore>,
  a: Article,
  b: Article
): number {
  const d = (scores.get(b.id)?.total ?? 0) - (scores.get(a.id)?.total ?? 0);
  if (d !== 0) return d;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
