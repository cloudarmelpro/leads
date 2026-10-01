"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CoverImage } from "@/features/blog/components/cover-image";
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
 * met son article en avant au clic. Un écran de haut dès 900px.
 */
export function BlogHero({ posts, lang, dict }: Props) {
  const t = dict.blog;
  const [index, setIndex] = useState(0);
  // Les couvertures des autres articles (fondu au clic) ne sont montées qu'une fois la page
  // chargée : au démarrage, seule celle de l'article courant se dispute la bande passante.
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => setWarm(true), 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(timer);
    };
  }, []);
  const current = posts[index] ?? posts[0];
  if (!current) return null;
  const next = Array.from({ length: Math.min(3, posts.length - 1) }, (_, k) => (index + 1 + k) % posts.length);

  return (
    <section
      id="top"
      // Bas du hero plus aéré que la maquette (48px / 32–72px), demande du client du 2026-09-30 :
      // le même air sous le texte que sur Soumission, Services et À propos (72–140px).
      // Mode clair : voile gris perle et textes encre (valeurs nuit sous `dark:`), en-tête plus
      // forcé en sombre.
      className="relative flex min-h-[560px] items-end justify-center overflow-hidden bg-[#eef1f3] px-[clamp(16px,4vw,56px)] pt-[120px] pb-[clamp(72px,9.5vw,140px)] min-[620px]:pt-[140px] min-[900px]:h-[100svh] min-[900px]:pt-[clamp(96px,14vh,150px)] min-[900px]:pb-[clamp(72px,12vh,140px)] dark:bg-[#011823]"
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
          {(i === index || warm) && <CoverImage post={post} priority={i === 0} sizes="100vw" />}
        </span>
      ))}
      <span aria-hidden className={`absolute inset-[0px] block bg-[linear-gradient(90deg,rgba(238,241,243,0.92)_0%,rgba(238,241,243,0.7)_38%,rgba(238,241,243,0.25)_70%,rgba(238,241,243,0.35)_100%)] dark:bg-[linear-gradient(90deg,rgba(1,24,35,0.92)_0%,rgba(1,24,35,0.7)_38%,rgba(1,24,35,0.25)_70%,rgba(1,24,35,0.35)_100%)]`} />
      <span aria-hidden className={`absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(238,241,243,0.75)_0%,rgba(238,241,243,0)_22%,rgba(238,241,243,0)_55%,#eef1f3_92%,#eef1f3_100%)] dark:bg-[linear-gradient(180deg,rgba(1,24,35,0.75)_0%,rgba(1,24,35,0)_22%,rgba(1,24,35,0)_55%,#011823_92%,#011823_100%)]`} />

      <div className="relative z-[1] grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-end gap-[36px] min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[900px]:gap-[48px]">
        <div className="flex min-w-[0px] flex-col items-start gap-[18px]">
          <span className="text-[15px] leading-[20px] font-medium text-encre dark:text-white">
            {current.category} — {formatDate(current.date, lang)}
          </span>
          {/* H2 et non H1 : le titre de la page (la liste) est dans PostGrid. */}
          <h2 className="m-[0px] line-clamp-3 max-w-[560px] text-[clamp(28px,3vw,40px)] leading-[1.05] font-semibold tracking-[-0.02em] text-encre uppercase text-balance dark:text-white">{current.title}</h2>
          <p className="m-[0px] line-clamp-2 max-w-[440px] text-[15px] leading-[25px] font-normal text-texte-bascule text-pretty dark:text-[#D6E2E6]">{current.excerpt}</p>
          <div className="mt-[8px] flex items-center gap-[12px]">
            <Link
              href={`/${lang}/blog/${current.slug}`}
              className="flex min-h-[44px] items-center gap-[10px] rounded-[9px] bg-bouton px-[22px] text-[14px] leading-[18px] font-medium text-sur-bouton no-underline transition-colors duration-200 hover:bg-bouton-clair"
            >
              {t.readArticle}
              <span className="opacity-80">
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
                  className="relative aspect-[3/4.1] max-w-[168px] min-w-[0px] flex-1 cursor-pointer overflow-hidden rounded-[16px] bg-surface-2 shadow-[0_18px_40px_rgba(30,30,30,0.16)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px] min-[620px]:max-w-[min(200px,26vh)] dark:bg-[#01212F] dark:shadow-[0_18px_40px_rgba(1,24,35,0.45)]"
                >
                  <CoverImage post={post} sizes="200px" />
                  <span aria-hidden className={`absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(238,241,243,0)_40%,rgba(238,241,243,0.9)_100%)] dark:bg-[linear-gradient(180deg,rgba(1,24,35,0)_40%,rgba(1,24,35,0.88)_100%)]`} />
                  <span className="absolute inset-x-[0px] bottom-[0px] flex flex-col items-start gap-[6px] p-[16px] text-left">
                    {/* Nom accessible = ce texte + le texte visible : un aria-label qui ne reprend pas
                        le texte visible est signalé (label-content-name-mismatch). */}
                    <span className="sr-only">{t.showArticle} : </span>
                    <span aria-hidden className="block h-[2px] w-[14px] rounded-[2px] bg-vert dark:bg-[#30D98C]" />
                    <span className="text-[11px] leading-[14px] font-normal text-texte2 dark:text-[#D6E2E6]">{post.category}</span>
                    {/* Coupure aux espaces seulement : la maquette coupait les mots lettre à lettre sur téléphone. */}
                    <span className="text-[min(16px,2.4vh)] leading-[1.1] font-semibold text-encre uppercase [overflow-wrap:break-word] text-balance dark:text-white">{post.short}</span>
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
