"use client";

import Link from "next/link";
import { Article } from "@/lib/types";
import type { ArticleScore } from "@/lib/score";
import { categorieAccent, formatRelative } from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";
import FiabiliteBadge from "@/components/FiabiliteBadge";
import ImportanceChip from "@/components/ImportanceChip";

const TITLE = "#F4F6FC";
const RESUME = "#C2C9DC";

export default function TopWeek({
  articles,
  scores,
}: {
  articles: Article[];
  scores: Map<string, ArticleScore>;
}) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="top-semaine-heading">
      <div className="flex items-baseline justify-between gap-3 mb-3 sm:mb-4">
        <h2
          id="top-semaine-heading"
          className="font-display text-sm sm:text-base tracking-wide"
          style={{ color: TITLE }}
        >
          Top {articles.length} de la semaine
        </h2>
        <p className="text-[11px] sm:text-xs max-w-[16rem] sm:max-w-none text-right" style={{ color: RESUME }}>
          Indice 0–100 · portée, fraîcheur, substance, confiance
        </p>
      </div>

      <ol className="rounded-sm border border-line bg-panel divide-y divide-line overflow-hidden">
        {articles.map((a, i) => {
          const accent = categorieAccent(a.categorie);
          const Icon = CATEGORY_ICON[a.categorie];
          const score = scores.get(a.id);
          const rank = i + 1;

          return (
            <li key={a.id}>
              <Link
                href={`/article/${a.id}`}
                className="group grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr_auto] gap-x-3 gap-y-1 px-3 sm:px-5 py-3 sm:py-3.5 no-underline hover:bg-panelAlt transition-colors items-start"
                style={{ color: TITLE }}
              >
                <span
                  className="font-display text-lg sm:text-2xl font-bold tabular-nums leading-none pt-0.5"
                  style={{ color: rank <= 3 ? accent : "#C4CCE0" }}
                >
                  {rank}
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] mb-1">
                    <Icon size={12} style={{ color: accent }} aria-hidden />
                    <span className="font-medium" style={{ color: accent }}>
                      {a.categorie}
                    </span>
                    {score && <ImportanceChip score={score} />}
                    <FiabiliteBadge article={a} />
                    <span className="sm:hidden" style={{ color: RESUME }}>
                      {formatRelative(a.date)}
                    </span>
                  </span>
                  <span
                    className="signal-title block font-display text-sm sm:text-base font-medium leading-snug group-hover:underline decoration-1 underline-offset-2"
                    style={{ color: TITLE }}
                  >
                    {a.titre}
                  </span>
                  <span
                    className="signal-resume mt-1 block text-xs sm:text-sm leading-relaxed line-clamp-2"
                    style={{ color: RESUME }}
                  >
                    {a.resume}
                  </span>
                </span>

                <span
                  className="hidden sm:block text-xs tabular-nums pt-1 shrink-0"
                  style={{ color: RESUME }}
                >
                  {formatRelative(a.date)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
