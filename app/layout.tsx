import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const description =
  "IA, Web, Gaming, Hack & Console, Société, Dev — ce qu'il ne fallait pas rater dans les dernières 24 heures.";

export const metadata: Metadata = {
  metadataBase: new URL("https://news-hub.vercel.app"),
  title: {
    default: "Signal — l'essentiel des dernières 24h",
    template: "%s · Signal",
  },
  description,
  themeColor: "#0B0E1A",
  openGraph: {
    title: "Signal — l'essentiel des dernières 24h",
    description,
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal — l'essentiel des dernières 24h",
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="bg-base text-ink font-body antialiased">
        {children}
      </body>
    </html>
  );
}
