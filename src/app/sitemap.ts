import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { localeHtmlLang, locales } from "@/lib/i18n/config";

const BASE = `https://${site.domain}`;

// Pages publiques, sans préfixe de langue. "" = accueil. (Les articles de blog
// seront ajoutés ici quand il y en aura — la liste est vide pour l'instant.)
const PATHS = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/a-propos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PATHS.flatMap(({ path, changeFrequency, priority }) => {
    // hreflang : chaque URL déclare ses équivalents dans l'autre langue + x-default (fr).
    const languages: Record<string, string> = { "x-default": `${BASE}/fr${path}` };
    for (const l of locales) languages[localeHtmlLang[l]] = `${BASE}/${l}${path}`;

    return locales.map((l) => ({
      url: `${BASE}/${l}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
