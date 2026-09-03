import Link from "next/link";

import { SurfaceCard } from "@/components/shared/surface-card";
import { ArrowRight } from "@/components/ui/arrows";
import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Dictionary };

/** Article à la une : carte large au style Services, texte à gauche, bouton à droite. */
export function BlogFeatured({ post, lang, dict }: Props) {
  return (
    <SurfaceCard as="article" className="gap-8 px-10 pt-10 pb-11 md:flex-row md:items-end md:justify-between">
      <div className="relative max-w-[56ch]">
        <p className="flex flex-wrap items-center gap-2 text-[14px] leading-[25px] font-light text-texte2">
          <span className="text-emeraude dark:text-accent-strong">{dict.blog.featured}</span>
          <span aria-hidden>·</span>
          <span>{post.category}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.date, lang)}</span>
        </p>
        <h2 className="mt-3 font-display text-[clamp(22px,3vw,30px)] leading-[1.143] font-normal tracking-[-0.8px] text-encre text-balance">
          <Link href={`/${lang}/blog/${post.slug}`} className="text-encre no-underline hover:text-emeraude dark:hover:text-accent-strong">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-[15px] leading-[24px] text-texte2 text-pretty">{post.excerpt}</p>
      </div>
      <Link
        href={`/${lang}/blog/${post.slug}`}
        className="relative inline-flex w-fit shrink-0 items-center gap-2.5 rounded-[9px] bg-emeraude px-4 py-2.5 text-[15px] font-medium text-white no-underline hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
      >
        {dict.blog.readArticle}
        <ArrowRight className="w-[19px]" />
      </Link>
    </SurfaceCard>
  );
}
