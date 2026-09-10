import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  articles,
  getArticleById,
  resolvePerspective,
} from "@/lib/articles";
import {
  categorieAccent,
  formatFullDate,
  formatRelative,
} from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";
import { resolveVignette } from "@/lib/vignettes";
import Header from "@/components/Header";

const urgenceLabel: Record<string, string> = {
  important: "Important",
  breaking: "Dernière minute",
};

type Props = { params: { id: string } };

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticleById(params.id);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.titre,
    description: article.resume,
  };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleById(params.id);
  if (!article) notFound();

  const accent = categorieAccent(article.categorie);
  const Icon = CATEGORY_ICON[article.categorie];
  const vignette = resolveVignette(article.categorie, article.image);
  const perspective = resolvePerspective(article);

  return (
    <main className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-cyan transition-colors mb-8"
        >
          <span aria-hidden>←</span> Retour au flux
        </Link>

        <div className="flex items-center gap-2 text-xs mb-4">
          <Icon size={14} style={{ color: accent }} aria-hidden />
          <span style={{ color: accent }}>{article.categorie}</span>
          {article.urgence !== "normal" && (
            <span
              className={
                article.urgence === "breaking" ? "text-amber" : "text-muted"
              }
            >
              {urgenceLabel[article.urgence]}
            </span>
          )}
          <span className="text-muted ml-auto" title={formatFullDate(article.date)}>
            {formatRelative(article.date)} · {formatFullDate(article.date)}
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight text-ink">
          {article.titre}
        </h1>

        <div className="mt-6 relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-line bg-[#0B1224]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vignette}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
        </div>

        <section className="mt-8">
          <h2 className="font-display text-sm text-muted mb-3 tracking-wide uppercase">
            Résumé
          </h2>
          <p className="text-base text-ink leading-relaxed">{article.resume}</p>
          {article.contenu && article.contenu.trim().length > 0 && (
            <div className="mt-4 text-base text-ink/90 leading-relaxed whitespace-pre-wrap">
              {article.contenu}
            </div>
          )}
        </section>

        <section
          className="mt-10 rounded-sm border border-line bg-panel p-5 md:p-6"
          style={{ borderLeftWidth: 3, borderLeftColor: accent }}
        >
          <h2 className="font-display text-sm mb-3 tracking-wide uppercase" style={{ color: accent }}>
            Perspective
          </h2>
          <p className="text-sm md:text-base text-ink/90 leading-relaxed">
            {perspective}
          </p>
        </section>

        {article.tags?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-8">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="text-xs text-muted border border-line rounded-sm px-2 py-0.5"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {article.source_url && (
          <section className="mt-12 pt-8 border-t border-line">
            <p className="text-sm text-muted mb-3">
              Pour aller plus loin, consulter la source d'origine :
            </p>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-sm border border-line hover:border-cyan/50 hover:text-cyan transition-colors break-all"
            >
              Ouvrir la source
              <span aria-hidden className="text-cyan">↗</span>
            </a>
            <p className="mt-2 text-xs text-muted break-all opacity-70">
              {article.source_url}
            </p>
          </section>
        )}

        <div className="mt-12 mb-8">
          <Link
            href="/"
            className="text-sm text-muted hover:text-cyan transition-colors"
          >
            ← Retour au flux
          </Link>
        </div>
      </div>
    </main>
  );
}
