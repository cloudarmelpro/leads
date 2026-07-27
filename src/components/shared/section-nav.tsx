"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

const SECTION_IDS = ["accueil", "services", "methode", "faq", "contact"] as const;

/**
 * Navigation flottante persistante (inspirée de sesame.com) : reste visible au
 * défilement, là où le header non collant disparaît. Fond translucide léger —
 * nécessaire ici car la page comporte une section sombre et des images.
 * Desktop seulement : sur mobile, le menu hamburger tient ce rôle.
 */
export function SectionNav({ lang, dict }: Props) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    // Bande active fine vers le haut de l'écran : la section qui la traverse gagne.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const items = [
    { id: "accueil", label: dict.nav.home },
    { id: "services", label: dict.nav.services },
    { id: "methode", label: dict.nav.method },
    { id: "faq", label: dict.nav.faq },
    { id: "contact", label: dict.nav.contact },
  ];

  return (
    <nav
      aria-label={dict.nav.quickNav}
      className="fixed right-4 bottom-[calc(78px+env(safe-area-inset-bottom))] z-70 hidden flex-col items-end gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_30px_-14px_rgba(15,29,23,.3)] md:flex"
    >
      {items.map((item, index) => {
        const isActive = active === item.id;
        return (
          <Fragment key={item.id}>
            {index === items.length - 1 && (
              <span aria-hidden className="my-0.5 h-px w-5 bg-ligne" />
            )}
            <Link
              href={`/${lang}#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className={`text-sm transition-colors ${
                isActive ? "font-semibold text-encre" : "text-texte2 hover:text-encre"
              }`}
            >
              {item.label}
            </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}
