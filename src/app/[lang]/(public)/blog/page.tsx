import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogIndex, getPosts } from "@/features/blog";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const meta = pageMetadata({
    lang,
    path: "/blog",
    title: dict.blog.meta.title,
    description: dict.blog.meta.description,
  });
  // Tant qu'aucun article n'est publié, on n'indexe pas la liste (évite une page
  // « mince » indexée). L'indexation revient d'elle-même au 1er article.
  if (getPosts(lang).length === 0) {
    meta.robots = { index: false, follow: true };
  }
  return meta;
}

export default async function Page({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <BlogIndex lang={lang} />;
}
