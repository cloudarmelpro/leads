import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { site } from "@/config/site";
import { BlogArticle, getAllSlugs, getPost } from "@/features/blog";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";

// Titre + « | Talgasy Web » au plus 60 caractères (limite d'affichage de Google) ;
// au-delà, la marque serait tronquée : le titre de l'article vaut mieux seul.
const SUFFIXE = ` | ${site.name}`;
const TITRE_MAX = 60;

export function generateStaticParams() {
  return locales.flatMap((lang) => getAllSlugs().map((slug) => ({ lang, slug })));
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
    path: `/blog/${slug}`,
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
  if (!post) notFound();

  return (
    <div>
      <BlogArticle post={post} lang={lang} />
    </div>
  );
}
