import Link from "next/link";

import { ArrowRight } from "@/components/ui/arrows";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { previewBg } from "@/lib/preview-image";

type Props = {
  post: Post;
  lang: Locale;
  dict: Dictionary;
  revealDelay?: number;
  revealDir?: string;
  revealDist?: string;
};

export function PostCard({ post, lang, dict, revealDelay, revealDir = "up", revealDist }: Props) {
  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      data-reveal={revealDir}
      data-reveal-delay={revealDelay != null ? String(revealDelay) : undefined}
      data-reveal-dist={revealDist}
      className="group flex min-h-[465px] flex-col no-underline"
    >
      {/* Wrapper qui découpe le zoom de l'image au survol. */}
      <div className="overflow-hidden rounded-2xl">
        <div
          style={previewBg(post.coverSeed, 600, 600)}
          className="aspect-square bg-menthe transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-texte2">
          <span className="rounded-full bg-menthe px-2.5 py-1 font-semibold text-sapin dark:text-accent-strong">
            {post.category}
          </span>
          <span>{formatDate(post.date, lang)}</span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug text-encre transition-colors group-hover:text-sapin dark:group-hover:text-accent-strong">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.6] text-texte2 text-pretty">
          {post.excerpt}
        </p>
        {/* Ancré en bas : remplit la carte vers le bas, comme les cartes Services. */}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-sapin dark:text-accent-strong">
          {dict.blog.readArticle}
          <ArrowRight className="w-[15px]" />
        </span>
      </div>
    </Link>
  );
}
