"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/use-theme";

type Props = {
  label: string;
  optionLabels: { system: string; light: string; dark: string };
  /** `square` (en-tête, rayon 9px) ou `round` (menu mobile, pastille). */
  shape?: "square" | "round";
};

/**
 * Bascule de thème (maquette Accueil) : bouton vert 34×34, soleil en sombre
 * (clic → clair), lune en clair (clic → sombre). Deux états ; « système » n'est pas
 * exposé, conformément à la maquette.
 */
export function ThemeToggle({ label, optionLabels, shape = "square" }: Props) {
  const { isDark, setTheme } = useTheme();
  const next = isDark ? "light" : "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${label} — ${optionLabels[next]}`}
      title={optionLabels[next]}
      className={`tap-44 inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center bg-surface-2 text-encre ring-1 ring-contour ring-inset transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-surface-3 ${
        shape === "round" ? "rounded-full" : "rounded-[8px]"
      }`}
    >
      <Icon size={17} strokeWidth={2} aria-hidden />
    </button>
  );
}
