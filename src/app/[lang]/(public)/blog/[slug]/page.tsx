import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBody, PostMeta, getAllSlugs, getPost } from "@/features/blog";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { previewBg } from "@/lib/preview-image";

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

  return {
    title: `${post.title} — LEADS`,
    description: post.excerpt,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: {
        "fr-CA": `/fr/blog/${slug}`,
        "en-CA": `/en/blog/${slug}`,
        "x-default": `/fr/blog/${slug}`,
      },
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const post = getPost(lang, slug);
  if (!post) notFound();

  const dict = await getDictionary(lang);

  return (
    <article className="px-[clamp(16px,4vw,32px)] pt-[clamp(20px,3vw,40px)] pb-[clamp(48px,7vw,96px)]">
      <div className="mx-auto max-w-[760px]">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-texte2 no-underline transition-colors hover:text-encre"
        >
          <ArrowLeft size={15} aria-hidden />
          {dict.blog.backToBlog}
        </Link>

        <h1
          data-reveal="up"
          className="mt-6 font-display text-[clamp(28px,4.4vw,44px)] leading-[1.12] tracking-normal text-balance"
        >
          {post.title}
        </h1>
        <p
          data-reveal="up"
          data-reveal-delay="80"
          className="mt-4 max-w-[60ch] text-base leading-[1.6] text-texte2 text-pretty"
        >
          {post.excerpt}
        </p>

        <div className="mt-8">
          <PostMeta post={post} lang={lang} dict={dict} />
        </div>

        <div
          data-reveal="up"
          data-reveal-delay="120"
          style={previewBg(post.coverSeed, 1000, 620)}
          className="mt-8 aspect-[16/10] overflow-hidden rounded-[22px] bg-menthe"
        />

        <ArticleBody blocks={post.body} />
      </div>
    </article>
  );
}
