import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getPosts } from "@/features/blog";
import { defaultLocale, localeHtmlLang, locales } from "@/lib/i18n/config";

const BASE = `https://${site.domain}`;

// Les slugs et les dates sont communs aux deux langues : une seule lecture suffit.
const posts = getPosts(defaultLocale);

// Pages publiques, sans préfixe de langue. "" = accueil.
// `lastmod` = date de dernière modif RÉELLE du contenu (à bumper à la main lors
// d'une vraie mise à jour). Jamais `new Date()` : une date qui change à chaque
// build est un signal trompeur que Google finit par ignorer.
// On n'émet PAS `changefreq`/`priority` : Google les ignore depuis 2020 (bruit).
const PATHS = [
  { path: "", lastmod: "2026-08-13" },
  { path: "/a-propos", lastmod: "2026-08-13" },
  { path: "/contact", lastmod: "2026-08-13" },
  { path: "/prix", lastmod: "2026-09-03" },
  // Le blog n'est listé que s'il a au moins un article (sinon il est `noindex` :
  // ne pas soumettre une URL noindex au sitemap). `lastmod` de la liste = date du
  // plus récent article, puisque c'est ce qui la fait changer.
  ...(posts.length > 0 ? [{ path: "/blog", lastmod: isoDay(posts[0].date) }] : []),
  ...posts.map((post) => ({ path: `/blog/${post.slug}`, lastmod: isoDay(post.date) })),
  { path: "/confidentialite", lastmod: "2026-08-12" },
];

/** `lastmod` au format date seule (YYYY-MM-DD), même si l'article porte une heure. */
function isoDay(iso: string): string {
  return iso.slice(0, 10);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ path, lastmod }) => {
    // hreflang : chaque URL déclare ses équivalents dans l'autre langue + x-default (fr).
    const languages: Record<string, string> = { "x-default": `${BASE}/fr${path}` };
    for (const l of locales) languages[localeHtmlLang[l]] = `${BASE}/${l}${path}`;

    return locales.map((l) => ({
      url: `${BASE}/${l}${path}`,
      lastModified: lastmod,
      alternates: { languages },
    }));
  });
}
