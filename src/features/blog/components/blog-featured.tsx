import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { previewBg } from "@/lib/preview-image";

type Props = { post: Post; lang: Locale; dict: Dictionary };

export function BlogFeatured({ post, lang, dict }: Props) {
  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      data-reveal="up"
      style={previewBg(post.coverSeed, 1200, 700)}
      className="group relative flex min-h-[clamp(340px,42vw,500px)] flex-col justify-end overflow-hidden rounded-[28px] bg-encre p-[clamp(24px,4vw,48px)] no-underline"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(transparent,rgba(15,29,23,.5)_40%,rgba(15,29,23,.9))]"
      />
      <div className="relative max-w-[46ch]">
        <p className="mb-4 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-white/80">
          <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
            {dict.blog.featured}
          </span>
          <span>
            {post.category} · {formatDate(post.date, lang)}
          </span>
        </p>
        <h2 className="font-display text-[clamp(24px,3.4vw,40px)] leading-[1.12] tracking-normal text-balance text-white">
          {post.title}
        </h2>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.6] text-pretty text-white/75">
          {post.excerpt}
        </p>
        <span className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-encre">
          {dict.blog.readArticle}
          <ArrowUpRight size={16} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
