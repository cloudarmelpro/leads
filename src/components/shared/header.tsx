"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { site, telHref, whatsappHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

function Wordmark() {
  // Logotype texte façon « MDCC » : gras, sans icône, lettres légèrement espacées.
  // Couleur héritée du parent.
  return (
    <span className="font-display text-[22px] uppercase tracking-[0.12em]">
      {site.name}
    </span>
  );
}

export function Header({ lang, dict }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const phoneLabel = site.phone ?? dict.placeholders.phone;
  const whatsappLabel = site.whatsapp ?? dict.placeholders.whatsapp;

  // D'abord les ancres de l'accueil, puis les pages dédiées (à la fin).
  const nav = [
    { label: dict.nav.services, href: `/${lang}#services` },
    { label: dict.nav.method, href: `/${lang}#methode` },
    { label: dict.nav.faq, href: `/${lang}#faq` },
    { label: dict.nav.about, href: `/${lang}/a-propos` },
    { label: dict.nav.blog, href: `/${lang}/blog` },
    { label: dict.nav.contact, href: `/${lang}/contact` },
  ];

  // Le menu plein écran ne doit pas laisser la page défiler derrière lui.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Barre transparente, dans le flux (non collante) — comme la référence.
          Le module de contact flottant assure l'appel toujours accessible au défilement. */}
      {/* Marge horizontale sur le <header>, pas sur le conteneur max-w : c'est le
          patron des sections. La mettre à l'intérieur décalerait le logo de 32px. */}
      <header className="w-full px-[clamp(16px,4vw,32px)]">
        {/* Logo + nav groupés à gauche (alignés au logotype) ; actions à droite. */}
        <div className="mx-auto flex min-h-17 max-w-290 items-center py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}`}
              data-reveal="left"
              data-reveal-dist="24px"
              data-reveal-duration="700"
              className="text-encre no-underline"
            >
              <Wordmark />
            </Link>

            <nav
              aria-label={dict.nav.home}
              className="hidden items-center gap-4 md:flex"
            >
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                data-reveal="up"
                data-reveal-dist="16px"
                data-reveal-delay={`${100 + index * 70}`}
                data-reveal-duration="700"
                className="relative whitespace-nowrap text-sm font-medium text-texte2 no-underline transition-colors hover:text-encre after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:rounded-full after:bg-encre after:transition-[width] after:duration-300 motion-reduce:after:transition-none hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
            </nav>
          </div>

          <div
            data-reveal="right"
            data-reveal-dist="24px"
            data-reveal-delay="120"
            data-reveal-duration="700"
            className="ml-auto flex items-center gap-3"
          >
            <ThemeToggle
              label={dict.header.themeAria}
              optionLabels={dict.header.theme}
            />
            <LanguageSwitcher current={lang} label={dict.header.langAria} />

            {/* Masqué sous md : le module flottant porte déjà l'appel, en zone du pouce. */}
            <ActionLink
              href={telHref(site.phone)}
              unavailableLabel={`${dict.header.call} — ${phoneLabel}`}
              className="hidden h-10 shrink-0 items-center gap-2 rounded-xl bg-emeraude px-3.5 text-sm text-white no-underline hover:bg-emeraude/90 md:inline-flex"
            >
              <Phone size={15} strokeWidth={2.2} aria-hidden />
              <span>{dict.header.call}</span>
            </ActionLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={dict.common.openMenu}
              aria-expanded={menuOpen}
              className="inline-flex h-8 w-8 items-center justify-center cursor-pointer rounded-xl bg-surface text-encre md:hidden"
            >
              <Menu size={16} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.home}
          className="animate-fadein fixed inset-0 z-100 flex flex-col overflow-auto bg-sapin px-[clamp(16px,5vw,28px)] pt-4 pb-[calc(20px+env(safe-area-inset-bottom))] text-white"
        >
          <div className="flex min-h-14 items-center justify-between">
            <Wordmark />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={dict.common.close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-none bg-white/10 text-white"
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          <nav aria-label={dict.nav.home} className="mt-5 flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/15 py-3.5 font-display text-xl text-white no-underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LanguageSwitcher current={lang} label={dict.header.langAria} variant="dark" />
            <ThemeToggle
              label={dict.header.themeAria}
              optionLabels={dict.header.theme}
              variant="dark"
            />
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-7">
            <ActionLink
              href={telHref(site.phone)}
              unavailableLabel={`${dict.header.menuCall} — ${phoneLabel}`}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white font-display text-[15px] text-sapin no-underline"
            >
              {dict.header.menuCall}
            </ActionLink>

            <div className="flex gap-3">
              <ActionLink
                href={whatsappHref(site.whatsapp)}
                unavailableLabel={`WhatsApp — ${whatsappLabel}`}
                className="flex h-11 flex-1 items-center justify-center rounded-xl border-[1.5px] border-white/50 text-sm font-medium text-white no-underline"
              >
                WhatsApp
              </ActionLink>
              <Link
                href={`/${lang}#contact`}
                onClick={() => setMenuOpen(false)}
                className="flex h-11 flex-1 items-center justify-center rounded-xl border-[1.5px] border-white/50 text-sm font-medium text-white no-underline"
              >
                {dict.header.menuRdv}
              </Link>
            </div>

            <p className="mt-1 text-center font-mono text-[13px] text-lueur">{phoneLabel}</p>
          </div>
        </div>
      )}
    </>
  );
}
