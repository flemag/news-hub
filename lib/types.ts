export type Urgence = "normal" | "important" | "breaking";

/**
 * Niveau de confiance éditorial (pas un score scientifique).
 * - confirme : source primaire ou plusieurs sources sérieuses alignées
 * - probable : source sérieuse unique / détails encore flous
 * - a_surveiller : rumeur, source faible, claim extrême non recoupé
 */
export type Fiabilite = "confirme" | "probable" | "a_surveiller";

export type Categorie =
  | "IA"
  | "Modèles IA"
  | "Web"
  | "Gaming"
  | "Hack & Console"
  | "Société & Politique"
  | "Dev"
  | "Astuces"
  | "Nouveautés"
  | "Cloud & Infra";

export interface Article {
  id: string;
  titre: string;
  categorie: Categorie;
  resume: string;
  /** Texte long optionnel (détail / analyse). */
  contenu?: string;
  /** Point de vue / mise en perspective pour relativiser le sujet. */
  perspective?: string;
  /**
   * Pour la catégorie Modèles IA : enjeux, intérêt, potentiel et
   * petite description du modèle (ce qu'il change pour le lecteur).
   */
  modele_enjeu?: string;
  /**
   * Angle pro : métier touché + geste concret (7–30 j) + coût/risque.
   * Laisser vide plutôt qu'une phrase marketing générique.
   */
  potentiel_business?: string;
  /**
   * Angle lecteur / craft : test concret ou non-geste utile.
   * Laisser vide si rien d'actionnable.
   */
  potentiel_perso?: string;
  date: string;
  urgence: Urgence;
  /**
   * Confiance éditoriale. Optionnel sur les anciens articles
   * (inféré à l'affichage si absent).
   */
  fiabilite?: Fiabilite;
  tags: string[];
  source_url?: string;
  /** Chemin public optionnel, ex: /vignettes/cat-ia.svg */
  image?: string;
}
