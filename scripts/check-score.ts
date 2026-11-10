import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Article } from "../lib/types";
import {
  normalizeUrgence,
  scoreArticle,
} from "../lib/score";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const base: Article = {
  id: "t",
  titre: "Note de service interne",
  categorie: "Dev",
  resume: "Une note interne sans enjeu immédiat pour les équipes.",
  date: "2026-11-10T08:00:00Z",
  urgence: "normal",
  tags: ["dev"],
  contenu: "x".repeat(800),
  perspective: "y".repeat(90),
  potentiel_business: "Les entreprises peuvent regarder ça plus tard sans geste précis.",
  potentiel_perso: "Intéressant pour les passionnés du sujet en général.",
  source_url: "https://example.com/note",
};

assert(normalizeUrgence("haute") === "majeur", "haute → majeur");
assert(normalizeUrgence("HIGH") === "majeur", "HIGH → majeur");
assert(normalizeUrgence("normale") === "courant", "normale → courant");
assert(normalizeUrgence("low") === "mineur", "low → mineur");
assert(normalizeUrgence("moyenne") === "notable", "moyenne → notable");
assert(normalizeUrgence("breaking") === "breaking", "breaking");
assert(normalizeUrgence("nawak") === "courant", "inconnu → courant");

const now = new Date("2026-11-10T14:00:00Z");
const routine = scoreArticle(base, now);
const alerte = scoreArticle(
  {
    ...base,
    id: "sec",
    titre: "Faille zero-day activement exploitée, correctif de sécurité publié",
    categorie: "Hack & Console",
    resume: "Une vulnérabilité CVE-2026-1000 permet une compromission. Il faut patcher.",
    urgence: "breaking",
    tags: ["sécurité"],
    potentiel_business: "Isoler les instances exposées et mesurer le périmètre avant vendredi.",
    potentiel_perso: "Mettre à jour les hôtes personnels exposés sur ce service ce soir.",
    source_url: "https://nvd.nist.gov/vuln/detail/CVE-2026-1000",
    fiabilite: "confirme",
  },
  now
);
const rumeur = scoreArticle(
  {
    ...base,
    id: "rum",
    titre: "Rumeur : un laboratoire aurait un modèle secret",
    resume: "Selon des sources proches, une annonce pourrait avoir lieu. Non confirmé.",
    urgence: "breaking",
    tags: ["ia"],
    fiabilite: "a_surveiller",
  },
  now
);

assert(alerte.total > routine.total + 15, `alerte ${alerte.total} devrait dominer routine ${routine.total}`);
assert(alerte.total > rumeur.total, `confirmé ${alerte.total} > rumeur ${rumeur.total}`);
assert(alerte.palier === "critique" || alerte.palier === "majeure", alerte.palier);
assert(routine.total >= 0 && routine.total <= 100, "bornes");
assert(alerte.parts.every((p) => p.value <= p.max + 0.01), "plafonds");

async function main() {
  const dir = path.join(root, "data/articles");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));
  const articles: Article[] = [];
  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(dir, file), "utf8"));
    const list = Array.isArray(raw) ? raw : [raw];
    for (const item of list) articles.push(item as Article);
  }

  const week = articles.filter((a) => {
    const t = new Date(a.date).getTime();
    return now.getTime() - t <= 7 * 86400000 && t <= now.getTime();
  });
  const ranked = [...week].sort(
    (a, b) => scoreArticle(b, now).total - scoreArticle(a, now).total
  );

  console.log(`corpus ${articles.length} · semaine ${week.length}`);
  console.log("--- top 12 semaine ---");
  for (const a of ranked.slice(0, 12)) {
    const s = scoreArticle(a, now);
    console.log(
      String(s.total).padStart(3),
      s.palier.padEnd(9),
      s.niveau.padEnd(9),
      (a.urgence || "").padEnd(10),
      a.categorie.slice(0, 16).padEnd(16),
      a.titre.slice(0, 72)
    );
  }

  const reg = ranked.find((a) => a.id === "art-2026-11-10-01");
  const games = ranked.find((a) => a.id === "art-2026-11-10-05");
  if (reg && games) {
    const rs = scoreArticle(reg, now).total;
    const gs = scoreArticle(games, now).total;
    assert(rs > gs, `régulation ${rs} devrait passer devant game pass ${gs}`);
    console.log(`ok régulation ${rs} > game pass ${gs}`);
  }

  console.log("check-score ok");
}

main();
