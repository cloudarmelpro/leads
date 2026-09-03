import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import { site } from "@/config/site";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * 404 des URL qui n'appartiennent à AUCUNE route (donc hors `[lang]`, ex.
 * `/quelque-chose.php`). Elle contourne le rendu normal : ni layout, ni en-tête,
 * ni pied de page — d'où le document HTML complet et l'import des styles ici.
 * Requiert `experimental.globalNotFound: true` dans `next.config.ts`.
 * Bilingue côte à côte : aucune locale n'est connue à ce stade.
 */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary(defaultLocale);
  return { title: `${dict.notFound.title} — ${site.name}`, description: dict.notFound.body };
}

export default async function GlobalNotFound() {
  const [fr, en] = await Promise.all([getDictionary("fr"), getDictionary("en")]);

  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="min-h-dvh bg-fond text-encre">
        <main className="mx-auto flex min-h-dvh max-w-[52ch] flex-col justify-center gap-10 px-[clamp(1rem,4vw,3.5rem)] py-16">
          <section>
            <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.15] font-bold text-balance">
              {fr.notFound.title}
            </h1>
            <p className="mt-4 text-base leading-[1.7] text-texte2 text-pretty">{fr.notFound.body}</p>
            {/* `<a>` volontaire : cette page contourne le rendu de l'app, donc le
                routeur client (et `next/link`) n'y est pas monté. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/fr"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-emeraude px-5 py-3 text-sm font-medium text-white no-underline"
            >
              {fr.notFound.cta}
            </a>
          </section>

          <section lang="en" className="border-t border-ligne pt-10">
            <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] leading-[1.2] font-bold text-balance">
              {en.notFound.title}
            </h2>
            <p className="mt-4 text-base leading-[1.7] text-texte2 text-pretty">{en.notFound.body}</p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/en"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-emeraude px-5 py-3 text-sm font-medium text-white no-underline"
            >
              {en.notFound.cta}
            </a>
          </section>
        </main>
      </body>
    </html>
  );
}
