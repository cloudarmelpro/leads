import Link from "next/link";

import { SurfaceCard } from "@/components/shared/surface-card";
import { ArrowRight } from "@/components/ui/arrows";
import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Dictionary };

/** Carte d'article au style Services : catégorie et date, titre, extrait, lien ancré en bas. */
export function PostCard({ post, lang, dict }: Props) {
  return (
    <SurfaceCard as="article" className="group h-full gap-6 p-7">
      <p className="relative flex flex-wrap items-center gap-2 text-[14px] leading-[25px] font-light text-texte2">
        <span className="text-emeraude dark:text-accent-strong">{post.category}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(post.date, lang)}</span>
      </p>
      <div className="relative">
        <h3 className="text-title-fluid font-medium text-encre">
          <Link
            href={`/${lang}/blog/${post.slug}`}
            className="text-encre no-underline after:absolute after:inset-0 hover:text-emeraude dark:hover:text-accent-strong"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-small-fluid text-texte2 text-pretty">{post.excerpt}</p>
      </div>
      <span className="relative mt-auto inline-flex items-center gap-2 text-cta-fluid font-medium text-emeraude dark:text-accent-strong">
        {dict.blog.readArticle}
        <ArrowRight className="w-[19px]" />
      </span>
    </SurfaceCard>
  );
}
