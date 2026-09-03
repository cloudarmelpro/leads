import { site } from "@/config/site";
import type { Post } from "@/features/blog/mock-posts";
import { localeHtmlLang, type Locale } from "@/lib/i18n/config";

type Props = { post: Post; lang: Locale };

/**
 * JSON-LD `BlogPosting` de l'article. On n'y met QUE des champs présents dans les
 * données : pas d'`image` (les visuels d'article sont des aperçus générés, pas de
 * vraie illustration), pas de `dateModified` tant que la source n'en fournit pas.
 * `publisher` pointe l'entreprise déclarée une seule fois par `<JsonLd>` (layout).
 */
export function ArticleLd({ post, lang }: Props) {
  const base = `https://${site.domain}`;
  const url = `${base}/${lang}/blog/${post.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@id": `${base}/#business` },
    inLanguage: localeHtmlLang[lang],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <script
      type="application/ld+json"
      // Contenu 100% contrôlé (source des articles, aucune entrée utilisateur).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
