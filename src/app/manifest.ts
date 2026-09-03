import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * Manifeste d'application web (servi sur /manifest.webmanifest). `start_url` doit
 * porter la locale : la racine `/` est redirigée en 308 par le proxy, et une
 * redirection au lancement casse la détection « installée » sur certains
 * navigateurs. Les icônes sont les fichiers de convention de `src/app/`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    start_url: `/${defaultLocale}`,
    display: "standalone",
    theme_color: "#177e4f",
    background_color: "#ffffff",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
