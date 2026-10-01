"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

type Step = { title: string; desc: string };
type Props = {
  steps: Step[];
  /** Visuel de chaque étape, dans l'ordre (public/images/home). */
  images: string[];
  stepLabel: string;
  /** En-tête (titre, intro) au-dessus de la piste. */
  children: ReactNode;
};

// Défilement automatique : 14 px/s, soit une carte toutes les 25 s environ (« très lent »,
// demande du client du 2026-10-01). Reprise 4 s après la dernière interaction.
const SPEED = 14;
const RESUME_MS = 4000;

/** Largeur d'une série de cartes : distance entre la première carte et sa copie. */
function seriesWidth(el: HTMLElement | null, count: number): number {
  const first = el?.children[0];
  const copy = el?.children[count];
  if (!(first instanceof HTMLElement) || !(copy instanceof HTMLElement)) return 0;
  return copy.offsetLeft - first.offsetLeft;
}

/**
 * Piste des étapes (maquette Accueil) : cartes 4:5 à l'horizontale, la piste déborde jusqu'aux
 * bords de l'écran et reste alignée sur le rail de 1400px à gauche. Les flèches de la maquette
 * ont été retirées (client, 2026-10-01). Depuis ce jour, la piste glisse toute seule de gauche vers droite,
 * très lentement et sans fin : la liste est rendue deux fois et, revenue au début de la première
 * série, la position saute d'une série en avant (même contenu, saut invisible). Pause au survol, pendant un geste, à la molette,
 * au focus clavier ; rien sous `prefers-reduced-motion`. Les copies sont `aria-hidden`.
 */
export function MethodTrack({ steps, images, stepLabel, children }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const count = steps.length;

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    let pos = el.scrollLeft;
    let pausedUntil = 0;
    let hover = false;
    let holding = false;
    let visible = false;
    const pause = () => {
      pausedUntil = performance.now() + RESUME_MS;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!visible || hover || holding || now < pausedUntil || document.hidden) {
        // Le visiteur a la main : on repart de là où il a laissé la piste.
        pos = el.scrollLeft;
        return;
      }
      const w = seriesWidth(el, count);
      if (!w) return;
      // Les cartes glissent de gauche vers droite (demande du client) : la position recule ;
      // au début de la première série, on saute d'une série en avant (même contenu).
      pos -= SPEED * dt;
      if (pos < 0) {
        pos += w;
        el.scrollLeft = pos;
        pos = el.scrollLeft;
      }
      el.scrollLeft = pos;
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hover = true;
    };
    const onLeave = () => {
      hover = false;
    };
    const onDown = () => {
      holding = true;
    };
    const onUp = () => {
      holding = false;
      pause();
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("focusin", pause);
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    });
    io.observe(el);
    last = performance.now();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("focusin", pause);
    };
  }, [count]);

  const cards = [...steps, ...steps];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-[24px]">{children}</div>

      <div
        ref={track}
        className="mx-[calc(50%-50vw)] flex gap-[16px] overflow-x-auto pr-[16px] pb-[4px] pl-[max(clamp(16px,4vw,56px),calc(50vw-700px))] [scroll-padding-left:max(clamp(16px,4vw,56px),calc(50vw-700px))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((step, i) => {
          const n = i % count;
          const image = images[n];
          return (
            <article key={`${step.title}-${i}`} aria-hidden={i >= count || undefined} className="flex w-[min(78vw,320px)] shrink-0 grow-0 flex-col gap-[14px] min-[640px]:w-[clamp(280px,23vw,340px)]">
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
        })}
      </div>
    </>
  );
}
