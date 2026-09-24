"use client";

import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { site, telHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "floating"> };

/**
 * Bulle d'appel flottante (maquette Accueil) : 52×52 en bas à droite, appel direct.
 * Se soulève de 2px au survol. Masquée tant qu'une zone `data-fab-avoid` est à l'écran :
 * la barre du bas du pied de page (elle recouvrirait « Gérer mes témoins ») et le hero de
 * l'accueil (il porte déjà le bouton d'appel, et la bulle masquait sa pastille Secteurs).
 * Sans numéro confirmé, rien n'est rendu : un bouton qui n'appelle pas mentirait.
 */
export function FloatingContact({ dict }: Props) {
  const [avoidVisible, setAvoidVisible] = useState(false);
  // Les zones à éviter changent d'une page à l'autre : on les relit à chaque navigation.
  const pathname = usePathname();
  const tel = telHref(site.phone);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-fab-avoid]");
    if (targets.length === 0) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setAvoidVisible(visible.size > 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  if (!tel) return null;

  return (
    <a
      href={tel}
      data-floating-contact
      aria-label={dict.floating.aria.replace("{phone}", site.phone ?? "")}
      className={`fixed right-[calc(16px+env(safe-area-inset-right))] bottom-[calc(16px+env(safe-area-inset-bottom))] z-40 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-vert text-sur-vert no-underline shadow-[0_8px_24px_rgba(1,24,35,0.5)] transition-[background-color,transform,opacity] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[2px] hover:bg-vert-clair ${
        avoidVisible ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <Phone size={20} strokeWidth={2.2} aria-hidden />
    </a>
  );
}
