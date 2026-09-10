export type Urgence = "normal" | "important" | "breaking";

export type Categorie =
  | "IA"
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
  /** Texte long optionnel (détail). */
  contenu?: string;
  /** Point de vue / mise en perspective pour relativiser le sujet. */
  perspective?: string;
  date: string;
  urgence: Urgence;
  tags: string[];
  source_url?: string;
  /** Chemin public optionnel, ex: /vignettes/cat-ia.svg */
  image?: string;
}
