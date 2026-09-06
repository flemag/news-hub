"use client";

import { Categorie } from "@/lib/types";
import { CATEGORIES } from "@/lib/dates";

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
    <nav className="sticky top-0 z-10 bg-base/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-6">
        <ul className="flex gap-6 overflow-x-auto hscroll">
          {items.map((item) => {
            const isActive = item === active;
            return (
              <li key={item} className="shrink-0">
                <button
                  onClick={() => onChange(item)}
                  className={[
                    "relative py-4 text-sm transition-colors whitespace-nowrap",
                    isActive ? "text-ink" : "text-muted hover:text-ink",
                  ].join(" ")}
                >
                  {item}
                  {counts[item] ? (
                    <span className="ml-2 text-xs text-muted">
                      {counts[item]}
                    </span>
                  ) : null}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-cyan" />
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
