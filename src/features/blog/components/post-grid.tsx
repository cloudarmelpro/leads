"use client";

import { useState } from "react";

import { POST_GRID, PostCard } from "@/features/blog/components/post-card";
import type { Post } from "@/features/blog/mock-posts";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { posts: Post[]; lang: Locale; dict: Pick<Dictionary, "blog"> };

/**
 * Liste des articles (maquette Blog, 2026-09-30) : à gauche le compte d'articles affichés,
 * le titre et l'intro ; à droite les filtres par catégorie (« Tous » en tête) ; puis la
 * grille de cartes. Filtres à 40px, portés à 44px sur écran tactile.
 */
export function PostGrid({ posts, lang, dict }: Props) {
  const t = dict.blog;
  const [active, setActive] = useState<string | null>(null);
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const shown = active ? posts.filter((post) => post.category === active) : posts;

  const filter = (label: string, value: string | null) => {
    const on = active === value;
    return (
      <button
        key={label}
        type="button"
        aria-pressed={on}
        onClick={() => setActive(value)}
        className={`flex min-h-[40px] cursor-pointer items-center rounded-[8px] border px-[16px] text-[13px] leading-[18px] font-medium whitespace-nowrap transition-colors duration-200 hover:border-vert pointer-coarse:min-h-[44px] ${
          on ? "border-bouton bg-bouton text-sur-bouton" : "border-contour bg-transparent text-texte-bascule dark:border-[rgba(255,255,255,0.22)]"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-[24px]">
        <div className="flex flex-col items-start gap-[14px]">
          <span className="text-[15px] leading-[20px] font-medium text-texte-bascule">
            {shown.length === 1 ? t.listKickerOne : t.listKicker.replace("{n}", String(shown.length))}
          </span>
          <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-balance">{t.listTitle}</h2>
          <p className="m-[0px] max-w-[560px] text-[15px] leading-[24px] font-normal text-texte2 text-pretty">{t.listIntro}</p>
        </div>
        <div className="flex flex-wrap gap-[8px]">
          {filter(t.filterAll, null)}
          {categories.map((category) => filter(category, category))}
        </div>
      </div>

      <div className={POST_GRID}>
        {shown.map((post) => (
          <PostCard key={post.slug} post={post} lang={lang} read={t.read} min={t.min} />
        ))}
      </div>
    </>
  );
}
