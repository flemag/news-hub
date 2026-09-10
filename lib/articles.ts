import rawArticles from "@/data/articles.json";
import { Article, Categorie } from "./types";

export const articles = rawArticles as Article[];

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
    IA: "Les annonces IA avancent vite, mais le passage du banc d'essai au déploiement réel reste le vrai filtre. Garder un œil sur les garde-fous, les coûts et les usages concrets évite de sur-interpréter chaque scoop.",
    Web: "Les évolutions web se jugent à l'adoption navigateur et à la simplicité d'intégration. Une nouveauté « native » ne change le quotidien que lorsqu'elle est stable, documentée et utilisée en production.",
    Gaming: "Les dates de sortie et bandes-annonces structurent le cycle médiatique, mais la qualité de l'expérience se vérifie après lancement. Mieux vaut croiser les annonces avec le suivi post-release.",
    "Hack & Console": "Une faille ou un exploit signalé n'est pas toujours exploitable grand public. Le niveau de risque dépend du firmware, de la chaîne d'attaque complète et de la réactivité des éditeurs.",
    "Société & Politique": "Les annonces politiques et sociales gagnent à être lues dans la durée : calendrier parlementaire, arbitrages budgétaires et effets concrets sur le terrain comptent autant que la déclaration du jour.",
    Dev: "Les frameworks et outils évoluent en continu. L'important est moins la version que le gain réel pour l'équipe : DX, perf, maintenance et compatibilité avec l'existant.",
    Astuces: "Une astuce n'a de valeur que si elle reste simple à appliquer et robuste dans le temps. Préférer les solutions natives ou largement supportées limite la dette technique.",
    Nouveautés: "Les rumeurs et keynotes fixent un imaginaire produit ; le prix, la disponibilité et les compromis techniques (pliure, autonomie, écosystème) décident de l'intérêt réel.",
  };

  return defaults[article.categorie];
}
