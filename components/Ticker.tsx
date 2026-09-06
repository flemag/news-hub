"use client";

import { Article } from "@/lib/types";
import { categorieAccent } from "@/lib/dates";

export default function Ticker({ articles }: { articles: Article[] }) {
  const items = articles.slice(0, 8);
  if (items.length === 0) return null;

  // Dupliqué une fois pour boucler la marquee sans coupure visible.
  const loop = [...items, ...items];

  return (
    <div className="border-b border-line bg-panel overflow-hidden">
      <div className="flex items-center">
        <span className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-xs text-amber border-r border-line bg-panelAlt">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber" />
          </span>
          En direct
        </span>
        <div className="ticker-track flex items-center gap-8 py-2.5 px-6 whitespace-nowrap">
          {loop.map((a, i) => (
            <span key={`${a.id}-${i}`} className="flex items-center gap-2 text-sm text-muted">
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: categorieAccent(a.categorie) }}
              />
              <span className="text-ink/90">{a.titre}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
