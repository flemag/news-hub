"use client";

import { Article } from "@/lib/types";
import { categorieAccent, formatRelative } from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";
import { resolveVignette } from "@/lib/vignettes";

export default function Hero({ article }: { article: Article }) {
  const accent = categorieAccent(article.categorie);
  const Icon = CATEGORY_ICON[article.categorie];
  const vignette = resolveVignette(article.categorie, article.image);

  return (
    <a
      href={article.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden rounded-sm border border-line text-ink no-underline"
      style={{
        background: `radial-gradient(1100px 320px at 15% 0%, ${accent}1f, transparent 60%), #12162A`,
      }}
    >
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-0 items-stretch">
        <div className="relative px-6 py-10 md:px-10 md:py-14 max-w-3xl">
          <div className="flex items-center gap-2 mb-5 text-xs">
            <Icon size={14} style={{ color: accent }} aria-hidden />
            <span style={{ color: accent }}>{article.categorie}</span>
            {article.urgence === "breaking" && (
              <span className="ml-2 px-2 py-0.5 rounded-sm bg-amber/15 text-amber tracking-wide">
                Dernière minute
              </span>
            )}
            <span className="text-muted ml-auto md:ml-4">
              {formatRelative(article.date)}
            </span>
          </div>

          <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight text-ink group-hover:opacity-90 transition-opacity">
            {article.titre}
          </h2>

          <p className="mt-4 text-muted leading-relaxed max-w-xl">
            {article.resume}
          </p>

          {article.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-6">
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
        </div>

        <div className="relative hidden md:block min-h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vignette}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#12162A] via-[#12162A]/40 to-transparent"
            aria-hidden
          />
        </div>
      </div>

      <div
        className="absolute right-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
    </a>
  );
}
