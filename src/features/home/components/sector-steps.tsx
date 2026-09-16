"use client";

import { useEffect, useState } from "react";

type Props = { names: string[]; aria: string };

// Rétrécissement maximal d'une carte quand la suivante la recouvre entièrement.
const SHRINK = 0.06;

/**
 * Étapes numérotées de la section Secteurs (référence : « 1 — 2 — 3 ») et effet
 * d'empilement : l'étape active suit la carte qui occupe le haut de l'écran
 * (IntersectionObserver), et chaque carte se rétrécit légèrement, depuis son bord haut,
 * à mesure que la suivante glisse par-dessus (lecture de la position au défilement,
 * une frame à la fois, `transform` seulement). Rien sous `prefers-reduced-motion`.
 */
export function SectorSteps({ names, aria }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-sector-card]"));
    if (cards.length === 0) return;

    // Les cartes empilées restent toutes sous la dernière arrivée : la plus haute dans
    // l'ordre parmi celles qui croisent la bande est celle que le visiteur voit.
    const inBand = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number(entry.target.getAttribute("data-sector-card"));
          if (entry.isIntersecting) inBand.add(index);
          else inBand.delete(index);
        }
        if (inBand.size > 0) setActive(Math.max(...inBand));
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
    );
    cards.forEach((card) => observer.observe(card));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return () => observer.disconnect();

    let frame = 0;
    const paint = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (let i = 0; i < cards.length - 1; i++) {
        const next = cards[i + 1];
        const stuckTop = parseFloat(getComputedStyle(next).top) || 0;
        // 0 quand la carte suivante entre par le bas, 1 quand elle est collée à sa place.
        const progress = Math.min(1, Math.max(0, (viewport - next.getBoundingClientRect().top) / (viewport - stuckTop)));
        cards[i].style.transform = progress > 0 ? `scale(${1 - SHRINK * progress})` : "";
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      cards.forEach((card) => (card.style.transform = ""));
    };
  }, []);

  return (
    <ol className="m-[0px] flex list-none items-center p-[0px]" aria-label={names.join(", ")}>
      {names.map((name, index) => {
        const on = index === active;
        return (
          <li key={name} className="flex items-center">
            {index > 0 && <span aria-hidden className="mx-[4px] h-px w-[clamp(6px,1.6vw,28px)] border-t border-dashed border-contour min-[620px]:mx-[6px]" />}
            <span
              aria-label={aria.replace("{n}", String(index + 1)).replace("{total}", String(names.length)).replace("{name}", name)}
              aria-current={on ? "step" : undefined}
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-[13px] leading-none font-medium tabular-nums transition-colors duration-300 min-[620px]:h-[36px] min-[620px]:w-[36px] min-[620px]:text-[14px] ${
                on ? "bg-vert text-sur-vert" : "text-texte2 ring-1 ring-contour ring-inset"
              }`}
            >
              {index + 1}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
