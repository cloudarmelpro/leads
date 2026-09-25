"use client";

import { useEffect, useRef, type PointerEvent } from "react";

import { LineReveal } from "@/components/shared/line-reveal";
import { Reveal } from "@/components/shared/reveal";
import { ContactMap } from "@/features/contact/components/contact-map";
import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Props = { title: string; lede: string; ctaBook: string; ctaWrite: string; mapAria: string };

// Boutons à la taille de ceux du hero de l'accueil (40 → 48px, 13 → 15px), texte seul.
const BTN =
  "tap-44 inline-flex min-h-[clamp(40px,35.86px+1.1vw,48px)] items-center justify-center rounded-[8px] px-[clamp(16px,12.9px+0.83vw,22px)] text-[clamp(13px,11.97px+0.28vw,15px)] leading-[20px] font-medium whitespace-nowrap no-underline transition-[background-color,box-shadow,transform] duration-[250ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[2px] active:scale-[0.98]";

/**
 * Hero Contact (maquette, 2026-09-25) : titre et texte centrés, deux boutons, puis la
 * carte du monde en points. Un halo vert suit le pointeur sur toute la section ; au
 * défilement, le titre rapetisse et descend (GSAP, calé sur le défilement).
 */
export function ContactHero({ title, lede, ctaBook, ctaWrite, mapAria }: Props) {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const h = heading.current?.querySelector("h1");
    if (!el || !h || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(h, { yPercent: 40, scale: 0.6, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.4 } });
    });
    return () => ctx.revert();
  }, []);

  const spot = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={section}
      id="top"
      onPointerMove={spot}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "40%" }}
      className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(168px,16.7vw,240px)] text-center"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-[0px] top-[-140px] bottom-[0px] bg-[radial-gradient(620px_circle_at_var(--mx)_var(--my),rgba(48,217,140,0.10),transparent_62%)]" />
      <div className="relative flex w-full flex-col items-center gap-[22px]">
        <div ref={heading} className="flex flex-col items-center gap-[22px]">
          <LineReveal as="h1" className="m-[0px] text-center text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]">
            {title}
          </LineReveal>
          <LineReveal delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-texte2 text-pretty">
            {lede}
          </LineReveal>
        </div>
        <Reveal delay={640} immediate className="mt-[clamp(10px,1.6vw,22px)] flex flex-wrap justify-center gap-[12px]">
          <a href="#rendez-vous" className={`${BTN} bg-vert text-sur-vert shadow-[0_14px_40px_-14px_rgba(48,217,140,0.8)] hover:bg-vert-clair`}>
            {ctaBook}
          </a>
          <a href="#formulaire" className={`${BTN} bg-verre text-encre shadow-[inset_0_0_0_1px_var(--color-contour)] backdrop-blur-[14px] hover:shadow-[inset_0_0_0_1px_var(--color-vert)]`}>
            {ctaWrite}
          </a>
        </Reveal>
        <Reveal kind="scale" delay={760} immediate className="relative mt-[clamp(16px,2.6vw,32px)] w-full max-w-[960px]">
          <ContactMap label={mapAria} />
        </Reveal>
      </div>
    </section>
  );
}
