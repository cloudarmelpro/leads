import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Dictionary };

/**
 * Article à la une : panneau plein (fond gris en clair, surface en sombre, sans filet),
 * couverture 16:10 à gauche et texte à droite dès 860px ; cliquable en entier.
 */
export function FeaturedCard({ post, lang, dict }: Props) {
  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="group grid grid-cols-[minmax(0,1fr)] gap-[clamp(16px,2vw,28px)] rounded-[24px] bg-surface-2 p-[clamp(12px,1.6vw,20px)] no-underline min-[860px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] min-[860px]:items-center dark:bg-surface"
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[16px] bg-fond">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 860px) 100vw, 760px"
          className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03]"
        />
      </span>
      <span className="flex flex-col gap-[12px] px-[clamp(4px,1vw,16px)] py-[clamp(4px,1vw,12px)]">
        <span className="flex flex-wrap items-center gap-[10px] text-[13px] leading-[20px] font-normal tracking-[0.08em] uppercase">
          <span className="rounded-[6px] bg-vert px-[9px] py-[2px] text-[12px] leading-[18px] font-semibold text-sur-vert">{dict.blog.featured}</span>
          <span className="text-vert">{post.category}</span>
        </span>
        <span className="text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">{post.title}</span>
        <span className="text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{post.excerpt}</span>
        <span className="flex flex-wrap items-center gap-[8px] text-[13px] leading-[20px] font-normal text-texte2">
          <span>{formatDate(post.date, lang)}</span>
          <span aria-hidden>·</span>
          <span>
            {post.readMinutes} {dict.blog.minRead}
          </span>
        </span>
      </span>
    </Link>
  );
}
