import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { site } from "@/config/site";
import { BlogArticle, getAllSlugs, getPost } from "@/features/blog";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";

// Au-delà, « — Talgasy Web » ferait dépasser la limite d'affichage de Google et
// la marque serait tronquée : le titre de l'article vaut mieux seul.
const TITRE_MAX_AVEC_MARQUE = 45;

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
    title:
      post.title.length > TITRE_MAX_AVEC_MARQUE ? post.title : `${post.title} — ${site.name}`,
    description: post.excerpt,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const post = getPost(lang, slug);
  if (!post) notFound();

  return <BlogArticle post={post} lang={lang} />;
}
