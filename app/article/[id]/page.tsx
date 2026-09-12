import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  articles,
  getArticleById,
  resolveAnalyse,
  resolvePerspective,
  resolvePotentielBusiness,
  resolvePotentielPerso,
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
  const list = Array.isArray(articles) ? articles : [];
  return list.map((a) => ({ id: a.id }));
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
  const analyse = resolveAnalyse(article);
  const business = resolvePotentielBusiness(article);
  const perso = resolvePotentielPerso(article);
  const hasLongContenu =
    Boolean(article.contenu && article.contenu.trim().length > 40);
  const isModele = article.categorie === "Modèles IA";

  return (
    <main className="min-h-screen bg-base">
      <Header />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-8 md:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-cyan transition-colors mb-8"
        >
          <span aria-hidden>←</span> Retour au flux
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
          <Icon size={15} style={{ color: accent }} aria-hidden />
          <span className="font-medium" style={{ color: accent }}>
            {article.categorie}
          </span>
          {article.urgence !== "normal" && (
            <span
              className={
                article.urgence === "breaking"
                  ? "text-amber font-medium"
                  : "text-ink/80"
              }
            >
              · {urgenceLabel[article.urgence]}
            </span>
          )}
          <span className="text-muted ml-auto text-xs md:text-sm">
            {formatRelative(article.date)} · {formatFullDate(article.date)}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl md:text-[2.5rem] font-bold leading-tight text-ink tracking-tight">
          {article.titre}
        </h1>

        <div className="mt-6 relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-line bg-panel">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vignette} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
        </div>

        <section className="mt-10 prose-signal">
          <h2 className="font-display text-xs uppercase tracking-[0.12em] text-cyan mb-3">
            En bref
          </h2>
          <p className="text-base sm:text-lg text-ink leading-relaxed font-medium">
            {article.resume}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xs uppercase tracking-[0.12em] text-cyan mb-4">
            Analyse
          </h2>

          {hasLongContenu ? (
            <div className="rounded-sm border border-line bg-panel p-5 md:p-6 space-y-4">
              <p className="text-base text-ink leading-[1.75] whitespace-pre-wrap">
                {article.contenu}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-sm border border-line bg-panel p-5 md:p-6">
                <h3 className="text-sm font-medium text-ink mb-2">Contexte</h3>
                <p className="text-base text-ink/95 leading-[1.75]">
                  {analyse.contexte}
                </p>
              </div>

              {analyse.points.length > 0 && (
                <div className="rounded-sm border border-line bg-panel p-5 md:p-6">
                  <h3 className="text-sm font-medium text-ink mb-3">
                    Points à retenir
                  </h3>
                  <ul className="space-y-3">
                    {analyse.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 text-base text-ink/95 leading-relaxed"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: accent }}
                          aria-hidden
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>

        {isModele && article.modele_enjeu && (
          <section className="mt-10 rounded-sm border border-line bg-panel p-5 md:p-6">
            <h2 className="font-display text-xs uppercase tracking-[0.12em] text-cyan mb-3">
              Enjeu du modèle
            </h2>
            <p className="text-base text-ink leading-[1.75] whitespace-pre-wrap">
              {article.modele_enjeu}
            </p>
          </section>
        )}

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-line bg-panel p-5">
            <h2 className="font-display text-xs uppercase tracking-[0.12em] text-cyan mb-3">
              Potentiel business
            </h2>
            <p className="text-sm sm:text-base text-ink/95 leading-[1.7]">{business}</p>
          </div>
          <div className="rounded-sm border border-line bg-panel p-5">
            <h2 className="font-display text-xs uppercase tracking-[0.12em] text-cyan mb-3">
              Conception perso / pro
            </h2>
            <p className="text-sm sm:text-base text-ink/95 leading-[1.7]">{perso}</p>
          </div>
        </section>

        <section
          className="mt-10 rounded-sm border bg-panelAlt p-5 md:p-6"
          style={{
            borderColor: accent + "66",
            borderLeftWidth: 4,
            borderLeftColor: accent,
          }}
        >
          <h2
            className="font-display text-xs uppercase tracking-[0.12em] mb-3"
            style={{ color: accent }}
          >
            Perspective — pour relativiser
          </h2>
          <p className="text-base text-ink leading-[1.75]">{perspective}</p>
        </section>

        {article.tags?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-8">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="text-sm text-ink/80 border border-line rounded-sm px-2.5 py-1 bg-panel"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {article.source_url && (
          <section className="mt-12 pt-8 border-t border-line">
            <h2 className="font-display text-xs uppercase tracking-[0.12em] text-cyan mb-3">
              Source
            </h2>
            <p className="text-base text-ink/90 mb-4 leading-relaxed">
              Synthèse Signal. Pour le détail factuel d&apos;origine :
            </p>
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-sm border border-cyan/40 text-cyan hover:bg-cyan/10 transition-colors"
            >
              Ouvrir la source
              <span aria-hidden>↗</span>
            </a>
            <p className="mt-3 text-xs text-muted break-all">{article.source_url}</p>
          </section>
        )}

        <div className="mt-12 mb-10">
          <Link
            href="/"
            className="text-sm text-muted hover:text-cyan transition-colors"
          >
            ← Retour au flux
          </Link>
        </div>
      </article>
    </main>
  );
}
