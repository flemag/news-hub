"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6 md:py-8 flex items-end justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-end gap-[3px] h-5 sm:h-6" aria-hidden>
              <span className="w-[3px] h-2 bg-cyan rounded-sm" />
              <span className="w-[3px] h-3.5 sm:h-4 bg-cyan rounded-sm" />
              <span className="w-[3px] h-5 sm:h-6 bg-cyan rounded-sm" />
              <span className="w-[3px] h-2.5 sm:h-3 bg-magenta rounded-sm" />
            </div>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Signal
            </h1>
          </div>
          <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-muted max-w-md leading-relaxed">
            Ce qu'il ne fallait pas rater dans les dernières 24 heures — IA, web,
            jeu vidéo, hack, société et développement.
          </p>
        </div>
        <div
          className="text-[11px] sm:text-sm text-muted font-body tabular-nums"
          suppressHydrationWarning
        >
          {now
            ? now.toLocaleString("fr-FR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </div>
      </div>
    </header>
  );
}
