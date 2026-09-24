"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";
const EVENT = "themechange";

// Sans choix mémorisé (« system »), le site est sombre : les maquettes sont en bleu nuit
// (décision du 2026-09-24). Le script avant peinture applique la même règle.
const isEffectiveDark = (choice: ThemeChoice) => choice !== "light";

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
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

  const sync = useCallback(() => {
    const c = readChoice();
    setChoice(c);
    setIsDark(isEffectiveDark(c));
  }, []);

  // À chaque navigation client (ex. bascule fr ↔ en), le layout racine re-rend <html>
  // et React réécrit son attribut `class` avec la valeur serveur : la classe `.dark`,
  // posée hors React, disparaît et le site repasse en clair. On la remet avant la
  // peinture, à chaque changement de route.
  useLayoutEffect(() => {
    applyClass();
  }, [pathname]);

  useEffect(() => {
    // Lecture initiale du choix réel (localStorage/matchMedia, absents au SSR) :
    // sync unique au montage — volontaire pour un rendu SSR stable, puis correction
    // côté client. Ne se rejoue pas à chaque rendu.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    sync();

    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [sync]);

  const setTheme = useCallback((next: ThemeChoice) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    applyClass(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { choice, isDark, setTheme };
}
