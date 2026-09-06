import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-6xl font-bold text-cyan mb-4">404</p>
        <h1 className="font-display text-xl mb-2">Signal perdu</h1>
        <p className="text-muted mb-8">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-block border border-line px-4 py-2 rounded-sm text-sm hover:border-cyan/50 hover:text-cyan transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
