"use client";

import { useMemo, useState } from "react";
import { Article, Categorie } from "@/lib/types";
import { isWithinLast24h } from "@/lib/dates";
import { articles as rawArticles } from "@/lib/articles";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import CategoryNav from "@/components/CategoryNav";
import ArticleCard from "@/components/ArticleCard";

const articles = rawArticles as Article[];

export default function Home() {
  const [active, setActive] = useState<Categorie | "Tout">("Tout");

  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    []
  );

  /**
   * Hero = vrai breaking des dernières 24h, sinon important < 24h,
   * sinon l'article le plus récent. Évite qu'un vieux « breaking »
   * monopolise la une pendant des jours.
   */
  const heroArticle = useMemo(() => {
    if (!sorted.length) return undefined;
    const breaking24 = sorted.find(
      (a) => a.urgence === "breaking" && isWithinLast24h(a.date)
    );
    if (breaking24) return breaking24;
    const important24 = sorted.find(
      (a) => a.urgence === "important" && isWithinLast24h(a.date)
    );
    if (important24) return important24;
    return sorted[0];
  }, [sorted]);

  const last24h = useMemo(
    () =>
      sorted.filter(
        (a) => isWithinLast24h(a.date) && a.id !== heroArticle?.id
      ),
    [sorted, heroArticle]
  );

  const filtered = useMemo(
    () =>
      (active === "Tout"
        ? sorted
        : sorted.filter((a) => a.categorie === active)
      ).filter((a) => a.id !== heroArticle?.id),
    [sorted, active, heroArticle]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { Tout: sorted.length };
    for (const a of sorted) c[a.categorie] = (c[a.categorie] ?? 0) + 1;
    return c;
  }, [sorted]);

  return (
    <main className="min-h-screen">
      <Header />
      <Ticker articles={sorted} />
      <CategoryNav active={active} onChange={setActive} counts={counts} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {active === "Tout" && heroArticle && (
          <section className="pt-5 sm:pt-8 md:pt-10">
            <Hero article={heroArticle} />
          </section>
        )}

        {active === "Tout" && last24h.length > 0 && (
          <section className="pt-6 sm:pt-8 md:pt-10">
            <h2 className="font-display text-xs sm:text-sm text-muted mb-3 sm:mb-4">
              Dernières 24 heures — {last24h.length} article
              {last24h.length > 1 ? "s" : ""}
            </h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto hscroll pb-3 -mx-1 px-1">
              {last24h.map((a) => (
                <ArticleCard key={a.id} article={a} featured />
              ))}
            </div>
          </section>
        )}

        <section className="py-6 sm:py-8 md:py-10">
          <h2 className="font-display text-xs sm:text-sm text-muted mb-3 sm:mb-4">
            {active === "Tout" ? "Tout le flux" : active}
          </h2>

          {filtered.length === 0 ? (
            <p className="text-muted py-12 text-sm">
              Rien dans cette catégorie pour l'instant — reviens un peu plus
              tard.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
              {filtered.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 text-[11px] sm:text-xs text-muted flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>
            Clique un article pour lire le résumé et la perspective — source en
            bas de page.
          </span>
          <span>Signal — veille indépendante, sans tracker.</span>
        </div>
      </footer>
    </main>
  );
}
