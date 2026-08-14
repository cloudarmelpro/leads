import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { getPosts } from "@/features/blog";
import { defaultLocale, localeHtmlLang, locales } from "@/lib/i18n/config";

const BASE = `https://${site.domain}`;

// Pages publiques, sans préfixe de langue. "" = accueil. (Les articles de blog
// seront ajoutés ici quand il y en aura — la liste est vide pour l'instant.)
// `lastmod` = date de dernière modif RÉELLE du contenu (à bumper à la main lors
// d'une vraie mise à jour). Jamais `new Date()` : une date qui change à chaque
// build est un signal trompeur que Google finit par ignorer.
// On n'émet PAS `changefreq`/`priority` : Google les ignore depuis 2020 (bruit).
const PATHS = [
  { path: "", lastmod: "2026-08-13" },
  { path: "/a-propos", lastmod: "2026-08-13" },
  { path: "/contact", lastmod: "2026-08-13" },
  // Le blog n'est listé que s'il a au moins un article (sinon il est `noindex` :
  // ne pas soumettre une URL noindex au sitemap).
  ...(getPosts(defaultLocale).length > 0
    ? [{ path: "/blog", lastmod: "2026-08-13" }]
    : []),
  { path: "/confidentialite", lastmod: "2026-08-12" },
];

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
