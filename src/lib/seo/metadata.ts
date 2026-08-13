import type { Metadata } from "next";

import { site } from "@/config/site";
import { localeHtmlLang, type Locale } from "@/lib/i18n/config";

type Args = {
  lang: Locale;
  /** Chemin public SANS préfixe de langue. "" = accueil. Ex. "/a-propos". */
  path?: string;
  title: string;
  description: string;
};

/**
 * Métadonnées d'une page publique bilingue : canonical + hreflang (fr-CA/en-CA/
 * x-default), Open Graph et Twitter Card cohérents. `openGraph.title` N'hérite PAS
 * du `title` de la page dans Next — d'où ce helper, pour que le partage social de
 * chaque page montre SON titre (et pas celui de l'accueil).
 */
export function pageMetadata({ lang, path = "", title, description }: Args): Metadata {
  const canonical = `/${lang}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "fr-CA": `/fr${path}`,
        "en-CA": `/en${path}`,
        "x-default": `/fr${path}`,
      },
    },
    openGraph: {
      title,
      description,
      siteName: site.name,
      url: canonical,
      locale: localeHtmlLang[lang],
      type: "website",
      // Sans cette clé, l'`openGraph` défini par page ÉCRASE l'image héritée du
      // fichier [lang]/opengraph-image.tsx → sous-pages sans aperçu social. On
      // pointe la route OG par langue (résolue en absolu via metadataBase).
      images: [`/${lang}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/${lang}/opengraph-image`],
    },
  };
}
