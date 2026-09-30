"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { posts: Post[]; lang: Locale; dict: Pick<Dictionary, "blog"> };

const EASE = "cubic-bezier(0.22,1,0.36,1)";

/**
 * Hero du blogue (maquette du 2026-09-30) : la couverture de l'article courant en plein
 * fond (fondu et zoom d'un article à l'autre), à gauche catégorie, date, titre, extrait et
 * bouton de lecture ; à droite les trois articles suivants en cartes verticales, chacune
 * met son article en avant au clic. Un écran de haut dès 900px. Toujours sombre (photo).
 */
export function BlogHero({ posts, lang, dict }: Props) {
  const t = dict.blog;
  const [index, setIndex] = useState(0);
  const current = posts[index] ?? posts[0];
  if (!current) return null;
  const next = Array.from({ length: Math.min(3, posts.length - 1) }, (_, k) => (index + 1 + k) % posts.length);

  return (
    <section
      id="top"
      data-header-sombre
      className="relative flex min-h-[560px] items-end justify-center overflow-hidden bg-[#011823] px-[clamp(16px,4vw,56px)] pt-[120px] pb-[48px] min-[620px]:pt-[140px] min-[620px]:pb-[clamp(32px,7vh,72px)] min-[900px]:h-[100svh] min-[900px]:pt-[clamp(96px,14vh,150px)]"
    >
      {posts.map((post, i) => (
        <span
          key={post.slug}
          aria-hidden
          className="absolute inset-[0px] block"
          style={{
            opacity: i === index ? 1 : 0,
            transform: `scale(${i === index ? 1 : 1.06})`,
            transition: `opacity 900ms ${EASE}, transform 1400ms ${EASE}`,
          }}
        >
          <Image src={post.cover} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
        </span>
      ))}
      <span aria-hidden className="absolute inset-[0px] block bg-[linear-gradient(90deg,rgba(1,24,35,0.92)_0%,rgba(1,24,35,0.7)_38%,rgba(1,24,35,0.25)_70%,rgba(1,24,35,0.35)_100%)]" />
      <span aria-hidden className="absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(1,24,35,0.75)_0%,rgba(1,24,35,0)_22%,rgba(1,24,35,0)_55%,#011823_92%,#011823_100%)]" />

      <div className="relative z-[1] grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-end gap-[36px] min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[900px]:gap-[48px]">
        <div className="flex min-w-[0px] flex-col items-start gap-[18px]">
          <span className="text-[15px] leading-[20px] font-medium text-white">
            {current.category} — {formatDate(current.date, lang)}
          </span>
          <h1 className="m-[0px] line-clamp-3 max-w-[560px] text-[clamp(28px,3vw,40px)] leading-[1.05] font-semibold tracking-[-0.02em] text-white uppercase text-balance">{current.title}</h1>
          <p className="m-[0px] line-clamp-2 max-w-[440px] text-[15px] leading-[25px] font-normal text-[#D6E2E6] text-pretty">{current.excerpt}</p>
          <div className="mt-[8px] flex items-center gap-[12px]">
            <Link
              href={`/${lang}/blog/${current.slug}`}
              className="flex min-h-[44px] items-center gap-[10px] rounded-[9px] bg-[#30D98C] px-[22px] text-[14px] leading-[18px] font-medium text-[#011823] no-underline transition-colors duration-200 hover:bg-[#7FEFC0]"
            >
              {t.readArticle}
              <span className="opacity-60">
                · {current.readMinutes} {t.min}
              </span>
            </Link>
          </div>
        </div>

        <div className="flex min-w-[0px] flex-col gap-[28px]">
          <div role="group" aria-label={t.slidesAria} className="flex w-full justify-end gap-[16px] overflow-hidden pb-[4px]">
            {next.map((j) => {
              const post = posts[j];
              if (!post) return null;
              return (
                <button
                  key={post.slug}
                  type="button"
                  onClick={() => setIndex(j)}
                  aria-label={`${t.showArticle} : ${post.title}`}
                  className="relative aspect-[3/4.1] max-w-[168px] min-w-[0px] flex-1 cursor-pointer overflow-hidden rounded-[16px] bg-[#01212F] shadow-[0_18px_40px_rgba(1,24,35,0.45)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px] min-[620px]:max-w-[min(200px,26vh)]"
                >
                  <Image src={post.cover} alt="" fill sizes="200px" className="object-cover" />
                  <span aria-hidden className="absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(1,24,35,0)_40%,rgba(1,24,35,0.88)_100%)]" />
                  <span className="absolute inset-x-[0px] bottom-[0px] flex flex-col items-start gap-[6px] p-[16px] text-left">
                    <span aria-hidden className="block h-[2px] w-[14px] rounded-[2px] bg-[#30D98C]" />
                    <span className="text-[11px] leading-[14px] font-normal text-[#D6E2E6]">{post.category}</span>
                    {/* Coupure aux espaces seulement : la maquette coupait les mots lettre à lettre sur téléphone. */}
                    <span className="text-[min(16px,2.4vh)] leading-[1.1] font-semibold text-white uppercase [overflow-wrap:break-word] text-balance">{post.short}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
