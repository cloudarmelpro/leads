import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getPosts } from "@/features/blog";
import { defaultLocale, localeHtmlLang, locales, type Locale } from "@/lib/i18n/config";

const BASE = `https://${site.domain}`;

// Les dates sont communes aux deux langues, et chaque article porte ses deux slugs (`slugs`) :
// une seule lecture suffit.
const posts = getPosts(defaultLocale);

/** Même chemin dans les deux langues. */
const same = (path: string): Record<Locale, string> => ({ fr: path, en: path });

// Pages publiques, sans préfixe de langue. "" = accueil.
// `lastmod` = date de dernière modif RÉELLE du contenu (à bumper à la main lors
// d'une vraie mise à jour). Jamais `new Date()` : une date qui change à chaque
// build est un signal trompeur que Google finit par ignorer.
// On n'émet PAS `changefreq`/`priority` : Google les ignore depuis 2020 (bruit).
const PATHS: { paths: Record<Locale, string>; lastmod: string }[] = [
  { paths: same(""), lastmod: "2026-10-02" },
  { paths: same("/a-propos"), lastmod: "2026-10-02" },
  { paths: same("/soumission"), lastmod: "2026-09-30" },
  { paths: same("/services"), lastmod: "2026-10-02" },
  // Le blog n'est listé que s'il a au moins un article (sinon il est `noindex` :
  // ne pas soumettre une URL noindex au sitemap). `lastmod` de la liste = date du
  // plus récent article, puisque c'est ce qui la fait changer.
  ...(posts.length > 0 ? [{ paths: same("/blog"), lastmod: isoDay(posts[0].date) }] : []),
  // Slugs traduits (2026-10-02) : chaque langue a son adresse, déclarée en hreflang.
  ...posts.map((post) => ({ paths: { fr: `/blog/${post.slugs.fr}`, en: `/blog/${post.slugs.en}` }, lastmod: isoDay(post.date) })),
  { paths: same("/confidentialite"), lastmod: "2026-10-02" },
];

/** `lastmod` au format date seule (YYYY-MM-DD), même si l'article porte une heure. */
function isoDay(iso: string): string {
  return iso.slice(0, 10);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ paths, lastmod }) => {
    // hreflang : chaque URL déclare ses équivalents dans l'autre langue + x-default (fr).
    const languages: Record<string, string> = { "x-default": `${BASE}/fr${paths.fr}` };
    for (const l of locales) languages[localeHtmlLang[l]] = `${BASE}/${l}${paths[l]}`;

    return locales.map((l) => ({
      url: `${BASE}/${l}${paths[l]}`,
      lastModified: lastmod,
      alternates: { languages },
    }));
  });
}
