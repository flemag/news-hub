"use client";

import type { Article } from "@/lib/types";
import {
  FIABILITE_META,
  resolveFiabilite,
  shouldShowFiabiliteBadge,
} from "@/lib/fiabilite";

export default function FiabiliteBadge({
  article,
  force = false,
  size = "sm",
}: {
  article: Article;
  /** Afficher aussi « Confirmé » (page article). */
  force?: boolean;
  size?: "sm" | "md";
}) {
  const level = resolveFiabilite(article);
  if (!force && !shouldShowFiabiliteBadge(level)) return null;

  const meta = FIABILITE_META[level];
  const pad = size === "md" ? "px-2 py-0.5 text-[11px]" : "px-1.5 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center rounded-sm border font-medium tracking-wide ${meta.className} ${pad}`}
      title={meta.label}
    >
      {force ? meta.label : meta.short}
    </span>
  );
}
