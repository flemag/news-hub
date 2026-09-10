import { allArticles } from "@/data/articles";
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

/** Perspective de repli si l'article n'en a pas encore. */
export function resolvePerspective(article: Article): string {
  if (article.perspective && article.perspective.trim().length > 0) {
    return article.perspective;
  }

  const defaults: Record<Categorie, string> = {
    IA: "Les annonces IA avancent vite, mais le passage du banc d'essai au déploiement réel reste le vrai filtre. Garder un œil sur les garde-fous, les coûts et les usages concrets évite de sur-interpréter chaque scoop. La capacité technique ne vaut que si le contrôle, la traçabilité et le ROI sont au rendez-vous.",
    Web: "Les évolutions web se jugent à l'adoption navigateur et à la simplicité d'intégration. Une nouveauté « native » ne change le quotidien que lorsqu'elle est stable, documentée et utilisée en production sans dette cachée.",
    Gaming: "Les dates de sortie et bandes-annonces structurent le cycle médiatique, mais la qualité de l'expérience se vérifie après lancement. Mieux vaut croiser les annonces avec le suivi post-release, les patchs day-one et le rapport temps de jeu / prix.",
    "Hack & Console": "Une faille ou un exploit signalé n'est pas toujours exploitable grand public. Le niveau de risque dépend du firmware, de la chaîne d'attaque complète et de la réactivité des éditeurs. Distinguer preuve de concept et menace opérationnelle reste essentiel.",
    "Société & Politique": "Les annonces politiques et sociales gagnent à être lues dans la durée : calendrier parlementaire, arbitrages budgétaires et effets concrets sur le terrain comptent autant que la déclaration du jour.",
    Dev: "Les frameworks et outils évoluent en continu. L'important est moins la version que le gain réel pour l'équipe : DX, perf, maintenance et compatibilité avec l'existant. Migrer trop tôt ou trop tard a un coût.",
    Astuces: "Une astuce n'a de valeur que si elle reste simple à appliquer et robuste dans le temps. Préférer les solutions natives ou largement supportées limite la dette technique.",
    Nouveautés: "Les rumeurs et keynotes fixent un imaginaire produit ; le prix, la disponibilité et les compromis techniques (pliure, autonomie, photo, écosystème) décident de l'intérêt réel. Attendre les premiers tests terrain reste le réflexe le plus sûr.",
  };

  return defaults[article.categorie];
}

/** Analyse structurée si contenu vide : développe le résumé sans inventer de faits. */
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

  const contexte = `${r} Ce signal s'inscrit dans la catégorie « ${cat} » et mérite d'être lu au-delà du titre : ce qui compte, c'est l'impact concret, le calendrier, et ce qui reste encore à confirmer.`;

  const pointsByCat: Record<Categorie, string[]> = {
    IA: [
      "Séparer la promesse marketing des capacités mesurables (benchmarks, garde-fous, coûts d'inférence).",
      "Vérifier le cadre d'usage : API, cloud, on-prem, niveau de supervision humaine.",
      "Suivre les retours terrain après annonce : incidents, quotas, latence, conformité.",
    ],
    Web: [
      "Regarder le support navigateur et la rétrocompatibilité avant d'adopter en production.",
      "Évaluer le gain DX réel face à la complexité ajoutée.",
      "Préférer les standards stables aux effets de mode non documentés.",
    ],
    Gaming: [
      "Croiser date annoncée, plateformes et historique de l'éditeur sur les lancements.",
      "Attendre les retours post-embargo sur perf, bugs et contenu day-one.",
      "Calibrer l'achat selon le temps de jeu probable, pas seulement la bande-annonce.",
    ],
    "Hack & Console": [
      "Distinguer faille théorique, preuve de concept et exploit public utilisable.",
      "Noter le périmètre (firmware, modèle, version) avant toute conclusion alarmiste.",
      "Suivre les correctifs éditeur et l'éventuelle publication d'outils.",
    ],
    "Société & Politique": [
      "Repérer le calendrier (débat, vote, application) plutôt que le seul communiqué.",
      "Identifier qui décide, qui finance, et qui subit les effets concrets.",
      "Comparer avec les précédents cycles sur le même dossier.",
    ],
    Dev: [
      "Mesurer le coût de migration (temps, breaking changes, formation).",
      "Vérifier l'écosystème : plugins, hébergement, communauté active.",
      "Tester sur un périmètre limité avant généralisation.",
    ],
    Astuces: [
      "Valider que la solution reste maintenable dans six mois.",
      "Préférer l'API native aux hacks fragiles.",
      "Documenter le choix pour l'équipe.",
    ],
    Nouveautés: [
      "Comparer prix, disponibilité et alternatives déjà sur le marché.",
      "Identifier les compromis techniques (écran, batterie, photo, format).",
      "Attendre les tests d'usage réel avant un achat impulsif post-keynote.",
    ],
  };

  return {
    contexte,
    points: pointsByCat[cat],
    vigilance: resolvePerspective(article),
  };
}
