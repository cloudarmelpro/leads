"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { LangMenu } from "@/components/shared/lang-menu";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { features, site, telHref, whatsappHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Pick<Dictionary, "nav" | "header" | "common" | "placeholders"> };

// Glyphes de la maquette (tracés au trait, 24×24), repris à l'identique.
const glyph = (d: ReactNode, size = 14, strokeWidth = 2) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);
const HOME = <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />;
const INFO = (
  <>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 11v5M12 8h.01" />
  </>
);
const TAG = (
  <>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1" />
  </>
);
const BOOK = (
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
    <path d="M8 7h8M8 11h6" />
  </>
);

// Ancres des sections de l'accueil, par clé du dictionnaire (`nav.homeMenu[].key`).
type SectionKey = "services" | "sectors" | "method" | "faq";
const SECTION_IDS: Record<SectionKey, string> = { services: "services", sectors: "secteurs", method: "methode", faq: "faq" };
const SECTION_GLYPHS: Record<SectionKey, ReactNode> = {
  services: (
    <>
      <rect x="2.5" y="3.5" width="19" height="14" rx="2.5" />
      <path d="M8 21h8M12 17.5V21" />
    </>
  ),
  sectors: (
    <>
      <path d="M20 10.5c0 6-8 11.5-8 11.5s-8-5.5-8-11.5a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.2" r="2.8" />
    </>
  ),
  method: <path d="m3 7 2 2 4-4M3 15l2 2 4-4M13 8h8M13 16h8" />,
  faq: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.3 9.2a2.8 2.8 0 1 1 4.2 2.5c-.8.5-1.5 1-1.5 2.1" />
      <path d="M12 17.2h.01" />
    </>
  ),
};

const EASE = "transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]";
// Lien de la barre : pastille de 32px ; le lien courant a le fond clair, le texte blanc et son glyphe en vert.
const pill = (current: boolean) =>
  `inline-flex h-[32px] items-center gap-[6px] rounded-[8px] px-[13px] text-[13.5px] leading-[20px] whitespace-nowrap no-underline ${EASE} ${
    current ? "bg-pastille font-medium text-encre [&>svg:first-child]:text-vert" : "font-normal text-lien-barre hover:bg-pastille hover:text-encre [&>svg:first-child]:text-texte2"
  }`;

// Hauteur de l'en-tête fixe : 24px en haut, 40px de barre, 14px en bas.
const HEADER_H = "h-[78px]";
const BAR_MIDDLE = 44;

/**
 * En-tête fixe (maquette Accueil, 2026-09-24) : transparent, sans fond ni filet même au
 * défilement (demande du client ; un fond en verre a été essayé puis retiré). Logo à
 * gauche, barre de navigation en verre centrée, à droite langue · thème · Contact. Sous 1100px, barre et Contact laissent place au bouton menu (40×40) qui ouvre
 * un menu plein écran. Hors accueil, une cale de sa hauteur évite qu'il recouvre le haut
 * des pages intérieures ; sur l'accueil, le hero plein écran passe dessous.
 */
