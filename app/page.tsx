import { articles } from "@/lib/articles";
import type { Article } from "@/lib/types";
import HomeClient from "./HomeClient";

/**
 * Server Component : charge les articles côté serveur (imports JSON statiques)
 * et les passe au client. Évite fs dans un "use client".
 */
export default function Home() {
  return <HomeClient articles={articles as Article[]} />;
}
