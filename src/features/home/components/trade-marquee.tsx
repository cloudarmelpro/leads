"use client";

import { useEffect, useRef } from "react";

import { tradePreviewBg } from "@/lib/preview-image";

type Demo = { trade: string };
type Props = { demos: Demo[]; label: string };

/**
 * Rangée d'images métier en défilement automatique INFINI (boucle continue).
 * Les cartes sont dupliquées : quand le défilement atteint la fin du premier jeu,
 * on retranche sa largeur — la copie identique rend la boucle invisible.
 *
 * A11y (non négociable) : défilement manuel toujours possible, pause au survol /
 * focus / toucher, et animation totalement désactivée sous `prefers-reduced-motion`.
 */
export function TradeMarquee({ demos, label }: Props) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    let frame = 0;
    const speed = 0.5; // px par frame ≈ 30px/s, dérive douce

    // Position gardée en flottant : `scrollLeft` (getter) arrondit à l'entier et
    // arrondit le .5 vers le haut, ce qui annulerait un pas négatif de 0,5px.
    // On accumule donc à part et on applique. Sens droite : on décroît depuis le milieu.
    let pos = el.scrollWidth / 2;
    el.scrollLeft = pos;

    const step = () => {
      if (!paused) {
        const half = el.scrollWidth / 2; // largeur d'un seul jeu de cartes
        pos -= speed;
        if (pos <= 0) pos += half; // bouclage invisible (le clone est identique)
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
      pos = el.scrollLeft; // resynchronise si l'utilisateur a défilé à la main
    };

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, []);

  // Jeu dupliqué : la seconde moitié est un clone visuel (masqué aux lecteurs d'écran).
  const cards = [...demos, ...demos];

  return (
    <div className="relative">
      <ul
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto pt-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={label}
      >
        {cards.map((demo, i) => {
          const index = i % demos.length;
          const isClone = i >= demos.length;
          return (
            <li key={i} className="shrink-0" aria-hidden={isClone || undefined}>
              <figure
                style={tradePreviewBg(index, 450, 600)}
                className="relative flex aspect-[3/4] w-[clamp(190px,25vw,290px)] items-end overflow-hidden rounded-3xl"
              >
                <figcaption className="w-full bg-[linear-gradient(transparent,rgba(15,29,23,.82))] p-4">
                  <span className="text-sm font-semibold text-white">{demo.trade}</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
