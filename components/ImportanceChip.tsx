import type { ArticleScore } from "@/lib/score";
import { PALIER_META } from "@/lib/score";

export default function ImportanceChip({
  score,
  compact = false,
}: {
  score: ArticleScore;
  /** Chiffre seul — cartes denses. */
  compact?: boolean;
}) {
  const meta = PALIER_META[score.palier];
  const title = [
    `Indice Signal ${score.total}/100 · ${meta.label}`,
    meta.hint,
    ...score.parts.map((p) => `${p.label} ${p.value}/${p.max} — ${p.detail}`),
  ].join("\n");

  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm border font-medium tabular-nums tracking-wide px-1.5 py-0.5 text-[10px]"
      style={{
        color: meta.color,
        borderColor: meta.color + "55",
        backgroundColor: meta.color + "18",
      }}
      title={title}
    >
      <span>{score.total}</span>
      {!compact && <span>{meta.short}</span>}
    </span>
  );
}
