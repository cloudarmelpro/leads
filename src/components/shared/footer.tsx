import Link from "next/link";
import type { ComponentType } from "react";

import { CONTENEUR } from "@/components/shared/container";
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button";
import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";
import { Wordmark } from "@/components/shared/wordmark";
import { site, telHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

// Glyphes de marque du design (lucide-react n'expose plus les icônes de marque).
// Tracés repris tels quels de « Talgasy Web - Dark.dc.html ». `currentColor` pour
// hériter du survol (blanc → vert). Les comptes n'existent pas encore → rendus en
// placeholder (span, pas de lien) tant que `site.social` n'a pas d'URL.
const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2M8.34 18.34H5.67V9.75h2.67zM7 8.58a1.55 1.55 0 1 1 0-3.09 1.55 1.55 0 0 1 0 3.09m11.34 9.76h-2.67v-4.18c0-1-.02-2.28-1.39-2.28s-1.6 1.09-1.6 2.21v4.25h-2.66V9.75h2.55v1.17h.04a2.8 2.8 0 0 1 2.52-1.38c2.7 0 3.2 1.77 3.2 4.08z" />
  </svg>
);
type SocialKey = keyof Dictionary["footer"]["social"];
const SOCIAL_ICONS: Record<SocialKey, ComponentType> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
};

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
  const tel = telHref(site.phone);
  const [emailUser, emailDomain] = (site.email ?? "").split("@");
  const coordClass =
    "tap-44 text-[14px] leading-[22px] text-texte2 no-underline transition-colors hover:text-emeraude dark:hover:text-accent-strong";

  return (
    <footer className="relative mx-4 overflow-hidden rounded-t-[28px] bg-surface pt-[clamp(48px,7vw,72px)] pb-7 shadow-soft lg:mx-8 dark:mx-0 dark:rounded-none dark:border-t dark:border-ligne dark:bg-transparent dark:shadow-none">
      <div className={`${CONTENEUR} relative`}>
        {/* Contenu au-dessus du filigrane. */}
        <div className="relative z-10">
          <div className="grid grid-cols-1 gap-[clamp(28px,4vw,48px)] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            {/* Marque + description + réseaux. */}
            <div>
              {/* Logo « Talgasy Web » du design (monogramme + wordmark). */}
              <Wordmark />
              <p className="mt-4 max-w-[340px] text-[14px] leading-[24px] font-light text-texte2">
                {dict.footer.description}
              </p>
              <div className="mt-6 flex items-center gap-3">
                {site.social.map((network) => {
                  const Icon = SOCIAL_ICONS[network.key];
                  return (
                    <span
                      key={network.key}
                      role="img"
                      title={dict.common.soon}
                      aria-label={dict.footer.social[network.key]}
                      className="tap-44 inline-flex text-encre transition-colors hover:text-emeraude dark:hover:text-accent-strong"
                    >
                      <Icon />
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Plan du site. */}
            <div>
              <p className="mb-2.5 text-[16px] leading-[25px] font-medium text-encre">
                {dict.footer.navTitle}
              </p>
              <div className="flex flex-col gap-2.5">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="tap-44 text-[14px] leading-[22px] font-light text-texte2 no-underline transition-colors hover:text-encre"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Coordonnées : liens cliquables (tel:/mailto:) quand la donnée existe,
                sinon simple texte placeholder. Renforce le signal de contact (NAP). */}
            <div>
              <p className="mb-2.5 text-[16px] leading-[25px] font-medium text-encre">
                {dict.footer.coordTitle}
              </p>
              <div className="flex flex-col gap-2.5">
                {tel ? (
                  <a href={tel} className={coordClass}>
                    {site.phone}
                  </a>
                ) : (
                  <span className={coordClass}>{dict.placeholders.phone}</span>
                )}
                {emailUser && emailDomain ? (
                  <ObfuscatedEmail user={emailUser} domain={emailDomain} className={coordClass} />
                ) : (
                  <span className={coordClass}>{dict.placeholders.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Barre du bas : copyright à gauche, liens légaux à droite.
              `data-fab-avoid` : le bouton d'appel flottant se masque quand cette barre
              est visible, sinon il recouvre « Gérer mes témoins » (voir floating-contact). */}
          <div
            data-fab-avoid
            className="mt-[clamp(48px,8vw,88px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-ligne pt-6"
          >
            <span className="text-[14px] leading-[25px] font-light text-texte2">
              © {new Date().getFullYear()} {site.name} — {dict.footer.rights}
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <Link
                href={`/${lang}/confidentialite`}
                className="tap-44 text-[14px] leading-[22px] font-light text-texte2 no-underline transition-colors hover:text-encre"
              >
                {dict.footer.legal2}
              </Link>
              <ManageCookiesButton
                label={dict.cookies.manage}
                className="tap-44 cursor-pointer text-[14px] leading-[22px] font-light text-texte2 transition-colors hover:text-encre"
              />
            </div>
          </div>
        </div>

        {/* Mot-symbole géant en filigrane, coupé par le bas de la carte.
            `whitespace-nowrap` : « Talgasy Web » (deux mots) doit rester sur UNE
            seule ligne, sinon il se casse en deux et remplit tout le footer. */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[-0.3em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[clamp(56px,14.4vw,168px)] leading-none font-light tracking-[-0.02em] text-encre/[0.03]"
        >
          {site.name}
        </span>
      </div>
    </footer>
  );
}
