"use client";

import { useEffect, useRef, type PointerEvent } from "react";

import { Reveal } from "@/components/shared/reveal";
import { RollTitle } from "@/components/shared/roll-title";
import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Item = { title: string; body: string };
type Props = { title: string; intro: string; items: Item[] };

// Pictogrammes des trois principes (maquette) : médaille, bouclier, poignée de main.
const ICONS = [
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </>,
  <>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  <>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </>,
];
// Halo qui suit le pointeur, posé sur le fond de carte (gris en clair, dégradé nuit en sombre).
// Classe écrite en entier : Tailwind ne génère pas une classe assemblée à l'exécution.
const CARD_BG =
  "bg-[radial-gradient(380px_circle_at_var(--mx)_var(--my),rgba(48,217,140,0.09),transparent_60%),linear-gradient(160deg,var(--color-surface-2),var(--color-surface-2))] dark:bg-[radial-gradient(380px_circle_at_var(--mx)_var(--my),rgba(48,217,140,0.09),transparent_60%),linear-gradient(160deg,#011E2B_0%,#011823_100%)]";

/**
 * Principes (maquette À propos) : titre centré, texte d'appui, puis trois cartes qui
 * grandissent en arrivant. Chaque carte porte un halo vert qui suit le pointeur, un
 * grand pictogramme en filigrane qui glisse avec le défilement, et se soulève au
 * survol. La grille entière bascule en 3D à l'entrée et se relève en sortant.
 */
export function Principles({ title, intro, items }: Props) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotationX: 35, y: 120, transformPerspective: 1100, transformOrigin: "50% 0%" },
        { rotationX: 0, y: 0, ease: "none", immediateRender: true, scrollTrigger: { trigger: el, start: "top bottom", end: "center 55%", scrub: 0.5 } },
      );
      gsap.fromTo(
        el,
        { rotationX: 0, y: 0, opacity: 1 },
        { rotationX: -12, y: -60, opacity: 0.4, ease: "none", immediateRender: false, scrollTrigger: { trigger: el, start: "center 40%", end: "bottom top", scrub: 0.5 } },
      );
      el.querySelectorAll<HTMLElement>("[data-filigrane]").forEach((mark, i) => {
        gsap.fromTo(mark, { y: 30 * (i - 1) }, { y: -30 * (i - 1), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    return () => ctx.revert();
  }, []);

  const spot = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="principes" className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(40px,5vw,72px)] pb-[clamp(96px,11vw,180px)]">
      <div className="flex w-full max-w-[1400px] flex-col gap-[clamp(40px,5vw,60px)]">
        <div className="flex flex-col items-center gap-[16px] text-center">
          <RollTitle text={title} className="m-[0px] text-center text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]" />
          <Reveal as="p" delay={140} className="m-[0px] max-w-[920px] text-[clamp(17px,1.9vw,26px)] leading-[1.35] font-normal text-texte2 text-balance dark:text-[#C9DAD1]">
            {intro}
          </Reveal>
        </div>

        <div ref={grid} className="grid grid-cols-[minmax(0,1fr)] gap-[clamp(16px,2.4vw,32px)] min-[860px]:grid-cols-[repeat(3,minmax(0,1fr))]">
          {items.map((item, i) => (
            <Reveal
              key={item.title}
              kind="scale"
              delay={i * 130}
              style={{ ["--mx" as string]: "50%", ["--my" as string]: "0%" }}
              className={`relative flex min-h-[clamp(240px,22vw,300px)] flex-col gap-[22px] overflow-hidden rounded-[16px] p-[clamp(28px,3vw,40px)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[6px] ${CARD_BG}`}
            >
              <div onPointerMove={spot} className="absolute inset-[0px]" aria-hidden />
              <span data-filigrane aria-hidden className="pointer-events-none absolute right-[-28px] bottom-[-34px] flex text-vert opacity-[0.07]">
                <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  {ICONS[i]}
                </svg>
              </span>
              <div className="pointer-events-none relative flex items-center gap-[12px]">
                <span className="flex text-vert">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                    {ICONS[i]}
                  </svg>
                </span>
                <h3 className="m-[0px] text-[clamp(20px,1.9vw,24px)] leading-[1.2] font-semibold text-encre">{item.title}</h3>
              </div>
              <p className="pointer-events-none relative m-[0px] text-[15px] leading-[27px] font-normal text-texte2 text-pretty">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
