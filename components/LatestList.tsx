"use client";

import Link from "next/link";
import { Article } from "@/lib/types";
import { categorieAccent, formatRelative } from "@/lib/dates";

const TITLE = "#F4F6FC";
const RESUME = "#C2C9DC";

export default function LatestList({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <aside className="rounded-sm border border-line bg-panel overflow-hidden h-full flex flex-col">
      <div className="px-3 sm:px-4 py-2.5 border-b border-line flex items-center justify-between gap-2">
        <h2
          className="font-display text-[11px] sm:text-xs tracking-wide uppercase"
          style={{ color: RESUME }}
        >
          Fil rapide
        </h2>
        <span className="text-[10px]" style={{ color: RESUME }}>
          7 jours
        </span>
      </div>
      <ol className="divide-y divide-line flex-1">
        {articles.map((a, i) => {
          const accent = categorieAccent(a.categorie);
          return (
            <li key={a.id}>
              <Link
                href={`/article/${a.id}`}
                className="group flex gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 no-underline hover:bg-panelAlt transition-colors"
                style={{ color: TITLE }}
              >
                <span
                  className="text-[11px] tabular-nums w-4 shrink-0 pt-0.5"
                  style={{ color: RESUME }}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className="signal-title block text-[13px] sm:text-sm leading-snug font-medium group-hover:underline decoration-1 underline-offset-2 line-clamp-2"
                    style={{ color: TITLE }}
                  >
                    {a.titre}
                  </span>
                  <span
                    className="mt-1 flex items-center gap-2 text-[10px] sm:text-[11px]"
                    style={{ color: RESUME }}
                  >
                    <span style={{ color: accent }}>{a.categorie}</span>
                    <span aria-hidden>·</span>
                    <span>{formatRelative(a.date)}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
