"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { type ThemeChoice, useTheme } from "@/lib/use-theme";

type Props = {
  label: string;
  optionLabels: { system: string; light: string; dark: string };
  variant?: "light" | "dark";
};

// Contrôle segmenté calqué sur `LanguageSwitcher` : Système / Clair / Sombre.
const OPTIONS: { value: ThemeChoice; Icon: typeof Monitor }[] = [
  { value: "system", Icon: Monitor },
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
];

export function ThemeToggle({ label, optionLabels, variant = "light" }: Props) {
  const { choice, setTheme } = useTheme();
  const dark = variant === "dark";

  const wrap = dark
    ? "inline-flex items-center gap-0.5 rounded-[12px] border border-white/25 bg-white/10 p-[3px]"
    : "inline-flex items-center gap-0.5 rounded-[11px] border border-surface bg-surface p-[3px]";
  const seg = dark ? "h-9 w-11" : "h-[26px] w-8";

  return (
    <div role="group" aria-label={label} className={wrap}>
      {OPTIONS.map(({ value, Icon }) => {
        const active = choice === value;
        const state = active
          ? dark
            ? "bg-white text-sapin"
            : "bg-emeraude text-white"
          : dark
            ? "text-white/70 hover:text-white"
            : "text-texte2 hover:text-encre";
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            aria-label={optionLabels[value]}
            title={optionLabels[value]}
            className={`inline-flex ${seg} cursor-pointer items-center justify-center rounded-[9px] transition-colors ${state}`}
          >
            <Icon size={dark ? 16 : 14} strokeWidth={2.2} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
