import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Dictionary };

const PILL = "rounded-[8px] bg-surface-2 px-[12px] py-[6px] text-[13px] leading-[20px] font-normal text-texte2 dark:bg-surface";

/**
 * Ligne auteur / méta sous le hero d'article, centrée : pastille ronde avec l'initiale
 * (aucun portrait inventé), « Écrit par » + nom, puis catégorie, date et durée sur
 * fond plein, sans filet.
 */
export function PostMeta({ post, lang, dict }: Props) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-x-[20px] gap-y-[12px]">
      <span className="flex items-center gap-[12px]">
        <span aria-hidden className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-surface-2 text-[15px] leading-[20px] font-medium text-vert dark:bg-surface">
          {post.author.name.charAt(0)}
        </span>
        <span className="flex flex-col items-start gap-[1px] text-left">
          <span className="text-[13px] leading-[18px] font-normal text-texte2">{dict.blog.writtenBy}</span>
          <span className="text-[15px] leading-[20px] font-medium text-encre">{post.author.name}</span>
        </span>
      </span>
      <span className="flex flex-wrap items-center justify-center gap-[8px]">
        <span className={PILL}>{post.category}</span>
        <span className={PILL}>{formatDate(post.date, lang)}</span>
        <span className={PILL}>
          {post.readMinutes} {dict.blog.minRead}
        </span>
      </span>
    </div>
  );
}
