import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Dictionary };

/** Méta d'article : auteur (initiale, pas de portrait inventé) + catégorie, date, durée. */
export function PostMeta({ post, lang, dict }: Props) {
  const pill = "rounded-full border border-ligne px-3 py-1";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ligne pt-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-menthe font-display text-[16px] font-medium text-sapin dark:text-accent-strong"
        >
          {post.author.name.charAt(0)}
        </span>
        <span>
          <span className="block text-xs text-texte2">{dict.blog.writtenBy}</span>
          <span className="block text-sm font-semibold text-encre">{post.author.name}</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-texte2">
        <span className={`${pill} font-medium`}>{post.category}</span>
        <span className={pill}>{formatDate(post.date, lang)}</span>
        <span className={pill}>
          {post.readMinutes} {dict.blog.minRead}
        </span>
      </div>
    </div>
  );
}
