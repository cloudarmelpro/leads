"use client";

import { useLayoutEffect, useState } from "react";

type Props = { label: string; brand: string };

// Clé partagée avec le script avant peinture (pre-paint-script.tsx), qui masque l'écran
// dès le HTML pour un visiteur qui l'a déjà vu.
export const WELCOME_KEY = "talgasy-welcome-v3";

const T = "M55.9557 140H34.6925V17.836H0L0 0L168.333 0V17.836L55.9557 17.836V140Z";
const G = "M168.333 45.7126H120.479V63.1308H147.898V121.028H102.853V27.4766H80.4709V140H168.333V45.7126Z";
const WORD = "relative text-[clamp(20px,2.6vw,31px)] leading-[1] font-medium tracking-[0.02em] whitespace-nowrap text-mot-accueil uppercase";
const WAVE = "absolute top-[0px] left-[0px] text-vert [animation:tw-wave-text_1700ms_linear_infinite]";

/**
 * Écran de bienvenue (maquette Accueil) : au premier passage seulement, « Bienvenue chez
 * [TG] Web » se remplit de vert de gauche à droite, puis s'efface après 2 s — ou tout de
 * suite à Échap ou au clic. Le passage est mémorisé (`localStorage`). Décoratif : masqué
 * aux lecteurs d'écran.
 */
export function WelcomeSplash({ label, brand }: Props) {
  const [open, setOpen] = useState(true);

  // Avant peinture : à une navigation client vers l'accueil, l'écran ne doit pas clignoter.
  useLayoutEffect(() => {
    let seen = true;
    try {
      seen = !!window.localStorage.getItem(WELCOME_KEY);
    } catch {
      // stockage bloqué : on ne montre pas l'écran, faute de pouvoir le retenir
    }
    if (seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
      return;
    }
    const close = () => {
      try {
        window.localStorage.setItem(WELCOME_KEY, "1");
      } catch {
        // rien à retenir
      }
      setOpen(false);
    };
    const timer = window.setTimeout(close, 2000);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", close);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", close);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      data-splash
      aria-hidden
      className="fixed inset-[0px] z-[95] flex items-center justify-center bg-fond p-[24px] [animation:tw-splash-out_380ms_cubic-bezier(0.22,1,0.36,1)_1600ms_both]"
    >
      <div className="flex flex-nowrap items-center justify-center gap-[10px] [animation:tw-lockup-in_700ms_cubic-bezier(0.22,1,0.36,1)_both]">
        <span className={WORD}>
          {label}
          <span className={WAVE}>{label}</span>
        </span>
        <svg width="30" height="25" viewBox="0 0 169 140" fill="none" className="block">
          <defs>
            <clipPath id="tw-splash-t">
              <rect x="0" y="0" width="169" height="140" className="origin-[0px_0px] [animation:tw-wave-rect_1700ms_linear_200ms_infinite]" />
            </clipPath>
            <clipPath id="tw-splash-g">
              <rect x="0" y="0" width="169" height="140" className="origin-[0px_0px] [animation:tw-wave-rect_1700ms_linear_400ms_infinite]" />
            </clipPath>
          </defs>
          <path d={T} fill="var(--color-mot-accueil)" />
          <path d={G} fill="var(--color-mot-accueil)" />
          <path d={T} fill="var(--color-vert)" clipPath="url(#tw-splash-t)" />
          <path d={G} fill="var(--color-vert)" clipPath="url(#tw-splash-g)" />
        </svg>
        <span className={WORD}>
          {brand}
          <span className={`${WAVE} [animation-delay:600ms]`}>{brand}</span>
        </span>
      </div>
    </div>
  );
}
