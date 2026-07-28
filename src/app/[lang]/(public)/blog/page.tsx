import type { Metadata } from "next";
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
      <div className="mx-auto max-w-[1160px]">
        <p data-reveal="up" className="mb-4">
          <span className="rounded-full bg-white px-3.75 py-1.75 text-[13px] font-semibold text-texte2 shadow-[0_4px_10px_-6px_rgba(15,29,23,.2)]">
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

        {featured && (
          <div className="mt-10">
            <BlogFeatured post={featured} lang={lang} dict={dict} />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
        )}
      </div>
    </div>
  );
}
