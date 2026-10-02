import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { site } from "@/config/site";
import { BlogArticle, getAllSlugs, getPost, resolveSlug } from "@/features/blog";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";

// Titre + « | Talgasy Web » au plus 60 caractères (limite d'affichage de Google) ;
// au-delà, la marque serait tronquée : le titre de l'article vaut mieux seul.
const SUFFIXE = ` | ${site.name}`;
const TITRE_MAX = 60;

export function generateStaticParams() {
  return locales.flatMap((lang) => getAllSlugs(lang).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const post = getPost(lang, slug);
  if (!post) return {};

  return pageMetadata({
    lang,
    paths: { fr: `/blog/${post.slugs.fr}`, en: `/blog/${post.slugs.en}` },
    title: post.title.length + SUFFIXE.length > TITRE_MAX ? post.title : `${post.title}${SUFFIXE}`,
    description: post.excerpt,
    type: "article",
    publishedTime: post.date,
    // Contenu inchangé depuis la publication : même date (champ attendu par les robots).
    modifiedTime: post.date,
    // Image de partage de l'article : fichier opengraph-image.tsx du segment.
    image: null,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const post = getPost(lang, slug);
  if (!post) {
    // Slug de l'autre langue (anciennes adresses anglaises en français, sélecteur de langue) :
    // redirection définitive (308) vers l'adresse de cette langue.
    const other = resolveSlug(lang, slug);
    if (other) permanentRedirect(`/${lang}/blog/${other}`);
    notFound();
  }

  return (
    <div>
      <BlogArticle post={post} lang={lang} />
    </div>
  );
}
