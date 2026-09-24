"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/use-theme";

type Props = {
  label: string;
  optionLabels: { system: string; light: string; dark: string };
  /** `glass` (en-tête, 40×40 en verre) ou `solid` (menu mobile, 34×34 vert plein). */
  variant?: "glass" | "solid";
};

const LOOK: Record<NonNullable<Props["variant"]>, string> = {
  glass:
    "h-[40px] w-[40px] bg-verre text-encre shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] hover:bg-verre-fort",
  solid: "h-[34px] w-[34px] bg-vert text-sur-vert hover:bg-vert-clair",
};

/**
 * Bascule de thème (maquette Accueil) : soleil en sombre (clic → clair), lune en clair
 * (clic → sombre). Deux états ; le site est sombre tant que le visiteur n'a rien choisi.
 */
export function ThemeToggle({ label, optionLabels, variant = "glass" }: Props) {
  const { isDark, setTheme } = useTheme();
  const next = isDark ? "light" : "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${label} — ${optionLabels[next]}`}
      title={optionLabels[next]}
      className={`tap-44 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[8px] transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${LOOK[variant]}`}
    >
      <Icon size={17} strokeWidth={2} aria-hidden />
    </button>
  );
}
