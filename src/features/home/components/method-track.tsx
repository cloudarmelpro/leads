"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";

type Step = { title: string; desc: string };
type Props = {
  steps: Step[];
  /** Visuel de chaque étape, dans l'ordre (public/images/home). */
  images: string[];
  stepLabel: string;
  prevLabel: string;
  nextLabel: string;
  /** En-tête (titre, intro) rendu à gauche des flèches. */
  children: ReactNode;
};

const GAP = 16;
const arrow = (d: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const NAV =
  "tap-44 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full bg-surface text-encre shadow-[inset_0_0_0_1px_var(--color-contour)] transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-surface-2";

/**
 * Piste des étapes (maquette Accueil) : cartes 4:5 qui défilent à l'horizontale avec
 * aimantation, la piste déborde jusqu'aux bords de l'écran et reste alignée sur le rail de
 * 1400px à gauche. Les flèches avancent ou reculent d'une carte.
 */
export function MethodTrack({ steps, images, stepLabel, prevLabel, nextLabel, children }: Props) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + GAP : 340;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-[24px]">
        {children}
        <div className="flex items-center gap-[8px]">
          <button type="button" aria-label={prevLabel} onClick={() => scroll(-1)} className={NAV}>
            {arrow("M15 6l-6 6 6 6")}
          </button>
          <button type="button" aria-label={nextLabel} onClick={() => scroll(1)} className={NAV}>
            {arrow("M9 6l6 6-6 6")}
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="mx-[calc(50%-50vw)] flex snap-x snap-mandatory gap-[16px] overflow-x-auto pr-[16px] pb-[4px] pl-[max(clamp(16px,4vw,56px),calc(50vw-700px))] [scroll-padding-left:max(clamp(16px,4vw,56px),calc(50vw-700px))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((step, i) => (
          <article key={step.title} className="flex w-[min(78vw,320px)] shrink-0 grow-0 snap-start flex-col gap-[14px] min-[640px]:w-[clamp(280px,23vw,340px)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-surface shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              {images[i] && <Image src={`/images/home/${images[i]}`} alt={step.title} fill sizes="(max-width: 640px) 78vw, 340px" className="object-cover" />}
              <span className="absolute top-1/2 left-1/2 inline-flex h-[36px] max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 items-center gap-[8px] rounded-[8px] bg-[rgba(1,24,35,0.62)] pr-[6px] pl-[14px] text-[14px] leading-[1] font-medium whitespace-nowrap text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-[14px]">
                <span className="overflow-hidden text-ellipsis">{step.title}</span>
                <span className="inline-flex h-[26px] shrink-0 items-center rounded-[6px] bg-[rgba(255,255,255,0.12)] px-[9px] text-[12px] font-normal text-[#E4ECEF]">
                  {stepLabel.replace("{n}", String(i + 1))}
                </span>
              </span>
            </div>
            <p className="m-[0px] px-[4px] text-[14.5px] leading-[23px] font-normal text-texte2 text-pretty">{step.desc}</p>
          </article>
        ))}
      </div>
    </>
  );
}
