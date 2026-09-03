import type { ReactNode } from "react";

type Props = { children: ReactNode };

/**
 * Eyebrow de section : un point vert + le libellé. Ne porte aucune marge : le
 * conteneur parent (ex. `<p className="mb-1">`) gère l'espacement.
 */
export function Eyebrow({ children }: Props) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="h-2 w-2 rounded-full bg-emeraude dark:bg-accent-strong" />
      <span className="text-[13px] leading-[20px] font-light tracking-[0.06em] text-texte2 uppercase sm:text-[12px]">
        {children}
      </span>
    </span>
  );
}
