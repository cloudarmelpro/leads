import Image from "next/image";
import Link from "next/link";

import { ManageCookiesButton } from "@/components/shared/manage-cookies-button";
import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function Footer({ lang, dict }: Props) {
  const nav = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.services, href: `/${lang}#services` },
    { label: dict.nav.about, href: `/${lang}/a-propos` },
    { label: dict.nav.faq, href: `/${lang}#faq` },
    { label: dict.nav.blog, href: `/${lang}/blog` },
    { label: dict.nav.contact, href: `/${lang}/contact` },
  ];

  // Adresse physique retirée : aucun bureau officiel à afficher pour l'instant.
  const coords = [
    site.phone ?? dict.placeholders.phone,
    site.email ?? dict.placeholders.email,
  ];

  return (
    <footer className="px-[clamp(16px,4vw,32px)] pt-[clamp(32px,5vw,56px)] pb-7">
      <div className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[26px] bg-surface px-[clamp(28px,4vw,48px)] pt-[clamp(28px,4vw,48px)] pb-[clamp(56px,9vw,116px)]">
        {/* Contenu au-dessus du filigrane. */}
        <div className="relative z-10">
          <div className="grid grid-cols-1 gap-[clamp(28px,4vw,48px)] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
            {/* Marque + description + réseaux. */}
            <div data-reveal="left" data-reveal-dist="80px">
              {/* Logo (variante inversée en mode sombre). `unoptimized` : wordmark
                  net, l'optimiseur next/image l'adoucirait à cette taille. */}
              <Image
                src="/LOGO.png"
                alt={site.name}
                width={1392}
                height={596}
                unoptimized
                className="h-11 w-auto dark:hidden"
              />
              <Image
                src="/LOGO-dark.png"
                alt={site.name}
                width={1392}
                height={596}
                unoptimized
                className="hidden h-11 w-auto dark:block"
              />
              <p className="mt-4 max-w-[44ch] text-sm leading-[1.65] text-texte2">
                {dict.footer.description}
              </p>
              <div className="mt-6 flex gap-2">
                {site.social.map((network) => (
                  <span
                    key={network.key}
                    title={dict.common.soon}
                    className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-emeraude font-mono text-[13px] font-bold text-white"
                  >
                    {network.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Plan du site. */}
            <div data-reveal="up" data-reveal-delay="120">
              <p className="mb-3.5 text-sm font-bold text-encre">{dict.footer.navTitle}</p>
              <div className="flex flex-col gap-2.5">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[15px] text-texte2 no-underline transition-colors hover:text-encre"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Coordonnées. */}
            <div data-reveal="right" data-reveal-dist="80px" data-reveal-delay="240">
              <p className="mb-3.5 text-sm font-bold text-encre">{dict.footer.coordTitle}</p>
              <div className="flex flex-col gap-2.5">
                {coords.map((line) => (
                  <span key={line} className="font-mono text-[13px] text-texte2">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Barre du bas : copyright à gauche, liens légaux à droite. */}
          <div
            data-reveal="up"
            data-reveal-delay="340"
            className="mt-[clamp(32px,5vw,48px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-ligne pt-[18px]"
          >
            <span className="text-[13px] text-texte2">
              © {new Date().getFullYear()} {site.name} — {dict.footer.rights}
            </span>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Link
                href={`/${lang}/confidentialite`}
                className="text-[13px] text-texte2 no-underline transition-colors hover:text-encre"
              >
                {dict.footer.legal2}
              </Link>
              <ManageCookiesButton
                label={dict.cookies.manage}
                className="cursor-pointer text-[13px] text-texte2 transition-colors hover:text-encre"
              />
            </div>
          </div>
        </div>

        {/* Mot-symbole géant en filigrane, coupé par le bas de la carte.
            `whitespace-nowrap` : « Talgasy Web » (deux mots) doit rester sur UNE
            seule ligne, sinon il se casse en deux et remplit tout le footer. */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[-0.3em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[clamp(56px,13vw,156px)] leading-none font-bold text-encre/[0.035]"
        >
          {site.name}
        </span>
      </div>
    </footer>
  );
}
