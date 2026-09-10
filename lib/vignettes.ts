import { Categorie } from "./types";

/** Vignettes SVG par défaut (une par catégorie). */
export const CATEGORY_VIGNETTE: Record<Categorie, string> = {
  IA: "/vignettes/cat-ia.svg",
  Web: "/vignettes/cat-web.svg",
  Gaming: "/vignettes/cat-gaming.svg",
  "Hack & Console": "/vignettes/cat-hack.svg",
  "Société & Politique": "/vignettes/cat-societe.svg",
  Dev: "/vignettes/cat-dev.svg",
  Astuces: "/vignettes/cat-astuces.svg",
  Nouveautés: "/vignettes/cat-nouveautes.svg",
};

export function resolveVignette(
  categorie: Categorie,
  image?: string
): string {
  return image && image.length > 0 ? image : CATEGORY_VIGNETTE[categorie];
}
