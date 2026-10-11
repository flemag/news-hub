import { allArticles } from "@/data/articles/index";
import { Article, Categorie } from "./types";

export const articles = allArticles as Article[];

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getSortedArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function resolvePerspective(article: Article): string {
  if (article.perspective && article.perspective.trim().length > 0) {
    return article.perspective;
  }

  const defaults: Record<Categorie, string> = {
    IA: "Les annonces IA avancent vite, mais le passage du banc d'essai au déploiement réel reste le vrai filtre. Garder un œil sur les garde-fous, les coûts et les usages concrets évite de sur-interpréter chaque scoop.",
    "Modèles IA": "Un nouveau modèle n'est utile que s'il change un workflow réel (coût, latence, qualité, licence). Comparer au stack déjà en place avant de basculer toute une prod.",
    Web: "Les évolutions web se jugent à l'adoption navigateur et à la simplicité d'intégration.",
    Gaming: "Les dates de sortie structurent le cycle médiatique ; la qualité se vérifie après lancement.",
    "Hack & Console": "Distinguer preuve de concept et menace opérationnelle reste essentiel.",
    "Société & Politique": "Calendrier, arbitrages et effets terrain comptent autant que la déclaration du jour.",
    Dev: "L'important est le gain réel pour l'équipe : DX, perf, maintenance.",
    Astuces: "Une astuce n'a de valeur que si elle reste simple et robuste dans le temps.",
    Nouveautés: "Prix, disponibilité et compromis techniques décident de l'intérêt réel.",
    "Cloud & Infra": "Un changement d'infra se juge sur le coût total, la latence réelle et le lock-in — pas sur le communiqué pricing du jour.",
  };

  return defaults[article.categorie];
}

export function resolvePotentielBusiness(article: Article): string {
  if (article.potentiel_business && article.potentiel_business.trim().length > 0) {
    return article.potentiel_business;
  }
  const byCat: Record<Categorie, string> = {
    IA: "Identifier un process métier borné (support, doc, triage) et mesurer coût + taux d'erreur avant tout déploiement large.",
    "Modèles IA": "Comparer coût/token et qualité sur vos workloads réels ; piloter un remplacement de fournisseur sur un flux non critique.",
    Web: "Chiffrer le gain (conversion, perf, temps de dev) sur une page ou un parcours avant d'adopter.",
    Gaming: "Signal de marché et timing de contenu plus que monétisation directe hors éditeurs.",
    "Hack & Console": "Coût évité : patch prioritaire, revue d'exposition, scénario d'incident documenté.",
    "Société & Politique": "Anticiper la conformité produit avant que la règle ne devienne bloquante.",
    Dev: "Mesurer le ROI sur un sprint pilote : DX, time-to-merge, incidents liés à l'outil.",
    Astuces: "Micro-gain de productivité ; documenter si le geste devient un standard d'équipe.",
    Nouveautés: "Niche early-adopter ou service d'intégration — valider dispo et prix réels.",
    "Cloud & Infra": "Recalculer le TCO (compute, egress, support) et tester un plan de sortie du fournisseur avant d'étendre le contrat.",
  };
  return byCat[article.categorie];
}

export function resolvePotentielPerso(article: Article): string {
  if (article.potentiel_perso && article.potentiel_perso.trim().length > 0) {
    return article.potentiel_perso;
  }
  const byCat: Record<Categorie, string> = {
    IA: "Tester sur un usage personnel borné (notes, code, rédaction) avant d'en faire un standard d'équipe.",
    "Modèles IA": "Comparer sur 3 de vos prompts réels ; noter coût, qualité et garde-fous avant de changer le défaut.",
    Web: "Prototyper sur un side-project pour valider DX et compatibilité.",
    Gaming: "Intérêt loisir / culture ; peu d'impact craft pro sauf si vous développez des jeux.",
    "Hack & Console": "Mettre à jour, auditer vos comptes exposés, activer le MFA partout où c'est encore optionnel.",
    "Société & Politique": "Suivre le calendrier si vous construisez un produit touché par la règle.",
    Dev: "Intégrer dans un workflow perso (CI, snippets) sur un repo non critique.",
    Astuces: "Appliquer tout de suite sur un outil du quotidien si le gain est clair.",
    Nouveautés: "Attendre tests terrain ; utile pour benchmark si vous concevez des produits.",
    "Cloud & Infra": "Sur un projet perso : comparer la facture mensuelle et la complexité ops avant de migrer.",
  };
  return byCat[article.categorie];
}

export function resolveAnalyse(article: Article): {
  contexte: string;
  points: string[];
  vigilance: string;
} {
  if (article.contenu && article.contenu.trim().length > 40) {
    return {
      contexte: article.contenu.trim(),
      points: [],
      vigilance: resolvePerspective(article),
    };
  }

  const r = article.resume;
  const cat = article.categorie;
  const contexte = `${r} Ce signal s'inscrit dans « ${cat} » : impact concret, calendrier, et ce qui reste à confirmer.`;

  const pointsByCat: Record<Categorie, string[]> = {
    IA: [
      "Séparer promesse marketing et capacités mesurables.",
      "Vérifier cadre d'usage (API, cloud, supervision).",
      "Suivre retours terrain : incidents, quotas, latence.",
    ],
    "Modèles IA": [
      "Comparer benchmarks et licence au stack actuel.",
      "Mesurer coût / token et latence sur vos workloads.",
      "Noter les garde-fous et le niveau d'accès (public, gated).",
    ],
    Web: [
      "Support navigateur et rétrocompatibilité.",
      "Gain DX vs complexité ajoutée.",
      "Préférer standards stables.",
    ],
    Gaming: [
      "Croiser date, plateformes, historique éditeur.",
      "Attendre retours post-embargo.",
      "Calibrer l'achat au temps de jeu probable.",
    ],
    "Hack & Console": [
      "Distinguer PoC et exploit public.",
      "Noter le périmètre (version, firmware).",
      "Suivre correctifs éditeur.",
    ],
    "Société & Politique": [
      "Calendrier (débat, vote, application).",
      "Qui décide, qui finance, qui subit.",
      "Comparer aux précédents cycles.",
    ],
    Dev: [
      "Coût de migration et breaking changes.",
      "Écosystème et communauté.",
      "Tester sur un périmètre limité.",
    ],
    Astuces: [
      "Maintenable dans six mois ?",
      "Préférer l'API native.",
      "Documenter le choix.",
    ],
    Nouveautés: [
      "Prix, dispo, alternatives.",
      "Compromis techniques.",
      "Attendre tests d'usage réel.",
    ],
    "Cloud & Infra": [
      "Impact facture (compute, stockage, egress).",
      "Région de disponibilité et SLA régionaux.",
      "Plan de sortie / multi-cloud réaliste ou acceptation du lock-in.",
    ],
  };

  return {
    contexte,
    points: pointsByCat[cat],
    vigilance: resolvePerspective(article),
  };
}
