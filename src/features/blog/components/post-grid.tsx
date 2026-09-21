"use client";

import { useState } from "react";

import { POST_GRID, PostCard } from "@/features/blog/components/post-card";
import type { Post } from "@/features/blog/mock-posts";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  /** Tous les articles, à la une comprise : elle est masquée sans filtre, affichée si sa catégorie est choisie. */
  posts: Post[];
  featuredSlug?: string;
  categories: string[];
  lang: Locale;
  allLabel: string;
  minRead: string;
};

/**
 * Filtres par catégorie (la même liste que les pastilles du hero, « Tous » en tête) et
 * grille de cartes.
 * Filtres à 40px, portés à 44px sur écran tactile.
 */
export function PostGrid({ posts, featuredSlug, categories, lang, allLabel, minRead }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? posts.filter((post) => post.category === active) : posts.filter((post) => post.slug !== featuredSlug);

  const filter = (label: string, value: string | null) => {
    const on = active === value;
    return (
      <button
        key={label}
        type="button"
        aria-pressed={on}
        onClick={() => setActive(value)}
        className={`flex min-h-[40px] cursor-pointer items-center rounded-[8px] px-[16px] text-[13px] leading-[18px] font-normal transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] pointer-coarse:min-h-[44px] ${
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

      <div className={POST_GRID}>
        {shown.map((post) => (
          <PostCard key={post.slug} post={post} lang={lang} minRead={minRead} />
        ))}
      </div>
    </>
  );
}
