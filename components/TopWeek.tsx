"use client";

import Link from "next/link";
import { Article } from "@/lib/types";
import { categorieAccent, formatRelative } from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";
import FiabiliteBadge from "@/components/FiabiliteBadge";

function badge(urgence: Article["urgence"]): { label: string; cls: string } | null {
  if (urgence === "breaking")
    return { label: "Breaking", cls: "text-amber bg-amber/10 border-amber/30" };
  if (urgence === "important")
    return { label: "Important", cls: "text-cyan bg-cyan/10 border-cyan/25" };
  return null;
}

export default function TopWeek({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="top-semaine-heading">
      <div className="flex items-baseline justify-between gap-3 mb-3 sm:mb-4">
        <h2
          id="top-semaine-heading"
          className="font-display text-sm sm:text-base text-ink tracking-wide"
        >
          Top {articles.length} de la semaine
        </h2>
        <p className="text-[11px] sm:text-xs text-muted">
          Importance (urgence × récence × confiance), pas seulement l&apos;heure
        </p>
      </div>

      <ol className="rounded-sm border border-line bg-panel divide-y divide-line overflow-hidden">
        {articles.map((a, i) => {
          const accent = categorieAccent(a.categorie);
          const Icon = CATEGORY_ICON[a.categorie];
          const b = badge(a.urgence);
          const rank = i + 1;

          return (
            <li key={a.id}>
              <Link
                href={`/article/${a.id}`}
                className="group grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr_auto] gap-x-3 gap-y-1 px-3 sm:px-5 py-3 sm:py-3.5 no-underline text-ink hover:bg-panelAlt/70 transition-colors items-start"
              >
                <span
                  className="font-display text-lg sm:text-2xl font-bold tabular-nums leading-none pt-0.5"
                  style={{ color: rank <= 3 ? accent : "#A8B0CC" }}
                >
                  {rank}
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] mb-1">
                    <Icon size={12} style={{ color: accent }} aria-hidden />
                    <span style={{ color: accent }}>{a.categorie}</span>
                    {b && (
                      <span
                        className={`px-1.5 py-0.5 rounded-sm border text-[10px] ${b.cls}`}
                      >
                        {b.label}
                      </span>
                    )}
                    <FiabiliteBadge article={a} />
                    <span className="text-muted sm:hidden">
                      {formatRelative(a.date)}
                    </span>
                  </span>
                  <span className="block font-display text-sm sm:text-base font-medium leading-snug group-hover:underline decoration-1 underline-offset-2">
                    {a.titre}
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm text-muted leading-relaxed line-clamp-2">
                    {a.resume}
                  </span>
                </span>

                <span className="hidden sm:block text-xs text-muted tabular-nums pt-1 shrink-0">
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
