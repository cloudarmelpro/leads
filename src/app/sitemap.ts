import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { localeHtmlLang, locales } from "@/lib/i18n/config";

const BASE = `https://${site.domain}`;

// Pages publiques, sans préfixe de langue. "" = accueil. (Les articles de blog
// seront ajoutés ici quand il y en aura — la liste est vide pour l'instant.)
// `lastmod` = date de dernière modif RÉELLE du contenu (à bumper à la main lors
// d'une vraie mise à jour). Jamais `new Date()` : une date qui change à chaque
// build est un signal trompeur que Google finit par ignorer.
const PATHS = [
  { path: "", changeFrequency: "weekly", priority: 1, lastmod: "2026-08-13" },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.8, lastmod: "2026-08-13" },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9, lastmod: "2026-08-13" },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7, lastmod: "2026-08-13" },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.3, lastmod: "2026-08-12" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ path, changeFrequency, priority, lastmod }) => {
    // hreflang : chaque URL déclare ses équivalents dans l'autre langue + x-default (fr).
    const languages: Record<string, string> = { "x-default": `${BASE}/fr${path}` };
    for (const l of locales) languages[localeHtmlLang[l]] = `${BASE}/${l}${path}`;

    return locales.map((l) => ({
      url: `${BASE}/${l}${path}`,
      lastModified: lastmod,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
