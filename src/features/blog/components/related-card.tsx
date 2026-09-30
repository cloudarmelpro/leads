import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";

type Props = { post: Post; lang: Locale; minRead: string };

/**
 * Carte « À lire ensuite » de la page d'article (maquette Blog article, 2026-09-30) :
 * couverture 16:9 aux coins de 24px, puis catégorie en vert, titre, extrait et méta.
 */
export function RelatedCard({ post, lang, minRead }: Props) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="flex flex-col no-underline">
      <span className="relative block aspect-video shrink-0 overflow-hidden rounded-[24px] bg-[#01212F]">
        <Image src={post.cover} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 440px" className="object-cover opacity-90" />
        <span aria-hidden className="absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(1,24,35,0.05)_0%,rgba(1,24,35,0)_60%,rgba(1,24,35,0.45)_100%)]" />
      </span>
      <span className="flex flex-1 flex-col gap-[11px] pt-[18px]">
        <span className="text-[12px] leading-[16px] font-medium tracking-[0.08em] text-vert uppercase">{post.category}</span>
        <span className="text-[17px] leading-[24px] font-medium text-encre text-pretty">{post.title}</span>
        <span className="text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{post.excerpt}</span>
        <span className="mt-auto flex flex-wrap items-center gap-[8px] pt-[4px] text-[13px] leading-[20px] font-normal text-texte2">
          <span>{formatDate(post.date, lang)}</span>
          <span aria-hidden className="text-mot-accueil">·</span>
          <span>
            {post.readMinutes} {minRead}
          </span>
        </span>
      </span>
    </Link>
  );
}

/** Grille « À lire ensuite » : trois colonnes, deux sous 980px, une sous 640px. */
export const RELATED_GRID = "grid grid-cols-[minmax(0,1fr)] items-stretch gap-x-[24px] gap-y-[44px] min-[640px]:grid-cols-[repeat(2,minmax(0,1fr))] min-[980px]:grid-cols-[repeat(3,minmax(0,1fr))]";
