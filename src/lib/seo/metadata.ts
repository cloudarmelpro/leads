import type { Metadata } from "next";

import { site } from "@/config/site";
import { localeHtmlLang, type Locale } from "@/lib/i18n/config";

type Args = {
  lang: Locale;
  /** Chemin public SANS préfixe de langue. "" = accueil. Ex. "/a-propos". */
  path?: string;
  /**
   * Chemin propre à chaque langue quand il diffère (article du blogue au slug traduit) ;
   * prime sur `path` pour la canonical et les hreflang.
   */
  paths?: Record<Locale, string>;
  title: string;
  description: string;
  /** "article" pour un billet de blog (og:type + dates), "website" ailleurs. */
  type?: "website" | "article";
  /** Dates ISO — ignorées si `type` n'est pas "article". */
  publishedTime?: string;
  modifiedTime?: string;
  /**
   * Image de partage : par défaut celle de la langue. `null` quand le segment a son propre
   * fichier `opengraph-image` : Next l'annonce alors lui-même, avec la bonne adresse (dans un
   * groupe de routes, elle porte un suffixe, ex. `opengraph-image-1lykkh`).
   */
  image?: string | null;
};

/**
 * Métadonnées d'une page publique bilingue : canonical + hreflang (fr-CA/en-CA/
 * x-default), Open Graph et Twitter Card cohérents. `openGraph.title` N'hérite PAS
 * du `title` de la page dans Next — d'où ce helper, pour que le partage social de
 * chaque page montre SON titre (et pas celui de l'accueil).
 */
export function pageMetadata({
  lang,
  path = "",
  paths = { fr: path, en: path },
  title,
  description,
  type = "website",
  publishedTime,
  modifiedTime,
  image = `/${lang}/opengraph-image`,
}: Args): Metadata {
  const canonical = `/${lang}${paths[lang]}`;

  const openGraphCommon = {
    title,
    description,
    siteName: site.name,
    url: canonical,
    locale: localeHtmlLang[lang],
    // Sans cette clé, l'`openGraph` défini par page ÉCRASE l'image héritée du
    // fichier [lang]/opengraph-image.tsx → sous-pages sans aperçu social. On
    // pointe la route OG par langue (résolue en absolu via metadataBase).
    ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
  };

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "fr-CA": `/fr${paths.fr}`,
        "en-CA": `/en${paths.en}`,
        "x-default": `/fr${paths.fr}`,
      },
    },
    openGraph:
      type === "article"
        ? { ...openGraphCommon, type: "article", publishedTime, modifiedTime }
        : { ...openGraphCommon, type: "website" },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
