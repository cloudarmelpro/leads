"use client";

import type { ReactNode } from "react";

type Props = {
  id: string;
  open: boolean;
  onToggle: () => void;
  /** Numéro d'étape (« 01 ») affiché avant le titre — absent dans la FAQ. */
  number?: string;
  title: string;
  children: ReactNode;
  /** Retrait gauche de la réponse : 60px sous un numéro, 24px sinon. */
  bodyIndent: 60 | 24;
};

/**
 * Ligne d'accordéon de la maquette (Méthode et FAQ) : carte à 16px de rayon, bouton
 * de 64px minimum, titre sur une ligne coupé par points de suspension quand fermé,
 * indicateur plus/moins (deux barres, celle du dessus pivote de 90° à 0° sur 300ms).
 */
export function AccordionRow({ id, open, onToggle, number, title, children, bodyIndent }: Props) {
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div className="overflow-hidden rounded-[16px] bg-surface ring-1 ring-ligne ring-inset dark:ring-0">
      <h3 className="m-[0px]">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-[64px] w-full cursor-pointer items-center gap-[20px] px-[24px] py-[20px] text-left"
        >
          {number && (
            <span className="shrink-0 text-[13px] leading-[24px] font-medium tracking-[0.08em] text-vert">{number}</span>
          )}
          <span
            className={`min-w-[0px] flex-1 overflow-hidden text-[16px] leading-[24px] font-medium text-encre text-ellipsis ${
              open ? "whitespace-normal" : "whitespace-nowrap"
            }`}
          >
            {title}
          </span>
          <span aria-hidden className="relative block h-[11px] w-[11px] shrink-0">
            <span className="absolute top-[4.5px] left-[0px] block h-[2px] w-[11px] rounded-[2px] bg-vert" />
            <span
              className={`absolute top-[4.5px] left-[0px] block h-[2px] w-[11px] rounded-[2px] bg-vert transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                open ? "rotate-0" : "rotate-90"
              }`}
            />
          </span>
        </button>
      </h3>
      {open && (
        <div id={panelId} role="region" aria-labelledby={buttonId}>
          <p
            className={`m-[0px] max-w-[760px] pr-[24px] pb-[22px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty ${
              bodyIndent === 60 ? "pl-[60px]" : "pl-[24px]"
            }`}
          >
            {children}
          </p>
        </div>
      )}
    </div>
  );
}
