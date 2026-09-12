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
  };

  return defaults[article.categorie];
}

export function resolvePotentielBusiness(article: Article): string {
  if (article.potentiel_business && article.potentiel_business.trim().length > 0) {
    return article.potentiel_business;
  }
  const byCat: Record<Categorie, string> = {
    IA: "Opportunités côté outils métier, automatisation de process et services managés. Attention aux coûts d'inférence et à la dépendance fournisseur.",
    "Modèles IA": "Différenciation produit (meilleure qualité, coût/token, latence), revente d'API, fine-tuning vertical, ou remplacement d'un fournisseur plus cher.",
    Web: "Gain de conversion, perf perçue, ou réduction du temps de dev front — à chiffrer avant d'adopter.",
    Gaming: "Peu de monétisation directe hors éditeurs ; plutôt signal de marché et timing de contenu.",
    "Hack & Console": "Peu de business « opportunité » ; plutôt coût évité (incident, conformité, réputation).",
    "Société & Politique": "Anticiper la conformité et les contraintes produit avant qu'elles ne deviennent obligatoires.",
    Dev: "Productivité équipe, time-to-market, dette technique — ROI mesurable sur un sprint pilote.",
    Astuces: "Micro-gains de productivité ou réduction de friction client ; rarement un business model seul.",
    Nouveautés: "Niche early-adopter, accessoires, contenus, ou services d'intégration autour du produit.",
  };
  return byCat[article.categorie];
}

export function resolvePotentielPerso(article: Article): string {
  if (article.potentiel_perso && article.potentiel_perso.trim().length > 0) {
    return article.potentiel_perso;
  }
  const byCat: Record<Categorie, string> = {
    IA: "Tester sur un usage personnel borné (notes, code, rédaction) avant d'en faire un standard d'équipe.",
    "Modèles IA": "Comparer sur vos prompts réels (code, rédaction, agent). Noter coût, qualité et garde-fous avant d'en faire le défaut.",
    Web: "Prototyper sur un side-project pour valider DX et compatibilité.",
    Gaming: "Intérêt loisir / culture ; peu d'impact craft pro sauf si vous développez des jeux.",
    "Hack & Console": "Mettre à jour, auditer ses propres stacks, documenter une checklist de défense.",
    "Société & Politique": "Suivre le calendrier si vous construisez un produit touché par la règle.",
    Dev: "Intégrer dans un workflow perso (CI, snippets, agents) sur un repo non critique.",
    Astuces: "Appliquer tout de suite sur un outil du quotidien si le gain est clair.",
    Nouveautés: "Attendre tests terrain ; utile pour benchmark concurrentiel si vous concevez des produits.",
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
  };

  return {
    contexte,
    points: pointsByCat[cat],
    vigilance: resolvePerspective(article),
  };
}
