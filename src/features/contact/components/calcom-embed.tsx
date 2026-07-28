"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

import { useTheme } from "@/lib/use-theme";

type Props = { calLink: string };

// Namespace de l'événement Cal.com (doit correspondre à celui du <Cal>).
const NAMESPACE = "leads";

/**
 * Embed inline Cal.com. Marqué au vert de la marque via `cssVarsPerTheme`
 * (`cal-brand`). Suit le thème du site (clair/sombre) : le calendrier adopte le
 * thème effectif courant. Le script Cal.com est chargé par le package embed-react.
 */
export function CalcomEmbed({ calLink }: Props) {
  const { isDark } = useTheme();

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#177e4f" },
          dark: { "cal-brand": "#35c489" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace={NAMESPACE}
      calLink={calLink}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", theme: isDark ? "dark" : "light" }}
    />
  );
}
