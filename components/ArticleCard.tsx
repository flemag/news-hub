"use client";

import { Article } from "@/lib/types";
import { categorieAccent, formatFullDate, formatRelative } from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";

const urgenceLabel: Record<Article["urgence"], string> = {
  normal: "",
  important: "Important",
  breaking: "Dernière minute",
};

export default function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  const accent = categorieAccent(article.categorie);
  const Icon = CATEGORY_ICON[article.categorie];

  const content = (
    <article
      className={[
        "group flex flex-col gap-3 rounded-sm border bg-panel p-5 h-full",
        "border-line hover:border-white/20 transition-colors",
        featured ? "md:w-96 shrink-0 border-l-2" : "",
      ].join(" ")}
      style={featured ? { borderLeftColor: accent } : undefined}
    >
      <div className="flex items-center gap-2 text-xs">
        <Icon size={13} style={{ color: accent }} aria-hidden />
        <span style={{ color: accent }}>{article.categorie}</span>
        {article.urgence !== "normal" && (
          <span className={article.urgence === "breaking" ? "text-amber" : "text-muted"}>
            {urgenceLabel[article.urgence]}
          </span>
        )}
        <span className="text-muted ml-auto" title={formatFullDate(article.date)}>
          {formatRelative(article.date)}
        </span>
      </div>

      <h3
        className={[
          "font-display font-medium leading-snug transition-colors text-ink",
          featured ? "text-xl" : "text-base",
        ].join(" ")}
      >
        <span className="group-hover:underline decoration-1 underline-offset-2">
          {article.titre}
        </span>
      </h3>

      <p className="text-sm text-muted leading-relaxed">{article.resume}</p>

      {article.tags?.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-auto pt-2">
          {article.tags.map((tag) => (
            <li key={tag} className="text-xs text-muted border border-line rounded-sm px-2 py-0.5">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );

  if (article.source_url) {
    return (
      <a
        href={article.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className={["text-ink no-underline", featured ? "md:w-96 shrink-0" : ""].join(" ")}
        aria-label={`${article.titre} — ${article.categorie}`}
      >
        {content}
      </a>
    );
  }

  return content;
}