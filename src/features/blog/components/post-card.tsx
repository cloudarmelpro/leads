import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";

type Props = { post: Post; lang: Locale; read: string; min: string };

/**
 * Carte d'article de la liste (maquette Blog, 2026-09-30) : couverture verticale (3:3.6)
 * sous un dégradé, en bas le tiret vert, catégorie et date, titre en capitales, extrait et
 * « Lire · n min ». Se soulève de 6px au survol. Toujours sombre (photo).
 */
export function PostCard({ post, lang, read, min }: Props) {
  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="relative block aspect-[3/3.6] overflow-hidden rounded-[16px] bg-[#01212F] shadow-[0_18px_40px_rgba(1,24,35,0.45)] no-underline transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px]"
    >
      <Image src={post.cover} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 440px" className="object-cover" />
      <span aria-hidden className="absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(1,24,35,0)_25%,rgba(1,24,35,0.6)_55%,rgba(1,24,35,0.95)_100%)]" />
      <span className="absolute inset-x-[0px] bottom-[0px] flex flex-col gap-[8px] p-[22px]">
        <span aria-hidden className="block h-[2px] w-[14px] rounded-[2px] bg-[#30D98C]" />
        <span className="text-[12px] leading-[16px] font-normal text-[#D6E2E6]">
          {post.category} — {formatDate(post.date, lang)}
        </span>
        <span className="line-clamp-3 text-[clamp(18px,1.7vw,22px)] leading-[1.08] font-semibold text-white uppercase text-balance">{post.title}</span>
        <span className="line-clamp-2 text-[14px] leading-[22px] font-normal text-[#A9BCC4] text-pretty">{post.excerpt}</span>
        <span className="mt-[4px] flex items-center gap-[8px] text-[13px] leading-[18px] font-medium text-[#30D98C]">
          <span>
            {read} · {post.readMinutes} {min}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

/** Grille de la liste : trois colonnes, deux sous 980px, une sous 640px. */
export const POST_GRID = "grid grid-cols-[minmax(0,1fr)] gap-[20px] min-[640px]:grid-cols-[repeat(2,minmax(0,1fr))] min-[980px]:grid-cols-[repeat(3,minmax(0,1fr))]";
