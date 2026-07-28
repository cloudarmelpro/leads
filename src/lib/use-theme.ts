"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";
const EVENT = "themechange";

const systemDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const isEffectiveDark = (choice: ThemeChoice) =>
  choice === "dark" || (choice === "system" && systemDark());

const readChoice = (): ThemeChoice => {
  if (typeof window === "undefined") return "system";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" ? v : "system";
};

/** Applique (ou retire) la classe `.dark` sur <html> selon le choix effectif. */
function applyClass(next?: ThemeChoice) {
  document.documentElement.classList.toggle("dark", isEffectiveDark(next ?? readChoice()));
}

/**
 * Thème 3 états (système / clair / sombre). La classe `.dark` est déjà posée
 * avant peinture par le script `theme-init` du layout ; ce hook lit/écrit le
 * choix (localStorage), applique la classe, et resynchronise TOUTES les instances
 * via un événement `themechange` (partagé entre le sélecteur de thème et l'embed
 * Cal.com). Départ « system » pour un rendu SSR/hydratation stable — la valeur
 * réelle est lue après montage.
 */
export function useTheme() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [isDark, setIsDark] = useState(false);

  const sync = useCallback(() => {
    const c = readChoice();
    setChoice(c);
    setIsDark(isEffectiveDark(c));
  }, []);

  useEffect(() => {
    sync();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (readChoice() === "system") {
        applyClass("system");
        sync();
      }
    };
    mq.addEventListener("change", onSystem);
    window.addEventListener(EVENT, sync);
    return () => {
      mq.removeEventListener("change", onSystem);
      window.removeEventListener(EVENT, sync);
    };
  }, [sync]);

  const setTheme = useCallback((next: ThemeChoice) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    applyClass(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { choice, isDark, setTheme };
}
