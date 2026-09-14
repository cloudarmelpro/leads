import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale; dict: Dictionary };

const SHADE = "linear-gradient(180deg, rgba(1,24,35,0.1) 0%, rgba(1,24,35,0) 45%, rgba(1,24,35,0.72) 100%)";

/**
 * Article à la une, dans la colonne droite du hero (maquette Blog) : bloc 16:10
 * cliquable en entier, couverture à 90 %, dégradé de protection, pastille « À la une »,
 * catégorie, titre et méta posés en bas.
 */
export function FeaturedCard({ post, lang, dict }: Props) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="group flex flex-col no-underline">
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[24px] bg-surface">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 620px) 100vw, 560px"
          className="object-cover opacity-90 transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03] group-hover:opacity-100"
        />
        <span aria-hidden className="absolute inset-[0px] block" style={{ background: SHADE }} />
        <span className="absolute top-[18px] left-[18px] rounded-[9px] bg-fond/72 px-[13px] py-[6px] text-[12px] leading-[16px] font-medium tracking-[0.06em] text-vert uppercase backdrop-blur-[8px]">
          {dict.blog.featured}
        </span>
        <span className="absolute inset-x-[0px] bottom-[0px] flex flex-col gap-[9px] p-[22px]">
          <span className="text-[12px] leading-[16px] font-medium tracking-[0.08em] text-vert uppercase">{post.category}</span>
          <span className="text-[clamp(18px,2.1vw,23px)] leading-[1.22] font-medium tracking-[-0.4px] text-white text-pretty">{post.title}</span>
          <span className="flex flex-wrap items-center gap-[8px] text-[13px] leading-[20px] font-normal text-texte2">
            <span>{formatDate(post.date, lang)}</span>
            <span aria-hidden className="text-white/28">·</span>
            <span>
              {post.readMinutes} {dict.blog.minRead}
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}
