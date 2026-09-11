"use client";

import { Categorie } from "@/lib/types";
import { CATEGORIES, categorieAccent } from "@/lib/dates";
import { CATEGORY_ICON } from "@/lib/icons";

export default function CategoryNav({
  active,
  onChange,
  counts,
}: {
  active: Categorie | "Tout";
  onChange: (c: Categorie | "Tout") => void;
  counts: Record<string, number>;
}) {
  const items: (Categorie | "Tout")[] = ["Tout", ...CATEGORIES];

  return (
    <nav
      className="sticky top-0 z-10 bg-base/90 backdrop-blur border-b border-line"
      aria-label="Filtrer par catégorie"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="flex gap-4 sm:gap-6 overflow-x-auto hscroll -mx-1 px-1">
          {items.map((item) => {
            const isActive = item === active;
            const accent =
              item === "Tout" ? "#5EEBFF" : categorieAccent(item as Categorie);
            const Icon =
              item === "Tout" ? null : CATEGORY_ICON[item as Categorie];
            return (
              <li key={item} className="shrink-0">
                <button
                  onClick={() => onChange(item)}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "relative flex items-center gap-1.5 py-3 sm:py-4 text-xs sm:text-sm transition-colors whitespace-nowrap",
                    isActive ? "text-ink" : "text-muted hover:text-ink",
                  ].join(" ")}
                >
                  {Icon && (
                    <Icon
                      size={13}
                      style={{ color: isActive ? accent : undefined }}
                      aria-hidden
                    />
                  )}
                  {item}
                  {counts[item] ? (
                    <span className="text-[10px] sm:text-xs text-muted">
                      {counts[item]}
                    </span>
                  ) : null}
                  {isActive && (
                    <span
                      className="absolute left-0 right-0 -bottom-px h-[2px]"
                      style={{ backgroundColor: accent }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
