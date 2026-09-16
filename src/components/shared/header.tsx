"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { GOUTTIERE } from "@/components/shared/container";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { features, site, telHref, whatsappHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

const BurgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M3 9h18M3 15h18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

/**
 * En-tête de la maquette Accueil : non collant, fond transparent, sans filet.
 * Logo à gauche, navigation centrée, à droite langue · thème · Contact. Sous 900px,
 * navigation et Contact laissent place au bouton menu (44×44) qui ouvre un menu
 * plein écran.
 */
export function Header({ lang, dict }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const phoneLabel = site.phone ?? dict.placeholders.phone;
  const whatsappLabel = site.whatsapp ?? dict.placeholders.whatsapp;

  // Ordre de la maquette : Services, Secteurs, Méthode, FAQ, À propos, Prix, Blog.
  const nav = [
    { label: dict.nav.services, href: `/${lang}#services` },
    { label: dict.nav.sectors, href: `/${lang}#secteurs` },
    { label: dict.nav.method, href: `/${lang}#methode` },
    { label: dict.nav.faq, href: `/${lang}#faq` },
    { label: dict.nav.about, href: `/${lang}/a-propos` },
    ...(features.pricing ? [{ label: dict.nav.pricing, href: `/${lang}/prix` }] : []),
    { label: dict.nav.blog, href: `/${lang}/blog` },
  ];

  // Le menu plein écran ne doit pas laisser la page défiler derrière lui.
  // Focus : à l'ouverture sur « Fermer » ; toute fermeture rend le focus au bouton menu.
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

  const close = () => setMenuOpen(false);
  // Page courante en vert (maquette) : les ancres de l'accueil ne comptent pas.
  const isCurrent = (href: string) => !href.includes("#") && pathname === href;

  const outlined =
    "flex min-h-[48px] items-center justify-center rounded-[12px] border border-contour text-[15px] leading-[20px] font-medium text-encre no-underline transition-colors hover:border-vert hover:text-vert";

  return (
    <>
      <header className={`relative z-[2] flex justify-center bg-transparent pt-[10px] ${GOUTTIERE}`}>
        <div className="relative flex w-full max-w-[1100px] min-h-[44px] flex-wrap items-center gap-[8px] py-[2px]">
          <Link href={`/${lang}`} aria-label={`${site.name} — ${dict.nav.home}`} className="flex min-w-[0px] flex-1 items-center no-underline">
            <Logo height={26} className="relative -top-[2px]" />
          </Link>

          <nav
            aria-label={dict.nav.quickNav}
            className="relative top-px -left-[34px] hidden flex-wrap items-center justify-center gap-[4px] min-[900px]:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={`px-[4px] text-[14px] leading-[20px] font-normal whitespace-nowrap no-underline transition-colors hover:text-vert ${
                  isCurrent(item.href) ? "text-vert" : "text-encre"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-[0px] flex-1 items-center justify-end gap-[8px]">
            <LanguageSwitcher current={lang} label={dict.header.langAria} />
            <ThemeToggle label={dict.header.themeAria} optionLabels={dict.header.theme} />
            <Link
              href={`/${lang}/contact`}
              className="hidden rounded-[9px] bg-vert px-[22px] py-[11px] text-[14px] leading-none font-medium whitespace-nowrap text-sur-vert no-underline transition-colors hover:bg-vert-clair min-[900px]:inline-flex"
            >
              {dict.nav.contact}
            </Link>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={dict.common.openMenu}
              aria-expanded={menuOpen}
              className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-[9px] bg-surface-2 text-encre transition-colors hover:bg-surface-3 min-[900px]:hidden"
            >
              <BurgerIcon />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.quickNav}
          className="fixed inset-[0px] z-[90] flex flex-col overflow-y-auto overscroll-contain bg-fond px-[clamp(16px,5vw,24px)] pt-[18px] pb-[calc(26px+env(safe-area-inset-bottom))] min-[900px]:hidden"
        >
          <div className="flex min-h-[44px] items-center justify-between gap-[12px]">
            <Logo height={26} />
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={dict.common.close}
              className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-[12px] bg-surface-2 text-encre transition-colors hover:bg-surface-3"
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label={dict.nav.quickNav} className="mt-[30px] flex flex-col items-start gap-[8px]">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={`flex min-h-[36px] items-center text-[16px] leading-[24px] font-normal no-underline transition-colors hover:text-vert ${
                  isCurrent(item.href) ? "text-vert" : "text-encre"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-[22px] flex items-center gap-[12px]">
            <LanguageSwitcher current={lang} label={dict.header.langAria} variant="plain" />
            <ThemeToggle label={dict.header.themeAria} optionLabels={dict.header.theme} shape="round" />
          </div>

          <div className="mt-auto flex flex-col gap-[10px] pt-[40px]">
            <ActionLink
              href={telHref(site.phone)}
              unavailableLabel={`${dict.header.menuCall} — ${phoneLabel}`}
              className="flex min-h-[48px] items-center justify-center rounded-[12px] bg-vert text-[15px] leading-[20px] font-medium text-sur-vert no-underline transition-colors hover:bg-vert-clair disabled:cursor-not-allowed disabled:opacity-55"
            >
              {dict.header.menuCall}
            </ActionLink>
            <div className="grid grid-cols-2 gap-[10px]">
              <ActionLink
                href={whatsappHref(site.whatsapp)}
                unavailableLabel={`WhatsApp — ${whatsappLabel}`}
                className={`${outlined} disabled:cursor-not-allowed disabled:opacity-55`}
              >
                WhatsApp
              </ActionLink>
              <Link href={`/${lang}/contact`} onClick={close} className={outlined}>
                {dict.header.menuRdv}
              </Link>
            </div>
            <ActionLink
              href={telHref(site.phone)}
              unavailableLabel={phoneLabel}
              className="flex min-h-[32px] items-center justify-center text-[14px] leading-[20px] font-normal text-vert no-underline"
            >
              {phoneLabel}
            </ActionLink>
          </div>
        </div>
      )}
    </>
  );
}
