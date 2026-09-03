"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/use-theme";

type Props = {
  label: string;
  optionLabels: { system: string; light: string; dark: string };
};

/**
 * Bascule de thème (design refonte) : un seul bouton rond vert. Affiche le soleil
 * en mode sombre (clic → clair) et la lune en mode clair (clic → sombre). Bascule
 * clair ↔ sombre à 2 états (l'option « système » n'est pas exposée, conforme au design).
 */
export function ThemeToggle({ label, optionLabels }: Props) {
  const { isDark, setTheme } = useTheme();
  const next = isDark ? "light" : "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${label} — ${optionLabels[next]}`}
      title={optionLabels[next]}
      className="tap-44 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-emeraude text-white transition-colors hover:bg-emeraude/90 dark:bg-accent-strong dark:text-fond dark:hover:bg-accent-strong/90"
    >
      <Icon size={16} strokeWidth={2} aria-hidden />
    </button>
  );
}
