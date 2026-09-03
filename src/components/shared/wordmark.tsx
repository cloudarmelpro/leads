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
  /** Force la variante claire sur fond foncé (menu mobile `bg-sapin`). */
  onDark?: boolean;
  /** Masque « Talgasy Web » sous 640px (header : monogramme seul sur mobile). */
  hideTextOnMobile?: boolean;
  className?: string;
};

/**
 * Logo « Talgasy Web » (design refonte) : monogramme « T » (recoloré par thème via
 * masque) + « Talgasy » (Outfit Bold) + « Web » (Geist Mono, gris). Le texte reste
 * du vrai texte (lisible par les lecteurs d'écran) ; seul le monogramme est décoratif.
 */
export function Wordmark({ onDark = false, hideTextOnMobile = false, className }: Props) {
  return (
    <span className={`inline-flex items-center gap-[9px] ${className ?? ""}`}>
      <span
        aria-hidden
        style={monoMask}
        className={`block h-7 w-[33px] shrink-0 bg-current sm:h-8 sm:w-[38px] ${
          onDark ? "text-accent-strong" : "text-emeraude dark:text-accent-strong"
        }`}
      />
      <span
        className={`items-baseline gap-[5px] leading-none ${hideTextOnMobile ? "hidden sm:flex" : "flex"}`}
      >
        <span
          className={`font-display text-[22px] font-bold ${onDark ? "text-white" : "text-encre"}`}
        >
          Talgasy
        </span>
        <span className={`font-mono text-[16px] ${onDark ? "text-white/70" : "text-texte2"}`}>
          Web
        </span>
      </span>
    </span>
  );
}
