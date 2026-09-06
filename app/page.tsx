"use client";

import { useMemo, useState } from "react";
import rawArticles from "@/data/articles.json";
import { Article, Categorie } from "@/lib/types";
import { isWithinLast24h } from "@/lib/dates";
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

  const heroArticle = sorted.find((a) => a.urgence === "breaking") ?? sorted[0];

  const last24h = useMemo(
    () => sorted.filter((a) => isWithinLast24h(a.date) && a.id !== heroArticle?.id),
    [sorted, heroArticle]
  );

  const filtered = useMemo(
    () =>
      (active === "Tout" ? sorted : sorted.filter((a) => a.categorie === active)).filter(
        (a) => a.id !== heroArticle?.id
      ),
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

      <div className="mx-auto max-w-6xl px-6">
        {active === "Tout" && heroArticle && (
          <section className="pt-10">
            <Hero article={heroArticle} />
          </section>
        )}

        {active === "Tout" && last24h.length > 0 && (
          <section className="pt-10">
            <h2 className="font-display text-sm text-muted mb-4">
              Dernières 24 heures — {last24h.length} article
              {last24h.length > 1 ? "s" : ""}
            </h2>
            <div className="flex gap-4 overflow-x-auto hscroll pb-4 -mx-1 px-1">
              {last24h.map((a) => (
                <ArticleCard key={a.id} article={a} featured />
              ))}
            </div>
          </section>
        )}

        <section className="py-10">
          <h2 className="font-display text-sm text-muted mb-4">
            {active === "Tout" ? "Tout le flux" : active}
          </h2>

          {filtered.length === 0 ? (
            <p className="text-muted py-12">
              Rien dans cette catégorie pour l'instant — reviens un peu plus tard.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>
            Mis à jour à chaque publication — les articles sont ajoutés dans{" "}
            <code className="text-ink/80">data/articles.json</code>.
          </span>
          <span>Signal — veille indépendante, sans tracker.</span>
        </div>
      </footer>
    </main>
  );
}
