import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Dictionary };

const PILL = "rounded-full border border-ligne px-[13px] py-[5px] text-[13px] leading-[20px] text-texte2";

/**
 * Ligne auteur / méta du hero d'article : pastille ronde de 40px avec l'initiale
 * (aucun portrait inventé), « Écrit par » + nom, puis catégorie, date et durée en
 * pastilles contournées. Filet au-dessus, 24px de retrait.
 */
export function PostMeta({ post, lang, dict }: Props) {
  return (
    <div className="mt-[14px] flex w-full flex-wrap items-center justify-between gap-[16px] border-t border-ligne pt-[24px]">
      <div className="flex items-center gap-[12px]">
        <span aria-hidden className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-surface-2 text-[16px] leading-[20px] font-normal text-vert">
          {post.author.name.charAt(0)}
        </span>
        <span className="flex flex-col gap-[1px]">
          <span className="text-[12px] leading-[18px] font-normal text-texte2">{dict.blog.writtenBy}</span>
          <span className="text-[14px] leading-[20px] font-normal text-encre">{post.author.name}</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className={`${PILL} font-normal text-texte-bascule`}>{post.category}</span>
        <span className={`${PILL} font-normal`}>{formatDate(post.date, lang)}</span>
        <span className={`${PILL} font-normal`}>
          {post.readMinutes} {dict.blog.minRead}
        </span>
      </div>
    </div>
  );
}
