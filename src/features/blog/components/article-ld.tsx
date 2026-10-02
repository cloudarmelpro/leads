import { site } from "@/config/site";
import type { Post } from "@/features/blog/mock-posts";
import { localeHtmlLang, type Locale } from "@/lib/i18n/config";

type Props = { post: Post; lang: Locale };

/**
 * JSON-LD `BlogPosting` de l'article. On n'y met QUE des champs tirés des données ;
 * `dateModified` reprend la date de publication tant que la source n'a pas de date de
 * révision (le jour où l'admin en aura une, la brancher ici). L'auteur est
 * l'entreprise (Organization) tant qu'aucune personne n'est confirmée ; `publisher`
 * pointe l'entreprise déclarée une seule fois par `<JsonLd>` (layout).
 */
export function ArticleLd({ post, lang }: Props) {
  const base = `https://${site.domain}`;
  const url = `${base}/${lang}/blog/${post.slug}`;

  // Mots réellement affichés dans le corps de l'article.
  const wordCount = post.body
    .flatMap((block) => (block.type === "ul" ? block.items : [block.text]))
    .join(" ")
    .split(/\s+/)
    .filter((word) => /\p{L}/u.test(word)).length;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${base}${post.cover}`,
    datePublished: post.date,
    // Aucune révision depuis la publication : même date.
    dateModified: post.date,
    articleSection: post.category,
    wordCount,
    isPartOf: { "@id": `${base}/${lang}/blog#blog` },
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
