import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { BlogFeatured, PostCard, getPosts } from "@/features/blog";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    title: dict.blog.meta.title,
    description: dict.blog.meta.description,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { "fr-CA": "/fr/blog", "en-CA": "/en/blog", "x-default": "/fr/blog" },
    },
  };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const posts = getPosts(lang);
  const [featured, ...rest] = posts;

  return (
    <div className="px-[clamp(16px,4vw,32px)] pt-[clamp(24px,4vw,48px)] pb-[clamp(48px,7vw,96px)]">
      <div className="mx-auto max-w-290">
        <p data-reveal="up" className="mb-4">
          <span className="rounded-full bg-surface px-3.75 py-1.75 text-[13px] font-semibold text-texte2">
            {dict.blog.kicker}
          </span>
        </p>
        {/* Titre : glisse depuis la droite, comme les titres de l'accueil. */}
        <div
          data-reveal-child="right"
          style={
            {
              "--reveal-delay": "80ms",
              "--reveal-dist": "40vw",
              "--reveal-dur": "3400ms",
            } as CSSProperties
          }
          className="w-full"
        >
          <h1 className="max-w-[18ch] font-display text-[clamp(30px,5vw,52px)] leading-[1.1] tracking-normal text-balance">
            {dict.blog.title}
          </h1>
        </div>
        <p
          data-reveal="left"
          data-reveal-delay="160"
          className="mt-4 max-w-[52ch] text-base leading-[1.6] text-texte2 text-pretty"
        >
          {dict.blog.subtitle}
        </p>

        {/* Aucun article publié pour l'instant : état « à venir » (le placeholder a
            été retiré). Dès qu'un article existe, le featured + la liste reprennent. */}
        {posts.length === 0 && (
          <div
            data-reveal="up"
            className="mt-12 rounded-3xl bg-surface p-[clamp(28px,5vw,56px)] text-center"
          >
            <p className="mx-auto max-w-[24ch] font-display text-[clamp(22px,3vw,30px)] leading-[1.2] text-balance">
              {dict.blog.emptyTitle}
            </p>
            <p className="mx-auto mt-3 max-w-[48ch] text-base leading-[1.6] text-texte2 text-pretty">
              {dict.blog.emptyBody}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-emeraude px-5 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-emeraude/90"
            >
              {dict.nav.contact}
            </Link>
          </div>
        )}

        {featured && (
          <div className="mt-10">
            <BlogFeatured post={featured} lang={lang} dict={dict} />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-16">
            {/* Titre + sous-titre de la liste, comme les autres sections. */}
            <div
              data-reveal-child="right"
              style={
                {
                  "--reveal-delay": "80ms",
                  "--reveal-dist": "40vw",
                  "--reveal-dur": "3400ms",
                } as CSSProperties
              }
              className="w-full"
            >
              <h2 className="font-display text-[clamp(24px,3.4vw,38px)] leading-[1.1] tracking-normal text-balance">
                {dict.blog.moreArticles}
              </h2>
            </div>
            <p
              data-reveal="left"
              data-reveal-delay="160"
              className="mt-3 max-w-[52ch] text-base leading-[1.6] text-texte2 text-pretty"
            >
              {dict.blog.listSubtitle}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => {
              // Sens d'entrée selon la colonne (grille 3 colonnes), comme l'accueil.
              const col = index % 3;
              const dir = col === 0 ? "left" : col === 2 ? "right" : "up";
              return (
                <PostCard
                  key={post.slug}
                  post={post}
                  lang={lang}
                  dict={dict}
                  revealDelay={index * 80}
                  revealDir={dir}
                  revealDist={col === 1 ? "0px" : "120px"}
                />
              );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
