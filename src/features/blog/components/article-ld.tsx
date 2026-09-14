import { site } from "@/config/site";
import type { Post } from "@/features/blog/mock-posts";
import { localeHtmlLang, type Locale } from "@/lib/i18n/config";

type Props = { post: Post; lang: Locale };

/**
 * JSON-LD `BlogPosting` de l'article. On n'y met QUE des champs présents dans les
 * données : pas de `dateModified` tant que la source n'en fournit pas. L'auteur est
 * l'entreprise (Organization) tant qu'aucune personne n'est confirmée ; `publisher`
 * pointe l'entreprise déclarée une seule fois par `<JsonLd>` (layout).
 */
export function ArticleLd({ post, lang }: Props) {
  const base = `https://${site.domain}`;
  const url = `${base}/${lang}/blog/${post.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${base}${post.cover}`,
    datePublished: post.date,
    author:
      post.author.name === site.name
        ? { "@id": `${base}/#business` }
        : { "@type": "Person", name: post.author.name },
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
