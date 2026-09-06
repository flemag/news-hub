import { Categorie } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function isWithinLast24h(dateIso: string, now: Date = new Date()): boolean {
  const then = new Date(dateIso).getTime();
  return now.getTime() - then <= DAY_MS && then <= now.getTime();
}

export function formatRelative(dateIso: string, now: Date = new Date()): string {
  const then = new Date(dateIso).getTime();
  const diffMs = now.getTime() - then;
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffJ = Math.round(diffH / 24);
  return `il y a ${diffJ} j`;
}

export function formatFullDate(dateIso: string): string {
  return new Date(dateIso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Chaque catégorie a sa propre couleur de signal — comme des fréquences
// distinctes sur un même poste de contrôle.
export const CATEGORY_COLOR: Record<Categorie, string> = {
  "IA": "#3DE8FF",
  "Web": "#8B7CFF",
  "Gaming": "#FF4FA3",
  "Hack & Console": "#FF5C5C",
  "Société & Politique": "#FFB347",
  "Dev": "#2FD9A5",
  "Astuces": "#F5D547",
  "Nouveautés": "#4C8DFF",
};

export function categorieAccent(categorie: Categorie): string {
  return CATEGORY_COLOR[categorie] ?? "#3DE8FF";
}

export const CATEGORIES: Categorie[] = [
  "IA",
  "Web",
  "Gaming",
  "Hack & Console",
  "Société & Politique",
  "Dev",
  "Astuces",
  "Nouveautés",
];
