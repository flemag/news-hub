"use client";

import Link from "next/link";
import { Article } from "@/lib/types";
import {
  categorieAccent,
  formatFullDate,
  formatRelative,
  isWithinLast24h,
} from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";
import { resolveVignette } from "@/lib/vignettes";

function urgenceDisplay(
  article: Article
): { label: string; className: string } | null {
  if (article.urgence === "breaking" && isWithinLast24h(article.date)) {
    return { label: "Dernière minute", className: "text-amber" };
  }
  if (article.urgence === "breaking") {
    return { label: "Important", className: "text-muted" };
  }
  if (article.urgence === "important") {
    return { label: "Important", className: "text-muted" };
  }
  return null;
}

export default function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  const accent = categorieAccent(article.categorie);
  const Icon = CATEGORY_ICON[article.categorie];
  const vignette = resolveVignette(article.categorie, article.image);
  const urg = urgenceDisplay(article);

  /* ——— Carousel 24h : vignette 16:9 (assez large pour le SVG) ——— */
  if (featured) {
    const content = (
      <article
        className="group flex flex-col rounded-sm border border-line bg-panel overflow-hidden h-full border-l-2 hover:border-white/20 transition-colors w-[min(78vw,280px)] md:w-80 shrink-0"
        style={{ borderLeftColor: accent }}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0B1224]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vignette}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1224]/80 to-transparent pointer-events-none"
            aria-hidden
          />
        </div>
        <div className="flex flex-col gap-1.5 p-3 md:p-4 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] md:text-xs">
            <Icon size={12} style={{ color: accent }} aria-hidden />
            <span style={{ color: accent }}>{article.categorie}</span>
            {urg && <span className={urg.className}>{urg.label}</span>}
            <span
              className="text-muted ml-auto"
              title={formatFullDate(article.date)}
            >
              {formatRelative(article.date)}
            </span>
          </div>
          <h3 className="font-display font-medium leading-snug text-ink text-sm md:text-base line-clamp-3">
            <span className="group-hover:underline decoration-1 underline-offset-2">
              {article.titre}
            </span>
          </h3>
          <p className="text-xs text-muted leading-relaxed line-clamp-2 hidden sm:block">
            {article.resume}
          </p>
        </div>
      </article>
    );

    return (
      <Link
        href={`/article/${article.id}`}
        className="text-ink no-underline shrink-0"
        aria-label={`${article.titre} — ${article.categorie}`}
      >
        {content}
      </Link>
    );
  }

  /* ——— Flux : bandeau icône mobile / vignette desktop ——— */
  const content = (
    <article className="group flex flex-row md:flex-col rounded-sm border border-line bg-panel overflow-hidden h-full hover:border-white/20 transition-colors">
      {/* Mobile : pastille couleur + icône (pas de texte SVG coupé) */}
      <div
        className="relative w-14 sm:w-16 shrink-0 flex md:hidden items-center justify-center"
        style={{
          background: `linear-gradient(160deg, ${accent}33 0%, #0B1224 70%)`,
        }}
        aria-hidden
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: accent }}
        />
        <Icon size={22} style={{ color: accent }} strokeWidth={1.75} />
      </div>

      {/* Desktop : vignette 16:9 complète */}
      <div className="relative hidden md:block w-full aspect-[16/9] overflow-hidden bg-[#0B1224]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vignette}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-1 p-3 md:gap-3 md:p-5 flex-1 min-w-0 justify-center">
        <div className="flex items-center gap-1.5 text-[11px] md:text-xs">
          <Icon
            size={12}
            className="hidden md:block"
            style={{ color: accent }}
            aria-hidden
          />
          <span className="truncate" style={{ color: accent }}>
            {article.categorie}
          </span>
          {urg && <span className={urg.className}>{urg.label}</span>}
          <span
            className="text-muted ml-auto shrink-0"
            title={formatFullDate(article.date)}
          >
            {formatRelative(article.date)}
          </span>
        </div>

        <h3 className="font-display font-medium leading-snug text-ink text-sm md:text-base line-clamp-2 md:line-clamp-none">
          <span className="group-hover:underline decoration-1 underline-offset-2">
            {article.titre}
          </span>
        </h3>

        <p className="text-xs md:text-sm text-muted leading-relaxed line-clamp-2 md:line-clamp-3">
          {article.resume}
        </p>

        {article.tags?.length > 0 && (
          <ul className="hidden md:flex flex-wrap gap-2 mt-auto pt-2">
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
    </article>
  );

  return (
    <Link
      href={`/article/${article.id}`}
      className="text-ink no-underline"
      aria-label={`${article.titre} — ${article.categorie}`}
    >
      {content}
    </Link>
  );
}
