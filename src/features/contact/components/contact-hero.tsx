"use client";

import { useEffect, useRef } from "react";

import { HERO_BTN_GLASS, HERO_BTN_PRIMARY } from "@/components/shared/hero-buttons";
import { HeroSpot, moveSpot, SPOT_STYLE } from "@/components/shared/hero-spot";
import { LineReveal } from "@/components/shared/line-reveal";
import { Reveal } from "@/components/shared/reveal";
import { ContactMap } from "@/features/contact/components/contact-map";
import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Props = { title: string; lede: string; ctaBook: string; ctaWrite: string; mapAria: string };

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

  return (
    <section
      ref={section}
      id="top"
      onPointerMove={moveSpot}
      style={SPOT_STYLE}
      className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(168px,16.7vw,240px)] text-center"
    >
      <HeroSpot />
      <div className="relative flex w-full flex-col items-center gap-[22px]">
        <div ref={heading} className="flex flex-col items-center gap-[22px]">
          <LineReveal as="h1" rollOnHover className="m-[0px] cursor-default text-center text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]">
            {title}
          </LineReveal>
          <LineReveal delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-texte2 text-pretty">
            {lede}
          </LineReveal>
        </div>
        <Reveal delay={640} immediate className="mt-[clamp(10px,1.6vw,22px)] flex flex-wrap justify-center gap-[12px]">
          <a href="#rendez-vous" className={HERO_BTN_PRIMARY}>
            {ctaBook}
          </a>
          <a href="#formulaire" className={HERO_BTN_GLASS}>
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
