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
      <div className="mx-auto max-w-6xl px-6 py-8 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Signal<span className="text-cyan">.</span>
          </h1>
          <p className="mt-2 text-muted max-w-md">
            Ce qu'il ne fallait pas rater dans les dernières 24 heures — IA, web,
            jeu vidéo, hack, société et développement.
          </p>
        </div>
        <div className="text-sm text-muted font-body tabular-nums">
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
