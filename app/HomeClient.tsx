"use client";

import { useMemo, useState } from "react";
import { Article, Categorie } from "@/lib/types";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import ArticleCard from "@/components/ArticleCard";
import LatestList from "@/components/LatestList";
import TopWeek from "@/components/TopWeek";
import ActionSignals from "@/components/ActionSignals";
import {
  ENJEU_BLOCKS,
  articlesForEnjeu,
  filterLast48h,
  filterLastDays,
  pickActionSignals,
  pickHero,
  pickLatestHeadlines,
  pickTopWeek,
  sortByDateDesc,
} from "@/lib/ranking";
import { categorieAccent } from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";

type Props = {
  articles: Article[];
};

type Mode = "semaine" | "recent" | "categorie";

export default function HomeClient({ articles }: Props) {
  const [mode, setMode] = useState<Mode>("semaine");
  const [active, setActive] = useState<Categorie | "Tout">("Tout");

  const sorted = useMemo(() => sortByDateDesc(articles), [articles]);
  const week = useMemo(() => filterLastDays(sorted, 7), [sorted]);

  const heroArticle = useMemo(() => pickHero(sorted), [sorted]);
  const topWeek = useMemo(() => pickTopWeek(sorted, 10), [sorted]);
  const headlines = useMemo(
    () => pickLatestHeadlines(sorted, 8, heroArticle?.id),
    [sorted, heroArticle]
  );
  const recent48 = useMemo(() => {
    const list = filterLast48h(sorted);
    return list.filter((a) => a.id !== heroArticle?.id).slice(0, 12);
  }, [sorted, heroArticle]);
  const signals = useMemo(() => pickActionSignals(sorted), [sorted]);

  const topIds = useMemo(() => new Set(topWeek.map((a) => a.id)), [topWeek]);

  const enjeuRows = useMemo(() => {
    return ENJEU_BLOCKS.map((block) => ({
      ...block,
      items: articlesForEnjeu(sorted, block.categories, 3, topIds),
    })).filter((b) => b.items.length > 0);
  }, [sorted, topIds]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Tout: week.length };
    for (const a of week) c[a.categorie] = (c[a.categorie] ?? 0) + 1;
    return c;
  }, [week]);

  const categoryFiltered = useMemo(() => {
    const base =
      active === "Tout" ? week : week.filter((a) => a.categorie === active);
    return base.filter((a) => a.id !== heroArticle?.id);
  }, [week, active, heroArticle]);

  const archive = useMemo(
    () => sorted.filter((a) => a.id !== heroArticle?.id).slice(0, 60),
    [sorted, heroArticle]
  );

  return (
    <main className="min-h-screen">
      <Header />
      <Ticker articles={sorted} />

      <div className="border-b border-line bg-base/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex gap-1 sm:gap-2 py-2 overflow-x-auto hscroll">
          {(
            [
              { id: "semaine" as const, label: "Semaine" },
              { id: "recent" as const, label: "Récent (48 h)" },
              { id: "categorie" as const, label: "Catégories" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={[
                "px-3 py-1.5 rounded-sm text-xs sm:text-sm whitespace-nowrap transition-colors border",
                mode === m.id
                  ? "border-cyan/40 bg-cyan/10 text-ink"
                  : "border-transparent text-muted hover:text-ink hover:bg-panel",
              ].join(" ")}
              aria-pressed={mode === m.id}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "categorie" && (
        <CategoryNav active={active} onChange={setActive} counts={counts} />
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {mode === "semaine" && (
          <>
            {heroArticle && (
              <section className="pt-5 sm:pt-8 md:pt-10">
                <div className="grid lg:grid-cols-[1.35fr_1fr] gap-3 sm:gap-4 items-stretch">
                  <Hero article={heroArticle} />
                  <LatestList articles={headlines} />
                </div>
              </section>
            )}

            <section className="pt-8 sm:pt-10 md:pt-12">
              <TopWeek articles={topWeek} />
            </section>

            {recent48.length > 0 && (
              <section className="pt-8 sm:pt-10">
                <h2 className="font-display text-sm sm:text-base text-ink tracking-wide mb-3 sm:mb-4">
                  Sorti récemment — 48 h
                </h2>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto hscroll pb-3 -mx-1 px-1">
                  {recent48.map((a) => (
                    <ArticleCard key={a.id} article={a} featured />
                  ))}
                </div>
              </section>
            )}

            {enjeuRows.length > 0 && (
              <section className="pt-8 sm:pt-10 space-y-8 sm:space-y-10">
                <h2 className="font-display text-sm sm:text-base text-ink tracking-wide">
                  Par enjeu
                </h2>
                {enjeuRows.map((block) => {
                  const accent = categorieAccent(block.categories[0]);
                  const Icon = CATEGORY_ICON[block.categories[0]];
                  return (
                    <div key={block.id}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={14} style={{ color: accent }} aria-hidden />
                        <h3
                          className="font-display text-xs sm:text-sm tracking-wide"
                          style={{ color: accent }}
                        >
                          {block.label}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                        {block.items.map((a) => (
                          <ArticleCard key={a.id} article={a} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            <section className="pt-8 sm:pt-10 md:pt-12">
              <ActionSignals signals={signals} />
            </section>

            <section className="py-8 sm:py-10 md:py-12">
              <h2 className="font-display text-xs sm:text-sm text-muted mb-3 sm:mb-4">
                Archives récentes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                {archive.slice(0, 24).map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          </>
        )}

        {mode === "recent" && (
          <section className="py-6 sm:py-8 md:py-10">
            {heroArticle && (
              <div className="mb-6 sm:mb-8">
                <Hero article={heroArticle} />
              </div>
            )}
            <h2 className="font-display text-xs sm:text-sm text-muted mb-3 sm:mb-4">
              Dernières 48 heures — {recent48.length} article
              {recent48.length > 1 ? "s" : ""}
            </h2>
            {recent48.length === 0 ? (
              <p className="text-muted text-sm py-8">
                Peu de nouveaux signaux sur 48 h — passe en mode{" "}
                <button
                  type="button"
                  className="text-cyan underline"
                  onClick={() => setMode("semaine")}
                >
                  Semaine
                </button>{" "}
                pour le Top 10.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                {recent48.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </section>
        )}

        {mode === "categorie" && (
          <section className="py-6 sm:py-8 md:py-10">
            <h2 className="font-display text-xs sm:text-sm text-muted mb-3 sm:mb-4">
              {active === "Tout" ? "Semaine par catégorie" : active}{" "}
              <span className="text-muted/70">· 7 jours</span>
            </h2>
            {categoryFiltered.length === 0 ? (
              <p className="text-muted py-12 text-sm">
                Rien dans cette catégorie sur 7 jours — reviens un peu plus tard.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                {categoryFiltered.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 text-[11px] sm:text-xs text-muted flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>
            Top semaine scoré · fil 7 jours · blocs par enjeu · signaux
            actionnables. Source en bas de chaque article.
          </span>
          <span>Signal — veille indépendante, sans tracker.</span>
        </div>
      </footer>
    </main>
  );
}
