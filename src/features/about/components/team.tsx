"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Reveal } from "@/components/shared/reveal";
import { RollTitle } from "@/components/shared/roll-title";
import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Props = {
  title: string;
  intro: string;
  prev: string;
  next: string;
  namePlaceholder: string;
  altPrefix: string;
  roles: string[];
};

// Cadrage de chaque photo (public/images/about/equipe-N.webp), dans l'ordre des rôles.
const FOCUS = ["62% 30%", "50% 20%", "50% 25%", "50% 18%", "40% 20%"];
const NAV =
  "tap-44 flex size-[48px] cursor-pointer items-center justify-center rounded-full bg-verre text-encre shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[10px] transition-[background-color,color,transform] duration-[250ms] hover:scale-[1.06] hover:bg-vert hover:text-sur-vert active:scale-[0.96]";

/**
 * Équipe (maquette À propos) : titre et flèches, puis une rangée de cartes photo 3:4 qui
 * défile à l'horizontale (glissement au doigt, flèches, molette). Photos en noir et blanc
 * qui reprennent leurs couleurs et s'auréolent de vert au survol ; chaque photo glisse
 * un peu avec le défilement. La rangée arrive en biais et repart en biais.
 * Les noms sont un espace réservé (`[Nom]`) tant que le client ne les a pas fournis.
 */
export function Team({ title, intro, prev, next, namePlaceholder, altPrefix, roles }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const row = track.current;
    if (!el || !row || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(row, { x: 80 }, { x: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: 0.6 } });
      gsap.fromTo(
        row,
        { skewX: -10, opacity: 0.3 },
        { skewX: 0, opacity: 1, ease: "none", immediateRender: true, scrollTrigger: { trigger: row, start: "top bottom", end: "center 55%", scrub: 0.5 } },
      );
      gsap.fromTo(
        row,
        { skewX: 0, opacity: 1 },
        { skewX: 6, y: -50, opacity: 0.35, ease: "none", immediateRender: false, scrollTrigger: { trigger: row, start: "center 40%", end: "bottom top", scrub: 0.5 } },
      );
      row.querySelectorAll<HTMLElement>("[data-tphoto]").forEach((photo) => {
        gsap.fromTo(photo, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: photo.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);

  const slide = (dir: 1 | -1) => {
    const row = track.current;
    if (row) row.scrollBy({ left: dir * Math.max(260, row.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <section ref={section} id="equipe" className="relative flex justify-center px-[clamp(16px,4vw,56px)] pb-[clamp(96px,11vw,180px)]">
      <div className="flex w-full max-w-[1400px] flex-col gap-[clamp(36px,4vw,56px)]">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-[24px] min-[620px]:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-[12px]">
            <RollTitle text={title} className="m-[0px] text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]" />
            <Reveal as="p" delay={180} className="m-[0px] max-w-[560px] text-[clamp(15px,1.3vw,17px)] leading-[1.6] font-normal text-texte2 text-pretty">
              {intro}
            </Reveal>
          </div>
          <Reveal delay={260} className="flex gap-[10px] justify-self-start min-[860px]:justify-self-end">
            <button type="button" aria-label={prev} onClick={() => slide(-1)} className={NAV}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button type="button" aria-label={next} onClick={() => slide(1)} className={NAV}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </Reveal>
        </div>

        {/* Marges négatives et remplissage égaux : la carte soulevée au survol n'est pas rognée. */}
        <div
          ref={track}
          className="-mx-[2px] -mt-[8px] -mb-[12px] flex snap-x snap-mandatory gap-[18px] overflow-x-auto scroll-smooth px-[2px] pt-[8px] pb-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {roles.map((role, i) => (
            <Reveal
              key={role}
              kind="scale"
              delay={i * 110}
              className="group relative aspect-[3/4] shrink-0 basis-[clamp(236px,24vw,290px)] snap-start overflow-hidden rounded-[24px] border border-ligne bg-surface transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px] hover:border-[rgba(48,217,140,0.5)] dark:border-[#012A3C]"
            >
              <span data-tphoto className="absolute top-[-8%] left-[0px] block h-[116%] w-full [filter:grayscale(1)_contrast(1.05)] transition-[filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[filter:grayscale(0.15)_contrast(1.05)]">
                <Image src={`/images/about/equipe-${i + 1}.webp`} alt={`${altPrefix}${role}`} fill sizes="(max-width: 620px) 70vw, 290px" className="object-cover" style={{ objectPosition: FOCUS[i] }} />
              </span>
              <span aria-hidden className="pointer-events-none absolute inset-[0px] bg-[linear-gradient(0deg,rgba(48,217,140,0.6)_0%,rgba(48,217,140,0.14)_42%,transparent_66%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />
              <span aria-hidden className="pointer-events-none absolute inset-[0px] bg-[linear-gradient(180deg,transparent_48%,rgba(1,24,35,0.88)_100%)]" />
              <div className="absolute inset-x-[22px] bottom-[20px] flex flex-col gap-[4px]">
                <span className="text-[20px] leading-[26px] font-semibold text-white">{namePlaceholder}</span>
                <span className="text-[14px] leading-[20px] font-normal text-[#C9DAD1]">{role}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
