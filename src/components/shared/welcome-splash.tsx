"use client";

import { useEffect } from "react";

// Clé mémorisée après le premier passage : l'écran ne se rejoue pas.
export const WELCOME_KEY = "talgasy-welcome-v3";
const SHOW_MS = 1600;
const FADE_MS = 380;

type Props = { before: string; after: string };

/**
 * Écran de bienvenue (maquette) : « Bienvenue chez [TG] Web », balayage vert de gauche
 * à droite, une seule fois par visiteur, puis fondu à 1,6 s (380 ms). Le script avant
 * peinture pose `html.welcome` quand la clé est absente : le voile est donc déjà
 * visible dans le HTML serveur ; ce composant ne fait que le retirer — au terme du
 * fondu, à la touche Échap ou au clic. Décoratif : `aria-hidden`.
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
    const dismiss = () => root.classList.remove("welcome");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    const remove = setTimeout(dismiss, SHOW_MS + FADE_MS + 100);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(remove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const word =
    "relative whitespace-nowrap text-[clamp(20px,2.6vw,31px)] leading-none font-medium tracking-[0.02em] uppercase text-ligne dark:text-[#012a3c]";
  const wave = "absolute top-[0px] left-[0px] text-vert";

  return (
    <div
      aria-hidden
      onClick={() => document.documentElement.classList.remove("welcome")}
      className="fixed inset-[0px] z-[95] hidden items-center justify-center bg-fond p-[24px] [html.welcome_&]:flex [html.welcome_&]:[animation:tw-splash-out_380ms_cubic-bezier(0.22,1,0.36,1)_1600ms_both]"
    >
      <div className="flex items-center gap-[10px] [animation:tw-lockup-in_700ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <span className={word}>
          {before}
          <span className={`${wave} [animation:tw-wave-text_1700ms_linear_infinite]`}>{before}</span>
        </span>
        <svg width="30" height="25" viewBox="0 0 169 140" fill="none" className="block shrink-0">
          <defs>
            <clipPath id="tw-wipe-t">
              <rect x="0" y="0" width="169" height="140" className="origin-top-left [animation:tw-wave-rect_1700ms_linear_200ms_infinite]" />
            </clipPath>
            <clipPath id="tw-wipe-g">
              <rect x="0" y="0" width="169" height="140" className="origin-top-left [animation:tw-wave-rect_1700ms_linear_400ms_infinite]" />
            </clipPath>
          </defs>
          <g className="fill-ligne dark:fill-[#012a3c]">
            <path d="M55.9557 140H34.6925V17.836H0L0 0L168.333 0V17.836L55.9557 17.836V140Z" />
            <path d="M168.333 45.7126H120.479V63.1308H147.898V121.028H102.853V27.4766H80.4709V140H168.333V45.7126Z" />
          </g>
          <path d="M55.9557 140H34.6925V17.836H0L0 0L168.333 0V17.836L55.9557 17.836V140Z" className="fill-vert" clipPath="url(#tw-wipe-t)" />
          <path d="M168.333 45.7126H120.479V63.1308H147.898V121.028H102.853V27.4766H80.4709V140H168.333V45.7126Z" className="fill-vert" clipPath="url(#tw-wipe-g)" />
        </svg>
        <span className={word}>
          {after}
          <span className={`${wave} [animation:tw-wave-text_1700ms_linear_600ms_infinite]`}>{after}</span>
        </span>
      </div>
    </div>
  );
}
