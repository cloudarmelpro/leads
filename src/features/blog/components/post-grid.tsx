"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { coverSrc, type Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  posts: Post[];
  lang: Locale;
  allLabel: string;
  minRead: string;
};

const SHADE = "linear-gradient(180deg, rgba(1,24,35,0.05) 0%, rgba(1,24,35,0) 60%, rgba(1,24,35,0.45) 100%)";

/**
 * Filtres par catégorie (dérivés des articles, « Tous » en tête) et grille de cartes
 * sans fond : seule la couverture 16:9 porte le rayon, le texte s'aligne sur son bord.
 * Trois colonnes, deux sous 980px, une sous 640px ; 24px entre colonnes, 44px entre
 * rangées. Filtres à 40px, portés à 44px sur écran tactile.
 */
export function PostGrid({ posts, lang, allLabel, minRead }: Props) {
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? posts.filter((post) => post.category === active) : posts;

  const filter = (label: string, value: string | null) => {
    const on = active === value;
    return (
      <button
        key={label}
        type="button"
        aria-pressed={on}
        onClick={() => setActive(value)}
        className={`flex min-h-[40px] cursor-pointer items-center rounded-[9px] px-[16px] text-[13px] leading-[18px] font-medium transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] pointer-coarse:min-h-[44px] ${
          on ? "bg-vert text-sur-vert" : "bg-surface text-texte-bascule hover:bg-surface-2"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-wrap gap-[8px]">
        {filter(allLabel, null)}
        {categories.map((category) => filter(category, category))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-x-[24px] gap-y-[44px] min-[640px]:grid-cols-[repeat(2,minmax(0,1fr))] min-[980px]:grid-cols-[repeat(3,minmax(0,1fr))]">
        {shown.map((post) => (
          <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="group flex flex-col bg-transparent no-underline">
            <span className="relative block aspect-video shrink-0 overflow-hidden rounded-[24px] bg-surface">
              <Image
                src={coverSrc(post)}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 350px"
                className="object-cover opacity-90 transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <span aria-hidden className="absolute inset-[0px] block" style={{ background: SHADE }} />
            </span>
            <span className="flex flex-1 flex-col gap-[11px] pt-[18px]">
              <span className="text-[12px] leading-[16px] font-medium tracking-[0.08em] text-vert uppercase">{post.category}</span>
              <span className="text-[17px] leading-[24px] font-medium text-encre text-pretty">{post.title}</span>
              <span className="text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{post.excerpt}</span>
              <span className="mt-auto flex flex-wrap items-center gap-[8px] pt-[4px] text-[13px] leading-[20px] font-normal text-texte2">
                <span>{formatDate(post.date, lang)}</span>
                <span aria-hidden className="text-ligne dark:text-[#012a3c]">·</span>
                <span>
                  {post.readMinutes} {minRead}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