export function Header({ lang, dict }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const phoneLabel = site.phone ?? dict.placeholders.phone;
  const whatsappLabel = site.whatsapp ?? dict.placeholders.whatsapp;

  const home = `/${lang}`;
  const isHome = pathname === home;
  const sections = dict.nav.homeMenu.map((item) => {
    const key = item.key as SectionKey;
    return { key, label: dict.nav[key], desc: item.desc, href: `${home}#${SECTION_IDS[key]}` };
  });
  const nav = [
    { label: dict.nav.about, href: `/${lang}/a-propos`, glyph: INFO },
    ...(features.pricing ? [{ label: dict.nav.pricing, href: `/${lang}/prix`, glyph: TAG }] : []),
    { label: dict.nav.blog, href: `/${lang}/blog`, glyph: BOOK },
  ];
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

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

  // En thème clair, la barre prend les couleurs du sombre tant qu'elle survole une zone
  // sombre (`data-header-sombre`, le hero 3D) : sinon logo et liens y seraient illisibles.
  const [overDark, setOverDark] = useState(false);
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-header-sombre]"));
    let raf = 0;
    const check = () => {
      raf = 0;
      setOverDark(
        zones.some((zone) => {
          const r = zone.getBoundingClientRect();
          return r.top <= BAR_MIDDLE && r.bottom >= BAR_MIDDLE;
        }),
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const close = () => setMenuOpen(false);

  const outlined = `flex min-h-[48px] items-center justify-center rounded-[8px] border border-contour text-[15px] leading-[20px] font-normal text-encre no-underline ${EASE} hover:border-vert hover:text-vert`;

  return (
    <>
      <header className={`${overDark ? "dark" : ""} pointer-events-none fixed inset-x-[0px] top-[0px] z-[60] flex justify-center px-[calc(10px+clamp(18px,5vw,72px))] pt-[24px] pb-[14px] max-[359px]:px-[16px]`}>
        <div className="pointer-events-auto relative flex w-full max-w-[1400px] items-center justify-between gap-[12px]">
          <Link href={home} aria-label={`${site.name} — ${dict.nav.home}`} className="flex h-[40px] shrink-0 items-center no-underline">
            <Logo height={24} />
          </Link>

          <nav
            aria-label={dict.nav.quickNav}
            className="absolute top-[0px] left-1/2 hidden h-[40px] -translate-x-1/2 items-center gap-[2px] rounded-[8px] bg-verre px-[4px] shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] min-[1100px]:flex"
          >
            <div className="group relative">
              <Link href={home} aria-current={isHome ? "page" : undefined} className={pill(isHome)}>
                {glyph(HOME)}
                {dict.nav.home}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="relative top-[1px] transition-transform duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-focus-within:rotate-180 group-hover:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
              {/* Panneau au survol ou au focus clavier. Le `pt` remplace une marge : le
                  survol ne se perd pas entre le lien et le panneau. */}
              <div className="invisible absolute top-full left-[-8px] z-[50] pt-[16px] group-focus-within:visible group-hover:visible">
                <ul
                  aria-label={dict.nav.homeMenuAria}
                  className="m-[0px] hidden w-[520px] list-none grid-cols-2 gap-[2px] rounded-[16px] bg-surface p-[8px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),0_26px_60px_rgba(0,0,0,0.5)] group-focus-within:grid group-focus-within:[animation:tw-menu-in_200ms_cubic-bezier(0.22,1,0.36,1)_both] group-hover:grid group-hover:[animation:tw-menu-in_200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                >
                  {sections.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={`flex items-start gap-[11px] rounded-[12px] px-[13px] py-[12px] no-underline ${EASE} hover:bg-surface-2`}>
                        <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-vert shadow-[inset_0_0_0_1px_var(--color-contour)]">
                          {glyph(SECTION_GLYPHS[item.key], 16, 1.7)}
                        </span>
                        <span className="flex min-w-[0px] flex-col gap-[2px]">
                          <span className="text-[14px] leading-[20px] font-medium text-encre">{item.label}</span>
                          <span className="text-[12.5px] leading-[18px] font-normal text-texte2 text-pretty">{item.desc}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined} className={pill(isCurrent(item.href))}>
                {glyph(item.glyph)}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-[8px] max-[359px]:gap-[6px]">
            <LangMenu current={lang} label={dict.header.langAria} />
            <span className="contents max-[359px]:hidden">
              <ThemeToggle label={dict.header.themeAria} optionLabels={dict.header.theme} />
            </span>
            <Link
              href={`/${lang}/contact`}
              className={`hidden h-[40px] items-center rounded-[8px] bg-vert px-[18px] text-[13.5px] leading-[1] font-medium whitespace-nowrap text-sur-vert no-underline ${EASE} hover:bg-vert-clair min-[1100px]:flex`}
            >
              {dict.nav.contact}
            </Link>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={dict.common.openMenu}
              aria-expanded={menuOpen}
              className={`tap-44 flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[8px] bg-verre text-encre shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] ${EASE} hover:bg-verre-fort min-[1100px]:hidden`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M3 9h18M3 15h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {!isHome && <div aria-hidden className={HEADER_H} />}

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.quickNav}
          className="fixed inset-[0px] z-[90] flex flex-col overflow-y-auto overscroll-contain bg-fond px-[clamp(16px,5vw,24px)] pt-[18px] pb-[calc(26px+env(safe-area-inset-bottom))] min-[1100px]:hidden"
        >
          <div className="flex min-h-[44px] items-center justify-between gap-[12px]">
            <Logo height={26} />
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={dict.common.close}
              className={`flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-[8px] bg-surface-2 text-encre ${EASE} hover:bg-surface-3`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <nav aria-label={dict.nav.quickNav} className="mt-[30px] flex flex-col items-start gap-[8px]">
            <Link
              href={home}
              onClick={close}
              aria-current={isHome ? "page" : undefined}
              className={`flex min-h-[36px] items-center text-[16px] leading-[24px] font-normal no-underline ${EASE} hover:text-vert ${isHome ? "text-vert" : "text-encre"}`}
            >
              {dict.nav.home}
            </Link>
            {/* Sections de l'accueil, en retrait sous Accueil. */}
            {sections.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} className={`flex min-h-[32px] items-center pl-[16px] text-[15px] leading-[22px] font-normal text-texte2 no-underline ${EASE} hover:text-vert`}>
                {item.label}
              </Link>
            ))}
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={`flex min-h-[36px] items-center text-[16px] leading-[24px] font-normal no-underline ${EASE} hover:text-vert ${isCurrent(item.href) ? "text-vert" : "text-encre"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-[22px] flex items-center gap-[12px]">
            <LangMenu current={lang} label={dict.header.langAria} variant="plain" />
            <ThemeToggle label={dict.header.themeAria} optionLabels={dict.header.theme} variant="solid" />
          </div>

          <div className="mt-auto flex flex-col gap-[10px] pt-[40px]">
            <ActionLink
              href={telHref(site.phone)}
              unavailableLabel={`${dict.header.menuCall} — ${phoneLabel}`}
              className={`flex min-h-[48px] items-center justify-center rounded-[8px] bg-vert text-[15px] leading-[20px] font-normal text-sur-vert no-underline ${EASE} hover:bg-vert-clair disabled:cursor-not-allowed disabled:opacity-55`}
            >
              {dict.header.menuCall}
            </ActionLink>
            <div className="grid grid-cols-2 gap-[10px]">
              <ActionLink href={whatsappHref(site.whatsapp)} unavailableLabel={`WhatsApp — ${whatsappLabel}`} newTab className={`${outlined} disabled:cursor-not-allowed disabled:opacity-55`}>
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
