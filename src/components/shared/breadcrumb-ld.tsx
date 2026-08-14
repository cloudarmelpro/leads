import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

type Crumb = { name: string; path: string };
type Props = { lang: Locale; items: Crumb[] };

/**
 * Fil d'Ariane en JSON-LD (BreadcrumbList) pour une sous-page. Améliore l'affichage
 * SERP (chemin sous le titre). Le 1er item est toujours l'accueil de la langue.
 * `path` = chemin SANS préfixe de langue (ex. "/a-propos") ; "" = accueil.
 */
export function BreadcrumbLd({ lang, items }: Props) {
  const base = `https://${site.domain}/${lang}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Contenu 100% contrôlé (config + dictionnaires, aucune entrée utilisateur).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
