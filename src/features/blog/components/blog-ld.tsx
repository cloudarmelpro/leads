import { site } from "@/config/site";
import type { Post } from "@/features/blog/mock-posts";
import { localeHtmlLang, type Locale } from "@/lib/i18n/config";

type Props = { posts: Post[]; lang: Locale; name: string; description: string };

/**
 * JSON-LD `Blog` de la page liste : le blogue et ses articles (titre, adresse, date). Son
 * `@id` est repris par chaque article (`isPartOf`, article-ld.tsx) ; l'éditeur est
 * l'entreprise déclarée une seule fois par `<JsonLd>` (layout).
 */
export function BlogLd({ posts, lang, name, description }: Props) {
  const base = `https://${site.domain}`;
  const url = `${base}/${lang}/blog`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name,
    description,
    inLanguage: localeHtmlLang[lang],
    publisher: { "@id": `${base}/#business` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${url}/${post.slug}`,
      datePublished: post.date,
      image: `${base}${post.cover}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Contenu 100% contrôlé (source des articles, aucune entrée utilisateur).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
