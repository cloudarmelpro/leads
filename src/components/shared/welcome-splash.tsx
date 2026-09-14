"use client";

import { useEffect } from "react";

// Clé mémorisée après le premier passage : l'écran ne se rejoue pas.
export const WELCOME_KEY = "talgasy-welcome-v3";
const SHOW_MS = 1900;
const FADE_MS = 450;

type Props = { before: string; after: string };

/**
 * Écran de bienvenue (design « Ecran de bienvenue ») : « Bienvenue chez [TG] Web »,
 * balayage vert de gauche à droite, une seule fois par visiteur, ~2 s puis fondu.
 * Le script avant peinture pose `html.welcome` quand la clé est absente : le voile
 * est donc déjà visible dans le HTML serveur (pas d'apparition tardive) ; ce
 * composant ne fait que le retirer. Décoratif : `aria-hidden`.
 */
export function WelcomeSplash({ before, after }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("welcome")) return;
    try {
      localStorage.setItem(WELCOME_KEY, "1");
    } catch {
      /* stockage indisponible : l'écran se rejouera, sans conséquence */
    }
    // Le fondu de sortie est une animation CSS (tw-splash-out) : il part dès la
    // peinture, sans attendre l'hydratation. Ici on ne fait que retirer le voile du DOM.
    const remove = setTimeout(() => root.classList.remove("welcome"), SHOW_MS + FADE_MS + 100);
    return () => clearTimeout(remove);
  }, []);

  const word = "relative whitespace-nowrap font-display text-[clamp(1.25rem,2.6vw,1.9375rem)] leading-none font-medium tracking-[0.02em] uppercase text-ligne";
  const wave = "absolute top-0 left-0 text-emeraude dark:text-accent-strong";

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] hidden items-center justify-center bg-fond p-6 [html.welcome_&]:flex [html.welcome_&]:[animation:tw-splash-out_450ms_ease-out_1900ms_forwards]"
    >
      <div className="flex items-center gap-2.5 [animation:tw-lockup-in_700ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <span className={word}>
          {before}
          <span className={`${wave} [animation:tw-wave-text_1700ms_linear_infinite]`}>{before}</span>
        </span>
        <svg width="30" height="25" viewBox="0 0 169 140" fill="none" className="block shrink-0">
          <defs>
            <clipPath id="tw-wipe">
              <rect x="0" y="0" width="169" height="140" className="origin-top-left [animation:tw-wave-rect_1700ms_linear_200ms_infinite]" />
            </clipPath>
          </defs>
          <path d="M55.9557 140H34.6925V17.836H0L0 0L168.333 0V17.836L55.9557 17.836V140Z" className="fill-ligne" />
          <path d="M168.333 45.7126H120.479V63.1308H147.898V121.028H102.853V27.4766H80.4709V140H168.333V45.7126Z" className="fill-ligne" />
          <g clipPath="url(#tw-wipe)" className="fill-emeraude dark:fill-accent-strong">
            <path d="M55.9557 140H34.6925V17.836H0L0 0L168.333 0V17.836L55.9557 17.836V140Z" />
            <path d="M168.333 45.7126H120.479V63.1308H147.898V121.028H102.853V27.4766H80.4709V140H168.333V45.7126Z" />
          </g>
        </svg>
        <span className={word}>
          {after}
          <span className={`${wave} [animation:tw-wave-text_1700ms_linear_600ms_infinite]`}>{after}</span>
        </span>
      </div>
    </div>
  );
}
