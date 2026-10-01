"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";


type Step = { title: string; desc: string };
type Props = {
  steps: Step[];
  /** Visuel de chaque étape, dans l'ordre (public/images/home). */
  images: string[];
  stepLabel: string;
  /** En-tête (titre, intro) au-dessus de la piste. */
  children: ReactNode;
};

// Vitesse du défilement en px/s (« un peu plus vite » que 14, demande du client du 2026-10-01).
// La durée de l'animation est recalculée à partir de la largeur réelle d'une série, pour la
// même vitesse à toutes les largeurs d'écran.
const SPEED = 22;

/**
 * Piste des étapes (maquette Accueil) : cartes 4:5 à l'horizontale, la piste déborde jusqu'aux
 * bords de l'écran et reste alignée sur le rail de 1400px à gauche. Depuis le 2026-10-01, elle
 * défile toute seule comme les rangées d'Outils : la liste est rendue deux fois dans une piste
 * animée en CSS (`tw-tools-rail-rev`, de -50 % à 0, donc de gauche vers droite, boucle sans
 * saut). Pause au survol, reprise dès que la souris sort, comme les Outils ; immobile sous
 * `prefers-reduced-motion`. Les flèches de la maquette ont été retirées. Copies `aria-hidden`.
 */
export function MethodTrack({ steps, images, stepLabel, children }: Props) {
  const series = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState("120s");

  useEffect(() => {
    const el = series.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w) setDuration(`${Math.round(w / SPEED)}s`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cards = (copy: number) =>
    steps.map((step, n) => {
      const image = images[n];
      return (
        <article key={`${step.title}-${copy}`} className="flex w-[min(78vw,320px)] shrink-0 grow-0 flex-col gap-[14px] min-[640px]:w-[clamp(280px,23vw,340px)]">
          {/* Deux rendus par étape (mode clair demandé le 2026-09-30) : `<nom>.webp` nuit et
              `<nom>-clair.webp` studio clair ; le thème affiche l'un des deux. L'étiquette suit. */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-carte shadow-[inset_0_0_0_1px_var(--color-contour)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            {image && (
              <>
                <Image src={`/images/home/${image.replace(/\.webp$/, "-clair.webp")}`} alt={step.title} fill sizes="(max-width: 640px) 78vw, 340px" className="object-cover dark:hidden" />
                <Image src={`/images/home/${image}`} alt={step.title} fill sizes="(max-width: 640px) 78vw, 340px" className="hidden object-cover dark:block" />
              </>
            )}
            <span className="absolute top-1/2 left-1/2 inline-flex min-h-[36px] w-max max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 items-center gap-[8px] rounded-[8px] bg-[rgba(253,253,253,0.78)] py-[5px] pr-[6px] pl-[14px] text-[14px] leading-[18px] font-medium text-encre shadow-[inset_0_0_0_1px_rgba(30,30,30,0.1)] backdrop-blur-[14px] dark:bg-[rgba(1,24,35,0.62)] dark:text-white dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
              <span className="min-w-[0px] text-balance">{step.title}</span>
              <span className="inline-flex h-[26px] shrink-0 items-center rounded-[6px] bg-[rgba(30,30,30,0.08)] px-[9px] text-[12px] font-normal whitespace-nowrap text-texte2 dark:bg-[rgba(255,255,255,0.12)] dark:text-[#E4ECEF]">
                {stepLabel.replace("{n}", String(n + 1))}
              </span>
            </span>
          </div>
          <p className="m-[0px] px-[4px] text-[14.5px] leading-[23px] font-normal text-texte2 text-pretty">{step.desc}</p>
        </article>
      );
    });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-[24px]">{children}</div>

      {/* Même retrait à gauche qu'avant (rail de 1400px), débord jusqu'aux bords de l'écran. */}
      <div className="group mx-[calc(50%-50vw)] overflow-hidden pb-[4px] pl-[max(clamp(16px,4vw,56px),calc(50vw-700px))]">
        <div
          // Propriétés séparées, pas le raccourci `animation` : en ligne, il imposerait
          // `play-state: running` et la pause au survol (classe) n'aurait plus d'effet (voir tools.tsx).
          style={{ animationName: "tw-tools-rail-rev", animationDuration: duration, animationTimingFunction: "linear", animationIterationCount: "infinite" }}
          className="flex w-max group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
        >
          <div ref={series} className="flex shrink-0 gap-[16px] pr-[16px]">
            {cards(0)}
          </div>
          <div aria-hidden className="flex shrink-0 gap-[16px] pr-[16px]">
            {cards(1)}
          </div>
        </div>
      </div>
    </>
  );
}
