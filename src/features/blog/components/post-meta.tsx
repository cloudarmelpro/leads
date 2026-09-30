import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Pick<Dictionary, "blog"> };

// Le hero d'article est toujours sombre (photo) : couleurs fixes.
const PILL = "rounded-[8px] border border-[rgba(255,255,255,0.14)] bg-[rgba(1,24,35,0.5)] px-[13px] py-[5px] text-[13px] leading-[20px] font-normal text-[#A9BCC4]";

/**
 * Ligne auteur / méta du hero d'article (maquette Blog article, 2026-09-30) : sur un filet
 * léger, à gauche la pastille ronde avec l'initiale (aucun portrait inventé), « Écrit par »
 * et le nom ; à droite catégorie, date et durée en pastilles contournées.
 */
export function PostMeta({ post, lang, dict }: Props) {
  return (
    <div className="mt-[14px] flex w-full max-w-[760px] flex-wrap items-center justify-between gap-[16px] border-t border-[rgba(255,255,255,0.12)] pt-[24px]">
      <span className="flex items-center gap-[12px]">
        <span aria-hidden className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#01293C] text-[16px] leading-[20px] font-medium text-[#30D98C]">
          {post.author.name.charAt(0)}
        </span>
        <span className="flex flex-col gap-[1px]">
          <span className="text-[12px] leading-[18px] font-normal text-[#A9BCC4]">{dict.blog.writtenBy}</span>
          <span className="text-[14px] leading-[20px] font-medium text-white">{post.author.name}</span>
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-[8px]">
        <span className={`${PILL} font-medium text-[#D6E2E6]`}>{post.category}</span>
        <span className={PILL}>{formatDate(post.date, lang)}</span>
        <span className={PILL}>
          {post.readMinutes} {dict.blog.minRead}
        </span>
      </span>
    </div>
  );
}
