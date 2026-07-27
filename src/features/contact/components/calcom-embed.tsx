"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

type Props = { calLink: string };

// Namespace de l'événement Cal.com (doit correspondre à celui du <Cal>).
const NAMESPACE = "leads";

/**
 * Embed inline Cal.com. Marqué au vert de la marque via `cssVarsPerTheme`
 * (`cal-brand`). Thème clair forcé : le site n'a pas de mode sombre, un embed
 * sombre jurerait. Le script Cal.com est chargé par le package embed-react.
 */
export function CalcomEmbed({ calLink }: Props) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#177e4f" },
          dark: { "cal-brand": "#177e4f" },
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
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
