export type Urgence = "normal" | "important" | "breaking";

export type Categorie =
  | "IA"
  | "Modèles IA"
  | "Web"
  | "Gaming"
  | "Hack & Console"
  | "Société & Politique"
  | "Dev"
  | "Astuces"
  | "Nouveautés";

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
  /** Angles business / monétisation / opportunité marché liés au sujet. */
  potentiel_business?: string;
  /** Usages ou idées de conception perso / pro (side-project, workflow, craft). */
  potentiel_perso?: string;
  date: string;
  urgence: Urgence;
  tags: string[];
  source_url?: string;
  /** Chemin public optionnel, ex: /vignettes/cat-ia.svg */
  image?: string;
}
