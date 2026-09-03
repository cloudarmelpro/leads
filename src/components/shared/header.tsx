"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { CONTENEUR } from "@/components/shared/container";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Wordmark } from "@/components/shared/wordmark";
import { site, telHref, whatsappHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function Header({ lang, dict }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  // Le tiroir reste monté le temps de son animation de sortie : `menuOpen` pilote
  // l'état logique, `drawerMounted` la présence dans le DOM.
  const [drawerMounted, setDrawerMounted] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    setDrawerMounted(true);
    setMenuOpen(true);
  };

  // Ouverture : fondu + glissement du panneau, entrées de nav en cascade.
  // Fermeture : fondu inverse, puis démontage. Instantané sous reduced-motion.
  useGSAP(
    () => {
      const el = drawerRef.current;
      if (!el || !drawerMounted) return;
      const fast = reducedMotion();
      if (menuOpen) {
        gsap.fromTo(el, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: fast ? 0 : 0.35, ease: "power2.out" });
        gsap.fromTo(
          el.querySelectorAll("nav a"),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: fast ? 0 : 0.35, stagger: fast ? 0 : 0.04, delay: fast ? 0 : 0.08, ease: "power2.out" },
        );
      } else {
        gsap.to(el, {
          autoAlpha: 0,
          y: -16,
          duration: fast ? 0 : 0.25,
          ease: "power2.in",
          onComplete: () => setDrawerMounted(false),
        });
      }
    },
    { dependencies: [menuOpen, drawerMounted] },
  );

  const phoneLabel = site.phone ?? dict.placeholders.phone;
  const whatsappLabel = site.whatsapp ?? dict.placeholders.whatsapp;

  // Ordre du design : Services, Secteurs, Méthode, FAQ, Prix, À propos, Blog.
  // Le Contact est porté par le bouton d'action à droite (pas dans la nav).
  const nav = [
    { label: dict.nav.services, href: `/${lang}#services` },
    { label: dict.nav.sectors, href: `/${lang}#secteurs` },
    { label: dict.nav.method, href: `/${lang}#methode` },
    { label: dict.nav.faq, href: `/${lang}#faq` },
    { label: dict.nav.pricing, href: `/${lang}/prix` },
    { label: dict.nav.about, href: `/${lang}/a-propos` },
    { label: dict.nav.blog, href: `/${lang}/blog` },
  ];

  // Le menu plein écran ne doit pas laisser la page défiler derrière lui.
  // Focus : à l'ouverture sur « Fermer » ; toute fermeture (croix, Échap, lien)
  // passe par le cleanup, qui rend le focus au burger.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    const burger = burgerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      {/* Barre transparente, dans le flux (non collante) — comme la référence.
          Le module de contact flottant assure l'appel toujours accessible au défilement. */}
      {/* Marge horizontale sur le <header>, pas sur le conteneur max-w : c'est le
          patron des sections. La mettre à l'intérieur décalerait le logo de 32px. */}
      <header className="relative z-50 w-full">
        {/* Logo à gauche · nav au centre · actions à droite (design : justify-between). */}
        <div className={`${CONTENEUR} flex min-h-17 items-center justify-between gap-2 py-4 sm:gap-6`}>
            <Link
              href={`/${lang}`}
              className="shrink-0 text-encre no-underline"
            >
              <Wordmark hideTextOnMobile />
            </Link>

            {/* Logo + 6 liens + contrôles ≈ 910px : sous `lg`, la nav passe dans le
                tiroir (burger), sinon le logo chevauche « Services » sur tablette. */}
            <nav
              aria-label={dict.nav.quickNav}
              className="hidden items-center gap-2 lg:flex"
            >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-1 whitespace-nowrap text-sm font-normal text-encre no-underline hover:text-emeraude dark:hover:text-accent-strong"
              >
                {item.label}
              </Link>
            ))}
            </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <ThemeToggle
              label={dict.header.themeAria}
              optionLabels={dict.header.theme}
            />
            {/* Sous 380px, la langue reste accessible via le tiroir mobile. */}
            <LanguageSwitcher
              current={lang}
              label={dict.header.langAria}
              className="hidden min-[380px]:inline-flex"
            />

            {/* Bouton « Contact » (design). L'appel direct reste porté par le module flottant. */}
            <Link
              href={`/${lang}/contact`}
              className="hidden shrink-0 items-center rounded-[9px] bg-emeraude px-[18px] py-[9px] text-[14px] font-medium text-white no-underline hover:bg-[#7fefc0] hover:text-fond md:inline-flex dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
            >
              {dict.nav.contact}
            </Link>

            <button
              ref={burgerRef}
              type="button"
              onClick={openMenu}
              aria-label={dict.common.openMenu}
              aria-expanded={menuOpen}
              className="tap-44 inline-flex h-8 w-8 items-center justify-center cursor-pointer rounded-xl bg-surface text-encre lg:hidden"
            >
              <Menu size={16} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {drawerMounted && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.quickNav}
          className="fixed inset-0 z-100 flex flex-col overflow-auto overscroll-contain bg-fond px-[clamp(16px,5vw,28px)] pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] text-encre"
        >
          <div className="flex min-h-14 items-center justify-between">
            <Wordmark />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={dict.common.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-none bg-surface text-encre dark:bg-surface-2"
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          {/* Écrans courts (320×568) : entrées compactées pour que les CTA du bas
              restent visibles sans défilement interne. */}
          <nav aria-label={dict.nav.quickNav} className="mt-4 flex flex-col short:mt-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-nav-fluid font-medium text-encre no-underline short:py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3 short:mt-4">
            <LanguageSwitcher current={lang} label={dict.header.langAria} />
            <ThemeToggle
              label={dict.header.themeAria}
              optionLabels={dict.header.theme}
            />
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-7 short:gap-2 short:pt-4">
            <ActionLink
              href={telHref(site.phone)}
              unavailableLabel={`${dict.header.menuCall} — ${phoneLabel}`}
              className="flex h-12 items-center justify-center gap-2 rounded-[9px] bg-emeraude text-cta-fluid font-medium text-white no-underline dark:bg-accent-strong dark:text-fond"
            >
              {dict.header.menuCall}
            </ActionLink>

            <div className="flex gap-3">
              <ActionLink
                href={whatsappHref(site.whatsapp)}
                unavailableLabel={`WhatsApp — ${whatsappLabel}`}
                className="flex h-11 flex-1 items-center justify-center rounded-[9px] text-sm font-medium text-encre no-underline shadow-[inset_0_0_0_1px_var(--color-encre)]"
              >
                WhatsApp
              </ActionLink>
              <Link
                href={`/${lang}#contact`}
                onClick={() => setMenuOpen(false)}
                className="flex h-11 flex-1 items-center justify-center rounded-[9px] text-sm font-medium text-encre no-underline shadow-[inset_0_0_0_1px_var(--color-encre)]"
              >
                {dict.header.menuRdv}
              </Link>
            </div>

            <p className="mt-1 text-center text-[13px] font-medium text-emeraude dark:text-accent-strong">{phoneLabel}</p>
          </div>
        </div>
      )}
    </>
  );
}
