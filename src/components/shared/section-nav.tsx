"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

const SECTION_IDS = ["accueil", "secteurs", "services", "methode", "faq"] as const;

/**
 * Navigation flottante persistante (inspirée de sesame.com) : reste visible au
 * défilement, là où le header non collant disparaît. Fond translucide léger —
 * nécessaire ici car la page comporte une section sombre et des images.
 * Desktop seulement : sur mobile, le menu hamburger tient ce rôle.
 */
export function SectionNav({ lang, dict }: Props) {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");

  // Ré-exécuté à chaque navigation : sinon l'état actif reste figé sur la
  // dernière section de l'accueil quand on passe sur une autre page (les
  // sections observées ont disparu, mais l'observateur gardait sa valeur).
  useEffect(() => {
    setActive("");

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
  }, [pathname]);

  // Ancres de l'accueil (avec scroll-spy), puis pages dédiées à la fin —
  // même logique d'ordre que le header.
  const anchors = [
    { id: "accueil", label: dict.nav.home },
    { id: "secteurs", label: dict.nav.sectors },
    { id: "services", label: dict.nav.services },
    { id: "methode", label: dict.nav.method },
    { id: "faq", label: dict.nav.faq },
  ];
  const pages = [
    { href: `/${lang}/a-propos`, label: dict.nav.about },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <nav
      aria-label={dict.nav.quickNav}
      className="fixed right-4 bottom-[calc(78px+env(safe-area-inset-bottom))] z-70 hidden flex-col items-end gap-2 rounded-2xl bg-surface px-4 py-3 md:flex"
    >
      {anchors.map((item) => {
        const isActive = active === item.id;
        return (
          <Link
            key={item.id}
            href={`/${lang}#${item.id}`}
            aria-current={isActive ? "true" : undefined}
            className={`text-sm transition-colors ${
              isActive ? "font-semibold text-encre" : "text-texte2 hover:text-encre"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <span aria-hidden className="my-0.5 h-px w-5 bg-ligne" />

      {pages.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={`text-sm transition-colors ${
              isActive ? "font-semibold text-encre" : "text-texte2 hover:text-encre"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
