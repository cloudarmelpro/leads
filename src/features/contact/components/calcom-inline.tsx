"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

import { useTheme } from "@/lib/use-theme";

type Props = { calLink: string };

// Namespace de l'événement Cal.com (doit correspondre à celui du <Cal>).
const NAMESPACE = "leads";

/**
 * Variables de thème Cal.com alignées sur les tokens du site (globals.css) : même
 * fond que nos cartes, mêmes filets, mêmes gris de texte, vert de la marque.
 * Valeurs codées en dur : l'iframe Cal.com ne voit pas nos variables CSS.
 */
const CAL_VARS = {
  light: {
    "cal-bg": "#ffffff", // surface
    "cal-bg-emphasis": "#e7f2eb", // menthe — jours disponibles, survols
    "cal-bg-subtle": "#f5f5f6", // surface-2
    "cal-bg-muted": "#fdfdfd", // fond
    "cal-bg-inverted": "#1e1e1e",
    "cal-border": "#e8e8ea", // ligne
    "cal-border-emphasis": "#d4d4d8",
    "cal-border-subtle": "#e8e8ea",
    "cal-border-booker": "#e8e8ea",
    "cal-border-muted": "#e8e8ea",
    "cal-text": "#646468", // texte2
    "cal-text-emphasis": "#1e1e1e", // encre
    "cal-text-subtle": "#8a8a8f",
    "cal-text-muted": "#a1a1a6",
    "cal-text-inverted": "#ffffff",
    "cal-brand": "#177e4f", // emeraude
    "cal-brand-emphasis": "#14402f", // sapin
    "cal-brand-text": "#ffffff",
  },
  dark: {
    "cal-bg": "#011b28", // surface
    "cal-bg-emphasis": "#04283a", // menthe (sombre)
    "cal-bg-subtle": "#012232", // surface-2
    "cal-bg-muted": "#011823", // fond
    "cal-bg-inverted": "#ffffff",
    "cal-border": "#012232", // ligne
    "cal-border-emphasis": "#0b3a50",
    "cal-border-subtle": "#012232",
    "cal-border-booker": "#012232",
    "cal-border-muted": "#012232",
    "cal-text": "#bfbfbf", // texte2
    "cal-text-emphasis": "#ffffff", // encre
    "cal-text-subtle": "#8fa3ad",
    "cal-text-muted": "#6b8390",
    "cal-text-inverted": "#011823",
    "cal-brand": "#30d98c", // accent-strong
    "cal-brand-emphasis": "#7fefc0",
    "cal-brand-text": "#011823",
  },
};

/**
 * Embed inline Cal.com, habillé aux couleurs du site via `cssVarsPerTheme` et
 * suivant le thème effectif (clair/sombre). Le script Cal.com est chargé par le
 * package embed-react.
 *
 * ⚠️ Importer ce fichier déclenche l'appel à cal.com. Il ne doit être chargé que via
 * l'import dynamique de `calcom-embed.tsx`, après consentement (Loi 25).
 */
export function CalcomInline({ calLink }: Props) {
  const { isDark } = useTheme();

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        cssVarsPerTheme: CAL_VARS,
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    // `config.theme` n'est lu qu'au chargement de l'iframe (l'API `ui` ne rebascule
    // pas le thème) : la clé force un remontage si l'utilisateur change de thème
    // pendant que le calendrier est affiché.
    <Cal
      key={isDark ? "dark" : "light"}
      namespace={NAMESPACE}
      calLink={calLink}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", theme: isDark ? "dark" : "light" }}
    />
  );
}
