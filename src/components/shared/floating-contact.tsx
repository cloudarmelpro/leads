"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { site, telHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "floating"> };

/**
 * Bulle d'appel flottante (maquette Accueil) : 52×52 en bas à droite, appel direct.
 * Se soulève de 2px au survol. Masquée pendant que la barre du bas du pied de page
 * (`data-fab-avoid`) est à l'écran : elle recouvrirait « Gérer mes témoins ».
 * Sans numéro confirmé, rien n'est rendu : un bouton qui n'appelle pas mentirait.
 */
export function FloatingContact({ dict }: Props) {
  const [footerBarVisible, setFooterBarVisible] = useState(false);
  const tel = telHref(site.phone);

  useEffect(() => {
    const target = document.querySelector("[data-fab-avoid]");
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setFooterBarVisible(entry.isIntersecting);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!tel) return null;

  return (
    <a
      href={tel}
      data-floating-contact
      aria-label={dict.floating.aria.replace("{phone}", site.phone ?? "")}
      className={`fixed right-[calc(16px+env(safe-area-inset-right))] bottom-[calc(16px+env(safe-area-inset-bottom))] z-40 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-vert text-sur-vert no-underline shadow-[0_8px_24px_rgba(1,24,35,0.5)] transition-[background-color,transform,opacity] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[2px] hover:bg-vert-clair ${
        footerBarVisible ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <Phone size={20} strokeWidth={2.2} aria-hidden />
    </a>
  );
}
