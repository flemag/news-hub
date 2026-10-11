"use client";

import Link from "next/link";
import type { ActionSignal } from "@/lib/ranking";

const KIND_STYLE: Record<
  ActionSignal["kind"],
  { border: string; label: string }
> = {
  business: { border: "#2FD9A5", label: "Business" },
  perso: { border: "#5EEBFF", label: "À tester" },
  vigilance: { border: "#FFC45C", label: "Vigilance" },
};

export default function ActionSignals({ signals }: { signals: ActionSignal[] }) {
  if (!signals.length) return null;

  return (
    <section aria-labelledby="signaux-heading">
      <h2
        id="signaux-heading"
        className="font-display text-sm sm:text-base text-ink tracking-wide mb-3 sm:mb-4"
      >
        À retenir pour agir
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
        {signals.map((s) => {
          const st = KIND_STYLE[s.kind];
          return (
            <Link
              key={`${s.kind}-${s.article.id}`}
              href={`/article/${s.article.id}`}
              className="block rounded-sm border border-line bg-panel p-3.5 sm:p-4 no-underline text-ink hover:border-white/20 transition-colors border-l-2"
              style={{ borderLeftColor: st.border }}
            >
              <p
                className="text-[10px] sm:text-[11px] uppercase tracking-wider mb-2"
                style={{ color: st.border }}
              >
                {st.label}
              </p>
              <p className="text-sm leading-relaxed text-ink/95 line-clamp-4">
                {s.text}
              </p>
              <p className="mt-3 text-[11px] text-muted line-clamp-1">
                ← {s.article.titre}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
