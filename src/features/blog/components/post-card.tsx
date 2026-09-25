import Image from "next/image";
import Link from "next/link";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";

type Props = { post: Post; lang: Locale; minRead: string };

/**
 * Carte d'article des grilles (index et « À lire ensuite ») : panneau plein sans filet
 * (fond gris en clair, surface en sombre), couverture 16:9 en haut, catégorie, titre,
 * extrait et méta poussée en bas.
 */
export function PostCard({ post, lang, minRead }: Props) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-[20px] bg-surface-2 no-underline dark:bg-surface">
      <span className="relative block aspect-video shrink-0 overflow-hidden bg-fond">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 440px"
          className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03]"
        />
      </span>
      <span className="flex flex-1 flex-col gap-[8px] p-[clamp(16px,1.6vw,22px)]">
        <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{post.category}</span>
        <span className="text-[15px] leading-[26px] font-medium text-encre text-pretty">{post.title}</span>
        <span className="text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{post.excerpt}</span>
        <span className="mt-auto flex flex-wrap items-center gap-[8px] pt-[6px] text-[13px] leading-[20px] font-normal text-texte2">
          <span>{formatDate(post.date, lang)}</span>
          <span aria-hidden>·</span>
          <span>
            {post.readMinutes} {minRead}
          </span>
        </span>
      </span>
    </Link>
  );
}

/** Grille des cartes : trois colonnes, deux sous 980px, une sous 640px. */
export const POST_GRID = "grid grid-cols-[minmax(0,1fr)] items-stretch gap-[clamp(16px,1.8vw,24px)] min-[640px]:grid-cols-[repeat(2,minmax(0,1fr))] min-[980px]:grid-cols-[repeat(3,minmax(0,1fr))]";
