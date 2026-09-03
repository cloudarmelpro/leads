import type { CSSProperties } from "react";

// Le monogramme est un SVG à une seule couleur : on l'utilise en MASQUE pour le
// recolorer selon le thème via `currentColor` (émeraude en clair / vert vif en sombre).
const monoMask: CSSProperties = {
  maskImage: "url(/talgasy-monogram.svg)",
  WebkitMaskImage: "url(/talgasy-monogram.svg)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
};

type Props = {
  /** Masque « Talgasy Web » sous 640px (header : monogramme seul sur mobile). */
  hideTextOnMobile?: boolean;
  className?: string;
};

/**
 * Logo « Talgasy Web » (design refonte) : monogramme « T » (recoloré par thème via
 * masque) + « Talgasy » (Outfit SemiBold) + « Web » (Geist Mono, gris). Le texte reste
 * du vrai texte (lisible par les lecteurs d'écran) ; seul le monogramme est décoratif.
 */
export function Wordmark({ hideTextOnMobile = false, className }: Props) {
  return (
    <span className={`inline-flex items-center gap-[0.5625rem] ${className ?? ""}`}>
      <span
        aria-hidden
        style={monoMask}
        className="block h-7 w-[33px] shrink-0 bg-current text-emeraude sm:h-8 sm:w-[38px] dark:text-accent-strong"
      />
      <span
        className={`items-baseline gap-[0.3125rem] leading-none ${hideTextOnMobile ? "hidden sm:flex" : "flex"}`}
      >
        <span
          className="font-display text-[1.375rem] font-semibold text-encre"
        >
          Talgasy
        </span>
        <span className="font-mono text-[1rem] text-texte2">
          Web
        </span>
      </span>
    </span>
  );
}
