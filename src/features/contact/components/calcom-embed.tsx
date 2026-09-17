"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  COOKIE_CHOICE_EVENT,
  readCookieChoice,
  type CookieChoice,
} from "@/components/shared/cookie-consent";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// `ssr: false` + import dynamique : le bundle Cal.com (et donc toute requête vers
// *.cal.com) n'est téléchargé qu'au montage de ce composant, jamais au chargement
// de la page. C'est ce qui rend le consentement effectif et non cosmétique.
const CalcomInline = dynamic(
  () => import("@/features/contact/components/calcom-inline").then((m) => m.CalcomInline),
  { ssr: false },
);

type Props = {
  calLink: string;
  dict: { contactPage: Pick<Dictionary["contactPage"], "booking"> };
  /** Vrai quand le visiteur vient de cliquer « Afficher le calendrier » (avis lu) : pas de seconde porte. */
  initiallyLoaded?: boolean;
};

/**
 * Porte de consentement devant l'embed Cal.com (Loi 25) : afficher le calendrier
 * transmet l'adresse IP du visiteur à un tiers. Tant que le choix mémorisé n'est pas
 * « accepté », on rend une carte de remplacement et RIEN de Cal.com n'est chargé.
 */
export function CalcomEmbed({ calLink, dict, initiallyLoaded = false }: Props) {
  const t = dict.contactPage.booking;
  const [loaded, setLoaded] = useState(initiallyLoaded);

  useEffect(() => {
    // localStorage est indisponible au SSR : la synchronisation ne peut avoir lieu
    // qu'après le montage, sinon l'hydratation diverge.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readCookieChoice() === "accepted") setLoaded(true);

    const onChoice = (event: Event) => {
      if ((event as CustomEvent<CookieChoice>).detail === "accepted") setLoaded(true);
    };
    window.addEventListener(COOKIE_CHOICE_EVENT, onChoice);
    return () => window.removeEventListener(COOKIE_CHOICE_EVENT, onChoice);
  }, []);

  if (loaded) return <CalcomInline calLink={calLink} />;

  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[20px] bg-surface px-6 py-12 text-center shadow-[inset_0_0_0_1px_var(--color-ligne)]">
      <p className="font-display text-lg text-encre">{t.loadTitle}</p>
      <p className="mt-3 max-w-[52ch] text-sm leading-[1.6] text-texte2 text-pretty">
        {t.loadBody}
      </p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="tap-44 mt-6 cursor-pointer rounded-[8px] bg-vert px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-sur-vert transition-colors hover:bg-vert-clair"
      >
        {t.loadCta}
      </button>
    </div>
  );
}
