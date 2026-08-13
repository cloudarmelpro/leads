import type { ReactNode } from "react";

type Props = { children: ReactNode };

/**
 * Eyebrow de section (style premium) : un point émeraude + le libellé en
 * majuscules espacées. Remplace l'ancienne pastille badge. À placer dans un
 * conteneur porteur de la marge / de l'animation (ex. `<p data-reveal className="mb-4">`).
 */
export function Eyebrow({ children }: Props) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-emeraude dark:bg-accent-strong" />
      <span className="text-[12px] font-semibold tracking-[0.2em] text-texte2 uppercase">
        {children}
      </span>
    </span>
  );
}
