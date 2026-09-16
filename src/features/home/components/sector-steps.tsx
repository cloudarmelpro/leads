"use client";

import { useEffect, useState } from "react";

type Props = { names: string[]; aria: string };

/**
 * Étapes numérotées de la section Secteurs (référence : « 1 — 2 — 3 »). L'étape active
 * suit la carte empilée qui occupe le haut de l'écran : un IntersectionObserver sur les
 * cartes (`[data-sector-card]` de la même section), aucun écouteur de défilement.
 */
export function SectorSteps({ names, aria }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-sector-card]"));
    if (cards.length === 0) return;
    // Bande de détection : la ligne située juste sous l'en-tête collant de la section.
    // Les cartes empilees restent toutes sous la derniere arrivee : la plus haute dans
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
    return () => observer.disconnect();
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
