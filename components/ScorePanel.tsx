import type { ArticleScore } from "@/lib/score";
import { PALIER_META } from "@/lib/score";

export default function ScorePanel({ score }: { score: ArticleScore }) {
  const meta = PALIER_META[score.palier];

  return (
    <section
      className="mt-8 rounded-sm border bg-panel p-4 sm:p-5"
      style={{ borderColor: meta.color + "44" }}
      aria-label="Indice d'importance"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="font-display text-xs uppercase tracking-[0.12em] text-cyan">
          Indice Signal
        </h2>
        <p className="text-sm font-medium tabular-nums" style={{ color: meta.color }}>
          {score.total}
          <span className="text-muted font-normal"> / 100</span>
          <span className="mx-1.5 text-muted">·</span>
          {meta.label}
        </p>
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#C2C9DC" }}>
        {meta.hint} L’indice additionne cinq critères plafonnés — il explique le
        classement, il ne remplace pas la lecture.
      </p>
      <ul className="space-y-2.5">
        {score.parts.map((part) => {
          const pct = part.max === 0 ? 0 : Math.round((part.value / part.max) * 100);
          return (
            <li key={part.id}>
              <div className="flex items-baseline justify-between gap-3 text-[11px] sm:text-xs">
                <span className="text-ink/90">{part.label}</span>
                <span className="tabular-nums text-muted shrink-0">
                  {part.value}
                  <span className="text-muted/70">/{part.max}</span>
                </span>
              </div>
              <div
                className="mt-1 h-1 rounded-full bg-line/80 overflow-hidden"
                role="presentation"
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: meta.color }}
                />
              </div>
              <p className="mt-1 text-[11px] leading-snug" style={{ color: "#A8B0CC" }}>
                {part.detail}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
